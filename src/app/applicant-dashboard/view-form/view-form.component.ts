import { Component, OnInit, ViewChild, ElementRef, Renderer2, OnDestroy  } from '@angular/core';

import * as Swiper from 'swiper/dist/js/swiper.js';
// import { Select2Component } from 'ng2-select2';
import { ActivatedRoute, Router } from '@angular/router';

import { Options } from 'ng5-slider';
import { NgForm } from '@angular/forms';

import Qde, { InCompleteFields, Applicant } from 'src/app/models/qde.model';
import { QdeHttpService } from 'src/app/services/qde-http.service';
import { CommonDataService } from 'src/app/services/common-data.service';
import { QdeService } from 'src/app/services/qde.service';
import { errors } from '../../services/errors';
import { Subscription } from 'rxjs';
import { statuses } from 'src/app/app.constants';

interface Item {
  key: string,
  value: number | string
}

@Component({
  selector: 'app-view-form',
  templateUrl: './view-form.component.html',
  styleUrls: ['./view-form.component.css']
})
export class ViewFormComponent implements OnInit, OnDestroy {

  readonly errors = errors;
  readonly statuses = statuses;

  private showSuccessModal: boolean = false;

  public applicantName: string;

  value: number = 0;

  isAlternateEmailId: Array<boolean> = [];
  isAlternateMobileNumber: Array<boolean> = [];
  isAlternateResidenceNumber: Array<boolean> = [];

  minValue: number = 1;
  options: Options = {
    floor: 0,
    ceil: 6,
    step: 1,
    showTicksValues: false,
    // showSelectionBar: true,
    showTicks: true,
    getLegend: (sliderVal: number): string => {
      return  sliderVal + '<b>y</b>';
    }
  };

  lhsConfig = {
    noSwiping: true,
    noSwipingClass: '',
    onlyExternal: true,
    autoplay: false,
    speed: 900,
    effect: "fade",
    fadeEffect: {
      crossFade: true
    }
  };

  rhsConfig = {
    // noSwiping: true,
    // onlyExternal: true,
    autoplay: false,
    speed: 900,
    effect: "slide",
  };

  activeTab: number = 0;
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
  categories: Array<any>;
  genders: Array<any>;
  constitutions: Array<any>;

  loanProviders: Array<any>;
  loanType: Array<any>;
  loanpurposes: Array<any>;
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

  @ViewChild('tabContents') tabContents: ElementRef;

  applicantIndividual:boolean = true;
  

  fragments = [ 'applicant',
                'co-applicant',
                'loan-details',
                'references',
                'document-uploads',
                'review-eligibility'
  ];

  applicantIndex: number;
  coApplicantIndexes: Array<number> = [];

  qde: Qde;
  YYYY: number = new Date().getFullYear();

  isIncomplete: Array<InCompleteFields> = [];
  applicationId: string;
  applicantId: string;

  isReadOnlyForm: boolean;
  isEligibilityForReview: boolean;

  eligibilityAssignedTo: string;
  eligibilityDate: string;
  listOfApplicantsNameAndCutOff: Array<{name: string, aboveCutOff: string}>;
  maxEMI: number;

  getElibilityReviewSub: Subscription;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private qdeHttp: QdeHttpService,
              private commonDataService: CommonDataService,
              private qdeService: QdeService) {

    this.qdeService.setQde(JSON.parse(this.route.snapshot.data['qde']['ProcessVariables']['response']));

    this.commonDataService.changeMenuBarShown(false);
    this.commonDataService.changeViewFormVisible(false);
    this.commonDataService.changeLogoutVisible(true);

    this.qdeService.qdeSource.subscribe(val => {
      this.qde = val;

      console.log('QDE: ', this.qde);
      
      this.commonDataService.changeApplicationId(this.qde.application.applicationId);

      this.applicationId = this.qde.application.applicationId;

      this.qdeService.qdeSource.subscribe(v => {
        this.qde = v;
  
        // Find an applicant
        const applicants = this.qde.application.applicants;
        for (const applicant of applicants) {
          if (applicant["isMainApplicant"]) {
            this.applicantId = applicant["applicantId"];
            break;
          }
        }
  
        // console.log("this.applicantName", this.qde.application.applicants[0].personalDetails.firstName);
        
        let index = v.application.applicants.findIndex(val => val.isMainApplicant == true);
        
        if(index == -1) {
          this.applicantName = "";
        } else {
          if(this.qde.application.applicants[0].personalDetails.firstName != "") {
            this.applicantName = "Application for "+this.qde.application.applicants[index].personalDetails.firstName +" "+ this.qde.application.applicants[index].personalDetails.lastName;
          }
        }
      });
      this.applicantIndex = this.qde.application.applicants.find(val => val.isMainApplicant==true) != undefined ? this.qde.application.applicants.findIndex(val => val.isMainApplicant == true): 0;
      console.log(this.applicantIndex);

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
    console.log(">>", JSON.parse(this.route.snapshot.data.listOfValues['ProcessVariables'].lovs));
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

    console.log('Applicant Index: ', this.applicantIndex);
    console.log('Co-Applicant Indexes: ', this.coApplicantIndexes);
    console.log('IsIncomplete: ', this.isIncomplete);

    this.prefillData();

    // For hiding Edit Button
    this.commonDataService.isReadOnlyForm.subscribe(val => {
      this.isReadOnlyForm = val;
    });

    // To Show Button Accept/Reject Form if TBM (Check leads.component.html)
    this.commonDataService.isEligibilityForReview.subscribe(val => {
      this.isEligibilityForReview = val['isEligibilityForReview'];
      this.applicantId = val['applicationId'];
      if(val['isEligibilityForReview'] == true && val['applicationId'] != null) {

        /************************************
        * Uncomment below for UAT/Production
        ************************************/
        // this.getElibilityReviewSub = this.qdeHttp.getElibilityReview(this.applicationId).subscribe(res => {
        //   let response = res['ProcessVariables'];
        //   this.eligibilityAssignedTo = response['assignedTo'];
        //   this.eligibilityDate = response['dateCreated'].split('-')[2]+"-"+response['dateCreated'].split('-')[1]+"-"+response['dateCreated'].split('-')[0];
        //   this.listOfApplicantsNameAndCutOff = response['listOfApplicantsNameAndCutOff'].map(v => {
        //     return {
        //       name: v['firstName']+" "+v['lastName'],
        //       aboveCutOff: v['aboveCutOff'] == '1' ? 'Yes': 'No'
        //     }
        //   });
        //   this.maxEMI = response['maxEMI'];
        // });

        /*********************************
        * Remove below for UAT/Production
        *********************************/
        this.getElibilityReviewSub = this.qdeHttp.dummyGetEligibilityAPI(this.applicationId).subscribe(res => {
          let response = res['ProcessVariables'];
          this.eligibilityAssignedTo = response['assignedTo'];
          this.eligibilityDate = response['dateCreated'].split('-')[2]+"-"+response['dateCreated'].split('-')[1]+"-"+response['dateCreated'].split('-')[0];
          this.listOfApplicantsNameAndCutOff = response['listOfApplicantsNameAndCutOff'].map(v => {
            return {
              name: v['firstName']+" "+v['lastName'],
              aboveCutOff: v['aboveCutOff'] == '1' ? 'Yes': 'No'
            }
          });
          this.maxEMI = response['maxEMI'];
        });
      }
    });


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

    this.route.fragment.subscribe((fragment) => {
      let localFragment = fragment;
      if( fragment == null || (!this.fragments.includes(fragment)) ) {
        localFragment = this.fragments[0];
      } else {
        // Replace Fragments in url
        this.tabSwitch(this.fragments.indexOf(localFragment));
      }
      
    });

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
            result.application.loanDetails.propertyType.propertyArea || null;

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
          this.valuechange(this.qde.application.tenure);
        });
      } else {
        this.qde = this.qdeService.getQde();
      }
    });
  }

  setApplicantName(qde) {
    this.applicantName = this.qde.application.applicants[0].personalDetails.firstName;
    console.log("this.applicantName", this.applicantName);
  }
  valuechange(newValue) {
    console.log(newValue);
    this.value  = newValue;
  }

  /**
   * Use to sync between lhs and rhs sliders
   * @param swiperInstance RHS Swiper Instance
   */
  goToNextSlide(swiperInstance: Swiper, form?: NgForm) {

    if (form && !form.valid) {
      return;
    }

    // Create ngModel of radio button in future
    swiperInstance.nextSlide();
  }

  /**
   * Use to sync between lhs and rhs sliders
   * @param swiperInstance LHS Swiper Instance
   */
  slideNextTransitionStart(swiperInstance: Swiper) {
    console.log(swiperInstance.getIndex());
    swiperInstance.nextSlide();
  }

  
  /**
   * Use to sync between lhs and rhs sliders
   * @param swiperInstance RHS Swiper Instance
   */
  goToPrevSlide(swiperInstance: Swiper) {

    // Create ngModel of radio button in future
    swiperInstance.prevSlide();
  }

  /**
   * Use to sync between lhs and rhs sliders
   * @param swiperInstance LHS Swiper Instance
   */
  slidePrevTransitionStart(swiperInstance: Swiper) {
    swiperInstance.prevSlide();
  }

  tabSwitch(tabIndex ?: number) {

    // Check for invalid tabIndex
    if(tabIndex < this.fragments.length) {

      this.router.navigate([], { fragment: this.fragments[tabIndex]});
  
      this.activeTab = tabIndex;

      if(tabIndex == 9) {
        this.applicantIndividual = false;
      }else if(tabIndex == 0) {
        this.applicantIndividual = true;
      }
    }
  }

  counter(size): Array<number> {
    return new Array(size);
  }

  checkIncompleteFields(applicantId): InCompleteFields {
    let index = this.qde.application.applicants.findIndex(val => val.applicantId == applicantId);

    let isIncomplete: InCompleteFields = {
      pan: null,
      personalDetails: null,
      contactDetails: null,
      communicationAddress: null,
      maritalStatus: null,
      familyDetails: null,
      other: null,
      occupation: null,
      officialCorrespondence: null,
      incomeDetails: null
    };

    isIncomplete.pan =  (this.qde.application.applicants[index].pan.panNumber == '' ||
                        (this.qde.application.applicants[index].pan.panNumber == null ||
                        (this.qde.application.applicants[index].pan.panNumber == undefined)));

    // Write conditions for All details just like PAN

    return isIncomplete;
  }

  // private isEligible: boolean = false;
  // private isNotEligible: boolean = false;
  // private emiAmount: number;
  // private eligibleAmount: number;

  // submitDocumentUploadForm(form: NgForm) {

  //   this.qdeHttp.dummyCIBILAPI().subscribe(res => {
  //     console.log("res: ", res['ProcessVariables']['checkEligibility'].toLowerCase);
  //     if(res['ProcessVariables']['checkEligibility'].toLowerCase() == 'yes') {
  //       this.isEligible = true;

  //       this.emiAmount = parseInt(res['ProcessVariables']['emi']);
  //       this.eligibleAmount = parseInt(res['ProcessVariables']['eligibilityAmount']);
  //     }
  //     else if(res['ProcessVariables']['checkEligibility'].toLowerCase() == 'no') {
  //       this.isNotEligible = true;
  //     }
  //   });
  // }

  sendSMS() {

      // this.qdeHttp.viewFormSmsApi(this.applicationId).subscribe((response)=>{
      //   let sms = response["ProcessVariables"];
      //   this.qde.application.applicationId = sms["applicationId"];
      //     console.log("Response", response)
      // })
      this.qdeHttp.viewFormSmsApi(this.applicationId).subscribe(res => {}, err => {});

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
    console.log("residenceNumberStdCode: ", this.residenceNumberStdCode);
    console.log("residenceNumberPhoneNumber: ", this.residenceNumberPhoneNumber);

    this.alternateResidenceNumberStdCode.push(eachApplicant.contactDetails.alternateResidenceNumber != "" ? eachApplicant.contactDetails.alternateResidenceNumber.split("-")[0] : "");
    this.alternateResidenceNumberPhoneNumber.push(eachApplicant.contactDetails.alternateResidenceNumber != "" ? eachApplicant.contactDetails.alternateResidenceNumber.split("-")[1] : "");
    console.log("alternateResidenceNumberStdCode: " ,this.alternateResidenceNumberStdCode);
    console.log("alternateResidenceNumberPhoneNumber: " ,this.alternateResidenceNumberPhoneNumber);
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

  qdeSubmit() {
    
  }
  applicationStatus: string = "10";

  setStatus(){
     this.qdeHttp.setStatusApi(this.applicationId, this.applicationStatus).subscribe(res => {}, err => {});
     this.sendSMS();
  }

  onPinCodeChange(event) {
    console.log("pincode",event.target.value);
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
  onBackButtonClick() {
    if (this.activeTab > 0) {
     
        // Go To Previous Tab
        this.tabSwitch(this.activeTab - 1);
      }
    }

  applicationAccepted() {
    this.qdeHttp.setStatusApi(this.applicationId, statuses['Eligibility Accepted']).subscribe(res => {}, err => {});
  }

  applicationRejected() {
    this.qdeHttp.setStatusApi(this.applicationId, statuses['Eligibility Rejected']).subscribe(res => {}, err => {});
  }

  ngOnDestroy() {
    if(this.getElibilityReviewSub != null) {
      this.getElibilityReviewSub.unsubscribe();
    }
  }
}