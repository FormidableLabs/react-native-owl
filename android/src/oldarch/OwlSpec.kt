package com.formidable.reactnativeowl;

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.Promise

abstract class OwlSpec internal constructor(context: ReactApplicationContext) :
  ReactContextBaseJavaModule(context) {
}
