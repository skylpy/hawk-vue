<template>
    <f7-page>
        <f7-navbar :title="pageTitle">
            <f7-nav-right>
                <f7-link href="#" @click="$f7router.back()">{{ stage('readonly') ? '返回' : '取消' }}</f7-link>
                <f7-link v-if="stage('edit')" href="#" @click="submit">提交</f7-link>
            </f7-nav-right>
        </f7-navbar>

        <f7-block-title>日报内容</f7-block-title>
        <f7-list>
            <f7-list-item
                v-if="createdAt"
                title = "提交时间"
                :after = "createdAt.toHawkString()"
            ></f7-list-item>
            <f7-list-item
                v-if="stage('edit')"
                title="日报类型"
                smart-select
                :smart-select-params="{openIn: 'popover'}"
            >
                <select name="reportType">
                    <option
                        v-for="(t, index) in myCompany.reportType"
                        :key="index"
                        :value="t"
                    >
                        {{t}}
                    </option>
                </select>
            </f7-list-item>
            <f7-list-item title="日报内容">
                <textarea
                    :disabled="!stage('edit')"
                    slot = "inner"
                    class="resizable"
                    style="width:80%; text-align:right"
                    placeholder="请填写日报内容"
                    :value="manifesto"
                    @input="manifesto = $event.target.value"
                ></textarea>
            </f7-list-item>
            <f7-list-item class="input-photo" :title="'日报照片(' + photo.length + '/5)'">
                <photoeditor
                    slot="inner"
                    :readonly="!stage('edit')"
                    :gallery="true"
                    :max="5"
                    :photos="photo"
                    @photo:update="(photos) => {photo = photos}"
                ></photoeditor>
            </f7-list-item>
            <f7-list-item
                title="审批人"
                :after="(approver.uId && who(approver.uId).name) || '请选择审批人'"
                :link="stage('edit') ? '#' : false"
                @click="stage('edit') && (approver.selector = true)"
            ></f7-list-item>

            <f7-list-item v-if="!stage('edit')" title="点评">
                <textarea
                    :disabled = "stage('readonly')"
                    slot = "inner"
                    style="width:80%; text-align:right"
                    class="resizable"
                    placeholder="请填写点评"
                    :value="comment"
                    @input="comment = $event.target.value"
                ></textarea>
            </f7-list-item>
        </f7-list>

        <f7-block v-if="stage('review')">
            <f7-link color="green" icon-f7="check" text="点评" @click="approve"></f7-link>
        </f7-block>

        <f7-popup :opened="approver.selector" @popup:closed="approver.selector = false">
            <personnelselector
                :multiple="false"
                @submit="selectEmployee"
                @cancel="approver.selector = false"
            ></personnelselector>
        </f7-popup>

    </f7-page>
</template>

<script>
import {defaultImgUrl} from 'lib/loading';
import {mapGetters, mapActions} from 'vuex';
import personnelselector from 'gadget/personnelselector.vue';
import photoeditor from 'gadget/photoeditor.vue';
import {getSignUrl} from 'lib/aliyun';
import {openCamera} from 'lib/camera';
import axios from 'axios';

export default {
    components: {
        personnelselector,
        photoeditor
    },

    props: [
        'lastPage',
        'reference'
    ],

    data: () => {
        return {
            imgSrc: [],

            reportType: '',
            approver: {
                selector: false,
                uId: ''
            },
            photo: [],
            manifesto: '',
            comment: '',

            status: '',
            applicant: '',
            createdAt: null
        }
    },

    watch: {
        photo: function() {
            this.photo.forEach((p, index) => {
                this.imgSrc[index] = defaultImgUrl;

                let url = p.substr(0, 4) == 'http' ? p.match(/aliyuncs.com\/(\S*)\?OSSAccessKeyId/)[1] : p
                getSignUrl(url, (ret) => {
                    if (ret instanceof Error) {
                        this.imgSrc[index] = '#';
                    } else {
                        this.imgSrc[index] = ret;
                    }
                });
            })
        }
    },

    computed: {
        ...mapGetters([
            'myCompany',
            'who',
            'manager',
            'myProfile',
            'myUserId'
        ]),

        pageTitle() {
            if (this.stage('edit')) {
                return '编辑日报';
            } else if (this.stage('review')) {
                return '点评日报';
            } else {
                return '日报';
            }
        }
    },

    mounted: function() {
        // set up default event handler
        $('select[name="reportType"]').change(() => {
            this.reportType = $('select[name="reportType"] option:checked').attr('value');
            this.$f7.popover.close('.smart-select-popover');
        });

        // load application data
        this.load();

        // set page states
        if (!this.reportType) {
            this.reportType = this.myCompany.reportType[0];
        }

        if (!this.approver.uId) {
           this.approver.uId = this.manager(this.myUserId) || '';
        }
    },

    methods: {
        stage(expected) {
            let current = 'readonly';

            if (!this.status) {
                current = 'edit';
            } else if (this.status == '待审批') {
                if (this.myUserId == this.approver.uId) {
                    current = 'review';
                } else if (this.myUserId == this.applicant) {
                    current = 'edit';
                }
            } else {
                current = 'readonly';
            }

            return current == expected;
        },

        init(application) {
            this.reportType = application.content.reportType;
            this.approver.uId = application.approver;
            this.manifesto = application.content.manifesto;
            this.photo = application.content.photo;
            this.comment = application.comment;

            this.status = application.status;
            this.applicant = application.applicant;
            this.createdAt = new Date(application.createdAt);
        },

        load() {
            if (!this.reference) { return }

            if (typeof this.reference == 'string') {
                this.busy();
                axios.get('api/application/' + this.reference).then(resp => {
                    this.init(resp.data);
                    this.nobusy();
                }).catch(err => {
                    console.error(err);
                    this.nobusy('无法更新数据，请稍后再试');
                });
            } else if (typeof this.reference == 'object') {
                this.init(this.reference);
            }
        },

        submit() {
            // sanity check
            let applicant = this.myUserId;
            let category = '日报';
            let content = {};

            content.reportType = this.reportType;
            content.photo = this.photo;
            content.manifesto = this.manifesto;

            let approver = this.approver.uId;

            if (!this.approver.uId) {
                this.alert('必须选择审批人！', '操作失败');
                return;
            }

            if (!this.manifesto) {
                this.alert('必须填写日报内容！', '操作失败');
                return;
            }

            if (applicant == approver && this.who(applicant).role != 'admin') {
                this.alert('申请人不可以跟审批人重复！', '操作失败');
                return;
            }

            this.save({applicant, category, content, approver});
        },

        save(entry) {
            if (!entry.status || entry.status == '待审批') {
                this.busy();

                axios.post('api/application', entry).then(resp => {
                    this.nobusy('提交成功，请等待审批', '操作成功', () => {
                        this.$f7router.back();
                    });
                }).catch(error => {
                    console.error(error);
                    this.nobusy('提交失败，请稍后再试', '操作失败');
                })
            }
        },

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
                this.approver.uId = pList[0];
            }
            this.approver.selector = false;
        },

        approve() {
            let aId = (typeof this.reference == 'string') ? this.reference : this.reference._id;
            let comment = this.comment;
            let status = '已通过';

            this.busy();
            axios.put('api/application/' + aId, {comment, status}).then(() => {
                this.nobusy('成功点评日报', '操作成功', () => {
                        this.$f7router.back();
                    });
            }).catch(error => {
                console.error(error);
                this.nobusy('点评失败，请稍后再试', '操作失败');
            })
        },
    }
}
</script>
