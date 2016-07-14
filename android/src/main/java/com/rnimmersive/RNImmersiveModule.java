package com.rnimmersive;

import android.annotation.TargetApi;
import android.app.Activity;
import android.os.Build;
import android.view.View;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.UiThreadUtil;

/**
 * {@link NativeModule} that allows changing the appearance of the menu bar.
 */
public class RNImmersiveModule extends ReactContextBaseJavaModule {
  private static final String ERROR_NO_ACTIVITY = "E_NO_ACTIVITY";
  private static final String ERROR_NO_ACTIVITY_MESSAGE = "Tried to set immersive while not attached to an Activity";

  public RNImmersiveModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return "RNImmersive";
  }

  @ReactMethod
  public void on(final Promise res) {
    _setImmersive(true, res);
  }
  @ReactMethod
  public void off(final Promise res) {
    _setImmersive(false, res);
  }
  @ReactMethod
  public void setImmersive(final boolean isOn, final Promise res) {
    _setImmersive(isOn, res);
  }

  private void _setImmersive(final boolean isOn, final Promise res) {
    final Activity activity = getCurrentActivity();
    if (activity == null) {
      res.reject(ERROR_NO_ACTIVITY, ERROR_NO_ACTIVITY_MESSAGE);
      return;
    }

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
      UiThreadUtil.runOnUiThread(
        new Runnable() {
          @TargetApi(Build.VERSION_CODES.KITKAT)
          @Override
          public void run() {
            if (isOn) {
              activity.getWindow().getDecorView().setSystemUiVisibility(
                                             View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                                             | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                                             | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                                             | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION // hide nav bar
                                             | View.SYSTEM_UI_FLAG_FULLSCREEN // hide status bar
                                             | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY);
            } else {
              activity.getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_VISIBLE); // default
            }
            res.resolve(null);
          }
        }
      );
    }
  }
}
