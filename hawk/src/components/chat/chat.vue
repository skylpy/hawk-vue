<template>
  <f7-page>
    <f7-navbar :title="username"
               back-link
               @click:back="back">
      <f7-nav-right>
        <f7-link v-if="targetId != myUserId"
                 @click="gotoinfo(targetId)">
          <img style="width: 19px"
               :src="icon.info">
        </f7-link>
      </f7-nav-right>
    </f7-navbar>
    <div class="chat_con">
      <div id="message_con"
           class="message_con"
           :style="{height:style.messageHeight}"
           @click="setFnMode(false)">
        <scroll id="message_list"
                class="message_list"
                ref="scroll"
                :onRefresh="load">
          <div v-for="(item,index) in chatRecord"
               v-if="item.messageType!='RecallCommandMessage'"
               :key="index"
               :class="{me:(item.messageType != 'time'&&item.senderUserId==myUserId)}"
               class="message_item clearfix">
            <div v-if="getTimeTip(item,index)"
                 :class="{timeTitle_min:getTimeTip(item,index,'min')}"
                 class="timeTitle">
              {{getTimeTip(item,index)}}
            </div>
            <div v-if="(item.messageType != 'time'&&item.senderUserId==myUserId)"
                 class="message_head"
                 @click="gotoinfo(item.senderUserId)">
              <img :src="myAvatar">
            </div>
            <div v-else
                 @click="gotoinfo(item.senderUserId)"
                 class="message_head">
              <img :src="head">
            </div>
            <div v-if="item.messageType == 'TextMessage'"
                 @click="fnMore(item, 'TextMessage')"
                 class="message_text text_type clearfix">
              <div style="word-wrap: break-word;"
                   v-html="emojiToHTML(item.content.content)"></div>
            </div>

            <div v-if="item.messageType == 'FileMessage'"
                 @click="fnMore(item, 'FileMessage')"
                 class="message_text file_type">
              <img :src="file_icon(item.content)"
                   class="file_icon">
              <div>
                <div class="filename">{{item.content.name}}</div>
                <span>{{getFileSize(item.content.size)}}</span>
              </div>
            </div>

            <div v-if="item.messageType == 'ImageMessage'"
                 @click="fnMore(item, 'ImageMessage')"
                 class="message_text img_type">
              <img :src="item.content.fullPath||getSignUrl(item.content.imageUri,url=>{updatePhoto(url,item)})">
            </div>

            <div v-if="item.messageType == 'VoiceMessage'"
                 @click="fnMore(item, 'VoiceMessage','vp'+index)"
                 class="message_text voice_type">
              <template v-if="item.senderUserId==myUserId" >
                <span>{{item.content.duration}}"</span>
                <voiceplay :ref="'vp'+index" direct="right" class="voice-play-cpt" stroke="#fff" />
              </template>
              <template v-else >
                <voiceplay :ref="'vp'+index" direct="left" class="voice-play-cpt" stroke="#333" />
                <span>{{item.content.duration}}"</span>
              </template>
            </div>

            <div v-if="!item.offLineMessage&&item.receivedStatus==1"
                 class="isRead">已读</div>
            <div v-if="!item.offLineMessage&&item.receivedStatus!=1"
                 class="isRead">未读</div>
          </div>
        </scroll>
      </div>
      <div class="edit_con"
           :style="{height:style.editorHeight}">
        <div class="edit_hd_con">
          <img v-if="!isVoice"
               :src="icon.voice"
               @click="setFnVoice(true)" />
          <img v-else
               :src="icon.keyboard"
               @click="setFnVoice(false)" />

        </div>
        <template v-if="isVoice">
          <div id="voice_input"
               @touchstart="gotouchstart"
               @touchend="gotouchend"
               @touchmove="gotouchmove"
               @touchcancel="gotouchend"
               :class="{'voice_recording': voiceRecording}"
               v-text="voiceRecording ? '松开  结束' : '按住  说话'"
               class="voice_input"
               readonly></div>
        </template>
        <textarea v-else
                  id="editor"
                  v-model="editor"
                  @keydown="keySendMsg"
                  @focus="isEmoji ? setFnEmoji(false) : isFn ? setFnMode(false) : ''"
                  :style="{height:style.autoHeight}"
                  class="edit_input"></textarea>

        <div class="edit_fn_con">
          <img v-if="!isEmoji"
               :src="icon.emoji"
               @click="setFnEmoji(true)" />
          <img v-if="isEmoji"
               :src="icon.keyboard"
               @click="setFnEmoji(false)" />
          <img :src="icon.add"
               @click="setFnMode(true)" />
        </div>
        <div v-if="editor&&isSend"
             class="edit_send"
             @click="onSendMsg">发送</div>
      </div>
      <div class="fn_input_con"
           v-if="isFnModel">
        <div class="emoji_con"
             v-if="isEmoji">
          <div class="emoji">
            <div v-for="(item,index) in RongIMEmoji.list"
                 :key="index"
                 @click="insertInputTxt(item.emoji)"
                 class="emoji_item">
              <span v-html="RongIMEmoji.symbolToHTML(item.symbol)"></span>
            </div>
          </div>
          <div class="bt_con">
            <div class="btn_delete"
                 :class="{isDisabled:!editor}"
                 @click="deleteInputTxt"><img :src="icon.delete"></div>
          </div>
        </div>
        <div class="fn_con"
             v-if="isFn">
          <div>
            <div @click="sendPicture(true)">
              <img :src="icon.photo">
              <p>相片</p>
            </div>
            <div @click="sendPicture()">
              <img :src="icon.camera">
              <p>拍摄</p>
            </div>
            <div @click="openFileBrowser()">
              <img :src="icon.file">
              <p>文件</p>
              <!--<input id="fileUpload" ref="fileUpload" @change="sendFile" style="display:none; opacity: 0;" type="file">-->
            </div>
          </div>
        </div>
      </div>
      <f7-popup id="files-download-mgr">
        <f7-page style="background:white">
          <f7-navbar>
            <f7-nav-left>
              <f7-link @click="$f7.popup.close('#files-download-mgr')"
                       icon-only>
                <i class="icon icon-back"></i>
              </f7-link>
            </f7-nav-left>
            <f7-nav-title>文件下载</f7-nav-title>
          </f7-navbar>

          <f7-list v-if="downloads"
                   style="margin-top:0">
            <f7-list-item v-for="(f, index) in downloads"
                          :key="index"
                          @click="fileOpener2(f.nativeURL, f.type)"
                          :title="f.name">
              <div slot="inner"
                   style="max-width:50%; font-size:12px; color:gray;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;"
                   v-if="f.localPath">
                {{f.localPath}}
              </div>
              <f7-progressbar v-else
                              style="max-width:50%; color:#01B38B"
                              slot="inner"
                              :progress="f.progress || 0"></f7-progressbar>
              <div slot="inner"
                   style="color:gray; font-size:smaller">{{ f.progress ? (f.progress == 100 ?
                '下载完成' : '正在下载') : (f.localPath?'下载完成':'准备下载')}}
              </div>
            </f7-list-item>
          </f7-list>

          <f7-list class="hawk-action-button-bottom">
            <f7-list-button :title="downloads_complete() ? '完成' : '取消下载'"
                            @click="download_abort"></f7-list-button>
          </f7-list>

        </f7-page>
      </f7-popup>
      <f7-popup id="files-preview-doc">
        <f7-navbar>
          <f7-nav-left>
            <f7-link icon-only
                     @click="$f7.popup.close('#files-preview-doc')">
              <i class="icon icon-back"></i>
            </f7-link>
          </f7-nav-left>
          <f7-nav-title>文件预览</f7-nav-title>
        </f7-navbar>

        <iframe :src="preview_url"
                width="100%"
                height="100%"
                allowfullscreen
                id="aliyunPreview"
                frameborder="0"></iframe>

      </f7-popup>

      <div id="voiceRecording"
           v-show="voiceRecording">
        <div class="voice-record-images">
          <i class="f7-icons">mic_fill</i>
          <svg xmlns="http://www.w3.org/2000/svg"
               version="1.1"
               id="voiceRecordSvg"
               width="60"
               height="120">
            <rect x="5" y="10" width="55" height="15" fill="#fff" >
              <animate attributeType="CSS" attributeName="opacity" values="0;0;0;0;0;1;0;0;0;0;0"  dur="2.5s"  repeatCount="indefinite"  fill="freeze" />
            </rect>
            <rect x="5" y="30" width="45" height="15" fill="#fff" >
              <animate attributeType="CSS" attributeName="opacity" values="0;0;0;0;1;1;1;0;0;0;0"  dur="2.5s"  repeatCount="indefinite"  fill="freeze" />
            </rect>
            <rect x="5" y="50" width="35" height="15" fill="#fff" >
              <animate attributeType="CSS" attributeName="opacity" values="0;0;0;1;1;1;1;1;0;0;0"  dur="2.5s"  repeatCount="indefinite"  fill="freeze" />
            </rect>
            <rect x="5" y="70" width="25" height="15" fill="#fff" >
              <animate attributeType="CSS" attributeName="opacity" values="0;0;1;1;1;1;1;1;1;0;0"  dur="2.5s"  repeatCount="indefinite"  fill="freeze" />
            </rect>
            <rect x="5" y="90" width="15" height="15" fill="#fff" >
              <animate attributeType="CSS" attributeName="opacity" values="0;1;1;1;1;1;1;1;1;1;0"  dur="2.5s"  repeatCount="indefinite"  fill="freeze" />
            </rect>
          </svg>
        </div>
        <div class="recording-noice">手指上划，取消发送</div>
      </div>
    </div>
    <div class="touch_line"
         :style="'top:'+thouch_line+'px'"></div>
  </f7-page>
</template>

<script>
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex';
import { openCamera, openFilePicker } from 'lib/camera';
import { recordAudioPermission, getFileContentAsBase64Ios, getFileContentAsBase64Android, getMedia, createTempMediaFromBase64, getTempMedia, audioRecordStart, audioRecordStop } from 'lib/media';
import scroll from '../gadget/scroll'
import { upload, getSignUrl, selectAndUpload, getPreviewUrl } from 'lib/aliyun';
import { loadAvatar } from 'lib/utils'
import axios from 'axios'
import voiceplay from "./voiceplay.vue";

// 监听长按讲话事件
let timeOutEvent = 0
// 监听对话过长事件
let maxTimeout = 0
// 多少秒后才算长按
const PRESS_TIME_TRIGER = 600
// 对话最长时间
const MAX_VOICE_LONG = 59000
// 上划取消的界线
const TOUCH_CANCLE_Y = window.screen.height - 150

export default {
  name: "chat",
  components: {
    scroll,
    voiceplay
  },
  props: {
    conversationType: String,
    targetId: String
  },
  data () {
    return {
      username: '陈伟',
      target: '',
      icon: {
        emoji: require('../../assets/images/icon_expression_gray@2x.png'),
        keyboard: require('../../assets/images/icon_keyboard_gray@2x.png'),
        add: require('../../assets/images/icon_options_gray@2x.png'),
        word: require('../../assets/images/icon_document_word_blue@2x.png'),
        file: require('../../assets/images/btn_add_file_gray@2x.png'),
        photo: require('../../assets/images/btn_app_photo_gray@2x.png'),
        camera: require('../../assets/images/btn_take_ptoto_gray@2x.png'),
        delete: require('../../assets/images/btn_delete_green@2x.png'),
        info: require('../../assets/images/icon_people_right_green@2x.png'),
        head: require('../../assets/images/hp_default_80@2x.png'),
        voice: require('../../assets/images/icon_voice_gray@2x.png')
      },
      chatRecord: [],
      isSend: true,
      editor: '',
      isEmoji: false,
      isFnModel: false,
      isVoice: false,
      isFn: false,
      // 是否正在录音
      voiceRecording: false,
      RongIMEmoji: RongIMLib.RongIMEmoji,


      platform: device.platform,
      top: 0,
      startY: 0,          // 保存 y轴点的位置
      touching: false,   // 代表当前是否处于 下拉刷新行为的开关，也就是当属于滚动行为时，就要退出该事件机制,
      head: '',
      preview_url: '',
      style: {
        autoHeight: '33px',
        editorHeight: '50px',
        messageHeight: 'calc(100% - 50px)',
      },
      downloads: [],
      voiceStart: 0,
      voiceEnd: 0,
      voiceMedia: null,
      voicePlayCpt: null,
      thouch_line: TOUCH_CANCLE_Y
    }
  },
  watch: {
    chatRecord (val, oldVal) {
      let message_list = document.getElementById('message_list')
      if (message_list && message_list.scrollTop > 50) {
        this.gotoBottom()
      }
      if (val.length) {
        this.IM_READ_MEG_ALL(this.targetId)
      }
    },
    editor (val) {
      this.autoHeight()
    }
  },
  computed: {
    ...mapGetters([
      'who',
      'myUserId',
      'getChatRecord',
      'myProfile',
      'myAvatar'
    ]),
  },
  mounted () {
    this.target = this.who(this.targetId)
    this.username = this.target ? this.who(this.targetId).name : ''
    this.chatRecord = this.getChatRecord(this.targetId)
    this.gotoBottom()
    this.load()
    this.IM_CLEAR_UNREAD(this.targetId)

    loadAvatar(this.who(this.targetId).avatar, url => {
      this.head = url
    })

    axios.get('/api/chat/?targetId=' + this.targetId).then(res => {
      if (!res.data._id) {
        axios.post('/api/chat/', { targetId: this.targetId })
      }
    })
    axios.put('/api/chat/updateLastTime', { targetId: this.targetId })


    if (!window.downloader_init) {
      let folder = 'hawkDownloads';
      let fileSystem = device.platform == 'Android' ? cordova.file.externalRootDirectory : (
        device.platform == 'iOS' ? cordova.file.documentsDirectory : cordova.file.dataDirectory
      );
      console.log(cordova.file, fileSystem, folder)
      downloader.init({ folder, fileSystem });
      window.downloader_init = true;
    }
    this.addDownloadHandler()

    recordAudioPermission()
      .then(rst => {
        if (!rst) $alert('授权失败，无法发送语音消息')
      })
      .catch(error => {
        $alert('授权失败，无法发送语音消息')
      })

  },
  methods: {
    ...mapActions([
      'IM_SEND_MSG',
      'IM_PUSH_MEG',
      'IM_READ_MEG_ALL',
      'IM_CLEAR_UNREAD',
      'IM_DEL_MEG',
      'SET_CHAT_UNREAD_COUNT'
    ]),
    getFileSize (fileByte) {
      var fileSizeByte = parseInt(fileByte);
      var fileSizeMsg = "";
      if (fileSizeByte < 1048576) fileSizeMsg = (fileSizeByte / 1024).toFixed(2) + "KB";
      else if (fileSizeByte == 1048576) fileSizeMsg = "1MB";
      else if (fileSizeByte > 1048576 && fileSizeByte < 1073741824) fileSizeMsg = (fileSizeByte / (1024 * 1024)).toFixed(2) + "MB";
      else if (fileSizeByte > 1048576 && fileSizeByte == 1073741824) fileSizeMsg = "1GB";
      else if (fileSizeByte > 1073741824 && fileSizeByte < 1099511627776) fileSizeMsg = (fileSizeByte / (1024 * 1024 * 1024)).toFixed(2) + "GB";
      else fileSizeMsg = "文件超过1TB";
      return fileSizeMsg;
    },
    getOssFileUrl (files) {
      return Promise.all(files.map(f => {
        return new Promise((resolve, reject) => {
          getSignUrl(f.oss, (url) => {
            f.signedUrl = url + '';
            resolve();
          })
        });
      }));
    },
    addDownloadHandler () {
      let self = this;

      document.addEventListener('DOWNLOADER_initialized', function (event) {
        var data = event.data;
        console.log('DOWNLOADER_gotFolder', data);
      });

      document.addEventListener('DOWNLOADER_gotFolder', function (event) {
        var data = event.data; // data:[cordova.fileEntry folder]
        console.log('DOWNLOADER_gotFolder', data[0].fullPath, data);
      });

      document.addEventListener('DOWNLOADER_error', function (event) {
        var data = event.data; // data:[object error]
        console.error('DOWNLOADER_error', data);

        self.downloads = null;
        $f7.popup.close('#files-download-mgr');
        $alert('下载出错，请稍后再试', '操作错误');
      });

      document.addEventListener('DOWNLOADER_downloadSuccess', function (event) {
        var data = event.data; // [cordova.fileEntry entry]
        data.forEach(fileEntry => {
          let f = self.downloads.find(f => f.name == fileEntry.name);
          f.localPath = fileEntry.fullPath;
          f.nativeURL = fileEntry.nativeURL;
          f.progress = 100;
        });
        console.log('DOWNLOADER_downloadSuccess', data)
        self.$forceUpdate();
      });

      document.addEventListener('DOWNLOADER_downloadError', function (event) {
        var data = event.data; // data:[object error]
        console.error('DOWNLOADER_downloadError', data);

        self.downloads = null;
        $f7.popup.close('#files-download-mgr');
        $alert('下载出错，请稍后再试', '操作错误');
      });

      document.addEventListener('DOWNLOADER_downloadProgress', function (event) {
        var data = event.data; // data:[number percentage, string fileName]
        let f = self.downloads.find(f => f.name == data[1]);
        if (f) {
          f.progress = data[0];
          self.$forceUpdate();
        }
      });
    },
    downloads_complete () {
      return this.downloads && !this.downloads.find(f => f.progress != 100)
    },
    download (item, type) {
      let file
      if (type == 'img') {
        let typeArr = item.content.imageUri.split('.')
        if (typeArr.length != 3) {
          $alert('格式错误')
          return
        }
        file = {
          oss: item.content.imageUri,
          name: item.content.imageUri,
          signedUrl: null,
          type: typeArr.length == 3 ? typeArr[2] : 'jpeg'
        }
      } else {
        file = {
          oss: item.content.fileUrl,
          name: item.content.name,
          signedUrl: null,
          type: item.content.type
        }
      }
      let files = [file];
      if (this.downloads.filter(f => f.name == file.name).length) {
        this.$f7.popup.open('#files-download-mgr');
        $alert('该文件已在下载列表中');
        return
      }
      this.downloads.push(file)
      $confirm(`确定要下载这个文件吗？`, '操作确认', () => {
        console.log('准备下载文件', files)
        this.getOssFileUrl(files).then(() => {
          console.log('准备下载文件地址', files)
          downloader.getMultipleFiles(files.map(f => {
            return { url: f.signedUrl, name: f.name };
          }))
        });

        this.$f7.popup.open('#files-download-mgr');
      })
    },
    download_abort () {
      if (this.downloads_complete()) {
        $f7.popup.close('#files-download-mgr');
        return;
      }

      $confirm('确定要中断文件下载吗？', '操作确认', () => {
        downloader.abort();
        this.downloads = null;
        $f7.popup.close('#files-download-mgr');
      })
    },
    fileOpener2 (file, type) {
      console.log('fileOpener2', file, type, cordova.plugins.fileOpener2)
      if (!file) return;
      cordova.plugins.fileOpener2.open(file, 'application/' + type, {
        error: function (e) {
          console.log('Error status: ' + e.status + ' - Error message: ' + e.message, e);
          if (e.status == 9) {
            $alert('没有找到支持' + type + '格式的应用');
          }
        },
        success: function () {
          console.log('file opened successfully');
        }
      }
      );
    },
    back () {
      let self = this;
      RongIMClient.getInstance().getTotalUnreadCount({
        onSuccess: function (count) {
          self.SET_CHAT_UNREAD_COUNT(count)
          // count => 所有会话总未读数。
        },
        onError: function (error) {
          // error => 获取总未读数错误码。
        }
      });
    },
    gotoinfo (targetId) {
      if (targetId != this.myUserId) {
        this.$f7router.navigate("/chat/people", { props: { targetId } });
      }
    },
    // 信息之间超过十五分钟，生成时间标签
    getTimeTip (curr, index, type) {
      const diff = 15 * 60 * 1000 // 15分钟
      let ref
      if (index > 0) {
        ref = this.chatRecord[index - 1].sentTime
      } else {
        ref = Date.now()
      }

      // 今天的开始
      let today = new Date()
      today.setHours(0);
      today.setMinutes(0);
      today.setSeconds(0);
      today.setMilliseconds(0);
      const diffDay = today.getTime()

      // 十五分钟差值
      const diffRef = curr.sentTime - ref
      if (diffDay > curr.sentTime) {
        //昨天之前
        if (diff < Math.abs(diffRef)) {
          //超过时间
          if (type == 'min') return false
          return new Date(curr.sentTime).toHawkString()
        } else {
          //未超时间
          return false
        }
      } else {
        if (diff < Math.abs(diffRef)) {
          //超过时间
          if (type == 'min') return true
          return new Date(curr.sentTime).toHawkTimeString()
        } else {
          //未超时间
          return false
        }
      }
    },
    // 加载聊天记录每次20条
    load (doneFn) {
      var conversationType = RongIMLib.ConversationType.PRIVATE; //单聊,其他会话选择相应的消息类型即可。
      var targetId = this.targetId; // 想获取自己和谁的历史消息，targetId 赋值为对方的 Id。
      var timestrap = null; // 默认传 null，若从头开始获取历史消息，请赋值为 0 ,timestrap = 0;
      var count = 20; // 每次获取的历史消息条数，范围 0-20 条，可以多次获取。
      const client = RongIMLib.RongIMClient.getInstance()
      if (client.getHistoryMessages) {
        client.getHistoryMessages(conversationType, targetId, timestrap, count, {
          onSuccess: (list, hasMsg) => {
            console.log(list)
            console.log(hasMsg)
            // list => Message 数组。
            // hasMsg => 是否还有历史消息可以获取

            if (list.filter(msg => {
              if (this.chatRecord.filter(m => msg.messageUId == m.messageUId).length) {
                return true
              } else {
                return false
              }
            }).length) {
              // 已存在则跳过
              return;
            }
            this.chatRecord.unshift(...list)
            if (doneFn) {
              // 下拉刷新
              doneFn()
            } else {
              // 初次加载
              this.gotoBottom()
            }
          },
          onError: (error) => {
            console.log("GetHistoryMessages,errorcode:" + error);
          }
        });
      }
    },
    fnMore (item, type, ref) {
      let buttons = [];
      // 只有文字内容可复制
      if (type == 'TextMessage') {
        buttons.push({
          text: '复制',
          onClick: () => {
            if (item.content && item.content.content) {
              this.$copyText(item.content.content).then(function (e) {
                console.log(e)
              }, function (e) {
                console.log(e)
              })
            }
          }
        })
      }
      if (type == 'ImageMessage') {
        buttons.push({
          text: '查看',
          onClick: () => {
            this.previewImage(item.content)
          }
        }),
          buttons.push({
            text: '下载',
            onClick: () => {
              this.download(item, 'img')
            }
          })
      }
      if (type == 'VoiceMessage') {
        buttons.push({
          text: '播放',
          onClick: () => {
            var cntObj = item.content
            var fileName = (cntObj.extra && cntObj.extra.fileName) ? cntObj.extra.fileName : ''
            if (!fileName) {
              let fileType = '.m4a'
              fileName = Date.now() + '.m4a'
              cntObj.extra = { fileName, fileType }
            }
            this.playVoice(cntObj.content, fileName, ref)
          }
        })
      }
      if (type == 'FileMessage') {

        buttons.push({
          text: '在线预览',
          onClick: () => {
            this.previewFile(item.content)
          }
        })
        buttons.push({
          text: '下载',
          onClick: () => {
            this.download(item, 'file')
          }
        })
      }
      if (item.senderUserId == this.myUserId) {
        // 删除
        buttons.push(
          {
            text: '删除/撒回',
            onClick: () => {
              this.IM_DEL_MEG(item)
            }
          })
      }
      // 关闭
      buttons.push({ text: '关闭' })

      let dialog = $dialog.create({
        title: '操作',
        // text: 'Dialog with vertical buttons',
        buttons,
        closeByBackdropClick: true,
        verticalButtons: true,
      })
      dialog.open()
    },
    getSignUrl (url, cb) {
      getSignUrl(url, cb)
    },
    // 将表情转为HTML标签
    emojiToHTML (message) {
      return RongIMLib.RongIMEmoji.emojiToHTML(message);
    },
    // 回车发送
    keySendMsg (event) {
      if (event.keyCode === 13) {
        event.preventDefault()
        this.onSendMsg()
      }
    },
    // 发送信息
    onSendMsg () {
      if (this.editor == '') return

      this.isSend = false;
      this.IM_SEND_MSG({
        content: { content: this.editor },
        msgType: 'text',
        type: this.conversationType,
        targetId: this.targetId,
        onSuccess: msg => {
          this.IM_PUSH_MEG(msg)
          this.gotoBottom();
          this.editor = ''
          this.isSend = true;
        }
      })
    },
    updatePhoto (url, item) {
      item.content.fullPath = url;
      this.$forceUpdate()
      this.$nextTick(() => {
        this.gotoBottom();
      })
    },
    // 下拉到底部
    gotoBottom () {
      this.$nextTick(function () {
        let message_list = document.getElementById('message_list')
        if (message_list) {
          message_list.scrollTop = message_list.scrollHeight;
        }
      })
    },
    // 尝试解决表情和附加功能时 键盘与功能窗双弹出问题
    hideKey (flag) {
      // return // 禁用
      let editor = document.getElementById('editor')
      // 发送语音的时候，editor 不加载
      if (!editor) return
      if (flag) {
        editor.blur()
      } else {
        editor.focus()
      }
    },
    // 判断是否为表情（主要用于按钮删除，是则删除两个字符否则删一个字符）
    isEmojiCharacter (substring) {
      for (var i = 0; i < substring.length; i++) {
        var hs = substring.charCodeAt(i);
        if (0xd800 <= hs && hs <= 0xdbff) {
          if (substring.length > 1) {
            var ls = substring.charCodeAt(i + 1);
            var uc = ((hs - 0xd800) * 0x400) + (ls - 0xdc00) + 0x10000;
            if (0x1d000 <= uc && uc <= 0x1f77f) {
              return true;
            }
          }
        } else if (substring.length > 1) {
          var ls = substring.charCodeAt(i + 1);
          if (ls == 0x20e3) {
            return true;
          }
        } else {
          if (0x2100 <= hs && hs <= 0x27ff) {
            return true;
          } else if (0x2B05 <= hs && hs <= 0x2b07) {
            return true;
          } else if (0x2934 <= hs && hs <= 0x2935) {
            return true;
          } else if (0x3297 <= hs && hs <= 0x3299) {
            return true;
          } else if (hs == 0xa9 || hs == 0xae || hs == 0x303d || hs == 0x3030
            || hs == 0x2b55 || hs == 0x2b1c || hs == 0x2b1b
            || hs == 0x2b50) {
            return true;
          }
        }
      }
    },
    autoHeight () {
      let elInput = document.getElementById('editor');

      // 发送语音的时候，editor 不加载
      if (!elInput) {
        elInput = document.getElementById('voice_input')
      }

      let h = elInput.scrollHeight + (elInput.offsetHeight - elInput.clientHeight)
      if (h > 150) h = 150;
      if (!this.editor) h = 33;
      elInput.style.height = h + "px";
      if (this.isVoice) elInput.style.height = "19px";
      this.style.autoHeight = h + 'px';
      this.style.editorHeight = (h + 17) + "px"
      if (this.isFnModel) {
        this.style.messageHeight = 'calc(100% - ' + (h + 262) + 'px)';
      } else {
        this.style.messageHeight = 'calc(100% - ' + (h + 17) + 'px)';
      }
    },
    // 在光标处插入内容，主要用于插入表情
    insertInputTxt (insertTxt) {
      var elInput = document.getElementById('editor');

      var startPos = elInput.selectionStart;
      var endPos = elInput.selectionEnd;
      if (startPos === undefined || endPos === undefined) return
      var txt = elInput.value;
      var result = txt.substring(0, startPos) + insertTxt + txt.substring(endPos)
      elInput.value = result;
      // elInput.blur();
      elInput.selectionStart = startPos + insertTxt.length;
      elInput.selectionEnd = startPos + insertTxt.length;
      this.editor = elInput.value
    },
    // 按钮删除，是则删除两个字符否则删一个字符
    deleteInputTxt () {
      let emoji = this.editor.substr(this.editor.length - 2, this.editor.length);
      if (this.isEmojiCharacter(emoji)) {
        this.editor = this.editor.substr(0, this.editor.length - 2);
      } else {
        this.editor = this.editor.substr(0, this.editor.length - 1);
      }
    },
    // 功能弹窗 相片 相机 文件
    setFnMode (flag) {
      this.isFnModel = flag
      this.isFn = flag
      this.isEmoji = false
      if (flag) {
        this.isVoice = false
        this.hideKey(flag)
        this.gotoBottom()
      }
      this.autoHeight();
    },
    // 表情弹窗
    setFnEmoji (flag) {
      this.isFnModel = flag
      this.isFn = false
      this.isEmoji = flag
      if (flag) {
        this.isVoice = false
        this.hideKey(flag)
        this.gotoBottom()
      }
      this.autoHeight();

    },
    setFnVoice (flag) {
      this.isVoice = flag
      if (flag) {
        this.isFnModel = false
        this.isFn = false
        this.isEmoji = false
        this.hideKey(true)
        this.gotoBottom()
      }
      this.autoHeight();
    },
    // 相册或相机选择图片
    sendPicture (fromFile) {
      let self = this;

      let cb = function (ret) {
        if (ret instanceof Error) {
          console.error(ret);
        } else {
          let dataUrl = ret;
          console.log('sendPicture')
          $preloader.show();

          upload(dataUrl, (res) => {
            $preloader.hide();
            if (res instanceof Error) {
              console.error(res);
              $alert('无法上传照片', '操作失败');
            } else {
              console.log('IM_SEND_MSG')
              console.log(res)
              self.IM_SEND_MSG({
                content: { content: res, imageUri: res },
                msgType: 'image',
                type: self.conversationType,
                targetId: self.targetId,
                onSuccess: msg => {
                  self.IM_PUSH_MEG(msg)
                  self.gotoBottom();
                }
              })
            }
          });
        }
      };
      if (!fromFile) openCamera(cb, null, false);
      if (fromFile) openFilePicker(cb, false);
    },
    // 预览图片
    openPhotoBrowser (item) {
      let pb = $f7.photoBrowser.create({ photos });

      pb.on('closed', () => {
        pb.destroy();
      })
      pb.open();
    },
    openFileBrowser () {
      let self = this
      let fileinfo
      selectAndUpload(file => {
        fileinfo = {
          fileId: device.uuid + Date.now(),
          name: file.name,
          size: file.size,
          type: (filename => {
            let parts = filename.split('.');
            if (parts.length > 1) return parts.pop();
            return '';
          })(file.name),
        }
      }, res => {
        if (!res || res instanceof Error) {
          $alert('上传文件失败，请稍后再试', '操作失败');
          return;
        }
        self.IM_SEND_MSG({
          content: { name: fileinfo.name, size: fileinfo.size, type: fileinfo.type, fileUrl: res },
          msgType: 'file',
          type: self.conversationType,
          targetId: self.targetId,
          onSuccess: msg => {
            self.IM_PUSH_MEG(msg)
            self.gotoBottom();
          }
        })
        console.log(res)
      })
    },
    file_icon (f) {
      let ext = f.type;

      if (['doc', 'dot', 'wps', 'wpt', 'docx', 'dotx', 'docm', 'dotm'].includes(ext))
        return require('assets/images/icon_document_word_blue@2x.png');

      if (['xls', 'xlt', 'et', 'ett', 'xlsx', 'xltx', 'csv', 'xlsm', 'xlsm', 'xltm'].includes(ext))
        return require('assets/images/icon_document_excel_green@2x.png');

      if (['pdf'].includes(ext))
        return require('assets/images/icon_document_pdf_pink@2x.png');

      if (['gif', 'png', 'jpg', 'jpeg'].includes(ext))
        return require('assets/images/icon_document_picture_orange@2x.png');

      if (['pptx', 'ppt', 'pot', 'potx', 'pps', 'ppsx', 'dps', 'dpt', 'pptm', 'potm', 'ppsm'].includes(ext))
        return require('assets/images/icon_document_ppt_red@2x.png');

      if (['txt', 'log', 'lrc', 'rtf', 'xml', 'htm', 'html'].includes(ext))
        return require('assets/images/icon_document_txt_purple@2x.png');

      if (['zip', '7z', 'rar'].includes(ext))
        return require('assets/images/icon_document_zip_multicolor@2x.png');

      // return compressed file icon by default
      return require('assets/images/icon_document_unknown_gray@2x.png');
    },
    preparePreview (file, cb) {
      if (file.preview) {
        cb(file);
        return;
      }

      $dialog.preloader('正在准备预览文件...');

      axios.get('api/utils/preview/' + file.fileUrl).then(resp => {
        let url = resp.data && resp.data.TgtUri || '';
        if (!url) {
          console.error('preview url not found');
          throw new Error('preview url not found');
        }

        file.preview = url;
        $dialog.close();

        cb(file);
      }).catch(err => {
        console.error(err);
        $dialog.close();
        $alert('无法创建预览文件', '操作失败');
      })
    },
    previewFile (file) {
      let filetype = file.type.toLowerCase();

      if ([
        'pptx', 'ppt', 'pot', 'potx', 'pps', 'ppsx', 'dps', 'dpt', 'pptm', 'potm', 'ppsm',
        'xls', 'xlt', 'et', 'ett', 'xlsx', 'xltx', 'csv', 'xlsb', 'xlsm', 'xltm',
        'doc', 'dot', 'wps', 'wpt', 'docx', 'dotx', 'docm', 'dotm',
        'pdf', 'lrc', 'c', 'cpp', 'h', 'asm', 's', 'java', 'asp', 'bat', 'bas', 'prg', 'cmd', 'rtf', 'txt', 'log', 'xml', 'htm', 'html'
      ]
        .includes(filetype)) {

        this.preparePreview(file, (file) => {
          getPreviewUrl(file.preview, url => {
            this.preview_url = url
          });
          $popup.open('#files-preview-doc');
        });

        return;
      }

      if (['gif', 'png', 'jpg', 'jpeg'].includes(filetype)) {
        getSignUrl(file.fileUrl, url => {
          let pb = $f7.photoBrowser.create({
            photos: [url],
            theme: 'dark',
            backLinkText: '返回'
          });

          pb.on('closed', () => {
            pb.destroy();
          })
          pb.open();
        })

        return;
      }

      $alert('该类型的文件不支持预览', '操作错误');
      return;
    },
    previewImage (file) {
      getSignUrl(file.imageUri, url => {

        let pb = $f7.photoBrowser.create({
          photos: [url],
          theme: 'dark',
          backLinkText: '返回'
        });

        pb.on('closed', () => {
          pb.destroy();
        })
        pb.open();
      })
    },
    gotouchstart () {
      console.info('Touch Voice Start')
      // 正在录制不启动
      if (this.voiceRecording) return;
      //清除定时器
      clearTimeout(timeOutEvent);
      timeOutEvent = 0;
      timeOutEvent = setTimeout(() => {
        console.info('Touch Start Call audioRecordStart')
        // 执行长按要执行的内容
        this.audioRecordStart()
      }, PRESS_TIME_TRIGER)
    },
    gotouchend () {
      console.info('Touch Voice End')
      if (timeOutEvent) clearTimeout(timeOutEvent)

      // 不正在录制不启动
      if (!this.voiceRecording) return;
      console.info('Touch End Call audioRecordStop')
      this.audioRecordStop(false)
    },
    gotouchmove (event) {
      // console.info('Touch event', event)
      //   for (var i = 0; i < event.targetTouches.length; i++) {
      //   }
      // 如果手指有移动，则取消所有事件，此时说明用户只是要移动而不是长按 
      // 清除定时器
      // clearTimeout(timeOutEvent)
      // timeOutEvent = 0

      // 如果所有触摸点都在元素内（貌似不起作用）
      // if (event.touches.length === event.targetTouches.length) {
      // return
      // }

      if (timeOutEvent) clearTimeout(timeOutEvent)

      let flag = false

      if (event.targetTouches && event.targetTouches.length) {
        for (var i = 0; i < event.targetTouches.length; i++) {
          // 只判断 Y 方向是否超过界限
          if (event.targetTouches[i].screenY < TOUCH_CANCLE_Y) {
            flag = true
            break
          }
        }
      } else if(event.screenY) {
        if (event.screenY < TOUCH_CANCLE_Y) {
          flag = true
        }
      }

      if (flag && self.voiceRecording) {
        console.info('Touch Move Call audioRecordStop')
        this.audioRecordStop(true)
      }
    },
    audioRecordStart () {
      console.log('Call audioRecordStart', Date.now())
      let self = this
      self.voiceRecording = true
      self.voiceStart = Date.now()
      
      try {
        // 上限计时清除
        if(maxTimeout) clearTimeout(maxTimeout)

        // 上限计时开始
        maxTimeout = setTimeout(() => {
          if (self.voiceRecording) {
            // 录音超时强制发送
            console.warn('Force audioRecordStop')
            self.audioRecordStop(false)
            this.$f7.toast.create({
              text: '语音不宜超出60秒',
              position: 'center',
              closeTimeout: 2000,
            }).open()
          }
        }, MAX_VOICE_LONG)

        // 开始录音
        audioRecordStart()

      } catch (error) {
        console.error('audioRecordStart Fail in Chat.vue : ' + error)        
      }
    },
    /**
     * 结束录音
     * @param {Boolean} cancleVoice 取消发送录音
     */
    async audioRecordStop (cancleVoice) {
      console.log('Call audioRecordStop', Date.now())
      console.log('Is voiceRecording : ', this.voiceRecording)
      console.log('Is cancleVoice : ', cancleVoice)

      if(maxTimeout) clearTimeout(maxTimeout)

      let self = this
      if (self.voiceRecording) {
        self.voiceRecording = false
      } else {
        // 没有开始录音则不执行
        return
      }
      self.voiceEnd = Date.now()

      try {
        let savedFilePath = await audioRecordStop()
        
        // 取消语音发送
        if (cancleVoice) return;

        // success
        console.log('audioRecordStop ok: ' + savedFilePath)
        // 获取文件名
        var fileName = savedFilePath.split('/')[savedFilePath.split('/').length - 1];
        var fileType = fileName.split('.')[1];

        console.log('Record media fileName : %s, fileType : %s ', fileName, fileType)

        let action
        let path
        if (device.platform === 'iOS') {
          action = getFileContentAsBase64Ios
          path = fileName
        } else if (device.platform === 'Android') {
          action = getFileContentAsBase64Android
          path = savedFilePath
        }

        action(path, function (base64) {
          // console.log('basse64 ',base64)
          // 融云范例填写base64后的字符串
          // var contentStr = base64.split(',')[1];
          // console.log('contentStr ',contentStr)
  
          self.isSend = false;
  
          var duration = Math.ceil((self.voiceEnd - self.voiceStart) / 1000)
  
          self.IM_SEND_MSG({
            content: { base64Str: base64, duration: duration, extra: { fileName, fileType } },
            msgType: 'voice',
            type: self.conversationType,
            targetId: self.targetId,
            onSuccess: msg => {
              self.IM_PUSH_MEG(msg)
              self.gotoBottom();
              self.editor = ''
              self.isSend = true;
            }
          })
  
        })
      
      } catch (error) {
        console.error('audioRecordStop Fail in Chat.vue : ' + error)
      }

    },
    async playVoice (base64Str, fileName, ref) {
      console.log('Play Voice ……', fileName)

      // 正在播放的录音要停止
      if (this.voiceMedia) {
        this.voiceMedia.stop()
      }
      if (this.voicePlayCpt) {
        this.voicePlayCpt.stopAnimate()
      }

      let self = this
      let media
      let fileEntry

      try {
        fileEntry = await getTempMedia(fileName)

        if (!fileEntry) {

          fileEntry = await createTempMediaFromBase64(base64Str, fileName)

          console.log('Write Media Successfully ! ', fileEntry.toURL())
        } else {
          console.log('Read Media Successfully ! ', fileEntry.toURL())
        }

        this.voicePlayCpt = this.$refs[ref][0]
        this.voicePlayCpt.startAnimate()

        let path

        if (device.platform === 'iOS') {
          path = fileName
        } else if (device.platform === 'Android') {
          path = fileEntry.toURL()
        }

        let self = this
        media = getMedia(
          path,
          amp => {
            console.log('getMedia Success CallBack', amp)
          },
          error => {
            console.error('getMedia Error CallBack', error)
          },
          state => {
            console.info('getMedia State CallBack', state)
            if(state === Media.MEDIA_PAUSED || state === Media.MEDIA_STOPPED) {
              if (self.voicePlayCpt) self.voicePlayCpt.stopAnimate()
            }
          }
        )

        // 最大声
        media.setVolume(1.0)
        media.play()
        self.voiceMedia = media
      } catch (error) {
        console.error('Error During Play Voice', error)
      }

    }
  }
}
</script>

<style scoped>
.timeTitle {
  background-color: #d8d8d8;
  height: 26px;
  line-height: 26px;
  border-radius: 3px;
  color: white;
  width: 150px;
  text-align: center;
  margin: 10px auto;
}

.timeTitle_min {
  width: 70px !important;
}

.btn_delete {
  position: absolute;
  right: 10px;
  top: 10px;
  cursor: pointer;
}

.btn_delete > img {
  width: 34px;
}

.emoji_con > .bt_con {
  position: relative;
  height: 40px;
  background-color: white;
}

.emoji_con .isDisabled {
  background-color: #ffffff;
  color: #a5a6a9;
}

.emoji_con {
  position: relative;
  height: 100%;
  overflow-y: auto;
}

.emoji {
  height: calc(100% - 40px);
  overflow-y: auto;
  background-color: #f6f6f6;
}

.emoji_item {
  cursor: pointer;
  padding: 8px;
  margin: 4px;
  display: inline-block;
}

.fn_model {
  height: calc(100% - 295px) !important;
}

.fn_input_con {
  height: 245px;
  z-index: 99;
  position: relative;
}

.chat_con {
  background-color: #f6f6f6;
  height: calc(100% - 1px);
}

.message_con {
  position: relative;
  height: calc(100% - 50px);
  overflow-y: auto;
  width: 100%;
}

.edit_con {
  border-top: 1px solid #d8d8d8;
  height: 50px;
  background-color: #fafafa;
  position: relative;
}

.edit_input,
.voice_input {
  display: inline-block;
  height: 33px;
  border: 1px solid #dcdcdc;
  margin: 7px auto 7px 40px;
  font-size: 15px;
  border-radius: 4px;
  width: calc(100% - 130px);
  padding: 6px;
}

.voice_input {
  width: calc(100% - 144px);
  height: 19px;
  font-size: 14px;
  text-align: center;
  user-selelect: none;
}

.voice_recording.voice_recording {
  background: #ddd;
}

.edit_fn_con {
  position: absolute;
  bottom: 8px;
  right: 0px;
  width: 80px;
}

.edit_hd_con {
  position: absolute;
  bottom: 8px;
  left: 4px;
  width: 40px;
}

.edit_fn_con > img,
.edit_hd_con > img {
  margin-top: 10px;
  width: 27px;
  height: 27px;
  margin-right: 8px;
}

.edit_send {
  position: absolute;
  bottom: 10px;
  right: 6px;
  background-color: #01b38b;
  color: white;
  width: 40px;
  height: 30px;
  border-radius: 4px;
  line-height: 30px;
  text-align: center;
}

.message_list {
  /*height: 600px;*/
  background-color: #f6f6f6;
}

.message_item {
  margin-top: 10px;
  margin-bottom: 22px;
  position: relative;
}

.message_head {
  margin-left: 10px;
  width: 40px;
  height: 40px;
  background-color: #ececec;
  border-radius: 4px;
  overflow: hidden;
  float: left;
}

.message_head > img {
  width: 100%;
  height: 100%;
}

.message_text {
  max-width: calc(100% - 136px);
  background-color: #ffffff;
  border-radius: 4px;
  float: left;
  top: 0px;
  margin-left: 10px;
  padding: 10px 15px;
}

.filename {
  word-break: break-all;
}

.isRead {
  display: none;
}

.me .isRead {
  display: block;
  clear: both;
  color: #868686;
  text-align: right;
  font-size: 12px;
  padding-top: 10px;
  margin-right: 61px;
}

.me .message_head {
  float: right;
  margin-right: 10px;
}

.me .message_text {
  float: right;
  margin-right: 0px;
}

.me .text_type {
  background-color: #01b38b;
  color: white;
}

.me .voice_type {
  background-color: #01b38b;
  color: white;
}

.file_type > img {
  float: left;
  margin-top: 3px;
}

.file_type > div {
  width: calc(100% - 32px);
  float: left;
  margin-left: 5px;
}

.file_type > div > span {
  font-size: 10px;
  color: #666666;
}

.file_type > img {
  width: 27px;
}

.img_type > img {
  max-width: 100%;
}

.fn_con {
  height: 100%;
  background-color: #f6f6f6;
  position: absolute;
  top: 0px;
  width: 100%;
}

.fn_con > div {
  height: calc(100% - 24px);
  padding: 12px;
}

.fn_con > div > div {
  margin: 13px;
  float: left;
  cursor: pointer;
  text-align: center;
}

.fn_con > div > div > p {
  margin: 0px;
  color: #999999;
}

.fn_con > div > div > img {
  width: 59px;
}

.clearfix:after {
  content: "";
  display: block;
  clear: both;
}

.clearfix {
  zoom: 1;
}

#voiceRecording {
  position: absolute;
  height: 200px;
  width: 180px;
  z-index: 99;
  top: calc(50vh - 100px);
  left: calc(50vw - 90px);
  border-radius: 6px;
  background: rgba(95, 95, 95, 0.3);
  color: #fff;
}
#voiceRecording .recording-noice {
  position: absolute;
  width: 100%;
  bottom: 10px;
  text-align: center;
}
#voiceRecording .voice-record-images {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

#voiceRecording .voice-record-images i {
  font-size: 90px;
}

.touch_line {
  position: absolute;
  width: 100%;
  height: 2px;
  background: transparent;
}

.voice_type {
  display:flex;
  align-items: flex-start;
}
.voice-play-cpt:last-child {
  margin-left: 3px;
}
</style>
