import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { HttpParams, HttpClient } from '@angular/common/http';
import RequestEntity from '../models/request-entity.model';
import { environment } from 'src/environments/environment';
import { QdeHttpService } from './qde-http.service';

@Injectable()
export class AdminGetEachLovResolverService implements Resolve<Observable<any>> {

  constructor(private http: HttpClient,
    private qdeHttp: QdeHttpService) { }

  resolve(_route: ActivatedRouteSnapshot): any {
    const processId   = environment.api.adminGetEachLov.processId;
    const workflowId  = environment.api.adminGetEachLov.workflowId;
    const projectId   = environment.projectId;

    let tableName = _route.params['eachLovName'];

    let qdeRequestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: {
        tableName: tableName,
        userId: parseInt(localStorage.getItem('userId'))
      },
      workflowId: workflowId,
      projectId: projectId
    };

    const body = {
      'processVariables':
      JSON.stringify(qdeRequestEntity)
    };

    return this.qdeHttp.callPost(
      workflowId, projectId,
      body
    );
  }
}
