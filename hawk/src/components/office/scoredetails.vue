<template>
    <f7-page hide-toolbar-on-scroll>
        <f7-navbar title="详情" back-link>
            <f7-nav-right v-if="!isDone">
                <f7-link @click="newData.show = true">
                    添加
                </f7-link>
            </f7-nav-right>
        </f7-navbar>
        <f7-list inline-labels>
            <f7-list-input label="考核名称" type="text"
                           :value="scoreData.title"
                           @input="scoreData.title = $event.target.value" placeholder="请输入考核名称"
                           :readonly="isDone"
                           :clear-button="!isDone">
            </f7-list-input>
            <f7-list-item v-if="!isCustom">
                <div>开始时间</div>
                <div @click="openDatePickerFrom()">{{scoreData.date.from.toHawkDateString()}}</div>
            </f7-list-item>
            <f7-list-item v-if="!isCustom">
                <div>结束时间</div>
                <div @click="openDatePickerTo()">{{scoreData.date.to.toHawkDateString()}}</div>
            </f7-list-item>

            <f7-list-item v-if="isCustom">
                <div>执行时间</div>
                <div @click="openDatePicker()">{{scoreData.date.from.toHawkDateString()}}</div>
            </f7-list-item>

            <f7-list-item v-if="!isDone">
                <span>执行</span>
                <label class="toggle toggle-init color-blue">
                    <input type="checkbox" v-model="scoreData.run">
                    <span class="toggle-icon"></span>
                </label>
            </f7-list-item>
        </f7-list>
        <f7-block-title strong>已选执行人({{selectorPersonnel.length}}人)</f7-block-title>
        <f7-block strong>
            <p><span v-for="(item,index) in selectorPersonnel" :key="'selectorPersonnel_'+index">{{item.name}} </span>
            </p>
            <f7-button v-if="!isDone" fill @click="selectorPersonnelShow=true">选择执行人</f7-button>
        </f7-block>
        <f7-list>
        </f7-list>
        <f7-block-title v-if="addArr && addArr.length">加分设置：</f7-block-title>
        <f7-list v-for="(item,index) in addArr" :key="'addArr'+index" class="set_item" swipeout>
            <f7-list-item>
                <div>{{item.title}}</div>
                <span v-if="item.unit">（{{item.unit}}）</span>
                <f7-stepper :disabled="isDone" :max="10000" v-if="item.unitValue != null" color="gray" :value="item.unitValue"
                            @input="item.unitValue = parseInt($event.target.value)"></f7-stepper>
            </f7-list-item>
            <f7-list-item title="加分">
                <f7-stepper :disabled="isDone" :max="10000" color="gray" :value="item.value"
                            @input="item.value = parseInt($event.target.value)"></f7-stepper>
            </f7-list-item>
            <f7-list-item v-if="!isDone">
                <f7-button color="red" style="width: 100%" @click="deleteRule(item)">删除</f7-button>
            </f7-list-item>
        </f7-list>

        <f7-block-title v-if="subArr && subArr.length">扣分设置：</f7-block-title>
        <f7-list v-for="(item,index) in subArr" :key="'subArr'+index" class="set_item" swipeout>
            <f7-list-item>
                <div>{{item.title}}<span v-if="item.unit">（{{item.unit}}）</span></div>
                <f7-stepper :disabled="isDone" :max="10000" v-if="item.unitValue != null" color="gray"
                            :value="item.unitValue"
                            @input="item.unitValue = parseInt($event.target.value)"></f7-stepper>
            </f7-list-item>
            <f7-list-item title="扣分">
                <f7-stepper :disabled="isDone" :max="10000" color="gray" :value="item.value"
                            @input="item.value = parseInt($event.target.value)"></f7-stepper>
            </f7-list-item>
            <f7-list-item v-if="!isDone">
                <f7-button color="red" style="width: 100%" @click="deleteRule(item)">删除</f7-button>
            </f7-list-item>
        </f7-list>

        <f7-block-title v-if="otherArr && otherArr.length">其它设置：</f7-block-title>
        <f7-list v-for="(item,index) in otherArr" :key="'other'+index" class="set_item" swipeout>
            <f7-list-item>
                <div>{{item.title}}<span v-if="item.unit">（{{item.unit}}）</span></div>
                <f7-stepper :max="10000" v-if="item.unitValue != null" color="gray"
                            :value="item.unitValue"
                            @input="item.unitValue = parseInt($event.target.value)"></f7-stepper>
            </f7-list-item>
            <!--<f7-list-item title="考核">-->
                <!--<f7-stepper :max="10000" color="gray" :value="item.value"-->
                            <!--@input="item.value = parseInt($event.target.value)"></f7-stepper>-->
            <!--</f7-list-item>-->
            <f7-list-item v-for="(m, index) in item.more"  :key="'more'+index">
                <div>{{m.title}}<span v-if="m.unit">（{{m.value}}）</span></div>
                <f7-stepper v-if="m.valueType=='add'||m.valueType=='sub'" :max="10000" color="gray"
                            :value="m.value"
                            @input="m.value = parseInt($event.target.value)"></f7-stepper>
                <div v-if="m.valueType=='enum'" @click="selectPicker(m.cols,v=>m.value=v)">{{m.value}}</div>
            </f7-list-item>

            <f7-list-item>
                <f7-button color="red" style="width: 100%" @click="deleteRule(item)">删除</f7-button>
            </f7-list-item>
        </f7-list>

        <f7-block v-if="isDone">
            <f7-button fill-ios big-ios color="gray">已完成</f7-button>
        </f7-block>
        <f7-block v-else>
            <f7-button fill-ios big-ios color="bulre" @click="saveAllScore()">保存</f7-button>
        </f7-block>
        <f7-block>
            <f7-button fill-ios color="red" @click="deleteScoreRule()">删除考核</f7-button>
        </f7-block>
        <f7-popup :opened="newData.show" @popup:closed="newData.show = false">
            <f7-page>
                <f7-navbar title="添加">
                    <f7-nav-right>
                        <f7-link popup-close>取消</f7-link>
                    </f7-nav-right>
                </f7-navbar>
                <f7-list>
                    <f7-list-item title="考核内容" @click="scoreRulePicker">
                        {{newData.data.rule_name||'请选择考核内容项'}}
                    </f7-list-item>
                </f7-list>
                <!--<f7-block-title>请问您要添加哪一项</f7-block-title>-->
                <!--<f7-list>-->
                    <!--<f7-list-item radio :checked="newData.data.valueType=='add'" title="加分项" name="newDatatype"-->
                                  <!--value="add"-->
                                  <!--@change="(e)=>{radio(e)}"></f7-list-item>-->
                    <!--<f7-list-item radio :checked="newData.data.valueType=='sub'" title="减分项" name="newDatatype"-->
                                  <!--value="sub"-->
                                  <!--@change="(e)=>{radio(e)}"></f7-list-item>-->
                <!--</f7-list>-->
                <f7-block-title>修改名称</f7-block-title>
                <f7-list>
                    <f7-list-input type="text" :value="newData.data.title"
                                   @input="newData.data.title = $event.target.value" placeholder="请输入名称"
                                   clear-button></f7-list-input>
                </f7-list>
                <f7-block>
                    <f7-button fill-ios big @click="addScore()">确定</f7-button>
                </f7-block>
            </f7-page>
        </f7-popup>
        <f7-popup :opened="selectorPersonnelShow" @popup:closed="(selectorPersonnelShow = false)">
            <employeepicker
                    :defaultSelected="scoreData.users"
                    :selectedList="selectorPersonnel.map(v => v._id)"
                    @employee:selected="onSelectorPersonne"
                    @employee:cancel="(selectorPersonnelShow = false)"
            ></employeepicker>
        </f7-popup>
    </f7-page>
</template>

<style scoped>
    .set_item {
        margin: 4px 0px;
    }
</style>
<script>
    import {createDateTimePicker} from 'lib/datetime';
    import {mapGetters, mapActions} from 'vuex';
    import employeepicker from 'gadget/employeepicker.vue';
    import axios from 'axios';
    let start_time = new Date()
    let end_time = new Date()
    end_time.setFullYear(start_time.getFullYear()+2)//
    export default {
        components: {
            employeepicker
        },
        props: [
            'score_id',
            'lastPage',
            'ruleModule',
            'tag',
            'scoreDataSrc'
        ],
        data() {
            return {
                selectorPersonnelShow: false,
                selectorPersonnel: [],
                // 数据格式
                scoreData: {
                    title: "",
                    users: [],
                    company: null,
                    ruleModule: '',
                    run: true,
                    date: {
                        from: start_time,
                        to: end_time
                    },
                    rules: []
                },
                scoreType: [],
                newData: {
                    show: false,
                    data: {
                        title: "",
                        unit: "",
                        rule: null,
                        rule_name: '',
                        unitValue: 5,
                        valueType: '',
                        value: 10
                    }
                }
            }
        },
        created() {
            if (this.scoreDataSrc) {
                this.scoreData = this.scoreDataSrc
                this.scoreData.date.from = new Date(this.scoreData.date.from);
                this.scoreData.date.to = new Date(this.scoreData.date.to);
            }
        },
        mounted() {
            axios.get('api/score/scoreRuleType?q=' + JSON.stringify({ruleModule: this.ruleModule || this.scoreData.ruleModule})).then(resp => {
                this.scoreType = resp.data || [];
            }).catch(err => {
                console.error(err);
            })
            this.onSelectorPersonne()
        },

        computed: {
            ...mapGetters([
                'personnel',
                'IamAdmin',
                'departmentName',
                'myCompany'
            ]),
            addArr() {
                return this.scoreData.rules.filter(item => item.valueType == 'add')
            },
            subArr() {
                return this.scoreData.rules.filter(item => item.valueType == 'sub')
            },
            otherArr() {
                return this.scoreData.rules.filter(item => item.valueType != 'sub'&& item.valueType != 'add')
            },
            isDone(){
                return this.scoreData.status=='完成'
            },
            isCustom(){
                return this.ruleModule?(this.ruleModule=='custom'):(this.scoreData.ruleModule=='custom');
            }
        },
        methods: {
            onSelectorPersonne(uIds) {
                if (uIds == null) {
                    uIds = this.scoreData.users
                } else {
                    this.scoreData.users = uIds
                }

                this.selectorPersonnelShow = false;
                let arr = [];
                this.personnel.forEach((p) => {
                    if (uIds.includes(p._id)) {
                        arr.push(p);
                    }
                });
                this.selectorPersonnel = arr
            },
            openDatePickerFrom() {
                if (!this.datepickerFrom) {
                    this.datepickerFrom = $calendar.create({
                        inputEl: '#trace-date-input',
                        monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                        monthNamesShort: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'],
                        dayNames: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
                        dayNamesShort: ['日', '一', '二', '三', '四', '五', '六'],
                        value: [this.scoreData.date.from],
                        closeOnSelect: true,
                        on: {
                            change: (c) => {
                                if (c.value[0]) this.scoreData.date.from = c.value[0]
                            }
                        }
                    });

                }
                this.datepickerFrom.params.maxDate = this.scoreData.date.to
                this.datepickerFrom.open();
            },
            openDatePicker() {
                if (this.isDone) return
                if (!this.datepickerFrom) {
                    this.datepickerFrom = $calendar.create({
                        inputEl: '#trace-date-input',
                        monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                        monthNamesShort: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'],
                        dayNames: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
                        dayNamesShort: ['日', '一', '二', '三', '四', '五', '六'],
                        value: [this.scoreData.date.from],
                        closeOnSelect: true,
                        disabled: {
                            to: this.getDateStr(-1)
                        },
                        on: {
                            change: (c) => {
                                if (c.value[0]) this.scoreData.date.from = c.value[0]
                            }
                        }
                    });

                }
                this.datepickerFrom.open();
            },
            openDatePickerTo() {
                if (!this.datepickerTo) {
                    this.datepickerTo = $calendar.create({
                        inputEl: '#trace-date-input',
                        monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                        monthNamesShort: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'],
                        dayNames: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
                        dayNamesShort: ['日', '一', '二', '三', '四', '五', '六'],
                        value: [this.scoreData.date.to],
                        closeOnSelect: true,
                        on: {
                            change: (c) => {
                                if (c.value[0]) this.scoreData.date.to = c.value[0]
                            }
                        }
                    });

                }
                this.datepickerTo.params.minDate = this.scoreData.date.from
                this.datepickerTo.open();
            },
            scoreRulePicker() {
                let nameArr = []
                let ruleArr = []
                this.scoreType.filter(item => {
                    nameArr.push(item.name)
                    ruleArr.push(item.rule)
                })
                var pickerDevice = $f7.picker.create({
                    inputEl: '#demo-picker-device',
                    toolbarCloseText: "确定",
                    cols: [
                        {
                            textAlign: 'center',
                            values: nameArr,
                        }
                    ],
                    on: {
                        change: (picker, values, displayValues) => {
                            for (let key in this.scoreType) {
                                let item = this.scoreType[key]
                                if (item.name == values[0]) {
                                    this.newData.data = item.default
                                    this.newData.data.rule_name = item.name
                                    this.newData.data.rule = item.rule
                                    break;
                                }
                            }
                        },
                        closed: (picker) => {

                        }
                    }
                });
                pickerDevice.open()
            },
            addScore() {
                if (!this.newData.data.rule) {
                    $alert('考核内容不能为空');
                    return
                }
                let data = JSON.parse(JSON.stringify(this.newData.data))
                var isExit=false;
                if (data && this.scoreData.rules) {
                    for (let i = 0; i <this.scoreData.rules.length ; i++) {
                        if (data.title == this.scoreData.rules[i].title) {
                            isExit=true;
                        }
                    }

                }
                if (!isExit) {
                    this.scoreData.rules.push(data);
                } else {
                    $alert('已经存在该考核内容的扣分设置');
                }
                this.newData.show = false;

            },
            saveAllScore() {
                if (!this.scoreData.title) {
                    $alert('考核名称不能为空');
                    return
                }
                else if (!this.scoreData.rules.length) {
                    $alert('请点击右上角添加加减分规则');
                    return
                }
                this.scoreData.company = this.myCompany._id
                this.scoreData.ruleModule = this.ruleModule
                this.scoreData.tag = this.tag
                $preloader.show();

                if(this.isCustom){
                    this.scoreData.date.to = this.scoreData.date.from
                }
                axios.post('api/score/scoreRule', this.scoreData).then(resp => {
                    $preloader.hide();
                    if (resp.data.company) {
                        resp.data.date.from = new Date(resp.data.date.from)
                        resp.data.date.to = new Date(resp.data.date.to)
                        this.scoreData = resp.data
                    }
                    //$f7.router.back()
                    this.$f7router.back();
                }).catch(err => {
                    // debugger
                    $preloader.hide();
                    console.error(err);
                    $alert('无法更新数据，请稍后再试', '操作错误');
                })
            },
            deleteScoreRule(){
                axios.delete('api/score/scoreRule/'+this.scoreData._id).then(resp => {
                    $alert('删除成功', '操作成功');
                    // $f7.router.back()
                    this.$f7router.back();
                })
            },
            radio(event) {
                let checked = event.target.checked;
                if (checked) {
                    this.newData.data.valueType = event.target.value;
                }
            },
            deleteRule(item) {
                this.scoreData.rules.splice(this.scoreData.rules.findIndex(v => v == item), 1)
            },
            jumpTo(path, props) {
                props = props || {}
                props.lastPage = this.pageName || "返回"
                this.$f7router.navigate(path, {props});
            },
            getDateStr(AddDayCount) {
                var dd = new Date();
                dd.setDate(dd.getDate()+AddDayCount);
                var y = dd.getFullYear();
                var m = dd.getMonth()+1;
                var d = dd.getDate();
                return y+'-'+(m<10?'0'+m:m)+'-'+d;
            },
            selectPicker(cols,change) {
                let self = this
                const picker = this.$f7.picker.create({
                    inputEl: '#picker-'+Date.now(),
                    toolbarCloseText: '完成',
                    cols: JSON.parse(JSON.stringify(cols)),
                    on: {
                        change: (picker, values, displayValues) => {
                            change(values[0]);
                        }
                    }
                });
                picker.open();
            }
        }
    }
</script>
