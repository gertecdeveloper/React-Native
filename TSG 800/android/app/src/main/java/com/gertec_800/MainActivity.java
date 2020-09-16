package com.gertec_800;

import android.app.Activity;
import android.os.Bundle;
import android.os.PersistableBundle;

import androidx.annotation.Nullable;

import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  public static GertecPrinter gertecPrinter;
  public static ConfigPrint configPrint;
  public static SatLib satLib;

  @Override
  public void onCreate( Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    configPrint = new  ConfigPrint();
    gertecPrinter = new GertecPrinter(this);
    satLib = new SatLib(this);

  }

  @Override
  protected String getMainComponentName() {
    return "gertec_800";
  }
}
