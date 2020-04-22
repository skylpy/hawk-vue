//
//  AMapTrackManagerOptions.h
//  AMapTrackKit
//
//  Created by liubo on 2017/8/17.
//  Copyright © 2017年 Amap. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface AMapTrackManagerOptions : NSObject

///指定的serviceID
@property (nonatomic, copy) NSString *serviceID;

@end

@interface AMapTrackManagerServiceOption : NSObject

///指定的terminalID
@property (nonatomic, copy) NSString *terminalID;

@end

NS_ASSUME_NONNULL_END
