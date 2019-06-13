import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { QdeHttpService } from './services/qde-http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetCoApplicantsResolverService implements Resolve<Observable<any>> {

  constructor(private qdeHttp: QdeHttpService) { }

  resolve(route: ActivatedRouteSnapshot) {
    let coApplicants;

    this.qdeHttp.getQdeData(route.params['applicationId']).subscribe(response => {
      console.log("RESPONSE ", response);
      let result = JSON.parse(response["ProcessVariables"]["response"]);

      coApplicants = result['application']['applicants'].filter(v => v.isMainApplicant == false);
    });

    return coApplicants;
  }
}
