<template>
    <f7-page style="background: #FFFFFF"  @page:beforein="reload">
        <f7-navbar :title="title" back-link>
            <f7-nav-right>
                <f7-link v-if="IamSuperAdmin || IamDepartmentAdmin" @click="selectorPersonnelShow=true">查看员工</f7-link>
            </f7-nav-right>
        </f7-navbar>
        <div class="page-context">
            <div v-if="IamDepartmentAdmin">
                    <taskself ref="taskself" v-show="toolbar == 'self'"></taskself>
                    <taskmanager ref="taskmanager" v-show="toolbar == 'manager'"></taskmanager>
            </div>
            <div v-else-if="IamSuperAdmin">
                <taskmanager  ref="taskmanager"></taskmanager>
            </div>
            <div v-else>
                <taskself ref="taskself"></taskself>
            </div>

        </div>
        <div class="add-button">
            <img :src="add_img" width="55px" height="55px" @click="add">
        </div>

        <footer class="page-toolbar" v-if="IamDepartmentAdmin">
            <div class="toolbar-btn" @click="toolbar = 'manager';title = '直属员工任务'">
                <img :src="toolbar == 'manager'?icon_employee_green:icon_employee_gray" width="25px" height="25px">
                <p :class="{active:toolbar == 'manager'}">直属员工</p>
            </div>
            <div class="toolbar-btn" @click="toolbar = 'self';title = '我的任务'">
                <img :src="toolbar == 'self'?icon_my_task_green:my_task_gray" width="25px" height="25px">
                <p :class="{active:toolbar == 'self'}">我的任务</p>
            </div>
        </footer>
        <f7-popup  :opened="selectorPersonnelShow" @popup:closed="(selectorPersonnelShow = false)">
            <employeepicker
                    :multiple="false"
                    :parentDepartmentId="parentDepartmentId"
                    :showSuperAdmin=false
                    @employee:cancel="selectorPersonnelShow = false"
                    @employee:selected="onSelectorPersonne"
            ></employeepicker>
        </f7-popup>
    </f7-page>
</template>

<style scoped>
    ul,li{
        margin: 0;
        padding: 0;
    }
    .clear-float {
        clear:both;
        height: 0;
        line-height: 0;
        font-size: 0;
    }
    .page-context{
        top:0px;
        left:0px;
        right:0px;
        overflow: auto;
        -webkit-overflow-scrolling: touch;
        box-sizing: border-box;
        height: 100%;
        position: relative;
        z-index: 1;
    }
    .page-toolbar{
        position: fixed;
        background: #FFFFFF;
        bottom: 0px;
        width: 100%;
        height: 49px;
        box-shadow:0px 0px 5px 0px rgba(0,0,0,0.15);
        z-index: 99;

        /*position: fixed;*/
        /*bottom: 0px;*/
        /*width: 100%;*/
        /*height: 50px;*/
        /*background: #FFFFFF;*/
        /*color: white;*/
        /*text-align: center;*/
        /*line-height: 50px;*/
        /*font-size: 18px;*/
        /*z-index: 99;*/
    }
    .toolbar-btn{
        float: left;
        width: 50%;
    }
    .toolbar-btn img{
        display: block;
        margin: 5px auto 0px auto;
    }
    .toolbar-btn p{
        font-size: 12px;
        color: #CDCDCD;
        text-align: center;
        margin: 0;
        padding: 0;
    }
    .toolbar-btn .active{
        color: #01B38B!important;
    }
    .add-button{
        position: fixed;
        bottom: 80px;
        right: 20px;
        width:55px;
        height:55px;
        z-index: 99;
    }
    .add-button span{
        display: inline-block;
        padding: 0px;
        margin-top: 11px;
        line-height: 22px;
        font-size: 22px;
        color: #FFFFFF;
    }
</style>
<script>
    import {mapGetters, mapActions,mapMutations} from 'vuex';
    import employeepicker from 'gadget/employeepicker.vue';
    import axios from 'axios';
    import dateFormat from 'lib/dateformat.js';
    import taskself from './taskself';
    import taskmanager from './taskmanager';

    const my_task_gray = require("assets/images/icon_my_task_gray@2x.png");
    const icon_my_task_green = require("assets/images/icon_my_task_green@2x.png");
    const icon_employee_gray = require("assets/images/icon_employee_gray@2x.png");
    const icon_employee_green = require("assets/images/icon_employee_green@2x.png");
    const add_img = require("assets/images/btn_oval_add_green@2x.png");

    export default {
        name: "hello",
        components: {
            taskmanager,
            employeepicker,
            taskself
        },
        props: {
            lastPage: {
                type: String,
                default: '上一页'
            },
            which: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                toolbar:'manager',
                title:'直属员工任务',
                selectorPersonnelShow:false,
                my_task_gray:my_task_gray,
                icon_employee_green:icon_employee_green,
                icon_my_task_green:icon_my_task_green,
                icon_employee_gray:icon_employee_gray,
                add_img:add_img,
                parentDepartmentId:'',


            };
        },
        methods: {
            ...mapMutations([
                'setHasUpdateTask'
            ]),
            jumpTo(path, properties) {
                this.$f7router.navigate(path, {
                    props: properties
                });
            },
            load(){
                if (this.$refs.taskself) this.$refs.taskself.load();
                if (this.$refs.taskmanager) this.$refs.taskmanager.load();
            },
            reload(){
                if (this.hasUpdateTask) {
                    this.load()
                    this.setHasUpdateTask(false)
                }
            },
            onSelectorPersonne(uIds) {
                if (uIds && uIds[0]) {
                    this.jumpTo('/office/taskstaff/',{'userId':uIds[0]})
                }
                this.selectorPersonnelShow = false;
            },
            add(){
                if (this.IamSuperAdmin) {
                    this.jumpTo("/office/task/");
                    return;
                }
                if (this.toolbar == 'self' || (!this.IamSuperAdmin && !this.IamDepartmentAdmin)) {
                    this.jumpTo("/office/task/",{userId:this.myProfile._id});
                    return;
                }

                let self = this;
                $dialog.create({
                    title: '请问您要新增任务给谁?',
                    buttons: [
                        {
                            text: '自己',
                            color:'black',
                            bold:true,
                            onClick(event) {
                                self.jumpTo("/office/task/",{userId:self.myProfile._id})
                            }
                        },
                        {
                            text: '员工',
                            color:'black',
                            bold:true,
                            onClick(event) {
                                self.jumpTo("/office/task/")
                            }
                        },
                        {
                            text: '取消',
                            color:'black',
                            bold:true
                        },
                    ],
                    verticalButtons: true,
                }).open();
            },
        },
        mounted(){
            this.load();
            if (!this.IamDepartmentAdmin && !this.IamSuperAdmin) {
                this.title = "我的任务"
            }
            if (!this.parentDepartmentId && !this.IamSuperAdmin && this.isDepartmentAdmin(this.myProfile._id)){
                this.parentDepartmentId =  this.userDepartment(this.myProfile._id).departmentId;
            }

            if (this.which) {
                this.toolbar = 'self';
                this.title = '我的任务'
            }
        },
        computed: {
            ...mapGetters([
                'who',
                'superAdmin',
                'isDepartmentAdmin',
                'userDepartment',
                'myProfile',
                'hasUpdateTask',
            ]),
                IamDepartmentAdmin(){
                    if (this.myProfile._id){
                    return this.isDepartmentAdmin(this.myProfile._id)
                }
                },
                IamSuperAdmin(){
                    if (this.myProfile._id && this.superAdmin){
                        return this.superAdmin._id == this.myProfile._id
                    }
                }


        },
        watch: {
        }
    };
</script>

