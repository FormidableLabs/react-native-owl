package com.formidable.reactnativeowl;

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise

class OwlModule internal constructor(context: ReactApplicationContext) :
  OwlSpec(context) {

  override fun getName(): String {
    return NAME
  }

  companion object {
    const val NAME = "Owl"
  }
}
