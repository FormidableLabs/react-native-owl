//
//  UITouch+OwlAdditions.h
//  OwlDemo
//
//  Created by Rob Walker on 19/11/2021.
//

#import <UIKit/UIKit.h>
#import <objc/runtime.h>

NS_ASSUME_NONNULL_BEGIN

@interface UITouch (OwlAdditions)

/**
 *  Creates a fake touch at @c point in window coordinates of the given @c window.
 *
 *  @param point  The location of this touch in window coordinates.
 *  @param window The reference window used for coordinates passed as @c point.
 *
 *  @return An initialized UITouch object
 */
- (id)initAtPoint:(CGPoint)point relativeToWindow:(UIWindow *)window;

@end

NS_ASSUME_NONNULL_END
