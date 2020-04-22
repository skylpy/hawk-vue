<template>
    <f7-page>
        <f7-navbar :title="navTitle" back-link>
        </f7-navbar>

        <div class="page-content">
            <f7-list inline-labels class="hawk-table">
                <f7-list-item
                        divider
                ></f7-list-item>

                <f7-list-input :input="false">
                    <div slot="label" class="hawk-input-label">
                        <span>头像：</span>
                    </div>
                    <div slot="input">
                        <img :src="avatarSrc" class="hawk-avatar-normal" @click="$f7.actions.open('#profile-avatar-action');">
                    </div>
                </f7-list-input>

                <f7-list-input
                        placeholder="请输入"
                        :value="profile.name"
                        @input="profile.name = $event.target.value"
                        minlength = '1'
                        maxlength="8"
                        validate
                        error-message = "姓名不能为空,且最大为8个字符"
                >
                    <div slot="label" class="hawk-input-label">
                        <span class="hawk-input-label-mandatory">*</span>
                        <span>姓名：</span>
                    </div>
                </f7-list-input>

                <f7-list-item
                        @click="$refs.popover_gender.open($event.target)"
                >
                    <div class="hawk-input-label" >
                        <span class="hawk-input-label-mandatory">*</span>
                        <span style="font-size: 17px">性别：</span>
                    </div>

                    <div  style="font-size: 17px" >
                        {{profile.gender || '请选择'}}
                    </div>
                </f7-list-item>

                <f7-list-input
                        placeholder="请输入"
                        :value="profile.phone"
                        @input="profile.phone = $event.target.value"
                        validate
                        pattern = "[0-9]{11}"
                        error-message = "请输入正确的11位手机号码"
                >
                    <div slot="label" class="hawk-input-label">
                        <span class="hawk-input-label-mandatory">*</span>
                        <span>手机号：</span>
                    </div>
                </f7-list-input>

                <f7-list-input
                        :placeholder = "editing ? isPassFocus ? '' :'******' : '默认密码:123456'"
                        validate
                        pattern = "^[0-9a-zA-Z]{6,}$"
                        error-message = "必须是6位以上字母或数字"
                        @focus="isPassFocus = true"
                        @blur="isPassFocus = false"
                        @input="profile.passwd = $event.target.value"
                >
                    <div slot="label" class="hawk-input-label">
                        <span class="hawk-input-label-mandatory">*</span>
                        <span>密码：</span>
                    </div>
                </f7-list-input>
                <f7-list-item
                        @click="check('departments') && $f7.popup.open('#profile-departmentpicker')"
                >
                    <div class="hawk-input-label" >
                        <span class="hawk-input-label-mandatory">*</span>
                        <span style="font-size: 17px">部门：</span>
                    </div>

                    <div  style="font-size: 17px" >
                        {{departmentName || '请选择'}}
                    </div>
                </f7-list-item>
                 <!--<f7-list-input
                     readonly
                     placeholder="请选择"
                     :value="departmentName"
                     @focus="$f7.popup.open('#profile-departmentpicker')"
                 >
                     <div slot="label" class="hawk-input-label">
                         <span class="hawk-input-label-mandatory">*</span>
                         <span>部门：</span>
                     </div>
                 </f7-list-input>-->


                <f7-list-item
                        @click="check('timeCards') && $refs.popover_timecard.open($event.target)"
                >
                    <div class="hawk-input-label" >
                        <span class="hawk-input-label-mandatory">*</span>
                        <span style="font-size: 17px">考勤分组：</span>
                    </div>

                    <div  style="font-size: 17px" >
                        {{timeCardName}}
                    </div>
                </f7-list-item>

                <!--<f7-list-input
                        placeholder="请选择"
                        :value="timeCardName"
                        @focus="check('timeCards') && $refs.popover_timecard.open($event.target)"
                >
                    <div slot="label" class="hawk-input-label">
                        <span class="hawk-input-label-mandatory">*</span>
                        <span>考勤分组：</span>
                    </div>
                </f7-list-input>-->

                <f7-list-input
                        placeholder="请输入"
                        :value="profile.job"
                        @input="profile.job = $event.target.value"
                        maxlength="10"
                >
                    <div slot="label" class="hawk-input-label">
                        <span>职位：</span>
                    </div>
                </f7-list-input>

                <f7-list-input
                        placeholder="请输入"
                        :value="profile.email"
                        @input="profile.email = $event.target.value"
                >
                    <div slot="label" class="hawk-input-label">
                        <span>邮箱：</span>
                    </div>
                </f7-list-input>

                <f7-list-input
                        placeholder="请输入"
                        :value="profile.workNumber"
                        @input="profile.workNumber = $event.target.value"
                        maxlength="20"
                >
                    <div slot="label" class="hawk-input-label">
                        <span>工号：</span>
                    </div>
                </f7-list-input>

                <f7-list-input
                        placeholder="请选择"
                        readonly
                        input-id="profileOnBoardAt"
                        :value = "profile.onBoardAt"
                        @change="profile.onBoardAt = $event.target.value"
                >
                    <div slot="label" class="hawk-input-label">
                        <span>入职时间：</span>
                    </div>
                </f7-list-input>

                <f7-list-input
                        placeholder="请输入"
                        :value="profile.location"
                        @input="profile.location = $event.target.value"
                        maxlength="30"
                >
                    <div slot="label" class="hawk-input-label">
                        <span>办工地点：</span>
                    </div>
                </f7-list-input>
                <f7-list-input

                        placeholder="请输入"
                        :input="false"
                        v-if="myProfile.superadmin&&myProfile._id != profile._id"
                >
                    <div slot="label" class="hawk-input-label">
                        <span>账号使用状态:</span>
                    </div>
                    <div slot="input" style="float:right">
                        <f7-toggle :checked="profile.status" color="green" @change="profile.status = $event.target.checked"></f7-toggle>
                    </div>
                </f7-list-input>
                <f7-list-item divider></f7-list-item>

                <f7-list-input

                        placeholder="请输入"
                        :input="false"
                >
                    <div slot="label" class="hawk-input-label">
                        <span>号码隐藏</span>
                    </div>
                    <div slot="input" style="float:right">
                        <f7-toggle
                                :checked="profile.phoneHidden"
                                color="orange"
                                @change="profile.phoneHidden = $event.target.checked "></f7-toggle>
                    </div>
                </f7-list-input>

                <!--<f7-list-item-->
                        <!--after=-->
                <!--&gt;</f7-list-item>-->
                <div class="bottom-tip">
                    隐藏手机号码后，手机号在聊天个人资料页面和通讯录页面隐藏
                </div>
            </f7-list>

            <f7-list v-if="editing">
                <f7-list-button v-if="myProfile.superadmin&&myProfile._id != profile._id"
                                color="red"
                                title="删除员工"
                                @click="remove"
                ></f7-list-button>
            </f7-list>

        </div>



        <div class="footer">
            <f7-list class="hawk-action-button-bottom">
                <f7-list-button
                        title="保存"
                        @click="save"
                ></f7-list-button>
            </f7-list>
        </div>


        <f7-actions id="profile-avatar-action">
            <f7-actions-group>
                <f7-actions-button @click="getAvatar({camera: true})">拍摄</f7-actions-button>
                <f7-actions-button @click="getAvatar({file: true})">从相册选择</f7-actions-button>
            </f7-actions-group>
            <f7-actions-group>
                <f7-actions-button color="red">取消</f7-actions-button>
            </f7-actions-group>
        </f7-actions>

        <f7-popover ref="popover_gender">
            <f7-list>
                <f7-list-item link="#" popover-close title="男" @click="profile.gender = '男'"></f7-list-item>
                <f7-list-item link="#" popover-close title="女" @click="profile.gender = '女'"></f7-list-item>
            </f7-list>
        </f7-popover>

        <f7-popover ref="popover_timecard">
            <f7-list>
                <f7-list-item
                    v-for="(tc, index) in timeCards" :key="index"
                    link="#" popover-close
                    :title="tc.name"
                    @click="profile.timeCardId = tc._id"
                ></f7-list-item>
            </f7-list>
        </f7-popover>

        <f7-popup id="profile-departmentpicker">
            <departmentpicker
                :multiple = "false"
                @department:cancel = "$f7.popup.close('#profile-departmentpicker')"
                @department:selected = "setDepartment"
            ></departmentpicker>
        </f7-popup>

    </f7-page>
</template>
<style lang="scss" scoped>
    .page-content {

        margin-top: -45px;
        overflow: auto;
        -webkit-overflow-scrolling: touch;
        box-sizing: border-box;
        height: 100%;
        position: relative;
        z-index: 1;
        padding-bottom: 45px;
    }

    .footer{

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

    .bottom-tip{
        margin-top: 10px;
        background: #FFFFFF;
        padding: 5px 10px 5px 10px;
        color: #A7A7A7;
    }
</style>
<script>
import {loadAvatar} from 'lib/utils';
import {openCamera, openFilePicker} from 'lib/camera';
import {upload} from 'lib/aliyun';
import {mapGetters, mapActions} from 'vuex';
import departmentpicker from 'gadget/departmentpicker.vue';
import axios from 'axios';

export default {
    components: {
        departmentpicker
    },

    props: [
        'uId', 'departmentId',
        'person'
    ],

    data() {
        return {

            profile: {
                _id: '',
                avatar: '',
                name: '',
                gender: '',
                passwd: '',
                phone: '',
                department: [],
                timeCardId: '',
                job: '',
                email: '',
                workNumber: '',
                onBoardAt: '',
                location: '',
                status:true,
                phoneHidden: false
            },

            avatarSrc: '',
            isPassFocus: false,
        }
    },

    watch: {
        'profile.avatar': function(value) {
            loadAvatar(value, url => { this.avatarSrc = url });
        }
    },

    computed: {
        ...mapGetters([
            'departments',
            'timeCards',
            'timeCard',
            'myUserId',
            'myProfile'
        ]),

        editing() { return !!this.profile._id },

        timeCardName() {
            let id = this.profile.timeCardId;
            if (!id) return '请选择';
            return this.timeCards.find(tc => tc._id == id).name;
        },

        navTitle() {
            if (this.person == true){

                return '个人资料';
            }
            return this.editing ? '编辑员工' : '添加员工';
        },

        departmentName() {
            return this.departments.filter(d => this.profile.department.includes(d.departmentId)).map(d => d.name).join(',');
        }
    },

    mounted() {

        if (this.uId) {
            this.load();

            this.departments.forEach(d => {
                if (d.employees.includes(this.uId)) this.profile.department.push(d.departmentId);
            })

            this.profile.timeCardId = this.timeCard(this.uId) && this.timeCard(this.uId)._id || '';
        }

        if (this.departmentId) {
            this.profile.department = [this.departmentId];
        }

        // load default avatar pic
        loadAvatar('', url => { this.avatarSrc = url });

        if (!this.datepicker) {
            this.datepicker = $calendar.create({
                inputEl: '#profileOnBoardAt',
                closeOnSelect: true
            });
        }
    },

    methods: {
        ...mapActions({
            'load_personnel': 'LOAD_PERSONNEL',
            'load_company': 'LOAD_COM',
            'load_user': 'LOGIN'
        }),

        check(setting) {
            let self = this;
            if (!this.myProfile.superadmin && !this.myProfile.privilege.includes('组织构架')){

                return false;
            }
            console.log(this.myProfile)
            if (this.myProfile) {
            }

            if (!this[setting].length) {
                if (setting == 'timeCards') {
                    $confirm('确认新建一个考勤组', '没有考勤组可选', () => {
                        self.$f7router.navigate('/setting/company/timecard');
                    })
                }

                if (setting == 'departments') {
                    $confirm('确认新建一个部门', '没有部门可选', () => {
                        self.$f7router.navigate('/office/organization');
                    })
                }
                return false;
            }
            return true;
        },

        setDepartment(departmentIdList) {
            this.profile.department = departmentIdList;
            $f7.popup.close('#profile-departmentpicker');
        },

        getAvatar(options) {
            let {camera, file} = options;
            let self = this;

            let cb = function(ret) {
                if (ret instanceof Error) {
                    console.error(ret);
                    $alert('无法更新照片', '操作失败');
                } else {
                    let dataUrl = ret;
                    $preloader.show();

                    upload(dataUrl, (ret) => {
                        $preloader.hide();

                        if (ret instanceof Error) {
                            console.error(ret);
                            $alert('无法上传照片', '操作失败');
                        } else {
                            self.profile.avatar = ret;
                        }
                    });
                }
            };

            if (camera) openCamera(cb);
            if (file) openFilePicker(cb);
        },

        sanity_check() {
            if (document.querySelectorAll('.page-current .input-invalid').length != 0) {
                $alert('请更正错误的输入', '操作失败');
                return false;
            }

            let list = [];
            let mandatory = {'name': '姓名', 'gender': '性别', 'phone': '电话', 'department': '部门', 'timeCardId': '考勤分组'};

            Object.keys(mandatory).forEach(i => {
                if (this.profile[i].length == 0) list.push(mandatory[i]);
                // console.log(this.profile[i], mandatory[i]);
            })

            if (list.length == 0) return true;

            $alert(list[0] + '不能为空', '操作失败');
            return false;
        },

        remove() {
            if (!this.profile._id) return;
            let uId = this.profile._id;

            $confirm('确定要删除该用户吗？', '操作确认', () => {
                $preloader.show();
                axios.delete('api/user/' + uId).then(resp => {
                    // trigger reload of company and personnel
                    this.sys_reload().then(() => {
                        $preloader.hide();
                        this.$f7router.back();
                    });
                }).catch(err => {
                    console.error(err);
                    $preloader.hide();
                    $alert('无法删除员工', '操作错误');
                })
            });
        },

        load() {
            if (!this.uId) return;

            $preloader.show();
            axios.get('api/user/' + this.uId).then(resp => {
                Object.assign(this.profile, resp.data);
                $preloader.hide();
            }).catch(err => {
                console.error(err);
                $preloader.hide();
                $alert('无法获得用户数据', '操作错误');
            })
        },

        sys_reload() {
            if (this.uId == this.myUserId) this.load_user();

            return Promise.all([
                this.load_company(),
                this.load_personnel()
            ]);
        },

        save() {
            if (!this.sanity_check()) return;

            $confirm('确定保存该员工设置吗？', '操作确认', () => {
                $preloader.show();
                let op = this.editing ? axios.put : axios.post;
                let url = 'api/user/' + (this.editing? this.profile._id : '');

                op(url, this.profile).then(resp => {
                    // trigger reload of company and personnel
                    this.sys_reload().then(() => {
                        $preloader.hide();
                        this.$f7router.back();
                    });
                }).catch(err => {
                    console.error(err);
                    $preloader.hide();

                    let message = err.response.data && err.response.data.message;
                    if (message === '套餐使用名额已满，请先去添加使用名额或者将其他员工停用') {
                        $confirm(message, '操作确认', () => {
                            this.$f7router.navigate('/trade/info', {
                                props: {
                                    which: 'addUser'
                                }
                            });
                        })
                    } else {
                        $alert(message || '无法保存员工设置', '操作错误');
                    }
                })
            });
        },
    }
}
</script>

