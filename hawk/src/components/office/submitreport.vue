<template>
    <f7-page :id="pageId" style="background: #f8f8f8" no-toolbar>
        <f7-navbar :title="title" back-link>
            <f7-nav-right>
                <f7-link href="#" @click="jumpTo('/report/history',{})">历史记录</f7-link>
            </f7-nav-right>
        </f7-navbar>
        <div v-if="reportTemplate._id">
            <div class="page-header">

                <p v-if="reportTemplate.period == 'day'">提交时间：{{arrayToString(reportOptionName('week',reportTemplate.days))}}({{reportOptionName('time',reportTemplate.startTime)}}-{{reportOptionName('time',reportTemplate.endTime)}})</p>
                <p v-if="reportTemplate.period == 'week'">开始提交时间：{{arrayToString(reportOptionName('weekAndTime',reportTemplate.startTimeOfWeek))}}, 截止时间：{{arrayToString(reportOptionName('weekAndTime',reportTemplate.endTimeOfWeek))}}</p>
                <p v-if="reportTemplate.period == 'month'">开始提交时间：{{arrayToString(reportOptionName('monthAndTime',reportTemplate.startTimeOfMonth))}}, 截止时间：{{arrayToString(reportOptionName('monthAndTime',reportTemplate.endTimeOfMonth))}}</p>
            </div>
            <div class="page-form">
                <ul>
                    <li class="clear-float" v-for="item in reportData.items">
                        <label class="form-label">{{item.name}}：</label>
                        <div class="input-group">
                            <input placeholder="请输入" type="number" v-model="item.value" v-bind:readonly="reportData._id &&(reportData.status != '已撤回' && reportData.status != '已驳回')"/>
                            <span>{{item.unit}}</span>
                        </div>


                    </li>
                </ul>
            </div>
            <div class="save_button">
                <f7-button class="hawk-button" big-ios  style="width: 80%;margin: 0 auto" @click="submit" v-if="!reportData._id || reportData.status == '已撤回'|| reportData.status == '已驳回'">提交</f7-button>
                <f7-button class="hawk-button" big-ios  style="width: 80%;margin: 0 auto" @click="recall" v-else-if="reportData._id && reportData.status !== '已确定'">撤回</f7-button>
                <f7-button color="gray" big-ios fill style="width: 80%;margin: 0 auto" v-else-if="reportData._id && reportData.status === '已确定'">无法撤回</f7-button>
            </div>
        </div>
        <div v-else class="no_template">
            <img :src="zero_employee_icon" width="71px" height="84px">
            <p>暂无数据</p>
            <p>需要管理员去添加汇报内容</p>
        </div>

    </f7-page>
</template>
<style scoped>
    ul,li{
        margin: 0;
        padding: 0;
    }
    .clear-float {
        clear:both;
        height: 0;
        line-height: 0;
        font-size: 0;
    }
    .save_button{
        margin-top: 25px;
    }
    .page-header{
        height: 36px;
        background: #fff5e4;
        text-align: center;
        overflow: hidden;
        text-overflow : ellipsis;

    }
    .page-header p{
        margin: 0;
        line-height: 36px;
        color: #f96a0e;

    }
    .page-form li{
        list-style: none;
        line-height: 50px;
        font-size: 16px;
        height: 50px;
        background: #ffffff;
        border-bottom: 1px solid #d8d8d8;
    }
    .form-label{
        margin-left: 20px;
    }
    .input-group{
        float: right;
        width: 60%;
    }
    .page-form input{
        width: 85%;
        display: inline-block;
        text-align: right;
        line-height: 50px;
        background:none;
        outline:none;
        border:0px;
        font-size: 16px;
    }
    .page-form span{
    }
    .save_tmp span{
        display:block;text-align: center; width:100%;color:#2196f3
    }
    .no_template{
        text-align: center;
        margin: 120px 0px auto;
    }
    .no_template p{
        font-size: 14px;
        color: #333333;
        margin: 5px 0;
    }
</style>
<script>
    import {mapGetters,mapMutations,mapActions} from 'vuex';
    import axios from 'axios';
    export default {
        name: 'submitdata',

        props: {
            lastPage: {
                type: String,
                default: '上一页'
            },
            title: {
                type: String,
                default: '填写数据'
            },
        },

        data: () => {
            return {
                pageId: 'datatemplate' + Math.floor(Math.random() * 100),
                zero_employee_icon: require('assets/images/ill_no_data@2x.png'),
                reportTemplate: {},
                reportData:{
                    user:'',
                    userName:'',
                    company:'',
                    template:'',
                    department:'',
                    items:[]
                }

            }
        },

        computed: {
            ...mapGetters([
                'reportOptionName',
                'myCompany',
                'myProfile',
                'userDepartment',
                'departmentName',
                'isDepartmentAdmin',
                'organization',
                'getSuperiorAdmin',
                'myUserId',
                'superAdmin'
            ])
        },

        mounted: function() {
            let self = this;
            if (this.userDepartment(this.myProfile._id)){
                self.reportData.company = this.myProfile.companyId;
                self.reportData.user = this.myProfile._id;
                self.reportData.userName = this.myProfile.name;
                self.reportData.department = this.userDepartment(this.myProfile._id).departmentId;
                $preloader.show();
                axios.get('api/reporttemplate/?q='+ JSON.stringify({departmentId:self.reportData.department})).then(resp => {
                    if (resp.data){
                        self.reportTemplate = resp.data;
                        self.$forceUpdate;
                        if (self.reportTemplate._id) {
                            axios.get('api/reportdata/getByUserInPeriod?q='+ JSON.stringify({template:self.reportTemplate._id,user:this.myProfile._id})).then(resp => {
                                if (resp.data){
                                    self.reportData = resp.data;
                                    if (self.reportData.status == '已驳回'){
                                        $alert(self.reportData.remark, '驳回原因')
                                    }
                                }
                                $preloader.hide();
                            });
                        }
                    }
                    $preloader.hide();
                });
                this.$forceUpdate;
            }

        },
        watch:{
            reportTemplate(val){
                let self = this;
                if(val){
                    self.reportData.template = val._id;
                    self.reportData.name = self.reportData.userName + '的'+val.name;
                    val.items.forEach(function(value, index, array){
                        self.reportData.items.push({name:value.name, unit:value.unit, value:null})

                    })
                }
            }
        },
        methods: {
            jumpTo(path, properties) {
                this.$f7router.navigate(path, {
                    props: properties
                });
            },
            arrayToString(array){
                let string = '';
                array.forEach(function (value,index) {
                    string +=value + ' ';
                })
                    return string;
            },

            recall(){
                let self = this;
                self.reportData.status='已撤回'
                axios.put("api/reportdata/"+self.reportData._id, this.reportData).then(resp => {
                    $preloader.hide();
                    $alert('撤回成功', '操作成功', () => {
                    })
                }).catch(err => {
                    $preloader.hide();
                    if (err.response.data.errorCode == 501) {
                        $alert(err.response.data.message, err.response.data.name);
                    }else {
                        $alert('无法撤回数据', '操作错误');
                    }

                });

            },
            submit() {
                let datas = this.reportData.items;
                for (let i in datas){
                    if ( !datas[i].value){
                        $dialog.alert('请先填写完整数据项', '提示');
                        return;
                    }
                }

                let admin = []
                let superior = this.getSuperiorAdmin(this.myUserId)
                if (this.superAdmin._id === this.myUserId) {
                    admin = [this.superAdmin._id]
                } else if (superior.length) {
                    superior.map(v => {
                        if (!admin.includes(v)) admin.push(v)
                    })
                }
                if (admin.length == 0) admin = [this.superAdmin._id]
                this.reportData.approver = admin
                // if (this.isDepartmentAdmin(this.myProfile._id)) {
                //     this.reportData.approver = this.organization.admin;
                // }else {
                //     this.reportData.approver = this.userDepartment(this.myProfile._id).admin;
                // }

                let self = this;
                let path = 'api/reportdata/submitReport';
                $preloader.show();
                axios.post(path, this.reportData).then(resp => {
                    $preloader.hide();
                    $alert('保存成功', '操作成功', () => {
                        self.$f7router.back();
                    })
                }).catch(err => {
                    $preloader.hide();
                    if (err.response.data.errorCode == 501) {
                        $alert(err.response.data.message, err.response.data.name);
                    }else {
                        $alert('无法保存数据，请稍后再试', '操作错误');
                    }

                });
            },
        }
    }
</script>

