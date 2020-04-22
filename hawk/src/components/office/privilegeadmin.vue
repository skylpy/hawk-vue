<template>
    <f7-page>
        <f7-navbar title="设置部门管理员" back-link>
        </f7-navbar>

        <f7-list id="hawk-privilegeadmin-list">
            <template>
                <f7-list-item v-if="admin_list.length > 0" divider></f7-list-item>

                <f7-list-item 
                    v-for="(uId, index) in admin_list" 
                    :key="index"
                    link="#"
                    @click="edit(uId)"
                >
                    <div slot="title">
                        <div>{{ who(uId) && who(uId).name || '未知'}}</div>
                        <div>
                            <span style="font-weight:500; font-size:14px; color:#666666">部门：</span>
                            <span style="font-weight:400; font-size:14px; color:#999999">{{ userDepartment(uId) && userDepartment(uId).name || '待定' }}</span>
                        </div>
                        <div>
                            <span style="font-weight:500; font-size:14px; color:#666666">权限：</span>
                            <span style="font-weight:400; font-size:14px; color:#999999">已分配{{who(uId) && who(uId).privilege && who(uId).privilege.length || 0}}项</span>
                        </div>
                    </div>
                </f7-list-item>                
            </template>
            <div class="no_template" v-if="!admin_list.length" style="width:100%; text-align:center" slot="after-list">
                <img :src="nodata" width="71px" height="84px">
                <p>暂无部门管理员</p>
                <p>需要请点加号添加</p>
            </div>
        </f7-list> 

        <f7-popup id="privilegeadmin-popup-edit">
            <f7-page>
                <f7-navbar>
                    <f7-nav-left>
                        <f7-link icon-only popup-close> <i class="icon icon-back"></i> </f7-link>
                    </f7-nav-left>
                    <f7-nav-title>{{editing ? '编辑' : '添加'}}部门管理员</f7-nav-title>
                </f7-navbar>

                <f7-list id="hawk-privilegeadmin-edit-list">

                    <f7-list-item divider></f7-list-item>

                    <f7-list-item
                            title="部门选择"
                            link="#"
                            :after="editor.departmentId && departmentName(editor.departmentId) || '请添加'"
                            @click="$f7.popup.open('#privilegeadmin-popup-departmentpicker')"
                    ></f7-list-item>
                    <f7-list-item 
                        title="员工" 
                        link="#" 
                        :after="editor.uIdList.map(id => who(id).name).join(',') || '请添加'" 
                        @click="$f7.popup.open('#privilegeadmin-popup-employeepicker')"
                    ></f7-list-item>



                    <f7-list-item 
                        title="分配权限" 
                        link="#" 
                        :after="editor.permissions.length > 0 ? `已分配${editor.permissions.length}项权限` : '请选择'"
                        @click="open_permselector"
                    ></f7-list-item>

                </f7-list>

                <f7-list v-if="editing">
                    <f7-list-button  color="red" title="删除" @click="remove_admin"></f7-list-button>
                </f7-list>

                <f7-list class="hawk-action-button-bottom">
                    <f7-list-button 
                        title="保存"
                        @click="save"
                    ></f7-list-button>
                </f7-list>
            </f7-page>            
        </f7-popup>

        <f7-popup id="privilegeadmin-popup-employeepicker">
            <employeepicker 
                :multiple = 'false'
                :parentDepartmentId="editor.departmentId"
                :showSubDepartment="false"
                @employee:selected = "set_user"
                @employee:cancel="$f7.popup.close('#privilegeadmin-popup-employeepicker')"
                ref = "employeepicker"
            ></employeepicker>
        </f7-popup>
        <!--:parentDepartmentId="editor.departmentId"-->
        <!--:showSubDepartment =false-->
        <!--@employee:selected = "set_user"-->
        <f7-popup id="privilegeadmin-popup-departmentpicker">
            <departmentpicker
                :multiple = "false"
                @department:selected = "set_department"
                @department:cancel="$f7.popup.close('#privilegeadmin-popup-departmentpicker')"
            ></departmentpicker>
        </f7-popup>

        <f7-popup id="privilegeadmin-popup-permselector">
            <permission
                @permission:cancel="$f7.popup.close('#privilegeadmin-popup-permselector')"
                @permission:selected = "set_permission"
                ref="permselector"
            ></permission>
        </f7-popup>

        <f7-fab 
            class="hawk-action-btn-float" 
            position="right-bottom" 
            slot="fixed" 
            @click="add_admin"
        >
            <f7-icon ios="f7:add" md="material:add"></f7-icon>
        </f7-fab>

    </f7-page>
</template>

<style lang="scss">
#hawk-privilegeadmin-list, #hawk-privilegeadmin-edit-list {
    margin-top: 0;
    font-size: 16px;
    font-weight: 400;
    color: #333333;

    .hawk-privilege-notes {
        font-size: 12px;
        height: 40px;
        padding: 15px 0 0 15px;
        color: #999999;
        background: rgba(248,248,248,1);
    }

    .item-title {
        padding-left: 15px;
    }

    .item-inner:after {
        background-color: #F8F8F8;
        height: 15px;
    }

    .item-content {
        padding-left: 0;
        display: block;
    }

    .item-divider:before {
        background-color: white;
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
}
</style>


<script>
    import employeepicker from 'gadget/employeepicker.vue';
    import permission from 'gadget/permission.vue';
    import departmentpicker from 'gadget/departmentpicker.vue';
    import { mapGetters, mapActions } from 'vuex';
    import axios from 'axios';
    import nodata from 'assets/images/ill_no_data@2x.png';
    export default {
        components: {
            employeepicker,
            departmentpicker,
            permission
        },

        data() {
            return {
                editor: {
                    uIdList: [],
                    departmentId: '',
                    permissions: [],
                },
                nodata:nodata
            }
        },

        computed: {
            ...mapGetters([
                'who',
                'personnel',
                'departments',
                'userDepartment'
            ]),

            admin_list() {
                return this.departments.reduce((accum, d) => { return accum.concat(d.admin) }, []);
            },

            editing() {
                return this.editor.uIdList.length > 0 && this.editor.uIdList.every(uId => this.admin_list.includes(uId));
            },
        },

        mounted() {
            if (this.admin_list.length == 0)
                this.add_admin();
        },

        methods: {
            ...mapActions({
                'reload_personnel': 'LOAD_PERSONNEL',
                'reload_company': 'LOAD_COM',
            }),

            departmentName(departmentId) {
                let d = this.departments.find(d => d.departmentId == departmentId);
                return d ? d.name : '';
            },

            set_department(dIdList) {
                if (dIdList.length) this.editor.departmentId = dIdList[0];
                $f7.popup.close('#privilegeadmin-popup-departmentpicker')
            },

            set_user(uIdList) {
                this.editor.uIdList = deepCopy(uIdList || []);
                if (uIdList.length) this.editor.departmentId = this.userDepartment(uIdList[0]).departmentId;

                $popup.close('#privilegeadmin-popup-employeepicker');
            },

            set_permission(permList) {
                this.editor.permissions = deepCopy(permList || []);
                $popup.close('#privilegeadmin-popup-permselector');
            },

            open_permselector() {
                let groups = this.editing ? null : ['basic'];
                let permissions = this.editing? this.editor.permissions : null;

                this.$refs.permselector.set_selected({ groups, permissions });
                $f7.popup.open('#privilegeadmin-popup-permselector');
            },

            add_admin() {
                this.editor.uIdList = [];
                this.editor.permissions = [];
                this.editor.departmentId = '';

                $popup.open('#privilegeadmin-popup-edit');
            },

            edit(uId) {
                this.editor.uIdList = [uId];
                this.editor.departmentId = this.userDepartment(uId).departmentId;
                this.editor.permissions = this.who(uId).privilege;

                $f7.popup.open('#privilegeadmin-popup-edit');
            },

            remove_admin() {
                if (!this.editor.uIdList.length) {
                    $alert('员工不能为空', '操作错误');
                    return;
                }

                if (!this.editor.departmentId) {
                    $alert('部门不能为空', '操作错误');
                    return;
                }

                $confirm('确定要删除该部门管理员吗？', '操作确认', () => {
                    this.editor.permissions = [];
                    this.submit(false);
                })
            },

            save() {
                if (!this.editor.uIdList.length) {
                    $alert('员工不能为空', '操作错误');
                    return;
                }

                if (!this.editor.departmentId) {
                    $alert('部门不能为空', '操作错误');
                    return;
                }

                if (!this.editor.permissions.length) {
                    $alert('权限不能为空', '操作错误');
                    return;
                }

                $confirm('确定保存该部门管理员吗？', '操作确认', () => {
                    this.submit(true);
                })
            },

            sys_reload() {
                this.reload_company();
                this.reload_personnel();
            },
            submit(saveAsAdmin) {
                $preloader.show();


                let updates = this.editor.uIdList.map(id => ({
                    _id: id,
                    privilege: this.editor.permissions,
                    department: [this.editor.departmentId],
                    departmentadmin: saveAsAdmin
                }));

                axios.put('api/users', updates).then(resp => {
                    this.sys_reload();
                    $preloader.hide();
                    $f7.popup.close('#privilegeadmin-popup-edit');
                }).catch(error => {
                    console.error(error);
                    $alert('无法更新数据，请稍后再试', '操作错误');
                });
            }
        }
    }
</script>
