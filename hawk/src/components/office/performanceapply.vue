<template>
    <f7-page style="background: #f8f8f8" no-toolbar>
        <f7-navbar title="绩效报告" back-link>
        </f7-navbar>

        <div>
            <div class="list-item clear-float textarea-item">
                <span class="item-icon">*</span>
                <label>上月工作内容</label>
                <textarea  placeholder="请输入"
                           :value="formData.lastContent"
                           @input="formData.lastContent = $event.target.value">
                </textarea>
            </div>

            <div class="list-item clear-float textarea-item">
                <span class="item-icon">*</span>
                <label>上月完成情况</label>
                <textarea  placeholder="请输入"
                           :value="formData.lastSchedule"
                           @input="formData.lastSchedule = $event.target.value">
                </textarea>
            </div>

            <div class="list-item clear-float">
                <span class="item-icon">*</span>
                <label>完成率：</label>
                <div style="float: right">
                    <input class="item-input"
                           placeholder="请输入"
                           :value="formData.finishing"
                           @input="formData.finishing = $event.target.value"
                           validate
                           type="tel"
                           pattern = "[0-9]$" />
                </div>
            </div>

            <div class="list-item clear-float textarea-item">
                <span class="item-icon">*</span>
                <label>上月工作自评</label>
                <textarea  placeholder="请输入"
                           :value="formData.selfAssessment"
                           @input="formData.selfAssessment = $event.target.value">
                </textarea>
            </div>

            <div class="list-item clear-float textarea-item">
                <span class="item-icon">*</span>
                <label>本月工作目标</label>
                <textarea  placeholder="请输入"
                           :value="formData.content"
                           @input="formData.content = $event.target.value">
                </textarea>
            </div>

            <div class="list-item clear-float textarea-item">
                <span class="item-icon">*</span>
                <label>本月工作计划</label>
                <textarea  placeholder="请输入"
                           :value="formData.plan"
                           @input="formData.plan = $event.target.value">
                </textarea>
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
    import photoeditor from '../gadget/photoeditor.vue';

    const hp_default_96 = require("assets/images/hp_default_96@2x.png");
    const btn_add_people = require("assets/images/btn_add_people@2x.png");
    const btn_close_small_black = require("assets/images/btn_close_small_black@2x.png");
    export default {
        name: "carApply",
        components: {
            DatePicker,
            permissionselector,
            photoeditor
        },
        data () {
            return {
                hp_default_96,
                btn_add_people,
                btn_close_small_black,
                selectorPersonnelShow:false,
                selectorSendoverShow:false,
                formData: {
                    lastContent: '',
                    lastSchedule: '',
                    finishing: '',
                    selfAssessment: '',
                    content: '',
                    plan: '',
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
                if (!this.formData.lastContent.length) {
                    error('请输入上月工作内容')
                }
                else if (!this.formData.lastSchedule.length) {
                    error('请输入上月完成情况')
                }
                else if (!/[0-9]$/.test(this.formData.finishing)) {
                    error('请输入完成率，只能输入数字')
                }
                else if (!this.formData.selfAssessment.length) {
                    error('请输入上月工作自评')
                }
                else if (!this.formData.content.length) {
                    error('请输入本月工作目标')
                }
                else if (!this.formData.plan.length) {
                    error('请输入本月工作计划')
                }
                else if (this.formData.approver.length < 2) {
                    error('请选择审核人')
                } else {
                    let data = Object.assign({}, this.formData)
                    data.approver = this.formData.approver[0]
                    data.sendover.splice(data.sendover.length - 1, 1);
                    axios.put('/api/performance/', data).then(resp=>{
                        this.$f7router.back()
                    }).catch(err => {
                        console.error(err);
                        $alert('无法更新数据，请稍后再试', '操作错误');
                    });
                }
            }
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
