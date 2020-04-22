<template>
    <f7-page no-toolbar style="background: #f8f8f8">
        <f7-navbar  title="邀约到访详情" back-link>
        </f7-navbar>

        <div style="overflow-x: hidden;">
            <div class="list-item  list-type">
                <label>申请人：</label>
                <span>{{who(item.creator) && who(item.creator).name}}</span>
            </div>


            <div class="list-item  list-type">
                <label>客户名字：</label>
                <span>{{item.name}}</span>
            </div>


            <div class="list-item  list-type">
                <label>联系方式：</label>
                <span>{{item.contact}}</span>
            </div>

            <div class="list-item list-type">
                <label>邀约人：</label>
                <span>{{item.contactName}}</span>
            </div>

            <div class="list-item list-item-content">
                <label>邀约方式：</label>
                <span>{{item.invitation}}</span>
            </div>

            <div class="list-item  list-type">
                <label>预计到访时间：</label>
                <span>{{moment(item.time).format('YYYY-MM-DD')}}</span>
            </div>

            <div class="list-item list-item-content">
                <label>其他事项：</label>
                <span>{{item.des}}</span>
            </div>

            <div class="image-top">
                <div>
                    <span class="imagetite">文件</span>
                </div>
                <div class="imgDiv" v-if="item.files.length == 0">
                    <span>无文件上传</span>
                </div>
                <div class="imgDiv" v-for="v in item.files" @click="preview(v)">
                    <img :src="file_icon(v)" width="56px" height="60px">
                </div>
            </div>

            <div class="list-item  list-type">
                <label>申请状态：</label>
                <span>{{item.status}}</span>
            </div>

            <div class="list-item  list-type" v-if="item.comment">
                <label>拒绝理由：</label>
                <span>{{item.comment}}</span>
            </div>

            <div class="expense-list" style="padding-left: 10px;">
                审批人
            </div>
            <div class="expense-list">
                <div class="expense-left">
                    <div class="expense-left-icon">
                        <img :src="item.approver && who(item.approver).avatarUrl || hp_default_96" width="30px" height="30px">
                    </div>
                </div>
                <div class="expense-right">
                    <span class="expense-name">{{who(item.approver).name}}</span>
                </div>
            </div>
        </div>
        <!---->
        <footer class="footer" v-if="item.approver === myProfile._id && item.status == '待审批'">
            <div class="footerbohui" @click="promptpop">驳回</div>
            <div class="footertongguo" @click="through">通过</div>
        </footer>

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
    </f7-page>
</template>

<script>
import {mapGetters,mapMutations,mapActions} from 'vuex';
import axios from 'axios';
import moment from 'moment'
import {getSignUrl, getPreviewUrl} from 'src/lib/aliyun.js';
export default {
    name: "journaldetail",

    props: [
        'lastPage',
        'item'
    ],
    //监听值改变
    computed: {
        ...mapGetters([
            'who',
            'myProfile',
            'myCompany'
        ])
    },

    data: () => {
        return {
            preview_url: ''
        }
    },

    mounted(){

    },

    methods: {
        moment,
        file_icon(f) {
            let ext = f.type;

            if (['doc', 'dot', 'wps', 'wpt', 'docx', 'dotx', 'docm', 'dotm'].includes(ext))
                return require('src/assets/images/icon_document_word_blue@2x.png');

            if (['xls', 'xlt', 'et', 'ett', 'xlsx', 'xltx', 'csv', 'xlsm', 'xlsm', 'xltm'].includes(ext))
                return require('src/assets/images/icon_document_excel_green@2x.png');

            if (['pdf'].includes(ext))
                return require('src/assets/images/icon_document_pdf_pink@2x.png');

            if (['gif', 'png', 'jpg', 'jpeg'].includes(ext))
                return require('src/assets/images/icon_document_picture_orange@2x.png');

            if (['pptx', 'ppt', 'pot', 'potx', 'pps', 'ppsx', 'dps', 'dpt', 'pptm', 'potm', 'ppsm'].includes(ext))
                return require('src/assets/images/icon_document_ppt_red@2x.png');

            if (['txt', 'log', 'lrc', 'rtf', 'xml', 'htm', 'html'].includes(ext))
                return require('src/assets/images/icon_document_txt_purple@2x.png');

            if (['zip', '7z', 'rar'].includes(ext))
                return require('src/assets/images/icon_document_zip_multicolor@2x.png');

            // return compressed file icon by default
            return require('src/assets/images/icon_document_unknown_gray@2x.png');
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
        promptpop(){

            $dialog.prompt('请填写驳回原因', '驳回原因', val => {
                $preloader.show();

                let data = Object.assign({}, this.item)
                data.status = '已驳回'
                data.comment = val;
                $preloader.show();
                axios.post('/api/invitation/', data).then(() => {
                    $preloader.hide();
                    $alert('操作成功', '操作成功', () => {
                        this.$f7router.back()
                    })
                }).catch(error => {
                    $preloader.hide();
                    console.error(error);
                    $alert('无法保存数据，请稍后再试', '操作错误');
                })
            })
        },

        through(){
            let data = Object.assign({}, this.item)
            data.status = '已确认'
            $preloader.show();
            axios.post('/api/invitation/', data).then(() => {
                $preloader.hide();
                $alert('操作成功', '操作成功', () => {
                    this.$f7router.back()
                })
            }).catch(error => {
                console.error(error);
                $preloader.hide();
                $alert('无法保存数据，请稍后再试', '操作错误');
            })
        }
    }
}
</script>

<style scoped>

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
    }

    .list-type label{

        float: left;
        margin-left: 15px;
        display: inline-block;
        color: #666666;
        font-size: 14px;
    }

    .list-type span {

        float: right;
        margin-right: 15px;
        display: inline-block;
        color: #333333;
        font-size: 14px;
        font-weight: bold;
    }

    .list-item-content{

        background: #FFFFFF;
        border-bottom: 1px solid #f8f8f8;
    }

    .list-item-content label{

        display: inline-block;
        margin-top: 10px;
        margin-left: 15px;
        color: #666666;
        font-size: 14px;
    }

    .list-item-content div{

        margin-left: 15px;
        margin-top: 10px;
        margin-bottom: 10px;
        margin-right: 15px;
        color: #333333;
        font-size: 14px;
        font-weight: bold;
    }

    .image-top{

        margin-top: 0px;
        min-height: 50px;
        background: #FFFFFF;
        margin-bottom: 30px;
    }

    .imagetite {

        color: #666666;
        width: 100%;
        margin-top: 10px;
        height: 20px;
        display: inline-block;
        margin-left: 15px;
        margin-bottom: 8px;
        font-size: 14px;
    }

    .imgDiv{

        display: inline-block;
        margin-left: 15px;
        margin-bottom: 10px;
    }

    .footer{

        position: fixed;
        bottom: 0px;
        width: 100%;
        height: 50px;
        background: #FFFFFF;
        color: white;
        text-align: center;
        line-height: 50px;
        font-size: 18px;
        z-index: 99;
        font-size: 16px;
    }

    .footerbohui{

        background: #FF715A;
        height: 35px;
        width: 35%;
        display: inline-block;
        float: left;
        margin-left: 20px;
        margin-top: 7px;
        line-height: 35px;
        border-radius: 2px;
    }

    .footertongguo{

        background: #01B38B;
        height: 35px;
        width: 35%;
        display: inline-block;
        float: right;
        margin-right: 20px;
        margin-top: 7px;
        line-height: 35px;
        border-radius: 2px;
    }

    .expense-list {
        width: 100%;
        margin-top: 10px;
    }

    .expense-left {
        display: inline-block;
        width: 15%;

        margin-bottom: 15px;
    }

    .expense-left-icon {
        width: 30px;
        height: 30px;
        border-radius: 15px;
        background-color: #2196F3;
        margin: 0px auto;
        overflow: hidden;
    }

    .expense-left-icon > img {
        width: 100%;
        height: 100%;
    }

    .expense-right {

        float: right;
        width: 85%;
    }
</style>
