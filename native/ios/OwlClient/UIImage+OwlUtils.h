//
//  UIImage+OwlUtils.h
//  OwlClient
//
//  Created by Rob Walker on 23/11/2021.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface UIImage (OwlUtils)

- (UIImage*)dtx_imageByCroppingInRect:(CGRect)rect;
- (NSUInteger)dtx_numberOfVisiblePixelsWithAlphaThreshold:(CGFloat)threshold totalPixels:(NSUInteger*)totalPixels;

- (void)dtx_saveToPath:(NSURL*)path fileName:(NSString*)name;

@end

NS_ASSUME_NONNULL_END
