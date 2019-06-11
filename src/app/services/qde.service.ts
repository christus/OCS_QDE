import { Injectable } from '@angular/core';
import Qde from '../models/qde.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QdeService {

  private qde: Qde;
  leads: Array<Qde>;
  private defaultValue: Qde =  {
    "application": {
      "ocsNumber": "",
      "loanAmount": "",
      "tenure": "",
      "applicationId": "",
      "propertyIdentified": null,
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
            "earning": null,
            "amount": null,
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
            "panImage": "",
            "docType": null,
            "docNumber": ""
          },
          "personalDetails": {
            "title": "",
            "firstName": "",
            "middleName": "",
            "lastName": "",
            "gender": "",
            "qualification": "",
            "dob": "",
            "birthPlace": "",
            "applicantStatus" : ""
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
            "cityState": "",
            "numberOfYearsInCurrentResidence" : "",
            "permanentAddress" : null,
            "preferredMailingAddress": null
          },
          "permanentAddress": {
            "residentialStatus" : "",
            "addressLineOne" : "",
            "addressLineTwo" : "",
            "zipcode" : "",
            "city" : "",
            "state" : "",
            "cityState": "",
            "numberOfYearsInCurrentResidence" : "",
            "permanentAddress" : null,
            "preferredMailingAddress": null
          },
          "residentialAddress": {
            "residentialStatus" : "",
            "addressLineOne" : "",
            "addressLineTwo" : "",
            "zipcode" : "",
            "city" : "",
            "state" : "",
            "cityState": "",
            "numberOfYearsInCurrentResidence" : "",
            "permanentAddress" : null
          },
          "officialCorrespondence": {
            "addressLineOne": "",
            "addressLineTwo": "",
            "landMark": "",
            "zipcode": "",
            "city": "",
            "state": "",
            "officeNumber": "",
            "officeEmailId": "",
            "cityState": "",
            "zipCityStateID": "",
          },
          "organizationDetails": {
            "nameOfOrganization": "",
            "dateOfIncorporation": "",
            "constitution": ""
          },
          "registeredAddress": {
            "registeredAddress" : "",
            "landMark" : "",
            "zipcode" : "",
            "city" : "",
            "state" : ""
          },
          "corporateAddress": {
            "corporateAddress": "",
            "landMark": "",
            "zipcode": "",
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
          "incomeDetails": {
            "annualFamilyIncome" : "",
            "monthlyExpenditure" : "",
            "incomeConsider": null,
            "monthlyIncome": "",
            "assessmentMethodology": "",
            "puccaHouse": null
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
          "monthlyExpenditure": "",
          "incomeConsider": null,
          "monthlyIncome": "",
          "assessmentMethodology": "",
          "puccaHouse": null
        },
        "loanAmount": {
          "amountRequired": null,
          "loanPurpose": "",
          "loanTenure": null,
          "loanType": null
        },
        "property": {
          "propertyIdentifed": null,
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

  private qdeSource$: BehaviorSubject<Qde>;
  public qdeSource: Observable<Qde>;

  constructor() {
    // Initialize Qde
    this.qde = this.defaultValue;

    this.qdeSource$ = new BehaviorSubject<Qde>(this.qde);
    this.qdeSource = this.qdeSource$.asObservable();
  }

  getQde(): Qde {
    return this.qde;
  }

  setQde(qde: Qde): void {
    this.qde = qde;
    this.qdeSource$.next(qde);
  }



  /**
   * Filter Object with only filled values 
   */
  getFilteredJson(arg) {
    var a = arg.constructor == Object ? Object.entries(arg).map(([key, value]) => ({key, value}) ) : arg;

    var newObj = {};
  
    a.forEach((obj ,index) => {

      // Exception Keys
      if(obj.key in ['ocsNumber', 'applicationId', 'isMainApplicant']) {
        return;
      }
      // Filter Empty Values
      else if(obj.value == null || obj.value == undefined || obj.value == NaN) {
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

  addNewCoApplicant() {
    this.qde.application.applicants.push({
      "applicantId": "",
      "isMainApplicant": false,
      "isIndividual": null,
      "partnerRelationship": "",
      "maritalStatus": {
        "status": "",
        "spouseTitle": "",
        "firstName": "",
        "earning": null,
        "amount": null,
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
        "panImage": "",
        "docType": null,
        "docNumber": ""
      },
      "personalDetails": {
        "title": "",
        "firstName": "",
        "middleName": "",
        "lastName": "",
        "gender": "",
        "qualification": "",
        "dob": "",
        "birthPlace": "",
        "applicantStatus" : ""
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
        "cityState": "",
        "numberOfYearsInCurrentResidence" : "",
        "permanentAddress" : null,
        "preferredMailingAddress": null
      },
      "permanentAddress": {
        "residentialStatus" : "",
        "addressLineOne" : "",
        "addressLineTwo" : "",
        "zipcode" : "",
        "city" : "",
        "state" : "",
        "cityState": "",
        "numberOfYearsInCurrentResidence" : "",
        "permanentAddress" : null,
        "preferredMailingAddress": null
      },
      "residentialAddress": {
        "residentialStatus" : "",
        "addressLineOne" : "",
        "addressLineTwo" : "",
        "zipcode" : "",
        "city" : "",
        "state" : "",
        "cityState": "",
        "numberOfYearsInCurrentResidence" : "",
        "permanentAddress" : null
      },
      "officialCorrespondence": {
        "addressLineOne": "",
        "addressLineTwo": "",
        "landMark": "",
        "zipcode": "",
        "city": "",
        "state": "",
        "officeNumber": "",
        "officeEmailId": "",
        "cityState": "",
        "zipCityStateID": "",
      },
      "organizationDetails": {
        "nameOfOrganization": "",
        "dateOfIncorporation": "",
        "constitution": ""
      },
      "registeredAddress": {
        "registeredAddress" : "",
        "landMark" : "",
        "zipcode" : "",
        "city" : "",
        "state" : ""
      },
      "corporateAddress": {
        "corporateAddress": "",
        "landMark": "",
        "zipcode": "",
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
      "incomeDetails": {
        "annualFamilyIncome" : "",
        "monthlyExpenditure" : "",
        "incomeConsider": null,
        "monthlyIncome": "",
        "assessmentMethodology": "",
        "puccaHouse": null
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
    });

    this.setQde(this.qde);
  }

  resetQde() {
    this.setQde({
      "application": {
        "ocsNumber": " ",
        "loanAmount": "",
        "tenure": "",
        "applicationId": "",
        "propertyIdentified": null,
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
              "earning": null,
              "amount": null,
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
              "panImage": "",
              "docType": null,
              "docNumber": ""
            },
            "personalDetails": {
              "title": "",
              "firstName": "",
              "middleName": "",
              "lastName": "",
              "gender": "",
              "qualification": "",
              "dob": "",
              "birthPlace": "",
              "applicantStatus" : ""
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
              "cityState": "",
              "numberOfYearsInCurrentResidence" : "",
              "permanentAddress" : null,
              "preferredMailingAddress": null
            },
            "permanentAddress": {
              "residentialStatus" : "",
              "addressLineOne" : "",
              "addressLineTwo" : "",
              "zipcode" : "",
              "city" : "",
              "state" : "",
              "cityState": "",
              "numberOfYearsInCurrentResidence" : "",
              "permanentAddress" : null,
              "preferredMailingAddress": null
            },
            "residentialAddress": {
              "residentialStatus" : "",
              "addressLineOne" : "",
              "addressLineTwo" : "",
              "zipcode" : "",
              "city" : "",
              "state" : "",
              "cityState": "",
              "numberOfYearsInCurrentResidence" : "",
              "permanentAddress" : null
            },
            "officialCorrespondence": {
              "addressLineOne": "",
              "addressLineTwo": "",
              "landMark": "",
              "zipcode": "",
              "city": "",
              "state": "",
              "officeNumber": "",
              "officeEmailId": "",
              "cityState": "",
              "zipCityStateID": "",
            },
            "organizationDetails": {
              "nameOfOrganization": "",
              "dateOfIncorporation": "",
              "constitution": ""
            },
            "registeredAddress": {
              "registeredAddress" : "",
              "landMark" : "",
              "zipcode" : "",
              "city" : "",
              "state" : ""
            },
            "corporateAddress": {
              "corporateAddress": "",
              "landMark": "",
              "zipcode": "",
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
            "incomeDetails": {
              "annualFamilyIncome" : "",
              "monthlyExpenditure" : "",
              "incomeConsider": null,
              "monthlyIncome": "",
              "assessmentMethodology": "",
              "puccaHouse": null
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
            "monthlyExpenditure": "",
            "incomeConsider": null,
            "monthlyIncome": "",
            "assessmentMethodology": "",
            "puccaHouse": null
          },
          "loanAmount": {
            "amountRequired": null,
            "loanPurpose": "",
            "loanTenure": null,
            "loanType": null
          },
          "property": {
            "propertyIdentifed": null,
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
    });
  }
}
