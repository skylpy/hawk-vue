var exec = require('cordova/exec'),
    channel = require('cordova/channel'),
    utils = require('cordova/utils');

channel.createSticky('onCordovaXGPushReady');
channel.waitForInitialization('onCordovaXGPushReady');

function XGPush() {

    var me = this;

    this.channels = {
        'click': channel.create('click'),
        'message': channel.create('message'),
        'register': channel.create('register'),
        'unRegister': channel.create('unRegister'),
        'show': channel.create('show'),
        'deleteTag': channel.create('deleteTag'),
        'setTag': channel.create('setTag'),
    };

    this.on = function (type, func) {
        if (type in me.channels) {
            me.channels[type].subscribe(func);
        }
    };

    this.un = function (type, func) {
        if (type in this.channels) {
            me.channels[type].unsubscribe(func);
        }
    };

    this.registerPush = function (account, successCallback, errorCallback) {
        exec(successCallback, errorCallback, "XGPush", "registerPush", [account]);
    };

    this.unRegisterPush = function (account,successCallback, errorCallback) {
        exec(successCallback, errorCallback, "XGPush", "unRegisterPush", [account]);
    };

    this.setTag = function (tagName) {
        exec(null,null, "XGPush", "setTag", [tagName]);
    };

    this.deleteTag = function (tagName) {
        exec(null, null, "XGPush", "deleteTag", [tagName]);
    };

    this.addLocalNotification = function (type, title, content, successCallback, errorCallback) {
        exec(successCallback, errorCallback, "XGPush", "addLocalNotification", [type, title, content]);
    };

    this.enableDebug = function (debugMode, successCallback, errorCallback) {
        exec(successCallback, errorCallback, "XGPush", "enableDebug", [debugMode]);
    };

    this.getLaunchInfo = function (successCallback) {
        exec(function(event){
            if(event.customContent&&typeof event.customContent ==="string"){
                try {
                    var objs=JSON.parse(event.customContent);
                    event.customContent=objs;
                    event.customContent=Object.assign(...objs);
                } catch (error) {

                }
            }
            successCallback(event);
        }, null, "XGPush", "getLaunchInfo", []);
    };

    this.getToken = function (successCallback) {
        exec(successCallback, null, "XGPush", "getToken", []);
    };

    this.setAccessInfo = function (accessId, accessKey, successCallback, errorCallback) {
        exec(successCallback, errorCallback, "XGPush", "setAccessInfo", [accessId, accessKey]);
    };
    
    this.stopNotification = function () {
        exec(null, null, "XGPush", "stopNotification", []);
    };

    channel.onCordovaReady.subscribe(function () {
        exec(
            function (event) {
                console.log("[XGPush] Event = " + event.type + ": ", event);
                if (event && (event.type in me.channels)) {
                    //格式化自定义数据集
                    if(event.customContent&&typeof event.customContent ==="string"){
                        try {
                            var objs=JSON.parse(event.customContent);
                            event.customContent=objs;
                            event.customContent=Object.assign(...objs);
                        } catch (error) {
    
                        }
                    }
                    me.channels[event.type].fire(event);
                }
            },
            null, "XGPush", "addListener", []
            );

        me.registerPush(null, function (info) {
            console.log("[XGPush] RegisterPush: ", info);
            channel.onCordovaXGPushReady.fire();
        }, function (e) {
            console.log("[ERROR] RegisterPush: ", e);
            channel.onCordovaXGPushReady.fire();
        });
    });
}

module.exports = new XGPush();