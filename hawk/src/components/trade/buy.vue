<template>
    <f7-page>
        <f7-navbar :title="'企业套餐'" back-link>
        </f7-navbar>
        <div class="tips" v-if="orderType == 'DREDGE'">
            <f7-icon f7="info" size="12px" style="margin-top: -2px"></f7-icon>
            续费暂时不支持增加人数，如需请在上个页面中增加
        </div>
        <div class="people-number">
            <div class="label">公司人数：</div>
            <div class="number" v-if="inited">

                <div class="stepper stepper-init color-gray">
                    <div class="stepper-button-minus" @click="orderMinus"></div>
                    <div class="stepper-input-wrap">
                        <input type="number" v-model="order.number" step="1" @blur="checkOrder" >
                    </div>
                    <div class="stepper-button-plus" @click="orderPlus()"></div>
                </div>
            </div>
            <!--<input type="number" placeholder="请输入人数" v-model="order.number" >-->
        </div>
        <div class="duration-list">
            <div class="title">会员套餐：</div>
            <ul class="item-list">
                <li class="item clear-float" v-for="(item,index) in comboList" :class="{active:item.id == combo.id}" @click="combo = item">
                    <span class="item-month">{{item.duration}}个月</span>
                    <div v-if="item.freeDuration > 0" class="free">送{{item.freeDuration}}个月</div>
                    <span class="item-money"><span class="price">{{item.duration * order.number * item.price}}</span> 元</span>
                </li>
            </ul>
        </div>
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
    .tips{
        height:35px;
        background:rgba(255,245,228,1);
        color: #F96A0E;
        font-size: 12px;
        line-height: 35px;
        padding-left: 15px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;/*文本不换行*/
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
            orderType:{
                type: String,
                default: "DREDGE"
            }
        },

        data() {
            return {
                order:{
                    number: 2,
                    paySort:'ALIPAY',
                    orderType:"DREDGE",
                    invitationCode:''
                },
                max:1000,
                combo:null,
                errorMsg:'',
                companylife:null,
                comboList:[],
                icon_alipay: require('../../assets/images/icon_alipay@2x.png'),
                icon_wechat_pay: require('../../assets/images/icon_wechat_pay@2x.png'),
                icon_unselected: require('../../assets/images/icon_oval_unselected_gray@2x.png'),
                icon_selected: require('../../assets/images/btn_oval_selected_green@2x.png'),
                inited:false
            }
        },

        computed: {
            ...mapGetters([
                'myCompany',
                'who',
                'myProfile',
            ]),
            sum(){
                let sum = 0;
                if (this.combo){
                    sum = this.combo.price * this.combo.duration * this.order.number;
                }
                if (sum < 0){sum = 0}
                return sum;
            }
        },
        created(){
            this.order.orderType = this.orderType;
            this.loadCompanyLife();
        },

        mounted() {

            this.loadComboList();
        },
        watch:{
            combo(value){
                if (value){
                    this.order.comboId = value.id;
                }
            },
        },
        methods: {
            ...mapActions({
                'load_company_life': 'LOAD_COMPANY_LIFE',
            }),
            orderMinus(){
                this.order.number--;
                this.checkOrder();
            },
            orderPlus(){
                this.order.number++;
                this.checkOrder();
            },
            checkOrder(){
                if (this.order.number < 2){
                    this.order.number = 2;
                    this.toast("开通人数不能少于2人")
                }else if (this.order.orderType == 'RENEWAL' &&this.order.number > this.companylife.number){
                    this.order.number = this.companylife.number;
                    this.toast("抱歉续费暂时不支持增加人数，如需请在上个页面中增加后再续费")
                }
                else if (this.order.number >10000){
                    this.order.number = 10000;
                    this.toast("超过10000人，请联系客服开通")
                }
            },
            // 弹窗提醒
            toast(message) {
                if (message) {
                    let r = this.$f7.toast.create({
                        text: message,
                        position: 'center',
                        closeTimeout: 3000,
                    });

                    r.open();
                }
            }, // reminder
            loadComboList(){
                this.comboList = [];
                let self = this;
                axios.get("/api/trade/getEnterpriseComboList").then(resp=>{
                    self.comboList = resp.data;
                    if (self.comboList && self.comboList.length>0){
                        self.combo = self.comboList[0];
                    }
                })

            },

            loadCompanyLife(){
                let self = this;
                axios.get("/api/companylife/getByCompanyId").then(resp =>{
                    self.companylife = resp.data;
                    if (self.companylife) {
                        if (self.companylife.items && self.companylife.items.length>0){
                            self.order.number = self.companylife.items[0].number;
                        } else {
                            self.order.number = self.companylife.number;
                        }
                        if (self.order.orderType == 'RENEWAL'){
                            self.max = self.order.number;
                        }
                    }
                    self.inited = true;
                })
            },
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
                                        self.load_company_life()
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
                                self.load_company_life()
                                self.$f7router.back();
                            });
                        }, (error) => {
                            // 支付失败
                            $preloader.hide();

                        });
                    }

                }).catch(e =>{
                    $alert('创建订单失败，请稍后重试 ！', '操作失败', () => {
                    });
                    $preloader.hide()
                })
            }
        }
    }
</script>
