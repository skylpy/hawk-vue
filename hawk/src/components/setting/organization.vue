<template>
    <f7-page @page:reinit="load">
        <f7-navbar :title="navTitle" back-link>
            <f7-nav-right>
                <f7-link v-if="department.employees.length" actions-open="#organization-batch">批量操作</f7-link>
            </f7-nav-right>
            <f7-subnavbar :inner="false">
                <f7-searchbar
                    search-container=".search-list"
                    search-in=".search-name"
                    placeholder="请输入姓名"
                    disable-button-text="取消"
                ></f7-searchbar>
            </f7-subnavbar>
        </f7-navbar>

        <f7-actions id="organization-batch">
            <f7-actions-group>
                <f7-actions-button class="hawk-actions-button" @click="batch_move">批量移动员工</f7-actions-button>
                <f7-actions-button class="hawk-actions-button" @click="batch_delete">批量删除成员</f7-actions-button>
            </f7-actions-group>
            <f7-actions-group>
                <f7-actions-button color="red">取消</f7-actions-button>
            </f7-actions-group>
        </f7-actions>

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
                @click="open_employeepicker"
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
                    <div class="hawk-org-user-title">{{ who(uid).job || '职位待定' }}<span v-if="who(uid).status == false" class="invalid-user">已停用</span></div>
                    <div class="hawk-org-user-admin" v-if="department.admin.includes(uid)">管理员</div>
                    <div class="hawk-org-user-admin" v-if="isSuperAdmin(uid)">超级管理员</div>
                </div>
                <f7-link @click="edit_user(uid)">
                    <img :src="edit_btn_bg" style="width:23px; height:23px">
                </f7-link>
            </f7-list-item>
        </f7-list>

        <f7-block v-if="!department.employees.length && !department.sub.length " class="zero-employee">
            <div>
                <img style="width:47px; height:56px" :src="zero_employee_icon" alt="">
                <div>暂无员工</div>
            </div>
        </f7-block>

        <f7-toolbar class="hawk-org-toolbar">
            <f7-link @click="add_employee">添加员工</f7-link>
            <f7-link class="hawk-org-toolbar-divider"></f7-link>
            <f7-link @click="$f7.popup.open('#organization-popup-new-department')">添加子部门</f7-link>
            <f7-link v-if="department.name != '公司'" class="hawk-org-toolbar-divider"></f7-link>
            <f7-link v-if="department.name != '公司'" @click="$f7.popup.open('#organization-popup-edit-department')">部门设置</f7-link>
        </f7-toolbar>

        <f7-popup id="organization-popup-new-department">
            <f7-page>
                <f7-navbar>
                    <f7-nav-left>
                        <f7-link icon-only popup-close>
                            <i class="icon icon-back"></i>
                        </f7-link>
                    </f7-nav-left>

                    <f7-nav-title>添加子部门</f7-nav-title>
                </f7-navbar>

                <f7-list inline-labels class="hawk-table">
                    <f7-list-item divider></f7-list-item>

                    <f7-list-input
                        placeholder="请输入"
                        input-id="new-department-input"
                    >
                        <div slot="label" class="hawk-input-label">
                            <span>部门名称:</span>
                        </div>
                    </f7-list-input>

                    <f7-list-input
                        placeholder="请输入"
                        :value="department.name"
                        readonly
                    >
                        <div slot="label" class="hawk-input-label">
                            <span>上级部门:</span>
                        </div>
                    </f7-list-input>
                </f7-list>

                <f7-list class="hawk-action-button-bottom">
                    <f7-list-button
                        title="保存"
                        @click="create_department"
                    ></f7-list-button>
                </f7-list>
            </f7-page>
        </f7-popup>

        <f7-popup id="organization-popup-edit-department">
            <f7-page>
                <f7-navbar>
                    <f7-nav-left>
                        <f7-link icon-only popup-close>
                            <i class="icon icon-back"></i>
                        </f7-link>
                    </f7-nav-left>
                    <f7-nav-title>部门设置</f7-nav-title>
                </f7-navbar>

                <f7-list inline-labels class="hawk-table">
                    <f7-list-item divider></f7-list-item>

                    <f7-list-input
                        placeholder="请输入"
                        input-id="edit-department-name"
                        :default-value="department.name"
                    >
                        <div slot="label" class="hawk-input-label">
                            <span>部门名称:</span>
                        </div>
                    </f7-list-input>

                    <f7-list-input
                        placeholder="没有管理员"
                        readonly
                        input-id="edit-department-admin"
                        :value="getDepartmentAdminValue()"
                        >
                        <div slot="label" class="hawk-input-label">
                            <span>部门管理员:</span>
                        </div>
                    </f7-list-input>

                    <f7-list-input
                        placeholder="请输入"
                        readonly
                        :value="parent_department && parent_department.name"
                    >
                        <div slot="label" class="hawk-input-label">
                            <span>上级部门</span>
                        </div>
                    </f7-list-input>
                </f7-list>

                <f7-list>
                    <f7-list-button
                        color="red"
                        title="删除部门"
                        @click="remove_department"
                    ></f7-list-button>
                </f7-list>

                <f7-list class="hawk-action-button-bottom">
                    <f7-list-button
                        title="保存"
                        @click="save_department"
                    ></f7-list-button>
                </f7-list>

            </f7-page>
        </f7-popup>

        <f7-popup id="organization-popup-employeepicker">
            <f7-view>
                <employeepicker
                    :multiple = 'true'
                    @employee:selected = "set_admin"
                    @employee:cancel="$f7.popup.close('#organization-popup-employeepicker')"
                    ref = "employeepicker"
                ></employeepicker>
            </f7-view>
        </f7-popup>

        <f7-popup id="organization-popup-batch-employee">
            <f7-view>
                <employeepicker
                    :multiple = 'true'
                    @employee:selected = "batch"
                    @employee:cancel="$f7.popup.close('#organization-popup-batch-employee')"
                    ref = "batchEmployeepicker"
                ></employeepicker>
            </f7-view>
        </f7-popup>

        <f7-popup id="organization-popup-batch-department">
            <f7-view>
                <departmentpicker
                    @department:selected = "batch"
                    @department:cancel = "$f7.popup.close('#organization-popup-batch-department')"
                    @department:add = "load"
                    :multiple = "false"
                ></departmentpicker>
            </f7-view>
        </f7-popup>

    </f7-page>
</template>

<style>
.zero-employee {
    display:flex;
    justify-content: center;
    align-items: center;
    padding-top: 50px !important;
}
.invalid-user{
    color: #F5A623;
    margin-left: 5px;
}
</style>


<script>
import { mapGetters, mapActions } from 'vuex';
import employeepicker from 'gadget/employeepicker.vue';
import departmentpicker from 'gadget/departmentpicker.vue';
import axios from 'axios';

export default {
    components: {
        employeepicker,
        departmentpicker
    },

    data() {
        return {
            chain: [],
            edit_btn_bg: require('assets/images/btn_edit_green@2x.png'),
            zero_employee_icon: require('assets/images/ill_no_data@2x.png'),

            batch_param: {
                // only set by batch_move or batch_delete
                // uIdList: [],
                // departmentId: ''
            }
        }
    },

    computed: {
        ...mapGetters([
            'organization',
            'who',
            'myUserId',
            'superAdmin'
        ]),

        navTitle() {
            return this.department.name || '公司';
        },

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
        },
    },
    watch: {
        organization: {
            handler: function (value) {
                this.load();
            },
            deep: true
        }
    },

    created() {
        this.sys_reload();
        if (this.chain.length == 0) this.load();
    },

    methods: {
        ...mapActions({
            'update': 'UPDATE_COMPANY',
            'load_personnel': 'LOAD_PERSONNEL',
            'load_company': 'LOAD_COM',
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

        batch_move() {
            this.batch_param = {
                uIdList: [],
                departmentId: ''
            };

            this.batch();
        },

        batch_delete() {
            this.batch_param = {
                uIdList: []
            };

            this.batch();
        },

        batch(idList) {
            if (!idList) {
                this.$refs.batchEmployeepicker.set({
                    single_department: this.department
                });

                $f7.popup.open('#organization-popup-batch-employee');
                return;
            }

            if (typeof this.batch_param.uIdList != 'undefined' &&
                this.batch_param.uIdList.length == 0) {
                if (idList.length == 0) {
                    $alert('没有选择的员工', '操作错误');
                    return;
                }

                this.batch_param.uIdList = idList.slice(0);
            }

            if (typeof this.batch_param.departmentId == 'undefined') {
                $confirm('确定要删除选择的员工吗？', '操作确认', () => {
                    // remove selected users
                    console.log('removing users', JSON.stringify(this.batch_param.uIdList));

                    this.delete_users(() => {
                        $f7.popup.close('#organization-popup-batch-employee');
                    })
                })

                return;
            } else if (!this.batch_param.departmentId) {
                // we're doing batch_move, select folder now
                $f7.popup.close('#organization-popup-batch-employee');
                $f7.popup.open('#organization-popup-batch-department');

                // this is a flag: meaning that the last call to batch() should really move the employees
                this.batch_param.departmentId = 'ok to move';
                return;
            }

            this.batch_param.departmentId = idList[0];
            $confirm('确定要移动选择的员工吗？', '操作确认', () => {
                // move users
                console.log('moving users', JSON.stringify(this.batch_param.uIdList));

                this.move_users(() => {
                    $f7.popup.close('#organization-popup-batch-department');
                });
            })

            return;
        },

        add_employee() {
            let departmentId = this.department.departmentId;
            if (departmentId == this.organization.departmentId) departmentId = null;

            this.$f7router.navigate('/setting/profile/', { props: { departmentId } });
        },

        delete_users(cb) {
            let uList = this.batch_param.uIdList;

            if (!uList) {
                console.error('invalid parameter for delete_users');
                return;
            }

            if (uList.includes(this.myUserId)) {
                $alert('您不能删除自己，请联系系统管理员', '操作错误');
                return;
            }

            $preloader.show();
            axios.delete('api/users?id=' + JSON.stringify(uList)).then(resp => {
                this.sys_reload();
                $preloader.hide();
                cb();
            }).catch(err => {
                console.error(err);
                $alert('无法删除员工', '操作错误');
            })
        },

        move_users(cb) {
            let uList = this.batch_param.uIdList;
            let destdepartmentId = this.batch_param.departmentId;

            if (!uList || !destdepartmentId) {
                console.error('invalid parameter for move_users');
                return;
            }

            // delete from old department
            this.department.employees = this.department.employees.filter(e => !uList.includes(e));

            // add into new department
            let destD = this.departments.find(d => d.departmentId == destdepartmentId);
            destD.employees.push(...uList);

            this.save(cb);
        },

        edit_user(uId) {
            this.$f7router.navigate('/setting/profile/', { props: { uId }});
        },

        create_department() {
            let name = $('#new-department-input').val();

            if (!name) {
                $alert('子部门名称不能为空', '操作错误');
                return;
            }

            this.department.sub.push({
                departmentId: Date.now(),
                name,
                sub: [],
                employees: [],
                admin: []
            });


            this.save(() => {
                $('#new-department-input').val('');
                $f7.popup.close('#organization-popup-new-department');
            })
        },

        save_department() {
            let name = $('#edit-department-name').val();

            if (!name) {
                $alert('部门名称不能为空', '操作错误');
                return;
            }

            this.department.name = name;
            // console.log(this.department.name);

            // todo: update admin list
            // this.department.admin = [];

            this.save(() => {
                $f7.popup.close('#organization-popup-edit-department');
            })
        },

        goto_department(d) {
            let pos = this.chain.findIndex(item => item.departmentId == d.departmentId);

            if (pos == -1) {
                this.chain.push(d);
                return;
            }

            if (pos == this.chain.length - 1) return;

            this.chain.splice(pos+1);
        },

        remove_department() {
            if (this.department.name == '公司') return;

            if (this.department.employees.length || this.department.sub.length) {
                $alert('删除部门前请先删除子部门和员工', '操作提示');
                return;
            }

            $confirm('确定要删除该部门吗？', '操作确认', () => {
                let toDelete = this.chain.pop();
                this.department.sub.splice(this.department.sub.findIndex(d => d.departmentId == toDelete.departmentId), 1);

                this.save(() => {
                    $f7.popup.close('#organization-popup-edit-department');
                })
            })

        },

        open_employeepicker() {
            // console.log(11111111);
            this.$refs.employeepicker.set({
                selected: this.department.admin,
                path: this.chain
            });
            $f7.popup.open('#organization-popup-employeepicker');
        },

        set_admin(selected) {
            if (selected) this.department.admin = selected.slice(0);
            this.save(() => {
                $preloader.show();
                let updates = {
                    _id: this.department.admin,
                    privilege: ['我的考勤','考勤管理', '任务管理', '日报管理', '通讯目录', '实时查岗', '工作轨迹', '费用报销', '考核结算', '填写汇报', '通知公告', '客户管理', '拜访管理', '扫名片', '用车申请', '用章申请', '采购申请', '付款申请', '合同审批', '绩效报告', '物品领用', '邀约到访', '销售业绩'],
                    department: [this.department.departmentId.toString()]
                };

                axios.put('api/users', updates).then(resp => {
                    $preloader.hide();
                    this.sys_reload();
                    this.$f7.popup.close('#organization-popup-employeepicker');
                }).catch(error => {
                    console.error(error);
                    $alert('无法更新数据，请稍后再试', '操作错误');
                });
            })
        },

        save(cb) {
            $preloader.show();

            this.update({organization: this.chain[0]}).then(() => {
                $preloader.hide();
                this.load();
                cb();
            }).catch(err => {
                $preloader.hide();
                console.error(err);
                $alert(err.message, '操作错误');
            })
        },

        sys_reload() {
            this.load_company();
            this.load_personnel();
        },

        getDepartmentAdminValue() {
            let val = this.department.admin.map(i => this.who(i) && this.who(i).name).filter(i => i !== null).join(',');
            console.log(val);
            return val
        }
    }
}
</script>

