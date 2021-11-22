//
//  OwlManager.swift
//  OwlClient
//
//  Created by Emmanouil Konstantinidis on 22/11/2021.
//

import Foundation

@objc(OwlManager)
public class OwlManager : NSObject {
    @objc(sharedManager)
    public static var shared : OwlManager = {
        return OwlManager()
    }()

    public override init() {
        print("---- OWL ----, Hello from the OWL manager.")
    }
}
