import axios from 'axios';

const state = {
    _id: '',
    name: '',
    account: '',
    clientGrade: [],
    clientType: [],
    organization: {},
    regions: {},
    intentionType: [],
    jobType: [],
    leaveType: [],
    pictureType: [],
    taskType: [],
    timeCards: [],
    announces: [],
    taskIndexes: [],
    attendanceIndexes: [],
    holidays: [],
    initScore: 6000,
    reportItemTemplates: [],
    contracts: {},
    financialdocs: {},
    isLimitPersonnel: false,
}

function treeToList(tree) {
    let root = tree;
    let list = [];
    list.push(root);

    if (root.children && root.children.length > 0) {
        root.children.forEach(c => {
            let subList = treeToList(c);
            list.push(...subList);
        })
    }
    return list;
}

let listD = function(d) {
    return d && d.sub && d.sub.slice(0).concat(d.sub.reduce((accum, s) => { return accum.concat(listD(s))}, [])) || [];
}

const getters = {
    myCompany: state => state,
    companyName: state => state.name,

    timeCards: state => state.timeCards,
    timeCard: (state) => ((uId) => {
        if (!uId) { return null }
        let timeCard = null;
        state.timeCards.forEach((tc) => {
            if (tc.owners.includes(uId)) { timeCard = tc }
        })

        return timeCard;
    }),

    companyRegions: state => treeToList(state.regions),
    regionName: state => (id) => {
        let r = treeToList(state.regions).find(i => i.id == id);
        if (r) return r.name;
        return '';
    },

    organization: state => state.organization,

    // return flat department array
    departments: state => { return listD(state.organization) },

    // return department for specfied user id
    // caveat: user must belong to only one department
    userDepartment: state => ( uId => {
      let dList = listD(state.organization).filter(d => d.employees.includes(uId));
      return dList.length > 0 ? dList[0] : null;
    }),
    adminDepartment: state => ( uId => {
      let dList = listD(state.organization).filter(d => d.admin.includes(uId));
      return dList.length > 0 ? dList[0] : null;
    }),

    // return department name for specified user id
    userDepartmentName: state => ( uId => {
        let dList = listD(state.organization);
        return dList.filter(d => d.employees.includes(uId)).map(d => d.name).join(' ');
    }),

    // return department and all its parents for specified user id
    // e.g. return [{name: '公司', ...}, {name: '父部门', ...}, {name: '子部门'...}]
    userDepartmentPath: state => ( uId => {
        let dList = listD(state.organization);
        let targetDList = dList.filter(d => d.employees.includes(uId));
        if (targetDList.length != 1) return []; // fails to find path

        let d = targetDList[0];
        let path = [];

        while(true) {
            path.unshift(d);
            let next = dList.find(dItem => dItem.sub.find(subD => subD.departmentId == d.departmentId));
            if (!next) break;
            d = next;
        }

        path.unshift(state.organization);
        return path;
    }),
    departmentName:state =>(departmentId => {
      let dList = listD(state.organization);
      return dList.filter(d => d.departmentId == departmentId).map(d => d.name).join(',');
    }),
    departmentById:state =>(departmentId => {
      let dList = listD(state.organization).filter(d => d.departmentId == departmentId)
      return dList.length>0?dList[0]:null;
    }),
    isDepartmentAdmin:state =>(uid =>{
      let dList = listD(state.organization).filter(d => d.admin.includes(uid));
      return dList.length > 0 ? true : false;
    }),
    isLimitPersonnel:state => {
      return state.isLimitPersonnel;
    },
    getSuperiorAdmin:state =>(uid => {
      let isAdmin = (uid) => {
        return listD(state.organization).filter(d => d.admin.includes(uid)).length;
      };
      let admin = [];
      if (isAdmin(uid)) {
        admin = listD(state.organization).concat(state.organization).filter(d => d.sub.filter(sd => sd.employees.filter(u => u == uid).length).length);
      } else {
        let dep = listD(state.organization).filter(d => d.employees.includes(uid));
        if (dep.length && dep[0].admin.length) {
          admin = dep;
        } else {
          admin = listD(state.organization).concat(state.organization).filter(d => d.sub.filter(sd => sd.employees.filter(u => u == uid).length).length);
        }
      }
      return admin.length ? admin[0].admin: [];
    })
}

const mutations = {

    COM_UPDATE: (state, payload) => {
        if (payload && payload instanceof Object) {
            Object.keys(payload).forEach((k) => {
                state[k] = payload[k];
            })
        } else {
            state._id = '';
            state.name = '';
            state.account = '';
            state.clientGrade = [];
            state.clientType = [];
            state.organization = {};
            state.regions = [];
            state.intentionType = [];
            state.jobType = [];
            state.leaveType = [];
            state.pictureType = [];
            state.taskType = [];
            state.timecards = [];
            state.announces = [];
            state.taskIndexes = [];
            state.attendanceIndexes = [];
            state.holidays = [];
        }
    },

    CHANGE_LIMIT(state, bool) {
      state.isLimitPersonnel = bool;
    }

} // mutations

const actions = {
    LOAD_COM: async ({commit}) => {
        console.info('loading company profile...');

        try {
            const resp = await axios.get('api/company/');
            const payload = resp.data;
            commit('COM_UPDATE', payload);
            console.info('Company profile updated successfully.');

        } catch (error) {
            console.error('failed to load company profile', error);
            throw error;
        }
    }, // LOAD

    RESET_COM: ({commit}) => {
        commit('COM_UPDATE'); // update with empty payload
    },

    SAVE_COM_KEY: async (context, payload) => {
        let profile = context.state;

        let specifiedKeys = [];
        if (!payload) {
            return;
        } else if (payload instanceof Array) {
            specifiedKeys = payload;
        } else {
            specifiedKeys = [payload];
        }

        let updates = {};
        specifiedKeys.forEach((key) => {

            if (profile[key]) {
                updates[key] = profile[key];
            }
        });

        if (Object.keys(updates).length < 1) {
            console.log('no updates to save for company profile');
            return;
        }

        try {
            await axios.put('api/company/', updates);
        } catch (error) {
            console.error('failed to save company updates', error);
            throw new Error('无法保存企业设置，请联系管理员');
        }

        console.info('successfully update company profile');
    },

    UPDATE_COMPANY: async ({commit}, update) => {
        if (!update || typeof update != 'object' || !Object.keys(update).length) {
            console.error('invalid parameter for company update');
            return;
        }

        try {
            let resp = await axios.put('api/company', update);
            let data = resp.data;

            console.log('updating company setting:', data);
            commit('COM_UPDATE', data);

        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    ADD_ANNOUNCE: async (context, payload) => {

        let announce = payload;

        if (!announce || typeof announce != 'object') { return }
        delete announce._id;

        try {
            let resp = await axios.post('api/company/announce', announce);
            let announces = resp.data;
            context.commit('COM_UPDATE', {announces});

        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    REMOVE_ANNOUNCE: async (context, payload) => {
        let anId = payload;

        if (!anId || typeof anId != 'string') { return }

        try {
            let resp = await axios.delete('api/company/announce/' + anId);
            let announces = resp.data;
            context.commit('COM_UPDATE', {announces});

        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    UPDATE_ANNOUNCE: async (context, payload) => {
        let announce = payload;

        if (!announce || typeof announce != 'object') { return }

        try {
            let resp = await axios.put('api/company/announce/' + announce._id, announce);
            let announces = resp.data;
            context.commit('COM_UPDATE', {announces});

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
