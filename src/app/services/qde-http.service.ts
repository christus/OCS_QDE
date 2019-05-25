import { Injectable } from '@angular/core';
import Qde from '../models/qde.model';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import RequestEntity from '../models/request-entity.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: "root"
})
export class QdeHttpService {

  constructor(private http: HttpClient) {}

  /**
   * Create or update PAN Details
   */
  createOrUpdatePanDetails(qde: Qde) {

    let qdeRequestEntity: RequestEntity = {
      processId: "0e5efe06762811e982270242ac110003",
      ProcessVariables: {
        request: JSON.stringify(qde)
      },
      workflowId: "0e40a79e762811e982270242ac110003",
      projectId: "3209f7ea7ba811e982270242ac110002"
    };

    const body = new HttpParams().set(
      "processVariables",
      JSON.stringify(qdeRequestEntity)
    );

    return this.http.post(
      "/appiyo/d/workflows/0e40a79e762811e982270242ac110003/execute",
      body.toString(),
      {
        headers: new HttpHeaders().set(
          "Content-Type",
          "application/x-www-form-urlencoded"
        ),
        params: new HttpParams().set(
          "projectId",
          "3209f7ea7ba811e982270242ac110002"
        )
      }
    );
  }

  createOrUpdatePersonalDetails(qde: Qde) {

    let qdeRequestEntity: RequestEntity = {
      processId: "0e5efe06762811e982270242ac110003",
      ProcessVariables: {
        request: JSON.stringify(qde)
      },
      workflowId: "0e40a79e762811e982270242ac110003",
      projectId: "3209f7ea7ba811e982270242ac110002"
    };

    const body = new HttpParams().set(
      "processVariables",
      JSON.stringify(qdeRequestEntity)
    );

    return this.http.post(
      "/appiyo/d/workflows/0e40a79e762811e982270242ac110003/execute",
      body.toString(),
      {
        headers: new HttpHeaders().set(
          "Content-Type",
          "application/x-www-form-urlencoded"
        ),
        params: new HttpParams().set(
          "projectId",
          "3209f7ea7ba811e982270242ac110002"
        )
      }
    );
  }

  authenticate(data: any) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Access-Control-Allow-Origin': '*'
    });

    const options = { headers: headers };

    const body = new HttpParams()
      .set('email', data.email)
      .set('password', data.password);

    return this.http.post('/appiyo/account/login', body, options);
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

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Access-Control-Allow-Origin': '*'
    });
    const options = { headers: headers };
  
    let uri = '/appiyo/d/workflows/' + workflowId + '/execute?projectId=' + projectId;
    return this.http.put(
      uri,
      body,
      options
    );
  }

  isLoggednIn() {
    let loggedIn = false;
    if (localStorage.getItem('token')) {
      loggedIn = true;
    }

    return loggedIn;

  }
}
