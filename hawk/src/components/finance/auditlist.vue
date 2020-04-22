<template>
    <f7-page @page:beforein="load">
        <f7-navbar title="财务审批" back-link></f7-navbar>
        <f7-toolbar tabbar bottom>
            <f7-link tab-link="#tab-1" color="green" tab-link-active>待我审批的</f7-link>
            <f7-link tab-link="#tab-2" color="green">我发起的</f7-link>
        </f7-toolbar>
        <f7-tabs swipeable>
            <f7-tab id="tab-1" tab-active>
                <div class="tr_con head_con">
                    <div>编号</div>
                    <div>类型</div>
                    <div>提交时间</div>
                    <div></div>
                </div>
                <div class="title_con">
                    <div></div>
                    待审批
                </div>
                <div class="audit_list">
                    <div v-for="(item,key) in records" :key="key"
                         v-if="isPending(item)"
                         @click="getDetail(item)"
                         class="tr_con">
                        <div>{{item.code}}</div>
                        <div>{{item.payment}}</div>
                        <div>{{item.date}}</div>
                        <div><img class="right_icon" src="../../assets/images/arrow_right_gray@2x.png"></div>
                    </div>
                </div>

                <div class="title_con">
                    <div></div>
                    已审批
                </div>
                <div class="audit_list finish">
                    <div v-for="(item,key) in records" :key="key"
                         v-if="isDone2(item)"
                         @click="getDetail(item)"
                         class="tr_con" :class="{isReject:isReject(item),isDone:item.status=='已完成'}">
                        <div>{{item.code}}</div>
                        <div>{{item.payment}}</div>
                        <div>{{item.date}}</div>
                        <div><img class="right_icon" src="../../assets/images/arrow_right_gray@2x.png"></div>
                    </div>
                </div>
            </f7-tab>
            <f7-tab id="tab-2">
                <div class="tr_con head_con">
                    <div>编号</div>
                    <div>类型</div>
                    <div>提交时间</div>
                    <div></div>
                </div>
                <div class="title_con">
                    <div></div>
                    待审批
                </div>
                <div class="audit_list">
                    <div v-for="(item,key) in records" :key="key"
                         v-if="item.lister==myUserId&&!isDone(item)"
                         @click="getDetail(item)" class="tr_con">
                        <div>{{item.code}}</div>
                        <div>{{item.payment}}</div>
                        <div>{{item.date}}</div>
                        <div><img class="right_icon" src="../../assets/images/arrow_right_gray@2x.png"></div>
                    </div>
                </div>

                <div class="title_con">
                    <div></div>
                    已审批
                </div>
                <div class="audit_list finish">
                    <div v-for="(item,key) in records" :key="key"
                         v-if="item.lister==myUserId&&isDone(item)"
                         @click="getDetail(item)" class="tr_con" :class="{isReject:isReject(item),isDone:item.status=='已完成'}">
                        <div>{{item.code}}</div>
                        <div>{{item.payment}}</div>
                        <div>{{item.date}}</div>
                        <div><img class="right_icon" src="../../assets/images/arrow_right_gray@2x.png"></div>
                    </div>
                    <!--<div class="tr_con">-->
                    <!--<div>Z2028222904</div>-->
                    <!--<div>自定义账款</div>-->
                    <!--<div>2018-12-19 16:00</div>-->
                    <!--<div><img class="right_icon" src="../../assets/images/arrow_right_gray@2x.png"></div>-->
                    <!--</div>-->
                    <!--<div class="tr_con">-->
                    <!--<div>Z2028222904</div>-->
                    <!--<div>自定义账款</div>-->
                    <!--<div>2018-12-19 16:00</div>-->
                    <!--<div><img class="right_icon" src="../../assets/images/arrow_right_gray@2x.png"></div>-->
                    <!--</div>-->

                </div>
            </f7-tab>
        </f7-tabs>
    </f7-page>
</template>
<style>
    .ios .tabbar a.tab-link-active {
        color: #01B38B;
    }

    .swiper-slide {
        overflow-y: auto;
    }
</style>
<style scoped>
    .tr_con {
        /*min-width: 300px;*/
        width: calc(100% - 20px);
        padding: 10px 10px 10px 10px;
        background-color: white;
        border-bottom: 1px solid #D8D8D8;
        color: #666666;
    }

    .isReject {
        color: #ff715a !important;
    }
    .isDone {
        color: #01b38b !important;
    }

    .tr_con > div {
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: pointer;
    }

    .tr_con > div:nth-child(1) {
        /*min-width: 90px;*/
        width: 30%;
    }

    .tr_con > div:nth-child(2) {
        /*min-width: 80px;*/
        width: 24%;
    }

    .tr_con > div:nth-child(3) {
        /*min-width: 110px;*/
        width: 33%;
    }

    .tr_con > div:nth-child(4) {
        min-width: 8px;
        float: right;
    }

    .head_con {
        background-color: white;
        color: black;
        font-weight: bold;
    }

    .title_con {
        height: 35px;
        background-color: white;
        border-bottom: 1px solid #D8D8D8;
        line-height: 35px;
        font-weight: bold;
        margin-top: 10px;
    }

    .title_con > div {
        float: left;
        width: 5px;
        height: 20px;
        margin-top: 7px;
        margin-right: 10px;
        background-color: #01B38B;
    }

    .audit_list > div {
        height: 30px;
        line-height: 30px;
    }

    .finish > div {
        color: #999999;
    }

    .right_icon {
        height: 12px;
    }
</style>
<script>
    import {createMonthPicker} from 'lib/datetime.js';
    import axios from 'axios';
    import InfiniteLoading from 'vue-infinite-loading';
    import {mapGetters, mapActions, mapMutations} from 'vuex';

    export default {
        components: {InfiniteLoading},
        props: [
            'code', 'data'
        ],

        data() {
            return {
                records: [],
            }
        },

        computed: {
            ...mapGetters([
                'who',
                'myUserId'
            ]),
        },

        mounted: function () {
            this.load()
        },

        methods: {
            // 待我审批的
            isPending(item) {
                //item.reviewer==myUserId||item.approver==myUserId||item.bookkeeper==myUserId
                if (item.reviewer == this.myUserId && item.status == '待审核') {
                    return true
                }
                if (item.approver == this.myUserId && item.status == '已审核') {
                    return true
                }
                if (item.bookkeeper == this.myUserId && (item.status == '已审批' || item.status == '收付款')) {
                    return true
                }
                return false
            },
            isDone2(item) {
                let flag = false
                if (item.reviewer == this.myUserId && (item.status == '已审核' || item.status == '审核驳回' || item.status == '已审批' || item.status == '审批驳回' || item.status == '已完成' || item.status == '收付驳回')) {
                    flag = this.getAuditSataus(item, '已审核') || flag
                    flag = this.getAuditSataus(item, '审核驳回') || flag
                }
                if (item.approver == this.myUserId && (item.status == '已审批' || item.status == '审批驳回' || item.status == '已完成' || item.status == '收付驳回')) {
                    flag = this.getAuditSataus(item, '已审批') || flag
                    flag = this.getAuditSataus(item, '审批驳回') || flag
                }
                if (item.bookkeeper == this.myUserId && (item.status == '已完成' || item.status == '收付驳回')) {
                    flag = this.getAuditSataus(item, '已完成') || flag
                    flag = this.getAuditSataus(item, '收付驳回') || flag
                }
                return flag
            },
            getAuditSataus(item, status) {
                let currStatus = item.status
                let arr = ['已审核', '已审批', '收付款', '已完成'];
                let Err = ['审核驳回', '审批驳回', '收付驳回'];

                let index = Err.indexOf(currStatus)
                if (index >= 0 && Err[index] == status) {
                    return 'reject'
                }
                index = (index >= 0) ? index : arr.indexOf(currStatus)
                arr = arr.splice(0, index + 1)
                if (arr.find(s => s == status)) {
                    return 'pass'
                } else {
                    return false
                }

                // let arr = ['待审核','驳回中','撤回中','已审核','已审批','收付款','已确认 ','已完成']
            },
            // 已审批的
            isDone(item) {
                let arr = ['审核驳回', '审批驳回', '收付驳回', '已完成']
                if (arr.find(s => s == item.status)) return true
                return false
            },
            // 已审批驳回的
            isReject(item) {
                let arr = ['审核驳回', '审批驳回', '收付驳回']
                if (arr.find(s => s == item.status)) return true
                return false
            },
            load(e, cb) {
                let filters = {}
                axios.get(`api/finance/transaction?q=${JSON.stringify(filters)}`).then(resp => {
                    this.records = resp.data
                }).catch(err => {
                    console.log(err);
                    $alert('无法更新数据', '操作错误');
                })
            },

            getDetail(item) {
                let name = ''
                let shortname = ''
                if (/^GZ/.test(item.code)) {
                    name = '固定支出'
                    shortname = '支出'
                }
                if (/^YS/.test(item.code)) {
                    name = '应收账款'
                    shortname = '应收'
                }
                if (/^YF/.test(item.code)) {
                    name = '应付账款'
                    shortname = '应付'
                }
                this.$f7router.navigate('/finance/transaction/', {
                    props: {
                        contextType: '_detail',
                        name,
                        shortname,
                        reference: item
                    }
                });
            },
        }
    }
</script>
