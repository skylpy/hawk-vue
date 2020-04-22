import axios from 'axios';
import {JSONStringify} from "vconsole/src/lib/tool";

const state = {
  enabled: false,
  history: [],
  current: {},
  uploadAt: new Date(),
  pos_init: true,
}

const getters = {
  position: state => state.current,
  trace: state => state.history,
}

const mutations = {
  CURRENT_SET: (state, payload) => {
    if (payload.longitude, payload.latitude) {
      let pos = Object.assign({
        at: (new Date()).toHawkString(),
        uuid: device.uuid
      }, payload);
      state.current = pos;
    }
  },
  PUSH_CURRENT: (state, payload) => {
    if (payload.longitude, payload.latitude) {
      let pos = Object.assign({
        at: (new Date()).toHawkString(),
        uuid: device.uuid
      }, payload);
      state.history.push(pos);
      // state.current = pos;
    }
  },
  TOGGLE_TRACE: (state) => {
    state.enabled = !state.enabled;
  },

  CLEAR_TRACE: (state, payload) => {
    let now = new Date();

    if (state.uploadAt.getDay() != now.getDay()) {
      // 移除昨天数据
      state.history = state.history.filter(i => Date.parseHawkString(i.at).getTime() > payload.uploadAt.getTime());
    }

    state.uploadAt = payload.uploadAt;
    if (state.pos_init) state.pos_init = false;
  },

  LOAD_TRACE: (state, payload) => {
    if (payload && payload instanceof Array) state.history = payload.concat(state.history);
  }
}

const actions = {

  ENABLE_TRACE: ({getters, commit, dispatch, rootState}) => {
    let userInfo = Object.assign({}, getters.myProfile)
    let succeed = (data) => {
      if (data) {
        userInfo.sid = data.serviceId;
        userInfo.tid = data.terminalId;
        userInfo.tName = data.terminalName;
        userInfo.trid = data.trackId;
        delete userInfo.uuid;
        delete userInfo.xgpushId;
        delete userInfo.jpushId;
        axios.put('api/user/' + userInfo._id, userInfo);
        dispatch('LOAD_PERSONNEL');
      }
      console.log('成功开启猎鹰服务', data);
    };
    let error = () => {
      console.log('开启猎鹰服务失败，重新开启中');
      restart();
    }
    let id = null
    let name = null
    let tid = 0
    let trid = 0

    let init = false;
    let tt;

    // 监听定位
    let startWatchPosition = () => {
      axios.post('api/user/getTrack', userInfo).then(res => {
        if (res.data) {
          id = res.data.id;
          name = res.data.name;
          tid = res.data.tid || 0;
          trid = res.data.trid || 0
          console.log(id, name, tid, trid);
          if (id && name) {
            console.log('开启猎鹰服务');
            cordova.plugins.aMapTrack.startTrackServer(id, name, tid, trid, succeed, error);
            clearInterval(time);
          } else {
            restart();
          }
        }
      }).catch(err => {
        if (err && err.errmsg) {
          console.error(err.errmsg);
          restart();
        }
      });
    };
    let restart = () => {
      tt = setTimeout(() => {
        startWatchPosition()
        if (tt) clearTimeout(tt);
      }, 5000);

    }
    if (device.platform == "Android" || device.platform == "iOS") {
      if (cordova.plugins.aMapTrack) {
        // 开始监听定位
        startWatchPosition();
      } else {
        console.log('trace inavailable');
      }
    }
  },

  SAVE_TRACE: ({state, commit, rootState}) => {

    if (!rootState.user.token) {
      console.info('fails to upload trace for non-login user');
      return;
    }

    let toUpload = [];

    if (!state.pos_init && Date.now() - state.uploadAt.getTime() < CONFIG.trace.interval) {
      // no need to upload yet;
      return;

    } else {
      toUpload = state.history.filter(i => Date.parseHawkString(i.at).getTime() > state.uploadAt.getTime());
    }

    if (toUpload.length == 0) return;
    // toUpload = toUpload.filter(i => (i.locationType && i.locationType == 4) ? false : true); // 安卓手机可以去除缓存定位
    let now = new Date();

    axios.post('api/trace', {history: toUpload, current: state.current}, {timeout: 50000}).then(resp => {
      commit('CLEAR_TRACE', {uploadAt: now});
    }).catch(err => {
      console.log('上传位置失败', err);
    });
  },

  LOAD_MY_TRACE: async ({commit, rootState}) => {
    // try {
    //   let resp = await axios.get('api/trace?q=' + JSON.stringify({
    //     userId: rootState.user.profile._id,
    //     date: new Date(),
    //     openGraspRoad: false
    //   }));
    //   let history = resp.data && (resp.data)[0] && (resp.data)[0].records.slice(0) || [];
    //   commit('LOAD_TRACE', history);
    //   console.log('my trace data is loaded');
    //
    // } catch (error) {
    //   console.error('failed to load my own trace data', error);
    // }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
