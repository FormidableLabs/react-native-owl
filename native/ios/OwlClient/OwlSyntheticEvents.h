//
//  OwlSyntheticEvents.h
//  OwlDemo
//
//  Created by Rob Walker on 19/11/2021.
//


#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

/**
 *  Error codes for synthetic event injection failures.
 */
typedef NS_ENUM(NSInteger, GREYSyntheticEventInjectionErrorCode) {
  kGREYOrientationChangeFailedErrorCode = 0,  // Device orientation change has failed.
};

#pragma mark - Interface

/**
 *  Utility to deliver user actions such as touches, taps, gestures and device rotation to the
 *  application under test
 */
@interface OwlSyntheticEvents : NSObject

- (instancetype)init NS_UNAVAILABLE;
+ (instancetype)new NS_UNAVAILABLE;

+ (void)touchPath:(NSArray *)touchPath relativeToWindow:(UIWindow *)window holdDurationOnFirstTouch:(NSTimeInterval)firstHoldDuration holdDurationOnLastTouch:(NSTimeInterval)lastHoldDuration;

+ (void)touchAlongMultiplePaths:(NSArray *)touchPaths relativeToWindow:(UIWindow *)window holdDurationOnFirstTouch:(NSTimeInterval)firstHoldDuration holdDurationOnLastTouch:(NSTimeInterval)lastHoldDuration onTouchCallback:(nullable BOOL (^)(UITouchPhase))callback;

/**
 *  Begins interaction with a new touch starting at a specified point within a specified
 *  window's coordinates.
 *
 *  @param point     The point where the touch is to start.
 *  @param window    The window that contains the coordinates of the touch points.
 *  @param immediate If @c YES, this method blocks until touch is delivered, otherwise the touch is
 *                   enqueued for delivery the next time runloop drains.
 */
- (void)beginTouchAtPoint:(CGPoint)point relativeToWindow:(UIWindow *)window immediateDelivery:(BOOL)immediate;

/**
 *  Continues the current interaction by moving touch to a new point. Providing the same point
 *  in consecutive calls is intepreted as stationary touches. While delivering these touch points,
 *  they may be buffered and during delivery if there are multiple stale touch points that
 *  are time sensitive some of them may be dropped.
 *
 *  @param point      The point to move the touch to.
 *  @param immediate  If @c YES, this method blocks until touch is delivered, otherwise the touch is
 *                    enqueued for delivery the next time runloop drains.
 *  @param expendable @c YES indicates that this touch point is intended to be delivered in a timely
 *                    manner rather than reliably. Is ignored if @c NO.
 */
- (void)continueTouchAtPoint:(CGPoint)point immediateDelivery:(BOOL)immediate expendable:(BOOL)expendable;

/**
 *  Ends interaction started by GREYSyntheticEvents::beginTouchAtPoint:relativeToWindow.
 *  This method will block until all the touches since the beginning of the interaction have been
 *  delivered.
 */
- (void)endTouch;

@end

NS_ASSUME_NONNULL_END
