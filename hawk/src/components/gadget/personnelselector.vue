<template>
    <f7-page :id="pageId">
        <f7-navbar :title="title">
            <f7-nav-right>
                <f7-link href="#" @click="cancel">取消</f7-link>
                <f7-link href="#" @click="submit">确定</f7-link>
            </f7-nav-right>
        </f7-navbar>
        <f7-searchbar
            disable-button
            placeholder="输入名字、部门或职位"
            search-container=".getPList"
            search-in=".item-title, .item-text"
        ></f7-searchbar>
        <f7-block-title>员工列表</f7-block-title>
        <f7-list class="searchbar-not-found">
            <f7-list-item title="没有找到相应的联系人～"></f7-list-item>
        </f7-list>
        <f7-list class="getPList" media-list>
            <f7-list-item
                v-if="multiple"
                checkbox
                title = "全选"
                @change="selectAll"
            ></f7-list-item>
            <f7-list-item
                v-for = "(p, index) in getPList"
                :key = "index"
                :checkbox = "multiple"
                :radio = '!multiple'
                :checked = "updatedList.includes(p._id)"
                :title = "p.name"
                name = "pcheckbox"
                :value = "p._id"
                :text = "(userDepartmentName(p._id) || '部门待定') + ' ' + (p.job || '职位待定')"
                @change="update"
                v-if="!isFilterMe || (isFilterMe && p && p._id !== myUserId)"
                v-show="!isFilterSub || (isFilterSub && p && p._id !== superAdmin._id)"
            ></f7-list-item>
        </f7-list>
    </f7-page>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex';

export default {
    name: 'personnelselector',

    props: {
        selectedList: {
            type: Array,
            default: () => { return [] }
        },
        subordinate: {
            type: Boolean,
            default: false,
        },
        title: {
            type: String,
            default: '选择员工'
        },
        multiple: {
            type: Boolean,
            default: true
        },
        isFilterMe: {
            type: Boolean,
            default: false
        },
        isFilterSub: {
            type: Boolean,
            default: false
        }
    },

    data: () => {
        return {
            pageId: 'personnelselector' + Math.floor(Math.random() * 100),
            updatedList: [],
            limitList: []
        }
    },

    computed: {
        ...mapGetters([
            'superAdmin',
            'myUserId',
            'personnel',
            'userDepartmentName',
            'userDepartment',
            'isDepartmentAdmin',
            'isLimitPersonnel'
        ]),

        pList() {
            if (this.superAdmin._id == this.myUserId) return this.personnel;
            if (!this.subordinate) return this.personnel;

            // non-admin can only has itself
            let d = this.userDepartment(this.myUserId);
            if (!d.admin.includes(this.myUserId)) return this.personnel.filter(p => p._id == this.myUserId);

            // admin can has all its subordinates
            let self = this
            let subordinates = (function listE(d) {
                return d.employees.slice(0).concat(
                    d.sub.reduce((accum, s) => {
                        if (s.admin.length && !self.isFilterSub) {
                            return accum.concat(s.admin)
                        } else {
                            return accum.concat(listE(s))
                        }
                    }, [])
                ) || [];
            })(d);

            subordinates = subordinates.filter(id => !d.admin.includes(id))
            return this.personnel.filter(p => subordinates.includes(p._id))
        },

        getPList () {
            return this.isLimitPersonnel ? this.limitList : this.pList
        }
    },

    mounted: function() {
        this.updatedList = this.selectedList.slice(0);
        this.$forceUpdate();
    },

    methods: {
        ...mapMutations({
            changeLimitPersonnel: 'CHANGE_LIMIT'
        }),

        selectAll(event) {
            let inputs = $('#' + this.pageId + ' li:not(.hidden-by-searchbar) input[name=pcheckbox]');

            if (inputs.length > 1 && !this.multiple) {
                $alert('只能选择一位员工', '操作错误');
                return;
            }

            let uIds = [];
            inputs.each(function() { uIds.push(this.value)});

            if (event.target.checked) {
                uIds.forEach(id => {
                    if (!this.updatedList.includes(id)) {
                        this.updatedList.push(id);
                    }
                });
            } else {
                this.updatedList = this.updatedList.filter(id => !uIds.includes(id));
            }
        },

        update(event) {
            let checked = event.target.checked;
            let uId = event.target.value;
            if (!this.multiple) {
                this.updatedList = [uId];
                return;
            }

            if (checked && !this.updatedList.includes(uId)) {

                if (!this.multiple && this.updatedList.length > 0) {
                    $alert('只能选择一位员工', '操作错误');
                    event.target.checked = false;
                    return;
                }
                this.updatedList.push(uId);
            } else if (!checked && this.updatedList.includes(uId)) {
                this.updatedList.splice(this.updatedList.indexOf(uId), 1);
            }

        },

        submit() {
            if (!this.multiple && this.updatedList.length > 1) {
                $alert('只能选择一位员工', '操作错误');
            }
            this.$emit('submit', this.updatedList);
        },

        cancel() {
            this.$emit('cancel');
            this.changeLimitPersonnel(false);
        },

        limitFun () {
            this.limitList = [];
            let isAdd = (v) => {
                // 只显示：超级管理员、部门管理员、行政人员、财务人员。
                let isA = false;
                if (
                    this.superAdmin._id == v._id ||
                    this.isDepartmentAdmin(v._id) ||
                    v.privilege.some(i => ['合同管理', '企业设置', '公司总账', '固定支出', '应收付款', '应付账款', '财务录入', '财务文件', '薪资录入'].includes(i))
                ) {
                    isA = true
                }
                return isA;
            };
            this.pList.map((v, i) => {
                if (isAdd(v)) this.limitList.push(v)
            });
        }
    },

    watch: {
        isLimitPersonnel () {
            if (this.isLimitPersonnel) this.limitFun()
        },

        selectedList () {
            this.updatedList = this.selectedList.slice(0);
            this.$forceUpdate();
        }
    }
}
</script>

