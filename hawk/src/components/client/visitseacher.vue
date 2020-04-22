<template>
    <f7-page no-toolbar style="background: #f8f8f8">
        <f7-navbar  title="拜访详细搜索" back-link>
            <f7-nav-right>

            </f7-nav-right>
        </f7-navbar>

        <div>
            <div class="content">
                <div class="list-item list-type" @click="selcustomers">

                    <label>拜访客户</label>
                    <div>
                        <span style="font-size: 12px">{{clientName}}</span>
                        <img :src=arrow_right_gray style="position: relative;top:1px;width: 7px;height: 13px;" />
                    </div>
                </div>
                <div class="list-item list-type" @click="selperson">

                    <label>客户联系人</label>
                    <div>
                        <span style="font-size: 12px">{{contactName}}</span>
                        <img :src=arrow_right_gray style="position: relative;top:1px;width: 7px;height: 13px;" />
                    </div>
                </div>
                <div class="list-item list-type">

                    <label>客户类型</label>
                    <div>
                        <span style="font-size: 12px">{{visit.visitType}}</span>

                    </div>
                </div>
                <div class="list-item list-type" @click="addtask">

                    <label>拜访方式</label>
                    <div>
                        <span style="font-size: 12px">{{visit.type}}</span>
                        <img :src=arrow_right_gray style="position: relative;top:1px;width: 7px;height: 13px;" />
                    </div>
                </div>
                <div class="list-item list-type">

                    <label>创建时间：</label>
                    <date-picker v-model="visit.createdAt " type="datetime"
                                 :editable="false"
                                 class="date-picker"
                                 width="100px"
                                 :confirm="true"
                                 :confirm-text="'确定'"
                                 placeholder="创建时间"
                                 format="YYYY-MM-DD" :minute-step="30"
                                 :first-day-of-week="1"></date-picker>
                </div>
                <div class="list-item list-type">

                    <label>截止时间</label>
                    <date-picker v-model="visit.finishedAt " type="datetime"
                                 :editable="false"
                                 class="date-picker"
                                 width="100px"
                                 :confirm="true"
                                 :confirm-text="'确定'"
                                 placeholder="截止时间"
                                 format="YYYY-MM-DD" :minute-step="30"
                                 :first-day-of-week="1"></date-picker>
                </div>
                <div class="list-item list-type" @click="selectorCreatorShow=true">

                    <label>指派人：</label>
                    <div>
                        <span style="font-size: 12px">{{visit.creator == ""?"请选择":who(visit.creator).name}}</span>
                        <img :src=arrow_right_gray style="position: relative;top:1px;width: 7px;height: 13px;" />
                    </div>
                </div>
                <div class="list-item list-type" @click="selectorPersonnelShow=true">

                    <label>拜访人</label>
                    <div>
                        <span style="font-size: 12px">{{visit.executor == ""?"请选择":who(visit.executor).name}}</span>
                        <img :src=arrow_right_gray style="position: relative;top:1px;width: 7px;height: 13px;" />
                    </div>
                </div>
                <div class="list-item list-type" @click="openPicker($event, 'items','item')">

                    <label>拜访状态：</label>
                    <div>
                        <span style="font-size: 12px">{{visit.status}}</span>
                        <img :src=arrow_right_gray style="position: relative;top:1px;width: 7px;height: 13px;" />
                    </div>
                </div>
            </div>

            <div class="footer" @click="save">搜索</div>
        </div>
        <f7-popup :opened="selectorPersonnelShow" @popup:closed="(selectorPersonnelShow = false)">
            <employeepicker
                    :multiple="false"
                    @employee:selected="onSelectorPersonne"
                    @employee:cancel="selectorPersonnelShow = false"
            ></employeepicker>
        </f7-popup>

        <f7-popup :opened="selectorCreatorShow" @popup:closed="(selectorPersonnelShow = false)">
            <employeepicker
                    :multiple="false"
                    @employee:selected="onSelectorCreator"
                    @employee:cancel="selectorCreatorShow = false"
            ></employeepicker>
        </f7-popup>
    </f7-page>

</template>

<script>

    import DatePicker from 'vue2-datepicker'
    import employeepicker from 'gadget/employeepicker.vue';
    import {mapGetters, mapActions} from 'vuex';
    import axios from 'axios';

    const arrow_right_gray = require("assets/images/arrow_right_gray@2x.png");

    export default {

        name: "visitseacher",
        components: {

            DatePicker,
            employeepicker
        },

        computed: {
            ...mapGetters([
                'myCompany',
                'myProfile',
                'departmentName',
                'companyRegions',
                'regionName',
                'who'
            ]),
        },

        data() {
            return {
                visit: {
                    clientName:"",
                    creator:"",
                    executor:"",
                    client:"",

                    contact:"",
                    contactName:"",
                    contactPhone:"",
                    content:"",
                    type:"",

                    status:"",
                    clientClassify:"",
                    visitType:"",
                    createdAt:"",
                    finishedAt:"",
                },

                photo: [],
                clientName:"请选择",
                contactName:"请选择",

                selectDatas:{
                    departments:[],
                    departmentsDisplay:[]
                },

                cousomers:null,

                selectorPersonnelShow: false, // 查看员工
                selectorCreatorShow:false,
                arrow_right_gray:arrow_right_gray,

                popup: {
                    datepicker: null
                }
            }
        },

        methods: {

            onSelectorPersonne(uIds) {

                this.selectorPersonnelShow = false;
                this.visit.executor = uIds.toString();
            },

            onSelectorCreator(uIds){

                this.selectorCreatorShow = false;
                this.visit.creator = uIds.toString();
            },

            selperson(){
                if (this.cousomers){

                    this.$f7router.navigate('/client/customersproson/',{props:{cousomer:this.cousomers,contact:this.getcontact}});
                }else {
                    $alert('请选添加要拜访的客户', '操作错误');
                }
            },

            selcustomers(){
                this.$f7router.navigate('/client/selectcustomers/',{props:{getcustomer:this.getcustomer}});
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

            selectapproval(pList) {

                let seft = this;

                seft.visit.executor = pList[0];
                this.$forceUpdate();
                $f7.popup.close('#appro-userselector')
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

            openPicker(ev,itemname,name) {
                let input = ev.target;
                if (name == 'department'&&input.picker){
                    input.picker.open();
                    return;
                }

                let self = this;

                let parant =    [{"id":"未完成","name":"未完成"},
                    {"id":"已完成","name":"已完成"},
                    {"id":"已失访","name":"已失访"}];


                // {"id":"年报","name":"年报"}
                console.log(parant);
                self.selectDatas.departments = [];
                self.selectDatas.departmentsDisplay = [];
                parant.forEach(function (val,index) {
                    self.selectDatas.departments.push(val.id);
                    self.selectDatas.departmentsDisplay.push(val.name);
                })

                let values = self.selectDatas.departments;

                let displayValues = self.selectDatas.departmentsDisplay

                input.picker = this.$f7.picker.create({
                    inputEl: '#' + name,
                    toolbarCloseText: '完成',
                    rotateEffect: true,
                    cols: [
                        {
                            textAlign: 'center',
                            displayValues:displayValues,
                            values: values
                        }],
                    on: {
                        close:function (picker) {

                            self.visit.status = picker.value[0];
                        }
                    }
                });
                input.picker.open();
            },

            save() {

                let op =  axios.get;
                let path = 'api/visit/searcher?q=';
                console.log(JSON.stringify(this.visit));

                if (this.visit.createdAt == ""){

                    delete(this.visit['createdAt']);
                }
                if (this.visit.finishedAt == ""){

                    delete(this.visit['finishedAt']);
                }

                $preloader.show();
                op(path + JSON.stringify(this.visit)).then(resp => {

                    $preloader.hide();
                    this.$f7router.navigate('/client/visitseacherresult/',{props:{visitRecords:resp.data}});
                }).catch(error => {
                    $preloader.hide();
                    console.error(error);
                    $alert('无法更新数据，请稍后再试', '操作错误');
                })
            }

        },

    }
</script>

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
        padding-left: 15px;
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
        margin-bottom: 50px;
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
        font-size: 18px;
        z-index: 99;
        font-size: 16px;
    }

</style>
