import { Injectable } from '@angular/core';
import Qde from '../models/qde.model';

@Injectable({
  providedIn: 'root'
})
export class QdeService {
  
  private qde: Qde;
  leads: Array<Qde>;

  constructor() {
    // Initialize Qde
    this.qde = {
      "application": {
        "ocsNumber": "",
        "applicants": [
          {
            "applicantId": "",
            "isMainApplicant": false,
          },
          {
            "applicantId": "",
            "isMainApplicant": false,
          }
        ],
        "references": {
          "referenceOne": {
            "relationShip": "",
            "title": "",
            "fullName": "",
            "mobileNumber": "",
            "addressLineOne": "",
            "addressLineTwo": ""
          },
          "referenceTwo": {
            "relationShip": "",
            "title": "",
            "fullName": "",
            "mobileNumber": "",
            "addressLineOne": "",
            "addressLineTwo": ""
          }
        }
      }
    };
  }

  getQde(): Qde {
    return this.qde; 
  }

  setOde(qde: Qde): void {
    this.qde = qde;
  }
}
