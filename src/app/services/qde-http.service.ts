import { Injectable } from '@angular/core';
import Qde from '../models/qde.model';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import RequestEntity from '../models/request-entity.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QdeHttpService {

  constructor(private http: HttpClient) {}

  /**
   * Create or update PAN Details
   */
  createOrUpdatePanDetails(qde: Qde) {
    const qdeRequestEntity: RequestEntity = {
      processId: '0e5efe06762811e982270242ac110003',
      ProcessVariables: {
        request: JSON.stringify(qde)
      },
      workflowId: '0e40a79e762811e982270242ac110003',
      projectId: 'ff8e364e6fce11e98754782bcb8f3845'
    };

    const body = new HttpParams().set(
      'processVariables',
      JSON.stringify(qdeRequestEntity)
    );

    return this.http.post(
      '/appiyo/d/workflows/0e40a79e762811e982270242ac110003/execute',
      body.toString(),
      {
        headers: new HttpHeaders().set(
          'Content-Type',
          'application/x-www-form-urlencoded'
        ),
        params: new HttpParams().set(
          'projectId',
          'ff8e364e6fce11e98754782bcb8f3845'
        )
      }
    );
  }

  createOrUpdatePersonalDetails(qde: Qde) {
    const qdeRequestEntity: RequestEntity = {
      processId: '0e5efe06762811e982270242ac110003',
      ProcessVariables: {
        request: JSON.stringify(qde)
      },
      workflowId: '0e40a79e762811e982270242ac110003',
      projectId: 'ff8e364e6fce11e98754782bcb8f3845'
    };

    const body = new HttpParams().set(
      'processVariables',
      JSON.stringify(qdeRequestEntity)
    );

    return this.http.post(
      '/appiyo/d/workflows/0e40a79e762811e982270242ac110003/execute',
      body.toString(),
      {
        headers: new HttpHeaders().set(
          'Content-Type',
          'application/x-www-form-urlencoded'
        ),
        params: new HttpParams().set(
          'projectId',
          'ff8e364e6fce11e98754782bcb8f3845'
        )
      }
    );
  }

  authenticate(data: any) {

    const body = new HttpParams()
      .set('email', data.email)
      .set('password', data.password);

    return this.http.post('/appiyo/account/login', body);
  }

  getLeads() {
    const processId = environment.api.dashboard.processId;
    const workflowId = environment.api.dashboard.workflowId;
    const projectId = environment.projectId;

    const requestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: {},
      workflowId: workflowId,
      projectId: projectId
    };

    const body = new HttpParams().set(
      'processVariables',
      JSON.stringify(requestEntity)
    );
  
    let uri = '/appiyo/d/workflows/' + workflowId + '/execute?projectId=' + projectId;
    return this.http.put(uri, body);
  }
}
