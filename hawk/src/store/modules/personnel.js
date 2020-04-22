import axios from 'axios';
import {loadAvatar} from 'lib/utils';

const state = {
    personnel: [],
    salaryList: [],
    stopOrDeletePersonnel: []
}

const getters = {
    personnel: state => state.personnel,

    who: (state) => (uId) => {
        let person = null;
        state.personnel.forEach((p) => {
            if (p._id == uId) {
                person = p;
            }
        })
        state.stopOrDeletePersonnel.forEach((p) => {
          if (p._id == uId) {
            person = p;
          }
        })
        return person;
    },

    superAdmin: state => {
        let boss = state.personnel.find(p => p.superadmin);
        return boss;
    },

    userPermissions: state => uId => {
        let u = state.personnel.find(p => p._id == uId);
        if (!u) return [];

        // basic permissions, refer to permission.vue
        let basic_perms = ['我的考勤', '任务管理', '日报管理', '通讯目录', '实时查岗', '工作轨迹', '费用报销', '考核结算', '填写汇报', '通知公告', '客户管理', '拜访管理', '扫名片', '考勤管理', '用车申请', '用章申请', '采购申请', '付款申请', '合同审批', '绩效报告', '物品领用', '邀约到访', '销售业绩'];

        let perms = u.privilege || [],
            perms_temp = u.privilegeTemp || {},
            now = Date.now();

        // check temporary permissions
        if (now >= perms_temp.from && now <= (perms_temp.to + 24*3600*1000)) {
            // temporary privilege on action
            perms = perms_temp.permissions || [];
        }

        return perms.length ? perms : basic_perms;
    },

    manager: (state) => (uId) => {
        if (!uId) { return null; }

        let depart = null;
        state.personnel.forEach((p) => {
            if (p._id == uId) {
                depart = p.department;
            }
        });

        if (!depart) { return null }
        let found = null;
        state.personnel.forEach((p) => {
            if (p.department == depart && p.role == 'manager') {
                found = p._id;
            }
        });

        return found;
    },

    getUserSalary: (state) => (uId) => {
        let salary = null;
        if (!uId) { return null; }
        state.salaryList.forEach((v) => {
          if (v._id == uId) {
            salary = v.salary;
          }
        });
        return salary;
    }
}

const mutations = {
    PERSONNEL_UPDATE: (state, payload) => {
        state.personnel = payload.personnel.filter(v => !(v.isDelete || !v.status));
        state.stopOrDeletePersonnel =  payload.personnel.filter(v => v.isDelete || !v.status);
        console.log(state.personnel,  state.stopOrDeletePersonnel)
    },

    PERSONNEL_UPDATE_KEY: (state, payload) => {
        if (!payload) { return; }
        let updates = payload instanceof Array ? payload : [payload];

        updates.forEach((u) => {
            let p = state.personnel.find(p => p._id == u._id);
            Object.assign(p, u);
        });
    },

    UPDATE_SALARY: (state, payload) => {
      state.salaryList = payload.list;
      // console.log(state.salaryList);
    }
}

const actions = {
    LOAD_PERSONNEL: async ({dispatch, commit}) => {
        console.info('loading personnel list...');

        try {
            let resp = await axios.get('api/users/');
            let personnel = resp.data;

            commit('PERSONNEL_UPDATE', {personnel});
            console.info('personnel updated successfully.');

            dispatch('SET_AVATAR_URL')

        } catch(err) {
            console.error('failed to load personnel', err);
            throw err;
        }
    },

    SET_AVATAR_URL: async ({state, commit}) => {
        state.personnel.forEach(p => {
            loadAvatar(p.avatar, (url) => {
                commit('PERSONNEL_UPDATE_KEY', {
                    _id: p._id,
                    avatarUrl: url
                })
            })
        })
    },

    LOAD_PERSONNEL_KEY: async (context, keys) => {

        try {
            let fields = '';

            if (keys) {
                if (keys instanceof Array) { fields = keys.join(','); }
                else { fields = keys; }
            }

            let query = fields ? '?fields=' + fields : '';
            let resp = await axios.get('api/users/' + query);
            context.commit('PERSONNEL_UPDATE_KEY', resp.data);

        } catch(err) {
            console.error('failed to load personnel with key', err);
            throw err;
        }
    },

    SAVE_PERSONNEL_KEY: async ({state, dispatch, commit}, keys) => {
        if (!keys) {
            console.error('invalid keys for saving personnel');
            return;
        }

        let fields = keys instanceof Array ? keys : [keys];

        let updates = [];
        state.personnel.forEach((p) => {
            let u = {};
            u['_id'] = p['_id'];
            fields.forEach((f) => {
                u[f] = p[f];
            })
            updates.push(u);
        })

        try {
            if (updates.length > 0) {
                await axios.put('api/users/', updates);
            }
        } catch (error) {
            console.error('failed to update ' + fields.join(','), error);
            throw error;
        }
    },

    GET_SALARY: async ({commit}) => {
        console.info('loading salary list...');

        try {
            let resp = await axios.get('api/users/getSalary');
            let list = resp.data;

            commit('UPDATE_SALARY', {list});
            console.info('salary list updated successfully.');
        } catch (error) {
            console.error('failed to load salary list', error);
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
