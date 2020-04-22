<template>
    <f7-page style="background: #FFFFFF" no-toolbar @page:beforein="load">
        <f7-navbar title="任务管理" back-link>
        </f7-navbar>
    <div class="task-container">
        <div class="list-group">
            <div class="list-group-head">
                <div class="head-title">待进行：<span>{{unstartList.length}}</span></div>
                <div class="head-span" @click="startExpanded = !startExpanded ">{{startExpanded?'收起':'展开'}}</div>
            </div>
            <div class="list-group-body"  >
                <ul type="transition" class="list-group-ul" v-bind:class="{'list-group-ul-no-expanded': (startExpanded == false)||(startExpanded && unstartList.length<3)}">
                    <li class="list-group-item clear-float" v-for="(element,i) in unstartList" :key="element._id"
                        :class="{'very-important':element.priority == '非常紧急','important':element.priority == '紧急'}"
                        @click="jumpTo('/office/taskdetail/',{id:element._id})"
                    >
                        <div>
                            <p class="item-name">{{element.no}}.{{element.type}}</p>
                            <p class="item-time">截止：{{dateFormat(element.deadline)}}</p>

                        </div>
                        <div class="clear-float">
                            <div class="item-content">任务内容：{{element.content}}</div>
                            <div class="item-status" :class="{'item-status-red':element.auditType == '已驳回' || element.auditType == '已延期'}"  v-text="element.auditType"></div>

                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div class="list-group">
            <div class="list-group-head">
                <div class="head-title">进行中：<span>{{proceedList.length}}</span></div>
                <div class="head-span" @click="proceedExpanded = !proceedExpanded ">{{proceedExpanded?'收起':'展开'}}</div>
            </div>
            <div class="list-group-body" >
                <ul name="no" class="list-group-ul" v-bind:class="{'list-group-ul-no-expanded': (proceedExpanded == false)||(proceedExpanded && proceedList.length<3)}">
                    <li class="list-group-item clear-float" v-for="(element,i) in proceedList" :key="element._id"
                        :class="{'very-important':element.priority == '非常紧急','important':element.priority == '紧急'}"
                        @click="jumpTo('/office/taskdetail/',{id:element._id})"
                    >
                        <div>
                            <p class="item-name">{{element.no}}.{{element.type}}</p>
                            <p class="item-time">截止：{{dateFormat(element.deadline)}}</p>

                        </div>
                        <div class="clear-float">
                            <div class="item-content">任务内容：{{element.content}}</div>
                            <div class="item-status" :class="{'item-status-red':element.auditType == '已驳回' || element.auditType == '已延期'}" v-text="element.auditType"></div>

                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div class="list-group">
            <div class="list-group-head">
                <div class="head-title">已完成：<span>{{finishedList.length}}</span></div>
                <div class="head-span" @click="jumpTo('/office/tasklist/',{status:'已完成',title:'已完成', userId: userId})">全部</div>
            </div>
            <div class="list-group-body">
                <ul class="list-group-ul list-group-ul-no-expanded">
                    <li class="list-group-item clear-float" v-for="(element,i) in finishedList" :key="element._id"
                        :class="{'very-important':element.priority == '非常紧急','important':element.priority == '紧急'}"
                        @click="jumpTo('/office/taskdetail/',{id:element._id})"
                    >
                        <div>
                            <p class="item-name">{{element.no}}.{{element.type}}</p>
                            <p class="item-time">截止：{{dateFormat(element.deadline)}}</p>

                        </div>
                        <div class="clear-float">
                            <div class="item-content">任务内容：{{element.content}}</div>
                            <div class="item-status" :class="{'item-status-red':element.auditType == '已驳回' || element.auditType == '已延期'}" v-text="element.auditType"></div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div class="list-group">
            <div class="list-group-head">
                <div class="head-title">未完成：<span>{{unfinishedList.length}}</span></div>
                <div class="head-span" @click="jumpTo('/office/tasklist/',{status:'未完成',title: '未完成', userId: userId})">全部</div>
            </div>
            <div class="list-group-body">
                <ul class="list-group-ul list-group-ul-no-expanded" >
                    <li class="list-group-item clear-float" v-for="(element,i) in unfinishedList" :key="element._id"
                        :class="{'very-important':element.priority == '非常紧急','important':element.priority == '紧急'}"
                        @click="jumpTo('/office/taskdetail/',{id:element._id})"
                    >
                        <div>
                            <p class="item-name">{{element.no}}.{{element.type}}</p>
                            <p class="item-time">截止：{{dateFormat(element.deadline)}}</p>

                        </div>
                        <div class="clear-float">
                            <div class="item-content">任务内容：{{element.content}}</div>
                            <div class="item-status" :class="{'item-status-red':element.auditType == '已驳回' || element.auditType == '已延期'}" v-text="element.auditType"></div>


                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div style="height: 80px"></div>
    </div>
    </f7-page>
</template>


<script>
    import {mapGetters, mapActions} from 'vuex';
    import draggable from "vuedraggable";
    import axios from 'axios';
    import dateFormat from 'lib/dateformat.js';
    const add_img = require("assets/images/btn_oval_add_green@2x.png");

    export default {
        name: "taskself",
        components: {
            draggable
        },
        props: {
            lastPage: {
                type: String,
                default: '上一页'
            },
            userId:{
                type:String,
                default: null,
            }
        },
        data() {
            return {
                unstartList: [],
                proceedList: [],
                finishedList: [],
                unfinishedList: [],
                executor:null,
                records:[],
                add_img:add_img,
                editable: true,
                startExpanded:false,
                proceedExpanded:false,
            };
        },
        methods: {
            jumpTo(path, properties) {
                this.$f7router.navigate(path, {
                    props: properties
                });
            },
            load() {
                var self = this;
                let filters = {executor:this.executor};
                $preloader.show();
                axios.get('api/task?q=' + JSON.stringify(filters)).then(resp => {
                    self.unstartList = [];
                    self.proceedList = [];
                    self.finishedList = [];
                    self.unfinishedList = [];
                    let list = deepCopy(resp.data);
                    list.forEach((val)=>{
                        switch (val.status) {
                            case '待进行': self.unstartList.push(val);break;
                            case '进行中': self.proceedList.push(val);break;
                            case '已完成': self.finishedList.push(val);break;
                            case '未完成': self.unfinishedList.push(val);break;
                        }
                    })
                    this.$forceUpdate
                    $preloader.hide();
                }).catch(err => {
                    console.error(err);
                    $preloader.hide();
                    $alert('无法更新数据，请稍后再试', '操作错误');
                });
            },
            dateFormat(date){
                return dateFormat(date,'mm-dd HH:MM');
            },
        },
        created(){
            if (!this.userId){
                this.executor = this.myProfile._id;
            }else {
                this.executor = this.userId;
            }
        },
        computed: {
            ...mapGetters([
                'myProfile'
            ]),
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

    }
    .very-important{
        border-left: 3px solid #FF715A;
    }
    .important{
        border-left: 3px solid #FF9800;
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
    .item-status-red{
        color: #FF715A !important;
    }
    .list-group-item i {
        cursor: pointer;
    }
    .add-button{
        position: fixed;
        bottom: 80px;
        right: 20px;
        width:55px;
        height:55px;

    }
    .add-button span{
        display: inline-block;
        padding: 0px;
        margin-top: 11px;
        line-height: 22px;
        font-size: 22px;
        color: #FFFFFF;
    }
</style>
