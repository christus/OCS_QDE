import { Injectable } from '@angular/core';
import { RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import RequestEntity from '../models/request-entity.model';
import { HttpParams, HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { QdeHttpService } from './qde-http.service';

@Injectable()
export class GeneralLovsService implements Resolve<Observable<any>> {

  constructor(private http: HttpClient,
    private qdeHttp: QdeHttpService) { }

  resolve(): any {
    const processId = environment.api.adminStatesZonesLovs.processId;
    const workflowId = environment.api.adminStatesZonesLovs.workflowId;
    const projectId = environment.projectId;

    let qdeRequestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: {
        userId: parseInt(localStorage.getItem('userId'))
      },
      workflowId: workflowId,
      projectId: projectId
    };

    const body = {
      'processVariables':
      JSON.stringify(qdeRequestEntity)
    };

    let uri = environment.host + "/d/workflows/" + workflowId + "/execute?projectId=" + projectId;
    return this.qdeHttp.callPost(
      uri,
      body
    );
  }
}
