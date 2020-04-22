<template>
    <f7-page  style="background: #f8f8f8" no-toolbar>
        <f7-navbar :title="title" back-link>
        </f7-navbar>

        <div v-show="reportDatas.length > 0">
            <div class="list-item" v-for="(data,i) in reportDatas">
                <div class="list-header list-container">
                    <img :src="who(data.user).avatarUrl||defaultAvatar"/>
                    <div>
                        <p class="header-title">{{data.name}}</p>
                        <p class="header-time">{{(new Date(data.createdAt)).toLocaleString()}}</p>
                    </div>
                </div>
                <div class="list-body list-container">
                    <p v-for="(item,index) in data.items" v-if="index<4">{{item.name}}：{{item.value}}</p>
                </div>
                <div class="list-footer list-container" @click="jumpTo('/report/reportdetail/',{'id':data._id})">
                    详情
                </div>
            </div>
        </div>

        <div v-show="reportDatas.length == 0" class="no_template">
            <img :src="zero_employee_icon" width="71px" height="84px">
            <p>暂无数据</p>
        </div>

    </f7-page>
</template>
<style scoped>
p{margin: 0;padding: 0;}
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
                default: '历史记录'
            },
        },

        data: () => {
            return {
                defaultAvatar:require("assets/images/hp_default_70@2x.png"),
                zero_employee_icon: require('assets/images/ill_no_data@2x.png'),
                reportDatas:[]
            }
        },

        computed: {
            ...mapGetters([
                'who',
                'myCompany',
                'myProfile',
                'departmentName'
            ])
        },

        mounted: function() {
            let self = this;
            if (this.myProfile._id){
                $preloader.show();
                axios.get('api/reportdata/?q='+ JSON.stringify({user:this.myProfile._id})).then(resp => {
                    self.reportDatas = resp.data;
                    $preloader.hide();
                });
            }
        },
        watch:{
            reportTemplate(val){
                let self = this;
                if(val){
                    self.reportData.template = val._id;
                    self.reportData.name = self.reportData.userName + '的'+val.name;
                    val.items.forEach(function(value, index, array){
                        self.reportData.items.push({name:value.name,unit:value.unit,value:null})

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
        }
    }
</script>

