//
//  AMapTrackCommonObj.h
//  AMapTrackKit
//
//  Created by liubo on 2017/8/15.
//  Copyright © 2017年 Amap. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <CoreLocation/CoreLocation.h>
#import "AMapTrackError.h"

NS_ASSUME_NONNULL_BEGIN

#pragma mark - AMapTrackObject

///基础类, 通用数据结构和response支持copy和coding
@interface AMapTrackObject : NSObject<NSCopying, NSCoding>

/**
 * @brief 返回格式化的描述信息。通用数据结构和response类型有效。
 */
- (NSString *)formattedDescription;

@end

#pragma mark - AMapTrackBaseRequest

///AMapTrackKit请求基类
@interface AMapTrackBaseRequest : AMapTrackObject

///请求使用的serviceID
@property (nonatomic, copy) NSString *serviceID;

@end

#pragma mark - AMapTrackBaseResponse

///AMapTrackKit请求响应基类
@interface AMapTrackBaseResponse : AMapTrackObject

///请求返回的状态码
@property (nonatomic, assign) AMapTrackErrorCode code;

///请求返回的状态码描述
@property (nonatomic, copy) NSString *info;

///请求返回的错误细节
@property (nonatomic, copy) NSString *detail;

@end

#pragma mark - AMapTrackTerminal

///Terminal终端类
@interface AMapTrackTerminal : AMapTrackObject

///Terminal的ID
@property (nonatomic, copy) NSString *tid;

///Terminal的name
@property (nonatomic, copy) NSString *name;

///Terminal的description信息
@property (nonatomic, copy) NSString *desc;

///Terminal的创建时间，单位毫秒
@property (nonatomic, assign) long long createTime;

///Terminal的最后定位时间，单位毫秒
@property (nonatomic, assign) long long locateTime;

@end

#pragma mark - AMapTrackPoint

///Point定位点类
@interface AMapTrackPoint : AMapTrackObject

///Point的坐标信息
@property (nonatomic, assign) CLLocationCoordinate2D coordinate;

///Point的定位时间，单位毫秒
@property (nonatomic, assign) long long locateTime;

///Point的速度信息，单位km/h
@property (nonatomic, assign) double speed;

///Point的航向信息
@property (nonatomic, assign) double direction;

///Point的高度信息
@property (nonatomic, assign) double height;

///Point的定位精确度
@property (nonatomic, assign) double accuracy;

///Point的上传时间，仅在从服务端检索返回时有效
@property (nonatomic, assign) long long createTime;

@end

#pragma mark - AMapTrackBasicTrack

///BasicTrack轨迹类
@interface AMapTrackBasicTrack : AMapTrackObject

///BasicTrack的ID
@property (nonatomic, copy) NSString *trackID;


///BasicTrack的距离
@property (nonatomic, assign) NSUInteger distance;

///BasicTrack的持续时间
@property (nonatomic, assign) long long lastingTime;

///BasicTrack的轨迹点数组
@property (nonatomic, strong) NSArray<AMapTrackPoint *> *points;

@end

NS_ASSUME_NONNULL_END
