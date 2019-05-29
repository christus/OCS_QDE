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
}
