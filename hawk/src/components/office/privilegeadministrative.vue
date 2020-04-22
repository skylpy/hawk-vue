<template>
    <f7-page>
        <f7-navbar title="设置行政人员" back-link>
        </f7-navbar>

        <f7-list id="hawk-privilegeadministrative-list">
            <template>
                <f7-list-item v-if="administrative_list.length > 0" divider></f7-list-item>

                <f7-list-item
                    v-for="(u, index) in administrative_list"
                    :key="index"
                    link="#"
                    @click="edit(u)"
                >
                    <div slot="title">
                        <div>{{ who(u._id) && who(u._id).name || '未知'}}</div>
                        <div>
                            <span style="font-weight:500; font-size:14px; color:#666666">权限：</span>
                            <span style="font-weight:400; font-size:14px; color:#999999">行政</span>
                        </div>
                    </div>
                </f7-list-item>
            </template>
            <div class="no_template" v-if="!administrative_list.length" style="width:100%; text-align:center" slot="after-list">
                <img :src="nodata" width="71px" height="84px">
                <p>暂无行政人员</p>
                <p>需要请点加号添加</p>
            </div>
        </f7-list>

        <f7-popup id="privilegeadministrative-popup-edit">
            <f7-page>
                <f7-navbar>
                    <f7-nav-left>
                        <f7-link icon-only popup-close> <i class="icon icon-back"></i> </f7-link>
                    </f7-nav-left>
                    <f7-nav-title>{{editing ? '编辑' : '添加'}}行政人员</f7-nav-title>
                </f7-navbar>

                <f7-list id="hawk-privilegeadmin-edit-list">
                    <f7-list-item divider></f7-list-item>
                    <f7-list-item
                        title="成员"
                        link="#"
                        :after="editor.uIdList.map(id => who(id).name).join(',') || '请添加'"
                        @click="$f7.popup.open('#privilegeadministrative-popup-employeepicker')"
                    ></f7-list-item>

                    <f7-list-item divider></f7-list-item>

                    <f7-list-item
                        title="分配权限"
                        link="#"
                        :after="editor.permissions.length > 0 ? '行政权限' : '请选择'"
                        @click="open_permselector"
                    ></f7-list-item>
                </f7-list>

                <f7-list v-if="editing">
                    <f7-list-button  color="red" title="删除" @click="remove_administrative"></f7-list-button>
                </f7-list>

                <f7-list class="hawk-action-button-bottom">
                    <f7-list-button
                        title="保存"
                        @click="save"
                    ></f7-list-button>
                </f7-list>
            </f7-page>
        </f7-popup>

        <f7-popup id="privilegeadministrative-popup-employeepicker">
            <employeepicker
                :multiple = 'true'
                @employee:selected = "set_administrative"
                @employee:cancel="$f7.popup.close('#privilegeadministrative-popup-employeepicker')"
                ref = "employeepicker"
            ></employeepicker>
        </f7-popup>

        <f7-popup id="privilegeadministrative-popup-permselector">
            <permission
                @permission:cancel="$f7.popup.close('#privilegeadministrative-popup-permselector')"
                @permission:selected = "set_permission"
                ref="permselector"
            ></permission>
        </f7-popup>

        <f7-fab
            class="hawk-action-btn-float"
            position="right-bottom"
            slot="fixed"
            @click="add_administrative"
        >
            <f7-icon ios="f7:add" md="material:add"></f7-icon>
        </f7-fab>

    </f7-page>
</template>

<style lang="scss">
#hawk-privilegeadministrative-list, #hawk-privilegeadmin-edit-list {
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
import { mapGetters, mapActions } from 'vuex';
import axios from 'axios';
import nodata from 'assets/images/ill_no_data@2x.png';   //没有数据是，添加提示图标
export default {
    components: {
        employeepicker,
        permission
    },

    data() {
        return {
            editor: {
                uIdList: [],
                permissions: []
            },
            nodata:nodata
        }
    },

    computed: {
        ...mapGetters([
            'who',
            'personnel'
        ]),

        editing() {
            return this.editor.uIdList.length > 0 && this.editor.uIdList.every(uId => this.administrative_list.find(p => p._id == uId));
        },

        administrative_list() {
            return this.personnel.filter(p => {
                if (!p.privilege || p.privilege.length == 0) return false;
                return p.privilege.some(i => ['合同管理', '企业设置'].includes(i));
            });
        }
    },

    mounted() {
        if (!this.administrative_list.length) this.add_administrative();
    },

    methods: {
        ...mapActions({
            'reload_personnel': 'LOAD_PERSONNEL'
        }),

        open_permselector() {
            let groups = this.editing ? null : ['basic', 'administration'];
            let permissions = this.editing? this.editor.permissions : null;

            this.$refs.permselector.set_selected({ groups, permissions });
            $f7.popup.open('#privilegeadministrative-popup-permselector');
        },

        set_administrative(uIdList) {
            this.editor.uIdList = deepCopy(uIdList || []);
            $popup.close('#privilegeadministrative-popup-employeepicker');
        },

        set_permission(permList) {
            this.editor.permissions = deepCopy(permList || []);
            $popup.close('#privilegeadministrative-popup-permselector');
        },

        edit(user) {
            this.editor.uIdList = [user._id];
            this.editor.permissions = user.privilege;
            $f7.popup.open('#privilegeadministrative-popup-edit');
        },

        remove_administrative() {
            if (!this.editor.uIdList.length) {
                $alert('员工不能为空', '操作错误');
                return;
            }

            $confirm('确定要删除该行政人员吗？', '操作确认', () => {
                this.editor.permissions = [];
                this.submit();
            })
        },

        add_administrative() {
            this.editor.uIdList = [];
            this.editor.permissions = [];

            $f7.popup.open('#privilegeadministrative-popup-edit');
        },

        submit() {
            $preloader.show();

            let updates = this.editor.uIdList.map(id => ({_id: id, privilege: this.editor.permissions}));
            axios.put('api/users', updates).then(resp => {
                this.reload_personnel();
                $preloader.hide();
                $f7.popup.close('#privilegeadministrative-popup-edit');
            }).catch(error => {
                console.error(error);
                $alert('无法更新数据，请稍后再试', '操作错误');
            });
        },

        save() {
            if (!this.editor.uIdList.length) {
                $alert('员工不能为空', '操作错误');
                return;
            }

            if (!this.editor.permissions.length) {
                $alert('权限不能为空', '操作错误');
                return;
            }

            $confirm('确定保存该行政人员的设置吗？', '操作确认', () => {
                this.submit();
            })

        }
    }
}
</script>
