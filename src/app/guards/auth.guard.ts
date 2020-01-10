import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UtilService } from '../services/util.service';
import { environment } from '../../environments/environment';
import { MobileService } from '../services/mobile-constant.service';
import { CommonDataService } from '../services/common-data.service';
import { QdeHttpService } from '../services/qde-http.service';


@Injectable({
  providedIn: "root"
})
export class AuthGuard implements CanActivate {

  isMobile:any;
  cdsStatus
  constructor(private router: Router, private utilService: UtilService,
    private mobileService: MobileService,
    private cds: CommonDataService,
    private qdehttpService: QdeHttpService) {
    this.isMobile = this.mobileService.isMobile;
    this.cds.cdsStatus$.subscribe(value => 
      this.cdsStatus = value
      )
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {

    if (this.utilService.isLoggedIn()) {
      
      return new Observable<boolean> (observer => {
        console.log("cds Status", this.cdsStatus);
            let data = {"userId":localStorage.getItem("userId")}; 
            if (!this.cdsStatus){
        this.qdehttpService.userActivityMapping(data).subscribe(res => {
          console.log("user mapping", res)
          if(res["ProcessVariables"]["status"]){
            if (res["ProcessVariables"]["userActivityList"] && res["ProcessVariables"]["userActivityList"]!=null){
            this.cds.changeIsAdmin(res["ProcessVariables"]["isAdmin"]);
            this.cds.checkUserMapping(res["ProcessVariables"]["userActivityList"],res["ProcessVariables"]["userName"]);
              }
              else{
                this.cds.setErrorData(true,"DYN001","User Activity Not Defined");
                this.utilService.clearCredentials();
                // return false
              }
            observer.next(true);
          }           
          // observer.next(true);
        });  
       
      } else{
        observer.next(true);
      }        
       
      });


      // return true;
    } else {

      // if(this.isMobile) {
      //   this.utilService.navigateToLoginWithMpin();
      //   return;
      // }


      this.utilService.navigateToLogin();
      return false;
    }
  }
}
