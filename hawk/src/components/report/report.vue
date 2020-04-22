<template>
    <f7-page no-toolbar>
        <f7-navbar :title="'编辑数据报表'" back-link>

        </f7-navbar>
        <f7-list v-if="reportTemplate">
            <f7-list-item title="报表名称">
                <input
                    slot="inner" style="text-align:right; width:70%" 
                    type="text" placeholder="请填写报表名称"
                    :value="reportTemplate.name || ''"
                    @input="reportTemplate.name = $event.target.value"
                >
                <span slot="title" style="color:red"> *</span>
            </f7-list-item>
            <f7-list-item
                    title="制定数据项目"
                    :after="(reportTemplate.items && getItemsString(reportTemplate.items)) || '请选择'"
                    link="#"
                    @click="$f7.popup.open('#reportTemplate-datatemplate')"
            >
                <span slot="title" style="color:red"> *</span>
            </f7-list-item>
            <f7-list-item divider></f7-list-item>

            <f7-list-item title="提交周期">
                <f7-segmented  style="width: 180px"  raised tag="p">
                    <f7-button class="color-green" v-bind:active="reportTemplate.period == 'day'" @click="reportTemplate.period = 'day'"> 天 </f7-button>
                    <f7-button class="color-green" v-bind:active="reportTemplate.period == 'week'" @click="reportTemplate.period = 'week'"> 周 </f7-button>
                    <f7-button class="color-green" v-bind:active="reportTemplate.period == 'month'" @click="reportTemplate.period = 'month'"> 月 </f7-button>
                </f7-segmented>
            </f7-list-item>
            <f7-list-item v-show="reportTemplate.period == 'day'"
                link="#" title="提交日期"
                smart-select :smart-select-params="{openIn: 'popover', closeOnSelect: true}"
                ref="days_select"
            >
                <span slot="title" style="color:red"> *</span>
                <select name="days" multiple="multiple" v-model="reportTemplate.days" >
                    <option
                        :value="t"
                        v-for="(t, i) in reportOptionData('daysOfWeek').values" :key="i"
                        :selected="reportTemplate.days && reportTemplate.days.includes(t)"
                    >{{reportOptionData('daysOfWeek').displays[i]}}</option>
                </select>
            </f7-list-item>

            <!--提交开始时间 周-->
            <f7-list-item  title="提交开始时间"   v-show="reportTemplate.period == 'week'">
                <span slot="title" style="color:red"> *</span>
                <input style="text-align:right; width: 60%"
                       :input-id = "`worktime-start`"
                       type="text"
                       placeholder="选择时间"
                       readonly
                       :value="reportOptionName('weekAndTime',reportTemplate.startTimeOfWeek)"
                       @click="openWeekPicker($event, reportTemplate.startTimeOfWeek,'startTimeOfWeek')"/>

                <i class="f7-icons" @click="openWeekPicker($event, reportTemplate.startTimeOfWeek,'startTimeOfWeek')">chevron_right</i>
            </f7-list-item>
            <f7-list-item  title="提交截止时间"   v-show="reportTemplate.period == 'week'">
                <span slot="title" style="color:red"> *</span>
                <input style="text-align:right; width: 60%"
                       :input-id = "`worktime-start`"
                       type="text"
                       placeholder="选择时间"
                       readonly
                       :value="reportOptionName('weekAndTime',reportTemplate.endTimeOfWeek)"
                       @click="openWeekPicker($event, reportTemplate.endTimeOfWeek,'endTimeOfWeek')"/>
                <i class="f7-icons" @click="openWeekPicker($event, reportTemplate.endTimeOfWeek,'endTimeOfWeek')">chevron_right</i>
            </f7-list-item>
            <!--提交开始时间 月-->
            <f7-list-item  title="提交开始时间"   v-show="reportTemplate.period == 'month'">
                <span slot="title" style="color:red"> *</span>
                <input style="text-align:right; width: 60%"
                       :input-id = "`worktime-start`"
                       type="text"
                       placeholder="选择时间"
                       readonly
                       :value="reportOptionName('monthAndTime',reportTemplate.startTimeOfMonth)"
                       @click="openMonthPicker($event, reportTemplate.startTimeOfMonth,'startTimeOfMonth')"/>
                <i class="f7-icons" @click="openMonthPicker($event, reportTemplate.startTimeOfMonth,'startTimeOfMonth')">chevron_right</i>
            </f7-list-item>
            <f7-list-item  title="提交截止时间"   v-show="reportTemplate.period == 'month'">
                <input style="text-align:right; width: 60%"
                       :input-id = "`worktime-start`"
                       type="text"
                       placeholder="选择时间"
                       readonly
                       :value="reportOptionName('monthAndTime',reportTemplate.endTimeOfMonth)"
                       @click="openMonthPicker($event, reportTemplate.endTimeOfMonth,'endTimeOfMonth')"/>
                <span slot="title" style="color:red"> *</span>
                <i class="f7-icons" @click="openMonthPicker($event, reportTemplate.endTimeOfMonth,'endTimeOfMonth')">chevron_right</i>
            </f7-list-item>
            <!--提交开始时间 天-->
            <f7-list-item
                    v-show="reportTemplate.period == 'day'"
                  title="提交开始时间"
            >
                <input style="text-align:right; width: 60%"
                       :input-id = "`worktime-start`"
                       type="text"
                       readonly
                       :value="reportOptionName('time',reportTemplate.startTime)"
                       @click="openDayPicker($event, reportTemplate.startTime,'startTime')"/>
                <span slot="title" style="color:red"> *</span>
                <i class="f7-icons" @click="openDayPicker($event, reportTemplate.startTime,'startTime')">chevron_right</i>
            </f7-list-item>
            <f7-list-item
                    v-show="reportTemplate.period == 'day'"
                     title="提交截止时间">
                <input style="text-align:right; width: 60%"
                       :input-id = "`worktime-start`"
                       type="text"
                       readonly
                       :value="reportOptionName('time',reportTemplate.endTime)"
                       @click="openDayPicker($event, reportTemplate.endTime,'endTime')"/>
                <span slot="title" style="color:red"> *</span>
                <i class="f7-icons" @click="openDayPicker($event, reportTemplate.endTime,'endTime')">chevron_right</i>
            </f7-list-item>

            <f7-list-item divider>

            </f7-list-item>

            <f7-list-item title="提醒员工提交">
                <span slot="title" style="color:red"> *</span>

                <f7-toggle :checked="reportTemplate.isRemind"     @toggle:change="reportTemplate.isRemind =!reportTemplate.isRemind" style="background: #01B38B"></f7-toggle>
            </f7-list-item>
            <f7-list-item v-show="reportTemplate.isRemind" title="提交时间">
                <input style="text-align:right; width: 70%"
                       :input-id = "`remindTime`"
                       type="text"
                       readonly
                       :value="remindTimeDisplayValue"
                       @click="openRemindTimePicker($event, reportTemplate.remindTime,'remindTime')"/>
                <span slot="title" style="color:red"> *</span>
                <i class="f7-icons" @click="openRemindTimePicker($event, reportTemplate.remindTime,'remindTime')">chevron_right</i>
            </f7-list-item>
            <f7-list-item class="input-textarea" title="提醒内容" v-show="reportTemplate.isRemind == 1">
                <textarea
                        slot = "after-title"
                        placeholder="请填写提醒内容"
                        :value="reportTemplate.remindContent"
                        @input="reportTemplate.remindContent = $event.target.value"
                ></textarea>
            </f7-list-item>
        </f7-list>

        <f7-block>
            <f7-row>
                <f7-col>
                    <f7-button class="hawk-button" big-ios  @click="save">保存</f7-button>
                </f7-col>
            </f7-row>
        </f7-block>



        <f7-popup id="reportTemplate-datatemplate" v-if="reportTemplate">
            <datatemplate
                :old-items="reportTemplate.items"
                @submit="selectTemplate"
                @cancel="$f7.popup.close('#reportTemplate-datatemplate')"
            ></datatemplate>
        </f7-popup>





    </f7-page>
</template>

<style scoped>
    .f7-icons{
        display:block;
        font-size: 1em;
        color: #CCCCCC;
    }

</style>
<script>
import {defaultImgUrl} from 'lib/loading';
import {mapGetters, mapActions} from 'vuex';
import datatemplate from './datatemplate';
import photoeditor from 'gadget/photoeditor.vue';
import axios from 'axios';

export default {
    components: {
        datatemplate,
        photoeditor,
    },

    props: {
        lastPage: {
            type: String,
            default: '上一页'
        },
        departmentId: {}
    },

    data() {
        return {
            selectDatas:{
                remindTimes:[60,120,240,480],
                remindTimeDisplayValues:['截止时间前1小时',"截止时间前2小时","截止时间前4小时","截止时间前8小时"],
            },
            remindTimeDisplayValue:'',
            reportTemplate: null
        }
    },

    computed: {
        ...mapGetters([
            'myCompany',
            'who',
            'myProfile',
            'companyRegions',
            'reportOptionData',
            'reportOptionName',
            'regionName'
        ]),
    },

    mounted() {
        let self = this;
        if (this.departmentId) {
            $preloader.show();
            axios.get('api/reporttemplate/?q='+ JSON.stringify({departmentId:this.departmentId})).then(resp => {
                if (resp.data){
                    self.reportTemplate = resp.data;
                    self.$nextTick(() => {
                        if (self.reportTemplate.days) self.$refs.days_select.f7SmartSelect.setValue(self.reportOptionName('week',self.reportTemplate.days));
                        if (self.reportTemplate.remindTime){
                            self.selectDatas.remindTimes.forEach(function (value,index){
                                if (value == self.reportTemplate.remindTime){
                                    self.remindTimeDisplayValue = self.selectDatas.remindTimeDisplayValues[index];
                                }
                            })
                        }
                    })
                } else {
                    self.reportTemplate = {
                        name: '',
                        department: self.departmentId,
                        items:[],
                        days: [],
                        period: 'day',
                        startTimeOfWeek: [],
                        endTimeOfWeek: [],
                        startTimeOfMonth: [],
                        endTimeOfMonth: [],
                        startTime: '',
                        endTime: '',
                        isRemind: true,
                        remindTime:'',
                        remindContent: '',
                    }
                }
                $preloader.hide();
            });
        }
        this.$forceUpdate();
    },

    methods: {
        openRemindTimePicker(ev, when,name) {
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
                cols: [{textAlign: 'center', values: self.selectDatas.remindTimes,  displayValues: self.selectDatas.remindTimeDisplayValues}],
                on: {
                    change: function (picker, values, displayValues) {
                        self.remindTimeDisplayValue = displayValues;
                        self.reportTemplate[name] = values[0];
                    },
                }
            });
            input.picker.open();
        },
        openDayPicker(ev, when,name) {
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
                cols: [{textAlign: 'center', values:self.reportOptionData('times').values,displayValues:self.reportOptionData('times').displays}],
                on: {
                    change: function (picker, values, displayValues) {
                        self.reportTemplate[name] = values[0];
                    },
                }
            });
            input.picker.open();
        },
        openWeekPicker(ev, when,name) {
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
                cols: [{textAlign: 'center',values:self.reportOptionData('daysOfWeek').values,displayValues:self.reportOptionData('daysOfWeek').displays}, {values:self.reportOptionData('times').values,displayValues:self.reportOptionData('times').displays},],
                on: {
                    change: function (picker, values, displayValues) {
                        self.reportTemplate[name] = values;
                    },
                }
            });
            input.picker.open();
        },
        openMonthPicker(ev, when,name) {
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
                cols: [{textAlign: 'center',values:self.reportOptionData('daysOfMonth').values,displayValues:self.reportOptionData('daysOfMonth').displays}, {values:self.reportOptionData('times').values,displayValues:self.reportOptionData('times').displays},],
                on: {
                    change: function (picker, values, displayValues) {
                        self.reportTemplate[name] = values;
                    },
                }
            });
            input.picker.open();
        },
        selectTemplate(pList) {
            this.reportTemplate.items = pList;
            this.$forceUpdate();
            $f7.popup.close('#reportTemplate-datatemplate')
        },
        getItemsString(items){
            let string = '';
            items.forEach(function(value, index, array){
                string +=value.name
                if (index != items.length-1){
                    string += ','
                }
            })
            return string;
        },
        cancel() {
            this.$f7router.back();
        },
        selectday(event){
            console.log(event)
        },
        save() {
            let error_msg = '';
            if (this.reportTemplate.isRemind){
                if (!this.reportTemplate.remindTime) error_msg = '提醒时间不能为空'
            }
           if(this.reportTemplate.period == 'day'){
               if (!this.reportTemplate.startTime) error_msg = '提交开始时间不能为空'
               if (!this.reportTemplate.endTime) error_msg = '提交截止时间不能为空'
               if (!this.reportTemplate.days || this.reportTemplate.days.length == 0) error_msg = '提交日期不能为空'


            }else if (this.reportTemplate.period == 'week'){
               if (!this.reportTemplate.endTimeOfWeek || this.reportTemplate.endTimeOfWeek.length == 0) error_msg = '提交截止时间不能为空'
               if (!this.reportTemplate.startTimeOfWeek || this.reportTemplate.startTimeOfWeek.length == 0) error_msg = '提交开始时间不能为空'
            } else if (this.reportTemplate.period == 'month'){
               if (!this.reportTemplate.endTimeOfMonth || this.reportTemplate.endTimeOfMonth.length == 0) error_msg = '提交截止时间不能为空'
               if (!this.reportTemplate.startTimeOfMonth || this.reportTemplate.startTimeOfMonth.length == 0) error_msg = '提交开始时间不能为空'
            }
            if (!this.reportTemplate.items || this.reportTemplate.items.length == 0) error_msg = '数据项不能为空'
            if (!this.reportTemplate.name) {error_msg = '名称不能为空'}
            if (error_msg) {
                $alert(error_msg, '操作错误');
                return;
            }

            let self = this;
            let sync = this.reportTemplate._id ? axios.put : axios.post;
            let path = 'api/reporttemplate' + (this.reportTemplate._id ? `/${this.reportTemplate._id}` : '');
            $preloader.show();
            sync(path, this.reportTemplate).then(resp => {
                $preloader.hide();
                $alert('报表已经保存', '操作成功', () => {
                    self.$f7router.back();
                })
            }).catch(err => {
                $preloader.hide();
                console.error(err);
                $alert('无法保存数据，请稍后再试', '操作错误');
            });
        },
    }
}
</script>

