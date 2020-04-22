<template>
    <f7-page>
        <f7-navbar title="设置临时权限" back-link>
        </f7-navbar>

        <f7-list id="hawk-privilegetemp-list">
            <template>
                <f7-list-item v-if="temp_list.length > 0" divider></f7-list-item>

                <f7-list-item 
                    v-for="(u, index) in temp_list" 
                    :key="index"
                    link="#"
                    @click="edit(u)"
                >
                    <div slot="title">
                        <div>{{ who(u._id) && who(u._id).name || '未知'}}</div>
                        <div>
                            <span style="font-weight:500; font-size:14px; color:#666666">权限：</span>
                            <span style="font-weight:400; font-size:14px; color:#999999">已分配{{u.privilegeTemp.permissions.length}}项</span>
                        </div>
                    </div>
                    <div slot="after">{{ time_reminder(u.privilegeTemp) }}</div>
                </f7-list-item>                
            </template>
            <div class="no_template" v-if="!temp_list.length" style="width:100%; text-align:center" slot="after-list">
                <img :src="nodata" width="71px" height="84px">
                <p>暂无临时权限</p>
                <p>需要请点加号添加</p>
            </div>
        </f7-list> 

        <f7-popup id="privilegetemp-popup-edit">
            <f7-page>
                <f7-navbar>
                    <f7-nav-left>
                        <f7-link icon-only popup-close> <i class="icon icon-back"></i> </f7-link>
                    </f7-nav-left>
                    <f7-nav-title>{{editing ? '编辑' : '添加'}}临时权限</f7-nav-title>
                </f7-navbar>

                <f7-list id="hawk-privilegetemp-edit-list">

                    <f7-list-item divider></f7-list-item>

                    <f7-list-item 
                        title="员工" 
                        link="#" 
                        :after="editor.uIdList.map(id => who(id).name).join(',') || '请添加'" 
                        @click="$f7.popup.open('#privilegetemp-popup-employeepicker')"
                    ></f7-list-item>

                    <f7-list-item 
                        title="分配权限" 
                        link="#" 
                        :after="editor.permissions.length > 0 ? `已分配${editor.permissions.length}项权限` : '请选择'"
                        @click="open_permselector"
                    ></f7-list-item>

                    <f7-list-item 
                        title="开始时间" 
                        link="#" 
                        :after="editor.from && (new Date(editor.from)).toHawkDateString() || '请选择'"
                        @click="set_from"
                    ></f7-list-item>

                    <f7-list-item 
                        title="结束时间" 
                        link="#" 
                        :after="editor.to && (new Date(editor.to)).toHawkDateString() || '请选择'"
                        @click="set_to"
                    ></f7-list-item>

                </f7-list>

                <f7-list v-if="editing">
                    <f7-list-button  color="red" title="删除" @click="remove_temp"></f7-list-button>
                </f7-list>

                <f7-list class="hawk-action-button-bottom">
                    <f7-list-button 
                        title="保存"
                        @click="save"
                    ></f7-list-button>
                </f7-list>             
            </f7-page>            
        </f7-popup>

        <f7-popup id="privilegetemp-popup-employeepicker">
            <employeepicker 
                :multiple = 'true' 
                @employee:selected = "set_user"
                @employee:cancel="$f7.popup.close('#privilegetemp-popup-employeepicker')"
                ref = "employeepicker"
            ></employeepicker>
        </f7-popup>

        <f7-popup id="privilegetemp-popup-permselector">
            <permission
                @permission:cancel="$f7.popup.close('#privilegetemp-popup-permselector')"
                @permission:selected = "set_permission"
                ref="permselector"
            ></permission>
        </f7-popup>

        <f7-fab 
            class="hawk-action-btn-float" 
            position="right-bottom" 
            slot="fixed" 
            @click="add_temp"
        >
            <f7-icon ios="f7:add" md="material:add"></f7-icon>
        </f7-fab>

    </f7-page>
</template>

<style lang="scss">
#hawk-privilegetemp-list, #hawk-privilegetemp-edit-list {
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
                permissions: [],
                from: 0,
                to: 0
            },
            nodata: nodata
        }
    },

    computed: {
        ...mapGetters([
            'who',
            'personnel'
        ]),

        temp_list() {
            return this.personnel.filter(u => u.privilegeTemp && u.privilegeTemp.permissions && u.privilegeTemp.permissions.length > 0);
        },

        editing() {
            return this.editor.uIdList.length > 0 && this.editor.uIdList.every(uId => this.temp_list.find(u => u._id == uId));
        },
    },

    mounted() {
        if (this.temp_list.length == 0) this.add_temp();
    },

    methods: {
        ...mapActions({
            'reload_personnel': 'LOAD_PERSONNEL'
        }),

        time_reminder(privilegeTemp) {
            let from = privilegeTemp.from;
            let to = privilegeTemp.to;
            let now = Date.now();

            if (from > now) return `还有${ Math.floor((from-now)/(24*3600*1000)) + 1 }天开始`;
            if (to > now) return `剩下${ Math.floor((to-now)/(24*3600*1000))+1 }天`;
            if (now > to) return '已过期';
        },

        set_from() {
            let self = this;

            if (!self.fromPicker) {
                self.fromPicker = $calendar.create({
                    inputEl: document.createElement("input"),
                    closeOnSelect: true,
                    minDate: new Date(Date.now() - 24*3600*1000),
                    on: {
                        change: function(calendar, value) {
                            self.editor.from = value[0].getTime();
                        }
                    }
                })
            }

            self.fromPicker.open();
        },

        set_to() {
            let self = this;

            if (!self.toPicker) {
                self.toPicker = $calendar.create({
                    inputEl: document.createElement("input"),
                    closeOnSelect: true,
                    minDate: new Date(Date.now() - 24*3600*1000),
                    on: {
                        change: function(calendar, value) {
                            self.editor.to = value[0].getTime();
                        }
                    }
                })
            }

            self.toPicker.open();
        },

        add_temp() {
            this.editor.uIdList = [];
            this.editor.permissions = [];
            this.editor.from = 0;
            this.editor.to = 0;

            $f7.popup.open('#privilegetemp-popup-edit');
        },

        remove_temp() {
            if (!this.editor.uIdList.length) {
                $alert('员工不能为空', '操作错误');
                return;
            }

            $confirm('确定要删除该临时权限吗？', '操作确认', () => {
                this.editor.permissions = [];
                this.editor.from = 0;
                this.editor.to = 0;

                this.submit();
            })            
        },

        set_user(uIdList) {
            this.editor.uIdList = deepCopy(uIdList || []);
            $popup.close('#privilegetemp-popup-employeepicker');
        },

        set_permission(permList) {
            this.editor.permissions = deepCopy(permList || []);
            $popup.close('#privilegetemp-popup-permselector');
        },

        open_permselector() {
            let groups = this.editing ? null : ['basic'];
            let permissions = this.editing? this.editor.permissions : null;

            this.$refs.permselector.set_selected({ groups, permissions });
            $f7.popup.open('#privilegetemp-popup-permselector');
        },

        edit(user) {
            this.editor.uIdList = [user._id];
            this.editor.permissions = user.privilegeTemp.permissions;
            this.editor.from = user.privilegeTemp.from;
            this.editor.to = user.privilegeTemp.to;

            $f7.popup.open('#privilegetemp-popup-edit');
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

            if (!this.editor.from) {
                $alert('开始时间不能为空', '操作错误');
                return;
            }

            if (!this.editor.to) {
                $alert('结束时间不能为空', '操作错误');
                return;
            }

            if (this.editor.from > this.editor.to) {
                $alert('开始时间不能晚于结束时间', '操作错误');
                return;
            }

            $confirm('确定保存该临时权限吗？', '操作确认', () => {
                this.submit();
            })
        },

        submit() {
            $preloader.show();

            let privilegeTemp = this.editor.permissions.length > 0 ? {
                permissions: this.editor.permissions,
                from: this.editor.from,
                to: this.editor.to
            } : {};

            let updates = this.editor.uIdList.map(id => ({_id: id, privilegeTemp}));

            axios.put('api/users', updates).then(resp => {
                this.reload_personnel();
                $preloader.hide();
                $f7.popup.close('#privilegetemp-popup-edit');
            }).catch(error => {
                console.error(error);
                $alert('无法更新数据，请稍后再试', '操作错误');
            });
        }
    }
}
</script>

