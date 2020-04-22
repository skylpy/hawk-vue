<template>
    <f7-page @page:beforein="load">
        <f7-navbar :title="pageTitle" back-link>
            <f7-nav-right>
                <!---->
                <!--<f7-link @click="$f7router.navigate('/client/visitseacher/')">确定</f7-link>-->
            </f7-nav-right>
        </f7-navbar>

        <div class="content_layer">
            <div class="content">
                <div class="list-item  list-type" v-for="item in records" @click="lastback(item)">
                    <span>{{item.name}}</span>
                    <div>
                        <span style="font-size: 12px">{{regionName(item.region)}}</span>
                        <img :src=arrow_right_gray style="position: relative;top:1px;width: 7px;height: 13px;" />
                    </div>
                </div>
            </div>
            <div class="footer" @click="addcustomer">{{classify == '客户资料'?'新增客户':'新增商家'}}</div>
        </div>
    </f7-page>
</template>

<script>

    import {mapGetters, mapActions} from 'vuex';
    import axios from 'axios';

    const arrow_right_gray = require("assets/images/arrow_right_gray@2x.png");

    export default {
        name: "selectcustomers",

        props: [
            'lastPage',
            'getcustomer',
            'classify'
        ],
        computed: {
            ...mapGetters([
                'myCompany',
                'myProfile',
                'departmentName',
                'companyRegions',
                'regionName',
                'who',
                'userDepartment',
                'myUserId',
                'superAdmin',
                'isDepartmentAdmin'
            ]),
            pageTitle() {

                return this.classify == '客户资料' ? '选择客户':'选择商家';
            },
        },
        data() {
            return {

                arrow_right_gray:arrow_right_gray,
                records: [],
                filter: {
                    number: '',
                    name: '',
                    type: [],
                    grade: [],
                    region: [],
                    intention: [],
                    manager: [],
                    classify:''
                },
                private_filter: {
                    manager: []
                },
            }
        },

        mounted() {
            this.filter.classify = this.classify;

            this.load();
        },

        methods: {

            addcustomer(){

                $dialog.create({
                    title: '请问您要新增哪一项？',
                    // text: 'Dialog with vertical buttons',
                    buttons: [
                        {
                            text: '客户资料',
                            onClick: () => {
                                this.$f7router.navigate('/client/client/', {props: {classify: "客户资料"}})
                                console.log("客户资料");
                            }
                        },
                        {
                            text: '商家资料',
                            onClick: () => {
                                this.$f7router.navigate('/client/client/', {props: {classify: "商家资料"}})
                                console.log("商家资料");
                            }
                        },
                        {
                            text: '取消'
                        },
                    ],
                    verticalButtons: true,
                }).open()
            },

            lastback(item){
                // null,{props:{test:123}}
                this.getcustomer(item)
                this.$f7router.back();
            },
            load() {
                let ajaxData = {}
                if (!this.myProfile.superadmin) {
                    let departmentId = this.userDepartment(this.myProfile._id).departmentId
                    if (this.isDepartmentAdmin(this.myProfile._id)) {
                        // 部门管理
                        ajaxData = {department: [departmentId].concat(this.userDepartment(this.myProfile._id).sub.map(v => v.departmentId))}
                    } else {
                        // 部门普通
                        ajaxData = {department: departmentId};
                    }
                }
                $preloader.show();
                axios.get('api/client?q=' + JSON.stringify(ajaxData)).then(resp => {
                    $preloader.hide();
                    let list = resp.data.filter(v => v.classify === this.classify)
                    this.records = []
                    if (this.superAdmin._id === this.myUserId) {
                        this.records = list
                    } else if (this.isDepartmentAdmin(this.myUserId)) {
                        list.map(v => {
                            if (v.private) {
                                if (v.manager == this.myUserId || !this.userDepartment(this.myUserId).admin.includes(v.manager)) {
                                    this.records.push(v)
                                }
                            } else {
                                this.records.push(v)
                            }
                        })
                    } else {
                        list.map(v => {
                            if (v.private) {
                                if (v.manager == this.myUserId) this.records.push(v)
                            } else {
                                this.records.push(v)
                            }
                        })
                    }
                    console.log("进入了"+this.records);
                }).catch(err => {
                    $preloader.hide();
                    console.error(err);

                })
            },
        },

    }
</script>

<style scoped>
    .content_layer {
        position: relative;
        height: 100%;
        overflow: hidden;
    }

    .content {
        overflow: auto;
        -webkit-overflow-scrolling: touch;
        box-sizing: border-box;
        height:  calc(100% - 50px);
        position: relative;
        z-index: 1;
    }

    .footer{
        width: 100%;
        height: 50px;
        background: #01B38B;
        color: white;
        text-align: center;
        line-height: 50px;
        font-size: 16px;
    }

    .list-item{

        background: #FFFFFF;
        width: 100%;
        height: 55px;
        font-size: 14px;
        line-height: 55px;
        border-bottom: 1px solid #f8f8f8;
    }
    .list-type {

        background: white;
        line-height: 55px;
        font-size: 14px;
        margin-top: 0px;
        margin-bottom: 0px;
    }

    .list-type span{
        display: inline-block;
        margin-left: 15px;
    }

    .list-type div{
        display: inline-block;
        width: 50%;
        text-align: right;
        float: right;
        margin-right: 10px;
        color: darkgray;
    }
</style>
