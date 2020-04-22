<template>
    <f7-page @page:reinit="load">
        <f7-navbar :title="pageTitle" back-link>
            <f7-nav-right v-if="IsCan">
                <f7-link v-if="stage('edit')" href="#" @click="save(true)">保存</f7-link>
                <f7-link v-if="stage('edit')" href="#" @click="save(false)">发布</f7-link>
            </f7-nav-right>
        </f7-navbar>

        <f7-list style="margin-top:0">
            <f7-list-item>
                <span slot="title"><span style="color:red">* </span>标题</span>
                <textarea
                    slot="root" style="width:100%; height:50px; padding-left:16px;" placeholder="请填写公告标题"
                    :value = "title" :disabled = "stage('readonly')"
                    @input="title = $event.target.value"
                    ></textarea>
            </f7-list-item>

            <f7-list-item>
                <span slot="title"><span style="color:red">* </span>正文</span>
                <textarea
                    slot="root" style="width:100%; height:150px; padding-left:16px;" placeholder="请填写公告内容"
                    :value = "content" :disabled = "stage('readonly')"
                    @input = "content = $event.target.value"
                ></textarea>
            </f7-list-item>

            <f7-list-item class="input-photo" :title="'附件:照片(' + photo.length + ')'">
                <photoeditor
                    slot="inner"
                    :gallery="true"
                    :photos="photo"
                    :readonly="stage('readonly')"
                    @photo:update="(photos) => {photo = photos}"
                ></photoeditor>
            </f7-list-item>

            <f7-list-item divider></f7-list-item>

            <f7-list-item link="#">
                <span slot="title"><span style="color:red">* </span>公告范围</span>
                <input
                    slot="after" type="text" :disabled = "stage('readonly')"
                    placeholder="设置发布范围" readonly="readonly"
                    style="text-align:right" :value="employees"
                    @click = "(popup.personnel = true)"
                />
            </f7-list-item>

            <f7-list-item
                link="#"
                @click="openDatePicker"
            >
                <span slot="title"><span style="color:red">* </span>公告截止日</span>
                <input
                    slot="after"
                    type="text"
                    :disabled = "stage('readonly')"
                    placeholder="设置日期"
                    readonly="readonly"
                    id="deadline"
                    style="text-align:right"
                    :value = "deadline && (new Date(deadline)).toHawkDateString() || ''"
                    @click="openDatePicker" @change="deadline = $event.target.value"
                />
            </f7-list-item>

        </f7-list>

        <f7-block v-if="isEdit">
            <f7-link v-if="IsCan" color="red" icon-f7="close" text="删除该通知" @click="remove"></f7-link>
        </f7-block>

        <f7-popup :opened="popup.personnel" @popup:closed="popup.personnel = false">
            <personnelselector
                :multiple="true"
                @submit="selectEmployee"
                @cancel="popup.personnel = false"
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

export default {
    components: {
        personnelselector,
        photoeditor
    },

    props: [
        'lastPage',
        'reference',
        'isEdit'
    ],

    data() {
        return {
            imgSrc: [],

            id: '',
            title: '',
            content: '',
            photo: [],
            receiver: [],
            deadline: null,
            draft: true,

            popup: {
                personnel: false,
                datepicker: null
            }
        }
    },

    computed: {
        ...mapGetters([
            'myCompany',
            'personnel',
            'superAdmin',
            'myUserId',
            'isDepartmentAdmin',
            'myProfile'
        ]),

        IsCan () {
            let isBoss = (this.superAdmin && this.superAdmin._id == this.myUserId);
            let isDepartmentAdmin = this.isDepartmentAdmin(this.myUserId)
            let isAdministration = this.myProfile.privilege.some(i => ['合同管理', '企业设置'].includes(i))
            if (isBoss) {
                return true
            } else if (this.reference && this.reference.creator) {
                return this.reference.creator == this.myUserId;
            } else {
                return isDepartmentAdmin || isAdministration
            }
        },

        pageTitle() {
            if (this.IsCan) {
                return `${this.isEdit ? this.reference.draft ? '编辑' : '查看' : '创建'}公告`;
            } else {
                return '公告';
            }
        },

        employees() {
            let l = [];
            this.personnel.forEach((p) => {
                if (this.receiver.includes(p._id)) {
                    l.push(p.name);
                }
            });

            if (l.length == 0) { return '' }

            return l[0] + '等' + l.length + '人';
        },
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

    mounted() {
        this.load();
    },

    methods: {
        ...mapActions({
            'add_an': 'ADD_ANNOUNCE',
            'update_an': 'UPDATE_ANNOUNCE',
            'delete_an': 'REMOVE_ANNOUNCE'
        }),

        stage(expected) {
            let status = this.draft ? 'edit' : 'readonly';
            if (status == 'edit' && !this.IsCan) status = 'readonly';
            return expected == status;
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

        save(draft) {
            let announce = {
                title: this.title,
                content: this.content,
                photo: this.photo,
                receiver: this.receiver,
                deadline: this.deadline,
                draft: draft,
                creator: this.myUserId
            };
            if (this.id) announce._id = this.id;

            let error_message = '';
            if (!announce.title) error_message = '标题不能为空';
            if (!announce.content) error_message = '正文不能为空';
            if (announce.receiver.length < 1) error_message = '发布范围不能为空';
            if (!announce.deadline) error_message = '截止日期不能为空';

            if (error_message) {
                this.alert(error_message, '操作错误');
                return;
            }

            let sync = this.id ? this.update_an : this.add_an;

            this.busy();
            sync(announce).then(() => {
                this.nobusy();
                this.$f7router.back();
            }).catch((err) => {
                console.error(err);
                this.nobusy('无法保存修改，请稍后最再试', '操作失败');
            })
        },

        remove() {
            $confirm('确定要删除该通知吗？', '操作确认', () => {
                if (!this.id) this.$f7router.back();

                this.delete_an(this.id).then(() => {
                    this.$f7router.back();
                });
            })
        },

        openDatePicker() {
            if (!this.popup.datepicker) {
                this.popup.datepicker = this.$f7.calendar.create({
                    inputEl: '#deadline',
                    closeOnSelect: true,
                    minDate: new Date(Date.now() - 24*3600*1000),
                });
            }
            this.popup.datepicker.open();
        },

        selectEmployee(pList) {
            this.receiver = pList;
            this.popup.personnel = false;
        },

        load() {
            if (!this.reference) { return }

            let announce = this.reference;

            if (typeof announce == 'string') {
                this.myProfile.announces.forEach(an => {
                    if (an._id == announce) {
                        announce = an;
                    }
                })
            }

            this.id = announce._id;
            this.title = announce.title || '';
            this.content = announce.content || '';
            this.photo = announce.photo || [];
            this.receiver = announce.receiver || [];
            this.deadline = announce.deadline;
            this.draft = announce.draft;
        },
    }
}
</script>

