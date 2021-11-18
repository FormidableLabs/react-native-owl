//
//  Actions.swift
//  OwlClient
//
//  Created by Emmanouil Konstantinidis on 17/11/2021.
//

import Foundation

func getKeyWindow(): UIWindow? {
    let foundWindow : UIWindow? = nil;
    let windows: [UIWindow] = UIWindowScene.windows

    for (window in windows) {
        if (window.isKeyWindow) {
            return window;
        }
    }
}


func tap(elementId: String) {
    print("Will tap on: \(elementId).")
}
