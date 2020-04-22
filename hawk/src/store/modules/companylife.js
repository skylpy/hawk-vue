import axios from 'axios';
import moment from 'moment';

const state = {
    _id: '',
  companyId: '',
  number: 0,
  validDate: new Date(),
  nearestValidDate: new Date(),
  residueDays:0,
  progress:0,
  items:[]
}

const getters = {
    myCompanyLife: state => state,
}

const mutations = {
  COMPANY_LIFE_UPDATE: (state, payload) => {
    if (payload && payload instanceof Object) {
      Object.keys(payload).forEach((k) => {
        state[k] = payload[k];
      })
      if (new Date(state.validDate)>new Date()){
       state.residueDays = moment(state.validDate).diff(new Date(),'days');
       if (state.residueDays > 0 ){
          state.progress = state.residueDays * 1.8;
       }
       if (state.residueDays > 50){
         state.progress = 90;
       }
      }
    } else {
      state._id = '';
      state.companyId = '';
      state.number = 0;
      state.progress = 0;
      state.residueDays = 0;
      state.validDate = new Date();
      state.nearestValidDate = new Date();
      state.items = [];
    }
  },

} // mutations

const actions = {
    LOAD_COMPANY_LIFE: async ({commit}) => {
        console.info('loading companylife profile...');

        try {
            const resp = await axios.get('/api/companylife/getByCompanyId');
            const payload = resp.data;
            commit('COMPANY_LIFE_UPDATE', payload);
            console.info('companylife profile updated successfully.');

        } catch (error) {
            console.error('failed to load companylife profile', error);
            throw error;
        }
    }, // LOAD
} // actions

export default {
    state,
    getters,
    actions,
    mutations
}
