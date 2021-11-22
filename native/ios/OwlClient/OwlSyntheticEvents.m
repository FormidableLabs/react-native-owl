//
//  OwlSyntheticEvents.m
//  OwlDemo
//
//  Created by Rob Walker on 19/11/2021.
//


#import "OwlSyntheticEvents.h"

#import "OwlAppleInternals.h"
#import "OwlTouchInjector.h"
#import "UIApplication+OwlAdditions.h"

#pragma mark - Implementation

@implementation OwlSyntheticEvents
{
  /**
   *  The touch injector that completes the touch sequence for an event.
   */
  OwlTouchInjector *_touchInjector;
  
  /**
   *  The last injected touch point.
   */
  NSValue *_lastInjectedTouchPoint;
  
  BOOL (^_onTouchCallback)(UITouchPhase);
}

- (instancetype)initWithOnTouchCallback:(nullable BOOL (^)(UITouchPhase))onTouchCallback
{
  self = [super init];
  if(self)
  {
    _onTouchCallback = onTouchCallback;
  }
  
  return self;
}

+ (void)touchPath:(NSArray *)touchPath relativeToWindow:(UIWindow *)window holdDurationOnFirstTouch:(NSTimeInterval)firstHoldDuration holdDurationOnLastTouch:(NSTimeInterval)lastHoldDuration
{    
  [self touchAlongMultiplePaths:@[touchPath] relativeToWindow:window holdDurationOnFirstTouch:firstHoldDuration holdDurationOnLastTouch:lastHoldDuration onTouchCallback:nil];
}

+ (void)touchAlongMultiplePaths:(NSArray *)touchPaths relativeToWindow:(UIWindow *)window holdDurationOnFirstTouch:(NSTimeInterval)firstHoldDuration holdDurationOnLastTouch:(NSTimeInterval)lastHoldDuration onTouchCallback:(BOOL (^)(UITouchPhase))callback
{
  NSParameterAssert(touchPaths.count >= 1);
  NSParameterAssert(firstHoldDuration >= 0);
  NSParameterAssert(lastHoldDuration >= 0);
  
  NSUInteger firstTouchPathSize = [touchPaths[0] count];
  OwlSyntheticEvents *eventGenerator = [[OwlSyntheticEvents alloc] initWithOnTouchCallback:callback];
  
  // Inject "begin" event for the first points of each path.
  [eventGenerator owl_beginTouchesAtPoints:[self owl_objectsAtIndex:0 ofArrays:touchPaths] relativeToWindow:window immediateDelivery:NO];
  
  // If the paths have a single point, then just inject an "end" event with the delay being the
  // 'lastHoldDuration' provided
  if(firstTouchPathSize == 1)
  {
    [eventGenerator owl_endTouchesAtPoints:[self owl_objectsAtIndex:firstTouchPathSize - 1 ofArrays:touchPaths] timeElapsedSinceLastTouchDelivery:lastHoldDuration];
  }
  else
  {
    // Inject the first "continue touch" after holding duration at the same point the initial touch began
    // Apply 'firstHoldDuration'
    [eventGenerator owl_continueTouchAtPoints:[self owl_objectsAtIndex:0 ofArrays:touchPaths] afterTimeElapsedSinceLastTouchDelivery:firstHoldDuration immediateDelivery:NO expendable:NO];
    
    for(NSUInteger i = 1; i < firstTouchPathSize; i++)
    {
      [eventGenerator owl_continueTouchAtPoints:[self owl_objectsAtIndex:i ofArrays:touchPaths] afterTimeElapsedSinceLastTouchDelivery:i == firstTouchPathSize - 1 ? lastHoldDuration : 0 immediateDelivery:NO expendable:NO];
    }
    
    [eventGenerator owl_endTouchesAtPoints:[self owl_objectsAtIndex:firstTouchPathSize - 1 ofArrays:touchPaths] timeElapsedSinceLastTouchDelivery:0];
  }
}

- (void)beginTouchAtPoint:(CGPoint)point relativeToWindow:(UIWindow *)window immediateDelivery:(BOOL)immediate
{
  _lastInjectedTouchPoint = [NSValue valueWithCGPoint:point];
  [self owl_beginTouchesAtPoints:@[_lastInjectedTouchPoint] relativeToWindow:window immediateDelivery:immediate];
}

- (void)continueTouchAtPoint:(CGPoint)point immediateDelivery:(BOOL)immediate expendable:(BOOL)expendable
{
  _lastInjectedTouchPoint = [NSValue valueWithCGPoint:point];
  [self owl_continueTouchAtPoints:@[_lastInjectedTouchPoint] afterTimeElapsedSinceLastTouchDelivery:0 immediateDelivery:immediate expendable:expendable];
}

- (void)endTouch
{
  [self owl_endTouchesAtPoints:@[_lastInjectedTouchPoint] timeElapsedSinceLastTouchDelivery:0];
}

#pragma mark - Private

// Given an array containing multiple arrays, returns an array with the index'th element of each
// array.
+ (NSArray *)owl_objectsAtIndex:(NSUInteger)index ofArrays:(NSArray *)arrayOfArrays
{
  NSAssert(arrayOfArrays.count > 0, @"arrayOfArrays must contain at least one element.");
  NSUInteger firstArraySize = [arrayOfArrays[0] count];
  NSAssert(index < firstArraySize, @"index must be smaller than the size of the arrays.");
  
  NSMutableArray *output = [[NSMutableArray alloc] initWithCapacity:[arrayOfArrays count]];
  for(NSArray *array in arrayOfArrays)
  {
    NSAssert(array.count == firstArraySize, @"All arrays must be of the same size.");
    [output addObject:array[index]];
  }
  
  return output;
}

/**
 *  Begins interaction with new touches starting at multiple @c points. Touch will be delivered to
 *  the hit test view in @c window under point and will not end until @c endTouch is called.
 *
 *  @param points    Multiple points where touches should start.
 *  @param window    The window that contains the coordinates of the touch points.
 *  @param immediate If @c YES, this method blocks until touch is delivered, otherwise the touch is
 *                   enqueued for delivery the next time runloop drains.
 */
- (void)owl_beginTouchesAtPoints:(NSArray *)points relativeToWindow:(UIWindow *)window immediateDelivery:(BOOL)immediate
{
  NSAssert(_touchInjector == nil, @"Cannot call this method more than once until endTouch is called.");
  _touchInjector = [[OwlTouchInjector alloc] initWithWindow:window onTouchInectCallback:_onTouchCallback];
  OwlTouchInfo *touchInfo = [[OwlTouchInfo alloc] initWithPoints:points phase:OwlTouchInfoPhaseTouchBegan deliveryTimeDeltaSinceLastTouch:0 expendable:NO];
  [_touchInjector enqueueTouchInfoForDelivery:touchInfo];
  
  if(immediate == YES)
  {
    [_touchInjector waitUntilAllTouchesAreDeliveredUsingInjector];
  }
}

/**
 *  Enqueues the next touch to be delivered.
 *
 *  @param points     Multiple points at which the touches are to be made.
 *  @param seconds    An interval to wait after the every last touch event.
 *  @param immediate  If @c YES, this method blocks until touches are delivered, otherwise it is
 *                    enqueued for delivery the next time runloop drains.
 *  @param expendable Indicates that this touch point is intended to be delivered in a timely
 *                    manner rather than reliably.
 */
- (void)owl_continueTouchAtPoints:(NSArray *)points afterTimeElapsedSinceLastTouchDelivery:(NSTimeInterval)seconds immediateDelivery:(BOOL)immediate expendable:(BOOL)expendable {
  OwlTouchInfo *touchInfo = [[OwlTouchInfo alloc] initWithPoints:points phase:OwlTouchInfoPhaseTouchMoved deliveryTimeDeltaSinceLastTouch:seconds expendable:expendable];
  [_touchInjector enqueueTouchInfoForDelivery:touchInfo];
  
  if(immediate == YES)
  {
    [_touchInjector waitUntilAllTouchesAreDeliveredUsingInjector];
  }
}

/**
 *  Enqueues the final touch in a touch sequence to be delivered.
 *
 *  @param points  Multiple points at which the touches are to be made.
 *  @param seconds An interval to wait after the every last touch event.
 */
- (void)owl_endTouchesAtPoints:(NSArray *)points timeElapsedSinceLastTouchDelivery:(NSTimeInterval)seconds {
  OwlTouchInfo *touchInfo = [[OwlTouchInfo alloc] initWithPoints:points phase:OwlTouchInfoPhaseTouchEnded deliveryTimeDeltaSinceLastTouch:seconds expendable:NO];
  
  [_touchInjector enqueueTouchInfoForDelivery:touchInfo];
  [_touchInjector waitUntilAllTouchesAreDeliveredUsingInjector];
  
  _touchInjector = nil;
}

@end
