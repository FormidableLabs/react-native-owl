//
//  OwlInit.m
//  OwlClient
//
//  Created by Emmanouil Konstantinidis on 22/11/2021.
//

#import <Foundation/Foundation.h>

#import <OwlClient/OwlClient-Swift.h>

__attribute__((constructor))
static void owlInit() {
    NSLog(@"---- OWL ----, Hello from the OWL Client.");
}
