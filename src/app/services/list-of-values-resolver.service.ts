import { Injectable } from '@angular/core';
import RequestEntity from '../models/request-entity.model';
import { HttpParams, HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ListOfValuesResolverService {

  constructor(private http : HttpClient) { }

  // Get Data from API
  resolve(): any {

    const processId = environment.api.lov.processId;
    const workflowId = environment.api.lov.workflowId;
    const projectId = environment.projectId;


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

    return this.http.post(
      "/appiyo/d/workflows/" + workflowId + "/execute?projectId=" + projectId,
      body.toString()
    );
  }
}
