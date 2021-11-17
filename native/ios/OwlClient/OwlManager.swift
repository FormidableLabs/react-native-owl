//
//  OwlManager.swift
//  OwlClient
//
//  Created by Emmanouil Konstantinidis on 17/11/2021.
//

import Foundation

@objc(OwlManager)
public class OwlManager : NSObject {
    @objc(sharedManager)
    public static var shared : OwlManager = {
        return OwlManager()
    }()
    
    public override init() {
        print("Hello from the OWL manager.")
    }
    
    @objc(sayHello)
    public func sayHello() {
        print("Hello World.")
    }
}
