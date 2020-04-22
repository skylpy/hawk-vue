<template>
    <f7-page class="help_o">
        <f7-navbar title="操作指引" back-link></f7-navbar>

        <f7-toolbar tabbar>
            <f7-link v-for="(v, i) in tabList"
                     :key="i"
                     :tab-link="v.id"
                     :tab-link-active="tab == i"
                     @click="tab = i">{{v.value}}</f7-link>
        </f7-toolbar>

        <f7-tabs animated>
            <f7-tab v-for="(v, i) in tabList"
                    :key="i"
                    :tab-link="i"
                    v-if="tab == i"
                    style="overflow: auto; padding-bottom: 20px;">
                <div class="list" style="margin: 0">
                    <div class="list-group" v-for="(v1, i1) in v.list" :key="i1">
                        <ul>
                            <li class="list-group-title">{{v1.name}}</li>
                            <li v-for="(v2, i2) in v1.children" :key="i2">
                                <a href="#" class="item-link item-content" @click="go(v2)">
                                    <div class="item-inner">
                                        <div class="item-title" :style="{color: v2.remark ? 'red' : ''}">
                                            {{v2.name}}
                                        </div>
                                    </div>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </f7-tab>
        </f7-tabs>
    </f7-page>
</template>

<script>
import { mapGetters } from 'vuex';
import {
    h_superAdmin,
    h_department,
    h_finance,
    h_administration,
    h_employee
} from '../../lib/help'
export default {
    name: "help",
    data () {
        return{
            tabList: [],
            h_superAdmin,
            h_department,
            h_finance,
            h_employee,
            h_administration,
            tab: 0
        }
    },
    computed: {
        ...mapGetters([
            'myProfile',
            'myUserId',
            'superAdmin',
            'isDepartmentAdmin'
        ]),
        // 判断是财务人员
        isFinance () {
            if (!this.myProfile && !this.myProfile.privilege || this.myProfile.privilege.length == 0) return false
            return this.myProfile.privilege.some(i => ['公司总账', '固定支出', '应收付款', '应付账款', '财务录入', '财务文件', '薪资录入'].includes(i))
        },
        // 判断是行政人员
        isAdministration () {
            if (!this.myProfile && !this.myProfile.privilege || this.myProfile.privilege.length == 0) return false
            return this.myProfile.privilege.some(i => ['合同管理', '企业设置'].includes(i))
        }
    },
    methods: {
        go (data) {
            this.$f7router.navigate('/software/helpContent/', {props: data})
        }
    },
    created() {
        if (this.myUserId == this.superAdmin._id) {
            this.tabList.push({value: '超级管理员', id: '#help_superAdmin', list: this.h_superAdmin})
        } else {
            if (this.isDepartmentAdmin(this.myUserId)) {
                this.tabList.push({value: '部门管理员', id: '#help_department', list: this.h_department})
            }

            if (this.isFinance) {
                this.tabList.push({value: '财务人员', id: '#help_finance', list: this.h_finance})
            }

            if (this.isAdministration) {
                this.tabList.push({value: '行政人员', id: '#help_administration', list: this.h_administration})
            }

            this.tabList.push({value: '员工', id: '#help_employee', list: this.h_employee})
        }
    }
}
</script>

<style lang="scss">
    .help_o {
        .page-content {
            padding-bottom: 50px !important;
        }
    }
    .small {
        width: 80%;
        padding-top: 30px;
        margin: auto;
    }
    .ios .tabbar a.tab-link-active{
        color: #01B38B;
    }
    .no_data{
        color:gray;
        font-size:small;
        text-align: center;
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
    ul,li{
        list-style:none;
        margin: 0px;
        padding: 0px;

    }
    .list_con{
        background-color: white;
    }
    .list_item{
        height: 40px;
        line-height: 40px;
        border-bottom: 1px solid #d8d8d8;
    }
    .list_item_title{
        color: #666666;
        float: left;
        margin-left: 10px;
    }
    .list_item_status{
        float: right;
        margin-right: 10px;
    }
    .status_success{
        color: #01b38b;
    }
    .status_warning{
        color: #ffab00;
    }
    .status_error{
        color: #ff715a;
    }
    .card_list_con{
    }
    .card_item{
        margin: 10px;
        border-radius: 4px;
        min-height: 100px;
        background-color: white;
        position: relative;
        overflow: hidden;
        box-shadow:2px 2px 5px #d0d0d0;
    }
    .card_item_title{
        color: #333333;
        height: 40px;
        line-height: 40px;
        font-weight: bold;
        border-bottom: 1px solid #d8d8d8;
        overflow: hidden;
    }
    .card_item_title>div:first-child{
        float: left;
        margin-left: 10px;
        font-size: 16px;
    }
    .card_item_title>div:last-child{
        float: right;
        font-size: 13px;
        margin-right: 10px;
    }
    .card_item_con{
        color: #999999;
        margin: 14px 10px 10px 10px;
    }
    .card_item_con>div:last-child{
        font-size: 12px;
        text-align: right;
    }
    .card_status{
        height: 100%;
        width: 3px;
        position: absolute;
        top: 0px;
        left: 0px;
    }
    .card_success{
        background-color: #01b38b;
    }
    .card_warning{
        background-color: #ffab00;
    }
    .card_error{
        background-color: #ff715a;
    }
    .block_con{
    }
    .block_item{
        min-height: 164px;
        background-color: white;
        margin-bottom: 10px;
    }
    .block_item_title{
        padding-top: 14px;
        min-height: 45px;
        border-bottom: 1px solid #d8d8d8;
    }
    .block_item_title_t1{
        font-weight: bold;
        color: #333333;
    }
    .block_item_title_t1>div:first-child{
        font-size: 17px;
        float: left;
        margin: 0px 5px 0px 15px;
    }
    .block_item_title_t1>div:last-child{
        font-size: 13px;
        float: right;
        margin-top: 3px;
        margin-right: 15px;
    }
    .block_item_title_t2{
        clear: both;
        color: #666666;
        padding-top: 4px;
    }
    .block_item_title_t2>div:first-child{
        font-size: 12px;
        float: left;
        margin-left: 15px;
    }
    .block_item_title_t2>div:last-child{
        font-size: 12px;
        float: right;
        margin-right: 15px;
    }
    .block_item_con{
        padding-top: 22px;
        padding-bottom: 10px;
    }
    .block_item_con>p{
        margin: 4px 10px;
        font-size: 13px;
        color: #999999;
        line-height: 17px;
    }
    .block_item_con_bottom{
        clear: both;
    }
    .block_item_con_bottom>div:first-child{
        font-size: 12px;
        float: left;
        margin-left: 10px;
        color: #01b38b;
        padding: 4px 0px;
    }
    .block_item_con_bottom>div:last-child{
        font-size: 12px;
        float: right;
        margin-right: 15px;
        border-radius: 12px;
        font-size: 12px;
        color: white;
        background-color: #01B38B;
        padding: 4px 9px;
    }
    .block_finish .block_item_title_t1,.block_finish .block_item_title_t2{
        color: #999999;
    }
    .clearfix:after{
        content: "";
        height: 0;
        line-height: 0;
        display: block;
        visibility: hidden;
        clear: both;
    }
    .clearfix{
        zoom: 1;
    }
</style>
