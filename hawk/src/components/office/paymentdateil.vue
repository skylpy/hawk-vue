<template>
    <f7-page no-toolbar style="background: #f8f8f8">
        <f7-navbar title="付款详情" back-link>
            <f7-nav-right>
            </f7-nav-right>
        </f7-navbar>

        <div class="payment-content">
            <div class="payment-top">
                <div class="payment-left">
                    <div class="payment-left-icon">
                        <img :src="who(payment.applicant) && who(payment.applicant).avatarUrl" width="30px"
                             height="30px">
                    </div>

                </div>
                <div class="payment-right">
                    <li>
                        <span>{{who(payment.applicant) && who(payment.applicant).name}}</span>
                    </li>
                    <li class="payment-right-pstate" v-if="payment.status == '待审批'">
                        <span>{{payment.status}}</span>
                    </li>
                    <li class="payment-right-state" v-if="payment.status == '审批通过'">
                        <span>{{payment.status}}</span>
                    </li>
                    <li class="payment-right-rstate" v-if="payment.status == '已拒绝'">
                        <span>{{payment.status}}{{payment.notes ? '-' + payment.notes : ''}}</span>
                    </li>

                </div>
            </div>

            <div class="payment-allprice">
                <li>
                    <span>创建时间：{{payment.createdAt && new Date(payment.createdAt).toHawkString()}}</span>
                </li>
            </div>

            <div class="payment-allprice">
                <li>
                    <span>付款事由：  </span>
                    <span>{{payment.result}}</span>
                </li>
            </div>

            <div class="payment-allprice">
                <li>
                    <span>付款金额(元)：  </span>
                    <span>{{payment.allmoney}}</span>
                </li>
            </div>

            <div class="payment-allprice">
                <li>
                    <span>付款方式：  </span>
                    <span>{{payment.types}}</span>
                </li>
            </div>

            <div class="payment-allprice">
                <li>
                    <span>付款日期：  </span>
                    <span>{{moment(payment.time).format('YYYY-MM-DD')}}</span>
                </li>
            </div>

            <div class="payment-allprice">
                <li>
                    <span>收款人全称：  </span>
                    <span>{{payment.payee}}</span>
                </li>
            </div>

            <div class="payment-allprice">
                <li>
                    <span>银行账户：  </span>
                    <span>{{payment.blank}}</span>
                </li>
            </div>

            <div class="payment-allprice">
                <li>
                    <span>开户行：  </span>
                    <span>{{payment.openingBank}}</span>
                </li>
            </div>

            <div class="payment-allprice" style="margin-bottom: 10px;">
                <li>
                    <span>备注说明：  </span>
                    <span>{{payment.des}}</span>
                </li>
            </div>

            <li class="paymentline"></li>
            <div class="payment-list" style="padding-left: 10px;">
                图片
            </div>
            <div class="image-top">
                <div class="imgDiv" v-if="payment.photo.length == 0">
                    <span style="margin: 5px 0 0 10px; ">无图片上传</span>
                </div>
                <div class="imgDiv" v-for="(item, index) in payment.photo" style="margin: 5px 0 0 10px;">
                    <img :src="imgSrc[index]" width="60px" height="60px">
                </div>
            </div>

            <li class="paymentline"></li>

            <div class="payment-list" style="padding-left: 10px;">
                审批人
            </div>
            <div class="payment-list" v-for="(item,index) in payment.approver">
                <div class="payment-left">
                    <div class="payment-left-icon">
                        <img :src="item.uid && who(item.uid).avatarUrl || hp_default_96" width="30px" height="30px">
                    </div>
                </div>
                <div class="payment-right">

                    <span class="payment-name">{{who(item.uid).name}}</span>
                    <span class="payment-time">{{item.createtime}}</span>
                </div>
            </div>


            <div class="bottom-button" v-if="payment.status == '待审批' && JudgementAuthority()">

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
                <f7-popup id="paymentdateil-personnelselector">
                    <permissionselector
                            :isFilterMe="false"
                            :isMultiple="false"
                            @employee:selected="selectEmployee"
                            @employee:cancel="$f7.popup.close('#paymentdateil-personnelselector')"
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
    import moment from 'moment'
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
                payment: {
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
            moment,
            showImg() {
                this.imgSrc = [];
                this.payment.photo.forEach((p, index) => {
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
                this.payment.photo = application.photo;
                this.payment.status = application.status;
                this.payment.department = application.department;
                this.payment.uid = application._id;
                this.payment.approver = application.approver;
                this.payment.applicant = application.applicant;
                this.payment.notes = application.notes || '';
                this.payment.createdAt = application.createdAt

                this.payment.result = application.result
                this.payment.allmoney = application.allmoney
                this.payment.types = application.types
                this.payment.time = application.time
                this.payment.payee = application.payee
                this.payment.blank = application.blank
                this.payment.openingBank = application.openingBank
                this.payment.des = application.des
                this.showImg()
            },

            load() {
                if (!this.reference) {
                    return
                }

                if (typeof this.reference == 'string') {
                    this.busy();
                    axios.get('api/paymentmgr/' + this.reference).then(resp => {
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
                this.approver.personnelselector = $popup.open('#paymentdateil-personnelselector');
                this.approver.personnelselector.key = key;
            },
            selectEmployee(pList) {
                let key = this.approver.personnelselector.key;
                if (pList && pList[0]) {
                    this.approver[key] = pList[0].uid || pList[0];
                } else {
                    this.approver[key] = '';
                }
                $popup.close('#paymentdateil-personnelselector');
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
                    axios.put('api/paymentmgr/' + aId, {status, finance}).then(() => {
                        this.nobusy('该付款申请单已经获批', '操作成功', () => {
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
                    axios.put('api/paymentmgr/' + aId, {status, notes: val}).then(() => {
                        this.nobusy('该付款申请单已经被拒绝', '操作成功', () => {
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
                this.payment.approver.forEach(v => {
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

    .payment-content {
        width: 100%;
    }

    .payment-top {
        width: 100%;
        margin-top: 10px;

        border-bottom: 1px solid rgba(231, 233, 242, 0.79);

    }

    .payment-right-pstate {
        white-space: nowrap;
        font-size: 13px;
        color: darkorange;
        margin-right: 10px;
    }

    .payment-right-state {


        white-space: nowrap;
        font-size: 13px;
        color: #01B38B;
        margin-right: 10px;
    }

    .payment-right-rstate {


        white-space: nowrap;
        font-size: 13px;
        color: #ec1e44;
        margin-right: 10px;
    }

    .payment-left {
        display: inline-block;
        width: 15%;

        margin-bottom: 15px;
    }

    .payment-left-icon {
        width: 30px;
        height: 30px;
        border-radius: 15px;
        background-color: #2196F3;
        margin: 0px auto;
        overflow: hidden;
    }

    .payment-left-icon > img {
        width: 100%;
        height: 100%;
    }

    .payment-right {

        float: right;
        width: 85%;
    }

    .payment-time {
        float: right;
        margin-right: 10px;
        line-height: 35px;
        height: 30px;
    }

    .payment-name {
        float: left;
        height: 30px;
        line-height: 30px;
    }

    .payment-top2 {

        width: 100%;
        margin: 10px;
    }

    .payment-top2-title {

        display: inline-block;
        color: #CCCCCC;
        width: 80px;
    }

    .payment-top2-title-des {

        display: inline-block;

    }

    .payment-allprice {

        line-height: 30px;
        padding-left: 10px;
    }

    .payment-des {

        width: 100%;
        margin-top: 10px;
        margin-bottom: 10px;
    }

    .payment-des li {

        height: 25px;
        margin: 0px auto;
        background-color: #ececec;
        width: 90%;
        line-height: 25px;
        border-radius: 2px;
    }

    .payment-desspan {

        margin-top: 5px;
        margin-left: 10px;
    }

    .payment-list {

        width: 100%;
        margin-top: 10px;
    }

    .linetype {

        margin: 0px auto;
        width: 95%;
        height: 1px;
        border-bottom: 1px solid rgba(231, 233, 242, 0.79);
    }

    .paymentline {

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
