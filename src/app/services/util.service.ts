import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DeviceDetectorService } from 'ngx-device-detector';

import { QdeHttpService } from 'src/app/services/qde-http.service';
import { MobileService } from './mobile-constant.service';
import { CommonDataService } from './common-data.service';
import { Observable } from 'rxjs';



@Injectable({providedIn: "root"})
export class UtilService {
  isMobile:any;

  constructor(private router: Router, private http: HttpClient,
    private qdehttpService: QdeHttpService,
    private mobileService: MobileService,
    private cds: CommonDataService) { 
    this.isMobile = this.mobileService.isMobile;

    console.log("isMobile-utils", this.isMobile);
    this.qdehttpService = qdehttpService;
  }

  isLoggedIn() {
    let loggedIn = false;
    if (localStorage.getItem('token')) {  
      // let data = {"userId":localStorage.getItem("userId")}; 
      // this.qdehttpService.userActivityMapping(data).subscribe(res => {
      //   console.log("user mapping", res)
      //   if(res["ProcessVariables"]["status"]){
      //     this.cds.checkUserMapping(res["ProcessVariables"]["userActivityList"]);
         
      //   }
        
      // });  
     
      // this.cds.checkUserMapping(data);
      loggedIn = true;
      //   return new Observable<boolean> (observer => {
      //     let data = {"userId":localStorage.getItem("userId")}; 
      // this.qdehttpService.userActivityMapping(data).subscribe(res => {
      //   console.log("user mapping", res)
      //   if(res["ProcessVariables"]["status"]){
      //     this.cds.checkUserMapping(res["ProcessVariables"]["userActivityList"]);
      //     observer.next(true);
      //   }        
      // });   
      
      
      //   });
      

    }
    return loggedIn;
  

    
  }

  
  clearCredentials() {
    this.qdehttpService.logout().subscribe(
      res => {
      },
      error => {
      }
    );
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
