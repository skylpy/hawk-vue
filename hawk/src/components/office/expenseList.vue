<template>
    <f7-page no-toolbar style="background: #f8f8f8" @page:beforein="requestLoad">
        <f7-navbar  :title=title back-link>
            <f7-nav-right>
                <f7-link @click="$f7router.navigate('/office/expensebxmgr/')">新建</f7-link>
            </f7-nav-right>
        </f7-navbar>

        <!--审批列表-->
        <div class="wrapper" v-if="myapprove && isSuperOrAdmin" >
            <div class="menu">
                <div class="menu-item" @click="tab = 'pendingapproval'" v-bind:class="{active:tab == 'pendingapproval'}">待我审批的({{pendapproval.length}})</div>
                <div class="menu-item" @click="tab = 'myapprovel'" v-bind:class="{active:tab == 'myapprovel'}">我审批的({{myexpanse.length}})</div>
            </div>

            <div v-show="tab=='pendingapproval'" class="expense-content">

                <div class="approval-list" v-for="(item,index) in pendapproval" :key="index" @click="godateil(item)">
                    <div class="expense-left">
                        <div class="expense-left-icon">
                            <img :src="who(item.applicant) && who(item.applicant).avatarUrl" width="30px" height="30px">

                        </div>
                    </div>
                    <div class="expense-right">
                        <li class="expense-right-title">
                            <span>{{who(item.applicant) && who(item.applicant).name}}提交的报销</span>
                        </li>
                        <li class="expense-right-des">
                            <span>报销的金额（元）：{{item.schedule[0].money}}</span>
                        </li>
                        <li class="expense-right-des">
                            <span>报销的类别：{{item.schedule[0].types}}</span>
                        </li>
                        <li class="expense-right-des">
                            <span>费用明细：{{item.schedule[0].des}}</span>
                        </li>
                        <li class="expense-right-des">
                            <span>创建时间：{{new Date(item.createdAt).toHawkString()}}</span>
                        </li>
                        <li class="expense-right-pstate">
                            <span>{{item.status}}</span>
                        </li>

                    </div>
                </div>
                <div v-if="pendapproval.length == 0" class="no_template">
                    <img :src="zero_employee_icon" width="71px" height="84px">
                    <p>暂无数据</p>
                </div>

            </div>

            <div v-show="tab=='myapprovel'" class="expense-content" >

                <div v-if="myexpanse.length > 0" class="approval-list" v-for="(item,index) in myexpanse" :key="index" @click="godateil(item)">
                    <div class="expense-left">
                        <div class="expense-left-icon">
                            <img :src="who(item.applicant) && who(item.applicant).avatarUrl" width="30px" height="30px">
                        </div>
                    </div>
                    <div class="expense-right">
                        <li class="expense-right-title">
                            <span>{{who(item.applicant) && who(item.applicant).name}}提交的报销</span>
                        </li>
                        <li class="expense-right-des">
                            <span>报销的金额（元）：{{item.schedule[0].money}}</span>
                        </li>
                        <li class="expense-right-des">
                            <span>报销的类别：：{{item.schedule[0].types}}</span>
                        </li>
                        <li class="expense-right-des">
                            <span>费用明细：{{item.schedule[0].des}}</span>
                        </li>
                        <li class="expense-right-des">
                            <span>创建时间：{{new Date(item.createdAt).toHawkString()}}</span>
                        </li>
                        <li class="expense-right-state" v-if="item.status == '审批通过'">
                            <span>{{item.status}}</span>
                        </li>
                        <li class="expense-right-rstate" v-if="item.status == '已拒绝'">
                            <span>{{item.status}}{{item.notes ? '-' + item.notes : ''}}</span>
                        </li>

                    </div>
                </div>
                <div v-if="myexpanse.length == 0" class="no_template">
                    <img :src="zero_employee_icon" width="71px" height="84px">
                    <p>暂无数据</p>
                </div>
            </div>

        </div>

        <!--发起列表-->
        <div class="wrapper" v-if="mysponsor">

            <div class="expense-content">

                <div v-if="mysponsearr.length > 0" class="approval-list" v-for="(item,index) in mysponsearr" :key="index" @click="godateil(item)">
                    <div class="expense-left">
                        <div class="expense-left-icon">
                            <!--hp_default_96-->
                            <img :src="who(item.applicant) && who(item.applicant).avatarUrl" width="30px" height="30px">
                        </div>
                    </div>
                    <div class="expense-right">
                        <li class="expense-right-title">
                            <span>{{who(item.applicant) && who(item.applicant).name}}提交的报销</span>
                        </li>
                        <li class="expense-right-des">
                            <span>报销的金额（元）：{{item.schedule[0].money}}</span>
                        </li>
                        <li class="expense-right-des">
                            <span>报销的类别：{{item.schedule[0].types}}</span>
                        </li>
                        <li class="expense-right-des">
                            <span>费用明细：{{item.schedule[0].des}}</span>
                        </li>
                        <li class="expense-right-des">
                            <span>创建时间：{{new Date(item.createdAt).toHawkString()}}</span>
                        </li>
                        <li class="expense-right-pstate" v-if="item.status == '待审批'">
                            <span>{{item.status}}</span>
                        </li>
                        <li class="expense-right-state" v-if="item.status == '审批通过'">
                            <span>{{item.status}}</span>
                        </li>
                        <li class="expense-right-rstate" v-if="item.status == '已拒绝'">
                            <span>{{item.status}}{{item.notes ? '-' + item.notes : ''}}</span>
                        </li>

                    </div>
                </div>
                <div v-if="mysponsearr.length == 0" class="no_template">
                    <img :src="zero_employee_icon" width="71px" height="84px">
                    <p>暂无数据</p>
                </div>

            </div>
        </div>

        <!--抄送列表-->
        <div class="wrapper" v-if="mysender && isSuperOrAdmin">

            <div class="menu">
                <div class="menu-item" @click="tabs = 'total'" v-bind:class="{active:tabs == 'total'}">全部({{mysenderarr.length}})</div>
                <div class="menu-item" @click="tabs = 'notread'" v-bind:class="{active:tabs == 'notread'}">没读({{noreadarr.length}})</div>
            </div>

            <div v-show="tabs=='total'" class="expense-content">

                <div class="approval-list" v-for="(item,index) in mysenderarr" :key="index" @click="goto(item)">
                    <div class="expense-left">
                        <div class="expense-left-icon">
                            <img :src="who(item.applicant) && who(item.applicant).avatarUrl" width="30px" height="30px">
                        </div>
                    </div>
                    <div class="expense-right">
                        <li class="expense-right-title">
                            <span>{{who(item.applicant) && who(item.applicant).name}}提交的报销</span>
                        </li>
                        <li class="expense-right-des">
                            <span>报销的金额（元）：{{item.schedule[0].money}}</span>
                        </li>
                        <li class="expense-right-des">
                            <span>报销的类别：{{item.schedule[0].types}}</span>
                        </li>
                        <li class="expense-right-des">
                            <span>费用明细：{{item.schedule[0].des}}</span>
                        </li>
                        <li class="expense-right-des">
                            <span>创建时间：{{new Date(item.createdAt).toHawkString()}}</span>
                        </li>
                        <li class="expense-right-state" v-if="item.status == '审批通过'">
                            <span>{{item.status}}</span>
                        </li>
                        <li class="expense-right-rstate" v-if="item.status == '已拒绝'">
                            <span>{{item.status}}{{item.notes ? '-' + item.notes : ''}}</span>
                        </li>

                    </div>
                </div>
                <div v-if="mysenderarr.length == 0" class="no_template">
                    <img :src="zero_employee_icon" width="71px" height="84px">
                    <p>暂无数据</p>
                </div>
            </div>

            <div v-show="tabs=='notread'" class="expense-content" >

                <div v-if="noreadarr.length > 0" class="approval-list" v-for="(item,index) in noreadarr" :key="index" @click="goto(item)">
                    <div class="expense-left">
                        <div class="expense-left-icon">
                            <img :src="who(item.applicant) && who(item.applicant).avatarUrl" width="30px" height="30px">
                        </div>
                    </div>
                    <div class="expense-right">
                        <li class="expense-right-title">
                            <span>{{who(item.applicant) && who(item.applicant).name}}提交的报销</span>
                        </li>
                        <li class="expense-right-des">
                            <span>报销的金额（元）：{{item.schedule[0].money}}</span>
                        </li>
                        <li class="expense-right-des">
                            <span>报销的类别：：{{item.schedule[0].types}}</span>
                        </li>
                        <li class="expense-right-des">
                            <span>费用明细：{{item.schedule[0].des}}</span>
                        </li>
                        <li class="expense-right-des">
                            <span>创建时间：{{new Date(item.createdAt).toHawkString()}}</span>
                        </li>
                        <li class="expense-right-state" v-if="item.status == '审批通过'">
                            <span>{{item.status}}</span>
                        </li>
                        <li class="expense-right-rstate" v-if="item.status == '已拒绝'">
                            <span>{{item.status}}{{item.notes ? '-' + item.notes : ''}}</span>
                        </li>

                    </div>
                </div>
                <div v-if="noreadarr.length == 0" class="no_template">
                    <img :src="zero_employee_icon" width="71px" height="84px">
                    <p>暂无数据</p>
                </div>
            </div>
        </div>


        <footer class="footer" v-if="isSuperOrAdmin">
            <div class="clearfix">
                <div id="shenpi" class="divclsaa" @click="approverClick(1)">
                    <div class="item-image">
                        <img id="img1" :src=icon_examine_and_approve_green width="25px" height="25px">
                    </div>
                    <span >审批</span>
                </div>
                <div id="faqi" class="divclsaa" @click="approverClick(2)" >
                    <div class="item-image">
                        <img id="img2" :src=icon_initiate_gray width="25px" height="25px">
                    </div>
                    <span >发起</span>
                </div>
                <div id="chaosong" class="divclsaa" @click="approverClick(3)" >
                    <div class="item-image">
                        <img id="img3" :src=icon_mine_to_gray width="25px" height="25px">
                    </div>
                    <span >抄送</span>
                </div>

            </div>

        </footer>


    </f7-page>
</template>

<script>
    import {mapGetters,mapMutations,mapActions} from 'vuex';
    import axios from 'axios';

    const icon_examine_and_approve_gray = require("assets/images/icon_examine_and_approve_gray@2x.png");
    const icon_examine_and_approve_green = require("assets/images/icon_examine_and_approve_green@2x.png");
    const icon_initiate_gray = require("assets/images/icon_initiate_gray@2x.png");
    const icon_initiate_green = require("assets/images/icon_initiate_green@2x.png");
    const icon_mine_to_gray = require("assets/images/icon_mine_to_gray@2x.png");
    const icon_mine_to_green = require("assets/images/icon_mine_to_green@2x.png");
    const hp_default_96 = require("assets/images/hp_default_96@2x.png");

    export default {
        components: {

        },
        props: {
            lastPage: {
                type: String,
                default: '上一页'
            },
            which: {
                type: Number,
                default: 0
            }
        },
        data: () => {

            return {
                toolbar:'manager',
                tab: "pendingapproval",
                tabs:"total",
                title:"审批列表",
                pendapproval:[],
                myexpanse:[],
                mysponsearr:[],
                mysenderarr:[],
                noreadarr:[],
                myapprove:true,
                mysponsor:false,
                mysender:false,
                myapprovetab:"",
                mysponsortab:"",
                mysender:"",
                icon_examine_and_approve_gray:icon_examine_and_approve_gray,
                icon_examine_and_approve_green:icon_examine_and_approve_green,
                icon_initiate_gray:icon_initiate_gray,
                icon_initiate_green:icon_initiate_green,
                icon_mine_to_gray:icon_mine_to_gray,
                icon_mine_to_green:icon_mine_to_green,

                zero_employee_icon: require('assets/images/ill_no_data@2x.png'),
                hp_default_96:hp_default_96,
                isSuperOrAdmin: true
            }
        },

        //监听值改变
        computed: {

            ...mapGetters([
                'myUserId',
                'who',
                'IamAdmin',
                'IamManager',
                'myCompany',
                'myProfile',
                'departmentName',
                'isDepartmentAdmin',
                'superAdmin'
            ]),
            // 判断是行政人员
            isFinance () {
                if (!this.myProfile.privilege || this.myProfile.privilege.length == 0) return false
                return this.myProfile.privilege.some(i => ['公司总账', '固定支出', '应收付款', '应付账款', '财务录入', '财务文件', '薪资录入'].includes(i))
            },
            // 判断是财务人员
            isAdministration () {
                if (!this.myProfile.privilege || this.myProfile.privilege.length == 0) return false
                return this.myProfile.privilege.some(i => ['合同管理', '企业设置'].includes(i))
            }
        },

        mounted: function() {

            var obj1 = document.getElementById('shenpi');
            obj1.style.color = "#01B38B";
            if (this.superAdmin._id !== this.myUserId && !this.isDepartmentAdmin(this.myUserId) && !this.isFinance && !this.isAdministration) {
                this.isSuperOrAdmin = false
            }
            if (this.isSuperOrAdmin) {
                if (this.which) {
                    if (this.which > 3) {
                        this.tab = this.which == 4  ? 'pendingapproval' : 'myapprovel'
                    } else {
                        this.approverClick(this.which)
                    }
                }
            } else {
                this.mysponsor = true
                this.title = '费用报销'
            }

        },

        methods: {

            godateil(expense){
                this.records = [];
                this.$f7router.navigate('/office/expensedateil/', {
                    props: {
                        lastPage: '费用报销',
                        reference: expense
                    }
                });
            },

            goto(item){
                if (item.readIds && item.readIds.includes(this.myUserId)){
                    this.$f7router.navigate('/office/senderdateil/', {
                        props: {
                            lastPage: '费用报销',
                            reference: item
                        }
                    });
                } else {
                    this.sendreader(item);
                }
            },

            //改变已读状态

            sendreader(item){
                this.busy();
                if (item.readIds) {
                    item.readIds.push(this.myUserId);
                } else {
                    item.readIds = [this.myUserId]
                }
                axios.put('api/expensemgr/mysender/' + item._id, item).then(() => {
                    this.nobusy();
                    this.$f7router.navigate('/office/senderdateil/', {
                        props: {
                            lastPage: '费用报销',
                            reference: item
                        }
                    });
                }).catch(error => {
                    console.error(error);
                    this.nobusy();
                })
            },
            //没读列表
            noreadLoad(){

                // this.busy();

                // let filters = {isread:"0"};
                // axios.get('api/expensemgr/mysender?q=' + JSON.stringify(filters)).then(resp => {
                //
                //     this.noreadarr = resp.data;
                //
                //     this.nobusy();
                // }).catch(err => {
                //     console.error(err);
                //     this.nobusy('无法更新数据，请稍后再试');
                // });
            },

            requestLoad(){

                this.loading();
                this.loaded();
                this.mysponsorLoad();
                this.mysenderLoad();
                // this.noreadLoad();
            },

            //抄送列表
            mysenderLoad(){

                this.busy();

                let filters = {};
                axios.get('api/expensemgr/mysender?q=' + JSON.stringify(filters)).then(resp => {
                    this.noreadarr = [];
                    this.mysenderarr = [];
                    resp.data.map(v => {
                       if (v.readIds && !v.readIds.includes(this.myUserId)){
                           this.noreadarr.push(v)
                       }
                    });
                    this.mysenderarr = resp.data
                    this.nobusy();
                }).catch(err => {
                    console.error(err);
                    this.nobusy('无法更新数据，请稍后再试');
                });
            },

            //我发起的
            mysponsorLoad(){
                this.busy();

                let filters = {};
                axios.get('api/expensemgr/mysponsor?q=' + JSON.stringify(filters)).then(resp => {

                    this.mysponsearr = resp.data;

                    this.nobusy();
                }).catch(err => {
                    console.error(err);
                    this.nobusy('无法更新数据，请稍后再试');
                });
            },

            loading() {
                this.busy();

                let filters = {status:'待审批'};

                axios.get('api/expensemgr?q=' + JSON.stringify(filters)).then(resp => {

                    this.pendapproval =  [];
                    resp.data.map(v => {
                        if (v.approver.filter(item => item.uid == this.myUserId).length) {
                            this.pendapproval.push(v)
                        }
                    });

                    this.nobusy();
                }).catch(err => {
                    console.error(err);
                    this.nobusy('无法更新数据，请稍后再试');
                });
            },

            loaded(){
                this.busy();

                let filters = {status:{"$in":['审批通过',"已拒绝"]}};

                axios.get('api/expensemgr?q=' + JSON.stringify(filters)).then(resp => {

                    this.myexpanse = resp.data;

                    this.nobusy();
                }).catch(err => {
                    console.error(err);
                    this.nobusy('无法更新数据，请稍后再试');
                });
            },

            busy() {
                $preloader.show();
            },

            nobusy(s, t, cb) {
                $preloader.hide();

            },
            approverClick(index){

                var obj1 = document.getElementById('shenpi');
                var obj2 = document.getElementById('faqi');
                var obj3 = document.getElementById('chaosong');

                if (index == 1){

                    this.title = "审批列表";
                    this.myapprove = true;
                    this.mysponsor = false;
                    this.mysender = false;
                    obj1.style.color = "#01B38B";
                    obj2.style.color = "#CDCDCD";
                    obj3.style.color = "#CDCDCD";
                    $('#img1').attr('src',this.icon_examine_and_approve_green);
                    $('#img2').attr('src',this.icon_initiate_gray);
                    $('#img3').attr('src',this.icon_mine_to_gray);

                } else if (index == 2){

                    this.title = "发起列表";
                    this.myapprove = false;
                    this.mysponsor = true;
                    this.mysender = false;
                    obj1.style.color = "#CDCDCD";
                    obj2.style.color = "#01B38B";
                    obj3.style.color = "#CDCDCD";
                    $('#img1').attr('src',this.icon_examine_and_approve_gray);
                    $('#img2').attr('src',this.icon_initiate_green);
                    $('#img3').attr('src',this.icon_mine_to_gray);

                } else {
                    this.title = "抄送列表";
                    this.myapprove = false;
                    this.mysponsor = false;
                    this.mysender = true;
                    obj1.style.color = "#CDCDCD";
                    obj2.style.color = "#CDCDCD";
                    obj3.style.color = "#01B38B";
                    $('#img1').attr('src',this.icon_examine_and_approve_gray);
                    $('#img2').attr('src',this.icon_initiate_gray);
                    $('#img3').attr('src',this.icon_mine_to_green);
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
    .approval-list{

        background-color: white;
        margin-top: 10px;
    }
    .menu{
        height: 45px;
        background-color: #FFFFFF;
        padding-bottom: 2px;
    }
    .menu .menu-item{
        float: left;
        font-size: 14px;
        font-weight: 500;
        text-align: center;
        line-height: 45px;
        color: #333333;
        width: 30%;
        margin: 0 10%;
    }
    .menu .active{
        color: #01B38B;
        border-bottom: 2px solid #01B38B;
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
    .wrapper {

        overflow: auto;
        -webkit-overflow-scrolling: touch;
        box-sizing: border-box;
        height: 100%;
        position: relative;
        z-index: 1;
    }

    .divclsaa{
        text-align: center;
        width: 32%;
        line-height: 30px;
        display: inline-block;
        float: left;
        color: #CDCDCD;
        font-size: 12px;

    }

    .clearfix:after{content:"";display:block;clear:both;}
    .clearfix{zoom:1;}

    .item-image{

        width: 25px;
        margin: 0 auto;
        height: 20px;
        float: top;
        margin-top: 5px;

    }
    .item-selpon span{
        display: block;
        font-size: 12px;
        text-align: center;
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

</style>
