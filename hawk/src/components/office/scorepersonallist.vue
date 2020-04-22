<template>
    <f7-page>
        <f7-navbar title="考核结算" back-link>
        </f7-navbar>

        <div class="other_btn" @click="selectorPersonnelShow=true">
            <span style="flex: 1;">查看其它员工考核</span>
            <img :src="arrowRight">
        </div>
        <div class="list_title">直属员工列表</div>
        <f7-list class="p-list">
            <f7-list-item
                v-for = "(p, index) in userList"
                :key = "index"
                @click="toggle_employee(p._id)">
                <div class="task-contact-list" >
                    <img class="avatar" :src="who(p._id) && who(p._id).avatarUrl || avatar">
                    <div class="info">
                        <p class="name">{{p.name}}</p>
                        <p class="depart">{{ (p._id && userDepartmentName(p._id) || '') + ' ' + (p.job || '') }}</p>
                    </div>

                    <div class="contact-btn">
                        查看
                    </div>
                </div>
            </f7-list-item>
        </f7-list>

        <f7-popup :opened="selectorPersonnelShow" @popup:close="selectorPersonnelShow = false">
            <employeepicker
                    :multiple="false"
                    :parentDepartmentId="parentDepartmentId"
                    :showSuperAdmin="false"
                    @employee:selected="onSelectorPersonne"
                    @employee:cancel="selectorPersonnelShow = false"
            ></employeepicker>
        </f7-popup>
    </f7-page>
</template>

<style lang="scss" scoped>
.other_btn {
    height: 45px;
    line-height: 45px;
    background: #fff;
    font-size: 14px;
    color: #333;
    margin-top: 10px;
    padding: 0 15px;
    display: flex;
    align-items: center;

    img {
        width: 6px;
        height: 12px;
        display: block;
    }
}

.list_title {
    height: 30px;
    line-height: 30px;
    padding-left: 15px;
    background: #f8f8f8;
    font-size: 12px;
    color: #666;
}

.p-list {
    margin-top: 0;
}

.task-contact-list {
    width: 100%;
    height: 48px;
    display: flex;
    align-items: center;
    overflow: hidden;

    .avatar {
        width: 35px;
        height: 35px;
        margin-right: 10px;
        display: block;
    }

    .info {
        flex: 1;
    }

    .name {
        max-width: 100px;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        margin: 0;
        font-size: 16px;
        color: #333;
    }

    .depart {
        margin: 0;
        font-size: 13px;
        color: #666;
    }

    .contact-btn {
        display: flex;
        align-items: center;
        font-size: 14px;
        color: #01B38B;
        margin-left: 20px;
    }
}
</style>
<script>
    import {mapGetters, mapMutations, mapActions} from 'vuex';
    import employeepicker from 'gadget/employeepicker.vue';
    import axios from 'axios';

    export default {
         components: {
            employeepicker
        },
        props: [
            'which',
            'uId' // 用于查看其他员工
        ],
        data() {
            return {
                avatar: require('assets/images/hp_default_70@2x.png'),
                arrowRight: require('assets/images/arrow_right_gray@2x.png'),
                userList: [],
                parentDepartmentId: null,
                selectorPersonnelShow: false
            }
        },

        created() {
            this.load();
            if (this.superAdmin._id !== this.myProfile._id) {
                let myDepartment = this.adminDepartment(this.myProfile._id)
                this.parentDepartmentId = myDepartment ? myDepartment.departmentId : null
            }
            if (this.which === 'selectorPersonnelShow') {
                this.$nextTick(() => {
                    this.selectorPersonnelShow = true
                })
            }
        },

        computed: {
            ...mapGetters([
                'myProfile',
                'userDepartmentName',
                'adminDepartment',
                'who',
                'superAdmin'
            ]),
        },

        methods: {
            load(){
                let self=this;
                $preloader.show();
                axios.get('api/user/getDirectlyUsers').then(resp => {
                    self.userList = resp.data;

                    $preloader.hide();
                });
            },

            onSelectorPersonne(uIds) {
                this.selectorPersonnelShow = false;
                if (uIds.length) {
                    this.$f7router.navigate('/office/scorepersonal/', {
                        // reloadCurrent: true,
                        props: {
                            lastPage: '员工管理',
                            uId: uIds[0]
                        }
                    });
                }
            },

            toggle_employee(uid) {
                this.onSelectorPersonne([uid]);
            }
        }
    }
</script>
