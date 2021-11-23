//
//  OwlPolicy.h
//  OwlClient
//
//  Created by Rob Walker on 23/11/2021.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface OwlPolicy : NSObject

@property (class, nonatomic, readonly) CGFloat visibilityPixelAlphaThreshold;
@property (class, nonatomic, readonly) NSUInteger defaultPercentThresholdForVisibility;
@property (class, nonatomic, readonly) NSUInteger consecutiveTouchPointsWithSameContentOffsetThreshold;

+ (NSString*)percentDescriptionForValue:(CGFloat)value;

@end

NS_ASSUME_NONNULL_END
