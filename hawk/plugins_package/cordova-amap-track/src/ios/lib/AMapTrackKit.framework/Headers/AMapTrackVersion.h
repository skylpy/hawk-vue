//
//  AMapTrackVersion.h
//  AMapTrackKit
//
//  Created by liubo on 2017/8/15.
//  Copyright © 2017年 Amap. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <AMapFoundationKit/AMapFoundationVersion.h>
#import <AMapLocationKit/AMapLocationVersion.h>

#ifndef AMapTrackVersion_h
#define AMapTrackVersion_h

#define AMapTrackVersionNumber                  10100
#define AMapTrackFoundationVersionMinRequired   10400
#define AMapTrackLocationVersionMinRequired     20500

// 依赖库AMapFoundationKit版本检测
#if AMapFoundationVersionNumber < AMapTrackFoundationVersionMinRequired
#error "The AMapFoundationKit version is less than minimum required, please update! Any questions please to visit http://lbs.amap.com"
#endif

// 依赖库AMapLocationKit版本检测
#if AMapLocationVersionNumber < AMapTrackLocationVersionMinRequired
#error "The AMapLocationKit version is less than minimum required, please update! Any questions please to visit http://lbs.amap.com"
#endif

FOUNDATION_EXTERN NSString * const AMapTrackVersion;
FOUNDATION_EXTERN NSString * const AMapTrackName;

#endif /* AMapTrackVersion_h */
