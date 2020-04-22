const state = {
    module_filter: [],

    subscriber: {
        '考勤': true,
        '通知': true,
        '报销': true,
        '日报': true,
        '任务': true,
        '客户': true,
        '拜访': true        
    },

    reminder: {
        notification: true,
        sound: true,
        vibrate: true
    }
}

const getters = {
    subscriber: state => state.subscriber,
    subscribe: state => (item) => { return state.subscriber[item] },
    module_filter: state => state.module_filter,
    reminder: state => state.reminder,
}

const mutations = {
    SOFTWARE_CONFIG_SET: (state, config) => {
        if (!config || typeof config != 'object') return;
        if (config.module_filter) state.module_filter = config.module_filter;
        if (config.subscriber) Object.assign(state.subscriber, config.subscriber);
        if (config.reminder) Object.assign(state.reminder, config.reminder);

        console.log('software configuration updated', state);
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