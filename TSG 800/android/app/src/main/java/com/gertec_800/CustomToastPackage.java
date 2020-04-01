package com.gertec_800;

import android.app.Activity;
import android.app.Application;
import android.content.Intent;
import android.os.Bundle;

import androidx.annotation.NonNull;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class CustomToastPackage implements ReactPackage{



    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }


    @Override
    public List<NativeModule> createNativeModules(
            ReactApplicationContext reactContext) {

        List<NativeModule> modules = new ArrayList<>();

        modules.add(new ToastModule(reactContext));

        return modules;
    }



}
