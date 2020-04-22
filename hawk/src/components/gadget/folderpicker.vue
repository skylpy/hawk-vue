<template>
    <f7-page @page:reinit="load">
        <f7-navbar>
            <f7-nav-left>
                <f7-link icon-only @click="cancel">
                    <i class="icon icon-back"></i>
                </f7-link>
            </f7-nav-left>
            <f7-nav-title>选择目录</f7-nav-title>
        </f7-navbar>
        <div class="dir_path">
            <div v-for="(item,index) in chain" :key="index" @click="goto(item,index)">{{item.name}}</div>
        </div>
        <f7-list id="hawk-folderpicker-list" v-if="folder.sub.length">
            <f7-list-item
                    v-for="(s, index) in folder.sub"
                    :key="index"
                    v-if="isShowSeleteFloder(s.folderId)"
            >
                <div slot="title" class="hawk-folderpicker-list-title" @click="chain.push(s)">
                    <img src="../../assets/images/icon_folder_yellow@2x.png" alt="folder">
                    <div>{{ s.name }}</div>
                </div>
                <div slot="after" class="hawk-folderpicker-list-picker">
                    <f7-link @click="select(s)">
                        <img v-if="!selected.includes(s)" style="margin-right: 0px"
                             src="../../assets/images/btn_dot_file_gray@2x.png"/>
                        <img v-if="selected.includes(s)" style="margin-right: 0px"
                             src="../../assets/images/btn_tick_green@2x.png"/>
                    </f7-link>
                </div>
            </f7-list-item>
        </f7-list>

        <f7-block v-if="folder.sub.length == 0" class="hawk-folderpicker-empty">
            <div>
                <img src="../../assets/images/ill_no_folder@2x.png" alt="zero_content">
                <div>该目录没有子目录</div>
            </div>
        </f7-block>

        <f7-toolbar :bottom-md="true">
            <f7-button class="toolbar-btn" raised @click="chain.pop()">上级目录</f7-button>
            <!--<f7-button class="toolbar-btn" raised @click="lase_folder">上级目录</f7-button>-->
            <f7-button class="toolbar-btn" raised @click="create_folder">新建目录</f7-button>
            <f7-button class="toolbar-btn-submit" raised @click="done"><span>确定</span><span style="font-size:10px">（移动到{{this.selected.length?'选中':'此'}}路径）</span>
            </f7-button>
        </f7-toolbar>

    </f7-page>
</template>

<style scoped>
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

    .toolbar-btn {
        border: none;
        border-radius: 2px;
        background: #F1F1F1;
        color: #333333;
        margin: 10px;
    }

    .toolbar-btn-submit {
        border: none;
        border-radius: 2px;
        background: #01B38B;
        color: white;
        margin: 10px;
        flex-grow: 1;
    }
</style>


<style lang="scss">
    #hawk-folderpicker-list .item-title {
        width: calc(100% - 26px);
    }
    #files-page {
        background-color: white;
    }

    #hawk-folderpicker-list {
        margin-top: 0;

        .hawk-folderpicker-list-title {
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

        .hawk-folderpicker-list-picker {
            i.fa-circle {
                font-size: 10px;
                color: #D8D8D8;
            }

            img {
                width: 20px;
                height: 20px;
                margin-right: 20px
            }
        }
    }

    .hawk-folderpicker-empty {
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

</style>

<script>
    import {mapGetters, mapActions} from 'vuex';

    export default {
        name: 'folderpicker',

        props: [
            'multiple',
            'root',
            'selectedMove'
        ],

        data() {
            return {
                chain: [],
                selected: [],
            }
        },
        watch:{
            myCompany(value){
                this.chain.updateFolderpicker=this.myCompany(this.rootDir)
            }
        },
        computed: {
            ...mapGetters([
                'myCompany',
                'myUserId',
                'userDepartment',
                'who'
            ]),

            rootDir() {
                return this.myCompany[this.root]
            },
            folder() {
                if (this.chain.length) return this.chain[this.chain.length - 1]; else return this.rootDir;
            },
            pathToStr() {
                return this.chain.map(f => f.name).join('/')
            }
        },

        mounted() {
            if (!this.chain.length) this.chain = [this.rootDir];
        },

        methods: {
            ...mapActions({
                'update': 'UPDATE_COMPANY',
            }),

            goto(dir, index) {
                this.chain = this.chain.slice(0, index + 1)
                this.selected = []
            },
            load() {
                let folderIdChain = this.chain.map(folder => folder.folderId);
                this.chain = [this.rootDir];

                folderIdChain.shift(); // remove root

                // restore orginal path
                while (folderIdChain.length) {
                    let fId = folderIdChain.shift();
                    let parent = this.chain[this.chain.length - 1];
                    let subFolder = parent.sub.find(subf => subf.folderId == fId);
                    this.chain.push(subFolder);
                }
            },

            cancel() {
                this.$emit('folderpicker:cancel');
            },

            select(item) {
                if (this.selected.includes(item)) {
                    this.selected.splice(this.selected.findIndex(i => i == item), 1);
                } else {
                    if (this.multiple) this.selected.push(item);
                    else this.selected[0] = item;
                }

                this.$forceUpdate();
            },

            done() {
                if (this.selected.length) {
                    this.$emit('foldepicker:selected', this.selected);
                } else {
                    //无选择时，默认选择当前目录
                    this.$emit('foldepicker:selected', [this.chain[this.chain.length - 1]]);
                }
            },

            list_folders(rootDir) {
                return (function list(d) {
                    return d.sub.slice(0).concat(d.sub.reduce((accum, s) => {
                        return accum.concat(list(s))
                    }, [rootDir]));
                })(rootDir);
            },
            //移动到上一级目录
            lase_folder() {

            },
            //新建目录
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

            isShowSeleteFloder(id) {
                let isShow = true;
                this.selectedMove.map(v => {
                    if (v.folderId == id) isShow = false
                });
                return isShow
            }
        }
    }
</script>

