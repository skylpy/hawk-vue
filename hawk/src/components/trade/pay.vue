<template>
    <f7-page>
        <f7-navbar :title="'支付选择'" back-link>
        </f7-navbar>
        <div class="invite-code">
            <label>邀请码：</label>
            <input placeholder="请输入" v-model="order.invitationCode">
        </div>
        <div class="paySort">
            <div class="title">支付方式：</div>
            <ul class="paysort-list">
                <li @click="order.paySort = 'ALIPAY' ">
                    <div><img :src="icon_alipay"><span>支付宝</span></div>
                    <div class="select"><img :src="order.paySort == 'ALIPAY'?icon_selected:icon_unselected"></div>
                </li>
                <li @click="order.paySort = 'WEIXIN' ">
                    <div><img :src="icon_wechat_pay"><span>微信</span></div>
                    <div class="select"><img :src="order.paySort == 'WEIXIN'?icon_selected:icon_unselected"></div>
                </li>
            </ul>
        </div>
        <div style="height: 100px"></div>
        <div class="footer">
            <div class="money">金额：<span>￥<span>{{sum}}</span></span></div>
            <div class="pay-btn" @click="submit">支付</div>
        </div>
    </f7-page>
</template>
<style scoped>
    body,div,ul,li,input,label,form,a,p,textarea{
        margin: 0;
        padding: 0;
    }
    ol,ul,li{
        list-style: none;
    }
    .clear-float {
        clear:both;
        height: 0;
        line-height: 0;
        font-size: 0;
    }
    .people-number{
        background: #FFFFFF;
        width: 100%;
        height: 54px;
    }
    .people-number .label{
        float: left;
        margin-left: 20px;
        font-weight: 500;
        color: #333333;
        font-size: 14px;
        line-height: 54px;
        width: 40%;
    }
    .people-number .number{
        float: right;
        margin-top: 12px;
        margin-right: 20px;
    }
    .duration-list{
        margin-top: 10px;
        padding: 10px 20px;
        width: 100%;
        background: #FFFFFF;
        color: #333333;
        box-sizing: border-box;
    }
    .duration-list .title{
        width: 100%;
        height: 34px;
        line-height: 34px;

        font-size: 14px;
        font-weight: 500;
    }
    .item-list  .item {
        width: 100%;
        height: 45px;
        line-height: 45px;
        font-size: 16px;
        padding: 0 10px;
        box-sizing: border-box;
    }
    .active{
        background: #D4FAF1;
        border-radius: 4px;
        border:1px solid rgba(1,179,139,1);
    }
    .item .item-month{
        float: left;
    }
    .item .item-money{
        float: right;
    }
    .item .item-money .price{
        color: #01B38B;
        font-weight: 500;

    }
    .item .free{
        display: inline-block;
        background: #FFAB00;
        border-radius:9px;
        font-size: 11px;
        line-height: 16px;
        color: #FFFFFF;
        padding: 0 5px;
        margin-left: 5px;
    }
    .invite-code{
        width: 100%;
        height: 50px;
        color: #333333;
        background: #FFFFFF;
        margin-top: 10px;
        line-height: 50px;
        padding: 0 20px;
        font-size: 14px;
        box-sizing: border-box;
    }
    .invite-code label{font-weight: 500}
    .invite-code input{
        float: right;
        line-height: 46px;
        font-size: 14px;
        text-align: right;
        background:none;
        outline:none;
        border: none;
    }
    .paySort{
        margin-top: 10px;
        background: #FFFFFF;
        width: 100%;
        padding: 0 20px;
        color: #333333;
        box-sizing: border-box;
    }
    .paySort .title{
        font-weight: 500;
        font-size: 14px;
        line-height: 44px;
        height: 44px;
    }
    .paysort-list{}
    .paysort-list li{
        line-height: 54px;
        border-top: 1px solid #D8D8D8;

    }
    .paysort-list li div{
        display: inline-block;
    }
    .paysort-list li img{
        width: 24px;
        height: 24px;
        vertical-align:middle;
        margin-right: 10px;
    }
    .paysort-list .select{
        float: right;
    }
    .footer{
        background: #FFFFFF;
        position: fixed;
        bottom: 0px;
        height: 45px;
        width: 100%;
    }
    .footer .money{
        float: left;
        width: 70%;
        padding-left: 20px;
        line-height: 45px;
        box-sizing: border-box;
    }
    .footer .money span{
        color: #FF4A26;
    }
    .footer .money span span{
        font-size: 21px;
        font-weight: 500;
        color: #FF4A26;
    }
    .footer .pay-btn{
        float: right;
        background: #01B38B;
        height: 100%;
        width: 30%;
        color: #FFFFFF;
        line-height: 45px;
        text-align: center;
        font-size: 16px;
        font-weight: 500;
        box-sizing: border-box;
    }
</style>
<script>
    import {mapGetters, mapActions} from 'vuex';
    import axios from 'axios';

    export default {
        components: {
        },
        props: {
            lastPage: {
                type: String,
                default: '上一页'
            },
            order:{
                default:function () {
                    return {
                        number:10,
                        price:2.67,
                        paySort:'ALIPAY',
                        orderType:'ADD_USER',
                        invitationCode:''
                    }
                }
            },
        },

        data() {
            return {
                errorMsg:'',
                comboList:[],
                icon_alipay: require('../../assets/images/icon_alipay@2x.png'),
                icon_wechat_pay: require('../../assets/images/icon_wechat_pay@2x.png'),
                icon_unselected: require('../../assets/images/icon_oval_unselected_gray@2x.png'),
                icon_selected: require('../../assets/images/btn_oval_selected_green@2x.png'),
            }
        },

        computed: {
            ...mapGetters([
                'myCompany',
                'who',
                'myProfile',
            ]),
            sum(){
                    return (this.order.number * this.order.price * this.order.duration).toFixed(2);
            }
        },

        mounted() {
        },
        watch:{

        },
        methods: {
            submit(){
                let self = this;
                this.order.companyId = this.myCompany._id;
                this.order.companyName = this.myCompany.name;
                $preloader.show();

                axios.post("/api/trade/createOrder",this.order).then(resp=>{
                    if (self.order.paySort == 'WEIXIN'){
                        let charge = JSON.parse(resp.data.body)
                        var params = {
                            appid:charge.appId,
                            partnerid:charge.partnerid,
                            prepayid:charge.prepayid,
                            package:charge.packageStr,
                            noncestr:charge.nonceStr,
                            timestamp:charge.timeStamp,
                            sign:charge.paySign,
                        }
                        Wechat.isInstalled(function (installed) {
                            if (!installed){
                                $preloader.hide();
                                $alert('支付失败，请先安装微信应用');
                                return;
                            }else {
                                Wechat.sendPaymentRequest(params, function () {
                                    $preloader.hide();
                                    $alert('支付成功', '操作成功', () => {
                                        self.$f7router.back();
                                    });
                                }, function (reason) {
                                    $preloader.hide();
                                    console.error(reason);
                                });
                            }
                        }, function (reason) {
                            $preloader.hide();
                            console.error("Failed: " + reason);
                        });


                    } else {
                        cordova.plugins.alipay.payment(resp.data.body, (res) => {
                            // 支付成功
                            $preloader.hide();
                            $alert('支付成功', '操作成功', () => {
                                self.$f7router.back();
                            });
                        }, (error) => {
                            // 支付失败
                            $preloader.hide();

                            console.log(error);
                        });
                    }


                })
                console.log(this.order)
            }
        }
    }
</script>
