<template>
    <f7-page  style="background: #f8f8f8" no-toolbar>
        <f7-navbar :title="title" back-link>
        </f7-navbar>
        <div class="list-item">
            <div class="list-header list-container">
                <img v-if="reportData.user" :src="who(reportData.user).avatarUrl||defaultAvatar"/>
                <div>
                    <p class="header-title">{{reportData.name}}</p>
                    <p class="header-time">{{(new Date(reportData.createdAt)).toLocaleString()}}</p>
                </div>
            </div>
            <div class="list-body list-container">
                <p v-for="(item,index) in reportData.items">{{item.name}}：{{item.value}}</p>
            </div>
            <div class="list-footer list-container">
            </div>
            <div>
                <input type="text" readonly="readonly" id="demo-picker-device"/>
            </div>
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

</style>
<script>
    import {mapGetters,mapMutations,mapActions} from 'vuex';
    import axios from 'axios';
    export default {
        name: 'reportdetail',

        props: {
            id:{
                type:String,
            },
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
                reportData:{}
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
        created(){
            let self = this;
            $preloader.show();
            axios.get('api/reportdata/'+self.id).then(resp => {
                self.reportData = resp.data;
                $preloader.hide();
            });
        },
        mounted: function() {
            var pickerDevice = this.$f7.picker.create({
                inputEl: '#demo-picker-device',
                cols: [
                    {
                        textAlign: 'center',
                        values: ['iPhone 4', 'iPhone 4S', 'iPhone 5', 'iPhone 5S', 'iPhone 6', 'iPhone 6 Plus', 'iPad 2', 'iPad Retina', 'iPad Air', 'iPad mini', 'iPad mini 2', 'iPad mini 3']
                    }
                ]
            });

        },
        watch:{
        },
        methods: {

        }
    }
</script>

