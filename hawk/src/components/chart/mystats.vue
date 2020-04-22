<template>
    <f7-page :page-content="false" @page:reinit="$forceUpdate()">

        <f7-navbar title="今日工作" back-link></f7-navbar>

        <f7-toolbar tabbar>
            <f7-link tab-link="#mystats-checkin" tab-link-active>考勤</f7-link>
            <f7-link tab-link="#mystats-daily">日报</f7-link>
            <f7-link tab-link="#mystats-report">汇报</f7-link>
            <f7-link tab-link="#mystats-task">任务</f7-link>
            <f7-link tab-link="#mystats-visit">拜访</f7-link>
        </f7-toolbar>

        <f7-tabs animated>

            <f7-tab id="mystats-checkin" class="page-content" tab-active>
                <div class="warning">
                    <f7-icon class="icon" f7="info_round"></f7-icon>
                    工作日记得在固定时间点打卡喔
                </div>
                <ul class="list_con">
                    <li class="list_item" v-for="(item,index) in checkin" :key="index">
                        <div class="list_item_title">{{item.type}}{{item.time}}打卡</div>
                        <div class="list_item_status"
                             :class="{
                                status_success:item.status=='上班'||item.status=='下班'||item.status=='打卡'||item.status=='外勤',
                                status_warning:item.status=='早退'||item.status=='外勤'||item.status=='无',
                                status_error:item.status=='迟到'||item.status=='漏卡',
                             }"
                        >{{item.status}}{{item.checkTime}}</div>
                    </li>
                </ul>
                <f7-block v-if="!checkin.length">
                    <div class="no_data">没有今日考勤工作</div>
                </f7-block>
            </f7-tab>

            <f7-tab id="mystats-daily" class="page-content">
                <div class="warning">
                    <f7-icon class="icon" f7="info_round"></f7-icon>

                    日报开始提交时间：每天{{journalTemplate == null ? '18':journalTemplate.startTime}}:00，
                    截止时间：每天{{journalTemplate == null ? '24':journalTemplate.endTime}}:00

                </div>
                <ul class="list_con">
                    <li v-if="!daily.length" class="list_item">
                        <div class="list_item_title">今日日报</div>
                        <div class="list_item_status status_error">未提交</div>
                    </li>
                    <!--<li class="list_item">-->
                        <!--<div class="list_item_title">今日日报</div>-->
                        <!--<div class="list_item_status status_error">已驳回，需重新提交</div>-->
                    <!--</li>-->
                    <li class="list_item" v-for="(item, index) in daily" :key="index">
                        <div class="list_item_title">今日日报</div>

                        <div v-if="item.status=='未读'||item.status=='已读'" class="list_item_status status_success">已提交，待通过</div>
                        <div v-if="item.status=='已确认'" class="list_item_status status_success">已完成</div>
                        <div v-if="item.status=='已驳回'" class="list_item_status status_error">已驳回，需重新提交</div>
                    </li>
                    <!--<li class="list_item">-->
                        <!--<div class="list_item_title">今日日报</div>-->
                        <!--<div class="list_item_status status_success">已完成</div>-->
                    <!--</li>-->
                </ul>
                <!--<f7-block v-if="!daily.length">-->
                    <!--<div class="no_data">没有今日数据工作</div>-->
                <!--</f7-block>-->
            </f7-tab>

            <f7-tab id="mystats-report" class="page-content">
                <div class="warning">
                    <f7-icon class="icon" f7="info_round"></f7-icon>

                    汇报开始提交时间：每天{{reportTemplate == null ? '18' : reportTemplate.startTime}}:00，
                    截止时间：每天{{reportTemplate == null ? '24' : reportTemplate.endTime}}:00

                </div>
                <ul class="list_con">
                    <li class="list_item">
                        <div class="list_item_title">数据汇报{{period}}</div>
                        <div class="list_item_status"
                            :class="{
                                status_error:reportClassStatus('status_error'),
                                status_success:reportClassStatus('status_success')
                            }"
                        >{{reportStatus}}</div>
                    </li>
                </ul>
                <!--<f7-block v-else>-->
                    <!--<div class="no_data">没有今日汇报工作</div>-->
                <!--</f7-block>-->
            </f7-tab>

            <f7-tab id="mystats-task" class="page-content">
                <div class="warning">
                    <f7-icon class="icon" f7="info_round"></f7-icon>
                    任务要按时完成，状态记得要在任务管理中进行更改
                </div>
                <ul class="card_list_con">
                    <li class="card_item" v-for="(item,index) in task" :key="index" v-if="!(item.status='已完成' || item.status =='已取消')">
                        <div class="card_item_title">
                            <div>{{item.type}}</div>
                            <div>截止：{{new Date(item.deadline).toHawkString()}}</div>
                        </div>
                        <div class="card_item_con">
                            <div>任务内容：{{item.content}}</div>
                            <div v-if="item.status=='待进行'" class="status_error">未进行</div>
                            <div v-if="item.status=='进行中'" class="status_warning">进行中</div>
                            <div v-if="item.status=='已完成'" class="status_success">已完成</div>
                            <div v-if="item.status=='未完成'" class="status_error">未完成</div>
                            <div v-if="item.status=='已取消'">未完成</div>
                        </div>
                        <div v-if="item.status=='待进行'" class="card_status card_error"></div>
                        <div v-if="item.status=='进行中'" class="card_status card_warning"></div>
                    </li>
                </ul>
                <f7-block v-if="!task.length">
                    <div class="no_data">没有今日任务工作</div>
                </f7-block>
            </f7-tab>

            <f7-tab id="mystats-visit" class="page-content">
                <div class="warning">
                    <f7-icon class="icon" f7="info_round"></f7-icon>
                    拜访完成后记得填写拜访总结，不然拜访算是没完成
                </div>
                <div class="block_con">
                    <div class="block_item" v-for="(item,index) in visit" :key="index" v-if="item.status != '已完成'">
                        <div class="block_item_title">
                            <div class="block_item_title_t1">
                                <div>拜访{{item.clientName}}-{{item.type}}</div><div>截止:{{new Date(item.deadline).toHawkString()}}</div>
                            </div>
                            <div class="block_item_title_t2 clearfix">
                                <div>{{who(item.creator).name}}创建于{{new Date(item.createdAt).toHawkString()}}</div>
                                <div v-if="item.status=='未完成'||item.status=='已失访'" class="status_error">{{item.status}}</div>
                                <div v-if="item.status=='已完成'" class="status_success">{{item.status}}</div>
                            </div>
                        </div>
                        <div class="block_item_con clearfix">
                            <p>拜访人：{{myProfile.name}} &nbsp&nbsp&nbsp&nbsp拜访：客户</p>
                            <p>拜访内容：{{item.content}}</p>
                            <div class="block_item_con_bottom">
                                <div @click="visitDateil(item)">详情</div>
                                <div v-show="item.status=='未完成'" @click="visitDateil(item)">去完成</div>
                            </div>
                        </div>
                    </div>
                </div>
                <f7-block  v-if="!visit.length">
                    <div class="no_data">没有今日拜访工作</div>
                </f7-block>
            </f7-tab>

        </f7-tabs>

    </f7-page>
</template>

<style>
    .small {
        width: 80%;
        padding-top: 30px;
        margin: auto;
    }
    .ios .tabbar a.tab-link-active{
        color: #01B38B;
    }
    .no_data{
        color:gray;
        font-size:small;
        text-align: center;
    }

    .warning {
        /*width: 100%;*/
        color: #F96A0E;
        background-color: #FFF5E4;
        font-size: 13px;
        padding: 8px;
    }

    .warning > .icon {
        font-size: 12px;
        margin-bottom: 3px;
    }
    ul,li{
        list-style:none;
        margin: 0px;
        padding: 0px;

    }
    .list_con{
        background-color: white;
    }
    .list_item{
        height: 40px;
        line-height: 40px;
        border-bottom: 1px solid #d8d8d8;
    }
    .list_item_title{
        color: #666666;
        float: left;
        margin-left: 10px;
    }
    .list_item_status{
        float: right;
        margin-right: 10px;
    }
    .status_success{
        color: #01b38b;
    }
    .status_warning{
        color: #ffab00;
    }
    .status_error{
        color: #ff715a;
    }
    .card_list_con{
    }
    .card_item{
        margin: 10px;
        border-radius: 4px;
        min-height: 100px;
        background-color: white;
        position: relative;
        overflow: hidden;
        box-shadow:2px 2px 5px #d0d0d0;
    }
    .card_item_title{
        color: #333333;
        height: 40px;
        line-height: 40px;
        font-weight: bold;
        border-bottom: 1px solid #d8d8d8;
        overflow: hidden;
    }
    .card_item_title>div:first-child{
        float: left;
        margin-left: 10px;
        font-size: 16px;
    }
    .card_item_title>div:last-child{
        float: right;
        font-size: 13px;
        margin-right: 10px;
    }
    .card_item_con{
        color: #999999;
        margin: 14px 10px 10px 10px;
    }
    .card_item_con>div:last-child{
        font-size: 12px;
        text-align: right;
    }
    .card_status{
        height: 100%;
        width: 3px;
        position: absolute;
        top: 0px;
        left: 0px;
    }
    .card_success{
        background-color: #01b38b;
    }
    .card_warning{
        background-color: #ffab00;
    }
    .card_error{
        background-color: #ff715a;
    }
    .block_con{
    }
    .block_item{
        min-height: 164px;
        background-color: white;
        margin-bottom: 10px;
    }
    .block_item_title{
        padding-top: 14px;
        min-height: 45px;
        border-bottom: 1px solid #d8d8d8;
    }
    .block_item_title_t1{
        font-weight: bold;
        color: #333333;
    }
    .block_item_title_t1>div:first-child{
        font-size: 17px;
        float: left;
        margin: 0px 5px 0px 15px;
    }
    .block_item_title_t1>div:last-child{
        font-size: 13px;
        float: right;
        margin-top: 3px;
        margin-right: 15px;
    }
    .block_item_title_t2{
        clear: both;
        color: #666666;
        padding-top: 4px;
    }
    .block_item_title_t2>div:first-child{
        font-size: 12px;
        float: left;
        margin-left: 15px;
    }
    .block_item_title_t2>div:last-child{
        font-size: 12px;
        float: right;
        margin-right: 15px;
    }
    .block_item_con{
        padding-top: 22px;
        padding-bottom: 10px;
    }
    .block_item_con>p{
        margin: 4px 10px;
        font-size: 13px;
        color: #999999;
        line-height: 17px;
    }
    .block_item_con_bottom{
        clear: both;
    }
    .block_item_con_bottom>div:first-child{
        font-size: 12px;
        float: left;
        margin-left: 10px;
        color: #01b38b;
        padding: 4px 0px;
    }
    .block_item_con_bottom>div:last-child{
        font-size: 12px;
        float: right;
        margin-right: 15px;
        border-radius: 12px;
        font-size: 12px;
        color: white;
        background-color: #01B38B;
        padding: 4px 9px;
    }
    .block_finish .block_item_title_t1,.block_finish .block_item_title_t2{
        color: #999999;
    }
    .clearfix:after{
        content: "";
        height: 0;
        line-height: 0;
        display: block;
        visibility: hidden;
        clear: both;
    }
    .clearfix{
        zoom: 1;
    }
</style>

<script>
import {mapGetters, mapActions} from 'vuex';
import DoughnutChart from 'lib/chart/DoughnutChart.js';
import {checkin_on, checkin_off} from 'lib/checkin.js';
import {getDateFilter, getMonthFilter, getWeekStatus} from  'lib/time'
import axios from 'axios';
import moment from 'moment'

export default {
    components: {
      DoughnutChart
    },

    props: {
        lastPage: {
            type: String,
            default: '上一页'
        }
    },

    data() {
        return {
            checkin: [],
            daily: [],
            task: [],
            report: [],
            reportRecord: {},
            reportTemplate: null,
            visit: [],
            dateFilter: null,
            myTimeCard:null,
            journalTemplate: null
        }
    },

    computed: {
        ...mapGetters([
            'myUserId',
            'timeCard',
            'myProfile',
            'myCompany',
            'who',
            'timeRecords',
            'userDepartment',
            'organization'
        ]),
        period(){
            if(!this.reportTemplate){
                return
            }else if(this.reportTemplate.period == 'day'){
                return '(日报)'
            }else if(this.reportTemplate.period == 'week'){
                return '(周报)'
            }else if(this.reportTemplate.period == 'month'){
                return '(月报)'
            }else{
                return ''
            }
        },
        reportStatus(){
            if(this.reportRecord.status == '未读'){
                return '已提交，待通过'
            }else if(this.reportRecord.status == '已读'){
                return '已提交，待通过'
            }else if(this.reportRecord.status == '已驳回'){
                return '已驳回，需要重新提交'
            }else if(this.reportRecord.status == '已确认'){
                return '已完成'
            }else if(this.reportRecord.status == '已撤回'){
                return '已撤回，需要重新提交'
            }else{
                return '未提交'
            }
        }

    },

    mounted() {
        this.dateFilter = getDateFilter();
        // 获取我的打卡时间
        this.myTimeCard = this.timeCard(this.myUserId)
        // 获取我的打卡记录
        this.loadTimeRecord({
            userId: this.myUserId,
            date: (new Date()).toHawkDateString()
        }).then(()=>this.getCheckin())
        this.getDaily()
        this.getTask()
        this.getReportTemplate()
        this.getVisit()
        this.getJournal()
    },
    methods: {
        ...mapActions({
            'loadTimeRecord': 'LOAD_TIMERECORD'
        }),
        getDaily(){
            let filters = {
                createdBefore: this.dateFilter.to.getTime(),
                createdAfter: this.dateFilter.from.getTime()
            };

            $preloader.show();
            axios.get('api/journalmgr/myreport?q=' + JSON.stringify(filters)).then(resp => {
                this.daily = resp.data;
                $preloader.hide();
            }).catch(err => {
                console.error(err);
                $preloader.hide();
            });
        },
        getTask(){
            let filters = {
                // deadlineBefore: this.dateFilter.to.getTime(),
                deadlineAfter: this.dateFilter.from.getTime(),
                executor: this.myProfile._id
            };
            $preloader.show();
            axios.get('api/task/?q=' + JSON.stringify(filters)).then(resp => {
                this.task = resp.data
                $preloader.hide();
            }).catch(err => {
                console.error(err);
                $preloader.hide();
                $alert('无法更新数据，请稍后再试');
            });
        },
        getReportTemplate(){
            let department = this.userDepartment(this.myProfile._id)
            if(department){
                $preloader.show();
                axios.get('api/reporttemplate/?q=' + JSON.stringify({departmentId:department.departmentId})).then(resp => {
                    $preloader.hide();
                    if(resp.data){
                        this.reportTemplate = resp.data
                        this.getReportRecord(resp.data.period, resp.data._id)
                    }
                }).catch(err => {
                    console.error(err);
                    $preloader.hide();
                    $alert('无法更新数据，请稍后再试');
                });
            }
        },
        getReportRecord(unit, template){
            const startTime = moment().startOf(unit).toDate();
            const endTime = moment().endOf(unit).toDate();

            let filters = {
                user: this.myProfile._id,
                template: template,
                startTime: startTime,
                endTime: endTime
            };
            axios.get('api/reportdata/?q=' + JSON.stringify(filters)).then(resp => {
                if(resp.data.length){
                    this.reportRecord = resp.data[0]
                }
            }).catch(err => {
                console.error(err);
                $preloader.hide();
                $alert('无法更新数据，请稍后再试');
            });
        },
        getVisit() {
            $preloader.show();
            axios.get('/api/visit?q=' + JSON.stringify({executor:this.myProfile._id, deadline:{$gte:new Date()}})).then(resp => {
                $preloader.hide();
                this.visit = resp.data;
            }).catch(error => {
                $preloader.hide();
                console.error(error);
                $alert('无法更新数据，请稍后再试', '操作错误');
            })
        },

        getJournal() {
            // let departmentId = this.organization.departmentId;
            let department = this.userDepartment(this.myProfile._id)
            if (department) {

                $preloader.show();

                axios.get('/api/journalset?q=' + JSON.stringify({departmentId:department.departmentId})).then(resp => {
                    $preloader.hide();

                    if (resp.data){
                        this.journalTemplate = resp.data;
                    }

                }).catch(error => {
                    $preloader.hide();
                    console.error(error);
                    $alert('无法更新数据，请稍后再试', '操作错误');
                })
            }
        },

        getCheckin(){
            let list = []
            let now = new Date()
            let date = now.toHawkDateString()
            let timeRecord
            if(
                this.timeRecords.hasOwnProperty(this.myUserId) &&
                this.timeRecords[this.myUserId].hasOwnProperty(date))
            {
                timeRecord = this.timeRecords[this.myUserId][date]
            }else{
                timeRecord = []
            }
            if(!this.isHoliday() && this.isWorkDay()){

                // 上下班打卡
                this.myTimeCard.workTimes.forEach((wt)=>{
                    let checkin,checkout
                    for(let tr in timeRecord){
                        let item = timeRecord[tr]
                        if(item.workTime == wt._id){
                            if(!checkin && (item.type == '上班' || item.type == '迟到')){
                                checkin = item//取列表第一个匹配值
                            }
                            if(item.type == '下班' || item.type == '早退'){
                                checkout =  item //取列表最后匹配值
                            }
                        }
                    }
                    // 漏卡判断
                    if(!checkin){
                        let t = this.toDate(wt.start)
                        t.setHours(t.getHours()+1) //迟到一小时算漏卡，无打迟到卡机会
                        if(t < now){
                            checkin = {type:'漏卡'}
                        }
                    }
                    // 漏卡判断
                    if(!checkout){
                        if(this.toDate(wt.end_range) < now){
                            checkout = {type:'漏卡'}
                        }
                    }
                    list.push({type:'上班', time: wt.start, status:checkin?checkin.type:'无',checkTime:checkin?checkin.time:''})
                    list.push({type:'下班', time: wt.end, status:checkout?checkout.type:'无',checkTime:checkout?checkout.time:''})
                })
            }
            // 外勤打卡
            for(let tr in timeRecord) {
                let item = timeRecord[tr]
                if(item.type=='外勤'){
                    list.push({type:'', time: '', status:'外勤',checkTime:item.time})
                }
                if(item.type=='打卡'){
                    list.push({type:'', time: '', status:'打卡',checkTime:item.time})
                }
            }
            this.checkin = list
        },
        // 假日
        isHoliday() {
            let ret = false;
            this.myCompany.holidays.forEach(h => {
                let holiday = new Date(h);
                if (holiday.toHawkDateString() == (new Date()).toHawkDateString()) {
                    ret = true;
                }
            })
            return ret;
        },

        // 工作日
        isWorkDay() {
            if (!this.myTimeCard) return false;
            let index = (new Date()).getDay();
            index = (index == 0) ? 6 : (index-1);
            return this.myTimeCard.workDays[index];
        },
        // 08:00时间转换Date对象
        toDate(timepoint) {
            let time = timepoint.split(':');
            let d = new Date();
            d.setHours(parseInt(time[0]));
            d.setMinutes(parseInt(time[1]));
            d.setSeconds(0);
            d.setMilliseconds(0);
            return d;
        },
        reportClassStatus(classStatus){
            if(!this.reportRecord.status)return false
            if(classStatus == 'status_error'){
                if(
                    this.reportRecord.status == '已驳回'||
                    this.reportRecord.status == '已撤回'||
                    !this.reportRecord.status
                ){
                    return true
                }else{
                    return false
                }
            }else if(classStatus == 'status_success'){
                if(
                    this.reportRecord.status == '未读'||
                    this.reportRecord.status == '已读'||
                    this.reportRecord.status == '已确认'
                ){
                    return true
                }else{
                    return false
                }
            }
        },
        visitDateil(item){
            this.$f7router.navigate('/client/visitdateil/', {
                props: {
                    visit: item
                }
            });
        },
    }
}
</script>

