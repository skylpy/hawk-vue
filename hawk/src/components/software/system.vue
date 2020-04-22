<template>
    <f7-page>
        <f7-navbar title="后台设置" back-link></f7-navbar>

        <f7-block-title>选项</f7-block-title>
        <f7-list>
            <f7-list-item
                title="开机自启动"
                link="#"
                after="设置"
                @click="openNativeSetting('application_details')"
            ></f7-list-item>
            <f7-list-item
                style="color:red"
                after="请注意:为了及时获得定位信息，请打开自启动设置！"
            ></f7-list-item>
        </f7-list>

    </f7-page>
</template>

<script>

export default {

    data() {
        return {

        }
    },

    methods: {
        /* for more types, read 
            https://www.npmjs.com/package/cordova-open-native-settings 
        */
        openNativeSetting(type) {
            if (window.cordova && window.cordova.plugins.settings) {
                console.log('running openNativeSetting()');

                window.cordova.plugins.settings.open(
                    type, 
                    function() {
                        console.log('openNativeSetting() success');
                    },
                    function () {
                        console.log('openNativeSetting() failure');
                    }
                );
            } else {
                console.error('window.cordova.plugins.settings is not available yet');
            }
        }

    }
}
</script>
