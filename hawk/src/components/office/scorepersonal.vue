<template>

    <f7-page @page:reinit="load">
        <f7-navbar>
            <!--<f7-nav-right>-->
            <!--<f7-link @click="openPicker()">历史考核</f7-link>-->
            <!--</f7-nav-right>-->
            <f7-nav-left>
                <f7-link icon-only @click="back">
                    <i class="icon icon-back"></i>
                </f7-link>
            </f7-nav-left>
            <f7-nav-title>{{(isSuperadmin?'员工':who(uId||myUserId).name)+'考核明细'}}</f7-nav-title>
            <f7-nav-right v-if="myProfile.superadmin || parentDepartmentId">
                <f7-link v-if="!isSuperadmin" @click="selectorPersonnelShow=true">
                    其它员工
                </f7-link>
            </f7-nav-right>
        </f7-navbar>
        <div v-if="isSuperadmin">
            <employeepicker
                    :multiple="false"
                    :parentDepartmentId="parentDepartmentId"
                    @employee:selected="onSelectorPersonne"
                    @employee:cancel="selectorPersonnelShow = false"
            ></employeepicker>
        </div>
        <div v-else>
            <f7-list style="background-color: white; margin: 0px;">
                <f7-list-item>
                    <div class="ts_con clearfix">
                        <div class="ts">
                            <div>{{who(uId||myUserId).name}}</div>
                            <div>总分：<span class="score">{{totalScore}}</span><span>（初始分{{initScore}}）</span></div>

                        </div>
                        <div class="asp">
                            <div @click="openPicker()">{{filter.from.getFullYear()}}年{{filter.from.getMonth()+1}}月考核
                            </div>
                        </div>
                    </div>
                </f7-list-item>
            </f7-list>
            <!--<div v-if="!addScore&&!subScore" class="no_data">没有加减分数据</div>-->
            <table class="info_con" cellspacing="0">
                <tbody>
                <tr>
                    <td class="inof_title" colspan="2">
                        <div></div>
                        加分：{{addScore}}
                    </td>
                </tr>

                <tr v-if="task.addArr.length">
                    <td>任务</td>
                    <td>
                        <p v-for="item in task.addArr" @click="showDetail(item)" v-if="item.score>=0">{{item.detail}}
                            加{{item.score}}分</p>
                    </td>
                </tr>
                <tr v-if="attendance.addArr.length">
                    <td>考勤</td>
                    <td>
                        <p v-for="item in attendance.addArr" @click="showDetail(item)">
                            {{item.detail}}
                            加{{item.score}}分<span v-if="item.status=='撤消'">(已撤消)</span></p>
                    </td>
                </tr>
                <tr v-if="report.addArr.length">
                    <td>汇报</td>
                    <td>
                        <p v-for="item in report.addArr" @click="showDetail(item)">{{item.detail}}
                            加{{item.score}}分<span v-if="item.status=='撤消'">(已撤消)</span></p>
                    </td>
                </tr>
                <tr v-if="daily.addArr.length">
                    <td>日报</td>
                    <td>
                        <p v-for="item in daily.addArr" @click="showDetail(item)">{{item.detail}}
                            加{{item.score}}分<span v-if="item.status=='撤消'">(已撤消)</span></p>
                    </td>
                </tr>
                <tr v-if="visit.addArr.length">
                    <td>拜访</td>
                    <td>
                        <p v-for="item in visit.addArr" @click="showDetail(item)">{{item.detail}}
                            加{{item.score}}分<span v-if="item.status=='撤消'">(已撤消)</span></p>
                    </td>
                </tr>
                <tr v-if="custom.addArr.length">
                    <td>其它</td>
                    <td>
                        <p v-for="item in custom.addArr" @click="showDetail(item)">{{item.detail}}
                            加{{item.score}}分<span v-if="item.status=='撤消'">(已撤消)</span></p>
                    </td>
                </tr>
                </tbody>
            </table>
            <table class="info_con" cellspacing="0">
                <tbody>
                <tr>
                    <td class="inof_title" colspan="2">
                        <div></div>
                        扣分：{{subScore}}
                    </td>
                </tr>

                <tr v-if="task.subArr.length">
                    <td>任务</td>
                    <td>
                        <p v-for="item in task.subArr" @click="showDetail(item)">{{item.detail}}
                            扣{{item.score}}分<span v-if="item.status=='撤消'">(已撤消)</span></p>
                    </td>
                </tr>
                <tr v-if="attendance.subArr.length">
                    <td>考勤</td>
                    <td>
                        <p v-for="item in attendance.subArr" @click="showDetail(item)">{{item.detail}}
                            扣{{item.score}}分<span v-if="item.status=='撤消'">(已撤消)</span></p>
                    </td>
                </tr>
                <tr v-if="report.subArr.length">
                    <td>汇报</td>
                    <td>
                        <p v-for="item in report.subArr" @click="showDetail(item)">{{item.detail}}
                            扣{{item.score}}分<span v-if="item.status=='撤消'">(已撤消)</span></p>
                    </td>
                </tr>
                <tr v-if="daily.subArr.length">
                    <td>日报</td>
                    <td>
                        <p v-for="item in daily.subArr" @click="showDetail(item)">{{item.detail}}
                            扣{{item.score}}分<span v-if="item.status=='撤消'">(已撤消)</span></p>
                    </td>
                </tr>
                <tr v-if="visit.subArr.length">
                    <td>拜访</td>
                    <td>
                        <p v-for="item in visit.subArr" @click="showDetail(item)">{{item.detail}}
                            扣{{item.score}}分<span v-if="item.status=='撤消'">(已撤消)</span></p>
                    </td>
                </tr>
                <tr v-if="custom.subArr.length">
                    <td>其它</td>
                    <td>
                        <p v-for="item in custom.subArr" @click="showDetail(item)">{{item.detail}}
                            扣{{item.score}}分<span v-if="item.status=='撤消'">(已撤消)</span></p>
                    </td>
                </tr>
                </tbody>
            </table>

        </div>
        <f7-popup id="score-filter">
            <f7-page>
                <f7-navbar title="选择筛选条件">
                    <f7-nav-right>
                        <f7-link href="#" @click="$f7.popup.close('#score-filter')">取消</f7-link>
                        <f7-link href="#" @click="setFilter">确定</f7-link>
                    </f7-nav-right>
                </f7-navbar>

                <f7-block-title>选项</f7-block-title>

                <f7-list
                        inline-labels no-hairlines-md
                >
                    <f7-list-input
                            label="员工"
                            :value="filter.user && who(filter.user).name || '请选择'"
                            @focus="$f7.popup.open('#score-personnelselector')"
                    >
                        <f7-icon slot="media" fa="user"></f7-icon>
                    </f7-list-input>

                    <f7-list-input
                            input-id="score-filter-from"
                            label="开始日期"
                            @focus="openDatePicker('from')"
                            :value="filter.from && filter.from.toLocaleDateString() || ''"
                            @change="filter.from = new Date($event.target.value)"
                    >
                        <f7-icon slot="media" fa="calendar"></f7-icon>
                    </f7-list-input>

                    <f7-list-input
                            input-id="score-filter-to"
                            label="结束日期"
                            @focus="openDatePicker('to')"
                            :value="filter.to && filter.to.toLocaleDateString() || ''"
                            @change="filter.to = new Date($event.target.value)"
                    >
                        <f7-icon slot="media" fa="calendar"></f7-icon>
                    </f7-list-input>
                </f7-list>
            </f7-page>
        </f7-popup>
        <f7-sheet class="detail-sheet" :opened="detail.sheet" @sheet:closed="detail.sheet = false">
            <f7-toolbar>
                <div class="right">
                    <f7-link sheet-close>知道了</f7-link>
                </div>
            </f7-toolbar>
            <f7-page-content style="background-color: white">
                <f7-block class="detail_con" v-if="detail.record">
                    <p>员工: {{who(detail.record.user).name}}</p>
                    <p>时间: {{(new Date(detail.record.at)).toHawkString()}}</p>
                    <p>项目: {{detail.record.category}} ({{detail.record.type}})</p>
                    <p>分数: {{detail.record.rule.valueType=='sub'?'-':''}}{{detail.record.score}}</p>
                    <p>详情: {{detail.record.detail}}</p>
                    <f7-link v-if="detail.record.type=='任务'" @click="gotoTask(detail.record.ref)">任务详情</f7-link>
                    <f7-link v-if="isAdmin&&detail.record.status=='正常'" @click="changeStatus(detail.record,'撤消')">
                        撤消该分数
                    </f7-link>
                    <f7-link v-if="isAdmin&&detail.record.status=='撤消'" @click="changeStatus(detail.record,'正常')">
                        恢复该分数
                    </f7-link>
                </f7-block>
            </f7-page-content>
        </f7-sheet>
        <f7-popup :opened="selectorPersonnelShow" @popup:closed="(selectorPersonnelShow = false)">
            <employeepicker
                    :multiple="false"
                    :parentDepartmentId="parentDepartmentId"
                    @employee:selected="onSelectorPersonne"
                    @employee:cancel="selectorPersonnelShow = false"
            ></employeepicker>
        </f7-popup>
    </f7-page>
</template>
<style scoped>
    .detail_con {
        margin: 1px 0px;
        padding: 10px;
    }

    .info_con {
        width: 100%;
        background-color: white;
        border: none;
        margin: 10px 0px;
        /*border-top: 1px solid #dedede;*/
        /*border-bottom: 1px solid #dedede;*/
    }

    .info_con tr > td {
        font-size: 16px;
        /*padding: 20px 10px;*/
        border-bottom: 1px solid #dedede;
        color: #9c9c9c;
    }

    .info_con tr > td > p {
        padding: 10px 4px;
        border-bottom: 1px solid #dedede;
    }

    .info_con tr > td > p:last-child {
        border-bottom: none
    }

    .info_con tr > td:first-child {
        width: 50px;
    }

    .info_con tr > td:first-child {
        text-align: center;
        border-right: 1px solid #dedede;
        color: #696969;
    }

    .info_con tr:last-child > td {
        border-bottom: none;
    }

    .info_con .inof_title {
        padding: 10px 0px;
        font-size: 18px;
        text-align: left !important;
        line-height: 29px;
        border-right: none !important;
    }

    .info_con .inof_title > div {
        width: 4px;
        height: 28px;
        float: left;
        margin-right: 10px;
        background-color: #2196F3;
    }

    .info_con p {
        margin: 0;
    }

    .page {
        background-color: #f8f8f8 !important;
    }

    .block {
        background-color: white;
    }

    .ts_con {
        height: 95px;
        width: 100%;
    }

    .ts {
        text-align: left;
        /*width: 240px;*/
        margin-top: 20px;
        margin-left: 10px;
        float: left;
    }

    .ts > div:first-child {
        font-size: 22px;
    }

    .ts > div {
        font-size: 18px;
        line-height: inherit;
    }

    .score {
        font-size: 24px !important;
    }

    .ts > div > span {
        font-size: 14px;
        color: #616161;
    }

    .asp {
        position: absolute;
        top: 10px;
        right: 10px;
        background-color: #01B38B;
        border-radius: 12px;
        padding: 2px 8px;
    }

    .asp > div {
        font-size: 14px;
        color: white;
    }

    .no_data {
        text-align: center;
        color: #999999;
    }
</style>
<script>
    import {createDateTimePicker} from 'lib/datetime';
    import {mapGetters, mapActions} from 'vuex';
    import personnelselector from 'gadget/personnelselector.vue';
    import employeepicker from 'gadget/employeepicker.vue';
    import axios from 'axios';

    export default {
        components: {
            personnelselector,
            employeepicker,
        },

        props: [
            'which',
            'lastPage',
            'uId' // 用于查看其他员工
        ],

        data() {
            return {
                pageName: "个人考核明细",
                filter: {
                    user: '',
                    from: new Date(),
                    to: new Date()
                },
                tmp_filter: {},
                records: [],
                totalScore: 0,
                addScore: 0,
                subScore: 0,
                picker: {
                    from: null,
                    to: null
                },
                detail: {
                    sheet: false,
                    record: null
                },
                parentDepartmentId: null,
                selectorPersonnelShow: false,
                initScore: 0
            }
        },

        mounted: function () {
            if (this.superAdmin._id !== this.myProfile._id) {
                let myDepartment = this.adminDepartment(this.myProfile._id)
                this.parentDepartmentId = myDepartment ? myDepartment.departmentId : null
            }

            let now = this.getNowFilter()
            Object.assign(this.filter, {
                user: this.uId || this.myUserId,
                from: now.from,
                to: now.to
            });

            if (!this.picker.from) {
                this.picker.from = createDateTimePicker(
                    this.$f7,
                    (date) => {
                        this.filter.from = date
                    },
                    this.filter.from
                );
            }

            if (!this.picker.to) {
                this.picker.to = createDateTimePicker(
                    this.$f7,
                    (date) => {
                        this.filter.to = date
                    },
                    this.filter.to
                );
            }
            axios.get('/api/user/getSalary/' + (this.uId || this.myUserId)).then(res => {
                this.initScore = parseInt(res.data.salary)
                this.load();
            }).catch(err => {
                this.load();
            })

            if (this.which === 'selectorPersonnelShow') {
                this.$nextTick(() => {
                    this.selectorPersonnelShow = true
                })
            }
        },

        computed: {
            ...mapGetters([
                'myUserId',
                'myProfile',
                'who',
                'myCompany',
                'adminDepartment',
                'superAdmin'
            ]),
            isSuperadmin() {
                return this.myProfile.superadmin && (this.uId ? this.myProfile._id == this.uId : true)
            },
            report() {
                return this.pScore('汇报')
            },
            attendance() {
                return this.pScore('考勤')
            },
            task() {
                return this.pScore('任务')
            },
            daily() {
                return this.pScore('日报')
            },
            visit() {
                return this.pScore('拜访')
            },
            custom() {
                return this.pScore('自定义加减')
            },
            isAdmin() {
                return this.myProfile.superadmin || this.myProfile.privilege.filter(item => item == '考核设置').length
            },
        },

        methods: {
            pScore(type) {
                let records = this.records.filter(r => r.type == type);
                let addArr = [], subArr = [], addScore = 0, subScore = 0
                let total = records.reduce((accumulator, currentValue) => {
                    if (currentValue.rule) {
                        if (currentValue.rule.valueType == 'add') {
                            addArr.push(currentValue)
                            if (currentValue.status == '正常') {
                                addScore += currentValue.score
                                return accumulator + currentValue.score
                            }
                        } else if (currentValue.rule.valueType == 'sub') {
                            subArr.push(currentValue)
                            if (currentValue.status == '正常') {
                                subScore += currentValue.score
                                return accumulator - currentValue.score
                            }
                        }
                    }
                }, 0);
                return {total, records, addArr, subArr, addScore, subScore};
            },
            // 获取本月开始和结束时间
            getNowFilter(nowDate) {
                let now = nowDate || new Date()
                let year = now.getFullYear()
                let month = now.getMonth()
                let date = new Date(year, month + 1, 0).getDate();
                let from = new Date(year, month, 1)
                let to = new Date(year, month, date)
                return {from, to}
            },
            showDetail(r) {
                this.detail.record = r;
                this.detail.sheet = true;
            },

            selectEmployee(pList) {
                if (pList && pList[0]) this.filter.user = pList[0];
                $popup.close('#score-personnelselector');
            },
            setFilter() {
                if (this.filter.from.getTime() > this.filter.to.getTime()) {
                    $alert('开始时间不能大于结束时间', '操作错误');
                    return;
                }
                $popup.close('#score-filter');
                this.load();
            },
            // 计算分数
            doScoring() {
                let arr = [this.report, this.attendance, this.task, this.daily, this.visit, this.custom]
                let add = 0
                let sub = 0
                for (let i in arr) {
                    add += arr[i].addScore
                    sub += arr[i].subScore
                }
                this.addScore = add
                this.subScore = sub
                this.totalScore = this.initScore + add - sub
            },
            // 打开日期选项卡
            openDatePicker(which) {
                let name = 'datepicker' + which;
                let id = "#score-filter-" + which;

                if (!this[name]) {
                    this[name] = $calendar.create({
                        inputEl: id,
                        maxDate: new Date(),
                        closeOnSelect: true
                    });
                }
                this[name].open();
            },
            // 获取分数
            load() {
                this.records = [];

                $preloader.show();
                axios.get('api/score?q=' + JSON.stringify(this.filter)).then(resp => {
                    $preloader.hide();
                    this.records = resp.data;
                    this.doScoring()
                }).catch(err => {
                    $preloader.hide();
                    console.error(err);
                    $alert('无法更新数据，请稍后再试', '操作错误');
                })
            },
            // 跳转到任务详情
            gotoTask(t) {
                if (!t) return;
                this.detail.sheet = false;

                this.$f7router.navigate('/office/taskdetail/', {
                    props: {
                        lastPage: '考核结算',
                        id: t._id
                    }
                })
            },
            jumpTo(path, props) {
                props = props || {}
                props.lastPage = this.pageName
                this.$f7router.navigate(path, {props});
            },
            onSelectorPersonne(uIds) {
                this.selectorPersonnelShow = false;
                if (uIds.length) {
                    this.$f7router.navigate('/office/scorepersonal/', {
                        reloadCurrent: true,
                        props: {
                            lastPage: '员工管理',
                            uId: uIds[0]
                        }
                    });
                }
            },
            changeStatus(item, status) {
                if (this.isAdmin) {
                    let tip = '你确定要执行此操作吗？'
                    if (status == '撤消') tip = '你确定要撤消这条记录吗？'
                    if (status == '正常') tip = '你确定要恢复这条记录吗？'
                    $confirm(tip, '操作确认', () => {
                        axios.put('/api/score/scoreStatus/' + item._id, {
                            status,
                            superAdminId: this.superAdmin._id,
                            whoScore: this.uId || this.myUserId,
                            superAdminInfo: `亲，${this.myProfile.name}${status == '撤消' ? '撤销' : '恢复'}了${this.who(this.uId || this.myUserId).name}${item.category}的${item.rule.valueType=='sub'?'扣分':'加分'}`,
                            myInfo: `亲，您的${item.category}的${item.rule.valueType=='sub'?'扣分':'加分'}被${this.myProfile.name}${status == '撤消' ? '撤销' : '恢复'}了`
                        }).then(res => {
                            item.status = status
                            this.doScoring()
                            $alert('操作成功')
                        }).catch(err => {
                            $alert('操作失败' + err)
                        })
                    })
                }
            },
            openPicker() {
                function getYear(tip) {
                    let arr = []
                    let year = new Date().getFullYear()
                    let index = year - 10
                    for (index; index <= year; index++) {
                        arr.push(tip ? (index + tip) : index);
                    }
                    return arr
                }

                let picker = this.$f7.picker.create({
                    inputEl: '#picker-device',
                    toolbarCloseText: '完成',
                    // rotateEffect: true,
                    value: [this.filter.from.getFullYear(), this.filter.from.getMonth() + 1],
                    cols: [
                        {
                            textAlign: 'left',
                            values: getYear(),
                            displayValues: getYear("年")
                        },
                        {
                            values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                            displayValues: ('1月 2月 3月 4月 5月 6月 7月 8月 9月 10月 11月 12月').split(' ')
                        },
                    ],
                    on: {
                        change: (picker, values, displayValues) => {
                            let date = new Date()
                            date.setFullYear(values[0])
                            date.setMonth(values[1] - 1)
                            let filter = this.getNowFilter(date)
                            this.tmp_filter = filter
                        },
                        close: (picker) => {
                            this.filter.from = this.tmp_filter.from
                            this.filter.to = this.tmp_filter.to
                            this.load()
                        }
                    }
                });
                picker.open();
            },

            back() {
                this.detail.sheet = false;
                this.$f7router.back();
            }
        }
    }
</script>
