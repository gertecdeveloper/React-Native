package com.gbot;

import android.os.Bundle;

import android.view.KeyEvent;
import android.icu.text.DateFormat;
import java.util.Date;

import com.gbot.ToastModule;
import com.gbot.Kiosk.KioskMode;
import com.gbot.CodigoBarras.LeituraCodigoActivity;

import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity {
    public static SatLib satLib;
    public static KioskMode kioskMode;
    public static LeituraCodigoActivity mLeituraCodigoActivity;

    
    /**
     * Returns the name of the main component registered from JavaScript. This is used to schedule
     * rendering of the component.
     */

    @Override
    protected String getMainComponentName() {
        return "gbot";
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        satLib = new SatLib(this);
        kioskMode = new KioskMode(this);
        mLeituraCodigoActivity = new LeituraCodigoActivity(this);
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        System.out.println("onKeyDown" + keyCode);
        Date dt = new Date();
        String currentTimeString = String.valueOf(dt.getHours()) + ":" + String.valueOf(dt.getMinutes()) + ":" + String.valueOf(dt.getSeconds());

        switch (event.getKeyCode()){
            case KeyEvent.KEYCODE_F4:

                if (ToastModule.sensorStart == false){ return false;}
                
                System.out.println(currentTimeString + " - Pessoa identificada à frente do equipamento.");
                ToastModule.onKeyDownEvent(currentTimeString + " - Pessoa identificada à frente do equipamento.");

                break;
        }

        return super.onKeyDown(keyCode, event);
    }
}
