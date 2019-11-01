import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DeviceDetectorService } from 'ngx-device-detector';

import { QdeHttpService } from 'src/app/services/qde-http.service';
import { MobileService } from './mobile-constant.service';



@Injectable({providedIn: "root"})
export class UtilService {
  isMobile:any;

  constructor(private router: Router, private http: HttpClient,
    private qdehttpService: QdeHttpService,
    private mobileService: MobileService) { 
    this.isMobile = this.mobileService.isMobile;

    console.log("isMobile-utils", this.isMobile);
    this.qdehttpService = qdehttpService;
  }

  isLoggedIn() {
    let loggedIn = false;
    if (localStorage.getItem('token')) {
      loggedIn = true;
    }

    return loggedIn;
  }

  
  clearCredentials() {
    localStorage.removeItem('token');
    localStorage.removeItem('roles');
    localStorage.removeItem('userId')
    if(this.isMobile) {
      this.navigateToLoginWithMpin();
      return;
    }else {
      this.navigateToLogin();
    }   
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToLoginWithMpin() {
    
   let isFirstTime = localStorage.getItem("firstTime");

   console.log("isFirstTime", isFirstTime);

   if(isFirstTime == null) {

    let data = {
      'email': environment.userName,
      'password': environment.password,
      'longTimeToken': true
    }

    console.log("data", isFirstTime);
  
    this.qdehttpService.longLiveAuthenticate(data).subscribe(
      res => {
        console.log("response");
        console.log("login-response: ",res);

        localStorage.setItem("token", res["token"] ? res["token"] : "");

        this.router.navigate(['/setPin']);

      },
      error => {
        console.log("error-response");

        console.log(error);
      }
    );

    return;
   }

    this.router.navigate(['/loginWithPin']);
  }
  
}
