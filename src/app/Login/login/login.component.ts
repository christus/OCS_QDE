import { environment } from 'src/environments/environment';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { QdeHttpService } from 'src/app/services/qde-http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilService } from 'src/app/services/util.service';

import {CommonDataService} from 'src/app/services/common-data.service'
import { EncryptService } from 'src/app/services/encrypt.service';



@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit, AfterViewInit {

  userName = "";
  password = "";
  activeSessionExists = false;
  sessionMessage="";

  version: string;
  buildDate: string;
  sharedKsy = "MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAJ+GJdSSEeaNFBLqyfM3DIOgQgWCwJ0INfeZZV7ITsLeuA7Yd02rrkYGIix1IWvoebWVmzhncUepYxHwK1ARCdUCAwEAAQ==";

  @ViewChild('userNameField') userNameField: ElementRef;

  constructor(
    private router: Router,
    private qdeService: QdeHttpService,
    private utilService: UtilService,
    private commonDataService: CommonDataService,
    private encrytionService: EncryptService
    
  ) {}

  ngOnInit() {
    this.version = environment.version;
    this.buildDate = environment.buildDate;
  }

  login() {
    const startDate = new Date();
    console.log("Login Api Call: User Id ", this.userName, " Start Date & Time ", startDate, startDate.getMilliseconds());
    const data = {
      email: this.userName.trim().toLowerCase()+ "@icicibankltd.com",
      password: this.password.trim(),
      removeExistingSession: false,
      appId: "OCS"
    };
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
    },
    error => {
      let getTypeOfError = error.length;
        if (!getTypeOfError){
          let getError = JSON.parse(this.decryptResponse( error));
          this.sessionMessage = getError["message"];
          this.activeSessionExists = getError["activeSessionExists"];
        } else {  
          this.sessionMessage = error['error']['message'];
          this.activeSessionExists = error['error']["activeSessionExists"]
        }
      
      // let typeofError = typeof(getError);
      // console.log("get errors ",getError);
;
      if(this.activeSessionExists){
        this.sessionMessage = "An active session with these credential's does exists, please logout the existing session";
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

  removeExisitingSession() {
    const data = {
      email: this.userName.trim().toLowerCase()+ "@icicibankltd.com",
      password: this.password.trim(),
      removeExistingSession: true,
      appId: "OCS"
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

        if(roleName.includes("Admin")) {
          this.router.navigate(["/admin/lovs"]);
          //this.router.navigate(["/user-module"]);
          return;
        }

        this.router.navigate(["/leads"]);
      },
      error => {
        console.log(error);
      }
    );
  }

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
}
