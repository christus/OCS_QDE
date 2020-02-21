package com.icici.hfc;

import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Bundle;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;

import java.util.ArrayList;

public class MainActivity extends BridgeActivity {
  @Override
  public void onResume() {
    super.onResume();

    /** Check device rooted or not **/

    if(RootUtil.isDeviceRooted()) {
      Intent homeIntent = new Intent(Intent.ACTION_MAIN);
      homeIntent.addCategory( Intent.CATEGORY_HOME );
      homeIntent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
      startActivity(homeIntent);
    }

    /** Check Airwatch installed or not **/
//
    if (appInstalledOrNot("com.airwatch.lockdown.launcher")) {

    }else {
      new AlertDialog.Builder(this)
              .setTitle("Info")
              .setMessage("This device doesn't has AirWatch.You can't use this app")

              // Specifying a listener allows you to take an action before dismissing the dialog.
              // The dialog is automatically dismissed when a dialog button is clicked.
              .setPositiveButton(android.R.string.ok, new DialogInterface.OnClickListener() {
                public void onClick(DialogInterface dialog, int which) {
                  // Continue with delete operation
                  Intent homeIntent = new Intent(Intent.ACTION_MAIN);
                  homeIntent.addCategory( Intent.CATEGORY_HOME );
                  homeIntent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
                  startActivity(homeIntent);
                }
              })

              // A null listener allows the button to dismiss the dialog and take no further action.
              .setIcon(android.R.drawable.ic_dialog_alert)
              .show();
    }
  }

  private boolean appInstalledOrNot(String uri) {
    PackageManager pm = getPackageManager();
    try {
      pm.getPackageInfo(uri, PackageManager.GET_ACTIVITIES);
      return true;
    } catch (PackageManager.NameNotFoundException e) {
    }

    return false;
  }

  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    // Initializes the Bridge
    this.init(savedInstanceState, new ArrayList<Class<? extends Plugin>>() {{
      // Additional plugins you've installed go here
      // Ex: add(TotallyAwesomePlugin.class);
    }});

  }
}