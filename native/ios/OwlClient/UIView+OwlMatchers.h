//
//  UIView+OwlMatchers.h
//  OwlClient
//
//  Created by Rob Walker on 23/11/2021.
//


#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface UIView (OwlMatchers)

+ (NSMutableArray<UIView*>*)dtx_findViewsInAllWindowsPassingPredicate:(NSPredicate*)predicate;
+ (NSMutableArray<UIView*>*)dtx_findViewsInKeySceneWindowsPassingPredicate:(NSPredicate*)predicate;
+ (NSMutableArray<UIView*>*)dtx_findViewsInWindows:(NSArray<UIWindow*>*)windows passingPredicate:(NSPredicate*)predicate;
+ (NSMutableArray<UIView*>*)dtx_findViewsInHierarchy:(id)hierarchy passingPredicate:(NSPredicate*)predicate;
+ (NSMutableArray<UIView*>*)dtx_findViewsInHierarchy:(id)hierarchy includingRoot:(BOOL)includingRoot passingPredicate:(NSPredicate*)predicate;

@end

NS_ASSUME_NONNULL_END
