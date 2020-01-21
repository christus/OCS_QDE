package com.icici.hfc;

import android.content.Intent;
import android.os.Bundle;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;

import java.util.ArrayList;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    // Initializes the Bridge
    this.init(savedInstanceState, new ArrayList<Class<? extends Plugin>>() {{
      // Additional plugins you've installed go here
      // Ex: add(TotallyAwesomePlugin.class);
    }});

    if(RootUtil.isDeviceRooted()) {
      Intent homeIntent = new Intent(Intent.ACTION_MAIN);
      homeIntent.addCategory( Intent.CATEGORY_HOME );
      homeIntent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
      startActivity(homeIntent);
    }

  }
}
