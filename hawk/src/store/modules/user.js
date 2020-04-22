import axios from 'axios';
import {defaultImgUrl} from 'lib/loading';
import {loadAvatar} from 'lib/utils';

const state = {
  profile: {
    _id: '',
    gender: '',
    name: '',
    avatar: '',
    phone: '',
    role: '',
    notification: [],
  },
  unreadCount: 0,
  chatUnreadCount: 0,
  token: '',
  avatarUrl: defaultImgUrl,
  device: {}
}

const getters = {
  isAuth: state => !!state.token,
  myProfile: state => state.profile,
  myUserId: state => state.profile._id,
  IamAdmin: state => (state.profile.role == 'admin'),
  IamManager: state => (state.profile.role == 'manager'),
  notification: state => state.profile.notification,
  myToken: state => state.token,
  myAvatar: state => state.avatarUrl,
  unreadCount: state => state.unreadCount + state.chatUnreadCount,
  sysUnreadCount: state => state.unreadCount
}

const mutations = {
  UPDATE_USER: (state, payload) => {

    if (!payload) {
      // in case of logout
      state.profile = {};
      state.token = '';
    } else {
      let {profile, token} = payload;
      state.profile = profile || {};
      state.token = token || '';
    }
  }, // UPDATE_USER
  UPDATE_USER_KEY: (state, payload) => {
    if (payload && payload instanceof Object) {
      Object.assign(state.profile, payload);
    }
  },
  UPDATE_AVATAR: (state, url) => {
    state.avatarUrl = url;
  },
  UPDATE_UNREAD_COUNT: (state, count) => {
    state.unreadCount = count;
  },
  UPDATE_CHAT_UNREAD_COUNT: (state, count) => {
    state.chatUnreadCount = count;
  },
  UPDATE_DEVICE: (state, device) => {
    state.device = device || {};
  }
} // mutations

const actions = {

  LOGIN: async ({state, commit, dispatch}, credentials) => {
    let {phone, passwd, companyId, versions} = (credentials || {});

    try {
      if (phone && passwd) {
        const uuid = Date.now()
        const resp = await axios.post('api/user/login', {phone, passwd, uuid, companyId, versions});
        const payload = resp.data;

        console.log('Login successfully. Updating state', payload);

        localStorage.setItem('user-token', payload.token);
        axios.defaults.headers.common['Authorization'] = ('Bearer ' + payload.token);
        commit('UPDATE_USER', payload);
      } else {
        // try get current user
        const token = localStorage.getItem('user-token');

        if (token) {
          axios.defaults.headers.common['Authorization'] = ('Bearer ' + token);
          const resp = await axios.get('api/user/current');
          const payload = resp.data;
          commit('UPDATE_USER', {
            'profile': payload,
            'token': token
          });

          console.log("login successfully with existing token");
        }
      }

      if (state.token) {
        dispatch('IM_LOGIN', state.profile.rongCloud, {root: true})
        dispatch('SAVE_USER_KEY', {appversion: CONFIG.version, reload: false});
        dispatch('LOAD_AVATAR');
      }

    } catch (error) {
      console.error('action LOGIN failed', error);
      throw error;
    }
  }, // LOGIN

  LOGOUT: async ({commit, dispatch}) => {
    console.info('current user is logging out...');
    localStorage.removeItem('user-token');

    commit('IM_LOGOUT')
    commit('UPDATE_USER');
    // clean up database
    commit('COM_UPDATE');
    commit('PERSONNEL_UPDATE', {personnel: []});
  }, // LOGOUT

  LOAD_AVATAR: ({state, commit}) => {
    loadAvatar(state.profile.avatar, (url) => {
      commit('UPDATE_AVATAR', url);
    });
  },

  SAVE_USER_KEY: async ({state, commit, dispatch}, payload) => {

    try {
      let reload = true;
      if (typeof payload.reload != 'undefined') {
        reload = payload.reload;
        delete payload.reload;
      }

      commit('UPDATE_USER_KEY', payload);
      await axios.put('api/user/' + state.profile._id, payload);

      if (reload) dispatch('LOAD_PERSONNEL');

    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  SET_UNREAD_COUNT: async ({state, commit, dispatch}, count) => {
    commit('UPDATE_UNREAD_COUNT', count)
  },
  SET_CHAT_UNREAD_COUNT: async ({state, commit, dispatch}, count) => {
    commit('UPDATE_CHAT_UNREAD_COUNT', count)
  },

  GET_NOTIFICATION: async ({state, commit, dispatch}) => {

    try {
      if (state.profile._id) {
        // ensure login
        let resp = await axios.get('api/user/notification');
        let notification = deepCopy(resp.data);
        commit('UPDATE_USER_KEY', {notification});
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  REMOVE_NOTIFICATION: async ({state, commit}, nId) => {

    try {
      if (nId) {
        await axios.delete('api/user/notification/' + nId);
        let notification = state.profile.notification.filter(n => n._id != nId);
        commit('UPDATE_USER_KEY', {notification});
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
} // actions

export default {
  state,
  getters,
  actions,
  mutations
}
