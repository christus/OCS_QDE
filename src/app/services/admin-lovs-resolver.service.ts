import { Injectable } from '@angular/core';
import RequestEntity from '../models/request-entity.model';
import { environment } from 'src/environments/environment';
import { HttpParams, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Resolve } from '@angular/router';

@Injectable()
export class AdminLovsResolverService implements Resolve<Observable<any>> {

  constructor(private http: HttpClient) { }

  resolve(): any {
    const processId   = environment.api.adminListOfValues.processId;
    const workflowId  = environment.api.adminListOfValues.workflowId;
    const projectId   = environment.projectId;

    let qdeRequestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: {
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