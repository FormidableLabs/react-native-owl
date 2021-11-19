//
//  Actions.swift
//  OwlClient
//
//  Created by Emmanouil Konstantinidis on 17/11/2021.
//

import Foundation
import UIKit

extension UIView {
    class func getAllSubviews<T: UIView>(from parenView: UIView) -> [T] {
        return parenView.subviews.flatMap { subView -> [T] in
            var result = getAllSubviews(from: subView) as [T]
            if let view = subView as? T { result.append(view) }
            return result
        }
    }
}

func getRootView() -> UIView? {
    let rootUiView = UIApplication.shared.windows.filter {$0.isKeyWindow}.first?.rootViewController?.view
    
    return rootUiView
}

func getViewsById(_ elementId: String, rootView: UIView) -> [UIView] {
    let rootView = getRootView()
    
    var matchingViews = [] as [UIView]
    
    if (rootView != nil) {
      let allViews = UIView.getAllSubviews(from: rootView!)
      
      for view in allViews {
        if (view.accessibilityIdentifier == elementId) {
          matchingViews.append(view)
        }
      }
    }
    
    return matchingViews
}

func tap(_ elementId: String) -> Void {
  let rootView = getRootView()
    
  if (rootView != nil) {
    let matchingViews = getViewsById(elementId, rootView: rootView!)

    if (matchingViews.count == 0) {
      print("---- OWL ----, found no UIViews matching \(elementId) - Nothing to tap!")
    } else if (matchingViews.count > 1) {
      print("---- OWL ----, found \(matchingViews.count) UIViews matching \(elementId) - There should only be a single UIView to tap!")
    } else {
      print("---- OWL ----, found a single \(elementId) UIView - Tap it!")
      let matchingView = matchingViews.first!
      let globalPoint = matchingView.superview?.convert(matchingView.frame.origin, to: nil)
      
      print("---- OWL ----, TODO: Tap at x:\(globalPoint?.x ?? 0), y: \(globalPoint?.y ?? 0)")
    }
  }
}
