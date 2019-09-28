import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ActivatedRouteSnapshot } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import RequestEntity from '../models/request-entity.model';
import { QdeHttpService } from './qde-http.service';

@Injectable()
export class ApplicationRelationshipResolverService {


  constructor(private http: QdeHttpService) { }

  resolve(_route: ActivatedRouteSnapshot): any {

    return this.http.adminApplicantRelationship();
  }
}
