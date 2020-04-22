//
//  AMapTrackError.h
//  AMapTrackKit
//
//  Created by liubo on 2017/8/17.
//  Copyright © 2017年 Amap. All rights reserved.
//

#ifndef AMapTrackKit_AMapTrackError_h
#define AMapTrackKit_AMapTrackError_h

///AMapTrack errorDomain
extern NSString * const AMapTrackErrorDomain;

///AMapTrack errorCode
typedef NS_ENUM(NSInteger, AMapTrackErrorCode)
{
    AMapTrackErrorCodeUnknow                = 100,///< 未知错误
    AMapTrackErrorCodeInvalidOption         = 101,///< option包含错误参数
    AMapTrackErrorCodeServiceStarted        = 102,///< service已经启动
    AMapTrackErrorCodeServiceStopped        = 103,///< service已经停止
    AMapTrackErrorCodeGatherStarted         = 104,///< gather已经开始
    AMapTrackErrorCodeGatherStopped         = 105,///< gather已经停止
    AMapTrackErrorCodeLocationAuthFailed    = 106,///< 没有定位权限
    AMapTrackErrorCodeLocateError           = 107,///< 获取定位失败
    
    AMapTrackErrorNoResponseData            = 1800,///< 服务返回数据为空
    AMapTrackErrorInvalidProtocol           = 1801,///< 协议解析错误，通常是返回结果无法解析
    AMapTrackErrorTimeOut                   = 1802,///< 连接超时
    AMapTrackErrorBadURL                    = 1803,///< URL异常
    AMapTrackErrorCannotFindHost            = 1804,///< 找不到主机
    AMapTrackErrorCannotConnectToHost       = 1805,///< 服务器连接失败
    AMapTrackErrorNotConnectedToInternet    = 1806,///< 连接异常，通常为没有网络的情况
    AMapTrackErrorCancelled                 = 1807,///< 连接取消
    
    AMapTrackErrorBadCustomDictionary       = 2031,///< 自定义参数获取异常
    
    AMapTrackErrorOK                        = 10000,///< 没有错误
    AMapTrackErrorInvalidUserKey            = 10001,///< key非法或过期
    AMapTrackErrorServiceNotAvailable       = 10002,///< 没有权限使用相应的接口
    AMapTrackErrorDailyQueryOverLimit       = 10003,///< 访问已超出日访问量
    AMapTrackErrorTooFrequently             = 10004,///< 用户访问过于频繁
    AMapTrackErrorInvalidUserIP             = 10005,///< 用户IP无效
    AMapTrackErrorInvalidUserDomain         = 10006,///< 用户域名无效
    AMapTrackErrorInvalidSignature          = 10007,///< 无效签名
    AMapTrackErrorInvalidUserSCode          = 10008,///< 安全码验证错误，bundleID与key不对应
    AMapTrackErrorUserKeyNotMatch           = 10009,///< 请求key与绑定平台不符
    AMapTrackErrorIPQueryOverLimit          = 10010,///< IP请求超限
    AMapTrackErrorNotSupportHttps           = 10011,///< 不支持HTTPS请求
    AMapTrackErrorInsufficientPrivileges    = 10012,///< 权限不足，服务请求被拒绝
    AMapTrackErrorUserKeyRecycled           = 10013,///< 开发者key被删除，无法正常使用
    AMapTrackErrorQPSHasExceededLimit       = 10014,///< QPS超出限制
    AMapTrackErrorGatewayTimeout            = 10015,///< 单机QPS限流限制
    AMapTrackErrorServerIsBusy              = 10016,///< 服务器负载过高
    AMapTrackErrorResourceUnavailable       = 10017,///< 所请求的资源不可用
    
    AMapTrackErrorInvalidParams             = 20000,///< 请求参数非法
    AMapTrackErrorMissingRequiredParams     = 20001,///< 缺少必填参数
    AMapTrackErrorIllegalRequest            = 20002,///< 请求协议非法
    AMapTrackErrorServiceUnknown            = 20003,///< 其他服务端未知错误
    AMapTrackErrorDuplicatedElement         = 20009,///< 请求包含重复元素
    AMapTrackErrorElementNotExist           = 20010,///< 请求的元素不存在
    AMapTrackErrorServiceNotExist           = 20050,///< service不存在
    AMapTrackErrorTerminalNotExist          = 20051,///< ternimal不存在
    AMapTrackErrorUploadPointPartlyError    = 20100,///< 部分point上传失败
    AMapTrackErrorUploadPointError          = 20101,///< 所有point上传失败
    AMapTrackErrorCountOverLimit            = 20150,///< 数量超过限制
};

#endif /* AMapTrackKit_AMapTrackError_h */
