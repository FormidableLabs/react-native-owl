//
//  Actions.swift
//  OwlClient
//
//  Created by Emmanouil Konstantinidis on 17/11/2021.
//

import Foundation
import UIKit
import DetoxSync


func getElementById(_ elementId: String) throws -> Element? {
    return try Element.with(dictionaryRepresentation: [ "predicate": [ "type": "id","value": elementId]])
}

func tap(_ elementId: String) -> Void {
    do {
        let element = try getElementById(elementId)
        
        print("---- OWL ----, Tap \(element?.dtx_shortDescription ?? "")")
        
        element?.tap()
    } catch {
        print("---- OWL ----, Error tapping \(elementId)")
    }
}

func scrollWithOffset(_ elementId: String, withOffset: CGPoint) -> Void {
    do {
        let element = try getElementById(elementId)
        
        print("---- OWL ----, scrollWithOffset \(element?.dtx_shortDescription ?? "")")
        
        element?.scroll(withOffset: withOffset)
    } catch {
        print("---- OWL ----, Error scrolling \(elementId)")
    }
}

func scrollTo(_ elementId: String, edge: String) -> Void {
    do {
        let element = try getElementById(elementId)
        
        print("---- OWL ----, scrollto \(edge) of \(element?.dtx_shortDescription ?? "")")
        
        let targetEdge : UIRectEdge
        switch edge {
        case "top":
            targetEdge = UIRectEdge.top.self
            break;
        case "bottom":
            targetEdge = UIRectEdge.bottom.self
            break;
        case "left":
            targetEdge = UIRectEdge.left.self
            break;
        case "right":
            targetEdge = UIRectEdge.right.self
            break;
        default:
            fatalError("Unknown scrollTo edge")
            break;
        }
        
        element?.scroll(to: targetEdge)
    } catch {
        print("---- OWL ----, Error scrolling \(elementId)")
    }
}

func typeText(_ elementId: String, text: String) -> Void {
    do {
        let element = try getElementById(elementId)
        
        print("---- OWL ----, type text '\(text)' in \(element?.dtx_shortDescription ?? "")")
        
        element?.typeText(text)
    } catch {
        print("---- OWL ----, Error typing text in \(elementId)")
    }
}

func replaceText(_ elementId: String, text: String) -> Void {
    do {
        let element = try getElementById(elementId)
        
        print("---- OWL ----, replace text '\(text)' in \(element?.dtx_shortDescription ?? "")")
        
        element?.replaceText(text)
    } catch {
        print("---- OWL ----, Error replacing text in \(elementId)")
    }
}

func clearText(_ elementId: String) -> Void {
    do {
        let element = try getElementById(elementId)
        
        print("---- OWL ----, clear text in \(element?.dtx_shortDescription ?? "")")
        
        element?.clearText()
    } catch {
        print("---- OWL ----, Error clearing text in \(elementId)")
    }
}

func reloadApp() -> Void {
//    DTXSyncManager.enqueueMainQueueIdleClosure {
    print("---- OWL ----, reload app")
    
    ReactNativeSupport.reloadApp()
//    }
    
    waitForRNLoad()
    return
}

private func waitForRNLoad() {
    ReactNativeSupport.waitForReactNativeLoad {
        print("---- OWL ----, reloaded")
        print("---- OWL ----, TODO: Notify via socket that app is ready")
        
    }
}
