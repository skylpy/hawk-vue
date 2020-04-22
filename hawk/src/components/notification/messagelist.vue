<template>
      <f7-page style="  background: #FFFFFF;"  @page:beforein="load">
          <f7-navbar :title="'系统消息'" back-link>
              <f7-nav-right>
                  <f7-link v-if="msgList.length>0" @click="chearlist">清空</f7-link>
              </f7-nav-right>
          </f7-navbar>
          <div class="message-list">
              <div v-if="msgList.length>0" class="message-item" v-for="(item,i) in msgList" @click="goDetail(i)">

                  <div class="msg">
                      <div class="time">{{formatDate(item.createdAt)}}</div>
                      <div class="title">{{item.title}}<div class="color-box" v-if="item.status == '未读'"  ></div></div>
                      <div class="content">{{item.content}}</div>
                  </div>

              </div>
              <div v-if="msgList.length == 0" class="no_template">
                  <img :src="zero_employee_icon" width="71px" height="84px">
                  <p>暂无数据</p>
              </div>
          </div>


      </f7-page>
</template>
<style scoped>
    .color-box{
        width: 6px;
        height: 6px;
        background-color: #F74C31;
        display: inline-block;
        border-radius: 50%;
        margin-left: 5px;
        position: relative;
        top: -3px;

    }
    .message-list{
        width: 100%;
    }
    .message-item{

        padding: 10px 20px;
        height: 70px;

        border-bottom: 1px solid #DDD;
        box-sizing: border-box;

    }

    .message-item .img-icon img{
        width: 48px;
        height: 48px;
    }
    .message-item .msg{
        position: relative;
        float: left;
        margin-top: 5px;
        width: calc(100% - 10px);
    }
    .message-item .title{
        font-size: 16px;
        color: #464646;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;/*文本不换行*/
    }
    .message-item .time{
        position: absolute;
        right: -10px;
        font-size: 13px;
        color: #888888;
    }
    .message-item .content{
        margin-top: 3px;
        font-size: 13px;
        color: #888888;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;/*文本不换行*/

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
import {mapGetters, mapActions} from 'vuex';
import axios from 'axios';
import dateFormat from 'lib/dateformat.js';
export default {
    name: "message",

    data: () => {
        return {
            systemImg:require("assets/images/icon_system_messages_orange@2x.png"),
            zero_employee_icon: require('assets/images/ill_no_data@2x.png'),
            msgList:[]
        }
    },

    computed: {
        ...mapGetters([
            'notification',
            'who',
            'myProfile',
            'myCompany'
        ])
    },

    mounted(){
        //this.load();
    },

    methods: {

        chearlist(){

            $dialog.confirm('确定要清空消息列表吗？', '删除后无法复原', (ok) => {

                this.delete();
            });
        },

        delete(){

            $preloader.show();
            axios.delete("/api/notification/removeall/"+this.myProfile._id).then(resp=>{
                this.setUnreadCount(0);
                this.load();
                this.$forceUpdate();
                $preloader.hide()
            }).catch(err => {
                $preloader.hide();
                console.error(err);
            });
        },

        formatDate(date){
            return dateFormat(date,'mm-dd HH:MM');
        },

        goDetail(i){
            let msg = this.msgList[i];
            if (msg.status == '未读'){
                msg.status = "已读";
                $preloader.show();
                axios.get("/api/notification/"+msg._id).then(resp=>{
                    this.$forceUpdate();
                    this.getUnLoadCount();
                    $preloader.hide()
                }).catch(err => {
                    $preloader.hide();
                    console.error(err);
                });
            }
            if (msg.url){
                // this.$f7router.navigate("", {})
                this.$f7router.navigate(msg.url, {props:msg.extras});
                // this.$f7.tab.show('#tab-home');
                // return;
            }else {
                this.$f7router.navigate('/notification/detail/', {props: {msg}})
            }
        },
        load() {
            let self = this;
            $preloader.show();
            axios.get("/api/notification").then(resp=>{
                self.msgList = resp.data;
                this.$forceUpdate();
                this.getUnLoadCount();
                $preloader.hide()
            }).catch(err => {
                $preloader.hide();
                console.error(err);
                $alert('无法获取数据，请稍后再试', '操作错误');
            });

        },
        getUnLoadCount () {
            this.$nextTick(() => {
                let count = this.msgList.filter(m => m.status == '未读').length;
                this.setUnreadCount(count);
            });
        },

        ...mapActions({
            'setUnreadCount':'SET_UNREAD_COUNT',
            'save': 'SAVE_USER_KEY',
            'remove': 'REMOVE_NOTIFICATION'
        })
    }
};
</script>
