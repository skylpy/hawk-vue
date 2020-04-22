<template>
    <f7-page @page:reinit="load">
        <f7-navbar title="财务录入" back-link>
            <f7-nav-right>
                <f7-link href="#" @click="search">详细搜索</f7-link>
            </f7-nav-right>
        </f7-navbar>

        <f7-list class="hawk-table">

            <template v-for="(item, index) in records">

                <f7-list-item divider :key="index + '0'">
                </f7-list-item>

                <f7-list-item :key="index+ '1'">
                    <div slot="inner" class="hawk-card-caption">
                        <div>{{ getShortName(item.code) + ' ' +  item.amount }}</div>
                        <div>{{ (new Date(item.createdAt)).toHawkString() }}</div>
                    </div>
                </f7-list-item>

                <f7-list-item :key="index + '2'">
                    <div slot="inner" class="hawk-card-content">
                        <div>制表人：{{ who(item.lister) && who(item.lister).name || '未知' }}</div>
                        <div>编号：{{ item.code }}</div>
                        <div>经办人：{{ who(item.agent) && who(item.agent).name || '未知' }}</div>
                        <div>摘要：{{ truncate(item.summary) }}</div>

                        <div class="hawk-card-button" :style="{color: item.status == '审核驳回'  ? 'red' : '#01B38B'}" @click="getDetail(item)">详情</div>
                    </div>
                </f7-list-item>

            </template>
            <div v-show="records.length == 0" class="no_template">
                <img :src="zero_employee_icon" width="71px" height="84px">
                <p>暂无数据</p>
            </div>
        </f7-list>

        <f7-fab
            class="hawk-action-btn-float"
            position="right-bottom"
            slot="fixed"
            @click="add"
        >
            <f7-icon ios="f7:add" md="material:add"></f7-icon>
        </f7-fab>

    </f7-page>
</template>

<style lang="scss" scoped>
    .hawk-select-radio {
        display: inline-block;
        padding-right: 10px;
    }

    .sub-department-link {
        padding-left: 15px;
        border-left: solid 1px rgba(216,216,216,1);

        .sub-department {
            width:16px;
            height:16px;
            padding-right:3px
        }
    }
    .no_template{
        text-align: center;
        margin: 120px 0px auto;
    }
    .no_template p{
        font-size: 14px;
        color: #333333;
        margin: 5px 0;
    }

    #hawk-departmentpicker-selected-container {
        display: flex;

        div {
            position: relative;

            .hawk-selected-tag {
                color: #01B38B;
                border: solid 1px #01B38B;
                margin-right: 10px;
            }

            i {
                position: absolute;
                top: -5px;
                right: 5px;
            }
        }
    }
</style>


<script>
import axios from 'axios';
import { mapGetters } from 'vuex';

export default {
    props: ['which'],
    data() {
        return {
            records: [],
            zero_employee_icon: require('assets/images/ill_no_data@2x.png'),
            context: {
                '收入': {
                    name: '收入（借方）',
                    shortname: '收入',
                    code: 'S'
                },
                '支出': {
                    name: '支出（贷方）',
                    shortname: '支出',
                    code: 'Z'
                },
                '自定义': {
                    name: '自定义账款',
                    shortname: '',
                    code: 'ZD'
                }
            }
        }
    },

    computed: {
        ...mapGetters([
            'who'
        ])
    },

    mounted: function() {
        this.load();
        if (this.which) {
            this.$nextTick(() => {
                this[this.which]()
            })
        }
    },

    methods: {
        truncate(summary) {
            if (!summary) return '...';
            if (summary.length < 13) return summary;
            return summary.slice(0, 12) + '...';
        },

        getShortName(code) {
            if (code.startsWith('ZD')) return '其他';
            if (code.startsWith('S')) return '收入';
            if (code.startsWith('Z')) return '支出';
            return '其他';
        },

        getCtx(type) {
            return this.context[type];
        },

        search() {
            let self = this;
            let jump = function(type) {
                return function(dialog, e) {
                    dialog.close();

                    let ctx = self.getCtx(type);
                    if (!type || !ctx) return;

                    self.$f7router.navigate('/finance/transaction/', {
                        props: {
                            contextType: '_search',
                            name: ctx.name,
                            shortname: ctx.shortname,
                            reference: { code: ctx.code }
                        }
                    });
                };
            };

            $dialog.create({
                title: '选择项目',
                text: '请问您要搜索哪一项？',
                buttons: [
                    { text: '收入（借方）', onClick: jump('收入') },
                    { text: '支出（贷方）', onClick: jump('支出') },
                    { text: '自定义账款', onClick: jump('自定义') },
                    { text: '取消', onClick: jump() },
                ],
                verticalButtons: true,
            }).open();
        },

        add() {
            let self = this;
            let jump = function(type) {
                return function(dialog, e) {
                    dialog.close();

                    let ctx = self.getCtx(type);
                    if (!type || !ctx) return;

                    self.$f7router.navigate('/finance/transaction/', {
                        props: {
                            contextType: '_new',
                            name: ctx.name,
                            shortname: ctx.shortname,
                            reference: { code: ctx.code }
                        }
                    });
                };
            };

            $dialog.create({
                title: '选择项目',
                text: '请问您要新增哪一项？',
                buttons: [
                    { text: '收入（借方）', onClick: jump('收入') },
                    { text: '支出（贷方）', onClick: jump('支出') },
                    { text: '自定义账款', onClick: jump('自定义') },
                    { text: '取消', onClick: jump() },
                ],
                verticalButtons: true,
            }).open();
        },

        getDetail(item) {
            if (!item || !item.code) return;

            let ctx = null;
            if (item.code.startsWith('ZD')) ctx = this.getCtx('自定义');
            if (item.code.startsWith('S')) ctx = this.getCtx('收入');
            if (item.code.startsWith('Z')) ctx = this.getCtx('支出');

            if (!ctx) {
                console.error('item context not found!');
                return;
            }

            this.$f7router.navigate('/finance/transaction/', {
                props: {
                    contextType: '_detail',
                    name: ctx.name,
                    shortname: ctx.shortname,
                    reference: item
                }
            });
        },

        load() {
            let filters = {
                date: (new Date()).toHawkDateString(),
                code: 'S|Z|ZD'
            };

            $preloader.show();
            axios.get('api/finance/transaction?q=' + JSON.stringify(filters)).then(resp => {
                this.records = [];

                for(var j = 0, len=resp.data.length; j < len; j++) {

                    let obj = resp.data[j];
                    let reg = RegExp(/GZ/);
                    let reg1 = RegExp(/YF/);
                    let reg2 = RegExp(/YS/);

                    if (obj.code.match(reg)||obj.code.match(reg1)||obj.code.match(reg2)) ;else {
                        this.records.push(obj)
                    }
                }

                // this.records = resp.data;
                $preloader.hide();
            }).catch(err => {
                $preloader.hide();
                console.log(err);
                $alert('无法更新数据', '操作错误');
            })
        }

    }
}
</script>

