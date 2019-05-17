import { Injectable } from '@angular/core';
import Qde from '../models/qde.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import RequestEntity, { RequestBody } from '../models/request-entity.model';

@Injectable({
  providedIn: 'root'
})
export class QdeHttpService {

  qdeRequestEntity: RequestEntity = {
    processId : '',
    ProcessVariables : {

      request: {
        application: {
          ocsNumber: ''
        } 
      }

    },
    workflowId : '',
    projectId : ""
  };

  constructor(private http: HttpClient) { }

  /**
   * Create or update PAN Details
   */
  createOrUpdatePanDetails(qde: Qde) {
    this.qdeRequestEntity.ProcessVariables.request = qde;

    return this.http.post('/api/dude', {"processVariables" : JSON.stringify(this.qdeRequestEntity)}, {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    });
  }
}
