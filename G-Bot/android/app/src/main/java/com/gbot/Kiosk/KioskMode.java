/*======================================================================================
  Arquivo       : KioskMode.java
  Projeto       : Modo Quiosque
  Plataforma    : Android
  Equipamentos  : Dispositivos Android
  Data Criação  : 03/Nov/2020
  Autor         : Geovani Nogueira Santos

  Descrição   : KioskMode.java:
                   - Habilita e Desabilita o Kiosk Mode via aplicação.
  =========================================================================================*/

package com.gbot.Kiosk;

import android.app.Activity;
import android.app.admin.DevicePolicyManager;
import android.content.ComponentName;

import android.view.View;
import java.lang.Runnable;

public class KioskMode extends AdminReceiver {

    private ComponentName componentName;
    private DevicePolicyManager devicePolicyManager;
    private Activity activity;

    public KioskMode(Activity activity) {
        this.activity = activity;
    }

    public void startKiosMode(){
        this.componentName = new ComponentName(this.activity.getApplicationContext(), AdminReceiver.class);
        this.devicePolicyManager = (DevicePolicyManager) this.activity.getSystemService(this.activity.DEVICE_POLICY_SERVICE);
        
        this.setLockTask(true);
        this.immersiveModeOn();
    }

    public void stopKioskMode() throws Exception {
        if(this.componentName == null){
            throw new Exception("Modo Quiosque ainda não foi ativado");
        }
        
        this.setLockTask(false);
        this.immersiveModeOff();
        
        this.componentName = null;
        this.devicePolicyManager = null;
    }

    private void immersiveModeOn() {
        final Activity reactActivity = this.activity;
        final int flags = View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                | View.SYSTEM_UI_FLAG_FULLSCREEN
                | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY;

        if (reactActivity != null) {
            reactActivity.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    reactActivity.getWindow()
                        .getDecorView()
                        .setSystemUiVisibility(flags);
                }
            });
        }
    }

    private void immersiveModeOff() {
        final Activity reactActivity = this.activity;
        final int flag = View.SYSTEM_UI_FLAG_VISIBLE;

        if (reactActivity != null) {
            reactActivity.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    reactActivity.getWindow()
                        .getDecorView()
                        .setSystemUiVisibility(flag);
                }
            });
        }
    }

    private void setLockTask(boolean start){
        if(start){
            activity.startLockTask();
        }else{
            activity.stopLockTask();
        }
    }
}