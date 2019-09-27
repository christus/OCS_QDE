import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UtilService } from '../services/util.service';
import { environment } from '../../environments/environment';
import { MobileService } from '../services/mobile-constant.service';


@Injectable({
  providedIn: "root"
})
export class AuthGuard implements CanActivate {

  isMobile:any;

  constructor(private router: Router, private utilService: UtilService,
    private mobileService: MobileService) {
    this.isMobile = this.mobileService.isMobile;
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
