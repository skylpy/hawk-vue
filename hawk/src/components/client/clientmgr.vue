<template>
    <f7-page @page:beforein="()=>load()">
        <f7-navbar title="客户管理" back-link>
            <f7-nav-right>
                <!--<f7-link @click="$f7router.navigate('/office/task/')">新增客户</f7-link>-->
                <!--<f7-link @click="$f7.popup.open('#clientmgr-filter')">-->
                <f7-link @click="searchClient">
                    详细搜索
                </f7-link>
            </f7-nav-right>
        </f7-navbar>

        <f7-toolbar tabbar labels>
            <f7-link tab-link="#client" id="clientToolBar" tab-link-active>
                <img class="tab-icon tab-icon-inactive" alt="icon" :src="toolbar_icon.client">
                <img class="tab-icon tab-icon-active" alt="icon" :src="toolbar_icon.client_active">
                <div class="tab-text">客户</div>
            </f7-link>
            <f7-link tab-link="#business" id="businessToolBar">
                <img class="tab-icon tab-icon-inactive" alt="icon" :src="toolbar_icon.business">
                <img class="tab-icon tab-icon-active" alt="icon" :src="toolbar_icon.business_active">
                <div class="tab-text">商家</div>
            </f7-link>
            <f7-link tab-link="#private" id="privateToolBar" v-if="myProfile.superadmin || isDepartmentAdmin(myProfile._id)">
                <img class="tab-icon tab-icon-inactive" alt="icon" :src="toolbar_icon.private">
                <img class="tab-icon tab-icon-active" alt="icon" :src="toolbar_icon.private_active">
                <div class="tab-text">下属私有</div>
            </f7-link>
        </f7-toolbar>
        <f7-tabs>
            <f7-tab id="client" tab-active>
                <div class="warning">
                    <f7-icon class="icon" f7="info_round"></f7-icon>
                    我的客户和我的商家里面的信息，同事间无法查阅
                </div>
                <ul class="nav_con">
                    <li :class="{nav_active:client_active=='department'}" @click="client_active='department'">部门客户</li>
                    <li :class="{nav_active:client_active=='my'}" @click="client_active='my'">我的客户</li>
                </ul>
                <div v-if="client_active=='department'"  class="f7-list-layer">

                    <f7-list class="f7-list">
                        <!--&& item.manager!=myProfile._id-->
                        <f7-list-item v-for="(item,index) in records" :key="index"
                                      v-if="!item.private && item.classify=='客户资料'"
                                      :title="item.name" :after="regionName(item.region)" link="#"
                                      @click="openClient(item)"></f7-list-item>

                        <div v-show="records.length == 0" class="no_template">
                            <img :src="zero_employee_icon" width="71px" height="84px">
                            <p>暂无数据</p>
                        </div>
                    </f7-list>
                    <!--<img @click="add('客户资料')" class="bt_add" src="../../../src/assets/images/btn_oval_add_green@2x.png">-->
                </div>
                <div v-if="client_active=='my'"  class="f7-list-layer">

                    <f7-list class="f7-list">
                        <f7-list-item v-for="(item,index) in private_records" :key="index"
                                      v-if="item.manager==myProfile._id&&item.private==true  && item.classify=='客户资料'" :title="item.name"
                                      :after="regionName(item.region)" link="#"
                                      @click="openClient(item)"></f7-list-item>
                        <div v-show="records.length == 0" class="no_template">
                            <img :src="zero_employee_icon" width="71px" height="84px">
                            <p>暂无数据</p>
                        </div>
                    </f7-list>

                    <!--<img @click="add()" class="bt_add" src="../../../src/assets/images/btn_oval_add_green@2x.png">-->
                </div>
                <img @click="add(client_active=='department' ? '客户资料' : '')" class="bt_add" src="../../../src/assets/images/btn_oval_add_green@2x.png">
            </f7-tab>

            <f7-tab id="business">
                <div class="warning">
                    <f7-icon class="icon" f7="info_round"></f7-icon>
                    我的客户和我的商家里面的信息，同事间无法查阅
                </div>
                <ul class="nav_con">
                    <li :class="{nav_active:business_active=='department'}" @click="business_active='department'">部门商家
                    </li>
                    <li :class="{nav_active:business_active=='my'}" @click="business_active='my'">我的商家</li>
                </ul>
                <div v-if="business_active=='department'"  class="f7-list-layer">

                    <f7-list class="f7-list">
                        <!--&& item.manager!=myProfile._id-->
                        <f7-list-item v-for="(item,index) in records" :key="index"
                                      v-if="!item.private && item.classify=='商家资料'"
                                      :title="item.name" :after="regionName(item.region)" link="#"
                                      @click="openClient(item)"></f7-list-item>
                        <div v-show="records.length == 0" class="no_template">
                            <img :src="zero_employee_icon" width="71px" height="84px">
                            <p>暂无数据</p>
                        </div>
                    </f7-list>
                    <!--<img @click="add('商家资料')" class="bt_add" src="../../../src/assets/images/btn_oval_add_green@2x.png">-->
                </div>
                <div v-if="business_active=='my'"  class="f7-list-layer">

                    <f7-list class="f7-list">
                        <f7-list-item v-for="(item,index) in private_records" :key="index"
                                      v-if="item.manager==myProfile._id&&item.private  && item.classify=='商家资料'" :title="item.name"
                                      :after="regionName(item.region)" link="#"
                                      @click="openClient(item)"></f7-list-item>
                        <div v-show="records.length == 0" class="no_template">
                            <img :src="zero_employee_icon" width="71px" height="84px">
                            <p>暂无数据</p>
                        </div>
                    </f7-list>
                    <!--<img @click="add()" class="bt_add" src="../../../src/assets/images/btn_oval_add_green@2x.png">-->
                </div>
                <img @click="add(business_active=='department' ? '商家资料' : '')" class="bt_add" src="../../../src/assets/images/btn_oval_add_green@2x.png">
            </f7-tab>

            <f7-tab id="private">
                <div class="warning">
                    <f7-icon class="icon" f7="info_round"></f7-icon>
                    我的客户和我的商家里面的信息，同事间无法查阅
                </div>
                <ul class="nav_con">
                    <li :class="{nav_active:private_active=='client'}" @click="private_active='client'">下属客户</li>
                    <li :class="{nav_active:private_active=='business'}" @click="private_active='business'">下属商家</li>
                </ul>
                <div v-if="private_active=='client'"  class="f7-list-layer">

                    <f7-list class="f7-list">
                        <f7-list-item
                                title="下属员工"
                                :after="privateManagerName() || '请选择'"
                                link="#"
                                @click="selectorPersonnelShow=true"

                        ></f7-list-item>
                        <!--$f7.popup.open('#private-filter-personnelselector')-->
                    </f7-list>
                    <f7-list class="f7-list">
                        <f7-list-item v-for="(item,index) in private_records.filter(v => v.manager !== myProfile._id && (userDepartment(myProfile._id) && !userDepartment(myProfile._id).admin.includes(v.manager)))" :key="index"
                                      v-if="item.classify=='客户资料'&&item.private==true"
                                      :title="item.name" :after="regionName(item.region)" link="#"
                                      @click="openClient(item)"></f7-list-item>
                        <div v-show="private_records.filter(v => v.manager !== myProfile._id).length == 0"  class="no_template">
                            <img :src="zero_employee_icon" width="71px" height="84px">
                            <p>暂无数据</p>
                        </div>
                    </f7-list>
                </div>
                <div v-if="private_active=='business'"  class="f7-list-layer">
                    <f7-list class="f7-list">
                        <f7-list-item
                                title="下属员工"
                                :after="privateManagerName() || '请选择'"
                                link="#"
                                @click="selectorBusinessPersonnelShow=true"

                        ></f7-list-item>
                        <!--$f7.popup.open('#private-filter-personnelselector')-->
                    </f7-list>
                    <f7-list class="f7-list">
                        <f7-list-item v-for="(item,index) in private_records.filter(v => v.manager !== myProfile._id && (userDepartment(myProfile._id) && !userDepartment(myProfile._id).admin.includes(v.manager)))" :key="index"
                                      v-if="item.classify=='商家资料'&&item.private==true" :title="item.name"
                                      :after="regionName(item.region)" link="#"
                                      @click="openClient(item)"></f7-list-item>
                        <div v-show="private_records.filter(v => v.manager !== myProfile._id).length == 0" class="no_template">
                            <img :src="zero_employee_icon" width="71px" height="84px">
                            <p>暂无数据</p>
                        </div>
                    </f7-list>
                </div>
            </f7-tab>
        </f7-tabs>
        <!--<f7-block-title>客户列表</f7-block-title>-->
        <!--<f7-list>-->
        <!--<f7-list-item-->
        <!--v-for="(r, index) in records"-->
        <!--:key="index"-->
        <!--:title="r.name"-->
        <!--link="#"-->
        <!--after="详情"-->
        <!--@click="openClient(r)"-->
        <!--&gt;-->
        <!--<div slot="after-title" style="margin-left:10px">{{regionName(r.region)}}</div>-->
        <!--</f7-list-item>-->
        <!--</f7-list>-->

        <!--<div style="width:100%; text-align:center">-->
        <!--<small style="color:gray">没有更多数据</small>-->
        <!--</div>-->

        <f7-popup id="clientmgr-filter">
            <f7-view>
                <f7-page>
                    <f7-navbar title="选择筛选条件">
                        <f7-nav-right>
                            <f7-link href="#" @click="onFilterSet">确定</f7-link>
                        </f7-nav-right>
                    </f7-navbar>

                    <f7-block-title>选项</f7-block-title>
                    <f7-list>
                        <f7-list-item title="客户编号">
                            <span slot="title" style="color:red"> *</span>
                            <input
                                    slot="inner" style="text-align:right; width:70%"
                                    type="text" placeholder="请填写客户编号"
                                    :value="filter.number || ''"
                                    @input="filter.number = $event.target.value"
                            >
                        </f7-list-item>

                        <f7-list-item title="客户名称">
                            <span slot="title" style="color:red"> *</span>
                            <input
                                    slot="inner" style="text-align:right; width:70%"
                                    type="text" placeholder="请填写客户名称"
                                    :value="filter.name || ''"
                                    @input="filter.name = $event.target.value"
                            >
                        </f7-list-item>

                        <f7-list-item
                                link="#" title="客户类型"
                                smart-select :smart-select-params="{openIn: 'popover'}"
                        >
                            <span slot="title" style="color:red"> *</span>
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
                                link="#" title="客户等级"
                                smart-select :smart-select-params="{openIn: 'popover'}"
                        >
                            <span slot="title" style="color:red"> *</span>
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
                                link="#" title="客户区域"
                                smart-select :smart-select-params="{openIn: 'popover'}"
                        >
                            <span slot="title" style="color:red"> *</span>
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
                                link="#" title="客户意向"
                                smart-select :smart-select-params="{openIn: 'popover'}"
                        >
                            <span slot="title" style="color:red"> *</span>
                            <select multiple name="clientIntention" @change="set_filter($event, 'intention')">
                                <option
                                        :value="int"
                                        v-for="(int, i) in myCompany.intentionType" :key="i"
                                        :selected="filter.intention && filter.intention.includes(int)"
                                >{{int}}
                                </option>
                            </select>
                        </f7-list-item>

                        <f7-list-item
                                title="所属用户"
                                :after="filter_manager() || '请选择'"
                                link="#"
                                @click="$f7.popup.open('#clientmgr-filter-personnelselector')"
                        ></f7-list-item>

                    </f7-list>

                    <f7-popup id="clientmgr-filter-personnelselector">
                        <personnelselector
                                :multiple="true"
                                @submit="filter_manager"
                                @cancel="$f7.popup.close('#clientmgr-filter-personnelselector')"
                        ></personnelselector>
                    </f7-popup>

                    <f7-popup :opened="selectorPersonnelShow" @popup:closed="(selectorPersonnelShow = false)">
                        <personnelselector
                                :multiple="false"
                                :title = "'选择直属员工'"
                                :subordinate="true"
                                @submit="onSelectorPersonne"
                                @cancel="selectorPersonnelShow=false"
                        ></personnelselector>
                    </f7-popup>

                    <f7-popup :opened="selectorBusinessPersonnelShow" @popup:closed="(selectorBusinessPersonnelShow = false)">
                        <personnelselector
                                :multiple="false"
                                :title = "'选择直属员工'"
                                :subordinate="true"
                                @submit="onSelectorBusiness"
                                @cancel="selectorBusinessPersonnelShow=false"
                        ></personnelselector>
                    </f7-popup>
                    <!--<f7-popup id="private-filter-personnelselector">-->
                        <!--<personnelselector-->
                                <!--@submit="filter_Private"-->
                                <!--@cancel="$f7.popup.close('#private-filter-personnelselector')"-->
                        <!--&gt;</personnelselector>-->
                    <!--</f7-popup>-->

                </f7-page>
            </f7-view>
        </f7-popup>

    </f7-page>
</template>
<style scoped>
    .tabs, .tab {
        height: 100%;
    }
    .f7-list-layer {
        width: 100%;
        height: calc(100% - 35px - 50px);
        overflow: auto;
    }
    .bt_add {
        width: 55px;
        height: 55px;
        position: absolute;
        bottom: 50px;
        right: 4px;
        z-index:9999;
    }

    .warning {
        width: 100%;
        height: 35px;
        color: #F96A0E;
        background-color: #FFF5E4;
        font-size: 13px;
        line-height: 35px;

        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap
    }

    .warning > .icon {
        font-size: 14px;
        margin: 8px 4px 12px 12px;
    }

    .nav_con {
        height: 46px;
        background: rgba(255, 255, 255, 1);
        list-style: none;
        padding: 0px;
        margin: 0px;
    }

    .nav_con > li {
        line-height: 46px;
        float: left;
        width: 50%;
        text-align: center;
        font-size: 13px;
        font-weight: bold;
        border-bottom: 2px solid #f0ebeb;
    }

    .nav_con > .nav_active {
        color: #01B38B;
        border-bottom: 2px solid #01B38B;
    }

    .tab-icon {
        width: 25px;
        height: 25px;
        display: block;
        padding-top: 3px;
    }

    .tab-text {
        font-size: 11px;
        line-height: 20px;
        font-weight: bold;
        text-align: center;
    }

    .tab-link .tab-text {
        color: #A8A8A8;
    }

    .tab-link.tab-link-active .tab-text {
        color: #01B38B;
    }

    .tab-icon.tab-icon-active {
        display: none;
    }

    .tab-link.tab-link-active .tab-icon.tab-icon-inactive {
        display: none;
    }

    .tab-link.tab-link-active .tab-icon.tab-icon-active {
        display: block;
    }

    .tab-icon-container {
        position: relative;
    }

    .tab-icon-container .badge {
        position: absolute;
        top: 1px;
        right: -7px;
        display: block;
    }

    .f7-list {
        margin: 10px 0px;
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
</style>
<script>
    import {mapGetters, mapActions} from 'vuex';
    import personnelselector from 'gadget/personnelselector.vue';
    import directlyuserselector from '../gadget/directlyuserselector.vue';
    import axios from 'axios';

    export default {
        components: {
            personnelselector,
            directlyuserselector
        },

        props: [
            'lastPage',
            'which'
        ],

        data() {
            return {
                pickers:{},
                records: [],
                client_active: "department",
                business_active: "department",
                private_active: "business",
                filter: {
                    number: '',
                    name: '',
                    type: [],
                    grade: [],
                    region: [],
                    intention: [],
                    department:'',
                    manager: [],
                    busines: []
                },
                private_filter: {
                    manager: [],
                    busines:[]

                },
                privatebusines:true,
                privateclient:false,
                private_records: [],
                toolbar_icon: {
                    client: require('../../assets/images/icon_client_gray@2x.png'),
                    client_active: require('../../assets/images/icon_client_green@2x.png'),
                    business: require('../../assets/images/icon_business_gray@2x.png'),
                    business_active: require('../../assets/images/icon_business_green@2x.png'),
                    private: require('../../assets/images/icon_private_gray@2x.png'),
                    private_active: require('../../assets/images/icon_private_green@2x.png'),
                },
                selectorPersonnelShow:false,
                selectorBusinessPersonnelShow:false,
                zero_employee_icon: require('assets/images/ill_no_data@2x.png'),
            }
        },

        computed: {
            ...mapGetters([
                'myCompany',
                'myProfile',
                'departmentName',
                'companyRegions',
                'regionName',
                'userDepartment',
                'organization',
                'who',
                'isDepartmentAdmin'
            ]),
        },

        mounted() {

            //this.myProfile.superadmin ? this.organization.departmentId:
            // 超管所有
            if (!this.myProfile.superadmin) {
                let departmentId = this.userDepartment(this.myProfile._id).departmentId
                if (this.isDepartmentAdmin(this.myProfile._id)) {
                    // 部门管理
                    this.filter.department = [departmentId].concat(this.userDepartment(this.myProfile._id).sub.map(v => v.departmentId))
                } else {
                    // 部门普通
                    this.filter.department = departmentId;
                }
            }

            if (this.which) {
                this.$nextTick(() => {
                    if (this.which === 'add') {
                        this.add()
                    } else {
                        document.getElementById(this.which).click()
                    }
                })
            }
        },

        methods: {

             /*
               下属客户
             * */
            onSelectorPersonne(uIds) {
                this.selectorPersonnelShow = false;

                this.private_filter.manager = uIds;

                this.privatebusines = false;
                this.privateclient = true;
                this.load(true)
            },

            /*
              下属商家
            * */
            onSelectorBusiness(uIds) {
                this.selectorBusinessPersonnelShow = false;

                this.private_filter.manager = uIds;
                this.privatebusines = true;
                this.privateclient = false;
                this.load(true)
            },

            onFilterSet() {
                $popup.close('#clientmgr-filter');
                this.load();
            },
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
                    $f7.popup.close('#clientmgr-filter-personnelselector');
                }
            },

            filter_Private(pList) {
                if (pList && pList.length) {
                    this.private_filter.manager = pList;
                    $f7.popup.close('#private-filter-personnelselector');
                    this.load(true)
                }
            },
            privateManagerName(){
                if(this.private_filter.manager&&this.private_filter.manager.length){
                    return this.who(this.private_filter.manager[0]).name
                }else{
                    return '';
                }
            },
            privateBusinessName(){
                if(this.private_filter.busines&&this.private_filter.busines.length){
                    return this.who(this.private_filter.busines[0]).name
                }else{
                    return '';
                }
            },
            load(is_private) {
                console.log(is_private)
                is_private = is_private === true?true:false
                let filter = Object.assign({}, is_private ? this.private_filter : this.filter);

                Object.keys(filter).forEach(cond => {
                    // remove empty conditions
                    if (!filter[cond]) delete filter[cond];
                    if (filter[cond] instanceof Array && filter[cond].length == 0) delete filter[cond];
                })

                $preloader.show();
                axios.get('api/client?q=' + JSON.stringify(filter)).then(resp => {
                    $preloader.hide();
                    console.log(resp.data);
                    this.private_records = [];
                    this.records = []
                    resp.data.map(v => {
                        if (v.private) {
                            this.private_records.push(v)
                        } else {
                            this.records.push(v)
                        }
                    });
                }).catch(err => {
                    $preloader.hide();
                    console.error(err);
                    $alert('无法更新数据，请稍后再试', '操作错误');
                })
            },

            openClient(c) {
                this.$f7router.navigate('/client/client/', {
                    props: {
                        lastPage: '客户管理',
                        reference: c
                    }
                });
            },
            add(classify) {
                console.log("ADD");
                $dialog.create({
                    title: '请问您要新增哪一项？',
                    // text: 'Dialog with vertical buttons',
                    buttons: [
                        {
                            text: '客户资料',
                            onClick: () => {
                                this.$f7router.navigate('/client/client/', {props: {classify: "客户资料"}})
                                console.log("客户资料");
                            }
                        },
                        {
                            text: '商家资料',
                            onClick: () => {
                                this.$f7router.navigate('/client/client/', {props: {classify: "商家资料"}})
                                console.log("商家资料");
                            }
                        },
                        {
                            text: '取消'
                        },
                    ],
                    verticalButtons: true,
                }).open()
            },
            searchClient(){
                $dialog.create({
                    title: '请问您要搜索哪一项？',
                    // text: 'Dialog with vertical buttons',
                    buttons: [
                        {
                            text: '客户',
                            onClick: () => {
                                this.$f7router.navigate('/client/clientsearch/', {props: {classify: "客户资料"}})
                            }
                        },
                        {
                            text: '商家',
                            onClick: () => {
                                this.$f7router.navigate('/client/clientsearch/', {props: {classify: "商家资料"}})
                            }
                        },
                        {
                            text: '取消'
                        },
                    ],
                    verticalButtons: true,
                }).open()
            }
        }
    }
</script>

