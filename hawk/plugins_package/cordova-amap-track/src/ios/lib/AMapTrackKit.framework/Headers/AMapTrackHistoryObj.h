//
//  AMapTrackHistoryObj.h
//  AMapTrackKit
//
//  Created by liubo on 2017/8/29.
//  Copyright © 2017年 Amap. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "AMapTrackCommonObj.h"

typedef NS_ENUM(NSUInteger, AMapTrackRecoupMode)
{
    AMapTrackRecoupModeNone             = 0,///< 用直线距离进行补点计算
    AMapTrackRecoupModeDriving          = 1,///< 用驾车策略进行补点计算
};

#pragma mark - AMapTrackQueryLastPointRequest

///终端位置查询
@interface AMapTrackQueryLastPointRequest : AMapTrackBaseRequest

///要查询的Terminal的ID
@property (nonatomic, copy) NSString *terminalID;

///要查询的Track的ID
@property (nonatomic, copy) NSString *trackID;

///是否进行轨迹纠偏,支持的参数如下(默认@"n"不纠偏): @"n":不纠偏; @"driving":驾车模式纠偏;
@property (nonatomic, copy) NSString *correctionMode;

@end

#pragma mark - AMapTrackQueryLastPointResponse

@interface AMapTrackQueryLastPointResponse : AMapTrackBaseResponse

///位置点
@property (nonatomic, strong) AMapTrackPoint *lastPoint;

@end

#pragma mark - AMapTrackQueryTrackDistanceRequest

///行驶距离查询
@interface AMapTrackQueryTrackDistanceRequest : AMapTrackBaseRequest

///要查询的Terminal的ID
@property (nonatomic, copy) NSString *terminalID;

///要查询的Track的ID
@property (nonatomic, copy) NSString *trackID;

///要查询的开始时间，单位毫秒
@property (nonatomic, assign) long long startTime;

///要查询的结束时间，单位毫秒。结束时间不能大于当前时间，且距离开始时间不能超过24小时。
@property (nonatomic, assign) long long endTime;

///是否进行轨迹纠偏,支持的参数如下(默认@"n"不纠偏): @"n":不纠偏; @"driving":驾车模式纠偏;
@property (nonatomic, copy) NSString *correctionMode;

///指定轨迹和里程的补充模式，默认为 AMapTrackRecoupModeNone 用直线距离进行补点计算
@property (nonatomic, assign) AMapTrackRecoupMode recoupMode;

///指定触发recoupMode参数生效的点间距，单位米，默认5000，有效值范围[50, 10000]
@property (nonatomic, assign) NSUInteger recoupGap;

@end

#pragma mark - AMapTrackQueryTrackDistanceResponse

///行驶距离查询返回
@interface AMapTrackQueryTrackDistanceResponse : AMapTrackBaseResponse

///行驶距离，单位米
@property (nonatomic, assign) NSUInteger distance;

@end

#pragma mark - AMapTrackQueryTrackHistoryAndDistanceRequest

///行驶轨迹和距离查询
@interface AMapTrackQueryTrackHistoryAndDistanceRequest : AMapTrackBaseRequest

///要查询的Terminal的ID
@property (nonatomic, copy) NSString *terminalID;

///要查询的开始时间，单位毫秒
@property (nonatomic, assign) long long startTime;

///要查询的结束时间，单位毫秒。结束时间不能大于当前时间，且距离开始时间不能超过24小时。
@property (nonatomic, assign) long long endTime;

///是否进行轨迹纠偏,支持的参数如下(默认@"n"不纠偏): @"n":不纠偏; @"driving":驾车模式纠偏;
@property (nonatomic, copy) NSString *correctionMode;

///指定轨迹和里程的补充模式，默认为 AMapTrackRecoupModeNone 用直线距离进行补点计算
@property (nonatomic, assign) AMapTrackRecoupMode recoupMode;

///指定触发recoupMode参数生效的点间距，单位米，默认5000，有效值范围[50, 10000]
@property (nonatomic, assign) NSUInteger recoupGap;

///排序规则，默认0: 0表示ASC(升序); 1表示DESC(降序);
@property (nonatomic, assign) int sortType;

///第几页数据，默认1
@property (nonatomic, assign) NSUInteger pageIndex;

///每页数据量，默认20，有效值范围[1, 1000)
@property (nonatomic, assign) NSUInteger pageSize;

@end

#pragma mark - AMapTrackQueryTrackHistoryAndDistanceResponse

///行驶轨迹和距离查询返回
@interface AMapTrackQueryTrackHistoryAndDistanceResponse : AMapTrackBaseResponse

///行驶距离，单位米
@property (nonatomic, assign) NSUInteger distance;

///符合要求点的个数
@property (nonatomic, assign) NSUInteger count;

///起点信息，仅在page=1的时候显示相关信息
@property (nonatomic, strong) AMapTrackPoint *startPoint;

///终点信息，仅在page=1的时候显示相关信息
@property (nonatomic, strong) AMapTrackPoint *endPoint;

///历史轨迹数据
@property (nonatomic, strong) NSArray<AMapTrackPoint *> *points;

@end

#pragma mark - AMapTrackQueryTrackInfoRequest

@interface AMapTrackQueryTrackInfoRequest : AMapTrackBaseRequest

///要查询的Terminal的ID
@property (nonatomic, copy) NSString *terminalID;

///要查询的Track的ID
@property (nonatomic, copy) NSString *trackID;

///要查询的开始时间，单位毫秒
@property (nonatomic, assign) long long startTime;

///要查询的结束时间，单位毫秒。结束时间不能大于当前时间，且距离开始时间不能超过24小时。
@property (nonatomic, assign) long long endTime;

///是否进行轨迹纠偏，默认为空@""不纠偏
@property (nonatomic, copy) NSString *correctionMode;

///指定轨迹和里程的补充模式，默认为 AMapTrackRecoupModeNone 用直线距离进行补点计算
@property (nonatomic, assign) AMapTrackRecoupMode recoupMode;

///指定触发recoupMode参数生效的点间距，单位米，默认5000，有效值范围[50, 10000]
@property (nonatomic, assign) NSUInteger recoupGap;

///是否返回track的轨迹点信息，默认YES
@property (nonatomic, assign) BOOL containPoints;

///第几页数据，默认1
@property (nonatomic, assign) NSUInteger pageIndex;

///每页数据量，默认20，有效值范围[1, 1000)
@property (nonatomic, assign) NSUInteger pageSize;

@end

#pragma mark - AMapTrackQueryTrackInfoResponse

@interface AMapTrackQueryTrackInfoResponse : AMapTrackBaseResponse

///轨迹数据
@property (nonatomic, strong) NSArray<AMapTrackBasicTrack *> *tracks;

@end
