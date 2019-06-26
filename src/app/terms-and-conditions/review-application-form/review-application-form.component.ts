import { Component, OnInit } from '@angular/core';
import { QdeService } from 'src/app/services/qde.service';
import { ActivatedRoute } from '@angular/router';
import Qde, { InCompleteFields, Applicant } from 'src/app/models/qde.model';
import { QdeHttpService } from 'src/app/services/qde-http.service';

interface Item {
  key: string,
  value: number | string
}

@Component({
  selector: 'app-review-application-form',
  templateUrl: './review-application-form.component.html',
  styleUrls: ['./review-application-form.component.css']
})
export class ReviewApplicationFormComponent implements OnInit {

  applicationId: string;
  applicantId: string;
  qde: Qde;

  dob: Array<{day: Item, month: Item, year: Item}> = [];
  residenceNumberStdCode: Array<string> = [];
  residenceNumberPhoneNumber: Array<string> = [];
  alternateResidenceNumberStdCode: Array<string> = [];
  alternateResidenceNumberPhoneNumber: Array<string> = [];
  addressCityState: Array<string> = [];
  otherReligion: Array<string> = [];
  organizationDetails: Array<{day: Item, month: Item, year: Item}> = [];
  registeredAddressCityState: Array<string> = [];
  corporateAddressCityState: Array<string> = [];
  corporateAddressStdCode: Array<string> = [];
  corporateAddressPhoneNumber: Array<string> = [];
  coApplicantsForDashboard: Array<Applicant> = [];
  officialCorrespondenceStdCode: Array<string> = [];
  officialCorrespondencePhoneNumber: Array<string> = [];

  isAlternateEmailId: Array<boolean> = [];
  isAlternateMobileNumber: Array<boolean> = [];
  isAlternateResidenceNumber: Array<boolean> = [];

  //-------------------------------------------------
  //          Lov Variables
  //-------------------------------------------------
  religions: Array<any>;
  qualifications: Array<any>;
  occupations: Array<any>;
  residences: Array<any>;
  titles: Array<any>;
  maleTitles: Array<any>;
  femaleTitles: Array<any>;
  maritals: Array<any>;
  relationships: Array<any>;
  loanpurposes: Array<any>;
  categories: Array<any>;
  genders: Array<any>;
  constitutions: Array<any>;

  loanProviders: Array<any>;
  loanType: Array<any>;
  propertyTypes: Array<any>;
  loanProviderList: Array<any>;
  liveLoan = 0;
  monthlyEmiValue: number;

  days: Array<Item>;
  months: Array<Item>;
  years: Array<Item>;
  assessmentMethodology: Array<any>;
  selectedTitle: Array<Item> = [];
  selectedReligion: Array<Item> = [];
  selectedMaritialStatus: Array<Item> = [];
  selectedCategory: Array<Item> = [];
  selectedOccupation: Array<Item> = [];
  selectedResidence: Array<Item> = [];
  selectedSpouseTitle: Array<Item> = [];
  selectedFatherTitle: Array<Item> = [];
  selectedMotherTitle: Array<Item> = [];
  selectedQualification: Array<Item> = [];
  selectedGender: Array<Item> = [];
  selectedConstitution: Array<Item> = [];
  selectedDocType: Array<Item> = [];

  selectedLoanProvider: Array<Item> = [];
  selectedLoanPurpose: Array<Item> = [];
  selectedLoanType: Array<Item> = [];
  selectedPropertyType: Array<Item> = [];
  isPropertyIdentified = false;
  propertyClssValue: string;
  propertyAreaValue: number;
  propertyPincodeValue: number;
  propertyPincodeId: number;
  addressLineOneValue: string;
  addressLineTwoValue: string;
  cityId: number;
  city: string;
  stateId: number;
  state: string;
  cityState:string;

  selectedReferenceOne: any;
  selectedTiltle1: string;
  selectedName1: string;
  selectedMobile1: string;
  selectedAddressLineOne1: string;
  selectedAddressLineTwo1: string;

  selectedReferenceTwo: any;
  selectedTiltle2: string;
  selectedName2: string;
  selectedMobile2: string;
  selectedAddressLineOne2: string;
  selectedAddressLineTwo2: string;

  referenceId1: number;
  referenceId2: number;

  docType: Array<any> = [];
  selectedAssesmentMethodology: Array<Item> = [];

  applicantIndex: number;
  coApplicantIndexes: Array<number> = [];
  YYYY: number = new Date().getFullYear();

  isIncomplete: Array<InCompleteFields> = [];

  constructor(private qdeService: QdeService,
              private route: ActivatedRoute,
              private qdeHttp: QdeHttpService) {

    
    this.qdeService.qdeSource.subscribe(val => {
      this.qde = val;

      this.applicantIndex = val.application.applicants.findIndex(v => v.isMainApplicant == true) == -1 ? 0 : val.application.applicants.findIndex(v => v.isMainApplicant == true);
      val.application.applicants.forEach((el, index) => {
  
        if(el.isMainApplicant == false) {
          this.coApplicantIndexes.push(index);
        }
  
        // this.isIncomplete.push(this.checkIncompleteFields(el.applicantId));
        this.isIncomplete.push({
          pan: false,
          personalDetails: false,
          contactDetails: false,
          communicationAddress: false,
          maritalStatus: false,
          familyDetails: false,
          other: false,
          occupation: false,
          officialCorrespondence: false,
          incomeDetails: false
        });
      });
    });

    console.log("this.route.snapshot.data['qde']", this.route.snapshot.data['qde']);
    this.qdeService.setQde(JSON.parse(this.route.snapshot.data['qde']['ProcessVariables']['response']));

    this.route.params.subscribe(value => {
      this.applicationId = value.applicationId;
      this.applicantId = this.qde.application.applicants.find(v => v.applicantId == value.applicantId).applicantId;
    });



    if(this.route.snapshot.data.listOfValues != null && this.route.snapshot.data.listOfValues != undefined) {

      var lov = JSON.parse(this.route.snapshot.data.listOfValues['ProcessVariables'].lovs);

      this.religions = lov.LOVS.religion;
      this.qualifications = lov.LOVS.qualification;
      this.occupations = lov.LOVS.occupation;
      this.residences = lov.LOVS.residence_type;
      this.titles = lov.LOVS.applicant_title;
      this.maleTitles = lov.LOVS.male_applicant_title;
      this.femaleTitles = lov.LOVS.female_applicant_title;
      // this.docType = lov.LOVS.document_type;
      // Hardcoded values as per requirement
      this.docType = [{key: "CKYC Kin", value:"1"},{key: "Passport Number", value:"2"},{key: "Voter Id", value:"3"},{key: "Driving License", value:"4"},{key: "Aadhaar No (Token No)", value:"5"},{key: "NREGA Job Card", value:"6"}]
      this.maritals = lov.LOVS.maritial_status;
      this.relationships = lov.LOVS.relationship;
      this.loanpurposes = lov.LOVS.loan_purpose;
      this.categories = lov.LOVS.category;
      this.genders = lov.LOVS.gender;
      this.constitutions = lov.LOVS.constitution;
      this.assessmentMethodology = lov.LOVS.assessment_methodology;
      //hardcoded
      //this.birthPlace = [{"key": "Chennai", "value": "1"},{"key": "Mumbai", "value": "2"},{"key": "Delhi", "value": "3"}];
      // List of Values for Date
      this.days = Array.from(Array(31).keys()).map((val, index) => {
        let v = ((index+1) < 10) ? "0"+(index+1) : (index+1)+"";
        return {key: v, value: v};
      });
      this.days.unshift({key: 'DD', value: 'DD'});

      this.months = Array.from(Array(12).keys()).map((val, index) => {
        let v = ((index+1) < 10) ? "0"+(index+1) : (index+1)+"";
        return {key: v, value: v};
      });
      this.months.unshift({key: 'MM', value: 'MM'});

      this.years = Array.from(Array(120).keys()).map((val, index) => {
        let v = (this.YYYY - index)+"";
        return {key: v, value: v};
      });
      this.years.unshift({key: 'YYYY', value: 'YYYY'});

      // this.docType = [{"key": "Aadhar", "value": "1"},{"key": "Driving License", "value": "2"},{"key": "passport", "value": "3"}];
    }

    this.prefillData();
  }

  ngOnInit() {
    if(this.route.snapshot.data.listOfValues) {
      const lov = JSON.parse(this.route.snapshot.data.listOfValues['ProcessVariables'].lovs);

      this.loanpurposes = lov.LOVS.loan_purpose;
      this.loanType = lov.LOVS.loan_type;
      this.propertyTypes = lov.LOVS.property_type;

      this.loanProviderList = lov.LOVS.loan_providers;

      this.titles = lov.LOVS.applicant_title;
    this.relationships = lov.LOVS.relationship;
    }

    // this.route.fragment.subscribe((fragment) => {
    //   let localFragment = fragment;
    //   if( fragment == null || (!this.fragments.includes(fragment)) ) {
    //     localFragment = this.fragments[0];
    //   } else {
    //     // Replace Fragments in url
    //     this.tabSwitch(this.fragments.indexOf(localFragment));
    //   }
      
    // });

    this.route.params.subscribe(params => {

      // Make an http request to get the required qde data and set using setQde
      const applicationId = params.applicationId;
      if (applicationId) {
        this.qdeHttp.getQdeData(applicationId).subscribe(response => {
          let result = JSON.parse(response["ProcessVariables"]["response"]);

          // All hardcoded value need to removed
          this.selectedLoanType =
            result.application.loanDetails.loanAmount.loanType ||
            this.loanType[0].value;
          this.selectedLoanPurpose =
            result.application.loanDetails.loanAmount.loanPurpose ||
            this.loanpurposes[0].value;

          if (!result.application.loanDetails.propertyType) {
            result.application.loanDetails.propertyType = {}; //This line need to be removed
          }

          this.selectedPropertyType =
            result.application.loanDetails.propertyType.propertyType ||
            this.propertyTypes[0].value;

          this.isPropertyIdentified =
            result.application.loanDetails.propertyType.propertyIdentified ||
            false;

          this.propertyClssValue =
            result.application.loanDetails.propertyType.propertyClss || "";

          this.propertyAreaValue =
            result.application.loanDetails.propertyType.propertyArea || 0;

          if (!result.application.loanDetails.property) {
            result.application.loanDetails.property = {}; //This line need to be removed
          }
          this.propertyPincodeValue =
            result.application.loanDetails.property.zipcode || "";

          this.addressLineOneValue =
            result.application.loanDetails.property.addressLineOne || "";

          this.addressLineTwoValue =
            result.application.loanDetails.property.addressLineTwo || "";

          this.city = result.application.loanDetails.property.city || "";

          this.state = result.application.loanDetails.property.state || "";

          this.cityState = this.city +" "+ this.state;


          // if (!result.application.loanDetails.existingLoans) {
          //   result.application.loanDetails.existingLoans = {}; //This line need to be removed
          // }
          this.selectedLoanProvider =
            result.application.loanDetails.existingLoans.loanProvider ||
            this.loanProviderList[0].value;

          this.liveLoan =
            result.application.loanDetails.existingLoans.liveLoan || 0;

          this.monthlyEmiValue =
            result.application.loanDetails.existingLoans.monthlyEmi || "";

            if (!result.application.references  || Object.keys(result.application.references).length === 0) {
              result.application.references = {
                referenceOne: {},
                referenceTwo: {}
              };
            }
  
            if (!result.application.references.referenceOne || Object.keys(result.application.references.referenceOne).length === 0) {
              result.application.references.referenceOne = {};
            }
  
            if (!result.application.references.referenceTwo || Object.keys(result.application.references.referenceTwo).length === 0) {
              result.application.references.referenceTwo = {};
            }
  
            this.selectedReferenceOne =
              result.application.references.referenceOne.relationShip ||
              this.relationships[0].value;
            this.selectedReferenceTwo =
              result.application.references.referenceTwo.relationShip ||
              this.relationships[0].value;
  
            this.selectedTiltle1 =
              result.application.references.referenceOne.title ||
              this.titles[0].value;
            this.selectedName1 =
              result.application.references.referenceOne.fullName || "";
            this.selectedMobile1 =
              result.application.references.referenceOne.mobileNumber || "";
            this.selectedAddressLineOne1 =
              result.application.references.referenceOne.addressLineOne || "";
            this.selectedAddressLineTwo1 =
              result.application.references.referenceOne.addressLineTwo || "";
  
            this.selectedTiltle2 =
              result.application.references.referenceTwo.title ||
              this.titles[0].value;
            this.selectedName2 =
              result.application.references.referenceTwo.fullName || "";
            this.selectedMobile2 =
              result.application.references.referenceTwo.mobileNumber || "";
            this.selectedAddressLineOne2 =
              result.application.references.referenceTwo.addressLineOne || "";
            this.selectedAddressLineTwo2 =
              result.application.references.referenceTwo.addressLineTwo || "";

          this.qde = result;
          this.qde.application.applicationId = applicationId;

          this.qdeService.setQde(this.qde);
         // this.valuechange(this.qde.application.tenure);
        });
      } else {
        this.qde = this.qdeService.getQde();
      }
    });
  }

  prefillData() {

    // Make QDE Data Global Across App

    // This is when co-applicant is being edited
    this.qde.application.applicants.forEach((eachApplicant, i) => {

      //------------------------------------------------------
      //    Prefilling values
      //------------------------------------------------------
      // Set CoApplicant for Prefilling the fields
      // this.coApplicantIndex = this.qde.application.applicants.indexOf(params.coApplicantIndex);

      // if ( ! isNaN(parseInt(this.qde.application.applicants[this.coApplicantIndex].pan.docType)) ) {
      //   this.selectedDocType = this.docType[parseInt(this.qde.application.applicants[this.coApplicantIndex].pan.docType)];
      // }

      console.log("titles: ", this.titles);
      this.selectedTitle.push(this.titles[0]);
      this.selectedReligion.push(this.religions[0]);
      this.selectedMaritialStatus.push(this.maritals[0]);
      this.selectedCategory.push(this.categories[0]);
      this.selectedOccupation.push(this.occupations[0]);
      this.selectedResidence.push(this.residences[0]);
      this.selectedSpouseTitle.push(this.titles[0]);
      this.selectedFatherTitle.push(this.maleTitles[0]);
      this.selectedMotherTitle.push(this.femaleTitles[0]);
      console.log(".selectedQualification: ", this.selectedQualification);
      this.selectedQualification.push(this.qualifications[0]);
      this.selectedGender.push(this.genders[0]);
      this.selectedConstitution.push(this.constitutions[0]);
      this.selectedDocType.push(this.docType[0]);
      this.selectedAssesmentMethodology.push(this.assessmentMethodology[0]);

      // Personal Details Title
      if( ! isNaN(parseInt(eachApplicant.personalDetails.title)) ) {
        this.selectedTitle.push(this.titles[(parseInt(eachApplicant.personalDetails.title))-1]);
      }

      // Personal Details Day
      let eachDob: {day: Item, month: Item, year: Item} = {day:{key:'DD',value:'DD'},month:{key:'MM',value:'MM'},year:{key:'YYYY',value:'YYYY'}};
      if( ! isNaN(parseInt(eachApplicant.personalDetails.dob.split('/')[2])) ) {
        eachDob.day = this.days[parseInt(eachApplicant.personalDetails.dob.split('/')[2])];
      }
      

      // Personal Details Month
      if( ! isNaN(parseInt(eachApplicant.personalDetails.dob.split('/')[1])) ) {
        eachDob.month = this.months[parseInt(eachApplicant.personalDetails.dob.split('/')[1])];
      }
      
       // Personal Details Year
      if( ! isNaN(parseInt(eachApplicant.personalDetails.dob.split('/')[0])) ) {
        eachDob.year = this.years.find(val => eachApplicant.personalDetails.dob.split('/')[0] == val.value);
      }

      this.dob.push(eachDob);

      let eachDateOfIncorporation: {day: Item, month: Item, year: Item} = {day:{key:'DD',value:'DD'},month:{key:'MM',value:'MM'},year:{key:'YYYY',value:'YYYY'}};
      // Date of Incorporation Day
      if( ! isNaN(parseInt(eachApplicant.organizationDetails.dateOfIncorporation.split('/')[2])) ) {
        eachDateOfIncorporation.day = this.days[parseInt(eachApplicant.organizationDetails.dateOfIncorporation.split('/')[2])];
      }

      // Date of Incorporation Month
      if( ! isNaN(parseInt(eachApplicant.organizationDetails.dateOfIncorporation.split('/')[1])) ) {
        eachDateOfIncorporation.month = this.months[parseInt(eachApplicant.organizationDetails.dateOfIncorporation.split('/')[1])];
      }

      // Date of Incorporation Year
      if( ! isNaN(parseInt(eachApplicant.organizationDetails.dateOfIncorporation.split('/')[0])) ) {
        eachDateOfIncorporation.year = this.years.find(val => eachApplicant.organizationDetails.dateOfIncorporation.split('/')[0] == val.value);
      }

      this.organizationDetails.push(eachDateOfIncorporation);

      // Personal Details Qualification (different because qualification isnt sending sequential value like 1,2,3)
      if( ! isNaN(parseInt(eachApplicant.personalDetails.qualification)) ) {
        this.selectedQualification[i] = (this.qualifications.find(e => e.value == eachApplicant.personalDetails.qualification));
      }

      // Constitution
      if( ! isNaN(parseInt(eachApplicant.organizationDetails.constitution)) ) {
        this.selectedConstitution[i] = (this.constitutions[(parseInt(eachApplicant.organizationDetails.constitution))-1]);
      }
      
      // Communication address
      if( ! isNaN(parseInt(eachApplicant.communicationAddress.residentialStatus)) ) {
        this.selectedResidence[i] = (this.residences[(parseInt(eachApplicant.communicationAddress.residentialStatus)) - 1]);
      }

      if( ! isNaN(parseInt(eachApplicant.maritalStatus.status)) ) {
        this.selectedMaritialStatus[i] = (this.maritals[(parseInt(eachApplicant.maritalStatus.status))-1]);
      }

      if( ! isNaN(parseInt(eachApplicant.maritalStatus.spouseTitle)) ) {
          this.selectedSpouseTitle[i] = (this.titles[(parseInt(eachApplicant.maritalStatus.spouseTitle))-1]);
      }

      if( ! isNaN(parseInt(eachApplicant.familyDetails.fatherTitle)) ) {
        this.selectedFatherTitle [i] = (this.titles[(parseInt(eachApplicant.familyDetails.fatherTitle))-1]);
      }

      if( ! isNaN(parseInt(eachApplicant.familyDetails.motherTitle)) ) {
        this.selectedMotherTitle[i] = (this.titles[(parseInt(eachApplicant.familyDetails.motherTitle))-1]);
      }

      // Other
      if( ! isNaN(parseInt(eachApplicant.other.religion)) ) {
        this.selectedReligion[i] = (this.religions[(parseInt(eachApplicant.other.religion))-1]);
      }

      // Category
      if( ! isNaN(parseInt(eachApplicant.other.category)) ) {
        this.selectedCategory [i] = (this.categories[(parseInt(eachApplicant.other.category))-1]);
      }

      // Occupation details
      if( ! isNaN(parseInt(eachApplicant.occupation.occupationType)) ) {
        this.selectedOccupation[i] = (this.occupations.find(e => e.value == eachApplicant.occupation.occupationType));
      }

      // Assesment methodology
      console.log("assessmentMethodology: ", this.assessmentMethodology[(parseInt(eachApplicant.incomeDetails.assessmentMethodology))-1]);
      if( ! isNaN(parseInt(eachApplicant.incomeDetails.assessmentMethodology)) ) {
        this.selectedAssesmentMethodology[i] = (this.assessmentMethodology[(parseInt(eachApplicant.incomeDetails.assessmentMethodology))-1]);
      }

      this.initializeVariables(eachApplicant);
    });
  }

  initializeVariables(eachApplicant) {
    this.residenceNumberStdCode.push(eachApplicant.contactDetails.residenceNumber != "" ? eachApplicant.contactDetails.residenceNumber.split("-")[0] : "");
    this.residenceNumberPhoneNumber.push(eachApplicant.contactDetails.residenceNumber != "" ? eachApplicant.contactDetails.residenceNumber.split("-")[1] : "");

    this.alternateResidenceNumberStdCode.push(eachApplicant.contactDetails.alternateResidenceNumber != "" ? eachApplicant.contactDetails.alternateResidenceNumber.split("-")[0] : "");
    this.alternateResidenceNumberPhoneNumber.push(eachApplicant.contactDetails.alternateResidenceNumber != "" ? eachApplicant.contactDetails.alternateResidenceNumber.split("-")[1] : "");
    this.addressCityState.push(eachApplicant.communicationAddress.city + '/'+ eachApplicant.communicationAddress.state);

    this.otherReligion.push(eachApplicant.other.religion == '6' ? eachApplicant.other.religion : '');

    this.registeredAddressCityState.push(eachApplicant.registeredAddress.city +'/'+ eachApplicant.registeredAddress.state);
    this.corporateAddressCityState.push(eachApplicant.corporateAddress.city +'-'+ eachApplicant.corporateAddress.state);
    this.corporateAddressStdCode.push(eachApplicant.corporateAddress.stdNumber != "" ? eachApplicant.corporateAddress.stdNumber.split("-")[0] : "");
    this.corporateAddressPhoneNumber.push(eachApplicant.corporateAddress.stdNumber != "" ? eachApplicant.corporateAddress.stdNumber.split("-")[1] : "");
    this.officialCorrespondenceStdCode.push(eachApplicant.officialCorrespondence.officeNumber != "" ? eachApplicant.officialCorrespondence.officeNumber.split("-")[0] : "");
    this.officialCorrespondencePhoneNumber.push(eachApplicant.officialCorrespondence.officeNumber != "" ? eachApplicant.officialCorrespondence.officeNumber.split("-")[1] : "");

    this.isAlternateEmailId.push(eachApplicant.contactDetails.alternateEmailId != "" ? true : false);
    this.isAlternateMobileNumber.push(eachApplicant.contactDetails.alternateMobileNumber != null ? true : false);
    this.isAlternateResidenceNumber.push(eachApplicant.contactDetails.alternateResidenceNumber != "" ? true : false);
  }

  onPinCodeChange(event) {
    console.log(event.target.value);
    let zipCode = event.target.value
    this.qdeHttp.getCityAndState(zipCode).subscribe((response) => {
     // console.log(JSON.parse(response["ProcessVariables"]["response"]));
      var result = JSON.parse(response["ProcessVariables"]["response"]);

      if (result.city && result.state) {

        this.qde.application.loanDetails.property.zipcodeId = result.zipcodeId;
        this.qde.application.loanDetails.property.stateId = result.stateId;
        this.qde.application.loanDetails.property.cityId = result.cityId;

        this.qde.application.loanDetails.property.city = result.city;
        this.qde.application.loanDetails.property.state = result.state;
        this.qde.application.loanDetails.property.zipcode = zipCode;

        this.city = result.city;
        this.state = result.state;

        if(result.city != null && result.state != null && result.city != "" && result.state != "") {
          this.cityState = result.city +" "+ result.state;
        }
      } else {
        alert("Pin code not available / enter proper pincode")
      }
    });
  }
}
