<template>
    <f7-page>
        <f7-navbar title="添加超级管理员" back-link>
        </f7-navbar>

        <f7-list id="hawk-privilegeboss-list">

            <f7-list-item
                v-if="!myProfile.superadmin"
                class="hawk-privilegeboss-reminder"
            >
                <div class="inner">
                    <i class="fa fa-exclamation-circle" aria-hidden="true"></i>
                    非超级管理员操作，添加过一次后不可更改，请谨慎操作
                </div>
            </f7-list-item>

            <f7-list-item divider></f7-list-item>

            <f7-list-item
                title="成员"
                :after="who(bossId) && who(bossId).name || '请选择'"
                link="#"
                @click="$f7.popup.open('#privilegeboss-popup-employeepicker')"
            >
            </f7-list-item>

        </f7-list>


        <f7-popup id="privilegeboss-popup-employeepicker">
            <employeepicker 
                :multiple = 'true' 
                @employee:selected = "set_boss"
                @employee:cancel="$f7.popup.close('#privilegeboss-popup-employeepicker')"
            ></employeepicker>
        </f7-popup>

        <f7-list class="hawk-action-button-bottom">
            <f7-list-button 
                title="保存"
                @click="save"
            ></f7-list-button>
        </f7-list>       
    </f7-page>
</template>

<style lang="scss">
#hawk-privilegeboss-list {
    margin-top: 0;
    font-size: 16px;
    font-weight: 400;
    color: #333333;

    .item-title {
        padding-left: 15px;
    }

    .item-inner:after {
        background-color: white;
    }

    .item-content {
        padding-left: 0;
        display: block;
    }

    .item-divider:before {
        background-color: white;
    }

    .hawk-privilegeboss-reminder {
        background-color: #FFF5E4;
        color: #F96A0E;   
        padding-left: 15px;
        font-size: 13px;     
    }
}
</style>

<script>
import employeepicker from 'gadget/employeepicker.vue';
import { mapGetters, mapActions } from 'vuex';
import axios from 'axios';

export default {
    components: {
        employeepicker
    },

    data() {
        return {
            bossId: ''
        }
    },

    computed: {
        ...mapGetters([
            'who',
            'personnel',
            'myUserId',
            'myProfile'
        ]),

        curBoss() { return this.personnel.find(u => !!u.superadmin) },
    },

    mounted() {
        if (this.curBoss) this.bossId = this.curBoss._id;
    },

    methods: {
        ...mapActions({
            'reload_personnel': 'LOAD_PERSONNEL',
            'reload_user': 'LOGIN'
        }),

        save() {
            // if (this.curBoss && this.curBoss._id != this.myUserId) {
            //     $alert('您没有权限更改超级管理员', '操作错误');
            //     return;
            // }

            if (!this.bossId) {
                $alert('超级管理员不能为空', '操作错误');
                return;
            }

            if (this.curBoss && this.bossId == this.curBoss._id) return;

            $confirm('确定要更新超级管理员吗？', '操作确认', () => {
                $preloader.show();

                let updates = [{_id: this.bossId, superadmin: true, changeSuperAdmin: true}];
                if (this.curBoss) updates.push({_id: this.curBoss._id, superadmin: false});

                axios.put('api/users/', updates).then(resp => {
                    this.sys_reload();
                    $preloader.hide();
                    this.$f7router.back();
                }).catch(error => {
                    console.error(error);
                    $alert('无法更新数据，请稍后再试', '操作错误');
                });
            })
        },

        sys_reload() {
            this.reload_personnel();
            if (this.bossId == this.myUserId) this.reload_user();
        },

        set_boss(uIdList) {
            if (uIdList && uIdList.length > 0) this.bossId = uIdList[0];
            $f7.popup.close('#privilegeboss-popup-employeepicker');
        }
    }
}
</script>
