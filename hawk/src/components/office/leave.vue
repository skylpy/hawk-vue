<template>
    <f7-page>
        <f7-navbar :title="pageTitle">
            <f7-nav-right>
                <f7-link href="#" @click="$f7router.back()">{{ stage('readonly') ? '返回' : '取消' }}</f7-link>
                <f7-link v-if="stage('edit')" href="#" @click="submit">提交</f7-link>
            </f7-nav-right>
        </f7-navbar>

        <f7-block-title>请假申请单</f7-block-title>
        <f7-list>
            <f7-list-item
                    title="申请人">
                {{reference && who(reference.applicant).name || myProfile.name}}
            </f7-list-item>
            <f7-list-item
                v-if="stage('edit')"
                title="请假类型"
                smart-select
                :smart-select-params="{openIn: 'popover'}"
            >
                <select name="leaveType">
                    <option
                        v-for="(t, index) in myCompany.leaveType"
                        :key="index"
                        :value="t"
                    >
                        {{t}}
                    </option>
                </select>
            </f7-list-item>
            <f7-list-item
                v-else
                title="请假类型"
                :after="leaveType"
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
            <f7-list-item title="请假原因">
                <textarea
                    :disabled="!stage('edit')"
                    slot = "inner"
                    style="width:70%; text-align:right"
                    class="resizable"
                    maxlength="250"
                    placeholder="请说明请假原因(250字内)"
                    :value="manifesto"
                    @input="manifesto = $event.target.value"
                ></textarea>
            </f7-list-item>
            <f7-list-item
                title="审批人"
                :after="(approver.uId && who(approver.uId).name) || '请选择审批人'"
                :link="stage('edit') ? '#' : false"
                @click="stage('edit') && (selectorPersonnelShow=true)"
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

        <!--<f7-block style="display:flex" v-if="stage('review')">-->
            <!--<f7-link style="flex:auto" color="red" icon-f7="close" text="驳回" @click="reject"></f7-link>-->
            <!--<f7-link color="green" icon-f7="check" text="批准" @click="approve"></f7-link>-->
        <!--</f7-block>-->

        <div v-if="stage('review')" class="footer">
            <div class="audit_con">
                <div @click="reject">驳回</div>
                <div @click="approve" class="audit_pass">通过</div>
            </div>
        </div>

        <f7-popup :opened="selectorPersonnelShow" @popup:closed="(selectorPersonnelShow = false)">
            <officialselector
                    @employee:selected="onSelectorPersonne"
                    @employee:cancel="selectorPersonnelShow = false"
            ></officialselector>
        </f7-popup>

    </f7-page>
</template>

<style scoped>
    .footer {
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
    .audit_con {
        height: 49px;
        background-color: white;
        border-top: 1px solid #D8D8D8;
    }

    .audit_con > div {
        float: left;
        width: calc(50% - 24px);
        height: 35px;
        line-height: 35px;
        text-align: center;
        color: white;
        background-color: #ff715a;
        margin-top: 5px;
        margin-left: 15px;
        border-radius: 3px;
        cursor: pointer;
    }

    .audit_con .audit_pass {
        background-color: #01b38b;
    }

</style>

<script>
import {mapGetters, mapActions} from 'vuex';
import {createDateTimePicker} from 'lib/datetime';
import personnelselector from 'gadget/personnelselector.vue';
import officialselector from 'gadget/officialselector.vue';

import axios from 'axios';

export default {
    components: {
        personnelselector,
        officialselector
    },

    props: [
        'lastPage',
        'reference',
    ],

    data: () => {
        return {
            leaveType: '',
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
            manifesto: '',
            comment: '',

            status: '',
            applicant: '',
            createdAt: null,
            selectorPersonnelShow:false,
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
                return '编辑请假申请';
            } else if (this.stage('review')) {
                return '审批请假申请';
            } else {
                return '请假申请';
            }
        }
    },

    mounted: function() {
        // set up default event handler
        $('select[name="leaveType"]').change(() => {
            this.leaveType = $('select[name="leaveType"] option:checked').attr('value');
            this.$f7.popover.close('.smart-select-popover');
        });

        // load application data
        this.load();

        // set page states
        if (!this.leaveType) {
            this.leaveType = this.myCompany.leaveType[0];
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

        onSelectorPersonne(ulist){
            let item = ulist[0];
            if (item.role == "直属领导"||item.role == "老板") {
                this.approver.uId = item.uid;
            }else {
                this.approver.uId = item._id;
            }

            this.selectorPersonnelShow = false;

            this.$forceUpdate();
        },

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
            this.leaveType = application.content.leaveType;
            this.startTime.value = new Date(application.content.startTime);
            this.endTime.value = new Date(application.content.endTime);
            this.approver.uId = application.approver;
            this.comment = application.comment;
            this.manifesto = application.content.manifesto;

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
            let category = '请假';
            let content = {};

            content.leaveType = this.leaveType;
            content.startTime = this.startTime.value.getTime();
            content.endTime = this.endTime.value.getTime();
            content.manifesto = this.manifesto;

            let approver = this.approver.uId;

            if (content.startTime > content.endTime) {
                this.alert('开始时间不可以迟于结束时间！', '操作失败');
                return;
            }

            if (!this.approver.uId) {
                this.alert('必须选择审批人！', '操作失败');
                return;
            }

            if (!this.manifesto) {
                this.alert('必须说明请假理由！', '操作失败');
                return;
            }

            if (applicant == approver && this.who(applicant).role != 'admin') {
                this.alert('申请人不可以跟审批人重复！', '操作失败');
                return;
            }

            this.save({applicant, category, content, approver});
        },

        save(entry) {
            let aId = null;
            if (this.reference) {
                aId = (typeof this.reference == 'string') ? this.reference : this.reference._id;
            }

            let method = aId ? 'put' : 'post';
            let url = 'api/application' + (aId ? '/' + aId : '');
            let data = entry;

            this.busy();

            axios({
                url,
                method,
                data
            }).then(resp => {
                this.nobusy('提交成功，请等待审批', '操作成功', () => {
                    this.$f7router.back();
                });
            }).catch(error => {
                console.error(error);
                this.nobusy('提交失败，请稍后再试', '操作失败');
            })

        },

        approve() {
            let aId = (typeof this.reference == 'string') ? this.reference : this.reference._id;
            let comment = this.comment;
            let status = '已通过';

            this.busy();
            axios.put('api/application/' + aId, {comment, status}).then(() => {
                this.nobusy('该请假单已经获批', '操作成功', () => {
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
                this.nobusy('该请假单已经被驳回', '操作成功', () => {
                        this.$f7router.back();
                    });
            }).catch(error => {
                console.error(error);
                this.nobusy('提交失败，请稍后再试', '操作失败');
            })
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
    }
}
</script>
