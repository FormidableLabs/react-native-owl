//
//  Actions.swift
//  OwlClient
//
//  Created by Emmanouil Konstantinidis on 17/11/2021.
//

import Foundation
import UIKit

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

