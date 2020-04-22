<template>
    <div  style="background: #f8f8f8;margin-top: 10px">
        <div class="select-user-div" @click="selectorPersonnelShow = true">
            <input type="text" :value="(user && who(user).name)||'选择员工'"  readonly="readonly"/>
            <i class="f7-icons">chevron_down</i>
        </div>
        <div>
            <!--<div class="list-item" v-for="(data,i) in reportDatas"  @click="jumpTo('/report/reportaudit/',i)">-->
            <div class="list-item" v-for="(data,i) in reportDatas"  >
                <div class="list-header list-container">
                    <img :src="who(data.user).avatarUrl||defaultAvatar"/>
                    <div @click="auditReport(i)">
                        <p class="header-title">{{data.name}}</p>
                        <p class="header-time">{{(new Date(data.createdAt)).toLocaleString()}}</p>
                    </div>
                    <div class="action" @click="openActionsPopover(i)">...</div>
                </div>
                <div class="list-body list-container" @click="auditReport(i)">
                    <p v-for="(item,index) in data.items" v-if="index<4">{{item.name}}：{{item.value}} {{item.unit || ''}}</p>
                </div>
                <div class="list-footer list-container" @click="auditReport(i)">
                    详情
                    <span v-if="data.status == '未读'" style="color: #FF715A">{{data.status}}</span>
                    <span v-if="data.status == '已读'" style="color: #01B38B">{{data.status}}</span>
                    <span v-if="data.status == '已驳回'" style="color: #FFAB00">{{data.status}}</span>
                    <span v-if="data.status == '已确认'" style="color: #666666">{{data.status}}</span>
                </div>
            </div>

        </div>
        <div v-if="!reportDatas.length" class="no_template">
            <img :src="zero_employee_icon" width="71px" height="84px">
            <p>暂无数据</p>
        </div>

        <f7-popup :opened="selectorPersonnelShow" @popup:closed="(selectorPersonnelShow = false)">
            <employeepicker
                    :multiple="false"
                    :parentDepartmentId="IamDepartmentAdmin && superAdmin._id !== myProfile._id ? userDepartment(myProfile._id).departmentId:''"
                    @employee:cancel="selectorPersonnelShow = false"
                    @employee:selected="selectUser"
            ></employeepicker>
        </f7-popup>
        <f7-popup id="reportList-reportaudit">
            <reportaudit
                   :report-data="reportDatas[selectReportIndex]"
                    @submit="updateReport"
                    @cancel="$f7.popup.close('#reportList-reportaudit')"
            ></reportaudit>
        </f7-popup>
    </div>
</template>
<style scoped>
p{margin: 0;padding: 0;}
.select-user-div{
    background: #FFFFFF;
}
.select-user-div {
    background: #FFFFFF;
    height: 50px;
    margin-bottom: 10px;
}
.select-user-div input{
    display:inline-block;
    padding: 0;
    margin-left: -10px;
    text-align: center;
    line-height: 50px;
}
.f7-icons{
    float: right;
    margin-right: 10px;
    display:inline-block;
    font-size: 1em;
    line-height: 50px;
    color: #CCCCCC;
}
.list-item{background: white;margin-bottom: 10px}
.list-header{height: 70px;}
.list-header div{
    margin-left: 10px;
    margin-top: 20px;
    float: left;
}
.header-title{font-size: 16px;font-weight:600}
.header-time{font-size: 11px;color: #999999}
.list-container{
    width: 85%;
    margin: 0 auto;
}
.list-body{
    color: #595b62;
    line-height: 28px;
    font-size: 14px;
}
.list-header img{
    float: left;
    width: 35px;
    height: 35px;
    margin-top: 22px;
    border-radius: 50%;
}
.list-footer{
    height: 36px;
    line-height: 36px;
    color: #576997;
    background: white;
}
.list-footer span{
    float: right;
}
.list-item .action{
    margin-top: 14px;
    float: right;
    font-size: 16px;
    color: #595b62;
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
    import employeepicker from 'gadget/employeepicker.vue';
    import reportaudit from './reportaudit';
    import axios from 'axios';
    import moment from 'moment'
    export default {
        name: 'reportList',
        components:{
            employeepicker,
            reportaudit,
        },
        props: {

        },

        data: () => {
            return {
                selectorPersonnelShow:false,
                defaultAvatar:require("assets/images/hp_default_70@2x.png"),
                reportDatas:[],
                selectReportIndex:0,
                user:'',
                zero_employee_icon: require('assets/images/ill_no_data@2x.png'),
            }
        },

        computed: {
            ...mapGetters([
                'who',
                'superAdmin',
                'isDepartmentAdmin',
                'userDepartment',
                'myCompany',
                'myProfile',
                'departmentName',
                'myUserId',
                'personnel'
            ]),
            IamDepartmentAdmin(){
                if (this.myProfile._id){
                    return this.isDepartmentAdmin(this.myProfile._id)
                }
            },
            IamSuperAdmin(){
                if (this.myProfile._id  && this.superAdmin ){
                    return this.superAdmin._id == this.myProfile._id
                }
            },

            pList() {
                if (this.superAdmin._id == this.myUserId) return this.personnel;

                // non-admin can only has itself
                let d = this.userDepartment(this.myUserId);
                if (!d.admin.includes(this.myUserId)) return this.personnel.filter(p => p._id == this.myUserId);

                // admin can has all its subordinates
                let self = this
                let subordinates = (function listE(d) {
                    return d.employees.slice(0).concat(
                        d.sub.reduce((accum, s) => {
                            if (s.admin.length) {
                                return accum.concat(s.admin)
                            } else {
                                return accum.concat(listE(s))
                            }
                        }, [])
                    ) || [];
                })(d);
                return this.personnel.filter(p => subordinates.includes(p._id))
            }
        },

        mounted: function() {
          this.getDatas();
        },
        watch:{

        },
        methods: {
            ...mapMutations({
                preloaderHide: 'PRELOADER_HIDE',
                preloaderShow: 'PRELOADER_SHOW'
            }),

            jumpTo(path, index) {
                this.$f7router.navigate(path, {
                    props: {reportData:obj}
                });
            },
            auditReport(index){
                let self = this;
                let obj = self.reportDatas[index];
                if (!obj.status||obj.status == '未读') {
                    this.preloaderShow(this);
                    axios.get('api/reportdata/read/'+obj._id).then(resp => {
                        self.reportDatas[index] = resp.data;
                        obj = resp.data;
                        this.preloaderHide(this);
                        self.$forceUpdate();
                    });
                }

                this.selectReportIndex = index;
                $f7.popup.open('#reportList-reportaudit');
            },
            delete(index){
                let self = this;
                let report = self.reportDatas[index];
                this.preloaderHide(this);
                axios.delete('api/reportdata/'+report._id).then(resp => {
                    self.reportDatas.splice(index,1);
                    this.$forceUpdate();
                    this.preloaderHide(this);
                });
            },
            getDateStr(AddDayCount) {
                var dd = new Date();
                dd.setDate(dd.getDate()+AddDayCount);
                var y = dd.getFullYear();
                var m = dd.getMonth()+1;
                var d = dd.getDate();
                return y+'-'+(m<10?'0'+m:m)+'-'+d;
            },
            getDatas(){
                let self = this;
                let params = {};
                if (this.myCompany) {
                    params.company = this.myCompany._id;

                }
                if (this.user){
                    params.user = this.user;
                }else {
                    params.directlyUser = true;
                    let nowDay = moment().format('YYYY-MM-DD')
                    params.startTime = this.getDateStr(-2) + ' 00:00:00'
                    params.endTime = nowDay + ' 23:59:59.999'
                    params.subList = this.pList.map(v => v._id)
                }
                params.status = {'$ne':'已撤回'};
                $preloader.show();
                axios.get('api/reportdata/?q='+ JSON.stringify(params)).then(resp => {
                    self.reportDatas = resp.data;
                    $preloader.hide();
                });
            },
            updateReport(obj){
                this.reportDatas[this.selectReportIndex] = obj
                $f7.popup.close('#reportList-reportaudit')
                this.$forceUpdate();
            },
            selectUser(pList) {
                if (pList && pList[0]) {
                    this.user = pList[0];
                    this.getDatas();
                } else {
                    this.user = null;
                    this.getDatas();
                }
                this.$forceUpdate();
                this.selectorPersonnelShow = false;
            },
            openActionsPopover(i) {
                let self = this;
                let app = self.$f7;
                let data = self.reportDatas[i];

                $preloader.show();
                axios.get('api/reportdata/auth/'+data._id).then(resp => {

                    $preloader.hide();
                    var buttons = [[
                            {
                                text: '查看全部',
                                onClick:function (actions,e) {
                                    self.selectUser([data.user])
                                }
                            },
                        ],[
                            {
                                text: '取消',
                            },
                        ]
                    ];
                    if (resp.data == true) {
                        buttons[0].push({
                            text: '删除',
                            color: 'red',
                            onClick(){
                                self.delete(i);
                            }
                        })
                    }
                  return buttons;
                }).then(buttons =>{
                    self.actionsToPopover = app.actions.create({
                            buttons: buttons,
                            targetEl: self.$el.querySelector('.button-to-popover'),
                        });
                    self.actionsToPopover.open();
                });

            },
        },
    }
</script>

