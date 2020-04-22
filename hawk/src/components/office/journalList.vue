<template>
    <f7-page no-toolbar style="background: #f8f8f8" @page:beforein="requestLoad">
        <f7-navbar  title="日报管理" back-link>
            <f7-nav-right>

                <date-picker v-show="tab=='xiashu'"
                             v-model="time_day "
                             type="date"
                             :editable="false"
                             class="date-picker"
                             width="100px"
                             :confirm="true"
                             :confirm-text="'确定'"
                             placeholder="日期筛选"
                             format="YYYY-MM-DD" :minute-step="30"
                             @confirm="action"
                             @clear="clear"
                             :first-day-of-week="1"

                ></date-picker>
            </f7-nav-right>
        </f7-navbar>

        <div class="page-content">

            <div v-show="tab=='xiashu'" v-if="isDepartmentAdmin(myProfile._id) || myProfile.superadmin">

                <div class="list-item  list-type" @click="selectorPersonnelShow=true">

                    <label>选择员工</label>
                    <div>
                        <label style="font-size: 12px;color: #A7A7A7" v-if="selectperson != '选择'">{{who(selectperson) && who(selectperson).name}}</label>
                        <img :src=arrow_right_gray style="position: relative;top:1px;width: 7px;height: 13px;" />
                    </div>

                </div>
                <div v-show="journal.length > 0" class="list-content" v-for="(item,index) in journal" @click="goto(item)" >
                    <div class="list-item">
                        <span class="list-left-span">{{who(item.applicant) && who(item.applicant).name}}的{{item.rtype}}</span>
                        <!--formatString-->
                        <span class="list-right-span">{{new Date(item.createdAt).toMinutesString()}}</span>
                    </div>
                    <div class="list-item-content">
                        <span>{{item.rtype}}内容：{{item.content}}</span>
                    </div>
                    <div class="list-item-bottom">
                        <div class="list-item-bottom-left">详情</div>
                        <div class="list-item-bottom-g-right" v-if="item.status == '已读'">{{item.status}}</div>
                        <div class="list-item-bottom-r-right" v-if="item.status == '未读'">{{item.status}}</div>
                        <div class="list-item-bottom-o-right" v-if="item.status == '已驳回'">{{item.status}}</div>
                        <div class="list-item-bottom-b-right" v-if="item.status == '已确认'">{{item.status}}</div>
                    </div>
                </div>

                <div v-show="journal.length == 0" class="no_template">
                    <img :src="zero_employee_icon" width="71px" height="84px">
                    <p>暂无数据</p>
                </div>

            </div>

            <div v-show="tab=='wode'">
                <div v-show="myreport.length>0" class="list-mycontent" v-for="(item,index) in myreport" @click="goto(item)">
                    <div class="list-item">
                        <span class="list-left-span">{{who(item.applicant) && who(item.applicant).name}}的{{item.rtype}}</span>
                        <span class="list-right-span">{{new Date(item.createdAt).toMinutesString()}}</span>
                    </div>
                    <div class="list-item-content">
                        <span>日报内容：{{item.content}}</span>
                    </div>
                    <div class="list-item-bottom">
                        <div class="list-item-bottom-left">详情</div>
                        <div class="list-item-bottom-g-right" v-if="item.status == '已读'">{{item.status}}</div>
                        <div class="list-item-bottom-r-right" v-if="item.status == '未读'">{{item.status}}</div>
                        <div class="list-item-bottom-o-right" v-if="item.status == '已驳回'">{{item.status}}</div>
                        <div class="list-item-bottom-b-right" v-if="item.status == '已确认'">{{item.status}}</div>
                    </div>
                </div>
                <div v-show="myreport.length == 0" class="no_template">
                    <img :src="zero_employee_icon" width="71px" height="84px">
                    <p>暂无数据</p>
                </div>
            </div>

            <f7-popup :opened="selectorPersonnelShow" @popup:closed="(selectorPersonnelShow = false)">
                <personnelselector
                        :multiple="false"
                        :subordinate="true"
                        :isFilterSub="true"
                        @submit="onSelectorPersonne"
                        @cancel="selectorPersonnelShow = false"
                ></personnelselector>
            </f7-popup>

        </div>

        <div class="page-add-btn" @click="gowriter" v-if="!myProfile.superadmin">
            <img :src=btn_oval_add_green width="55px" height="55px">
        </div>

        <footer class="footer" v-if="superAdmin._id !== myProfile._id && isDepartmentAdmin(myProfile._id)">
            <div class="clearfix">
                <div id="xiashu" class="divclsaa" @click="changeClick(1)" >
                    <div class="item-image">
                        <img id="img1" :src=icon_employee_gray width="25px" height="25px">
                    </div>
                    <span>下属日报</span>
                </div>
                <div id="wode" class="divclsaa" @click="changeClick(2)" >
                    <div class="item-image">
                        <img id="img2" :src=icon_my_task_green width="25px" height="25px">
                    </div>
                    <span >我的日报</span>
                </div>
            </div>

        </footer>
    </f7-page>    　
</template>

<script>

    // import { DatetimeView } from 'vux'
    import {mapGetters,mapMutations,mapActions} from 'vuex';
    import personnelselector from '../gadget/personnelselector.vue';
    import employeepicker from 'gadget/employeepicker.vue';
    import DatePicker from 'vue2-datepicker'
    import axios from 'axios';
    import moment from 'moment'

    const arrow_right_gray = require("assets/images/arrow_right_gray@2x.png");
    const icon_my_task_gray = require("assets/images/icon_my_task_gray@2x.png");
    const icon_my_task_green = require("assets/images/icon_my_task_green@2x.png");
    const icon_employee_gray = require("assets/images/icon_employee_gray@2x.png");
    const icon_employee_green = require("assets/images/icon_employee_green@2x.png");
    const btn_oval_add_green = require("assets/images/btn_oval_add_green@2x.png");

    export default {
        name: "journalList",
        components: {
            // DatetimeView
            employeepicker,
            personnelselector,
            DatePicker
        },
        props: ['which'],
        //监听值改变
        computed: {

            ...mapGetters([
                'who',
                'IamAdmin',
                'IamManager',
                'myCompany',
                'myProfile',
                'departmentName',
                'userDepartment',
                'isDepartmentAdmin',
                'superAdmin',
                'myUserId',
                'personnel'
            ]),

            pList() {
                if (this.superAdmin._id == this.myUserId) return this.personnel;

                // non-admin can only has itself
                let d = this.userDepartment(this.myUserId);
                if (!d.admin.includes(this.myUserId)) return this.personnel.filter(p => p._id == this.myUserId);

                // admin can has all its subordinates
                let self = this
                let subordinates = (function listE(d) {
                    return d.employees.slice(0).concat(
                        d.sub.reduce((accum, s) => {return accum.concat(listE(s))}, [])
                    ) || [];
                })(d);

                subordinates = subordinates.filter(id => !d.admin.includes(id))
                return this.personnel.filter(p => subordinates.includes(p._id))
            }
        },
        data: () => {
            return {

                journal:[],
                myreport:[],

                selectperson:"选择",

                value1: '2017-10-11',
                format: 'YYYY-MM-DD',
                tab: "wode",
                time_day : null,

                selectorPersonnelShow: false, // 查看员工

                arrow_right_gray:arrow_right_gray,
                zero_employee_icon: require('assets/images/ill_no_data@2x.png'),

                icon_my_task_gray:icon_my_task_gray,
                icon_my_task_green:icon_my_task_green,
                icon_employee_gray:icon_employee_gray,
                icon_employee_green:icon_employee_green,
                btn_oval_add_green:btn_oval_add_green

            }
        },

        mounted() {

            this.tab = this.myProfile.superadmin ? "xiashu":"wode";
            if (this.myProfile.superadmin){

                this.bossloading(this.selectperson,this.time_day);

            } else {

                if (this.isDepartmentAdmin(this.myProfile._id) ){
                    var obj1 = document.getElementById('wode');
                    obj1.style.color = "#01B38B";
                    this.loading(this.selectperson,this.time_day)
                }

                this.myreportLoad();
            }

            if (this.which) {
                this.changeClick(1)
            }
        },
        methods: {

            action(){

                if (this.myProfile.superadmin) {

                    this.bossloading(this.selectperson,this.time_day);
                }else {

                    this.loading(this.selectperson,this.time_day)
                }
            },

            clear(){

                this.time_day = null;
                if (this.myProfile.superadmin) {

                    this.bossloading(this.selectperson,this.time_day);
                }else {

                    this.loading(this.selectperson,this.time_day)
                }
            },

            requestLoad(){

                if (this.myProfile.superadmin){

                    this.bossloading(this.selectperson,this.time_day);
                }else {
                    if (this.isDepartmentAdmin(this.myProfile._id)){
                        // this.loading();
                        this.loading(this.selectperson,this.time_day)
                    }
                    this.myreportLoad();
                }

            },

            changeClick(index){

                var obj1 = document.getElementById('xiashu');
                var obj2 = document.getElementById('wode');
                if (index == 1){
                    this.tab = "xiashu";
                    obj1.style.color = "#01B38B";
                    obj2.style.color = "#CDCDCD";
                    $('#img1').attr('src',this.icon_employee_green);
                    $('#img2').attr('src',this.icon_my_task_gray);
                } else if (index == 2){
                    this.tab = "wode";
                    obj1.style.color = "#CDCDCD";
                    obj2.style.color = "#01B38B";
                    $('#img1').attr('src',this.icon_employee_gray);
                    $('#img2').attr('src',this.icon_my_task_green);
                }
            },

            onSelectorPersonne(uIds) {
                this.selectorPersonnelShow = false;
                let id = uIds[0].toString();
                if (id == this.superAdmin._id) {
                    this.bossloading('选择');
                } else {
                    this.selectperson = id;
                    this.loading(this.selectperson,this.time_day)
                }

            },

            getDateStr(AddDayCount) {
                var dd = new Date();
                dd.setDate(dd.getDate()+AddDayCount);
                var y = dd.getFullYear();
                var m = dd.getMonth()+1;
                var d = dd.getDate();
                return y+'-'+(m<10?'0'+m:m)+'-'+d;
            },

            loading(uid,date) {
                this.busy();

                let filters = {};

                if (uid == "选择") {
                    let applicant = this.pList.map(v => v._id)
                    if (date == null){
                        filters = {applicant: applicant, createdBefore: moment().format('YYYY-MM-DD') + ' 24:00:00', createdAfter: this.getDateStr(-2) + ' 00:00:00'};
                    }else {
                        filters = {applicant: applicant, createdAt:date};
                    }
                }else {
                    if (date == null){
                        filters = {applicant:[uid], createdBefore: moment().format('YYYY-MM-DD') + ' 23:59:59.999', createdAfter: this.getDateStr(-2) + ' 00:00:00'};
                    } else {
                        filters = {applicant:[uid],createdAt:date};
                    }
                }

                axios.get('api/journalmgr?q=' + JSON.stringify(filters)).then(resp => {

                    this.journal = resp.data;

                    this.nobusy();
                }).catch(err => {
                    console.error(err);
                    this.nobusy('无法更新数据，请稍后再试');
                });
            },

            bossloading(uid,date) {
                this.busy();

                let filters = {};
                if (uid == "选择") {

                    if (date == null){
                        filters = {createdBefore: moment().format('YYYY-MM-DD') + ' 23:59:59.999', createdAfter: this.getDateStr(-2) + ' 00:00:00'};
                    }else {
                        filters = {createdAt:date};
                    }
                }else {
                    if (date == null){
                        filters = {applicant:uid, createdBefore: moment().format('YYYY-MM-DD') + ' 23:59:59.999', createdAfter: this.getDateStr(-2) + ' 00:00:00'};
                    } else {
                        filters = {applicant:uid,createdAt:date};
                    }
                }

                axios.get('api/journalmgr/bossquery?q=' + JSON.stringify(filters)).then(resp => {

                    this.journal = resp.data;

                    this.nobusy();
                }).catch(err => {

                    this.nobusy('无法更新数据，请稍后再试');
                });
            },

            myreportLoad() {
                this.busy();

                let filters = {createdBefore: moment().format('YYYY-MM-DD') + ' 23:59:59.999', createdAfter: this.getDateStr(-2) + ' 00:00:00'};

                axios.get('api/journalmgr/myreport?q=' + JSON.stringify(filters)).then(resp => {

                    this.myreport = resp.data;

                    this.nobusy();
                }).catch(err => {

                    this.nobusy('无法更新数据，请稍后再试');
                });
            },

            busy() {
                $preloader.show();
            },

            nobusy(s, t, cb) {
                $preloader.hide();

            },

            goto(item){

                if (item.status != "未读"||item.applicant == this.myProfile._id) {

                    this.$f7router.navigate('/office/journaldetail/', {
                        props: {
                            lastPage: '',
                            item: item
                        }
                    });
                }else {

                    let status = "已读";
                    this.busy();
                    axios.put('api/journalmgr/' + item._id, {status}).then(() => {

                        this.nobusy();
                        this.$f7router.navigate('/office/journaldetail/', {
                            props: {
                                lastPage: '',
                                item: item
                            }
                        });
                    }).catch(error => {

                        this.nobusy();
                    })
                }
            },

            gowriter(){

                this.$f7router.navigate('/office/journalmgr/');
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

</style>
