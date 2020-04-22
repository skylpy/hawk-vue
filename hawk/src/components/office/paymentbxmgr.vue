<template>
    <f7-page style="background: #f8f8f8" no-toolbar>
        <f7-navbar title="付款申请" back-link>

        </f7-navbar>

        <div>
            <ul class="form-list">
                <li class="list-item clear-float textarea-item" type="text">
                    <span class="item-icon">*</span>
                    <label>付款事由</label>
                    <textarea  placeholder="请输入付款事由"
                               :value="payment.result"
                               @input="payment.result = $event.target.value">
                    </textarea>
                </li>

                <f7-list-input
                        class="list-item task-money-input"
                        placeholder="请输入数字"
                        :value="payment.allmoney"
                        @input="payment.allmoney = $event.target.value"
                        validate
                        type="tel"
                        pattern = "^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$"
                        error-message = "请输入正确数字">
                    <div slot="label" class="hawk-input-label">
                        <span class="item-icon">*</span>
                        <label>付款金额(元)</label>
                    </div>
                </f7-list-input>

                <li class="list-item"  @click="selectPicker" style="overflow: hidden">
                    <span class="item-icon">*</span>
                    <label>付款方式</label>
                    <span style="float: right; margin-right: 15px;">{{payment.types || '请选择'}}</span>
                </li>

                <li class="list-item" style="height: 48px; background: #fff">
                    <div style="line-height: 48px; float: left;">
                        <span class="item-icon">*</span>
                        <label>付款日期</label>
                    </div>
                    <div style="float: right">
                        <date-picker v-model="payment.time " type="date"
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
                </li>

                <f7-list-input
                        class="list-item task-money-input"
                        placeholder="请输入"
                        :value="payment.payee"
                        @input="payment.payee = $event.target.value"
                        style="background: #fff">
                    <div slot="label" class="hawk-input-label">
                        <span class="item-icon">*</span>
                        <label>收款人全称</label>
                    </div>
                </f7-list-input>

                <f7-list-input
                        class="list-item task-money-input"
                        placeholder="请输入"
                        :value="payment.blank"
                        @input="payment.blank = $event.target.value"
                        style="background: #fff">
                    <div slot="label" class="hawk-input-label">
                        <span class="item-icon">*</span>
                        <label>银行账户</label>
                    </div>
                </f7-list-input>

                <f7-list-input
                        class="list-item task-money-input"
                        placeholder="请输入"
                        :value="payment.openingBank"
                        @input="payment.openingBank = $event.target.value"
                        style="background: #fff">
                    <div slot="label" class="hawk-input-label">
                        <span class="item-icon">*</span>
                        <label>开户行</label>
                    </div>
                </f7-list-input>

                <li class="list-item clear-float textarea-item" type="text">
                    <span class="item-icon"></span>
                    <label>备注说明</label>
                    <textarea  placeholder="请输入"
                               :value="payment.des"
                               @input="payment.des = $event.target.value">
                    </textarea>
                </li>
            </ul>

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
                    <div class="item-selpon" v-for="(item,index) in payment.approver" v-if="index < payment.approver.length-1">
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
                    <div class="item-selpon" @click="selectorPersonnelShow=true" v-else="index == payment.approver.length">
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
                    <div class="item-selpon"  v-if="index < payment.sendover.length-1" v-for="(item,index) in payment.sendover">
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
                    <div class="item-selpon" @click="selectorSendoverShow=true" v-else="index == payment.sendover.length">
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
            payment: {
                result: '',
                allmoney: '',
                types: '',
                time: '',
                payee: '',
                blank: '',
                openingBank: '',
                des: '',
                photo: [],
                approver:[{
                    uid:"",
                    status:"待审核",
                    coment:""
                }],
                sendover:[""],
            },
            photo: [], //'211d80f9d982ba1f.1550133752444.jpeg'

            selectorPersonnelShow:false,
            selectorSendoverShow:false,

            isClick:true,

            hp_default_96:hp_default_96,
            btn_add_people:btn_add_people,
            arrow_right_gray:arrow_right_gray,
            btn_close_small_black:btn_close_small_black,
            arrow_process_right_gray:arrow_process_right_gray,
            typeList: ['银行卡', '现金', '汇票', '电汇', '贷记', '支票', '其他']
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
    },

    watch: {
        photo: function() {
            this.photo.forEach((p, index) => {
                this.payment.photo[index] = defaultImgUrl;

                let url = p.substr(0, 4) == 'http' ? p.match(/aliyuncs.com\/(\S*)\?OSSAccessKeyId/)[1] : p
                getSignUrl(url, (ret) => {
                    if (ret instanceof Error) {
                        this.payment.photo[index] = '#';
                    } else {
                        this.payment.photo[index] = ret;
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

            this.payment.approver = approver;
            let dic1 = {uid: "",status: "待审批",coment: "",createtime:""};
            this.payment.approver.push(dic1)
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

            this.payment.sendover = sendover;

            this.payment.sendover.push("");

            this.$forceUpdate();
        },

        deleteperson(index){
            this.payment.approver.splice(index,1)
        },

        deletesendover(index) {
            this.payment.sendover.splice(index,1)
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

            if (!this.payment.result.length ) {
                error('请输入付款事由');
            }
            else if (!this.payment.allmoney.length) {
                error('请输入付款金额');
            }
            else if (!this.payment.types.length) {
                error('请选择付款方式');
            }
            else if (!this.payment.time) {
                error('请选择交付日期');
            }
            else if (!this.payment.payee.length) {
                error('请输入付款人全称');
            }
            else if (!this.payment.blank.length) {
                error('请输入银行账户');
            }
            else if (!this.payment.openingBank) {
                error('请输入开户行');
            }
            else if (this.photo.length == 0) {
                error('请上传图片');
            }
            else if (this.payment.approver.length == 1) {
                error('请选择审批人');
            }
            if (isCanSubmit) {
                this.payment.approver.splice(this.payment.approver.length-1,1);
                this.payment.sendover.splice(this.payment.sendover.length-1,1);
                // console.log(this.payment);
                this.save(this.payment);
            }
        },

        save(entry) {
            if (!entry.status || entry.status == '待审批') {
                this.busy();

                axios.post('api/paymentmgr', entry).then(resp => {
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
        },

        selectPicker() {
            let self = this
            const picker = this.$f7.picker.create({
                inputEl: '#picker-payment',
                toolbarCloseText: '完成',
                cols: [
                    {
                        textAlign: 'center',
                        values: this.typeList,
                    }
                ],
                on: {
                    change: (picker, values, displayValues) => {
                        self.payment.types = values[0];
                    }
                }
            });
            picker.open();
        }
    },
    created() {
        axios.get('/api/paymentset/').then(resp=>{
            console.log(resp.data)
            if (resp.data && resp.data.type) {
                this.typeList = resp.data.type
            }
        }).catch(err => {
            console.error(err);
        });
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
