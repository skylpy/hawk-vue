// 检测插件是否安装
function sanity() {
  if (typeof window.plugins.callLog == 'undefined' || !window.plugins.callLog) {
    console.error('callLog is not ready');
    return false;
  } else {
    return true;
  }
}

// 获取通话记录权限
function getPermission(successCallback, errorCallback){
  if(!sanity()) {
    errorCallback()
    return null;
  }
  // 校验权限
  window.plugins.callLog.hasReadPermission(function (has) {
    if(has){
      successCallback();
    }else{
      window.plugins.callLog.requestReadPermission(function (has) {
        if(has == 'OK'){
          successCallback();
        }else{
          errorCallback();
        }
      },function (err) {
        errorCallback(err);
      });
    }
  },function (err) {
    errorCallback(err);
  });

}

// 返回的数据列表
// [{
//   cachedName: "中国移动",
//   cachedNumberLabel: 0,
//   cachedNumberType: 0,
//   contact: 212,
//   date: 1547869736589,
//   duration: 18, // 通话时长，单位秒
//   name: "中国移动",
//   new: 1,
//   number: "13800138000",
//   phoneAccountId: "1",
//   type: 2,
//   viaNumber: ""
// }]

/**
 * 获取通话记录
 * @param filter {phone:String,startTime:Date,endTime:Date}
 * @param successCallback 成功回调通话记录
 * @param errorCallback 失败回调
 *
 */
function getCallLog(filter, successCallback, errorCallback) {
  let filters = [];
  if (filter && filter.phone) {
    filters.push({
      "name": "number",
      "value": filter.phone,
      "operator": "==",
    });
  }
  if (filter && filter.startTime) {
    filters.push({
      "name": "date",
      "value": filter.startTime.getTime(),
      "operator": ">="
    });
  }
  if (filter && filter.endTime) {
    filters.push({
      "name": "date",
      "value": filter.endTime.getTime(),
      "operator": "<="
    });
  }
  getPermission(function () {
    // 有权限 获取通话记录
    window.plugins.callLog.getCallLog(filters, function(data){
      successCallback(data);
    }, function (err) {
      if(typeof errorCallback == 'function') errorCallback(err);
    });
  },function (err) {
      // 无权限 请求权限
    if(typeof errorCallback == 'function') errorCallback(err);
  });
}

export default {
  getCallLog
};
