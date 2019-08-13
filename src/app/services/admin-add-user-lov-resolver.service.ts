import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { HttpParams, HttpClient } from '@angular/common/http';
import RequestEntity from '../models/request-entity.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminAddUserLovResolverService  implements Resolve<Observable<any>>{
  constructor(private http: HttpClient) { }

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

    const body = new HttpParams().set(
      "processVariables",
      JSON.stringify(requestEntity)
    );

    let uri = environment.host + "/d/workflows/" + workflowId + "/execute?projectId=" + projectId;
    return this.http.post(
      uri,
      body.toString()
    );
  }

}