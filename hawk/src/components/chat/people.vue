<template>
    <f7-page>
        <f7-navbar title="
        聊天信息" back-link></f7-navbar>
        <div class="people_con list">
            <div class="head_info">
                <img class="head_img" :src="userInfo.avatarUrl">
                <!--<div>-->
                <!--</div>-->
                <div class="name">{{userInfo.name}}</div>
            </div>
            <!--<div class="add">-->
                <!--<img src="../../assets/images/btn_add_people_green@2x.png">添加成员-->
            <!--</div>-->
        </div>
        <div class="list">
            <div>
                置顶聊天
                <f7-toggle class="toggle" :checked="chatInfo.top" @change="setTop($event.target.checked)" color="green"></f7-toggle>
            </div>
            <!--<div>-->
                <!--消息免打扰-->
                <!--<f7-toggle class="toggle" :checked="chatInfo.notDisturb" @change="setNotDisturb($event.target.checked)" color="green"></f7-toggle>-->
            <!--</div>-->
        </div>
        <!--<div class="list">-->
            <!--<div>-->
                <!--查找聊天记录-->
                <!--<img class="right_icon" src="../../assets/images/arrow_right_gray@2x.png">-->
            <!--</div>-->
            <!--<div>-->
                <!--清除聊天记录-->
            <!--</div>-->
        <div class="list" @click="deleteChat">
            <div style="text-align: center; color: red;">
                删除会话框
            </div>
        </div>
    </f7-page>
</template>

<script>
    import axios from 'axios'
    import {mapGetters, mapMutations, mapActions, mapState} from 'vuex';
    export default {
        name: "people",
        props: {
            'targetId': String
        },
        data(){
            return {
                chatInfo:{
                    notDisturb:false,
                    top:false
                },
                userInfo:{}
            }
        },
        computed: {
            ...mapGetters([
                'who',
                'myUserId',
                'getChatRecord'
            ]),
        },
        mounted(){
            this.userInfo = this.who(this.targetId)
            axios.get('/api/chat/?targetId='+this.targetId).then(res=>{
                this.chatInfo = res.data
            })
        },
        methods:{
            setTop(flag){
                this.chatInfo.top = flag;
                axios.put('/api/chat/',{targetId:this.targetId, top:flag}).then(res=>{
                    console.log(res.data)
                })
            },
            setNotDisturb(flag){
                this.chatInfo.top = flag;
                axios.put('/api/chat/',{targetId:this.targetId, notDisturb:flag}).then(res=>{
                    console.log(res.data)
                })
            },
            deleteChat() {
                let conversationType = RongIMLib.ConversationType.PRIVATE;
                let self = this
                RongIMClient.getInstance().removeConversation(conversationType, this.targetId, {
                    onSuccess: function(bool) {
                        // 删除会话成功
                         self.$f7router.back('/', {force: true})
                    },
                    onError: function(error){
                        // error => 删除会话的错误码
                        $alert('删除会话失败')
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .list{
        background-color: white;
    }
    .list>div{
        text-indent: 15px;
        height: 45px;
        line-height: 45px;
        border-bottom: 1px solid #D8D8D8;
    }
    .list>div:last-child{
        border-bottom: none;
    }
    .head_info{
        font-size: 16px;
        height: 40px!important;
        padding:15px;
        background-color: white;
    }
    .head_info>.head_img{
        float: left;
        width: 40px;
        height: 40px;
        background-color: #dcdcdc;
    }
    .head_info>.head_img>img{
        width: 100%;
        height: 100%;
    }
    .head_info>.name{
        float: left;
        line-height: 40px;
    }
    .add{
        text-indent: 0px!important;
        height: 45px;
        background-color: white;
    }
    .add>img{
        float: left;
        width: 17px;
        margin: 14px 10px 14px 15px;
    }
    .toggle{
        float: right;
        margin: 7px;
    }
    .right_icon{
        height: 12px;
        float: right;
        margin: 17px 15px;
    }
</style>
