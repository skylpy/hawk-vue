<template>
    <f7-page>
        <f7-navbar title="手机绑定" back-link>
            <f7-nav-right>
                <f7-link
                    href="#"
                    @click="submit">保存</f7-link>
            </f7-nav-right>
        </f7-navbar>

        <div class="warning">
            <f7-icon class="icon" f7="info_round"></f7-icon>
            用户只能在同一台手机上登录；换手机登录需要先解除绑定。
        </div>

        <f7-searchbar
            disable-button
            placeholder="输入名字、部门或职位"
            search-container=".p-list"
            search-in=".item-title, .item-text"
            disable-button-text="取消"
        ></f7-searchbar>
        <f7-block-title>员工列表</f7-block-title>

        <f7-list class="p-list" media-list>
            <f7-list-item
                v-for = "(p, index) in personnel"
                :key = "index"
                name = "p-checkox"
                :title="p.name"
                :text="(userDepartmentName(p._id) || '部门待定') + ' ' + (p.job || '职位待定')"
            >
            <f7-list-item-row slot="after">
                    <f7-chip
                        v-if="!!p.deviceLock"
                        text="手机绑定"
                        color="blue"
                    ></f7-chip>
                    <!--<pre style="display: inline">   </pre>-->
                    <f7-toggle
                        :checked="!!p.deviceLock"
                        color="green"
                        @change="toggle($event, p)"
                    ></f7-toggle>
            </f7-list-item-row>
            </f7-list-item>
        </f7-list>

    </f7-page>
</template>
<style scoped>
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
</style>
<script>
import {mapGetters, mapMutations, mapActions} from 'vuex';

export default {
    props: {
        lastPage: {
            type: String,
            default: '上一页'
        }
    },

    data: () => {
        return {
        }
    },

    computed: {
        ...mapGetters([
            'personnel',
            'userDepartmentName'
        ])
    },

    mounted: function() {
        $dialog.preloader('正在更新数据');

        this.load('deviceLock').then(() => {
            $dialog.close();
        }).catch((err) => {
            $dialog.close();
            $dialog.alert('无法更新数据', '操作失败', () => {
                this.$f7router.back();
            })
        });
    },

    methods: {
        ...mapMutations({
            update: 'PERSONNEL_UPDATE_KEY'
        }),
        ...mapActions({
            save: 'SAVE_PERSONNEL_KEY',
            load: 'LOAD_PERSONNEL_KEY'
        }),

        toggle(ev, p) {
            let _id = p._id;

            if (ev.target.checked && !p.deviceLock) {
                let deviceLock = '*';
                this.update({_id, deviceLock});
            } else if (!ev.target.checked && p.deviceLock) {
                let deviceLock = '';
                this.update({_id, deviceLock});
            }
        },

        submit() {
            $dialog.confirm('确定要更新手机绑定名单吗？', '更新设置', () => {
                $dialog.preloader('正在更新手机绑定名单');

                this.save('deviceLock').then(() => {
                    $dialog.close();
                    $alert('成功保存手机绑定名单', '操作成功', () => {
                        this.$f7router.back();
                    });
                }).catch((err) => {
                    $dialog.close();
                    $alert('无法保存手机绑定名单', '操作失败');
                });
            });
        }
    }
}
</script>
