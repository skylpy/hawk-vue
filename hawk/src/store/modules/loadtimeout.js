import axios from "axios";

const state = {
  timeOut: null,
  isLoading: false,
  count: 0
};

const getters = {

};

const mutations = {
    PRELOADER_SHOW(state, self) {
      // console.error('preloaderStart');
      self.$f7.preloader.show();
      state.isLoading = true;
      state.count++;
      if (state.timeOut) clearTimeout(state.timeOut);
      state.timeOut = setTimeout(() => {
        if (state.isLoading) {
          this.commit('PRELOADER_HIDE', self);
          const r = self.$f7.toast.create({
            text: '网络异常，连接超时，请检查网络!',
            position: 'center',
            closeTimeout: 2000,
          });
          r.open();
        }
      }, 5000);
    },
    PRELOADER_HIDE(state, self) {
      // console.error('preloaderEnd');
      state.count--;
      if (state.count <= 0) {
        state.count = 0;
        state.isLoading = false;
        self.$f7.preloader.hide();
        clearTimeout(state.timeOut);
      }
    }
};

const actions = {

};

export default {
  state,
  getters,
  actions,
  mutations
}
