//
//  ReactNativeSupport.h
//  OwlClient
//
//  Created by Rob Walker on 24/11/2021.
//

#import <Foundation/Foundation.h>

@interface ReactNativeSupport : NSObject

+ (void)reloadApp;
+ (void)waitForReactNativeLoadWithCompletionHandler:(void(^)(void))handler;

@end

