import { Injectable } from '@angular/core';
import Qde from '../models/qde.model';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import RequestEntity, { RequestBody } from '../models/request-entity.model';

@Injectable({
  providedIn: "root"
})
export class QdeHttpService {

  qdeRequestEntity: RequestEntity = {
    processId: "0e5efe06762811e982270242ac110003",
    ProcessVariables: {
      request: ""
    },
    workflowId: "0e40a79e762811e982270242ac110003",
    projectId: "ff8e364e6fce11e98754782bcb8f3845"
  };

  constructor(private http: HttpClient) {}

  /**
   * Create or update PAN Details
   */
  createOrUpdatePanDetails(qde: Qde) {
    this.qdeRequestEntity.ProcessVariables.request = JSON.stringify(qde);

    console.log(">>", this.qdeRequestEntity);

    const body = new HttpParams().set(
      "processVariables",
      JSON.stringify(this.qdeRequestEntity)
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
}
