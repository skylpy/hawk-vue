<template>
    <f7-page>
        <f7-navbar title="拜访管理" back-link @page:beforein="">
            <f7-nav-right>

            </f7-nav-right>
        </f7-navbar>
        <div class="warning">
            <f7-icon class="icon" f7="info_round"></f7-icon>
            任务要按时完成，状态记得要在任务管理中进行更改
        </div>
        <div class="block_con">
            <div class="block_item" v-for="(item,index) in visitRecords" :key="index">
                <div class="block_item_title">
                    <div class="block_item_title_t1">
                        <div>拜访{{item.clientName}}-{{item.type}}</div>
                        <div>截止:{{new Date(item.deadline).toHawkString()}}</div>
                    </div>
                    <div class="block_item_title_t2 clearfix">
                        <div>{{who(item.creator).name}}创建于{{new Date(item.createdAt).toHawkString()}}</div>
                        <div v-if="item.status=='未完成'||item.status=='已失访'||item.status=='已取消'" class="status_error">
                            {{item.status}}
                        </div>
                        <div v-if="item.status=='已完成'" class="status_success">{{item.status}}</div>
                    </div>
                </div>
                <div class="block_item_con clearfix">
                    <p>拜访人：{{myProfile.name}} &nbsp&nbsp&nbsp&nbsp拜访：客户</p>
                    <p>拜访内容：{{item.content}}</p>
                    <div class="block_item_con_bottom">
                        <div @click="visitDateil(item)">详情</div>
                        <div @click="visitDateil(item)" v-show="item.status=='未完成'">去完成</div>
                    </div>
                </div>
            </div>
        </div>
    </f7-page>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex';
    export default {
        name: "visitseacherresult",
        computed: {
            ...mapGetters([
                'myCompany',
                'myProfile',
                'departmentName',
                'companyRegions',
                'regionName',
                'who'
            ]),
        },

        methods: {

            visitDateil(item){
                this.$f7router.navigate('/client/visitdateil/', {
                    props: {
                        visit: item
                    }
                });
            },
        },

        props: [
            'lastPage',
            'visitRecords'
        ],
    }
</script>

<style scoped>

    .block_con {
    }

    .block_item {
        min-height: 164px;
        background-color: white;
        margin-bottom: 10px;
    }

    .block_item_title {
        padding-top: 14px;
        min-height: 45px;
        border-bottom: 1px solid #d8d8d8;
    }

    .block_item_title_t1 {
        font-weight: bold;
        color: #333333;
    }

    .block_item_title_t1 > div:first-child {
        font-size: 17px;
        float: left;
        margin: 0px 5px 0px 15px;
    }

    .block_item_title_t1 > div:last-child {
        font-size: 13px;
        float: right;
        margin-top: 3px;
        margin-right: 15px;
    }

    .block_item_title_t2 {
        clear: both;
        color: #666666;
        padding-top: 4px;
    }

    .block_item_title_t2 > div:first-child {
        font-size: 12px;
        float: left;
        margin-left: 15px;
    }

    .block_item_title_t2 > div:last-child {
        font-size: 12px;
        float: right;
        margin-right: 15px;
    }

    .block_item_con {
        padding-top: 22px;
        padding-bottom: 10px;
    }

    .block_item_con > p {
        margin: 4px 10px;
        font-size: 13px;
        color: #999999;
        line-height: 17px;
    }

    .warning {
        /*width: 100%;*/
        color: #F96A0E;
        background-color: #FFF5E4;
        font-size: 13px;
        padding: 8px;
    }

    .warning > .icon {
        font-size: 12px;
        margin-bottom: 3px;
    }

</style>
