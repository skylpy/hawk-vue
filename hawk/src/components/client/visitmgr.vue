<template>
    <f7-page @page:beforein="loadVisitmgr" class="visitmgr_page">
        <f7-navbar title="拜访管理" back-link >
            <f7-nav-right>
                <f7-link @click="selectorPersonnelShow=true,selectChartsPersonnelMode=false" v-if="tabindex == 'statistics'&&(!myProfile.superadmin || !isDepartmentAdmin(myProfile._id))">查看员工</f7-link>
                <f7-link @click="$f7router.navigate('/client/visitseacher/')" v-if="tabindex == 'list'">详细搜索</f7-link>
            </f7-nav-right>
        </f7-navbar>

        <f7-toolbar tabbar labels>
            <f7-link tab-link="#statistics" id="statisticsToolbar" tabLinkActive>
                <img class="default" alt="icon" :src="toolbar_icon.statistics">
                <img class="active" alt="icon" :src="toolbar_icon.statistics_active">
                <div class="tab-text">统计</div>
            </f7-link>
            <f7-link tab-link="#list" id="sListToolbar">
                <img class="default" alt="icon" :src="toolbar_icon.list">
                <img class="active" alt="icon" :src="toolbar_icon.list_active">
                <div class="tab-text">列表</div>
            </f7-link>
        </f7-toolbar>

        <f7-tabs class="content">
            <f7-tab @tab:show="tabindex = 'statistics'" id="statistics" style="height: 100%" tab-active>
                <div class="tab_fix_height">
                    <div class="tab_link_con">
                        <div v-if="myProfile.superadmin" :style="{width:(100/tab_num+'%')}"
                             @click="tabSelect='company'" :class="{select:tabSelect=='company'}">公司
                        </div>
                        <div v-if="myProfile.superadmin || isDepartmentAdmin(myProfile._id)" :style="{width:(100/tab_num+'%')}" @click="tabSelect='department'"
                             :class="{select:tabSelect=='department'}">部门
                        </div>
                        <div :style="{width:(100/tab_num+'%')}" @click="tabSelect='employees'"
                             :class="{select:tabSelect=='employees'}">员工
                        </div>
                    </div>
                </div>
                <div class="tab_fix_content">
                    <div v-if="tabSelect=='company'">
                        <div class="statistics_con">
                            <div class="select_con">
                                <div @click="selectPicker('company_time', company.filter.time, (v)=>{company.filter.time=v;getChart(company)}, ['近一周','近一月','近三月','近半年','近一年'])">
                                    {{company.filter.time}}<span class="f7-icons">chevron_down</span></div>
                                <div @click="selectPicker('company_visitType', company.filter.visitType, (v)=>{company.filter.visitType=v;showSeries(company)}, ['拜访总数(客户)','电话拜访数(客户)','走访拜访数(客户)','拜访总数(商家)','电话拜访数(商家)','走访拜访数(商家)'])">
                                    {{company.filter.visitType}}<span class="f7-icons">chevron_down</span></div>
                            </div>
                            <div class="statistics">
                                <v-chart class="vchart" :options="company.polar" :auto-resize="true" ref="line"/>
                            </div>
                        </div>
                        <div class="count_list">
                            <div>
                                <div class="box box_green"/>
                                拜访总数(客户)：<span>{{company.records.client.count||0}}个</span></div>
                            <div>
                                <div class="box box_orange"/>
                                电话拜访数(客户)：<span>{{company.records.client_tel.count||0}}个</span></div>
                            <div>
                                <div class="box box_blue"/>
                                走访拜访数(客户)：<span>{{company.records.client_visit.count||0}}个</span></div>
                        </div>
                        <div class="count_list">
                            <div>
                                <div class="box box_red"/>
                                拜访总数(商家)：<span>{{company.records.merchants.count||0}}个</span></div>
                            <div>
                                <div class="box box_purple"/>
                                电话拜访数(商家)：<span>{{company.records.merchants_tel.count||0}}个</span></div>
                            <div>
                                <div class="box box_black"/>
                                走访拜访数(商家)：<span>{{company.records.merchants_visit.count||0}}个</span></div>
                        </div>
                        <!--<img @click="addVisit" class="bt_add" src="../../../src/assets/images/btn_oval_add_green@2x.png">-->
                    </div>
                    <div v-if="tabSelect=='department'">
                        <div class="statistics_con">
                            <div class="select_con">
                                <div @click="selectPicker('department_time', department.filter.time, (v)=>{department.filter.time=v;getChart(department)}, ['近一周','近一月','近三月','近半年','近一年'])">
                                    {{department.filter.time}}<span class="f7-icons">chevron_down</span></div>
                                <div @click="selectorDepartmentpickerShow=true">
                                    {{department.filter.department?department.filter.department.name:'选择部门'}}<span class="f7-icons">chevron_down</span></div>
                                <div @click="selectPicker('department_visitType', department.filter.visitType, (v)=>{department.filter.visitType=v;showSeries(department)}, ['拜访总数(客户)','电话拜访数(客户)','走访拜访数(客户)','拜访总数(商家)','电话拜访数(商家)','走访拜访数(商家)'])">
                                    {{department.filter.visitType}}<span class="f7-icons">chevron_down</span></div>
                            </div>
                            <div class="statistics">
                                <v-chart class="vchart" :options="department.polar" :auto-resize="true" ref="line"/>
                            </div>
                        </div>

                        <div class="count_list">
                            <div>
                                <div class="box box_green"/>
                                拜访总数(客户)：<span>{{department.records.client.count||0}}个</span></div>
                            <div>
                                <div class="box box_orange"/>
                                电话拜访数(客户)：<span>{{department.records.client_tel.count||0}}个</span></div>
                            <div>
                                <div class="box box_blue"/>
                                走访拜访数(客户)：<span>{{department.records.client_visit.count||0}}个</span></div>
                        </div>
                        <div class="count_list">
                            <div>
                                <div class="box box_red"/>
                                拜访总数(商家)：<span>{{department.records.merchants.count||0}}个</span></div>
                            <div>
                                <div class="box box_purple"/>
                                电话拜访数(商家)：<span>{{department.records.merchants_tel.count||0}}个</span></div>
                            <div>
                                <div class="box box_black"/>
                                走访拜访数(商家)：<span>{{department.records.merchants_visit.count||0}}个</span></div>
                        </div>

                    </div>
                    <div v-if="tabSelect=='employees'">
                        <div class="statistics_con">
                            <div class="select_con">
                                <div @click="selectPicker('employees_time', employees.filter.time, (v)=>{employees.filter.time=v;getChart(employees)}, ['近一周','近一月','近三月','近半年','近一年'])">
                                    {{employees.filter.time}}<span class="f7-icons">chevron_down</span></div>
                                <div @click="selectorPersonnelShow=(myProfile.superadmin || isDepartmentAdmin(myProfile._id))?true:false;selectChartsPersonnelMode=true">
                                    {{
                                    employees.filter.executor.name == myProfile.name && myProfile.superadmin ? myProfile.name : employees.filter.executor.name}}<span class="f7-icons">chevron_down</span>
                                </div>
                                <div @click="selectPicker('employees_visitType', employees.filter.visitType, (v)=>{employees.filter.visitType=v;showSeries(employees)}, ['拜访总数(客户)','电话拜访数(客户)','走访拜访数(客户)','拜访总数(商家)','电话拜访数(商家)','走访拜访数(商家)'])">
                                    {{employees.filter.visitType}}<span class="f7-icons">chevron_down</span></div>
                            </div>
                            <div class="statistics">
                                <v-chart class="vchart" :options="employees.polar" :auto-resize="true" ref="line"/>
                            </div>
                        </div>
                        <div class="count_list">
                            <div>
                                <div class="box box_green"/>
                                拜访总数(客户)：<span>{{employees.records.client.count||0}}个</span></div>
                            <div>
                                <div class="box box_orange"/>
                                电话拜访数(客户)：<span>{{employees.records.client_tel.count||0}}个</span></div>
                            <div>
                                <div class="box box_blue"/>
                                走访拜访数(客户)：<span>{{employees.records.client_visit.count||0}}个</span></div>
                        </div>
                        <div class="count_list">
                            <div>
                                <div class="box box_red"/>
                                拜访总数(商家)：<span>{{employees.records.merchants.count||0}}个</span></div>
                            <div>
                                <div class="box box_purple"/>
                                电话拜访数(商家)：<span>{{employees.records.merchants_tel.count||0}}个</span></div>
                            <div>
                                <div class="box box_black"/>
                                走访拜访数(商家)：<span>{{employees.records.merchants_visit.count||0}}个</span></div>
                        </div>
                    </div>

                    <img @click="addVisit" class="bt_add" src="../../../src/assets/images/btn_oval_add_green@2x.png">
                </div>

            </f7-tab>

            <f7-tab @tab:show="tabindex = 'list'" id="list" style="height: 100%">
                <div class="tab_fix_height" v-if="myProfile.superadmin || isDepartmentAdmin(myProfile._id)">
                    <div class="tab_link_con">
                        <div style="width: 50%" @click="myTabSelect='myVisit'" :class="{select:myTabSelect=='myVisit'}">我的拜访</div>
                        <div style="width: 50%" @click="myTabSelect='distribute'" :class="{select:myTabSelect=='distribute'}">我派发的</div>
                    </div>
                </div>
                <div class="tab_fix_content">
                    <div v-if="myTabSelect=='myVisit'">
                        <div class="warning">
                            <f7-icon class="icon" f7="info_round"></f7-icon>
                            走访拜访请记得去到目的地点击拜访打卡哦！
                        </div>
                        <div class="block_con">
                            <div @click="visitDateil(item,0)" class="block_item" v-for="(item,index) in visitRecords" :key="index">
                                <div class="block_item_title">
                                    <div class="block_item_title_t1">
                                        <div>拜访{{item.clientName}}-{{item.type}}</div>

                                        <div>截止:{{new Date(item.deadline).toMinutesString()}}</div>
                                    </div>
                                    <div class="block_item_title_t2 clearfix">
                                        <div>{{who(item.creator).name}}创建于{{new Date(item.createdAt).toMinutesString()}}</div>
                                        <div v-if="item.status=='已失访'||item.status=='已取消'" class="status_error">
                                            {{item.status}}
                                        </div>
                                        <div v-else-if="item.status=='未完成'" class="status_error">
                                            {{isOvertime(item.deadline) ? '已超时' : item.status}}
                                        </div>
                                        <div v-else-if="item.status=='已完成'" class="status_success">{{item.status}}</div>
                                    </div>
                                </div>
                                <div class="block_item_con clearfix">
                                    <span style="margin-left:10px;font-size: 13px;color: #999999;line-height: 17px">拜访人:</span>
                                    <span style="font-size: 13px;color: #999999;line-height: 17px" v-for="(executor,index) in item.executor">{{who(executor).name+(index == item.executor.length-1?'':',')}}</span>
                                    <span>&nbsp&nbsp&nbsp&nbsp </span>
                                    <span style="margin-left:10px;font-size: 13px;color: #999999;line-height: 17px">{{item.clientClassify == '客户资料'?'拜访客户':'拜访商家'}}</span>
                                    <p>拜访内容：{{item.content}}</p>
                                    <div class="block_item_con_bottom">
                                        <div>详情</div>
                                        <div v-show="item.status=='未完成'">去完成</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-if="myTabSelect=='distribute'">
                        <div class="warning">
                            <f7-icon class="icon" f7="info_round"></f7-icon>
                            走访拜访请记得去到目的地点击拜访打卡哦！
                        </div>
                        <div class="block_con">
                            <div class="block_item" v-for="(item,index) in visitDistribute" :key="index">
                                <div class="block_item_title">
                                    <div class="block_item_title_t1">
                                        <div>拜访{{item.clientName}}-{{item.type}}</div>
                                        <div>截止:{{new Date(item.deadline).toMinutesString()}}</div>
                                    </div>
                                    <div class="block_item_title_t2 clearfix">
                                        <div>{{who(item.creator).name}}创建于{{new Date(item.createdAt).toMinutesString()}}</div>
                                        <div v-if="item.status=='已失访'||item.status=='已取消'" class="status_error">
                                            {{item.status}}
                                        </div>
                                        <div v-else-if="item.status=='未完成'" class="status_error">
                                            {{isOvertime(item.deadline) ? '已超时' : item.status}}
                                        </div>
                                        <div v-else-if="item.status=='已完成'" class="status_success">{{item.status}}</div>
                                    </div>
                                </div>
                                <div class="block_item_con clearfix">
                                    <!--<p>12</p>-->
                                    <!--<p>55</p>-->
                                    <!--<p style="display: inline-block ;padding-top: 0px;background: red">11</p>-->
                                    <!--<p style="display: inline-block">12</p>-->
                                    <span style="margin-left:10px;font-size: 13px;color: #999999;line-height: 17px">拜访人:</span>
                                    <span style="font-size: 13px;color: #999999;line-height: 17px" v-for="(executor,index) in item.executor">{{who(executor).name+(index == item.executor.length-1?'':',')}}</span>
                                    <span>&nbsp&nbsp&nbsp&nbsp </span>

                                    <span style="margin-left:10px;font-size: 13px;color: #999999;line-height: 17px">{{item.clientClassify == '客户资料'?'拜访客户':'拜访商家'}}</span>
                                    <!--<p>拜访人：{{who(item.executor).name}} &nbsp&nbsp&nbsp&nbsp拜访：客户</p>-->

                                    <p>拜访内容：{{item.content}}</p>
                                    <div class="block_item_con_bottom">
                                        <div @click="visitDateil(item,1)">详情</div>
                                        <!--<div @click="visitDateil(item)" v-show="item.status=='未完成'">去完成</div>-->
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--<f7-block>-->
                        <!--<div class="no_data" v-show="visitRecords.length == 0">没有拜访数据</div>-->
                    <!--</f7-block>-->
                    <div v-show="(myTabSelect=='myVisit' && visitRecords.length == 0) || (myTabSelect=='distribute' && visitDistribute.length == 0)" class="no_template">
                        <img :src="zero_employee_icon" width="71px" height="84px">
                        <p>暂无数据</p>
                    </div>
                </div>

                <img @click="addVisit" class="bt_add" src="../../../src/assets/images/btn_oval_add_green@2x.png">
            </f7-tab>
        </f7-tabs>

        <f7-popup :opened="selectorPersonnelShow" @popup:closed="(selectorPersonnelShow = false)">
            <personnelselector
                    :multiple="false"
                    :title = "'选择直属员工'"
                    :subordinate="true"
                    @submit="onSelectorPersonne"
                    @cancel="selectorPersonnelShow=false">
            </personnelselector>
            <!--<directlyuserselector-->
                    <!--:multiple="false"-->
                    <!--:title = "'选择直属员工'"-->
                    <!--@submit="onSelectorPersonne"-->
                    <!--@cancel="selectorPersonnelShow=false"-->
            <!--&gt;</directlyuserselector>-->
        </f7-popup>
        <f7-popup :opened="selectorDepartmentpickerShow" @popup:closed="(selectorDepartmentpickerShow = false)">
            <departmentpicker
                    :multiple="false"
                    @department:selected="onDepartmentPersonne"
                    @department:cancel="selectorDepartmentpickerShow = false"
            ></departmentpicker>
        </f7-popup>
    </f7-page>
</template>
<style lang="scss">
    .visitmgr_page {
        .block_con {
        }

        .status_error {
            color: red;
        }

        .block_item {
            min-height: 164px;
            background-color: white;
            margin-bottom: 10px;
        }

        .block_item_title {
            padding-top: 14px;
            min-height: 45px;
            border-bottom: 1px solid #d8d8d8;
        }

        .block_item_title_t1 {
            font-weight: bold;
            color: #333333;
        }

        .block_item_title_t1 > div:first-child {
            font-size: 17px;
            float: left;
            margin: 0px 5px 0px 15px;

            max-width: 50%;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
        }

        .block_item_title_t1 > div:last-child {
            font-size: 13px;
            float: right;
            margin-top: 3px;
            margin-right: 15px;
        }

        .block_item_title_t2 {
            clear: both;
            color: #666666;
            padding-top: 4px;
        }

        .block_item_title_t2 > div:first-child {
            font-size: 12px;
            float: left;
            margin-left: 15px;
        }

        .block_item_title_t2 > div:last-child {
            font-size: 12px;
            float: right;
            margin-right: 15px;
        }

        .block_item_con {
            padding-top: 10px;
            padding-bottom: 10px;
        }

        .block_item_con > p {
            margin: 4px 10px;
            font-size: 13px;
            color: #999999;
            line-height: 17px;

            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
        }

        .block_item_con_bottom {
            clear: both;
        }

        .block_item_con_bottom > div:first-child {
            font-size: 12px;
            float: left;
            margin-left: 10px;
            color: #01b38b;
            padding: 4px 0px;
        }

        .block_item_con_bottom > div:last-child {
            font-size: 12px;
            float: right;
            margin-right: 15px;
            border-radius: 12px;
            font-size: 12px;
            color: white;
            background-color: #01B38B;
            padding: 4px 9px;
        }

        .block_finish .block_item_title_t1, .block_finish .block_item_title_t2 {
            color: #999999;
        }

        .no_data {
            color: gray;
            font-size: small;
            text-align: center;
        }

        .vchart {
            width: 100% !important;
            height: 100% !important;
        }

        .warning {
            /*width: 100%;*/
            color: #F96A0E;
            background-color: #FFF5E4;
            font-size: 13px;
            padding: 8px;
        }

        .warning > .icon {
            font-size: 12px;
            margin-bottom: 3px;
        }

        .bt_add {
            /*width: 55px;*/
            /*height: 55px;*/
            /*position: fixed;*/
            /*bottom: 50px;*/
            /*right: 4px;*/
            position: absolute;
            bottom: 20px;
            right: 20px;
            width: 55px;
            height: 55px;
            text-align: center;
            line-height: 50px;
            font-size: 18px;
            z-index: 99;
        }

        .content {

            overflow: auto;
            -webkit-overflow-scrolling: touch;
            box-sizing: border-box;
            height: 100%;
            position: relative;
            z-index: 1;
        }
        .count_list {
            color: #333333;
            margin: 10px 0px;
            background-color: white;
        }

        .count_list > div {
            padding-left: 10px;
            height: 45px;
            line-height: 45px;
            border-bottom: 1px solid #d8d8d8;
        }

        .count_list > div:last-child {
            border-bottom: none;
        }

        .box {
            width: 10px;
            height: 10px;
            display: inline-block;
            margin-right: 4px;
        }

        .box_green {
            background-color: #01b38b;
        }

        .box_orange {
            background-color: #fe7f0e;
        }

        .box_blue {
            background-color: #6c9bd9;
        }

        .box_red{
            background-color: #f55b6e;
        }

        .box_purple {
            background-color: #a86ade;
        }

        .box_black {
            background-color: #4a4a4a;
        }

        .statistics_con {
            background-color: white;
        }

        .select_con {
            height: 40px;
            border-bottom: 1px solid #d8d8d8;
        }

        .select_con > div {
            width: 33%;
            float: left;
            link-height: 40px;
            font-size: 14px;
            text-align: center;

            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .select_con > div > span {
            line-height: 40px;
            font-size: 14px;
            margin: 0px 4px;
        }

        .statistics {
            height: 224px;
            background-color: white;
        }

        .tab_fix_height {
            height: 50px;
        }

        .tab_link_con {
            position: fixed;
            width: 100%;

            height: 45px;
            background-color: white;
            margin-bottom: 5px;
        }

        .tab_link_con > div {
            width: 33%;
            float: left;
            text-align: center;
            line-height: 43px;
        }

        .tab_link_con > .select {
            color: #01B38B;
            border-bottom: 2px solid #01B38B;
        }

        .tab-link {
            font-size: 11px;
        }

        .tab-link > .default {
            display: block;
            height: 25px;
        }

        .tab-link > .active {
            display: none;
            height: 25px;
        }

        .tab-link-active > .active {
            display: block;
        }

        .tab-link-active > .default {
            display: none;
        }

        .tab-link-active > .tab-text {
            color: #01B38B;
        }
        .no_template{
            text-align: center;
            margin: 120px 0px auto;
        }
        .no_template p{
            font-size: 14px;
            color: #333333;
            margin: 5px 0;
        }

        .tab_fix_content {
            height: calc(100% - 50px);
            overflow: auto;
        }
    }
</style>
<script>
    import {defaultImgUrl} from 'lib/loading';
    import {mapGetters, mapActions} from 'vuex';
    import personnelselector from 'gadget/personnelselector.vue';
    import directlyuserselector from 'gadget/directlyuserselector.vue';
    import employeepicker from 'gadget/employeepicker.vue';
    import departmentpicker from 'gadget/departmentpicker.vue';
    import clientselector from 'gadget/clientselector.vue';
    import ECharts from 'lib/chart/ECharts.vue';
    import axios from 'axios';
    import moment from 'moment'

    export default {
        props: [
            'lastPage',
            'which'
        ],

        components: {
            personnelselector,
            directlyuserselector,
            departmentpicker,
            clientselector,
            'v-chart': ECharts,
            employeepicker
        },
        data() {
            return {
                tabSelect: '', // company department employees
                tab_num: 3, // 公司 部门 员工 tab显示的数量
                myTabSelect: 'myVisit',
                toolbar_icon: {
                    statistics: require('../../assets/images/icon_tendency_gray@2x.png'),
                    statistics_active: require('../../assets/images/icon_tendency_green@2x.png'),
                    list: require('../../assets/images/icon_my_task_gray@2x.png'),
                    list_active: require('../../assets/images/icon_my_task_green@2x.png')
                },
                tabindex:"statistics",
                selectorPersonnelShow: false, // 查看员工
                selectorDepartmentpickerShow: false,
                selectChartsPersonnelMode: false, // 选择图表员工
                zero_employee_icon: require('assets/images/ill_no_data@2x.png'),
                // 公司 老板可见
                company: {
                    type: "company",
                    filter: {
                        time: '近一周',
                        visitType: '拜访总数(客户)'
                    },
                    records: {client:{},client_tel:{},client_visit:{},merchants:{},merchants_tel:{},merchants_visit:{}},
                    polar: {
                        tooltip: {
                            trigger: 'axis'
                        },
                        grid: {
                            top: '8%',
                            left: '3%',
                            right: '5%',
                            bottom: '3%',
                            containLabel: true
                        },
                        xAxis: {
                            type: 'category',
                            axisLine: {
                                lineStyle: {
                                    color: '#909090'
                                }
                            }
                        },
                        yAxis: {
                            type: 'value',
                        },
                        series: []
                    }
                },
                // 部门
                department: {
                    type: "department",
                    filter: {
                        time: '近一周',
                        department: {},
                        visitType: '拜访总数(客户)'
                    },
                    records: {client:{},client_tel:{},client_visit:{},merchants:{},merchants_tel:{},merchants_visit:{}},
                    polar: {
                        tooltip: {
                            trigger: 'axis'
                        },
                        grid: {
                            top: '8%',
                            left: '3%',
                            right: '5%',
                            bottom: '3%',
                            containLabel: true
                        },
                        xAxis: {
                            type: 'category',
                            axisLine: {
                                lineStyle: {
                                    color: '#909090'
                                }
                            }
                        },
                        yAxis: {
                            type: 'value',
                        },
                        series: []
                    }
                },
                // 员工
                employees: {
                    type: "employees",
                    filter: {
                        time: '近一周',
                        executor: {},
                        visitType: '拜访总数(客户)'
                    },
                    records: {client:{},client_tel:{},client_visit:{},merchants:{},merchants_tel:{},merchants_visit:{}},
                    polar: {
                        tooltip: {
                            trigger: 'axis'
                        },
                        grid: {
                            top: '8%',
                            left: '3%',
                            right: '5%',
                            bottom: '3%',
                            containLabel: true
                        },
                        xAxis: {
                            type: 'category',
                            axisLine: {
                                lineStyle: {
                                    color: '#909090'
                                }
                            }
                        },
                        yAxis: {
                            type: 'value',
                        },
                        series: []
                    }
                },
                pickers: {}, // 存放pickers弹窗集
                visitRecords: [], //个人拜访
                visitDistribute: [], //我的派发 拜访
                all: {
                    client:{name:'拜访总数(客户)',color:"#01b38b", xAxis:[], yAxis:[], type:['电话','走访'], count:0, classify:'客户资料'},
                    client_tel:{name:'电话拜访数(客户)',color:"#fe7f0e", xAxis:[], yAxis:[], type:['电话'], count:0, classify:'客户资料'},
                    client_visit:{name:'走访拜访数(客户)',color:"#6c9bd9", xAxis:[], yAxis:[], type:['走访'], count:0, classify:'客户资料'},
                    merchants:{name:'拜访总数(商家)',color:"#f55b6e", xAxis:[], yAxis:[], type:['电话','走访'], count:0, classify:'商家资料'},
                    merchants_tel:{name:'电话拜访数(商家)',color:"#a86ade", xAxis:[], yAxis:[], type:['电话'], count:0, classify:'商家资料'},
                    merchants_visit:{name:'走访拜访数(商家)',color:"#4a4a4a", xAxis:[], yAxis:[], type:['走访'], count:0, classify:'商家资料'},
                }
            }
        },

        computed: {
            ...mapGetters({
                who: 'who',
                myProfile: 'myProfile',
                departments:'departments',
                departmentById: 'departmentById',
                userDepartment: 'userDepartment',
                adminDepartment: 'adminDepartment',
                isDepartmentAdmin:'isDepartmentAdmin'
            })
        },
        created() {
            //this.tabindex = 'list'
            if (this.which) {
                if (this.which === 'addVisit') {
                    this.addVisit()
                } else if (this.which === 'sListToolbar'){
                    this.$nextTick(() => {
                        document.getElementById(this.which).click()
                        this.myTabSelect = 'distribute'
                    })
                }
            }
        },
        mounted() {
            this.employees.filter.executor = this.myProfile
            let department = this.userDepartment(this.myProfile._id)
            if(department){
                department = this.adminDepartment(this.myProfile._id)
                if (!department) {
                    if (this.departments.length > 0){
                        department = this.departments[0];
                    }
                }
            }else {
                if (this.departments.length > 0){
                    department = this.departments[0];
                }
            }
            this.department.filter.department = department
            //老板
            if (this.myProfile.superadmin) {
                this.tabSelect = 'company'
                this.tab_num = 3
            } else if (!this.myProfile.superadmin && this.isDepartmentAdmin(this.myProfile._id)) {
                this.tabSelect = 'department'
                this.tab_num = 2
                this.loadVisitmgr()
            }else {
                this.tabSelect = 'employees'

                this.tab_num = 1
                this.loadVisitmgr()
            }

            this.getChart(this.company)
            this.getChart(this.department)
            this.getChart(this.employees)
        },

        methods: {
            selectPicker(key, value, selectChange, selectList, displayValues) {
                if (this.pickers[key]) {
                    this.pickers[key].open();
                    return;
                }

                this.pickers[key] = this.$f7.picker.create({
                    inputEl: '#picker_' + key,
                    toolbarCloseText: '完成',
                    cols: [
                        {
                            textAlign: 'center',
                            values: selectList || [],
                            displayValues: displayValues || selectList || [],
                        }
                    ],
                    on: {
                        close: (picker) => {
                            if (picker.value && picker.value.length) {
                                let v
                                if (picker.value[0] == 'true') {
                                    v = true
                                } else if (picker.value[0] == 'false') {
                                    v = false
                                } else {
                                    v = picker.value[0]
                                }
                                if (typeof selectChange == 'function') {
                                    selectChange(v)
                                    this.$forceUpdate();
                                }
                            }
                        }
                    }
                });
                this.pickers[key].setValue([value])
                this.pickers[key].open();
            },
            //获取开始时间
            getStartTime(set) {
                //'近一周','近一月','近三月','近半年','近一年'
                let date = new Date()
                if (set == '近一周') {
                    date.setDate(date.getDate() - 7)
                } else if (set == '近一月') {
                    date.setMonth(date.getMonth() - 1)
                } else if (set == '近三月') {
                    date.setMonth(date.getMonth() - 3)
                } else if (set == '近半年') {
                    date.setMonth(date.getMonth() - 6)
                } else if (set == '近一年') {
                    date.setMonth(date.getMonth() - 12)
                }
                return date
            },
            onSelectorPersonne(uIds) {
                // this.selectChartsPersonnelMode = false

                this.selectorPersonnelShow = false;
                console.log(uIds.toString())
                if (uIds.length) {
                    if (this.selectChartsPersonnelMode) {
                        this.employees.filter.executor = this.who(uIds[0])
                        this.getChart(this.employees)
                    } else {
                        this.$f7router.navigate('/client/visitemployees/', {
                            props: {
                                lastPage: '员工管理',
                                uId: uIds[0]
                            }
                        });
                    }
                }

            },
            onDepartmentPersonne(uIds) {
                console.log(uIds.toString())
                if (uIds.length) {
                    let department = this.departmentById(uIds[0])
                    this.department.filter.department = department
                    this.department.filter.executor = department.employees.concat(department.admin)
                    this.getChart(this.department)
                }
                this.selectorDepartmentpickerShow = false
            },
            getChart(visit) {
                let filter = {
                    // executor: this.myProfile._id,
                    startTime: this.getStartTime(visit.filter.time).getTime(),
                    endTime: Date.now()
                }
                if(visit.type == 'employees'){
                    filter.executor = visit.filter.executor._id
                }
                if(visit.type == 'department'){
                    if(!visit.filter.department) {

                    } else {
                        filter.executor = visit.filter.department.employees.concat(visit.filter.department.admin)
                    }
                }
                $preloader.show();
                axios.get('/api/visit/chart?q=' + JSON.stringify(filter)).then(resp => {
                    $preloader.hide();
                    visit.records = resp.data
                    this.showSeries(visit)

                }).catch(error => {
                    $preloader.hide();
                    console.error(error);
                    // $alert('无法更新数据，请稍后再试', '操作错误');
                })
            },
            showSeries(visit){
                let series = []
                for(let key in visit.records){
                    let item = visit.records[key]
                    if(visit.filter.visitType == item.name){
                        series.push({
                            name: item.name,
                            type: 'line',
                            // smooth: true,
                            data: item.yAxis,
                            itemStyle : {
                                normal : {
                                    lineStyle:{
                                        color:item.color
                                    }
                                }
                            },
                        })
                    }
                }
                visit.polar.series = series
                visit.polar.xAxis.data = visit.records.client.xAxis
                this.$forceUpdate()
            },
            loadVisitmgr() {
                $preloader.show();

                axios.get('/api/visit?q=' + JSON.stringify({executor:this.myProfile._id})).then(resp => {
                    $preloader.hide();
                    this.visitRecords = resp.data;
                }).catch(error => {
                    $preloader.hide();
                    console.error(error);
                    // $alert('无法更新数据，请稍后再试', '操作错误');
                })

                $preloader.show();
                axios.get('/api/visit?q=' + JSON.stringify({creator:this.myProfile._id})).then(resp => {
                    $preloader.hide();
                    this.visitDistribute = resp.data;
                }).catch(error => {
                    $preloader.hide();
                    console.error(error);
                    // $alert('无法更新数据，请稍后再试', '操作错误');
                })
            },
            visitDateil(item,statue){
                this.$f7router.navigate('/client/visitdateil/', {
                    props: {
                        visit: item,
                        statue: statue
                    }
                });
            },
            addVisit(classify) {
                $dialog.create({
                    title: '请问您要新增拜访哪一项？',
                    // text: 'Dialog with vertical buttons',
                    buttons: [
                        {
                            text: '客户',
                            onClick: () => {
                                this.$f7router.navigate('/client/visit/', {props: {classify: "客户资料"}})
                                console.log("客户资料");
                            }
                        },
                        {
                            text: '商家',
                            onClick: () => {
                                this.$f7router.navigate('/client/visit/', {props: {classify: "商家资料"}})
                                console.log("商家资料");
                            }
                        },
                        {
                            text: '取消'
                        },
                    ],
                    verticalButtons: true,
                }).open()
            },
            isOvertime (time) {
                return moment().isAfter(time)
            }
        }
    }
</script>

