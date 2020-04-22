<template>
    <f7-page @page:reinit="load">
        <f7-navbar title="拜访管理" back-link>
            <f7-nav-right>
                <f7-link @click="$f7router.navigate('/client/visit/')">新增拜访</f7-link>
                <f7-link @click="$f7.popup.open('#visitmgr-filter')">
                    <f7-icon fa="filter"></f7-icon>
                </f7-link>
            </f7-nav-right>
        </f7-navbar>

        <f7-block-title>拜访列表</f7-block-title>
        <f7-card v-for="(r, index) in records" :key="index">
            <f7-card-header class="no-border" style="display:block">
                <f7-chip style="float:right" :text="r.status"></f7-chip>
                <div> {{ r.clientName }} </div>
                <div style="font-size:small; color:gray"> {{who(r.creator).name}} 创建于 {{(new Date(r.createdAt)).toHawkString()}} </div>
            </f7-card-header>
            <f7-card-content>
                <div> 办理人: {{ who(r.executor).name }} </div>
                <div> 拜访内容: {{ r.content }} </div>
                <div> 截止日期: {{ (new Date(r.deadline)).toHawkString() }} </div>
            </f7-card-content>
            <f7-card-footer>
                <f7-link @click="openVisit(r)">详情</f7-link>
            </f7-card-footer>
        </f7-card>

        <div style="width:100%; text-align:center">
            <small style="color:gray">没有更多数据</small>
        </div>

        <f7-popup id="visitmgr-filter">
            <f7-view><f7-page>
                <f7-navbar title="选择筛选条件">
                    <f7-nav-right>
                        <f7-link href="#" @click="onFilterSet">确定</f7-link>
                    </f7-nav-right>
                </f7-navbar>

                <f7-block-title>筛选条件列表</f7-block-title>
                <f7-list>
                    <f7-list-item
                        title="客户"
                        link="#"
                        :after="filter_str('client') || '请选择'"
                        @click="$f7.popup.open('visitmgr-clientselector')"
                    ></f7-list-item>

                    <f7-list-item
                        title="指派人"
                        link="#"
                        :after="filter_str('creator') || '请选择'"
                        @click="openEmployeeSelector('creator')"
                    ></f7-list-item>

                    <f7-list-item
                        title="拜访人"
                        link="#"
                        :after="filter_str('executor') || '请选择'"
                        @click="openEmployeeSelector('executor')"
                    ></f7-list-item>

                    <f7-list-item
                        title="拜访状态"
                        link="#"
                        after="filter.status"
                        smart-select :smart-select-params="{openIn: 'popover', closeOnSelect: true}"
                    >
                        <select @change="filter.status = $event.target.value">
                            <option value="全部">全部</option>
                            <option value="未完成">未完成</option>
                            <option value="已完成">已完成</option>
                            <option value="已失访">已失访</option>
                        </select>
                    </f7-list-item>
                </f7-list>

            </f7-page></f7-view>
        </f7-popup>

        <f7-popup id="visitmgr-personnelselector">
            <personnelselector
                :multiple="true"
                @submit="selectEmployee"
                @cancel="$f7.popup.close('#visitmgr-personnelselector')"
            ></personnelselector>
        </f7-popup>

        <f7-popup id="visitmgr-clientselector">
            <clientselector
                :multiple="true"
                @submit="selectClient"
                @cancel="$f7.popup.close('#visitmgr-clientselector')"
            ></clientselector>
        </f7-popup>

    </f7-page>
</template>

<script>
import {defaultImgUrl} from 'lib/loading';
import {mapGetters, mapActions} from 'vuex';
import personnelselector from 'gadget/personnelselector.vue';
import clientselector from 'gadget/clientselector.vue';
import axios from 'axios';

export default {
    props: [
        'lastPage'
    ],

    components: {
        personnelselector,
        clientselector,
    },

    data() {
        return {
            records: [],

            filter: {
                client: [],
                creator: [],
                executor: [],
                status: '全部'
            },

            clientList: []
        }
    },

    computed: {
        ...mapGetters([
            'who'
        ])
    },

    mounted() {
        this.load();
    },

    methods: {
        filter_str(item) {
            if (item == 'client') {
                if (this.clientList.length == 0) return '';
                if (this.clientList.length == 1) return this.clientList[0].name;
                if (this.clientList.length > 1) return `${this.clientList[0].name}等${this.clientList.length}位`;
            }

            if (item == 'creator' || item == 'executor') {
                let list = this.filter[item];
                if (list.length == 0) return '';
                if (list.length == 1) return this.who(list[0]).name;
                if (list.length > 1) return this.who(list[0]).name + '等' + list.length + '人';
            }
        },

        selectClient(cList) {
            this.clientList = cList;
            filter.client = cList.map(i => i._id);
            $popup.close('#visitmgr-clientselector');
        },

        openEmployeeSelector(item) {
            this.activeItem = item;
            $popup.open('#visitmgr-personnelselector');
        },

        selectEmployee(pList) {
            this.filter[this.activeItem] = pList;
            $popup.close('#visitmgr-personnelselector');
        },

        add() {
            this.$f7router.navigate('/client/visit', { props: { lastPage: '拜访管理' }});
        },

        load() {
            let filter = JSON.parse(JSON.stringify(this.filter));

            // remove empty conditions
            if (filter.status == '全部' || !filter.status) delete filter.status;
            ['client', 'creator', 'executor'].forEach(i => {
                if (filter[i].length == 0) delete filter[i];
            })

            $preloader.show();
            axios.get('/api/visit?q=' + JSON.stringify(filter)).then(resp => {
                $preloader.hide();
                this.records = resp.data;
            }).catch(error => {
                $preloader.hide();
                console.error(error);
                $alert('无法更新数据，请稍后再试', '操作错误');
            })
        },

        onFilterSet() {
            $popup.close('#visitmgr-filter');
            this.records = [];
            this.load();
        },

        openVisit(v) {
            this.$f7router.navigate('/client/visit/', {
                props: {
                    lastPage: '拜访管理',
                    reference: v
                }
            });
        }
    },
}
</script>

