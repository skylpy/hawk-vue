<template>
    <f7-page>
        <f7-navbar title="关于我们" back-link></f7-navbar>

        <f7-block style="text-align: center">
            <div>
                <img :src="icon" alt="icon">
                <p>软件版本: {{oldVersion}}</p>
            </div>

        </f7-block>

        <f7-list>
            <f7-list-item
                title="官方网站"
            >
                <f7-link slot="after" href="http://www.sanfanerp.com">www.sanfanerp.com</f7-link>
            </f7-list-item>

            <f7-list-item
                title="服务协议"
                link="#"
                @click="$f7.popup.open('#about-protocol')"
            ></f7-list-item>
            <f7-list-item
                    title="上门服务"
                    link="#"
                    @click="visitingService"
            ></f7-list-item>
            <f7-list-item
                    title="版本更新"
                    :after='this.newVersion'
                    link="#"
                    @click="updataApp()"
            ></f7-list-item>
            <f7-list-item
                title="销售热线"
                after="400-688-1280"
                @click="phonecall('4006881280')"
            ></f7-list-item>

            <f7-list-item
                title="系统日志"
                link="#"
                @click="$f7.popup.open('#about-logs')"
            ></f7-list-item>
        </f7-list>

    <f7-popup id="about-protocol">
        <protocol></protocol>
    </f7-popup>

    <f7-popup id="about-logs">
        <f7-page>
            <f7-navbar title="系统日志">
            <f7-nav-right>
                <f7-link @click="upload">上传日志</f7-link>
                <f7-link popup-close>关闭</f7-link>
            </f7-nav-right>
            </f7-navbar>

            <f7-block>
                <span v-for="(i, index) in sysLog()" :key="index">{{i}} <br></span>
            </f7-block>
        </f7-page>
    </f7-popup>

    </f7-page>
</template>

<script>
import {mapGetters} from 'vuex';
import protocol from 'gadget/protocol.vue';
import {call} from 'lib/phonecall';
import axios from 'axios';

export default {
    components: {
        protocol
    },

    data() {
        return {
            icon: require('assets/images/icon.png'),
            oldVersion: CONFIG.version,
            hasUpdate:false,
            content:'',
            newVersion:'',
            isForce:false,
        }
    },

    computed: {
        ...mapGetters([
            'myProfile',
            'myToken'
        ])
    },

    created() {

        axios.get(CONFIG.server.tradeApiUrl+"/findLatestVersion?versionCode="+CONFIG.versionCode).then(res=>{
            // debugger
            console.log(this.oldVersion)
            this.newVersion=res.data.versionName;
            this.hasUpdate=res.data.hasUpdate;
            this.content=res.data.updateContent;
            this.isForce=res.data.isForce;

        }).catch(err=>{
            err
        })
    },

    methods: {
        // 点击更新
        updataApp(){
            var target = "_system";
            var options = "location=yes,hidden=yes";
            let appUpdata = function (name) {

                return function(dialog, e) {
                    dialog.close();
                    if (name === "下次再说") {

                    }else if (name === "升级") {
                        cordova.InAppBrowser.open("https://itunes.apple.com/cn/app/id1448093868", target, options);
                    } else if (name === "退出应用") {
                        navigator.app.exitApp();
                    }
                }

            }

            if (device.platform === "Android") {
                // 设置接口地址
                // isWifiOnly 默认 false
                update.init(CONFIG.server.tradeApiUrl+'/findLatestVersion',false,CONFIG.versionCode);


                // 手动检查
                update.manualCheck();

                // 自动检查
                update.check();

            } else if (device.platform === "iOS") {
                if (this.hasUpdate) {  //是否有更新
                    if (this.isForce) {
                        $dialog.create({
                            title: '更新版本: ' + this.newVersion,
                            text: this.content,
                            buttons: [
                                {text: '升级', onClick: appUpdata('升级')},
                                {text: '退出应用', onClick: appUpdata('退出应用')},
                            ],
                            verticalButtons: true,
                        }).open();
                    } else {
                        $dialog.create({
                            title: '更新版本: ' + this.newVersion,
                            text: this.content,
                            buttons: [
                                {text: '升级', onClick: appUpdata('升级')},
                                {text: '下次再说', onClick: appUpdata('下次再说')},
                            ],
                            verticalButtons: true,
                        }).open();
                    }
                } else {
                    $alert('没有新版本');
                }
            }
        },
        phonecall(n) {
            if (!n) {
                $alert('无效的电话号码', '操作错误');
                return;
            }
            return call(n);
        },

        sysLog() {
            if (!window.keeplog) {
                return ['没有系统日志'];
            }

            let log = [];
            return log.concat(window.keeplogold, [['latest', '--------------', (new Date()).toHawkString()]], window.keeplog);
        },

        upload() {
            if (!window.keeplog) {
                $alert('没有系统日志可以上传', '操作错误');
                return;
            };

            $preloader.show();

            let data = this.sysLog().slice(0);
            data.push([
                'SYS',
                'version = ' + this.version,
                'build = ' + process.env.NODE_ENV,
                'axios base = ' + axios.defaults.baseURL,
                'user profile = ' + JSON.stringify(this.myProfile),
                'token = ' + this.myToken
            ]);

            let payload = {
                user: this.myProfile._id,
                phone: this.myProfile.phone,
                version: this.version,
                records: data
            };

            axios.post('api/logs', payload).then(resp => {
                $preloader.hide();
                $popup.close('#about-logs');
            }).catch(error => {
                $preloader.hide();
                console.error(error);
                $alert('无法上传数据，请稍后再试', '操作错误');
            })
        },

        visitingService () {
            this.$f7router.navigate('/software/visitingService/')
        }
    }
}
</script>
