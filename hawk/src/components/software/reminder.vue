<template>
    <f7-page>
        <f7-navbar title="消息提醒设置" back-link>
            <f7-nav-right>
                <f7-link @click="submit">提交</f7-link>
            </f7-nav-right> 
        </f7-navbar>

        <f7-block-title>选项</f7-block-title>
        <f7-list>
            <f7-list-item title="接收但屏蔽通知">
                <f7-toggle 
                    :checked = "!!notification"
                    color="red" 
                    style="float:right" 
                    @toggle:change="setNotification"
                ></f7-toggle>   
            </f7-list-item>

            <f7-list-item title="声音">
                <f7-toggle 
                    :checked = "!!sound"
                    color="red" 
                    style="float:right" 
                    @toggle:change="setSound"
                ></f7-toggle>   
            </f7-list-item>

            <f7-list-item title="震动">
                <f7-toggle
                    :checked = "!!vibrate"
                    color="red" 
                    style="float:right" 
                    @toggle:change="setVibrate"
                ></f7-toggle>  
            </f7-list-item>
        </f7-list>

    </f7-page>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex';

export default {

    data() {
        return {
            notification: true,
            sound: true,
            vibrate: true
        }
    },

    mounted: function() {
        this.sound = !!this.reminder.sound;
        this.vibrate = !!this.reminder.vibrate;
        this.notification = !!this.reminder.notification;
    },

    computed: {
        ...mapGetters(['reminder'])
    },

    methods: {
        ...mapMutations({
            set: 'SOFTWARE_CONFIG_SET'
        }),

        setSound(value) { if (value != this.sound) this.sound = value; },
        setVibrate(value) { if (value != this.vibrate) this.vibrate = value; },
        setNotification(value) { if (value != this.notification) this.notification = value; },

        submit() {
            this.set({ 
                reminder: {
                    sound: this.sound,
                    vibrate: this.vibrate,
                    notification: this.notification
                }
            });

            this.$f7router.back();
        }
    }
}
</script>
