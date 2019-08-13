import { Injectable } from '@angular/core';
import RequestEntity from '../models/request-entity.model';
import { environment } from '../../environments/environment';
import { HttpParams, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Resolve } from '@angular/router';

@Injectable()
export class LoanTypePurposeMapResolverService implements Resolve<Observable<any>> {


  constructor(private http: HttpClient) { }

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
