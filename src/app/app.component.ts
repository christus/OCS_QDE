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
import { Router } from '@angular/router';

declare var window: any;

const API_Key = "AIzaSyCc9UhVSnToz-1sG9Nxn2WF_mcThqUhCyI";



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  @ViewChild("myDiv") divView: ElementRef;
  @ViewChild("adminErrorDiv") adminDivView: ElementRef;


  isMobile:any;

  title = 'OCS-QDE';

  isErrorModal:boolean = false;

  errorMessage:String = "";

  counter:number = 0;

  showErrDialog;
  errorList = [];
  isErrorCodeModal : boolean = false;
  errorCodeMessage : string;
  isEmpty : boolean;
  isMenuBarShown:boolean;
  noErrors : boolean;
  isAdmin: boolean;
  navigationString: string;
  



  constructor(private utilService: UtilService,
    private keyboard: Keyboard,
    private el: ElementRef, private renderer: Renderer2,
    nativeKeyboard: NativeKeyboard,
    private deviceService: DeviceDetectorService,
    private autoLogout: AutoLogoutService,
    private cds: CommonDataService,
    private mobileService: MobileService,
    private qdeHttp: QdeHttpService,
    private router: Router) {
      this.isMobile = this.mobileService.isMobile;

      if(this.isMobile){
        this.renderer.addClass(document.body, 'mobile');
      }
      this.cds.isAdmin$.subscribe(val => this.isAdmin =val);
      this.cds.adminNagigation$.subscribe(val => this.navigationString=val);
  }

  ngOnInit() {

    //  if (this.isAdmin){
    //   this.router.navigate([this.navigationString])
    //   return;
    // }
    var that = this;

    if(this.isMobile) {
      var randomString = function(length) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for(var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
      }
      let nonse = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  
  
      window.safetynet.attest(nonse
      ,API_Key ,function(result){
        console.log("RESULT", result);
        let jsonResult = JSON.parse(result);
        console.log("jsonResult", jsonResult);
        let ctsProfileMatch = jsonResult.ctsProfileMatch;
        let basicIntegrity = jsonResult.basicIntegrity;
        let apkCertificateDigestSha256 = jsonResult.apkCertificateDigestSha256;
  
        console.log("ctsProfileMatch", ctsProfileMatch);
        console.log("basicIntegrity", basicIntegrity);
        console.log("apkCertificateDigestSha256", apkCertificateDigestSha256);
  
        if(!ctsProfileMatch || !basicIntegrity && apkCertificateDigestSha256 != environment.apkCertDig256) {
          alert("Application integrity breach");
          navigator["app"].exitApp();
        }
  
      } ,function(error){
          console.log("error RESULT", error);
          alert("Application integrity breach");
          navigator["app"].exitApp();
      });
    }

    if(this.errorList!=undefined && this.errorList.length==0){
      this.isEmpty = true;
    }
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

        this.errorMessage = "Your session expired...";
        // this.utilService.clearCredentials();
        console.log("reqesut", "ngAfterview not active");

      }

    });

    this.cds.showError.subscribe((value) => {
      if(Array.isArray(value) && value.length!=0){
      let status = value[0];
      let errorCode = value[1];
      let errorMessage = value[2];
      let token = localStorage.getItem("token");
      if(errorCode==="HTTP"){
        this.isErrorCodeModal = true;
        this.errorCodeMessage = "No internet detected. Please try again";
        return;
      }
      if(errorCode==="HTTPTimeOut"){
        this.isErrorCodeModal = true;
        this.errorCodeMessage = "Network failure. Please try again";
        return;
      }
      if (this.isEmpty == true && token!=null) {
        if (errorCode!="DYN001"){
        this.fillErrorList().then(()=>{
          if (this.noErrors == true) {
	    // if(errorCode!="DYN001"){
            let result = this.errorList.find(v=> v.key == errorCode);
            if(result!=null && result!=undefined){
            this.errorCodeMessage = result.value;
            this.isErrorCodeModal = status;
          }else{
            let temp = this.errorList.find(v=> v.key == "DEF");
            this.errorCodeMessage = temp.value;
            this.isErrorCodeModal = status;
          }
	
        }else{
          this.isErrorCodeModal = true;
          this.errorCodeMessage = "No internet detected. Please try again";
        }
      })
    } else{
          this.errorCodeMessage = errorMessage;
          this.isErrorCodeModal = status;
          }
      }else if (this.isEmpty == false) {
            if(errorCode!="DYN001"){
                  let result = this.errorList.find(v=> v.key == errorCode);
                  if(result!=null && result!=undefined){
                    this.errorCodeMessage = result.value;
                    this.isErrorCodeModal = status;
                  }else{
                    let temp = this.errorList.find(v=> v.key == "DEF");
                    this.errorCodeMessage = temp.value;
                    this.isErrorCodeModal = status;
                  }
              }else{
                  this.errorCodeMessage = errorMessage;
                  this.isErrorCodeModal = status;
              }
            }
      }
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

  fillErrorList(){
    return new Promise(resolve=>{
      this.qdeHttp.getAllLov().subscribe(res=>{
        if(res['ProcessVariables']['status']){
          let lov = JSON.parse(res['ProcessVariables']['lovs']);
          this.errorList = lov.LOVS.error_message_mapping;
          this.isEmpty = false;
          this.noErrors = true;
          resolve();
        }else{
          this.noErrors = false;
        }
      });
    });
  }

}
