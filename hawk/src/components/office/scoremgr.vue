<template>
    <f7-page>
        <f7-navbar title="考核设置" back-link></f7-navbar>
        <f7-list  v-if="isAdmin" style="background-color: white">
            <f7-list-item title="汇报" link="#" after="设置" @click="jumpTo('/office/scorelist/', {ruleModule:'report',pageName:'汇报'})"></f7-list-item>
            <f7-list-item title="考勤" link="#" after="设置" @click="jumpTo('/office/scorelist/', {ruleModule:'attendance',pageName:'考勤'})"></f7-list-item>
            <f7-list-item title="任务" link="#" after="设置" @click="jumpTo('/office/scorelist/', {ruleModule:'task',pageName:'任务'})"></f7-list-item>
            <f7-list-item title="日报" link="#" after="设置" @click="jumpTo('/office/scorelist/', {ruleModule:'daily',pageName:'日报'})"></f7-list-item>
            <f7-list-item title="拜访" link="#" after="设置" @click="jumpTo('/office/scorelist/', {ruleModule:'visit',pageName:'拜访'})"></f7-list-item>
            <f7-list-item title="自定义" link="#" after="设置" @click="jumpTo('/office/scorelist/', {ruleModule:'custom',pageName:'自定义'})"></f7-list-item>
            <f7-list-item title="TEST::开启猎鹰服务" link="#" after="设置" @click="startTraceServer"></f7-list-item>
            <f7-list-item title="TEST::获取最后定位" link="#" after="设置" @click="queryLatestPoint"></f7-list-item>
            <f7-list-item title="TEST::获取历史轨迹" link="#" after="设置" @click="queryHistoryTrack"></f7-list-item>
            <f7-list-item title="TEST::腾讯推送注册" link="#" after="设置" @click="xgpushinit"></f7-list-item>
            <f7-list-item title="TEST::腾讯推送事件" link="#" after="设置" @click="xgpush"></f7-list-item>
            <f7-list-item title="TEST::推送本地消息" link="#" after="设置" @click="testPush"></f7-list-item>
            <f7-list-item title="TEST::获取推送TOKEN" link="#" after="设置" @click="getToken"></f7-list-item>
        </f7-list>
    </f7-page>
</template>

<style scoped>

    .ts_con {
        height: 95px;
        width: 100%;
    }

    .ts {
        text-align: center;
        width: 120px;
        margin-top: 10px;
        float: left;
    }

    .ts > div:first-child {
        font-size: 22px;
    }

    .ts > div {
        font-size: 18px;
        line-height: inherit;
    }

    .ts > span {
        font-size: 14px;
        color: #616161;
    }

    .asp {
        margin: 24px 0px;
        width: 100px;
        float: right;
    }

    .asp > div {
        font-size: 16px;
        color: #444444;
    }

    .mark {
        font-size: 14px;
        height: 95px;
        margin-top: 38px;
        float: right;
        color: #acacac;
    }
</style>
<script>
    import {createDateTimePicker} from 'lib/datetime';
    import {mapGetters, mapActions} from 'vuex';
    import employeepicker from 'gadget/employeepicker.vue';
    import axios from 'axios';

    export default {
        components: {
            employeepicker
        },
        data() {
            return {
                selectorPersonnelShow:false,
            }
        },
        created(){
        },
        mounted() {
        },

        computed: {
            ...mapGetters([
                'myUserId',
                'myProfile',
                'myCompany'
            ]),
            isAdmin(){
                return this.myProfile.superadmin || this.myProfile.privilege.filter(item=>item=='考核设置').length
            }
        },

        methods: {
            jumpTo(path, props) {
                console.log(props)
                props = props || {}
                this.$f7router.navigate(path, {props});
            },
            startTraceServer(){
                cordova.plugins.aMapTrack.startTrackServer(33398,'test', 88521167, 120, function (res) {
                    console.log('aMapTrack_2',res)
                },function (err) {
                    console.error('aMapTrack_3',err)
                })
            },
            queryLatestPoint(){
                cordova.plugins.aMapTrack.queryLatestPoint(function (res) {
                    console.log('queryLatestPoint',res)
                },function (err) {
                    console.error('queryLatestPoint',err)
                })
            },
            queryHistoryTrack(){
                let startTime = new Date()
                let endTime = new Date()

                startTime.setHours(0)
                startTime.setMinutes(0)
                startTime.setSeconds(0)
                startTime.setMilliseconds(0)

                endTime.setHours(23)
                endTime.setMinutes(59)
                endTime.setSeconds(59)
                endTime.setMilliseconds(999)

                cordova.plugins.aMapTrack.queryHistoryTrack(startTime.getTime(), endTime.getTime(), function (res) {
                    console.log('queryHistoryTrack::',res)
                },function (err) {
                    console.error('queryHistoryTrackError::',err)
                })
            },
            xgpushinit(){
                xgpush.on("register", function (data) {
                    console.log("XGPUSH register:", data);
                });
                xgpush.on("unRegister", function (data) {
                    console.log("XGPUSH unRegister:", data);
                });
                xgpush.on("message", function (data) {
                    console.log("XGPUSH message:", data);
                });

                xgpush.on("click", function (data) {
                    console.log("XGPUSH click:" + JSON.stringify(data));
                });
                xgpush.on("show", function (data) {
                    console.log("XGPUSH show:", data);
                });
                xgpush.on("deleteTag", function (data) {
                    console.log("XGPUSH deleteTag:", data);
                });
                xgpush.on("setTag", function (data) {
                    console.log("XGPUSH setTag:", data);
                });
                xgpush.getLaunchInfo(function (data) {
                    console.log("XGPUSH getLaunchInfo：" + JSON.stringify(data));
                });
                xgpush.enableDebug(true,function(s){
                    console.log('XGPUSH DEBUG',s)
                },function(e){
                    console.error('XGPUSH DEBUG',e)
                })
            },
            xgpush(){
                console.log('START XGPUSH;', this.myUserId)
                xgpush.registerPush(this.myUserId,function(s){
                    console.log('XGPUSH.registerPush',s)
                },function(e){
                    console.error('XGPUSH.registerPush',e)
                })

            },
            testPush(){
                xgpush.addLocalNotification(1,'test','this is test!',function(s){
                    console.log('XGPUSH.addLocalNotification',s)
                },function(e){
                    console.error('XGPUSH.addLocalNotification',e)
                })
                xgpush.addLocalNotification(2,'test','this is test!',function(s){
                    console.log('XGPUSH.addLocalNotification',s)
                },function(e){
                    console.error('XGPUSH.addLocalNotification',e)
                })
            },
            getToken(){
                xgpush.getToken(function (data) {
                    window.
                    console.log("XGPUSH getLaunchInfo：" + JSON.stringify(data));
                });
            }
        }
    }
</script>
