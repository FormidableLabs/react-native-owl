//
//  UIWindow+OwlUtils.h
//  OwlClient
//
//  Created by Rob Walker on 23/11/2021.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface UIWindowScene (OwlUtils)

- (NSString*)dtx_recursiveDescription;

@end

@interface UIWindow (OwlUtils)

@property (nonatomic, strong, class, readonly, nullable) UIWindow* dtx_keyWindow NS_SWIFT_NAME(dtx_keyWindow);
@property (nonatomic, strong, class, readonly) NSArray<UIWindow*>* dtx_allKeyWindowSceneWindows;

+ (id _Nullable)dtx_keyWindowScene;
+ (NSArray<UIWindow*>*)dtx_allWindows;
+ (NSArray<UIWindow*>*)dtx_allWindowsForScene:(nullable UIWindowScene*)scene;
+ (void)dtx_enumerateAllWindowsUsingBlock:(void (NS_NOESCAPE ^)(UIWindow* obj, NSUInteger idx, BOOL *stop))block;
+ (void)dtx_enumerateKeyWindowSceneWindowsUsingBlock:(void (NS_NOESCAPE ^)(UIWindow* obj, NSUInteger idx, BOOL *stop))block;
+ (void)dtx_enumerateWindowsInScene:(nullable UIWindowScene*)scene usingBlock:(void (NS_NOESCAPE ^)(UIWindow* obj, NSUInteger idx, BOOL *stop))block;

@end

NS_ASSUME_NONNULL_END
