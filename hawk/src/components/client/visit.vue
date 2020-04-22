<template>
    <f7-page class="add_visit_page">
        <f7-navbar :title="pageTitle" back-link>
            <f7-nav-right>

            </f7-nav-right>
        </f7-navbar>

        <div class="content">
            <div  class="list-item  list-type" @click="selcustomers">
                <span class="item-icon">*</span>
                <label>{{classify == '客户资料'?'拜访客户':'拜访商家'}}</label>
                <div>
                    <span style="font-size: 12px">{{clientName}}</span>
                    <img :src=arrow_right_gray style="position: relative;top:1px;width: 7px;height: 13px;" />
                </div>
            </div>
            <div  class="list-item  list-type" @click="selperson">
                <span class="item-icon">*</span>
                <label>{{classify == '客户资料'?'客户联系人':'商家联系人'}}</label>
                <div>
                    <span style="font-size: 12px">{{contactName}}</span>
                    <img :src=arrow_right_gray style="position: relative;top:1px;width: 7px;height: 13px;" />
                </div>
            </div>
            <div  class="list-item  list-type">
                <span class="item-icon">*</span>
                <label>{{classify == '客户资料'?'客户类型':'商家类型'}}</label>
                <div>
                    <span style="font-size: 12px">{{visit.visitType}}</span>

                </div>
            </div>
            <div  class="list-item  list-type" @click="addtask">
                <span class="item-icon">*</span>
                <label>拜访方式</label>
                <div>
                    <span style="font-size: 12px">{{visit.type}}</span>
                    <img :src=arrow_right_gray style="position: relative;top:1px;width: 7px;height: 13px;" />
                </div>
            </div>
            <div  class="list-item  list-type">
                <span class="item-icon">*</span>
                <label>截止时间</label>
                <date-picker v-model="visit.deadline "
                             :not-before = "new Date()"
                             type="datetime"
                             :editable="false"
                             class="date-picker"
                             width="150px"
                             :confirm="true"
                             :confirm-text="'确定'"
                             placeholder="   请选择截止时间"
                             format="YYYY-MM-DD HH:mm"
                             :minute-step="1"
                             :first-day-of-week="1"></date-picker>
            </div>
            <div  class="list-item  list-type" @click="selectorPersonnelShow=(isDepartmentAdmin(myProfile._id)||myProfile.superadmin)? true:false">
                <span class="item-icon">*</span>
                <label>拜访人</label>
                <div>
                    <span style="font-size: 12px" v-if="visit.executor.length == 0">{{(isDepartmentAdmin(myProfile._id)||myProfile.superadmin)?'请选择':myProfile.name}}</span>
                    <span style="font-size: 12px" v-else v-for="(item,index) in visit.executor">{{who(item).name+(index==visit.executor.length-1?'':',')}}</span>
                    <img :src=arrow_right_gray style="position: relative;top:1px;width: 7px;height: 13px;" />
                </div>
            </div>


            <div class="list-item clear-float textarea-item">
                <span class="item-icon">*</span>
                <label>拜访内容</label>
                <textarea  placeholder="请输入拜访内容"
                           :value="visit.content"
                           @input="visit.content = $event.target.value"
                >
                    </textarea>

            </div>

            <div class="list-item photo-item">

                <label>照片：</label>
                <photoeditor
                        slot="inner"
                        :gallery="true"
                        :photos="visit.photo"
                        @photo:update="(photos) => {visit.photo = photos}"
                ></photoeditor>
            </div>

        </div>

        <div class="footer" @click="save">提交</div>
        <!--<div>-->
            <!---->
        <!--</div>-->

        <f7-popup :opened="selectorPersonnelShow" @popup:closed="(selectorPersonnelShow = false)">
            <personnelselector
                    :multiple="false"
                    :title = "'选择直属员工'"
                    :subordinate="true"
                    @submit="onSelectorPersonne"
                    @cancel="selectorPersonnelShow=false"
            ></personnelselector>
        </f7-popup>

    </f7-page>
</template>

<style scoped>

    .photo-item{

        background: #FFFFFF;
        width: 100%;
        font-size: 14px;
        line-height: 30px;
        min-height: 115px!important;
        margin-bottom: 10px;
        padding-bottom: 10px;
    }

    .photo-item label {

        margin-left: 20px;
        display: inline-block;
    }

    .clear-float {

        clear:both;
        height: 0;
        line-height: 0;
        font-size: 0;
    }

    .textarea-item{

        height: 200px!important;
    }

    .textarea-item textarea{

        width: 100%;
        background:none;
        outline:none;
        border:0px;
        float: left;
        font-size: 14px;
        line-height: 1.5em;
        margin-top: -10px;
        padding-right: 15px;
        padding-left: 20px;
        box-sizing: border-box;
        height: 70%;
        color: #333;
    }

    .list-item{

        background: #FFFFFF;
        width: 100%;
        height: 46px;
        font-size: 14px;
        line-height: 46px;
        border-bottom: 1px solid #f8f8f8;
    }

    .list-type {

        background: white;
        line-height: 45px;
        font-size: 14px;
        margin-top: 0px;
        margin-bottom: 0px;
    }

    .list-type div{
        display: inline-block;
        width: 50%;
        text-align: right;
        float: right;
        margin-right: 10px;
        color: darkgray;
    }

    .item-icon{
        display: inline-block;
        color: red;
        width: 18px;
        text-align: right;
    }

    .content {

        overflow: auto;
        -webkit-overflow-scrolling: touch;
        box-sizing: border-box;
        height: 100%;
        position: relative;
        z-index: 1;
        margin-bottom: 60px;
    }

    .footer{

        position: fixed;
        bottom: 0px;
        width: 100%;
        height: 50px;
        background: #01B38B;
        color: white;
        text-align: center;
        line-height: 50px;
        font-size: 16px;
        z-index: 99;
    }

</style>
<style lang="scss">
    .add_visit_page .page-content {
        overflow: hidden;
    }
</style>
<script>
import {defaultImgUrl} from 'lib/loading';
import {mapGetters, mapActions} from 'vuex';
import personnelselector from 'gadget/personnelselector.vue';
import directlyuserselector from 'gadget/directlyuserselector.vue';
import clientselector from 'gadget/clientselector.vue';
import location from 'gadget/location.vue';
import photoeditor from 'gadget/photoeditor.vue';
import axios from 'axios';
import DatePicker from 'vue2-datepicker'
import employeepicker from 'gadget/employeepicker.vue';
import employeeselecter from '../gadget/employeeselecter.vue';
import moment from 'moment'

// assets/images/arrow_right_gray@2x.png
const arrow_right_gray = require("assets/images/arrow_right_gray@2x.png");

export default {
    components: {
        personnelselector,
        location,
        photoeditor,
        clientselector,
        DatePicker,
        employeepicker,
        employeeselecter,
        directlyuserselector
    },

    props: [
        'lastPage',
        'reference',
        'classify'
    ],

    data() {
        return {
            visit: {
                clientName:"",
                creator:"",
                executor:[],
                client:"",
                deadline:null,
                contact:"",
                contactName:"",
                contactPhone:"",
                content:"",
                remind:"",
                type:"",
                photo:[],
                status:"",
                clientClassify:"",
                visitType:"请选择",
                isVisit:false
            },

            beforeDate:"",
            photo: [],
            clientName:"请选择",
            contactName:"请选择",
            parentDepartmentId:'',

            cousomers:null,

            selectorPersonnelShow: false, // 查看员工
            arrow_right_gray:arrow_right_gray,

            popup: {
                datepicker: null
            },

            isCommit: false
        }
    },

    computed: {
        ...mapGetters([
            'myUserId',
            'who',
            'myCompany',
            'position',
            'myProfile',
            'userDepartment',
            'adminDepartment',
            'organization',
            'isDepartmentAdmin'
        ]),

        pageTitle() {

            return this.classify == '客户资料' ? '新增客户拜访':'新增商家拜访';
        },
        adminDepartmentId(){

            let admin = this.adminDepartment(this.myProfile._id)
            return admin?admin.departmentId:null
        }
    },

    mounted() {
        if (!this.isDepartmentAdmin(this.myProfile._id)||!this.myProfile.superadmin){

            this.visit.executor.push(this.myUserId)
        }
    },

    methods: {
        onSelectorPersonne(uIds) {

            this.selectorPersonnelShow = false;
            console.log(uIds)
            this.visit.executor = uIds;

        },
        selperson(){
            if (this.cousomers){

                this.$f7router.navigate('/client/customersproson/',{props:{cousomer:this.cousomers,contact:this.getcontact}});
            }else {
                $alert('请选添加要拜访的客户', '操作错误');
            }
        },

        selcustomers(){

            this.$f7router.navigate('/client/selectcustomers/',{props:{getcustomer:this.getcustomer,classify:this.classify}});
        },

        getcustomer(item){

            this.cousomers = item;
            this.clientName = item.name;
            this.visit.visitType = item.type;
            this.visit.clientName = item.name;
            this.visit.client = item._id;
            this.visit.clientClassify = item.classify;
        },

        getcontact(item){

            this.visit.contact = item._id;
            this.visit.contactName = item.name;
            this.visit.contactPhone = item.phone;
            this.contactName = item.name;
        },

        addtask(){
            let self = this;
            $dialog.create({
                title: '请选择拜访方式',
                buttons: [
                    {
                        text: '电话',
                        color:'black',
                        bold:true,
                        onClick(event) {
                            self.visit.type = "电话";
                        }
                    },
                    {
                        text: '走访',
                        color:'black',
                        bold:true,
                        onClick(event) {
                            self.visit.type = "走访";
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

        save() {
            if (this.isCommit) return;

            let op =  axios.post;
            let path = 'api/visit';

            this.visit.creator = this.myUserId;
            this.visit.status = '未完成';

            this.visit.remind = "亲，"
                +this.myProfile.name
                +"给您安排了新的拜访任务（拜访"
                +this.visit.clientName
                +"-"
                +this.visit.type
                +"），请查看";

            if (this.myCompany.visitset.contentCount > this.visit.content.length) {
                let title = '拜访内容至少输入'+this.myCompany.visitset.contentCount+'个字';
                $alert(title, '操作提醒');
                return;
            }

            if (this.visit.client == "") {
                $alert('请选择要拜访的客户', '操作提醒');
                return;
            }
            if (this.visit.contact == "") {
                $alert('请选择客户联系人', '操作提醒');
                return;
            }
            if (this.visit.type == "") {
                $alert('请选择拜访方式', '操作提醒');
                return;
            }
            if (this.visit.deadline == null) {
                $alert('请选择截止时间', '操作提醒');
                return;
            }
            if (this.visit.executor.length == 0) {
                $alert('请选择拜访人', '操作提醒');
                return;
            }
            if (this.visit.content == "") {
                $alert('请输入拜访内容', '操作提醒');
                return;
            }

            $preloader.show();
            let seft = this;
            this.isCommit = true;
            op(path, this.visit).then(resp => {
                setTimeout(function(){
                    $preloader.hide();
                    seft.$f7router.back();
                },1000);
            }).catch(error => {
                this.isCommit = false;
                $preloader.hide();
                console.error(error);
                $alert('无法更新数据，请稍后再试', '操作错误');
            })
        }

    },
}
</script>

