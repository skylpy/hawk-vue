<template>
    <f7-page>
        <f7-navbar :title="pageTitle">
            <f7-nav-right>
                <f7-link href="#" @click="$f7router.back()">{{ stage('readonly') ? '返回' : '取消' }}</f7-link>
                <f7-link v-if="stage('edit')" href="#" @click="submit">提交</f7-link>
            </f7-nav-right>
        </f7-navbar>

        <f7-block-title>费用报销申请单</f7-block-title>
        <f7-list>
            <f7-list-item
                    title="申请人"
            >{{reference && who(reference.applicant).name || myProfile.name}}</f7-list-item>
            <f7-list-item title="项目名称">
                <textarea
                    :disabled="!stage('edit')"
                    slot = "inner"
                    class="resizable"
                    style="width:80%; text-align:right"
                    placeholder="请填写项目名称"
                    :value="project"
                    @input="project = $event.target.value"
                ></textarea>
            </f7-list-item>
            <f7-list-item
                v-if="stage('edit')"
                title="费用类型"
                smart-select
                :smart-select-params="{openIn: 'popover'}"
            >
                <select name="expenseType">
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
                v-else
                title="费用类型"
                :after="expenseType"
            ></f7-list-item>
            <f7-list-item
                title="开始时间"
                :after="(startTime.value && startTime.value.toHawkString()) || '请设置时间'"
                :link="stage('edit') ? '#' : false"
                @click="stage('edit') && startTime.picker.open()"
            ></f7-list-item>
            <f7-list-item
                title="结束时间"
                :after="(endTime.value && endTime.value.toHawkString()) || '请设置时间'"
                :link="stage('edit') ? '#' : false"
                @click="stage('edit') && endTime.picker.open()"
            ></f7-list-item>
            <f7-list-item title="金额">
                <textarea
                    :disabled="!stage('edit')"
                    slot = "inner"
                    class="resizable"
                    style="width:80%; text-align:right"
                    placeholder="请填写金额"
                    :value="quantity"
                    @input="quantity = $event.target.value"
                ></textarea>
            </f7-list-item>
            <f7-list-item title="费用说明">
                <textarea
                    :disabled="!stage('edit')"
                    slot = "inner"
                    class="resizable"
                    style="width:80%; text-align:right"
                    placeholder="请说明费用原因(250字内)"
                    maxlength="250"
                    :value="manifesto"
                    @input="manifesto = $event.target.value"
                ></textarea>
            </f7-list-item>
            <f7-list-item class="input-photo" :title="'发票照片(' + photo.length + '/5)'">
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

            <f7-list-item v-if="!stage('edit')" title="批注">
                <textarea
                    :disabled = "stage('readonly')"
                    slot = "inner"
                    style="width:80%; text-align:right"
                    class="resizable"
                    placeholder="请输入批注"
                    :value="comment"
                    @input="comment = $event.target.value"
                ></textarea>
            </f7-list-item>
            <f7-list-item
                v-if="stage('readonly')"
                title="状态"
                :after = "reference.status"
            ></f7-list-item>
        </f7-list>

        <f7-block style="display:flex" v-if="stage('review')">
            <f7-link style="flex:auto" color="red" icon-f7="close" text="驳回" @click="reject"></f7-link>
            <f7-link style="flex:auto" color="green" icon-f7="check" text="批准" @click="approve"></f7-link>
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
import {createDateTimePicker} from 'lib/datetime';
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

            project: '',
            expenseType: '',
            startTime: {
                picker: null,
                value: null
            },
            endTime: {
                picker: null,
                value: null
            },
            approver: {
                selector: false,
                uId: ''
            },
            photo: [],
            quantity: '',
            manifesto: '',
            comment: '',

            status: '',
            applicant: '',
            createdAt: null,
            isCommit: false
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
                return '编辑费用报销申请';
            } else if (this.stage('review')) {
                return '审批费用报销申请';
            } else {
                return '费用报销申请';
            }
        }
    },

    mounted: function() {
        // set up default event handler
        $('select[name="expenseType"]').change(() => {
            this.expenseType = $('select[name="expenseType"] option:checked').attr('value');
            this.$f7.popover.close('.smart-select-popover');
        });

        // load application data
        this.load();

        // set page states
        if (!this.expenseType) {
            this.expenseType = this.myCompany.expenseType[0];
        }

        this.startTime.picker = createDateTimePicker(
            this.$f7,
            (date) => { this.startTime.value = date },
            this.startTime.value
        );
        this.endTime.picker = createDateTimePicker(
            this.$f7,
            (date) => { this.endTime.value = date },
            this.endTime.value
        );

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
            this.project = application.content.project;
            this.expenseType = application.content.expenseType;
            this.startTime.value = new Date(application.content.startTime);
            this.endTime.value = new Date(application.content.endTime);
            this.approver.uId = application.approver;
            this.manifesto = application.content.manifesto;
            this.quantity = application.content.quantity;
            this.photo = application.content.photo;

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
            let category = '报销';
            let content = {};

            content.project = this.project;
            content.expenseType = this.expenseType;
            content.startTime = this.startTime.value.getTime();
            content.endTime = this.endTime.value.getTime();
            content.photo = this.photo;
            content.manifesto = this.manifesto;
            content.quantity = this.quantity;

            let approver = this.approver.uId;

            if (!content.project) {
                this.alert('项目名称不可为空！', '操作失败');
                return;
            }

            if (content.startTime > content.endTime) {
                this.alert('开始时间不可以迟于结束时间！', '操作失败');
                return;
            }

            if (!this.approver.uId) {
                this.alert('必须选择审批人！', '操作失败');
                return;
            }

            if (!this.manifesto) {
                this.alert('必须说明费用原因！', '操作失败');
                return;
            }

            if (!this.quantity) {
                this.alert('必须写明金额！', '操作失败');
                return;
            }

            if (applicant == approver && this.who(applicant).role != 'admin') {
                this.alert('申请人不可以跟审批人重复！', '操作失败');
                return;
            }

            if (this.isCommit) return;
            this.isCommit = true;
            this.save({applicant, category, content, approver});
        },

        save(entry) {
            if (!entry.status || entry.status == '待审批') {
                this.busy();

                axios.post('api/application', entry).then(resp => {
                    this.nobusy('提交成功，请等待审批', '操作成功', () => {
                        this.$f7router.back();
                        this.isCommit = false
                    });
                }).catch(error => {
                    console.error(error);
                    this.nobusy('提交失败，请稍后再试', '操作失败');
                    this.isCommit = false
                })
            } else {
                this.isCommit = false
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
                this.nobusy('该报销单已经获批', '操作成功', () => {
                        this.$f7router.back();
                    });
            }).catch(error => {
                console.error(error);
                this.nobusy('提交失败，请稍后再试', '操作失败');
            })
        },

        reject() {
            let aId = (typeof this.reference == 'string') ? this.reference : this.reference._id;
            let comment = this.comment;
            let status = '已拒绝';

            this.busy();
            axios.put('api/application/' + aId, {comment, status}).then(() => {
                this.nobusy('该报销单已经被驳回', '操作成功', () => {
                        this.$f7router.back();
                    });
            }).catch(error => {
                console.error(error);
                this.nobusy('提交失败，请稍后再试', '操作失败');
            })
        },
    }
}
</script>
