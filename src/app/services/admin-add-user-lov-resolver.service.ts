import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { HttpParams, HttpClient } from '@angular/common/http';
import RequestEntity from '../models/request-entity.model';
import { environment } from 'src/environments/environment';
import { QdeHttpService } from './qde-http.service';

@Injectable({
  providedIn: 'root'
})
export class AdminAddUserLovResolverService  implements Resolve<Observable<any>>{
  constructor(private http: HttpClient,
    private qdeHttp: QdeHttpService) { }

  resolve(_route: ActivatedRouteSnapshot): any {
    const processId = environment.api.adminUserLOV.processId;
    const workflowId = environment.api.adminUserLOV.workflowId;
    const projectId   = environment.projectId;

    const requestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: {},
      workflowId: workflowId,
      projectId: projectId
    };

    const body = {
      'processVariables':
      JSON.stringify(requestEntity)
    };

    let uri = environment.host + "/d/workflows/" + workflowId + "/v2/execute?projectId=" + projectId;
    return this.qdeHttp.callPost(
      uri,
      body
    );
  }

}
