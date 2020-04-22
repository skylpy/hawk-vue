//
//  AMapTrackManager.h
//  AMapTrackKit
//
//  Created by liubo on 2017/8/15.
//  Copyright © 2017年 Amap. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <CoreLocation/CoreLocation.h>
#import "AMapTrackError.h"
#import "AMapTrackManagerOptions.h"

#import "AMapTrackCommonObj.h"
#import "AMapTrackTerminalObj.h"
#import "AMapTrackTrackObj.h"
#import "AMapTrackHistoryObj.h"

NS_ASSUME_NONNULL_BEGIN

@protocol AMapTrackManagerDelegate;

#pragma mark - AMapTrackManager

@interface AMapTrackManager : NSObject

///初始化方法
- (instancetype)initWithOptions:(AMapTrackManagerOptions *)options NS_DESIGNATED_INITIALIZER;

///AMapTrackManager的delegate
@property (nonatomic, weak) id<AMapTrackManagerDelegate> delegate;

#pragma mark - Location

///设定定位的活跃类型。默认为 CLActivityTypeAutomotiveNavigation 。
@property (nonatomic, assign) CLActivityType activityType;

///设定定位的最小更新距离。单位米，默认为 kCLDistanceFilterNone，表示只要检测到设备位置发生变化就会更新位置信息。
@property (nonatomic, assign) CLLocationDistance distanceFilter;

///设定期望的定位精度。单位米，默认为 kCLLocationAccuracyBest。定位服务会尽可能去获取满足desiredAccuracy的定位结果，但不保证一定会得到满足期望的结果。
@property (nonatomic, assign) CLLocationAccuracy desiredAccuracy;

///指定定位是否会被系统自动暂停。默认为NO。
@property (nonatomic, assign) BOOL pausesLocationUpdatesAutomatically;

///是否允许后台定位。默认为NO。只在iOS 9.0及之后起作用。设置为YES的时候必须保证 Background Modes 中的 Location updates 处于选中状态，否则会抛出异常。由于iOS系统限制，需要在定位未开始之前或定位停止之后，修改该属性的值才会有效果。
@property (nonatomic, assign) BOOL allowsBackgroundLocationUpdates;

#pragma mark - Gather And Pack

///定位信息的采集周期，单位秒，默认2s，有效值范围[1, 60]。
@property (nonatomic, readonly) NSUInteger gatherInterval;

///定位信息的上传周期，单位秒，默认20s，有效值范围[5, 3000]。
@property (nonatomic, readonly) NSUInteger packInterval;

/**
 * @brief 设定定位信息的采集周期和上传周期，注意：上传周期必须为采集周期的整数倍
 * @param gatherTimeInterval 定位信息的采集周期，单位秒，有效值范围[1, 60]
 * @param packTimeInterval 定位信息的上传周期，单位秒，有效值范围[5, 3000]
 */
- (void)changeGatherAndPackTimeInterval:(NSInteger)gatherTimeInterval packTimeInterval:(NSInteger)packTimeInterval;

#pragma mark - Service And Gather

///当前的serviceID，初始化时指定。
@property (nonatomic, readonly) NSString *serviceID;

///当前的terminalID，startService时指定。
@property (nonatomic, readonly) NSString *terminalID;

///当前的trackID。
@property (nonatomic, copy) NSString *trackID;

/**
 * @brief 开始Service，结果会通过onStartService:回调返回
 * @param options AMapTrackManagerServiceOption类实例
 */
- (void)startServiceWithOptions:(AMapTrackManagerServiceOption *)options;

/**
 * @brief 停止Service，结果会通过onStopService:回调返回
 */
- (void)stopService;

/**
 * @brief 开始采集和上传，结果会通过onStartGatherAndPack:返回
 */
- (void)startGatherAndPack;

/**
 * @brief 停止采集和上传，结果会通过onStopGatherAndPack:返回
 */
- (void)stopGaterAndPack;

#pragma mark - Cache Size

/**
 * @brief 设定允许的本地缓存最大值
 * @param cacheMaxSize 本地缓存最大值，单位MB，默认+∞，有效值范围[50,+∞)。
 * @return 是否设定成功
 */
- (BOOL)setLocalCacheMaxSize:(NSInteger)cacheMaxSize;

///本地缓存最大值
@property (nonatomic, readonly) NSUInteger cacheMaxSize;

#pragma mark - Network

///网络超时时间，单位秒，默认为30。
@property (nonatomic, assign) NSInteger timeout;

/**
 * @brief 取消所有未回调的请求，触发错误回调didFailWithError:associatedRequest:。
 */
- (void)cancelAllRequests;

#pragma mark - Terminal Request

/**
 * @brief 增加Terminal接口
 * @param request 查询选项。具体属性字段请参考 AMapTrackAddTerminalRequest 类。
 */
- (void)AMapTrackAddTerminal:(AMapTrackAddTerminalRequest *)request;

/**
 * @brief 查询Terminal接口
 * @param request 查询选项。具体属性字段请参考 AMapTrackQueryTerminalRequest 类。
 */
- (void)AMapTrackQueryTerminal:(AMapTrackQueryTerminalRequest *)request;

#pragma mark - Track Request

/**
 * @brief 增加Track接口
 * @param request 查询选项。具体属性字段请参考 AMapTrackAddTrackRequest 类。
 */
- (void)AMapTrackAddTrack:(AMapTrackAddTrackRequest *)request;

/**
 * @brief 删除Track接口
 * @param request 查询选项。具体属性字段请参考 AMapTrackDeleteTrackRequest 类。
 */
- (void)AMapTrackDeleteTrack:(AMapTrackDeleteTrackRequest *)request;

#pragma mark - Track History Request

/**
 * @brief 查询终端位置接口
 * @param request 查询选项。具体属性字段请参考 AMapTrackQueryLastPointRequest 类。
 */
- (void)AMapTrackQueryLastPoint:(AMapTrackQueryLastPointRequest *)request;

/**
 * @brief 查询轨迹行驶距离接口
 * @param request 查询选项。具体属性字段请参考 AMapTrackQueryTrackDistanceRequest 类。
 */
- (void)AMapTrackQueryTrackDistance:(AMapTrackQueryTrackDistanceRequest *)request;

/**
 * @brief 查询轨迹历史数据和行驶距离接口
 * @param request 查询选项。具体属性字段请参考 AMapTrackQueryTrackHistoryAndDistanceRequest 类。
 */
- (void)AMapTrackQueryTrackHistoryAndDistance:(AMapTrackQueryTrackHistoryAndDistanceRequest *)request;

/**
 * @brief 查询轨迹历史数据
 * @param request 查询选项。具体属性字段请参考 AMapTrackQueryTrackInfoRequest 类。
 */
- (void)AMapTrackQueryTrackInfo:(AMapTrackQueryTrackInfoRequest *)request;

@end

#pragma mark - AMapTrackManagerDelegate

@protocol AMapTrackManagerDelegate <NSObject>
@optional

/**
 * @brief 当请求发生错误时，会调用代理的此方法。
 * @param error   返回的错误。
 * @param request 发生错误的请求。
 */
- (void)didFailWithError:(NSError *)error associatedRequest:(id)request;

/**
 * @brief 开始Service回调
 * @param errorCode 开始Service的错误信息，参考 AMapTrackErrorCode 。
 */
- (void)onStartService:(AMapTrackErrorCode)errorCode;

/**
 * @brief 停止Service回调
 * @param errorCode 开始Service的错误信息，参考 AMapTrackErrorCode 。
 */
- (void)onStopService:(AMapTrackErrorCode)errorCode;

/**
 * @brief 开始采集和上传回调
 * @param errorCode 开始Service的错误信息，参考 AMapTrackErrorCode 。
 */
- (void)onStartGatherAndPack:(AMapTrackErrorCode)errorCode;

/**
 * @brief 停止采集和上传回调，建议使用 onStopGatherAndPack:errorMessage: 替代此方法
 * @param errorCode 停止采集和上传回调的错误信息，参考 AMapTrackErrorCode 。
 */
- (void)onStopGatherAndPack:(AMapTrackErrorCode)errorCode;

/**
 * @brief 停止采集和上传回调. since 1.1.0
 * @param errorCode 停止采集和上传回调的错误信息，参考 AMapTrackErrorCode 。
 * @param errorMessage 停止采集和上传回调的错误信息
 */
- (void)onStopGatherAndPack:(AMapTrackErrorCode)errorCode errorMessage:(nullable NSString *)errorMessage;

/**
 * @brief 定位点的自定义字段. since 1.1.0
 * @return 自定义的字段 注:自定义字段类型需要为字符串类型，否则采集和上传失败
 */
- (NSDictionary <NSString *,NSString *> *)trackManagerGetCustomDictionary;

#pragma mark - Terminal Request Done

/**
 * @brief 增加Terminal回调函数
 * @param request 发起的请求，具体字段参考 AMapTrackAddTerminalRequest 类。
 * @param response 响应结果，具体字段参考 AMapTrackAddTerminalResponse 类。
 */
- (void)onAddTerminalDone:(AMapTrackAddTerminalRequest *)request response:(AMapTrackAddTerminalResponse *)response;

/**
 * @brief 查询Terminal回调函数
 * @param request 发起的请求，具体字段参考 AMapTrackQueryTerminalRequest 类。
 * @param response 响应结果，具体字段参考 AMapTrackQueryTerminalResponse 类。
 */
- (void)onQueryTerminalDone:(AMapTrackQueryTerminalRequest *)request response:(AMapTrackQueryTerminalResponse *)response;

#pragma mark - Track Request Done

/**
 * @brief 增加Track回调函数
 * @param request 发起的请求，具体字段参考 AMapTrackAddTrackRequest 类。
 * @param response 响应结果，具体字段参考 AMapTrackAddTrackResponse 类。
 */
- (void)onAddTrackDone:(AMapTrackAddTrackRequest *)request response:(AMapTrackAddTrackResponse *)response;

/**
 * @brief 删除Track回调函数
 * @param request 发起的请求，具体字段参考 AMapTrackDeleteTrackRequest 类。
 * @param response 响应结果，具体字段参考 AMapTrackBaseResponse 类。
 */
- (void)onDeleteTrackDone:(AMapTrackDeleteTrackRequest *)request response:(AMapTrackBaseResponse *)response;

#pragma mark - Track History Request Done

/**
 * @brief 查询终端位置回调函数
 * @param request 发起的请求，具体字段参考 AMapTrackQueryLastPointRequest 类。
 * @param response 响应结果，具体字段参考 AMapTrackQueryLastPointResponse 类。
 */
- (void)onQueryLastPointDone:(AMapTrackQueryLastPointRequest *)request response:(AMapTrackQueryLastPointResponse *)response;

/**
 * @brief 查询轨迹行驶距离回调函数
 * @param request 发起的请求，具体字段参考 AMapTrackQueryTrackDistanceRequest 类。
 * @param response 响应结果，具体字段参考 AMapTrackQueryTrackDistanceResponse 类。
 */
- (void)onQueryTrackDistanceDone:(AMapTrackQueryTrackDistanceRequest *)request response:(AMapTrackQueryTrackDistanceResponse *)response;

/**
 * @brief 查询轨迹历史数据和行驶距离回调函数
 * @param request 发起的请求，具体字段参考 AMapTrackQueryTrackHistoryAndDistanceRequest 类。
 * @param response 响应结果，具体字段参考 AMapTrackQueryTrackHistoryAndDistanceResponse 类。
 */
- (void)onQueryTrackHistoryAndDistanceDone:(AMapTrackQueryTrackHistoryAndDistanceRequest *)request response:(AMapTrackQueryTrackHistoryAndDistanceResponse *)response;

/**
 * @brief 查询轨迹历史数据回调函数
 * @param request 发起的请求，具体字段参考 AMapTrackQueryTrackInfoRequest 类。
 * @param response 响应结果，具体字段参考 AMapTrackQueryTrackInfoResponse 类。
 */
- (void)onQueryTrackInfoDone:(AMapTrackQueryTrackInfoRequest *)request response:(AMapTrackQueryTrackInfoResponse *)response;

@end

NS_ASSUME_NONNULL_END
