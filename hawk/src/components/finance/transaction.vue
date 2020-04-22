<template>
    <f7-page>
        <f7-navbar :title="navTitle" back-link>
            <f7-nav-right v-if="curContext.edit">
                <!--<f7-link href="#" @click="toEdit">编辑</f7-link>-->
            </f7-nav-right>
        </f7-navbar>

        <div class="page-content">
            <div v-if="curContext.reminder" class="reminder">
                <i class="fa fa-exclamation-circle" aria-hidden="true"></i>
                {{curContext.reminder}}
            </div>
            <div v-if="autitleTip" class="reminder">
                <i class="fa fa-exclamation-circle" aria-hidden="true"></i>
                {{autitleTip}}
            </div>

            <f7-list inline-labels no-hairlines-md style="margin-top:0">
                <template v-for="(item, key) in content">
                    <template v-if="item.input">
                        <f7-list-input
                                v-if="item.input == 'number'"
                                :key="key"
                                :label="item.label + '：'"
                                :placeholder="isReadOnly(key)?'':'请输入'"
                                :value="item.value"
                                @input="item.value = $event.target.value"
                                inputStyle="text-align:right"
                                :readonly="isReadOnly(key)"
                                validate
                                pattern="^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$"
                                error-message="请输入正确的数字"
                        >
                            <span v-if="!curContext.noMandate && item.madatory" slot="label" style="color:red">* </span>
                        </f7-list-input>
                        <f7-list-input
                                v-else
                                :key="key"
                                :label="item.label + '：'"
                                :placeholder="isReadOnly(key)?'':'请输入'"
                                :value="item.value"
                                @input="item.value = $event.target.value"
                                inputStyle="text-align:right"
                                :readonly="isReadOnly(key)"
                        >
                            <span v-if="!curContext.noMandate && item.madatory" slot="label" style="color:red">* </span>
                        </f7-list-input>
                    </template>

                    <f7-list-input
                            v-if="item.date"
                            :key="key"
                            :label="item.label + '：'"
                            :placeholder="isReadOnly(key)?'':'请选择'"
                            input-id="transaction-date-input"
                            :value="item.value"
                            @change="item.value = $event.target.value"
                            readonly
                            inputStyle="text-align:right"
                    >
                        <span v-if="!curContext.noMandate && item.madatory" slot="label" style="color:red">* </span>
                    </f7-list-input>

                    <f7-list-item
                            v-if="item.photo"
                            :key="key"
                            class="input-photo"
                            :title="item.label + ':'"
                    >
                        <photoeditor
                                slot="inner"
                                :gallery="true"
                                :photos="item.value"
                                :readonly="isReadOnly(key)"
                                @photo:update="(photos) => {item.value = photos}"
                        ></photoeditor>
                    </f7-list-item>

                    <f7-list-item
                            v-if="item.user"
                            :key="key"
                            :title="item.label + ': '"
                            :readonly="item.readonly"
                            :after="item.value && getName(item.value) || (isReadOnly(key)?'':'请选择')"
                            @click="isReadOnly(key) ? '' : open_personnelselector(item)"
                    >
                        <span v-if="item.madatory" slot="title" style="color:red">* </span>
                    </f7-list-item>

                    <f7-list-item
                            v-if="item.textarea"
                            :key="key"
                            class="input-textarea"
                            :title="item.label + ':'"
                    >
                        <div style="position: relative">
                        <textarea
                                slot="after-title"
                                :placeholder="isReadOnly(key)?'':'请输入'"
                                :value="item.value"
                                @input="item.value = $event.target.value"
                                style="position:relative"
                                maxlength="500"
                                :readonly="isReadOnly(key)"
                        ></textarea>
                            <div v-if="!isReadOnly(key)" style="position:absolute; bottom: 1px; right:5px; color:gray;">
                                {{ 500 - (item.value &&
                                item.value.length || 0)}}
                            </div>
                        </div>
                    </f7-list-item>

                </template>
            </f7-list>
            <div v-if="srcData && srcData.status" class="application_con">
                <p class="application_title">审批人</p>
                <div class="application">
                    <div class="application_item">
                        <div class="head">
                            <img :src="getHead(srcData.reviewer)">
                            <img v-if="getAuditSataus('已审核') == 'pass'" class="pass_icon"
                                 src="../../assets/images/icon_through_green@2x.png">
                            <img v-if="getAuditSataus('审核驳回') == 'reject'" class="pass_icon"
                                 src="../../assets/images/icon_reject_red@2x.png">
                        </div>
                        <div class="name">{{getName(srcData.reviewer)}}</div>
                        <div class="role">审核人</div>
                    </div>
                    <div v-if="srcData.approver" class="application_superior">
                        <img src="../../assets/images/arrow_process_right_gray@2x.png">
                    </div>
                    <div v-if="srcData.approver" class="application_item">
                        <div class="head">
                            <img :src="getHead(srcData.approver)">
                            <img v-if="getAuditSataus('已审批') == 'pass'" class="pass_icon"
                                 src="../../assets/images/icon_through_green@2x.png">
                            <img v-if="getAuditSataus('审批驳回') == 'reject'" class="pass_icon"
                                 src="../../assets/images/icon_reject_red@2x.png">
                        </div>
                        <div class="name">{{getName(srcData.approver)}}</div>
                        <div class="role">审批人</div>
                    </div>
                    <div v-if="srcData.bookkeeper" class="application_superior">
                        <img src="../../assets/images/arrow_process_right_gray@2x.png">
                    </div>
                    <div v-if="srcData.bookkeeper" class="application_item">
                        <div class="head">
                            <img :src="getHead(srcData.bookkeeper)">
                            <img v-if="getAuditSataus('已完成') == 'pass'" class="pass_icon"
                                 src="../../assets/images/icon_through_green@2x.png">
                            <img v-if="getAuditSataus('收付驳回') == 'reject'" class="pass_icon"
                                 src="../../assets/images/icon_reject_red@2x.png">
                        </div>
                        <div class="name">{{getName(srcData.bookkeeper)}}</div>
                        <div class="role">出纳人</div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="curContext.action||isAuditModel||isReviewerModel||isReEditButtom" class="footer">
            <div v-if="isAuditModel" class="audit_con">
                <div @click="objectionDialog = true">驳回</div>
                <div @click="doAuditPass" class="audit_pass">通过</div>
            </div>
            <f7-list v-else-if="isReviewerModel" class="hawk-action-button-bottom">
                <f7-list-button title="账款处理结果" @click="doReviewerAction"></f7-list-button>
            </f7-list>
            <f7-list v-else-if="isReEditButtom" class="hawk-action-button-bottom">
                <f7-list-button title="撤回修改" @click="doReEdit"></f7-list-button>
            </f7-list>
            <f7-list v-else class="hawk-action-button-bottom">
                <f7-list-button
                        :title="curContext.action.text"
                        @click="doAction"
                ></f7-list-button>
            </f7-list>
        </div>

        <f7-popup id="transaction-personnelselector">
            <personnelselector
                    :multiple="false"
                    :selectedList="[]"
                    :subordinate="true"
                    @submit="selectEmployee"
                    @cancel="$f7.popup.close('#transaction-personnelselector')"
            ></personnelselector>
        </f7-popup>

        <f7-popup id="transaction-permissionselector">
            <permissionselector
                    @employee:selected="selectEmployee"
                    @employee:cancel="$f7.popup.close('#transaction-permissionselector')"
            ></permissionselector>
        </f7-popup>

        <vodal class="date-modal" :show="objectionDialog" animation="zoom" measure="px" :width=250 :height=100
               :closeButton=false>
            <div class="modal-title">驳回理由</div>
            <div class="modal-form">
                <input v-model="objection">
            </div>
            <div class="modal-button">
                <div class="modal-cancel" @click="objectionDialog=false">取消</div>
                <div class="modal-save" @click="doAuditReject">驳回</div>
            </div>
        </vodal>

    </f7-page>
</template>

<style lang="scss" scoped>
    .application_con {
        height: 130px;
        background-color: white;
        padding: 15px;
    }

    .application_title {
        color: #666666;
        margin: 0px 0px 15px 0px;
    }

    .application_item {
        text-align: center;
        width: 60px;
        font-size: 11px;
        float: left;
    }

    .application_item > .head {
        display: inline-block;
        position: relative;
        width: 48px;
        height: 48px;
        overflow: hidden;
    }

    .application_item > .head > img:first-child {
        border-radius: 50px;
        overflow: hidden;
        display: inline-block;
        width: 48px;
        height: 48px;
        border: none;
        background-color: #999999;
    }

    .application_item > .name {
        margin-top: 5px;
        font-size: 13px;
        color: #333333;
    }

    .application_item > .role {
        font-size: 11px;
        color: #999999;
    }

    .application_superior {
        padding-top: 17px;
        /*padding-left: 4px;*/
        /*padding-right: 4px;*/
        width: 13px;
        float: left;
    }

    .application_superior > img {
        width: 13px;
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

    .reminder {
        background-color: #FFF5E4;
        color: #F96A0E;
        height: 35px;
        padding-left: 15px;
        line-height: 35px;
    }

    .page-content {

        padding-top: 0px !important;
        overflow: auto;
        -webkit-overflow-scrolling: touch;
        box-sizing: border-box;
        height: 100%;
        position: relative;
        z-index: 1;
        padding-bottom: 45px;
    }

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

    .pass_icon {
        position: absolute;
        bottom: 0px;
        right: 0px;
        width: 15px;
    }

    .modal-form {
        /*margin-top: 10px;*/
        width: 200px;
        margin: 10px auto 10px auto;
    }

    .modal-form input {
        line-height: 24px;
        width: 100%;
    }

    .modal-button {
        position: absolute;
        width: 100%;
        margin-top: 10px;
        margin-left: -15px;
        height: 44px;
        bottom: 0px;
        border-top: 1px solid #D8D8D8;
        font-size: 16px;
    }

    .modal-button .modal-save {
        float: right;
        width: 50%;
        height: 44px;
        line-height: 44px;
        text-align: center;
        color: #01B38B;

    }

    .modal-button .modal-cancel {
        width: 50%;
        float: left;
        height: 44px;
        line-height: 44px;
        text-align: center;
        border-right: 1px solid #D8D8D8;
        box-sizing: border-box;
        color: #333;
    }
</style>


<script>
    import {mapGetters, mapActions, mapMutations} from 'vuex';
    import Vodal from 'vodal';
    import DatePicker from 'vue2-datepicker'
    import head from '../../assets/images/hp_default_96@2x.png'
    import photoeditor from 'gadget/photoeditor.vue';
    import personnelselector from 'gadget/personnelselector.vue';
    import permissionselector from 'gadget/permissionselector.vue';

    import axios from 'axios';

    export default {
        props: {
            contextType: String, // 内容类型
            reference: Object, // 传过来的数据
            name: String, // 标题
            shortname: String, // 短标题
        },

        components: {
            photoeditor,
            personnelselector,
            permissionselector,
            Vodal,
            DatePicker
        },

        data() {
            return {
                head: head,
                content: {
                    _id: {value: ''},
                    codeType: {value: ''},
                    code: {label: '编号', input: 'text', value: ''},
                    amount: {label: '金额', input: 'number', value: '', madatory: true},
                    payment: {label: '记账方式', input: 'text', value: '', madatory: true},
                    price: {label: '单价', input: 'number', value: ''},
                    quantity: {label: '数量', input: 'number', value: ''},
                    docWord: {label: '凭证字', input: 'text', value: ''},
                    docNumber: {label: '凭证号', input: 'text', value: ''},
                    category: {label: '类别', input: 'text', value: ''},
                    date: {label: '业务日期', date: true, value: '', madatory: true},
                    business: {label: '往来业务', input: 'text', value: ''},
                    // bookkeeping: {label: '记账方式', input: 'text', value: ''},
                    keyword: {label: '关键词', input: 'text', value: ''},
                    photo: {label: '相片', photo: true, value: []},
                    merchant: {label: '商家', input: 'text', value: ''},
                    agent: {label: '经办人', user: true, value: ''},
                    lister: {label: '制表人', user: true, value: '', isLimit: true, madatory: true},
                    reviewer: {label: '审核人', user: true, value: '', isLimit: true, madatory: true},
                    approver: {label: '审批人', user: true, value: '', isLimit: true, madatory: true},
                    bookkeeper: {label: '出纳人', user: true, value: '', madatory: true},
                    summary: {label: '摘要（用途）', textarea: true, value: ''},
                    subject: {label: '科目', textarea: true, value: ''},
                    objection: {value: ''},
                    status: {value: ''}
                },
                srcData: null,
                ctx: '', // 内容类型
                // 操作内容
                context: {
                    _detail: {
                        title: '详情',
                        edit: '_update',
                        readonly: true
                    },
                    _new: {
                        title: '新增',
                        action: {
                            text: '提交',
                            op: 'create',
                            nextPage: ''
                        },
                        reminder: '请填写数据精准和完善一些',
                        readonly: ['code']
                    },
                    _update: {
                        title: '编辑',
                        action: {
                            text: '提交',
                            op: 'update',
                            nextPage: ''
                        },
                        readonly: ['code']
                    },
                    _search: {
                        title: '详细搜索',
                        action: {
                            text: '搜索',
                            op: 'query',
                            nextPage: '/finance/transsearchresult/'
                        },
                        noMandate: true,
                        reminder: '记得多少填写多少，但请填写精准',
                        skipFields: ['photo'],
                    }
                },

                pselector: null,
                doPassStatus: '',
                doRejectStatus: '',
                isAuditModel: false, // 审批模式
                isReviewerModel: false, //
                isReEditButtom: false,

                objection: '',
                objectionDialog: false
            }
        },

        computed: {
            ...mapGetters([
                'who',
                'myUserId',
                'myCompany'
            ]),
            // 当前的操作
            curContext() {
                return this.context[this.ctx] || {}
            },
            // 获取内容值
            rawContent() {
                let raw = {};
                Object.keys(this.content).forEach(k => {
                    let c = this.content[k];
                    raw[k] = c.value || '';
                })
                return raw;
            },
            // 生成指定标题
            navTitle() {
                switch (this.ctx) {
                    case '_detail':
                    case '_search':
                        return this.name + this.curContext.title;
                    case '_new':
                        this.content.lister.value = this.myUserId
                    case '_update':
                        return this.curContext.title + this.name;
                    default:
                        return this.curContext.title;
                }
            },
            autitleTip() {
                let item = this.srcData
                let autitleTipArr = [
                    {title: '您已把这条账款驳回，等待制表人重新编辑再提交', status: '审核驳回', userid: item.reviewer},
                    {title: '请审核该账单', status: '待审核', userid: item.reviewer},
                    {title: '您已通过这条账款，等待继续走流程完成', status: '已审核', userid: item.reviewer},
                    {title: '您已把这条账款驳回，等待制表人重新编辑再提交', status: '审批驳回', userid: item.approver},
                    {title: '请审批该账单', status: '已审核', userid: item.approver},
                    {title: '您已通过这条账款，等待继续走流程完成', status: '已审批', userid: item.approver},
                    {title: '请填写数据精准和完善一些'},
                    {title: '您提交的账单，还可以撤回修改，重新走流程', status: '待审核', userid: item.lister},
                    {title: '您提交的账单，还可以撤回修改，重新走流程', status: '已审核', userid: item.lister},
                    {title: '您提交的账单，还可以撤回修改，重新走流程', status: '已审批', userid: item.lister},
                    {title: '您提交的账单，还可以撤回修改，重新走流程', status: '收付款', userid: item.lister},
                    {title: '您提交的账单被驳回，请查看驳回原因编辑再次提交', status: '审核驳回', userid: item.lister},
                    {title: '您提交的账单被驳回，请查看驳回原因编辑再次提交', status: '审批驳回', userid: item.lister},
                    {title: '您提交的账单被驳回，请查看驳回原因编辑再次提交', status: '收付驳回', userid: item.lister},
                    {title: '您提交的账单已被审批，账款请及时处理', status: '已审批', userid: item.lister},
                    {title: '若账款还没有完成，请选择驳回上一步让制表人去处理', status: '已审批', userid: item.bookkeeper},
                    {title: '若账款还没有完成，请选择驳回上一步让制表人去处理', status: '收付款', userid: item.bookkeeper},
                    {title: '您已撤回修改，提交后重新走流程', status: '撤回中', userid: item.lister},
                ]
                let title = ''
                autitleTipArr.forEach(s => {
                    if (s.status == item.status && this.myUserId == s.userid) {
                        title = s.title
                    }
                })
                if (!title && item.status && item.status != '已完成') {
                    title = '这条账款正在走审批流程，等待完成'
                }
                return title
            }
        },

        mounted: function () {
            this.ctx = this.contextType;
            if (this.contextType == '_new') {
                this.content.codeType.value = this.reference.code
                if(this.myCompany.financeSetting){
                    this.content.reviewer.value = this.myCompany.financeSetting.reviewer
                    this.content.approver.value = this.myCompany.financeSetting.approver
                    this.content.bookkeeper.value = this.myCompany.financeSetting.bookkeeper
                }
            }
            this.updateContent();
            if (!this.datepicker) {
                this.datepicker = $calendar.create({
                    inputEl: '#transaction-date-input',
                    closeOnSelect: true
                });
            }
            this.updateStatus();

            const objectionStatus = ['审核驳回', '审批驳回', '收付驳回']
            objectionStatus.forEach(s => {
                if (
                    this.srcData &&
                    this.srcData.status == s &&
                    this.srcData.lister == this.myUserId
                ) {
                    $alert('此账款被驳回' + (this.srcData.objection ? ('，理由：' + this.srcData.objection) : ''))
                }
            })
            // if (this.srcData.payment == '报销') {
            //     this.srcData.reviewer = this.srcData.lister;
            //     this.content.reviewer.value = this.srcData.lister;
            //     this.content.approver.value = this.srcData.lister;
            //     this.content.bookkeeper.value = this.srcData.lister;
            //     // console.log(this.srcData);
            //     this.$forceUpdate();
            // }
        },
        created() {
            this.srcData = this.reference
        },
        methods: {
            ...mapMutations({
                changeLimitPersonnel: 'CHANGE_LIMIT'
            }),
            getHead(uid) {
                const u = this.who(uid)
                if (u && u.avatarUrl && u.avatarUrl.startsWith('http')) {
                    return u.avatarUrl
                } else {
                    return this.head
                }
            },
            getName(uid) {
                console.log(uid)
                const u = this.who(uid)
                return u && u.name || ''
            },
            updateStatus() {
                this.isAuditModel = false;
                this.isReviewerModel = false
                if (this.srcData && this.srcData.status) {
                    let status = this.srcData.status
                    if (status == '待审核' && this.myUserId == this.srcData.reviewer) {
                        this.isAuditModel = true;
                        this.doPassStatus = '已审核'
                        this.doRejectStatus = '审核驳回'
                    }
                    if (status == '已审核' && this.myUserId == this.srcData.approver) {
                        this.isAuditModel = true;
                        this.doPassStatus = '已审批'
                        this.doRejectStatus = '审批驳回'
                    }
                    if ((status == '已审批' || status == '收付款') && this.myUserId == this.srcData.bookkeeper) {
                        // this.isAuditModel = true;
                        this.doPassStatus = '已完成'
                        this.doRejectStatus = '收付驳回'
                        this.isReviewerModel = true
                    }
                    if ((status == '已审批' || status == '收付款') && this.myUserId == this.srcData.lister) {
                        this.isReviewerModel = true
                    }
                    // if ((status == '已确认') && this.myUserId == this.srcData.bookkeeper) {
                    //     this.isReviewerModel = true
                    // }

                    let editStatusArr = ['审核驳回', '审批驳回', '收付驳回', '撤回中']
                    if (editStatusArr.find(s => s == status) && this.myUserId == this.srcData.lister) {
                        this.toEdit() //进入编辑状态
                        this.isReEditButtom = false
                    }
                    let listerStatusArr = ['待审核', '待审批', '已审核', '已审批', '收付款']
                    if (listerStatusArr.find(s => s == status) && this.myUserId == this.srcData.lister) {
                        this.isReEditButtom = true
                    }

                }
            },
            // 把srcData >> content
            updateContent() {
                let cont = this.content;
                let ctx = this.curContext;
                let ref = this.srcData;

                cont.amount.label = this.shortname + '金额';

                Object.keys(cont).forEach(k => {
                    if (ctx.skipFields && ctx.skipFields.includes(k)) {
                        delete cont[k];
                        return;
                    }

                    if (ref && ref[k]) cont[k].value = ref[k];
                })
            },
            getAuditSataus(status) {
                let currStatus = this.srcData.status
                let arr = ['已审核', '已审批', '收付款', '已完成'];
                let Err = ['审核驳回', '审批驳回', '收付驳回'];

                let index = Err.indexOf(currStatus)
                if (index >= 0 && Err[index] == status) {
                    return 'reject'
                }
                index = (index >= 0) ? index : arr.indexOf(currStatus)
                arr = arr.splice(0, index + 1)
                if (arr.find(s => s == status)) {
                    return 'pass'
                } else {
                    return false
                }

                // let arr = ['待审核','驳回中','撤回中','已审核','已审批','收付款','已确认 ','已完成']
            },

            isReadOnly(key) {
                if (this.isAuditModel) return true;
                if (this.content[key].readonly) return true;

                if (typeof this.curContext.readonly == 'boolean') {
                    return this.curContext.readonly;
                } else if (this.curContext.readonly instanceof Array) {
                    if (this.curContext.readonly.includes(key)) return true;
                }

                return false;
            },

            // 切换操作模式
            toEdit() {
                this.ctx = this.curContext.edit;
                this.$forceUpdate();
            },

            open_personnelselector(item) {
                this.changeLimitPersonnel(item.isLimit || false);

                if (item.label != '经办人') {
                    this.pselector = $popup.open('#transaction-permissionselector');
                } else {
                    this.pselector = $popup.open('#transaction-personnelselector');
                }
                this.pselector.item = item;
            },

            selectEmployee(pList) {
                let item = this.pselector.item;

                if (pList && pList[0]) {
                    item.value = pList[0].uid || pList[0];
                } else {
                    item.value = '';
                }

                this.changeLimitPersonnel(false);
                if (item.label != '经办人') {
                    $popup.close('#transaction-permissionselector');
                } else {
                    $popup.close('#transaction-personnelselector');
                }
            },

            sanityCheck() {
                let err = [];
                Object.keys(this.content).forEach(k => {
                    let item = this.content[k];
                    if (item.madatory && !item.value) {
                        err.push(`${item.label}的值不能为空`);
                    }
                });
                return err.length > 0 ? err : null;
            },

            create(cb) {
                let content = this.content;

                if (content._id.value) {
                    cb(new Error('该记录已经存在'));
                    return;
                }

                let inputErr = this.sanityCheck();
                if (inputErr) {
                    cb(new Error(inputErr[0]));
                    return;
                }

                let payload = this.rawContent;
                delete payload._id;

                axios.post('api/finance/transaction', payload).then((resp) => {

                    cb(resp.data);

                }).catch(err => {
                    console.log(err);
                    cb(new Error('无法创建新记录'));
                })
            },

            update(cb) {
                let content = this.content;

                if (!content._id.value) {
                    cb(new Error('该记录不存在，无法更新'));
                    return;
                }

                let inputErr = this.sanityCheck();
                if (inputErr) {
                    cb(new Error(inputErr[0]));
                    return;
                }

                let payload = this.rawContent;
                let id = payload._id;
                delete payload._id;
                payload.status = '待审核'
                axios.put('api/finance/transaction/' + id, payload).then((resp) => {
                    cb(resp.data);
                }).catch(err => {
                    console.log(err);
                    cb(new Error('无法更新该记录'));
                })
            },

            query(cb) {
                let payload = this.rawContent;
                delete payload._id;
                Object.keys(payload).forEach(k => {
                    // remove empty fields
                    let v = payload[k];
                    if (typeof v == 'string' && v == '') delete payload[k];
                    if (v instanceof Array && v.length == 0) delete payload[k];
                })

                if (Object.keys(payload).length == 0) {
                    cb(new Error('必须填写查询条件'));
                    return;
                }

                if (this.srcData.code) {
                    let c = payload.code;
                    if (!c || !c.startsWith(this.srcData.code)) {
                        payload.code = this.srcData.code + (c ? c : '');
                    }
                }

                console.log(payload)

                axios.get('api/finance/transaction?q=' + JSON.stringify(payload)).then((resp) => {

                    let records = [];
                    for (var j = 0, len = resp.data.length; j < len; j++) {

                        let obj = resp.data[j];
                        let reg = RegExp(/GZ/);
                        let reg1 = RegExp(/YF/);
                        let reg2 = RegExp(/YS/);
                        let reg3 = RegExp(/A/);

                        if (payload['code'] == 'Z') {
                            reg3 = RegExp(/ZD/);
                        } else if (payload['code'] == 'ZD') { // 支付
                            reg3 = RegExp(/A/);
                        } else if (payload['code'] == 'GZ') { // 工资
                            reg = RegExp(/A/);
                        } else if (payload['code'] == 'YF') { // 应付
                            reg1 = RegExp(/A/);
                        } else if (payload['code'] == 'YS') { // 应收
                            reg2 = RegExp(/A/);
                        }

                        if (obj.code.match(reg) || obj.code.match(reg1) || obj.code.match(reg2) || obj.code.match(reg3)) ; else {
                            records.push(obj)
                        }
                    }
                    cb(records);
                }).catch(err => {
                    console.log(err);
                    cb(new Error('查询出错'));
                })
            },
            doAuditPass() {
                $confirm('你确定要通过吗？', () => {
                    $preloader.show();
                    axios.put('api/finance/transaction/' + this.srcData._id, {status: this.doPassStatus}).then(res => {
                        $preloader.hide();
                        $alert('操作成功！')
                        this.srcData.status = this.doPassStatus
                        this.updateStatus()
                    }).catch(err => {
                        $preloader.hide();
                        $alert('操作失败！')
                    })
                })
            },
            doAuditReject() {
                this.content.objection.value = this.objection
                $preloader.show();
                axios.put('api/finance/transaction/' + this.srcData._id, {
                    status: this.doRejectStatus,
                    objection: this.objection
                }).then(res => {
                    $preloader.hide();
                    $alert('操作成功！')
                    this.srcData.status = this.doRejectStatus
                    this.objectionDialog = false
                    this.updateStatus()
                }).catch(err => {
                    $preloader.hide();
                    $alert('操作失败！')
                })
            },
            doReEdit() {
                $confirm('您确定要撤回修改吗？', () => {
                    $preloader.show();
                    axios.put('api/finance/transaction/' + this.srcData._id, {status: '撤回中'}).then(res => {
                        $preloader.hide();
                        $alert('操作成功！')
                        this.srcData.status = '撤回中'
                        this.updateStatus()
                    }).catch(err => {
                        $preloader.hide();
                        $alert('操作失败！')
                    })
                })
            },
            doReviewerAction() {
                let buttons = []
                if ('已审批' == this.srcData.status && this.myUserId == this.srcData.lister) {
                    buttons.push({
                        text: '已经收到账款，提交给出纳', onClick: () => {
                            $preloader.show();
                            axios.put('api/finance/transaction/' + this.srcData._id, {status: '收付款'}).then(res => {
                                $preloader.hide();
                                $alert('操作成功！')
                                this.srcData.status = '收付款'
                                this.updateStatus()
                            }).catch(err => {
                                $preloader.hide();
                                $alert('操作失败！')
                            })
                        }
                    })
                }
                if (('已审批' == this.srcData.status || '收付款' == this.srcData.status) && this.myUserId == this.srcData.bookkeeper) {
                    buttons.push({
                        text: '确认账款', onClick: () => {
                            $preloader.show();
                            axios.put('api/finance/transaction/' + this.srcData._id, {status: '已完成'}).then(res => {
                                $preloader.hide();
                                $alert('操作成功！')
                                this.srcData.status = '已完成'
                                this.updateStatus()
                            }).catch(err => {
                                $preloader.hide();
                                $alert('操作失败！')
                            })
                        }
                    })
                    buttons.push({
                        text: '驳回账款', onClick: () => {
                            this.objectionDialog = true
                            // $preloader.show();
                            // axios.put('api/finance/transaction/' + this.srcData._id, {status: '收付驳回'}).then(res => {
                            //     $preloader.hide();
                            //     $alert('操作成功！')
                            //     this.srcData.status = '收付驳回'
                            //     this.updateStatus()
                            // }).catch(err => {
                            //     $preloader.hide();
                            //     $alert('操作失败！')
                            // })
                        }
                    })
                }
                // buttons.push({text: '还没收到账款，延期收款'})
                if ('已完成' != this.srcData.status && this.myUserId == this.srcData.lister) {
                    buttons.push({
                        text: '撤销掉这条账款', onClick: () => {
                            $preloader.show();
                            axios.put('api/finance/transaction/' + this.srcData._id, {status: '撤回中'}).then(res => {
                                $preloader.hide();
                                $alert('操作成功！')
                                this.srcData.status = '撤回中'
                                this.updateStatus()
                            }).catch(err => {
                                $preloader.hide();
                                $alert('操作失败！')
                            })
                        }
                    })
                }

                buttons.push({text: '取消'})
                $dialog.create({
                    title: '账款处理结果',
                    // text: '',
                    buttons,
                    verticalButtons: true,
                }).open();
                this.isReEditButtom = false
            },
            doAction() {
                $preloader.show();
                let action = this.curContext.action;

                this[action.op]((result) => {
                    $preloader.hide();

                    if (result instanceof Error) {
                        console.log(result);
                        $alert(result.message || '未知的错误', '操作错误');
                    } else {
                        if (action.nextPage) {
                            this.$f7router.navigate(action.nextPage, {
                                props: {
                                    name: this.name,
                                    shortname: this.shortname,
                                    data: result
                                },
                                reloadCurrent: true
                            })
                        } else {
                            this.$f7router.back();
                        }
                    }
                });
            }

        }
    }
</script>

