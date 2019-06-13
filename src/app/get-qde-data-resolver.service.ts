import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { QdeHttpService } from './services/qde-http.service';
import { QdeService } from './services/qde.service';
import Qde from './models/qde.model';

@Injectable({
  providedIn: 'root'
})
export class GetQdeDataResolverService implements Resolve<Qde> {

  constructor(private qdeHttp: QdeHttpService, private qdeService: QdeService) { }

  resolve(route: ActivatedRouteSnapshot): Qde {
    let qdeData: Qde;
    this.qdeHttp.getQdeData(route.params['applicationId']).subscribe(response => {
      console.log("RESPONSE ", response);
      let result = JSON.parse(response["ProcessVariables"]["response"]);
      
      qdeData = result;
    });

    return qdeData;
  }
}
