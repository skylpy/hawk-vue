import axios from 'axios';

const state = {

}

const getters = {
    timeRecords: state => state
}

const mutations = {
    ADD_TIMERECORD: (state, payload) => {
        payload.forEach((v) => {
            let {userId, date, records} = v;
            if (userId && date && records) {

                if (!state[userId]) {
                    state[userId] = {};
                }

                if (!(state[userId][date])) {
                    state[userId][date] = [];
                }

                state[userId][date] = records;
            }
        })
    }
}

const actions = {
    LOAD_TIMERECORD: async ({state, commit}, options) => {
        let {userId, date} = options;
        let unloadedDates = date instanceof Array ? date : [date];

        if (unloadedDates.length == 0) {
            return;
        }

        let filter = {
            userId,
            date: unloadedDates.map(i => (new Date(i)))
        }

        try {
            let resp = await axios.get('api/timerecord?q=' + JSON.stringify(filter));

            if (resp.data) {
                commit('ADD_TIMERECORD', resp.data);
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    SAVE_TIMERECORD: async ({commit}, record) => {
        let {userId, time, location, detail, type, workTime, offset, photo, auditing} = record;
        let date = (new Date()).toHawkDateString();

        try {
            await axios.post('api/timerecord', {time, location, detail, type, workTime, offset, photo, auditing});
            commit('ADD_TIMERECORD', [{
                'userId': userId,
                'date': date,
                'records': [{time, location, offset, photo, detail, type, workTime, auditing}]
            }]);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
