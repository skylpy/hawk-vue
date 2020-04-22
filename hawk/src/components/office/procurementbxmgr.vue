<template>
    <f7-page style="background: #f8f8f8" no-toolbar>
        <f7-navbar title="采购申请" back-link></f7-navbar>

        <div>
            <f7-list-input
                    class="list-item task-money-input"
                    placeholder="请输入"
                    :value="procurement.result"
                    @input="procurement.result = $event.target.value"
                    style="background: #fff">
                <div slot="label" class="hawk-input-label">
                    <span class="item-icon">*</span>
                    <label>申请事由</label>
                </div>
            </f7-list-input>

            <div class="list-item" style="height: 48px; background: #fff">
                <div style="line-height: 48px; float: left;">
                    <span class="item-icon">*</span>
                    <label>期望交付日期</label>
                </div>
                <div style="float: right">
                    <date-picker v-model="procurement.time " type="date"
                                 :editable="false"
                                 class="date-picker"
                                 width="150px"
                                 :confirm="true"
                                 :not-before="new Date()"
                                 :confirm-text="'确定'"
                                 placeholder="   请选择交付日期"
                                 :readonly="'disabled'"
                                 format="YYYY-MM-DD" :minute-step="30"
                                 :first-day-of-week="1"></date-picker>
                </div>
            </div>

            <ul class="form-list" v-for="(item,index) in procurement.schedule" :key="index">
                <div  class="list-title">
                    <span>采购明细({{index+1}})</span>
                    <span class="list-del" @click="delItem(index)" v-if="procurement.schedule.length>1">删除</span>
                </div>
                <f7-list-input
                        class="list-item task-money-input"
                        placeholder="请输入"
                        :value="item.name"
                        @input="item.name = $event.target.value">
                    <div slot="label" class="hawk-input-label">
                        <span class="item-icon">*</span>
                        <label>物品名称</label>
                    </div>
                </f7-list-input>

                <f7-list-input
                        class="list-item task-money-input"
                        placeholder="请输入"
                        :value="item.type"
                        @input="item.type = $event.target.value">
                    <div slot="label" class="hawk-input-label">
                        <span class="item-icon">*</span>
                        <label>型号或规格</label>
                    </div>
                </f7-list-input>

                <f7-list-input
                        class="list-item task-money-input"
                        placeholder="请输入数字"
                        :value="item.number"
                        @input="item.number = $event.target.value"
                        validate
                        type="tel"
                        pattern = "^([1-9][0-9]*)$"
                        error-message = "请输入正确数字">
                    <div slot="label" class="hawk-input-label">
                        <span class="item-icon">*</span>
                        <label>数量</label>
                    </div>
                </f7-list-input>

                <f7-list-input
                        class="list-item task-money-input"
                        placeholder="请输入数字"
                        :value="item.money"
                        @input="item.money = $event.target.value"
                        validate
                        type="tel"
                        pattern = "^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$"
                        error-message = "请输入正确数字">
                    <div slot="label" class="hawk-input-label">
                        <span class="item-icon">*</span>
                        <label>金额(元)</label>
                    </div>
                </f7-list-input>

                <li class="list-item clear-float textarea-item" type="text">
                    <span class="item-icon"></span>
                    <label>备注</label>
                    <textarea  placeholder="请输入备注"
                               :value="item.des"
                               @input="item.des = $event.target.value">

                    </textarea>
                </li>

            </ul>

            <div class="list-add" @click="addItem">
                <span>+ 增加采购明细</span>
            </div>

            <div class="list-title"><span>总采购金额(元)：{{this.allprice}}</span></div>

            <li class="list-item photo-item">
                <span class="item-icon">*</span>
                <label>图片</label>
                <photoeditor
                        slot="inner"
                        :gallery="true"
                        :photo="photo"
                        @photo:update="(imgList) => {photo = imgList}"
                ></photoeditor>
            </li>


            <li class="list-item photo-item" @click="">
                <span class="item-icon">*</span>
                <label>审批人</label>
                <div class="clearfix">
                    <div class="item-selpon" v-for="(item,index) in procurement.approver" v-if="index < procurement.approver.length-1">
                        <div class="item-person">

                            <div class="item-image">

                                <img :src="item.uid && who(item.uid).avatarUrl || hp_default_96" width="40px" height="40px" style="float: left">

                            </div>
                            <div class="delete-person" @click="deleteperson(index)">
                                <img :src=btn_close_small_black width="13" height="13">
                            </div>

                            <span class="spanname">{{item.uid.length > 0 ? who(item.uid).name:"请选择"}}</span>
                        </div>

                        <div class="item-person">
                            <!--<img :src=arrow_process_right_gray style="position: relative; width: 13px;height: 13px;top: 5px;left: 10px">-->
                        </div>

                    </div>
                    <div class="item-selpon" @click="selectorPersonnelShow=true" v-else="index == procurement.approver.length">
                        <div class="item-image">
                            <img :src=btn_add_people width="40px" height="40px">
                        </div>

                    </div>
                </div>

            </li>

            <li class="list-item photo-item">
                <span class="item-icon"></span>
                <label>抄送人</label>

                <div class="clearfix">
                    <div class="item-selpon"  v-if="index < procurement.sendover.length-1" v-for="(item,index) in procurement.sendover">
                        <div class="item-person">
                            <div class="item-image">
                                    <img :src="item && who(item).avatarUrl || hp_default_96" width="40px" height="40px">
                            </div>
                            <div class="delete-person" @click="deletesendover(index)">
                                <img :src=btn_close_small_black width="13" height="13">
                            </div>

                            <span class="spanname">{{item == ""?"请选择":who(item).name }}</span>
                        </div>
                    </div>
                    <div class="item-selpon" @click="selectorSendoverShow=true" v-else="index == procurement.sendover.length">
                        <div class="item-image">
                            <img :src=btn_add_people width="40px" height="40px">
                        </div>

                    </div>
                </div>
            </li>

            <f7-popup :opened="selectorPersonnelShow" @popup:closed="(selectorPersonnelShow = false)">
                <permissionselector
                        :isMultiple="false"
                        @employee:selected="onSelectorPersonne"
                        @employee:cancel="selectorPersonnelShow = false"
                ></permissionselector>
            </f7-popup>

            <f7-popup :opened="selectorSendoverShow" @popup:closed="(selectorSendoverShow = false)">
                <permissionselector
                        @employee:selected="onSelectorSendover"
                        @employee:cancel="selectorSendoverShow = false"
                ></permissionselector>
            </f7-popup>

            <div class="submit-button" @click="submit">提交</div>

        </div>

    </f7-page>
</template>

<script>
import {mapGetters,mapMutations,mapActions} from 'vuex';
import personnelselector from '../gadget/personnelselector.vue';
import photoeditor from '../gadget/photoeditor.vue';
import {upload, getSignUrl} from 'lib/aliyun';
import {defaultImgUrl} from 'lib/loading';
import managerselector from '../gadget/managerselector.vue';
import permissionselector from '../gadget/permissionselector.vue';
import axios from 'axios';
import DatePicker from 'vue2-datepicker'

const hp_default_96 = require("assets/images/hp_default_96@2x.png");
const btn_add_people = require("assets/images/btn_add_people@2x.png");
const arrow_process_right_gray = require("assets/images/arrow_process_right_gray@2x.png");
const btn_close_small_black = require("assets/images/btn_close_small_black@2x.png");
const arrow_right_gray = require("assets/images/arrow_right_gray@2x.png");

export default {

    components: {
        personnelselector,
        permissionselector,
        managerselector,
        photoeditor,
        DatePicker
    },

    props: [
        'lastPage'
    ],

    data: () => {
        return {

            procurement: {
                result: '',
                time: '',
                schedule: [{
                    name: '',
                    type: '',
                    money: '',
                    number: '',
                    des: ''
                }],
                photo: [],
                approver:[{
                    uid:"",
                    status:"待审核",
                    coment:""
                }],
                sendover:[""],
                allmoney:0,
            },
            photo: [], //'211d80f9d982ba1f.1550133752444.jpeg'

            selectorPersonnelShow:false,
            selectorSendoverShow:false,

            isClick:true,

            hp_default_96:hp_default_96,
            btn_add_people:btn_add_people,
            arrow_right_gray:arrow_right_gray,
            btn_close_small_black:btn_close_small_black,
            arrow_process_right_gray:arrow_process_right_gray
        }
    },

    //监听值改变
    computed:{

        ...mapGetters([

            'who',
            'IamAdmin',
            'IamManager',
            'myCompany',
            'myProfile',
            'departmentName'
        ]),

        allprice(){
            let f = 0;
            for (let key in this.procurement.schedule ){
                let item = this.procurement.schedule[key]
                f += parseFloat(item.money) || 0
            }
            this.procurement.allmoney = f;
            return f;
        }
    },

    watch: {
        photo: function() {
            this.photo.forEach((p, index) => {
                this.procurement.photo[index] = defaultImgUrl;

                let url = p.substr(0, 4) == 'http' ? p.match(/aliyuncs.com\/(\S*)\?OSSAccessKeyId/)[1] : p
                getSignUrl(url, (ret) => {
                    if (ret instanceof Error) {
                        this.procurement.photo[index] = '#';
                    } else {
                        this.procurement.photo[index] = ret;
                    }
                });
            })
        }
    },

    methods: {

        onSelectorPersonne(ulist){

            this.selectorPersonnelShow = false;

            let approver = [];
            ulist.forEach((uIds, index) => {
                if (ulist.indexOf(uIds) === index) {
                    let dic = {uid: uIds.toString(),status: "待审批",coment: "",createtime:""};
                    approver.push(dic)
                }
            });

            this.procurement.approver = approver;
            let dic1 = {uid: "",status: "待审批",coment: "",createtime:""};
            this.procurement.approver.push(dic1)
            this.$forceUpdate();
        },

        onSelectorSendover(ulist){

            this.selectorSendoverShow = false;
            let sendover = [];
            ulist.forEach((id, index) => {
                if (ulist.indexOf(id) === index) {
                    sendover.push(id)
                }
            });

            this.procurement.sendover = sendover;

            this.procurement.sendover.push("");

            this.$forceUpdate();
        },

        deleteperson(index){
            this.procurement.approver.splice(index,1)
        },

        deletesendover(index) {
            this.procurement.sendover.splice(index,1)
        },

        addItem(){

            this.procurement.schedule.push({
                name: '',
                type: '',
                money: '',
                number: '',
                des: ''
            });
        },

        delItem(index){

            this.procurement.schedule.splice(index, 1);
        },

        submit() {

            if (!this.isClick){

                return;
            }
            this.isClick = false;
            let isCanSubmit = true;
            let error = (text) => {
                isCanSubmit = false;
                $alert(text);
                this.isClick = true;
            };

            this.procurement.schedule.map(v => {
                if (!/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(v.money) ||
                    !v.name ||
                    !v.type ||
                    !/^[1-9][0-9]*$/.test(v.number)) {
                    error('请检查,按要求输入采购明细');
                }
            });
            if (isCanSubmit) {
                console.log(this.photo.length)
                if (this.photo.length == 0) {
                    error('请上传图片');
                }
                else if (this.procurement.approver.length == 1) {
                    error('请选择审批人');
                }
                else if (!this.procurement.result) {
                    error('请选择输入申请事由');
                }
                else if (!this.procurement.time) {
                    error('请选择期望交付日期');
                }
            }
            if (isCanSubmit) {
                this.procurement.approver.splice(this.procurement.approver.length-1,1);
                this.procurement.sendover.splice(this.procurement.sendover.length-1,1);
                // console.log(this.procurement);
                this.save(this.procurement);
            }
        },

        save(entry) {
            if (!entry.status || entry.status == '待审批') {
                this.busy();

                axios.post('api/procurement', entry).then(resp => {
                    // this.isClick = true;
                    this.nobusy('提交成功，请等待审批', '操作成功', () => {
                        this.$f7router.back();
                    });
                }).catch(error => {
                    console.error(error);
                    this.nobusy('提交失败，请稍后再试', '操作失败');
                })
            }
        },

        busy() {
            $preloader.show();
        },

        nobusy(s, t, cb) {
            $preloader.hide();
            if (s) {
                this.alert(s, t, cb);
            }
        },

        alert(s, t, cb) {
            $alert(s, t, cb);
        }
    }
}


</script>

<style scoped>

    body,div,ul,li,input,label,form,a,p,textarea{
        margin: 0;
        padding: 0;
    }
    ol,ul,li{
        list-style: none;
        background-color:#F8F8F8 ;
    }
    .clearfix:after{content:"";display:block;clear:both;}
    .clearfix{zoom:1;}
    .clear-float {
        clear:both;
        height: 0;
        line-height: 0;
        font-size: 0;
    }
    .form-list{
        margin-bottom: 0px;
    }
    .form-list .list-item{
        background: #FFFFFF;
        width: 100%;
        height: 46px;
        font-size: 14px;
        line-height: 46px;
        border-bottom: 1px solid #f8f8f8;

    }


    .item-selpon{
        width: 60px;
        height: 60px;
        margin-top: 5px;
        margin-left: 20px;
        float: left;

    }
    .item-selpon .item-image{

        width: 40px;
        margin: 0 auto;
        height: 40px;
        background-color: gainsboro;
        float: top;
        border-radius:20px;
        overflow: hidden;
    }
    .item-selpon span{
        display: block;
        font-size: 12px;
        text-align: center;
    }

    .list-add {

        width: 100%;
        line-height: 35px;
        font-size: 14px;
        background: #FFFFFF;
        text-align: center;
        color: #2196F3;
        /*border-top: 1px solid #E4E4E4;*/
    }
    .list-title {
        margin:10px;
        line-height: 20px;
        font-size: 16px;
        color: darkgray;
    }

    .list-del {

        line-height: 15px;
        font-size: 12px;
        color: blue;
        float: right;
        display: inline-block;
    }

    .list-dev {

        background: white;
        line-height: 45px;
        font-size: 14px;
        margin-top: 10px;
        margin-bottom: 10px;
    }

    .list-dev label{

        width: 40%;

    }

    .list-dev div{
        display: inline-block;
        width: 50%;
        text-align: right;
        float: right;
        margin-right: 10px;
        color: darkgray;
    }

    .ist-dev img{
        vertical-align: top;
    }


    .list-item .item-icon{
        display: inline-block;
        color: red;
        width: 18px;
        text-align: right;
    }

    .textarea-item{
        height: 130px!important;
    }
    .photo-item{

        background: #FFFFFF;
        width: 100%;
        font-size: 14px;
        line-height: 30px;
        min-height: 90px!important;
        margin-bottom: 10px;
        padding-bottom: 10px;
    }


    .form-list .list-item label{
        width: 40%;

    }

    .form-list .list-item .item-input{
        width: 50%;
        background:none;
        outline:none;
        border:0px;
        float: right;
        text-align: right;
        font-size: 14px;
        line-height: 46px;
        padding-right: 15px;
        box-sizing: border-box;
        color: #333;
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

    .submit-button{
        float: left;
        bottom: -44px;
        width:100%;
        height:45px;
        line-height: 45px;
        font-size:16px;
        color: #FFFFFF;
        text-align: center;
        background:rgba(1,179,139,1);
        margin-top: 50px;
    }

    .item-person{
        float: left;
    }

    .delete-person{

        width: 10px;
        height: 10px;
        float: left;
        bottom: 45px;
        left: 33px;
        position: relative;
        display: inline-block;
    }

    .spanname{
        display: inline-block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 30px;
        line-height: 20px;
        /*background: red;*/
        position: relative;
        right: 5px;
    }

    .date-picker{
        float: right;
        margin-top: 6px;
        text-align: right;
        color: #333333!important;
    }
</style>

<style lang="scss">
    .task-money-input .item-input .item-inner {
        display: flex;
        width: 100%;
        height: 100%;

        .hawk-input-label {
            font-size: 14px;
            line-height: 46px;
            color: #333;
        }

        .item-input-wrap {
            margin-bottom: 0;
            text-align: right;

            input {
                text-align: right;
                font-size: 14px;
                line-height: 46px;
                padding-right: 15px;
                box-sizing: border-box;
            }
        }
    }
</style>
