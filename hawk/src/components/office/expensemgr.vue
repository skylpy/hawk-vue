<template>
    <f7-page @page:reinit="load">
        <f7-navbar title="费用报销" back-link>
            <f7-nav-right>
                <f7-link @click="$f7router.navigate('/office/expense/')">新建</f7-link>
            </f7-nav-right>
        </f7-navbar>

        <f7-list style="background-color:aliceblue; margin-top:5px">
            <f7-list-item title="状态" smart-select :smart-select-params="{openIn: 'popover'}">
                <f7-icon slot="media" fa="list"></f7-icon>
                <select name="status" class="status">
                    <option value='全部' selected>全部</option>
                    <option value='待审批'>待审批</option>
                    <option value='已通过'>已通过</option>
                    <option value='已拒绝'>已拒绝</option>
                </select>
            </f7-list-item>
            <f7-list-item
                title="条件筛选"
                link="#"
                after="设置"
                @click="popup.condition = true"
            >
                <f7-icon slot="media" fa="filter"></f7-icon>
            </f7-list-item>
            <f7-list-item style="display:inline-block">
                <f7-chip v-if="params.project" slot="inner" outline :text="params.project" color="blue" style="margin-right: 5px"></f7-chip>
                <f7-chip v-if="params.expenseType != '全部'" slot="inner" outline :text="params.expenseType" color="blue" style="margin-right: 5px"></f7-chip>
                <f7-chip v-if="params.applicant" slot="inner" outline :text="who(params.applicant).name" color="blue" style="margin-right: 5px"></f7-chip>
                <f7-chip v-if="params.approver" slot="inner" outline :text="who(params.approver).name" color="blue" style="margin-right: 5px"></f7-chip>

                <f7-chip
                    v-if="params.startTime || params.endTime"
                    slot="inner"
                    text="申请时间"
                    media-bg-color="blue">
                    <f7-icon slot="media" fa="clock-o"></f7-icon>
                </f7-chip>

            </f7-list-item>
        </f7-list>

        <f7-block-title>报销单列表</f7-block-title>
        <f7-block v-if="records.length < 1">
            没有任何报销单
        </f7-block>
        <f7-list v-else media-list>
            <f7-list-item
                v-for="(r, index) in records" :key="index"
                :title="who(r.applicant).name"
                link="#"
                after="详情"
                @click="goto(r)"
            >
                <div slot="after-title" style="margin-left:20px">
                    <f7-chip
                        outline
                        :text="r.content.expenseType"
                    ></f7-chip>
                    <f7-chip
                        outline
                        :text="(new Date(r.createdAt)).toHawkDateString()"
                    ></f7-chip>
                    <f7-chip
                        outline
                        :text="r.status"
                        :color="r.status=='已通过' ? 'green' : (r.status=='已拒绝' ? 'red' : '')"
                    ></f7-chip>
                </div>
            </f7-list-item>
        </f7-list>

        <f7-popup :opened="popup.condition" @popup:closed="popup.condition = false">
            <f7-view><f7-page>
                <f7-navbar title="选择筛选条件">
                    <f7-nav-right>
                        <f7-link href="#" @click="popup.condition = false">确定</f7-link>
                    </f7-nav-right>
                </f7-navbar>

                <f7-list>
                    <f7-list-item title="项目名称">
                        <textarea
                            slot = "inner"
                            class="resizable"
                            style="width:80%; text-align:right"
                            placeholder="请填写项目名称(30字内)"
                            maxlength="20"
                            :value="params.project"
                            @input="params.project = $event.target.value"
                        ></textarea>
                    </f7-list-item>
                    <f7-list-item
                        title="费用类型"
                        smart-select
                        :smart-select-params="{openIn: 'popover'}"
                    >
                        <select name="expenseType">
                            <option value='全部'>全部</option>
                            <option
                                v-for="(t, index) in myCompany.expenseType"
                                :key="index"
                                :value="t"
                            >
                                {{t}}
                            </option>
                        </select>
                    </f7-list-item>
                    <f7-list-item
                        title="申请人"
                        :after="(params.applicant && who(params.applicant).name) || '请选择申请人'"
                        link="#"
                        @click="(popup.applicant = true) && (popup.personnel = true)"
                    ></f7-list-item>
                    <f7-list-item
                        title="审批人"
                        :after="(params.approver && who(params.approver).name) || '请选择审批人'"
                        link="#"
                        @click="(popup.approver = true) && (popup.personnel = true)"
                    ></f7-list-item>
                    <f7-list-item
                        title="开始时间"
                        :after="(params.startTime && params.startTime.toHawkString()) || '请设置时间'"
                        link="#"
                        @click="picker.startTime.open()"
                    ></f7-list-item>
                    <f7-list-item
                        title="结束时间"
                        :after="(params.endTime && params.endTime.toHawkString()) || '请设置时间'"
                        link="#"
                        @click="picker.endTime.open()"
                    ></f7-list-item>
                </f7-list>
            </f7-page></f7-view>

        </f7-popup>


        <f7-popup :opened="popup.personnel" @popup:closed="popup.personnel = false">
            <personnelselector
                :multiple="false"
                @submit="selectEmployee"
                @cancel="cancelEmployee"
            ></personnelselector>
        </f7-popup>

    </f7-page>
</template>

<script>
import {createDateTimePicker} from 'lib/datetime';
import personnelselector from 'gadget/personnelselector.vue';
import {mapGetters, mapActions} from 'vuex';
import axios from 'axios';

export default {
    components: {
        personnelselector
    },

    props: {
        lastPage: {
            type: String,
            default: '上一页'
        },
    },

    data() {
        return {
            params: {
                status: '全部',
                project: '',
                expenseType: '全部',
                applicant: '',
                approver: '',
                startTime: '',
                endTime: ''
            },

            picker: {
                startTime: null,
                endTime: null
            },

            popup: {
                applicant: false,
                approver: false,

                personnel: false,
                condition: false
            },

            records: []
        }
    },

    computed: {
        ...mapGetters([
            'myCompany',
            'who'
        ]),
    },

    watch: {
        params: {
            deep: true,
            handler: function () {
                this.load();
            }
        },
    },

    mounted() {
        $('select[name="status"]').change(() => {
            this.params.status = $('select[name="status"] option:checked').attr('value');
            this.$f7.popover.close('.smart-select-popover');
        });

        $('select[name="expenseType"]').change(() => {
            this.params.expenseType = $('select[name="expenseType"] option:checked').attr('value');
            this.$f7.popover.close('.smart-select-popover');
        });

        if (!this.picker.startTime) {
            this.picker.startTime = createDateTimePicker(
                this.$f7,
                (date) => { this.params.startTime = date },
                new Date(Date.now() - 7*24*3600*1000)
            );
        }

        if (!this.picker.endTime) {
            this.picker.endTime = createDateTimePicker(
                this.$f7,
                (date) => { this.params.endTime = date },
                new Date()
            );
        }

    },

    methods: {
        alert(s, t, cb) {
            $alert(s, t, cb);
        },

        busy() {
            $preloader.show();
        },

        nobusy(s, t, cb) {
            $preloader.hide();
            if (s) {
                this.alert(s, t, cb);
            }
        },

        selectEmployee(pList) {
            if (pList && pList[0]) {
                if (this.popup.applicant) {
                    this.params.applicant = pList[0];
                } else if (this.popup.approver) {
                    this.params.approver = pList[0];
                }
            }
            this.popup.applicant = false;
            this.popup.approver = false;
            this.popup.personnel = false;
        },

        cancelEmployee() {
            this.popup.applicant = false;
            this.popup.approver = false;
            this.popup.personnel = false;
        },

        goto(expense) {
            this.records = [];
            this.$f7router.navigate('/office/expense/', {
                props: {
                    lastPage: '费用报销',
                    reference: expense
                }
            });
        },

        load() {
            this.busy();
            this.records = [];
            let filters = { category: '报销' };

            if (this.params.status && this.params.status != '全部') { filters.status = this.params.status }
            if (this.params.applicant) {filters.applicant = this.params.applicant }
            if (this.params.approver) {filters.approver = this.params.approver }
            if (this.params.startTime) {filters.createdAfter = this.params.startTime.getTime() }
            if (this.params.endTime) {filters.createdBefore = this.params.endTime.getTime() }

            let content = {};
            if (this.params.project) { content.project = this.params.project }
            if (this.params.expenseType && this.params.expenseType != '全部') { content.expenseType = this.params.expenseType }
            if (Object.keys(content).length > 0) { filters.content = content }

            axios.get('api/application?q=' + JSON.stringify(filters)).then(resp => {
                this.records = resp.data;
                this.nobusy();
            }).catch(err => {
                console.error(err);
                this.nobusy('无法更新数据，请稍后再试');
            });
        }
    }
}
</script>
