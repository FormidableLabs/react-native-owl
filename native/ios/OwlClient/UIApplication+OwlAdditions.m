//
//  UIApplication+OwlAdditions.m
//  OwlDemo
//
//  Created by Rob Walker on 19/11/2021.
//


#import "UIApplication+OwlAdditions.h"

@import ObjectiveC;
@import Darwin;

#import "OwlAppleInternals.h"

/**
 *  List for all the runloop modes that have been pushed and unpopped using UIApplication's push/pop
 *  runloop mode methods. The most recently pushed runloop mode is at the end of the list.
 */
static NSMutableArray *__runLoopModes;
static pthread_mutex_t __runLoopModesMutex;

@implementation UIApplication (OwlAdditions)

+ (void)load {
    @autoreleasepool {
        __runLoopModes = [[NSMutableArray alloc] init];
        
        pthread_mutexattr_t attr;
        pthread_mutexattr_init(&attr);
        pthread_mutexattr_settype(&attr, PTHREAD_MUTEX_RECURSIVE);
        
        pthread_mutex_init(&__runLoopModesMutex, &attr);
        
        [NSNotificationCenter.defaultCenter addObserverForName:@"_UIApplicationRunLoopModePushNotification" object:nil queue:nil usingBlock:^(NSNotification * _Nonnull note) {
            pthread_mutex_lock(&__runLoopModesMutex);
            [__runLoopModes addObject:note.userInfo[@"_UIApplicationRunLoopMode"]];
            pthread_mutex_unlock(&__runLoopModesMutex);
        }];
        
        [NSNotificationCenter.defaultCenter addObserverForName:@"_UIApplicationRunLoopModePopNotification" object:nil queue:nil usingBlock:^(NSNotification * _Nonnull note) {
            pthread_mutex_lock(&__runLoopModesMutex);
            NSCParameterAssert([__runLoopModes.lastObject isEqualToString:note.userInfo[@"_UIApplicationRunLoopMode"]]);
            [__runLoopModes removeLastObject];
            pthread_mutex_unlock(&__runLoopModesMutex);
        }];
        
        [self dtx_enableAccessibilityForSimulator];
    }
}

- (NSString *)dtx_activeRunLoopMode
{
    NSString* rv;
    pthread_mutex_lock(&__runLoopModesMutex);
    rv = [__runLoopModes lastObject];
    pthread_mutex_unlock(&__runLoopModesMutex);
    
    return rv;
}

+ (void)dtx_enableAccessibilityForSimulator
{
    NSLog(@"Enabling accessibility for automation on Simulator.");
    static NSString *path =
    @"/System/Library/PrivateFrameworks/AccessibilityUtilities.framework/AccessibilityUtilities";
    char const *const localPath = [path fileSystemRepresentation];
    
    dlopen(localPath, RTLD_LOCAL);
    
    Class AXBackBoardServerClass = NSClassFromString(@"AXBackBoardServer");
    id server = [AXBackBoardServerClass server];
    
    [server setAccessibilityPreferenceAsMobile:(CFStringRef)@"ApplicationAccessibilityEnabled"
                                         value:kCFBooleanTrue
                                  notification:(CFStringRef)@"com.apple.accessibility.cache.app.ax"];
    [server setAccessibilityPreferenceAsMobile:(CFStringRef)@"AccessibilityEnabled"
                                         value:kCFBooleanTrue
                                  notification:(CFStringRef)@"com.apple.accessibility.cache.ax"];
}

+ (CGFloat)dtx_panVelocity
{
    static CGFloat rv;
    
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        rv = 25;
    });
    
    return rv;
}

@end
