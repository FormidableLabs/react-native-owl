package com.formidable.reactnativeowl;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.module.annotations.ReactModule;

@ReactModule(name = ReactNativeOwlModule.NAME)
public class ReactNativeOwlModule extends ReactContextBaseJavaModule {
    public static final String NAME = "ReactNativeOwl";

    public ReactNativeOwlModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    @NonNull
    public String getName() {
        return NAME;
    }
}
