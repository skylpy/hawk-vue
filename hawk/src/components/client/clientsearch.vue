<template>
    <f7-page>
        <f7-navbar :title="pageTitle" back-link></f7-navbar>
        <f7-block-title>选项</f7-block-title>
        <f7-list style="margin: 0px">
            <f7-list-item title="客户编号：">
                <input
                        slot="inner" style="text-align:right; width:70%; height: 28px"
                        type="text" placeholder="请输入"
                        :value="filter.number || ''"
                        @input="filter.number = $event.target.value"
                >
            </f7-list-item>

            <f7-list-item title="客户名称：">
                <input
                        slot="inner" style="text-align:right; width:70%; height: 28px"
                        type="text" placeholder="请输入"
                        :value="filter.name || ''"
                        @input="filter.name = $event.target.value"
                >
            </f7-list-item>

            <f7-list-item
                    title="客户归属："
                    link="#"
                    @click="$f7.popup.open('#clientsearch-personnelselector')"
            >
                <span slot="inner">{{filter_manager()}}</span>
            </f7-list-item>

            <f7-list-item
                    title="客户类型："
                    smart-select :smart-select-params="{openIn: 'sheet',sheetCloseLinkText:'确定'}"
            >
                <select multiple name="clientType" @change="set_filter($event, 'type')">
                    <option
                            :value="t"
                            v-for="(t, i) in myCompany.clientType" :key="i"
                            :selected="filter.type && filter.type.includes(t)"
                    >{{t}}
                    </option>
                </select>
            </f7-list-item>

            <f7-list-item
                    title="客户等级："
                    smart-select :smart-select-params="{openIn: 'sheet',popupCloseLinkText:'关闭',sheetCloseLinkText:'确定'}"
            >
                <select multiple name="clientGrade" @change="set_filter($event, 'grade')">
                    <option
                            :value="g"
                            v-for="(g, i) in myCompany.clientGrade" :key="i"
                            :selected="filter.grade && filter.grade.includes(g)"
                    >{{g}}
                    </option>
                </select>
            </f7-list-item>

            <f7-list-item
                    title="客户区域："
                    smart-select :smart-select-params="{openIn: 'sheet',sheetCloseLinkText:'确定'}"
            >
                <select multiple name="regions" @change="set_filter($event, 'region')">
                    <option
                            :value="r.id"
                            v-for="(r, i) in companyRegions" :key="i"
                            :selected="filter.region && filter.region.includes(r.id)"
                    >{{r.name}}
                    </option>
                </select>
            </f7-list-item>

            <f7-list-item
                    title="客户意向："
                    smart-select :smart-select-params="{openIn: 'sheet',sheetCloseLinkText:'确定'}"
            >
                <select multiple name="clientIntention" @change="set_filter($event, 'intention')">
                    <option
                            :value="int"
                            v-for="(int, i) in myCompany.intentionType" :key="i"
                            :selected="filter.intention && filter.intention.includes(int)"
                    >{{int}}
                    </option>
                </select>
            </f7-list-item>


        </f7-list>

        <f7-popup id="clientsearch-personnelselector">
            <personnelselector @submit="filter_manager" @cancel="$f7.popup.close('#clientsearch-personnelselector')"></personnelselector>
        </f7-popup>

        <!--<f7-popup id="private-filter-personnelselector">-->
            <!--<personnelselector-->
                    <!--@submit="filter_Private"-->
                    <!--@cancel="$f7.popup.close('#private-filter-personnelselector')"-->
            <!--&gt;</personnelselector>-->
        <!--</f7-popup>-->
        <div class="bt_search">
            <div @click="search">搜索</div>
        </div>
    </f7-page>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex';
    import personnelselector from '../gadget/personnelselector.vue';
    import axios from 'axios';

    export default {
        name: "clientsearch",
        components: {
            personnelselector
        },
        props: [
            'classify'
        ],
        data(){
            return {
                filter: {
                    number: '',
                    name: '',
                    type: [],
                    grade: [],
                    region: [],
                    intention: [],
                    manager: [],
                    classify:''
                },
                records:[],
                pageTitle:"搜索客户"
            }
        },
        computed:{
            ...mapGetters([
                'myCompany',
                'myProfile',
                'departmentName',
                'companyRegions',
                'regionName',
                'who'
            ]),
        },
        mounted(){
            this.filter.department = this.myProfile.department
        },
        methods:{
            set_filter(event, cond) {
                if (!event || !cond) return;

                let selected = event.target.selectedOptions;
                this.filter[cond] = [];

                for (let n = 0; n < selected.length; n++) {
                    this.filter[cond].push(selected[n].value);
                }
            },
            filter_manager(pList) {
                if (!pList) {
                    if (this.filter.manager && this.filter.manager instanceof Array) {
                        return this.filter.manager.map(id => this.who(id).name).join(',');
                    }
                    return '';
                } else {
                    this.filter.manager = pList;
                    $f7.popup.close('#clientsearch-personnelselector');
                    this.$forceUpdate()
                }
            },
            search() {
                let filter = Object.assign({}, this.filter);
                Object.keys(filter).forEach(cond => {
                    // remove empty conditions
                    if (!filter[cond]) delete filter[cond];
                    if (filter[cond] instanceof Array && filter[cond].length == 0) delete filter[cond];
                })
                filter.classify = this.classify
                this.$f7router.navigate('/client/clientsearchresult/', {props: {filter}})
            },
        }

    }
</script>

<style scoped>

    .bt_search{
        height: 45px;
        width: 100%;
    }
    .bt_search>div{
        z-index: 1;
        width: 100%;
        height: 45px;
        position: fixed;
        bottom: 0px;
        background-color: #01b38b;
        font-size: 16px;
        color: white;
        text-align: center;
        line-height: 45px;
    }
</style>
