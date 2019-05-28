import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanDeactivate } from '@angular/router';
import { LeadsListComponent } from '../applicant-dashboard/leads-list/leads-list.component';

@Injectable({
  providedIn: 'root'
})

@Injectable()
export class ConfirmDeactivateGuard implements CanDeactivate<LeadsListComponent> {

  canDeactivate(
    component: LeadsListComponent,
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {

    // console.log("State Url: " + state);
    // console.log('Route Url: ' + route);
    // console.log(document.referrer);
    // console.log(window.location);

    if (window.location.pathname == "/" || window.location.pathname == "/login" ) {

      if (component.isloggedIn()) {
        const result = window.confirm("Are you sure? you want to exit!");
        if (!result) {
          return false;
        }
        // else {
        //   return false;
        // }
      }
      // else {
      //   return true;
      // }
      component.clearCredentials();
    }
    // else {
    //   return true;
    // }
    
    return true;
  }
}
