<template>
    <f7-page no-toolbar style="background: #f8f8f8">
        <f7-navbar  title="审批详情" back-link>
            <f7-nav-right>
            </f7-nav-right>
        </f7-navbar>
        <div class="expense-content">
            <div class="expense-top">
                <div class="expense-left">
                    <div class="expense-left-icon">
                        <img :src="who(expense.applicant) && who(expense.applicant).avatarUrl || hp_default_96" width="30px" height="30px">
                    </div>

                </div>
                <div class="expense-right">
                    <li>
                        <span>{{who(expense.applicant) && who(expense.applicant).name}}</span>
                    </li>
                    <li class="expense-right-pstate" v-if="expense.status == '待审批'">
                        <span>{{expense.status}}</span>
                    </li>
                    <li class="expense-right-state" v-if="expense.status == '审批通过'">
                        <span>{{expense.status}}</span>
                    </li>
                    <li class="expense-right-rstate" v-if="expense.status == '已拒绝'">
                        <span>{{expense.status}}</span>
                    </li>
                </div>
            </div>

            <div class="expense-top2">
                <li>
                    <span class="expense-top2-title">审批编号</span>
                    <span>201888888888</span>
                </li>

                <li>
                    <span class="expense-top2-title">所以部门</span>
                    <span>{{departmentName(expense.department)}}</span>
                </li>

            </div>

            <div v-for="(item,index) in expense.schedules">
                <div class="expense-des">
                    <li>
                        <span class="expense-desspan">报销明细({{index+1}})</span>
                    </li>
                </div>

                <div class="expense-top2">
                    <li>
                        <span class="expense-top2-title">报销金额</span>
                        <span>{{item.money}}</span>
                    </li>
                    <li>
                        <span class="expense-top2-title">报销类型</span>
                        <span>{{item.types}}</span>
                    </li>
                    <li>
                        <span class="expense-top2-title">费用明细</span>
                        <span class="expense-top2-title-des">{{item.des}}</span>
                    </li>

                </div>

                <li class="linetype"></li>
            </div>

            <div class="expense-allprice">
                <li>
                    <span style="color: #A7A7A7">总报销金额(元)：  </span>
                    <span style="color: coral">{{expense.allmoney}}</span>
                </li>
                <li class="image-top" v-if="expense.photo.length > 0">
                    <div>
                        <span class="imagetite">图片</span>
                    </div>
                    <div class="imgDiv" v-for="item in expense.photo">
                        <img src="" width="40px" height="40px">
                    </div>
                </li>
            </div>

            <li class="expenseline"></li>

            <div class="expense-list" v-for="(item,index) in expense.approver">

                <div class="expense-left">
                    <div class="expense-left-icon">
                        <img :src="who(item.uid) && who(item.uid).avatarUrl || hp_default_96"  width="30px" height="30px">
                    </div>
                </div>
                <div class="expense-right">

                    <span class="expense-name">{{item.uid && who(item.uid).name}}</span>
                    <span class="expense-time">{{item.createtime}}</span>
                </div>
            </div>

            <li class="expenseline"></li>

            <li class="list-item photo-item">
                <span class="item-icon">*</span>
                <label>抄送人</label>

                <div class="clearfix">
                    <div class="item-selpon" v-for="item in expense.sendover">

                        <div class="item-image">
                            <img :src="item && who(item).avatarUrl || hp_default_96" width="40px" height="40px">
                        </div>
                        <span >{{who(item).name}}</span>

                    </div>
                </div>
            </li>

        </div>
    </f7-page>
</template>

<script>

    import {mapGetters,mapMutations,mapActions} from 'vuex';

    const hp_default_96 = require("assets/images/hp_default_96@2x.png");

    export default {
        name: "senderdateil",
        props: [
            'lastPage',
            'reference'
        ],
        data: () => {

            return {
                tab: "myapprovel",

                expansedateil:["","",""],
                hp_default_96:hp_default_96,
                expense:{
                    photo:[],
                    status:"",
                    schedules:[],
                    department:"",
                    allmoney:"",
                    uid:"",
                    approver:[],
                    sendover:[],
                    applicant:""
                }
            }

        },
        //监听值改变
        computed: {

            ...mapGetters([

                'who',
                'IamAdmin',
                'IamManager',
                'myCompany',
                'myProfile',
                'departmentName'
            ])
        },
        mounted: function() {

            this.init(this.reference);
        },
        methods: {

            init(application) {
                this.expense.photo = application.photo;
                this.expense.status = application.status;
                this.expense.schedules = application.schedule;
                this.expense.department = application.department;
                this.expense.allmoney = application.allmoney;
                this.expense.uid = application._id;
                this.expense.approver = application.approver;
                this.expense.applicant = application.applicant;
                this.expense.sendover = application.sendover;
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
    .expense-content{
        width: 100%;

    }
    .expense-top{
        width: 100%;
        margin-top: 10px;

        border-bottom: 1px solid rgba(231, 233, 242, 0.79);

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
    .expense-left {
        display: inline-block;
        width: 15%;

        margin-bottom: 15px;
    }
    .expense-left-icon{
        width: 30px;
        height: 30px;
        border-radius: 15px;
        background-color: #2196F3;
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
    }

    .expense-time{
        float: right;
        margin-right: 10px;
        line-height: 35px;
        height: 30px;
    }
    .expense-name{
        float: left;
        height: 30px;
        line-height: 30px;
    }

    .expense-top2{

        width: 100%;
        margin: 10px;
    }

    .expense-top2-title{

        display: inline-block;
        color: #CCCCCC;
        width: 80px;
    }

    .expense-top2-title-des{

        display: inline-block;

    }

    .expense-allprice{

        line-height: 45px;
        padding-left: 10px;
    }

    .expense-des{

        width: 100%;
        margin-top: 10px;
        margin-bottom: 10px;
    }

    .expense-des li{

        height: 25px;
        margin: 0px auto;
        background-color: #ececec;
        width: 90%;
        line-height: 25px;
        border-radius: 2px;
    }

    .expense-desspan{

        margin-top: 5px;
        margin-left: 10px;
    }

    .expense-list{

         width: 100%;
         margin-top: 10px;
     }

    .image-top{

        margin-top: 0px;
        min-height: 50px;
    }

    .imagetite{

        color: #CCCCCC;
        width: 100%;
        margin-top: 0px;
        height: 20px;
        display: inline-block;

    }

    .linetype{

        margin: 0px auto;
        width: 95%;
        height: 1px;
        border-bottom: 1px solid rgba(231, 233, 242, 0.79);
    }
    .expenseline{

        height: 10px;
        background-color: #ececec;
    }

    .bottom-button{
        color: #FFFFFF;
        margin-top: 100px;
        text-align: center;
        height: 40px;
        width: 100%;
    }

    .approval-button{

        line-height: 40px;
        background-color: #01B38B;
        border-radius: 2px;
        margin-left: 20px;
        float: left;
        display: inline-block;
        width: 30%;
        height: 40px;
    }

    .imgDiv{
        display: inline-block;
        margin-right: 10px;
    }

    .reject-button{

        line-height: 40px;
        background-color: red;
        border-radius: 2px;
        margin-right: 20px;
        float: right;
        display: inline-block;
        width: 30%;
        height: 40px;
    }

    .photo-item{

        width: 100%;
        font-size: 14px;
        line-height: 30px;
        min-height: 90px!important;
        margin-bottom: 10px;
        padding-bottom: 10px;
    }
    .item-icon{
        display: inline-block;
        color: red;
        width: 18px;
        text-align: right;
    }
    .clearfix:after{content:"";display:block;clear:both;}
    .clearfix{zoom:1;}
    .item-selpon{
        width: 60px;
        height: 60px;
        margin-top: 5px;
        margin-left: 20px;
        float: left;

    }
    .item-image{

        width: 40px;
        margin: 0 auto;
        height: 40px;
        background-color: gainsboro;
        float: top;
        border-radius:20px;

    }
    .item-selpon span{
        display: block;
        font-size: 12px;
        text-align: center;
    }


</style>
