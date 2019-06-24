import { Injectable } from '@angular/core';
import Qde, { Applicant } from '../models/qde.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QdeService {

  qde: Qde;
  leads: Array<Qde>;
  defaultValue: Qde = {
    application: {
      ocsNumber: "",
      loanAmount: "",
      tenure: "",
      applicationId: "",
      propertyIdentified: null,
      applicants: [
        {
          applicantId: "",
          isMainApplicant: true,
          isIndividual: null,
          partnerRelationship: "",
          maritalStatus: {
            status: "",
            spouseTitle: "",
            firstName: "",
            earning: null,
            amount: null
          },
          familyDetails: {
            numberOfDependents: null,
            fatherTitle: "",
            fatherName: "",
            motherTitle: "",
            motherName: "",
            motherMaidenName: ""
          },
          other: {
            religion: "",
            category: ""
          },
          occupation: {
            occupationType: "",
            companyName: "",
            numberOfYearsInCurrentCompany: null,
            totalWorkExperience: null
          },
          pan: {
            panNumber: "",
            panImage: "",
            docType: null,
            docNumber: ""
          },
          personalDetails: {
            title: "",
            firstName: "",
            middleName: "",
            lastName: "",
            gender: "",
            qualification: "",
            dob: "",
            birthPlace: "",
            applicantStatus: ""
          },
          contactDetails: {
            preferredEmailId: "",
            alternateEmailId: "",
            mobileNumber: null,
            alternateMobileNumber: null,
            residenceNumber: "",
            alternateResidenceNumber: ""
          },
          communicationAddress: {
            residentialStatus: "",
            addressLineOne: "",
            addressLineTwo: "",
            zipcode: "",
            city: "",
            state: "",
            cityState: "",
            numberOfYearsInCurrentResidence: "",
            permanentAddress: null,
            preferedMailingAddress: null
          },
          permanentAddress: {
            residentialStatus: "",
            addressLineOne: "",
            addressLineTwo: "",
            zipcode: "",
            city: "",
            state: "",
            cityState: "",
            numberOfYearsInCurrentResidence: "",
            permanentAddress: null,
            preferedMailingAddress: null
          },
          residentialAddress: {
            residentialStatus: "",
            addressLineOne: "",
            addressLineTwo: "",
            zipcode: "",
            city: "",
            state: "",
            cityState: "",
            numberOfYearsInCurrentResidence: "",
            permanentAddress: null
          },
          officialCorrespondence: {
            addressLineOne: "",
            addressLineTwo: "",
            landMark: "",
            zipcode: "",
            city: "",
            state: "",
            officeNumber: "",
            officeEmailId: "",
            cityState: "",
            zipCityStateID: ""
          },
          organizationDetails: {
            nameOfOrganization: "",
            dateOfIncorporation: "",
            constitution: ""
          },
          registeredAddress: {
            registeredAddress: "",
            landMark: "",
            zipcode: "",
            city: "",
            state: ""
          },
          corporateAddress: {
            corporateAddress: "",
            landMark: "",
            zipcode: "",
            city: "",
            state: "",
            stdNumber: "",
            officeEmailId: ""
          },
          revenueDetails: {
            revenue: null,
            annualNetIncome: null,
            grossTurnOver: null
          },
          incomeDetails: {
            annualFamilyIncome: "",
            monthlyExpenditure: "",
            incomeConsider: null,
            monthlyIncome: "",
            assessmentMethodology: "",
            puccaHouse: null
          },
          documents: [
            {
              documentType: "",
              documentImageId: "",
              documentCategory: "",
              documentName: "",
              documentSize: null
            },
            {
              documentType: "",
              documentImageId: "",
              documentCategory: "",
              documentName: "",
              documentSize: null
            },
            {
              documentType: "",
              documentImageId: "",
              documentCategory: "",
              documentName: "",
              documentSize: null
            }
          ]
        }
      ],
      loanDetails: {
        incomeDetails: {
          annualFamilyIncome: "",
          monthlyExpenditure: "",
          incomeConsider: null,
          monthlyIncome: "",
          assessmentMethodology: "",
          puccaHouse: null
        },
        loanAmount: {
          amountRequired: null,
          loanPurpose: "",
          loanTenure: null,
          loanType: null
        },
        property: {
          zipcode: null,
          zipcodeId: null,
          addressLineOne: "",
          addressLineTwo: "",
          cityId: null,
          city: "",
          stateId: null,
          state: ""
        },
        propertyType: {
          propertyIdentified: true,
          propertyType: "",
          propertyClss: "",
          propertyArea: null
        },
        existingLoans: {
          loanProvider: "",
          liveLoan: null,
          numberOfYears: null,
          monthlyEmi: null
        }
      },
      references: {
        referenceOne: {
          referenceId: null,
          relationShip: "",
          title: "",
          fullName: "",
          mobileNumber: "",
          addressLineOne: "",
          addressLineTwo: ""
        },
        referenceTwo: {
          referenceId: null,
          relationShip: "",
          title: "",
          fullName: "",
          mobileNumber: "",
          addressLineOne: "",
          addressLineTwo: ""
        }
      }
    }
  };

  qdeSource$: BehaviorSubject<Qde>;
  public qdeSource: Observable<Qde>;
  setStatusApi: any;

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

      // Filter Empty Values
      if(obj.key == 'ocsNumber' || obj.key == 'isMainApplicant' || obj.key == 'applicationId') {
        newObj[obj.key] = obj.value;
      } else {
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
      }
    });

    return newObj;
  }

  addNewCoApplicant() {
    this.qde.application.applicants.push({
      applicantId: "",
      isMainApplicant: false,
      isIndividual: null,
      partnerRelationship: "",
      maritalStatus: {
        status: "",
        spouseTitle: "",
        firstName: "",
        earning: null,
        amount: null
      },
      familyDetails: {
        numberOfDependents: null,
        fatherTitle: "",
        fatherName: "",
        motherTitle: "",
        motherName: "",
        motherMaidenName: ""
      },
      other: {
        religion: "",
        category: ""
      },
      occupation: {
        occupationType: "",
        companyName: "",
        numberOfYearsInCurrentCompany: null,
        totalWorkExperience: null
      },
      pan: {
        panNumber: "",
        panImage: "",
        docType: null,
        docNumber: ""
      },
      personalDetails: {
        title: "",
        firstName: "",
        middleName: "",
        lastName: "",
        gender: "",
        qualification: "",
        dob: "",
        birthPlace: "",
        applicantStatus: ""
      },
      contactDetails: {
        preferredEmailId: "",
        alternateEmailId: "",
        mobileNumber: null,
        alternateMobileNumber: null,
        residenceNumber: "",
        alternateResidenceNumber: ""
      },
      communicationAddress: {
        residentialStatus: "",
        addressLineOne: "",
        addressLineTwo: "",
        zipcode: "",
        city: "",
        state: "",
        cityState: "",
        numberOfYearsInCurrentResidence: "",
        permanentAddress: null,
        preferedMailingAddress: null
      },
      permanentAddress: {
        residentialStatus: "",
        addressLineOne: "",
        addressLineTwo: "",
        zipcode: "",
        city: "",
        state: "",
        cityState: "",
        numberOfYearsInCurrentResidence: "",
        permanentAddress: null,
        preferedMailingAddress: null
      },
      residentialAddress: {
        residentialStatus: "",
        addressLineOne: "",
        addressLineTwo: "",
        zipcode: "",
        city: "",
        state: "",
        cityState: "",
        numberOfYearsInCurrentResidence: "",
        permanentAddress: null
      },
      officialCorrespondence: {
        addressLineOne: "",
        addressLineTwo: "",
        landMark: "",
        zipcode: "",
        city: "",
        state: "",
        officeNumber: "",
        officeEmailId: "",
        cityState: "",
        zipCityStateID: ""
      },
      organizationDetails: {
        nameOfOrganization: "",
        dateOfIncorporation: "",
        constitution: ""
      },
      registeredAddress: {
        registeredAddress: "",
        landMark: "",
        zipcode: "",
        city: "",
        state: ""
      },
      corporateAddress: {
        corporateAddress: "",
        landMark: "",
        zipcode: "",
        city: "",
        state: "",
        stdNumber: "",
        officeEmailId: ""
      },
      revenueDetails: {
        revenue: null,
        annualNetIncome: null,
        grossTurnOver: null
      },
      incomeDetails: {
        annualFamilyIncome: "",
        monthlyExpenditure: "",
        incomeConsider: null,
        monthlyIncome: "",
        assessmentMethodology: "",
        puccaHouse: null
      },
      documents: [
        {
          documentType: "",
          documentCategory: "",
          documentImageId: "",
          documentName: "",
          documentSize: null
        },
        {
          documentType: "",
          documentCategory: "",
          documentImageId: "",
          documentName: "",
          documentSize: null
        }
      ]
    });

    this.qdeSource$.next(this.qde);
  }

  resetQde() {
    this.setQde({
      application: {
        ocsNumber: "",
        loanAmount: "",
        tenure: "",
        applicationId: "",
        propertyIdentified: null,
        applicants: [
          {
            applicantId: "",
            isMainApplicant: true,
            isIndividual: null,
            partnerRelationship: "",
            maritalStatus: {
              status: "",
              spouseTitle: "",
              firstName: "",
              earning: null,
              amount: null
            },
            familyDetails: {
              numberOfDependents: null,
              fatherTitle: "",
              fatherName: "",
              motherTitle: "",
              motherName: "",
              motherMaidenName: ""
            },
            other: {
              religion: "",
              category: ""
            },
            occupation: {
              occupationType: "",
              companyName: "",
              numberOfYearsInCurrentCompany: null,
              totalWorkExperience: null
            },
            pan: {
              panNumber: "",
              panImage: "",
              docType: null,
              docNumber: ""
            },
            personalDetails: {
              title: "",
              firstName: "",
              middleName: "",
              lastName: "",
              gender: "",
              qualification: "",
              dob: "",
              birthPlace: "",
              applicantStatus: ""
            },
            contactDetails: {
              preferredEmailId: "",
              alternateEmailId: "",
              mobileNumber: null,
              alternateMobileNumber: null,
              residenceNumber: "",
              alternateResidenceNumber: ""
            },
            communicationAddress: {
              residentialStatus: "",
              addressLineOne: "",
              addressLineTwo: "",
              zipcode: "",
              city: "",
              state: "",
              cityState: "",
              numberOfYearsInCurrentResidence: "",
              permanentAddress: null,
              preferedMailingAddress: null
            },
            permanentAddress: {
              residentialStatus: "",
              addressLineOne: "",
              addressLineTwo: "",
              zipcode: "",
              city: "",
              state: "",
              cityState: "",
              numberOfYearsInCurrentResidence: "",
              permanentAddress: null,
              preferedMailingAddress: null
            },
            residentialAddress: {
              residentialStatus: "",
              addressLineOne: "",
              addressLineTwo: "",
              zipcode: "",
              city: "",
              state: "",
              cityState: "",
              numberOfYearsInCurrentResidence: "",
              permanentAddress: null
            },
            officialCorrespondence: {
              addressLineOne: "",
              addressLineTwo: "",
              landMark: "",
              zipcode: "",
              city: "",
              state: "",
              officeNumber: "",
              officeEmailId: "",
              cityState: "",
              zipCityStateID: ""
            },
            organizationDetails: {
              nameOfOrganization: "",
              dateOfIncorporation: "",
              constitution: ""
            },
            registeredAddress: {
              registeredAddress: "",
              landMark: "",
              zipcode: "",
              city: "",
              state: ""
            },
            corporateAddress: {
              corporateAddress: "",
              landMark: "",
              zipcode: "",
              city: "",
              state: "",
              stdNumber: "",
              officeEmailId: ""
            },
            revenueDetails: {
              revenue: null,
              annualNetIncome: null,
              grossTurnOver: null
            },
            incomeDetails: {
              annualFamilyIncome: "",
              monthlyExpenditure: "",
              incomeConsider: null,
              monthlyIncome: "",
              assessmentMethodology: "",
              puccaHouse: null
            },
            documents: [
              {
                documentType: "",
                documentImageId: "",
                documentCategory: "",
                documentName: "",
                documentSize: null
              },
              {
                documentType: "",
                documentImageId: "",
                documentCategory: "",
                documentName: "",
                documentSize: null
              },
              {
                documentType: "",
                documentImageId: "",
                documentCategory: "",
                documentName: "",
                documentSize: null
              }
            ]
          }
        ],
        loanDetails: {
          incomeDetails: {
            annualFamilyIncome: "",
            monthlyExpenditure: "",
            incomeConsider: null,
            monthlyIncome: "",
            assessmentMethodology: "",
            puccaHouse: null
          },
          loanAmount: {
            amountRequired: null,
            loanPurpose: "",
            loanTenure: null,
            loanType: null
          },
          property: {
            zipcode: null,
            zipcodeId: null,
            addressLineOne: "",
            addressLineTwo: "",
            cityId: null,
            city: "",
            stateId: null,
            state: ""
          },
          propertyType: {
            propertyIdentified: true,
            propertyType: "",
            propertyClss: "",
            propertyArea: null
          },
          existingLoans: {
            loanProvider: "",
            liveLoan: null,
            numberOfYears: null,
            monthlyEmi: null
          }
        },
        references: {
          referenceOne: {
            referenceId: null,
            relationShip: "",
            title: "",
            fullName: "",
            mobileNumber: "",
            addressLineOne: "",
            addressLineTwo: ""
          },
          referenceTwo: {
            referenceId: null,
            relationShip: "",
            title: "",
            fullName: "",
            mobileNumber: "",
            addressLineOne: "",
            addressLineTwo: ""
          }
        }
      }
    });
  }
}
