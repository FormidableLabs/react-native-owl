//
//  NSURL+OwlUtils.h
//  OwlClient
//
//  Created by Rob Walker on 23/11/2021.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface NSURL (OwlUtils)

+ (NSURL*)temporaryPath:(NSString *)subFolder;
+ (NSURL*)visibilityFailingScreenshotsPath;
+ (NSURL*)visibilityFailingRectsPath;
+ (NSURL*)elementsScreenshotPath;

@end

NS_ASSUME_NONNULL_END
