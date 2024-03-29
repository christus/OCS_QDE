import { Injectable } from '@angular/core';
import RequestEntity from '../models/request-entity.model';
import { HttpParams, HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { QdeHttpService } from './qde-http.service';

@Injectable({
  providedIn: 'root'
})
export class BirthPlaceResolverService implements Resolve<Observable<any>>{

  constructor(private http : HttpClient,
    private qdeHttp: QdeHttpService) { }

  resolve(): any {
    const processId = environment.api.birthPlace.processId;
    const workflowId = environment.api.birthPlace.workflowId;
    const projectId = environment.projectId;


    let qdeRequestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: {
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
