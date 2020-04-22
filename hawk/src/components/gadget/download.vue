<template>
    <f7-page style="background:white">
        <f7-navbar>
            <f7-nav-left>
                <f7-link icon-only @click="$f7.popup.close('#files-download-mgr')">
                    <i class="icon icon-back"></i>
                </f7-link>
            </f7-nav-left>
            <f7-nav-title>下载管理</f7-nav-title>
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
</template>

<script>
    export default {
        name: "download",
        data(){
            return{
                downloads:[]
            }
        },
        methods:{
            downloads_complete(){
                this.$emit('downloads_complete')
            }
        }
    }
</script>

<style scoped>

</style>
