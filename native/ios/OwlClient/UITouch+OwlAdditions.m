//
//  UITouch+OwlAdditions.m
//  OwlDemo
//
//  Created by Rob Walker on 19/11/2021.
//

#import "UITouch+OwlAdditions.h"

#import "OwlAppleInternals.h"

@implementation UITouch (OwlAdditions)

- (id)initAtPoint:(CGPoint)point relativeToWindow:(UIWindow *)window
{
  NSParameterAssert(window != nil);
  
  self = [super init];
  if (self)
  {
    [self setTapCount:1];
    [self setPhase:UITouchPhaseBegan];
    [self setWindow:window];
    [self _setLocationInWindow:point resetPrevious:YES];
    [self setView:[window hitTest:point withEvent:nil]];
    [self setTimestamp:[[NSProcessInfo processInfo] systemUptime]];
    
    if(@available(iOS 14.0, *))
    {
      [self _setIsTapToClick:YES];
      
      // We modify the touchFlags ivar struct directly.
      // First entry is _firstTouchForView
      Ivar flagsIvar = class_getInstanceVariable(object_getClass(self), "_touchFlags");
      ptrdiff_t touchFlagsOffset = ivar_getOffset(flagsIvar);
      char *flags = (__bridge void *)self + touchFlagsOffset;
      *flags = *flags | (char)0x01;
    }
    else
    {
      [self setIsTap:YES];
      [self _setIsFirstTouchForView:YES];
    }
  }
  return self;
}

@end
