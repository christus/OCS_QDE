import { CommonDataService } from 'src/app/services/common-data.service';
import { Component, OnInit, Renderer2, ElementRef, Inject, HostListener, ViewChild, AfterViewInit } from '@angular/core';
import { Plugins, AppState } from '@capacitor/core';

import { Keyboard } from '@ionic-native/keyboard/ngx';


import { NativeKeyboard } from '@ionic-native/native-keyboard/ngx';
import { UtilService } from './services/util.service';
import { environment } from '../environments/environment';
import { DeviceDetectorService } from 'ngx-device-detector';
import { MobileService } from './services/mobile-constant.service';
import { AutoLogoutService } from './services/AutoLogoutService';
import { QdeHttpService } from './services/qde-http.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  @ViewChild("myDiv") divView: ElementRef;


  isMobile:any;

  title = 'OCS-QDE';

  isErrorModal:boolean = false;

  errorMessage:String = "";

  counter:number = 0;

  showErrDialog;
  errorList = [];
  isErrorCodeModal : boolean;
  errorCodeMessage : string;

  isMenuBarShown:boolean;



  constructor(private utilService: UtilService,
    private keyboard: Keyboard,
    private el: ElementRef, private renderer: Renderer2,
    nativeKeyboard: NativeKeyboard,
    private deviceService: DeviceDetectorService,
    private autoLogout: AutoLogoutService,
    private cds: CommonDataService,
    private mobileService: MobileService,
    private qdeHttp: QdeHttpService) {
      this.isMobile = this.mobileService.isMobile;

      if(this.isMobile){
        this.renderer.addClass(document.body, 'mobile');
      }

  }

  ngOnInit() {

    var that = this;


    console.log("isErrorModal", this.isErrorModal);

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

      // this.Keyboard.shrinkView(true);
      // this.Keyboard.hideFormAccessoryBar(true);


      //  window.addEventListener('keyboardDidShow', function () {
      //     console.log("********KeyboardDid show");
      //     // document.activeElement.scrollIntoView();
      //   });

      // const scrollToTopFn = () => {
      //   if (window["Keyboard"] && !window["Keyboard"].isVisible) {
      //     // window.scrollTo(0,0);
      //     // window.document.body.scrollTop = 0;
      //   }
      // };

      // window.addEventListener('keyboardDidHide', () => {
      //   console.log("********keyboardDidHide");
      //   // window.setTimeout(scrollToTopFn, 10);
      // });

    });



    this.cds.showLogout.subscribe((value) => {

      this.showErrDialog = value;

      console.log("this.showErrDialog", value);

      if(this.divView.nativeElement.classList.contains('active')) {
        // that.isErrorModal = false;
        console.log("reqesut", "ngAfterview contains active");
      }else {
        this.isErrorModal = this.showErrDialog;

        this.errorMessage = "Session expired please login again.";
        console.log("reqesut", "ngAfterview not active");

      }

    });

    this.cds.showError.subscribe((value) => {
      let errorCode = value[1];
      this.qdeHttp.adminGetLov().subscribe(res=>{
        if(res['ProcessVariables']['status']){
          this.errorList = JSON.parse(res['ProcessVariables']['lovs']).LOVS.error_message_mapping;
          for(var x in this.errorList){
            if(this.errorList[x].description== errorCode){
              this.errorCodeMessage = this.errorList[x].id;
              this.isErrorCodeModal = value[0];
              console.log(this.errorList[x].id);
              break;
            }
          }
        }
      })
    });
  }

  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    // console.log(event);

    // element = event.srcElement.nextElementSibling;
    if(event.code == "Tab") {
      console.log("Tab key pressed", event);
      event.preventDefault();
    }
  }

}
