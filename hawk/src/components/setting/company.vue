<template>
    <f7-page>
        <f7-navbar :title="navTitle" back-link>
        </f7-navbar>

        <f7-block-title>请选择设置的类别</f7-block-title>
        <f7-list>
            <f7-list-item
                    v-for="item in checkPermission(itemList)"
                    :divider="item.title ? false:true"
                    :title="item.title"
                    :key="item.title"
                    link="#"
                    @click="jump(item)"
                    after="设置">
                <f7-icon slot="media" :fa="item.icon"></f7-icon>
            </f7-list-item>
        </f7-list>
    </f7-page>
</template>

<script>
    import {mapGetters} from 'vuex';

    export default {
        data: () => {
            return {
                navTitle: '公司设置',
                itemList: [
                    // {
                    //     title: "组织构架", icon: "sitemap", link: "/setting/company/organization"
                    // },
                    {
                        title: "考勤管理", icon: "clock-o", link: "/setting/company/timecards", props: {
                            lastPage: '公司设置'
                        }
                    },
                    // {
                    //     title: "手机绑定", icon: "phone-square", link: "/setting/devicelock/", props: {
                    //         lastPage: '公司设置'
                    //     }
                    // },
                    {
                        title: "节假日设置", icon: "calendar-times-o", link: "/setting/holiday/", props: {
                            lastPage: '公司设置'
                        }
                    },
                    {},
                    {
                        title: "客户区域", icon: "globe", link: "/setting/tree/", props: {
                            lastPage: '公司设置',
                            name: '区域',
                            src: 'regions'
                        }
                    },
                    {
                        title: "客户等级", icon: "star-o", link: "/setting/meta/", props: {
                            lastPage: '公司设置',
                            navTitle: '客户等级',
                            dataType: 'clientGrade'
                        }
                    },
                    {
                        title: "客户类型", icon: "address-card", link: "/setting/meta/", props: {
                            lastPage: '公司设置',
                            navTitle: '客户类型',
                            dataType: 'clientType'
                        }
                    },
                    {
                        title: "意向类型", icon: "anchor", link: "/setting/meta/", props: {
                            lastPage: '公司设置',
                            navTitle: '意向类型',
                            dataType: 'intentionType'
                        }
                    },
                    {},
                    {
                        title: "职位类型", icon: "black-tie", link: "/setting/meta/", props: {
                            lastPage: '公司设置',
                            navTitle: '职位类型',
                            dataType: 'jobType'
                        }
                    },
                    {
                        title: "拍照类型", icon: "picture-o", link: "/setting/meta/", props: {
                            lastPage: '公司设置',
                            navTitle: '拍照类型',
                            dataType: 'pictureType'
                        }
                    },
                    {
                        title: "任务类型", icon: "tasks", link: "/setting/meta/", props: {
                            lastPage: '公司设置',
                            navTitle: '任务类型',
                            dataType: 'taskType'
                        }
                    },
                    {
                        title: "请假类型", icon: "calendar", link: "/setting/meta/", props: {
                            lastPage: '公司设置',
                            navTitle: '请假类型',
                            dataType: 'leaveType'
                        }
                    },
                    {
                        title: "报销类型", icon: "jpy", link: "/setting/expense/", props: {
                            lastPage: '公司设置',
                            navTitle: '报销类型',
                            dataType: 'leaveType'
                        }
                    },
                    {
                        title: "日报设置", icon: "file-text", link: "/office/journalset/", props: {
                            lastPage: '公司设置',
                            navTitle: '日报设置',
                            dataType: 'leaveType'
                        }
                    },
                    {
                        title: "拜访设置", icon: "suitcase", link: "/client/visitset/", props: {
                            lastPage: '公司设置',
                            navTitle: '拜访设置',
                            dataType: 'leaveType'
                        }
                    },
                    {
                        title: "财务设置", icon: "credit-card", link: "/setting/finance/", props: {
                            lastPage: '公司设置',
                            navTitle: '财务设置',
                            dataType: 'leaveType'
                        }
                    },
                    {
                        title: "车辆类型", icon: "car", link: "/setting/car/", props: {
                            lastPage: '公司设置',
                            navTitle: '车辆类型'
                        }
                    },
                    {
                        title: "印章类型", icon: "gavel", link: "/setting/seal/", props: {
                            lastPage: '公司设置',
                            navTitle: '印章类型'
                        }
                    },
                    {
                        title: "付款方式", icon: "money", link: "/setting/paymenttype/", props: {
                            lastPage: '公司设置',
                            navTitle: '付款方式'
                        }
                    }
                ]
            }
        },

        computed: {
            ...mapGetters([
                'myCompany',
                'superAdmin',
                'myUserId',
                'userPermissions',
                'myProfile'
            ])
        },

        methods: {
            jump(item) {
                let target = item.link;
                let props = {};

                if (item.props) {
                    props = item.props;
                    props.from = this.navTitle;
                }

                this.$f7router.navigate(target, {props});
            },

            checkPermission(items) {
                return items.filter(item => {
                    if (item.title == '组织构架') {
                        if (this.myProfile.superadmin) return true;
                        if (this.userPermissions(this.myUserId).includes('组织构架')) return true; else return false;
                    }
                    return true;
                })
            },
        }
    }
</script>

