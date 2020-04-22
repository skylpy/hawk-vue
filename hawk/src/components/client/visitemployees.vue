<template>
    <f7-page @page:beforein="load">
        <f7-navbar :title="personal.name+'拜访任务'" back-link >
        </f7-navbar>
        <div class="block_con">
            <div class="block_item" v-for="(item,index) in records">
                <div class="block_item_title">
                    <div class="block_item_title_t1">
                        <div>拜访{{item.clientName}}-电话</div><div>截止:{{new Date(item.deadline).toHawkString()}}</div>
                    </div>
                    <div class="block_item_title_t2 clearfix">
                        <div>{{who(item.creator).name}}创建于{{new Date(item.createdAt).toHawkString()}}</div>
                        <div v-if="item.status=='未完成'||item.status=='已失访'||item.status=='已取消'" class="status_error">{{item.status}}</div>
                        <div v-if="item.status=='已完成'" class="status_success">{{item.status}}</div>
                    </div>
                </div>
                <div class="block_item_con clearfix">
                    <p>拜访人：{{personal.name}} &nbsp&nbsp&nbsp&nbsp拜访：客户</p>
                    <p>拜访内容：{{item.content}}</p>
                    <div class="block_item_con_bottom">
                        <div @click="visitDateil(item)">详情</div>
                        <!--<div @click="cancel(item)" v-show="item.status=='未完成'">取消任务</div>-->
                    </div>
                </div>
            </div>
        </div>
        <f7-block v-if="!records.length">
            <div class="no_data">没有拜访工作</div>
        </f7-block>
    </f7-page>
</template>

<script>
    import axios from 'axios'
    import {mapGetters} from 'vuex'
    export default {
        name: "visitemployees",
        props:[
            'uId'
        ],
        data(){
            return {
                records:[],
                personal:[]
            }
        },
        computed: {
            ...mapGetters([
                'who'
            ]),
        },
        mounted(){
            this.load();
            this.personal = this.who(this.uId)
        },
        methods:{
            load() {
                $preloader.show();
                axios.get('/api/visit?q=' + JSON.stringify({executor:[this.uId]})).then(resp => {
                    $preloader.hide();
                    this.records = resp.data;
                }).catch(error => {
                    $preloader.hide();
                    console.error(error);
                    $alert('无法更新数据，请稍后再试', '操作错误');
                })
            },
            visitDateil(item){
                console.log('aaaaaaaaaaaaa')
                this.$f7router.navigate('/client/visitdateil/', {
                    props: {
                        visit: item
                    }
                });
            },

        }
    }
</script>

<style scoped>
    .status_success{
        color: #01b38b;
    }
    .status_warning{
        color: #ffab00;
    }
    .status_error{
        color: #ff715a;
    }
    .block_con{
    }
    .block_item{
        min-height: 164px;
        background-color: white;
        margin-bottom: 10px;
    }
    .block_item_title{
        padding-top: 14px;
        min-height: 45px;
        border-bottom: 1px solid #d8d8d8;
    }
    .block_item_title_t1{
        font-weight: bold;
        color: #333333;
    }
    .block_item_title_t1>div:first-child{
        font-size: 17px;
        float: left;
        margin: 0px 5px 0px 15px;
    }
    .block_item_title_t1>div:last-child{
        font-size: 13px;
        float: right;
        margin-top: 3px;
        margin-right: 15px;
    }
    .block_item_title_t2{
        clear: both;
        color: #666666;
        padding-top: 4px;
    }
    .block_item_title_t2>div:first-child{
        font-size: 12px;
        float: left;
        margin-left: 15px;
    }
    .block_item_title_t2>div:last-child{
        font-size: 12px;
        float: right;
        margin-right: 15px;
    }
    .block_item_con{
        padding-top: 22px;
        padding-bottom: 10px;
    }
    .block_item_con>p{
        margin: 4px 10px;
        font-size: 13px;
        color: #999999;
        line-height: 17px;
    }
    .block_item_con_bottom{
        clear: both;
    }
    .block_item_con_bottom>div:first-child{
        font-size: 12px;
        float: left;
        margin-left: 10px;
        color: #01b38b;
        padding: 4px 0px;
    }
    .block_item_con_bottom>div:last-child{
        font-size: 12px;
        float: right;
        margin-right: 15px;
        border-radius: 12px;
        font-size: 12px;
        color: white;
        background-color: #ff715a;
        padding: 4px 9px;
    }
    .block_finish .block_item_title_t1,.block_finish .block_item_title_t2{
        color: #999999;
    }
    .clearfix:after{
        content: "";
        height: 0;
        line-height: 0;
        display: block;
        visibility: hidden;
        clear: both;
    }
    .clearfix{
        zoom: 1;
    }
</style>
