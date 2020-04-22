<template>
    <f7-page no-navbar no-swipeback login-screen>

        <div style="position:absolute; top:0; right:0">
            <img style="width:110px; height:140px;" src="../../assets/images/rectangle_gray_1@2x.png" alt="">
        </div>

        <div style="position:absolute; left:0; bottom: 100px">
            <img style="width:24%; height:40%;" src="../../assets/images/rectangle_gray_2@2x.png" alt="">
        </div>

        <f7-toolbar class="hawk-org-toolbar">
            <f7-link href="/registrate/">注册新企业</f7-link>
            <f7-link class="hawk-org-toolbar-divider"></f7-link>
            <f7-link @click="forgetPassword">忘记密码</f7-link>
        </f7-toolbar>

        <f7-list id="hawk-login-list">
            <f7-list-item class="hawk-login-list-title">
                <div>用户登录</div>
            </f7-list-item>

            <f7-list-input
                    class="hawk-login-list-input"
                    id="phonenumber"
                    type="text"
                    placeholder="请输入手机号"
                    :value="phone"
                    @input="phone = $event.target.value"
            >
                <img slot="inner-start" src="../../assets/images/icon_phone_black_small@2x.png" alt="phone"
                     class="input-icon">
            </f7-list-input>

            <f7-list-input
                    class="hawk-login-list-input"
                    id="password"
                    :type="show_passwd ? 'text' : 'password'"
                    placeholder="请输入密码"
                    :value="passwd"
                    @input="passwd = $event.target.value"
            >
                <img slot="inner-start" src="../../assets/images/icon_lock_black_small copy@2x.png" alt="lock"
                     class="input-icon">
                <img slot="inner-end" :src="show_passwd ? show_passwd_icon : hide_passwd_icon" alt="lock"
                     class="pasword-reveal" @click="show_passwd = !show_passwd">
            </f7-list-input>
        </f7-list>
        <div style="color: #01B38B;text-align: center;">注册登录后，在设置页面有操作指引可设置使用</div>
        <f7-block style="margin-top:50px">
            <f7-button class="hawk-login-btn" :style="{background: invalidBtn ? '#D8D8D8' : '#01B38B'}"
                       @click="doLogin">登录
            </f7-button>
        </f7-block>

        <f7-block style="margin-top:80px">
            <f7-button class="hawk-login-hotline" @click="phonecall('4006881280')">客服电话：400-688-1280</f7-button>
        </f7-block>
        <div v-if="company.show" class="companyList">
            <div class="title">
                请选择登陆企业
            </div>
            <div class="list_con">
                <div>
                    <div v-for="(item,index) in company.list" @click="companySelect(item)" :class="{noPass:!item.isPass}" :key="index" class="list_item">{{item.name}}</div>
                </div>
                <div @click="company.select=null;company.show=false" class="close_bt">取消</div>
            </div>
        </div>
    </f7-page>
</template>

<style lang="scss">
    .companyList{
        width: 80%;
        max-width: 400px;
        height: 250px;
        z-index: 2;
        border-radius: 10px;
        background-color: white;
        overflow: hidden;
        box-shadow: darkgrey 0px 0px 16px 1px ;
        position: absolute;
        margin: auto;
        left: 0;right: 0;top: 0;bottom: 0;
        .title{
            color: #a6a6a6;
            line-height: 49px;
            text-align: center;
            background-color: white;
            font-size: 16px;
            border-bottom: 1px solid #dcdcdc;
        }
        .list_con{
            background-color: #e6e6e6;
            height: 150px;
            overflow-y: auto;
        }
        .list_item{
            background-color: white;
            cursor: pointer;
            color: #4b4b4b;
            font-size: 17px;
            text-align: center;
            width: 100%;
            line-height: 49px;
            border-bottom: 1px solid #dcdcdc;
            overflow:hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
            position: relative;
        }
        .noPass{
            background-color: #f9f9f9;
            color: #ff4d31;
        }
        .close_bt{
            cursor: pointer;
            width: 100%;
            position: absolute;
            bottom: 0px;
            line-height: 49px;
            text-align: center;
            border-top: 1px solid #dcdcdc;
        }
    }
    #hawk-login-list {
        margin-top: 110px;

        .item-content {
            padding-left: 25px;
            padding-right: 25px;
        }

        .hawk-login-list-title {
            font-size: 25px;
            font-weight: 500;
            line-height: 25px;
            margin-bottom: 35px;

            .item-inner:after {
                content: none;
            }
        }

        .hawk-login-list-input {
            font-size: 14px;
            margin-bottom: 20px;

            .input-icon {
                display: inline-block;
                padding-right: 5px;
                margin-right: 5px;
                border-right: #01B38B solid 1px;
                width: 18px;
                height: 18px;
            }

            .pasword-reveal {
                width: 20px;
                height: 15px;
                float: right;
            }

            .item-input-wrap {
                display: inline-block;
                width: 70%;
                position: relative;
            }

            .item-input .item-inner::after {
                background-color: #D8D8D8;
                content: '';
                position: absolute;
                display: block !important;
                z-index: 15;
                top: auto;
                right: auto;
                bottom: 0;
                left: 0;
                height: 1px;
                width: 100%;
                transform-origin: 50% 100%;
            }

            .item-input.item-input-focused .item-inner::after {
                background-color: #01B38B;
                height: 2px;
                content: '';
            }
        }

    }

    .ios .hawk-login-btn {
        width: 86.7%;
        border: none;
        background-color: #01B38B;
        color: white;
        margin: 0 auto;
        border-radius: 1px;
        height: 40px;
        font-size: 16px;
        line-height: 16px;
        padding-top: 10px;
    }

    .ios .hawk-login-hotline {
        width: 100%;
        border: none;
        font-size: 13px;
        color: #01B38B;
    }
</style>


<script>
    import {mapGetters, mapActions} from "vuex";
    import {call} from 'lib/phonecall';

    export default {
        props: [
            'credential'
        ],

        data() {
            return {
                phone: "",
                passwd: "",
                show_passwd: false,
                show_passwd_icon: require('assets/images/icon_eye_open_gray@2x.png'),
                hide_passwd_icon: require('assets/images/icon_eye_close_gray@2x.png'),
                company: {
                    show: false,
                    list: [],
                    select: null
                }
            };
        },

        computed: {
            invalidBtn() {
                return this.phone == "" || this.passwd == "";
            },
            ...mapGetters(["isAuth"])
        },

        mounted() {
            if (this.credential && this.credential.phone && this.credential.passwd) {

                this.phone = this.credential.phone;
                this.passwd = this.credential.passwd;

                this.doLogin();
            }
        },

        methods: {
            ...mapActions({
                login: "LOGIN",
                im_login: "IM_LOGIN"
            }),

            forgetPassword() {
                this.$f7.dialog.alert('请联系您公司的管理员来取回密码', '忘记密码');
            },

            doLogin() {
                if (this.invalidBtn) return;

                let credentials = {
                    phone: this.phone,
                    passwd: this.passwd,
                    versions: '2'//版本2支持一号多用户登陆
                };
                if(this.company.select){
                    credentials.companyId = this.company.select
                    this.company.select = null
                }
                window.hawkinit = false; // clean hawkinit to force a reload of company data

                $dialog.preloader("正在登录中...");

                this.login(credentials).then(() => {
                    $dialog.close();
                    this.im_login
                    this.$f7.views.main.router.navigate('/', {
                        clearPreviousHistory: true
                    });
                }).catch(err => {
                    $dialog.close();
                    if (err.response.data.errorCode == 204) {
                        this.company.list=err.response.data.message.companyList
                        this.company.show=true
                        return
                    }
                    if (err.message == 'Network Error') {
                        $alert('无法连接服务器', '出错了！');
                    } else {
                        $alert("请重新输入", "账号密码输入错误");
                    }

                });

            }, // login()
            companySelect(item){
                this.company.select = item.companyId
                this.company.show = false
                this.doLogin()
            },
            phonecall(n) {
                if (!n) return;
                return call(n);
            },
        }
    };
</script>
