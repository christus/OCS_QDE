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
        "loanAmount": "",
        "tenure": "",
        "appId": "",
        "propertyIdentified": true,
        "applicants": [
          {
            "applicantId": "",
            "isMainApplicant": true,
            "isIndividual": null,
             "partnerRelationship": "",
            "maritalStatus": {
              "status": "",
              "spouseTitle": "",
              "firstName": "",
              "earning": true,
              "amount": null
            },
            "familyDetails": {
              "numberOfDependents": null,
              "fatherTitle": "",
              "fatherName": "",
              "motherTitle": "",
              "motherName": "",
              "motherMaidenName": ""
            },
            "other": {
              "religion": "",
              "category": ""
            },
            "occupation": {
              "occupationType": "",
              "companyName": "",
              "numberOfYearsInCurrentCompany": null,
              "totalWorkExperience": null
            },
            "pan": {
              "panNumber": "",
              "panImage": ""
            },
            "personalDetails": {
              "title": "",
              "firstName": "",
              "middleName": "",
              "lastName": "",
              "gender": "",
              "qualification": "",
              "dob": "",
              "birthPlace": ""
            },
            "contactDetails": {
              "preferredEmailId": "",
              "alternateEmailId" : "",
              "mobileNumber": null,
              "alternateMobileNumber": null,
              "residenceNumber": "",
              "alternateResidenceNumber": ""
            },
            "communicationAddress": {
              "residentialStatus" : "",
              "addressLineOne" : "",
              "addressLineTwo" : "",
              "zipcode" : "",
              "city" : "",
              "state" : "",
              "numberOfYearsInCurrentResidence" : "",
              "permanentAddress" : false
            },
            "permanentAddress": {
              "residentialStatus" : "",
              "addressLineOne" : "",
              "addressLineTwo" : "",
              "zipcode" : "",
              "city" : "",
              "state" : "",
              "numberOfYearsInCurrentResidence" : "",
              "permanentAddress" : false
            },
            "officialCorrespondence": {
              "addressLineOne" : "",
              "addressLineTwo" : "",
              "landMark" : "",
              "zipcode" : "",
              "city" : "",
              "officeNumber" : "",
              "officeEmailId" : "",
            },
            "organizationDetails": {
              "nameOfOrganization": "",
              "dateOfIncorporation": "",
              "constitution": ""
            },
            "registeredAddress": {
              "registeredAddress" : "",
              "landMark" : "",
              "zipcode" : null,
              "city" : "",
              "state" : ""
            },
            "corporateAddress": {
              "corporateAddress": "",
              "landMark": "",
              "zipcode": null,
              "city": "",
              "state": "",
              "stdNumber": "",
              "officeEmailId": ""
            },
            "revenueDetails": {
              "revenue": null,
              "annualNetIncome": null,
              "grossTurnOver": null
            },
            "documents": [
              {
                "documentType": "",
                "documentValue": ""
              },
              {
                "documentType": "",
                "documentValue": ""
              },
              {
                "documentType": "",
                "documentValue": ""
              }
            ]
          },
        ],
        "loanDetails": {
          "incomeDetails": {
            "annualFamilyIncome": "",
            "familMembersOwnHouse": true
            /*doubt*/
          },
          "loanAmount": {
            "amountRequired": null,
            "loanPurpose": "",
            "loanTenure": null
          },
          "property": {
            "propertyIdentifed": false,
            "propertyPincde": null,
            "addressLineOne": "",
            "addressLineTwo": "",
            "city": "",
            "state": ""
          },
          "existingLoans": {
            "loanProvider": "",
            "numberOfYears": null,
            "monthlyEmi": null
          }
        },
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



  /**
   * Filter Object with only filled values 
   */
  getFilteredJson(arg) {
    var a = arg.constructor == Object ? Object.entries(arg).map(([key, value]) => ({key, value}) ) : arg;

    var newObj = {};
  
    a.forEach((obj ,index) => {
      // Filter Empty Values
      if(obj.value == null || obj.value == undefined || obj.value == NaN) {
        delete obj.key;
        return;
      } else if(obj.value.constructor == String) {
        if(obj.value == "") {
         delete obj.key;
          return;
        } else {
          newObj[obj.key] = obj.value;
          return;
        }
      } else if(obj.value.constructor == Boolean) {
        if(obj.value == null) {
          delete obj.key;
          return;
        } else {
          newObj[obj.key] = obj.value;
          return;
        }
      }else if(obj.value.constructor == Number) {
        if(obj.value == null) {
          delete obj.key;
          return;
        } else {
          newObj[obj.key] = obj.value;
          return;
        }
      } else if(obj.value.constructor == Array) {
        if(obj.value.length == 0) {
          delete obj.key;
          return;
        } else {
          let f = obj.value.map((val) => {
            return this.getFilteredJson(val);
          });
          if(f.length == 0) {
            delete obj.key;
          } else {
            newObj[obj.key] = f;
          }
        }
      } else if(obj.value.constructor == Object) {
        if(Object.keys(obj.value).length == 0) {
          delete obj.key;
        } else {
          let f = this.getFilteredJson(obj.value)
          if(Object.keys(f).length == 0) {
            delete obj.key;
          } else {
            newObj[obj.key] = f;
          }
        }
      }
    });
  
    return newObj;    
  }
}
