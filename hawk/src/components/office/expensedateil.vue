<template>
    <f7-page no-toolbar style="background: #f8f8f8">
        <f7-navbar title="审批详情" back-link>
            <f7-nav-right>
            </f7-nav-right>
        </f7-navbar>

        <div class="expense-content">
            <div class="expense-top">
                <div class="expense-left">
                    <div class="expense-left-icon">
                        <img :src="who(expense.applicant) && who(expense.applicant).avatarUrl" width="30px"
                             height="30px">
                    </div>

                </div>
                <div class="expense-right">
                    <li>
                        <span>{{who(expense.applicant) && who(expense.applicant).name}}</span>
                    </li>
                    <li class="expense-right-pstate" v-if="expense.status == '待审批'">
                        <span>{{expense.status}}</span>
                    </li>
                    <li class="expense-right-state" v-if="expense.status == '审批通过'">
                        <span>{{expense.status}}</span>
                    </li>
                    <li class="expense-right-rstate" v-if="expense.status == '已拒绝'">
                        <span>{{expense.status}}{{expense.notes ? '-' + expense.notes : ''}}</span>
                    </li>

                </div>
            </div>

            <div class="expense-top2">
                <li>
                    <span>创建时间：{{expense.createdAt && new Date(expense.createdAt).toHawkString()}}</span>
                </li>
                <!--<li>-->
                <!--<span class="expense-top2-title">审批编号</span>-->
                <!--<span>201888888888</span>-->
                <!--</li>-->
                <!--<li>-->
                <!--<span class="expense-top2-title">所以部门</span>-->
                <!--<span>{{departmentName(expense.department)}}</span>-->
                <!--</li>-->
            </div>

            <div v-for="(item,index) in expense.schedules">
                <div class="expense-des">
                    <li>
                        <span class="expense-desspan">报销明细({{index+1}})</span>
                    </li>
                </div>

                <div class="expense-top2">
                    <li>
                        <span class="expense-top2-title">报销金额</span>
                        <span>{{item.money}}</span>
                    </li>
                    <li>
                        <span class="expense-top2-title">报销类型</span>
                        <span>{{item.types}}</span>
                    </li>
                    <li>
                        <span class="expense-top2-title">费用明细</span>
                        <span class="expense-top2-title-des">{{item.des}}</span>
                    </li>

                </div>

                <li class="linetype"></li>
            </div>

            <div class="expense-allprice">
                <li>
                    <span style="color: #A7A7A7">总报销金额(元)：  </span>
                    <span style="color: coral">{{expense.allmoney || 0}}</span>
                </li>
            </div>

            <li class="expenseline"></li>


            <div class="expense-list" style="padding-left: 10px;">
                图片
            </div>
            <div class="image-top">
                <div class="imgDiv" v-if="expense.photo.length == 0">
                    <span style="margin: 5px 0 0 10px; ">无图片上传</span>
                </div>
                <div class="imgDiv" v-for="(item, index) in expense.photo" style="margin: 5px 0 0 10px;">
                    <img :src="imgSrc[index]" width="60px" height="60px">
                </div>
            </div>

            <li class="expenseline"></li>

            <div class="expense-list" style="padding-left: 10px;">
                审批人
            </div>
            <div class="expense-list" v-for="(item,index) in expense.approver">
                <div class="expense-left">
                    <div class="expense-left-icon">
                        <img :src="item.uid && who(item.uid).avatarUrl || hp_default_96" width="30px" height="30px">
                    </div>
                </div>
                <div class="expense-right">

                    <span class="expense-name">{{who(item.uid).name}}</span>
                    <span class="expense-time">{{item.createtime}}</span>
                </div>
            </div>


            <div class="bottom-button" v-if="expense.status == '待审批' && JudgementAuthority()">

                <div class="approval-button" @click="approver.show=true">通过</div>
                <div class="reject-button" @click="reject">拒绝</div>
            </div>
        </div>
        <f7-popup :opened="approver.show" @popup:closed="(approver.show = false)">
            <f7-page>
                <f7-navbar>
                    <f7-nav-title>审批通过</f7-nav-title>
                </f7-navbar>
                <f7-block-title>通过审批，账单会进入财务审批流程，请选择</f7-block-title>
                <f7-list>
                    <f7-list-item title="制表人" @click="open_personnelselector('lister')"
                                  :after="getName(myUserId) || '请选择'"></f7-list-item>
                    <f7-list-item title="审核人" @click="open_personnelselector('reviewer')"
                                  :after="getName(approver.reviewer) || '请选择'"></f7-list-item>
                    <f7-list-item title="审批人" @click="open_personnelselector('approver')"
                                  :after="getName(approver.approver) || '请选择'"></f7-list-item>
                    <f7-list-item title="出纳人" @click="open_personnelselector('bookkeeper')"
                                  :after="getName(approver.bookkeeper) || '请选择'"></f7-list-item>
                </f7-list>

                <f7-row style="padding: 0px 20px">
                    <f7-col>
                        <div class="submit-button" @click="approve">确定</div>
                    </f7-col>
                    <f7-col>
                        <div class="close-button" @click="approver.show=false">取消</div>
                    </f7-col>
                </f7-row>
                <f7-popup id="expensedateil-personnelselector">
                    <permissionselector
                            :isFilterMe="false"
                            :isMultiple="false"
                            @employee:selected="selectEmployee"
                            @employee:cancel="$f7.popup.close('#expensedateil-personnelselector')"
                    ></permissionselector>
                </f7-popup>

            </f7-page>
        </f7-popup>
    </f7-page>

</template>

<script>
    import axios from 'axios';
    import {mapGetters, mapMutations, mapActions} from 'vuex';
    import permissionselector from 'gadget/permissionselector.vue';
    import { getSignUrl } from 'lib/aliyun';
    const hp_default_96 = require("assets/images/hp_default_96@2x.png");

    export default {

        props: [
            'lastPage',
            'reference'
        ],
        components: {
            permissionselector
        },
        data: () => {

            return {
                tab: "myapprovel",

                expansedateil: ["", "", ""],
                approver: {
                    show: false,
                    lister: '',
                    reviewer: '',
                    approver: '',
                    bookkeeper: '',
                    personnelselector: {}
                },
                expense: {
                    photo: [],
                    status: "",
                    schedules: [],
                    department: "",
                    allmoney: "",
                    uid: "",
                    approver: [],
                    applicant: "",
                    notes: '',
                    createdAt: ''
                },
                hp_default_96: hp_default_96,
                imgSrc: []
            }

        },
        //监听值改变
        computed: {
            ...mapGetters([
                'who',
                'IamAdmin',
                'IamManager',
                'myCompany',
                'myProfile',
                'myUserId',
            ])
        },
        mounted: function () {
            if(this.myCompany.financeSetting){
                this.approver.reviewer = this.myCompany.financeSetting.reviewer
                this.approver.approver = this.myCompany.financeSetting.approver
                this.approver.bookkeeper = this.myCompany.financeSetting.bookkeeper
            }
            this.load();
        },
        methods: {
            showImg() {
                this.imgSrc = [];
                this.expense.photo.forEach((p, index) => {
                    let url = p.substr(0, 4) == 'http' ? p.match(/aliyuncs.com\/(\S*)\?OSSAccessKeyId/)[1] : p
                    getSignUrl(url, (ret) => {
                        if (ret instanceof Error) {
                            this.imgSrc[index] = '#';
                        } else {
                            this.imgSrc[index] = ret;
                            this.$forceUpdate()
                        }
                    });
                });
            },
            init(application) {
                this.expense.photo = application.photo;
                this.expense.status = application.status;
                this.expense.schedules = application.schedule;
                this.expense.department = application.department;
                this.expense.allmoney = application.allmoney;
                this.expense.uid = application._id;
                this.expense.approver = application.approver;
                this.expense.applicant = application.applicant;
                this.expense.notes = application.notes || '';
                this.expense.createdAt = application.createdAt
                this.showImg()
            },

            load() {
                if (!this.reference) {
                    return
                }

                if (typeof this.reference == 'string') {
                    this.busy();
                    axios.get('api/expensemgr/' + this.reference).then(resp => {
                        console.log("hhhhhhhhh" + resp.data);
                        this.init(resp.data);
                        this.nobusy();
                    }).catch(err => {
                        console.error(err);
                        this.nobusy('无法更新数据，请稍后再试');
                    });
                } else if (typeof this.reference == 'object') {
                    console.log("this.reference" + this.reference.approval);
                    this.init(this.reference);
                }
            },
            getName(uid) {
                console.log(uid)
                const u = this.who(uid)
                return u && u.name || ''
            },
            open_personnelselector(key) {
                this.approver.personnelselector = $popup.open('#expensedateil-personnelselector');
                this.approver.personnelselector.key = key;
            },
            selectEmployee(pList) {
                let key = this.approver.personnelselector.key;
                if (pList && pList[0]) {
                    this.approver[key] = pList[0].uid || pList[0];
                } else {
                    this.approver[key] = '';
                }
                $popup.close('#expensedateil-personnelselector');
            },
            approve() {
                let aId = (typeof this.reference == 'string') ? this.reference : this.reference._id;

                let status = '审批通过';

                if (
                    this.approver.reviewer &&
                    this.approver.approver &&
                    this.approver.bookkeeper
                ) {
                    let finance = {
                        lister: this.myUserId,
                        reviewer: this.approver.reviewer,
                        approver: this.approver.approver,
                        bookkeeper: this.approver.bookkeeper
                    }
                    this.busy();
                    axios.put('api/expensemgr/' + aId, {status, finance}).then(() => {
                        this.nobusy('该报销单已经获批', '操作成功', () => {
                            this.$f7router.back();
                        });
                    }).catch(error => {
                        console.error(error);
                        this.nobusy('提交失败，请稍后再试', '操作失败');
                    })
                    this.approver.show = false
                } else {
                    $alert('请填写完整信息')
                }

            },

            reject() {
                let aId = (typeof this.reference == 'string') ? this.reference : this.reference._id;

                let status = '已拒绝';

                $dialog.prompt('请填写拒绝原因', '拒绝原因', val => {
                    this.busy();
                    axios.put('api/expensemgr/' + aId, {status, notes: val}).then(() => {
                        this.nobusy('该报销单已经被拒绝', '操作成功', () => {
                            this.$f7router.back();
                        });
                    }).catch(error => {
                        console.error(error);
                        this.nobusy('提交失败，请稍后再试', '操作失败');
                    })
                });
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
            alert(s, t, cb) {
                $alert(s, t, cb);
            },
            JudgementAuthority() {
                let isCan = false;
                this.expense.approver.forEach(v => {
                    if (v.uid == this.myUserId) isCan = true;
                });
                return isCan;
            }
        }
    }
</script>

<style scoped>
    .submit-button {
        float: left;
        height: 45px;
        line-height: 45px;
        font-size: 16px;
        color: #FFFFFF;
        text-align: center;
        background: rgba(1, 179, 139, 1);
        width: 100%;
    }

    .close-button {
        float: left;
        height: 45px;
        line-height: 45px;
        font-size: 16px;
        color: #FFFFFF;
        text-align: center;
        background: rgb(205, 205, 205);
        width: 100%;
    }

    body, div, ul, li, input, label, form, a, p, textarea {
        margin: 0;
        padding: 0;

    }

    ol, ul, li {
        list-style: none;
    }

    .expense-content {
        width: 100%;
    }

    .expense-top {
        width: 100%;
        margin-top: 10px;

        border-bottom: 1px solid rgba(231, 233, 242, 0.79);

    }

    .expense-right-pstate {
        white-space: nowrap;
        font-size: 13px;
        color: darkorange;
        margin-right: 10px;
    }

    .expense-right-state {


        white-space: nowrap;
        font-size: 13px;
        color: #01B38B;
        margin-right: 10px;
    }

    .expense-right-rstate {


        white-space: nowrap;
        font-size: 13px;
        color: #ec1e44;
        margin-right: 10px;
    }

    .expense-left {
        display: inline-block;
        width: 15%;

        margin-bottom: 15px;
    }

    .expense-left-icon {
        width: 30px;
        height: 30px;
        border-radius: 15px;
        background-color: #2196F3;
        margin: 0px auto;
        overflow: hidden;
    }

    .expense-left-icon > img {
        width: 100%;
        height: 100%;
    }

    .expense-right {

        float: right;
        width: 85%;
    }

    .expense-time {
        float: right;
        margin-right: 10px;
        line-height: 35px;
        height: 30px;
    }

    .expense-name {
        float: left;
        height: 30px;
        line-height: 30px;
    }

    .expense-top2 {

        width: 100%;
        margin: 10px;
    }

    .expense-top2-title {

        display: inline-block;
        color: #CCCCCC;
        width: 80px;
    }

    .expense-top2-title-des {

        display: inline-block;

    }

    .expense-allprice {

        line-height: 45px;
        padding-left: 10px;
    }

    .expense-des {

        width: 100%;
        margin-top: 10px;
        margin-bottom: 10px;
    }

    .expense-des li {

        height: 25px;
        margin: 0px auto;
        background-color: #ececec;
        width: 90%;
        line-height: 25px;
        border-radius: 2px;
    }

    .expense-desspan {

        margin-top: 5px;
        margin-left: 10px;
    }

    .expense-list {

        width: 100%;
        margin-top: 10px;
    }

    .linetype {

        margin: 0px auto;
        width: 95%;
        height: 1px;
        border-bottom: 1px solid rgba(231, 233, 242, 0.79);
    }

    .expenseline {

        height: 10px;
        background-color: #ececec;
    }

    .bottom-button {
        color: #FFFFFF;
        margin-top: 100px;
        text-align: center;
        height: 40px;
        width: 100%;
    }

    .approval-button {

        line-height: 40px;
        background-color: #01B38B;
        border-radius: 2px;
        margin-left: 20px;
        float: left;
        display: inline-block;
        width: 30%;
        height: 40px;
    }

    .reject-button {

        line-height: 40px;
        background-color: red;
        border-radius: 2px;
        margin-right: 20px;
        float: right;
        display: inline-block;
        width: 30%;
        height: 40px;
    }

    .image-top{

        margin-top: 0px;
        min-height: 50px;
        margin-bottom: 5px;
    }
</style>
