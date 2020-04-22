<template>
    <f7-page :page-content="false" @page:reinit="load">
        <f7-navbar title="日报管理" back-link>
            <f7-nav-right>
                <f7-link @click="$f7router.navigate('/office/report/')">写日报</f7-link>
                <f7-link @click="(popup.filter = true)">
                    <f7-icon fa="filter"></f7-icon>
                </f7-link>
            </f7-nav-right>
        </f7-navbar>

        <f7-toolbar tabbar>
            <f7-link tab-link="#my-report" tab-link-active>我的日报</f7-link>
            <f7-link tab-link="#other-report">下属的日报</f7-link>
        </f7-toolbar>

        <f7-tabs>

            <f7-tab id="my-report" class="page-content" tab-active>
                <f7-list media-list>
                    <f7-list-item
                        v-for="(r, index) in records" :key="index"
                        v-if="r.applicant == myUserId"
                        :title="who(r.applicant).name"
                        link="#"
                        after="详情"
                        @click="goto(r)"
                    >
                        <div slot="after-title" style="margin-left:20px">
                            <f7-chip
                                outline
                                :text="r.content.reportType"
                            ></f7-chip>
                            <f7-chip
                                outline
                                :text="(new Date(r.createdAt)).toHawkDateString()"
                            ></f7-chip>
                            <f7-chip
                                outline
                                :text="r.status=='已通过' ? '已点评' : '未点评'"
                                :color="r.status=='已通过' ? 'green' : (r.status=='已拒绝' ? 'red' : '')"
                            ></f7-chip>
                        </div>
                    </f7-list-item>

                    <p style="width:100%; text-align:center"  slot="after-list">
                        <small style="color:gray">没有更多的日报</small>
                    </p>

                </f7-list>
            </f7-tab>

            <f7-tab id="other-report" class="page-content">
                <f7-list media-list>
                    <f7-list-item
                        v-for="(r, index) in records" :key="index"
                        v-if="r.applicant != myUserId"
                        :title="who(r.applicant).name"
                        link="#"
                        after="详情"
                        @click="goto(r)"
                    >
                        <div slot="after-title" style="margin-left:20px">
                            <f7-chip
                                outline
                                :text="r.content.reportType"
                            ></f7-chip>
                            <f7-chip
                                outline
                                :text="(new Date(r.createdAt)).toHawkDateString()"
                            ></f7-chip>
                            <f7-chip
                                outline
                                :text="r.status=='已通过' ? '已点评' : '未点评'"
                                :color="r.status=='已通过' ? 'green' : (r.status=='已拒绝' ? 'red' : '')"
                            ></f7-chip>
                        </div>
                    </f7-list-item>

                    <p style="width:100%; text-align:center"  slot="after-list">
                        <small style="color:gray">没有更多的日报</small>
                    </p>
                </f7-list>
            </f7-tab>

        </f7-tabs>

        <f7-popup :opened="popup.filter" @popup:closed="popup.filter = false">
            <f7-view><f7-page>
                <f7-navbar title="选择筛选条件">
                    <f7-nav-right>
                        <f7-link href="#" @click="popup.filter = false">确定</f7-link>
                    </f7-nav-right>
                </f7-navbar>

                <f7-block-title>选项</f7-block-title>
                <f7-list>
                    <f7-list-item title="日报类型" smart-select :smart-select-params="{openIn: 'popover'}">
                        <select name="reportType">
                            <option value='全部'>全部</option>
                            <option
                                v-for="(t, index) in myCompany.reportType"
                                :key="index"
                                :value="t"
                            >
                                {{t}}
                            </option>
                        </select>
                    </f7-list-item>
                    <f7-list-item title="状态" smart-select :smart-select-params="{openIn: 'popover'}">
                        <select name="status" class="status">
                            <option value='全部' selected>全部</option>
                            <option value='待审批'>待点评</option>
                            <option value='已通过'>已点评</option>
                        </select>
                    </f7-list-item>
                    <f7-list-item
                        title="提交人"
                        :after="(params.applicant && who(params.applicant).name) || '请选择'"
                        link="#"
                        @click="popup.personnel = true"
                    ></f7-list-item>
                    <f7-list-item
                        title="创建时间起"
                        :after="(params.startTime && params.startTime.toHawkString()) || '请设置时间'"
                        link="#"
                        @click="picker.startTime.open()"
                    ></f7-list-item>
                    <f7-list-item
                        title="创建时间止"
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
                @cancel="(this.popup.personnel = false)"
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
                reportType: '全部',
                status: '全部',
                applicant: '',
                startTime: new Date(Date.now() - 7*24*3600*1000),
                endTime: new Date()
            },

            popup: {
                personnel: false,
                filter: false
            },

            picker: {
                startTime: null,
                endTime: null
            },

            records: []
        }
    },

    computed: {
        ...mapGetters([
            'myCompany',
            'myProfile',
            'myUserId',
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

        $('select[name="reportType"]').change(() => {
            this.params.reportType = $('select[name="reportType"] option:checked').attr('value');
            this.$f7.popover.close('.smart-select-popover');
        });

        if (!this.picker.startTime) {
            this.picker.startTime = createDateTimePicker(
                this.$f7,
                (date) => { this.params.startTime = date },
                this.params.startTime
            );
        }

        if (!this.picker.endTime) {
            this.picker.endTime = createDateTimePicker(
                this.$f7,
                (date) => { this.params.endTime = date },
                this.params.endTime
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
                this.params.applicant = pList[0];
            }
            this.popup.personnel = false;
        },

        goto(report) {
            this.records = [];
            this.$f7router.navigate('/office/report/', {
                props: {
                    lastPage: '日报管理',
                    reference: report
                }
            });
        },

        load() {
            this.busy();
            this.records = [];
            let filters = { category: '日报' };

            if (this.params.status && this.params.status != '全部') { filters.status = this.params.status }
            if (this.params.applicant) {filters.applicant = this.params.applicant }
            if (this.params.startTime) {filters.createdAfter = this.params.startTime.getTime() }
            if (this.params.endTime) {filters.createdBefore = this.params.endTime.getTime() }

            let content = {};
            if (this.params.reportType && this.params.reportType != '全部') { content.reportType = this.params.reportType }
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
