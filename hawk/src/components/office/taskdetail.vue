<template>
    <f7-page  style="background: #f8f8f8" @page:reinit="load" >
        <f7-navbar :title="title"  back-link>
            <f7-nav-right>
                <f7-link v-if="hasPermission" @click="jumpTo('/office/task/',{taskId: task._id })">编辑</f7-link>
            </f7-nav-right>
        </f7-navbar>

        <vodal class="date-modal" :show="dateDialog" animation="zoom" measure="px" :width=250 :height=150 :closeButton=false>
            <div class="modal-title">选择截止时间</div>
            <div class="modal-form">
                <date-picker v-model="newDeadline" type="datetime"
                             :editable="false"
                             class="mx-input"
                             width="200px"
                             :not-before="new Date()"
                             :confirm="true"
                             :confirm-text="'确定'"
                             placeholder="   请选择截止时间"
                             format="YYYY-MM-DD HH:mm" :minute-step="30"
                             :first-day-of-week="1"
                ></date-picker>
            </div>
            <div class="modal-button">
                <div class="modal-cancel" @click="dateDialog=false">取消</div>
                <div class="modal-save" @click="saveNewDeadline">保存</div>
            </div>
        </vodal>
        <div class="tips">
            <f7-icon f7="info" size="12px" style="margin-top: -2px"></f7-icon>
            任务完成后，记得拖拉到“已完成”后再填写任务总结
        </div>
        <div class="menu">
            <div class="menu-item" @click="tab = 'detail'" v-bind:class="{active:tab == 'detail'}">任务详情</div>
            <div class="menu-item" @click="tab = 'summarize'" v-bind:class="{active:tab == 'summarize'}">任务总结</div>
        </div>
        <div v-show="tab=='detail'" class="task-content">
            <ul class="form-list">
                <li class="list-item clear-float">
                    <span class="item-name">办理人：</span>
                    <span class="item-value">{{who(task.executor) && who(task.executor).name}}</span>
                </li>
                <li class="list-item clear-float">
                    <span class="item-name">任务状态：</span>
                    <span class="item-value" v-if="isOverTime" v-text="'已超时'"></span>
                    <span class="item-value" v-else v-text="task.status"></span>
                </li>
                <li class="list-item clear-float" v-show="task.auditType && task.auditType != '未审核'">
                    <span class="item-name">审核状态：</span>
                    <span class="item-value" v-text="task.auditType"></span>
                </li>
                <li class="list-item clear-float" v-show="task.auditType && task.auditType=='已驳回'">
                    <span class="item-name">驳回原因：</span>
                    <span class="item-value" v-text="task.notes"></span>
                </li>
                <li class="list-item clear-float">
                    <span class="item-name">任务编号：</span>
                    <span class="item-value" v-text="task.no"></span>
                </li>
                <li class="list-item clear-float">
                    <span class="item-name">任务类型：</span>
                    <span class="item-value" v-text="task.type">企业任务</span>
                </li>
                <li class="list-item clear-float">
                    <span class="item-name">创建时间：</span>
                    <span class="item-value" v-text="new Date(task.createdAt).toLocaleString()">2018-12-13 11:00</span>
                </li>
                <li class="list-item clear-float">
                    <span class="item-name">截止时间：</span>
                    <span class="item-value" v-text="new Date(task.deadline).toLocaleString()">2018-12-13 11:00</span>
                </li>
                <li class="list-item clear-float">
                    <span class="item-name">任务级别：</span>
                    <span class="item-value" v-text="task.priority">非常紧急</span>
                </li>
                <li class="list-item clear-float item-content">
                    <span class="item-name">任务内容：</span>
                    <div class="item-value" v-text="task.content">非常紧急非常紧急非常紧急非常紧急非常紧急非常紧急非常紧急非常紧急非常紧急非常紧急非常紧急非常紧急非常紧急非常紧急</div>
                </li>
                <li class="list-item clear-float item-content">
                    <span class="item-name">相片：</span>
                    <div class="item-value">
                        <photoeditor
                                slot="inner"
                                :gallery="true"
                                :photos="task.photo"
                                :readonly="true"
                        ></photoeditor>
                    </div>
                </li>
            </ul>
            <div class="cancel" v-show="hasPermission && task.auditType != '已审批' && task.status !== '已完成'" @click="remove">取消任务</div>
            <div class="audit" v-show="hasPermission && (showAudit||isOverTime)" @click="auditSelecter">任务结果处理</div>
        </div>
        <div v-show="tab=='summarize'&&!task.summarized" class="task-content">
            <div v-if="task.executor == myProfile._id">
                <ul class="form-list">

                    <li class="list-item clear-float">
                        <span class="item-name">完成时间：</span>
                        <span class="item-value" v-text="task.finishAt && new Date(task.finishAt).toLocaleString()"></span>
                    </li>
                    <li class="list-item clear-float item-content">
                        <span class="item-name">相片：</span>
                        <div class="item-value">
                            <photoeditor
                                    v-if="task.status == '已完成'"
                                    slot="inner"
                                    :gallery="true"
                                    :photos="task.summaryPhoto"
                                    @photo:update="(photos) => {task.summaryPhoto = photos}"
                            ></photoeditor>
                            <img  v-else width="60px" height="60px" content="无图片上传">
                        </div>
                    </li>
                    <li class="list-item clear-float item-content">
                        <span class="item-name">任务总结：</span>
                        <textarea   placeholder="请填写任务总结" v-model="task.summary" v-bind:readonly="task.status != '已完成'"></textarea>
                    </li>

                </ul>
                <div class="save-btn">
                    <f7-button v-if="task.status == '已完成'&&!task.summarized" class="hawk-button" big-ios  @click="submitSummary">保存</f7-button>
                    <f7-button v-if="task.status != '已完成'" class="color-gray" big-ios fill >保存</f7-button>
                </div>
            </div>
            <div v-else class="no_data">
                <img src="../../assets/images/ill_no_data@2x.png" width="71px" height="84px">
                <p>暂无数据</p>
            </div>

        </div>
        <div v-show="tab=='summarize'&&task.summarized" class="task-content">
            <ul class="form-list">

                <li class="list-item clear-float">
                    <span class="item-name">完成时间：</span>
                    <span class="item-value" v-text="new Date(task.finishAt).toLocaleString()"></span>
                </li>
                <li class="list-item clear-float item-content">
                    <span class="item-name">相片：</span>
                    <div class="item-value">
                        <photoeditor
                                slot="inner"
                                :gallery="true"
                                :photos="task.summaryPhoto"
                                :readonly="true"
                        ></photoeditor>
                    </div>
                </li>
                <li class="list-item clear-float item-content">
                    <span class="item-name">任务总结：</span>
                    <textarea   placeholder="请填写任务总结" v-model="task.summary" readonly="readonly"></textarea>
                </li>

            </ul>

        </div>

    </f7-page>
</template>

<script>
    import {mapGetters,mapMutations,mapActions} from 'vuex';
    import Vodal from 'vodal';
    import DatePicker from 'vue2-datepicker'
    import photoeditor from 'gadget/photoeditor.vue';
    import {upload, getSignUrl} from 'lib/aliyun';
    import {uniquePageId} from 'lib/utils';
    import axios from 'axios';
    import {defaultImgUrl} from 'lib/loading';
    export default {
        components:{
            Vodal,
            photoeditor,
            DatePicker
        },
        props: {
            lastPage: {
                type: String,
                default: '上一页'
            },
            title: {
                type: String,
                default: '任务详情'
            },
            id:{
                type:String
            }
        },

        data: () => {
            return {
                tab:"detail",
                dateDialog:false,
                newDeadline:new Date(),
                hasPermission:false,
                task:{
                    applicant: '',
                    summaryPhoto:[],
                    executor: null,
                    type: '',
                    deadline: null,
                    content: '',
                    photo: [],
                    priority: '',
                    no:null,
                    status:''
                },
            }
        },

        mounted: function() {
             this.load();
        },
        created(){
        },
        watch:{
        },
        computed:{
            ...mapGetters([
                'myCompany',
                'myProfile',
                'hasUpdateTask',
                'who'
            ]),

            showAudit(){
                let status = this.task.status;
                if (this.task.auditType == '已审批'){
                    return false;
                }
                if (status == '已完成'||status == '未完成' || status == '已超时'){
                    return true
                }
                return false;
            },
            isOverTime(){
                let status = this.task.status;
                if (status == '待进行' || status == '进行中'){
                    if (new Date(this.task.deadline) < new Date()){
                        return true
                    }

                }
                return false;
            }

        },
        methods: {
            ...mapMutations([
                'setHasUpdateTask'
            ]),
            auth(){
                let self = this;
                axios.get('api/task/auth/'+this.task._id).then(resp => {
                    if (resp.data){
                        self.hasPermission = true
                    }
                });
            },
            load(){
                let self = this;
                if (self.id){
                    $preloader.show();
                    axios.get('api/task/' + self.id).then(resp => {
                        if (resp.data) {
                            self.task = resp.data;
                            self.newDeadline = self.task.deadline;
                            self.auth();
                            $preloader.hide();
                            self.$forceUpdate();
                        } else {
                            $preloader.hide();
                            $confirm('该任务已经被删除？', '操作确认', () => {
                                this.$f7router.back()
                            }, () => {
                                this.$f7router.back()
                            })
                        }
                    }).catch(err => {
                        console.error(err);
                        $preloader.hide();
                        $alert('无法更新数据，请稍后再试');
                    });
                }
            },
            getImageUrl(img){
                getSignUrl(img, (ret) => {
                    if (ret instanceof Error) {
                        return '#';
                    } else {
                        return ret;

                    }
                });
            },
            saveNewDeadline(){
                let self = this;
                this.audit(self.task.status,"已延期","确认将该任务延期吗？")
            },
            submitSummary(){
                let self = this;
                var task = self.task;
                task.summarized = true;
                let url = 'api/task/' + task._id;
                $preloader.show();
                axios.put(url, task).then(resp => {
                    $preloader.hide();
                    self.load();
                    self.task.summarized = true;
                    this.$forceUpdate()
                    self.setHasUpdateTask(true)
                    $alert('保存成功', '提示');
                }).catch(error => {
                    $preloader.hide();
                    console.error(error);
                    $alert('提交失败，请稍后再试', '操作失败');
                })
            },
            jumpTo(path, properties) {
                this.$f7router.navigate(path, {
                    props: properties
                });
            },
            audit(status,auditType,msg){
                let self = this;
                let param = {
                    id:self.task._id,
                    status: status,
                    auditType: auditType,
                    notes:self.task.notes,
                    deadline : self.newDeadline
                }

                if (auditType == '已驳回') {
                    $dialog.prompt('请填写驳回原因', '驳回原因', val => {
                        param.notes = val;
                        _save(param)
                    });
                }else {
                    $confirm(msg,"确认操作",()=>{_save(param)})
                }
                let _save = function(param){
                    let url = 'api/task/updateAuditType' ;
                    $preloader.show();
                    axios.put(url, param).then(resp => {
                        self.$set(self.task,'auditType',param.auditType);
                        self.$set(self.task,'status',param.status);
                        self.$set(self.task,'notes',param.notes);
                        self.$set(self.task,'deadline',param.deadline);
                        self.setHasUpdateTask(true)
                        self.$forceUpdate()
                        $preloader.hide();
                        self.dateDialog = false;
                    }).catch(error => {
                        $preloader.hide();
                        console.error(error);
                        $alert('提交失败，请稍后再试', '操作失败');
                    })
                }

            },
            remove(){
                let self = this;
                $confirm("确认要取消该任务吗？","确认操作",()=>{
                    var task = self.task;
                    $preloader.show();
                    axios.delete( 'api/task/' + task._id).then(resp => {
                        $preloader.hide();
                        $alert('取消成功', '提示');
                        self.setHasUpdateTask(true)
                        this.$f7router.back();
                    }).catch(error => {
                        $preloader.hide();
                        console.error(error);
                        $alert('提交失败，请稍后再试', '操作失败');
                    })
                })
            },
            auditSelecter(){
                let self = this;
                let params = {};
                switch (self.task.status) {
                    case "已完成":
                        params = {
                            title: '员工的任务"已完成"',
                            buttons: [
                                {text: '通过', color:'black', bold:true, onClick:function (){self.audit("已完成","已审批","确认审批通过该任务？")}},
                                {text: '标记未完成', color:'black', bold:true, onClick:function (){self.audit("未完成","已审批","确认将该任务标记成未完成")}},
                                {text: '驳回', color:'black', bold:true, onClick:function (){self.audit("进行中","已驳回")}},
                                {text: '取消', color:'red',},
                            ],
                            verticalButtons: true,
                        };
                        break;
                    case "未完成":
                        params = {
                            title: '员工的任务"未完成"',
                            buttons: [
                                {text: '通过', color:'black', bold:true, onClick:function (){self.audit("未完成","已审批","确认审批通过该任务？")}},
                                {text: '延时让其完成', color:'black', bold:true, onClick:function (){self.audit("进行中","已延期","确认审批将该任务延期？")}},
                                {text: '驳回', color:'black', bold:true, onClick:function (){self.audit("进行中","已驳回")}},
                                {text: '取消', color:'red',},
                            ],
                            verticalButtons: true,
                        };
                        break;
                }
                if (this.isOverTime){
                    params = {
                        title: '员工的任务"已超时"',
                        buttons: [
                            {text: '标记为已完成', color:'black', bold:true, onClick:function (){self.audit("已完成","已审批","确认将该任务标记为已完成？")}},
                            {text: '标记为未完成', color:'black', bold:true, onClick:function (){self.audit("未完成","已审批","确认将该任务标记成未完成？")}},
                            {text: '延时让其完成', color:'black', bold:true, onClick:function (){self.dateDialog = true}},
                            {text: '取消', color:'red',},
                        ],
                        verticalButtons: true,
                    };
                }
                $dialog.create(params).open();
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
        font-size: 13px;
        line-height: 35px;
        padding-left: 15px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;/*文本不换行*/
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
    .task-content{
        width: 100%;
        margin-top: 10px;
        padding-bottom: 60px;
        box-sizing: border-box;
    }
    .form-list{
        background: #FFFFFF;
    }
    .form-list .list-item{
        background: #FFFFFF;
        width: 100%;
        height: 46px;
        font-size: 14px;
        line-height: 46px;
        border-bottom: 1px solid #D8D8D8;
        padding-left: 15px;
        box-sizing: border-box;
    }
    .list-item .item-name{
        left: 0px;
        color: #666;
        text-align: left;
    }
    .form-list .item-content{
        height: unset;
    }

    .list-item .item-value{
        float: right;
        color: #333;
        text-align: right;
        font-weight: 500;
        margin-right: 15px;
    }
    .item-content .item-name{
        display: inline-block;
        width: 100%;
        box-sizing: border-box;
    }
    .item-content .item-value{
        float: unset;
        text-align: left;
        margin: -5px 15px 15px 15px;
        line-height: 20px!important;
    }
    .item-value img{
        margin-left: 10px;
    }
    .item-content textarea{
        width: 100%;
        height: 150px;
        background:none;
        outline:none;
        border:0px;
        float: unset;
        font-size: 14px;
        line-height: 1.5em;
        margin-top: -10px;
        padding:0px 15px 15px 15px;
        box-sizing: border-box;
        color: #333;
    }
    .save-btn{
        width: 85%;
        margin: 15px auto;
    }
    .cancel{
        width: 100%;
        height: 45px;
        margin-top: 10px;
        font-size: 14px;
        line-height: 45px;
        color: #ff715a;
        text-align: center;
        background: #FFFFFF;
    }
    .audit{
        width: 100%;
        height: 45px;
        margin-top: 15px;
        font-size: 14px;
        line-height: 45px;
        color: #fff;
        text-align: center;
        background: #01B38B;
    }
    .date-modal{
        /*position: relative;*/
    }
    .modal-title{
        text-align: center;
        font-weight: 500;
        font-size: 18px;
        color: #333;
    }
    .modal-form{
        /*margin-top: 10px;*/
        width: 200px;
        margin: 10px auto 10px auto;
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
    .no_data{
        text-align: center;
        margin: 120px 0px auto;
    }
    .no_data p{
        font-size: 14px;
        color: #333333;
        margin: 5px 0;
    }
</style>
