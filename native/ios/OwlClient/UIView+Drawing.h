//
//  UIView+Drawing.h
//  OwlClient
//
//  Created by Rob Walker on 23/11/2021.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface UIView (Drawing)

- (void)dtx_drawViewHierarchyUpToSubview:(nullable UIView*)subview inRect:(CGRect)rect afterScreenUpdates:(BOOL)afterUpdates;

@end

NS_ASSUME_NONNULL_END

