<template>
    <f7-page @page:beforein="load">
        <div class="message-item top" @click="goList">
            <div class="img-icon">
                <img :src="systemImg">
                <div class="number" v-if="sysUnreadCount > 0">{{sysUnreadCount}}</div>
            </div>

            <div class="msg">
                <div class="title">系统消息</div>
                <div class="content">{{sysUnreadCount > 0 ? lastMsg.content : ''}}</div>
            </div>
            <div class="time" v-if="lastMsg.createdAt">{{sysUnreadCount > 0 ? formatDate(lastMsg.createdAt) : ''}}</div>
        </div>

        <!--<div class="message-item top" >-->
        <!--<div class="img-icon">-->
        <!--&lt;!&ndash;<img :src="systemImg">&ndash;&gt;-->
        <!--<div class="gourp">-->
        <!--<img :src="systemImg">-->
        <!--<img :src="systemImg">-->
        <!--<img :src="systemImg">-->
        <!--<img :src="systemImg">-->
        <!--</div>-->
        <!--<div class="none" v-if="count > 0"></div>-->
        <!--</div>-->
        <!--<div class="msg">-->
        <!--<div class="title">三帆科技</div>-->
        <!--<div class="content">[图片]</div>-->
        <!--</div>-->
        <!--<div class="time">11:32</div>-->
        <!--<img class="nosay" :src="nosay"/>-->
        <!--</div>-->
        <!---->
        <!--<div class="message-item" @click="goChat">-->
        <!--<div class="img-icon">-->
        <!--<img :src="systemImg">-->
        <!--&lt;!&ndash;<div class="gourp">&ndash;&gt;-->
        <!--&lt;!&ndash;<img :src="systemImg">&ndash;&gt;-->
        <!--&lt;!&ndash;<img :src="systemImg">&ndash;&gt;-->
        <!--&lt;!&ndash;<img :src="systemImg">&ndash;&gt;-->
        <!--&lt;!&ndash;<img :src="systemImg">&ndash;&gt;-->
        <!--&lt;!&ndash;</div>&ndash;&gt;-->
        <!--<div class="number" v-if="count" >99+</div>-->
        <!--</div>-->
        <!--<div class="msg">-->
        <!--<div class="title">陈伟</div>-->
        <!--<div class="content">好吧，没事</div>-->
        <!--</div>-->
        <!--<div class="time">11:32</div>-->
        <!--</div>-->
        <div v-for="(item,index) in conversationList" v-if="isTop(item) && who(item.targetId)" :key="index" class="message-item top" @click="goChat(item.targetId)">
            <div class="img-icon">
                <img :src="who(item.targetId).avatarUrl || head">
                <!--<div class="gourp">-->
                <!--<img :src="systemImg">-->
                <!--<img :src="systemImg">-->
                <!--<img :src="systemImg">-->
                <!--<img :src="systemImg">-->
                <!--</div>-->
                <div class="number" v-if="item.unreadMessageCount">
                    {{item.unreadMessageCount>99?'99+':item.unreadMessageCount}}
                </div>
            </div>
            <div class="msg">
                <div class="title">{{who(item.targetId).name}}</div>
                <div class="content" v-if="item.latestMessage.messageType == 'TextMessage'"><span v-html="EE(item.latestMessage.content.content)"></span></div>
                <div class="content" v-if="item.latestMessage.messageType == 'FileMessage'">[文件]</div>
                <div class="content" v-if="item.latestMessage.messageType == 'ImageMessage'">[图片]</div>
            </div>
            <div class="time">11:32</div>
        </div>
        <div v-for="(item,index) in conversationList" v-if="!isTop(item) && who(item.targetId)" :key="index" class="message-item" @click="goChat(item.targetId)">
            <div class="img-icon">
                <img :src="who(item.targetId).avatarUrl || head">
                <!--<div class="gourp">-->
                <!--<img :src="systemImg">-->
                <!--<img :src="systemImg">-->
                <!--<img :src="systemImg">-->
                <!--<img :src="systemImg">-->
                <!--</div>-->
                <div class="number" v-if="item.unreadMessageCount">
                    {{item.unreadMessageCount>99?'99+':item.unreadMessageCount}}
                </div>
            </div>
            <div class="msg">
                <div class="title">{{ who(item.targetId).name}}</div>
                <div class="content" v-if="item.latestMessage.messageType == 'TextMessage'" v-html="EE(item.latestMessage.content.content)"></div>
                <div class="content" v-if="item.latestMessage.messageType == 'FileMessage'">[文件] {{item.latestMessage.content.name}}</div>
                <div class="content" v-if="item.latestMessage.messageType == 'ImageMessage'">[图片]</div>
            </div>
            <div class="time">11:32</div>
        </div>

    </f7-page>
</template>
<style scoped>
    .top {
        background-color: #f6f6f6 !important;
    }

    .message-item {
        /*margin-top: 5px;*/
        position: relative;
        padding: 10px 12px;
        height: 70px;
        background: #FFFFFF;
        border-bottom: 1px solid #DDD;
        box-sizing: border-box;

    }

    .message-item .img-icon {
        float: left;
        position: relative;
        width: 48px;
        border-radius: 12px;
    }

    .message-item .img-icon > img {
        width: 48px;
        height: 48px;
        border-radius: 2px;
        overflow: hidden;
    }

    .message-item .img-icon .gourp {
        width: 48px;
        height: 48px;
        background-color: #ececec;
        border-radius: 2px;
        overflow: hidden;
    }

    .message-item .img-icon .gourp > img {
        width: 15px;
        height: 15px;
        background-color: #ececec;
        border-radius: 2px;
        overflow: hidden;
        float: left;
        margin-top: 6px;
        margin-left: 6px;
    }

    .message-item .img-icon .number {
        min-width: 11px;
        min-height: 11px;
        position: absolute;
        color: #FFFFFF;
        top: -6px;
        right: -8px;
        font-size: 10px;
        height: 11px;
        line-height: 12px;
        background: #F74C31;
        border-radius: 14px;
        padding: 3px;
        text-align: center;
    }

    .message-item .img-icon .none {
        position: absolute;
        background: #F74C31;
        top: -6px;
        right: -6px;
        border-radius: 10px;
        width: 14px;
        height: 14px;
    }

    .message-item .msg {
        position: relative;
        float: left;
        margin-left: 14px;
        margin-top: 5px;
        width: calc(100% - 75px);
    }

    .message-item .title {
        margin-top: -4px;
        font-size: 16px;
        color: #464646;
    }

    .message-item .time {
        position: absolute;
        top: 7px;
        right: 15px;
        font-size: 11px;
        color: #888888;
    }

    .message-item .nosay {
        position: absolute;
        width: 12px;
        height: 14px;
        top: 40px;
        right: 15px;
    }

    .message-item .content {
        margin-top: 6px;
        font-size: 13px;
        color: #888888;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap; /*文本不换行*/

    }
</style>
<script>
    import {mapGetters, mapActions, mapState} from 'vuex';
    import dateFormat from 'lib/dateformat.js';
    import axios from 'axios';

    export default {
        name: "message",

        data: () => {
            return {
                systemImg: require("assets/images/icon_system_messages_orange@2x.png"),
                nosay: require("assets/images/icon_stick_gray@2x.png"),
                head: require("assets/images/hp_default_70@2x.png"),
                msgList: [],
                lastMsg: {},
                conversationList: [],
                myConversationList: []
            }
        },
        watch: {
            clientStatus(val, oVal) {
                if (val != oVal && val === '连接成功') {
                    this.getConversationList()
                }
            },
            conversationList(list){
                let count = 0
                list.forEach(item=>{
                    count += item.unreadMessageCount
                })
                this.SET_CHAT_UNREAD_COUNT(count)
            }
        },
        computed: {
            ...mapGetters([
                'notification',
                'who',
                'myCompany',
                'clientStatus',
                'unreadCount',
                'sysUnreadCount'
            ])
        },
        mounted() {
            axios.get('/api/chat/').then(res => {
                this.myConversationList = res.data
            })
        },
        methods: {
            ...mapActions([
                'SET_UNREAD_COUNT',
                'SET_CHAT_UNREAD_COUNT'
            ]),
            EE(content){
                return RongIMLib.RongIMEmoji.symbolToEmoji(content)
            },
            getConversationList() {
                this.$nextTick(function () {
                    if (this.clientStatus == '连接成功')
                        RongIMClient.getInstance().getConversationList({
                            onSuccess: (list) => {
                                console.log('getConversationList')
                                console.log(list)
                                this.conversationList = list
                            },
                            onError: (error) => {
                                // do something...
                            }
                        }, null);
                })
            },
            isTop(chat){
                let flag = this.myConversationList.filter(item=>item.targetId==chat.targetId&&item.top)
                return !!flag.length
            },
            summary(s) {
                return (s.length < 24) ? s : (s.substring(0, 24) + '...')
            },

            formatDate(date) {
                return dateFormat(date, 'HH:MM');
            },

            clear(n) {
                if (this.notification.length < 1) return;

                let notification = [];
                if (n) notification = this.notification.filter(x => x._id != n._id);

                this.save({notification}).then(() => {
                    // console.log('notification ignored');
                }).catch((error) => {
                    console.log(error.message);
                });
            },
            goList() {
                this.$f7router.navigate("/notification/messagelist/", {});
            },
            goChat(targetId, type) {
                this.$f7router.navigate("/chat/chat", {
                    props: {
                        targetId: targetId,
                        conversationType: type || 'PRIVATE'
                    }
                });
            },
            load() {
                this.getConversationList()
                let self = this;

                $preloader.show();
                axios.get("/api/notification").then(resp => {
                    self.msgList = resp.data;
                    if (self.msgList && self.msgList.length > 0) {
                        self.lastMsg = self.msgList[0];
                        let count = resp.data.filter(m => m.status == '未读').length
                        self.SET_UNREAD_COUNT(count)
                    }
                    this.$forceUpdate();
                    $preloader.hide()
                }).catch(err => {
                    $preloader.hide();
                    console.error(err);
                    $alert('无法获取数据，请稍后再试', '操作错误');
                });
            },
            getTotalUnreadCount(){
                let self = this;
                RongIMClient.getInstance().getTotalUnreadCount({
                    onSuccess:function(count){
                        self.SET_CHAT_UNREAD_COUNT(count)
                        // count => 所有会话总未读数。
                    },
                    onError:function(error){
                        // error => 获取总未读数错误码。
                    }
                });
            }
        }
    };
</script>
