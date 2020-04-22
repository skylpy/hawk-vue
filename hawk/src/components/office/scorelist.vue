<template>
    <f7-page @page:beforein="load">
        <f7-navbar :title="pageName" back-link>
            <f7-nav-right>
                <f7-link icon-only @click="jumpTo('/office/scoredetails/',{ruleModule, tag:tag})">添加</f7-link>
            </f7-nav-right>
        </f7-navbar>
        <!--<f7-block-title strong>考核列表</f7-block-title>-->
        <f7-list class="custom_score">
            <f7-list-item v-for="(item,index) in list" :key="index" @click="jumpTo('/office/scoredetails/',{scoreDataSrc:item, tag:tag})">
                <div class="item_info">
                    {{item.title}}
                </div>
                <div class="item_status">
                    {{new Date(item.date.from).toHawkDateString()}}
                    <br>
                    <span v-if="item.run">正在执行</span>
                    <span v-if="!item.run" class="exceed">{{item.status=='完成'?'已完成':'未执行'}}</span>
                </div>
            </f7-list-item>
            <p v-if="!list.length" style="width:100%; text-align:center" slot="after-list">
                <small style="color:gray">没有更多</small>
            </p>
        </f7-list>
    </f7-page>
</template>

<style scoped>

    .item_info {
        line-height: 40px;
    }

    .item_info > .head {
        float: left;
        width: 40px;
        height: 40px;
        background-color: #527fac;
        border-radius: 5px;
        overflow: hidden;
        margin-right: 10px;
    }

    .item_info > .head > img {
        min-width: 100%;
        min-height: 100%;
    }

    .item_info > span {
        font-size: 12px;
        margin-left: 4px;
        color: #A7A7A7;
    }

    .item_status {
        position: absolute;
        right: 5px;
        text-align: right;
        font-size: 14px;
        color: #A7A7A7;
    }

    .item_status > span {
        color: #2196F3;
    }

    .item_status > .exceed {
        color: #A7A7A7;
    }
</style>
<script>
    import {createDateTimePicker} from 'lib/datetime';
    import {mapGetters, mapActions} from 'vuex';
    import personnelselector from 'gadget/personnelselector.vue';
    import axios from 'axios';

    export default {
        props: [
            'lastPage',
            'ruleModule',
            'pageName',
            'tag'
        ],
        data() {
            return {
                list: []
            }
        },

        mounted: function () {
        },

        computed: {
            ...mapGetters([
                'myUserId',
                'personnel',
                'who'
            ])
        },

        methods: {
            load() {
                $preloader.show();
                let params = {ruleModule: this.ruleModule}
                if (this.tag) params.tag = this.tag
                axios.get('api/score/scoreRule?q=' + JSON.stringify(params)).then(resp => {
                    $preloader.hide();
                    this.list = resp.data;
                }).catch(err => {
                    $preloader.hide();
                    console.error(err);
                    $alert('无法更新数据，请稍后再试', '操作错误');
                })
            },
            jumpTo(path, props) {
                props = props || {}
                props.lastPage = this.pageName || "返回"
                this.$f7router.navigate(path, {props});
            }
        }
    }
</script>
