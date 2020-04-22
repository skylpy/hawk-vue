<template>
    <f7-page>
        <f7-navbar :title="navTitle" back-link>
            <!--<f7-nav-right>-->
            <!--<f7-link v-if="department.employees.length" actions-open="#organization-batch">批量操作</f7-link>-->
            <!--</f7-nav-right>-->
        </f7-navbar>

        <div class="tip">
            <img :src="tipIcon" />
            请录入真实工资，如果不输入默认为0
        </div>

        <f7-list inline-labels class="hawk-table">
            <f7-list-input
                    :value="info.name"
            >
                <div slot="label" class="hawk-input-label">
                    <span>员工姓名：</span>
                </div>
            </f7-list-input>

            <f7-list-input
                    placeholder="请输入"
                    :value="info.salary"
                    @input="info.salary = $event.target.value"
                    validate
                    pattern = "^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$"
                    error-message = "请输入正确工资"
            >
                <div slot="label" class="hawk-input-label">
                    <span>工资：</span>
                </div>
            </f7-list-input>
        </f7-list>

        <f7-list class="hawk-action-button-bottom">
            <f7-list-button
                    title="保存"
                    @click="save"
            ></f7-list-button>
        </f7-list>
    </f7-page>
</template>

<script>
    import axios from 'axios'
    import { mapActions } from 'vuex';
    export default {
        name: "enter_salary",
        props: ['info'],
        data() {
            return {
                navTitle: '薪资录入',
                tipIcon: require('src/assets/images/icon_news_orange@2x.png')
            }
        },
        methods: {
            ...mapActions({
                'get_salary':'GET_SALARY'
            }),

            toast(message) {
                let r = this.$f7.toast.create({
                    text: message,
                    position: 'center',
                    closeTimeout: 2000,
                });
                r.open();
            },
            save() {
                if (this.info.salary) {
                    axios.put(`/api/user/setSalary/${this.info.uid}`,{salary: this.info.salary}).then(res=>{
                        this.get_salary();
                        this.$f7router.back();
                    }).catch(err=>{
                        this.toast('保存出错');
                    });
                } else {
                    this.toast('请输入正确工资');
                }
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
</style>
