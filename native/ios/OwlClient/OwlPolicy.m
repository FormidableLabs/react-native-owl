//
//  OwlPolicy.m
//  OwlClient
//
//  Created by Rob Walker on 23/11/2021.
//

#import "OwlPolicy.h"

@implementation OwlPolicy

+ (CGFloat)visibilityPixelAlphaThreshold {
    return 0.5;
}

+ (NSUInteger)defaultPercentThresholdForVisibility {
    return 75;
}

+ (NSUInteger)consecutiveTouchPointsWithSameContentOffsetThreshold {
    return 12;
}

+ (NSString*)percentDescriptionForValue:(CGFloat)value {
    static NSNumberFormatter* formatter;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        formatter = [NSNumberFormatter new];
        formatter.locale = [NSLocale localeWithLocaleIdentifier:@"en_US"];
        formatter.numberStyle = NSNumberFormatterPercentStyle;
    });
    
    return [formatter stringFromNumber:@(value)];
}

@end
