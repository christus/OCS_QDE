import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DeviceDetectorService } from 'ngx-device-detector';

import { QdeHttpService } from 'src/app/services/qde-http.service';



@Injectable({providedIn: "root"})
export class UtilService {
  isMobile:any;

  constructor(private router: Router, private http: HttpClient,
    private qdehttpService: QdeHttpService,
    private deviceService: DeviceDetectorService) { 
    this.isMobile = this.deviceService.isMobile() ;
    this.qdehttpService = qdehttpService;
  }

  isLoggedIn() {
    let loggedIn = false;
    if (localStorage.getItem('token')) {
      loggedIn = true;
    }

    return loggedIn;
  }

  logout() {
    const headers = new HttpHeaders({
      Accept: 'text/html,application/xhtml+xml,application/xml',
      "Access-Control-Allow-Origin": "*"
    });

    const options = { headers: headers };
    let uri = environment.host + "/account/logout";
    return this.http.get(uri, options);
  }

  clearCredentials() {
    localStorage.removeItem('token');

    // if(this.isMobile) {
    //   this.navigateToLoginWithMpin();
    //   return;
    // }   
    this.navigateToLogin();
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToLoginWithMpin() {
    
   let isFirstTime = localStorage.getItem("firstTime");

   if(isFirstTime == null) {

    let data = {
      'email': "icici@icici.com",
      'password': 'icici@123',
      'longTimeToken': "true"
    }
  
    this.qdehttpService.longLiveAuthenticate(data).subscribe(
      res => {
        console.log(res);
        localStorage.setItem("token", res["token"] ? res["token"] : "");

        this.router.navigate(['/setPin']);

      },
      error => {
        console.log(error);
      }
    );

    return;
   }

    this.router.navigate(['/loginWithPin']);
  }
}
