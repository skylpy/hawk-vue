<template>
    <f7-page style="background: #f8f8f8" no-toolbar>
        <f7-navbar title="用车申请" back-link>
        </f7-navbar>

        <div>
            <div class="list-item clear-float textarea-item">
                <span class="item-icon">*</span>
                <label>用车事由</label>
                <textarea  placeholder="请输入"
                           :value="formData.result"
                           @input="formData.result = $event.target.value">
                </textarea>
            </div>

            <div class="list-item clear-float">
                <span class="item-icon">*</span>
                <label>开始时间：</label>
                <div style="float: right">
                    <date-picker v-model="formData.startTime" type="datetime"
                                 :editable="false"
                                 class="date-picker"
                                 width="150px"
                                 :confirm="true"
                                 :not-before="new Date()"
                                 :confirm-text="'确定'"
                                 placeholder="   请选择开始时间"
                                 :readonly="'disabled'"
                                 format="YYYY-MM-DD HH:mm" :minute-step="30"
                                 :first-day-of-week="1"></date-picker>
                </div>
            </div>

            <div class="list-item clear-float">
                <span class="item-icon">*</span>
                <label>结束时间：</label>
                <div style="float: right">
                    <date-picker v-model="formData.endTime" type="datetime"
                                 :editable="false"
                                 class="date-picker"
                                 width="150px"
                                 :confirm="true"
                                 :not-before="new Date()"
                                 :confirm-text="'确定'"
                                 placeholder="   请选择结束时间"
                                 :readonly="'disabled'"
                                 format="YYYY-MM-DD HH:mm" :minute-step="30"
                                 :first-day-of-week="1"></date-picker>
                </div>
            </div>

            <div class="list-item clear-float">
                <span class="item-icon">*</span>
                <label>用车时长：</label>
                <div style="float: right">
                    <input class="item-input"
                           type="text"
                           placeholder="请输入"
                           :value="formData.time"
                           @input="formData.time = $event.target.value" />
                </div>
            </div>

            <div class="list-item clear-float">
                <span class="item-icon">*</span>
                <label>用车目的地：</label>
                <div style="float: right">
                    <input class="item-input"
                           type="text"
                           placeholder="请输入"
                           :value="formData.address"
                           @input="formData.address = $event.target.value" />
                </div>
            </div>

            <div class="list-item"  @click="selectPicker" style="overflow: hidden">
                <span class="item-icon">*</span>
                <label>用车类型</label>
                <span style="float: right; margin-right: 15px;">{{formData.type || '请选择'}}</span>
            </div>

            <div class="list-item photo-item">
                <span class="item-icon">*</span>
                <label>审核人</label>

                <div class="clearfix">
                    <div class="item-selpon"  v-if="index < formData.approver.length-1" v-for="(item,index) in formData.approver">
                        <div class="item-person">
                            <div class="item-image">
                                <img :src="item && who(item).avatarUrl || hp_default_96" width="40px" height="40px">
                            </div>
                            <div class="delete-person" @click="deleteapprover(index)">
                                <img :src=btn_close_small_black width="13" height="13">
                            </div>

                            <span class="spanname">{{item == ""?"请选择":who(item).name }}</span>
                        </div>
                    </div>
                    <div class="item-selpon" @click="selectorPersonnelShow=true" v-else="index == formData.approver.length">
                        <div class="item-image">
                            <img :src=btn_add_people width="40px" height="40px">
                        </div>

                    </div>
                </div>
            </div>

            <div class="list-item photo-item">
                <span class="item-icon"></span>
                <label>抄送人</label>

                <div class="clearfix">
                    <div class="item-selpon"  v-if="index < formData.sendover.length-1" v-for="(item,index) in formData.sendover">
                        <div class="item-person">
                            <div class="item-image">
                                <img :src="item && who(item).avatarUrl || hp_default_96" width="40px" height="40px">
                            </div>
                            <div class="delete-person" @click="deletesendover(index)">
                                <img :src=btn_close_small_black width="13" height="13">
                            </div>

                            <span  class="spanname">{{item == ""? "请选择" : who(item).name }}</span>
                        </div>
                    </div>
                    <div class="item-selpon" @click="selectorSendoverShow=true" v-else="index == formData.sendover.length">
                        <div class="item-image">
                            <img :src=btn_add_people width="40px" height="40px">
                        </div>
                    </div>
                </div>
            </div>

            <f7-popup :opened="selectorPersonnelShow" @popup:closed="(selectorPersonnelShow = false)">
                <permissionselector
                        :isMultiple="false"
                        @employee:selected="onSelectorapprover"
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
import {mapGetters, mapMutations, mapActions} from 'vuex';
import axios from 'axios'
import DatePicker from 'vue2-datepicker'
import permissionselector from '../gadget/permissionselector.vue';

const hp_default_96 = require("assets/images/hp_default_96@2x.png");
const btn_add_people = require("assets/images/btn_add_people@2x.png");
const btn_close_small_black = require("assets/images/btn_close_small_black@2x.png");
export default {
    name: "carApply",
    components: {
        DatePicker,
        permissionselector
    },
    data () {
        return {
            hp_default_96,
            btn_add_people,
            btn_close_small_black,
            selectorPersonnelShow:false,
            selectorSendoverShow:false,
            formData: {
                result: '',
                startTime: '',
                endTime: '',
                time: '',
                address: '',
                type: '',
                types: ['车型一', '车型二', '车型三', '其他'],
                approver: [''],
                sendover: [''],
                status: '待审批'
            }
        }
    },
    computed: {
        ...mapGetters([
            'who',
            'myCompany',
            'myProfile',
            'departmentName'
        ]),
    },
    methods: {
        selectPicker() {
            let self = this
            const picker = this.$f7.picker.create({
                inputEl: '#picker-expense',
                toolbarCloseText: '完成',
                cols: [
                    {
                        textAlign: 'center',
                        values: this.formData.types,
                    }
                ],
                on: {
                    change: (picker, values, displayValues) => {
                        self.formData.type = values[0];
                    }
                }
            });
            picker.open();
        },
        onSelectorSendover(ulist){
            this.selectorSendoverShow = false;
            let sendover = [];
            ulist.forEach((id, index) => {
                if (ulist.indexOf(id) === index) {
                    sendover.push(id)
                }
            });
            this.formData.sendover = sendover;
            this.formData.sendover.push('');
            this.$forceUpdate();
        },

        onSelectorapprover(ulist){
            this.selectorPersonnelShow = false;
            this.formData.approver = ulist;
            this.formData.approver.push('');
            this.$forceUpdate();
        },

        deletesendover(index) {
            this.formData.sendover.splice(index,1)
        },

        deleteapprover() {
            this.formData.approver = ['']
        },

        submit () {
            let error = (text) => {
                $alert(text);
            };

            if (!this.formData.result.length) {
                error('请输入用车事由')
            }
            else if (!this.formData.startTime) {
                error('请选择开始时间')
            }
            else if (!this.formData.endTime) {
                error('请选择结束时间')
            }
            else if (!this.formData.time.length) {
                error('请输入用车时长')
            }
            else if (!this.formData.address.length) {
                error('请输入用车目的地')
            }
            else if (!this.formData.type.length) {
                error('请选择用车类型')
            }
            else if (this.formData.approver.length < 2) {
                error('请选择审核人')
            } else {
                let data = Object.assign({}, this.formData)
                data.approver = this.formData.approver[0]
                data.sendover.splice(data.sendover.length - 1, 1);
                axios.put('/api/car/', data).then(resp=>{
                    this.$f7router.back()
                }).catch(err => {
                    $alert('无法更新数据，请稍后再试', '操作错误');
                });
            }
        }
    },
    created() {
        axios.get('/api/car/type/').then(resp=>{
            if (resp.data && resp.data.type) {
                this.formData.types = resp.data.type
            }
        }).catch(err => {
            console.error(err);
        });
    }
}
</script>

<style lang="scss" scoped>
    .clear-float {
        clear:both;
        height: 0;
        line-height: 0;
        font-size: 0;
    }
    .textarea-item{
        height: 120px!important;
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

    .list-item .item-input{
        width: 150px;
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

    .photo-item{

        background: #FFFFFF;
        width: 100%;
        font-size: 14px;
        line-height: 30px;
        min-height: 90px!important;
        margin-bottom: 10px;
        padding-bottom: 10px;
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

    .delete-person{
        width: 10px;
        height: 10px;
        float: left;
        bottom: 45px;
        left: 33px;
        position: relative;
        display: inline-block;
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
</style>
