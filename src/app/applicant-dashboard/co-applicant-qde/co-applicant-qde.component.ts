import { Other, Applicant } from './../../models/qde.model';
import { Component, OnInit, ViewChild, ElementRef, Renderer2, OnDestroy, Inject, ɵConsole } from '@angular/core';
    
import * as Swiper from 'swiper/dist/js/swiper.js';
// import { Select2Component } from 'ng2-select2';
import { ActivatedRoute, Router } from '@angular/router';

import { Options } from 'ng5-slider';
import { NgForm } from '@angular/forms';

import Qde from 'src/app/models/qde.model';
import { QdeHttpService } from 'src/app/services/qde-http.service';
import { QdeService } from 'src/app/services/qde.service';

import { CommonDataService } from '../../services/common-data.service';
import { ItemsList } from '@ng-select/ng-select/ng-select/items-list';
import { findLocaleData } from '@angular/common/src/i18n/locale_data_api';
import { Subscription } from 'rxjs';
import { errors } from '../../services/errors';
import { environment } from 'src/environments/environment.prod';
interface Item {
  key: string,
  value: number | string
}

@Component({
  selector: 'app-co-applicant-qde',
  templateUrl: './co-applicant-qde.component.html',
  styleUrls: ['./co-applicant-qde.component.css']
})
export class CoApplicantQdeComponent implements OnInit, OnDestroy {

  readonly errors = errors;
  panErrorCount: number = 0;

  // regexPatternForDocType: Array<string> = ['[A-Z]{1}[0-9]{7}','^[A-Z]{2}[0-9]{13}$','^[A-Z]{3}[0-9]{7}$','[2-9]{1}[0-9]{11}','[0-9]{18}','[0-9]{14}','[0-9]{16}'];

  regexPatternForDocType:Array<any>=[{pattern:'[A-Z]{1}[0-9]{7}',hint:"V1234567"},{pattern:'^[A-Z]{2}[0-9]{13}$',hint:"AN01/2010/0051926"},{pattern:'^[A-Z]{3}[0-9]{7}$',hint:"LWN5672084"},{pattern:'[2-9]{1}[0-9]{11}',hint:"12 digit number, with first digit not 0 or 1"},{pattern:'[0-9]{18}',hint:"	18 digit number"},{pattern:'[0-9]{14}',hint:"	14 digit number"},{pattern:'[0-9]{16}',hint:"	16 digit number"}]

  maxlength:Array<string> = ['8','15','10','12','18','14','16'];

  regexPattern = {
    mobileNumber: "^[0-9]*$",
    name: "^[A-Za-z, ]+$",
    address : "^[0-9A-Za-z, _&'/#]+$",
    // cityState:"^[0-9A-Za-z, &'#]$",
    pinCode: "^[1-9][0-9]{5}$",
    pan:"[A-Z]{5}[0-9]{4}[A-Z]{1}",
    amount:"^[\\d]{0,10}([.][0-9]{0,4})?",
    revenue:"^[\\d]{0,10}([.][0-9]{0,4})?",
    email:"^\\w+([\.-]?\\w+)*@\\w+([\.-]?\\w+)*(\\.\\w{2,10})+$",

    // revenue:"^[0-9]{0,17}\.[0-9]{1,4}?$"
   
  };

  minValue: number = 1;
  options: Options = {
    floor: 0,
    ceil: 50,
    step: 10,
    showTicksValues: false,
    // showSelectionBar: true,
    showTicks: true,
    getLegend: (sliderVal: number): string => {
      return  sliderVal + '<b>y</b>';
    }
  };
  
  familyOptions: Options = {
    floor: 0,
    ceil: 6,
    step: 1,
    showTicksValues: false,
    // showSelectionBar: true,
    showTicks: true,
    getLegend: (sliderVal: number): string => {
      return  sliderVal + '';
    }
  };  

  imageUrl:string = "appiyo/d/drive/upload/";

  myHeaders: { [header: string]: string | string[] } = {
    'Content-Type': 'multipart/form-data',
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
    noSwiping: true,
    noSwipingClass: '',
    autoplay: false,
    speed: 900,
    effect: "slide"
  };

  activeTab: number = 0;
  dob: {day: Item, month: Item, year: Item} = { day: {key: "DD", value: "DD"}, month: {key: "MM", value: "MM"}, year: {key: "YYYY", value: "YYYY"} };
  residenceNumberStdCode: string = "";
  residenceNumberPhoneNumber: string = "";
  alternateResidenceNumberStdCode: string = "";
  alternateResidenceNumberPhoneNumber: string = "";
  addressCityState: string = "";
  otherReligion: string = "";
  organizationDetails: {day: Item, month: Item, year: Item} = { day: {key: "DD", value: "DD"}, month: {key: "MM", value: "MM"}, year: {key: "YYYY", value: "YYYY"} };
  registeredAddressCityState: string = "";
  corporateAddressCityState: string = "";
  corporateAddressStdCode = "";
  corporateAddressPhoneNumber = "";
  coApplicantsForDashboard: Array<Applicant> = [];
  officialCorrespondenceStdCode: string = "";
  officialCorrespondencePhoneNumber: string = "";

  commCityState:string = "";
  // zipCityStateID:string = "";

  // Pan Swiper Sliders
  @ViewChild('panSlider2') panSlider2: Swiper;
  @ViewChild('panSlider4') panSlider4: Swiper;

  isAlternateEmailId: boolean = false;
  isAlternateMobileNumber: boolean = false;
  isAlternateResidenceNumber: boolean = false;
  
  applicantIndividual: boolean = true;
  YYYY: number = new Date().getFullYear();

  // For Hide/Show tabs between Indi and Non indi
  applicantStatus:string = "" ;

  fragments = [ 'dashboard',
                'pan1',
                'personal',
                'contact',
                'address',
                'marital',
                'family',
                'other',
                'occupation',
                'correspondence',
                'income1',
                'pan2',
                'organization',
                'regAddress',
                'corpAddr',
                'revenue',
                'income2'
              ];

  coApplicantIndex: number = 1;

  // Local Copy of Qde
  qde: Qde;

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
  days: Array<Item>;
  months: Array<Item>;
  years: Array<Item>;
  assessmentMethodology: Array<any>;
  selectedTitle: Item;
  selectedReligion: Item;
  selectedMaritialStatus: Item;
  selectedCategory: Item;
  selectedOccupation: Item;
  selectedResidence: Item;
  selectedSpouseTitle: Item;
  selectedFatherTitle: Item;
  selectedMotherTitle: Item;
  selectedQualification: Item;
  selectedConstitution: Item;
  selectedDocType: Item;

  docType: Array<any>;
  selectedAssesmentMethodology: Array<any>;

  // Used when to whether its coming from create or edit
  panslide: boolean;
  panslide2: boolean;
  applicationId: string;

  panslideSub: Subscription;
  panslide2Sub: Subscription;
  qdeSourceSub: Subscription;
  fragmentSub: Subscription;
  paramsSub: Subscription;

  isTabDisabled: boolean = true;

  otp:string;

  constructor(private renderer: Renderer2,
              private route: ActivatedRoute,
              private router: Router,
              private qdeHttp: QdeHttpService,
              private qdeService: QdeService,
              private cds: CommonDataService) {
    this.cds.changeMenuBarShown(true);
    this.cds.changeViewFormVisible(true);
    this.cds.changeLogoutVisible(true);
    // console.log("QDE:::: ", route.data['qde']);
    this.panslideSub = this.cds.panslide.subscribe(val => {
      this.panslide = val;
    });

    this.cds.panslide2.subscribe(val => {
      this.panslide2 = val;
    });

    this.qdeService.qdeSource.subscribe(val => {
      this.qde = val;
      console.log("latest Qde: ", this.qde);
      console.log(this.qde.application.applicants.length);
      let i = this.qde.application.applicants.length <= 1 ? 1 : this.qde.application.applicants.length - 1;
      console.log(i);
      // this.isTabDisabled = this.qde.application.applicants.filter(v => v.isMainApplicant == false).length > 0 ? true: false;
      if(this.qde.application.applicants.length > i && this.qde.application.applicants[i]['applicantId'] == "") {
        this.coApplicantIndex = i;
        console.log("coapplicantindex: ", this.coApplicantIndex);
        this.isTabDisabled = false;
        console.log(this.qde.application.applicants[this.coApplicantIndex]);
      }

      this.coApplicantsForDashboard = val.application.applicants.filter(v => v.isMainApplicant == false);
    });

    this.cds.applicationId.subscribe(val => {
      this.applicationId = val;
    });

    this.route.fragment.subscribe((fragment) => {
      let localFragment = fragment;

      if(fragment == null) {
        localFragment = this.fragments[0];
      }
      console.log('FRAGMENTS................................', fragment);
      // if(localFragment == 'pan1') {
      //   this.isTabDisabled = true;
      // }

      // Replace Fragments in url
      if( this.fragments.includes(localFragment) &&
          this.panslide == false &&
          this.panslide2 == false) {

        // if(this.qde.application.applicants[this.coApplicantIndex].isIndividual == true) {
        //   if(localFragment == 'pan1') {
        //     this.tabSwitch(0);
        //     this.panSlider2.setIndex(1);
        //   }
        // } else if(this.qde.application.applicants[this.coApplicantIndex].isIndividual == false) {
        //   if(localFragment == 'pan2') {
        //     this.tabSwitch(10);
        //   }
        // }

        this.activeTab = this.fragments.indexOf(localFragment);
        this.tabSwitch(this.activeTab);
        this.applicantIndividual = (this.activeTab >= 11) ? false: true;
      }
    });
  }

  ngOnInit() {
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
      this.docType = [{key: "Passport", value:"1"},{key: "Driving License", value:"2"},{key: "Voter's Identity Card", value:"3"},{key: "Aadhaar Card", value:"4"},{key: "NREGA Job Card", value:"5"},{key: "CKYC KIN", value:"6"},{key: "Aadhaar Token", value:"7"}]
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

      this.years = Array.from(Array(100).keys()).map((val, index) => {
        let v = (this.YYYY - index)+"";
        return {key: v, value: v};
      });
      this.years.unshift({key: 'YYYY', value: 'YYYY'});

      // this.docType = [{"key": "Aadhar", "value": "1"},{"key": "Driving License", "value": "2"},{"key": "passport", "value": "3"}];

      this.selectedTitle = this.titles[0];
      this.selectedReligion = this.religions[0];
      this.selectedMaritialStatus = this.maritals[0];
      this.selectedCategory = this.categories[0];
      this.selectedOccupation = this.occupations[0];
      this.selectedResidence = this.residences[0];
      this.selectedSpouseTitle = this.titles[0];
      this.selectedFatherTitle = this.maleTitles[0];
      this.selectedMotherTitle = this.femaleTitles[0]
      this.selectedQualification = this.qualifications[0];
      this.selectedConstitution = this.constitutions[0];
      this.selectedDocType = this.docType[0];
      this.selectedAssesmentMethodology = this.assessmentMethodology[0];
    }

    console.log("params: ", this.route.snapshot.params);

    this.route.params.subscribe((params) => {

      console.log('PARAMS................................')

      this.cds.changeApplicationId(params.applicationId);

      console.log("params ", params);

      // Make an http request to get the required qde data and set using setQde
      if(params.applicationId != null) {

        // If not coming from leads dashboard
        // if(this.qdeService.getQde().application.applicationId == "" || this.qdeService.getQde().application.applicationId == null) {
          this.qdeHttp.getQdeData(params.applicationId).subscribe(response => {
            console.log("RESPONSE ", response);
            var result = JSON.parse(response["ProcessVariables"]["response"]);
            console.log("Get ", result);

            this.qdeService.setQde(result);
            console.log(result);


            try {
              if(result.application.applicants[this.coApplicantIndex].communicationAddress != null) {
                
                this.commCityState = result.application.applicants[this.coApplicantIndex].communicationAddress.city + " "+ result.application.applicants[this.coApplicantIndex].communicationAddress.state;
                this.qde.application.applicants[this.coApplicantIndex].communicationAddress.city = result.application.applicants[this.coApplicantIndex].communicationAddress.city;
                this.qde.application.applicants[this.coApplicantIndex].communicationAddress.state = result.application.applicants[this.coApplicantIndex].communicationAddress.state;
                this.qde.application.applicants[this.coApplicantIndex].communicationAddress.cityState = this.commCityState;
                this.qde.application.applicants[this.coApplicantIndex].communicationAddress.zipcodeId = result.application.applicants[this.coApplicantIndex].communicationAddress.zipcodeId;
                this.qde.application.applicants[this.coApplicantIndex].communicationAddress.stateId = result.application.applicants[this.coApplicantIndex].communicationAddress.stateId;
                this.qde.application.applicants[this.coApplicantIndex].communicationAddress.cityId = result.application.applicants[this.coApplicantIndex].communicationAddress.cityId;
              }
            } catch(e) {}
            try {
              if(result.application.applicants[this.coApplicantIndex].permanentAddress != null) {
  
                this.commCityState = result.application.applicants[this.coApplicantIndex].permanentAddress.city + " "+ result.application.applicants[this.coApplicantIndex].permanentAddress.state;
                this.qde.application.applicants[this.coApplicantIndex].permanentAddress.city = result.application.applicants[this.coApplicantIndex].permanentAddress.city;
                this.qde.application.applicants[this.coApplicantIndex].permanentAddress.state = result.application.applicants[this.coApplicantIndex].permanentAddress.state;
                this.qde.application.applicants[this.coApplicantIndex].permanentAddress.cityState = this.commCityState;
                this.qde.application.applicants[this.coApplicantIndex].permanentAddress.zipcodeId = result.application.applicants[this.coApplicantIndex].permanentAddress.zipcodeId;
                this.qde.application.applicants[this.coApplicantIndex].permanentAddress.stateId = result.application.applicants[this.coApplicantIndex].permanentAddress.stateId;
                this.qde.application.applicants[this.coApplicantIndex].permanentAddress.cityId = result.application.applicants[this.coApplicantIndex].permanentAddress.cityId;
  
              
              }
            } catch(e) {}
            try {
              if(result.application.applicants[this.coApplicantIndex].residentialAddress != null) {
  
  
                this.commCityState = result.application.applicants[this.coApplicantIndex].residentialAddress.city + " "+ result.application.applicants[this.coApplicantIndex].residentialAddress.state;
                this.qde.application.applicants[this.coApplicantIndex].residentialAddress.city = result.application.applicants[this.coApplicantIndex].residentialAddress.city;
                this.qde.application.applicants[this.coApplicantIndex].residentialAddress.state = result.application.applicants[this.coApplicantIndex].residentialAddress.state;
                this.qde.application.applicants[this.coApplicantIndex].residentialAddress.cityState = this.commCityState;
                this.qde.application.applicants[this.coApplicantIndex].residentialAddress.zipcodeId = result.application.applicants[this.coApplicantIndex].residentialAddress.zipcodeId;
                this.qde.application.applicants[this.coApplicantIndex].residentialAddress.stateId = result.application.applicants[this.coApplicantIndex].residentialAddress.stateId;
                this.qde.application.applicants[this.coApplicantIndex].residentialAddress.cityId = result.application.applicants[this.coApplicantIndex].residentialAddress.cityId;
    
              }
            } catch(e) {}
            try {
              if(result.application.applicants[this.coApplicantIndex].officialCorrespondence != null) {
  
                this.commCityState = result.application.applicants[this.coApplicantIndex].officialCorrespondence.city + " "+ result.application.applicants[this.coApplicantIndex].officialCorrespondence.state;
                this.qde.application.applicants[this.coApplicantIndex].officialCorrespondence.city = result.application.applicants[this.coApplicantIndex].officialCorrespondence.city;
                this.qde.application.applicants[this.coApplicantIndex].officialCorrespondence.state = result.application.applicants[this.coApplicantIndex].officialCorrespondence.state;
                this.qde.application.applicants[this.coApplicantIndex].officialCorrespondence.cityState = this.commCityState;
                this.qde.application.applicants[this.coApplicantIndex].officialCorrespondence.zipcodeId = result.application.applicants[this.coApplicantIndex].officialCorrespondence.zipcodeId;
                this.qde.application.applicants[this.coApplicantIndex].officialCorrespondence.stateId = result.application.applicants[this.coApplicantIndex].officialCorrespondence.stateId;
                this.qde.application.applicants[this.coApplicantIndex].officialCorrespondence.cityId = result.application.applicants[this.coApplicantIndex].officialCorrespondence.cityId;
              }
            } catch(e) {}
            try {
              if(result.application.applicants[this.coApplicantIndex].organizationDetails != null) {
                this.qde.application.applicants[this.coApplicantIndex].organizationDetails = result.application.applicants[this.coApplicantIndex].organizationDetails;
              }
            } catch(e) {}
            try {
              if(result.application.applicants[this.coApplicantIndex].registeredAddress != null) {
  
                this.commCityState = result.application.applicants[this.coApplicantIndex].registeredAddress.city + " "+ result.application.applicants[this.coApplicantIndex].registeredAddress.state;
                this.qde.application.applicants[this.coApplicantIndex].registeredAddress.city = result.application.applicants[this.coApplicantIndex].registeredAddress.city;
                this.qde.application.applicants[this.coApplicantIndex].registeredAddress.state = result.application.applicants[this.coApplicantIndex].registeredAddress.state;
                this.qde.application.applicants[this.coApplicantIndex].registeredAddress.cityState = this.commCityState;
                this.qde.application.applicants[this.coApplicantIndex].registeredAddress.zipcodeId = result.application.applicants[this.coApplicantIndex].registeredAddress.zipcodeId;
                this.qde.application.applicants[this.coApplicantIndex].registeredAddress.stateId = result.application.applicants[this.coApplicantIndex].registeredAddress.stateId;
                this.qde.application.applicants[this.coApplicantIndex].registeredAddress.cityId = result.application.applicants[this.coApplicantIndex].registeredAddress.cityId;
              }
            } catch(e) {}
            
            try {
              if(result.application.applicants[this.coApplicantIndex].corporateAddress != null) {
  
                this.commCityState = result.application.applicants[this.coApplicantIndex].corporateAddress.city + " "+ result.application.applicants[this.coApplicantIndex].corporateAddress.state;
                this.qde.application.applicants[this.coApplicantIndex].corporateAddress.city = result.application.applicants[this.coApplicantIndex].corporateAddress.city;
                this.qde.application.applicants[this.coApplicantIndex].corporateAddress.state = result.application.applicants[this.coApplicantIndex].corporateAddress.state;
                this.qde.application.applicants[this.coApplicantIndex].corporateAddress.cityState = this.commCityState;
                this.qde.application.applicants[this.coApplicantIndex].corporateAddress.zipcodeId = result.application.applicants[this.coApplicantIndex].corporateAddress.zipcodeId;
                this.qde.application.applicants[this.coApplicantIndex].corporateAddress.stateId = result.application.applicants[this.coApplicantIndex].corporateAddress.stateId;
                this.qde.application.applicants[this.coApplicantIndex].corporateAddress.cityId = result.application.applicants[this.coApplicantIndex].corporateAddress.cityId;
              }
            } catch(e) {}


            this.prefillData(params);
          });
        // }
      }
    });
  }

  /**
   * Use to sync between lhs and rhs sliders
   * @param swiperInstance RHS Swiper Instance
   */
  goToNextSlide(swiperInstance: Swiper) {

    // if (form && !form.valid) {
    //   return;
    // }

    // Create ngModel of radio button in future
    swiperInstance.nextSlide();
  }

  /**
   * Use to sync between lhs and rhs sliders
   * @param swiperInstance LHS Swiper Instance
   */
  slideNextTransitionStart(swiperInstance: Swiper) {

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

    if(tabIndex == 0) {
      // Remove not saved coapplicants
      this.qde.application.applicants = this.qde.application.applicants.filter(v => v.applicantId != "");
      this.qdeService.setQde(this.qde);
      this.isTabDisabled = true;
    }

    // Check for invalid tabIndex
    if(tabIndex < this.fragments.length) {
      // alert(tabIndex);
      this.router.navigate([], { fragment: this.fragments[tabIndex]});
    }
  }

  onBackButtonClick(swiperInstance ?: Swiper) {

    if(this.activeTab > -1) {
      if(swiperInstance != null && swiperInstance.getIndex() > 0) {
        // Go to Previous Slide
        this.goToPrevSlide(swiperInstance);
      } else {
        // Go To Previous Tab
        this.tabSwitch(this.activeTab - 1);
      }
    }
  }

  addRemoveEmailField() {
    this.isAlternateEmailId = !this.isAlternateEmailId;
  }

  addRemoveMobileNumberField() {
    this.isAlternateMobileNumber = !this.isAlternateMobileNumber;
  }

  addRemoveResidenceNumberField() {
    this.isAlternateResidenceNumber = !this.isAlternateResidenceNumber;
  }

  //-------------------------------------------------------------
  // PAN
  //-------------------------------------------------------------
  submitPanNumber(form: NgForm, swiperInstance ?: Swiper) {

    event.preventDefault();

    if (form && !form.valid) {
      return;
    }


    this.qde.application.applicants[this.coApplicantIndex].pan.panNumber = form.value.pan;
    this.qde.application.applicants[this.coApplicantIndex].pan.docType = form.value.docTypeindividual.value;
    this.qde.application.applicants[this.coApplicantIndex].pan.docNumber = form.value.docNumber;

    this.qdeHttp.checkPanValid(this.qdeService.getFilteredJson({actualPanNumber: form.value.pan})).subscribe((response) => {

      response["ProcessVariables"]["status"] = true; // Comment while deploying if service is enabled false

      if(response["ProcessVariables"]["status"]) { // Boolean to check from nsdl website whether pan is valid or not 

        this.qde.application.applicants[this.coApplicantIndex].pan.isValid = true;
        this.qde.application.applicants[this.coApplicantIndex].pan.errorMessage = "Error in pan Details";

        let processVariables = response["ProcessVariables"];//need to check its needed for non individual
        this.qde.application.applicants[this.coApplicantIndex].personalDetails.firstName = processVariables["firstName"];
        this.qde.application.applicants[this.coApplicantIndex].personalDetails.lastName = processVariables["lastName"];

        this.qdeHttp.createOrUpdatePanDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
      // If successful
        if(response["ProcessVariables"]["status"]) {
          let result = this.parseJson(response["ProcessVariables"]["response"]);

          console.log("GET141414", result);
          // this.qde.application.ocsNumber = result["application"]["ocsNumber"];
          // this.qde.application.applicationId = result["application"]["applicationId"];
         
          this.qde.application.applicationId = result['application']['applicationId'];

          // let isApplicantPresent:boolean = false;

          if((result["application"]["applicants"]).length > 0) {
            // isApplicantPresent = applicants[this.applicantIndex].hasOwnProperty('applicantId');
            // this.qde.application.applicants[this.coApplicantIndex].applicantId =  applicants[this.coApplicantIndex]["applicantId"];
            // this.cds.changePanSlide(true);
            // this.router.navigate(['/applicant/'+this.qde.application.applicationId+'/co-applicant/'+this.coApplicantIndex]);

            let applicationId = result['application']['applicationId'];
            this.qdeHttp.setStatusApi( applicationId, environment['status']['QDECREATED']).subscribe((response) => {
              if(response["ProcessVariables"]["status"] == true) { 
                this.cds.changePanSlide(true);
                this.router.navigate(['/applicant/'+this.qde.application.applicationId+'/co-applicant/'+this.coApplicantIndex]);
              }
            });

          } else {
            // this.cds.changePanSlide(true);
            this.tabSwitch(2);
          }
        } else {
          this.panErrorCount++;
          // Throw Invalid Pan Error
          }
        }, (error) => {
          console.log('error ', error);
          // alert("error"+error);
          // Throw Request Failure Error
        });
    } else {
        this.qde.application.applicants[this.coApplicantIndex].pan.isValid = false;
        this.qde.application.applicants[this.coApplicantIndex].pan.errorMessage = "Error in pan Details";
      }
    });
  }


  //-------------------------------------------------------------
  // PAN
  //-------------------------------------------------------------

  submitOrgPanNumber(form: NgForm, swiperInstance ?: Swiper) {
    event.preventDefault();

    if (form && !form.valid) {
      return;
    }

    this.qde.application.applicants[this.coApplicantIndex].pan.panNumber = form.value.pan;
    this.qde.application.applicants[this.coApplicantIndex].pan.docType = form.value.docType.value;
    this.qde.application.applicants[this.coApplicantIndex].pan.docNumber = form.value.docNumber;

    this.qdeHttp.checkPanValid(this.qdeService.getFilteredJson({actualPanNumber: form.value.pan})).subscribe((response) => {

        let processVariables = response["ProcessVariables"];//need to check its needed for non individual
        this.qde.application.applicants[this.coApplicantIndex].personalDetails.firstName = processVariables["firstName"];
        this.qde.application.applicants[this.coApplicantIndex].personalDetails.lastName = processVariables["lastName"];

        response["ProcessVariables"]["status"] = true; // Comment while deploying if service is enabled false

      if(response["ProcessVariables"]["status"]) { // Boolean to check from nsdl website whether pan is valid or not 

          this.qde.application.applicants[this.coApplicantIndex].pan.isValid = true;
          this.qde.application.applicants[this.coApplicantIndex].pan.errorMessage = "";

          this.qdeHttp.createOrUpdatePanDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
            // If successfull
            if(response["ProcessVariables"]["status"]) {
              let result = this.parseJson(response["ProcessVariables"]["response"]);

              this.qde.application.applicationId = result['application']['applicationId'];

              // let isApplicantPresent:boolean = false;

              if((result["application"]["applicants"]).length > 0) {
                // isApplicantPresent = applicants[this.applicantIndex].hasOwnProperty('applicantId');
                // this.qde.application.applicants[this.coApplicantIndex].applicantId =  applicants[this.coApplicantIndex]["applicantId"];
                let applicationId = result['application']['applicationId'];
                this.qdeHttp.setStatusApi( applicationId, environment.status.QDECREATED).subscribe((response) => {
                  if(response["ProcessVariables"]["status"] == true) { 
                    this.cds.changePanSlide2(true);
                    this.router.navigate(['/applicant/'+this.qde.application.applicationId+'/co-applicant/'+this.coApplicantIndex]);
                  }
                });

              }else {
                // this.cds.changePanSlide2(true);
                this.tabSwitch(12);
              }
            } else {
              this.panErrorCount++;
              // Throw Invalid Pan Error
            }
          }, (error) => {
            console.log('error ', error);
            // alert("error"+error);
            // Throw Request Failure Error
          }); 
        } else {
          this.qde.application.applicants[this.coApplicantIndex].pan.isValid = false;
          this.qde.application.applicants[this.coApplicantIndex].pan.errorMessage = "Error in pan Details";
        }
    });  
  }

  
  //-------------------------------------------------------------
  

  //-------------------------------------------------------------
  // Personal Details
  //-------------------------------------------------------------
  submitNameDetails(form: NgForm, swiperInstance ?: Swiper) {

    event.preventDefault();

    if (form && !form.valid) {
      return;
    }

    this.qde.application.applicants[this.coApplicantIndex].personalDetails.title = form.value.title.value;
    this.qde.application.applicants[this.coApplicantIndex].personalDetails.firstName = form.value.firstName;
    this.qde.application.applicants[this.coApplicantIndex].personalDetails.middleName = form.value.middleName;
    this.qde.application.applicants[this.coApplicantIndex].personalDetails.lastName = form.value.lastName;

    console.log("*", this.qde);
    console.log("**", this.qdeService.getFilteredJson(this.qde));
    this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
      // If successful
      if(response["ProcessVariables"]["status"]) {
        this.goToNextSlide(swiperInstance);
      } else {
        // Throw Invalid Pan Error
      }
    }, (error) => {
      console.log("response : ", error);
    });
    
  }

  //-------------------------------------------------------------
  submitResidentialNon(value, swiperInstance ?: Swiper) {

    this.qde.application.applicants[this.coApplicantIndex].personalDetails.applicantStatus = value;


    this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
      // If successful
      if(response["ProcessVariables"]["status"]) {
        this.goToNextSlide(swiperInstance);
      } else {
        // Throw Invalid Pan Error
      }
    }, (error) => {
      console.log("response : ", error);
    });
    
  }

  submitGenderDetails(value, swiperInstance ?: Swiper) {

    this.qde.application.applicants[this.coApplicantIndex].personalDetails.gender = value;

    console.log("FILT: ",this.qdeService.getFilteredJson(this.qde));

    this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
      // If successful
      if(response["ProcessVariables"]["status"]) {
        this.goToNextSlide(swiperInstance);
        console.log(response['ProcessVariables']['response']);
      } else {
        // Throw Invalid Pan Error
      }
    }, (error) => {
      console.log("response : ", error);
    });
    
  }

  //-------------------------------------------------------------

  submitQualificationDetails(form: NgForm, swiperInstance ?: Swiper) {
    event.preventDefault();

    if (form && !form.valid) {
      return;
    }

    this.qde.application.applicants[this.coApplicantIndex].personalDetails.qualification = form.value.qualification.value;

    console.log(this.qde.application.applicants[this.coApplicantIndex]);

    this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
      // If successful
      if(response["ProcessVariables"]["status"]) {
        this.goToNextSlide(swiperInstance);
      } else {
        // Throw Invalid Pan Error
      }
    }, (error) => {
      console.log("response : ", error);
    });
    
  }
  private ageError=false;
  submitDobDetails(form: NgForm, swiperInstance ?: Swiper) {
    event.preventDefault();

    if (form && !form.valid) {
      return;
    }
    const dateofbirth = form.value.year.value+'-'+form.value.month.value+'-'+form.value.day.value;
    const d1:any = new Date(dateofbirth);
    const d2:any = new Date();
    var diff = d2 - d1 ;
    var age = Math.floor(diff/(1000*60*60*24*365.25));
    if(age >= 70 || age <=18 ){
      this.ageError = true;
      return;
    }else {
      this.ageError=false;
    }

    this.qde.application.applicants[this.coApplicantIndex].personalDetails.dob = form.value.year.value+'-'+form.value.month.value+'-'+form.value.day.value;
    this.qde.application.applicants[this.coApplicantIndex].personalDetails.birthPlace = form.value.birthPlace;

    console.log(this.qde.application.applicants[this.coApplicantIndex]);

    this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
      // If successful
      if(response["ProcessVariables"]["status"]) {
        this.tabSwitch(3);
      } else {
        // Throw Invalid Pan Error
      }
    }, (error) => {
      console.log("response : ", error);
    });
  }
  //-------------------------------------------------------------


  //-------------------------------------------------------------
  // Contact Details
  //-------------------------------------------------------------
  submitContactDetails(form: NgForm) {

    event.preventDefault();

    if (form && !form.valid) {
      return;
    }

    this.qde.application.applicants[this.coApplicantIndex].contactDetails.preferredEmailId = form.value.preferEmailId;
    this.qde.application.applicants[this.coApplicantIndex].contactDetails.alternateEmailId = form.value.alternateEmailId;
    this.qde.application.applicants[this.coApplicantIndex].contactDetails.mobileNumber = form.value.mobileNumber;
    this.qde.application.applicants[this.coApplicantIndex].contactDetails.alternateMobileNumber = form.value.alternateMobileNumber;
    this.qde.application.applicants[this.coApplicantIndex].contactDetails.residenceNumber = form.value.residenceNumber1+'-'+form.value.residenceNumber2;
    this.qde.application.applicants[this.coApplicantIndex].contactDetails.alternateResidenceNumber = form.value.alternateResidenceNumberStd1+'-'+form.value.alternateResidenceNumber2;



    console.log("CONTACT DETAILS", this.qde.application.applicants[this.coApplicantIndex]);
    this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
      // If successful
      if(response["ProcessVariables"]["status"]) {
        this.tabSwitch(4);
      } else {
        // Throw Invalid Pan Error
      }
    }, (error) => {
      console.log("response : ", error);
    });

  }

  onPinCodeChange(event, screenName) {
    console.log(event.target.value);
     let zipCode= event.target.value
     this.qdeHttp.getCityAndState(zipCode).subscribe((response) => {

        if(response['Error'] == '0') {
          var result = JSON.parse(response["ProcessVariables"]["response"]);

          this.commCityState = "";
  
          if(result.city != null && result.state != null && result.city != "" && result.state != "") {
            this.commCityState = result.city +" "+ result.state;
          }else {
            // alert("Pin code not available / enter proper pincode");
          }

          this.qde.application.applicants[this.coApplicantIndex][screenName].zipcodeId = result.zipcodeId;
          this.qde.application.applicants[this.coApplicantIndex][screenName].stateId = result.stateId;
          this.qde.application.applicants[this.coApplicantIndex][screenName].cityId = result.cityId;
          this.qde.application.applicants[this.coApplicantIndex][screenName].city = result.city;
          this.qde.application.applicants[this.coApplicantIndex][screenName].state = result.state;
          this.qde.application.applicants[this.coApplicantIndex][screenName].cityState = this.commCityState || "XXXX YYYY";
          console.log('city: ', result.city);
        }
        else if(response['Error'] == '1') {
          // alert("Invalid Pin");
        }

     });
  }
  //-------------------------------------------------------------
  

  //-------------------------------------------------------------
  // Communication Details
  //-------------------------------------------------------------
  submitCommunicationAddressDetails(form: NgForm) {

    //  event.preventDefault();

    if (form && !form.valid) {
      return;
    }

    console.log("Comm Addr ", this.qde.application.applicants[this.coApplicantIndex].communicationAddress);


    this.qde.application.applicants[this.coApplicantIndex].communicationAddress.residentialStatus = form.value.residentialStatus.value+"";
    this.qde.application.applicants[this.coApplicantIndex].communicationAddress.addressLineOne = form.value.addressLineOne+"";
    this.qde.application.applicants[this.coApplicantIndex].communicationAddress.addressLineTwo = form.value.addressLineTwo+"";
    this.qde.application.applicants[this.coApplicantIndex].communicationAddress.zipcodeId = this.qde.application.applicants[this.coApplicantIndex].communicationAddress.zipcodeId+"";
    this.qde.application.applicants[this.coApplicantIndex].communicationAddress.cityId = this.qde.application.applicants[this.coApplicantIndex].communicationAddress.cityId+"";
    this.qde.application.applicants[this.coApplicantIndex].communicationAddress.stateId = this.qde.application.applicants[this.coApplicantIndex].communicationAddress.stateId+"";
    this.qde.application.applicants[this.coApplicantIndex].communicationAddress.permanentAddress = form.value.permanentAddress;


    this.qde.application.applicants[this.coApplicantIndex].permanentAddress.addressLineOne = form.value.pAddressLineOne+"";
    this.qde.application.applicants[this.coApplicantIndex].permanentAddress.addressLineTwo = form.value.pAddressLineTwo+"";
    this.qde.application.applicants[this.coApplicantIndex].permanentAddress.zipcodeId = this.qde.application.applicants[this.coApplicantIndex].permanentAddress.zipcodeId+"";
    this.qde.application.applicants[this.coApplicantIndex].permanentAddress.cityId = this.qde.application.applicants[this.coApplicantIndex].permanentAddress.cityId+"";
    this.qde.application.applicants[this.coApplicantIndex].permanentAddress.stateId = this.qde.application.applicants[this.coApplicantIndex].permanentAddress.stateId+"";
    this.qde.application.applicants[this.coApplicantIndex].permanentAddress.numberOfYearsInCurrentResidence = form.value.numberOfYearsInCurrentResidence+"";
    
    console.log(this.qde.application.applicants[this.coApplicantIndex].communicationAddress);

    this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
      // If successful
      if(response["ProcessVariables"]["status"]) {
        this.tabSwitch(5);
      } else {
        // Throw Invalid Pan Error
      }
    }, (error) => {
      console.log("response : ", error);
    });

  }
    //-------------------------------------------------------------

  //-------------------------------------------------------------
  // Marital Status
  //-------------------------------------------------------------
  submitMaritalStatus(form: NgForm, swiperInstance ?: Swiper) {

    if (form && !form.valid) {
      return;
    }

    this.qde.application.applicants[this.coApplicantIndex].maritalStatus.status = form.value.maritalStatus.value;


    console.log(this.qde.application.applicants[this.coApplicantIndex].maritalStatus);
    this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
      // If successful
      if(response["ProcessVariables"]["status"]) {
        // Dont show spouse details for Single

        console.log("Marital Status: ", form.value.maritalStatus.value);
        if(form.value.maritalStatus.value == "2") {
          this.goToNextSlide(swiperInstance);
        } else {
          this.tabSwitch(6);
        }
      } else {
        // Throw Invalid Pan Error
      }
    }, (error) => {
      console.log("response : ", error);
      //this.goToNextSlide(swiperInstance);
    });

  }

  submitSpouseName(form: NgForm, swiperInstance ?: Swiper) {

    if (form && !form.valid) {
      return;
    }

    this.qde.application.applicants[this.coApplicantIndex].maritalStatus.spouseTitle = form.value.spouseTitle.value;
    this.qde.application.applicants[this.coApplicantIndex].maritalStatus.firstName = form.value.firstName;

    console.log(this.qde.application.applicants[this.coApplicantIndex].maritalStatus);
    this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
      // If successful
      if(response["ProcessVariables"]["status"]) {
        this.goToNextSlide(swiperInstance);
      } else {
        // Throw Invalid Pan Error
      }
    }, (error) => {
      console.log("response : ", error);
     // alert("error"+error.);
    });

  }

  submitSpouseEarning(value, swiperInstance ?: Swiper) {

    this.qde.application.applicants[this.coApplicantIndex].maritalStatus.earning = (value == 1) ? true: false;

    console.log(this.qde.application.applicants[this.coApplicantIndex].maritalStatus);
    this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
      // If successful
      if(response["ProcessVariables"]["status"]) {
        if(value == 1) {
          this.goToNextSlide(swiperInstance);
        } else {
          this.tabSwitch(6);
        }
      } else {
        // Throw Invalid Pan Error
      }
    }, (error) => {
      console.log("response : ", error);
      // alert("error"+error);
    });

  }

  submitSpouseEarningAmt(form: NgForm, swiperInstance ?: Swiper) {

    if (form && !form.valid) {
      return;
    }

    // Amount should be number
    if(isNaN(parseInt(form.value.amount))) {
      return;
    }

    this.qde.application.applicants[this.coApplicantIndex].maritalStatus.amount = form.value.amount;

    console.log(this.qde.application.applicants[this.coApplicantIndex].maritalStatus);

    this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
      // If successful
      if(response["ProcessVariables"]["status"]) {
        this.tabSwitch(6);
      } else {
        // Throw Invalid Pan Error
      }
    }, (error) => {
      console.log("response : ", error);
      // this.tabSwitch(7);
    });

  }

  //-------------------------------------------------------------


  //-------------------------------------------------------------
  // Family Details
  //-------------------------------------------------------------
  submitFamilyForm1(form: NgForm, swiperInstance ?: Swiper) {

    if (form && !form.valid) {
      return;
    }

    this.qde.application.applicants[this.coApplicantIndex].familyDetails.numberOfDependents = form.value.numberOfDependents;

    console.log(this.qde.application.applicants[this.coApplicantIndex].familyDetails);

    this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
      // If successful
      if(response["ProcessVariables"]["status"]) {
        this.goToNextSlide(swiperInstance);
      } else {
        // Throw Invalid Pan Error
      }
    }, (error) => {
      console.log("response : ", error);
    });

  }

  submitFamilyForm2(form: NgForm, swiperInstance ?: Swiper) {

    if (form && !form.valid) {
      return;
    }

    this.qde.application.applicants[this.coApplicantIndex].familyDetails.fatherTitle = form.value.fatherTitle.value;
    this.qde.application.applicants[this.coApplicantIndex].familyDetails.fatherName = form.value.fatherName;
    this.qde.application.applicants[this.coApplicantIndex].familyDetails.motherTitle = form.value.motherTitle.value;
    this.qde.application.applicants[this.coApplicantIndex].familyDetails.motherName = form.value.motherName;
    this.qde.application.applicants[this.coApplicantIndex].familyDetails.motherMaidenName = form.value.motherMaidenName;

    console.log(">>>", this.qde.application.applicants[this.coApplicantIndex].familyDetails);

    this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
      // If successful
      if(response["ProcessVariables"]["status"]) {
        this.tabSwitch(7);
      } else {
        // Throw Invalid Pan Error
      }
    }, (error) => {
      console.log("response : ", error);
    });

  }
  //-------------------------------------------------------------


  //-------------------------------------------------------------
  // Other Details
  //-------------------------------------------------------------
  submitOtherForm(form: NgForm) {

    if (form && !form.valid) {
      return;
    }

    this.qde.application.applicants[this.coApplicantIndex].other.religion = form.value.religion.value;
    // if(form.value.religion.value == '6') {
    //   // this.otherReligion = 
    // }

    this.qde.application.applicants[this.coApplicantIndex].other.category = form.value.category.value;

    // this.qde.application.applicants[this.coApplicantIndex].familyDetails.fatherTitle = form.value.fatherTitle;

    console.log("Other: ", this.qde.application.applicants[this.coApplicantIndex].other);

    this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
      // If successful
      if(response["ProcessVariables"]["status"]) {
        this.tabSwitch(8);
      } else {
        // Throw Invalid Pan Error
      }
    }, (error) => {
      console.log("response : ", error);
      // alert("error"+error);
    });

  }
  //-------------------------------------------------------------


  //-------------------------------------------------------------
  // Occupation Details
  //-------------------------------------------------------------
 
  submitOccupationDetails(form: NgForm) {
    if (form && !form.valid) {
      return;
    }
    // const currentExp = form.value.numberOfYearsInCurrentCompany;
    // const totalExp = form.value.totalExperienceYear;
    // if(currentExp > totalExp) {
    //   //form.valid = false;
    //   this.expError = true;
    //   return;
    // }else{
    //   this.expError=false;
    // }
    

    this.qde.application.applicants[this.coApplicantIndex].occupation.occupationType = this.selectedOccupation.value.toString();
    if(this.selectedOccupation.value.toString() != '9' && this.selectedOccupation.value.toString() != '10') {
      this.qde.application.applicants[this.coApplicantIndex].occupation.companyName = form.value.companyName;
    }

    if(this.selectedOccupation.value.toString() != '9' && this.selectedOccupation.value.toString() != '10') {
      this.qde.application.applicants[this.coApplicantIndex].occupation.numberOfYearsInCurrentCompany = (this.selectedOccupation.value.toString() != '9' && this.selectedOccupation.value.toString() != '10') ? form.value.numberOfYearsInCurrentCompany : 0;
    }

    if(this.selectedOccupation.value.toString() != '9' && this.selectedOccupation.value.toString() != '10') {
      this.qde.application.applicants[this.coApplicantIndex].occupation.totalWorkExperience = (this.selectedOccupation.value.toString() != '9' && this.selectedOccupation.value.toString() != '10') ? form.value.totalExperienceYear : 0;
    }

    console.log(this.qde.application.applicants[this.coApplicantIndex].occupation);

    this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
      // If successful
      if(response["ProcessVariables"]["status"]) {
        this.tabSwitch(9);
      } else {
        // Throw Invalid Pan Error
      }
    }, (error) => {
      console.log("response : ", error);
    });

  }
  //-------------------------------------------------------------


  //-------------------------------------------------------------
  // Official Correspondence
  //-------------------------------------------------------------
  submitOfficialCorrespondence(form: NgForm) {
    if (form && !form.valid) {
      return;
    }

    // let zipCityStateID = this.qde.application.applicants[this.coApplicantIndex].officialCorrespondence.zipCityStateID

    // let zipId = zipCityStateID.split(',')[0];
    // let cityId = zipCityStateID.split(',')[1];
    // let stateId = zipCityStateID.split(',')[2];


    this.qde.application.applicants[this.coApplicantIndex].officialCorrespondence = {
      addressLineOne : form.value.ofcA1,
      addressLineTwo : form.value.ofcA2,
      landMark : form.value.landMark,
      zipcodeId : this.qde.application.applicants[this.coApplicantIndex].officialCorrespondence.zipcodeId,
      cityId : this.qde.application.applicants[this.coApplicantIndex].officialCorrespondence.cityId,
      stateId : this.qde.application.applicants[this.coApplicantIndex].officialCorrespondence.stateId,
      officeNumber : form.value.stdCode + '-'+ form.value.offStdNumber,
      //officeNumber :  form.value.offStdNumber,
      officeEmailId : form.value.officeEmail
    };

    console.log("submitOfficialCorrespondence: ", this.qde.application.applicants[this.coApplicantIndex].officialCorrespondence);

    this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
      // If successful
      if(response["ProcessVariables"]["status"]) {
        this.tabSwitch(10);
      } else {
        // Throw Invalid Pan Error
      }
    }, (error) => {
      console.log("response : ", error);
    });
  }
  //-------------------------------------------------------------


  //-------------------------------------------------------------
  // Organization Details
  //-------------------------------------------------------------
  submitOrganizationDetails(form: NgForm) {
    if (form && !form.valid) {
      return;
    }

    console.log(form);
    this.qde.application.applicants[this.coApplicantIndex].organizationDetails.nameOfOrganization = form.value.orgName;
    this.qde.application.applicants[this.coApplicantIndex].organizationDetails.dateOfIncorporation = form.value.year.value+'-'+form.value.month.value+'-'+form.value.day.value;
    this.qde.application.applicants[this.coApplicantIndex].organizationDetails.constitution = form.value.constitution.value;

    console.log(this.qde.application.applicants[this.coApplicantIndex].organizationDetails);

    this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
      // If successful
      if(response["ProcessVariables"]["status"]) {
        let result = this.parseJson(response["ProcessVariables"]["response"]);
        // this.qde.application.ocsNumber = result["application"]["ocsNumber"];
        // this.qde.application.applicants[this.coApplicantIndex].applicantId = result["application"]["applicationId"];
        this.tabSwitch(13);
      } else {
        // Throw Invalid Pan Error
      }
    }, (error) => {
      console.log("response : ", error);
    });
  }


  //-------------------------------------------------------------
  // Registered Address
  //-------------------------------------------------------------
  submitRegisteredAddress(form: NgForm) {
    if (form && !form.valid) {
      return;
    }

    // let zipCityStateID = this.qde.application.applicants[this.coApplicantIndex].registeredAddress.zipCityStateID

    // let zipId = zipCityStateID.split(',')[0] || "";
    // let cityId = zipCityStateID.split(',')[1] || "";
    // let stateId = zipCityStateID.split(',')[2] || "";


    this.qde.application.applicants[this.coApplicantIndex].registeredAddress.registeredAddress = form.value.regAdd;
    this.qde.application.applicants[this.coApplicantIndex].registeredAddress.landMark = form.value.landmark;
    this.qde.application.applicants[this.coApplicantIndex].registeredAddress.zipcodeId = this.qde.application.applicants[this.coApplicantIndex].registeredAddress.zipcodeId;
    this.qde.application.applicants[this.coApplicantIndex].registeredAddress.cityId = this.qde.application.applicants[this.coApplicantIndex].registeredAddress.cityId;
    this.qde.application.applicants[this.coApplicantIndex].registeredAddress.stateId = this.qde.application.applicants[this.coApplicantIndex].registeredAddress.stateId;

    console.log(this.qde.application.applicants[this.coApplicantIndex].registeredAddress);

    this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
      // If successfull
      if(response["ProcessVariables"]["status"]) {
        this.tabSwitch(14);
      } else {
        // Throw Invalid Pan Error
      }
    }, (error) => {
      console.log("response : ", error);
    });
  }

  //-------------------------------------------------------------
  // Corporate Address
  //-------------------------------------------------------------
  submitCorporateAddress(form: NgForm) {
    if (form && !form.valid) {
      return;
    }

    // let zipCityStateID = this.qde.application.applicants[this.coApplicantIndex].corporateAddress.zipCityStateID

    // let zipId = zipCityStateID.split(',')[0] || "";
    // let cityId = zipCityStateID.split(',')[1] || "";
    // let stateId = zipCityStateID.split(',')[2] || "";


    this.qde.application.applicants[this.coApplicantIndex].corporateAddress.corporateAddress = form.value.corpAddress;
    this.qde.application.applicants[this.coApplicantIndex].corporateAddress.landMark = form.value.landmark;
    this.qde.application.applicants[this.coApplicantIndex].corporateAddress.zipcodeId = this.qde.application.applicants[this.coApplicantIndex].corporateAddress.zipcodeId;
    this.qde.application.applicants[this.coApplicantIndex].corporateAddress.cityId = this.qde.application.applicants[this.coApplicantIndex].corporateAddress.cityId;
    this.qde.application.applicants[this.coApplicantIndex].corporateAddress.stateId = this.qde.application.applicants[this.coApplicantIndex].corporateAddress.stateId;
    this.qde.application.applicants[this.coApplicantIndex].corporateAddress.stdNumber = form.value.stdNumber+"-"+form.value.phoneNumber;
    this.qde.application.applicants[this.coApplicantIndex].corporateAddress.officeEmailId = form.value.officeEmailId;

    console.log(this.qde.application.applicants[this.coApplicantIndex].corporateAddress);

    this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
      // If successfull
      if(response["ProcessVariables"]["status"]) {
        this.tabSwitch(15);
      } else {
        // Throw Invalid Pan Error
      }
    }, (error) => {
      console.log("response : ", error);
    });
  }


  //-------------------------------------------------------------
  // Revenue Details
  //-------------------------------------------------------------
  submitRevenueDetails(form: NgForm) {
    if (form && !form.valid) {
      return;
    }


    this.qde.application.applicants[this.coApplicantIndex].revenueDetails.revenue = parseInt(form.value.revenue);
    this.qde.application.applicants[this.coApplicantIndex].revenueDetails.annualNetIncome = parseInt(form.value.annualNetIncome);
    this.qde.application.applicants[this.coApplicantIndex].revenueDetails.grossTurnOver = parseInt(form.value.grossTurnOver);

    console.log(this.qde.application.applicants[this.coApplicantIndex].revenueDetails);

    this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
      // If successfull
      if(response["ProcessVariables"]["status"]) {
        this.tabSwitch(16);
      } else {
        // Throw Invalid Pan Error
      }
    }, (error) => {
      console.log("response : ", error);
    });
  }

  //-----------------------------------------------------------------------
  // Income Details
  //-----------------------------------------------------------------------

  submitIncomeDetails1(form: NgForm, swiperInstance ?: Swiper) {
    if (form && !form.valid) {
      return;
    }

    this.qde.application.applicants[this.coApplicantIndex].incomeDetails.annualFamilyIncome = form.value.annualFamilyIncome;
    this.qde.application.applicants[this.coApplicantIndex].incomeDetails.monthlyExpenditure = form.value.monthlyExpenditure;

    // this.qde.application.applicants[this.coApplicantIndex].incomeDetails.incomeConsider = form.value.incomeConsider;
    // this.qde.application.applicants[this.coApplicantIndex].incomeDetails.monthlyIncome = form.value.monthlyIncome;
    // this.qde.application.applicants[this.coApplicantIndex].incomeDetails.assessmentMethodology = form.value.assessmentMethodology;
    // this.qde.application.applicants[this.coApplicantIndex].incomeDetails.puccaHouse = form.value.puccaHouse;

    console.log("INCOME DETAILS: ", this.qde.application.applicants[this.coApplicantIndex].incomeDetails);

    this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
      // If successfull
      if(response["ProcessVariables"]["status"]) {
        this.goToNextSlide(swiperInstance);
      } else {
        // Throw Invalid Pan Error
      }
    }, (error) => {
      console.log("response : ", error);
    });

  }


  submitIncomeDetails2(form: NgForm, swiperInstance ?: Swiper) {
    if (form && !form.valid) {
      return;
    }

    this.qde.application.applicants[this.coApplicantIndex].incomeDetails.monthlyIncome = form.value.monthlyIncome;
    this.qde.application.applicants[this.coApplicantIndex].incomeDetails.assessmentMethodology = this.selectedAssesmentMethodology['value'];

    console.log("ID: ", this.qde.application.applicants[this.coApplicantIndex].incomeDetails);

    this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
      // If successfull
      if(response["ProcessVariables"]["status"]) {
        this.goToNextSlide(swiperInstance);
      } else {
        // Throw Invalid Pan Error
      }
    }, (error) => {
      console.log("response : ", error);
    });

  }


  parseJson(response):JSON {
    let result = JSON.parse(response);
    return result;
  }
  
  parseInteger(value:any):number {
    return parseInt(value);
  }
  changeIsIndividual(value, swiperInstance ?: Swiper) {
    if(value == 1) {
      console.log("VALUE1: ", value);
      this.goToNextSlide(swiperInstance);
      this.qde.application.applicants[this.coApplicantIndex].isIndividual = true;
    } else {
      console.log("VALUE2: ", value)
      this.tabSwitch(11);
      this.qde.application.applicants[this.coApplicantIndex].isIndividual = false;
    }
  }

  changeResidentialNon(value, swiperInstance ?: Swiper) {
    this.qde.application.applicants[this.coApplicantIndex].personalDetails.applicantStatus = value;
    
    // Make API Request to save that is submitpersonaldetails

  }

  counter(size): Array<number> {
    return new Array(size);
  }

  incomeDetailsYesNo(value, swiperInstance ?: Swiper) {

    this.qde.application.applicants[this.coApplicantIndex].incomeDetails.incomeConsider = (value == 1) ? true : false;

    console.log(">>>", this.qde.application.applicants[this.coApplicantIndex].incomeDetails);

    this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
      // If successfull
      if(response["ProcessVariables"]["status"]) {
        if(value == 1) {
          this.goToNextSlide(swiperInstance);
        }
      } else {
        // Throw Invalid Pan Error
      }
    }, (error) => {
      console.log("response : ", error);
    });
  }

  // doHoldPuccaHouse(value) {
  //   this.qde.application.applicants[this.coApplicantIndex].incomeDetails = {
  //     puccaHouse : value,
  //   };

  //   console.log(this.qde.application.applicants[this.coApplicantIndex].incomeDetails);

  //   this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
  //     // If successfull
  //     if(response["ProcessVariables"]["status"]) {
  //       console.log(response);
  //     } else {
  //       // Throw Invalid Pan Error
  //     }
  //   }, (error) => {
  //     console.log("response : ", error);
  //   });
  // }

  selectValueChanged(event, to, key) {
    let whichSelectQde = this.qde.application.applicants[this.coApplicantIndex];
    let nick = to.getAttribute('nick').split(".");
    to.getAttribute('nick').split(".").forEach((val, i) => {
      if(val == 'day' || val == 'month' || val == 'year') {
        this[key][val].value = event.value;
        return;
      } else {
        if(i == (to.getAttribute('nick').split(".").length-1)) {
          whichSelectQde[val] = event.value;
          return;
        }
        whichSelectQde = whichSelectQde[val]
      }
    });
  }

  selectCoApplicant(applicationId, index) {
    this.router.navigate(['/applicant/'+this.qde.application.applicationId+'/co-applicant/'+index], {fragment: "pan1"});
  }

  changeApplicantStatus(value, swiperInstance ?: Swiper) {
    if(value == 1) {
      this.qde.application.applicants[this.coApplicantIndex].personalDetails.applicantStatus = "1";
    } else {
      this.qde.application.applicants[this.coApplicantIndex].personalDetails.applicantStatus = "2";
    }
    this.goToNextSlide(swiperInstance);
  }

  initializeVariables() {
    this.residenceNumberStdCode = this.qde.application.applicants[this.coApplicantIndex].contactDetails.residenceNumber != "" ? this.qde.application.applicants[this.coApplicantIndex].contactDetails.residenceNumber.split("-")[0] : "";
    this.residenceNumberPhoneNumber = this.qde.application.applicants[this.coApplicantIndex].contactDetails.residenceNumber != "" ? this.qde.application.applicants[this.coApplicantIndex].contactDetails.residenceNumber.split("-")[1] : "";

    this.alternateResidenceNumberStdCode = this.qde.application.applicants[this.coApplicantIndex].contactDetails.alternateResidenceNumber != "" ? this.qde.application.applicants[this.coApplicantIndex].contactDetails.alternateResidenceNumber.split("-")[0] : "";
    this.alternateResidenceNumberPhoneNumber = this.qde.application.applicants[this.coApplicantIndex].contactDetails.alternateResidenceNumber != "" ? this.qde.application.applicants[this.coApplicantIndex].contactDetails.alternateResidenceNumber.split("-")[1] : "";
    this.addressCityState = this.qde.application.applicants[this.coApplicantIndex].communicationAddress.city + '/'+ this.qde.application.applicants[this.coApplicantIndex].communicationAddress.state;

    this.otherReligion = this.qde.application.applicants[this.coApplicantIndex].other.religion == '6' ? this.qde.application.applicants[this.coApplicantIndex].other.religion : '';

    this.registeredAddressCityState = this.qde.application.applicants[this.coApplicantIndex].registeredAddress.city +'/'+ this.qde.application.applicants[this.coApplicantIndex].registeredAddress.state;
    this.corporateAddressCityState = this.qde.application.applicants[this.coApplicantIndex].corporateAddress.city +'-'+ this.qde.application.applicants[this.coApplicantIndex].corporateAddress.state;
    this.corporateAddressStdCode = this.qde.application.applicants[this.coApplicantIndex].corporateAddress.stdNumber != "" ? this.qde.application.applicants[this.coApplicantIndex].corporateAddress.stdNumber.split("-")[0] : "";
    this.corporateAddressPhoneNumber = this.qde.application.applicants[this.coApplicantIndex].corporateAddress.stdNumber != "" ? this.qde.application.applicants[this.coApplicantIndex].corporateAddress.stdNumber.split("-")[1] : "";
    this.officialCorrespondenceStdCode = this.qde.application.applicants[this.coApplicantIndex].officialCorrespondence.officeNumber != "" ? this.qde.application.applicants[this.coApplicantIndex].officialCorrespondence.officeNumber.split("-")[0] : "";
    this.officialCorrespondencePhoneNumber = this.qde.application.applicants[this.coApplicantIndex].officialCorrespondence.officeNumber != "" ? this.qde.application.applicants[this.coApplicantIndex].officialCorrespondence.officeNumber.split("-")[1] : "";

    this.isAlternateEmailId = this.qde.application.applicants[this.coApplicantIndex].contactDetails.alternateEmailId != "" ? true : false;
    this.isAlternateMobileNumber = this.qde.application.applicants[this.coApplicantIndex].contactDetails.alternateMobileNumber != null ? true : false;
    this.isAlternateResidenceNumber = this.qde.application.applicants[this.coApplicantIndex].contactDetails.alternateResidenceNumber != "" ? true : false;
  }

  makePermanentAddressSame(event: boolean) {
    this.qde.application.applicants[this.coApplicantIndex].communicationAddress.permanentAddress = event;

    if(event == true) {
      this.qde.application.applicants[this.coApplicantIndex].permanentAddress.addressLineOne = this.qde.application.applicants[this.coApplicantIndex].communicationAddress.addressLineOne;
      this.qde.application.applicants[this.coApplicantIndex].permanentAddress.addressLineTwo = this.qde.application.applicants[this.coApplicantIndex].communicationAddress.addressLineTwo;
      this.qde.application.applicants[this.coApplicantIndex].permanentAddress.zipcode = this.qde.application.applicants[this.coApplicantIndex].communicationAddress.zipcode;
      this.qde.application.applicants[this.coApplicantIndex].permanentAddress.city = this.qde.application.applicants[this.coApplicantIndex].communicationAddress.city;
      this.qde.application.applicants[this.coApplicantIndex].permanentAddress.state = this.qde.application.applicants[this.coApplicantIndex].communicationAddress.state;
      this.qde.application.applicants[this.coApplicantIndex].permanentAddress.zipcodeId = this.qde.application.applicants[this.coApplicantIndex].communicationAddress.zipcodeId;
      this.qde.application.applicants[this.coApplicantIndex].permanentAddress.cityId = this.qde.application.applicants[this.coApplicantIndex].communicationAddress.cityId;
      this.qde.application.applicants[this.coApplicantIndex].permanentAddress.stateId = this.qde.application.applicants[this.coApplicantIndex].communicationAddress.stateId;
      this.qde.application.applicants[this.coApplicantIndex].permanentAddress.cityState = this.qde.application.applicants[this.coApplicantIndex].communicationAddress.cityState;
 
    } else {
      this.qde.application.applicants[this.coApplicantIndex].permanentAddress.addressLineOne = "";
      this.qde.application.applicants[this.coApplicantIndex].permanentAddress.addressLineTwo = "";
      this.qde.application.applicants[this.coApplicantIndex].permanentAddress.zipcode = "";
      this.qde.application.applicants[this.coApplicantIndex].permanentAddress.city = "";
      this.qde.application.applicants[this.coApplicantIndex].permanentAddress.state = "";
      this.qde.application.applicants[this.coApplicantIndex].permanentAddress.zipcodeId = "";
      this.qde.application.applicants[this.coApplicantIndex].permanentAddress.cityId = "";
      this.qde.application.applicants[this.coApplicantIndex].permanentAddress.stateId = "";
    }
  }

  prefillData(params) {

    // Set ApplicantIndex
    this.cds.changeApplicantIndex(this.qde.application.applicants.findIndex(val => val.isMainApplicant == true));

    console.log("prefilldata: ", this.coApplicantIndex);
    // Make QDE Data Global Across App

    // This is when co-applicant is being edited
    if( params.coApplicantIndex != null && (!isNaN(parseInt(params.coApplicantIndex))) && parseInt(params.coApplicantIndex) != 0 ) {

      this.coApplicantIndex = params.coApplicantIndex;
      this.isTabDisabled = false;
      //------------------------------------------------------
      //    Prefilling values
      //------------------------------------------------------
      // Set CoApplicant for Prefilling the fields
      // this.coApplicantIndex = this.qde.application.applicants.indexOf(params.coApplicantIndex);

      // if ( ! isNaN(parseInt(this.qde.application.applicants[this.coApplicantIndex].pan.docType)) ) {
      //   this.selectedDocType = this.docType[parseInt(this.qde.application.applicants[this.coApplicantIndex].pan.docType)];
      // }

      // Document Type
      if( ! isNaN(parseInt(this.qde.application.applicants[this.coApplicantIndex].pan.docType)) ) {
        this.selectedDocType = this.docType[(parseInt(this.qde.application.applicants[this.coApplicantIndex].pan.docType))-1];
      } 


      // Personal Details Title
      if( ! isNaN(parseInt(this.qde.application.applicants[this.coApplicantIndex].personalDetails.title)) ) {
        this.selectedTitle = this.titles[(parseInt(this.qde.application.applicants[this.coApplicantIndex].personalDetails.title))-1];
      }

      // Personal Details Qualification (different because qualification isnt sending sequential value like 1,2,3)
      if( ! isNaN(parseInt(this.qde.application.applicants[this.coApplicantIndex].personalDetails.qualification)) ) {
        console.log('this.qde.application.applicants[this.coApplicantIndex].personalDetails.qualification: ', this.qde.application.applicants[this.coApplicantIndex].personalDetails.qualification);
        // this.selectedQualification = this.qualifications[(parseInt(this.qde.application.applicants[this.coApplicantIndex].personalDetails.qualification))-1];
        this.selectedQualification = this.qualifications.find(e => e.value == this.qde.application.applicants[this.coApplicantIndex].personalDetails.qualification);
        console.log('selectedQualification: ', this.selectedQualification);
      }

      // Personal Details Day
      if( ! isNaN(parseInt(this.qde.application.applicants[this.coApplicantIndex].personalDetails.dob.split('/')[2])) ) {
        this.dob.day = this.days[parseInt(this.qde.application.applicants[this.coApplicantIndex].personalDetails.dob.split('/')[2])];
      }

      // Personal Details Month
      if( ! isNaN(parseInt(this.qde.application.applicants[this.coApplicantIndex].personalDetails.dob.split('/')[1])) ) {
        this.dob.month = this.months[parseInt(this.qde.application.applicants[this.coApplicantIndex].personalDetails.dob.split('/')[1])];
      }      

      // Personal Details Year
      if( ! isNaN(parseInt(this.qde.application.applicants[this.coApplicantIndex].personalDetails.dob.split('/')[0])) ) {
        this.dob.year = this.years.find(val => this.qde.application.applicants[this.coApplicantIndex].personalDetails.dob.split('/')[0] == val.value);
      }

      // Date of Incorporation Day
      if( ! isNaN(parseInt(this.qde.application.applicants[this.coApplicantIndex].organizationDetails.dateOfIncorporation.split('/')[2])) ) {
        this.organizationDetails.day = this.days[parseInt(this.qde.application.applicants[this.coApplicantIndex].organizationDetails.dateOfIncorporation.split('/')[2])];
      }

      // Date of Incorporation Month
      if( ! isNaN(parseInt(this.qde.application.applicants[this.coApplicantIndex].organizationDetails.dateOfIncorporation.split('/')[1])) ) {
        this.organizationDetails.month = this.months[parseInt(this.qde.application.applicants[this.coApplicantIndex].organizationDetails.dateOfIncorporation.split('/')[1])];
      }

      // Date of Incorporation Year
      if( ! isNaN(parseInt(this.qde.application.applicants[this.coApplicantIndex].organizationDetails.dateOfIncorporation.split('/')[0])) ) {
        this.organizationDetails.year = this.years.find(val => this.qde.application.applicants[this.coApplicantIndex].organizationDetails.dateOfIncorporation.split('/')[0] == val.value);
      }

      // Constitution
      if( ! isNaN(parseInt(this.qde.application.applicants[this.coApplicantIndex].organizationDetails.constitution)) ) {
        console.log('c', this.qde.application.applicants[this.coApplicantIndex].organizationDetails.constitution);
        this.selectedConstitution = this.constitutions[(parseInt(this.qde.application.applicants[this.coApplicantIndex].organizationDetails.constitution))-1];
        console.log(this.selectedConstitution);
      }
      
      // Communication address
      if( ! isNaN(parseInt(this.qde.application.applicants[this.coApplicantIndex].communicationAddress.residentialStatus)) ) {
        this.selectedResidence = this.residences[(parseInt(this.qde.application.applicants[this.coApplicantIndex].communicationAddress.residentialStatus)) - 1];
      }

      if( ! isNaN(parseInt(this.qde.application.applicants[this.coApplicantIndex].maritalStatus.status)) ) {
        this.selectedMaritialStatus = this.maritals[(parseInt(this.qde.application.applicants[this.coApplicantIndex].maritalStatus.status))-1];
      }

      if( ! isNaN(parseInt(this.qde.application.applicants[this.coApplicantIndex].maritalStatus.spouseTitle)) ) {
          this.selectedSpouseTitle = this.titles[(parseInt(this.qde.application.applicants[this.coApplicantIndex].maritalStatus.spouseTitle))-1];
      }

      if( ! isNaN(parseInt(this.qde.application.applicants[this.coApplicantIndex].familyDetails.fatherTitle)) ) {
        this.selectedFatherTitle  = this.titles[(parseInt(this.qde.application.applicants[this.coApplicantIndex].familyDetails.fatherTitle))-1];
      }

      if( ! isNaN(parseInt(this.qde.application.applicants[this.coApplicantIndex].familyDetails.motherTitle)) ) {
        this.selectedMotherTitle = this.titles[(parseInt(this.qde.application.applicants[this.coApplicantIndex].familyDetails.motherTitle))-1];
      }

      // Other
      if( ! isNaN(parseInt(this.qde.application.applicants[this.coApplicantIndex].other.religion)) ) {
        this.selectedReligion = this.religions[(parseInt(this.qde.application.applicants[this.coApplicantIndex].other.religion))-1];
      }

      // Category
      if( ! isNaN(parseInt(this.qde.application.applicants[this.coApplicantIndex].other.category)) ) {
        this.selectedCategory  = this.categories[(parseInt(this.qde.application.applicants[this.coApplicantIndex].other.category))-1];
      }

      // Occupation details
      if( ! isNaN(parseInt(this.qde.application.applicants[this.coApplicantIndex].occupation.occupationType)) ) {
        this.selectedOccupation = this.occupations.find(e => e.value == this.qde.application.applicants[this.coApplicantIndex].occupation.occupationType);
      }

      // Assesment methodology
      console.log("AM: ", this.assessmentMethodology);
      if( ! isNaN(parseInt(this.qde.application.applicants[this.coApplicantIndex].incomeDetails.assessmentMethodology)) ) {
        this.selectedAssesmentMethodology = this.assessmentMethodology[(parseInt(this.qde.application.applicants[this.coApplicantIndex].incomeDetails.assessmentMethodology))-1];
      }

      // Incoming from create in Individual Pan
      if(this.panslide == true && this.qde.application.applicants[this.coApplicantIndex].isIndividual == true) {
        console.log('COAPPLICANTINDEX: ', this.coApplicantIndex);
        // this.panSlider2.setIndex(2);
        this.tabSwitch(2);
      }
      // Incoming from create in Non Individual Pan
      else if(this.panslide2 == true && this.qde.application.applicants[this.coApplicantIndex].isIndividual == false) {
        this.tabSwitch(12);
        this.panSlider4.setIndex(1);
      } else if(this.panslide == false && this.qde.application.applicants[this.coApplicantIndex].isIndividual == true) {
        this.tabSwitch(1);
        this.panSlider2.setIndex(1);
      }
      else if(this.panslide2 == false && this.qde.application.applicants[this.coApplicantIndex].isIndividual == false) {
        this.tabSwitch(11);
        // Enable it when upload file is enabled
        // this.panSlider4.setIndex(1);
      }

      // So that route is now in edit mode only
      this.cds.changePanSlide(false);
      this.cds.changePanSlide2(false);

      this.initializeVariables();
    }
  }

  // New CoApplicant Index for New CoApplicant
  createCoApplicant() {
    this.qdeService.addNewCoApplicant();
    this.initializeVariables();
    this.tabSwitch(1);
  }

  resetQdeForm() {
    this.qdeService.resetQde();
    this.residenceNumberStdCode = "";
    this.residenceNumberPhoneNumber = "";
    this.alternateResidenceNumberStdCode = ""
    this.alternateResidenceNumberPhoneNumber = "";
    this.addressCityState = ""
    this.otherReligion = "";
    this.registeredAddressCityState = "";
    this.corporateAddressCityState = "";
    this.corporateAddressStdCode = "";
    this.corporateAddressPhoneNumber = "";
    this.dob = { day: {key: "DD", value: "DD"}, month: {key: "MM", value: "MM"}, year: {key: "YYYY", value: "YYYY"} };
    this.organizationDetails = { day: {key: "DD", value: "DD"}, month: {key: "MM", value: "MM"}, year: {key: "YYYY", value: "YYYY"} };
    this.commCityState = "";

    this.selectedTitle = this.titles[0];
    this.selectedReligion = this.religions[0];
    this.selectedMaritialStatus = this.maritals[0];
    this.selectedCategory = this.categories[0];
    this.selectedOccupation = this.occupations[0];
    this.selectedResidence = this.residences[0];
    this.selectedSpouseTitle = this.titles[0];
    this.selectedFatherTitle = this.maleTitles[0];
    this.selectedMotherTitle = this.femaleTitles[0]
    this.selectedQualification = this.qualifications[0];
    this.selectedConstitution = this.constitutions[0];
    this.selectedDocType = this.docType[0];
    this.selectedAssesmentMethodology = this.assessmentMethodology[0];
  }

  commZipcodeFocusout($event: any ) {
    //call API
  }

  selectPuccaHouse(value) {
    this.qde.application.applicants[this.coApplicantIndex].incomeDetails.puccaHouse = (value == 1) ? true: false;
  }

  selectPreferedMailingAddress(value) {
    this.qde.application.applicants[this.coApplicantIndex].permanentAddress.preferedMailingAddress = (value == 1) ? true: false;
  }

  expError =false;
  checkOccupationDetailsYears(event: any) {

    if(this.qde.application.applicants[this.coApplicantIndex].occupation.numberOfYearsInCurrentCompany <= this.qde.application.applicants[this.coApplicantIndex].occupation.totalWorkExperience) {
      // Next button should be enabled
      this.expError = false;
    } else {
      this.expError = true;
    }
  }

  ngOnDestroy() {
    this.panslideSub.unsubscribe();
  }

  inOTP: boolean = false;
  backOTP: boolean = false;

  submitOTP(form: NgForm) {
    console.log("Towards OTP");
    const mobileNumber = form.value.mobileNumber;
    this.qde.application.applicants[this.coApplicantIndex].contactDetails.mobileNumber = mobileNumber;

    const applicantId = this.qde.application.applicationId
    this.qdeHttp.sendOTPAPI(mobileNumber, applicantId).subscribe(res => {
      this.inOTP = true;
      // if(res['ProcessVariables']['isPaymentSuccessful'] == true) {
      //   this.showSuccessModal = true;
      //   this.emiAmount = res['ProcessVariables']['emi'];
      //   this.eligibleAmount = res['ProcessVariables']['eligibilityAmount'];
      // }
      // else if(res['ProcessVariables']['isPaymentSuccessful'] == false) {
      //   this.showErrorModal = true;
      // }
     });
  }

  onBackOTP() {
    console.log("Back button pressed")
    this.inOTP = false; 
  }

  validateOTP(form: NgForm) {
    console.log("Payment gateway");
    const mobileNumber = this.qde.application.applicants[this.coApplicantIndex].contactDetails.mobileNumber;
    const applicantId = this.qde.application.applicationId;
    const otp = form.value.otp;

    this.qdeHttp.validateOTPAPI(mobileNumber, applicantId, otp).subscribe(res => {
      if(res['ProcessVariables']['status'] == true) {
        this.otp = "";
        alert("OTP verified successfully");
        this.onBackOTP();
      }else {
        alert("Enter valid OTP");
      }
     });
  }

  allowOnlyNumbers() {
    console.log(this.qde.application.applicants[this.coApplicantIndex].familyDetails.numberOfDependents);
  }
}
