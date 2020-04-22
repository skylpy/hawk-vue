<template>
    <f7-page style="background: #f8f8f8" no-toolbar>
        <f7-navbar title="合同审批" back-link>
        </f7-navbar>

        <div>
            <div class="list-item clear-float">
                <span class="item-icon">*</span>
                <label>合同名称：</label>
                <div style="float: right">
                    <input class="item-input"
                           type="text"
                           placeholder="请输入"
                           :value="formData.contract"
                           @input="formData.contract = $event.target.value" />
                </div>
            </div>

            <div class="list-item clear-float">
                <span class="item-icon">*</span>
                <label>合同编号：</label>
                <div style="float: right">
                    <input class="item-input"
                           type="text"
                           placeholder="请输入"
                           :value="formData.contractNo"
                           @input="formData.contractNo = $event.target.value" />
                </div>
            </div>

            <div class="list-item clear-float">
                <span class="item-icon">*</span>
                <label>签约日期：</label>
                <div style="float: right">
                    <date-picker v-model="formData.time" type="date"
                                 :editable="false"
                                 class="date-picker"
                                 width="150px"
                                 :confirm="true"
                                 :not-before="new Date()"
                                 :confirm-text="'确定'"
                                 placeholder="   请选择签约日期"
                                 :readonly="'disabled'"
                                 format="YYYY-MM-DD"
                                 :first-day-of-week="1"></date-picker>
                </div>
            </div>

            <div class="list-item clear-float">
                <span class="item-icon">*</span>
                <label>我方单位名称：</label>
                <div style="float: right">
                    <input class="item-input"
                           type="text"
                           placeholder="请输入"
                           :value="formData.myCompanyName"
                           @input="formData.myCompanyName = $event.target.value" />
                </div>
            </div>

            <div class="list-item clear-float">
                <span class="item-icon">*</span>
                <label>我方负责人：</label>
                <div style="float: right">
                    <input class="item-input"
                           type="text"
                           placeholder="请输入"
                           :value="formData.myUserName"
                           @input="formData.myUserName = $event.target.value" />
                </div>
            </div>

            <div class="list-item clear-float">
                <span class="item-icon">*</span>
                <label>对方单位名称：</label>
                <div style="float: right">
                    <input class="item-input"
                           type="text"
                           placeholder="请输入"
                           :value="formData.otherCompanyName"
                           @input="formData.otherCompanyName = $event.target.value" />
                </div>
            </div>

            <div class="list-item clear-float">
                <span class="item-icon">*</span>
                <label>对方负责人：</label>
                <div style="float: right">
                    <input class="item-input"
                           type="text"
                           placeholder="请输入"
                           :value="formData.otherUserName"
                           @input="formData.otherUserName = $event.target.value" />
                </div>
            </div>


            <div class="list-item photo-item">
                <span class="item-icon">*</span>
                <label>附件：</label>
                <div class="clearfix" style="padding-left: 20px">
                    <div class="item-selpon" v-for="(v, i) in formData.files" style="margin-left: 0">
                        <div class="item-person">
                            <div class="item-image1" @click="preview(v)">
                                <img  :src="file_icon(v)" width="60px" height="60px">
                            </div>
                            <div class="delete-person" @click="deleteFile(i)" style="bottom: 57px">
                                <img :src=btn_close_small_black width="13" height="13">
                            </div>
                        </div>
                    </div>
                    <div class="item-selpon" @click="upload" style="margin-left: 0">
                        <div class="item-image">
                            <img :src=btn_add_people width="40px" height="40px">
                        </div>

                    </div>
                </div>
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

            <f7-popup id="files-preview-doc">
                <f7-navbar>
                    <f7-nav-left>
                        <f7-link icon-only @click="$f7.popup.close('#files-preview-doc')">
                            <i class="icon icon-back"></i>
                        </f7-link>
                    </f7-nav-left>
                    <f7-nav-title>文件预览</f7-nav-title>
                </f7-navbar>

                <iframe
                        width="100%"
                        height="100%"
                        allowfullscreen
                        id="aliyunPreview"
                        frameborder="0"
                        :src="preview_url"
                ></iframe>
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
import {selectAndUpload, getSignUrl, getPreviewUrl} from 'lib/aliyun.js';

const hp_default_96 = require("assets/images/hp_default_96@2x.png");
const btn_add_people = require("assets/images/btn_add_people@2x.png");
const btn_close_small_black = require("assets/images/btn_close_small_black@2x.png");
export default {
    name: "contractApply",
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
                contract: '',
                contractNo: '',
                time: '',
                myCompanyName: '',
                myUserName: '',
                otherCompanyName: '',
                otherUserName: '',
                files: [],
                approver: [''],
                sendover: [''],
                status: '待审批'
            },
            preview_url: ''
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
        file_icon(f) {
            let ext = f.type;

            if (['doc', 'dot', 'wps', 'wpt', 'docx', 'dotx', 'docm', 'dotm'].includes(ext))
                return require('assets/images/icon_document_word_blue@2x.png');

            if (['xls', 'xlt', 'et', 'ett', 'xlsx', 'xltx', 'csv', 'xlsm', 'xlsm', 'xltm'].includes(ext))
                return require('assets/images/icon_document_excel_green@2x.png');

            if (['pdf'].includes(ext))
                return require('assets/images/icon_document_pdf_pink@2x.png');

            if (['gif', 'png', 'jpg', 'jpeg'].includes(ext))
                return require('assets/images/icon_document_picture_orange@2x.png');

            if (['pptx', 'ppt', 'pot', 'potx', 'pps', 'ppsx', 'dps', 'dpt', 'pptm', 'potm', 'ppsm'].includes(ext))
                return require('assets/images/icon_document_ppt_red@2x.png');

            if (['txt', 'log', 'lrc', 'rtf', 'xml', 'htm', 'html'].includes(ext))
                return require('assets/images/icon_document_txt_purple@2x.png');

            if (['zip', '7z', 'rar'].includes(ext))
                return require('assets/images/icon_document_zip_multicolor@2x.png');

            // return compressed file icon by default
            return require('assets/images/icon_document_unknown_gray@2x.png');
        },
        upload() {
            let self = this;
            let newfile = {};

            selectAndUpload(function onSelected(file) {
                $preloader.show();

                newfile = {
                    fileId: device.uuid + Date.now(),
                    name: file.name,
                    size: file.size,
                    type: (filename => {
                        let parts = filename.split('.');
                        if (parts.length > 1) return parts.pop();
                        return '';
                    })(file.name),
                    authorId: self.myUserId,
                    createdAt: Date.now()
                }

            }, function onUploaded(ret) {
                $preloader.hide();

                if (!ret || ret instanceof Error) {
                    if (!ret.code) {
                        $alert(ret.message);
                    } else {
                        $alert('上传文件失败，请稍后再试', '操作失败');
                    }
                    return;
                }

                newfile.oss = ret;
                self.formData.files.push(newfile);

            });
        },
        deleteFile (i) {
            this.formData.files.splice(i, 1)
        },
        preparePreview(file, cb) {
            $dialog.preloader('正在准备预览文件...');

            axios.get('api/utils/preview/' + file.oss).then(resp => {
                let url = resp.data && resp.data.TgtUri || '';

                if (!url) {
                    console.error('preview url not found');
                    throw new Error('preview url not found');
                }

                file.preview = url;
                $dialog.close();

                cb(file);
            }).catch(err => {
                console.error(err);
                $dialog.close();
                $alert('无法创建预览文件', '操作失败');
            })
        },
        preview(file) {
            let filetype = file.type.toLowerCase();

            if ([
                'pptx', 'ppt', 'pot', 'potx', 'pps', 'ppsx', 'dps', 'dpt', 'pptm', 'potm', 'ppsm',
                'xls', 'xlt', 'et', 'ett', 'xlsx', 'xltx', 'csv', 'xlsb', 'xlsm', 'xltm',
                'doc', 'dot', 'wps', 'wpt', 'docx', 'dotx', 'docm', 'dotm',
                'pdf', 'lrc', 'c', 'cpp', 'h', 'asm', 's', 'java', 'asp', 'bat', 'bas', 'prg', 'cmd', 'rtf', 'txt', 'log', 'xml', 'htm', 'html'
            ].includes(filetype)) {

                this.preparePreview(file, (file) => {
                    getPreviewUrl(file.preview,url=>{
                        this.preview_url = url
                    });
                    $popup.open('#files-preview-doc');
                });

                return;
            }

            if (['gif', 'png', 'jpg', 'jpeg'].includes(filetype)) {
                $dialog.preloader('正在准备预览文件...');

                getSignUrl(file.oss, url => {
                    $dialog.close();

                    let pb = $f7.photoBrowser.create({
                        photos: [url],
                        theme: 'dark',
                        backLinkText: '返回'
                    });

                    pb.on('closed', () => {
                        pb.destroy();
                    })
                    pb.open();
                })

                return;
            }

            $alert('该类型的文件不支持预览', '操作错误');
            return;
        },
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

            if (!this.formData.contract.length) {
                error('请输入合同名称')
            }
            else if (!this.formData.contractNo) {
                error('请输入合同编码')
            }
            else if (!this.formData.time) {
                error('请选择签约日期')
            }
            else if (this.formData.approver.length < 2) {
                error('请选择审核人')
            } else {
                let data = Object.assign({}, this.formData)
                data.approver = this.formData.approver[0]
                data.sendover.splice(data.sendover.length - 1, 1);
                axios.put('/api/contract/', data).then(resp=>{
                    this.$f7router.back()
                }).catch(err => {
                    $alert('无法更新数据，请稍后再试', '操作错误');
                });
            }
        }
    },
    created() {
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
    .item-selpon .item-image1{
        width: 45px;
        height: 50px;

        img {
            width: 100%;
            height: 100%;
        }
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

    .files_layer {

    }
</style>
