import { Injectable } from '@angular/core';
import RequestEntity from '../models/request-entity.model';
import { HttpParams, HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ListOfValuesResolverService {

  constructor(private http : HttpClient) { }

  // Get Data from API
  resolve(): any {
    let qdeRequestEntity: RequestEntity = {
      processId: "6569b6d6762911e982270242ac110003",
      ProcessVariables: {
      },
      workflowId: "5f28d48c808311e982270242ac110002",
      projectId: "ff8e364e6fce11e98754782bcb8f3845"
    };

    const body = new HttpParams().set(
      "processVariables",
      JSON.stringify(qdeRequestEntity)
    );

    return this.http.post(
      "/appiyo/d/workflows/1d28844c72f011e982270242ac110003/execute?projectId=ff8e364e6fce11e98754782bcb8f3845",
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
