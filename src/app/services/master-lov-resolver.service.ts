import { Injectable } from '@angular/core';
import { RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import RequestEntity from '../models/request-entity.model';
import { HttpParams, HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class MasterLovResolverService  implements Resolve<Observable<any>>  {

  constructor(private http: HttpClient) { }

  resolve(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): any {
    const processId   = environment.api.adminGetEachLov.processId;
    const workflowId  = environment.api.adminGetEachLov.workflowId;
    const projectId   = environment.projectId;

    let tableName;

    if(_route.url[1]['path'] == 'zipcode') {
      tableName = 'zipcode';
    }

    let qdeRequestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: {
        tableName: tableName,
        userId: parseInt(localStorage.getItem('userId')),
        currentPage: _route.queryParams['currentPage'] ? parseInt(_route.queryParams['currentPage']): 1,
        perPage: _route.queryParams['perPage'] ? parseInt(_route.queryParams['perPage']): 10,
      },
      workflowId: workflowId,
      projectId: projectId
    };

    const body = new HttpParams().set(
      "processVariables",
      JSON.stringify(qdeRequestEntity)
    );

    let uri = environment.host + "/d/workflows/" + workflowId + "/execute?projectId=" + projectId;
    return this.http.post(
      uri,
      body.toString()
    );
  }
}
