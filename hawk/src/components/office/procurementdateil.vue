<template>
    <f7-page no-toolbar style="background: #f8f8f8">
        <f7-navbar title="采购详情" back-link>
            <f7-nav-right>
            </f7-nav-right>
        </f7-navbar>

        <div class="procurement-content">
            <div class="procurement-top">
                <div class="procurement-left">
                    <div class="procurement-left-icon">
                        <img :src="who(procurement.applicant) && who(procurement.applicant).avatarUrl" width="30px"
                             height="30px">
                    </div>

                </div>
                <div class="procurement-right">
                    <li>
                        <span>{{who(procurement.applicant) && who(procurement.applicant).name}}</span>
                    </li>
                    <li class="procurement-right-pstate" v-if="procurement.status == '待审批'">
                        <span>{{procurement.status}}</span>
                    </li>
                    <li class="procurement-right-state" v-if="procurement.status == '审批通过'">
                        <span>{{procurement.status}}</span>
                    </li>
                    <li class="procurement-right-rstate" v-if="procurement.status == '已拒绝'">
                        <span>{{procurement.status}}{{procurement.notes ? '-' + procurement.notes : ''}}</span>
                    </li>

                </div>
            </div>

            <div class="procurement-top2">
                <li>
                    <span>创建时间：{{procurement.createdAt && new Date(procurement.createdAt).toHawkString()}}</span>
                </li>
                <!--<li>-->
                <!--<span class="procurement-top2-title">审批编号</span>-->
                <!--<span>201888888888</span>-->
                <!--</li>-->
                <!--<li>-->
                <!--<span class="procurement-top2-title">所以部门</span>-->
                <!--<span>{{departmentName(procurement.department)}}</span>-->
                <!--</li>-->
            </div>

            <div v-for="(item,index) in procurement.schedules">
                <div class="procurement-des">
                    <li>
                        <span class="procurement-desspan">采购明细({{index+1}})</span>
                    </li>
                </div>

                <div class="procurement-top2">
                    <li>
                        <span class="procurement-top2-title">物品名称</span>
                        <span>{{item.name}}</span>
                    </li>
                    <li>
                        <span class="procurement-top2-title">型号或规格</span>
                        <span>{{item.type}}</span>
                    </li>
                    <li>
                        <span class="procurement-top2-title">数量</span>
                        <span>{{item.number}}</span>
                    </li>
                    <li>
                        <span class="procurement-top2-title">金额(元)</span>
                        <span>{{item.money}}</span>
                    </li>
                    <li>
                        <span class="procurement-top2-title">备注</span>
                        <span class="procurement-top2-title-des">{{item.des}}</span>
                    </li>

                </div>

                <li class="linetype"></li>
            </div>

            <div class="procurement-allprice">
                <li>
                    <span style="color: #A7A7A7">总采购金额(元)：  </span>
                    <span>{{procurement.allmoney || 0}}</span>
                </li>
            </div>

            <div class="procurement-allprice">
                <li>
                    <span style="color: #A7A7A7">申请事由：  </span>
                    <span>{{procurement.result}}</span>
                </li>
            </div>

            <div class="procurement-allprice">
                <li>
                    <span style="color: #A7A7A7">期望交付日期：  </span>
                    <span>{{moment(procurement.time).format('YYYY-MM-DD')}}</span>
                </li>
            </div>

            <li class="procurementline"></li>
            <div class="procurement-list" style="padding-left: 10px;">
                图片
            </div>
            <div class="image-top">
                <div class="imgDiv" v-if="procurement.photo.length == 0">
                    <span style="margin: 5px 0 0 10px; ">无图片上传</span>
                </div>
                <div class="imgDiv" v-for="(item, index) in procurement.photo" style="margin: 5px 0 0 10px;">
                    <img :src="imgSrc[index]" width="60px" height="60px">
                </div>
            </div>

            <li class="procurementline"></li>

            <div class="procurement-list" style="padding-left: 10px;">
                审批人
            </div>
            <div class="procurement-list" v-for="(item,index) in procurement.approver">
                <div class="procurement-left">
                    <div class="procurement-left-icon">
                        <img :src="item.uid && who(item.uid).avatarUrl || hp_default_96" width="30px" height="30px">
                    </div>
                </div>
                <div class="procurement-right">

                    <span class="procurement-name">{{who(item.uid).name}}</span>
                    <span class="procurement-time">{{item.createtime}}</span>
                </div>
            </div>


            <div class="bottom-button" v-if="procurement.status == '待审批' && JudgementAuthority()">

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
                <f7-popup id="procurementdateil-personnelselector">
                    <permissionselector
                            :isFilterMe="false"
                            :isMultiple="false"
                            @employee:selected="selectEmployee"
                            @employee:cancel="$f7.popup.close('#procurementdateil-personnelselector')"
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
                procurement: {
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
                this.procurement.photo.forEach((p, index) => {
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
                this.procurement.photo = application.photo;
                this.procurement.status = application.status;
                this.procurement.schedules = application.schedule;
                this.procurement.department = application.department;
                this.procurement.allmoney = application.allmoney;
                this.procurement.uid = application._id;
                this.procurement.approver = application.approver;
                this.procurement.applicant = application.applicant;
                this.procurement.notes = application.notes || '';
                this.procurement.createdAt = application.createdAt
                this.procurement.result = application.result
                this.procurement.time = application.time
                this.$forceUpdate()
                this.showImg()
            },

            load() {
                if (!this.reference) {
                    return
                }

                if (typeof this.reference == 'string') {
                    this.busy();
                    axios.get('api/procurement/' + this.reference).then(resp => {
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
                this.approver.personnelselector = $popup.open('#procurementdateil-personnelselector');
                this.approver.personnelselector.key = key;
            },
            selectEmployee(pList) {
                let key = this.approver.personnelselector.key;
                if (pList && pList[0]) {
                    this.approver[key] = pList[0].uid || pList[0];
                } else {
                    this.approver[key] = '';
                }
                $popup.close('#procurementdateil-personnelselector');
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
                    axios.put('api/procurement/' + aId, {status, finance}).then(() => {
                        this.nobusy('该采购单已经获批', '操作成功', () => {
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
                    axios.put('api/procurement/' + aId, {status, notes: val}).then(() => {
                        this.nobusy('该采购单已经被拒绝', '操作成功', () => {
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
                this.procurement.approver.forEach(v => {
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

    .procurement-content {
        width: 100%;
    }

    .procurement-top {
        width: 100%;
        margin-top: 10px;

        border-bottom: 1px solid rgba(231, 233, 242, 0.79);

    }

    .procurement-right-pstate {
        white-space: nowrap;
        font-size: 13px;
        color: darkorange;
        margin-right: 10px;
    }

    .procurement-right-state {


        white-space: nowrap;
        font-size: 13px;
        color: #01B38B;
        margin-right: 10px;
    }

    .procurement-right-rstate {


        white-space: nowrap;
        font-size: 13px;
        color: #ec1e44;
        margin-right: 10px;
    }

    .procurement-left {
        display: inline-block;
        width: 15%;

        margin-bottom: 15px;
    }

    .procurement-left-icon {
        width: 30px;
        height: 30px;
        border-radius: 15px;
        background-color: #2196F3;
        margin: 0px auto;
        overflow: hidden;
    }

    .procurement-left-icon > img {
        width: 100%;
        height: 100%;
    }

    .procurement-right {

        float: right;
        width: 85%;
    }

    .procurement-time {
        float: right;
        margin-right: 10px;
        line-height: 35px;
        height: 30px;
    }

    .procurement-name {
        float: left;
        height: 30px;
        line-height: 30px;
    }

    .procurement-top2 {

        width: 100%;
        margin: 10px;
    }

    .procurement-top2-title {

        display: inline-block;
        color: #CCCCCC;
        width: 80px;
    }

    .procurement-top2-title-des {

        display: inline-block;

    }

    .procurement-allprice {

        line-height: 25px;
        padding-left: 10px;
    }

    .procurement-des {

        width: 100%;
        margin-top: 10px;
        margin-bottom: 10px;
    }

    .procurement-des li {

        height: 25px;
        margin: 0px auto;
        background-color: #ececec;
        width: 90%;
        line-height: 25px;
        border-radius: 2px;
    }

    .procurement-desspan {

        margin-top: 5px;
        margin-left: 10px;
    }

    .procurement-list {

        width: 100%;
        margin-top: 10px;
    }

    .linetype {

        margin: 0px auto;
        width: 95%;
        height: 1px;
        border-bottom: 1px solid rgba(231, 233, 242, 0.79);
    }

    .procurementline {

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
