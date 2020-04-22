<template>
    <f7-page style="background: #f8f8f8"  :id="pageId">
        <f7-navbar :title="title">
            <f7-nav-right>
                <f7-link href="#" @click="$f7router.back()">取消</f7-link>
            </f7-nav-right>
        </f7-navbar>
        <div>
            <ul class="form-list">
                <li class="list-item clear-float">
                    <span class="item-icon">*</span>
                    <label>任务编号：</label>
                    <input class="item-input"
                           readonly
                           :input-id = "`type`"
                           type="text"
                           placeholder="请选择"
                           :value="task.taskNumber='R'+(new Date()).getTime()"
                            />
                </li>

                <li class="list-item clear-float">
                    <span class="item-icon">*</span>
                    <label>任务类型：</label>
                    <input class="item-input"
                           :input-id = "`type`"
                           type="text"
                           placeholder="选择类型"
                           readonly
                           :value="task.type"
                           @click="openTypePicker($event)"/>
                </li>

                <li class="list-item clear-float">
                    <span class="item-icon">*</span>
                    <label>任务等级：</label>
                    <input class="item-input"
                           :input-id = "`priority`"
                           type="text"
                           placeholder="选择等级"
                           readonly
                           :value="task.priority"
                           @click="openPriorityPicker($event)"/>
                </li>
                <li class="list-item clear-float">
                    <span class="item-icon">*</span>
                    <label>办理人：</label>
                    <input v-if="userId !=null || taskId != null" class="item-input" placeholder="请选择" :value="(task.executor && who(task.executor).name)" readonly></input>
                    <input v-else class="item-input" placeholder="请选择" :value="(task.executor && who(task.executor).name)" readonly @click="selectorPersonnelShow=true"></input>

                </li>
                <li class="list-item clear-float">
                    <span class="item-icon">*</span>
                    <label>截止时间：</label>
                    <date-picker v-model="task.deadline " type="datetime"
                                 :editable="false"
                                 class="date-picker"
                                 width="150px"
                                 :confirm="true"
                                 :not-before="new Date()"
                                 :confirm-text="'确定'"
                                 placeholder="   请选择截止时间"
                                 :readonly="'disabled'"
                                 format="YYYY-MM-DD HH:mm" :minute-step="30"
                                 :first-day-of-week="1"></date-picker>
                </li>
                <li class="list-item clear-float textarea-item">
                    <span class="item-icon">*</span>
                    <label>任务内容：</label>
                    <textarea  placeholder="请填写任务内容" v-model="task.content"></textarea>
                </li>
                <li class="list-item clear-float photo-item">
                    <span class="item-icon"> </span>
                    <label>相片：</label>
                    <photoeditor
                            slot="inner"
                            :gallery="true"
                            :photos="task.photo"
                            @photo:update="(photos) => {task.photo = photos}"
                    ></photoeditor>
                </li>
            </ul>
            <div class="submit-button" @click="submit">提交</div>
            <!--<div class="clear-float" style="height: 200px">sssss</div>-->
        </div>

        <f7-popup  :opened="selectorPersonnelShow" @popup:closed="(selectorPersonnelShow = false)">
            <personnelselector
                    :multiple="false"
                    :title = "'选择直属员工'"
                    :subordinate="true"
                    :isFilterSub="true"
                    @submit="onSelectorPersonne"
                    @cancel="selectorPersonnelShow=false"
            ></personnelselector>
        </f7-popup>
    </f7-page>
</template>

<script>
    import {mapGetters, mapActions,mapMutations} from 'vuex';
    import personnelselector from 'gadget/personnelselector.vue';
    import photoeditor from 'gadget/photoeditor.vue';
    import DatePicker from 'vue2-datepicker'
    import {upload, getSignUrl} from 'lib/aliyun';
    import {uniquePageId} from 'lib/utils';
    import axios from 'axios';

    export default {
        components: {
            personnelselector,
            photoeditor,
            DatePicker
        },
        props: {
            lastPage: {
                type: String,
            },
            taskId:{
                type: String,
                default:null,
            },
            userId:{
                type: String,
                default:null,
            }
        },
        data: () => {
            return {
                pageId: uniquePageId('task'),
                selectorPersonnelShow:false,
                task: {
                    applicant: '',
                    executor: null,
                    type: '',
                    taskNumber: '',
                    deadline: null,
                    content: '',
                    photo: [],
                    priority: '',
                    auditType:'未审核',
                }
            }
        },

        computed: {
            ...mapGetters([
                'myCompany',
                'who',
                'manager',
                'myProfile',
                'userDepartment',
                'myUserId'
            ]),
            title(){
                if (this.taskId){
                    return '编辑任务';
                } else {
                    return '添加任务';
                }
            },
            adminDepartmentId(){

                let admin = this.adminDepartment(this.myProfile._id)
                return admin?admin.departmentId:null
            }
        },


        mounted: function() {
            if (this.userId){
                this.task.executor = this.userId;
            }
            if (this.taskId){
                let self = this;
                $preloader.show();
                axios.get('api/task/' + self.taskId).then(resp => {
                    Object.assign(self.task, resp.data);
                    $preloader.hide();
                    self.$forceUpdate();
                }).catch(err => {
                    console.error(err);
                    $preloader.hide();
                    $alert('无法更新数据，请稍后再试');
                });
            }
        },

        methods: {
            ...mapMutations([
                'setHasUpdateTask'
            ]),
            openTypePicker(ev) {
                let input = ev.target;
                if (input.picker) {
                    input.picker.open();
                    return;
                }
                let self = this;
                input.picker = this.$f7.picker.create({
                    inputEl: '#' + input.id,
                    toolbarCloseText: '完成',
                    rotateEffect: true,
                    cols: [{textAlign: 'center',values:self.myCompany.taskType},],
                    on: {
                        change: function (picker, values, displayValues) {
                            self.task.type = values[0];
                            // self.reportTemplate[name] = values;
                        },
                    }
                });
                input.picker.open();
            },
            openPriorityPicker(ev) {
                let input = ev.target;
                if (input.picker) {
                    input.picker.open();
                    return;
                }
                let self = this;
                input.picker = this.$f7.picker.create({
                    inputEl: '#' + input.id,
                    toolbarCloseText: '完成',
                    rotateEffect: true,
                    cols: [{textAlign: 'center',values:['非常紧急','紧急','普通']},],
                    on: {
                        change: function (picker, values, displayValues) {

                            self.task.priority = values[0];
                            // self.reportTemplate[name] = values;
                        },
                    }
                });
                input.picker.open();
            },

            submit(){
                let self = this;
                if (!this.task.type) {
                    $alert('请选择任务类型');
                    return;
                } else if (!this.task.priority) {
                    $alert('请选择任务等级');
                    return;
                } else if (!this.task.executor) {
                    $alert('请选择办理人');
                    return;
                } else if (!this.task.deadline) {
                    $alert('请选择截止时间');
                    return;
                } else if (!this.task.content) {
                    $alert('请填写任务内容');
                    return;
                }

                let sync = this.task._id ? axios.put : axios.post;
                let url =  this.task._id ? 'api/task/' + this.task._id : 'api/task';

                $preloader.show();
                sync(url, this.task).then(resp => {
                    $preloader.hide();
                    self.setHasUpdateTask(true)
                    $alert('任务发布成功', '操作成功', () => {
                        this.$f7router.back();
                    });
                }).catch(error => {
                    $preloader.hide();
                    console.error(error);
                    $alert('提交失败，请稍后再试', '操作失败');
                })
            },
            onSelectorPersonne(uIds) {
                if (uIds && uIds[0]) {
                    this.task.executor = uIds[0];
                } else {
                    this.task.executor= null;
                }
                this.selectorPersonnelShow = false;
                this.$forceUpdate();
            },
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
    .form-list{
        margin-bottom: 40px;
    }
    .form-list .list-item{
        background: #FFFFFF;
        width: 100%;
        height: 46px;
        font-size: 14px;
        line-height: 48px;
        border-bottom: 1px solid #D8D8D8;
    }
    .list-item .item-icon{
        display: inline-block;
        color: red;
        width: 18px;
        text-align: right;
    }
    .textarea-item{
        height: 200px!important;
    }
    .photo-item{
        height: 150px!important;
    }
    .form-list .list-item label{
        width: 40%;
        color: #666;
    }
    .form-list .list-item .item-input{
        width: 50%;
        background:none;
        outline:none;
        border:0px;
        float: right;
        text-align: right;
        font-size: 14px;
        line-height: 46px;
        padding-right: 15px;
        box-sizing: border-box;
        color: #333;
    }

    .textarea-item textarea{
        width: 100%;
        background:none;
        outline:none;
        border:0px;
        float: left;
        font-size: 14px;
        line-height: 1.5em;
        margin-top: -10px;
        padding-right: 15px;
        padding-left: 20px;
        box-sizing: border-box;
        height: 80%;
        color: #333;
    }
    .date-picker{
        float: right;
        margin-top: 6px;
        text-align: right;
        color: #333333!important;
    }
    .submit-button{
        float: left;
        bottom: -44px;
        width:100%;
        height:45px;
        line-height: 45px;
        font-size:16px;
        color: #FFFFFF;
        text-align: center;
        background:rgba(1,179,139,1);
    }

</style>
