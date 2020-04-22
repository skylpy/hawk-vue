import Vue from 'vue';
import Vuex from 'vuex';
import user from './modules/user';
import company from './modules/company';
import personnel from './modules/personnel';
import timecard from './modules/timecard';
import trace from './modules/trace';
import timerecord from './modules/timerecord';
import software from './modules/software';
import reporttemplate from './modules/reporttemplate';
import task from './modules/task';
import companylife from './modules/companylife';
import chat from './modules/chat';
import loadtimeout from './modules/loadtimeout';

import watch from './watch';

Vue.use(Vuex);

let store =  new Vuex.Store({

  modules: {
    user,
    company,
    timecard,
    personnel,
    trace,
    timerecord,
    reporttemplate,
    task,
    software,
    companylife,
    chat,
    loadtimeout
  },

  strict: process.env.NODE_ENV !== 'production',
});

watch(store);

export default store;
