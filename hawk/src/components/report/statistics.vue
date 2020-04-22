<template>
    <f7-page  style="background: #f8f8f8">
        <f7-navbar title="汇报统计" back-link>
            <f7-nav-right>
                <f7-link href="#" @click="jumpTo('/report/selectdepartment/')">编辑下属模板</f7-link>
            </f7-nav-right>
        </f7-navbar>

        <div v-if="IamSuperAdmin || IamDepartmentAdmin">
            <div class="nav" :class="{admin:IamSuperAdmin,manager: !IamSuperAdmin && IamDepartmentAdmin}">
                <ul>
                    <li class="nav-li" v-if="IamSuperAdmin" @click="changeTab('company')" v-bind:class="{active:tab == 'company'}">公司</li>
                    <li class="nav-li" @click="changeTab('department')" v-bind:class="{active:tab == 'department'}">部门</li>
                    <li class="nav-li" @click="changeTab('staff')" v-bind:class="{active:tab == 'staff'}">员工</li>
                    <li class="nav-li" @click="changeTab('reportList')" v-bind:class="{active:tab == 'reportList'}">汇报列表</li>
                </ul>
            </div>
            <div id="company" v-show="tab == 'company'">
                <compay-statistics ref="compayStatistics" />
            </div>
            <div  id="departmentDiv" v-show="tab == 'department'">
                <department-statistics ref="departmentStatistics"/>
            </div>
            <div id="staff" v-show="tab == 'staff'">
                <staff-statistics ref="staffStatistics"/>
            </div>
            <div id="reportList" v-show="tab == 'reportList'">
                <report-list />
            </div>

        </div>

        <div v-else>
            <self-statistics ref="selfStatistics"/>
        </div>

    </f7-page>
</template>
<style scoped>
    ul,li{
        margin: 0;
        padding: 0;
        list-style: none;
    }
    .nav{
        background: #FFFFFF;
        /*padding-left: 30px;*/
        height: 60px;
        padding-bottom: 5px;
    }

    .nav-li{
        float: left;
        font-size: 16px;
        line-height: 50px;
        text-align: center;

        margin-top: 5px;
    }
    .admin .nav-li{
        width: 25%;
    }
    .manager .nav-li{
        width: 32%;
    }
    .active{
        border-bottom: 5px solid #01B38B;
    }
    .nav-li:last-child{
        margin-right: 0;
    }
</style>
<script>
import {mapGetters,mapMutations,mapActions} from 'vuex';
import Compaystatistics from './companystatistics'
import Departmentstatistics from './departmentstatistics'
import Staffstatistics from './staffstatistics'
import Reportlist from './reportlist'
import Selfstatistics from './selfstatistics'

import axios from 'axios';
export default {
    id:'statisticsIndex',
    name: 'statisticsIndex',
    components:{
        'compay-statistics':Compaystatistics,
        'staff-statistics':Staffstatistics,
        'department-statistics':Departmentstatistics,
        'report-list':Reportlist,
        'self-statistics':Selfstatistics,
    },
    props: {
        lastPage: {
            type: String,
            default: '上一页'
        },
        title: {
            type: String,
            default: '数据查看'
        },
        which: {
            type: String,
            default: ''
        }
    },

    data: () => {
        return {
            tab:"",
        }
    },

    computed: {
        ...mapGetters([
            'superAdmin',
            'myCompany',
            'myProfile',
            'isDepartmentAdmin',
            'departments',
            'departmentName'
        ]),
        IamDepartmentAdmin(){
            if (this.myProfile._id){
                return this.isDepartmentAdmin(this.myProfile._id)
            }
        },
        IamSuperAdmin(){
            if (this.myProfile._id && this.superAdmin ){
                return this.superAdmin._id == this.myProfile._id
            }
        }
    },

    mounted: function() {
        this.initStatistics();
    },
    watch:{

    },
    methods: {
        jumpTo(path, properties) {
            this.$f7router.navigate(path, {
                props: properties
            });
        },
        initStatistics(){
            if (this.IamSuperAdmin ){
                this.setTab("company")
                this.$refs.compayStatistics.getStatisticsData()
                this.$refs.departmentStatistics.getStatisticsData()
                this.$refs.staffStatistics.getStatisticsData()
                this.$refs.compayStatistics.resize()
            }else if (this.IamDepartmentAdmin){
                this.setTab("department")

                this.$refs.departmentStatistics.getStatisticsData()
                this.$refs.staffStatistics.getStatisticsData()
                this.$refs.departmentStatistics.resize()
            } else {
                this.$refs.selfStatistics.getStatisticsData()
                this.$refs.selfStatistics.resize()
            }
            if (this.which) this.setTab("reportList")
        },
        jumpTo(path, properties) {
            this.$f7router.navigate(path, {
                props: properties
            });
        },
        setTab(val){
            this.tab = val;
            this.changeTab(val)
        },
        changeTab(val){
            this.tab = val;
            // alert(this.tab)
            // document.getElementById("company").hidden='hidden';
            // document.getElementById("departmentDiv").hidden=true;
            // document.getElementById("staff").hidden=true;
            // document.getElementById("reportList").hidden=true;
            this.$nextTick(() => {
                if (val == 'department') {
                    // document.getElementById("departmentDiv").hidden = false;
                    this.$refs.departmentStatistics.resize();
                }
                if (val == 'company') {
                    // document.getElementById("company").hidden = false;
                    this.$refs.compayStatistics.resize();
                }
                if (val == 'staff') {
                    // document.getElementById("staff").hidden = false;
                    this.$refs.staffStatistics.resize();
                }
            })
        }
    }
}
</script>
