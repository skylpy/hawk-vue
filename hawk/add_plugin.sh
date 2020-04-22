#!/bin/bash

cordova plugin add cordova-plugin-whitelist
cordova plugin add cordova-plugin-splashscreen
cordova plugin add cordova-plugin-camera
cordova plugin add cordova-plugin-device
cordova plugin add cordova-plugin-signature-fingerprint
cordova plugin add ./plugins_package/cordova-amap-track --variable ANDROID_KEY=cfdf788c04dcb03c57a8fe5afca12cfb --variable IOS_KEY=d901b0189500479f3f8602842cbd0b2a
#cordova plugin add cordova-call
cordova plugin add https://github.com/sanfanerp/CordovaCall.git
cordova plugin add cordova-plugin-permission
cordova plugin add cordova-plugin-file
cordova plugin add cordova-plugin-local-notification
cordova plugin add cordova-open-native-settings
cordova plugin add cordova-plugin-alipay-v2 --variable APP_ID=2019010862805521
cordova plugin add https://github.com/sanfanerp/cordova-plugin-wechat.git --variable WECHATAPPID=wx440e75ebc6efa0ab
cordova plugin add cordova-plugin-calllog
#cordova plugin add jpush-phonegap-plugin --variable APP_KEY=f4670bd35855482ce09f4b28
cordova plugin add cordova-plugin-file-downloader
cordova plugin add cordova-plugin-inappbrowser
cordova plugin add cordova-plugin-file-transfer
cordova plugin add cordova-plugin-file-opener2
cordova plugin add https://github.com/sanfanerp/cordova-plugin-auto-update.git
cordova plugin add cordova-media-with-compression
#cordova plugin add cordova.plugins.diagnostic --variable ANDROID_SUPPORT_VERSION=27.+
cordova plugin add ./plugins_package/cordova-plugin-xgpush --variable ACCESS_ID="2100333073" --variable ACCESS_KEY="AX64BI848RDI" --variable IOS_ACCESS_ID="2200333075" --variable IOS_ACCESS_KEY="I22U7FW6MF9W"
