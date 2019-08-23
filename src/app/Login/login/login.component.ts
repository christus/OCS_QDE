import { environment } from 'src/environments/environment';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { QdeHttpService } from 'src/app/services/qde-http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilService } from 'src/app/services/util.service';

import {CommonDataService} from 'src/app/services/common-data.service'


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

  @ViewChild('userNameField') userNameField: ElementRef;

  constructor(
    private router: Router,
    private qdeService: QdeHttpService,
    private utilService: UtilService,
    private commonDataService: CommonDataService
  ) {}

  ngOnInit() {
    this.version = environment.version;
    this.buildDate = environment.buildDate;
  }

  login() {
    const data = {
      email: this.userName.trim().toLowerCase()+ "@icicibankltd.com",
      password: this.password.trim(),
      removeExistingSession: false,
      appId: "OCS"
    };

    this.qdeService.checkActiveSession(data).subscribe(res => {
      console.log('hfgrhjgfc',res);
      this.commonDataService.setLogindata(data);
      localStorage.setItem("token", res["token"] ? res["token"] : "");
      this.roleLogin();
    },
    error => {
      //this.sessionMessage = error['error']['message'] ;
      this.sessionMessage = "An active session with these credential's does exists, please logout the existing session" ;
      this.activeSessionExists = error['error']["activeSessionExists"];
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
        console.log("ROLE LOGIN: ", res['ProcessVariables']['roleName']);
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
}
