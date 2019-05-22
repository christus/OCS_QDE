import { Injectable } from '@angular/core';
import { Resolve, ActivatedRoute, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import Qde from '../models/qde.model';

@Injectable({
  providedIn: 'root'
})
export class QdeResolver implements Resolve<Qde> {

  constructor() { }

  // Get Data from API
  resolve(): Qde {
    return {
      application: {
        ocsNumber: "",
        applicants: [{isMainApplicant: true}]
      }
    };
  }
}