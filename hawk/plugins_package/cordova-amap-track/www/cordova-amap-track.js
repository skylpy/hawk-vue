var exec = require('cordova/exec');

exports.startTrackServer = function(serviceId, terminalName, terminalId, traceId, success, error) {
    exec(success, error, "AMapTrack", "startTrackServer", [serviceId||0, terminalName, terminalId||0, traceId||0]);
};

exports.clearWatch = function(success, error) {
    exec(success, error, "AMapTrack", "clearTrackServer", []);
};

exports.queryLatestPoint = function(success, error) {
    exec(success, error, "AMapTrack", "queryLatestPoint", []);
};

exports.queryHistoryTrack = function(startTime, endTime, success, error) {
    exec(success, error, "AMapTrack", "queryHistoryTrack", [startTime, endTime]);
};