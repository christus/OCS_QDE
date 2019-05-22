import { Injectable } from '@angular/core';
import Qde from '../models/qde.model';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import RequestEntity from '../models/request-entity.model';

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
      projectId: "ff8e364e6fce11e98754782bcb8f3845"
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
          "ff8e364e6fce11e98754782bcb8f3845"
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
      projectId: "ff8e364e6fce11e98754782bcb8f3845"
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
          "ff8e364e6fce11e98754782bcb8f3845"
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
}
