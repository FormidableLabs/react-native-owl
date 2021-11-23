//
//  UIScrollView+OwlActions.h
//  OwlClient
//
//  Created by Rob Walker on 23/11/2021.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface UIScrollView (OwlActions)

- (void)dtx_scrollToEdge:(UIRectEdge)edge NS_SWIFT_NAME(dtx_scroll(to:));
- (void)dtx_scrollWithOffset:(CGPoint)offset;
- (void)dtx_scrollWithOffset:(CGPoint)offset normalizedStartingPoint:(CGPoint)normalizedStartingPoint NS_SWIFT_NAME(dtx_scroll(withOffset:normalizedStartingPoint:));

@end

NS_ASSUME_NONNULL_END
