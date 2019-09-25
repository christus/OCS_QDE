import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UtilService } from '../services/util.service';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: "root"
})
export class AuthGuard implements CanActivate {

  isMobile:any;

  constructor(private router: Router, private utilService: UtilService) {
    this.isMobile = environment.isMobile;
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
