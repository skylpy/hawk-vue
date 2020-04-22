<template>
    <f7-page>
        <f7-navbar>
            <f7-nav-left>
                <f7-link icon-only @click="cancel">
                    <i class="icon icon-back"></i>
                </f7-link>
            </f7-nav-left>

            <f7-nav-title>选择负责人</f7-nav-title>
        </f7-navbar>

        <div>
            <div class="content" v-for="(tit,index) in titlesub">
                <div class="titlespan">{{tit}}</div>
                <div v-if="index == 0" class="list-item  list-type" v-for="item in administrative_list" @click="done(item)">
                    <img :src=btn_oval_selected_green width="13px" height="13px" v-show="item.isSelect = false">
                    <span>{{item.name}}</span>

                </div>

                <div v-if="index == 1" class="list-item  list-type" v-for="item in myadmin_list" @click="done(item)">
                    <img :src=btn_oval_selected_green width="13px" height="13px" v-show="item.isSelect = false">
                    <span>{{item.name}}</span>
                    <span class="role">{{item.role}}</span>

                </div>
            </div>
        </div>

    </f7-page>
</template>

<script>
    import {mapGetters} from 'vuex';

    const btn_oval_selected_green = require("assets/images/btn_oval_selected_green@2x.png");

    export default {
        name: "officialselector",

        props: {
        },

        data() {
            return {
                titlesub:["行政人员","上级领导"],

                administrative_list:[],
                myadmin_list:[],
                sub_icon: require('assets/images/icon_truee_green@2x.png'),

                selected: [],

                btn_oval_selected_green:btn_oval_selected_green,
            }
        },

        computed: {
            ...mapGetters([
                'who',
                'personnel',
                'myProfile',
                'getSuperiorAdmin',
                'myUserId',
                'superAdmin'
            ]),
        },

        mounted(){
            this.updateTrativelist();
            this.updateMyAdmin();
        },

        methods: {

            //上级领导
            updateMyAdmin(){
                let list = [];
                let admin = this.getSuperiorAdmin(this.myUserId);
                // console.log(admin);
                if (admin.length && this.superAdmin._id !== this.myUserId) {
                    admin.map(id => {
                        if (id && this.who(id)) {
                            list.push({
                                uid: id,
                                name: this.who(id).name,
                                isSelect: false,
                                role: "直属领导"
                            });
                        }
                    });
                    console.log(list)
                }
                if (list.length == 0) {
                    list.push({
                        uid: this.superAdmin._id,
                        name: this.superAdmin.name,
                        isSelect: false,
                        role: "老板"
                    });
                }
                this.myadmin_list = list;
            },
            //行政人员
            updateTrativelist() {
                let arrs =  this.personnel.filter(p => {
                    if (!p.privilege || p.privilege.length == 0) return false;
                    return p.privilege.some(i => ['合同管理', '企业设置'].includes(i));
                });
                let self = this;
                let newarr = [];

                arrs.forEach(function(e){

                    let obj = self.shallowCopy(e);
                    if (e._id != self.myProfile._id){
                        obj.isSelect = false;
                        newarr.push(obj);
                    }
                });

                this.administrative_list=newarr;
            },

            shallowCopy (obj) {
                // 只拷贝对象
                if (typeof obj !== 'object') return;
                // 根据obj的类型判断是新建一个数组还是一个对象
                var newObj = obj instanceof Array ? [] : {};
                // 遍历obj,并且判断是obj的属性才拷贝
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        newObj[key] = obj[key];
                    }
                }
                return newObj;
            },

            cancel() {

                this.$emit('employee:cancel');
            },

            done(item) {
                console.log(item)

                this.selected = [item];

                this.$emit('employee:selected', this.selected);
            }
        }
    }
</script>


<style lang="scss" scoped>
    .content {

        overflow: auto;
        -webkit-overflow-scrolling: touch;
        box-sizing: border-box;
        height: 100%;
        position: relative;
        z-index: 1;
        /*margin-bottom: 50px;*/

    }

    .titlespan{

        padding-left: 15px;
        padding-top: 5px;
        padding-bottom: 5px;
        font-size: 14px;
        color: #A7A7A7;
    }

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
        margin-top: 0px;
        margin-bottom: 0px;
    }

    .list-type span{
        display: inline-block;
        margin-left: 15px;
    }

    .list-type img {

        padding-top: 3px;
        padding-left: 10px;
    }

    .list-type div{
        display: inline-block;
        width: 50%;
        text-align: right;
        float: right;
        margin-right: 10px;
        color: darkgray;
    }
    .role{
        font-size: 10px;
        color: #CCCCCC;
    }
</style>


