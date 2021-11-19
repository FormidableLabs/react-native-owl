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
        print("---- OWL ----, Hello from the OWL manager.")
    }
    
    @objc(doDemo)
    public func doDemo() {
        print("---- OWL ----, Will do a demo.")
    
        let seconds = 5.0
        
        DispatchQueue.main.asyncAfter(deadline: .now() + seconds) {
            print("---- OWL ----, Resuming demo")
            
            let elementId = "ABOUT_BUTTON"
            tap(elementId)
        }
        
    }
}
