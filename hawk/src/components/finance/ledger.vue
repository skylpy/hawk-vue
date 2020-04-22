<template>
    <f7-page>
        <f7-navbar title="公司总账" back-link>
            <f7-nav-right>
                <f7-link href="#" @click="search">详细搜索</f7-link>
            </f7-nav-right>
        </f7-navbar>

        <f7-list style="margin-top:0">
            <f7-list-item divider></f7-list-item>

            <f7-list-item>
                <div slot="inner" class="balance">
                    <div class="balance-title">
                        <div>
                            <div>今日收入</div>
                            <div>{{ income }}</div>
                        </div>
                        <div>
                            <div>今日支出</div>
                            <div>{{ expense }}</div>
                        </div>
                        <div>
                            <div>结存余额</div>
                            <div>{{ balance }}</div>
                        </div>
                    </div>

                    <div class="balance-notes">财务数据实时进行更新</div>
                </div>
            </f7-list-item>

            <f7-list-item
                link="#"
                title="收入列表"
                @click="gotoList('S')"
            >
            </f7-list-item>

            <f7-list-item
                link="#"
                title="支出列表"
                @click="gotoList('Z')"
            >
            </f7-list-item>
        </f7-list>

    </f7-page>
</template>

<style lang="scss" scoped>
.balance {
    width: 100%;
    background: url('../../assets/images/rectangle_green@2x.png') bottom center no-repeat;
    background-size: cover;
    height: 150px;
    color: white;
    position: relative;

    .balance-title {
        width: 100%;
        display: flex;
        text-align: center;
        top: 45px;
        position: absolute;
        font-weight: 500;

        & > div {
            flex-grow: 1;
        }

        & > div:nth-of-type(-n+3) {
            border-right: solid 1px rgba($color: white, $alpha: 0.5)
        }
    }

    .balance-notes {
        position: absolute;
        bottom: 8px;
        width: 100%;
        text-align: center;
        font-size: 11px;
        font-weight: 400;
    }
}
</style>


<script>
import axios from 'axios';
const types = ['S','Z','YS','YF','GZ']
const typesS = ['S','YS']
const typesZ = ['Z','YF','GZ']
export default {
    data() {
        return {
            records: [],
            balance: '更新中'
        }
    },

    computed: {
        income() {
            return this.records.reduce((accum, r) => { return accum + (typesS.find(t=>r.code.startsWith(t)) ? r.amount : 0) }, 0).toFixed(2);
        },

        expense() {
            return this.records.reduce((accum, r) => { return accum + (typesZ.find(t=>r.code.startsWith(t)) ? r.amount : 0) }, 0).toFixed(2);
        },
    },

    mounted() {
        this.load();
    },

    methods: {
        gotoList(code) {
            this.$f7router.navigate('/finance/ledgerlist/', {
                props: {
                    code: code,
                    data: this.records
                }
            })
        },

        search() {
            let self = this;
            let jump = function(name, shortname, code) {
                return function(dialog, e) {
                    dialog.close();

                    if (!name || !shortname || !code) return;

                    self.$f7router.navigate('/finance/transaction/', {
                        props: {
                            contextType: '_search',
                            name,
                            shortname,
                            reference: { code, status: '已完成'},
                        }
                    });
                };
            };

            // const types = ['S','Z','YS','YF','GZ']
            // const typesS = ['S','YS']
            // const typesZ = ['Z','YF','GZ']

            $dialog.create({
                title: '选择项目',
                text: '请问您要搜索哪一项？',
                buttons: [
                    { text: '收入', onClick: jump('历史收入', '收入', 'S') },
                    { text: '支出', onClick: jump('历史支出', '支出', 'Z') },
                    { text: '应收', onClick: jump('历史收入', '应收', 'YS') },
                    { text: '应付', onClick: jump('历史支出', '应付', 'YF') },
                    { text: '固定支出', onClick: jump('历史支出', '固定支出', 'GZ') },
                    { text: '取消', onClick: jump() },
                ],
                verticalButtons: true,
            }).open();
        },

        load() {
            let filters = {
                date: (new Date()).toHawkDateString(),
                code: types.join('|'),
                status: '已完成'
            };

            $preloader.show();
            axios.get('api/finance/transaction?q=' + JSON.stringify(filters)).then(resp => {
                this.records = [];

                this.records = resp.data.filter(item=>item.code.search('ZD')==-1); //过滤掉财务录入新增账款
                $preloader.hide();
            }).catch(err => {
                $preloader.hide();
                console.log(err);
                $alert('无法更新数据', '操作错误');
            })

            axios.get('api/company/balance').then(resp => {
                this.balance = resp.data.balance.toFixed(2);
            }).catch(err => {
                console.log(err);
                this.balance = '无法更新数据';
            })
        }
    }
}
</script>
