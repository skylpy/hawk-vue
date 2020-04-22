<template>
    <f7-page  style="background: #f8f8f8" >
        <f7-navbar :title="title">
            <f7-nav-right>
                <f7-link href="#" @click="cancel">取消</f7-link>
            </f7-nav-right>
        </f7-navbar>
        <div class="page-header">
            <p>有些员工不需要参与某项考核的，可以点击忽略</p>
        </div>
        <div class="list-item">
            <div class="list-header list-container">
                <img v-if="reportData.user" :src="who(reportData.user).avatarUrl||defaultAvatar"/>
                <div>
                    <p class="header-title">{{reportData.name}}</p>
                    <p class="header-time">{{(new Date(reportData.createdAt)).toLocaleString()}}</p>
                </div>
            </div>
            <div class="list-body list-container">
                <p v-for="(item,index) in reportData.items">{{item.name}}：{{item.value}} {{item.unit || ''}}</p>
            </div>
            <div class="list-footer list-container">
            </div>
            <div>
                <input type="text" readonly="readonly" id="demo-picker-device"/>
            </div>
        </div>
        <div class="page-footer" v-if="showButton">
            <f7-button big-ios  color="red" style="float:left;width: 40%;margin-left: 10%" @click="reject">驳回</f7-button>
            <f7-button big-ios  class="hawk-button" style="float:right;width: 40%;margin-right: 20px" @click="confirm">确认</f7-button>
        </div>
    </f7-page>
</template>
<style scoped>
    p{margin: 0;padding: 0;}
    .page-header{
        height: 36px;
        background: #fff5e4;
        text-align: center;
    }
    .page-header p{
        margin: 0;
        line-height: 36px;
        color: #f96a0e;
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
    .page-footer{
        /*position: fixed;*/
        /*bottom: 100px;*/
        width: 100%;
    }

</style>
<script>
    import {mapGetters,mapMutations,mapActions} from 'vuex';
    import axios from 'axios';
    export default {
        name: 'reportaudit',

        props: {
            reportData:{
                type:Object,
                default:function () {
                    return {};
                }
            },
            lastPage: {
                type: String,
                default: '上一页'
            },
            title: {
                type: String,
                default: '个人数据汇报'
            },
        },

        data: () => {
            return {
                defaultAvatar:require("assets/images/hp_default_70@2x.png"),
                reportUser:null,
                showButton:false,
            }
        },

        computed: {
            ...mapGetters([
                'who',
                 'superAdmin',
                'isDepartmentAdmin',
                'myCompany',
                'myProfile',
                'departmentName'
            ]),
            IamDepartmentAdmin(){
                if (this.myProfile._id){
                    return this.isDepartmentAdmin(this.myProfile._id)
                }
            },
            IamSuperAdmin(){
                if (this.myProfile._id && this.superAdmin ){
                    return this.superAdmin._id == this.myProfile._id
                }
            }
        },

        mounted: function() {

        },
        watch:{
            reportData: function (val) {
                let self = this;
                if (this.reportData.user) {
                    $preloader.show();
                    self.showButton = false;
                    axios.get('api/reportdata/auth/'+this.reportData._id).then(resp => {
                        if (self.reportData.status == '已读' && resp.data){
                            self.showButton = true;
                        }
                        $preloader.hide();
                    });

                }

            }
        },
        methods: {
            confirm(){
                let self = this;
                $dialog.confirm('是否确认该汇报?','确认', function () {
                    let status = self.reportData.status;
                    self.reportData.status = '已确认'
                    let path = 'api/reportdata/'+self.reportData._id;
                    $preloader.show();
                    axios.put(path, self.reportData).then(resp => {
                        $preloader.hide();
                        $alert('保存成功', '操作成功', () => {
                            self.$emit('submit', self.reportData);
                        })
                    }).catch(err => {
                        self.reportData.status = status;
                        $preloader.hide();
                        console.error(err);
                        $alert('无法保存数据，请稍后再试', '操作错误');
                    });
                });
            },
            reject(){
                let self = this;
                $dialog.prompt('请填写驳回原因', '驳回原因', val => {
                    let status = self.reportData.status;
                    self.reportData.status = '已驳回'
                    self.reportData.remark = val;
                    let path = 'api/reportdata/'+self.reportData._id;
                    $preloader.show();
                    axios.put(path, self.reportData).then(resp => {
                        $preloader.hide();
                        $alert('操作成功', '操作成功', () => {
                            self.$emit('submit', self.reportData);
                        })
                    }).catch(err => {
                        self.reportData.status = status;
                        self.reportData.remark = '';
                        $preloader.hide();
                        console.error(err);
                        $alert('无法保存数据，请稍后再试', '操作错误');
                    });
                });
            },
            cancel() {
                this.$emit('cancel');
            }

        }
    }
</script>

