//
//  UIApplication+OwlAdditions.h
//  OwlDemo
//
//  Created by Rob Walker on 19/11/2021.
//


#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

/**
 *  EarlGrey specific additions for tracking runloop mode changes and user interaction events.
 */
@interface UIApplication (OwlAdditions)

/**
 * @return Active mode for the main runloop that was pushed by one of the push runloop methods.
 *         May return @c nil when no mode was pushed.
 */
- (NSString *_Nullable)dtx_activeRunLoopMode;

+ (CGFloat)dtx_panVelocity;

@end

NS_ASSUME_NONNULL_END
