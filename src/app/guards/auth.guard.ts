import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UtilService } from '../services/util.service';
import { DeviceDetectorService } from 'ngx-device-detector';


@Injectable({
  providedIn: "root"
})
export class AuthGuard implements CanActivate {

  isMobile:any;

  constructor(private router: Router, private utilService: UtilService, private deviceService: DeviceDetectorService) {
    this.isMobile = this.deviceService.isMobile() ;
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {

    if (this.utilService.isLoggedIn()) {
      return true;
    } else {

      if(this.isMobile) {
        this.utilService.navigateToLoginWithMpin();
        return;
      }


      this.utilService.navigateToLogin();
      return false;
    }
  }
}
