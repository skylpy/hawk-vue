<template>
    <f7-page>
        <f7-navbar :title="pageTitle">
            <f7-nav-right>
                <f7-link href="#" @click="cancel">取消</f7-link>
                <!--<f7-link href="#" @click="save">保存</f7-link>-->
            </f7-nav-right>
        </f7-navbar>

        <div class="content_layer">
            <div class="content" :style="{height: readonly ? '100%' : contact.name && superAdmin._id == myProfile._id ? 'calc(100% - 110px)' : 'calc(100% - 58px)'}" >
                <f7-block-title>联系人信息</f7-block-title>

                <f7-list inline-labels>
                    <f7-list-input
                            label="姓名"
                            maxlength = "8"
                            placeholder="请输入"
                            :readonly="readonly"
                            :value="contact.name"
                            @input="contact.name = $event.target.value"
                    >
                        <span v-if="!readonly" slot="label" style="color:red"> *</span>
                    </f7-list-input>
                    <f7-list-input
                            label="手机"
                            placeholder="请输入"
                            :readonly="readonly"
                            :value="contact.phone"
                            type="tel"
                            required
                            validate
                            pattern="^((1)[0-9]{1}\d{9})$"
                            error-message="请输入正确电话号码!"
                            @input="contact.phone = $event.target.value"
                            clear-button
                    >
                        <!-- [0-9]* -->
                        <span v-if="!readonly" slot="label" style="color:red"> *</span>
                    </f7-list-input>
                    <f7-list-input
                            label="主要联系人"
                            placeholder="请输入"
                            :readonly="readonly"
                            :input="false"
                    >
                        <div slot="input">
                            <span style="line-height: 32px">{{contact.major ? '是':'否'}}</span>
                            <f7-toggle v-if="!readonly" color="blue" style="float:right"
                                       @toggle:change="contact.major = !contact.major"
                            ></f7-toggle>
                        </div>
                    </f7-list-input>
                    <f7-list-input
                            label="性别"
                            placeholder="请输入"
                            :readonly="readonly"
                            :input="false"
                    >
                        <div slot="input">
                            <span style="line-height: 32px">{{contact.gender}}</span>
                            <f7-toggle v-if="!readonly" checked color="blue" style="float:right"
                                       @toggle:change="contact.gender = ({'男':'女', '女':'男'}[contact.gender])"
                            ></f7-toggle>
                        </div>
                    </f7-list-input>
                    <f7-list-input
                            label="部门"
                            maxlength = "20"
                            :readonly="readonly"
                            :value="contact.department"
                            @input="contact.department = $event.target.value"
                    >
                    </f7-list-input>
                    <f7-list-input
                            label="职务"
                            maxlength = "20"
                            :readonly="readonly"
                            :value="contact.title"
                            @input="contact.title = $event.target.value"
                    >
                    </f7-list-input>
                    <f7-list-input
                            label="电子邮箱"
                            :readonly="readonly"
                            :value="contact.email"
                            @input="contact.email = $event.target.value"
                    >
                    </f7-list-input>
                    <f7-list-input
                            label="微信号"
                            :readonly="readonly"
                            :value="contact.wechat"
                            @input="contact.wechat = $event.target.value"
                    >
                    </f7-list-input>
                    <f7-list-input
                            label="QQ号码"
                            :readonly="readonly"
                            :value="contact.qq"
                            @input="contact.qq = $event.target.value"
                    >
                    </f7-list-input>
                    <f7-list-input
                            label="电话"
                            :readonly="readonly"
                            :value="contact.tel"
                            @input="contact.tel = $event.target.value"
                    >
                    </f7-list-input>
                    <f7-list-input
                            label="传真"
                            :readonly="readonly"
                            :value="contact.fax"
                            @input="contact.fax = $event.target.value"
                    >
                    </f7-list-input>
                    <f7-list-input
                            input-id="contact-birthday"
                            label="生日"

                            @focus="openDatePicker"
                            :readonly="readonly"
                            :value = "contact.birthday"
                            @input="contact.birthday = $event.target.value"
                    >
                    </f7-list-input>
                    <f7-list-input
                            label="备注"
                            type="textarea"
                            :readonly="readonly"
                            :value="contact.notes"
                            @input="contact.notes = $event.target.value"
                    >
                    </f7-list-input>
                </f7-list>
            </div>


            <div v-if="!readonly&&contact.name && superAdmin._id == myProfile._id" class="bt_delete">
                <div @click="remove">删除该客户</div>
            </div>
            <p></p>
            <div v-if="!readonly" class="bt_save">
                <div @click="save">保存</div>
            </div>
        </div>
    </f7-page>
</template>
<style scoped>
    .bt_save{
        height: 45px;
        width: 100%;
    }
    .bt_save>div{
        width: 100%;
        height: 45px;
        background-color: #01b38b;
        font-size: 16px;
        color: white;
        text-align: center;
        line-height: 45px;
    }
    .bt_delete{
        height: 45px;
        width: 100%;
    }
    .bt_delete>div{
        width: 100%;
        height: 45px;
        background-color: white;
        font-size: 16px;
        color: #FF715A;
        text-align: center;
        line-height: 45px;
        margin: 10px 0px;
    }

    .content_layer {
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
    .content {
        overflow: auto;
        -webkit-overflow-scrolling: touch;
        box-sizing: border-box;
        position: relative;
        z-index: 1;
    }
</style>
<script>
import {mapGetters, mapActions} from 'vuex';
import axios from 'axios';

export default {
    props: [
        'contacts',
        'readonly'
    ],

    data() {
        return {
            contact: {},
            contactsIndex: -1
        }
    },

    computed: {
        ...mapGetters([
            'myProfile',
            'superAdmin'
        ]),
        pageTitle() {
            if(this.readonly){
                return '查看联系人'
            } else if(this.contactsIndex >= 0){
                return '编辑联系人'
            } else {
                return '新建联系人'
            }
        }
    },

    mounted() {

    },

    methods: {
        init(index, ocr) {
            this.contactsIndex = -1;
            if (typeof index == 'number') {
                this.contactsIndex = index;
            }

            if (this.contactsIndex >= 0) {
                this.contact = Object.assign({}, this.contacts[this.contactsIndex]);
            } else {
                this.contact = {
                    name: '',
                    phone: '',
                    major: false,
                    gender: '男',
                    department: '',
                    title: '',
                    wechat: '',
                    qq: '',
                    tel: '',
                    fax: '',
                    birthday: '',
                    notes: ''
                }
            }
            this.initOCR(ocr)
            this.$forceUpdate()
        },
        initOCR(ocr){
            if (!ocr) return
            if(!this.contact.name && ocr.name) this.contact.name = ocr.name
            if(!this.contact.phone && ocr.tel_cell.length) this.contact.phone = ocr.tel_cell[0]
            if(!this.contact.tel && ocr.tel_work.length) this.contact.tel = ocr.tel_work[0]
            if(!this.contact.email && ocr.email) this.contact.email = ocr.email
            if(!this.contact.department && ocr.department.length) this.contact.department = ocr.department[0]
            if(!this.contact.title && ocr.title.length) this.contact.title = ocr.title[0]
        },
        openDatePicker() {
            var input = document.getElementById("contact-birthday");
            input.blur();
            if (!this.datepicker) {
                this.datepicker = $calendar.create({
                    inputEl: '#contact-birthday',
                    yearSelector: false,
                    closeOnSelect: true
                });
            }
            this.datepicker.open();
        },

        cancel() {

            this.$emit('contact:done');
        },

        save() {
            let errors = {
                "name": '姓名不能为空',
                "phone": '电话号码不能为空'
            };
            let error_msg = '';

            Object.keys(errors).forEach(k => {

                if (!this.contact[k]) error_msg = errors[k];
            });

            if (error_msg) {
                $alert(error_msg, '操作错误');
                return;
            }
            var reg= /^((13|14|15|17|18)[0-9]{1}\d{8})$/;

            let myphone = this.contact["phone"];
            if(myphone.length != 11 && !reg.test(myphone)){

                $alert("请输入正确的手机号码", '操作错误');
                return;
            }

            let contact = Object.assign({}, this.contact);

            if (this.contactsIndex >= 0) {
                this.contacts[this.contactsIndex] = contact;
            } else {
                this.contacts.push(contact);
            }
            this.$emit('contact:done');
        },

        remove() {
            if (this.contactsIndex >= 0) this.contacts.splice(this.contactsIndex, 1);
            this.$emit('contact:done');
        }
    }
}
</script>
