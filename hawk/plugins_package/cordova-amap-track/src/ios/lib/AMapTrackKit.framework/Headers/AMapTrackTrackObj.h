//
//  AMapTrackTrackObj.h
//  AMapTrackKit
//
//  Created by liubo on 2017/12/11.
//  Copyright © 2017年 Amap. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "AMapTrackCommonObj.h"

#pragma mark - AMapTrackAddTrackRequest

///增加Track请求
@interface AMapTrackAddTrackRequest : AMapTrackBaseRequest

///指定的Terminal的ID
@property (nonatomic, strong) NSString *terminalID;

@end

#pragma mark - AMapTrackAddTrackResponse

///增加Track请求返回
@interface AMapTrackAddTrackResponse : AMapTrackBaseResponse

///新增的Track的ID
@property (nonatomic, strong) NSString *trackID;

@end

#pragma mark - AMapTrackDeleteTrackRequest

///删除Track请求
@interface AMapTrackDeleteTrackRequest : AMapTrackBaseRequest

///指定的Terminal的ID
@property (nonatomic, strong) NSString *terminalID;

///要删除的Track的ID
@property (nonatomic, strong) NSString *trackID;

@end
