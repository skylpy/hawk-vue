<template>
    <f7-page>
        <f7-navbar back-link>
            <f7-nav-title>财务设置</f7-nav-title>
            <f7-nav-right>
                <f7-link href="#" @click="clear">清空设置</f7-link>
            </f7-nav-right>
        </f7-navbar>
        <f7-block-title>设置默认操作人员</f7-block-title>
        <f7-list>
            <f7-list-item title="审核人" @click="open_personnelselector('reviewer')"
                          :after="getName(approver.reviewer) || '请选择'"></f7-list-item>
            <f7-list-item title="审批人" @click="open_personnelselector('approver')"
                          :after="getName(approver.approver) || '请选择'"></f7-list-item>
            <f7-list-item title="出纳人" @click="open_personnelselector('bookkeeper')"
                          :after="getName(approver.bookkeeper) || '请选择'"></f7-list-item>
        </f7-list>

        <div class="submit-button" @click="submit">保存</div>

        <f7-popup id="finance-setting-personnelselector">
            <permissionselector
                    :isFilterMe="false"
                    @employee:selected="selectEmployee"
                    @employee:cancel="$f7.popup.close('#finance-setting-personnelselector')"
            ></permissionselector>
        </f7-popup>

    </f7-page>
</template>

<script>
    import permissionselector from 'gadget/permissionselector.vue';
    import {mapGetters, mapMutations, mapActions} from 'vuex'

    export default {
        name: "finance",
        components: {
            permissionselector
        },
        data() {
            return {
                approver: {
                    show: false,
                    lister: '',
                    reviewer: '',
                    approver: '',
                    bookkeeper: '',
                    personnelselector: {}
                },
            }
        },
        computed: {
            ...mapGetters([
                'who',
                'myCompany'
            ])
        },
        mounted(){
            if(this.myCompany.financeSetting){
                this.approver.reviewer = this.myCompany.financeSetting.reviewer
                this.approver.approver = this.myCompany.financeSetting.approver
                this.approver.bookkeeper = this.myCompany.financeSetting.bookkeeper
            }

        },
        methods: {
            ...mapMutations({
                'update': 'COM_UPDATE'
            }),
            ...mapActions({
                'save': 'SAVE_COM_KEY'
            }),
            submit() {
                this.update({financeSetting:{
                    reviewer: this.approver.reviewer,
                    approver: this.approver.approver,
                    bookkeeper: this.approver.bookkeeper,
                }})
                $preloader.show();
                this.save('financeSetting').then(() => {
                    $preloader.hide();
                    this.$f7router.back();
                }).catch(error => {
                    $preloader.hide();
                    console.error(error);
                    $alert('无法更新数据，请稍后再试', '操作错误');
                })
            },
            clear(){
                this.approver.reviewer = ''
                this.approver.approver = ''
                this.approver.bookkeeper = ''
            },
            getName(uid) {
                console.log(uid)
                const u = this.who(uid)
                return u && u.name || ''
            },
            open_personnelselector(key) {
                this.approver.personnelselector = $popup.open('#finance-setting-personnelselector');
                this.approver.personnelselector.key = key;
            },
            selectEmployee(pList) {
                let key = this.approver.personnelselector.key;
                if (pList && pList[0]) {
                    this.approver[key] = pList[0].uid || pList[0];
                } else {
                    this.approver[key] = '';
                }
                $popup.close('#finance-setting-personnelselector');
            },
        }
    }
</script>

<style scoped>
    .submit-button {
        float: left;
        bottom: -44px;
        width: 100%;
        height: 45px;
        line-height: 45px;
        font-size: 16px;
        color: #FFFFFF;
        text-align: center;
        background: rgba(1, 179, 139, 1);
    }
</style>
