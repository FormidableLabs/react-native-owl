package com.formidable.reactnativeowl;

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise

import android.app.Activity
import android.view.View
import com.facebook.react.bridge.UiThreadUtil

class OwlModule internal constructor(context: ReactApplicationContext) :
  OwlSpec(context) {

  override fun initialize() {
    UiThreadUtil.runOnUiThread {
      val activity = currentActivity
      activity?.window?.decorView?.systemUiVisibility = UI_FLAG_IMMERSIVE
    }
  }

  override fun getName(): String {
    return NAME
  }

  companion object {
    const val NAME = "Owl"

    const val UI_FLAG_IMMERSIVE = View.SYSTEM_UI_FLAG_LAYOUT_STABLE or
      View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION or
      View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN or
      View.SYSTEM_UI_FLAG_HIDE_NAVIGATION or // hide nav bar
      View.SYSTEM_UI_FLAG_FULLSCREEN or // hide status bar
      View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY;
  }
}
