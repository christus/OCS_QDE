import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { QdeHttpService } from './qde-http.service';

@Injectable()
export class GetApplicationPrintResolverService implements Resolve<Observable<any>> {

  constructor(private qdeHttp: QdeHttpService) { }
  resolve(route: ActivatedRouteSnapshot): Observable<any>{
    return this.qdeHttp.getApplictionPrint(route.params['applicationId']);
  }
}
