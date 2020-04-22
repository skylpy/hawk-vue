<template>
    <f7-page>
        <f7-navbar :title="title" back-link>
            <f7-nav-right>
                <!--<f7-link href="#" @click="search">详细搜索</f7-link>-->
                <f7-link v-if="display == 'today'" href="#" @click="display = 'history'">历史记录</f7-link>
                <f7-link v-if="display == 'history'" href="#" @click="selectMonth">时间筛选</f7-link>
            </f7-nav-right>
        </f7-navbar>

        <div class="hawk-table-layer">
            <f7-list class="hawk-table">
                <f7-list-item>
                    <div slot="inner" class="hawk-table-row hawk-table-caption">
                        <div>提交时间</div>
                        <div>编号</div>
                        <div style="text-align: center;">{{ shortname }}</div>
                        <div>摘要</div>
                    </div>
                </f7-list-item>

                <template v-for="d in getDates()">
                    <f7-list-item divider :key="d + 'x'">
                    </f7-list-item>

                    <f7-list-item :key="d + 'y'">
                        <div slot="inner" class="hawk-table-grouptitle">{{ dateStr(d)}}</div>
                    </f7-list-item>

                    <f7-list-item
                            v-for="(r, index) in getData(d)"
                            :key="d + index"
                            link="#"
                            @click="getDetail(r)"
                    >
                        <div slot="inner" class="hawk-table-row" :class="{isReject:isReject(r),isDone:r.status=='已完成'}">
                            <div style="min-width: 65px;">{{ (new Date(r.createdAt)).toHawkTimeString() }}</div>
                            <div style="min-width: 90px;">{{ r.code }}</div>

                            <div style="min-width: 65px;text-align: center;">{{ r.amount }}</div>
                            <div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;min-width: 60px;max-width: 60px;">
                                {{ truncate(r.summary) }}
                            </div>
                        </div>
                    </f7-list-item>

                </template>

            </f7-list>

            <template v-if="isShowLoading">
                <infinite-loading @infinite="onInfinite" :identifier="identifier" style="margin-bottom: 50px">
                <span slot="no-more">
                    已加载完所有内容
                </span>
                </infinite-loading>
            </template>
        </div>

        <div class="ledgerlist_footer">
            <div>{{ shortname }}总计: {{ total }} </div>
            <!-- <div>余额: {{ income - expense }}</div> -->
        </div>

    </f7-page>
</template>
<style lang="scss" scoped>
    .noDone {
        color: #ff715a !important;
    }
    .isReject {
        color: #ff715a !important;
    }
    .isDone {
        color: #01b38b !important;
    }
    .hawk-table-layer {
        height: calc(100% - 40px);
        overflow: auto;
    }
    .ledgerlist_footer {
        width: 100%;
        display: flex;
        height: 40px;
        align-items: center;
        padding-left: 15px;
        background: white;
        box-sizing: border-box;

        font: {
            size: 14px;
            weight: 500;
        }

        border-top: solid 1px rgba(216,216,216,1);

        & > div {
          flex-grow: 1;
        }
    }
</style>
<script>
import { createMonthPicker } from 'lib/datetime.js';
import axios from 'axios';
import InfiniteLoading from 'vue-infinite-loading';

const types = ['S','Z','YS','YF','GZ']
const typesS = ['S','YS']
const typesZ = ['Z','YF','GZ']
export default {
    components: { InfiniteLoading },
    props: [
        'code', 'data'
    ],

    data() {
        return {
            records: [],
            display: 'today', // today or history
            dpicker: null,
            page: 1,
            totalpage: 1,
            isShowLoading: false,
            amountTotal: 0,
            identifier: 0
        }
    },

    computed: {
        title() {
            if (this.display == 'today') return '今日' + this.shortname;
            if (this.display == 'history') return this.shortname + '历史记录';
            return '收支列表';
        },

        name() {
            switch(this.code) {
                case 'S': return '收入（借方）';
                case 'Z': return '支出（贷方）';
                default: return '收支（借贷）';
            }
        },

        shortname() {
            switch(this.code) {
                case 'S': return '收入';
                case 'Z': return '支出';
                default: return '收支';
            }
        },

        total() {
            if (this.isShowLoading) {
                let amount = this.amountTotal
                return amount;
            } else {
                switch(this.code) {
                    case 'S': return this.income;
                    case 'Z': return this.expense;
                    default: return 0;
                }
            }
        },

        income() {
            return this.records.reduce((accum, r) => { return accum + (typesS.find(t=>r.code.startsWith(t)) ? r.amount : 0) }, 0);
        },

        expense() {
            return this.records.reduce((accum, r) => { return accum + (typesZ.find(t=>r.code.startsWith(t)) ? r.amount : 0) }, 0);
        }
    },

    mounted: function() {
        this.records = Object.assign([], this.data);
        this.dpicker = createMonthPicker(this.$f7, this.load, true);
    },

    methods: {
        // 已审批驳回的
        isReject(item) {
            let arr = ['审核驳回', '审批驳回', '收付驳回']
            if (arr.find(s => s == item.status)) return true
            return false
        },
        selectMonth() {
            this.records = [];
            this.page = 1;
            this.totalpage = 1;
            this.dpicker.open();
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
            if (!this.dpicker) return;
            let value = this.dpicker.value;
            let dfrom = value[0] + '-' + value[1] + '-01',
                dto = value[0] + '-' + value[1] + '-31';

            let filters = {
                date: { from: dfrom, to: dto },
                code: this.code,
                status: '已完成'
            };
            let page = {
                page: this.page,
                limit: 10,
                code: this.code
            }

            if (typeof cb != "function") $preloader.show();
            await axios.get(`api/finance/transaction?q=${JSON.stringify(filters)}&p=${JSON.stringify(page)}`).then(resp => {
                this.records = this.records.concat(resp.data.list);
                this.page = resp.data.page;
                this.totalpage = resp.data.totalpage || 1;
                if (resp.data.amount !== undefined) this.amountTotal = resp.data.amount;
                if (typeof cb === "function") {
                    cb(this.page >= this.totalpage || resp.data.list.length == 0);
                } else {
                    $preloader.hide();
                    this.isShowLoading = true;
                    this.identifier++;
                }
            }).catch(err => {
                if (typeof cb != "function") $preloader.hide();

                console.log(err);
                $alert('无法更新数据', '操作错误');
            })
        },

        dateStr(d) {
            if (d) return d.replace('-', '年').replace('-','月') + '日';
        },

        getData(date) {
            if (!date) return [];
            let code =[]
            if(this.code=='S')code = typesS
            if(this.code=='Z')code = typesZ
            return this.records.filter(r => {
                return (r.date == date && code.find(t=>r.code.startsWith(t)))
            });
        },

        getDates() {
            let ds = {};
            this.records.forEach(r => {
                ds[r.date] = true;
            });
            return Object.keys(ds);
        },

        truncate(str) {
            if (!str) return '...';
            if (str.length <= 4) return str;
            return str.substring(0, 4) + '...';
        },

        getDetail(item) {
            this.$f7router.navigate('/finance/transaction/', {
                props: {
                    contextType: '_detail',
                    name: this.name,
                    shortname: this.shortname,
                    reference: item
                }
            });
        },

        search() {
            let self = this;
            let jump = function(name, shortname, code) {
                if (!name || !shortname || !code) return;
                self.$f7router.navigate('/finance/transaction/', {
                    props: {
                        contextType: '_search',
                        name,
                        shortname,
                        reference: { code }
                    }
                });
            };
            if (this.code == 'S') jump('历史收入', '收入', 'S');
            if (this.code == 'Z') jump('历史支出', '支出', 'Z');
            // $dialog.create({
            //     title: '选择项目',
            //     text: '请问您要搜索哪一项？',
            //     buttons: [
            //         { text: '历史收入', onClick: jump('历史收入', '收入', 'S') },
            //         { text: '历史支出', onClick: jump('历史支出', '支出', 'Z') },
            //         { text: '取消', onClick: jump() },
            //     ],
            //     verticalButtons: true,
            // }).open();
        }
    }
}
</script>
