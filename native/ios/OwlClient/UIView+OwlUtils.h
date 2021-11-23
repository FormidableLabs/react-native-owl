//
//  UIView+OwlUtils.h
//  OwlClient
//
//  Created by Rob Walker on 23/11/2021.
//

#import <UIKit/UIKit.h>
#import <NSObject+OwlUtils.h>

NS_ASSUME_NONNULL_BEGIN

@interface UIView (OwlUtils)

@property (nonatomic, readonly, weak) UIViewController* dtx_containingViewController;
- (UIImage*)dtx_imageFromView;

@end

NS_ASSUME_NONNULL_END
