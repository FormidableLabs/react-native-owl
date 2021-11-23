//
//  OwlManager.swift
//  OwlClient
//

import Foundation
import UIKit

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
            
            scrollWithOffset("TEST_SCROLL", withOffset: CGPoint(x: 0, y: -200))
            
            scrollTo("TEST_SCROLL", edge: "bottom")
            
            scrollTo("TEST_SCROLL", edge: "top")
            
            tap("ABOUT_BUTTON")
        }
    }
}
