//
//  OwlInit.m
//  OwlClient
//

#import <Foundation/Foundation.h>

#import <OwlClient/OwlClient-Swift.h>

__attribute__((constructor))
static void owlInit() {
    NSLog(@"---- OWL ----, Hello from the OWL Client.");
    
    [OwlManager.sharedManager doDemo];
}
