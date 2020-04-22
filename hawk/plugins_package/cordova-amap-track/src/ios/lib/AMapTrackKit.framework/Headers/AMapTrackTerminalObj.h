//
//  AMapTrackTerminalObj.h
//  AMapTrackKit
//
//  Created by liubo on 2017/8/17.
//  Copyright © 2017年 Amap. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "AMapTrackCommonObj.h"

#pragma mark - AMapTrackAddTerminalRequest

///增加Terminal请求
@interface AMapTrackAddTerminalRequest : AMapTrackBaseRequest

///增加的Terminal的name
@property (nonatomic, copy) NSString *terminalName;

///增加的Terminal的描述信息
@property (nonatomic, copy) NSString *terminalDesc;

@end

#pragma mark - AMapTrackAddTerminalResponse

///增加Terminal请求返回
@interface AMapTrackAddTerminalResponse : AMapTrackBaseResponse

///增加的Terminal所属的serviceID
@property (nonatomic, copy) NSString *serviceID;

///增加的Terminal的terminalID
@property (nonatomic, copy) NSString *terminalID;

///增加的Terminal的name
@property (nonatomic, copy) NSString *terminalName;

@end

#pragma mark - AMapTrackQueryTerminalRequest

///查询Terminal请求
@interface AMapTrackQueryTerminalRequest : AMapTrackBaseRequest

///要查询的Terminal的terminalID
@property (nonatomic, copy) NSString *terminalID;

///要查询的Terminal的name，如果填写了terminalID则以terminalID为准
@property (nonatomic, copy) NSString *terminalName;

@end

#pragma mark - AMapTrackQueryTerminalResponse

///查询Terminal请求返回
@interface AMapTrackQueryTerminalResponse : AMapTrackBaseResponse

///查询的Terminal结果
@property (nonatomic, strong) NSArray<AMapTrackTerminal *> *terminals;

@end
