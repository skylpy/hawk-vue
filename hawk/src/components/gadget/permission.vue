<template>
    <f7-page>
        <f7-navbar>
            <f7-nav-left>
                <f7-link icon-only @click="cancel"> <i class="icon icon-back"></i> </f7-link>
            </f7-nav-left>
            <f7-nav-title>分配权限</f7-nav-title>
        </f7-navbar>

        <div class="hawk-permission-list_layer">
            <f7-list id="hawk-permission-list">
                <f7-list-item divider></f7-list-item>

                <f7-list-item title="全部权限">
                    <f7-toggle @change="selectAll($event.target.checked)"></f7-toggle>
                </f7-list-item>

                <template v-for="(value, key) in perms">
                    <f7-list-item
                            class="hawk-permission-grouptitle"
                            :key="key+'title'"
                    >
                        <div slot="title">{{ value.title }}</div>
                    </f7-list-item>

                    <f7-list-item v-for="(perm, index) in value.permission" :key="key + index">
                        <div slot="title" class="hawk-permissoin-title">
                            <img class="hawk-permission-icon" :src="getIcon(perm)" alt="icon">
                            <div>{{ perm }}</div>
                        </div>
                        <div slot="after">
                            <f7-toggle :checked="selected.includes(perm)" @change="toggle($event.target.checked, perm)"></f7-toggle>
                        </div>
                    </f7-list-item>

                    <f7-list-item
                            v-if="value.notes"
                            class="hawk-permission-grouptitle"
                            :key="key+'notes'"
                            style="min-height:70px"
                    >
                        <div style="white-space:normal" slot="title">{{ value.notes }}</div>
                    </f7-list-item>

                </template>

            </f7-list>
            <f7-list class="save_btn hawk-action-button-bottom">
                <f7-list-button
                        title="保存"
                        @click="save"
                ></f7-list-button>
            </f7-list>
        </div>
    </f7-page>
</template>

<style lang="scss" scoped>
 .hawk-permission-list_layer {
     width: 100%;
     height: 100%;
     overflow: hidden;

     #hawk-permission-list {
         width: 100%;
         height: calc(100% - 44px);
         overflow: auto;
         margin: 0;
     }

     .save_btn {
         position: relative;
         left: 0;
         top: 0;
         width: 100%;
         margin: 0;

         .list-button {
             background-color: #1284e7;
             color: white;
         }
     }
 }
</style>

<style lang="scss">
#hawk-permission-list {
    margin-top: 0;
    font-size: 16px;
    font-weight: 400;
    color: #333333;

    div.item-content { padding-left: 0; }
    div.item-inner { padding-left: 15px; }

    .hawk-permission-grouptitle {
        color: #999999;
        font-size: 13px;
        background-color: #F8F8F8;
    }

    .hawk-permissoin-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-width: 110px;
    }

    .hawk-permission-icon {
        width: 35px;
        height: 35px;
        display: block;
    }
}

</style>


<script>
import { getAllMods } from 'lib/module.js';

export default {
    name: 'permission',

    data() {
        return {
            perms: {
                basic: {
                    title: '基础权限（普通员工都有的）',
                    permission: ['我的考勤','考勤管理', '任务管理', '日报管理', '通讯目录', '实时查岗', '工作轨迹', '费用报销', '考核结算', '填写汇报', '通知公告', '客户管理', '拜访管理', '扫名片', '用车申请', '用章申请', '采购申请', '付款申请', '合同审批', '绩效报告', '物品领用', '邀约到访', '销售业绩'],
                },
                finance: {
                    title: '财务权限',
                    permission: ['公司总账', '固定支出', '应收账款', '应付账款', '财务录入', '财务文件', '薪资录入','财务审批'],
                },
                administration: {
                    title: '行政权限',
                    permission: [ '企业设置', '合同管理'],
                },
                advanced: {
                    title: '高级权限',
                    permission: ['权限管理', '组织构架', '考核设置'],
                    notes: '高级权限可以开启给管理公司组织构架和权限的重要人员使用，比如重要行政人员使用'
                }
            },

            selected: []
        }
    },

    computed: {
        tasks() { return getAllMods() },

        all_selected() {
            return this.selected.length == ['basic', 'finance', 'administration', 'advanced'].reduce((accum, item) => { return accum + this.perms[item].permission.length}, 0);
        }
    },

    methods: {
        save() {
            this.$emit('permission:selected', this.selected);
        },

        set_selected(options) {
            let {groups, permissions} = options;
            this.selected = [];

            if (!groups && !permissions) groups = ['basic'];

            if (groups) this.selected = groups.filter(g => ['basic', 'finance', 'administration', 'advanced'].includes(g))
                                              .reduce((accum, item) => { return accum.concat(this.perms[item].permission)}, []);
            if (permissions) this.selected = this.selected.concat(permissions);
        },

        getIcon(name) {
            let task = this.tasks.find(t => t.name == name);
            if (task) return task.icon;
            return require('assets/images/icon_daily_management_big@2x.png'); // default icon should be updated later
        },

        cancel() {
            this.$emit('permission:cancel');
        },

        toggle(checked, perm) {
            if (checked && !this.selected.includes(perm)) this.selected.push(perm);
            if (!checked && this.selected.includes(perm)) this.selected.splice(this.selected.findIndex(i => i == perm), 1);
        },

        selectAll(checked) {
            if (!checked) {
                this.selected = [];
                return;
            }
            this.selected = ['basic', 'finance', 'administration', 'advanced'].reduce((accum, item) => { return accum.concat(this.perms[item].permission)}, []);
        }
    }
}
</script>
