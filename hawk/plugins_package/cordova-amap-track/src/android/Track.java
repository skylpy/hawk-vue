package com.sanfanerp.plugins.aMapTrack;


import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.util.Log;
import android.widget.Toast;

import com.amap.api.track.AMapTrackClient;
import com.amap.api.track.ErrorCode;
import com.amap.api.track.OnTrackLifecycleListener;
import com.amap.api.track.TrackParam;
import com.amap.api.track.query.entity.HistoryTrack;
import com.amap.api.track.query.model.AddTerminalRequest;
import com.amap.api.track.query.model.AddTerminalResponse;
import com.amap.api.track.query.model.AddTrackRequest;
import com.amap.api.track.query.model.AddTrackResponse;
import com.amap.api.track.query.model.DistanceResponse;
import com.amap.api.track.query.model.HistoryTrackRequest;
import com.amap.api.track.query.model.HistoryTrackResponse;
import com.amap.api.track.query.model.LatestPointRequest;
import com.amap.api.track.query.model.LatestPointResponse;
import com.amap.api.track.query.model.OnTrackListener;
import com.amap.api.track.query.model.ParamErrorResponse;
import com.amap.api.track.query.model.QueryTerminalRequest;
import com.amap.api.track.query.model.QueryTerminalResponse;
import com.amap.api.track.query.model.QueryTrackResponse;

public class Track extends CordovaPlugin {

    String TAG = "AMapTrack";

    CallbackContext startTrackServerCallback;
    CallbackContext queryLatestPointCallback;
    CallbackContext queryHistoryTrackCallback;

    AMapTrackClient aMapTrackClient;

    OnTrackLifecycleListener onTrackLifecycleListener;
    OnTrackListener onTrackListener;

    long serviceId;
    String terminalName;
    long terminalId;
    long trackId;

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if (aMapTrackClient == null) {
            aMapTrackClient = new AMapTrackClient(this.cordova.getActivity());
        }
        // 初始化事件
        this.initTrackLifecycleListener();
        this.initTrackListener();

        if (action.equals("startTrackServer")) { //启动持续定位
            startTrackServerCallback = callbackContext;
            serviceId = args.getInt(0);
            terminalName = args.getString(1);
            terminalId = args.getInt(2);
            trackId = args.getInt(3);

            toast("准备开启定位采集");

            // 开启服务
            this.startTrackServer();
            return true;
        } else if (action.equals("clearTrackServer")) { //停止持续定位
            aMapTrackClient.stopGather(onTrackLifecycleListener);
            TrackParam trackParam = new TrackParam(serviceId, terminalId);
            trackParam.setTrackId(trackId);
            aMapTrackClient.stopTrack(trackParam, onTrackLifecycleListener);
            aMapTrackClient = null;
            return true;
        } else if (action.equals("queryLatestPoint")) { //获取最后的点
            queryLatestPointCallback = callbackContext;
            this.queryLatestPoint();
            return true;
        } else if (action.equals("queryHistoryTrack")) { //获取轨迹
            queryHistoryTrackCallback = callbackContext;
            long startTime = args.getLong(0);
            long endTime = args.getLong(0);
            this.queryHistoryTrack(startTime, endTime);
            return true;
        } else {
            return false;
        }
    }
    public void toast(String msg){
        Log.e(TAG, msg);
        Toast.makeText(cordova.getActivity(), msg, Toast.LENGTH_SHORT).show();
    }
    public void initTrackLifecycleListener() {
        if (this.onTrackLifecycleListener != null) {
            return;
        }
        this.onTrackLifecycleListener = new OnTrackLifecycleListener() {
            @Override
            public void onBindServiceCallback(int i, String s) {

            }

            @Override
            public void onStartGatherCallback(int status, String msg) {
                if (status == ErrorCode.TrackListen.START_GATHER_SUCEE ||
                        status == ErrorCode.TrackListen.START_GATHER_ALREADY_STARTED) {
                    toast("定位采集开启成功！");
                } else {
                    toast( "定位采集启动异常" + msg);
                    startTrackServerCallback.error("定位采集启动异常，" + msg);
                }
            }

            @Override
            public void onStartTrackCallback(int status, String msg) {
                if (status == ErrorCode.TrackListen.START_TRACK_SUCEE ||
                        status == ErrorCode.TrackListen.START_TRACK_SUCEE_NO_NETWORK ||
                        status == ErrorCode.TrackListen.START_TRACK_ALREADY_STARTED) {
                    // 服务启动成功，继续开启收集上报
                    aMapTrackClient.startGather(this);
                    toast("服务启动成功，继续开启收集上报");

                    JSONObject data = new JSONObject();
                    try {
                        data.put("serviceId", serviceId);
                        data.put("terminalName", terminalName);
                        data.put("terminalId", terminalId);
                        data.put("trackId", trackId);
                    } catch (JSONException e) {
                        Log.e(TAG, "trackInfo json error:" + e);
                    }
                    PluginResult result = new PluginResult(PluginResult.Status.OK, data);
                    startTrackServerCallback.sendPluginResult(result);
                } else {
                    toast("轨迹上报服务服务启动异常，" + msg);
                }
            }

            @Override
            public void onStopGatherCallback(int i, String s) {

            }

            @Override
            public void onStopTrackCallback(int i, String s) {

            }
        };
    }

    public void initTrackListener(){
        if (this.onTrackListener != null) {
            return;
        }
        this.onTrackListener = new OnTrackListener() {

            @Override
            public void onQueryTerminalCallback(QueryTerminalResponse queryTerminalResponse) {
                if (queryTerminalResponse.isSuccess()) {
                    if (queryTerminalResponse.getTid() <= 0) {
                        // terminal还不存在，先创建
                        aMapTrackClient.addTerminal(new AddTerminalRequest(terminalName, serviceId), onTrackListener);
                    } else {
                        // terminal已经存在，直接开启猎鹰服务
                        terminalId = queryTerminalResponse.getTid();
                        //开启轨迹上报
                        startTrack();
                    }
                } else {
                    // 请求失败
                    toast("请求失败，" + queryTerminalResponse.getErrorMsg());
                }
            }

            @Override
            public void onCreateTerminalCallback(AddTerminalResponse addTerminalResponse) {
                if (addTerminalResponse.isSuccess()) {
                    // 创建完成，开启猎鹰服务
                    terminalId = addTerminalResponse.getTid();
                    //开启轨迹上报
                    startTrack();
                } else {
                    // 请求失败
                    toast("请求失败，" + addTerminalResponse.getErrorMsg());
                }
            }

            @Override
            public void onDistanceCallback(DistanceResponse distanceResponse) {

            }

            @Override
            public void onLatestPointCallback(LatestPointResponse latestPointResponse) {
                toast("最新轨迹点:，" + latestPointResponse.getData());
                queryLatestPointCallback.success(latestPointResponse.getData());
            }

            @Override
            public void onHistoryTrackCallback(HistoryTrackResponse historyTrackResponse) {
                HistoryTrack track = historyTrackResponse.getHistoryTrack();
                JSONObject trackInfo = new JSONObject();
                try {
                    trackInfo.put("count", ((HistoryTrack) track).getCount());
                    trackInfo.put("distance", ((HistoryTrack) track).getDistance());
                    trackInfo.put("endPoint", ((HistoryTrack) track).getEndPoint());
                    trackInfo.put("startPoint", ((HistoryTrack) track).getStartPoint());
                    trackInfo.put("points", ((HistoryTrack) track).getPoints());
                } catch (JSONException e) {
                    Log.e(TAG, "trackInfo json error:" + e);
                }
                PluginResult result = new PluginResult(PluginResult.Status.OK, trackInfo);
                queryHistoryTrackCallback.sendPluginResult(result);

            }

            @Override
            public void onQueryTrackCallback(QueryTrackResponse queryTrackResponse) {

            }

            @Override
            public void onAddTrackCallback(AddTrackResponse addTrackResponse) {
                if (addTrackResponse.isSuccess()) {
                    trackId = addTrackResponse.getTrid();
                    startTrack();
                } else {
                    toast("网络请求失败，" + addTrackResponse.getErrorMsg());
                }
            }

            @Override
            public void onParamErrorCallback(ParamErrorResponse paramErrorResponse) {

            }
        };
    }
    public void startTrack(){
        if(trackId > 0){
            TrackParam trackParam = new TrackParam(serviceId, terminalId);
            trackParam.setTrackId(trackId);
            aMapTrackClient.startTrack(trackParam, onTrackLifecycleListener);
        }else {
            aMapTrackClient.addTrack(new AddTrackRequest(serviceId, terminalId), onTrackListener);
        }
    }
    public void startTrackServer() {
        // 查询设备是否存在
        aMapTrackClient.queryTerminal(new QueryTerminalRequest(serviceId, terminalName), onTrackListener);
    }

    public void queryLatestPoint() {
        aMapTrackClient.queryLatestPoint(new LatestPointRequest(serviceId, terminalId), onTrackListener);
    }

    public void queryHistoryTrack(long startTime, long endTime) {
        aMapTrackClient.queryHistoryTrack(new HistoryTrackRequest(serviceId, terminalId, startTime, endTime), onTrackListener);
    }
}
