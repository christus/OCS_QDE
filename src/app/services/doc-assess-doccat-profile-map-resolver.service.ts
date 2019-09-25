import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { HttpParams, HttpClient } from '@angular/common/http';
import RequestEntity from '../models/request-entity.model';
import { environment } from 'src/environments/environment';
import { QdeHttpService } from './qde-http.service';

@Injectable()
export class DocAssessDoccatProfileMapResolverService implements Resolve<Observable<any>> {

  constructor(private http: HttpClient,
    private qdeHttp: QdeHttpService) { }

  resolve(_route: ActivatedRouteSnapshot): any {
    const processId   = environment.api.adminDocumentProfile.processId;
    const workflowId  = environment.api.adminDocumentProfile.workflowId;
    const projectId   = environment.projectId;

    let tableName = _route.params['eachLovName'];

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
