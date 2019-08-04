import { Component, OnInit, Renderer2, ElementRef, Inject } from '@angular/core';
import { Plugins, AppState } from '@capacitor/core';

import { DeviceDetectorService } from 'ngx-device-detector';

import { Keyboard } from '@ionic-native/keyboard/ngx';


import { NativeKeyboard } from '@ionic-native/native-keyboard/ngx';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  isMobile:any;

  title = 'OCS-QDE';

  constructor(private deviceService: DeviceDetectorService,
    private keyboard: Keyboard,
    private renderer: Renderer2,
    nativeKeyboard: NativeKeyboard){
    this.isMobile = this.deviceService.isMobile() ;
    if(this.isMobile){
      this.renderer.addClass(document.body, 'mobile');
    }
  }

  ngOnInit() {
    document.addEventListener('backbutton', () => {
      navigator["app"].exitApp();
   });
   document.addEventListener('deviceready', function() {
      console.log("Device ready");

      // if (window.cordova && window.cordova.plugins["Keyboard"]) {
      //   // This requires installation of https://github.com/driftyco/ionic-plugin-keyboard
      //   // and can only affect native compiled Ionic2 apps (not webserved).
      //   cordova.plugins["Keyboard"].disableScroll(true);
      // }


      // this.Keyboard.shrinkView(true);
      // this.nativeKeyboard.shrinkView(true);
      // window.addEventListener('keyboardDidShow', function () {
      //   console.log("KeyboardDid show");
      //   document.activeElement.scrollIntoView();
      // })

      this.Keyboard.shrinkView(true);
      this.Keyboard.hideFormAccessoryBar(true);


       window.addEventListener('keyboardDidShow', function () {
          console.log("********KeyboardDid show");
          document.activeElement.scrollIntoView();
        });

      const scrollToTopFn = () => {
        if (window["Keyboard"] && !window["Keyboard"].isVisible) {
          window.scrollTo(0,0);
          window.document.body.scrollTop = 0;
        }
      };
      
      window.addEventListener('keyboardDidHide', () => {
        console.log("********keyboardDidHide");
        window.setTimeout(scrollToTopFn, 10);
      });

    });
  
  }
}
