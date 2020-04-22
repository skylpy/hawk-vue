<template>
    <f7-page @page:beforein="load">
        <f7-navbar  title="邀约到访" back-link>
            <f7-nav-right>
            </f7-nav-right>
        </f7-navbar>

        <div class="content">
            <div v-show="tab=='invitationList'" v-if="superAdmin._id === myProfile._id || isAdministrative || isFinance">
                <div class="approval-list" v-for="(item,index) in approveList" :key="index" @click="goDetail(item)">
                    <div class="expense-left">
                        <div class="expense-left-icon">
                            <img :src="who(item.creator) && who(item.creator).avatarUrl" width="30px" height="30px">

                        </div>
                    </div>
                    <div class="expense-right">
                        <li class="expense-right-title">
                            <span>{{who(item.creator) && who(item.creator).name}}提交的邀约到访</span>
                        </li>
                        <li class="expense-right-des">
                            <span>客户名字：{{item.name}}</span>
                        </li>
                        <li class="expense-right-des">
                            <span>联系方式：{{item.contact}}</span>
                        </li>
                        <li class="expense-right-des">
                            <span>邀约人：{{item.contactName}}</span>
                        </li>
                        <li class="expense-right-des">
                            <span>预计到访时间：{{moment(item.time).format('YYYY-MM-DD')}}</span>
                        </li>
                        <li class="expense-right-pstate">
                            <span :style="{color: item.status == '已确认' ? 'green' : item.status == '已驳回' ? 'red' : ''}">{{item.status}}</span>
                        </li>
                    </div>
                </div>
                <div v-show="approveList.length == 0" class="no_template">
                    <img :src="zero_employee_icon" width="71px" height="84px">
                    <p>暂无数据</p>
                </div>
            </div>

            <div v-show="tab=='invitationApply'">
                <div class="approval-list" v-for="(item,index) in applyList" :key="index" @click="goDetail(item)">
                    <div class="expense-left">
                        <div class="expense-left-icon">
                            <img :src="who(item.creator) && who(item.creator).avatarUrl" width="30px" height="30px">

                        </div>
                    </div>
                    <div class="expense-right">
                        <li class="expense-right-title">
                            <span>{{who(item.creator) && who(item.creator).name}}提交的邀约到访</span>
                        </li>
                        <li class="expense-right-des">
                            <span>客户名字：{{item.name}}</span>
                        </li>
                        <li class="expense-right-des">
                            <span>联系方式：{{item.contact}}</span>
                        </li>
                        <li class="expense-right-des">
                            <span>邀约人：{{item.contactName}}</span>
                        </li>
                        <li class="expense-right-des">
                            <span>预计到访时间：{{moment(item.time).format('YYYY-MM-DD')}}</span>
                        </li>
                        <li class="expense-right-pstate">
                            <span :style="{color: item.status == '已确认' ? 'green' : item.status == '已驳回' ? 'red' : ''}">{{item.status}}</span>
                        </li>
                    </div>
                </div>
                <div v-show="applyList.length == 0" class="no_template">
                    <img :src="zero_employee_icon" width="71px" height="84px">
                    <p>暂无数据</p>
                </div>
            </div>
        </div>

        <div class="page-add-btn" @click="add">
            <img :src=btn_oval_add_green width="55px" height="55px">
        </div>

        <footer class="footer" v-if="superAdmin._id === myProfile._id || isAdministrative || isFinance">
            <div class="clearfix">
                <div id="invitationList" class="divclsaa" @click="changeClick(1)" >
                    <div class="item-image">
                        <img id="img1" :src=icon_employee_gray width="25px" height="25px">
                    </div>
                    <span>邀约审批</span>
                </div>
                <div id="invitationApply" class="divclsaa" @click="changeClick(2)" >
                    <div class="item-image">
                        <img id="img2" :src=icon_my_task_green width="25px" height="25px">
                    </div>
                    <span >邀约到访</span>
                </div>
            </div>
        </footer>
    </f7-page>
</template>

<script>
import {mapGetters,mapMutations,mapActions} from 'vuex';
import axios from 'axios'
import moment from 'moment'

const icon_my_task_gray = require("src/assets/images/icon_my_task_gray@2x.png");
const icon_my_task_green = require("src/assets/images/icon_my_task_green@2x.png");
const icon_employee_gray = require("src/assets/images/icon_employee_gray@2x.png");
const icon_employee_green = require("src/assets/images/icon_employee_green@2x.png");
const btn_oval_add_green = require("src/assets/images/btn_oval_add_green@2x.png");
export default {
    name: "invitationList",
    props: ['which'],
    data () {
        return {
            icon_my_task_gray,
            icon_my_task_green,
            icon_employee_gray,
            icon_employee_green,
            btn_oval_add_green,
            zero_employee_icon: require('src/assets/images/ill_no_data@2x.png'),
            tab: 'invitationApply',
            applyList: [],
            approveList: []
        }
    },
    computed: {
        ...mapGetters([
            'superAdmin',
            'myUserId',
            'myProfile',
            'who'
        ]),
        isAdministrative () {
            return this.myProfile.privilege.some(i => ['合同管理', '企业设置'].includes(i))
        },
        isFinance () {
            return this.myProfile.privilege.some(i => ['公司总账', '固定支出', '应收付款', '应付账款', '财务录入', '财务文件', '薪资录入'].includes(i))
        }
    },
    methods: {
        moment,
        changeClick(index){
            let obj1 = document.getElementById('invitationList');
            let obj2 = document.getElementById('invitationApply');
            if (index == 1){
                this.tab = "invitationList";
                obj1.style.color = "#01B38B";
                obj2.style.color = "#CDCDCD";
                $('#img1').attr('src',this.icon_employee_green);
                $('#img2').attr('src',this.icon_my_task_gray);
            } else if (index == 2){
                this.tab = "invitationApply";
                obj1.style.color = "#CDCDCD";
                obj2.style.color = "#01B38B";
                $('#img1').attr('src',this.icon_employee_gray);
                $('#img2').attr('src',this.icon_my_task_green);
            }
        },
        add () {
            this.$f7router.navigate({url: '/client/invitationList/apply/'});
        },
        load () {
            $preloader.show()
            if (this.superAdmin._id === this.myProfile._id || this.isAdministrative || this.isFinance) {
                axios.get('/api/invitation/?approver=' + this.myUserId).then(res => {
                    this.approveList = res.data
                    $preloader.hide();
                }).catch(err => {
                    $preloader.hide();
                    console.error(err);
                    $alert('无法更新数据，请稍后再试', '操作错误');
                });
            }
            axios.get('/api/invitation/?creator=' + this.myUserId).then(res => {
                this.applyList = res.data
                $preloader.hide();
            }).catch(err => {
                $preloader.hide();
                console.error(err);
                $alert('无法更新数据，请稍后再试', '操作错误');
            });
        },
        goDetail(data) {
            this.$f7router.navigate('/client/invitationList/detail/',{
                props: {
                    item: data
                }
            })
        }
    },
    mounted () {
        if (this.which) {
            this.changeClick(this.which)
        } else {
            if (this.superAdmin._id === this.myProfile._id || this.isAdministrative || this.isFinance) {
                this.changeClick(2)
            }
        }
    }
}
</script>

<style scoped>

    body,div,ul,li,input,label,form,a,p,textarea{
        margin: 0;
        padding: 0;
    }
    ol,ul,li{
        list-style: none;
    }
    .clearfix:after{content:"";display:block;clear:both;}
    .clearfix{zoom:1;}
    .page-content {

        overflow: auto;
        -webkit-overflow-scrolling: touch;
        box-sizing: border-box;
        height: 100%;
        position: relative;
        z-index: 1;
        padding-bottom: 50px;
        /*background: red;*/
    }

    .footer{

        position: fixed;
        bottom: 0px;
        width: 100%;
        height: 50px;
        background: #FFFFFF;
        color: white;
        text-align: center;
        line-height: 50px;
        font-size: 18px;
        z-index: 99;
    }

    .divclsaa{

        text-align: center;
        width: 49%;
        line-height: 30px;
        display: inline-block;
        float: left;
        color: #CDCDCD;
        font-size: 12px;
    }

    .item-image{

        width: 25px;
        margin: 0 auto;
        height: 20px;
        float: top;
        margin-top: 5px;
    }

    .list-item{
        background: #FFFFFF;
        width: 100%;
        height: 45px;
        font-size: 14px;
        line-height: 45px;
        border-bottom: 1px solid #f8f8f8;
    }

    .list-type {

        margin-top: -30px;
        background: white;
        line-height: 45px;
        font-size: 14px;
        margin-bottom: 10px;
    }

    .list-type div{
        display: inline-block;
        width: 50%;
        text-align: right;
        float: right;
        margin-right: 12px;
        color: darkgray;
    }

    .list-type label{
        margin-left: 15px;
        line-height: 44px;
        color: #333333;
    }

    .list-left-span{

        display: inline-block;
        line-height: 44px;
        margin-left: 15px;
        color: #333333;
        font-size: 16px;
        font-weight:bold;
    }

    .list-right-span{

        float: right;
        display: inline-block;
        line-height: 44px;
        margin-right: 12px;
        color: #333333;
        font-size: 13px;
        font-weight:bold;
    }

    .list-item-content{

        background: #FFFFFF;
        white-space:nowrap;
        margin: 15px 10px 15px 15px;
        overflow:hidden;
        text-overflow:ellipsis;
        color: #999999;
        font-size: 13px;
    }

    .list-content{

        background: #FFFFFF;
    }

    .list-mycontent{

        background: #FFFFFF;
        margin-top: -30px;
        margin-bottom: 40px;
    }

    .list-item-bottom{

        background: #FFFFFF;
        margin-right: 15px;
        margin-left: 15px;
        margin-top: 20px;
        margin-bottom: 15px;
        padding-bottom: 10px;
    }

    .list-item-bottom-left{

        display: inline-block;
        color:#01B38B ;
    }

    .list-item-bottom-g-right{

        float: right;
        color:#01B38B ;
    }

    .list-item-bottom-r-right{

        float: right;
        color:#FF715A ;
    }

    .list-item-bottom-o-right{

        float: right;
        color:#FFAB00 ;
    }

    .list-item-bottom-b-right{

        float: right;
        color:#666666 ;
    }

    .page-add-btn{

        position: fixed;
        bottom: 60px;
        right: 20px;
        width: 55px;
        height: 55px;
        text-align: center;
        line-height: 50px;
        font-size: 18px;
        z-index: 99;
    }

    .no_template{
        text-align: center;
        margin: 120px 0px auto;
    }
    .no_template p{
        font-size: 14px;
        color: #333333;
        margin: 5px 0;
    }


    .expense-content{
        width: 100%;
        padding-bottom: 60px;
        position:absolute;
        overflow-y:scroll;
    }
    .expense-left {
        display: inline-block;
        width: 15%;
        height: 110px;
        margin-top: 10px;
        margin-bottom: 10px;

    }
    .expense-left-icon{
        width: 30px;
        height: 30px;
        border-radius: 15px;
        /*background-color: #2196F3;*/
        margin: 0px auto;
        overflow: hidden;
    }
    .expense-left-icon>img{
        width: 100%;
        height: 100%;
    }
    .expense-right {
        float: right;
        width: 85%;
        height: 110px;
        margin-top: 10px;
        margin-bottom: 10px;


    }
    .expense-right-title{

        white-space:nowrap;
        font-size: 18px;
    }
    .expense-right-des{


        width: 95%;  /*限制宽度*/
        overflow: hidden;
        white-space:nowrap;
        font-size: 13px;
        color: #A7A7A7;
    }

    .expense-right-pstate{
        white-space:nowrap;
        font-size: 13px;
        color: darkorange;
        margin-right: 10px;
    }

    .expense-right-state{


        white-space:nowrap;
        font-size: 13px;
        color: #01B38B;
        margin-right: 10px;
    }
    .expense-right-rstate{


        white-space:nowrap;
        font-size: 13px;
        color: #ec1e44;
        margin-right: 10px;
    }
    .approval-list{

        background-color: white;
        margin-top: 10px;
    }
</style>

