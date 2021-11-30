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
    
        scrollWithOffset("TEST_SCROLL", withOffset: CGPoint(x: 0, y: -200))
        
        scrollWithOffset("TEST_SCROLL", withOffset: CGPoint(x: 0, y: -50))
            
        scrollTo("TEST_SCROLL", edge: "bottom")
        
        tap("ABOUT_BUTTON")
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
            typeText("TEST_INPUT", text: "Hello world!")
            
            DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
                clearText("TEST_INPUT")
                
                DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
                    replaceText("TEST_INPUT", text: "Hello you!")
                    
                    // Pause then reload for demo purposes
                    DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) {
                        reloadApp()
                    }
                }
            }
        }
    }
}
