<template>
    <f7-page>
        <f7-navbar>
            <f7-nav-left>
                <f7-link icon-only @click="cancel">
                    <i class="icon icon-back"></i>
                </f7-link>
            </f7-nav-left>

            <f7-nav-title>选择下属</f7-nav-title>


        </f7-navbar>

        <div>

            <div>
                <div class="list-item  list-type" v-for="uid in employee" @click="seleemployee(item)">
                    <img :src="who(uid).avatarUrl" width="20px" height="20px">
                    <span>{{who(uid).name}}</span>
                </div>
            </div>
        </div>

    </f7-page>
</template>

<script>

    import {mapGetters} from 'vuex';

    const btn_oval_selected_green = require("assets/images/btn_oval_selected_green@2x.png");

    export default {
        name: "employeeselecter",

        props: {
        },

        data() {
            return {

                employee:[],

                btn_oval_selected_green:btn_oval_selected_green,
            }
        },

        computed: {
            ...mapGetters([
                'organization',
                'who',
                'personnel',
                'userDepartment',
                'isDepartmentAdmin',
                'myProfile',
                'departments'

            ]),
        },

        mounted(){

            this.updatelist();
        },

        methods: {

            updatelist(){

                let list = [];
                if (this.myProfile.superadmin){
                    //老板
                    this.departments.forEach(function(obj){

                        obj.employees.forEach(function(e){

                            list.push(e);
                        });
                    });

                } else if (this.isDepartmentAdmin(this.myProfile._id)){
                    //部门管理员
                    list = this.userDepartment(this.myProfile._id).employees;
                }else {

                    list = [this.myProfile._id];
                }

                this.employee = list;
            },

            seleemployee(obj){

            },

            cancel() {

                this.$emit('employee:cancel');
            },
        },
    }
</script>

<style scoped>

    .list-item{

        background: #FFFFFF;
        width: 100%;
        height: 45px;
        font-size: 14px;
        line-height: 45px;
        border-bottom: 1px solid #f8f8f8;
    }
    .list-type {

        background: white;
        line-height: 45px;
        font-size: 14px;
        /*margin-top: 0px;*/
        /*margin-bottom: 0px;*/
    }

    .list-type span{
        /*display: inline-block;*/
        /*margin-left: 10px;*/
        /*line-height: 40px;*/
        /*background: red;*/
    }

    .list-type img {

        float: left;
        padding-left: 15px;
        padding-top: 13px;
    }
</style>
