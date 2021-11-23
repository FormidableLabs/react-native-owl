//
//  NSURL+OwlUtils.m
//  OwlClient
//
//  Created by Rob Walker on 23/11/2021.
//

#import "NSURL+OwlUtils.h"

@implementation NSURL (OwlUtils)

+ (NSURL *)temporaryPath:(NSString *)subFolder
{
    static NSURL* temporaryURL;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        temporaryURL = [NSURL URLWithString:NSTemporaryDirectory()];
    });
    
    NSURL* directoryPath = [temporaryURL URLByAppendingPathComponent:subFolder isDirectory:true];
    NSError * error = nil;
    [[NSFileManager defaultManager] createDirectoryAtPath:directoryPath.path
                              withIntermediateDirectories:YES
                                               attributes:nil
                                                    error:&error];
    if (error != nil) {
        NSLog(@"Error creating %@ directory under tmp directory: %@", subFolder, error);
    }
    
    return directoryPath;
}

+ (NSURL *)visibilityFailingScreenshotsPath
{
    return [self temporaryPath:@"visibilityFailingScreenshots"];
}

+ (NSURL *)visibilityFailingRectsPath
{
    return [self temporaryPath:@"visibilityFailingRects"];
}

+ (NSURL *)elementsScreenshotPath
{
    return [self temporaryPath:@"elementsScreenshot"];
}

@end
