<template>
    <f7-page :page-content="false">

        <f7-navbar :title="curTabTitle">
            <f7-nav-right v-if="showTabs">
                <f7-link v-if="curTab == 'home'" href="/chart/mystats/">
                   <!-- <img :src="myAvatar" alt="myAvatar" class="home-avatar">
                    <img :src="arrow" style="width:7px; height:10px; padding-left:5px">-->
                    今日工作
                </f7-link>
                <!--<f7-link v-if="curTab == 'message'" icon-size="20px" icon-fa="trash-o" @click="clear()"></f7-link>-->
                <f7-link v-if="curTab == 'statistic' && isSuperAdminOrDepartmentAdmin" href="#" @click="jumpTo('/report/selectdepartment/')">编辑下属模板</f7-link>
            </f7-nav-right>
        </f7-navbar>

        <template v-if="showTabs">

            <f7-toolbar tabbar :bottom-md="true" color="white">
                <f7-link class="tab-link-home" tab-link="#tab-home" tab-link-active>
                    <div>
                        <img class="tab-icon tab-icon-inactive" alt="icon" :src="tab_icon.home">
                        <img class="tab-icon tab-icon-active" alt="icon" :src="tab_icon.home_active">
                        <div class="tab-text">首页</div>
                    </div>
                </f7-link>
                <f7-link tab-link="#tab-message">
                    <div class="tab-icon-container">
                        <div v-if="unreadCount" class="unRead">{{unreadCount}}</div>
                        <img class="tab-icon tab-icon-inactive" alt="icon" :src="tab_icon.message">
                        <img class="tab-icon tab-icon-active" alt="icon" :src="tab_icon.message_active">
                        <div class="tab-text">消息</div>
                        <span v-if="messageNumber > 0" class="badge color-red">{{messageNumber}}</span>
                    </div>
                </f7-link>
                <f7-link tab-link="#tab-statistic">
                    <div>
                        <img class="tab-icon tab-icon-inactive" alt="icon" :src="tab_icon.statistic">
                        <img class="tab-icon tab-icon-active" alt="icon" :src="tab_icon.statistic_active">
                        <div class="tab-text">统计</div>
                    </div>
                </f7-link>
                <f7-link tab-link="#tab-preference">
                    <div>
                        <img class="tab-icon tab-icon-inactive" alt="icon" :src="tab_icon.preference">
                        <img class="tab-icon tab-icon-active" alt="icon" :src="tab_icon.preference_active">
                        <div class="tab-text">设置</div>
                    </div>
                </f7-link>
            </f7-toolbar>

            <f7-tabs>
                <f7-tab id="tab-home" class="page-content" tab-active @tab:show="onTabShow">
                    <home></home>
                </f7-tab>
                <f7-tab id="tab-message" class="page-content" @tab:show="onTabShow">
                    <message ref="message"></message>
                </f7-tab>
                <f7-tab id="tab-statistic" class="page-content" @tab:show="onTabShow">
                    <statistic ref="statistic"></statistic>
                </f7-tab>
                <f7-tab id="tab-preference" class="page-content" @tab:show="onTabShow">
                    <preference></preference>
                </f7-tab>
            </f7-tabs>


        </template>

    </f7-page>

</template>

<style scoped>
    .unRead{
        position: absolute;
        top: 0px;
        right: -10px;
        border-radius: 20px 20px 20px 20px;
        background-color: red;
        color: white;
        height: 12px;
        font-size: 12px;
        line-height: 12px;
        padding: 3px;
        z-index: 1;
        min-width: 12px;
        text-align: center;
    }
.home-avatar {
    vertical-align: middle;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 2px solid white;
}
.tab-icon {
    width: 25px;
    height: 25px;
    display: block;
    padding-top: 3px;
}
.tab-text {
    font-size: 11px;
    line-height: 20px;
    font-weight: bold;
    text-align: center;
}

.tab-link .tab-text {
    color: #A8A8A8;
}
.tab-link.tab-link-active .tab-text {
    color: #01B38B;
}

.tab-icon.tab-icon-active {
    display: none;
}

.tab-link.tab-link-active .tab-icon.tab-icon-inactive {
    display: none;
}

.tab-link.tab-link-active .tab-icon.tab-icon-active {
    display: block;
}

.tab-icon-container {
    position: relative;
}

.tab-icon-container .badge {
    position: absolute;
    top: 1px;
    right: -7px;
    display: block;
}
</style>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { setTimeout, setInterval, clearInterval } from 'timers';
import { refresh } from 'lib/aliyun';
import { loadMap } from 'lib/amap';
import axios from 'axios';

import home from 'components/home.vue';
import message from 'components/message.vue';
import statistic from 'components/report/statisticsindex.vue';
import preference from 'components/preference.vue';
import departmentpicker from 'gadget/departmentpicker.vue';
import dateFormat from 'lib/dateformat.js';
import moment from 'moment';

export default {
    components: {
        home, message, statistic, preference,departmentpicker
    },

    data() {
        return {
            curTabTitle: '首页',
            curTab: 'home',
            arrow: require('assets/images/arrow_small_head_portrait_gray@2x.png'),

            tab_icon: {
                home: require('assets/images/icon_homepage_gray@2x.png'),
                home_active: require('assets/images/icon_homepage_green@2x.png'),
                message: require('assets/images/icon_message_gray@2x.png'),
                message_active: require('assets/images/icon_message_green@2x.png'),
                statistic: require('assets/images/icon_statistics_gray@2x.png'),
                statistic_active: require('assets/images/icon_statistics_green@2x.png'),
                preference: require('assets/images/icon_set_gray@2x.png'),
                preference_active: require('assets/images/icon_set_green@2x.png')
            },
            departmentpickerShow:false,
            departmentpickerInit:false,

        }
    },
    computed: {
        ...mapGetters([
            'myAvatar',
            'isAuth',
            'myProfile',
            'superAdmin',
            'userPermissions',
            'myCompany',
            'companyName',
            'myCompanyLife',
            'personnel',
            'notification',
            'myUserId',
            'isDepartmentAdmin',
            'userDepartment',
            'unreadCount'
        ]),

        isSuperAdminOrDepartmentAdmin(){
            if (this.myProfile._id){
                return this.isDepartmentAdmin(this.myProfile._id) ||(this.superAdmin && this.superAdmin._id == this.myProfile._id);
            }
        },

        showTabs() {
            return this.personnel.length && this.companyName;
        }
    },

    mounted() {
        let self = this;
        if (self.deviceCheck() && !window.hawkinit) {
            $dialog.preloader('正在更新数据');

            self.initialize().then(() => {
                self.enableTrace();
                self.getNotification();
                $dialog.close();
                self.showReminder();
                self.mandatoryUpdate();

                console.log('init successfully');

            }).catch((err) => {
                console.error(err);
                $dialog.close();
                $alert('无法更新数据，请与管理员联系', '更新失败');
            });
        }
    },

    methods: {
        ...mapActions({
            'logout': 'LOGOUT',
            'save': 'SAVE_USER_KEY',
            'new_notification': 'GET_NOTIFICATION',
            'load_company': 'LOAD_COM',
            'load_personnel': 'LOAD_PERSONNEL',
            'load_trace': 'LOAD_MY_TRACE',
            'trace': 'ENABLE_TRACE',
            'load_company_life': 'LOAD_COMPANY_LIFE',
        }),

        getNotification() {
            if (process.env.NODE_ENV == 'production') {
                setInterval(this.new_notification, 60000/*ms*/);
            }
        },

        enableTrace() {
            console.log('tracing user position');
            this.trace();
        },

        deviceCheck() {
            let dl = this.myProfile.deviceLock;

            if (dl && device && device.uuid) {
                if (dl == '*') {
                    console.log('locking user to current device');
                    this.save({ deviceLock: device.uuid });

                } else if (dl == device.uuid) {
                    // ok, on the same lock-in device
                } else if (dl != device.uuid) {
                    $alert('您不允许在本手机上登录。请联系管理员解除绑定。', '登录失败', () => {
                        this.logout();
                    });
                    return false;
                }
            }
            return true;
        },

        messageNumber() {
            return this.notification && this.notification.length || 0;
        },

        clear() {
            this.$refs.message.clear();
        },

        jumpTo(path, properties) {
            this.$f7router.navigate(path, {
                props: properties
            });
        },

        onTabShow() {

            let t = $(".view-main .tab-active").attr('id').split('-').pop();
            if (t == 'message'){
                this.$refs.message.load()
            }
            switch (t) {
                case 'home': this.curTabTitle = '工作台'; break;
                case 'message': this.curTabTitle = '消息中心'; break;
                case 'statistic': this.curTabTitle = '汇报统计'; break;
                case 'preference': this.curTabTitle = '设置'; break;
            }

            this.curTab = t;
            if (t == 'statistic'){
                this.$nextTick(function () {
                    this.$refs.statistic.initStatistics()
                })
            }
        },

        initialize() {
            if (window.hawkinit) return;

            console.info('hawk initializing...');
            window.hawkinit = true;

            return Promise.all([
                this.load_company(),
                this.load_personnel(),
                this.load_trace(),
                this.load_company_life(),

                loadMap(),
                refresh()
            ]).then(() => {
                console.info('hawk initialized successfully');

                //alert("登录完成："+window.registrationID)
                this.pushPlugin();
            });
        },

        pushPlugin(){
            if (window.registrationID){
                axios.put('/api/notification/uploadRegistrationID' , {"registrationID":window.registrationID}).catch(error => {
                    console.error(error);
                })
            }
            let t1 = setInterval(()=>{
                console.log("uploadRegistrationID", window.xgPushToken)
                if(window.xgPushToken){
                    axios.put('/api/notification/uploadRegistrationID' , {"registrationID":window.xgPushToken, pushMode:'xgpush'}).catch(error => {
                        console.error(error);
                    })
                    clearInterval(t1)
                }
            },5000)
    },

        showReminder(){
            let life = this.myCompanyLife;
            if (!life._id){
                return
            }

            if (!this.superAdmin || this.superAdmin._id != this.myProfile._id) {
                if (life.status == '已过期' || new Date(life.validDate) < new Date()){
                    $alert("抱歉，贵公司的账号已过期，为了避免影响正常工作，请联系公司管理员进行续费。","温馨提示",()=>{
                    })
                    this.logout();
                    self.$f7.views.main.router.navigate('/login/');
                }
                return;

            } else {
                if (life.status == '已过期' || new Date(life.validDate) < new Date()){
                    $alert("抱歉，贵公司的账号已过期，为了避免影响正常工作，请进行续费","温馨提示",()=>{
                        this.$f7router.navigate("/trade/info");
                    })
                    return;
                }
                if (life.residueDays < 7){
                    let status = life.status == '试用' ? '试用期' :'使用期';
                    $confirm("您的"+status+"还有"+(life.residueDays+1)+"天，请及时续费，避免影响正常使用","温馨提示",()=>{
                        this.$f7router.navigate("/trade/info");
                    })
                    return;
                }

            }
            if (life.number > life.nextPeriodNumber &&   moment(life.nearestValidDate).diff(new Date(),'days') < 7) {
                axios.get('api/user/count?q=' + JSON.stringify({})).then(rep => {
                    let num = rep.data;
                    if (num && num > life.nextPeriodNumber){
                        let exceed = num - life.nextPeriodNumber;
                        $alert("您有"+exceed+"个账户在"+dateFormat(life.nearestValidDate,'yyyy年mm月dd日')+"过期，请您手动停用"+(exceed)+"个员工账户或增加使用名额。如未处理系统将在到期时随机停用"+(life.number - life.nextPeriodNumber)+"个账户","温馨提示",()=>{
                            this.$f7router.navigate("/trade/info");
                        })
                    }
                }).catch(err => {
                    console.error(err);
                });

            }

        },

        mandatoryUpdate() {
            try {
                var target = "_system";
                var options = "location=yes,hidden=yes";
                let appUpdata = function (name) {

                    return function (dialog, e) {
                        dialog.close();
                        if (name === "下次再说") {
                        } else if (name === "升级") {
                            cordova.InAppBrowser.open("https://itunes.apple.com/cn/app/id1448093868", target, options);
                        } else if (name === "退出应用") {
                            navigator.app.exitApp();
                        }
                    }

                }
                if (device.platform === "Android") {  //android
                    // 设置接口地址
                    // isWifiOnly 默认 false
                    update.init(CONFIG.server.tradeApiUrl+'/findLatestVersion',false,CONFIG.versionCode);
                    // 手动检查
                     update.manualCheck();
                    // 自动检查
                    update.check();
                } else if (device.platform === "iOS") {  //ios
                    axios.get("http://api.sanfanerp.com/findLatestVersion?versionCode="+CONFIG.versionCode).then(res=>{
                        var force = res.data.isForce;
                        if (res.data.hasUpdate) {
                            if (force) {
                                $dialog.create({
                                    title: '强制更新: ' + res.data.versionName,
                                    text: res.data.updateContent,
                                    buttons: [
                                        {text: '升级', onClick: appUpdata('升级')},
                                        {text: '退出应用', onClick: appUpdata('退出应用')},
                                    ],
                                    verticalButtons: true,
                                }).open();
                            } else {
                                $dialog.create({
                                    title: '版本更新: ' + res.data.versionName,
                                    text: res.data.updateContent,
                                    buttons: [
                                        {text: '升级', onClick: appUpdata('升级')},
                                        {text: '下次再说', onClick: appUpdata('下次再说')},
                                    ],
                                    verticalButtons: true,
                                }).open();
                            }
                        }
                    }).catch(err=>{
                        console.error(err)
                    })
                }
            }catch (e) {
                console.error(e);
            }
        }
    }
}
</script>
