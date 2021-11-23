//
//  NSThread+OwlUtils.h
//  OwlClient
//
//  Created by Rob Walker on 23/11/2021.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface NSThread (OwlUtils)

@property (nonatomic, class, readonly, copy) NSString* dtx_demangledCallStackSymbols NS_SWIFT_NAME(demangledCallStackSymbols);

+ (NSString*)dtx_demangledCallStackSymbolsForReturnAddresses:(NSArray<NSNumber*>*)returnAddresses startIndex:(NSInteger)startIndex NS_SWIFT_NAME(demangledCallStackSymbols(forReturnAddresses:startIndex:));

@end

NS_ASSUME_NONNULL_END
