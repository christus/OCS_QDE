import { Other, Applicant } from './../../models/qde.model';
import { Component, OnInit, ViewChild, ElementRef, Renderer2, OnDestroy, Inject, ViewChildren, QueryList, AfterViewInit} from '@angular/core';
    
import * as Swiper from 'swiper/dist/js/swiper.js';
// import { Select2Component } from 'ng2-select2';
import { ActivatedRoute, Router } from '@angular/router';

import { Options } from 'ng5-slider';
import { NgForm } from '@angular/forms';

import Qde from 'src/app/models/qde.model';
import { QdeHttpService } from 'src/app/services/qde-http.service';
import { QdeService } from 'src/app/services/qde.service';

import { CommonDataService } from '../../services/common-data.service';
import { Subscription } from 'rxjs';
import { errors } from '../../services/errors';
import { environment } from 'src/environments/environment.prod';


import { screenPages } from '../../app.constants';
import { UtilService } from '../../services/util.service';
import { MobileService } from '../../services/mobile-constant.service';
import { DatePipe } from '@angular/common';
import { SelectionRangeEnd } from '@progress/kendo-angular-dateinputs';


interface Item {
  key: string,
  value: number | string
}

@Component({
  selector: 'app-co-applicant-qde',
  templateUrl: './co-applicant-qde.component.html',
  styleUrls: ['./co-applicant-qde.component.css']
})
export class CoApplicantQdeComponent implements OnInit, OnDestroy, AfterViewInit {

  panImage:String;

  imageURI:String;


  readonly errors = errors;
  panErrorCount: number = 0;

  // regexPatternForDocType: Array<string> = ['[A-Z]{1}[0-9]{7}','^[A-Z]{2}[0-9]{13}$','^[A-Z]{3}[0-9]{7}$','[2-9]{1}[0-9]{11}','[0-9]{18}','[0-9]{14}','[0-9]{16}'];

  regexPatternForDocType:Array<any>=[{pattern:'[A-Z]{1}[0-9]{7}',hint:"V1234567"},{pattern:'^[A-Z]{2}[0-9]{13}$',hint:"AN0120100051926"},{pattern:'^[A-Z]{3}[0-9]{7}$',hint:"LWN5672084"},{pattern:'[2-9]{1}[0-9]{11}',hint:"12 digit number, with first digit not 0 or 1"},{pattern:'[0-9]{18}',hint:"	18 digit number"},{pattern:'[0-9]{14}',hint:"	14 digit number"},{pattern:'[0-9]{16}',hint:"	16 digit number"}]

  maxlength:Array<string> = ['8','15','10','12','18','14','16'];

  regexPattern = {
    mobileNumber: "^[1-9][0-9]*$",
    stdCode: "^[0][0-9]*$",
    name: "^[A-Za-z ]{0,49}$",
    organizationName: "^[0-9A-Za-z, _&*#'/\\-@]{0,49}$",
    birthPlace:"^[A-Za-z ]{0,99}$",
    address : "^[0-9A-Za-z, _&*#'/\\-]{0,119}$",
    landmark : "^[0-9A-Za-z, _&*#'/\\-]{0,99}$",
    // cityState:"^[0-9A-Za-z, &'#]$",
    pinCode: "^[1-9][0-9]{5}$",
    otp: "^[0-9]+$",
    panInd:"[A-Z]{3}(P)[A-Z]{1}[0-9]{4}[A-Z]{1}",
    panNonInd:"[A-Z]{5}[0-9]{4}[A-Z]{1}",
    amount:"^[1-9][\\d]{0,10}([.][0-9]{0,4})?",
    revenue:"^[1-9][\\d]{0,10}([.][0-9]{0,4})?",
    email:"^\\w+([\.-]?\\w+)*@\\w+([\.-]?\\w+)*(\\.\\w{2,10})+$",
    sameDigit: '^0{6,10}|1{6,10}|2{6,10}|3{6,10}|4{6,10}|5{6,10}|6{6,10}|7{6,10}|8{6,10}|9{6,10}$'
    // revenue:"^[0-9]{0,17}\.[0-9]{1,4}?$"
   
  };

  minValue: number = 1;
  options: Options = {
    floor: 1,
    ceil: 100,
    // step: 1,
    // showTicksValues: false,
    // // showSelectionBar: true,
    // showTicks: true,
    getLegend: (sliderVal: number): string => {
      return  sliderVal + '<b>y</b>';
    },
    // value: 0
  };
  employementOptions: Options = {
    floor: 0,
    ceil: 40,
    // step: 5,
    // showTicksValues: false,
    // // showSelectionBar: true,
    // showTicks: true,
    getLegend: (sliderVal: number): string => {
      return  sliderVal + '<b>y</b>';
    }
  };
  experienceOptions: Options = {
    floor: 0,
    ceil: 40,
    // step: 5,
    // showTicksValues: false,
    // // showSelectionBar: true,
    // showTicks: true,
    getLegend: (sliderVal: number): string => {
      return  sliderVal + '<b>y</b>';
    }
  };
    familyOptions:Options={
    floor:0,
    ceil:20,
    // step: 1,
    // showTicksValues: false,
    // // showSelectionBar: true,
    // showTicks: true,
    getLegend: (sliderVal: number): string => {
      return  sliderVal + '<b></b>';
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

  isDisabled: boolean = false;
  interval;
  timeLeft : number = 180;
  isOTPExpired:boolean = false;
  isOTPEmpty: boolean = true;

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
  isPermanentAddressSame: boolean = false;
  
  applicantIndividual: boolean = true;
  YYYY: number = new Date().getFullYear();

  // For Hide/Show tabs between Indi and Non indi
  applicantStatus:string = "" ;

  dateofBirthKendo:Date;

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
  unOfficialEmails: Array<Item>;
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
  // panslide: boolean;
  // panslide2: boolean;
  applicationId: string;


  
  // panslideSub: Subscription;
  // panslide2Sub: Subscription;
  // qdeSourceSub: Subscription;
  applicationIdSub: Subscription;
  fragmentSub: Subscription;
  paramsSub: Subscription;
  getQdeDataSub: Subscription;
  checkPanValidSub: Subscription;
  createOrUpdatePanDetailsSub: Subscription; 
  setStatusApiSub: Subscription;
  checkPanValidSub2: Subscription;
  createOrUpdatePanDetailsSub2: Subscription;
  setStatusApiSub2: Subscription;
  createOrUpdatePersonalDetailsSub: Subscription;
  createOrUpdatePersonalDetailsSub2: Subscription;
  createOrUpdatePersonalDetailsSub3: Subscription;
  createOrUpdatePersonalDetailsSub4: Subscription;
  createOrUpdatePersonalDetailsSub5: Subscription;
  createOrUpdatePersonalDetailsSub6: Subscription;
  getCityAndStateSub: Subscription;
  createOrUpdatePersonalDetailsSub7: Subscription;
  createOrUpdatePersonalDetailsSub8: Subscription;
  createOrUpdatePersonalDetailsSub9: Subscription;
  createOrUpdatePersonalDetailsSub10: Subscription;
  createOrUpdatePersonalDetailsSub11: Subscription;
  createOrUpdatePersonalDetailsSub12: Subscription;
  createOrUpdatePersonalDetailsSub13: Subscription;
  createOrUpdatePersonalDetailsSub14: Subscription;
  createOrUpdatePersonalDetailsSub15: Subscription;
  createOrUpdatePersonalDetailsSub16: Subscription;
  createOrUpdatePersonalDetailsSub17: Subscription;
  createOrUpdatePersonalDetailsSub18: Subscription;
  createOrUpdatePersonalDetailsSub19: Subscription;
  createOrUpdatePersonalDetailsSub20: Subscription;
  createOrUpdatePersonalDetailsSub21: Subscription;
  createOrUpdatePersonalDetailsSub22: Subscription;
  createOrUpdatePersonalDetailsSub23: Subscription;
  sendOTPAPISub: Subscription;
  validateOTPAPISub: Subscription;
  

  isTabDisabled: boolean = true;

  otp:string;

  idPanDocumnetType: any;
  idPanFileName: string;
  idPanFileSize: string;
  idPanId: string;
  idPanDoc: File;

  isMobile:any;
  selectedRelationship : any;

  isReadOnly: boolean = false;

  isEligibilityForReview: boolean = false;
  isEligibilityForReviewsSub: Subscription;
  isTBMLoggedIn: boolean;
  isDuplicateModalShown: boolean = false;
  isCoApplicantRouteModal: boolean = false;

  isCoApplicantPinModal:boolean = false;

  duplicates: Array<Applicant> = [];
  dobYears: Array<Item>;
  YYYY17YearsAgo = (new Date().getFullYear() - 17);

  isCurrentAddressFromMainApplicant: boolean = true;
  isPermanentAddressFromMainApplicant: boolean = true;
  occupationRequired: boolean = true;

  isValidPan: boolean;
  tempOldPanNumber: string;
  monthsInChar: Array<string> = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

  // Only RHS Sliders
  @ViewChildren('swiperS') swiperS$: QueryList<Swiper>;

  tabName: string;
  page: number;
  auditTrialApiSub: Subscription;
  swiperSliders: Array<Swiper> = [];
  swiperSlidersSub: Subscription;

  isErrorModal:boolean;
  errorMessage:string;
  isOfficialCorrs: boolean;

  applicantRelationships: Array<any>;
  doNotSelectDefault: boolean = false;

  focusedDate:Date;

  focusIncorpDate:Date;

  SelectionRangeEnd: SelectionRangeEnd;

  range;

  ageError:boolean = false;

  min: Date; // minimum date to date of birth amd non indu
  maxDate : Date = new Date();
  // public defaultItem: { key: string, value: number } = { key: "Select item...", value: null };
  
  // public defaultItem: Array<{ key: string, value: number, inStock: boolean }> = [
  //   { key: "Select Title", value: null, inStock: false }
  // ];

  // public itemDisabled(itemArgs: { dataItem: string }) {
  //   return !itemArgs.dataItem. ;
  // }


  constructor(private renderer: Renderer2,
              private route: ActivatedRoute,
              private router: Router,
              private qdeHttp: QdeHttpService,
              private qdeService: QdeService,
              private cds: CommonDataService,
              private utilService: UtilService,
              public datepipe: DatePipe,
              private mobileService: MobileService) {
    this.qde = this.qdeService.defaultValue;

    
    this.isMobile = this.mobileService.isMobile;

    this.cds.changeMenuBarShown(true);
    this.cds.changeViewFormVisible(true);
    this.cds.changeLogoutVisible(true);
    this.cds.changeHomeVisible(true);

    // console.log("QDE:::: ", route.data['qde']);
    // this.panslideSub = this.cds.panslide.subscribe(val => {
    //   this.panslide = val;
    // });

    // this.panslide2Sub = this.cds.panslide2.subscribe(val => {
    //   this.panslide2 = val;
    // });

    // DEPRECATED
    // this.qdeSourceSub = this.qdeService.qdeSource.subscribe(val => {
    //   this.qde = val;
    //   console.log("latest Qde: ", this.qde);
    //   console.log(this.qde.application.applicants.length);
    //   let i = this.qde.application.applicants.length <= 1 ? 1 : this.qde.application.applicants.length - 1;
    //   console.log(i);
    //   // this.isTabDisabled = this.qde.application.applicants.filter(v => v.isMainApplicant == false).length > 0 ? true: false;
    //   if(this.qde.application.applicants.length > i && this.qde.application.applicants[i]['applicantId'] == "") {
    //     this.coApplicantIndex = i;
    //     console.log("coapplicantindex: ", this.coApplicantIndex);
    //     this.isTabDisabled = false;
    //     console.log(this.qde.application.applicants[this.coApplicantIndex]);
    //   }

    //   this.coApplicantsForDashboard = val.application.applicants.filter(v => v.isMainApplicant == false);
    //   this.cds.enableTabsIfStatus1(this.qde.application.status);
    // });

    this.applicationIdSub = this.cds.applicationId.subscribe(val => {

      if(JSON.parse(localStorage.getItem('roles')).includes('TBM')) {
        this.cds.setReadOnlyForm(true);
      } else {
        this.cds.setReadOnlyForm(false);
      }

    });

    // this.fragmentSub = this.route.fragment.subscribe((fragment) => {
    //   let localFragment = fragment;

    //   if(fragment == null) {
    //     localFragment = this.fragments[0];
    //   }
    //   console.log('FRAGMENTS................................', fragment);
      // if(localFragment == 'pan1') {
      //   this.isTabDisabled = true;
      // }

      // Replace Fragments in url
      // if( this.fragments.includes(localFragment) &&
      //     this.panslide == false &&
      //     this.panslide2 == false) {

      //   // if(this.qde.application.applicants[this.coApplicantIndex].isIndividual == true) {
      //   //   if(localFragment == 'pan1') {
      //   //     this.tabSwitch(0);
      //   //     this.panSlider2.setIndex(1);
      //   //   }
      //   // } else if(this.qde.application.applicants[this.coApplicantIndex].isIndividual == false) {
      //   //   if(localFragment == 'pan2') {
      //   //     this.tabSwitch(10);
      //   //   }
      //   // }

      //   this.activeTab = this.fragments.indexOf(localFragment);
      //   this.tabSwitch(this.activeTab);
      //   this.applicantIndividual = (this.activeTab >= 11) ? false: true;
      // }


    // });

    this.fragmentSub = this.route.queryParams.subscribe(val => {

      if(val['tabName'] && val['tabName'] != '') {
        this.tabName = this.fragments.includes(val['tabName']) ? val['tabName'].toString(): this.fragments[0];
        this.activeTab = this.fragments.findIndex(v => v == val['tabName']);
      }

      if(val['page'] && val['page'] != '') {
        this.page = (val && val['page'] != null && parseInt(val['page']) != NaN && parseInt(val['page']) >= 1) ? parseInt(val['page']): 1;
      }

      this.applicantIndividual = (this.activeTab >= 11) ? false: true;

    
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
      this.docType = [{key: "Passport", value:"1"},{key: "Driving License", value:"2"},{key: "Voter's Identity Card", value:"3"},
                      {key: "Aadhaar Card", value:"4"},{key: "NREGA Job Card", value:"5"}
                      ]
      this.maritals = lov.LOVS.maritial_status;
      // this.relationships = lov.LOVS.relationship;
      this.loanpurposes = lov.LOVS.loan_purpose;
      this.categories = lov.LOVS.category;
      this.genders = lov.LOVS.gender;
      this.constitutions = lov.LOVS.constitution;
      this.assessmentMethodology = lov.LOVS.assessment_methodology; 
      this.unOfficialEmails =  lov.LOVS.un_official_emails;

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
        return {key: this.monthsInChar[index], value: v};
      });
      this.months.unshift({key: 'MON', value: 'MM'});

      this.years = Array.from(Array(100).keys()).map((val, index) => {
        let v = (this.YYYY - index)+"";
        return {key: v, value: v};
      });
      this.years.unshift({key: 'YYYY', value: 'YYYY'});

      // Requirement Year should be more than 17 and less than 70
      this.dobYears = Array.from(Array(100).keys()).map((val, index) => {
        let v = (this.YYYY17YearsAgo - index)+"";
        return {key: v, value: v};
      });
      this.dobYears.unshift({key: 'YYYY', value: 'YYYY'});

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

    this.paramsSub = this.route.params.subscribe((params) => {

      
      
      // Make an http request to get the required qde data and set using setQde
      if(params.applicationId != null) {

        this.cds.changeApplicationId(params.applicationId);

        // If not coming from leads dashboard
        // if(this.qdeService.getQde().application.applicationId == "" || this.qdeService.getQde().application.applicationId == null) {

        // Only load once
          if((this.qde.application.applicationId == null || this.qde.application.applicationId == '') && this.qde.application.applicationId != params.applicationId) {

            
              this.getQdeDataSub = this.qdeHttp.getQdeData(params.applicationId).subscribe(response => {
              var result = JSON.parse(response["ProcessVariables"]["response"]);
              this.qde = result;
              this.applicationId = this.qde.application.applicationId;
              this.cds.setStatus(result.application.status);
              this.cds.setactiveTab(screenPages['coApplicantDetails']);
              this.qdeService.setQde(result);
              let mainApplicant = this.qde.application.applicants.find(v => v.isMainApplicant == true);
              let applicantIndex = this.qde.application.applicants.findIndex(v => v.isMainApplicant == true);
              this.coApplicantsForDashboard = result.application.applicants.filter(v => v.isMainApplicant == false);
              this.cds.enableTabsIfStatus1(this.qde.application.status);

              if(this.qde.application.applicants[this.coApplicantIndex]) {
                this.loadOccupationTypeLovs(this.qde.application.applicants[this.coApplicantIndex].occupation.occupationType);
              }

              if(params.coApplicantIndex != null) {
                this.coApplicantIndex = params.coApplicantIndex;
                this.setAssessmentMethodology();
              }
              console.log("Fragment & QueryParams: ", this.tabName, this.page);
              if(this.tabName == this.fragments[10] || this.tabName == this.fragments[16]) {
                this.setAssessmentMethodology();
              }
  
              // TO BE REMOVED
              // this.qdeService.setQde(result);
  
              /***********************************************
              * Check if route is appropriate with Applicants
              * If not then redirect to Dashboard
              ***********************************************/
              if(result.application.applicants.length <= params.coApplicantIndex) {
                this.router.navigate(['/applicant', result.application.applicationId, 'co-applicant'], {queryParams: {tabName: this.fragments[0], page: 1}});
              }

              // if(params['coApplicantIndex'] && this.qde.application.auditTrailDetails.screenPage == screenPages['coApplicantDetails']) {
              //   if(this.qde.application.auditTrailDetails.applicantId == parseInt(this.qde.application.applicants[params.coApplicantIndex].applicantId)) {
              //     this.coApplicantIndex = result.application.applicants.findIndex(v => v.applicantId == this.qde.application.auditTrailDetails.applicantId);
              //     this.router.navigate(['/appplicant', this.qde.application.applicationId, 'co-applicant', params.coApplicantIndex]);
              //     this.goToExactPageAndTab(result.application.auditTrailDetails.tabPage, result.application.auditTrailDetails.pageNumber);
              //   }
              //   // else {
              //   //   this.tabSwitch(0);
              //   // }
  
              // } else {
                if(params['coApplicantIndex'] == null) {
                  this.tabSwitch(0);
                }
              // }
  
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
  
              try{
                if(result.application.applicants[this.coApplicantIndex].pan.fileName != null){
                  this.idPanFileName = result.application.applicants[this.coApplicantIndex].pan.fileName;
                }
              }catch(e) {}  
              
              try{
                if(result.application.applicants[this.coApplicantIndex].pan.fileSize != null){
                  this.idPanFileSize = result.application.applicants[this.coApplicantIndex].pan.fileSize;
                }
              }catch(e) {}  
  
  
              this.prefillData(params);

              if(params.coApplicantIndex != null) {
                this.setRelationship(mainApplicant, params.coApplicantIndex);
              }
            }, error => {
              this.isErrorModal = true;
              this.errorMessage = "Something went wrong, please try again later.";
            });
            
          }
          
      }
      


      if(params['applicationId'] != null) {
        if(this.isEligibilityForReviewsSub != null) {
          this.isEligibilityForReviewsSub.unsubscribe();
        }
        this.isEligibilityForReviewsSub = this.cds.isEligibilityForReviews.subscribe(val => {
          try {
            this.isEligibilityForReview = val.find(v => v.applicationId == params['applicationId'])['isEligibilityForReview'];
          } catch(ex) {
            // this.router.navigate(['/leads']);
          }
        });
      }
    });
 
    this.cds.isTBMLoggedIn.subscribe(val => {
      this.isTBMLoggedIn = val;
    });

    /********************************************************************
    * Check for User and set isReadOnly=true to disable editing of fields
    ********************************************************************/
    this.cds.isReadOnlyForm.subscribe(val => {
      this.isReadOnly = false;
      this.options.readOnly = false;
    });
     let today = new Date();
    let day = today.getDate();
    let month = today.getMonth() + 1;
    let year = today.getFullYear() - 99;


    this.min = new Date(year, month, day);
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
    this.page++;
    this.router.navigate([], {queryParams: { tabName: this.tabName, page: this.page }});
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
    this.page--;
    this.router.navigate([], {queryParams: { tabName: this.tabName, page: this.page }});
  }

  /**
   * Use to sync between lhs and rhs sliders
   * @param swiperInstance LHS Swiper Instance
   */
  slidePrevTransitionStart(swiperInstance: Swiper) {
    swiperInstance.prevSlide();
  }

  tabSwitch(tabIndex ?: number, fromQde ?: boolean) {


    if(tabIndex == 0) {
      // Remove not saved coapplicants
      this.qde.application.applicants = this.qde.application.applicants.filter(v => v.applicantId != "");


      // TO BE REMOVED
      // this.qdeService.setQde(this.qde);
      this.isTabDisabled = true;
    }

    let t = fromQde ? this.page: 1;
    if(this.swiperSliders && this.swiperSliders.length > 0) {
      // if (t == 1 && !fromQde){ 
      //   this.swiperSliders[tabIndex].setIndex(0);
      // } else {
      this.swiperSliders[tabIndex].setIndex(this.page-1);
      // }
    }

    // Check for invalid tabIndex
    if(tabIndex < this.fragments.length) {
      if(tabIndex == 0) {
        this.router.navigate(['/applicant/'+this.qde.application.applicationId+'/co-applicant'], {queryParams: { tabName: this.fragments[tabIndex], page: t }});  
      } else {
        this.router.navigate([], {queryParams: { tabName: this.fragments[tabIndex], page: t }});
      }
    }
  }

  onBackButtonClick(swiperInstance ?: Swiper) {

    if(this.activeTab > -1) {
      if(swiperInstance != null && swiperInstance.getIndex() > 0) {
        // Go to Previous Slide
        this.goToPrevSlide(swiperInstance);
      } else {
        if(this.activeTab == 10 && this.qde.application.applicants[this.coApplicantIndex].incomeDetails.incomeConsider == false) {
          this.tabSwitch(this.activeTab - 2);
        }else if(this.activeTab == 11){
          this.tabSwitch(0);
        }
        else{
        this.tabSwitch(this.activeTab - 1);
        }
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

  getCoApplicantTitle (salutation:string) {
    let titles = JSON.parse(JSON.stringify(this.titles));
    let selectedSalutationObj = {};
    for(let key in titles) {
      let salutationObj = titles[key];
      if(salutationObj["value"] == salutation ) {
        return salutationObj;
      }
    }
    return titles[0];
  }


  getSelectedValue(selectVal , array) {

    let arr = JSON.parse(JSON.stringify(array));
    let selectedSalutationObj = {};
    for(let key in arr) {
      let salutationObj = arr[key];
      if(salutationObj["value"] == selectVal ) {
        return salutationObj;
      }
    }
    return arr[0];

  }

  submitPanNumber(form: NgForm, swiperInstance ?: Swiper) {
    if(this.isTBMLoggedIn) {
      this.tabSwitch(2);
    } else {

      event.preventDefault();

      if (form && !form.valid) {
        return;
      }
  
  
      this.qde.application.applicants[this.coApplicantIndex].pan.panNumber = form.value.pan;
      this.qde.application.applicants[this.coApplicantIndex].pan.docType = form.value.docTypeindividual.value;
      this.qde.application.applicants[this.coApplicantIndex].pan.docNumber = form.value.docNumber;
      if(this.isValidPan == false || this.isValidPan == null) {

        this.checkPanValidSub = this.qdeHttp.checkPanValid(this.qdeService.getFilteredJson({actualPanNumber: form.value.pan})).subscribe((response) => {
  
          // response["ProcessVariables"]["status"] = true; // Comment while deploying if service is enabled false
    
          if(response["ProcessVariables"]["status"] == true && response['ProcessVariables']['isValidPan'] == true) { // Boolean to check from nsdl website whether pan is valid or not 
    
            this.qde.application.applicants[this.coApplicantIndex].pan.panVerified = this.isValidPan = response['ProcessVariables']['isValidPan'];
  
            let processVariables = response["ProcessVariables"];//need to check its needed for non individual
            if (processVariables["firstName"] != "" && processVariables["lastName"] != ""){
              this.qde.application.applicants[this.coApplicantIndex].personalDetails.firstName = processVariables["firstName"];
              this.qde.application.applicants[this.coApplicantIndex].personalDetails.lastName = processVariables["lastName"];
            }            
            if(processVariables["applicantTitleId"] > 0) {
              this.qde.application.applicants[this.coApplicantIndex].personalDetails.title  = processVariables["applicantTitleId"];
            }
            this.createOrUpdatePanDetailsSub = this.qdeHttp.createOrUpdatePanDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
          // If successful
            if(response["ProcessVariables"]["status"] == true) {
              let result = this.parseJson(response["ProcessVariables"]["response"]);
    
              console.log("GET", result);
              // this.qde.application.ocsNumber = result["application"]["ocsNumber"];
              // this.qde.application.applicationId = result["application"]["applicationId"];
             
              this.qde.application.applicationId = result['application']['applicationId'];
    
              // let isApplicantPresent:boolean = false;
    
              if((result["application"]["applicants"]).length > 0) {
                this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(result['application']['applicationId'], result['application']['applicants'][0]['applicantId']+"", 1, this.fragments[this.activeTab+1], screenPages['coApplicantDetails']).subscribe(auditRes => {
                  if(auditRes['ProcessVariables']['status'] == true) {
                    this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
                    this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
                    this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
                    this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
                  }
                }, error => {
                  this.isErrorModal = true;
                  this.errorMessage = "Something went wrong, please try again later.";
                });
                // isApplicantPresent = applicants[this.applicantIndex].hasOwnProperty('applicantId');
                // this.qde.application.applicants[this.coApplicantIndex].applicantId =  applicants[this.coApplicantIndex]["applicantId"];
                // this.cds.changePanSlide(true);
                // this.router.navigate(['/applicant/'+this.qde.application.applicationId+'/co-applicant/'+this.coApplicantIndex]);
    
                let applicationId = result['application']['applicationId'];
                this.setStatusApiSub = this.qdeHttp.setStatusApi( applicationId, environment['status']['QDECREATED']).subscribe((response) => {
                  if(response["ProcessVariables"]["status"] == true) { 
                    // this.cds.changePanSlide(true);
                    this.router.navigate(['/applicant/'+this.qde.application.applicationId+'/co-applicant/'+this.coApplicantIndex], { queryParams: { tabName: this.fragments[2], page: 1 }});
                  }
                }, error => {
                  this.isErrorModal = true;
                  this.errorMessage = "Something went wrong, please try again later.";
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
              this.isErrorModal = true;
              this.errorMessage = "Something went wrong, please try again later.";
            });
        } else {
            this.qde.application.applicants[this.coApplicantIndex].pan.panVerified = false;
            this.isValidPan = false;
          }
        }, error => {
          this.isErrorModal = true;
          this.errorMessage = "Something went wrong, please try again later.";
        });
      }
      // When Pan Not Verified
      else {
        this.createOrUpdatePanDetailsSub = this.qdeHttp.createOrUpdatePanDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
        // If successful
          if(response["ProcessVariables"]["status"] == true) {
            let result = this.parseJson(response["ProcessVariables"]["response"]);

            // this.qde.application.ocsNumber = result["application"]["ocsNumber"];
            // this.qde.application.applicationId = result["application"]["applicationId"];
            
            this.qde.application.applicationId = result['application']['applicationId'];
  
            // let isApplicantPresent:boolean = false;
  
            if((result["application"]["applicants"]).length > 0) {
              this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(result['application']['applicationId'], result['application']['applicants'][0]['applicantId']+"", 1, this.fragments[this.activeTab+1], screenPages['coApplicantDetails']).subscribe(auditRes => {
                if(auditRes['ProcessVariables']['status'] == true) {
                    this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
                    this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
                    this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
                    this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
                }
              } , error => {
                this.isErrorModal = true;
                this.errorMessage = "Something went wrong, please try again later.";
              });

              // isApplicantPresent = applicants[this.applicantIndex].hasOwnProperty('applicantId');
              // this.qde.application.applicants[this.coApplicantIndex].applicantId =  applicants[this.coApplicantIndex]["applicantId"];
              // this.cds.changePanSlide(true);
              // this.router.navigate(['/applicant/'+this.qde.application.applicationId+'/co-applicant/'+this.coApplicantIndex]);
  
              let applicationId = result['application']['applicationId'];
              this.setStatusApiSub = this.qdeHttp.setStatusApi( applicationId, environment['status']['QDECREATED']).subscribe((response) => {
                if(response["ProcessVariables"]["status"] == true) { 
                  // this.cds.changePanSlide(true);
                  this.router.navigate(['/applicant/'+this.qde.application.applicationId+'/co-applicant/'+this.coApplicantIndex], { queryParams: { tabName: this.fragments[2], page: 1 }});
                }
              }, error => {
                this.isErrorModal = true;
                this.errorMessage = "Something went wrong, please try again later.";
              });
  
            } else {
              // this.cds.changePanSlide(true);
              this.tabSwitch(2);
            }
          } else {
            this.panErrorCount++;
            // Throw Invalid Pan Error
            }
          },  (error) => {
            this.isErrorModal = true;
            this.errorMessage = "Something went wrong, please try again later.";
          });
      }

    }
  }


  //-------------------------------------------------------------
  // PAN
  //-------------------------------------------------------------

  submitOrgPanNumber(form: NgForm, swiperInstance ?: Swiper) {
    if(this.isTBMLoggedIn) {
      this.tabSwitch(12);
    } else {
      event.preventDefault();

      if (form && !form.valid) {
        return;
      }
  
      this.qde.application.applicants[this.coApplicantIndex].pan.panNumber = form.value.pan;
      // this.qde.application.applicants[this.coApplicantIndex].pan.docType = form.value.docType.value;
      // this.qde.application.applicants[this.coApplicantIndex].pan.docNumber = form.value.docNumber;
  
      if(this.isValidPan == false || this.isValidPan == null) {
        this.checkPanValidSub2 = this.qdeHttp.checkPanValid(this.qdeService.getFilteredJson({actualPanNumber: form.value.pan})).subscribe((response) => {
  
          let processVariables = response["ProcessVariables"];//need to check its needed for non individual
          this.qde.application.applicants[this.coApplicantIndex].personalDetails.firstName = processVariables["firstName"];
          this.qde.application.applicants[this.coApplicantIndex].personalDetails.lastName = processVariables["lastName"];
          if(processVariables["applicantTitleId"] > 0) {
            this.qde.application.applicants[this.coApplicantIndex].personalDetails.title  = processVariables["applicantTitleId"];
          }
          this.selectedTitle = this.getCoApplicantTitle(processVariables["applicantTitleId"]);
  
        //  response["ProcessVariables"]["status"] = true; // Comment while deploying if service is enabled false
  
          if(response["ProcessVariables"]["status"] && response['ProcessVariables']['isValidPan'] == true) { // Boolean to check from nsdl website whether pan is valid or not 
                        
            this.qde.application.applicants[this.coApplicantIndex].pan.panVerified = true;
  
            this.createOrUpdatePanDetailsSub2 = this.qdeHttp.createOrUpdatePanDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
  
              console.log(response)
  
              // If successfull
              if(response["ProcessVariables"]["status"]) {
                
                let result = this.parseJson(response["ProcessVariables"]["response"]);
  
  
                this.qde.application.applicationId = result['application']['applicationId'];
  
                // let isApplicantPresent:boolean = false;


                if((result["application"]["applicants"]).length > 0) {
                  this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(result['application']['applicationId'], result['application']['applicants'][0]['applicantId']+"", 1, this.fragments[this.activeTab+1], screenPages['coApplicantDetails']).subscribe(auditRes => {
                    if(auditRes['ProcessVariables']['status'] == true) {
                    this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
                    this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
                    this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
                    this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
                    }
                  });
                  // isApplicantPresent = applicants[this.applicantIndex].hasOwnProperty('applicantId');
                  // this.qde.application.applicants[this.coApplicantIndex].applicantId =  applicants[this.coApplicantIndex]["applicantId"];
                  let applicationId = result['application']['applicationId'];
                  this.setStatusApiSub2 = this.qdeHttp.setStatusApi( applicationId, environment.status.QDECREATED).subscribe((response) => {
                    if(response["ProcessVariables"]["status"] == true) { 
                      // this.cds.changePanSlide2(true);
                      // this.router.navigate(['/applicant/'+this.qde.application.applicationId+'/co-applicant/'+this.coApplicantIndex], { queryParams: { tabName: this.fragments[11], page: 1 }});
                      this.tabSwitch(12);
                    }
                  });
  
                }else {
                  // this.cds.changePanSlide2(true);
                  this.tabSwitch(12);
                  // this.goToNextSlide(swiperInstance);
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
            this.isValidPan = false;
            this.qde.application.applicants[this.coApplicantIndex].pan.panVerified = false;
          }
        } , error => {
          this.isErrorModal = true;
          this.errorMessage = "Something went wrong, please try again later.";
        });
      } else {
        this.createOrUpdatePanDetailsSub2 = this.qdeHttp.createOrUpdatePanDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
  
          console.log(response)

          // If successfull
          if(response["ProcessVariables"]["status"]) {
            
            let result = this.parseJson(response["ProcessVariables"]["response"]);


            this.qde.application.applicationId = result['application']['applicationId'];

            // let isApplicantPresent:boolean = false;

            if((result["application"]["applicants"]).length > 0) {
              this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(result['application']['applicationId'], result['application']['applicants'][0]['applicantId']+"", 1, this.fragments[this.activeTab+1], screenPages['coApplicantDetails']).subscribe(auditRes => {
                if(auditRes['ProcessVariables']['status'] == true) {
                    this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
                    this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
                    this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
                    this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
                }
              });
              // isApplicantPresent = applicants[this.applicantIndex].hasOwnProperty('applicantId');
              // this.qde.application.applicants[this.coApplicantIndex].applicantId =  applicants[this.coApplicantIndex]["applicantId"];
              let applicationId = result['application']['applicationId'];
              this.setStatusApiSub2 = this.qdeHttp.setStatusApi( applicationId, environment.status.QDECREATED).subscribe((response) => {
                if(response["ProcessVariables"]["status"] == true) { 
                  // this.cds.changePanSlide2(true);
                  this.router.navigate(['/applicant/'+this.qde.application.applicationId+'/co-applicant/'+this.coApplicantIndex], { queryParams: { tabName: this.fragments[11], page: 1 }});
                }
              });

            }else {
              // this.cds.changePanSlide2(true);
              // this.tabSwitch(12);
              this.goToNextSlide(swiperInstance);
            }
          } else {
            this.panErrorCount++;
            // Throw Invalid Pan Error
          }
        },  (error) => {
          this.isErrorModal = true;
          this.errorMessage = "Something went wrong, please try again later.";
        });
      }
    }
  }

  
  //-------------------------------------------------------------
  

  //-------------------------------------------------------------
  // Personal Details
  //-------------------------------------------------------------
  submitNameDetails(form: NgForm, swiperInstance ?: Swiper) {
    if(this.isTBMLoggedIn) {
      this.goToNextSlide(swiperInstance);
    } else {

      event.preventDefault();

      if (form && !form.valid) {
        return;
      }
  
      this.qde.application.applicants[this.coApplicantIndex].personalDetails.relationShip = this.selectedRelationship;
      this.qde.application.applicants[this.coApplicantIndex].personalDetails.title = form.value.title.value;
      this.qde.application.applicants[this.coApplicantIndex].personalDetails.firstName = form.value.firstName;
      this.qde.application.applicants[this.coApplicantIndex].personalDetails.middleName = form.value.middleName;
      this.qde.application.applicants[this.coApplicantIndex].personalDetails.lastName = form.value.lastName;
  
      console.log("*", this.qde);
      console.log("**", this.qdeService.getFilteredJson(this.qde));
      this.createOrUpdatePersonalDetailsSub = this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
        // If successful
        if(response["ProcessVariables"]["status"]) {
          this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.coApplicantIndex]['applicantId']+"", this.page, this.tabName, screenPages['coApplicantDetails']).subscribe(auditRes => {
            if(auditRes['ProcessVariables']['status'] == true) {
                    this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
                    this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
                    this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
                    this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
            }
          }, error => {
            this.isErrorModal = true;
            this.errorMessage = "Something went wrong, please try again later.";
          });

        let maleTitles = [];
        for(let i = 0; i < this.maleTitles.length; i++) {
          maleTitles.push(this.maleTitles[i].value);
          console.log("maleTiteles:"+ maleTitles);
        }
        let femaleTitles = [];
        for(let i = 0; i < this.femaleTitles.length; i++) {
          femaleTitles.push(this.femaleTitles[i].value);
        }
        console.log("this.selectedTitle: ", this.selectedTitle);
        console.log("this.maleTitles: ", maleTitles.find(v => v == this.selectedTitle.value));
        console.log("this.femaleTiles: ", femaleTitles.find(v => v == this.selectedTitle.value));
        if(maleTitles.find(v => v == this.selectedTitle.value) != null) {
          this.qde.application.applicants[this.coApplicantIndex].personalDetails.gender = '1';
        }
        else if(femaleTitles.find(v => v == this.selectedTitle.value) != null) {
          this.qde.application.applicants[this.coApplicantIndex].personalDetails.gender = '2';
        }
          this.goToNextSlide(swiperInstance);
        } else {
          // Throw Invalid Pan Error
        }
      }, (error) => {
        this.isErrorModal = true;
        this.errorMessage = "Something went wrong, please try again later.";
      });
  
    }
  }

  //-------------------------------------------------------------
  submitResidentialNon(value, swiperInstance ?: Swiper) {

    if(this.isTBMLoggedIn) {
      if(value == 1) {
        this.qde.application.applicants[this.coApplicantIndex].personalDetails.applicantStatus = "1";
      } else {
        this.qde.application.applicants[this.coApplicantIndex].personalDetails.applicantStatus = "2";
      }
      this.goToNextSlide(swiperInstance);
    } else {

      this.qde.application.applicants[this.coApplicantIndex].personalDetails.applicantStatus = value;

      this.createOrUpdatePersonalDetailsSub2 = this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
        // If successful
        if(response["ProcessVariables"]["status"]) {
          this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.coApplicantIndex]['applicantId']+"", this.page, this.tabName, screenPages['coApplicantDetails']).subscribe(auditRes => {
            if(auditRes['ProcessVariables']['status'] == true) {
              this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
              this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
              this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
              this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];

              this.goToNextSlide(swiperInstance);
            }
          } , error => {
            this.isErrorModal = true;
            this.errorMessage = "Something went wrong, please again later.";
          });
        } else {
          // Throw Invalid Pan Error
        }
      }, (error) => {
        this.isErrorModal = true;
        this.errorMessage = "Something went wrong, please again later.";
      });
    }
    

    
  }

  submitGenderDetails(value, swiperInstance ?: Swiper) {

    if(this.isTBMLoggedIn) {
      this.goToNextSlide(swiperInstance);
    } else {
      this.qde.application.applicants[this.coApplicantIndex].personalDetails.gender = value;

      console.log("FILT: ",this.qdeService.getFilteredJson(this.qde));
  
      this.createOrUpdatePersonalDetailsSub3 = this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
        // If successful
        if(response["ProcessVariables"]["status"]) {
          this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.coApplicantIndex]['applicantId']+"", this.page, this.tabName, screenPages['coApplicantDetails']).subscribe(auditRes => {
            if(auditRes['ProcessVariables']['status'] == true) {
                    this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
                    this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
                    this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
                    this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
            }
          } , error => {
            this.isErrorModal = true;
            this.errorMessage = "Something went wrong, please try again later.";
          });
          this.goToNextSlide(swiperInstance);
          console.log(response['ProcessVariables']['response']);
        } else {
          // Throw Invalid Pan Error
        }
      }, (error) => {
        this.isErrorModal = true;
        this.errorMessage = "Something went wrong, please try again later.";
      });
    }
    
  }

  //-------------------------------------------------------------

  submitQualificationDetails(form: NgForm, swiperInstance ?: Swiper) {

    if(this.isTBMLoggedIn) {
      this.goToNextSlide(swiperInstance);
    } else {
      event.preventDefault();

      if (form && !form.valid) {
        return;
      }
  
      this.qde.application.applicants[this.coApplicantIndex].personalDetails.qualification = form.value.qualification.value;
  
      console.log(this.qde.application.applicants[this.coApplicantIndex]);
  
      this.createOrUpdatePersonalDetailsSub4 = this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
        // If successful
        if(response["ProcessVariables"]["status"]) {
          this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.coApplicantIndex]['applicantId']+"", this.page, this.tabName, screenPages['coApplicantDetails']).subscribe(auditRes => {
            if(auditRes['ProcessVariables']['status'] == true) {
                    this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
                    this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
                    this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
                    this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
            }
          } , error => {
            this.isErrorModal = true;
            this.errorMessage = "Something went wrong, please try again later.";
          });
          this.goToNextSlide(swiperInstance);
        } else {
          // Throw Invalid Pan Error
        }
      },  (error) => {
        this.isErrorModal = true;
        this.errorMessage = "Something went wrong, please try again later.";
      });
    }
    
  }

  submitDobDetails(form: NgForm, swiperInstance ?: Swiper) {
    if(this.isTBMLoggedIn) {
      this.tabSwitch(3);
    } else {
      event.preventDefault();

      if (form && !form.valid) {
        return;
      }
      // const dateofbirth = form.value.year.value+'-'+form.value.month.value+'-'+form.value.day.value;

      const dateofbirth = this.dateofBirthKendo;

      const d1:any = new Date(dateofbirth);
      const d2:any = new Date();
      var diff = d2 - d1 ;
      var age = Math.floor(diff/(1000*60*60*24*365.25));
      if(age <=18 ){
        this.ageError = true;
        return;
      }else {
        this.ageError=false;
      }
  
      this.qde.application.applicants[this.coApplicantIndex].personalDetails.dob = form.value.year.value+'-'+
            form.value.month.value+'-'+form.value.day.value;
      this.qde.application.applicants[this.coApplicantIndex].personalDetails.birthPlace = form.value.birthPlace;
  
      console.log(this.qde.application.applicants[this.coApplicantIndex]);
  
      this.createOrUpdatePersonalDetailsSub5 = this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde))
            .subscribe((response) => {
        // If successful
        if(response["ProcessVariables"]["status"]) {
          this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'],
               this.qde['application']['applicants'][this.coApplicantIndex]['applicantId']+"", this.page, 
                  this.tabName, screenPages['coApplicantDetails']).subscribe(auditRes => {
            if(auditRes['ProcessVariables']['status'] == true) {
                    this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
                    this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
                    this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
                    this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
            }
          } , error => {
            this.isErrorModal = true;
            this.errorMessage = "Something went wrong, please try again later.";
          });
          this.qdeHttp.duplicateApplicantCheck(this.qde.application.applicants[this.coApplicantIndex].applicantId).subscribe(res => {
            
            if(res['ProcessVariables']['status'] == true) {
              if(res['ProcessVariables']['response'] == '' || res['ProcessVariables']['response'] == null) {
                this.closeDuplicateModal();
              } else {
                this.duplicates = JSON.parse(res['ProcessVariables']['response'])['duplicates'];
                if(this.duplicates.length > 0 ) {
                  this.openDuplicateModal();
                }
              }
            }
          } , error => {
            this.isErrorModal = true;
            this.errorMessage = "Something went wrong, please try again later.";
          });
        } else {
          // Throw Invalid Pan Error
        }
      }, (error) => {
        this.isErrorModal = true;
        this.errorMessage = "Something went wrong, please try again later.";
      });
    }
  }
  //-------------------------------------------------------------


  //-------------------------------------------------------------
  // Contact Details
  //-------------------------------------------------------------
  submitContactDetails(form: NgForm) {

    if(this.isTBMLoggedIn) {
      this.tabSwitch(4);
    } else {
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
      this.createOrUpdatePersonalDetailsSub6 = this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
        // If successful
        if(response["ProcessVariables"]["status"]) {
          this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.coApplicantIndex]['applicantId']+"", this.page, this.tabName, screenPages['coApplicantDetails']).subscribe(auditRes => {
            if(auditRes['ProcessVariables']['status'] == true) {
                    this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
                    this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
                    this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
                    this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
            }
          }, error => {
            this.isErrorModal = true;
            this.errorMessage = "Something went wrong, please try again later.";
          });
          this.tabSwitch(4);
        } else {
          // Throw Invalid Pan Error
        }
      }, (error) => {
        this.isErrorModal = true;
        this.errorMessage = "Something went wrong, please try again later.";
      });
  
    }
  }

  onPinCodeChange(event, screenName) {
    console.log(event.target.value);
     let zipCode= event.target.value

     if(zipCode.length !=0) {
        this.getCityAndStateSub = this.qdeHttp.getCityAndState(zipCode).subscribe((response) => {

            if(response['Error'] == '0') {
              var result = JSON.parse(response["ProcessVariables"]["response"]);

              this.commCityState = "";
      
              if(result.city != null && result.state != null && result.city != "" && result.state != "") {
                this.commCityState = result.city +" "+ result.state;
              }else {
                // alert("Pin code not available / enter proper pincode");
                  this.isCoApplicantPinModal = true;
              }

              this.qde.application.applicants[this.coApplicantIndex][screenName].zipcodeId = result.zipcodeId;
              this.qde.application.applicants[this.coApplicantIndex][screenName].stateId = result.stateId;
              this.qde.application.applicants[this.coApplicantIndex][screenName].cityId = result.cityId;
              this.qde.application.applicants[this.coApplicantIndex][screenName].city = result.city;
              this.qde.application.applicants[this.coApplicantIndex][screenName].state = result.state;
              this.qde.application.applicants[this.coApplicantIndex][screenName].cityState = this.commCityState || "";
              console.log('city: ', result.city);
            }
            else if(response['Error'] == '1') {
              // alert("Invalid Pin");
            }

        } , error => {
          this.isErrorModal = true;
          this.errorMessage = "Something went wrong, please try again later.";
      });
    }else {
      this.qde.application.applicants[this.coApplicantIndex][screenName].zipcodeId = "";
      this.qde.application.applicants[this.coApplicantIndex][screenName].stateId = "";
      this.qde.application.applicants[this.coApplicantIndex][screenName].cityId = "";


      this.qde.application.applicants[this.coApplicantIndex][screenName].city = "";
      this.qde.application.applicants[this.coApplicantIndex][screenName].state = "";
      this.qde.application.applicants[this.coApplicantIndex][screenName].cityState = "";
    }
  }
  //-------------------------------------------------------------
  

  //-------------------------------------------------------------
  // Communication Details
  //-------------------------------------------------------------
  submitCommunicationAddressDetails(form: NgForm) {

    if(this.isTBMLoggedIn) {
      this.tabSwitch(5);
    } else {

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

      if(this.qde.application.applicants[this.coApplicantIndex].permanentAddress.preferedMailingAddress == undefined ||
        this.qde.application.applicants[this.coApplicantIndex].permanentAddress.preferedMailingAddress == null){
        this.qde.application.applicants[this.coApplicantIndex].permanentAddress.preferedMailingAddress = true;
      }
      // else{
      //   this.qde.application.applicants[this.applicantIndex].permanentAddress.preferedMailingAddress =  this.preferedMailingAddress;
      // }

      console.log(this.qde.application.applicants[this.coApplicantIndex].communicationAddress);

      this.createOrUpdatePersonalDetailsSub7 = this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
        // If successful
        if(response["ProcessVariables"]["status"]) {
          this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.coApplicantIndex]['applicantId']+"", this.page, this.tabName, screenPages['coApplicantDetails']).subscribe(auditRes => {
            if(auditRes['ProcessVariables']['status'] == true) {
                    this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
                    this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
                    this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
                    this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
            }
          }, error => {
            this.isErrorModal = true;
            this.errorMessage = "Something went wrong, please try again later.";
          });
          this.tabSwitch(5);
        } else {
          // Throw Invalid Pan Error
        }
      }, error => {
        this.isErrorModal = true;
        this.errorMessage = "Something went wrong, please try again later.";
      });
    }
  }
    //-------------------------------------------------------------

  //-------------------------------------------------------------
  // Marital Status
  //-------------------------------------------------------------
  submitMaritalStatus(form: NgForm, swiperInstance ?: Swiper) {

    if(this.isTBMLoggedIn) {
      if(form.value.maritalStatus.value == "2") {
        this.goToNextSlide(swiperInstance);
      } else {
        this.tabSwitch(6);
      }      
    } else {
      if (form && !form.valid) {
        return;
      }
  
      this.qde.application.applicants[this.coApplicantIndex].maritalStatus.status = form.value.maritalStatus.value;
  
  
      console.log(this.qde.application.applicants[this.coApplicantIndex].maritalStatus);
      this.createOrUpdatePersonalDetailsSub8 = this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
        // If successful
        if(response["ProcessVariables"]["status"]) {
          // Dont show spouse details for Single
  
          console.log("Marital Status: ", form.value.maritalStatus.value);
          if(form.value.maritalStatus.value == "2") {
            this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.coApplicantIndex]['applicantId']+"", this.page, this.tabName, screenPages['coApplicantDetails']).subscribe(auditRes => {
              if(auditRes['ProcessVariables']['status'] == true) {
                    this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
                    this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
                    this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
                    this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
              }
            }, error => {
              this.isErrorModal = true;
              this.errorMessage = "Something went wrong, please try again later.";
            });
            this.goToNextSlide(swiperInstance);
          } else {
            this.tabSwitch(6);
          }
        } else {
          // Throw Invalid Pan Error
        }
      }, (error) => {
        this.isErrorModal = true;
        this.errorMessage = "Something went wrong, please try again later.";
      });
    }

  }

  submitSpouseName(form: NgForm, swiperInstance ?: Swiper) {

    if(this.isTBMLoggedIn) {
      this.goToNextSlide(swiperInstance);
    } else {
      if (form && !form.valid) {
        return;
      }
  
      this.qde.application.applicants[this.coApplicantIndex].maritalStatus.spouseTitle = form.value.spouseTitle.value;
      this.qde.application.applicants[this.coApplicantIndex].maritalStatus.firstName = form.value.firstName;
  
      console.log(this.qde.application.applicants[this.coApplicantIndex].maritalStatus);
      this.createOrUpdatePersonalDetailsSub9 = this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
        // If successful
        if(response["ProcessVariables"]["status"]) {
          this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.coApplicantIndex]['applicantId']+"", this.page, this.tabName, screenPages['coApplicantDetails']).subscribe(auditRes => {
            if(auditRes['ProcessVariables']['status'] == true) {
                    this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
                    this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
                    this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
                    this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
            }
          } , error => {
            this.isErrorModal = true;
            this.errorMessage = "Something went wrong, please try again later.";
          });
          this.goToNextSlide(swiperInstance);
        } else {
          // Throw Invalid Pan Error
        }
      },  (error) => {
        this.isErrorModal = true;
        this.errorMessage = "Something went wrong, please try again later.";
      });
  
    }
  }

  submitSpouseEarning(value, swiperInstance ?: Swiper) {

    if(this.isTBMLoggedIn) {
      if(value == 1) {
        this.goToNextSlide(swiperInstance);
      } else {
        this.tabSwitch(6);
      }
    } else {
      this.qde.application.applicants[this.coApplicantIndex].maritalStatus.earning = (value == 1) ? true: false;

      console.log(this.qde.application.applicants[this.coApplicantIndex].maritalStatus);
      this.createOrUpdatePersonalDetailsSub10 = this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
        // If successful
        if(response["ProcessVariables"]["status"]) {
          this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.coApplicantIndex]['applicantId']+"", this.page, this.tabName, screenPages['coApplicantDetails']).subscribe(auditRes => {
            if(auditRes['ProcessVariables']['status'] == true) {
                    this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
                    this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
                    this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
                    this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
            }
          } , error => {
            this.isErrorModal = true;
            this.errorMessage = "Something went wrong, please try again later.";
          });
          if(value == 1) {
            this.goToNextSlide(swiperInstance);
          } else {
            this.tabSwitch(6);
          }
        } else {
          // Throw Invalid Pan Error
        }
      }, (error) => {
        this.isErrorModal = true;
        this.errorMessage = "Something went wrong, please try again later.";
      });
    }

  }

  submitSpouseEarningAmt(form: NgForm, swiperInstance ?: Swiper) {

    if(this.isTBMLoggedIn) {
      this.tabSwitch(6);
    } else {
      // if (form && !form.valid) {
      //   return;
      // }
  
      // Amount should be number
      // if(isNaN(parseInt(form.value.amount))) {
      //   return;
      // }
  
      this.qde.application.applicants[this.coApplicantIndex].maritalStatus.amount = form.value.amount;
  
      console.log(this.qde.application.applicants[this.coApplicantIndex].maritalStatus);
  
      this.createOrUpdatePersonalDetailsSub11 = this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
        // If successful
        if(response["ProcessVariables"]["status"]) {
          this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.coApplicantIndex]['applicantId']+"", this.page, this.tabName, screenPages['coApplicantDetails']).subscribe(auditRes => {
            if(auditRes['ProcessVariables']['status'] == true) {
                    this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
                    this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
                    this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
                    this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
            }
          }, error => {
            this.isErrorModal = true;
            this.errorMessage = "Something went wrong, please try again later.";
          });
          this.tabSwitch(6);
        } else {
          // Throw Invalid Pan Error
        }
      },  (error) => {
        this.isErrorModal = true;
        this.errorMessage = "Something went wrong, please try again later.";
      });
    }

  }

  //-------------------------------------------------------------


  //-------------------------------------------------------------
  // Family Details
  //-------------------------------------------------------------
  submitFamilyForm1(form: NgForm, swiperInstance ?: Swiper) {

    if(this.isTBMLoggedIn) {
      this.goToNextSlide(swiperInstance);
    } else {
      if (form && !form.valid) {
        return;
      }
  
      this.qde.application.applicants[this.coApplicantIndex].familyDetails.numberOfDependents = form.value.numberOfDependents;
  
      console.log(this.qde.application.applicants[this.coApplicantIndex].familyDetails);
  
      this.createOrUpdatePersonalDetailsSub12 = this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
        // If successful
        if(response["ProcessVariables"]["status"]) {
          this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.coApplicantIndex]['applicantId']+"", this.page, this.tabName, screenPages['coApplicantDetails']).subscribe(auditRes => {
            if(auditRes['ProcessVariables']['status'] == true) {
                    this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
                    this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
                    this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
                    this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
            }
          }, error => {
            this.isErrorModal = true;
            this.errorMessage = "Something went wrong, please try again later.";
          });
          this.goToNextSlide(swiperInstance);
        } else {
          // Throw Invalid Pan Error
        }
      },  (error) => {
        this.isErrorModal = true;
        this.errorMessage = "Something went wrong, please try again later.";
      });
  
    }
  }

  submitFamilyForm2(form: NgForm, swiperInstance ?: Swiper) {

    if(this.isTBMLoggedIn) {
      this.tabSwitch(7);
    } else {
      if (form && !form.valid) {
        return;
      }
  
      this.qde.application.applicants[this.coApplicantIndex].familyDetails.fatherTitle = form.value.fatherTitle.value;
      this.qde.application.applicants[this.coApplicantIndex].familyDetails.fatherName = form.value.fatherName;
      this.qde.application.applicants[this.coApplicantIndex].familyDetails.motherTitle = form.value.motherTitle.value;
      this.qde.application.applicants[this.coApplicantIndex].familyDetails.motherName = form.value.motherName;
      this.qde.application.applicants[this.coApplicantIndex].familyDetails.motherMaidenName = form.value.motherMaidenName;
  
      console.log(">>>", this.qde.application.applicants[this.coApplicantIndex].familyDetails);
  
      this.createOrUpdatePersonalDetailsSub13 = this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
        // If successful
        if(response["ProcessVariables"]["status"]) {
          this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.coApplicantIndex]['applicantId']+"", this.page, this.tabName, screenPages['coApplicantDetails']).subscribe(auditRes => {
            if(auditRes['ProcessVariables']['status'] == true) {
                    this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
                    this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
                    this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
                    this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
            }
          }, error => {
            this.isErrorModal = true;
            this.errorMessage = "Something went wrong, please try again later.";
          });
          this.tabSwitch(7);
        } else {
          // Throw Invalid Pan Error
        }
      }, (error) => {
        this.isErrorModal = true;
        this.errorMessage = "Something went wrong, please try again later.";
      });
    }

  }
  //-------------------------------------------------------------


  //-------------------------------------------------------------
  // Other Details
  //-------------------------------------------------------------
  submitOtherForm(form: NgForm) {

    if(this.isTBMLoggedIn) {
      this.tabSwitch(8);
    } else {
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
  
      this.createOrUpdatePersonalDetailsSub14 = this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
        // If successful
        if(response["ProcessVariables"]["status"]) {
          this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.coApplicantIndex]['applicantId']+"", this.page, this.tabName, screenPages['coApplicantDetails']).subscribe(auditRes => {
            if(auditRes['ProcessVariables']['status'] == true) {
                    this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
                    this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
                    this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
                    this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
            }
          } , error => {
            this.isErrorModal = true;
            this.errorMessage = "Something went wrong, please try again later.";
          });
          this.tabSwitch(8);
        } else {
          // Throw Invalid Pan Error
        }
      }, (error) => {
        this.isErrorModal = true;
        this.errorMessage = "Something went wrong, please try again later.";
      });
    }

  }
  //-------------------------------------------------------------


  //-------------------------------------------------------------
  // Occupation Details
  //-------------------------------------------------------------
 
  submitOccupationDetails(form: NgForm, swiperInstance ?: Swiper) {

    if(this.isTBMLoggedIn) {
      /*********************************************************************************************************
      * If Salaried, Self Employed Professional, Self Employed Business then only show income consider
      *********************************************************************************************************/
      let data = {
        profileId : this.selectedOccupation.value.toString()
      };

      this.qdeHttp.checkOccupationType(data).subscribe((response) =>{
        
        if(response["ProcessVariables"]["status"]) {
          this.isOfficialCorrs = response["ProcessVariables"]["incomeConsider"];
        }

        if(this.isOfficialCorrs) {
          // this.isApplicantRouteModal = true
          this.goToNextSlide(swiperInstance);
        } else {
          this.tabSwitch(10);
        }


      }, (error) => {
        // this.isErrorModal = true;
        // this.errorMessage = "Something went wrong, please again later.";
      });
      
    } else {
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

      let data = {
        profileId : this.selectedOccupation.value.toString()
      };
      this.qdeHttp.checkOccupationType(data).subscribe((response) =>{


        if(response["ProcessVariables"]["status"]) {
          this.isOfficialCorrs = response["ProcessVariables"]["incomeConsider"];
        }


        this.qde.application.applicants[this.coApplicantIndex].occupation.occupationType = this.selectedOccupation.value.toString();

        if(this.isOfficialCorrs) {
          this.qde.application.applicants[this.coApplicantIndex].occupation.companyName = form.value.companyName;
        }
    
        if(form.value.numberOfYearsInCurrentCompany != null) {
          this.qde.application.applicants[this.coApplicantIndex].occupation.numberOfYearsInCurrentCompany = form.value.numberOfYearsInCurrentCompany;
        } else {
          this.qde.application.applicants[this.coApplicantIndex].occupation.numberOfYearsInCurrentCompany = 0;
        }
    
        if(form.value.totalExperienceYear != null) {
          this.qde.application.applicants[this.coApplicantIndex].occupation.totalWorkExperience = form.value.totalExperienceYear;
        } else {
          this.qde.application.applicants[this.coApplicantIndex].occupation.totalWorkExperience = 0;
        }
  
        // Housewife and non-working
        if(!this.isOfficialCorrs) {
          this.qde.application.applicants[this.coApplicantIndex].incomeDetails.incomeConsider = false;
        }
    
        this.createOrUpdatePersonalDetailsSub15=this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
          // If successful
          if(response["ProcessVariables"]["status"]) {
            this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.coApplicantIndex]['applicantId']+"", this.page, this.tabName, screenPages['applicantDetails']).subscribe(auditRes => {
              if(auditRes['ProcessVariables']['status'] == true) {
                this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
                this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
                this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
                this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
              }
            });
  
            /*********************************************************************************************************
            * If Salaried, Self Employed Professional, Self Employed Business, Retired then only show income consider
            *********************************************************************************************************/
            if(this.isOfficialCorrs) {
              // this.isApplicantRouteModal = true
              this.goToNextSlide(swiperInstance);
            } else {
              this.tabSwitch(10);
            }
            
          } else {
            this.isErrorModal = true;
            this.errorMessage = "Something went wrong, please again later.";
          }
        }, (error) => {
          this.isErrorModal = true;
          this.errorMessage = "Something went wrong, please again later.";
        });

      }, (error) => {
        // this.isErrorModal = true;
        // this.errorMessage = "Something went wrong, please again later.";
      });

      
  
     
    }

  }
  //-------------------------------------------------------------


  //-------------------------------------------------------------
  // Official Correspondence
  //-------------------------------------------------------------
  submitOfficialCorrespondence(form: NgForm) {

    if(this.isTBMLoggedIn) {
      this.tabSwitch(10);
    } else {
      if (form && !form.valid) {
        return;
      }
  
      // let zipCityStateID = this.qde.application.applicants[this.coApplicantIndex].officialCorrespondence.zipCityStateID
  
      // let zipId = zipCityStateID.split(',')[0];
      // let cityId = zipCityStateID.split(',')[1];
      // let stateId = zipCityStateID.split(',')[2];
  
      this.qde.application.applicants[this.coApplicantIndex].officialCorrespondence.addressLineOne = form.value.ofcA1;
      this.qde.application.applicants[this.coApplicantIndex].officialCorrespondence.addressLineTwo = form.value.ofcA2;
      this.qde.application.applicants[this.coApplicantIndex].officialCorrespondence.landMark = form.value.landMark;
      this.qde.application.applicants[this.coApplicantIndex].officialCorrespondence.zipcodeId = this.qde.application.applicants[this.coApplicantIndex].officialCorrespondence.zipcodeId;
      this.qde.application.applicants[this.coApplicantIndex].officialCorrespondence.cityId = this.qde.application.applicants[this.coApplicantIndex].officialCorrespondence.cityId;
      this.qde.application.applicants[this.coApplicantIndex].officialCorrespondence.stateId = this.qde.application.applicants[this.coApplicantIndex].officialCorrespondence.stateId;
      this.qde.application.applicants[this.coApplicantIndex].officialCorrespondence.officeNumber = form.value.stdCode + '-'+ form.value.offStdNumber;
      this.qde.application.applicants[this.coApplicantIndex].officialCorrespondence.officeEmailId = form.value.officeEmail;
  
      console.log("submitOfficialCorrespondence: ", this.qde.application.applicants[this.coApplicantIndex].officialCorrespondence);
  
      this.createOrUpdatePersonalDetailsSub16 = this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
        // If successful
        if(response["ProcessVariables"]["status"]) {
          this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.coApplicantIndex]['applicantId']+"", this.page, this.tabName, screenPages['coApplicantDetails']).subscribe(auditRes => {
            if(auditRes['ProcessVariables']['status'] == true) {
                    this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
                    this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
                    this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
                    this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
            }
          }, error => {
            this.isErrorModal = true;
            this.errorMessage = "Something went wrong, please try again later.";
          });
          this.tabSwitch(10);
        } else {
          // Throw Invalid Pan Error
        }
      }, (error) => {
        this.isErrorModal = true;
        this.errorMessage = "Something went wrong, please try again later.";
      });
    }
  }
  //-------------------------------------------------------------


  //-------------------------------------------------------------
  // Organization Details
  //-------------------------------------------------------------
  submitOrganizationDetails(form: NgForm) {

    if(this.isTBMLoggedIn) {
      this.tabSwitch(13);
    } else {
      if (form && !form.valid) {
        return;
      }
  
      console.log("ORGANIZATIONAL DETAILS: ",form);
      this.qde.application.applicants[this.coApplicantIndex].organizationDetails.nameOfOrganization = form.value.orgName;
      this.qde.application.applicants[this.coApplicantIndex].organizationDetails.dateOfIncorporation = form.value.year.value+'-'+form.value.month.value+'-'+form.value.day.value;
      this.qde.application.applicants[this.coApplicantIndex].organizationDetails.constitution = form.value.constitution.value;
      this.qde.application.applicants[this.coApplicantIndex].organizationDetails.relationShip = this.selectedRelationship;
  
      this.createOrUpdatePersonalDetailsSub17 = this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
        // If successful
        if(response["ProcessVariables"]["status"]) {
          this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.coApplicantIndex]['applicantId']+"", this.page, this.tabName, screenPages['coApplicantDetails']).subscribe(auditRes => {
            if(auditRes['ProcessVariables']['status'] == true) {
                    this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
                    this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
                    this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
                    this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
            }
          }, error => {
            this.isErrorModal = true;
            this.errorMessage = "Something went wrong, please try again later.";
          });
          let result = this.parseJson(response["ProcessVariables"]["response"]);
          this.qdeHttp.duplicateApplicantCheck(this.qde.application.applicants[this.coApplicantIndex].applicantId).subscribe(res => {
            
            if(res['ProcessVariables']['status'] == true) {
              if(res['ProcessVariables']['response'] == '' || res['ProcessVariables']['response'] == null) {
                this.closeDuplicateModal();
              } else {
                this.duplicates = JSON.parse(res['ProcessVariables']['response'])['duplicates'];
                if(this.duplicates.length > 0 ) {
                  this.openDuplicateModal();
                }
              }
            }
          }, error => {
            this.isErrorModal = true;
            this.errorMessage = "Something went wrong, please try again later.";
          });
        } else {
          // Throw Invalid Pan Error
        }
      }, (error) => {
        this.isErrorModal = true;
        this.errorMessage = "Something went wrong, please try again later.";
      });
    }
  }


  //-------------------------------------------------------------
  // Registered Address
  //-------------------------------------------------------------
  submitRegisteredAddress(form: NgForm) {

    if(this.isTBMLoggedIn) {
      this.tabSwitch(14);
    } else {
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
  
      this.createOrUpdatePersonalDetailsSub18 = this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
        // If successfull
        if(response["ProcessVariables"]["status"]) {
          this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.coApplicantIndex]['applicantId']+"", this.page, this.tabName, screenPages['coApplicantDetails']).subscribe(auditRes => {
            if(auditRes['ProcessVariables']['status'] == true) {
                    this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
                    this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
                    this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
                    this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
            }
          }, error => {
            this.isErrorModal = true;
            this.errorMessage = "Something went wrong, please try again later.";
          });
          this.tabSwitch(14);
        } else {
          // Throw Invalid Pan Error
        }
      },(error) => {
        this.isErrorModal = true;
        this.errorMessage = "Something went wrong, please try again later.";
      });
    }
  }

  //-------------------------------------------------------------
  // Corporate Address
  //-------------------------------------------------------------
  submitCorporateAddress(form: NgForm) {

    if(this.isTBMLoggedIn) {
      this.tabSwitch(15);
    } else {
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
  
      this.createOrUpdatePersonalDetailsSub19 = this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
        // If successfull
        if(response["ProcessVariables"]["status"]) {
          this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.coApplicantIndex]['applicantId']+"", this.page, this.tabName, screenPages['coApplicantDetails']).subscribe(auditRes => {
            if(auditRes['ProcessVariables']['status'] == true) {
                    this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
                    this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
                    this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
                    this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
            }
          }, error => {
            this.isErrorModal = true;
            this.errorMessage = "Something went wrong, please try again later.";
          });
          this.tabSwitch(15);
        } else {
          // Throw Invalid Pan Error
        }
      }, (error) => {
        this.isErrorModal = true;
        this.errorMessage = "Something went wrong, please try again later.";
      });
    }
  }


  //-------------------------------------------------------------
  // Revenue Details
  //-------------------------------------------------------------
  submitRevenueDetails(form: NgForm) {

    if(this.isTBMLoggedIn) {
      this.tabSwitch(16);
    } else {
      if (form && !form.valid) {
        return;
      }
  
  
      this.qde.application.applicants[this.coApplicantIndex].revenueDetails.revenue = parseInt(form.value.revenue);
      this.qde.application.applicants[this.coApplicantIndex].revenueDetails.annualNetIncome = parseInt(form.value.annualNetIncome);
      this.qde.application.applicants[this.coApplicantIndex].revenueDetails.grossTurnOver = parseInt(form.value.grossTurnOver);
  
      console.log(this.qde.application.applicants[this.coApplicantIndex].revenueDetails);
  
      this.createOrUpdatePersonalDetailsSub20 = this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
        // If successfull
        if(response["ProcessVariables"]["status"]) {
          this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.coApplicantIndex]['applicantId']+"", this.page, this.tabName, screenPages['coApplicantDetails']).subscribe(auditRes => {
            if(auditRes['ProcessVariables']['status'] == true) {
                    this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
                    this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
                    this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
                    this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
            }
          }, error => {
            this.isErrorModal = true;
            this.errorMessage = "Something went wrong, please try again later.";
          });
          this.tabSwitch(16);
        } else {
          // Throw Invalid Pan Error
        }
      }, (error) => {
        console.log("response : ", error);
      });
    }
  }

  //-----------------------------------------------------------------------
  // Income Details
  //-----------------------------------------------------------------------

  submitAnnualFamilyIncomeIndividual(form: NgForm, swiperInstance ?: Swiper) {

    if(this.isTBMLoggedIn) {
      this.goToNextSlide(swiperInstance);
    } else {
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
  
      this.createOrUpdatePersonalDetailsSub21 = this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
        // If successfull
        if(response["ProcessVariables"]["status"]) {
          this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.coApplicantIndex]['applicantId']+"", this.page, this.tabName, screenPages['coApplicantDetails']).subscribe(auditRes => {
            if(auditRes['ProcessVariables']['status'] == true) {
                    this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
                    this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
                    this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
                    this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
            }
          }, error => {
            this.isErrorModal = true;
            this.errorMessage = "Something went wrong, please try again later.";
          });
          
          this.isCoApplicantRouteModal = true;
          // Show modal here
          this.goToNextSlide(swiperInstance);
        } else {
          // Throw Invalid Pan Error
        }
      }, error => {
        this.isErrorModal = true;
        this.errorMessage = "Something went wrong, please try again later.";
      });
  
    }
  }

  submitMonthlyIncomeIndividual(form: NgForm, swiperInstance ?: Swiper) {
    if(this.isTBMLoggedIn) {
      this.goToNextSlide(swiperInstance);
    } else {
      if (form && !form.valid) {
        return;
      }
  
      this.qde.application.applicants[this.coApplicantIndex].incomeDetails.monthlyIncome = form.value.monthlyIncome;
      this.qde.application.applicants[this.coApplicantIndex].incomeDetails.assessmentMethodology = this.selectedAssesmentMethodology ? this.selectedAssesmentMethodology['value'] : null;

      console.log("ID: ", this.qde.application.applicants[this.coApplicantIndex].incomeDetails);

      this.createOrUpdatePersonalDetailsSub22 = this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
        // If successfull
        if(response["ProcessVariables"]["status"]) {
          this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.coApplicantIndex]['applicantId']+"", this.page, this.tabName, screenPages['applicantDetails']).subscribe(auditRes => {
            if(auditRes['ProcessVariables']['status'] == true) {
              this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
              this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
              this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
              this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
            }
          }, error => {
            this.isErrorModal = true;
            this.errorMessage = "Something went wrong, please try again later.";
          });
          this.isCoApplicantRouteModal = true;
          // this.router.navigate(['/applicant', this.qde.application.applicationId, 'co-applicant'], {fragment: 'dashboard'} );
          // this.goToNextSlide(swiperInstance);
        } else {
          // Throw Invalid Pan Error
        }
      }, error => {
        this.isErrorModal = true;
        this.errorMessage = "Something went wrong, please try again later.";
      });
  
    }
  }


  submitMonthlyIncomeNonIndividual(form: NgForm, swiperInstance ?: Swiper) {

    if(this.isTBMLoggedIn) {
      this.goToNextSlide(swiperInstance);
    } else {
      if (form && !form.valid) {
        return;
      }
  
      this.qde.application.applicants[this.coApplicantIndex].incomeDetails.monthlyIncome = form.value.monthlyIncome;
      this.qde.application.applicants[this.coApplicantIndex].incomeDetails.assessmentMethodology = this.selectedAssesmentMethodology ? this.selectedAssesmentMethodology['value']: null;
  
      console.log("ID: ", this.qde.application.applicants[this.coApplicantIndex].incomeDetails);
  
      this.createOrUpdatePersonalDetailsSub22 = this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
        // If successfull
        if(response["ProcessVariables"]["status"]) {
          this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.coApplicantIndex]['applicantId']+"", this.page, this.tabName, screenPages['coApplicantDetails']).subscribe(auditRes => {
            if(auditRes['ProcessVariables']['status'] == true) {
                    this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
                    this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
                    this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
                    this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
            }
          }, error => {
            this.isErrorModal = true;
            this.errorMessage = "Something went wrong, please try again later.";
          });

          this.isCoApplicantRouteModal = true;
         // this.goToNextSlide(swiperInstance);
        } 
        else {
          // Throw Invalid Pan Error
        }
      }, error => {
        this.isErrorModal = true;
        this.errorMessage = "Something went wrong, please try again later.";
      });
  
    }
    this.isCoApplicantRouteModal = true
  }


  parseJson(response):JSON {
    let result = JSON.parse(response);
    return result;
  }
  
  parseInteger(value:any):number {
    return parseInt(value);
  }

  changeIsIndividual(value, swiperInstance ?: Swiper) {
    this.beferoStatus = this.qde.application.applicants[this.coApplicantIndex].isIndividual;
    if(value == 1) {
      if (this.beferoStatus == false){
        this.qde.application.applicants[this.coApplicantIndex].isIndividual = true;
        this.changeIsIndividualStatus = true;
        console.log("current status before",this.changeIsIndividualStatus);
      }
      else{
        this.goToNextSlide(swiperInstance);
        this.qde.application.applicants[this.coApplicantIndex].isIndividual = true;
      }
      // console.log("VALUE1: ", value);
      // this.goToNextSlide(swiperInstance);
      // this.qde.application.applicants[this.coApplicantIndex].isIndividual = true;
    } else {
      console.log("VALUE2: ", value)
      console.log("current status before" , this.qde.application.applicants[this.coApplicantIndex].isIndividual)
      if (this.beferoStatus == true){
        this.qde.application.applicants[this.coApplicantIndex].isIndividual = false;
        this.changeIsIndividualStatus = true;
      }
      else{
        this.qde.application.applicants[this.coApplicantIndex].isIndividual = false;
        this.tabSwitch(11);  
      }
      // this.tabSwitch(11);
      // this.qde.application.applicants[this.coApplicantIndex].isIndividual = false;
    }

    this.loadOccupationTypeLovs();
  }

  
  changeIsIndividualStatus: boolean = false;
  beferoStatus: boolean = false;

  resetIndividualData(btnValue,swiperInstance ?: Swiper) {
    
    this.changeIsIndividualStatus = false
    let currentPanValue = this.beferoStatus;
   
    
    let applicationId =  this.route.snapshot.params["applicationId"];

    let applicantId =this.qde.application.applicants[this.coApplicantIndex].applicantId;

     if (btnValue=="yes" && currentPanValue == true) {
      console.log("inside yes click and ", btnValue);
        
          let data = {
            "userId": parseInt(localStorage.getItem("userId")),
            "applicantId": applicantId,
            "docType": 1,
            "applicationId": Number(applicationId)
          };
    
          //flash exiting dataresetIn
          this.qdeHttp.flashExitingData(data).subscribe(
            data =>{            
              // console.log(JSON.parse(data["ProcessVariables"]["response"])["application"])
              this.qde.application = JSON.parse(data["ProcessVariables"]["response"])["application"];
              this.qdeService.setQde(this.qde);
              this.auditTrial(applicationId,applicantId,1,"pan1",screenPages['coApplicantDetails']);           
              this.tabSwitch(11);
              this.qde.application.applicants[this.coApplicantIndex].isIndividual = false;
            } 
          );    
        
          this.setRelationship(this.qde.application.applicants.find(v => v.isMainApplicant == true), this.coApplicantIndex);
    }else if (btnValue=="yes" && currentPanValue == false){
      console.log("inside no click and ", btnValue);
  
        let data = {          
          "userId": parseInt(localStorage.getItem("userId")),
          "applicantId": applicantId,
          "docType": 1,
          "applicationId": Number(applicationId)
        };
    
        //flash exiting dataresetIn

        this.qdeHttp.flashExitingData(data).subscribe(
          data =>{          

            this.qde.application = JSON.parse(data["ProcessVariables"]["response"])["application"]; 
            this.qdeService.setQde(this.qde);         
            this.auditTrial(applicationId,applicantId,2,"pan1",screenPages['coApplicantDetails']);
            this.goToNextSlide(swiperInstance);
            this.qde.application.applicants[this.coApplicantIndex].isIndividual = true;
          } 
        );      

        this.setRelationship(this.qde.application.applicants.find(v => v.isMainApplicant == true), this.coApplicantIndex);
    } else if ( btnValue=="no" && currentPanValue==false){
      
        this.auditTrial(applicationId,applicantId,1,"pan1",screenPages['coApplicantDetails']);
        this.tabSwitch(11);
        this.qde.application.applicants[this.coApplicantIndex].isIndividual = false;
    }
    else if(btnValue=="no" && currentPanValue==true)
    {
      
        this.qde.application.applicants[this.coApplicantIndex].isIndividual = true;
        this.auditTrial(applicationId,applicantId,2,"pan1",screenPages['coApplicantDetails']);
        this.goToNextSlide(swiperInstance);
    }
    
  }

  auditTrial(applicationId: string, applicantId: string, pageNumber: number, tabPage: string, screenPage: string){
  this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(applicationId,applicantId,pageNumber,tabPage,screenPage).subscribe(auditRes => {
    if(auditRes['ProcessVariables']['status'] == true) {
      this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
      this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
      this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
      this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
    }
  });
}

  changeResidentialNon(value, swiperInstance ?: Swiper) {
    this.qde.application.applicants[this.coApplicantIndex].personalDetails.applicantStatus = value;
    
    // Make API Request to save that is submitpersonaldetails

  }

  counter(size): Array<number> {
    return new Array(size);
  }

  incomeConsiderYesNoIndividual(value, swiperInstance ?: Swiper) {

    if(this.isTBMLoggedIn) {
      if(this.qde.application.applicants[this.coApplicantIndex].incomeDetails.incomeConsider) {
        this.tabSwitch(9);
      } else {
        this.tabSwitch(10);
      }
    } else {

      const incomeIsConsider = this.qde.application.applicants[this.coApplicantIndex].incomeDetails.incomeConsider;

      if((incomeIsConsider == true? 1:2) != value) {
        if(!incomeIsConsider) {

          this.qde.application.applicants[this.coApplicantIndex].incomeDetails = {
            annualFamilyIncome: "",
            monthlyExpenditure: "",
            incomeConsider: null,
            puccaHouse: null
          };
  
          this.qde.application.applicants[this.coApplicantIndex].officialCorrespondence= {
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
          };
  
          this.officialCorrespondencePhoneNumber = "";
          this.officialCorrespondenceStdCode = "";
          
        }else {
          this.qde.application.applicants[this.coApplicantIndex].incomeDetails = {
            incomeConsider: null,
            assessmentMethodology: "",
          };
        }
      }

      this.qde.application.applicants[this.coApplicantIndex].incomeDetails.incomeConsider = (value == 1) ? true : false;

  
      this.createOrUpdatePersonalDetailsSub23 = this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
        // If successfull
        if(response["ProcessVariables"]["status"]) {
          this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.coApplicantIndex]['applicantId']+"", this.page, this.tabName, screenPages['coApplicantDetails']).subscribe(auditRes => {
            if(auditRes['ProcessVariables']['status'] == true) {
                    this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
                    this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
                    this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
                    this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
            }
          }, error => {
            this.isErrorModal = true;
            this.errorMessage = "Something went wrong, please try again later.";
          });

          

          if(this.qde.application.applicants[this.coApplicantIndex].incomeDetails.incomeConsider) {
            this.tabSwitch(9);
          } else {
            this.tabSwitch(10);
          }
        } else {
          // Throw Invalid Pan Error
        }
      }, error => {
        this.isErrorModal = true;
        this.errorMessage = "Something went wrong, please try again later.";
      });
    }
  }

  incomeConsiderYesNoNonIndividual(value, swiperInstance ?: Swiper) {

    if(this.isTBMLoggedIn) {
      if(value == 1) {
        this.goToNextSlide(swiperInstance);
      } 
      else if(value == 2) {
        this.isCoApplicantRouteModal = true;
      }
    } else {

      const incomeIsConsider = this.qde.application.applicants[this.coApplicantIndex].incomeDetails.incomeConsider;

      if((incomeIsConsider == true? 1:2) != value) {
        if(!incomeIsConsider) {

          this.qde.application.applicants[this.coApplicantIndex].incomeDetails = {
            annualFamilyIncome: "",
            monthlyExpenditure: "",
            incomeConsider: null,
            puccaHouse: null
          };
  
          this.qde.application.applicants[this.coApplicantIndex].officialCorrespondence= {
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
          };
  
          this.officialCorrespondencePhoneNumber = "";
          this.officialCorrespondenceStdCode = "";
         
        }else {
          this.qde.application.applicants[this.coApplicantIndex].incomeDetails = {
            incomeConsider: null,
            assessmentMethodology: "",
          };
        }
      }


      this.qde.application.applicants[this.coApplicantIndex].incomeDetails.incomeConsider = (value == 1) ? true : false;

      console.log(">>>", this.qde.application.applicants[this.coApplicantIndex].incomeDetails);
  
      this.createOrUpdatePersonalDetailsSub23 = this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
        // If successfull
        if(response["ProcessVariables"]["status"]) {

          this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.coApplicantIndex]['applicantId']+"", this.page, this.tabName, screenPages['coApplicantDetails']).subscribe(auditRes => {
            if(auditRes['ProcessVariables']['status'] == true) {
                    this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
                    this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
                    this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
                    this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
            }
          }, error => {
            this.isErrorModal = true;
            this.errorMessage = "Something went wrong, please try again later.";
          });


          if(value == 1) {
            this.goToNextSlide(swiperInstance);
          } 
          else if(value == 2) {
            this.isCoApplicantRouteModal = true;
          }
        } else {
          // Throw Invalid Pan Error
        }
      }, error => {
        this.isErrorModal = true;
        this.errorMessage = "Something went wrong, please try again later.";
      });
    }
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
        // this[key][val].value = event.value;
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

  selectValueChangedOccupation(event) {
    this.qdeHttp.occupationLovCompanyDetails(event.value).subscribe(response => {
      this.occupationRequired = response["ProcessVariables"]["status"]
    });
  }

  selectCoApplicant(applicationId, index) {
    
    this.coApplicantIndex = index;
    // if( this.qde.application.auditTrailDetails.screenPage == screenPages['coApplicantDetails'] &&
    //     this.qde.application.auditTrailDetails.applicantId == parseInt(this.qde.application.applicants[index].applicantId)) {
        
    //   this.router.navigate(['/applicant/'+applicationId+'/co-applicant/'+index],
    //     {queryParams: { tabName: this.qde.application.auditTrailDetails.tabPage,
    //       page: this.qde.application.auditTrailDetails.pageNumber }});

    
      // this.router.navigate(['/applicant/'+applicationId+'/co-applicant/'+index])
    // } else {
    //   console.log("else  part of id ", this.fragments);
    //   this.router.navigate(['/applicant/'+this.qde.application.applicationId+'/co-applicant/'+index],
     
    //    {queryParams: { tabName: this.fragments[index], page: this.page }});
      
    // }

    if(this.qde.application.applicants[index].isIndividual == true) {
        this.router.navigate(['/applicant/'+this.qde.application.applicationId+'/co-applicant/'+index], {queryParams: { tabName: this.fragments[1], page: 1 }});
    } else {
      this.router.navigate(['/applicant/'+this.qde.application.applicationId+'/co-applicant/'+index], {queryParams: { tabName: this.fragments[11], page: 1 }});
    }
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
    this.selectOneAddr(2);
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
      this.isPermanentAddressSame = true;
    } else {
      this.isPermanentAddressSame = false;
      this.qde.application.applicants[this.coApplicantIndex].permanentAddress.addressLineOne = "";
      this.qde.application.applicants[this.coApplicantIndex].permanentAddress.addressLineTwo = "";
      this.qde.application.applicants[this.coApplicantIndex].permanentAddress.zipcode = "";
      this.qde.application.applicants[this.coApplicantIndex].permanentAddress.city = "";
      this.qde.application.applicants[this.coApplicantIndex].permanentAddress.state = "";
      this.qde.application.applicants[this.coApplicantIndex].permanentAddress.zipcodeId = "";
      this.qde.application.applicants[this.coApplicantIndex].permanentAddress.cityId = "";
      this.qde.application.applicants[this.coApplicantIndex].permanentAddress.stateId = "";
      this.qde.application.applicants[this.coApplicantIndex].permanentAddress.cityState = "";
    }
  }

  makeCorporateAddressSame(event: boolean) {
    this.qde.application.applicants[this.coApplicantIndex].registeredAddress.corporateAddress = event;

    if(event == true) {
      this.qde.application.applicants[this.coApplicantIndex].corporateAddress.corporateAddress = this.qde.application.applicants[this.coApplicantIndex].registeredAddress.registeredAddress;
      this.qde.application.applicants[this.coApplicantIndex].corporateAddress.landMark = this.qde.application.applicants[this.coApplicantIndex].registeredAddress.landMark;
      this.qde.application.applicants[this.coApplicantIndex].corporateAddress.zipcode = this.qde.application.applicants[this.coApplicantIndex].registeredAddress.zipcode;
   
      this.qde.application.applicants[this.coApplicantIndex].corporateAddress.city = this.qde.application.applicants[this.coApplicantIndex].registeredAddress.city;
      this.qde.application.applicants[this.coApplicantIndex].corporateAddress.state = this.qde.application.applicants[this.coApplicantIndex].registeredAddress.state;
      this.qde.application.applicants[this.coApplicantIndex].corporateAddress.cityState = this.qde.application.applicants[this.coApplicantIndex].registeredAddress.cityState;
      this.qde.application.applicants[this.coApplicantIndex].corporateAddress.zipcodeId = this.qde.application.applicants[this.coApplicantIndex].registeredAddress.zipcodeId;
      this.qde.application.applicants[this.coApplicantIndex].corporateAddress.stateId = this.qde.application.applicants[this.coApplicantIndex].registeredAddress.stateId;
      this.qde.application.applicants[this.coApplicantIndex].corporateAddress.cityId = this.qde.application.applicants[this.coApplicantIndex].registeredAddress.cityId;

   
    } else {
      this.qde.application.applicants[this.coApplicantIndex].corporateAddress.corporateAddress = "";
      this.qde.application.applicants[this.coApplicantIndex].corporateAddress.zipcode = "";
      this.qde.application.applicants[this.coApplicantIndex].corporateAddress.cityState = "";
      this.qde.application.applicants[this.coApplicantIndex].corporateAddress.stateId = "";
      this.qde.application.applicants[this.coApplicantIndex].corporateAddress.zipcodeId = "";
      this.qde.application.applicants[this.coApplicantIndex].corporateAddress.city = "";
      this.qde.application.applicants[this.coApplicantIndex].corporateAddress.cityId = "";
      this.qde.application.applicants[this.coApplicantIndex].corporateAddress.state = "";
    }
  }

  prefillData(params) {

    // Set ApplicantIndex
    this.cds.changeApplicantIndex(this.qde.application.applicants.findIndex(val => val.isMainApplicant == true));

    console.log("prefilldata: ", this.coApplicantIndex);
    // Make QDE Data Global Across App

    // This is when co-applicant is being edited
    if( params.coApplicantIndex != null && (!isNaN(parseInt(params.coApplicantIndex))) && params.coApplicantIndex < this.qde.application.applicants.length) {

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
        // this.selectedDocType = this.docType[(parseInt(this.qde.application.applicants[this.coApplicantIndex].pan.docType))-1];
        this.selectedDocType = this.getSelectedValue(this.qde.application.applicants[this.coApplicantIndex].pan.docType, this.docType);

      } 


      // Personal Details Title
      if( ! isNaN(parseInt(this.qde.application.applicants[this.coApplicantIndex].personalDetails.title)) ) {
        this.selectedTitle = this.getCoApplicantTitle(this.qde.application.applicants[this.coApplicantIndex].personalDetails.title);
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

      if(this.dob.year.value == "YYYY") {
        this.focusedDate = new Date();
      }else {
        this.focusedDate = new Date(parseInt(this.dob.year.value.toString()), parseInt(this.dob.month.value.toString())-1, parseInt(this.dob.day.value.toString()));
      }


      console.log("focusedDate **", this.focusedDate);


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

      if(this.organizationDetails.year.value == "YYYY") {
        this.focusIncorpDate = new Date();
      }else {
        this.focusIncorpDate = new Date(parseInt(this.organizationDetails.year.value.toString()), parseInt(this.organizationDetails.month.value.toString())-1, parseInt(this.organizationDetails.day.value.toString())) ||  new Date();
      }


      console.log("focusedDate **", this.focusIncorpDate);

      // Constitution
      if( ! isNaN(parseInt(this.qde.application.applicants[this.coApplicantIndex].organizationDetails.constitution)) ) {
        console.log('c', this.qde.application.applicants[this.coApplicantIndex].organizationDetails.constitution);
        // this.selectedConstitution = this.constitutions[(parseInt(this.qde.application.applicants[this.coApplicantIndex].organizationDetails.constitution))-1];
        // console.log(this.selectedConstitution);

        this.selectedConstitution = this.getSelectedValue(this.qde.application.applicants[this.coApplicantIndex].organizationDetails.constitution, this.constitutions);

      }
      
      // Communication address
      if( ! isNaN(parseInt(this.qde.application.applicants[this.coApplicantIndex].communicationAddress.residentialStatus)) ) {
        // this.selectedResidence = this.residences[(parseInt(this.qde.application.applicants[this.coApplicantIndex].communicationAddress.residentialStatus)) - 1];
        this.selectedResidence = this.getSelectedValue(this.qde.application.applicants[this.coApplicantIndex].communicationAddress.residentialStatus, this.residences);

      }

      if( ! isNaN(parseInt(this.qde.application.applicants[this.coApplicantIndex].maritalStatus.status)) ) {
        // this.selectedMaritialStatus = this.maritals[(parseInt(this.qde.application.applicants[this.coApplicantIndex].maritalStatus.status))-1];
        this.selectedMaritialStatus = this.getSelectedValue(this.qde.application.applicants[this.coApplicantIndex].maritalStatus.status, this.maritals);

      }

      if( ! isNaN(parseInt(this.qde.application.applicants[this.coApplicantIndex].maritalStatus.spouseTitle)) ) {
        // this.selectedSpouseTitle = this.titles[(parseInt(this.qde.application.applicants[this.coApplicantIndex].maritalStatus.spouseTitle))-1];
        this.selectedSpouseTitle = this.getSelectedValue(this.qde.application.applicants[this.coApplicantIndex].maritalStatus.spouseTitle, this.titles);

      }

      if( ! isNaN(parseInt(this.qde.application.applicants[this.coApplicantIndex].familyDetails.fatherTitle)) ) {
        // this.selectedFatherTitle  = this.titles[(parseInt(this.qde.application.applicants[this.coApplicantIndex].familyDetails.fatherTitle))-1];
        this.selectedFatherTitle = this.getSelectedValue(this.qde.application.applicants[this.coApplicantIndex].familyDetails.fatherTitle, this.maleTitles);
      }

      if( ! isNaN(parseInt(this.qde.application.applicants[this.coApplicantIndex].familyDetails.motherTitle)) ) {
        // this.selectedMotherTitle = this.titles[(parseInt(this.qde.application.applicants[this.coApplicantIndex].familyDetails.motherTitle))-1];
        this.selectedMotherTitle = this.getSelectedValue(this.qde.application.applicants[this.coApplicantIndex].familyDetails.motherTitle, this.femaleTitles);
      }

      // Other
      if( ! isNaN(parseInt(this.qde.application.applicants[this.coApplicantIndex].other.religion)) ) {
        // this.selectedReligion = this.religions[(parseInt(this.qde.application.applicants[this.coApplicantIndex].other.religion))-1];
        this.selectedReligion =  this.getSelectedValue(this.qde.application.applicants[this.coApplicantIndex].other.religion, this.religions);
      }

      // Category
      if( ! isNaN(parseInt(this.qde.application.applicants[this.coApplicantIndex].other.category)) ) {
        // this.selectedCategory  = this.categories[(parseInt(this.qde.application.applicants[this.coApplicantIndex].other.category))-1];
        this.selectedCategory = this.getSelectedValue(this.qde.application.applicants[this.coApplicantIndex].other.category, this.categories);
      }

      // Occupation details
      // if( ! isNaN(parseInt(this.qde.application.applicants[this.coApplicantIndex].occupation.occupationType)) ) {
      //   this.selectedOccupation = this.occupations.find(e => e.value == this.qde.application.applicants[this.coApplicantIndex].occupation.occupationType);
      // }

      // Assesment methodology
      console.log("AM: ", this.assessmentMethodology);
      if( ! isNaN(parseInt(this.qde.application.applicants[this.coApplicantIndex].incomeDetails.assessmentMethodology)) ) {
        // this.selectedAssesmentMethodology = this.assessmentMethodology[(parseInt(this.qde.application.applicants[this.coApplicantIndex].incomeDetails.assessmentMethodology))-1];
        // this.selectedAssesmentMethodology = this.assessmentMethodology.find(v => v.value == this.qde.application.applicants[this.coApplicantIndex].incomeDetails.assessmentMethodology);
         this.selectedAssesmentMethodology = this.getSelectedValue(this.qde.application.applicants[this.coApplicantIndex].incomeDetails.assessmentMethodology, this.assessmentMethodology);
      }

      // try {
      //   this.selectedRelationship = this.qde.application.applicants[this.coApplicantIndex].personalDetails.relationShip || this.relationships[0].value;
      // } catch(ex) {
      //   this.selectedRelationship = this.relationships[0].value;
      // }

      // // Incoming from create in Individual Pan
      // if(this.panslide == true && this.qde.application.applicants[this.coApplicantIndex].isIndividual == true) {
      //   console.log('COAPPLICANTINDEX: ', this.coApplicantIndex);
      //   // this.tabSwitch(1);
      //   this.swiperSliders.forEach((v, i, a) => {
      //     v.setIndex(0);
      //   });
      //   this.tabSwitch(2);
      //   // this.panSlider2.setIndex(2);
      // }
      // // Incoming from create in Non Individual Pan
      // else if(this.panslide2 == true && this.qde.application.applicants[this.coApplicantIndex].isIndividual == false) {
      //   // this.tabSwitch(11);
      //   // this.panSlider4.setIndex(1);
      //   this.swiperSliders.forEach((v, i, a) => {
      //     v.setIndex(0);
      //   });
      //   this.tabSwitch(12);
      // } else if(this.panslide == false && this.qde.application.applicants[this.coApplicantIndex].isIndividual == true) {
        
      //   this.swiperSliders.forEach((v, i, a) => {
      //     v.setIndex(0);
      //   });
      //   this.tabSwitch(1);
      //   this.panSlider2.setIndex(1);
      // }
      // else if(this.panslide2 == false && this.qde.application.applicants[this.coApplicantIndex].isIndividual == false) {
      //   this.swiperSliders.forEach((v, i, a) => {
      //     v.setIndex(0);
      //   });
      //   this.tabSwitch(11);
      //   this.panSlider4.setIndex(0);
      // }

      // // So that route is now in edit mode only
      // this.cds.changePanSlide(false);
      // this.cds.changePanSlide2(false);

      this.initializeVariables();
    }
  }

  // New CoApplicant Index for New CoApplicant
  createCoApplicant() {
    this.addNewCoApplicant();
    this.coApplicantIndex = this.qde.application.applicants.length - 1;
    this.isTabDisabled = false;
    this.initializeVariables();
    this.tabSwitch(1);
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
        docNumber: "",
        panVerified: null
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
  }

  // DEPRECATED
  // resetQdeForm() {
  //   this.qdeService.resetQde();
  //   this.residenceNumberStdCode = "";
  //   this.residenceNumberPhoneNumber = "";
  //   this.alternateResidenceNumberStdCode = ""
  //   this.alternateResidenceNumberPhoneNumber = "";
  //   this.addressCityState = ""
  //   this.otherReligion = "";
  //   this.registeredAddressCityState = "";
  //   this.corporateAddressCityState = "";
  //   this.corporateAddressStdCode = "";
  //   this.corporateAddressPhoneNumber = "";
  //   this.dob = { day: {key: "DD", value: "DD"}, month: {key: "MM", value: "MM"}, year: {key: "YYYY", value: "YYYY"} };
  //   this.organizationDetails = { day: {key: "DD", value: "DD"}, month: {key: "MM", value: "MM"}, year: {key: "YYYY", value: "YYYY"} };
  //   this.commCityState = "";

  //   this.selectedTitle = this.titles[0];
  //   this.selectedReligion = this.religions[0];
  //   this.selectedMaritialStatus = this.maritals[0];
  //   this.selectedCategory = this.categories[0];
  //   this.selectedOccupation = this.occupations[0];
  //   this.selectedResidence = this.residences[0];
  //   this.selectedSpouseTitle = this.titles[0];
  //   this.selectedFatherTitle = this.maleTitles[0];
  //   this.selectedMotherTitle = this.femaleTitles[0]
  //   this.selectedQualification = this.qualifications[0];
  //   this.selectedConstitution = this.constitutions[0];
  //   this.selectedDocType = this.docType[0];
  //   this.selectedAssesmentMethodology = this.assessmentMethodology[0];
  // }

  commZipcodeFocusout($event: any ) {
    //call API
  }

  selectPuccaHouse(value) {
    this.qde.application.applicants[this.coApplicantIndex].incomeDetails.puccaHouse = (value == 1) ? true: false;
  }

  selectPension(value) {
    this.qde.application.applicants[this.coApplicantIndex].occupation.pensioner = (value == 1) ? true: false;
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
      // if(this.qdeSourceSub != null){
      // this.qdeSourceSub.unsubscribe();
      // }
      if(this.applicationIdSub != null){
        this.applicationIdSub.unsubscribe();
        }
      if(this.fragmentSub != null){
      this.fragmentSub.unsubscribe();
      }
      if(this.paramsSub != null){
      this.paramsSub.unsubscribe();
      }
      if(this.getQdeDataSub != null){
      this.getQdeDataSub.unsubscribe();
      }
      if(this.checkPanValidSub != null){
           this.checkPanValidSub.unsubscribe();
           }
      if(this.createOrUpdatePanDetailsSub != null){
           this.createOrUpdatePanDetailsSub.unsubscribe();
           }
      if(this.setStatusApiSub != null){
           this.setStatusApiSub.unsubscribe();
           }
      if(this.checkPanValidSub2 != null){
           this.checkPanValidSub2.unsubscribe();
           }
      if(this.createOrUpdatePanDetailsSub2 != null){
          this.createOrUpdatePanDetailsSub2.unsubscribe();
          }
      if(this.setStatusApiSub2 != null){
          this.setStatusApiSub2.unsubscribe();
          }
      if(this.createOrUpdatePersonalDetailsSub != null){
          this.createOrUpdatePersonalDetailsSub.unsubscribe();
          }
      if(this.createOrUpdatePersonalDetailsSub2 != null){
          this.createOrUpdatePersonalDetailsSub2.unsubscribe();
          }
      if(this.createOrUpdatePersonalDetailsSub3 != null){
          this.createOrUpdatePersonalDetailsSub3.unsubscribe();
          }
      if(this.createOrUpdatePersonalDetailsSub4 != null){
          this.createOrUpdatePersonalDetailsSub4.unsubscribe();
          }
      if(this.createOrUpdatePersonalDetailsSub5 != null){
          this.createOrUpdatePersonalDetailsSub5.unsubscribe();
          }
      if(this.createOrUpdatePersonalDetailsSub6 != null){
          this.createOrUpdatePersonalDetailsSub6.unsubscribe();
          }
       if(this.getCityAndStateSub != null){
          this.getCityAndStateSub.unsubscribe();
          }
      if(this.createOrUpdatePersonalDetailsSub7 != null){
         this.createOrUpdatePersonalDetailsSub7.unsubscribe();
         }
      if(this.createOrUpdatePersonalDetailsSub8 != null){
         this.createOrUpdatePersonalDetailsSub8.unsubscribe();
         }
      if(this.createOrUpdatePersonalDetailsSub9 != null){
         this.createOrUpdatePersonalDetailsSub9.unsubscribe();
         }
      if(this.createOrUpdatePersonalDetailsSub10 != null){
         this.createOrUpdatePersonalDetailsSub10.unsubscribe();
         }
      if(this.createOrUpdatePersonalDetailsSub11 != null){
         this.createOrUpdatePersonalDetailsSub11.unsubscribe();
         }
      if(this.createOrUpdatePersonalDetailsSub12 != null){
         this.createOrUpdatePersonalDetailsSub12.unsubscribe();
        }
      if(this.createOrUpdatePersonalDetailsSub13 != null){
          this.createOrUpdatePersonalDetailsSub13.unsubscribe();
          }
      if(this.createOrUpdatePersonalDetailsSub14 != null){
          this.createOrUpdatePersonalDetailsSub14.unsubscribe();
          }
      if(this.createOrUpdatePersonalDetailsSub15 != null){
          this.createOrUpdatePersonalDetailsSub15.unsubscribe();
          }
      if(this.createOrUpdatePersonalDetailsSub16 != null){
         this.createOrUpdatePersonalDetailsSub16.unsubscribe();
         }
      if(this.createOrUpdatePersonalDetailsSub17 != null){
          this.createOrUpdatePersonalDetailsSub17.unsubscribe();
          }
      if(this.createOrUpdatePersonalDetailsSub18 != null){
          this.createOrUpdatePersonalDetailsSub18.unsubscribe();
          }
      if(this.createOrUpdatePersonalDetailsSub19 != null){
         this.createOrUpdatePersonalDetailsSub19.unsubscribe();
          }
      if(this.createOrUpdatePersonalDetailsSub20 != null){
        this.createOrUpdatePersonalDetailsSub20.unsubscribe();
        }
        if(this.createOrUpdatePersonalDetailsSub21 != null){
        this.createOrUpdatePersonalDetailsSub21.unsubscribe();
        }
        if(this.createOrUpdatePersonalDetailsSub22 != null){
          this.createOrUpdatePersonalDetailsSub22.unsubscribe();
          }
        if(this.createOrUpdatePersonalDetailsSub23 != null){
          this.createOrUpdatePersonalDetailsSub23.unsubscribe();
          }
        if(this.sendOTPAPISub != null){
          this.sendOTPAPISub.unsubscribe();
          }
        if(this.validateOTPAPISub != null){
          this.validateOTPAPISub.unsubscribe();
          }
        
  }


  editMobileNO(){
    this.qde.application.applicants[this.coApplicantIndex].contactDetails.isMobileOTPverified = false;

  }
  inOTP: boolean = false;
  backOTP: boolean = false;

  isAlternateStatus:boolean = false;


  submitOTP(form: NgForm, isAlternateNumber) {
    console.log("Towards OTP");
    const mobileNumber = form.value.mobileNumber;
    const emailId = form.value.preferEmailId;
    const isValidMobile = this.RegExp(this.regexPattern.mobileNumber).test(mobileNumber);
    const isValidEmailID = this.RegExp(this.regexPattern.email).test(emailId);
    if(isValidMobile && isValidEmailID) {
      this.qde.application.applicants[this.coApplicantIndex].contactDetails.mobileNumber = mobileNumber;
      this.qde.application.applicants[this.coApplicantIndex].contactDetails.preferredEmailId = emailId;
      const applicationId = this.qde.application.applicationId;
      const applicantId = this.qde.application.applicants[this.coApplicantIndex].applicantId;
      this.sendOTPAPISub = this.qdeHttp.sendOTPAPI(mobileNumber, applicantId, applicationId, isAlternateNumber,emailId).subscribe(res => {
        if(res['ProcessVariables']['status'] == true) {
          this.inOTP = true;
          this.isAlternateStatus = isAlternateNumber;
        }
        // if(res['ProcessVariables']['isPaymentSuccessful'] == true) {
        //   this.showSuccessModal = true;
        //   this.emiAmount = res['ProcessVariables']['emi'];
        //   this.eligibleAmount = res['ProcessVariables']['eligibilityAmount'];
        // }
        // else if(res['ProcessVariables']['isPaymentSuccessful'] == false) {
        //   this.showErrorModal = true;
        // }
       }, error => {
        this.isErrorModal = true;
        this.errorMessage = "Something went wrong, please try again later.";
      });
       this.timeout();
    } else {
      this.isErrorModal = true;
      this.errorMessage = "Email id and Mobile number is mandatory for verification";
    }

  }
  timeout(){
    this.interval = setInterval(()=>{
      if(this.timeLeft > 0){
        this.isDisabled = false;
        this.timeLeft--;
      }else{
        this.isDisabled = true;
      }
    },1000)
  }
  stopInterval(){
    clearInterval(this.interval);
    this.timeLeft = 180;
  }

  resendOTP() {
    this.isOTPExpired=false;
    this.isOTPEmpty=true;
    this.otp="";
    this.stopInterval();
    const mobileNumber = this.qde.application.applicants[this.coApplicantIndex].contactDetails.mobileNumber ;
    const emailId = this.qde.application.applicants[this.coApplicantIndex].contactDetails.preferredEmailId;
    const applicationId = this.qde.application.applicationId;
    const applicantId = this.qde.application.applicants[this.coApplicantIndex].applicantId;
    this.sendOTPAPISub = this.qdeHttp.sendOTPAPI(mobileNumber, applicantId, applicationId, false, emailId).subscribe(res => {
      if(res['ProcessVariables']['status'] == true) {
        this.inOTP = true;
        this.isAlternateStatus =  false;
      }
     }, error => {
      this.isErrorModal = true;
      this.errorMessage = "Something went wrong, please try again later.";
    });
     this.timeout();
  }
  onBackOTP() {
    console.log("Back button pressed")
    this.inOTP = false;
    this.otp=""; 
    this.isOTPExpired = false;
    this.isOTPEmpty=true;
    this.stopInterval();
  }

  checkOTPEmpty(){
    if(this.otp=="" || this.otp.length<4){
      this.isOTPEmpty=true;
    }else{
      this.isOTPEmpty=false;
    }
  }

  validateOTP(form: NgForm) {
    console.log("Payment gateway");
    const mobileNumber = this.qde.application.applicants[this.coApplicantIndex].contactDetails.mobileNumber;
    const applicantId = this.qde.application.applicants[this.coApplicantIndex].applicantId;
    const otp = form.value.otp;
    const applicationId = this.qde.application.applicationId;
    const emailId = this.qde.application.applicants[this.coApplicantIndex].contactDetails.preferredEmailId;
    if(this.timeLeft == 0){
      this.isOTPExpired = true;
      this.otp="";
      this.isOTPEmpty=true;
    }else{
        this.validateOTPAPISub = this.qdeHttp.validateOTPAPI(mobileNumber, applicantId, applicationId, otp, this.isAlternateStatus, emailId).subscribe(res => {
      if(res['ProcessVariables']['status'] == true) {
        this.otp = "";
        // alert("OTP verified successfully");
        if(this.isAlternateStatus) {
          this.qde.application.applicants[this.coApplicantIndex].contactDetails.isAlternateOTPverified = true;
        }else {
          this.qde.application.applicants[this.coApplicantIndex].contactDetails.isMobileOTPverified = true;
        }
        this.onBackOTP();
      }else {
        this.isErrorModal = true;
        this.errorMessage = "Enter valid OTP"
      }
     }, error => {
      this.isErrorModal = true;
      this.errorMessage = "Something went wrong, please try again later.";
    });
  }
  }

  allowOnlyNumbers() {
    console.log(this.qde.application.applicants[this.coApplicantIndex].familyDetails.numberOfDependents);
  }

  openCamera() {

    this.qdeHttp.takePicture().then((imageURI) => {
      console.log("imageData", imageURI);

      this.imageURI = imageURI;
      //this.panImage = imageURI;
      this.panImage = (<any>window).Ionic.WebView.convertFileSrc(imageURI);
     }, (err) => {
      // Handle error
     });
  }



  sendPanImage(image){

    let fileName = this.qde.application.applicationId + "-" + this.qde.application.applicants[this.coApplicantIndex].applicantId + "-" + new Date().getTime()

    this.qdeHttp.uploadFile(fileName, image).then((data) => {
      
      if(data["responseCode"] == 200) {

        var result = JSON.parse(data["response"]);

        var imageId = result.info.id;

        console.log("imageId",imageId);

        this.qde.application.applicants[this.coApplicantIndex].pan.imageId = imageId;

        this.qdeHttp.createOrUpdatePanDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
          // If successful
          if(response["ProcessVariables"]["status"] == true) {
            // alert("Switch to tab 1");
            this.tabSwitch(1);
          }
        }, error => {
          this.isErrorModal = true;
          this.errorMessage = "Something went wrong, please try again later.";
        });
      } else {
        // Throw Invalid Pan Error
        alert(JSON.parse(data["response"]));
      }
    });
  }


  setPanProof(files: any) {

    console.log("setIdProof files", files);

    if(this.isMobile) {
      this.idPanDoc = files;
      this.idPanFileName = (<any>window).Ionic.WebView.convertFileSrc(this.idPanDoc);
      this.idPanFileSize = "";
      return;
    }
    
    this.idPanDoc = files.item(0);
    this.idPanFileName = this.idPanDoc["name"];
    this.idPanFileSize = this.getFileSize(this.idPanDoc["size"]);
  }


  getFileSize(size: any) {
    size = size / 1024;

    let isMegaByte = false;
    if (size >= 1024) {
      size = size / 1024;
      isMegaByte = true;
    }

    let fileSize: string;
    if (isMegaByte) {
      fileSize = size.toFixed(2) + " MB";
    } else {
      fileSize = size.toFixed(2) + " KB";
    }

    return fileSize;
  }

  handlePanImage(isIndividual) {

    if (this.qde.application.applicants[this.coApplicantIndex].pan.imageId != null) {
      if(isIndividual) {
        this.tabSwitch(2);
      }else {
        this.tabSwitch(12);
      }
      return;
    }else {  /* Need to remove the else block once imageid is saved in back-end */
      if(isIndividual) {
        this.tabSwitch(2);
      }else {
        this.tabSwitch(12);
      }
    }

    
    let modifiedFile = Object.defineProperty(this.idPanDoc, "name", {
      writable: true,
      value: this.idPanDoc["name"]
    });

    modifiedFile["name"] = this.qde.application.applicationId + "-" + this.qde.application.applicants[this.coApplicantIndex].applicantId + "-" + new Date().getTime() + "-" + modifiedFile["name"];
  

    this.qdeHttp.uploadToAppiyoDrive(modifiedFile).subscribe(
      response => {
        if (response["ok"]) {
          //this.progress = Math.round(100 * event.loaded / event.total);
          console.log(response);
          let info = response["info"];
          const documentId = info["id"];
          
          console.log("imageId",documentId);

          this.qde.application.applicants[this.coApplicantIndex].pan.imageId = documentId;

          this.qdeHttp.createOrUpdatePanDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
            // If successful
            if(response["ProcessVariables"]["status"] == true) {
              if(isIndividual) {
                this.tabSwitch(2);
              }else {
                this.tabSwitch(12);
              }
            }
          });

        } else {
          console.log(response["ErrorMessage"]);
        }
      }, error => {
        this.isErrorModal = true;
        this.errorMessage = "Something went wrong, please try again later.";
      }
    );

  }

  openDuplicateModal() {
    this.isDuplicateModalShown = true;
  }

  closeDuplicateModal() {
    this.isDuplicateModalShown = false;
    if(this.qde.application.applicants[this.coApplicantIndex].isIndividual == true) {
      this.tabSwitch(3);
    } else {
      this.tabSwitch(13);
    }
  }

  submitDuplicateApplicant(form: NgForm) {

    let tempApplicant = this.qde.application.applicants[this.coApplicantIndex];
    let selectedApplication = this.duplicates.find(e => e.applicantId == form.value.selectDuplicateApplicant);
  // console.log("Selected Application new " , selectedApplication["applicationId"]);
    let applicationId = Number( selectedApplication["applicationId"]);
    this.getQdeDataSub = this.qdeHttp.getQdeData(applicationId).subscribe(data => {
    // console.log("Applicationin get " ,JSON.parse(data["ProcessVariables"]["response"])["application"]["applicants"] );    
      let duplicates: any = JSON.parse(data["ProcessVariables"]["response"])["application"]["applicants"] ;
      let newApplicantToBeReplaced = duplicates.find(e => e.applicantId == form.value.selectDuplicateApplicant);
      // console.log("new application in data suub " , newApplicantToBeReplaced);
      this.qde.application.applicants[this.coApplicantIndex] = this.qdeService.getModifiedObject(tempApplicant, newApplicantToBeReplaced);
      this.qde.application.applicants[this.coApplicantIndex].applicantId = tempApplicant.applicantId;
      this.qde.application.applicants[this.coApplicantIndex].isMainApplicant = tempApplicant.isMainApplicant;
      this.qdeService.setQde(this.qde);    
      this.createOrUpdatePersonalDetailsSub5=this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).
            subscribe((response) => {
        // If successful      
        if(response["ProcessVariables"]["status"]) {  

          this.closeDuplicateModal();
        }
      }, error => {
        this.isErrorModal = true;
        this.errorMessage = "Something went wrong, please try again later.";
      });
  });
}


  currentAddressFromMainApplicant(event: boolean) {
    this.qde.application.applicants[this.coApplicantIndex].communicationAddress.currentAddFromApp = event;
    if(event == true){
    this.qde.application.applicants[this.coApplicantIndex].communicationAddress.residentialStatus = this.qde.application.applicants.find(v => v.isMainApplicant == true).communicationAddress.residentialStatus;
    this.qde.application.applicants[this.coApplicantIndex].communicationAddress.addressLineOne = this.qde.application.applicants.find(v => v.isMainApplicant == true).communicationAddress.addressLineOne;
    this.qde.application.applicants[this.coApplicantIndex].communicationAddress.addressLineTwo = this.qde.application.applicants.find(v => v.isMainApplicant == true).communicationAddress.addressLineTwo;
    this.qde.application.applicants[this.coApplicantIndex].communicationAddress.zipcodeId = this.qde.application.applicants.find(v => v.isMainApplicant == true).communicationAddress.zipcodeId;
    this.qde.application.applicants[this.coApplicantIndex].communicationAddress.zipcode = this.qde.application.applicants.find(v => v.isMainApplicant == true).communicationAddress.zipcode;
    this.qde.application.applicants[this.coApplicantIndex].communicationAddress.cityId = this.qde.application.applicants.find(v => v.isMainApplicant == true).communicationAddress.cityId;
    this.qde.application.applicants[this.coApplicantIndex].communicationAddress.city = this.qde.application.applicants.find(v => v.isMainApplicant == true).communicationAddress.city;
    this.qde.application.applicants[this.coApplicantIndex].communicationAddress.stateId = this.qde.application.applicants.find(v => v.isMainApplicant == true).communicationAddress.stateId;
    this.qde.application.applicants[this.coApplicantIndex].communicationAddress.state = this.qde.application.applicants.find(v => v.isMainApplicant == true).communicationAddress.state;

    this.qde.application.applicants[this.coApplicantIndex].communicationAddress.cityState = this.qde.application.applicants.find(v => v.isMainApplicant == true).communicationAddress.city+" "+this.qde.application.applicants.find(v => v.isMainApplicant == true).communicationAddress.state;
    }
    else{
      this.qde.application.applicants[this.coApplicantIndex].communicationAddress.residentialStatus = "";
      this.qde.application.applicants[this.coApplicantIndex].communicationAddress.addressLineOne = "";
      this.qde.application.applicants[this.coApplicantIndex].communicationAddress.addressLineTwo = "";
      this.qde.application.applicants[this.coApplicantIndex].communicationAddress.zipcodeId = "";
      this.qde.application.applicants[this.coApplicantIndex].communicationAddress.zipcode = "";
      this.qde.application.applicants[this.coApplicantIndex].communicationAddress.cityId = "";
      this.qde.application.applicants[this.coApplicantIndex].communicationAddress.city = "";
      this.qde.application.applicants[this.coApplicantIndex].communicationAddress.stateId = "";
      this.qde.application.applicants[this.coApplicantIndex].communicationAddress.state = "";

      this.qde.application.applicants[this.coApplicantIndex].communicationAddress.cityState = "";
    }
    // this.isCurrentAddressFromMainApplicant = false;
  }
  selectOneAddr(fromValue){
    if (fromValue==1){
      this.qde.application.applicants[this.coApplicantIndex].communicationAddress.permanentAddress=false;
    }
    else{
      this.qde.application.applicants[this.coApplicantIndex].communicationAddress.permanentAddFromApp=false;
    }
  }

  permanentAddressFromMainApplicant(event: boolean) {
    this.selectOneAddr(1);
    this.qde.application.applicants[this.coApplicantIndex].communicationAddress.permanentAddFromApp = event;
    if(event == true){
    this.qde.application.applicants[this.coApplicantIndex].permanentAddress.addressLineOne = this.qde.application.applicants.find(v => v.isMainApplicant == true).permanentAddress.addressLineOne;
    this.qde.application.applicants[this.coApplicantIndex].permanentAddress.addressLineTwo = this.qde.application.applicants.find(v => v.isMainApplicant == true).permanentAddress.addressLineTwo;
    this.qde.application.applicants[this.coApplicantIndex].permanentAddress.zipcodeId = this.qde.application.applicants.find(v => v.isMainApplicant == true).permanentAddress.zipcodeId;
    this.qde.application.applicants[this.coApplicantIndex].permanentAddress.zipcode = this.qde.application.applicants.find(v => v.isMainApplicant == true).permanentAddress.zipcode;
    this.qde.application.applicants[this.coApplicantIndex].permanentAddress.cityId = this.qde.application.applicants.find(v => v.isMainApplicant == true).permanentAddress.cityId;
    this.qde.application.applicants[this.coApplicantIndex].permanentAddress.stateId = this.qde.application.applicants.find(v => v.isMainApplicant == true).permanentAddress.stateId;
    this.qde.application.applicants[this.coApplicantIndex].permanentAddress.numberOfYearsInCurrentResidence = this.qde.application.applicants.find(v => v.isMainApplicant == true).permanentAddress.numberOfYearsInCurrentResidence;

    this.qde.application.applicants[this.coApplicantIndex].permanentAddress.cityState = this.qde.application.applicants.find(v => v.isMainApplicant == true).permanentAddress.city+" "+this.qde.application.applicants.find(v => v.isMainApplicant == true).permanentAddress.state;

    // this.isPermanentAddressFromMainApplicant = false;
    }else{
      this.qde.application.applicants[this.coApplicantIndex].permanentAddress.residentialStatus = "";
      this.qde.application.applicants[this.coApplicantIndex].permanentAddress.addressLineOne = "";
      this.qde.application.applicants[this.coApplicantIndex].permanentAddress.addressLineTwo = "";
      this.qde.application.applicants[this.coApplicantIndex].permanentAddress.zipcodeId = "";
      this.qde.application.applicants[this.coApplicantIndex].permanentAddress.zipcode = "";
      this.qde.application.applicants[this.coApplicantIndex].permanentAddress.cityId = "";
      this.qde.application.applicants[this.coApplicantIndex].permanentAddress.city = "";
      this.qde.application.applicants[this.coApplicantIndex].permanentAddress.stateId = "";
      this.qde.application.applicants[this.coApplicantIndex].permanentAddress.state = "";

      this.qde.application.applicants[this.coApplicantIndex].permanentAddress.cityState = "";
    }
  }

  commSliderChanged(event) {
    // console.log('COMMSLIDER:', this.commSlider);
    // this.commSlider.nativeElement.querySelector('.ng5-slider-span.ng5-slider-bubble.ng5-slider-model-value').innerHTML = event+'y';
  }

  RegExp(param) {
    return RegExp(param);
  }

  onCrossModal(){
    this.isCoApplicantRouteModal = false;
    this.isCoApplicantPinModal = false;
  }

  keyUpPanNumber(event: Event) {
    console.log("TEMPLD", this.tempOldPanNumber);
    if(event['target']['value'].trim() != '' && event['target']['value'] == this.tempOldPanNumber) {
      this.isValidPan = true;
    } else {
      this.isValidPan = null;
    }
  }

  ngAfterViewInit() {
    // this.swiperSliders.forEach((v, i, a) => {
    //   v.setIndex(0);
    // });
    this.swiperSlidersSub = this.swiperS$.changes.subscribe(v => {
      this.swiperSliders = v._results;
      if(this.swiperSliders && this.swiperSliders.length > 0) {
        this.swiperSliders[this.activeTab].setIndex(this.page-1);
      }
    });
  }

  moreCoApp(){
    this.router.navigate(['/applicant', this.qde.application.applicationId, 'co-applicant']);
    this.isCoApplicantRouteModal = false;
  }

  backButton(){
    let mainApplicant = this.qde.application.applicants.find(v => v['isMainApplicant']);
    this.router.navigate(['/applicant', this.applicationId], {fragment: mainApplicant.isIndividual == true ? 'income1': 'income2'});
    
  }

  goToExactPageAndTab(tabPage: string, pageNumber: number) {
    let index = this.fragments.findIndex(v => v == tabPage) != -1 ? this.fragments.findIndex(v => v == tabPage) : 0;
    this.tabName = tabPage;
    this.page = pageNumber;
    this.tabSwitch(index, true);
    // alert(this.coApplicantIndex);
  }

  isCategoryModal: boolean = false;
  checkForCondition(){
    if(this.selectedCategory.value != "1"){
      this.isCategoryModal = true;
    }
    else{
      this.isCategoryModal = false
    }
  }

  onCrossCatgModal(){
    this.isCategoryModal = false
  }


  onOfficialCorsEmailChange(value, officeEmail) {
    const emailId = value;
    const domain = emailId.split("@")[1];
    this.unOfficialEmails.forEach(function(value){
      console.log("unOfficialEmails",value["key"]);
      if(value["key"] == domain) {
        console.log("Invalid email");
        officeEmail.control.setErrors({'invalidDomain': true});
        return;
      }
    });
  }

  changedRelationship(event) {
    this.titles = this.applicantRelationships.find(v => v.relationShipId == event).applicantTitles.map(v => ({key: v.applicantTitle, value: v.applicantTitleId}));
    this.selectedTitle = this.titles[0];
  }

  changeTitle(event) {
      let t = this.applicantRelationships.find(v => v.relationShipId == this.selectedRelationship).applicantTitles.find(v => v.applicantTitleId == this.selectedTitle.value);
      this.qde.application.applicants[this.coApplicantIndex].personalDetails.gender = t.genderId;
    // console.log("mamama",event)
    // if(event.value == null){
    //   this.doNotSelectDefault = false;
    //   return
    // }
    // else{
    //   this.doNotSelectDefault = true;
    //   let t = this.applicantRelationships.find(v => v.relationShipId == this.selectedRelationship).applicantTitles.find(v => v.applicantTitleId == this.selectedTitle.value);
    //   this.qde.application.applicants[this.coApplicantIndex].personalDetails.gender = t.genderId;
    // }
  }

  setRelationship(mainApplicant: Applicant, coApplicantIndex: string | number) {
    this.qdeHttp.getApplicantRelationships(mainApplicant.isIndividual ? "1": "2", this.qde.application.applicants[coApplicantIndex].isIndividual ? "1": "2").subscribe(res => {
      if(res['ProcessVariables']['status']) {
        this.applicantRelationships = JSON.parse(res['ProcessVariables']['response']);
        this.relationships = this.applicantRelationships.map(v => ({key: v.relationShip, value: v.relationShipId}));

        this.titles = this.applicantRelationships[0].applicantTitles.map(v => ({key: v.applicantTitle, value: v.applicantTitleId}));
        this.selectedTitle = this.titles[0];


        if(this.qde.application.applicants[coApplicantIndex].isIndividual == true) {
          if(this.qde.application.applicants[coApplicantIndex].personalDetails.relationShip) {
            this.selectedRelationship = this.relationships.find(v => v.value == this.qde.application.applicants[coApplicantIndex].personalDetails.relationShip).value;
            this.titles = this.applicantRelationships.find(v => v.relationShipId == this.selectedRelationship).applicantTitles.map(v => ({key: v.applicantTitle, value: v.applicantTitleId}));
            this.selectedTitle = this.titles.find(v => v.value == this.qde.application.applicants[coApplicantIndex].personalDetails.title);
          } else {
            this.selectedRelationship = this.relationships[0].value;
          }
        } else if(this.qde.application.applicants[coApplicantIndex].isIndividual == false) {
          if(this.qde.application.applicants[coApplicantIndex].organizationDetails.relationShip) {
            this.selectedRelationship = this.relationships.find(v => v.value == this.qde.application.applicants[coApplicantIndex].organizationDetails.relationShip).value;
          } else {
            this.selectedRelationship = this.relationships[0].value;
          }
        }
      } else {
        this.isErrorModal = true;
        this.errorMessage = 'Something went wrong.';
      }
    }, err => {
      this.isErrorModal = true;
      this.errorMessage = 'Something went wrong.';
    });
  }

  setAssessmentMethodology() {
    if(this.qde.application.applicationId != null) {
      console.log("qde vlaue ",this.qde.application.applicants);
      console.log("is individula", this.qde.application.applicants[this.coApplicantIndex].isIndividual);
      this.qdeHttp.assessmentListForProfileApplicantType(this.qde.application.applicants[this.coApplicantIndex].isIndividual ? '1': '2', this.qde.application.applicants[this.coApplicantIndex].occupation.occupationType).subscribe(res => {
        if(res['ProcessVariables']['AssessementList']) {
          this.assessmentMethodology = res['ProcessVariables']['AssessementList'].map(e => ({key: e.id, value: e.value}));
          if(this.qde && this.qde.application.applicants[this.coApplicantIndex].incomeDetails.assessmentMethodology) {
            this.selectedAssesmentMethodology =  this.assessmentMethodology.find(e => e.value == this.qde.application.applicants[this.coApplicantIndex].incomeDetails.assessmentMethodology);
          } else {
            this.selectedAssesmentMethodology = this.assessmentMethodology[0];
          }
        } else {
          this.assessmentMethodology = [];
          this.selectedAssesmentMethodology = null;
        }
      }, err => {
        this.isErrorModal = true;
        this.errorMessage = 'Something went wrong.';
      });
    }
  }

  loadOccupationTypeLovs(occupationType ?: string) {
    let occupationData = {
      userId: parseInt(localStorage.getItem("userId")),
      applicantType: this.qde.application.applicants[this.coApplicantIndex].isIndividual == true ? 1: 2,
    };
  
    this.qdeHttp.getOccupationLov(occupationData).subscribe(response => {
      this.occupations = JSON.parse(response["ProcessVariables"]["response"])['occupation'];
      console.log("Occupation Type",this.occupations);

      if(occupationType != null) {
        this.selectedOccupation = this.occupations.some(v => v.value == occupationType) ? this.occupations.find(v => v.value == occupationType): this.occupations[0];
      } else {
        this.selectedOccupation = this.occupations[0];
      }
      // this.selectedOccupation = this.occupations["occupation"]
      console.log("Select Occupation Type",this.selectedOccupation)
      this.selectValueChangedOccupation(this.selectedOccupation)
    }, err => {
      this.isErrorModal = true;
        this.errorMessage = 'Something went wrong.';
    });
  }

  onDateOfIncorpChange(value:Date) {

    let latest_date = this.datepipe.transform(value, 'dd-MMM-yyyy');

    if (new Date(latest_date) > new Date()) {
      this.isErrorModal = true;
      this.errorMessage = 'Selected date must not be greater than today date';
      return;
    }

    let splitArr = latest_date.split('-');

    let day = splitArr[0];

    let month = splitArr[1].toUpperCase();

    let year = splitArr[2]

    this.organizationDetails =  { day: { key: day , value: day },
      month: { key: month, value: month },
      year: { key: year, value: year } 
    }


    const dateofbirth = this.dateofBirthKendo;

    console.log("dateofbirth", dateofbirth);
    const d1: any = new Date(dateofbirth);
    const d2: any = new Date();
    var diff = d2 - d1;
    var age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    if (age < 18) {
      this.ageError = true;
      return;
    } else {
      this.ageError = false;
    }

  }

  onBirthDateChange(value: Date){


    let latest_date = this.datepipe.transform(value, 'dd-MMM-yyyy');

    let splitArr = latest_date.split('-');

    let day = splitArr[0];

    let month = splitArr[1].toUpperCase();

    let year = splitArr[2]

    this.dob =  { day: { key: day , value: day },
      month: { key: month, value: month },
      year: { key: year, value: year } 
    }
    
  }

}
