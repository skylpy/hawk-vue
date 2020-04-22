<template>
    <f7-page id="files-page" class="files-page" @page:reinit="load">
        <f7-navbar>
            <f7-nav-left>
                <f7-link icon-only @click="back">
                    <i class="icon icon-back"></i>
                </f7-link>
            </f7-nav-left>
            <f7-nav-title>{{ title + '文件管理' }}</f7-nav-title>

            <!--<f7-subnavbar :inner="false">-->
            <!--<f7-searchbar-->
            <!--search-container=".search-list"-->
            <!--search-in=".hawk-folder-list-name,.hawk-file-list-name"-->
            <!--placeholder="请输入关键字"-->
            <!--&gt;</f7-searchbar>-->
            <!--</f7-subnavbar>-->
        </f7-navbar>
        <div class="dir_path">
            <div v-for="(item,index) in chain" :key="index" @click="goto(item,index)">{{item.name}}</div>
        </div>
        <f7-list id="hawk-folder-list" class="search-list">
            <f7-list-item
                    v-for="(s, index) in folder.sub"
                    :key="index"
            >
                <div slot="title" class="hawk-folder-list-title" @click="chain.push(s)">
                    <img src="../../assets/images/icon_folder_yellow@2x.png" alt="folder">
                    <div class="hawk-folder-list-name">{{ s.name }}</div>
                </div>
                <div v-if="folder.sub.length && selected_type != 'file'" slot="after" class="hawk-folder-list-picker">
                    <f7-link @click="select(s)">
                        <img v-if="!selected.filter(v => v.folderId.toString() == s.folderId).length" style="margin-right: 0px;height: 20px"
                             src="../../assets/images/btn_dot_file_gray@2x.png"/>
                        <img v-if="selected.filter(v => v.folderId.toString() == s.folderId).length" style="margin-right: 0px;height: 20px"
                             src="../../assets/images/btn_tick_green@2x.png"/>
                    </f7-link>
                </div>
            </f7-list-item>
        </f7-list>

        <f7-list id="hawk-file-list" class="search-list">
            <f7-list-item
                    v-for="(f, index) in folder.files"
                    :key="index"
            >
                <div slot="title" class="hawk-file-list-title" @click="preview(f)">
                    <img :src="file_icon(f)" alt="file">
                    <div>
                        <div class="hawk-file-list-name">{{ f.name }}</div>
                        <div class="hawk-file-list-subtitle">{{ (new Date(f.createdAt)).toHawkString() + ' ' +
                            sizeToString(f.size) }}
                        </div>
                    </div>
                </div>
                <div v-if="folder.files.length && selected_type != 'folder'" slot="after" class="hawk-file-list-picker">
                    <f7-link @click="file_detail = f">
                        <img src="../../assets/images/btn_information_gray@2x.png" alt="info">
                    </f7-link>
                    <f7-link @click="select(f)">
                        <img v-if="!selected.filter(v => v.fileId.toString() == f.fileId).length" style="margin-right: 0px"
                             src="../../assets/images/btn_dot_file_gray@2x.png"/>
                        <img v-if="selected.filter(v => v.fileId.toString() == f.fileId).length" style="margin-right: 0px"
                             src="../../assets/images/btn_tick_green@2x.png"/>
                    </f7-link>
                </div>
            </f7-list-item>
        </f7-list>

        <f7-block v-if="folder.files.length + folder.sub.length == 0" class="hawk-folder-empty">
            <div>
                <img src="../../assets/images/ill_no_folder@2x.png" alt="zero_content">
                <div>该目录为空</div>
            </div>
        </f7-block>

        <f7-toolbar :bottom-md="true" id="hawk-files-toolbar" v-if="selected_type == 'folder'">
            <div class="hawk-files-toolbar-notes">已选{{ selected.length }}项</div>
            <f7-link @click="remove">
                <div class="hawk-files-toolbar-btn">
                    <img src="../../assets/images/icon_del_gray@2x.png" alt="remove">
                    <div>删除</div>
                </div>
            </f7-link>
            <f7-link @click="rename" v-if="selected.length == 1">
                <div class="hawk-files-toolbar-btn">
                    <img src="../../assets/images/icon_rename_gray@2x.png" alt="rename">
                    <div>重命名</div>
                </div>
            </f7-link>
            <!--<f7-link @click="download">-->
                <!--<div class="hawk-files-toolbar-btn">-->
                    <!--<img src="../../assets/images/icon_down_gray@2x.png" alt="download">-->
                    <!--<div>下载</div>-->
                <!--</div>-->
            <!--</f7-link>-->
            <f7-link @click="move">
                <div class="hawk-files-toolbar-btn">
                    <img src="../../assets/images/icon_move_white@2x.png" alt="move">
                    <div>移动</div>
                </div>
            </f7-link>
        </f7-toolbar>

        <f7-toolbar :bottom-md="true" id="hawk-files-toolbar" v-if="selected_type == 'file'">
            <div class="hawk-files-toolbar-notes">已选{{ selected.length }}项</div>
            <f7-link @click="remove">
                <div class="hawk-files-toolbar-btn">
                    <img src="../../assets/images/icon_del_gray@2x.png" alt="remove">
                    <div>删除</div>
                </div>
            </f7-link>
            <f7-link @click="rename" v-if="selected.length == 1">
                <div class="hawk-files-toolbar-btn">
                    <img src="../../assets/images/icon_rename_gray@2x.png" alt="rename">
                    <div>重命名</div>
                </div>
            </f7-link>
            <f7-link @click="download">
                <div class="hawk-files-toolbar-btn">
                    <img src="../../assets/images/icon_down_gray@2x.png" alt="download">
                    <div>下载</div>
                </div>
            </f7-link>
            <f7-link @click="move">
                <div class="hawk-files-toolbar-btn">
                    <img src="../../assets/images/icon_move_white@2x.png" alt="move">
                    <div>移动</div>
                </div>
            </f7-link>
            <!-- <f7-link @click="send">
                <div class="hawk-files-toolbar-btn">
                    <img src="../../assets/images/icon_send_gray@2x.png" alt="move">
                    <div>发送</div>
                </div>
            </f7-link> -->
        </f7-toolbar>

        <f7-fab
                v-if="!selected.length"
                class="hawk-action-btn-float"
                position="right-bottom"
                slot="fixed"
                @click="choose_action"
        >
            <f7-icon ios="f7:add" md="material:add"></f7-icon>
        </f7-fab>

        <f7-actions id="files-action">
            <f7-actions-group>
                <f7-actions-button class="hawk-actions-button" @click="upload">上传文件</f7-actions-button>
                <f7-actions-button class="hawk-actions-button" @click="create_folder">新建文件夹</f7-actions-button>
            </f7-actions-group>
            <f7-actions-group>
                <f7-actions-button color="red">取消</f7-actions-button>
            </f7-actions-group>
        </f7-actions>

        <f7-popup id="files-file-info" :opened="!!file_detail">
            <f7-page>
                <f7-navbar>
                    <f7-nav-left>
                        <f7-link icon-only @click="file_detail = null">
                            <i class="icon icon-back"></i>
                        </f7-link>
                    </f7-nav-left>
                    <f7-nav-title>文件详情</f7-nav-title>
                </f7-navbar>

                <f7-list v-if="file_detail" id="hawk-file-details">
                    <f7-list-item>
                        <div slot="inner" class="hawk-file-details-name">
                            <img :src="file_icon(file_detail)" alt="file">
                            <div>{{ file_detail.name }}</div>
                        </div>
                    </f7-list-item>

                    <f7-list-input
                            readonly
                            label="大小"
                            :value="sizeToString(file_detail.size)"
                    >
                    </f7-list-input>

                    <f7-list-input
                            readonly
                            label="格式"
                            :value="file_detail.type.toUpperCase()"
                    >
                    </f7-list-input>

                    <f7-list-input
                            readonly
                            label="位置"
                            :value="pathToStr"
                    >
                    </f7-list-input>

                    <f7-list-input
                            readonly
                            label="来源"
                            :value="originToStr(file_detail)"
                    >
                    </f7-list-input>

                </f7-list>

                <f7-toolbar :bottom-md="true" id="hawk-files-toolbar">
                    <f7-link @click="remove">
                        <div class="hawk-files-toolbar-btn">
                            <img src="../../assets/images/icon_del_gray@2x.png" alt="remove">
                            <div>删除</div>
                        </div>
                    </f7-link>
                    <f7-link @click="download">
                        <div class="hawk-files-toolbar-btn">
                            <img src="../../assets/images/icon_down_gray@2x.png" alt="download">
                            <div>下载</div>
                        </div>
                    </f7-link>
                    <f7-link @click="move">
                        <div class="hawk-files-toolbar-btn">
                            <img src="../../assets/images/icon_move_white@2x.png" alt="move">
                            <div>移动</div>
                        </div>
                    </f7-link>
                    <f7-link @click="rename">
                        <div class="hawk-files-toolbar-btn">
                            <img src="../../assets/images/icon_rename_gray@2x.png" alt="rename">
                            <div>重命名</div>
                        </div>
                    </f7-link>
                    <!-- <f7-link @click="send">
                        <div class="hawk-files-toolbar-btn">
                            <img src="../../assets/images/icon_send_gray@2x.png" alt="move">
                            <div>发送</div>
                        </div>
                    </f7-link> -->
                </f7-toolbar>
            </f7-page>
        </f7-popup>

        <f7-popup id="files-popup-folderpicker">
            <folderpicker
                    :multiple="false"
                    :root="root"
                    :selectedMove ='selected'
                    :update="updateFolderpicker"
                    @folderpicker:cancel="$f7.popup.close('#files-popup-folderpicker')"
                    @foldepicker:selected="moveTo"
            ></folderpicker>
        </f7-popup>

        <f7-popup id="files-download-mgr">
            <f7-page style="background:white">
                <f7-navbar>
                    <f7-nav-left>
                        <f7-link icon-only @click="$f7.popup.close('#files-download-mgr')">
                            <i class="icon icon-back"></i>
                        </f7-link>
                    </f7-nav-left>
                    <f7-nav-title>文件下载</f7-nav-title>
                </f7-navbar>
                <f7-list v-if="downloads" style="margin-top:0">
                    <f7-list-item
                            v-for="(f, index) in downloads"
                            :key="index"
                            :title="f.name"
                            @click="fileOpener2(f.nativeURL, f.type)"
                    >
                        <div slot="inner"
                             style="max-width:50%; font-size:12px; color:gray;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;"
                             v-if="f.localPath"
                        >
                            {{f.localPath}}
                        </div>
                        <f7-progressbar v-else style="max-width:50%; color:#01B38B" slot="inner"
                                        :progress="f.progress || 0"></f7-progressbar>
                        <div slot="inner" style="color:gray; font-size:smaller">{{ f.progress ? (f.progress == 100 ?
                            '下载完成' : '正在下载') : (f.localPath?'下载完成':'准备下载')}}
                        </div>
                    </f7-list-item>
                </f7-list>

                <f7-list class="hawk-action-button-bottom">
                    <f7-list-button
                            :title="downloads_complete() ? '完成' : '取消下载'"
                            @click="download_abort"
                    ></f7-list-button>
                </f7-list>

            </f7-page>
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

    </f7-page>
</template>
<style lang="scss">
    .files-page {
        .ios .list .item-content {
            padding-left: 0px!important;
        }
        .ios .list .item-content .item-inner{
            padding-left: 15px!important;
        }
        #hawk-folder-list .item-title {
            width: calc(100% - 26px);
        }

        #hawk-file-list .item-title {
            width: calc(100% - 68px);
        }
        .ios .toolbar-inner {
            padding-right: 8%;
        }
    }
</style>
<style lang="scss" scoped>
    .ios .list {
        margin: -1px 0;
    }
    .dir_path {
        padding: 10px;
        background-color: #f6f6f6;
        overflow-y: auto;
    }

    .dir_path > * {
        float: left;
        line-height: 30px;
        color: #01B38B;
        font-size: 16px;
        padding-right: 5px;
        cursor: pointer;
    }

    .dir_path > *:last-child {
        color: #666666;
        cursor: auto;
    }

    .dir_path > div:first-child:before {
        float: left;
        content: '';
    }

    .dir_path > div:before {
        float: left;
        content: '>';
        padding-right: 5px;
        color: #cdcdcd;
    }

    #files-page {
        background-color: white;
    }

    #hawk-folder-list {
        margin-top: 0;

        .hawk-folder-list-title {
            display: flex;
            align-items: center;
            height: 60px;
            color: #333333;
            font-weight: 400;
            font-size: 16px;

            img {
                width: 21px;
                height: 18px;
                margin-right: 10px
            }
        }

        .hawk-folder-list-picker {
            i.fa-circle {
                font-size: 10px;
                color: #D8D8D8;
            }
        }
    }

    .hawk-folder-empty {
        color: #333333 !important;
        font-size: 14px;
        display: flex;
        justify-content: center;
        align-items: center;
        padding-top: 50px !important;

        img {
            width: 70px;
            height: 83px;
        }
    }

    #hawk-files-toolbar {

        .toolbar-inner {
            display: flex;
            justify-content: space-around;
        }

        .hawk-files-toolbar-notes {
            min-width: 120px;
            color: #333333;
        }

        .hawk-files-toolbar-btn {
            font-size: 11px;
            font-weight: 400;

            img {
                width: 21px;
                height: 21px;
                display: block;
                padding-top: 3px;
                margin: 0 auto;
            }

            div {
                color: #7C7C7C;
                font-size: 11px;
                line-height: 20px;
                font-weight: bold;
            }
        }

    }


    #hawk-file-list {
        margin-top: 0;

        .hawk-file-list-title {
            display: flex;
            align-items: center;
            height: 60px;
            color: #333333;
            font-weight: 400;
            font-size: 15px;

            img {
                width: 27px;
                height: 31px;
                margin-right: 10px
            }

            .hawk-file-list-subtitle {
                color: #888888;
                font-size: 12px;
            }
        }

        .hawk-file-list-picker {
            display: flex;
            align-items: center;

            img {
                width: 20px;
                height: 20px;
                margin-right: 20px
            }

            i.fa-circle {
                font-size: 10px;
                color: #D8D8D8;
            }
        }
    }

    #hawk-file-details {
        margin-top: 0;

        .hawk-file-details-name {
            display: flex;
            align-items: center;
            min-height: 60px;

            img {
                width: 27px;
                height: 31px;
                margin-right: 10px
            }
        }
    }

</style>

<script>
    import {mapGetters, mapActions} from 'vuex';
    import {selectAndUpload, getSignUrl, getPreviewUrl} from 'lib/aliyun.js';
    import folderpicker from 'gadget/folderpicker.vue';
    import axios from 'axios';

    export default {
        components: {
            folderpicker
        },

        props: [
            'title',
            'root',
            'which'
        ],

        data() {
            return {
                updateFolderpicker:Date.now(),
                chain: [],
                selected: [],
                file_detail: null,
                downloads: null,
                preview_url: '',
                init: true
            }
        },

        computed: {
            ...mapGetters([
                'myCompany',
                'myUserId',
                'userDepartment',
                'who'
            ]),
            dirPath() {
                let arr = this.chain.map(item => item.name)
                return arr.join('>')
            },
            rootDir() {
                if (!this.myCompany[this.root].sub) {
                    this.myCompany[this.root].sub = []
                }
                if (!this.myCompany[this.root].files) {
                    this.myCompany[this.root].files = []
                }
                return this.myCompany[this.root]
            },
            folder() {
                if (this.chain.length) return this.chain[this.chain.length - 1]; else return this.rootDir;
            },

            selected_type() {
                if (!this.selected.length) return '';
                if (this.selected[0].folderId) return 'folder';
                if (this.selected[0].fileId) return 'file';
                return '';
            },

            pathToStr() {
                return this.chain.map(f => f.name).join('/')
            },

            visibleHeight() {
                let navHeight = document.querySelector('.navbar').clientHeight;
                let windowHeight = window.outerHeight > 0 ? window.outerHeight : window.innerHeight; // iOS return 0 for window.outerHeight
                let visibleHeight = windowHeight - navHeight;

                window.visibleHeight = visibleHeight;
                return visibleHeight;
            }
        },
        watch: {
            myCompany: {
                handler: function (val, oldVal) {
                    this.load();
                },
                deep: true,
                immediate: true
            }
        },

        mounted() {
            if (!this.chain.length) this.load();

            if (!window.downloader_init) {
                let folder = 'hawkDownloads';
                let fileSystem = device.platform == 'Android' ? cordova.file.externalRootDirectory : (
                    device.platform == 'iOS' ? cordova.file.documentsDirectory : cordova.file.dataDirectory
                );
                console.log(cordova.file,fileSystem, folder)
                downloader.init({folder, fileSystem});
                window.downloader_init = true;
            }
        },

        created() {
            this.addDownloadHandler();
            this.loadCompany();
        },

        methods: {
            ...mapActions({
                'update': 'UPDATE_COMPANY',
                'loadCompany': 'LOAD_COM'
            }),
            downloads_complete() {
                return this.downloads && !this.downloads.find(f => f.progress != 100)
            },
            goto(dir, index) {
                this.chain = this.chain.slice(0, index + 1)
            },
            target() {
                if (this.file_detail) return {
                    object_type: 'file',
                    objects: [this.file_detail]
                };

                if (!this.selected.length) return {};

                return {
                    object_type: this.selected_type,
                    objects: this.selected
                }
            },

            rename() {
                let {object_type, objects} = this.target();
                if (!object_type || !objects) return;
                if (objects.length > 1) return;

                let object_title = (object_type == 'file' ? '文件' : '文件夹');

                $prompt(`请输入新的${object_title}名称`, `${object_title}重命名`, (name) => {
                    if (!name) return;

                    let rootDir = deepCopy(this.rootDir);
                    let dirs = this.list_folders(rootDir);

                    if (object_type == 'file') {
                        let file = objects[0];
                        let folder = dirs.find(d => d.folderId == this.folder.folderId);
                        let newfile = folder.files.find(f => f.fileId == file.fileId);
                        newfile.name = name;
                    }

                    if (object_type == 'folder') {
                        let folderId = objects[0].folderId;
                        let newfolder = dirs.find(d => d.folderId == folderId);
                        newfolder.name = name;
                    }

                    this.save(rootDir);
                    this.selected = [];
                });
            },

            move() {
                let {object_type, objects} = this.target();
                if (!object_type || !objects) return;
                this.updateFolderpicker = Date.now();
                $popup.open('#files-popup-folderpicker');
            },

            moveTo(selected_folder_list) {
                let {object_type, objects} = this.target();
                if (!object_type || !objects) return;

                if (!selected_folder_list || selected_folder_list.length != 1) return;
                let dest = selected_folder_list[0];

                let object_title = (object_type == 'file' ? '文件' : '文件夹');

                $confirm(`确定要移动${object_title}到新路径吗？`, '操作确认', () => {
                    let rootDir = deepCopy(this.rootDir);
                    let dirs = this.list_folders(rootDir);
                    let folder = dirs.find(d => d.folderId == this.folder.folderId);
                    let newfolder = dirs.find(d => d.folderId == dest.folderId);

                    if (folder.folderId == newfolder.folderId) return;

                    if (object_type == 'file') {
                        let files = folder.files.filter(f => objects.find(o => o.fileId == f.fileId));
                        folder.files = folder.files.filter(f => !objects.find(o => o.fileId == f.fileId));
                        newfolder.files.push(...files);
                    }

                    if (object_type == 'folder') {
                        let folders_to_move = folder.sub.filter(s => objects.find(o => o.folderId == s.folderId));
                        folder.sub = folder.sub.filter(s => !objects.find(o => o.folderId == s.folderId));
                        newfolder.sub.push(...folders_to_move);
                    }

                    this.save(rootDir);
                    // console.log(rootDir);
                    this.selected = [];
                    $popup.close('#files-popup-folderpicker');
                });
            },

            remove() {
                let {object_type, objects} = this.target();
                if (!object_type || !objects) return;

                let isCanDelete = true;
                if (object_type == 'folder') {
                    let judgeHaveFiles = (list) => {
                        list.map((v => {
                           if (v.files.length) {
                               $alert('文件夹不为空，请先删除文件', '操作错误');
                               isCanDelete = false;
                           } else if (v.sub.length) {
                               judgeHaveFiles(v.sub);
                           }
                        }));
                    };
                    judgeHaveFiles(objects);
                }

                if (isCanDelete) {
                    let object_title = (object_type == 'file' ? '文件' : '文件夹');

                    $confirm(`确定要删除这${objects.length}项${object_title}吗？`, '操作确认', () => {
                        let rootDir = deepCopy(this.rootDir);
                        let dirs = this.list_folders(rootDir);
                        let folder = dirs.find(d => d.folderId == this.folder.folderId);

                        if (object_type == 'file') {
                            folder.files = folder.files.filter(f => !objects.find(o => o.fileId == f.fileId));
                        }

                        if (object_type == 'folder') {
                            folder.sub = folder.sub.filter(s => !objects.find(f => f.folderId == s.folderId));
                        }

                        this.save(rootDir);
                        this.selected = [];
                    });
                }
            },

            getOssFileUrl(files) {
                return Promise.all(files.map(f => {
                    return new Promise((resolve, reject) => {
                        getSignUrl(f.oss, (url) => {
                            f.signedUrl = url + '';
                            resolve();
                        })
                    });
                }));
            },
            fileOpener2(file, type) {
                console.log('fileOpener2', file, type, cordova.plugins.fileOpener2)
                if (!file) return;
                cordova.plugins.fileOpener2.open(file, 'application/' + type, {
                        error: function (e) {
                            console.log('Error status: ' + e.status + ' - Error message: ' + e.message, e);
                            if (e.status == 9) {
                                $alert('没有找到支持' + type + '格式的应用');
                            }
                        },
                        success: function () {
                            console.log('file opened successfully');
                        }
                    }
                );
            },

            download() {
                let {object_type, objects} = this.target();
                if (!object_type || object_type != 'file' || !objects) return;

                let files = deepCopy(objects);

                $confirm(`确定要下载这${files.length}个文件吗？`, '操作确认', () => {

                    this.downloads = files;
                    this.selected = [];
                    console.log('准备下载文件',files)
                    this.getOssFileUrl(files).then(() => {
                        console.log('准备下载文件地址',files)
                        downloader.getMultipleFiles(files.map(f => {
                            return {url: f.signedUrl, name: f.name};
                        }))
                    });

                    this.$f7.popup.open('#files-download-mgr');
                })
            },

            download_abort() {
                if (this.downloads_complete()) {
                    $f7.popup.close('#files-download-mgr');
                    return;
                }

                $confirm('确定要中断文件下载吗？', '操作确认', () => {
                    downloader.abort();
                    this.downloads = null;
                    $f7.popup.close('#files-download-mgr');
                })
            },

            addDownloadHandler() {
                let self = this;

                document.addEventListener('DOWNLOADER_initialized', function (event) {
                    var data = event.data;
                    console.log('DOWNLOADER_gotFolder', data);
                });

                document.addEventListener('DOWNLOADER_gotFolder', function (event) {
                    var data = event.data; // data:[cordova.fileEntry folder]
                    console.log('DOWNLOADER_gotFolder', data[0].fullPath, data);
                });

                document.addEventListener('DOWNLOADER_error', function (event) {
                    var data = event.data; // data:[object error]
                    console.error('DOWNLOADER_error', data);

                    self.downloads = null;
                    $f7.popup.close('#files-download-mgr');
                    $alert('下载出错，请稍后再试', '操作错误');
                });

                document.addEventListener('DOWNLOADER_downloadSuccess', function (event) {
                    var data = event.data; // [cordova.fileEntry entry]
                    data.forEach(fileEntry => {
                        let f = self.downloads.find(f => f.name == fileEntry.name);
                        f.localPath = fileEntry.fullPath;
                        f.nativeURL = fileEntry.nativeURL;
                    });
                    console.log('DOWNLOADER_downloadSuccess', data)
                    self.$forceUpdate();
                });

                document.addEventListener('DOWNLOADER_downloadError', function (event) {
                    var data = event.data; // data:[object error]
                    console.error('DOWNLOADER_downloadError', data);

                    self.downloads = null;
                    $f7.popup.close('#files-download-mgr');
                    $alert('下载出错，请稍后再试', '操作错误');
                });

                document.addEventListener('DOWNLOADER_downloadProgress', function (event) {
                    var data = event.data; // data:[number percentage, string fileName]
                    let f = self.downloads.find(f => f.name == data[1]);
                    if (f) {
                        f.progress = data[0];
                        self.$forceUpdate();
                    }
                });
            },

            send() {

            },

            originToStr(f) {
                let u = this.who(f.authorId);
                let d = this.userDepartment(f.authorId)
                return d ? d.name : '' + (u.job || '') + ' ' + u.name + ' 创建于 ' + (new Date(f.createdAt)).toHawkString();
            },

            sizeToString(b/*bytes*/) {
                if (!b) return '未知大小';
                if (b < 1024) return b + 'B';
                if (b < 1028 * 1024) return (b / 1024).toFixed(2) + 'KB';
                if (b < 1024 * 1024 * 1024) return (b / (2014 * 1024)).toFixed(2) + 'MB';
                return '大于1G';
            },

            select(item) {
                console.log(item)
                let isAdd = true
                this.selected.forEach((v, i) => {
                    if ((item.fileId && v.fileId.toString() === item.fileId.toString()) ||
                        (item.folderId && v.folderId.toString() === item.folderId.toString())) {
                        isAdd = false
                        this.selected.splice(i, 1);
                    }
                })
                if (isAdd) {
                    this.selected.push(item);
                }
            },

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

            choose_action() {
                $f7.actions.open('#files-action', true);
            },

            load() {
                let folderIdChain = this.chain.map(folder => folder.folderId);
                this.chain = [this.rootDir];

                folderIdChain.shift(); // remove root

                // restore original path
                while (folderIdChain.length) {
                    let fId = folderIdChain.shift();
                    let parent = this.chain[this.chain.length - 1];
                    let subFolder = parent.sub.find(subf => subf.folderId == fId);
                    this.chain.push(subFolder);
                }

                if (this.which && this.init) {
                    this.init = false
                    this.$nextTick(() => {
                        if (this.which === 'choose_action') {
                            this.choose_action()
                        } else {
                            if (this.folder.files.length) {
                                console.log(this.folder)
                                this.select(this.folder.files[0])
                            }
                        }
                    })
                }
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
                    let rootDir = deepCopy(self.rootDir);
                    let dirs = self.list_folders(rootDir);
                    let folder = dirs.find(d => d.folderId == self.folder.folderId);

                    folder.files.push(newfile);
                    console.log(newfile)
                    console.log(folder)
                    self.save(rootDir);

                });
            },

            list_folders(rootDir) {
                return (function list(d) {
                    return d.sub.slice(0).concat(d.sub.reduce((accum, s) => {
                        return accum.concat(list(s))
                    }, [rootDir]));
                })(rootDir);
            },

            create_folder() {
                $prompt('请输入新建文件夹名称', '新建文件夹', (name) => {
                    if (!name) return;
                    let rootDir = deepCopy(this.rootDir);
                    let dirs = this.list_folders(rootDir);
                    let parent = dirs.find(d => d.folderId == this.folder.folderId);
                    parent.sub.push({
                        name,
                        folderId: Date.now(),
                        sub: [],
                        files: []
                    });

                    this.save(rootDir);
                })
            },

            back() {
                this.selected = [];
                if (this.chain.length <= 1) this.$f7router.back();
                this.chain.pop();
            },

            save(rootDir) {
                $preloader.show();

                let updates = {};
                updates[this.root] = rootDir;

                this.update(updates).then(() => {
                    $preloader.hide();
                    this.load();
                }).catch(err => {
                    $preloader.hide();
                    console.error(err);
                    $alert(err.message, '操作错误');
                })
            },

            preparePreview(file, cb) {
                if (file.preview) {
                    cb(file);
                    return;
                }

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
                ]
                    .includes(filetype)) {

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
        }
    }
</script>

