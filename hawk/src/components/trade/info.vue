<template>
    <f7-page @page:beforein="loadCompanyLife">
        <f7-navbar :title="'购买企业套餐'" back-link>
        </f7-navbar>
        <div>
            <div class="info-content">
                <div class="header">
                    {{myCompany.name}}
                    <span v-if="companylife.status == '试用'" style="color: #01B38B;float: right;font-weight: 400">试用版</span>
                </div>
                <div class="content" v-if="companylife">
                    <div class="clear-float" v-if="companylife.status == '已过期' || new Date(companylife.validDate) < new Date()">
                        <div class="people-number">使用名额：<span>{{companylife.number}} 个</span></div>
                        <div class="valid-date"><span style="color: #FF715A">已过期</span></div>
                    </div>
                    <div class="clear-float" v-else v-for="(item,i) in companylife.items">
                        <div class="people-number">使用名额：<span>{{item.number}}个</span></div>
                        <div class="valid-date">有效期：
                            <span :style="getValidDateStyle(item.validDate)" >{{dateFormat(item.validDate)}}</span>
                        </div>
                    </div>

                </div>
                <div class="content" v-else>
                    <div class="clear-float">
                    <div class="people-number">使用名额：<span>0 个</span></div>
                    <div class="valid-date">未开通</div>
                    </div>
                </div>
                <div class="footer clear-float">
                    <div style="float: right;  margin: 10px 0;">

                        <div class="footer-button" v-if="!companylife || companylife.status == '试用'|| companylife.status == '已过期'||new Date(companylife.validDate) < new Date()" @click="dredge">开通</div>
                        <div class="footer-button" v-else="companylife && new Date(companylife.validDate) > new Date()" @click="addUser">添加使用名额</div>
                        <div class="footer-button" v-if="companylife && companylife.status == '正常'" @click="renewal">续费</div>

                    </div>

                </div>
            </div>
        </div>
        <div>
            <vodal class="date-modal" :show="dateDialog" animation="zoom" measure="px" :width=250 :height=230 :closeButton=false>
                <div class="modal-title">添加使用名额</div>
                <div class="modal-form">
                    <ul>
                        <li class="clear-float">
                            <div class="money-label">金额：</div>
                            <div class="money">{{sum}}</div>
                        </li>
                        <li class="clear-float">
                            <div class="staff-label">添加员工：</div>
                            <div class="staff">
                                <f7-stepper :max="1000" :min="1" v-if="order.number != null" color="gray" :value="order.number"
                                            @input="order.number = parseInt($event.target.value)"></f7-stepper>
                            </div>
                        </li>
                    </ul>

                </div>
                <div class="modal-tips">
                    注：为了方便统一管理，现在剩下使用期为{{order.duration}}天，所以添加的人数是计算{{order.duration}}天的
                </div>
                <div class="modal-button">
                    <div class="modal-cancel" @click="dateDialog=false">取消</div>
                    <div class="modal-save" @click="dateDialog=false;jumpTo('/trade/pay',{'order':order})">确定</div>
                </div>
            </vodal>
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
    .info-content{
        margin: 20px 10px;
        background: #FFFFFF;
        box-shadow:0px 1px 4px 0px rgba(0,0,0,0.09);
        border-radius:2px;
        padding: 15px;
        box-sizing: border-box;
        border-left: 2px solid #01B38B;
    }
    .info-content .header{
        font-size: 14px;
        color: #333333;
        font-weight: 500;
    }
    .info-content .content{
        color: #666;
        margin-top: 5px;

    }
    .info-content .content .people-number{
        line-height: 20px;
        font-size: 13px;
        float: left;
    }
    .info-content .content .valid-date{
        line-height: 20px;
        font-size: 13px;
        float: right;
    }
    .info-content .footer{
        height: 30px;
    }
    .footer-button{
        display: inline-block;
        padding: 0 15px;
        font-size: 12px;
        line-height: 26px;
        background:rgba(1,179,139,1);
        border-radius:12px;
        color: #FFFFFF;
        margin-left: 10px;
    }
    .date-modal{
        /*position: relative;*/
    }

    .modal-title{
        text-align: center;
        font-weight: 500;
        font-size: 16px;
        color: #333;
    }
    .modal-form{
        /*margin-top: 10px;*/
        margin: 10px auto 10px auto;
    }
    .modal-tips{
        margin-left: -15px;
        background: #FFF5E4;
        color: #F96A0E;
        position: absolute;
        bottom: 44px;
        padding: 10px 20px;
        font-size: 12px;
    }
    .modal-form .from-li{
        margin-top: 15px;
        height: 50px;
    }
    .modal-form .money-label{
        float: left;
        display: inline-block;
        width: 40%;
        text-align: right;

        font-size: 12px;
        color: #666;
        line-height: 50px;
    }
    .modal-form .money{
        float: left;
        display: inline-block;
        font-size: 21px;
        color: #FF4A26;
        font-weight: 500;
        line-height: 50px;
    }
    .modal-form .staff-label{
        float: left;
        width: 40%;
        text-align: right;
        font-weight: 500;
        display: inline-block;
        font-size: 14px;
        color: #333;
        line-height: 50px;
    }
    .modal-form .staff{
        float: left;
        margin-top: 10px;
        display: inline-block;
    }
    .modal-button{
        position: absolute;
        width: 100%;
        margin-top: 10px;
        margin-left: -15px;
        height: 44px;
        bottom: 0px;
        border-top: 1px solid #D8D8D8;
        font-size: 16px;

    }
    .modal-button .modal-save{
        float: right;
        width: 50%;
        height: 44px;
        line-height: 44px;
        text-align: center;
        color: #01B38B;

    }
    .modal-button .modal-cancel{
        width: 50%;
        float: left;
        height: 44px;
        line-height: 44px;
        text-align: center;
        border-right: 1px solid #D8D8D8;
        box-sizing: border-box;
        color: #333;
    }
</style>
<script>
    import {mapGetters, mapActions} from 'vuex';
    import moment from 'moment';
    import dateFormat from 'lib/dateformat.js';
    import axios from 'axios';
    import Vodal from 'vodal';
    export default {
        components: {
            Vodal
        },
        props: {
            lastPage: {
                type: String,
                default: '上一页'
            },
            which: {
                type: String,
                default: ''
            }
        },

        data() {
            return {
                order:{
                    number:1,
                    paySort:'ALIPAY',
                    orderType:'ADD_USER',
                    price:2.67,
                    duration:0,
                    invitationCode:''
                },

                dateDialog:false,
                companylife:{

                },
                combo:null,
                errorMsg:'',
                comboList:[],

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
            this.loadCompanyLife();
            this.loadPrice();
            this.order.companyId = this.myCompany._id;

            if (this.which) {
                this.$nextTick(() => {
                    this[this.which]()
                })
            }
        },
        watch:{

        },
        methods: {
            dredge(){
                if (device.platform == "iOS"){
                    $alert('IOS端暂不支持付费，如果需要付费开通，请更换到安卓手机端进行付费操作', '温馨提示');
                    return;
                }
                this.jumpTo('/trade/buy/',{orderType: 'DREDGE'})
            },
            addUser(){
                if (device.platform == "iOS"){
                    $alert('IOS端暂不支持付费，如果需要付费开通，请更换到安卓手机端进行付费操作', '温馨提示');
                    return;
                }
                this.dateDialog=true;
            },
            renewal(){
                if (device.platform == "iOS"){
                    $alert('IOS端暂不支持付费，如果需要付费开通，请更换到安卓手机端进行付费操作', '温馨提示');
                    return;
                }
                this.jumpTo('/trade/buy/',{orderType: 'RENEWAL'})
            },
            getValidDateStyle(date){
                if (moment(date).diff(new Date(),'days') < 10){
                    return {"color":'#F96A0E'}
                }

            },

            dateFormat(date){
                return dateFormat(date,'yyyy-mm-dd');
            },
            loadCompanyLife(){
                let self = this;
                axios.get("/api/companylife/getByCompanyId").then(resp =>{
                    if (resp.data) {
                        self.companylife = resp.data;
                        if ( new Date(self.companylife.validDate) > new Date()){
                            self.order.duration = moment(self.companylife.validDate).diff(new Date(),'days')

                        }
                    }
                })
            },
            loadPrice(){
                let self = this;
                axios.get("/api/trade/getEnterprisePrice").then(resp =>{
                   if (resp.data){
                       self.order.price = (resp.data/30).toFixed(2);
                   }
                })
            },
            submit() {
                let self = this;
            },
            jumpTo(path, properties) {
                this.$f7router.navigate(path, {
                    props: properties
                });
            },
        }
    }
</script>
