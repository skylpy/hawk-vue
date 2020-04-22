<template>
    <f7-page no-toolbar style="background: #F8F8F8">
        <f7-navbar  title="日报设置" back-link>
            <f7-nav-right>

            </f7-nav-right>
        </f7-navbar>

        <f7-list>

            <f7-list-item title="提交周期">
                <f7-segmented style="width: 180px" raised tag="p">
                    <f7-button class="color-green" v-bind:active="journalTemplate.period == 'day'" @click="journalTemplate.period = 'day'"> 天 </f7-button>
                    <f7-button class="color-green" v-bind:active="journalTemplate.period == 'week'" @click="journalTemplate.period = 'week'"> 周 </f7-button>
                    <f7-button class="color-green" v-bind:active="journalTemplate.period == 'month'" @click="journalTemplate.period = 'month'"> 月 </f7-button>
                </f7-segmented>
            </f7-list-item>
            <f7-list-item v-show="journalTemplate.period == 'day'"
                          link="#" title="提交日期"
                          smart-select :smart-select-params="{openIn: 'popover', closeOnSelect: true}"
                          ref="days_select"
            >
                <span slot="title" style="color:red"> *</span>
                <select name="days" multiple="multiple" v-model="journalTemplate.days" >
                    <option
                            :value="t"
                            v-for="(t, i) in reportOptionData('daysOfWeek').values" :key="i"
                            :selected="journalTemplate.days && journalTemplate.days.includes(t)"
                    >{{reportOptionData('daysOfWeek').displays[i]}}</option>
                </select>
            </f7-list-item>

            <!--提交开始时间 周-->
            <f7-list-item  title="提交开始时间"   v-show="journalTemplate.period == 'week'">
                <span slot="title" style="color:red"> *</span>
                <input style="text-align:right; width: 60%"
                       :input-id = "`worktime-start`"
                       type="text"
                       placeholder="选择时间"
                       readonly
                       :value="reportOptionName('weekAndTime',journalTemplate.startTimeOfWeek)"
                       @click="openWeekPicker($event, journalTemplate.startTimeOfWeek,'startTimeOfWeek')"/>

                <i class="f7-icons" @click="openWeekPicker($event, journalTemplate.startTimeOfWeek,'startTimeOfWeek')">chevron_right</i>
            </f7-list-item>
            <f7-list-item  title="提交截止时间"   v-show="journalTemplate.period == 'week'">
                <span slot="title" style="color:red"> *</span>
                <input style="text-align:right; width: 60%"
                       :input-id = "`worktime-start`"
                       type="text"
                       placeholder="选择时间"
                       readonly
                       :value="reportOptionName('weekAndTime',journalTemplate.endTimeOfWeek)"
                       @click="openWeekPicker($event, journalTemplate.endTimeOfWeek,'endTimeOfWeek')"/>
                <i class="f7-icons" @click="openWeekPicker($event, journalTemplate.endTimeOfWeek,'endTimeOfWeek')">chevron_right</i>
            </f7-list-item>
            <!--提交开始时间 月-->
            <f7-list-item  title="提交开始时间"   v-show="journalTemplate.period == 'month'">
                <span slot="title" style="color:red"> *</span>
                <input style="text-align:right; width: 60%"
                       :input-id = "`worktime-start`"
                       type="text"
                       placeholder="选择时间"
                       readonly
                       :value="reportOptionName('monthAndTime',journalTemplate.startTimeOfMonth)"
                       @click="openMonthPicker($event, journalTemplate.startTimeOfMonth,'startTimeOfMonth')"/>
                <i class="f7-icons" @click="openMonthPicker($event, journalTemplate.startTimeOfMonth,'startTimeOfMonth')">chevron_right</i>
            </f7-list-item>
            <f7-list-item  title="提交截止时间"   v-show="journalTemplate.period == 'month'">
                <input style="text-align:right; width: 60%"
                       :input-id = "`worktime-start`"
                       type="text"
                       placeholder="选择时间"
                       readonly
                       :value="reportOptionName('monthAndTime',journalTemplate.endTimeOfMonth)"
                       @click="openMonthPicker($event, journalTemplate.endTimeOfMonth,'endTimeOfMonth')"/>
                <span slot="title" style="color:red"> *</span>
                <i class="f7-icons" @click="openMonthPicker($event, journalTemplate.endTimeOfMonth,'endTimeOfMonth')">chevron_right</i>
            </f7-list-item>
            <!--提交开始时间 天-->
            <f7-list-item
                    v-show="journalTemplate.period == 'day'"
                    title="提交开始时间"
            >
                <input style="text-align:right; width: 60%"
                       :input-id = "`worktime-start`"
                       type="text"
                       readonly
                       :value="reportOptionName('time',journalTemplate.startTime)"
                       @click="openDayPicker($event, journalTemplate.startTime,'startTime')"/>
                <span slot="title" style="color:red"> *</span>
                <i class="f7-icons" @click="openDayPicker($event, journalTemplate.startTime,'startTime')">chevron_right</i>
            </f7-list-item>
            <f7-list-item
                    v-show="journalTemplate.period == 'day'"
                    title="提交截止时间">
                <input style="text-align:right; width: 60%"
                       :input-id = "`worktime-start`"
                       type="text"
                       readonly
                       :value="reportOptionName('time',journalTemplate.endTime)"
                       @click="openDayPicker($event, journalTemplate.endTime,'endTime')"/>
                <span slot="title" style="color:red"> *</span>
                <i class="f7-icons" @click="openDayPicker($event, journalTemplate.endTime,'endTime')">chevron_right</i>
            </f7-list-item>

            <f7-list-item>
                <div class="item-center">

                    <span v-show="journalTemplate.period == 'day'">
                        每天{{journalTemplate.startTime == ''?'0':journalTemplate.startTime}}
                        :00开始写当天的日志，当天{{journalTemplate.endTime==''?'24':journalTemplate.endTime}}
                        :00前提交为正常提交，除此之外为未交
                    </span>
                    <span v-show="journalTemplate.period == 'week'">
                        每{{startOfWeek}} {{startOfWeekTime}}
                        :00开始写本周的日志，{{endOfWeek}}{{endOfWeekTime}}
                        :00前提交为正常提交，除此之外为未交
                    </span>
                    <span v-show="journalTemplate.period == 'month'">
                        本月{{startOfMonth}}日 {{startOfMonthTime}}
                        :00开始写当天的日志，本月{{endOfMonth}}日 {{endOfMonthTime}}
                        :00前提交为正常提交，除此之外为未交
                    </span>
                </div>
            </f7-list-item>

            <f7-list-item title="提醒员工提交">
                <span slot="title" style="color:red"> *</span>

                <f7-toggle :checked="journalTemplate.isRemind"  @toggleChange="change" style="background: #01B38B"></f7-toggle>
            </f7-list-item>
            <f7-list-item v-show="journalTemplate.isRemind" title="提醒时间">
                <input style="text-align:right; width: 70%"
                       :input-id = "`remindTime`"
                       type="text"
                       readonly
                       :value="remindTimeDisplayValue"
                       @click="openRemindTimePicker($event, journalTemplate.remindTime,'remindTime')"/>
                <span slot="title" style="color:red"> *</span>
                <i class="f7-icons" @click="openRemindTimePicker($event, journalTemplate.remindTime,'remindTime')">chevron_right</i>
            </f7-list-item>
            <f7-list-item class="input-textarea" title="提醒内容" v-show="journalTemplate.isRemind">
                <textarea
                        slot = "after-title"
                        placeholder="请填写提醒内容"
                        :value="journalTemplate.remindContent"
                        @input="journalTemplate.remindContent = $event.target.value"
                ></textarea>
            </f7-list-item>
        </f7-list>

        <f7-block>
            <f7-row>
                <f7-col>
                    <f7-button class="color-green" big-ios fill @click="save">保存</f7-button>
                </f7-col>
            </f7-row>
        </f7-block>

        <f7-popup id="journalTemplate-datatemplate">
            <datatemplate
                    :old-items="journalTemplate.items"
                    @submit="selectTemplate"
                    @cancel="$f7.popup.close('#journalTemplate-datatemplate')"
            ></datatemplate>
        </f7-popup>

    </f7-page>
</template>

<script>
    import {defaultImgUrl} from 'lib/loading';
    import {mapGetters, mapActions} from 'vuex';
    import datatemplate from '../report/datatemplate';
    import photoeditor from 'gadget/photoeditor.vue';
    import axios from 'axios';

    const arrow_right_gray = require("assets/images/arrow_right_gray@2x.png");

    export default {
        name: "journalset",

        props: {
            lastPage: {
                type: String,
                default: '上一页'
            },
            // departmentId: {
            //     type: String
            // },
        },

        components: {
            datatemplate,
            photoeditor,
        },
        computed: {
            ...mapGetters([
                'myCompany',
                'who',
                'myProfile',
                'companyRegions',
                'reportOptionData',
                'reportOptionName',
                'regionName',
                'userDepartment',
                'organization'
            ]),
        },

        data() {
            return {
                selectDatas:{
                    remindTimes:[60,120,240,480],
                    remindTimeDisplayValues:['截止时间前1小时',"截止时间前2小时","截止时间前4小时","截止时间前8小时"],
                },
                remindTimeDisplayValue:'',
                startOfWeek:'',
                endOfWeek:'',
                startOfWeekTime:'',
                endOfWeekTime:'',
                startOfMonth:'',
                endOfMonth:'',
                endOfMonthTime:'',
                startOfMonthTime:'',
                journalTemplate: {
                    // name: '',
                    department: '',
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
                },
                departmentId:''
            }
        },

        mounted() {
            let self = this;
            let department = this.userDepartment(this.myProfile._id)
            // console.log(this.organization);

            this.journalTemplate.department = department && department.departmentId || this.organization.departmentId;
            this.departmentId = department && department.departmentId || this.organization.departmentId;

            if (this.departmentId) {
                $preloader.show();
                axios.get('api/journalset/?q='+ JSON.stringify({departmentId: this.departmentId})).then(resp => {
                    $preloader.hide();
                    if (resp.data){
                        self.journalTemplate = resp.data;
                        if (self.journalTemplate.days.length) self.$refs.days_select.f7SmartSelect.setValue(self.reportOptionName('week',self.journalTemplate.days));
                        if (self.journalTemplate.remindTime){
                            self.selectDatas.remindTimes.forEach(function (value,index){
                                if (value == self.journalTemplate.remindTime){
                                    self.remindTimeDisplayValue = self.selectDatas.remindTimeDisplayValues[index];
                                }
                            })
                        }
                    }
                });
            }
            this.$forceUpdate();
        },
        // journalTemplate
        methods: {
            change (val) {
              this.journalTemplate.isRemind = val
            },
            //设置周期
            startWeek(items,name){

                switch (items[0]) {
                    case '1':
                        if (name == 'startTimeOfWeek') {
                            this.startOfWeek = '周一'
                        }else {
                            this.endOfWeek = '周一'
                        }
                        break;
                    case '2':
                        if (name == 'startTimeOfWeek') {
                            this.startOfWeek = '周二'
                        }else {
                            this.endOfWeek = '周二'
                        }
                        break;
                    case '3':
                        if (name == 'startTimeOfWeek') {
                            this.startOfWeek = '周三'
                        }else {
                            this.endOfWeek = '周三'
                        }
                        break;
                    case '4':
                        if (name == 'startTimeOfWeek') {
                            this.startOfWeek = '周四'
                        }else {
                            this.endOfWeek = '周四'
                        }
                    case '5':
                        if (name == 'startTimeOfWeek') {
                            this.startOfWeek = '周五'
                        }else {
                            this.endOfWeek = '周五'
                        }
                        break;
                    case '6':
                        if (name == 'startTimeOfWeek') {
                            this.startOfWeek = '周六'
                        }else {
                            this.endOfWeek = '周六'
                        }
                        break;
                    default:
                        if (name == 'startTimeOfWeek') {
                            this.startOfWeek = '周日'
                        }else {
                            this.endOfWeek = '周日'
                        }
                        break;
                }
                if (name == 'startTimeOfWeek') {
                    this.startOfWeekTime = items[1]
                }else {
                    this.endOfWeekTime = items[1]
                }

            },

            //设置月期
            startMonth(items,name){

                if (name == 'startTimeOfMonth') {
                    this.startOfMonth = items[0];
                    this.startOfMonthTime = items[1];
                }else {
                    this.endOfMonth = items[0];
                    this.endOfMonthTime = items[1]
                }
            },

            openRemindTimePicker(ev, when, name) {
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
                    cols: [{
                        textAlign: 'center',
                        values: self.selectDatas.remindTimes,
                        displayValues: self.selectDatas.remindTimeDisplayValues
                    }],
                    on: {
                        change: function (picker, values, displayValues) {
                            self.remindTimeDisplayValue = displayValues;
                            self.journalTemplate[name] = values[0];
                        },
                    }
                });
                input.picker.open();
            },
            openDayPicker(ev, when, name) {
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
                    cols: [{
                        textAlign: 'center',
                        values: self.reportOptionData('times').values,
                        displayValues: self.reportOptionData('times').displays
                    }],
                    on: {
                        change: function (picker, values, displayValues) {

                            self.journalTemplate[name] = values[0];

                        },
                    }
                });
                input.picker.open();
            },
            openWeekPicker(ev, when, name) {
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
                    cols: [{
                        textAlign: 'center',
                        values: self.reportOptionData('daysOfWeek').values,
                        displayValues: self.reportOptionData('daysOfWeek').displays
                    }, {
                        values: self.reportOptionData('times').values,
                        displayValues: self.reportOptionData('times').displays
                    },],
                    on: {
                        change: function (picker, values, displayValues) {
                            self.journalTemplate[name] = values;
                            self.startWeek(values,name)

                        },
                    }
                });
                input.picker.open();
            },
            openMonthPicker(ev, when, name) {
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
                    cols: [{
                        textAlign: 'center',
                        values: self.reportOptionData('daysOfMonth').values,
                        displayValues: self.reportOptionData('daysOfMonth').displays
                    }, {
                        values: self.reportOptionData('times').values,
                        displayValues: self.reportOptionData('times').displays
                    },],
                    on: {
                        change: function (picker, values, displayValues) {
                            self.journalTemplate[name] = values;
                            self.startMonth(values,name)
                        },
                    }
                });
                input.picker.open();
            },
            selectTemplate(pList) {
                console.log(pList);
                this.journalTemplate.items = pList;
                this.$forceUpdate();
                $f7.popup.close('#journalTemplate-datatemplate')
            },
            getItemsString(items) {
                let string = '';
                items.forEach(function (value, index, array) {
                    string += value.name
                    if (index != items.length - 1) {
                        string += ','
                    }
                })
                return string;
            },
            cancel() {
                this.$f7router.back();
            },
            selectday(event) {
                console.log(event)
            },
            save() {
                let error_msg = '';
                if (this.journalTemplate.isRemind) {
                    if (!this.journalTemplate.remindTime) error_msg = '提醒时间不能为空'
                }
                if (this.journalTemplate.period == 'day') {
                    if (!this.journalTemplate.startTime) error_msg = '提交开始时间不能为空'
                    if (!this.journalTemplate.endTime) error_msg = '提交截止时间不能为空'
                    if (!this.journalTemplate.days || this.journalTemplate.days.length == 0) error_msg = '提交日期不能为空'


                } else if (this.journalTemplate.period == 'week') {
                    if (!this.journalTemplate.endTimeOfWeek || this.journalTemplate.endTimeOfWeek.length == 0) error_msg = '提交截止时间不能为空'
                    if (!this.journalTemplate.startTimeOfWeek || this.journalTemplate.startTimeOfWeek.length == 0) error_msg = '提交开始时间不能为空'
                } else if (this.journalTemplate.period == 'month') {
                    if (!this.journalTemplate.endTimeOfMonth || this.journalTemplate.endTimeOfMonth.length == 0) error_msg = '提交截止时间不能为空'
                    if (!this.journalTemplate.startTimeOfMonth || this.journalTemplate.startTimeOfMonth.length == 0) error_msg = '提交开始时间不能为空'
                }
                // if (!this.journalTemplate.items || this.journalTemplate.items.length == 0) error_msg = '数据项不能为空'
                // console.log("88888"+this.journalTemplate.items.length);
                if (error_msg) {
                    $alert(error_msg, '操作错误');
                    return;
                }

                let self = this;
                let sync = this.journalTemplate._id ? axios.put : axios.post;
                let path = 'api/journalset' + (this.journalTemplate._id ? `/${this.journalTemplate._id}` : '');
                $preloader.show();
                sync(path, this.journalTemplate).then(resp => {
                    $preloader.hide();
                    $alert('日报设置已经保存', '操作成功', () => {
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

<style scoped>

    .f7-icons{
        display:block;
        font-size: 1em;
        color: #CCCCCC;
    }

    .item-inner p{
        margin: 0px;
    }

    .list{
        margin: 0px;
    }

    .item-title {
        color: #666666;
        font-size: 14px;
    }




    /*.content {*/

        /*overflow: auto;*/
        /*-webkit-overflow-scrolling: touch;*/
        /*box-sizing: border-box;*/
        /*height: 100%;*/
        /*position: relative;*/
        /*z-index: 1;*/
    /*}*/

    /*.bgselect{*/
        /*background: #FFFFFF;*/
        /*line-height: 45px;*/
        /*height: 45px;*/
        /*width: 100%;*/
        /*border-bottom: 1px solid #D8D8D8;*/
    /*}*/

    .item-center{
        background-color: #F8F8F8;
        color: #999999;
        font-size: 13px;
        height: 55px;
    }

    .item-center span{
        display: inline-block;
        /*margin: 10px;*/
    }

    /*.bottom-content{*/
        /*height: 130px;*/
        /*width: 100%;*/
        /*background: #FFFFFF;*/
    /*}*/

    /*.bottom-content label{*/

        /*font-size: 14px;*/
        /*color: #666666;*/
        /*margin: 15px;*/
    /*}*/

    /*.bottom-content textarea{*/
        /*height: 95px;*/
        /*width: 93%;*/
        /*margin-top: 5px;*/
        /*margin-left: 15px;*/
        /*margin-right: 15px;*/
        /*margin-bottom: 15px;*/
    /*}*/

    /*.arrow{*/
        /*display: inline-block;*/
        /*width: 50%;*/
        /*text-align: right;*/
        /*float: right;*/
        /*margin-right: 10px;*/
        /*color: darkgray;*/
    /*}*/

    /*.bgselect label{*/

        /*font-size: 14px;*/
        /*color: #666666;*/
    /*}*/

    /*.selectcycle{*/

        /*display: inline-block;*/
        /*margin-left: 15px;*/
        /*font-size: 14px;*/
        /*color: #666666;*/

    /*}*/
    /*.item-icon{*/
        /*display: inline-block;*/
        /*color: red;*/
        /*width: 10px;*/
        /*text-align: right;*/
    /*}*/

    /*.bottom-sype{*/
        /*background: #FFFFFF;*/
        /*line-height: 45px;*/
        /*height: 45px;*/
        /*width: 100%;*/
        /*border-bottom: 1px solid #D8D8D8;*/
    /*}*/

    /*.bottom-sype label{*/

        /*display: inline-block;*/
        /*margin-left: 15px;*/
        /*font-size: 14px;*/
        /*color: #666666;*/
    /*}*/
    /*.segmente{*/

        /*display: inline-block;*/
        /*float: right;*/
        /*margin-top: 0px;*/
        /*margin-right: 10px;*/
    /*}*/

    /*.footer{*/

        /*position: fixed;*/
        /*bottom: 0px;*/
        /*width: 100%;*/
        /*height: 50px;*/
        /*background: #01B38B;*/
        /*color: white;*/
        /*text-align: center;*/
        /*line-height: 50px;*/
        /*font-size: 18px;*/
        /*z-index: 99;*/
        /*font-size: 16px;*/
    /*}*/
    .segmented{
        margin: 8px;
    }
    .segmente .button{
        border-color: #01B38B;
        color: #01B38B;
    }
    .segmente .button-active{
        background: #01B38B;
        color: #FFFFFF;
    }
</style>
