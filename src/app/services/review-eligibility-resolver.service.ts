import { Injectable } from '@angular/core';
import RequestEntity from '../models/request-entity.model';
import { HttpParams, HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { QdeHttpService } from './qde-http.service';

@Injectable()
export class ReviewEligibilityResolverService {

  constructor(private http: HttpClient,
    private qdeHttp: QdeHttpService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {

    const processId = environment.api.reviewEligibility.processId;
    const workflowId = environment.api.reviewEligibility.workflowId;
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
  
    let uri = environment.host + "/d/workflows/" + workflowId + "/execute?projectId=" + projectId;
    return this.qdeHttp.callPost(
      uri,
      body
    );
  }
}
