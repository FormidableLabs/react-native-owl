//
//  DTXAssertionHandler.m
//  OwlClient
//
//  Created by Rob Walker on 23/11/2021.
//

#import "DTXAssertionHandler.h"
#import "OwlAppleInternals.h"

@implementation DTXTestAssertionException

+ (NSException *)exceptionWithReason:(nullable NSString *)reason userInfo:(nullable NSDictionary *)userInfo viewDescription:(nullable NSDictionary*)viewDescription
{
    DTXTestAssertionException* rv = (id)[super exceptionWithName:@"DetoxException" reason:reason userInfo:userInfo];
    rv.viewDescription = viewDescription;
    return rv;
}

@end

BOOL dtx_try(void (^block)(void), NSError * __nullable * __null_unspecified error)
{
    return [DTXAssertionHandler try:^ {
        block();
    } error:error];
}

@implementation DTXAssertionHandler

+ (NSError*)_errorForTestAssertionException:(DTXTestAssertionException*)exception
{
    NSMutableDictionary* userInfo = @{NSLocalizedDescriptionKey: exception.reason, @"DetoxFailureInformation": exception.userInfo}.mutableCopy;
    
    if(exception.viewDescription != nil)
    {
        [userInfo addEntriesFromDictionary:exception.viewDescription];
    }
    
    return [NSError errorWithDomain:@"DetoxErrorDomain" code:0 userInfo:userInfo];
}

#if DEBUG
static void __detox_nested_try(void)
{
    
}
#endif

#if DEBUG
static __thread BOOL __DTXTrying = NO;
#endif

+ (BOOL)try:(void(NS_NOESCAPE ^)(void))block error:(NSError * __nullable * __null_unspecified)error
{
#if DEBUG
    if(__DTXTrying == YES)
    {
        __detox_nested_try();
    }
    
    __DTXTrying = YES;
//    dtx_defer {
//        __DTXTrying = NO;
//    };
#endif
    
    @try
    {
        block();
    }
    @catch(DTXTestAssertionException *exception)
    {
        if(error)
        {
            *error = [self _errorForTestAssertionException:exception];
        }
        
        return NO;
    }
    //Only catch DTXTestAssertionException here. Others should be handled by the system.
    @catch(NSException* exception)
    {
        [exception raise];
    }
    
    return YES;
}

+ (void)handleFailureInFunction:(NSString *)functionName file:(NSString *)fileName lineNumber:(NSInteger)line viewDescription:(NSDictionary<NSString*, id>*)viewDescription description:(NSString *)format, ...
{
    va_list argumentList;
    va_start(argumentList, format);
    [self handleFailureInFunction:functionName file:fileName lineNumber:line viewDescription:viewDescription description:format arguments:argumentList];
    va_end(argumentList);
    
}

+ (void)handleFailureInMethod:(SEL)selector object:(id)object file:(NSString *)fileName lineNumber:(NSInteger)line viewDescription:(NSDictionary<NSString*, id>*)viewDescription description:(NSString *)format, ...
{
    va_list argumentList;
    va_start(argumentList, format);
    [self handleFailureInMethod:selector object:object file:fileName lineNumber:line viewDescription:viewDescription description:format arguments:argumentList];
    va_end(argumentList);
}

+ (DTXTestAssertionException*)_exceptionForFailureInFunction:(NSString *)functionName file:(NSString *)fileName lineNumber:(NSInteger)line viewDescription:(nullable NSDictionary<NSString*, id>*)viewDescription description:(NSString *)format arguments:(va_list)arguments
{
    return (id)[DTXTestAssertionException exceptionWithReason:[[NSString alloc] initWithFormat:format arguments:arguments] userInfo:@{
        @"functionName": functionName,
        @"file": fileName,
        @"lineNumber": @(line)
    } viewDescription:viewDescription];
}

+ (DTXTestAssertionException*)_exceptionForFailureInMethod:(SEL)selector object:(id)object file:(NSString *)fileName lineNumber:(NSInteger)line viewDescription:(nullable NSDictionary<NSString*, id>*)viewDescription description:(NSString *)format arguments:(va_list)arguments
{
    return (id)[DTXTestAssertionException exceptionWithReason:[[NSString alloc] initWithFormat:format arguments:arguments] userInfo:@{
        @"selector": NSStringFromSelector(selector),
        @"object": [object debugDescription],
        @"file": fileName,
        @"lineNumber": @(line)
    } viewDescription:viewDescription];
}

+ (void)handleFailureInFunction:(NSString *)functionName file:(NSString *)fileName lineNumber:(NSInteger)line viewDescription:(NSDictionary<NSString*, id>*)viewDescription description:(NSString *)format arguments:(va_list)arguments
{
    [[self _exceptionForFailureInFunction:functionName file:fileName lineNumber:line viewDescription:viewDescription description:format arguments:arguments] raise];
}

+ (void)handleFailureInMethod:(SEL)selector object:(id)object file:(NSString *)fileName lineNumber:(NSInteger)line viewDescription:(NSDictionary<NSString*, id>*)viewDescription description:(NSString *)format arguments:(va_list)arguments
{
    [[self _exceptionForFailureInMethod:selector object:object file:fileName lineNumber:line viewDescription:viewDescription description:format arguments:arguments] raise];
}

+ (NSError*)errorForFailureInFunction:(NSString *)functionName file:(NSString *)fileName lineNumber:(NSInteger)line viewDescription:(nullable NSDictionary<NSString*, id>*)viewDescription description:(NSString *)format arguments:(va_list)arguments
{
    return [self _errorForTestAssertionException:[self _exceptionForFailureInFunction:functionName file:fileName lineNumber:line viewDescription:viewDescription description:format arguments:arguments]];
}

+ (NSError*)errorForFailureInMethod:(SEL)selector object:(id)object file:(NSString *)fileName lineNumber:(NSInteger)line viewDescription:(nullable NSDictionary<NSString*, id>*)viewDescription description:(NSString *)format arguments:(va_list)arguments
{
    return [self _errorForTestAssertionException:[self _exceptionForFailureInMethod:selector object:object file:fileName lineNumber:line viewDescription:viewDescription description:format arguments:arguments]];
}

+ (NSError*)errorWithReworedReason:(NSString*)reworded existingError:(NSError*)error
{
    NSMutableDictionary* userInfo = [error.userInfo mutableCopy];
    userInfo[NSLocalizedDescriptionKey] = reworded;
    
    return [NSError errorWithDomain:error.domain code:error.code userInfo:userInfo];
}

@end
