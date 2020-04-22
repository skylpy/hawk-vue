<template>
    <f7-page>
        <f7-navbar :title="name + '搜索结果'" back-link>
        </f7-navbar>

        <f7-list class="hawk-table">

            <f7-list-item>
                <div slot="inner" class="hawk-table-row hawk-table-caption" style="padding-right: 20px">
                    <div v-for="(item, index) in table_caption"
                         :key="index"
                         :style="index == 0 ? 'min-width: 90px;' : index == 1 ? 'min-width: 65px;max-width: 65px;text-align: center;' : 'overflow: hidden;white-space: nowrap;text-overflow: ellipsis;min-width: 60px;max-width: 60px;'">{{item}}</div>
                </div>
            </f7-list-item>

            <f7-list-item
                v-for="(r, index) in data"
                :key="index"
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

            <f7-list-item v-if="!data || data.length == 0">
                <div slot="inner" class="hawk-table-row hawk-table-nodata">没有数据</div>
            </f7-list-item>

        </f7-list>
    </f7-page>
</template>
<style>
    .noDone {
        color: #ff715a !important;
    }
    .isReject {
        color: #ff715a !important;
    }
    .isDone {
        color: #01b38b !important;
    }
</style>
<script>
export default {
    props: [
        'data',
        'name',
        'shortname'
    ],

    data() {
        return {
            caption: {
                // '支出时间',
                // '应收时间',
                // '应付时间',
                '固定支出': ['编号',  '支出', '摘要（用途）'],
                '应收账款': ['编号',  '账款', '摘要'],
                '应付账款': ['编号',  '账款', '摘要']
            }
        }
    },

    computed: {
    // , '交易时间'
        table_caption() { return this.caption[this.name] || ['编号', '金额', '摘要'] }

    },

    methods: {
        // 已审批驳回的
        isReject(item) {
            let arr = ['审核驳回', '审批驳回', '收付驳回']
            if (arr.find(s => s == item.status)) return true
            return false
        },
        truncate(str) {
            if (!str) return '';
            if (str.length <= 4) return str;
            return str.substring(0, 4) + '...';
        },

        getDetail(item) {
            this.$f7router.navigate('/finance/transaction/', {
                props: {
                    contextType: '_detail',
                    reference: item,
                    name: this.name,
                    shortname: this.shortname,
                }
            });
        },
    }
}
</script>
