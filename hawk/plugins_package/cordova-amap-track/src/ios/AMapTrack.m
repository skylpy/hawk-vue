#import "AMapTrack.h"
#import <AMapFoundationKit/AMapFoundationKit.h>
#import <AMapTrackKit/AMapTrackKit.h>

@interface AMapTrack ()<AMapTrackManagerDelegate>
{
    UISegmentedControl *_trackIDSegment;
    
    BOOL _serviceStarted;
    BOOL _gatherStarted;
    BOOL _createTrackID;
    
    NSString *_serviceId;
    NSString *_terminalName;
    NSString *_terminalId;
    NSString *_traceId;
    CDVInvokedUrlCommand *queryLatestPointCommand;
    CDVInvokedUrlCommand *startTrackServerCommand;
    CDVInvokedUrlCommand *queryHistoryTrackCommand;
    
}

@property (nonatomic, strong) AMapTrackManager *trackManager;

@end

@implementation AMapTrack

//init Config
-(void) initConfig{
    //set APIKey
    NSDictionary* infoDict = [[NSBundle mainBundle] infoDictionary];
    NSString* appKey = [infoDict objectForKey:@"AMapAppKey"];
    [AMapServices sharedServices].apiKey = appKey;
}
// 查询终端实时位置
- (void)queryLatestPoint:(CDVInvokedUrlCommand*)command
{
    [self initConfig];
    queryLatestPointCommand = command;
    
    AMapTrackQueryLastPointRequest *request = [[AMapTrackQueryLastPointRequest alloc] init];
    request.serviceID = self.trackManager.serviceID;
    request.terminalID = self.trackManager.terminalID;
    [self.trackManager AMapTrackQueryLastPoint:request];
    
}

- (void)startTrackServer:(CDVInvokedUrlCommand*)command
{
    [self initConfig];
    startTrackServerCommand = command;
    AMapTrackManagerOptions *option = [[AMapTrackManagerOptions alloc] init];
    
    _serviceId = [NSString stringWithFormat: @"%@", [command.arguments objectAtIndex:0]];
    _terminalName = [command.arguments objectAtIndex:1];
    _terminalId = [NSString stringWithFormat: @"%@", [command.arguments objectAtIndex:2]];
    _traceId = [NSString stringWithFormat: @"%@", [command.arguments objectAtIndex:3]];
    
    option.serviceID = _serviceId; //Service ID 需要根据需要进行修改
    
    
    // 初始化AMapTrackManager
    self.trackManager = [[AMapTrackManager alloc] initWithOptions:option];
    self.trackManager.delegate = self;
    // 配置定位属性
    [self.trackManager setAllowsBackgroundLocationUpdates:YES];
    [self.trackManager setPausesLocationUpdatesAutomatically:NO];
    [self.trackManager changeGatherAndPackTimeInterval:5 packTimeInterval:30];
    [self.trackManager setLocalCacheMaxSize: 50];
    //查询终端是否存在
    [self queryTerminal];
    
}

- (void)queryHistoryTrack:(CDVInvokedUrlCommand*)command
{
    [self initConfig];
    queryHistoryTrackCommand = command;
}

- (void)clearWatch:(CDVInvokedUrlCommand*)command
{
    [self initConfig];
    CDVPluginResult* result = [CDVPluginResult resultWithStatus: CDVCommandStatus_OK];
    [[self commandDelegate] sendPluginResult:result callbackId: command.callbackId];
}

//查询终端是否存在
- (void)queryTerminal
{
    AMapTrackQueryTerminalRequest *request = [[AMapTrackQueryTerminalRequest alloc] init];
    request.serviceID = self.trackManager.serviceID;
    request.terminalName = _terminalName;
    [self.trackManager AMapTrackQueryTerminal:request];
}

//查询终端结果
- (void)onQueryTerminalDone:(AMapTrackQueryTerminalRequest *)request response:(AMapTrackQueryTerminalResponse *)response
{
    //查询成功
    if ([[response terminals] count] > 0) {
        //查询到结果，使用 Terminal ID
        _terminalId = [[[response terminals] firstObject] tid];
        
        //启动上报服务(service id)，参考下一步
        [self startService];
    }
    else {
        //查询结果为空，创建新的terminal
        AMapTrackAddTerminalRequest *addRequest = [[AMapTrackAddTerminalRequest alloc] init];
        addRequest.serviceID = self.trackManager.serviceID;
        addRequest.terminalName = _terminalName;
        [self.trackManager AMapTrackAddTerminal:addRequest];
    }
}

//创建终端结果
- (void)onAddTerminalDone:(AMapTrackAddTerminalRequest *)request response:(AMapTrackAddTerminalResponse *)response
{
    //创建terminal成功
    _terminalId = [response terminalID];
    
    //启动上报服务(service id)，参考下一步
    [self startService];
}

//开始服务
- (void)startService
{
    AMapTrackManagerServiceOption *serviceOption = [[AMapTrackManagerServiceOption alloc] init];
    serviceOption.terminalID = _terminalId;//Terminal ID 需要根据需要进行修改
    
    [self.trackManager startServiceWithOptions:serviceOption];
}
//service 开启结果回调
- (void)onStartService:(AMapTrackErrorCode)errorCode
{
    if (errorCode == AMapTrackErrorOK)
    {
        // 开始服务成功
        if (!_traceId || ![_traceId isEqualToString:@"0"]) {
            // 开启收集上报到指定traceId,
            [self startGatherAndPack];
        } else {
            [self addTrack];
        }
    } else {
        //开始服务失败
    }
}
// 开启收集上报到
- (void)startGatherAndPack
{
    self.trackManager.trackID = _traceId;
    [self.trackManager startGatherAndPack];
}
//gather 开启结果回调
- (void)onStartGatherAndPack:(AMapTrackErrorCode)errorCode
{
    if (errorCode == AMapTrackErrorOK) {
        //开始采集成功
        NSDictionary *data = @{@"serviceId": _serviceId,
                               @"terminalName": _terminalName,
                               @"terminalId": _terminalId,
                               @"traceId": _traceId};
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:data];
        [self.commandDelegate sendPluginResult:pluginResult callbackId: startTrackServerCommand.callbackId];
    } else {
        //开始采集失败
    }
}
//创建轨迹
- (void)addTrack
{
    AMapTrackAddTrackRequest *request = [[AMapTrackAddTrackRequest alloc] init];
    request.serviceID = self.trackManager.serviceID;
    request.terminalID = self.trackManager.terminalID;
    [self.trackManager AMapTrackAddTrack:request];
}
- (void)onAddTrackDone:(AMapTrackAddTrackRequest *)request response:(AMapTrackAddTrackResponse *)response
{
    //创建轨迹成功，开始采集
    _traceId = response.trackID;
    // 开启收集上报到
    [self startGatherAndPack];
}

//查询终端实时位置
- (void)onQueryLastPointDone:(AMapTrackQueryLastPointRequest *)request response:(AMapTrackQueryLastPointResponse *)response
{
    //查询成功
    NSLog(@"onQueryLastPointDone%@", response.formattedDescription);
    
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString: response.formattedDescription];
    [self.commandDelegate sendPluginResult:pluginResult callbackId: queryLatestPointCommand.callbackId];
    
}

//错误回调
- (void)didFailWithError:(NSError *)error associatedRequest:(id)request
{
    if ([request isKindOfClass:[AMapTrackAddTrackRequest class]]) {
        //创建轨迹失败
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"创建轨迹失败"];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:queryLatestPointCommand.callbackId];
    }
    
    if ([request isKindOfClass:[AMapTrackQueryTerminalRequest class]]) {
        //查询参数错误
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"查询参数错误"];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:queryLatestPointCommand.callbackId];
    }
    
    if ([request isKindOfClass:[AMapTrackAddTerminalRequest class]]) {
        //创建terminal失败
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"创建terminal失败"];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:queryLatestPointCommand.callbackId];
    }
    
    if ([request isKindOfClass:[AMapTrackQueryLastPointRequest class]]) {
        //查询失败
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"查询失败"];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:queryLatestPointCommand.callbackId];
    }
}
@end
