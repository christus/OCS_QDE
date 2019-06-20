import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { QdeHttpService } from './services/qde-http.service';
import { QdeService } from './services/qde.service';
import Qde from './models/qde.model';

@Injectable()
export class GetQdeDataResolverService implements Resolve<Observable<any>> {

  constructor(private qdeHttp: QdeHttpService, private qdeService: QdeService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {

    return this.qdeHttp.getQdeData(route.params['applicationId']);
  }
}
