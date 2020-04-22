import axios from 'axios';

const state = {
    _id: '',
    name: '',
    type: '',
    workDays: [false, false, false, false, false, false, false],
    workTimes: [],
    location: {},
    owners: []
}

const getters = {
    timecard: state => state,
}

const mutations = {

    UPDATE_TIMECARD: (state, payload) => {
        if (payload) {
            Object.keys(payload).forEach((k) => {
                state[k] = payload[k];
            });     
        } else {
            // clean up everything
            state._id = '';
            state.name = '';
            state.type = '';
            state.workDays = [false, false, false, false, false, false, false];
            state.workTimes = [];
            state.location = {};
            state.owners = [];
        }
    }
}

const actions = {
    TIMECARD_LOAD: async ({state, commit, rootState}, tcId) => {

        if (tcId) {
            rootState.company.timeCards.forEach((tc) => {
                if (tc._id == tcId) {
                    commit('UPDATE_TIMECARD', tc);
                }
            });            
        } else {
            commit('UPDATE_TIMECARD');
        }
    },

    TIMECARD_SAVE: async ({state, dispatch}) => {

        try {
            if (state._id) {
                // update
                await axios.put('api/company/timecard/' + state._id, state);

            } else {
                // create
                await axios.post('api/company/timecard', state);
            }

            // reload company to reflect the change
            dispatch('LOAD_COM');

        } catch (err) {
            console.error('无法保存考勤分组设置', error);
            throw new Error('无法保存考勤分组设置，请联系管理员');
        }

        console.info('successfully update timecard setting');
    },

    TIMECARD_DELETE: async ({dispatch}, tcId) => {

        if (!tcId) { return; }

        try {
            await axios.delete('api/company/timecard/' + tcId);

            // reload company to reflect the change
            dispatch('LOAD_COM');

        } catch (error) {
            console.error('无法删除考勤分组设置', error);
            throw new Error('无法删除考勤分组设置，请联系管理员');
        }

        console.info('successfully delete timecard setting');
    }
}



export default {
    state,
    getters,
    actions,
    mutations
}