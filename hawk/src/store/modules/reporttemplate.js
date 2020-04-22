import axios from 'axios';
const state = {
  daysOfWeek:{
    displays: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    values: [1,2,3,4,5,6,0],
  },
  daysOfMonth:{
    displays:['1号', '2号', '3号', '4号', '5号', '6号', '7号', '8号', '9号', '10号', '11号', '12号', '13号', '14号', '15号', '16号', '17号', '18号', '19号', '20号', '21号', '22号', '23号', '24号', '25号', '26号', '27号', '28号', '29号', '30号', '31号',],
    values:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
  },
  times:{
    displays:['0:00','1:00','2:00','3:00','4:00','5:00','6:00','7:00','8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '24:00'],
    values:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24],
  },
  statisticsData:{},
}

const getters = {

    reportOptionData: state=>(name)=>{
      return state[name];
    },
    statisticsDataCache: state=>(filter)=>{
      let key = encodeURI(JSON.stringify(filter));
      return state.statisticsData[key];
      },
      reportOptionName: state=>(optionName,value)=>{
        if (!value){
          return '';
      }
      let display = '';
      let displays = [];
      if (optionName == 'week'){

        if (Array.isArray(value)){
          value.forEach((val)=>{
            let index = state.daysOfWeek.values.indexOf(parseInt(val));
            if (index > -1){
              displays.push(state.daysOfWeek.displays[index]);
            }else {
              displays.push('');
            }
          });
          return displays;
        } else {
          state.daysOfWeek.values.forEach((val, index) => {
            if (value == val) display = state.daysOfWeek.displays[index];
          });
        }

      } else if (optionName == 'month'){
        state.daysOfMonth.values.forEach((val, index) => {
          if (value == val) display = state.daysOfMonth.displays[index];
        });
      } else if (optionName == 'time'){
        state.times.values.forEach((val, index) => {
          if (value == val) display = state.times.displays[index];
        });
      }else if (optionName == 'weekAndTime'){
        if (value.length == 2){
          let index = state.daysOfWeek.values.indexOf(parseInt(value[0]));
          if (index > -1){
            displays.push(state.daysOfWeek.displays[index]);
          }else {
            displays.push('');
          }
          index = state.times.values.indexOf(parseInt(value[1]));
          if (index > -1){
            displays.push(state.times.displays[index]);
          }else {
            displays.push('');
          }
          return displays;
        }

      } else if (optionName == 'monthAndTime') {
        if (value.length == 2) {
          let index = state.daysOfMonth.values.indexOf(parseInt(value[0]));
          if (index > -1) {
            displays.push(state.daysOfMonth.displays[index]);
          } else {
            displays.push('');
          }
          index = state.times.values.indexOf(parseInt(value[1]));
          if (index > -1) {
            displays.push(state.times.displays[index]);
          } else {
            displays.push('');
          }
          return displays;
        }
      }



        return display;
    }

}

const mutations = {
  SET_STATISTICS_DATA(state,params){
    state.statisticsData[params.key] = params.data;
  }

}

const actions = {

}

export default {
  state,
  getters,
  actions,
  mutations
}
