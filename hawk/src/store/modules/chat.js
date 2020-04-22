import axios from 'axios';
import Vue from 'vue';

const appKey = CONFIG.rongAppKey;
// const token = "yMIUTTvGwMeSDRKcHnKt3xdFmp6aDaAWDfF7nno5fzOcR+Zqyuv8mywvHjuQorxNgDRt/0qLJoo3bELEDps2Eq7Q/wqbFaCr";
let forceUpdateTokenCount = 2; // 只允许更新两次,防止死循环
let reconnectTimes = 0, timeInterval = 20, checkNetworkTimeID, reconnectTimeID, isConnecting = false;

// 重连
function reconnectServer() {
  if (reconnectTimeID) {
    clearTimeout(reconnectTimeID);
  }
  reconnectTimeID = setTimeout(function () {
    console.log("网络正常，正在重连")
    // 注意reconnect方法，必须要有网的时候请求，否则任何方法都无法再次连接
    RongIMClient.reconnect({
      onSuccess: function () {
        reconnectTimes = 0;
        isConnecting = false;
        console.log("重连成功", new Date().toLocaleString());
        if (reconnectTimeID) clearTimeout(reconnectTimeID);
      },
      onError: function () {
        isConnecting = false;
        if (reconnectTimes <= 5) {
          reconnectServer();
          reconnectTimes += 1;
        } else {
          reconnectTimes = 0;
          console.log("网络正常，重连失败！！！", new Date().toLocaleString());
        }
      }
    });
  }, timeInterval * reconnectTimes * 1000);
}

// 测试网络
function checkNetwork(callback) {
  console.log('正在测试网络', new Date().toLocaleString());
  axios.get("/api/chat/heartbeat?t=" + Math.random()).then(function () {
    if (checkNetworkTimeID) clearTimeout(checkNetworkTimeID);
    if (callback && callback.onSuccess) callback.onSuccess();
  }).catch(function () {
    if (checkNetworkTimeID) clearTimeout(checkNetworkTimeID);
    checkNetworkTimeID = setTimeout(function () {
      checkNetwork(callback);
    }, 5000);
  });
}


const state = {
  chatlist: {},
  connectionStatus: '',
  clientStatus: '',
  token: '',
  conversationList: []
}
const getters = {
  // clientInstance: state => RongIMClient.getInstance()
  getChatRecord: state => (targetId) => {
    if (!state.chatlist[targetId]) {
      state.chatlist[targetId] = [];
    }
    return state.chatlist[targetId];
  },
  clientStatus: state => state.clientStatus,
  connectionStatus: state => state.connectionStatus,
  chatRecord: state => state.chatlist
}
const actions = {
  IM_INIT({commit, state, dispatch}) {
    console.log('开始初始化融云', appKey)
    RongIMLib.RongIMClient.init(appKey);
    RongIMLib.RongIMEmoji.init();
    // 连接状态监听器
    RongIMClient.setConnectionStatusListener({
      onChanged: function (status) {
        switch (status) {
          case RongIMLib.ConnectionStatus.CONNECTED:
            commit('UPDATE_STATUS', '链接成功');
            isConnecting = false
            break;
          case RongIMLib.ConnectionStatus.CONNECTING:
            commit('UPDATE_STATUS', '正在链接');
            break;
          case RongIMLib.ConnectionStatus.DISCONNECTED:
            commit('UPDATE_STATUS', '断开连接');
            dispatch('IM_RECONNECT');
            break;
          case RongIMLib.ConnectionStatus.CONNECTION_CLOSED:
            commit('UPDATE_STATUS', '连接关闭');
            dispatch('IM_RECONNECT');
            break;
          case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
            commit('UPDATE_STATUS', '其他设备登录');
            break;
          case RongIMLib.ConnectionStatus.DOMAIN_INCORRECT:
            commit('UPDATE_STATUS', '域名不正确');
            break;
          case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
            commit('UPDATE_STATUS', '网络不可用');
            dispatch('IM_RECONNECT');
            break;
          default:
            console.log('ConnectionStatus', status);
        }
      }
    });

    // 消息监听器
    RongIMClient.setOnReceiveMessageListener({
      // 接收到的消息
      onReceived: function (message) {
        // 判断消息类型
        switch (message.messageType) {
          case RongIMClient.MessageType.TextMessage:
            commit('PUSH_MEG', message);
            // message.content.content => 消息内容
            break;
          case RongIMClient.MessageType.VoiceMessage:
            commit('PUSH_MEG', message);
            // 对声音进行预加载
            // message.content.content 格式为 AMR 格式的 base64 码
            break;
          case RongIMClient.MessageType.ImageMessage:
            commit('PUSH_MEG', message);
            // message.content.content => 图片缩略图 base64。
            // message.content.imageUri => 原图 URL。
            break;
          case RongIMClient.MessageType.FileMessage:
            commit('PUSH_MEG', message);
            // message.content.content => 图片缩略图 base64。
            // message.content.imageUri => 原图 URL。
            break;
          case RongIMClient.MessageType.DiscussionNotificationMessage:
            commit('PUSH_MEG', message);
            // message.content.extension => 讨论组中的人员。
            break;
          case RongIMClient.MessageType.LocationMessage:
            commit('PUSH_MEG', message);
            // message.content.latiude => 纬度。
            // message.content.longitude => 经度。
            // message.content.content => 位置图片 base64。
            break;
          case RongIMClient.MessageType.RichContentMessage:
            commit('PUSH_MEG', message);
            // message.content.content => 文本消息内容。
            // message.content.imageUri => 图片 base64。
            // message.content.url => 原图 URL。
            break;
          case RongIMClient.MessageType.RecallCommandMessage:
            commit('DEL_MEG', {message});
            // 消息撒回
            break;
          case RongIMClient.MessageType.ReadReceiptMessage:
            console.log('已读')
            commit('SET_READ_STATUS', message)
            // do something...
            break;
          case RongIMClient.MessageType.InformationNotificationMessage:
            // do something...
            break;
          case RongIMClient.MessageType.ContactNotificationMessage:
            // do something...
            break;
          case RongIMClient.MessageType.ProfileNotificationMessage:
            // do something...
            break;
          case RongIMClient.MessageType.CommandNotificationMessage:
            // do something...
            break;
          case RongIMClient.MessageType.CommandMessage:
            // do something...
            break;
          case RongIMClient.MessageType.UnknownMessage:
            // do something...
            break;
          default:
            console.log('ReceiveMessage', message);
          // do something...
        }
      }
    });
  },
  IM_LOGIN(context, token) {
    console.log('用户登陆融云')
    context.commit('UPDATE_TOKEN', token)
    const onSuccess = (userId) => {
      console.log("Connect successfully." + userId);
      context.commit('CLIENT_STATUS', '连接成功');
      forceUpdateTokenCount = 0;
      // context.dispatch('IM_RECONNECT');
    }
    const onTokenIncorrect = (err) => {
      context.commit('CLIENT_STATUS', 'token无效');
      if (context.state.connectionStatus != '正在链接' && forceUpdateTokenCount > 0) {
        forceUpdateTokenCount--;
        // 重新获取有效Token, 并重新登陆
        console.log('token正在获取');
        axios.put('/api/user/updateRongToken', {forceUpdate: true}).then(res => {
          console.log('token获取成功', res.data);
          context.dispatch('IM_LOGIN', res.data);
        }).catch(err => {
          console.log('无法获取有效token, 聊天功能无法使用', err);
        });
      }
    }
    const onReError = (errorCode) => {
      var info = '';
      switch (errorCode) {
        case RongIMLib.ErrorCode.TIMEOUT:
          info = '超时';
          break;
        case RongIMLib.ConnectionState.UNACCEPTABLE_PAROTOCOL_VERSION:
          info = '不可接受的协议版本';
          break;
        case RongIMLib.ConnectionState.IDENTIFIER_REJECTED:
          info = 'appkey不正确';
          break;
        case RongIMLib.ConnectionState.SERVER_UNAVAILABLE:
          info = '服务器不可用';
          break;
      }
      context.commit('CLIENT_STATUS', info);
      console.log('IM_LOGIN', errorCode);
    }
    const onError = (errorCode) => {
      var info = '';
      switch (errorCode) {
        case RongIMLib.ErrorCode.TIMEOUT:
          info = '超时';
          break;
        case RongIMLib.ConnectionState.UNACCEPTABLE_PAROTOCOL_VERSION:
          info = '不可接受的协议版本';
          break;
        case RongIMLib.ConnectionState.IDENTIFIER_REJECTED:
          info = 'appkey不正确';
          break;
        case RongIMLib.ConnectionState.SERVER_UNAVAILABLE:
          info = '服务器不可用';
          break;
      }
      context.commit('CLIENT_STATUS', info);
      console.log(errorCode);
    }
    RongIMClient.connect(token, {onSuccess, onTokenIncorrect, onError});

  },
  IM_RECONNECT({commit, state, dispatch, getters}, data) {
    if (state.token) {
      console.log('IM_RECONNECT', new Date().toLocaleString(), 'isConnecting:' + isConnecting);
      isConnecting = true;
      checkNetwork({
        onSuccess: function () {
          reconnectServer();
        }
      });
    }
  },
  IM_SEND_MSG({commit, state, dispatch}, data) {
    let msg
    if (data.msgType == 'image') {
      msg = new RongIMLib.ImageMessage({content: data.content.content, imageUri: data.content.imageUri});
    } else if (data.msgType == 'file') {
      msg = new RongIMLib.FileMessage({
        name: data.content.name,
        size: data.content.size,
        type: data.content.type,
        fileUrl: data.content.fileUrl
      });
    } else if (data.msgType == 'voice') {
      // content 音频内容 duration 音频时长 extra 额外信息
      msg = new RongIMLib.VoiceMessage({
        content: data.content.base64Str,
        duration: data.content.duration,
        extra: data.content.extra
      });
    } else {
      msg = new RongIMLib.TextMessage({content: data.content.content});
    }
    var conversationtype = RongIMLib.ConversationType[data.type]; // 单聊,其他会话选择相应的消息类型即可。
    var targetId = data.targetId; // 目标 Id
    RongIMClient.getInstance().sendMessage(conversationtype, targetId, msg, {
      onSuccess: function (message) {
        //message 为发送的消息对象并且包含服务器返回的消息唯一Id和发送消息时间戳
        console.log("Send successfully");
        if (data.onSuccess) {
          data.onSuccess(message);
        }
      },
      onError: function (errorCode, message) {
        var info = '';
        switch (errorCode) {
          case RongIMLib.ErrorCode.TIMEOUT:
            info = '超时';
            break;
          case RongIMLib.ErrorCode.UNKNOWN:
            info = '未知错误';
            break;
          case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
            info = '在黑名单中，无法向对方发送消息';
            break;
          case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
            info = '不在讨论组中';
            break;
          case RongIMLib.ErrorCode.NOT_IN_GROUP:
            info = '不在群组中';
            break;
          case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
            info = '不在聊天室中';
            break;
          case 30002:
            dispatch('IM_RECONNECT')
            break;
          default :
            info = errorCode;
            break;
        }
        console.log('发送失败:' + info);
      }
    });
  },
  IM_PUSH_MEG({commit, state}, data) {
    commit('PUSH_MEG', data);
  },
  IM_READ_MEG({commit, state}, data) {
    const {messageUId, targetId, sentTime} = data
    var type = "1";// 备用，默认赋值 1 即可。
    var msg = new RongIMLib.ReadReceiptMessage({messageUId: messageUId, lastMessageSendTime: sentTime, type: type});
    var conversationtype = RongIMLib.ConversationType.PRIVATE; // 单聊,其他会话选择相应的消息类型即可。
    RongIMClient.getInstance().sendMessage(conversationtype, targetId, msg, {
      onSuccess: function (message) {
        //message 为发送的消息对象并且包含服务器返回的消息唯一Id和发送消息时间戳
        console.log("isRead successfully");
      },
      onError: function (errorCode, message) {

      }
    });
  },
  IM_DEL_MEG({commit, state}, message) {
    console.log("准备删除", message.content.content,message.messageUId);
    RongIMClient.getInstance().sendRecallMessage(message, {
      onSuccess: (message) => {
        console.log("删除成功", message.content.messageUId, message);
        commit('DEL_MEG', {message, me: true});
      },
      onError: (errorCode, message) => {
        console.log("删除失败", message);
      }
    });
  },
  IM_READ_MEG_ALL({commit, state, dispatch}, targetId) {
    const chatlist = state.chatlist[targetId]
    if(!chatlist)return
    for (let i = chatlist.length - 1; i >= 0; i--) {
      let msg = chatlist[i];
      if ((!msg.sentStatus && msg.receivedStatus == 1) && msg.senderUserId == msg.targetId) {
        msg.sentStatus = 50
        console.log('IM_READ_MEG' + msg.messageUId)
        dispatch('IM_READ_MEG', msg);
      }
    }
  },
  IM_CLEAR_UNREAD({commit, state, dispatch}, targetId) {
    var conversationType = RongIMLib.ConversationType.PRIVATE; // 单聊,其他会话选择相应的消息类型即可。
    RongIMClient.getInstance().clearUnreadCount(conversationType, targetId, {
      onSuccess: function () {
        console.log("clearUnreadCount::" + targetId);
      },
      onError: function (errorCode) {

      }
    });
  }
}
const mutations = {
  UPDATE_STATUS: (state, payload) => {
    console.log(payload);
    state.connectionStatus = payload;
  },
  CLIENT_STATUS: (state, payload) => {
    console.log(payload);
    state.clientStatus = payload;
  },
  UPDATE_TOKEN: (state, payload) => {
    console.log(payload);
    state.token = payload;
  },
  PUSH_MEG: (state, data) => {
    let {targetId} = data
    let list = state.chatlist[targetId]
    if (list) {
      if (list.filter(msg => msg.messageUId == data.messageUId).length) {
        // 已存在则跳过
        return;
      }
      list.push(data);
    } else {
      Vue.set(state.chatlist, targetId, [data]);
      // state.chatlist[targetId] = [data];
    }
  },
  DEL_MEG: (state, data) => {
    let {message,me} = data
    let targetId = me ? message.content.targetId : message.targetId
    let list = state.chatlist[targetId]
    if (list) {
      let index = list.findIndex(msg => msg.messageUId == message.content.messageUId);
      console.log('删除ok',index)
      if (index >= 0) state.chatlist[targetId].splice(index, 1);
    }
  },
  SET_READ_STATUS: (state, message) => {
    const chatlist = state.chatlist[message.targetId]
    if (chatlist) {
      for (let i = chatlist.length - 1; i >= 0; i--) {
        let msg = chatlist[i];
        if (msg.messageUId == message.content.messageUId) {
          msg.receivedStatus = message.content.type
          msg.receivedTime = message.content.lastMessageSendTime;
          break;
        }
      }
    }
  },
  // 退出当前帐号
  IM_LOGOUT(state, data) {
    RongIMClient.getInstance().logout()
    RongIMClient.getInstance().clearCache()
    state.token = ''
    state.clientStatus = '退出登录'
    state.chatlist = {}
    state.conversationList = [];
  }
}
export default {
  state,
  getters,
  actions,
  mutations
};
