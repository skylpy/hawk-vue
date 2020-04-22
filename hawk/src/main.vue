<template>
    <!-- App -->
    <f7-app :params="f7params">
        <f7-view main :stackPages="true" :iosSwipeBack="false" url='/login/'></f7-view>
    </f7-app>
</template>

<style>
    body{
        user-select: none;
    }
    input,textarea{
        user-select: text;
    }
</style>

<script>

import routes from './routes.js';
import { mapGetters, mapActions, mapMutations } from 'vuex';
import axios from 'axios';
import { setInterval } from 'timers';
import { setPermission } from 'lib/permission';
import {saveToLogFile, readFromLogFile} from 'lib/logfile';
import carList from "src/components/office/carList";

export default {

    data() {
        return {
            f7params: {
                theme: 'ios',
                routes,
                id: 'com.sanfanerp.com',
                touch: {
                    tapHold: true,
                    fastClicks:true,
                    materialRipple:true,
                    activeState: true,
                    disableContextMenu: false,
                },

                dialog: {
                    title: '三帆外勤',
                    // change default "OK" button text
                    buttonOk: '确定',
                    buttonCancel: '取消'
                },

                calendar: {
                    monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                    monthNamesShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                    dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
                    dayNamesShort: ['日', '一', '二', '三', '四', '五', '六']
                }
            },

            isInit: false,
            gpsInterval: null
        }
    },
    computed: {
        ...mapGetters([
            'isAuth',
            'IamAdmin',
            'IamManager',
            'notification',
            'myProfile',
            'getSuperiorAdmin',
            'myUserId',
            'superAdmin'
        ]),

    },
    methods: {
        ...mapActions({
            'login': 'LOGIN',
            'remove_notification': 'REMOVE_NOTIFICATION',
            'im_init':'IM_INIT'
        }),

        ...mapMutations({
            keeplog: 'SAVEOUTPUT',
            setSoftware: 'SOFTWARE_CONFIG_SET',
            preloaderHide: 'PRELOADER_HIDE',
            preloaderShow: 'PRELOADER_SHOW',
            updateDeivce: 'UPDATE_DEVICE',
        }),

        load3rdPartyLibs() {
            //three JS files that need to be loaded one after the other
            var libs = [
                'https://webapi.amap.com/maps?v=1.4.12&key=' + CONFIG.amap.key,
                'https://webapi.amap.com/ui/1.0/main.js'
            ];
            var index = 0;
            var tag = 0
            var time
            let isTipLoadingError = true

            // 测试网络
            let checkNetworkTimeID
            let timeout = 10000
            var checkNetwork = function (callback) {
                console.log('正在测试网络ByAMap', new Date().toLocaleString());
                axios.get("/api/chat/heartbeat?t=" + Math.random()).then(() => {
                    $dialog.close()
                    if (checkNetworkTimeID) clearTimeout(checkNetworkTimeID);
                    if (callback) callback();
                }).catch(() => {
                    if (checkNetworkTimeID) clearTimeout(checkNetworkTimeID);
                    checkNetworkTimeID = setTimeout(() => {
                        checkNetwork(callback);
                    }, timeout);
                });
            }
            var injectLibFromStack = function(){

                if(libs.length > index && libs[index]){

                    //grab the next item on the stack
                    var tagBak = tag
                    var nextLib = libs[index];
                    var headTag = document.getElementsByTagName('head')[0];

                    //create a script tag with this library
                    var scriptTag = document.createElement('script');
                    scriptTag.type= 'text/javascript';
                    scriptTag.src = nextLib;
                    //when successful, inject the next script
                    scriptTag.onload = function(e){
                        console.info(nextLib + ' [loaded]');
                        index++
                        tag++
                        injectLibFromStack();
                    };
                    if(time)clearTimeout(time)
                    time = setTimeout(function () {
                        checkNetwork(function () {
                            if(tag != tagBak)return
                            console.info(nextLib + ' [reload]');
                            tag++
                            if(time)clearTimeout(time)
                            if (tag > 10 && isTipLoadingError) {
                                $dialog.close()
                                $dialog.preloader('因网络问题，高德地图加载失败');
                                setTimeout(() => {
                                    isTipLoadingError = false
                                    $dialog.close()
                                }, 3000)
                            }
                            injectLibFromStack()
                        })
                    }, 10000)
                    //append the script tag to the <head></head>
                    headTag.appendChild(scriptTag);
                }
                else return;
            }

            //start script injection
            injectLibFromStack();
        },

        registerF7api() {
            this.$f7ready(f7 => {
                // framework7 API globalization
                window.$f7 = f7;

                window.$calendar = f7.calendar;
                window.$popup = f7.popup;
                window.$dialog = f7.dialog;
                window.$alert = f7.dialog.alert;
                window.$confirm = f7.dialog.confirm;
                window.$prompt = f7.dialog.prompt;
                window.$preloader = f7.preloader;
                window.$sheet = f7.sheet;

                console.log("[init] F7 api installed");
            });
        },

        registerGlobalAPI() {
            window.deepCopy = function(o) {
                if (!o || (typeof o != 'object')) return o;
                return JSON.parse(JSON.stringify(o));
            }

            Date.prototype.toHawkDateString = function() {
                let y = this.getFullYear();
                let m = this.getMonth() + 1;
                let d = this.getDate();

                return y + '-' + (m > 9 ? '' : '0') + m + '-' + (d > 9 ? '' : '0') + d;
            }

            Date.prototype.toHawkString = function() {
                return this.toHawkDateString() + ' ' + this.toHawkTimeString();
            }

            Date.prototype.toMinutesString = function() {
                return this.toHawkDateString() + ' ' + this.toHawkMinuteString();
            }

            Date.prototype.toHawkMinuteString = function() {
                const h = this.getHours()
                const m = this.getMinutes()
                // const s = this.getSeconds()
                return `${h > 9 ? h : `0${h}`}:${m > 9 ? m : `0${m}`}`
            }

            Date.prototype.toHawkTimeString = function() {
                const h = this.getHours()
                const m = this.getMinutes()
                const s = this.getSeconds()
                return `${h > 9 ? h : `0${h}`}:${m > 9 ? m : `0${m}`}:${s > 9 ? s : `0${s}`}`
            }

            Date.parseHawkDateString = function(hawk_date_string/* YYYY-MM-DD */) {
                if (!hawk_date_string) return new Date();
                let parts = hawk_date_string.split('-').map(p => parseInt(p));
                if (parts.length != 3) return new Date();
                parts[1] -= 1;

                let milliseconds = Date.UTC(...parts) - 8*3600*1000; // minus GMT+8
                return new Date(milliseconds);
            }

            Date.parseHawkString = function(hawk_string/* YYYY-MM-DD HH:mm:ss */) {
                if (!hawk_string) return new Date();
                let datetime = hawk_string.split(/[- :]/);
                if (datetime.length != 6) return new Date();
                datetime[1] -= 1;

                let milliseconds = Date.UTC(...datetime) - 8*3600*1000; // minus GMT+8
                return new Date(milliseconds);
            }

            console.log('[init] install global API');
        },

        addEventHandler() {
            let self = this;

            let onBackKeyDown = function () {
                let app = self.$f7;
                let view = app.views.current;

                if ($('.modal-in').length > 0) {
                    app.dialog.close();
                    return false;
                } else if (view.router.history.length == 1) {
                    //app.dialog.confirm('确定要退出吗？', '退出软件', function() {
                        navigator.app.exitApp();
                    //});
                } else {
                    view.router.back();
                }
            }

            document.addEventListener("backbutton", onBackKeyDown, false);
            console.log('[init] add backbutton event handler');
        },

        takeOverConsole(){
            let console = window.console;
            window.keeplog = [];

            if (!console) return;

            function intercept(method){
                let original = console[method];

                console[method] = function(){
                    // do sneaky stuff
                    window.keeplog.push(JSON.stringify([method, ...arguments]));

                    if (original.apply){
                        // Do this for normal browsers
                        original.apply(console, arguments);
                    } else {
                        // Do this for IE
                        let message = Array.prototype.slice.apply(arguments).join(' ')
                        original(message);
                    }
                }
            }

            var methods = ['log', 'warn', 'error', 'info'];

            for (var i = 0; i < methods.length; i++)
                intercept(methods[i]);

            console.log('[init] intercept console logger...');
        },

        saveConsoleLog() {
            let toc = this.takeOverConsole;

            if (device.platform == "Android" || device.platform == "iOS") {
                toc();

                readFromLogFile(function(value) {
                    window.keeplogold = value ? JSON.parse(value) : [];
                });

                let logcnt = 0;
                setInterval(() => {
                    if (window.keeplog.length > logcnt) {
                        logcnt = window.keeplog.length;
                        saveToLogFile(window.keeplog)
                    }
                }, 5000);
            }

            window.onerror = function(msg, url, line, col, error) {
                var extra = !col ? '' : '\ncolumn: ' + col;
                extra += !error ? '' : '\nerror: ' + error;

                let err = "Error: " + msg + "\nurl: " + url + "\nline: " + line + extra;
                if (window.keeplog) window.keeplog.push(err);

                var suppressErrorAlert = false;
                // If you return true, then error alerts (like in older versions of
                // Internet Explorer) will be suppressed.
                return suppressErrorAlert;
            };

            console.log('[init] saving console log');
        },

        loadSysConfig() {
            console.log('[init] loading software configuration');

            let config = {};

            ['module-filter', 'subscriber', 'reminder'].forEach(c => {
                let item = localStorage.getItem(c);
                if (item) config[c] = JSON.parse(item);
            })

            this.setSoftware(config);
        },

        setNotificatonHandler() {
            let self = this;

            cordova.plugins.notification.local.on('detail', function (local_notification, eopts) {

                let notification = local_notification.data[0];
                self.remove_notification(notification._id).catch((err) => {});

                let path = '/';
                let props = {lastPage: '工作台', reference: notification.ref};

                switch (notification.category) {
                    case '请假': path = '/office/leave/';       break;
                    case '加班': path = '/office/overtime/';    break;
                    case '出差': path = '/office/travel/';      break;
                    case '通知': path = '/office/announce/';    break;
                    case '报销': path = '/office/expense/';     break;
                    case '日报': path = '/office/report/';      break;
                    case '任务': path = '/office/task/';        break;
                    case '客户': path = '/office/client/';      break;
                    case '拜访': path = '/office/visit/';       break;
                    case '汇报': path = '/office/submitreport/';       break;
                }

                self.$f7.views.main.router.navigate(path, { props });
            });
        },

        //获取两个时间相差了几个小时
        getIntervalHour(startDate, endDate) {
            var ms = endDate.getTime() - startDate.getTime();
            if (ms < 0)
                return 0;
            return Math.floor(ms/1000/60/60);
        },


        initiateUI() {
            try {
                if(window.plugins && window.plugins.jPushPlugin){
                    //初始化极光
                    window.plugins.jPushPlugin.setDebugMode(true);
                    window.plugins.jPushPlugin.init();
                    window.setTimeout(this.getRegistrationID(), 10000)
                    if (device.platform != "Android") {
                        window.plugins.jPushPlugin.setApplicationIconBadgeNumber(0);
                    }
                }
                if(window.xgpush){
                    // 获取信鸽推送TOKEN
                    window.setTimeout(this.getXGPushToken(), 10000)
                }
            } catch (exception) {
                console.log('An exception has been occured when init JPush plugin.' + exception);
            }
        },

        //获取RegistrationID
        getRegistrationID() {
            console.log("JPush.getRegistrationID")
            window.plugins.jPushPlugin.getRegistrationID(this.onGetRegistrationID)
        },

        //获取RegistrationID
        onGetRegistrationID(data) {
            console.log("JPush.onGetRegistrationID =", data)
            try {
                if (data == null || data.length === 0) {
                    if(window.xgPushToken)return //信鸽已存在，只允许使用一个
                    var t1 = window.setTimeout(this.getRegistrationID, 5000);
                } else {
                    window.registrationID = data
                }
            } catch (exception) {

                console.log(exception);
            }
        },

        //获取getXGPushToken
        getXGPushToken() {
            console.log("xgpush getXGPushToken 1")
            let tt = setInterval(()=>{
                if(window.xgPushToken){
                    clearInterval(tt)
                }else{
                    window.xgpush.getToken(this.onGetXGPushToken);
                }
            }, 5000)
        },

        //获取onGetXGPushToken
        onGetXGPushToken(data) {
            console.log("xgpush getXGPushToken=",data)
            try {
                if (data == null || data.length === 0) {
                    // var t1 = window.setTimeout(this.getXGPushToken, 5000);
                } else {
                    window.xgPushToken = data
                    this.initXGPushEvent()
                }
            } catch (exception) {

                console.log(exception);
            }
        },
        initXGPushEvent(){
            window.xgpush.on("click",function(data){
                console.log(data);
                /**
                 * {
                 *   activity:"com.changan.test.push.MainActivity", //android Only
                 * content:"这是内容",
                 * customContent:"{"vvva":"789"}",
                 * msgId:101217419,
                 * notifactionId:0,   //android Only
                 * notificationActionType:1, // android Only
                 * title:"测试推送",
                 * subtitle:"副标题", //iOS Only
                 * type:"show"
                 * }
                 **/
                if(data.customContent && data.customContent.msgId){
                    this.openDetail(data.customContent.msgId)
                }else{
                    // alert(title + data.content);
                }
            });
        },

        //打开通知
        onOpenNotification(event){
            console.log("JPush.onOpenNotification")
            try {
                var alertContent;
                if (device.platform == "Android") {
                    alertContent = event.alert;
                } else {
                    alertContent = event.aps.alert;
                }
                console.log(event.extras);
                this.openDetail(event.extras.msgId)
                // alert("open Notification:" + alertContent);
                console.log(event);
            } catch (exception) {
                console.log("JPushPlugin:onOpenNotification" + exception);
            }
        },

        // 接收到通知后执行请求
        goDetail(msgId){
            let self = this;

            axios.get("/api/notification/"+msgId).then(resp=>{
                let msg = resp.data

                console.log(msg);
                //判断时间相差三小时就不弹出框
                let hour = self.getIntervalHour(new Date(msg.createdAt),new Date());
                if (hour < 3) {
                    self.nobusy(alertContent, '推送消息', () => {

                        self.navigate(msg);
                    });
                }

            }).catch(err => {

                console.error(err);
            });
        },

        // 接收到通知后执行请求
        openDetail(msgId){
            let self = this;

            axios.get("/api/notification/"+msgId).then(resp=>{
                let msg = resp.data

                // alert(msg.url);
                console.log(msg);
                self.navigate(msg);

            }).catch(err => {

                console.error(err);
            });
        },

        //跳转页面
        navigate(msg){

            if (msg.url){
                // this.$f7router.navigate("", {})

                this.$f7.views.main.router.navigate(msg.url, {props:msg.extras});

            }else {
                this.$f7.views.main.router.navigate('/notification/detail/', {props: {msg}})
            }
        },

        nobusy(s, t, cb) {

            if (s) {
                this.alert(s, t, cb);
            }
        },

        alert(s, t, cb) {
            $dialog.create({
                title: t,
                content: s,
                buttons: [
                    {
                        text: '关闭',
                        bold:true
                    },
                    {
                        text: '查看',
                        onClick:cb
                    },
                ]
            }).open();
        },

        //接收到推送通知
        onReceiveNotification(event){
            console.log("JPush.onReceiveNotification")
            let self = this;
            try {
                var alertContent;
                if (device.platform == "Android") {
                    alertContent = event.alert;
                } else {
                    alertContent = event.aps.alert;
                }

                self.nobusy(alertContent, '推送消息', () => {

                    self.openDetail(event.extras.msgId)
                });

                // alert(" onReceiveNotification:" + alertContent)
                console.log(alertContent)
            } catch (exception) {
                console.log(exception)
            }
        },

        //接收到推送消息
        onReceiveMessage(event){
            console.log("JPush.onReceiveMessage")
            try {
                var message;
                if (device.platform == "Android") {

                    message = event.message;
                } else {

                    message = event.content;
                }
                window.plugins.jPushPlugin.getApplicationIconBadgeNumber(function(badgeNum) {
                    console.log("badgeNum*"+badgeNum);
                })
                // alert(" onReceiveMessage:" + message)
                console.log(device.platform + event)
                console.log(message)
            } catch (exception) {
                console.log("JPushPlugin:onReceiveMessage-->" + exception);
            }
        },

        //在后台进入前台
        onBackgroundNotification(event) {
            var alertContent = event.aps.alert

            console.log(event.extras)

            this.goDetail(event.extras.msgId)


            // self.goDetail("5c4ac0a55d3152c2cda3ce43");
            // alert("onBackgroundNotification:" + alertContent)
        },
        //判断是否是强制更新，是，则弹框
       /* mandatoryUpdate(){
            axios.get("http://47.107.165.66:8089/findLatestVersion?deviceSystem=ANDROID").then(res=>{
                console.log(this.oldVersion)
                var versionCode = CONFIG.versionCode;  //当前版本
                var version = res.data.version;
                var content = res.data.content;
                var innerVersion = res.data.innerVersion;   // 新版本
                var compulsive = res.data.compulsive;


                var target = "_system";
                var options = "location=yes,hidden=yes";
                let downloadApkUrl = res.data.downloadLink;
                let appUpdata = function (name) {

                    return function(dialog, e) {
                        dialog.close();
                        if (name === "退出应用") {
                            navigator.app.exitApp();
                        }else if (name === "升级") {
                            if (device.platform === "Android") {
                                cordova.InAppBrowser.open(downloadApkUrl, target, options);
                            } else {
                                cordova.InAppBrowser.open("https://itunes.apple.com/cn/app/id1448093868", target, options);
                            }
                        }
                    }

                }
                if (innerVersion > versionCode && compulsive) {
                    $dialog.create({
                        title: '强制更新: '+version,
                        text: content,
                        buttons: [
                            { text: '升级', onClick: appUpdata('升级') },
                            { text: '退出应用', onClick: appUpdata('退出应用') },
                        ],
                        verticalButtons: true,
                    }).open();
                }

            }).catch(err=>{
                err
            })
        },*/


        //初始化app
        init() {
            let self = this;

            self.saveConsoleLog();

            console.info('Initialization at mounted');
            console.log('NODE_ENV = ', process.env.NODE_ENV);
            console.log("industry setting: %s", process.env.HAWK_INDUSTRY || 'bz');
            console.log('axio baseURL', axios.defaults.baseURL);

            setPermission();

            self.load3rdPartyLibs();
            self.registerF7api();
            self.registerGlobalAPI();
            self.addEventHandler();
            self.loadSysConfig();
            self.setNotificatonHandler();
        },
        openGpsOrPushMsg () {
            let self = this
            $confirm('您的定位定位已关闭，为了更精准定位，请打开你的GPS定位，并授权', () => {
                self.gpsInterval = setTimeout(() => {
                    let admin = []
                    let superior = self.getSuperiorAdmin(self.myUserId)
                    if (self.superAdmin._id === self.myUserId) {
                        admin = [self.superAdmin._id]
                    } else if (superior.length) {
                        superior.map(v => {
                            if (!admin.includes(v)) admin.push(v)
                        })
                    }
                    if (admin.length == 0) admin = [self.superAdmin._id]
                    axios.post('api/user/pushGpsMsg', {
                        admin: admin,
                        superAdminId: self.superAdmin._id,
                        name: self.myProfile.name
                    }).then(resp => {
                        if (self.superAdmin._id !== self.myUserId) {
                            $alert('由于您还没打开GPS定位，已通知您的上级领导')
                        }
                    }).catch(error => {
                        console.error(error)
                    })
                }, 1000 * 60 * 10)
            })
        }
    },

    mounted: function() {
        if (this.isInit) return;
        this.isInit = true;

        let self = this;
        this.preloaderShow(this);

        let doit = () => {
            return new Promise(function(resolve, reject) {
                document.addEventListener('deviceready', () => {
                    // self.updateDeivce(device)
                    self.init();
                    self.im_init();
                    self.initiateUI();
                    resolve();
                });
                // self.mandatoryUpdate();
                document.addEventListener("jpush.openNotification", self.onOpenNotification, false);
                document.addEventListener("jpush.receiveNotification", self.onReceiveNotification, false);
                document.addEventListener("jpush.receiveMessage", self.onReceiveMessage, false);
                document.addEventListener("jpush.backgroundNotification", self.onBackgroundNotification, false);
            })
        }

        doit().then(() => {
            return self.login({});
        }).then(() => {
            self.preloaderHide(self);
            // if (self.isAuth) {
            //
            //     self.$f7.views.main.router.navigate('/');
            // }
            if (self.isAuth) {
                self.$f7.views.main.router.navigate('/', { clearPreviousHistory: true });
            }
        }).catch((error) => {
            self.preloaderHide(self);
            if (error.message == 'Network Error') {
                $alert('因网络问题，加载出错，请稍后在尝试');
            }
        });

        // this.$f7.on('routeChange', () => {
        //     this.$f7.preloader.show();
        //     setTimeout(() => {
        //         this.$f7.preloader.hide();
        //     }, 300);
        // });
        // setTimeout(() => {
        //     // 监听判断android是否打开gps
        //     if (device.platform == "Android") {
        //         let self = this
        //         setInterval(() => {
        //             cordova.plugins.diagnostic.isGpsLocationEnabled(function(enabled){
        //                 console.log("GPS location is " + (enabled ? "enabled" : "disabled"));
        //                 if (!enabled) {
        //                     if (!self.gpsInterval) {
        //                         self.gpsInterval = true
        //                         self.openGpsOrPushMsg()
        //                     }
        //                 } else {
        //                     if (self.gpsInterval) clearTimeout(self.gpsInterval)
        //                     self.gpsInterval = null
        //                 }
        //             }, function(error){
        //                 console.error("get isGpsLocationEnabled: "+error);
        //             });
        //         }, 5000);
        //     }
        // }, 10000)
    }
}
</script>
