//
//  NSThread+OwlUtils.m
//  OwlClient
//
//  Created by Rob Walker on 23/11/2021.
//

#import "NSThread+OwlUtils.h"
//#import "DTXAddressInfo.h"

@implementation NSThread (OwlUtils)

+ (NSString*)dtx_demangledCallStackSymbols
{
    return [self dtx_demangledCallStackSymbolsForReturnAddresses:self.callStackReturnAddresses startIndex:1];
}

+ (NSString*)dtx_demangledCallStackSymbolsForReturnAddresses:(NSArray<NSNumber*>*)returnAddresses startIndex:(NSInteger)startIndex
{
//    NSArray* symbols = [returnAddresses dtx_mapObjectsUsingBlock:^id _Nonnull(NSNumber * _Nonnull obj, NSUInteger idx) {
//        return [[[DTXAddressInfo alloc] initWithAddress:obj.unsignedIntegerValue] formattedDescriptionForIndex:idx];
//    }];
//    return [NSString stringWithFormat:@"(\n\t%@\n)", [symbols componentsJoinedByString:@"\n\t"]];
    
    return @"";
}

@end
