import { Injectable } from '@angular/core';
import RequestEntity from '../models/request-entity.model';
import { environment } from '../../environments/environment';
import { HttpParams, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Resolve } from '@angular/router';
import { QdeHttpService } from './qde-http.service';

@Injectable()
export class LoanTypePurposeMapResolverService implements Resolve<Observable<any>> {


  constructor(private http: HttpClient,
    private qdeHttp: QdeHttpService) { }

  resolve(): any {
    const processId   = environment.api.adminLoanTypePurposeMap.processId;
    const workflowId  = environment.api.adminLoanTypePurposeMap.workflowId;
    const projectId   = environment.projectId;

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

    let uri = environment.host + "/d/workflows/" + workflowId + "/v2/execute?projectId=" + projectId;
    return this.qdeHttp.callPost(
      uri,
      body
    );
  }
}
