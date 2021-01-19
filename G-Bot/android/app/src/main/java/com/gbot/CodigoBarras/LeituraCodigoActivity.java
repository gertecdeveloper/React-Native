// package com.gertec.exemplosgertec.CodigoBarras;
package com.gbot.CodigoBarras;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.os.Handler;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.ListView;

import android.content.Context;
import android.app.Activity;


import com.gbot.service.LedUtil;
// import com.gbot.R;
import com.gbot.service.ReadCodeService;
import com.gbot.service.ServiceResultReceiver;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import com.facebook.react.ReactActivity;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import com.gbot.ToastModule;

import static com.gbot.service.ReadCodeService.SHOW_RESULT;

public class LeituraCodigoActivity extends ReactActivity implements ServiceResultReceiver.Receiver {

    private ServiceResultReceiver mServiceResultReceiver;
    private Context context;
    private Activity activity;

    public LeituraCodigoActivity(Context context) {
        this.context = context;

        mServiceResultReceiver = new ServiceResultReceiver(new Handler());
        mServiceResultReceiver.setReceiver(this);
    }

    public void StartService(){
        StartLeitura(LeituraCodigoActivity.this, mServiceResultReceiver);
        System.out.println("StartService: " + mServiceResultReceiver);
    }

    public void StopService(){
        ReadCodeService.START_SERVICES = false;
        System.out.println("StartService: " + LeituraCodigoActivity.this);
    }

    public void LedOn(){
        LedUtil.setRedLed();
        System.out.println("this.context.getPackageName(): " + this.context.getPackageName());
    }

    public void LedOff(){
        LedUtil.setOffLed();
        // System.out.println("LeituraCodigoActivity.this.getPackageName(): "  + LeituraCodigoActivity.this.getPackageName());
    }

    
    private void StartLeitura(LeituraCodigoActivity leituraCodigoActivity, ServiceResultReceiver mServiceResultReceiver){
        ReadCodeService.enqueueWork(this.context, mServiceResultReceiver);
    }



    @Override
    protected void onStart() {
        super.onStart();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
    }

    @Override
    public void onReceiveResult(int resultCode, Bundle resultData) {
        WritableMap params = Arguments.createMap();
        String x = "";

        switch (resultCode) {
            case SHOW_RESULT:
                if (resultData != null) {
                    System.out.println("RESULTADO: " + resultData.getString("data"));
                    x = resultData.getString("data");
                    
                    System.out.println("X: " + x);

                    ToastModule.ListReturnBarCode(x);
                }
                break;
        }
    }
}
