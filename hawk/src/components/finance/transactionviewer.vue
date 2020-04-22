<template>
    <f7-page @page:reinit="initLoad">
        <f7-navbar :title="curContext.name" back-link>
            <f7-nav-right>
                <f7-link href="#" @click="search">详细搜索</f7-link>
                <f7-link href="javascript:void(0);" @click="selectMonth">历史记录</f7-link>
                <!--<f7-link v-if="display == 'history'" href="#" @click="selectMonth">时间筛选</f7-link>-->
            </f7-nav-right>
        </f7-navbar>

        <f7-list class="hawk-table">
            <f7-list-item>
                <div slot="inner" class="hawk-table-row hawk-table-caption" style="padding-right: 20px">
                    <div
                        v-for="(item, index) in curContext.caption"
                        :key="index"
                        :style="index == 0 ? 'min-width: 90px;' : index == 1 ? 'min-width: 65px;max-width: 65px;text-align: center;' : 'overflow: hidden;white-space: nowrap;text-overflow: ellipsis;min-width: 60px;max-width: 60px;'"
                    >{{item}}</div>
                </div>
            </f7-list-item>

            <f7-list-item divider>
            </f7-list-item>

            <template v-for="d in getDates()">
                <f7-list-item divider :key="d + 'x'">
                </f7-list-item>

                <f7-list-item :key="d + 'y'">
                    <div slot="inner" class="hawk-table-grouptitle">{{ dateStr(d) }}</div>
                </f7-list-item>

                <f7-list-item
                    v-for="(r, index) in getData(d)"
                    :key="d + index"
                    link="#"
                    @click="getDetail(r)"
                >
                    <div slot="inner" class="hawk-table-row" :class="{isReject:isReject(r),isDone:r.status=='已完成'}">
                        <div style="min-width: 90px;">{{ r.code }}</div>
                        <!--<div style="min-width: 65px;">{{ (new Date(r.createdAt)).toHawkTimeString() }}</div>-->

                        <div style="min-width: 65px;max-width: 65px;text-align: center;">{{ r.amount }}</div>
                        <div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;min-width: 60px;max-width: 60px;">
                            {{ truncate(r.summary) }}
                        </div>
                    </div>
                </f7-list-item>

            </template>

        </f7-list>

        <f7-fab
            class="hawk-action-btn-float"
            position="right-bottom"
            slot="fixed"
            @click="add"
        >
            <f7-icon ios="f7:add" md="material:add"></f7-icon>
        </f7-fab>

        <infinite-loading @infinite="onInfinite" :identifier="identifier" style="margin-bottom: 50px">
            <span slot="no-more">
                已加载完所有内容
            </span>
        </infinite-loading>
    </f7-page>
</template>
<style scoped>
    .isReject {
        color: #ff715a !important;
    }
    .isDone {
        color: #01b38b !important;
    }
</style>
<script>
import { createMonthPicker } from 'lib/datetime.js';
import axios from 'axios';
import InfiniteLoading from 'vue-infinite-loading';

export default {
    components: { InfiniteLoading },
    props: ['contextType', 'which'],

    data() {
        return {
            records: [],
            ctx: '',
            //'支出时间',, '应收时间', '应付时间'
            context: {
                fixedCost: {
                    name: '固定支出',
                    shortname: '支出',
                    caption: ['编号', '支出', '摘要（用途）'],
                    code: 'GZ'
                },
                receivable: {
                    name: '应收账款',
                    shortname: '应收',
                    caption: ['编号', '账款', '摘要'],
                    code: 'YS'
                },
                payable: {
                    name: '应付账款',
                    shortname: '应付',
                    caption: ['编号', '账款', '摘要'],
                    code: 'YF'
                }
            },
            page: 1,
            totalpage: 1,
            identifier: 0,
            dpicker: null,
            display: 'now',
        }
    },

    computed: {
        curContext() { return this.context[this.ctx] || {} },

        thisYear() { return (new Date()).getFullYear() + '' },
        thisMonth() { return (new Date()).toHawkDateString().split('-')[1] }
    },

    mounted: function() {
        this.ctx = this.contextType;
        this.load();
        this.dpicker = createMonthPicker(this.$f7, this.load, true);

        if (this.which) {
            this.$nextTick(() => {
                this.selectMonth()
            })
        }
    },

    methods: {
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
        selectMonth() {
            this.display = 'history';
            this.records = [];
            this.page = 1;
            this.totalpage = 1;
            this.dpicker.open();
        },

        truncate(str) {
            if (!str) return '...';
            if (str.length <= 4) return str;
            return str.substring(0, 4) + '...';
        },

        search() {
            this.$f7router.navigate('/finance/transaction/', {
                props: {
                    contextType: '_search',
                    name: this.curContext.name,
                    shortname: this.curContext.shortname,
                    reference: { code: this.curContext.code }
                }
            });
        },

        add() {
            this.$f7router.navigate('/finance/transaction/', {
                props: {
                    contextType: '_new',
                    name: this.curContext.name,
                    shortname: this.curContext.shortname,
                    reference: { code: this.curContext.code }
                }
            });
        },

        dateStr(d) {
            // console.log(d);
            if (d) return `${d.split('-')[0]}年${d.split('-')[1]}月`;
        },

        getData(date) {
            if (!date) return [];
            return this.records.filter(r => {
                return (r.date.includes(date))
            });
        },

        getDates() {
            let ds = new Set();
            this.records.forEach(r => {
                ds.add(`${r.date.split('-')[0]}-${r.date.split('-')[1]}`);
            });
            let arr = Array.from(ds).sort()
            return arr;
        },

        getDetail(item) {
            this.$f7router.navigate('/finance/transaction/', {
                props: {
                    contextType: '_detail',
                    name: this.curContext.name,
                    shortname: this.curContext.shortname,
                    reference: item
                }
            });
        },

        onInfinite ($state) {
            if (this.page < this.totalpage) {
                this.page++;
                // console.log(this.page);
                let cb = (isFnish) => {
                    if (isFnish) {
                        $state.loaded();
                        $state.complete();
                    } else {
                        $state.loaded();
                    }
                }
                this.load($state, cb);
            } else {
                $state.loaded();
                $state.complete();
            }
        },

        async load(e, cb) {
            let filters = {
                date: {
                    from: `${this.thisYear}-${this.thisMonth}-01`
                },
                code: this.curContext.code
            }

            if (this.display == 'history') {
                if (!this.dpicker) return;
                let value = this.dpicker.value;
                let dfrom = value[0] + '-' + value[1] + '-01',
                    dto = value[0] + '-' + value[1] + '-31';

                filters.date = { from: dfrom, to: dto };
            }

            let page = {
                page: this.page,
                limit: 10
            }

            if (typeof cb != "function") $preloader.show();
            await axios.get(`api/finance/transaction?q=${JSON.stringify(filters)}&p=${JSON.stringify(page)}`).then(resp => {
                this.records = this.records.concat(resp.data.list);
                this.page = resp.data.page;
                this.totalpage = resp.data.totalpage || 1;
                if (typeof cb === "function") {
                    cb(this.page >= this.totalpage || resp.data.list.length == 0);
                } else {
                    $preloader.hide();
                    this.identifier++;
                }
            }).catch(err => {
                if (typeof cb != "function") $preloader.hide();
                console.log(err);
                $alert('无法更新数据', '操作错误');
            })
        },

        initLoad () {
            this.records = [];
            this.page = 1;
            this.totalpage = 1;
            this.load();
        }
    }
}
</script>

