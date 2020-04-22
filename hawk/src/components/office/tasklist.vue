<template>
    <f7-page style="background: #FFFFFF" @page:beforein="reload">
        <f7-navbar :title="title" back-link>
            <f7-nav-right>
                <f7-link @click="$f7.popup.open('#task-search')">详细搜索</f7-link>
            </f7-nav-right>
        </f7-navbar>

    <div class="task-container">
        <div class="list-group">
            <div class="list-group-head">
                <div class="head-title">{{title}}：<span>{{taskList.length}}</span></div>
            </div>
                <ul type="transition" class="list-group-ul">
                    <li class="list-group-item clear-float" v-for="(element,i) in taskList" :key="element._id"
                        :class="{'very-important':element.priority == '非常紧急','important':element.priority == '紧急'}"
                        @click="jumpTo('/office/taskdetail/',{id:element._id})"
                    >
                        <div>
                            <p class="item-name">{{element.no}}.{{element.type}}</p>
                            <p class="item-time">截止：{{dateFormat(element.deadline)}}</p>

                        </div>
                        <div class="clear-float">
                            <div class="item-content">任务内容：{{element.content}}</div>
                            <div class="item-status" :class="getItemStatusClass(element)">{{element.status}}</div>

                        </div>
                    </li>
                </ul>
        </div>
    </div>
        <f7-popup id="task-search">
            <task-search
                    @submit="search"
                    @cancel="$f7.popup.close('#task-search')"
            ></task-search>
        </f7-popup>
    </f7-page>
</template>


<script>
    import {mapGetters, mapActions,mapMutations} from 'vuex';
    import draggable from "vuedraggable";
    import taskSearch from "./tasksearch"
    import dateFormat from 'lib/dateformat.js';
    import axios from 'axios';
    export default {
        name: "hello",
        components: {
            draggable,
            taskSearch

        },
        props: {
            lastPage: {
                type: String,
                default: '上一页'
            },
            status:{
                type:String,
                default: null
            },
            auditType:{
                type:String,
                default:null,
            },

            title: {
                type:String,
                default:'任务列表'
            },
            userId: {
                type: String
            }
        },
        data() {
            return {
                taskList: [],
                filters:null,
                searchFilters:{},
            };
        },
        methods: {
            ...mapMutations([
                'setHasUpdateTask'
            ]),
            search(filters){
                this.searchFilters = filters;
                this.load();
                $f7.popup.close('#task-search')
            },
            load() {
                let self = this;
                let obj = deepCopy(this.filters);
                for (let key in this.searchFilters){
                    if (this.searchFilters[key]){
                        obj[key] = this.searchFilters[key];
                    }
                }
                $preloader.show();
                if (this.myUserId == this.superAdmin._id && !this.userId) {
                    let filters = {executor: this.pList.map(v => v._id)};
                    axios.get('/api/task/taskmanager?q=' + JSON.stringify(filters)).then(resp => {
                        self.taskList = [];
                        self.taskList= deepCopy(resp.data.auditedList);
                        this.$forceUpdate
                        $preloader.hide();
                    }).catch(err => {
                        console.error(err);
                        $preloader.hide();
                        $alert('无法更新数据，请稍后再试', '操作错误');
                    });
                } else {
                    obj.executor = this.userId || this.myUserId;
                    axios.get('api/task?q=' + JSON.stringify(obj)).then(resp => {
                        self.taskList = [];
                        if (self.auditType) {
                            self.taskList= resp.data.filter(v => v.executor !== this.myUserId);
                        } else {
                            self.taskList= resp.data;
                        }
                        this.$forceUpdate
                        $preloader.hide();
                    }).catch(err => {
                        console.error(err);
                        $preloader.hide();
                        $alert('无法更新数据，请稍后再试', '操作错误');
                    });
                }
            },
            reload(){
                if (this.hasUpdateTask) {
                    this.load()
                    this.setHasUpdateTask(false)
                }
            },

            jumpTo(path, properties) {
                this.$f7router.navigate(path, {
                    props: properties
                });
            },
            dateFormat(date){
                return dateFormat(date,'mm-dd HH:MM');
            },
            getItemStatusClass(task){
                if (task.status == '已完成')  return {'item-status-green':true};
                if (task.status == '未完成')  return {'item-status-red':true};
                if (new Date(task.deadline) < new Date())  return {'item-status-orange':true};
            }
        },
        mounted(){
            this.filters = {};
            if (this.status){
                this.filters.status=this.status;
            }
            if (this.auditType){
                this.filters.auditType = this.auditType;
            }
            this.load()
        },
        computed: {
            ...mapGetters([
                'who',
                'hasUpdateTask',
                'myUserId',
                'superAdmin',
                'personnel',
                'userDepartment'
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

                return this.personnel.filter(p => subordinates.includes(p._id))
            }
        },
        watch: {
        }
    };
</script>

<style scoped>
    ul,li{
        margin: 0;
        padding: 0;
    }
    .clear-float {
        clear:both;
        height: 0;
        line-height: 0;
        font-size: 0;
    }
    .task-container{
        width: 86%;
        margin: 0 auto;
    }
    .tips{
        height:35px;
        background:rgba(255,245,228,1);
        color: #F96A0E;
        font-size: 13px;
        line-height: 35px;
        padding-left: 15px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;/*文本不换行*/
    }

    .list-group {
        width:100%;
        margin-top: 15px;
        background:rgba(245,245,245,1);
        border-radius:4px;
        border:1px solid rgba(220,220,220,1);
        padding-left: 15px;
        padding-right: 15px;
        box-sizing: border-box;
    }
    .list-group-body{
    }
    .list-group-body .list-group-ul{
        /*height:200px;*/
        overflow: auto;
    }
    .list-group-ul-no-expanded{
        height:200px;
    }

    .list-group-head{
        height: 32px;
        font-size: 14px;
        line-height: 32px;
    }
    .list-group-head .head-title{
        float: left;
        font-size:14px;
        font-weight:500;
        color:rgba(51,51,51,1);
    }
    .list-group-head .head-span{
        float: right;
        color:rgba(1,179,139,1);
        font-size:13px;
        font-weight:500;
    }
    .list-group-item {
        list-style: none;
        width:100%;
        height:66px;
        background:rgba(255,255,255,1);
        box-shadow:0px 2px 8px 0px rgba(0,0,0,0.09);
        border-radius:4px;
        margin-bottom: 10px;
        padding: 10px 15px 10px 15px;
        box-sizing: border-box;
        /*cursor: move;*/
        border-left: 3px solid #FF715A;
    }
    .list-group-item .item-name{
        float: left;
        margin: 0px;
        font-size:14px;
        line-height: 24px;
        font-weight:500;
        color:rgba(51,51,51,1);
    }
    .list-group-item .item-time{
        float: right;
        font-size:11px;
        font-weight:500;
        color:rgba(51,51,51,1);
    }
    .list-group-item .item-content{
        float: left;
        width: 80%;
        line-height: 30px;
        font-size:12px;
        text-overflow: ellipsis;
        color:rgba(153,153,153,1);
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;/*文本不换行*/
    }
    .list-group-item .item-status{
        float: right;
        width: 20%;
        line-height: 30px;
        font-size:12px;
        text-overflow: ellipsis;
        color:rgba(153,153,153,1);
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;/*文本不换行*/
        text-align: right;
    }
    .list-group-item i {
        cursor: pointer;
    }
    .item-status-red{
        color: #FF715A !important;
    }
    .item-status-green{
        color: #01B38B !important;
    }
    .item-status-orange{
        color: #F5A623 !important;
    }
</style>
