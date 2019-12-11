import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import RequestEntity from '../models/request-entity.model';
import { HttpClient } from '@angular/common/http';
import { QdeHttpService } from './qde-http.service';

@Injectable({
  providedIn: 'root'
})
export class MinMaxLimitsResolverService implements Resolve<Observable<any>> {

  constructor(private qdeHttp: QdeHttpService) { }
  resolve(): any {
    const processId = environment.api.adminGetMinMax.processId;
    const workflowId = environment.api.adminGetMinMax.workflowId;
    const projectId = environment.projectId;

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

    return this.qdeHttp.callPost(
      workflowId, projectId,
      body
    );
  }

}
