<template>
    <f7-page style="background: #f8f8f8" :id="pageId">
        <f7-navbar>
            <f7-nav-left>
                <f7-link icon-only @click="cancel">
                    <i class="icon icon-back"></i>
                </f7-link>
            </f7-nav-left>
            <f7-nav-title>{{pageTitle}}</f7-nav-title>
            <f7-nav-right>
                <!--<f7-link href="#" @click="cancel">取消</f7-link>-->
                <f7-link href="#" @click="clear">清空</f7-link>
            </f7-nav-right>
        </f7-navbar>
        <div>
            <ul class="form-list">
                <li class="list-item">
                    <span class="item-icon">*</span>
                    <label>任务编号：</label>
                    <input class="item-input" placeholder="请输入" v-model="filters.no"></input>
                </li>
                <li class="list-item clear-float">
                    <span class="item-icon">*</span>
                    <label>任务类型：</label>
                    <input class="item-input"
                           :input-id = "`type`"
                           type="text"
                           placeholder="选择类型"
                           readonly
                           :value="filters.type"
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
                           :value="filters.priority"
                           @click="openPriorityPicker($event)"/>
                </li>
                <li class="list-item clear-float">
                    <span class="item-icon">*</span>
                    <label>办理人：</label>
                    <input class="item-input" placeholder="请选择" :value="(filters.executor && who(filters.executor).name)" readonly @click="$f7.popup.open('#task-executor-selector')"></input>
                </li>
                <li class="list-item clear-float">
                    <span class="item-icon">*</span>
                    <label>创建时间开始：</label>
                    <date-picker v-model="filters.createdAfter " type="datetime"
                                 :editable="false"
                                 class="date-picker"
                                 width="150px"
                                 :confirm="true"
                                 :confirm-text="'确定'"
                                 placeholder=""
                                 format="YYYY-MM-DD HH:mm" :minute-step="30"
                                 :first-day-of-week="1"></date-picker>
                </li>
                <li class="list-item clear-float">
                    <span class="item-icon">*</span>
                    <label>创建时间结束：</label>
                    <date-picker v-model="filters.createdBefore " type="datetime"
                                 :editable="false"
                                 class="date-picker"
                                 width="150px"
                                 :confirm="true"
                                 :confirm-text="'确定'"
                                 placeholder=""
                                 format="YYYY-MM-DD HH:mm" :minute-step="30"
                                 :first-day-of-week="1"></date-picker>
                </li>
                <li class="list-item clear-float">
                    <span class="item-icon">*</span>
                    <label>截止时间开始：</label>
                    <date-picker v-model="filters.deadlineAfter " type="datetime"
                                 :editable="false"
                                 class="date-picker"
                                 width="150px"
                                 :confirm="true"
                                 :confirm-text="'确定'"
                                 placeholder=""
                                 format="YYYY-MM-DD HH:mm" :minute-step="30"
                                 :first-day-of-week="1"></date-picker>
                </li>
                <li class="list-item clear-float">
                    <span class="item-icon">*</span>
                    <label>截止时间结束：</label>
                    <date-picker v-model="filters.deadlineBefore " type="datetime"
                                 :editable="false"
                                 class="date-picker"
                                 width="150px"
                                 :confirm="true"
                                 :confirm-text="'确定'"
                                 placeholder=""
                                 format="YYYY-MM-DD HH:mm" :minute-step="30"
                                 :first-day-of-week="1"></date-picker>
                </li>
            </ul>
            <div class="submit-button" @click="submit">搜索</div>
            <!--<div class="clear-float" style="height: 200px">sssss</div>-->
        </div>



        <f7-popup id="task-executor-selector">
            <personnelselector
                :multiple = "false"
                @submit="selectEmployee"
                @cancel="$f7.popup.close('#task-executor-selector')"
            ></personnelselector>
        </f7-popup>
    </f7-page>
</template>
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
        position: fixed;
        bottom: 0px;
        width:100%;
        height:45px;
        line-height: 45px;
        font-size:16px;
        color: #FFFFFF;
        text-align: center;
        background:rgba(1,179,139,1);
    }

</style>
<script>
import {mapGetters, mapActions} from 'vuex';
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
    name:'taskSearch',
    props: [
        'lastPage',
        'reference'
    ],

    data: () => {
        return {
            pageId: uniquePageId('task'),
            filters: {
                no: '',
                executor: null,
                type: '',
                deadline: null,
                content: '',
                finishAt: null,
                priority: '',
                createdAfter:null,
                createdBefore:null,
                deadlineAfter:null,
                deadlineBefore:null,
                
            }
        }
    },

    computed: {
        ...mapGetters([
            'myCompany',
            'who',
            'manager',
            'myProfile',
            'myUserId'
        ]),

        pageTitle() {
            return '任务搜索';
        },
    },

    mounted: function() {
    },

    methods: {
        submit() {
            let obj = {};
            for (let key in this.filters){
                if (this.filters[key]){
                    obj[key]=this.filters[key]
                }
            }
            this.$emit('submit',obj);
        },

        cancel() {
            this.$emit('cancel');
        },
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
                    close:function (picker) {
                        self.filters.type=picker.value
                    }
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
                    close:function (picker) {
                        self.filters.priority=picker.value
                    }
                }
            });
            input.picker.open();
        },

        selectEmployee(pList) {
            if (pList && pList[0]) {
                this.filters.executor = pList[0];
            }
            $f7.popup.close('#task-executor-selector');
        },

        openDatePicker() {
            if (!this.datepicker) {
                this.datepicker = $calendar.create({
                    inputEl: '#taskDeadline',
                    closeOnSelect: true
                });
            }
            this.datepicker.open();
        },
        clear(){
            for (let key in this.filters){
                if (this.filters[key]){
                    this.filters[key] = ''
                }
            }
        }

    }
}
</script>
