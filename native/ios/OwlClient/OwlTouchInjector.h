//
//  OwlTouchInjector.h
//  OwlDemo
//
//  Created by Rob Walker on 19/11/2021.
//


#import <Foundation/Foundation.h>

#import "OwlTouchInfo.h"

/**
 *  State for touch injector.
 */
typedef NS_ENUM(NSInteger, OwlTouchInjectorState) {
  /**
   *  Touch injection hasn't started yet.
   */
  kOwlTouchInjectorPendingStart,
  /**
   *  Injection has started injecting touches.
   */
  kOwlTouchInjectorStarted,
  /**
   *  Touch injection has stopped. This state is reached when injector has
   *  finished injecting all the queued touches.
   */
  kOwlTouchInjectorStopped,
};

NS_ASSUME_NONNULL_BEGIN

/**
 *  A touch injector that delivers a complete touch sequence for single finger interactions.
 *  Buffers all touch events until @c startInjecting: is called.
 *  Once injection is complete, this injector should be discarded.
 */
@interface OwlTouchInjector : NSObject
/**
 *  @remark init is not an available initializer. Use the other initializers.
 */
- (instancetype)init NS_UNAVAILABLE;

/**
 *  Initializes with the @c window to which touches will be delivered.
 *
 *  @param window The window that receives the touches.
 *  @param callback An optional callback to be invoked upon every touch injection.
 *
 *  @return An instance of GREYSingleSequenceTouchInjector, initialized with the window to be
 *          touched.
 */
- (instancetype)initWithWindow:(UIWindow *)window onTouchInectCallback:(nullable BOOL(^)(UITouchPhase))callback NS_DESIGNATED_INITIALIZER;

/**
 *  Enqueues @c touchInfo that will be materialized into a UITouch and delivered to application.
 *
 *  @param touchInfo The info that is used to create the UITouch. If it represents a last touch
 *                   in a sequence, the specified @c point value is ignored and injector
 *                   automatically picks the previous point where touch occurred to deliver
 *                   the last touch.
 */
- (void)enqueueTouchInfoForDelivery:(OwlTouchInfo *)touchInfo;

/**
 *  @return The state of this injector.
 */
- (OwlTouchInjectorState)state;

/**
 *  Starts delivering touches to current application.
 */
- (void)startInjecting;

/**
 *  Wait until the touch injection has stopped.
 */
- (void)waitUntilAllTouchesAreDeliveredUsingInjector;

@end

NS_ASSUME_NONNULL_END
