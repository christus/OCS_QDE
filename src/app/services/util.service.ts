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
    // if(this.isMobile) {
    //   this.navigateToLoginWithMpin();
    //   return;
    // }else {
    //   this.navigateToLogin();
    // }
    
    this.navigateToLogin();
  }

  navigateToLogin() {

    let showLoginPage = true;

    const currentHref = window.location.href;

    const arrUrl = ["/static/", "/payments/thankpayment"];

    arrUrl.forEach(function(url) {
      if(currentHref.includes(url)){
        showLoginPage = false;
        console.log("showLoginPage....", showLoginPage);
        return;
      }
    });

    if(showLoginPage) {
      this.router.navigate(['/login']);
    }
  }
  
}
