//
//  OwlTouchInfo.m
//  OwlDemo
//
//  Created by Rob Walker on 19/11/2021.
//


#import "OwlTouchInfo-Private.h"

@implementation OwlTouchInfo

- (instancetype)initWithPoints:(NSArray *)points phase:(OwlTouchInfoPhase)phase deliveryTimeDeltaSinceLastTouch:(NSTimeInterval)timeDeltaSinceLastTouchSeconds expendable:(BOOL)expendable
{
  self = [super init];
  if (self)
  {
    _points = points;
    _phase = phase;
    _deliveryTimeDeltaSinceLastTouch = timeDeltaSinceLastTouchSeconds;
    _expendable = expendable;
  }
  return self;
}

- (NSTimeInterval)fireMediaTime
{
  return _enqueuedMediaTime + _deliveryTimeDeltaSinceLastTouch;
}

@end
