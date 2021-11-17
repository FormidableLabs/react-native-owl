//
//  Actions.swift
//  OwlClient
//
//  Created by Emmanouil Konstantinidis on 17/11/2021.
//

import Foundation
import UIKit

func getKeyWindow(): UIWindow? {
    let foundWindow : UIWindow? = nil;
    let windows: [UIWindow] = UIWindowScene.windows

    for (window in windows) {
        if (window.isKeyWindow) {
            return window;
        }
    }
}

func tap(elementId = "ABOUT_BUTTON") {
    let predicate = NSPredicate(value: elementId)
    
    let views = (UIView.dtx_findViewsInKeySceneWindows(passing: predicate.predicateForQuery()) as! [NSObject])
    
    let keyWindow: UIWindow = getKeyWindow()
    let scene: UIWindowScene = keyWindow ? keyWindow.windowScene : nil;
}
