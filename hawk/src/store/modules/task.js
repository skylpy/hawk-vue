import axios from 'axios';
const state = {

  hasUpdateTask:false
}

const getters = {
    hasUpdateTask:state=>{
      return state.hasUpdateTask;
    },


}

const mutations = {
  setHasUpdateTask(state,status){
    state.hasUpdateTask = status;
  },
}

const actions = {

}

export default {
  state,
  getters,
  actions,
  mutations
}
