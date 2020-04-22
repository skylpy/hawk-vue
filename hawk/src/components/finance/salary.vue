<template>
    <f7-page @page:reinit="load" class="page_salary">
        <f7-navbar :title="navTitle" back-link>
            <f7-subnavbar :inner="false" class="subnavbar">
                <div class="tip">
                    <img :src="tipIcon" />
                    请录入真实工资，方便在考核结算中计算出真实的数据
                </div>
                <f7-searchbar
                        search-container=".search-all-list"
                        search-in=".search-name"
                        @input="searchVal = $event.target.value"
                        @click:clear="searchVal = ''"
                        @searchbar:disable="searchVal = ''"
                        placeholder="请输入姓名"
                        disable-button-text="取消"
                ></f7-searchbar>
            </f7-subnavbar>
        </f7-navbar>

        <template v-if="!searchVal.length">
            <f7-list class="search-list hawk-org">
                <f7-list-item>
                    <div slot="inner" class="hawk-org-department-nav">
                        <f7-link
                                v-for="(d, index) in chain"
                                :key="index"
                                @click="goto_department(d)"
                        > {{d.name}} </f7-link>
                    </div>
                </f7-list-item>

                <f7-list-item v-if="reminder" divider></f7-list-item>

                <f7-list-item
                        v-if="reminder"
                        class="hawk-org-reminder"
                >
                    <div slot="inner">
                        <div>此部门还没设置管理员</div>
                        <div style="font-size: 11px">管理员是部门领导，负责底下员工的审批、查看和操作</div>
                    </div>
                </f7-list-item>

                <f7-list-item v-if="department.sub.length" divider></f7-list-item>

                <f7-list-item
                        v-for="(sub, index) in department.sub"
                        :key="index + 'department'"
                        link="#"
                        @click="goto_department(sub)"
                >
                    <div slot="inner">
                        <span>{{ sub.name }}</span>
                        <span>{{ `（${sub.employees.filter(uid => !!who(uid)).length}人）` }}</span>
                    </div>
                </f7-list-item>

                <f7-list-item v-if="department.employees.length" divider></f7-list-item>

                <f7-list-item
                        v-for="(uid, index) in department.employees.filter(uid => !!who(uid))"
                        :key="index + 'employee'"
                >
                    <div slot="inner" class="hawk-org-user-container">
                        <img class="hawk-org-user-avatar" :src="who(uid).avatarUrl">
                        <div class="search-name">{{ who(uid).name }}</div>
                        <div class="hawk-org-user-title">{{ who(uid).job || '职位待定' }}</div>
                        <div class="hawk-org-user-admin" v-if="department.admin.includes(uid)">管理员</div>
                        <div class="hawk-org-user-admin" v-if="isSuperAdmin(uid)">超级管理员</div>
                    </div>
                    <span class="salary">{{getUserSalary(uid) ? `${getUserSalary(uid)}元` : '未设置'}}</span>
                    <f7-link @click="edit_user(uid, who(uid).name, getUserSalary(uid))">
                        <img :src="edit_btn_bg" style="width:23px; height:23px">
                    </f7-link>
                </f7-list-item>
            </f7-list>

            <f7-block v-if="!department.employees.length" class="no_template">
                <div>
                    <img style="width:47px; height:56px" :src="zero_employee_icon" alt="">
                    <div>暂无员工</div>
                </div>
            </f7-block>
        </template>


        <f7-list class="search-list search-all-list hawk-org" v-show="searchVal.length">
            <f7-list-item
                    v-for="(v, index) in personnel"
                    :key="index + 'employee'"
            >
                <div slot="inner" class="hawk-org-user-container">
                    <img class="hawk-org-user-avatar" :src="v.avatarUrl">
                    <div class="search-name">{{ v.name }}</div>
                    <div class="hawk-org-user-title">{{ v.job || '职位待定' }}</div>
                    <div class="hawk-org-user-admin" v-if="isDepartmentAdmin(v._id)">管理员</div>
                    <div class="hawk-org-user-admin" v-if="isSuperAdmin(v._id)">超级管理员</div>
                </div>
                <span class="salary">{{getUserSalary(v._id) ? `${getUserSalary(v._id)}元` : '未设置'}}</span>
                <f7-link @click="edit_user(v._id, v.name, getUserSalary(v._id))">
                    <img :src="edit_btn_bg" style="width:23px; height:23px">
                </f7-link>
            </f7-list-item>
        </f7-list>
    </f7-page>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import employeepicker from 'src/components/gadget/employeepicker.vue';
    import departmentpicker from 'src/components/gadget/departmentpicker.vue';
    import axios from 'axios';

    export default {
        components: {
            employeepicker,
            departmentpicker
        },

        data() {
            return {
                chain: [],
                edit_btn_bg: require('src/assets/images/btn_edit_green@2x.png'),
                zero_employee_icon: require('src/assets/images/ill_no_data@2x.png'),
                tipIcon: require('src/assets/images/icon_news_orange@2x.png'),

                batch_param: {
                    // only set by batch_move or batch_delete
                    // uIdList: [],
                    // departmentId: ''
                },
                navTitle: '薪资录入',
                searchVal: ''
            }
        },

        computed: {
            ...mapGetters([
                'organization',
                'who',
                'myUserId',
                'superAdmin',
                'getUserSalary',
                'personnel',
                'isDepartmentAdmin'
            ]),

            department() {
                if (this.chain.length) return this.chain[this.chain.length-1];
                return this.organization;
            },

            departments() {
                return (function listD(d) {
                    return d.sub.slice(0).concat(d.sub.reduce((accum, s) => { return accum.concat(listD(s)) }, []));
                })(this.chain[0]);
            },

            reminder() {
                return this.department.admin.length == 0 && this.department.name != '公司';
            },

            parent_department() {
                let index = this.chain.findIndex(d => d.departmentId == this.department.departmentId);
                if (index < 1) return null;
                return this.chain[index-1];
            }
        },

        created() {
            if (this.chain.length == 0) this.load();
            this.get_salary();
        },

        methods: {
            ...mapActions({
                'update': 'UPDATE_COMPANY',
                'load_personnel': 'LOAD_PERSONNEL',
                'load_company': 'LOAD_COM',
                'get_salary':'GET_SALARY'
            }),

            isSuperAdmin(uid) {
                return this.superAdmin._id == uid;
            },

            load() {
                let departmentIdChain = this.chain.map(d => d.departmentId);
                this.chain = [deepCopy(this.organization)];

                departmentIdChain.shift(); // remove root

                //restore original path
                while (departmentIdChain.length) {
                    let dId = departmentIdChain.shift();
                    let parent = this.chain[this.chain.length-1];
                    let subD = parent.sub.find(s => s.departmentId == dId);
                    this.chain.push(subD);
                }
            },

            edit_user(uid, name, salary) {
                // console.log(uid, name, salary)
                this.$f7router.navigate('/finance/salary/enterSalary', {
                    props: {
                        info: {
                            uid: uid,
                            name: name,
                            salary: salary || ''
                        }
                    }
                });
            },

            goto_department(d) {
                let pos = this.chain.findIndex(item => item.departmentId == d.departmentId);

                if (pos == -1) {
                    this.chain.push(d);
                    return;
                }

                if (pos == this.chain.length - 1) return;

                this.chain.splice(pos+1);
            }
        }
    }
</script>



<style lang="scss" scoped>
.tip {
    width: 100%;
    height: 35px;
    line-height: 35px;
    font-size: 13px;
    color: #F96A0E;
    background: #FFF5E4;
    overflow: hidden;

    img {
        width: 12px;
        height: 12px;
        margin: 11px 4px 0 15px;
        display: block;
        float: left;
    }
}

.subnavbar {
    display: block;
}

.search-list {
    padding-top: 34px;
}

.salary {
    flex: 1;
    text-align: right;
    margin-right: 10px;
    font-size: 12px;
    color: #999;
}

.no_template{
    text-align: center;
    margin: 120px 0px auto;
}
.no_template div{
    font-size: 14px;
    color: #333333;
    margin: 5px 0;
}
</style>
