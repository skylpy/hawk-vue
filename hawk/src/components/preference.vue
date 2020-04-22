<template>
    <div class="preference">
        <div style="background-color: white;width: 100%;overflow: hidden">
            <div class="header" :style="{'background':'url('+infoImg+')','background-size':'100% 100%'}">
                <div class="pay-button" v-if="IamSuperAdmin" @click="jumpTo('/trade/info')">查看企业套餐 ></div>
                <div class="self-info">
                    <img slot="media" :src="myAvatar"/>
                    <div class="info">
                        <div class="info-name">{{myProfile.name}}
                            <span class="info-phone">{{myProfile.phone}}</span>
                        </div>
                        <div class="company-name">{{myCompany.name || 'loading'}}</div>

                    </div>
                    <div class="remaining" v-if="IamSuperAdmin">
                        <img src="../assets/images/icon_vip_small@2x.png">
                        <div class="t1">使用期剩余：</div>
                        <div class="t2">{{myCompanyLife.residueDays}}天</div>
                        <div class="progress">
                            <div :style="{'width':myCompanyLife.progress+'%'}"></div>
                        </div>
                    </div>
                </div>
                <div></div>
                <div class="timecard">
                    <div class="text">上班时间：{{workdSchedule.time}}</div>
                    <div class="text">工作日：{{workdSchedule.days}}</div>
                </div>
            </div>

            <div class="item-list">
                <ul>
                    <li class="clear-float" v-for="(obj,index) in checkPermission(settings.software)" :key="index"
                        @click="jumpTo(obj.link,obj.params)">
                        <img :src="obj.icon" class="item-icon">
                        <span class="item-text">
                    {{obj.title}}
                </span>
                        <img :src="rightImg" class="item-right"/>
                    </li>
                </ul>
            </div>
        </div>
        <div class="logout" @click="resign">
            退出登录
        </div>
        <div class="webTip">
            <p>三帆外勤网页端</p>
            <p>webhawk.sanfanerp.com</p>
        </div>
    </div>
</template>

<style scoped>
    .webTip {
        width: 100%;
        text-align: center;
        color: #999999;
        z-index: 1;
        font-size: 13px;
        margin-bottom: 10px;
    }

    .webTip p {
        margin: 1px;
    }
    .remaining {
        height: 64px;
        margin-left: 50px;
        position: relative;
        color: white;
        font-size: 12px;
        margin-top: 10px;
    }

    .remaining > img {
        width: 25px;
        height: 32px;
        float: left;
    }

    .remaining > .t1 {

    }

    .remaining > .t2 {
        position: absolute;
        top: 0px;
        right: 0px;
    }

    .progress {
        background-color: rgba(255, 255, 255, 0.2);
        height: 2px;
        overflow: hidden;
        border-radius: 2px;
        margin: 5px 0px;
    }

    .progress > div {
        height: 2px;
        width: 40%;
        background-color: white;
    }

    ul, li {
        margin: 0;
        padding: 0;
    }

    .preference {
        /*height: 100%;*/
        background: #f6f6f6;
    }

    .header {
        position: relative;
        height: 169px;
        padding: 7px;
        background-size: 100% 100%;

        box-sizing: border-box;
    }

    .self-info {
        padding: 13px;
        height: 45px;
    }

    .self-info > img {
        width: 45px;
        height: 45px;
        border-radius: 50%;
        float: left;
    }

    .self-info .info {
        display: inline-block;
        color: #FFFFFF;
        margin-left: 10px;
        margin-top: 3px;
    }

    .self-info .info .info-name {
        font-size: 16px;
        font-weight: 500;
    }

    .self-info .info .info-phone {
        font-weight: 400;
        font-size: 13px;
        color: #FFFFFF !important;
    }

    .self-info .info .company-name {
        font-size: 12px;
        margin-top: 5px;
    }

    .header .timecard {
        position: absolute;
        height: 40px;
        width: 100%;
        bottom: 7px;

    }

    .header .timecard .text {
        font-size: 11px;
        line-height: 18px;
        color: #FFFFFF;
        text-align: center;
    }

    .clear-float {
        clear: both;
        height: 0;
        line-height: 0;
        font-size: 0;
    }

    .item-list {
        margin-top: 10px;
        border-top: 1px solid #D8D8D8;
        width: 100%;
        background: #FFFFFF;
    }

    .item-list li {
        padding: 0 20px;
        list-style: none;
        line-height: 45px;
        font-size: 14px;
        height: 45px;
        border-bottom: 1px solid #d8d8d8;
    }

    .item-right {
        float: right;
        position: relative;
        top: 50%;
        margin-top: -6px;
        width: 7px;
        height: 13px;
    }

    .item-text {
        font-size: 14px;
        margin-left: 10px;
    }

    .item-icon {
        float: left;
        position: relative;
        top: 50%;
        margin-top: -12px;
        width: 20px;
        height: 20px;
    }

    .pay-button {
        position: absolute;
        background: #147366;
        margin-top: 18px;
        color: #FFFFFF;
        font-size: 12px;
        right: 5px;
        width: 104px;
        height: 24px;
        line-height: 24px;
        text-indent: 10px;
        border-radius: 30px 0px 0px 30px;
    }

    .logout {
        color: #FF715A;
        background: #ffffff;
        padding: 10px;
        text-align: center;
        margin: 10px 0px;
        border-bottom: 1px solid #d8d8d8;
        border-top: 1px solid #d8d8d8;
    }
</style>
<script>
    import {mapGetters, mapActions} from 'vuex';
    import {defaultImgUrl} from 'lib/loading';

    export default {
        name: "preference",

        data: () => {
            return {
                infoImg: require('assets/images/rectangle_card_green@2x.png'),
                rightImg: require('assets/images/arrow_right_gray@2x.png'),
                settings: {
                    software: []
                },
            };
        },

        mounted() {
            this.settings.software = [
                {
                    title: "个人信息",
                    icon: require('assets/images/icon_personal_information_black@2x.png'),
                    link: "/setting/profile/",
                    params: {uId: this.myUserId, person: true}
                },
                {
                    title: "企业设置",
                    icon: require('assets/images/icon_enterprise_black@2x.png'),
                    link: "/setting/company/",
                    params: {}
                },
                {
                    title: "软件设置",
                    icon: require("assets/images/icon_backstage_black@2x.png"),
                    link: "/software/setting/",
                    params: {}
                },
                {
                    title: "关于我们",
                    icon: require("assets/images/icon_about_us_black@2x.png"),
                    link: "/software/about/",
                    params: {}
                },
                {
                    title: "操作指引",
                    icon: require("assets/images/icon_operational_guideline_black@2x.png"),
                    link: "/software/help/",
                    params: {}
                },
            ];
        },

        computed: {
            ...mapGetters([
                'myCompany',
                'myCompanyLife',
                'myProfile',
                'myUserId',
                'superAdmin',
                'timeCard',
                'myAvatar',
                'userPermissions'
            ]),

            IamSuperAdmin() {
                if (this.myProfile && this.myProfile._id && this.superAdmin) {
                    return this.superAdmin._id == this.myProfile._id
                }
                return false;
            },

            workdSchedule() {
                let tc = this.timeCard(this.myUserId);
                if (!tc) return {days: '待定', time: '待定'};
                let days = ['一', '二', '三', '四', '五', '六', '日'].filter((d, index) => {
                    return tc.workDays[index]
                }).join(' ');
                let time = tc.workTimes.length ? tc.workTimes[0].start + '-' + tc.workTimes[0].end : '待定';
                return {days, time};
            },
        },

        methods: {
            checkPermission(items) {
                return items.filter(item => {
                    if (item.title == '企业设置') {
                        if (this.superAdmin && this.superAdmin._id == this.myUserId) return true;
                        if (this.userPermissions(this.myUserId).includes('企业设置')) return true; else return false;
                    }
                    return true;
                })
            },

            jumpTo(path, properties) {
                console.log(path, properties)
                this.$f7router.navigate(path, {
                    props: properties
                });
            },

            resign() {
                $dialog.confirm('确定要退出当前登录的账户吗？', '退出登陆', (ok) => {
                    this.logout();
                    self.$f7.views.main.router.navigate('/login/');
                });
            },

            ...mapActions({
                logout: 'LOGOUT',
                reset_company: 'RESET_COM',
            }),
        },
    };
</script>
