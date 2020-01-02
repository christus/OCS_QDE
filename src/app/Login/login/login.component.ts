import { MobileService } from './../../services/mobile-constant.service';
import { AutoLogoutService } from './../../services/AutoLogoutService';
import { environment } from 'src/environments/environment';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { QdeHttpService } from 'src/app/services/qde-http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilService } from 'src/app/services/util.service';

import {CommonDataService} from 'src/app/services/common-data.service'
import { EncryptService } from 'src/app/services/encrypt.service';
import { CaptchaResolverService } from 'src/app/services/captcha-resolver.service';
import { Observable } from 'rxjs';
import { e } from '@angular/core/src/render3';



@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit, AfterViewInit {

  isMobile: any;
  userName = "";
  password = "";
  captchaText = "";
  activeSessionExists = false;
  sessionMessage = "";
  catchaImage;
  version: string;
  buildDate: string;
  catchaImageData;
  oldRefId;
  base64Data;
  sharedKsy = "MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAJ+GJdSSEeaNFBLqyfM3DIOgQgWCwJ0INfeZZV7ITsLeuA7Yd02rrkYGIix1IWvoebWVmzhncUepYxHwK1ARCdUCAwEAAQ==";

  @ViewChild('userNameField') userNameField: ElementRef;

  constructor(
    private router: Router,
    private qdeService: QdeHttpService,
    private utilService: UtilService,
    private commonDataService: CommonDataService,
    private encrytionService: EncryptService,
    private catchaDataService: CaptchaResolverService ,
    private activeRout: ActivatedRoute,
    private autoLogout: AutoLogoutService,
    private mobileService: MobileService,
  ) {
    this.catchaImageData = this.activeRout.snapshot.data;
    this.base64Data = this.catchaImageData["catchaImage"]["catchaImage"];
  }

  ngOnInit() {
    this.version = environment.version;
    this.buildDate = environment.buildDate;
    // this.catchaImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAAAyCAYAAAC+jCIaAAABc0lEQVR42u3bwRHCIBAFUOuxCbuw/xZSgTagkRBWdsk7/IOOyWSWl0BAbtu2vURG56YIApaAtVruj+fHqA1YQ0GBVQhWxsYDqzisrI0HElhgZYU1s4iZupxf1wJaEVjZGhCsRWF9a1ywwDrViJnGNyAtAitbo4IVCCuyCzgCa0bDghUEK3KM0XI+sBaEFT2AbTkPWAvDiuqe/g0ZrESwoordiwqsC8HqKfgZWLPn2CRouuFsQ/cc33ttGWBF1DX7ZC1YE2CN6AmyP0mndIU9x/5z/JcJVta35XSD916U1Qs+ElaFNcup0w1XGmz3YFkeVqUV/iqw9m7YT5+rvalOXdIBqw1WxsX59IvQV5p3OgJr76lVDtaK27UqXFvL99VucrASdIdggRUO6+iY1/YvsJqw7P0eLLBCYFV6iQIr+ZZ9sMAK2fFddesZWGCBtcof845CAQsssMASsAQsEbAELAFLBCwBS8ASsBRBwBKwBCyR0XkDjNqPBC5GlaIAAAAASUVORK5CYII=";
    this.catchaImage = "data:image/png;base64," + this.base64Data;
    this.oldRefId = this.catchaImageData["catchaImage"]["refId"];
    // console.log("catcha image in on init",  this.catchaImageData["catchaImage"]["catchaImage"]);
  }

  login() {
    this.sessionMessage = "";
    if (!this.userName) {
      console.log('user name check');
      this.sessionMessage = "Enter Employee ID";
    } else if (!this.password) {
      this.sessionMessage = "Enter Password";
    } else if ( !this.captchaText) {
      this.sessionMessage = "Enter Captcha Text";
    } else {
      const startDate = new Date();
      const userEmailId: string = this.userName.toLocaleLowerCase();
      console.log("Login Api Call: User Id ", this.userName, " Start Date & Time ", startDate, startDate.getMilliseconds());
      const data = {
        email: this.userName.trim().toLowerCase()+ "@icicibankltd.com",
        password: this.password.trim(),
        removeExistingSession: false,
        appId: "OCS",
        refId: this.oldRefId,
        captcha: this.captchaText,
        useADAuth: false
        //  useADAuth: userEmailId.startsWith("he")
      };
      console.log("login Data: ",data);
      let token = localStorage.getItem("token");

      console.log("Login Encrytion", this.encrytionService.encrypt(JSON.stringify(data), this.sharedKsy));

      this.qdeService.checkActiveSession(data).subscribe(res => {
        //let getData = JSON.parse(this.decryptResponse(res));
        const endDate = new Date();
      console.log("Login Api Call: User Id ", this.userName, " End Date & Time ", endDate, endDate.getMilliseconds());
        // console.log('hfgrhjgfc',res);
        this.commonDataService.setLogindata(data);
        localStorage.setItem("token", res["token"] ? res["token"] : "");
        this.roleLogin();
        //this.checkLogin();

        this.autoLogout.initInterval();

      },
      error => {

        let getTypeOfError = error.length;
          if (!getTypeOfError) {

            this.isMobile = this.mobileService.isMobile;

            let getError;
            
            if(this.isMobile) {
              getError = error;
            }else{
              getError = JSON.parse(this.decryptResponse( error));
            }

            if (getError["message"] == "Invalid captcha"){
              this.sessionMessage = getError["message"];
              this.activeSessionExists = getError["activeSessionExists"];
              // this.generateCatchaImage();
            } else {
            this.sessionMessage = getError["message"];
            this.activeSessionExists = getError["activeSessionExists"];
          }
          } else {
            this.sessionMessage = error['error']['message'];
            this.activeSessionExists = error['error']["activeSessionExists"]
            // this.generateCatchaImage();
          }
          // this.generateCatchaImage();
        // let typeofError = typeof(getError);
        // console.log("get errors ",getError);
  
        if (this.activeSessionExists) {
          this.sessionMessage = "An active session with these credential's does exists, please logout the existing session";
        } else {
          this.generateCatchaImage();
        }

      });
      // this.qdeService.authenticate(data).subscribe(
      //   res => {
      //     console.log('hfgrhjgfc',res);
      //     this.commonDataService.setLogindata(data);
      //     localStorage.setItem("token", res["token"] ? res["token"] : "");
      //     this.roleLogin();
      //   },
      //   error => {
      //     console.log('err',error['error']['message']);
      //     this.message = error['error']['message'];
      //   }
      // );
    }
  }
  removeExisitingSession() {
    const data = {
      email: this.userName.trim().toLowerCase()+ "@icicibankltd.com",
      password: this.password.trim(),
      removeExistingSession: true,
      appId: "OCS",
      refId: this.oldRefId,
      captcha: this.captchaText
    };

    this.qdeService.checkActiveSession(data).subscribe(res => {
      console.log('hfgrhjgfc',res);
      this.commonDataService.setLogindata(data);
      localStorage.setItem("token", res["token"] ? res["token"] : "");
      this.roleLogin();
    },
    error => {
      console.log('err',error['error']['message']);
      this.message = error['error']['message'];
      // this.generateCatchaImage();
    });
  }

  public message: string;

  roleLogin() {
    this.qdeService.roleLogin().subscribe(
      res => {
        console.log("ROLE Name: ", res);
        let roleName = JSON.stringify(res["ProcessVariables"]["roleName"]);
        localStorage.setItem("userId", res["ProcessVariables"]["userId"]);
        localStorage.setItem('roles', roleName);
        // localStorage.setItem("firstName", res["ProcessVariables"]["firstName"]);
        let userActivityList = res["ProcessVariables"]["userActivityList"];
        // let userActivityArray :[] = userActivityList.split(",");
      console.log("user Activity",userActivityList);
        if(roleName.includes("Admin")) {
          this.router.navigate(["/admin/lovs"]);
          //this.router.navigate(["/user-module"]);
          return;
        }else{
          let createLead = false;
          let createLogin = false;
          let applicatonreAssign = false;
          let documetUpload = false;
          let viewApplication = false;
          userActivityList.forEach(uActivity => {
            if (uActivity == "Lead"){
              createLead = true;
            } else if(uActivity == "New Login"){
              createLogin= true;
            } else if(uActivity == "Reassign"){
              applicatonreAssign= true;
            } else if (uActivity == "Document Upload"){
              documetUpload =true;
            }
            
          });
          this.commonDataService.changeCreateLead(createLead);
          this.commonDataService.changeNewLogin(createLogin);
          this.commonDataService.changereAssign(applicatonreAssign);
        } 
        
        // else if(roleName.includes("connector")){
        //   this.commonDataService.changeCreateLead(true);
        //   this.commonDataService.changeNewLogin(false);
        //   this.commonDataService.changereAssign(false);
        // }else if(roleName.includes("SA") || roleName.includes("SM") || roleName.includes("DMA")){
        //   this.commonDataService.changeCreateLead(true);
        //   this.commonDataService.changeNewLogin(true);
        //   this.commonDataService.changereAssign(false);
        // }else if(roleName.includes("TBM") || roleName.includes("TMA") || roleName.includes("ZBM") || roleName.includes("NBH")
        //           || roleName.includes("CRO") || roleName.includes("CEO")  || roleName.includes("COO")){
        //   this.commonDataService.changeCreateLead(true);
        //   this.commonDataService.changeNewLogin(true);
        //   this.commonDataService.changereAssign(true);
        // }else if(roleName.includes("CSA")){
        //   this.commonDataService.changeCreateLead(true);
        //   this.commonDataService.changeNewLogin(true);          
        //   this.commonDataService.changereAssign(false);
        // }        
        // else {
        //   this.commonDataService.changeCreateLead(false);
        //   this.commonDataService.changeNewLogin(false);
        //   this.commonDataService.changereAssign(false);
        // }

        this.router.navigate(["/leads"]);
      },
      error => {
        console.log(error);
      }
    );
  }

  // checkLogin() {
  //   let data = {
  //     'email': 'icici@icicibankltd.com',
  //     'password': 'icici@123',
  //     'longTimeToken': true
  //   };

  //   this.qdeService.longLiveAuthenticate(data).subscribe(
  //     res => {
  //       console.log("response");
  //       console.log("login-response: ",res);

  //       localStorage.setItem("token", res["token"] ? res["token"] : "");

  //       this.router.navigate(['/setPin']);

  //     },
  //     error => {
  //       console.log("error-response");

  //       console.log(error);
  //     }
  //   );
  // }

  ngAfterViewInit() {
    this.userNameField.nativeElement.focus();
  }
  decryptResponse(event) {
    var timestamp = event.headers.get('x-appiyo-ts')
    var randomkey = event.headers.get('x-appiyo-key')
    var responseHash = event.headers.get('x-appiyo-hash');
    if (timestamp != null) {
      try {
        let decryption = this.encrytionService.decrypt(randomkey, timestamp, responseHash, event.body || event.error, this.sharedKsy);
        return decryption;
      }catch(e) {
        console.log(e);
      }
      return null;

    } else {
      return false;
    }

  }
  generateCatchaImage() {
    let catchaImageData;
    this.qdeService.generateCatchaImage(this.oldRefId).subscribe(res => {
      // console.log("get catch response ", res);
      this.base64Data = res["catchaImage"];
     catchaImageData = res;
     this.oldRefId = res["refId"];

      this.catchaImage = "data:image/png;base64," + this.base64Data;
      // console.log("cat data in  ", this.catchaImage);
    });
    
  }
  cancelProcess() {
    this.activeSessionExists = false;
    this.generateCatchaImage();
  }
 
}
