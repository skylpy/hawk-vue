<template>
    <div style="background: #FFFFFF" >
            <div class="tips">
                <f7-icon f7="info" size="12px" style="margin-top: -2px"></f7-icon>
                记得要及时点击处理第二栏的任务结果哦
            </div>
            <div class="task-container">
                <div class="list-group">
                    <div class="list-group-head">
                        <div class="head-title">员工任务进行中：<span>{{proceedList.length}}</span></div>
                        <div class="head-span" @click="startExpanded = !startExpanded ">{{startExpanded?'收起':'展开'}}</div>
                    </div>
                    <div class="list-group-body"  >
                        <ul type="transition" class="list-group-ul" v-bind:class="{'list-group-ul-no-expanded': (startExpanded == false)||(startExpanded && proceedList.length<3)}">
                            <li class="list-group-item clear-float" v-for="(element,i) in proceedList" :key="element._id"
                                :class="{'very-important':element.priority == '非常紧急','important':element.priority == '紧急'}"
                                @click="jumpTo('/office/taskdetail/',{id:element._id})"
                            >
                                <div>
                                    <p class="item-name">{{element.no}}.{{element.type}}</p>
                                    <p class="item-time">截止：{{dateFormat(element.deadline)}}</p>
                                </div>
                                <div class="clear-float">
                                    <div class="item-executor">办理人：{{who(element.executor) && who(element.executor).name}}</div>

                                    <div class="item-status" :class="{'item-status-red':element.auditType == '已驳回' || element.auditType == '已延期'}"  v-text="element.status"></div>

                                    <div class="item-status"></div>

                                </div>
                                <div class="clear-float">
                                    <div class="item-content">任务内容：{{element.content}}</div>
                                    <div class="item-status" :class="{'item-status-red':element.auditType == '已驳回' || element.auditType == '已延期'}" v-if="element.auditType != '未审核'" v-text="element.auditType"></div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="list-group">
                    <div class="list-group-head">
                        <div class="head-title">任务结果待处理：<span>{{unauditList.length}}</span></div>
                        <div class="head-span" @click="proceedExpanded = !proceedExpanded ">{{proceedExpanded?'收起':'展开'}}</div>
                    </div>
                    <div class="list-group-body" >
                        <ul name="no" class="list-group-ul" v-bind:class="{'list-group-ul-no-expanded': (proceedExpanded == false)||(proceedExpanded && unauditList.length<3)}">
                            <li class="list-group-item clear-float" v-for="(element,i) in unauditList" :key="element._id"
                                :class="{'very-important':element.priority == '非常紧急','important':element.priority == '紧急'}"
                                @click="jumpTo('/office/taskdetail/',{id:element._id})"
                            >
                                <div>
                                    <p class="item-name">{{element.no}}.{{element.type}}</p>
                                    <p class="item-time">截止：{{dateFormat(element.deadline)}}</p>

                                </div>
                                <div class="clear-float">
                                    <div class="item-executor">办理人：{{who(element.executor) && who(element.executor).name}}</div>
                                    <div class="item-status" v-if="element.status == '未完成'||element.status == '已完成'" :class="getItemStatusClass(element)"  v-text="element.status"></div>
                                    <div class="item-status" v-else-if="new Date(element.deadline) < new Date()" :class="getItemStatusClass(element)"  v-text="'已超时'"></div>

                                </div>
                                <div class="clear-float">
                                    <div class="item-content">任务内容：{{element.content}}</div>
                                    <div class="item-status"></div>

                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="list-group">
                    <div class="list-group-head">
                        <div class="head-title">任务已审批：<span>{{auditedList.length}}</span></div>
                        <div class="head-span" @click="jumpTo('/office/tasklist/',{auditType:'已审批',title: '任务已审批'})">全部</div>
                    </div>
                    <div class="list-group-body">
                        <ul name="no" class="list-group-ul list-group-ul-no-expanded">
                            <li class="list-group-item clear-float" v-for="(element,i) in auditedList" :key="element._id"
                                :class="{'very-important':element.priority == '非常紧急','important':element.priority == '紧急'}"
                                @click="jumpTo('/office/taskdetail/',{id:element._id})"
                            >
                                <div>
                                    <p class="item-name">{{element.no}}.{{element.type}}</p>
                                    <p class="item-time">截止：{{dateFormat(element.deadline)}}</p>

                                </div>
                                <div class="clear-float">
                                    <div class="item-executor">办理人：{{who(element.executor) && who(element.executor).name}}</div>
                                    <div class="item-status" v-if="element.status == '未完成'||element.status == '已完成'" :class="getItemStatusClass(element)"  v-text="element.status"></div>
                                    <div class="item-status" v-else-if="new Date(element.deadline) < new Date()" :class="getItemStatusClass(element)"  v-text="'已超时'"></div>
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
        <!--<div class="add-button" @click="add">-->
                <!--<img :src="add_img" width="55px" height="55px">-->
        <!--</div>-->
    </div>
</template>


<script>
    import {mapGetters, mapActions} from 'vuex';
    import draggable from "vuedraggable";
    import axios from 'axios';
    import dateFormat from 'lib/dateformat.js';
    const add_img = require("assets/images/btn_oval_add_green@2x.png");
    const message = [
        "vue.draggable",
        "draggable",
        "component",
        "for",
        "vue.js 2.0",
        "based",
        "on",
        "Sortablejs"
    ];

    export default {
        name: "taskmanager",
        components: {
            draggable
        },
        props: {
            lastPage: {
                type: String,
                default: '上一页'
            },
        },
        data() {
            return {
                proceedList: [],
                unauditList: [],
                auditedList: [],
                startExpanded:false,
                proceedExpanded:false,
                add_img:add_img,
            };
        },
        methods: {
            jumpTo(path, properties) {
                this.$f7router.navigate(path, {
                    props: properties
                });
            },
            changeData(evt,model){
                if (evt['added']){
                    var task = evt['added'].element;
                    task.status = model;
                    task.auditType = '';

                    let url = 'api/task/' + task._id;
                    $preloader.show();
                    axios.put(url, task).then(resp => {
                        $preloader.hide();
                    }).catch(error => {
                        $preloader.hide();
                        console.error(error);
                        $alert('提交失败，请稍后再试', '操作失败');
                    })
                }
            },
            onMove({ relatedContext, draggedContext }) {
                if (draggedContext.element.auditType == '已审批')return false;
                const relatedElement = relatedContext.element;
                const draggedElement = draggedContext.element;
                return (
                    (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
                );
            },

            load() {

                var self = this;
                let filters = {executor: this.pList.map(v => v._id)};
                $preloader.show();
                axios.get('/api/task/taskmanager?q=' + JSON.stringify(filters)).then(resp => {
                    self.proceedList = resp.data.proceedList.filter(v => v.executor !== this.myUserId);
                    self.unauditList = resp.data.unauditList.filter(v => v.executor !== this.myUserId);
                    self.auditedList = resp.data.auditedList.filter(v => v.executor !== this.myUserId);
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
            getItemStatusClass(task){
                if (task.status == '已完成')  return {'item-status-green':true};
                if (task.status == '未完成')  return {'item-status-red':true};
                if (new Date(task.deadline) < new Date())  return {'item-status-orange':true};
            }
        },
        mounted(){
            // this.load()
        },
        computed: {
            ...mapGetters([
                'hasUpdateTask',
                'superAdmin',
                'who',
                'myProfile',
                'myUserId',
                'userDepartment',
                'personnel'
            ]),
            IamSuperAdmin(){
                if (this.myProfile._id && this.superAdmin ){
                    return this.superAdmin._id == this.myProfile._id
                }
            },
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
    .clearfix:after{content:"";display:block;clear:both;}
    .clearfix{zoom:1;}
    .page-context{
        overflow: auto;
        -webkit-overflow-scrolling: touch;
        box-sizing: border-box;
        height: 100%;
        position: relative;
        z-index: 1;
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
        height:83px;
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
    .list-group-item .item-executor{
        float: left;
        margin: 0px;
        font-size:12px;
        line-height: 20px;
        color:#333;
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
        line-height: 20px;
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
        line-height: 20px;
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
    .item-status-green{
        color: #01B38B !important;
    }
    .item-status-orange{
        color: #F5A623 !important;
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
        z-index: 99;
    }
    .add-button span{
        display: inline-block;
        padding: 0px;
        margin-top: 11px;
        line-height: 22px;
        font-size: 22px;
        color: #FFFFFF;
    }
    .page-toolbar{
        position: fixed;
        background: #FFFFFF;
        bottom: 0px;
        width: 100%;
        height: 49px;
        box-shadow:0px 0px 5px 0px rgba(0,0,0,0.15);
    }
    .toolbar-btn{
        float: left;
        width: 50%;
    }
    .toolbar-btn img{
        display: block;
        margin: 5px auto 0px auto;
    }
    .toolbar-btn p{
        font-size: 12px;
        color: #CDCDCD;
        text-align: center;
        margin: 0;
        padding: 0;
    }
</style>
