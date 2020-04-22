#import <Cordova/CDVPlugin.h>


@interface AMapTrack : CDVPlugin {}

@property (retain, nonatomic) IBOutlet NSString *callback;

- (void) initConfig;

- (void)startTrackServer:(CDVInvokedUrlCommand*)command;

- (void)queryLatestPoint:(CDVInvokedUrlCommand*)command;

- (void)clearWatch:(CDVInvokedUrlCommand*)command;

- (void)queryHistoryTrack:(CDVInvokedUrlCommand*)command;

@end
