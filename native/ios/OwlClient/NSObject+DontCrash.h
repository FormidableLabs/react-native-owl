//
//  NSObject+DontCrash.h
//  OwlClient
//
//  Created by Rob Walker on 23/11/2021.
//

@import UIKit;

NS_ASSUME_NONNULL_BEGIN

@interface NSObject (DontCrash)

- (id)_dtx_text;
- (id)_dtx_placeholder;

@end

NS_ASSUME_NONNULL_END
