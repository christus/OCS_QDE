import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { QdeHttpService } from './qde-http.service';
@Injectable()
export class AdminRoleLovsResolverService implements Resolve<Observable<any>> {
    activityList ;
    constructor(
      private qdeHttp: QdeHttpService) { }
  
    resolve(_route: ActivatedRouteSnapshot): any {       
     
    //   this.getActivityList();
      console.log("adminGetLov",this.activityList);
      return this.activityList = this.qdeHttp.adminGetLov();
    }
  
    getActivityList(){      
      this.qdeHttp.adminGetLov().subscribe(res=>{
        // console.log("adminGetLov",JSON.parse(res['ProcessVariables']['lovs']))
       return JSON.parse(res['ProcessVariables']['lovs']).LOVS["activity"];
      })
    }
  }
  
