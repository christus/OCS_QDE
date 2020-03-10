package com.icici.hfc;

import android.Manifest;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;

import java.util.ArrayList;

import android.support.v4.content.ContextCompat;

import java.io.File;
import java.util.ArrayList;	
import java.util.ArrayList;


public class MainActivity extends BridgeActivity {

    private static final int REQUEST_WRITE_PERMISSION = 786;

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

    if (ContextCompat.checkSelfPermission(MainActivity.this, Manifest.permission.READ_EXTERNAL_STORAGE)
            != PackageManager.PERMISSION_GRANTED) {
      // Permission is not granted
      requestPermission();
    }

    getTempDirectoryPath();


    /** Check Airwatch installed or not **/
//
//    if (appInstalledOrNot("com.airwatch.lockdown.launcher")) {
//
//    }else {
//      new AlertDialog.Builder(this)
//              .setTitle("Info")
//              .setMessage("This device doesn't has AirWatch.You can't use this app")
//
//              // Specifying a listener allows you to take an action before dismissing the dialog.
//              // The dialog is automatically dismissed when a dialog button is clicked.
//              .setPositiveButton(android.R.string.ok, new DialogInterface.OnClickListener() {
//                public void onClick(DialogInterface dialog, int which) {
//                  // Continue with delete operation
//                  Intent homeIntent = new Intent(Intent.ACTION_MAIN);
//                  homeIntent.addCategory( Intent.CATEGORY_HOME );
//                  homeIntent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
//                  startActivity(homeIntent);
//                }
//              })
//
//              // A null listener allows the button to dismiss the dialog and take no further action.
//              .setIcon(android.R.drawable.ic_dialog_alert)
//              .show();
//    }
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

  private void requestPermission() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
      requestPermissions(new String[]{android.Manifest.permission.WRITE_EXTERNAL_STORAGE}, REQUEST_WRITE_PERMISSION);
    }else {
      new AlertDialog.Builder(this)
              .setTitle("Info")
              .setMessage("Storage permission nor provided")

              // Specifying a listener allows you to take an action before dismissing the dialog.
              // The dialog is automatically dismissed when a dialog button is clicked.
              .setPositiveButton(android.R.string.ok, new DialogInterface.OnClickListener() {
                public void onClick(DialogInterface dialog, int which) {
                  // Continue with delete operation

                }
              })

              // A null listener allows the button to dismiss the dialog and take no further action.
              .setIcon(android.R.drawable.ic_dialog_alert)
              .show();
    }
  }

  private String getTempDirectoryPath() {
    File cache = null;

   
    String sdCardPath = android.os.Environment.getExternalStorageDirectory().getPath();
    String caseFolderName = "caseName";
    String encrImgPath = sdCardPath+ File.separator + "OCS" + File.separator + "data" + File.separator + caseFolderName;

    if (Environment.getExternalStorageState().equals(Environment.MEDIA_MOUNTED)) {
      cache = new File(encrImgPath);
    }
    // Create the cache directory if it doesn't exist
    cache.mkdirs();
    return cache.getAbsolutePath();
}

}