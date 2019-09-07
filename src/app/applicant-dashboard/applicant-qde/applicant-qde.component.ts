import { Other, Applicant } from './../../models/qde.model';
import { Component, OnInit, ViewChild, ElementRef, Renderer2, OnDestroy, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
    
import * as Swiper from 'swiper/dist/js/swiper.js';
// import { Select2Component } from 'ng2-select2';
import { ActivatedRoute, Router } from '@angular/router';

import { Options } from 'ng5-slider';
import { NgForm } from '@angular/forms';

import Qde from 'src/app/models/qde.model';
import { QdeHttpService } from 'src/app/services/qde-http.service';
import { QdeService } from 'src/app/services/qde.service';
import { CommonDataService } from '../../services/common-data.service';
import { Subscription, merge } from 'rxjs';
import { errors } from '../../services/errors';
import { MenubarHeaderComponent } from '../../menubar-header/menubar-header.component';
import { environment } from 'src/environments/environment';

import { File } from '@ionic-native/file/ngx';
import { DeviceDetectorService } from 'ngx-device-detector';

import { screenPages } from '../../app.constants';

interface Item {
  key: string,
  value: number | string
}

@Component({
  selector: 'app-applicant-qde',
  templateUrl: './applicant-qde.component.html',
  styleUrls: ['./applicant-qde.component.css']
})
export class ApplicantQdeComponent implements OnInit, OnDestroy, AfterViewInit {

  isMobile:any;

  capacitor= {
    DEBUG: false
  };

  readonly errors = errors;

  // regexPatternForDocType: Array<string> = ['[A-Z]{1}[0-9]{7}','^[A-Z]{2}[0-9]{13}$','^[A-Z]{3}[0-9]{7}$','[2-9]{1}[0-9]{11}','[0-9]{18}','[0-9]{14}','[0-9]{16}'];
  
  regexPatternForDocType:Array<any>=[{pattern:'[A-Z]{1}[0-9]{7}',hint:"V1234567"},{pattern:'^[A-Z]{2}[0-9]{13}$',hint:"AN0120100051926"},{pattern:'^[A-Z]{3}[0-9]{7}$',hint:"LWN5672084"},{pattern:'[2-9]{1}[0-9]{11}',hint:"12 digit number, with first digit not 0 or 1"},{pattern:'[0-9]{18}',hint:"	18 digit number"},{pattern:'[0-9]{14}',hint:"	14 digit number"},{pattern:'[0-9]{16}',hint:"	16 digit number"}]
  
  maxlength:Array<string> = ['8','15','10','12','18','14','16'];

  panImage:String;

  imageURI:String;

  isTabDisabled:boolean;
  docName:boolean;

  regexPattern = {
    appRefNo:"^[A-Za-z0-9]+$",
    mobileNumber: "^[1-9][0-9]*$",
    name: "^[A-Za-z ]+$",
    address : "^[0-9A-Za-z, _&'/#]+$",
    // cityState:"^[0-9A-Za-z, &'#]$",
    pinCode: "^[1-9][0-9]{5}$",
    // applicationRefNo : "",
    panInd:"[A-Z]{3}(P)[A-Z]{1}[0-9]{4}[A-Z]{1}",
    panNonInd:"[A-Z]{5}[0-9]{4}[A-Z]{1}",
    // amount:"[0-9]{0,17}\.[0-9]{1,4}?$",
    sliderValue: " [0-9]{0,2}",
    amount:"^[\\d]{0,10}([.][0-9]{0,4})?",
    email:"^\\w+([\.-]?\\w+)*@\\w+([\.-]?\\w+)*(\\.\\w{2,10})+$",
    revenue:"^[\\d]{0,10}([.][0-9]{0,4})?",
    sameDigit: '^0{6,10}|1{6,10}|2{6,10}|3{6,10}|4{6,10}|5{6,10}|6{6,10}|7{6,10}|8{6,10}|9{6,10}$'

    // revenue:"^[\\d]{0,14}([.][0-9]{0,4})?"
   
  };

  minValue: number = 1;

  options: Options = {
    floor: 0,
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
    floor: 1,
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
    floor: 1,
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
    // onlyExternal: true,
    speed: 900,
    effect: "fade",
    fadeEffect: {
      crossFade: true
    }
  };

  rhsConfig = {
    noSwiping: true,
    noSwipingClass: '',
    autoplayStopOnLast: false,
    speed: 900,
    effect: "slide"
  };

  activeTab: number = 0;
  dob: {day: Item, month: Item, year: Item} = { day: {key: "DD", value: "DD"}, month: {key: "MM", value: "MM"}, year: {key: "YYYY", value: "YYYY"} };
  residenceNumberStdCode: string = "";
  residenceNumberPhoneNumber: string = "";
  alternateResidenceNumberStdCode: string = ""
  alternateResidenceNumberPhoneNumber: string = ""
  addressCityState: string = "";
  otherReligion: string = "";
  organizationDetails: {day: Item, month: Item, year: Item} = { day: {key: "DD", value: "DD"}, month: {key: "MM", value: "MM"}, year: {key: "YYYY", value: "YYYY"} };
  officialNumberStdCode: string = "";
  officialNumberPhoneNumber: string = "";
  dateOfIncorporation: {day: Item, month: Item, year: Item} = { day: {key: "DD", value: "DD"}, month: {key: "MM", value: "MM"}, year: {key: "YYYY", value: "YYYY"} };
  registeredAddressCityState: string = "";
  corporateAddressCityState: string = "";
  corporateAddressStdCode = "";
  corporateAddressPhoneNumber = "";
  officialCorrespondenceStdCode: string = "";
  officialCorrespondencePhoneNumber: string = "";

  commCityState:string = "";
  // zipCityStateID:string = "";

  @ViewChild('tabContents') tabContents: ElementRef;
  // @ViewChild(Select2Component) select2: Select2Component;

  // All Swiper Sliders
  // Will be deprecated in next commit if not used
  @ViewChild('panSlider2') panSlider2: Swiper;
  @ViewChild('panSlider4') panSlider4: Swiper;

  isAlternateEmailId: boolean = false;
  isAlternateMobileNumber: boolean = false;
  isAlternateResidenceNumber: boolean = false;
  
  applicantIndividual: boolean = true;

  isIndividual:boolean = false;
  YYYY: number = new Date().getFullYear();

  applicantStatus: string = "";

  fragments = [ 'pan1',
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
                'revenueAddr',
                'income2'
              ];

  applicantIndex: number = 0;

  qde: Qde;

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
  selectedConstitutions: Item;

  docType: Array<any>;
  selectedAssesmentMethodology: Array<any>;

  // panslideSub: Subscription;
  // panslide2Sub: Subscription;
  qdeSourceSub: Subscription;
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
  createOrUpdatePanDetailsSub3: Subscription;

  panErrorCount: number = 0;

  otp:string;

  idPanDocumnetType: any;
  idPanFileName: string;
  idPanFileSize: string;
  idPanId: string;
  idPanDoc: File;

  isDisabled: boolean = false;
  interval;
  timeLeft : number = 180;

  isReadOnly: boolean = false;
  isEligibilityForReview: boolean = false;
  isEligibilityForReviewsSub: Subscription;
  isTBMLoggedIn: boolean;
  isApplicantRouteModal: boolean = false;

  isApplicantPinModal: boolean = false;

  isDuplicateModalShown: boolean = false;
  duplicates: Array<Applicant> = [];
  dobYears: Array<Item>;
  YYYY17YearsAgo = (new Date().getFullYear() - 18);
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

  constructor(private renderer: Renderer2,
              private route: ActivatedRoute,
              private router: Router,
              private qdeHttp: QdeHttpService,
              private qdeService: QdeService,
              private cds:CommonDataService,
              private file: File,
              private deviceService: DeviceDetectorService) {

   this.qde = this.qdeService.defaultValue;

    this.qdeService.resetQde();
    this.tabName = this.fragments[0];
    this.page = 1;
    

    this.dobYears = Array.from(Array(100).keys()).map((val, index) => {
      let v = (this.YYYY17YearsAgo - index)+"";
      return {key: v, value: v};
    });
    this.dobYears.unshift({key: 'YYYY', value: 'YYYY'});

    this.isMobile = this.deviceService.isMobile() ;

    this.cds.changeMenuBarShown(true);
    this.cds.changeViewFormVisible(true);
    this.cds.changeLogoutVisible(true);
    this.cds.changeHomeVisible(true);

    const isMobile = this.deviceService.isMobile();
            
    // this.panslideSub = this.cds.panslide.subscribe(val => {
    //   this.panslide = val;
    // });

    // this.panslide2Sub = this.cds.panslide2.subscribe(val => {
    //   this.panslide2 = val;
    // });



    // this.fragmentSub = this.route.fragment.subscribe((fragment) => {
    //   let localFragment = fragment;

    //   if(fragment == null) {
    //     localFragment = this.fragments[0];
    //   }

    //   if(fragment == 'income1' || fragment == 'income2') {
    //     localFragment = fragment;
    //   }

    //   // Replace Fragments in url
    //   if( this.fragments.includes(localFragment) &&
    //       this.panslide == false &&
    //       this.panslide2 == false) {

    //     // if(this.qde.application.applicants[this.applicantIndex].isIndividual == true) {
    //     //   if(localFragment == 'pan1') {
    //     //     this.tabSwitch(0);
    //     //     this.panSlider2.setIndex(1);
    //     //   }
    //     // } else if(this.qde.application.applicants[this.applicantIndex].isIndividual == false) {
    //     //   if(localFragment == 'pan2') {
    //     //     this.tabSwitch(10);
    //     //   }
    //     // }

    //     this.activeTab = this.fragments.indexOf(localFragment);
    //     this.tabSwitch(this.activeTab);
    //     this.applicantIndividual = (this.activeTab >= 10) ? false: true;
    //   }
    // });


    this.qdeSourceSub=this.qdeService.qdeSource.subscribe(val => {
      console.log("VALVE: ", val);
      this.qde = val;
      this.applicantIndex = val.application.applicants.findIndex(v => v.isMainApplicant == true);
      // this.isValidPan = val.application.applicants[this.applicantIndex].pan.panVerified;
      this.cds.enableTabsIfStatus1(this.qde.application.status);
    });

    this.fragmentSub = this.route.queryParams.subscribe(val => {

      if(val['tabName'] && val['tabName'] != '') {
        this.tabName = this.fragments.includes(val['tabName']) ? val['tabName'].toString(): this.fragments[0];
        this.activeTab = this.fragments.findIndex(v => v == val['tabName']);

        this.applicantIndividual = (this.activeTab >= 10) ? false: true;
      }

      if(val['page'] && val['page'] != '') {
        this.page = (val && val['page'] != null && parseInt(val['page']) != NaN && parseInt(val['page']) >= 1) ? parseInt(val['page']): 1;
      }

      console.log("Fragment & QueryParams: ", this.tabName, this.page);
      // Here in this condition, fragment and page number will be appropriate
      // if(this.fragment && this.page > -1) {
      //   alert(this.fragment+" "+this.page);
      // }
    });
    
    this.cds.isTBMLoggedIn.subscribe(val => {
      this.isTBMLoggedIn = val;
    });
  }
  
  // panslide: boolean;
  // panslide2: boolean;

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

    this.cds.applicationId.subscribe(val => {
      if(JSON.parse(localStorage.getItem('roles')).includes('TBM')) {
        this.cds.setReadOnlyForm(true);
      } else {
        this.cds.setReadOnlyForm(false);
      }
    });




    this.paramsSub=this.route.params.subscribe((params) => {

      console.log('PARAMS................................')

      if(params['applicationId'] != null) {
        this.cds.changeApplicationId(params['applicationId']);
      }

      console.log("params ", params);

      this.resetQdeForm();

      // Make an http request to get the required qde data and set using setQde
      if(params.applicationId != null) {

        // If not coming from leads dashboard
        // if(this.qdeService.getQde().application.applicationId == "" || this.qdeService.getQde().application.applicationId == null) {
          this.getQdeDataSub=this.qdeHttp.getQdeData(params.applicationId).subscribe(response => {
            console.log("RESPONSE ", response);
            var result = JSON.parse(response["ProcessVariables"]["response"]);
            console.log("Get ", result);

            this.qde = result;
            this.qdeService.setQde(result);
            this.applicantIndex = result.application.applicants.findIndex(v => v.isMainApplicant == true);
            this.cds.enableTabsIfStatus1(this.qde.application.status);
            this.tempOldPanNumber = result.application.applicants[this.applicantIndex].pan.panNumber;

            if(this.qde.application.auditTrailDetails.screenPage == screenPages['applicantDetails']) {
              this.goToExactPageAndTab(this.qde.application.auditTrailDetails.tabPage, this.qde.application.auditTrailDetails.pageNumber);
            }
            // else if(this.qde.application.auditTrailDetails.screenPage == screenPages['loanDetails']){
            //   this.router.navigate(['/loanDetails/'+this.qde.application.applicationId]);
            // }
            else{
              if(this.qde.application.applicants[this.applicantIndex].isIndividual == true) {
                this.tabSwitch(0);
              } else if(this.qde.application[this.applicantIndex].isIndividual == false) {
                this.tabSwitch(10);
              } else {
                this.tabSwitch(0);
              }
            }

            try {
              // this.qde.application.applicationFormNumber = "ijijijjjjj"
              if(result.application.applicants[this.applicantIndex].communicationAddress != null) {
                this.commCityState = "";
                if(result.application.applicants[this.applicantIndex].communicationAddress.city) {
                  this.commCityState = result.application.applicants[this.applicantIndex].communicationAddress.city + " "+ result.application.applicants[this.applicantIndex].communicationAddress.state;
                }
                this.qde.application.applicants[this.applicantIndex].communicationAddress.city = result.application.applicants[this.applicantIndex].communicationAddress.city;
                this.qde.application.applicants[this.applicantIndex].communicationAddress.state = result.application.applicants[this.applicantIndex].communicationAddress.state;
                this.qde.application.applicants[this.applicantIndex].communicationAddress.cityState = this.commCityState;
                this.qde.application.applicants[this.applicantIndex].communicationAddress.zipcodeId = result.application.applicants[this.applicantIndex].communicationAddress.zipcodeId;
                this.qde.application.applicants[this.applicantIndex].communicationAddress.stateId = result.application.applicants[this.applicantIndex].communicationAddress.stateId;
                this.qde.application.applicants[this.applicantIndex].communicationAddress.cityId = result.application.applicants[this.applicantIndex].communicationAddress.cityId;
              }
            } catch(e) {}
            try {
              if(result.application.applicants[this.applicantIndex].permanentAddress != null) {
                this.commCityState = "";
                if(result.application.applicants[this.applicantIndex].permanentAddress.city) {
                  this.commCityState = result.application.applicants[this.applicantIndex].permanentAddress.city + " "+ result.application.applicants[this.applicantIndex].permanentAddress.state;
                }

                this.qde.application.applicants[this.applicantIndex].permanentAddress.city = result.application.applicants[this.applicantIndex].permanentAddress.city;
                this.qde.application.applicants[this.applicantIndex].permanentAddress.state = result.application.applicants[this.applicantIndex].permanentAddress.state;
                this.qde.application.applicants[this.applicantIndex].permanentAddress.cityState = this.commCityState;
                this.qde.application.applicants[this.applicantIndex].permanentAddress.zipcodeId = result.application.applicants[this.applicantIndex].permanentAddress.zipcodeId;
                this.qde.application.applicants[this.applicantIndex].permanentAddress.stateId = result.application.applicants[this.applicantIndex].permanentAddress.stateId;
                this.qde.application.applicants[this.applicantIndex].permanentAddress.cityId = result.application.applicants[this.applicantIndex].permanentAddress.cityId;
  
              
              }
            } catch(e) {}
            try {
              if(result.application.applicants[this.applicantIndex].residentialAddress != null) {
                this.commCityState = "";
                if(result.application.applicants[this.applicantIndex].residentialAddress.city) {
                  this.commCityState = result.application.applicants[this.applicantIndex].residentialAddress.city + " "+ result.application.applicants[this.applicantIndex].residentialAddress.state;
                }
  
                this.qde.application.applicants[this.applicantIndex].residentialAddress.city = result.application.applicants[this.applicantIndex].residentialAddress.city;
                this.qde.application.applicants[this.applicantIndex].residentialAddress.state = result.application.applicants[this.applicantIndex].residentialAddress.state;
                this.qde.application.applicants[this.applicantIndex].residentialAddress.cityState = this.commCityState;
                this.qde.application.applicants[this.applicantIndex].residentialAddress.zipcodeId = result.application.applicants[this.applicantIndex].residentialAddress.zipcodeId;
                this.qde.application.applicants[this.applicantIndex].residentialAddress.stateId = result.application.applicants[this.applicantIndex].residentialAddress.stateId;
                this.qde.application.applicants[this.applicantIndex].residentialAddress.cityId = result.application.applicants[this.applicantIndex].residentialAddress.cityId;
    
              }
            } catch(e) {}
            try {
              if(result.application.applicants[this.applicantIndex].officialCorrespondence != null) {
                this.commCityState = "";
                if(result.application.applicants[this.applicantIndex].officialCorrespondence.city) {
                  this.commCityState = result.application.applicants[this.applicantIndex].officialCorrespondence.city + " "+ result.application.applicants[this.applicantIndex].officialCorrespondence.state;
                }
                this.qde.application.applicants[this.applicantIndex].officialCorrespondence.city = result.application.applicants[this.applicantIndex].officialCorrespondence.city;
                this.qde.application.applicants[this.applicantIndex].officialCorrespondence.state = result.application.applicants[this.applicantIndex].officialCorrespondence.state;
                this.qde.application.applicants[this.applicantIndex].officialCorrespondence.cityState = this.commCityState;
                this.qde.application.applicants[this.applicantIndex].officialCorrespondence.zipcodeId = result.application.applicants[this.applicantIndex].officialCorrespondence.zipcodeId;
                this.qde.application.applicants[this.applicantIndex].officialCorrespondence.stateId = result.application.applicants[this.applicantIndex].officialCorrespondence.stateId;
                this.qde.application.applicants[this.applicantIndex].officialCorrespondence.cityId = result.application.applicants[this.applicantIndex].officialCorrespondence.cityId;
              }
            } catch(e) {}
            try {
              if(result.application.applicants[this.applicantIndex].organizationDetails != null) {
                this.qde.application.applicants[this.applicantIndex].organizationDetails = result.application.applicants[this.applicantIndex].organizationDetails;
              }
            } catch(e) {}
            try {
              if(result.application.applicants[this.applicantIndex].registeredAddress != null) {
                this.commCityState = "";
                if(result.application.applicants[this.applicantIndex].registeredAddress.city) {
                  this.commCityState = result.application.applicants[this.applicantIndex].registeredAddress.city + " "+ result.application.applicants[this.applicantIndex].registeredAddress.state;
                }
  
                this.qde.application.applicants[this.applicantIndex].registeredAddress.city = result.application.applicants[this.applicantIndex].registeredAddress.city;
                this.qde.application.applicants[this.applicantIndex].registeredAddress.state = result.application.applicants[this.applicantIndex].registeredAddress.state;
                this.qde.application.applicants[this.applicantIndex].registeredAddress.cityState = this.commCityState;
                this.qde.application.applicants[this.applicantIndex].registeredAddress.zipcodeId = result.application.applicants[this.applicantIndex].registeredAddress.zipcodeId;
                this.qde.application.applicants[this.applicantIndex].registeredAddress.stateId = result.application.applicants[this.applicantIndex].registeredAddress.stateId;
                this.qde.application.applicants[this.applicantIndex].registeredAddress.cityId = result.application.applicants[this.applicantIndex].registeredAddress.cityId;
              }
            } catch(e) {}
            
            try {
              if(result.application.applicants[this.applicantIndex].corporateAddress != null) {
                this.commCityState = "";
                if(result.application.applicants[this.applicantIndex].corporateAddress.city) {
                  this.commCityState = result.application.applicants[this.applicantIndex].corporateAddress.city + " "+ result.application.applicants[this.applicantIndex].corporateAddress.state;
                }
  
                this.qde.application.applicants[this.applicantIndex].corporateAddress.city = result.application.applicants[this.applicantIndex].corporateAddress.city;
                this.qde.application.applicants[this.applicantIndex].corporateAddress.state = result.application.applicants[this.applicantIndex].corporateAddress.state;
                this.qde.application.applicants[this.applicantIndex].corporateAddress.cityState = this.commCityState;
                this.qde.application.applicants[this.applicantIndex].corporateAddress.zipcodeId = result.application.applicants[this.applicantIndex].corporateAddress.zipcodeId;
                this.qde.application.applicants[this.applicantIndex].corporateAddress.stateId = result.application.applicants[this.applicantIndex].corporateAddress.stateId;
                this.qde.application.applicants[this.applicantIndex].corporateAddress.cityId = result.application.applicants[this.applicantIndex].corporateAddress.cityId;
              }
            } catch(e) {}
            try {
              if(result.application.applicants[this.applicantIndex].revenueDetails != null) {
                this.qde.application.applicants[this.applicantIndex].revenueDetails = result.application.applicants[this.applicantIndex].revenueDetails;
              }
            } catch(e) {}
            try {
              if(result.application.applicants[this.applicantIndex].incomeDetails != null) {
                this.qde.application.applicants[this.applicantIndex].incomeDetails = result.application.applicants[this.applicantIndex].incomeDetails;
              }
            } catch(e) {}
            try {
              if(result.application.applicants[this.applicantIndex].documents != null) {
                this.qde.application.applicants[this.applicantIndex].documents = result.application.applicants[this.applicantIndex].documents;
              }
            } catch(e) {}
            try {
              if(result.application.applicants[this.applicantIndex].isMainApplicant != null) {
                this.qde.application.applicants[this.applicantIndex].isMainApplicant = result.application.applicants[this.applicantIndex].isMainApplicant;
              }
            } catch(e) {}

            try{
              if(result.application.applicants[this.applicantIndex].pan.fileName != null){
                this.idPanFileName = result.application.applicants[this.applicantIndex].pan.fileName;
              }
            }catch(e) {}  
            
            try{
              if(result.application.applicants[this.applicantIndex].pan.fileSize != null){
                this.idPanFileSize = result.application.applicants[this.applicantIndex].pan.fileSize;
              }
            }catch(e) {}  

            try {
              if(result.application.applicants[this.applicantIndex].contactDetails.isMobileOTPverified != null) {
                this.qde.application.applicants[this.applicantIndex].contactDetails.isMobileOTPverified = result.application.applicants[this.applicantIndex].contactDetails.isMobileOTPverified;
              }
            } catch(e) {}

            try {
              if(result.application.applicants[this.applicantIndex].contactDetails.isAlternateOTPverified != null) {
                this.qde.application.applicants[this.applicantIndex].contactDetails.isAlternateOTPverified = result.application.applicants[this.applicantIndex].contactDetails.isAlternateOTPverified;
              }
            } catch(e) {}
     
      
      // Document Type
      if( ! isNaN(parseInt(this.qde.application.applicants[this.applicantIndex].pan.docType)) ) {
        this.selectedDocType = this.docType[(parseInt(this.qde.application.applicants[this.applicantIndex].pan.docType))-1];
      } 

      // Personal Details Title
      if( ! isNaN(parseInt(this.qde.application.applicants[this.applicantIndex].personalDetails.title)) ) {
        this.selectedTitle = this.getApplicantTitle(this.qde.application.applicants[this.applicantIndex].personalDetails.title);
      }

      // Personal Details Qualification (different because qualification isnt sending sequential value like 1,2,3)
      if( ! isNaN(parseInt(this.qde.application.applicants[this.applicantIndex].personalDetails.qualification)) ) {
        console.log('this.qde.application.applicants[this.applicantIndex].personalDetails.qualification: ', this.qde.application.applicants[this.applicantIndex].personalDetails.qualification);
        // this.selectedQualification = this.qualifications[(parseInt(this.qde.application.applicants[this.applicantIndex].personalDetails.qualification))-1];
        this.selectedQualification = this.qualifications.find(e => e.value == this.qde.application.applicants[this.applicantIndex].personalDetails.qualification);
        console.log('selectedQualification: ', this.selectedQualification);
      }

      // Personal Details Day
      if( ! isNaN(parseInt(this.qde.application.applicants[this.applicantIndex].personalDetails.dob.split('/')[2])) ) {
        this.dob.day = this.days[parseInt(this.qde.application.applicants[this.applicantIndex].personalDetails.dob.split('/')[2])];
      }

      // Personal Details Month
      if( ! isNaN(parseInt(this.qde.application.applicants[this.applicantIndex].personalDetails.dob.split('/')[1])) ) {
        this.dob.month = this.months[parseInt(this.qde.application.applicants[this.applicantIndex].personalDetails.dob.split('/')[1])];
      }

      // Personal Details Year
      if( ! isNaN(parseInt(this.qde.application.applicants[this.applicantIndex].personalDetails.dob.split('/')[0])) ) {
        this.dob.year = this.years.find(val => this.qde.application.applicants[this.applicantIndex].personalDetails.dob.split('/')[0] == val.value);
      }

      // Date of Incorporation Day
      if( ! isNaN(parseInt(this.qde.application.applicants[this.applicantIndex].organizationDetails.dateOfIncorporation.split('/')[2])) ) {
        this.organizationDetails.day = this.days[parseInt(this.qde.application.applicants[this.applicantIndex].organizationDetails.dateOfIncorporation.split('/')[2])];
      }

      // Date of Incorporation Month
      if( ! isNaN(parseInt(this.qde.application.applicants[this.applicantIndex].organizationDetails.dateOfIncorporation.split('/')[1])) ) {
        this.organizationDetails.month = this.months[parseInt(this.qde.application.applicants[this.applicantIndex].organizationDetails.dateOfIncorporation.split('/')[1])];
      }

      // Date of Incorporation Year
      if( ! isNaN(parseInt(this.qde.application.applicants[this.applicantIndex].organizationDetails.dateOfIncorporation.split('/')[0])) ) {
        this.organizationDetails.year = this.years.find(val => this.qde.application.applicants[this.applicantIndex].organizationDetails.dateOfIncorporation.split('/')[0] == val.value);
      }

      // Constitution
      if( ! isNaN(parseInt(this.qde.application.applicants[this.applicantIndex].organizationDetails.constitution)) ) {
        console.log('c', this.qde.application.applicants[this.applicantIndex].organizationDetails.constitution);
        this.selectedConstitution = this.constitutions[(parseInt(this.qde.application.applicants[this.applicantIndex].organizationDetails.constitution))-1];
        console.log(this.selectedConstitution);
      }
      
      // Communication address
      if( ! isNaN(parseInt(this.qde.application.applicants[this.applicantIndex].communicationAddress.residentialStatus)) ) {
        this.selectedResidence = this.maritals[(parseInt(this.qde.application.applicants[this.applicantIndex].communicationAddress.residentialStatus)) - 1];
      }

      if( ! isNaN(parseInt(this.qde.application.applicants[this.applicantIndex].maritalStatus.status)) ) {
        this.selectedMaritialStatus = this.maritals[(parseInt(this.qde.application.applicants[this.applicantIndex].maritalStatus.status))-1];
      }

      if( ! isNaN(parseInt(this.qde.application.applicants[this.applicantIndex].maritalStatus.spouseTitle)) ) {
          this.selectedSpouseTitle = this.titles[(parseInt(this.qde.application.applicants[this.applicantIndex].maritalStatus.spouseTitle))-1];
      }

      if( ! isNaN(parseInt(this.qde.application.applicants[this.applicantIndex].familyDetails.fatherTitle)) ) {
        this.selectedFatherTitle  = this.maleTitles[(parseInt(this.qde.application.applicants[this.applicantIndex].familyDetails.fatherTitle))-1];
      }

      if( ! isNaN(parseInt(this.qde.application.applicants[this.applicantIndex].familyDetails.motherTitle)) ) {
        this.selectedMotherTitle = this.femaleTitles[(parseInt(this.qde.application.applicants[this.applicantIndex].familyDetails.motherTitle))-1];
      }

      // Other
      if( ! isNaN(parseInt(this.qde.application.applicants[this.applicantIndex].other.religion)) ) {
        this.selectedReligion = this.religions[(parseInt(this.qde.application.applicants[this.applicantIndex].other.religion))-1];
      }

      // Category
      if( ! isNaN(parseInt(this.qde.application.applicants[this.applicantIndex].other.category)) ) {
        this.selectedCategory  = this.categories[(parseInt(this.qde.application.applicants[this.applicantIndex].other.category))-1];
      }

      // Occupation details
      if( ! isNaN(parseInt(this.qde.application.applicants[this.applicantIndex].occupation.occupationType)) ) {
        this.selectedOccupation = this.occupations.find(e => e.value == this.qde.application.applicants[this.applicantIndex].occupation.occupationType);
      }

      // Assesment methodology
      console.log("AM: ", this.assessmentMethodology);
      if( ! isNaN(parseInt(this.qde.application.applicants[this.applicantIndex].incomeDetails.assessmentMethodology)) ) {
        this.selectedAssesmentMethodology = this.assessmentMethodology.find(v => v.value == this.qde.application.applicants[this.applicantIndex].incomeDetails.assessmentMethodology);
      }

      /******************************************************************************
      * Sacred Route Start (WARNING: TOUCH THIS ONLY IF YOU KNOW WHAT YOU ARE DOING)
      ******************************************************************************/
      // Incoming from create in Individual Pan
      // if(this.panslide == true && this.qde.application.applicants[this.applicantIndex].isIndividual == true) {
      //   this.swiperSliders.forEach((v, i, a) => {
      //     v.setIndex(0);
      //   });
      //   this.tabSwitch(1);
      //   //  this.panSlider2.setIndex(2);
      // }
      // // Incoming from create in Non Individual Pan
      // else if(this.panslide2 == true && this.qde.application.applicants[this.applicantIndex].isIndividual == false) {
      //   this.swiperSliders.forEach((v, i, a) => {
      //     v.setIndex(0);
      //   });
      //   this.tabSwitch(11);
      //   this.panSlider4.setIndex(1);
      // }
      // // Incoming for edit Individual
      // else if(this.panslide == false && this.qde.application.applicants[this.applicantIndex].isIndividual == true) {
      //   this.swiperSliders.forEach((v, i, a) => {
      //     v.setIndex(0);
      //   });
      //   this.tabSwitch(0);
      //   this.panSlider2.setIndex(1);
      // }
      // // Incoming for edit Non-Individual
      // else if(this.panslide2 == false && this.qde.application.applicants[this.applicantIndex].isIndividual == false) {
      //   this.swiperSliders.forEach((v, i, a) => {
      //     v.setIndex(0);
      //   });
      //   // Enable it when upload file is enabled
      //   this.tabSwitch(10);
      //   // this.panSlider4.setIndex(1);

      //   // this.tabSwitch(10);
      // }

      // So that route is now in edit mode only
      // this.cds.changePanSlide(false);
      // this.cds.changePanSlide2(false);
      /*******************************************
      * Sacred Route End
      *******************************************/


      this.initializeVariables();
          });
        // }
      }

      if(params['applicationId'] != null) {
        if(this.isEligibilityForReviewsSub != null) {
          this.isEligibilityForReviewsSub.unsubscribe();
        }
        this.isEligibilityForReviewsSub = this.cds.isEligibilityForReviews.subscribe(val => {
          try {
            this.isEligibilityForReview = val.find(v => v.applicationId == params['applicationId'])['isEligibilityForReview'];
          } catch(ex) {
          //   this.router.navigate(['/leads']);
          }
        });
      }
    });


    /********************************************************************
    * Check for User and set isReadOnly=true to disable editing of fields
    ********************************************************************/
    this.cds.isReadOnlyForm.subscribe(val => {
      this.isReadOnly = val;
      this.options.readOnly = val;
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
    // swiperInstance.prevSlide();
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

    // Check for invalid tabIndex
    if(tabIndex < this.fragments.length) {

      let t = fromQde ? this.page: 1;

      if(this.swiperSliders && this.swiperSliders.length > 0) {
        this.swiperSliders[tabIndex].setIndex(this.page-1);
      }

      // It should not allow to go to any other tabs if applicationId is not present
      if(this.applicantIndex != null && this.qde.application.applicationId != null && this.qde.application.applicationId != '') {
        this.router.navigate([], {queryParams: { tabName: this.fragments[tabIndex], page: t }});
      }

      // this.router.navigate([], { fragment: this.fragments[tabIndex]});
    }
  }

  onBackButtonClick(swiperInstance ?: Swiper) {

    if(this.activeTab > -1) {
      if(swiperInstance != null && swiperInstance.getIndex() > 0) {
        // Go to Previous Slide
        this.goToPrevSlide(swiperInstance);
      } else {
        // When income consider is true, official correspondence will be hidden
        if(this.activeTab == 9 && this.qde.application.applicants[this.applicantIndex].incomeDetails.incomeConsider == false) {
          this.tabSwitch(this.activeTab - 2);
        } else {
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
    this.qde.application.applicants[this.applicantIndex].contactDetails.alternateMobileNumber = null;
  }

  addRemoveResidenceNumberField() {
    this.isAlternateResidenceNumber = !this.isAlternateResidenceNumber;
  }

 //-------------------------------------------------------------
  // PAN
  //-------------------------------------------------------------

  getApplicantTitle (salutation:string) {
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
  
  submitPanNumber(form: NgForm, swiperInstance ?: Swiper) {
    if(this.isTBMLoggedIn) {
      this.goToNextSlide(swiperInstance);
    } else {

    event.preventDefault();

    if (form && !form.valid) {
      return;
    }

    this.qde.application.applicationFormNumber = form.value.applicationFormNo;
    this.qde.application.applicants[this.applicantIndex].pan.panNumber = form.value.pan;
    this.qde.application.applicants[this.applicantIndex].pan.docType = form.value.docTypeindividual.value;
    this.qde.application.applicants[this.applicantIndex].pan.docNumber = form.value.docNumber;

    // if(this.qde.application.applicants[this.applicantIndex].pan.panNumber) {
    //   this.panSlider2.setIndex(2);
    //   return;
    // }

    if(this.isValidPan == false || this.isValidPan == null) {

      this.checkPanValidSub=this.qdeHttp.checkPanValid(this.qdeService.getFilteredJson({actualPanNumber: form.value.pan})).subscribe((response) => {

        if(response["ProcessVariables"]["status"] == true && response['ProcessVariables']['isValidPan'] == true) { // Boolean to check from nsdl website whether pan is valid or not 


          this.qde.application.applicants[this.applicantIndex].pan.panVerified = this.isValidPan = response['ProcessVariables']['isValidPan'];
  
          let processVariables = response["ProcessVariables"];
          if(processVariables["firstName"] != "" && processVariables["lastName"] != ""){
            this.qde.application.applicants[this.applicantIndex].personalDetails.firstName = processVariables["firstName"];
            this.qde.application.applicants[this.applicantIndex].personalDetails.lastName = processVariables["lastName"];  
          }
          if(processVariables["applicantTitleId"] > 0) {
            this.qde.application.applicants[this.applicantIndex].personalDetails.title  = processVariables["applicantTitleId"];
          }
          this.selectedTitle  = this.getApplicantTitle(processVariables["applicantTitleId"]);

          this.createOrUpdatePanDetailsSub=this.qdeHttp.createOrUpdatePanDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {

            // If successful
            if(response["ProcessVariables"]["status"] == true) {
              let result = this.parseJson(response["ProcessVariables"]["response"]);
              // this.qde.application.ocsNumber = result["application"]["ocsNumber"];
              // this.qde.application.applicationId = result["application"]["applicationId"];

              this.qde.application.applicationId = result['application']['applicationId'];
      
              // let isApplicantPresent:boolean = false;
      
              this.tempOldPanNumber = this.qde.application.applicants[this.applicantIndex].pan.panNumber;

              if((result["application"]["applicants"]).length > 0) {
                this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(result['application']['applicationId'], result['application']['applicants'][0]['applicantId']+"", 1, this.fragments[this.activeTab+1], screenPages['applicantDetails']).subscribe(auditRes => {
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
                this.setStatusApiSub= this.qdeHttp.setStatusApi( applicationId, environment.status.QDECREATED).subscribe((response) => {
                  if(response["ProcessVariables"]["status"] == true) { 
                    // this.cds.changePanSlide(true);
                    this.router.navigate(['/applicant/'+this.qde.application.applicationId]);
                  }
                });
  
              }else {
              //  this.cds.changePanSlide(true);
              //  this.panSlider2.setIndex(2);
               this.tabSwitch(1);
                // return;
              //  this.panSlider2.setIndex(2);
              //   return;
              }
  
  
            } else {
              this.panErrorCount++;
              // Throw Invalid Pan Error
            }
          }, (error) => {
            // alert("error"+error);
            // Throw Request Failure Error
          });
  
        }
        // When Pan Not Verified
        else {
          this.qde.application.applicants[this.applicantIndex].pan.panVerified = false;
          this.isValidPan = false;
        }
      });
    }
    // Only create HFC API when PAN is already valid and not touched
    else {
      this.createOrUpdatePanDetailsSub=this.qdeHttp.createOrUpdatePanDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
        // If successful
        
        if(response["ProcessVariables"]["status"] == true) {
          let result = this.parseJson(response["ProcessVariables"]["response"]);
          // this.qde.application.ocsNumber = result["application"]["ocsNumber"];
          // this.qde.application.applicationId = result["application"]["applicationId"];
         
          this.qde.application.applicationId = result['application']['applicationId'];
  
          // let isApplicantPresent:boolean = false;
  
          if((result["application"]["applicants"]).length > 0) {
            // isApplicantPresent = applicants[this.applicantIndex].hasOwnProperty('applicantId');
            // this.qde.application.applicants[this.coApplicantIndex].applicantId =  applicants[this.coApplicantIndex]["applicantId"];

            this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(result['application']['applicationId'], result['application']['applicants'][0]['applicantId']+"", 1, this.fragments[this.activeTab+1], screenPages['applicantDetails']).subscribe(auditRes => {
              if(auditRes['ProcessVariables']['status'] == true) {
                this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
                this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
                this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
                this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
              }
            });

            let applicationId = result['application']['applicationId'];
           this.setStatusApiSub= this.qdeHttp.setStatusApi( applicationId, environment.status.QDECREATED).subscribe((response) => {
              if(response["ProcessVariables"]["status"] == true) { 
                // this.cds.changePanSlide(true);
                this.router.navigate(['/applicant/'+this.qde.application.applicationId]);
              }
            });

          }else {
          //  this.cds.changePanSlide(true);
          //  this.panSlider2.setIndex(2);
           this.tabSwitch(1);
            // return;
          //  this.panSlider2.setIndex(2);
          //   return;
          }


        } else {
          this.panErrorCount++;
          // Throw Invalid Pan Error
        }
      }, (error) => {
        // alert("error"+error);
        // Throw Request Failure Error
      });
    }

    }
  }


  //-------------------------------------------------------------
  // PAN
  //-------------------------------------------------------------

  submitOrgPanNumber(form: NgForm, swiperInstance ?: Swiper) {
    if(this.isTBMLoggedIn) {
      // this.goToNextSlide(swiperInstance);
      this.tabSwitch(this.activeTab+1);
    } else {
      event.preventDefault();

      if (form && !form.valid) {
        return;
      }
  
      this.qde.application.applicationFormNumber = form.value.applicationFormNo;
      this.qde.application.applicants[this.applicantIndex].pan.panNumber = form.value.pan;
      // this.qde.application.applicants[this.applicantIndex].pan.docType = form.value.panDocType.value;
      // this.qde.application.applicants[this.applicantIndex].pan.docNumber = form.value.docNumber;

      if(this.isValidPan == false || this.isValidPan == null) {
        this.checkPanValidSub2 = this.qdeHttp.checkPanValid(this.qdeService.getFilteredJson({actualPanNumber: form.value.pan})).subscribe((response) => {

          // response["ProcessVariables"]["status"] = true; // Comment while deploying if service is enabled false
  
          if(response["ProcessVariables"]["status"] == true && response['ProcessVariables']['isValidPan'] == true) { // Boolean to check from nsdl website whether pan is valid or not 
      
            this.qde.application.applicants[this.applicantIndex].pan.panVerified = this.isValidPan = true;
      
            let processVariables = response["ProcessVariables"];//need to check its needed for non individual
            this.qde.application.applicants[this.applicantIndex].personalDetails.firstName = processVariables["firstName"];
            this.qde.application.applicants[this.applicantIndex].personalDetails.lastName = processVariables["lastName"];
            if(processVariables["applicantTitleId"] > 0) {
              this.qde.application.applicants[this.applicantIndex].personalDetails.title  = processVariables["applicantTitleId"];
            }
            this.selectedTitle = this.getApplicantTitle(processVariables["applicantTitleId"]);
            this.createOrUpdatePanDetailsSub2=this.qdeHttp.createOrUpdatePanDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
              // If successfull
              if(response["ProcessVariables"]["status"] == true) {
      
                let result = this.parseJson(response["ProcessVariables"]["response"]);
      
                this.qde.application.applicationId = result['application']['applicationId'];
      
                // let isApplicantPresent:boolean = false;
      
                if((result["application"]["applicants"]).length > 0) {

                  this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(result['application']['applicationId'], result['application']['applicants'][0]['applicantId']+"", 1, this.fragments[this.activeTab+1], screenPages['applicantDetails']).subscribe(auditRes => {
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
                  this.setStatusApiSub2=this.qdeHttp.setStatusApi( applicationId, environment.status.QDECREATED).subscribe((response) => {
                    if(response["ProcessVariables"]["status"] == true) { 
                      // this.cds.changePanSlide2(true);
                      this.router.navigate(['/applicant/'+this.qde.application.applicationId], { queryParams: { tabName: this.fragments[this.activeTab+1], page: 1} });
                    }
                  });
      
                }else {
                    this.tabSwitch(11);
                  // this.goToNextSlide(swiperInstance);
                  return;
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
              this.qde.application.applicants[this.applicantIndex].pan.panVerified = false;
            }
        });
      } else {
        this.createOrUpdatePanDetailsSub2=this.qdeHttp.createOrUpdatePanDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
          // If successfull
          if(response["ProcessVariables"]["status"] == true) {
  
            let result = this.parseJson(response["ProcessVariables"]["response"]);
  
            this.qde.application.applicationId = result['application']['applicationId'];
  
            // let isApplicantPresent:boolean = false;
  
            if((result["application"]["applicants"]).length > 0) {

              this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(result['application']['applicationId'], result['application']['applicants'][0]['applicantId']+"", 1, this.fragments[this.activeTab+1], screenPages['applicantDetails']).subscribe(auditRes => {
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
              this.setStatusApiSub2=this.qdeHttp.setStatusApi( applicationId, environment.status.QDECREATED).subscribe((response) => {
                if(response["ProcessVariables"]["status"] == true) { 
                  // this.cds.changePanSlide2(true);
                  this.router.navigate(['/applicant/'+this.qde.application.applicationId], { queryParams: { tabName: this.fragments[this.activeTab+1], page: 1} });
                }
              });
  
            }else {
                this.tabSwitch(11);
              // this.goToNextSlide(swiperInstance);
              return;
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
  
      this.qde.application.applicants[this.applicantIndex].personalDetails.title = form.value.title.value;
      this.qde.application.applicants[this.applicantIndex].personalDetails.firstName = form.value.firstName;
      this.qde.application.applicants[this.applicantIndex].personalDetails.middleName = form.value.middleName;
      this.qde.application.applicants[this.applicantIndex].personalDetails.lastName = form.value.lastName;
  
      console.log("*", this.qde);
      console.log("**", this.qdeService.getFilteredJson(this.qde));
  
      this.qdeService.setQde(this.qde);
  
      this.createOrUpdatePersonalDetailsSub=this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
        // If successful
        if(response["ProcessVariables"]["status"]) {

          this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.applicantIndex]['applicantId']+"", this.page, this.tabName, screenPages['applicantDetails']).subscribe(auditRes => {
            if(auditRes['ProcessVariables']['status'] == true) {
              this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
              this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
              this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
              this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
            }
          });

          let maleTitles = ['1','10'];
          let femaleTitles = ['2','3','15','16'];
          console.log("this.selectedTitle: ", this.selectedTitle);
          console.log("this.maleTitles: ", maleTitles.find(v => v == this.selectedTitle.value));
          console.log("this.femaleTiles: ", femaleTitles.find(v => v == this.selectedTitle.value));
          if(maleTitles.find(v => v == this.selectedTitle.value) != null) {
            this.qde.application.applicants[this.applicantIndex].personalDetails.gender = '1';
          }
          else if(femaleTitles.find(v => v == this.selectedTitle.value) != null) {
            this.qde.application.applicants[this.applicantIndex].personalDetails.gender = '2';
          }
          this.goToNextSlide(swiperInstance);
        } else {
          // Throw Invalid Pan Error
        }
      }, (error) => {
        console.log("response : ", error);
      });
    }
    
  }

  //-------------------------------------------------------------
  submitResidentialNon(value, swiperInstance ?: Swiper) {

    this.qde.application.applicants[this.applicantIndex].personalDetails.applicantStatus = value;


    this.createOrUpdatePersonalDetailsSub2=this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
      // If successful
      if(response["ProcessVariables"]["status"]) {
        this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.applicantIndex]['applicantId']+"", this.page, this.tabName, screenPages['applicantDetails']).subscribe(auditRes => {
          if(auditRes['ProcessVariables']['status'] == true) {
            this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
            this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
            this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
            this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
          }
        });
        this.goToNextSlide(swiperInstance);
      } else {
        // Throw Invalid Pan Error
      }
    }, (error) => {
      console.log("response : ", error);
    });
    
  }

  submitGenderDetails(value, swiperInstance ?: Swiper) {

    if(this.isTBMLoggedIn) {
      this.goToNextSlide(swiperInstance);
    } else {
      this.qde.application.applicants[this.applicantIndex].personalDetails.gender = value;

      console.log("FILT: ",this.qdeService.getFilteredJson(this.qde));
  
      this.createOrUpdatePersonalDetailsSub3=this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
        // If successful
        if(response["ProcessVariables"]["status"]) {
          this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.applicantIndex]['applicantId']+"", this.page, this.tabName, screenPages['applicantDetails']).subscribe(auditRes => {
            if(auditRes['ProcessVariables']['status'] == true) {
              this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
              this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
              this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
              this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
            }
          });
          this.goToNextSlide(swiperInstance);
          console.log(response['ProcessVariables']['response']);
        } else {
          // Throw Invalid Pan Error
        }
      }, (error) => {
        console.log("response : ", error);
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
  
      this.qde.application.applicants[this.applicantIndex].personalDetails.qualification = form.value.qualification.value;
  
      console.log(this.qde.application.applicants[this.applicantIndex]);
  
      this.createOrUpdatePersonalDetailsSub4=this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
        // If successful
        if(response["ProcessVariables"]["status"]) {
          this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.applicantIndex]['applicantId']+"", this.page, this.tabName, screenPages['applicantDetails']).subscribe(auditRes => {
            if(auditRes['ProcessVariables']['status'] == true) {
              this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
              this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
              this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
              this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
            }
          });
          this.goToNextSlide(swiperInstance);
        } else {
          // Throw Invalid Pan Error
        }
      }, (error) => {
        console.log("response : ", error);
      });
    }
    
  }


  ageError=false;

  submitDobDetails(form: NgForm, swiperInstance ?: Swiper) {
    console.log("isTBMLoggedIn: ", this.isTBMLoggedIn);
    if(this.isTBMLoggedIn) {
      this.tabSwitch(2);
    } else {
      event.preventDefault();

      if (form && !form.valid) {
        return;
      }
  
      const dateofbirth = form.value.year.value+'-'+form.value.month.value+'-'+form.value.day.value;
      const d1:any = new Date(dateofbirth);
      const d2:any = new Date();
      var diff = d2 - d1 ;
      var age = Math.floor(diff/(1000*60*60*24*365.25));
      if(age < 18){
        this.ageError = true;
        return;
      }else {
        this.ageError=false;
      }
  
      this.qde.application.applicants[this.applicantIndex].personalDetails.dob = form.value.year.value+'-'+form.value.month.value+'-'+form.value.day.value;
      this.qde.application.applicants[this.applicantIndex].personalDetails.birthPlace = form.value.birthPlace;
  
      console.log(this.qde.application.applicants[this.applicantIndex]);
  
      this.createOrUpdatePersonalDetailsSub5=this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
        // If successful
        if(response["ProcessVariables"]["status"]) {
          this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.applicantIndex]['applicantId']+"", this.page, this.tabName, screenPages['applicantDetails']).subscribe(auditRes => {
            if(auditRes['ProcessVariables']['status'] == true) {
              this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
              this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
              this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
              this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
            }
          });
          this.qdeHttp.duplicateApplicantCheck(this.qde.application.applicants[this.applicantIndex].applicantId).subscribe(res => {
            
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
          });
        } else {
          // Throw Invalid Pan Error
        }
      }, (error) => {
        console.log("response : ", error);
      });
    }
  }
  //-------------------------------------------------------------


  //-------------------------------------------------------------
  // Contact Details
  //-------------------------------------------------------------
  submitContactDetails(form: NgForm) {
    if(this.isTBMLoggedIn) {
      this.tabSwitch(3);
    } else {

      event.preventDefault();

      if (form && !form.valid) {
        return;
      }
  
      this.qde.application.applicants[this.applicantIndex].contactDetails.preferredEmailId = form.value.preferEmailId;
      this.qde.application.applicants[this.applicantIndex].contactDetails.alternateEmailId = form.value.alternateEmailId;
      this.qde.application.applicants[this.applicantIndex].contactDetails.mobileNumber = form.value.mobileNumber;
      this.qde.application.applicants[this.applicantIndex].contactDetails.alternateMobileNumber = form.value.alternateMobileNumber;
      this.qde.application.applicants[this.applicantIndex].contactDetails.residenceNumber = form.value.residenceNumber1+'-'+form.value.residenceNumber2;
      this.qde.application.applicants[this.applicantIndex].contactDetails.alternateResidenceNumber = form.value.alternateResidenceNumberStd1+'-'+form.value.alternateResidenceNumber2;
  
  
      
      console.log("CONTACT DETAILS", this.qde.application.applicants[this.applicantIndex]);
      this.createOrUpdatePersonalDetailsSub6=this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
        // If successful
        if(response["ProcessVariables"]["status"]) {
          this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.applicantIndex]['applicantId']+"", this.page, this.tabName, screenPages['applicantDetails']).subscribe(auditRes => {
            if(auditRes['ProcessVariables']['status'] == true) {
              this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
              this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
              this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
              this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
            }
          });
          this.tabSwitch(3);
        } else {
          // Throw Invalid Pan Error
        }
      }, (error) => {
        console.log("response : ", error);
      });
  
    }
  }

  onPinCodeChange(event, screenName) {
    console.log(event.target.value);
     let zipCode= event.target.value

     this.getCityAndStateSub=this.qdeHttp.getCityAndState(zipCode).subscribe((response) => {

        if(response['Error'] == '0') {
          var result = JSON.parse(response["ProcessVariables"]["response"]);

          this.commCityState = "";
  
          if(result.city != null && result.state != null && result.city != "" && result.state != "") {
            this.commCityState = result.city +" "+ result.state;
          }else {
              this.isApplicantPinModal = true;
            // alert("Pin code not available / enter proper pincode");
          }

          this.qde.application.applicants[this.applicantIndex][screenName].zipcodeId = result.zipcodeId;
          this.qde.application.applicants[this.applicantIndex][screenName].stateId = result.stateId;
          this.qde.application.applicants[this.applicantIndex][screenName].cityId = result.cityId;
  
  
          this.qde.application.applicants[this.applicantIndex][screenName].city = result.city;
          this.qde.application.applicants[this.applicantIndex][screenName].state = result.state;
          this.qde.application.applicants[this.applicantIndex][screenName].cityState = this.commCityState || "";  
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

    if(this.isTBMLoggedIn) {
      this.tabSwitch(4);
    } else {
      //  event.preventDefault();

      if (form && !form.valid) {
        return;
      }

      console.log("Comm Addr ", this.qde.application.applicants[this.applicantIndex].communicationAddress);

      this.qde.application.applicants[this.applicantIndex].communicationAddress.residentialStatus = form.value.residentialStatus.value;
      this.qde.application.applicants[this.applicantIndex].communicationAddress.addressLineOne = form.value.addressLineOne;
      this.qde.application.applicants[this.applicantIndex].communicationAddress.addressLineTwo = form.value.addressLineTwo;
      this.qde.application.applicants[this.applicantIndex].communicationAddress.zipcodeId = this.qde.application.applicants[this.applicantIndex].communicationAddress.zipcodeId;
      this.qde.application.applicants[this.applicantIndex].communicationAddress.cityId = this.qde.application.applicants[this.applicantIndex].communicationAddress.cityId;
      this.qde.application.applicants[this.applicantIndex].communicationAddress.stateId = this.qde.application.applicants[this.applicantIndex].communicationAddress.stateId;
      this.qde.application.applicants[this.applicantIndex].communicationAddress.numberOfYearsInCurrentResidence =  form.value.numberOfYearsInCurrentResidence;
      this.qde.application.applicants[this.applicantIndex].communicationAddress.permanentAddress = form.value.permanentAddress;
      this.qde.application.applicants[this.applicantIndex].communicationAddress.preferedMailingAddress =  (form.value.prefredMail == 1) ? true: false;


      this.qde.application.applicants[this.applicantIndex].permanentAddress.addressLineOne = form.value.pAddressLineOne;
      this.qde.application.applicants[this.applicantIndex].permanentAddress.addressLineTwo = form.value.pAddressLineTwo;
      this.qde.application.applicants[this.applicantIndex].permanentAddress.zipcodeId = this.qde.application.applicants[this.applicantIndex].permanentAddress.zipcodeId;
      this.qde.application.applicants[this.applicantIndex].permanentAddress.cityId = this.qde.application.applicants[this.applicantIndex].permanentAddress.cityId;
      this.qde.application.applicants[this.applicantIndex].permanentAddress.stateId = this.qde.application.applicants[this.applicantIndex].permanentAddress.stateId;
      this.qde.application.applicants[this.applicantIndex].permanentAddress.numberOfYearsInCurrentResidence = form.value.numberOfYearsInCurrentResidence;


      console.log(this.qde.application.applicants[this.applicantIndex].communicationAddress);

      this.createOrUpdatePersonalDetailsSub7=this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
        // If successful
        if(response["ProcessVariables"]["status"]) {
          this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.applicantIndex]['applicantId']+"", this.page, this.tabName, screenPages['applicantDetails']).subscribe(auditRes => {
            if(auditRes['ProcessVariables']['status'] == true) {
              this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
              this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
              this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
              this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
            }
          });
          this.tabSwitch(4);
        } else {
          // Throw Invalid Pan Error
        }
      }, (error) => {
        console.log("response : ", error);
      });
    }

  }


  //-------------------------------------------------------------
  // Marital Status
  //-------------------------------------------------------------
  submitMaritalStatus(form: NgForm, swiperInstance ?: Swiper) {

    if(this.isTBMLoggedIn) {
      if(form.value.maritalStatus.value == "2") {
        this.goToNextSlide(swiperInstance);
      } else {
        this.tabSwitch(5);
      }
    } else {

      if (form && !form.valid) {
        return;
      }
  
      this.qde.application.applicants[this.applicantIndex].maritalStatus.status = form.value.maritalStatus.value;
  
  
      console.log(this.qde.application.applicants[this.applicantIndex].maritalStatus);
      this.createOrUpdatePersonalDetailsSub8=this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
        // If successful
        if(response["ProcessVariables"]["status"]) {
          // Dont show spouse details for Single
          this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.applicantIndex]['applicantId']+"", this.page, this.tabName, screenPages['applicantDetails']).subscribe(auditRes => {
            if(auditRes['ProcessVariables']['status'] == true) {
              this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
              this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
              this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
              this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
            }
          });
          console.log("Marital Status: ", form.value.maritalStatus.value);
          if(form.value.maritalStatus.value == "2") {
            this.goToNextSlide(swiperInstance);
          } else {
            this.tabSwitch(5);
          }
        } else {
          // Throw Invalid Pan Error
        }
      }, (error) => {
        console.log("response : ", error);
        //this.goToNextSlide(swiperInstance);
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
  
      this.qde.application.applicants[this.applicantIndex].maritalStatus.spouseTitle = form.value.spouseTitle.value;
      this.qde.application.applicants[this.applicantIndex].maritalStatus.firstName = form.value.firstName;
  
      console.log(this.qde.application.applicants[this.applicantIndex].maritalStatus);
      this.createOrUpdatePersonalDetailsSub9=this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
        // If successful
        if(response["ProcessVariables"]["status"]) {
          this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.applicantIndex]['applicantId']+"", this.page, this.tabName, screenPages['applicantDetails']).subscribe(auditRes => {
            if(auditRes['ProcessVariables']['status'] == true) {
              this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
              this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
              this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
              this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
            }
          });
          this.goToNextSlide(swiperInstance);
        } else {
          // Throw Invalid Pan Error
        }
      }, (error) => {
        console.log("response : ", error);
       // alert("error"+error.);
      });
  
    }
  }



  submitSpouseEarning(value, swiperInstance ?: Swiper) {
    if(this.isTBMLoggedIn) {
      if(value == 1) {
        this.goToNextSlide(swiperInstance);
      } else {
        this.tabSwitch(5);
      }
    } else {
      this.qde.application.applicants[this.applicantIndex].maritalStatus.earning = (value == 1) ? true: false;

      console.log(this.qde.application.applicants[this.applicantIndex].maritalStatus);
      this.createOrUpdatePersonalDetailsSub10=this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
        // If successful
        if(response["ProcessVariables"]["status"]) {
          this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.applicantIndex]['applicantId']+"", this.page, this.tabName, screenPages['applicantDetails']).subscribe(auditRes => {
            if(auditRes['ProcessVariables']['status'] == true) {
              this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
              this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
              this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
              this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
            }
          });
          if(value == 1) {
            this.goToNextSlide(swiperInstance);
          } else {
            this.tabSwitch(5);
          }
        } else {
          // Throw Invalid Pan Error
        }
      }, (error) => {
        console.log("response : ", error);
        // alert("error"+error);
      });
  
    }
  }

  submitSpouseEarningAmt(form: NgForm, swiperInstance ?: Swiper) {

    if(this.isTBMLoggedIn) {
      this.tabSwitch(5);
    } else {
      // if (form && !form.valid) {
      //   return;
      // }
  
      // Amount should be number
      // if(isNaN(parseInt(form.value.amount))) {
      //   return;
      // }
  
      this.qde.application.applicants[this.applicantIndex].maritalStatus.amount = form.value.amount;
  
      console.log(this.qde.application.applicants[this.applicantIndex].maritalStatus);
  
      this.createOrUpdatePersonalDetailsSub11=this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
        // If successful
        if(response["ProcessVariables"]["status"]) {
          this.tabSwitch(5);
        } else {
          // Throw Invalid Pan Error
        }
      }, (error) => {
        console.log("response : ", error);
          this.tabSwitch(5);
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
  
      this.qde.application.applicants[this.applicantIndex].familyDetails.numberOfDependents = form.value.numberOfDependents;
  
      console.log(this.qde.application.applicants[this.applicantIndex].familyDetails);
  
      this.createOrUpdatePersonalDetailsSub12=this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
        // If successful
        if(response["ProcessVariables"]["status"]) {
          this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.applicantIndex]['applicantId']+"", this.page, this.tabName, screenPages['applicantDetails']).subscribe(auditRes => {
            if(auditRes['ProcessVariables']['status'] == true) {
              this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
              this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
              this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
              this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
            }
          });
          this.goToNextSlide(swiperInstance);
        } else {
          // Throw Invalid Pan Error
        }
      }, (error) => {
        console.log("response : ", error);
      });
  
    }
  }

  submitFamilyForm2(form: NgForm, swiperInstance ?: Swiper) {

    if(this.isTBMLoggedIn) {
      this.tabSwitch(6);
    } else {
      if (form && !form.valid) {
        return;
      }
  
      this.qde.application.applicants[this.applicantIndex].familyDetails.fatherTitle = form.value.fatherTitle.value;
      this.qde.application.applicants[this.applicantIndex].familyDetails.fatherName = form.value.fatherName;
      this.qde.application.applicants[this.applicantIndex].familyDetails.motherTitle = form.value.motherTitle.value;
      this.qde.application.applicants[this.applicantIndex].familyDetails.motherName = form.value.motherName;
      this.qde.application.applicants[this.applicantIndex].familyDetails.motherMaidenName = form.value.motherMaidenName;
  
      console.log(">>>", this.qde.application.applicants[this.applicantIndex].familyDetails);
  
      this.createOrUpdatePersonalDetailsSub13=this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
        // If successful
        if(response["ProcessVariables"]["status"]) {
          this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.applicantIndex]['applicantId']+"", this.page, this.tabName, screenPages['applicantDetails']).subscribe(auditRes => {
            if(auditRes['ProcessVariables']['status'] == true) {
              this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
              this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
              this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
              this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
            }
          });
          this.tabSwitch(6);
        } else {
          // Throw Invalid Pan Error
        }
      }, (error) => {
        console.log("response : ", error);
      });
    }

  }
  //-------------------------------------------------------------



  //-------------------------------------------------------------
  // Other Details
  //-------------------------------------------------------------
  submitOtherForm(form: NgForm) {

    if(this.isTBMLoggedIn) {
      this.tabSwitch(7);
    } else {
      if (form && !form.valid) {
        return;
      }
  
      this.qde.application.applicants[this.applicantIndex].other.religion = form.value.religion.value;
      // if(form.value.religion.value == '6') {
      //   // this.otherReligion = 
      // }
  
      this.qde.application.applicants[this.applicantIndex].other.category = form.value.category.value;
  
      // this.qde.application.applicants[this.applicantIndex].familyDetails.fatherTitle = form.value.fatherTitle;
  
      console.log("Other: ", this.qde.application.applicants[this.applicantIndex].other);
  
      this.createOrUpdatePersonalDetailsSub14=this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
        // If successful
        if(response["ProcessVariables"]["status"]) {
          this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.applicantIndex]['applicantId']+"", this.page, this.tabName, screenPages['applicantDetails']).subscribe(auditRes => {
            if(auditRes['ProcessVariables']['status'] == true) {
              this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
              this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
              this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
              this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
            }
          });
          this.tabSwitch(7);
        } else {
          // Throw Invalid Pan Error
        }
      }, (error) => {
        console.log("response : ", error);
        // alert("error"+error);
      });
    }

  }
  //-------------------------------------------------------------


  //-------------------------------------------------------------
  // Occupation Details
  //-------------------------------------------------------------


  submitOccupationDetails(form: NgForm, swiperInstance: Swiper) {
    if(this.isTBMLoggedIn) {
      // this.tabSwitch(8);

      /*********************************************************************************************************
      * If Salaried, Self Employed Professional, Self Employed Business, Retired then only show income consider
      *********************************************************************************************************/
      if(['2','5','8','10'].includes(this.selectedOccupation.value.toString())) {
        // this.isApplicantRouteModal = true
        this.goToNextSlide(swiperInstance);
      } else {
        this.tabSwitch(9);
      }
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
  
  
  
  
      this.qde.application.applicants[this.applicantIndex].occupation.occupationType = this.selectedOccupation.value.toString();

      if(['2','5','8','10'].includes(this.selectedOccupation.value.toString())) {
        this.qde.application.applicants[this.applicantIndex].occupation.companyName = form.value.companyName;
      }
  
      if(['2','5','8','10'].includes(this.selectedOccupation.value.toString())) {
        this.qde.application.applicants[this.applicantIndex].occupation.numberOfYearsInCurrentCompany = form.value.numberOfYearsInCurrentCompany;
      } else {
        this.qde.application.applicants[this.applicantIndex].occupation.numberOfYearsInCurrentCompany = 0;
      }
  
      if(['2','5','8','10'].includes(this.selectedOccupation.value.toString())) {
        this.qde.application.applicants[this.applicantIndex].occupation.totalWorkExperience = form.value.totalExperienceYear;
      } else {
        this.qde.application.applicants[this.applicantIndex].occupation.totalWorkExperience = 0;
      }

      // Housewife and non-working
      if(['9','18'].includes(this.selectedOccupation.value.toString())) {
        this.qde.application.applicants[this.applicantIndex].incomeDetails.incomeConsider = false;
      }
  
      this.createOrUpdatePersonalDetailsSub15=this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
        // If successful
        if(response["ProcessVariables"]["status"]) {
          this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.applicantIndex]['applicantId']+"", this.page, this.tabName, screenPages['applicantDetails']).subscribe(auditRes => {
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
          if(['2','5','8','10'].includes(this.selectedOccupation.value.toString())) {
            // this.isApplicantRouteModal = true
            this.goToNextSlide(swiperInstance);
          } else {
            this.tabSwitch(9);
          }
          
        } else {
          // Throw Invalid Pan Error
        }
      }, (error) => {
        console.log("response : ", error);
      });
  
    }
  }
  //-------------------------------------------------------------


  //-------------------------------------------------------------
  // Official Correspondence
  //-------------------------------------------------------------
  submitOfficialCorrespondence(form: NgForm) {
    if(this.isTBMLoggedIn) {
      this.tabSwitch(9);
    } else {
      if (form && !form.valid) {
        return;
      }
  
      // let zipCityStateID = this.qde.application.applicants[this.applicantIndex].officialCorrespondence.zipCityStateID
  
      // let zipId = zipCityStateID.split(',')[0];
      // let cityId = zipCityStateID.split(',')[1];
      // let stateId = zipCityStateID.split(',')[2];
  
      this.qde.application.applicants[this.applicantIndex].officialCorrespondence.addressLineOne = form.value.ofcA1;
      this.qde.application.applicants[this.applicantIndex].officialCorrespondence.addressLineTwo = form.value.ofcA2;
      this.qde.application.applicants[this.applicantIndex].officialCorrespondence.landMark = form.value.landMark;
      this.qde.application.applicants[this.applicantIndex].officialCorrespondence.zipcodeId = this.qde.application.applicants[this.applicantIndex].officialCorrespondence.zipcodeId;
      this.qde.application.applicants[this.applicantIndex].officialCorrespondence.cityId = this.qde.application.applicants[this.applicantIndex].officialCorrespondence.cityId;
      this.qde.application.applicants[this.applicantIndex].officialCorrespondence.stateId = this.qde.application.applicants[this.applicantIndex].officialCorrespondence.stateId;
      this.qde.application.applicants[this.applicantIndex].officialCorrespondence.officeNumber =form.value.stdCode + '-'+ form.value.offStdNumber;
      this.qde.application.applicants[this.applicantIndex].officialCorrespondence.officeEmailId =  form.value.officeEmail;
  
      console.log("submitOfficialCorrespondence: ", this.qde.application.applicants[this.applicantIndex].officialCorrespondence);
  
      this.createOrUpdatePersonalDetailsSub16 = this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
        // If successful
        if(response["ProcessVariables"]["status"]) {
          this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.applicantIndex]['applicantId']+"", this.page, this.tabName, screenPages['applicantDetails']).subscribe(auditRes => {
            if(auditRes['ProcessVariables']['status'] == true) {
              this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
              this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
              this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
              this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
            }
          });
          this.tabSwitch(9);
        } else {
          // Throw Invalid Pan Error
        }
      }, (error) => {
        console.log("response : ", error);
      });
    }
  }
  //-------------------------------------------------------------


  //-------------------------------------------------------------
  // Organization Details
  //-------------------------------------------------------------
  submitOrganizationDetails(form: NgForm) {
    if(this.isTBMLoggedIn) {
      this.tabSwitch(12);
    } else {
      if (form && !form.valid) {
        return;
      }
  
      console.log(form);
      this.qde.application.applicants[this.applicantIndex].organizationDetails.nameOfOrganization = form.value.orgName;
      this.qde.application.applicants[this.applicantIndex].organizationDetails.dateOfIncorporation = form.value.year.value+'-'+form.value.month.value+'-'+form.value.day.value;
      this.qde.application.applicants[this.applicantIndex].organizationDetails.constitution = form.value.constitution.value;
  
      console.log(this.qde.application.applicants[this.applicantIndex].organizationDetails);
  
      this.createOrUpdatePersonalDetailsSub17=this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
        // If successful
        if(response["ProcessVariables"]["status"]) {
          this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.applicantIndex]['applicantId']+"", this.page, this.tabName, screenPages['applicantDetails']).subscribe(auditRes => {
            if(auditRes['ProcessVariables']['status'] == true) {
              this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
              this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
              this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
              this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
            }
          });
          let result = this.parseJson(response["ProcessVariables"]["response"]);
          this.qdeHttp.duplicateApplicantCheck(this.qde.application.applicants[this.applicantIndex].applicantId).subscribe(res => {
            
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
          });
          // this.tabSwitch(12);
        
        } else {
          // Throw Invalid Pan Error
        }
      }, (error) => {
        console.log("response : ", error);
      });
    }
  }


  //-------------------------------------------------------------
  // Registered Address
  //-------------------------------------------------------------
  submitRegisteredAddress(form: NgForm) {
    if(this.isTBMLoggedIn) {
      this.tabSwitch(13);
    } else {
      if (form && !form.valid) {
        return;
      }
  
      console.log(">>>>", this.qde.application.applicants[this.applicantIndex].registeredAddress);

      // let zipCityStateID = this.qde.application.applicants[this.applicantIndex].registeredAddress.zipCityStateID
  
      // let zipId = zipCityStateID.split(',')[0] || "";
      // let cityId = zipCityStateID.split(',')[1] || "";
      // let stateId = zipCityStateID.split(',')[2] || "";

  
      // this.qde.application.applicants[this.applicantIndex].registeredAddress = {
      //   registeredAddress : form.value.regAdd,
      //   landMark : form.value.landmark,
      //   zipcodeId : this.qde.application.applicants[this.applicantIndex].registeredAddress.zipcodeId,
      //   cityId : this.qde.application.applicants[this.applicantIndex].registeredAddress.cityId,
      //   stateId : this.qde.application.applicants[this.applicantIndex].registeredAddress.stateId,
      // };

      this.qde.application.applicants[this.applicantIndex].registeredAddress.registeredAddress = form.value.regAdd;
      this.qde.application.applicants[this.applicantIndex].registeredAddress.landMark = form.value.landmark;
      this.qde.application.applicants[this.applicantIndex].registeredAddress.zipcodeId = this.qde.application.applicants[this.applicantIndex].registeredAddress.zipcodeId;
      this.qde.application.applicants[this.applicantIndex].registeredAddress.cityId = this.qde.application.applicants[this.applicantIndex].registeredAddress.cityId;
      this.qde.application.applicants[this.applicantIndex].registeredAddress.stateId = this.qde.application.applicants[this.applicantIndex].registeredAddress.stateId;
  
      console.log(this.qde.application.applicants[this.applicantIndex].registeredAddress);
  
      this.createOrUpdatePersonalDetailsSub18 = this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
  
        // If successfull
        if(response["ProcessVariables"]["status"]) {
          this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.applicantIndex]['applicantId']+"", this.page, this.tabName, screenPages['applicantDetails']).subscribe(auditRes => {
            if(auditRes['ProcessVariables']['status'] == true) {
              this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
              this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
              this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
              this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
            }
          });
          this.tabSwitch(13);
        } else {
          // Throw Invalid Pan Error
        }
      }, (error) => {
        console.log("response : ", error);
      });
    }
  }


  //-------------------------------------------------------------
  // Corporate Address
  //-------------------------------------------------------------
  submitCorporateAddress(form: NgForm) {
    if(this.isTBMLoggedIn) {
      this.tabSwitch(14);
    } else {
      if (form && !form.valid) {
        return;
      }
  
      // let zipCityStateID = this.qde.application.applicants[this.coApplicantIndex].corporateAddress.zipCityStateID
  
      // let zipId = zipCityStateID.split(',')[0] || "";
      // let cityId = zipCityStateID.split(',')[1] || "";
      // let stateId = zipCityStateID.split(',')[2] || "";
  
  
      this.qde.application.applicants[this.applicantIndex].corporateAddress.corporateAddress =  form.value.corpAddress;
      this.qde.application.applicants[this.applicantIndex].corporateAddress.landMark = form.value.landmark;
      this.qde.application.applicants[this.applicantIndex].corporateAddress.zipcodeId = this.qde.application.applicants[this.applicantIndex].corporateAddress.zipcodeId;
      this.qde.application.applicants[this.applicantIndex].corporateAddress.cityId =  this.qde.application.applicants[this.applicantIndex].corporateAddress.cityId;
      this.qde.application.applicants[this.applicantIndex].corporateAddress.stateId = this.qde.application.applicants[this.applicantIndex].corporateAddress.stateId;
  
      this.qde.application.applicants[this.applicantIndex].corporateAddress.stdNumber = form.value.stdNumber+"-"+form.value.phoneNumber;
      this.qde.application.applicants[this.applicantIndex].corporateAddress.officeEmailId = form.value.officeEmailId;
  
  
      console.log(this.qde.application.applicants[this.applicantIndex].corporateAddress);
  
      this.createOrUpdatePersonalDetailsSub19 = this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
        // If successfull
        if(response["ProcessVariables"]["status"]) {
          this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.applicantIndex]['applicantId']+"", this.page, this.tabName, screenPages['applicantDetails']).subscribe(auditRes => {
            if(auditRes['ProcessVariables']['status'] == true) {
              this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
              this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
              this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
              this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
            }
          });
          this.tabSwitch(14);
        } else {
          // Throw Invalid Pan Error
        }
      }, (error) => {
        console.log("response : ", error);
      });
    }
  }


  //-------------------------------------------------------------
  // Revenue Details
  //-------------------------------------------------------------
  submitRevenueDetails(form: NgForm) {
    if(this.isTBMLoggedIn) {
      this.tabSwitch(15);
    } else {
      if (form && !form.valid) {
        return;
      }
  
  
      this.qde.application.applicants[this.applicantIndex].revenueDetails.revenue = parseInt(form.value.revenue);
      this.qde.application.applicants[this.applicantIndex].revenueDetails.annualNetIncome = parseInt(form.value.annualNetIncome);
      this.qde.application.applicants[this.applicantIndex].revenueDetails.grossTurnOver = parseInt(form.value.grossTurnOver);
  
      console.log(this.qde.application.applicants[this.applicantIndex].revenueDetails);
  
      this.createOrUpdatePersonalDetailsSub20 = this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
        // If successfull
        if(response["ProcessVariables"]["status"]) {
          this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.applicantIndex]['applicantId']+"", this.page, this.tabName, screenPages['applicantDetails']).subscribe(auditRes => {
            if(auditRes['ProcessVariables']['status'] == true) {
              this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
              this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
              this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
              this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
            }
          });
          this.tabSwitch(15);
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

  submitAnnualFamilyIncome(form: NgForm) {
    if(this.isTBMLoggedIn) {
      this.router.navigate(['/applicant', this.qde.application.applicants[this.applicantIndex].applicantId, 'co-applicant']);
    } else {
      if (form && !form.valid) {
        return;
      }
  
      this.qde.application.applicants[this.applicantIndex].incomeDetails.annualFamilyIncome = form.value.annualFamilyIncome ? form.value.annualFamilyIncome: "";
      this.qde.application.applicants[this.applicantIndex].incomeDetails.monthlyExpenditure = form.value.monthlyExpenditure ? form.value.monthlyExpenditure: "";
  
      // this.qde.application.applicants[this.applicantIndex].incomeDetails.incomeConsider = form.value.incomeConsider;
      // this.qde.application.applicants[this.applicantIndex].incomeDetails.monthlyIncome = form.value.monthlyIncome;
      // this.qde.application.applicants[this.applicantIndex].incomeDetails.assessmentMethodology = form.value.assessmentMethodology;
  
      console.log("INCOME DETAILS: ", this.qde.application.applicants[this.applicantIndex].incomeDetails);
  
      this.createOrUpdatePersonalDetailsSub21 = this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
        // If successfull
        if(response["ProcessVariables"]["status"]) {
          this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.applicantIndex]['applicantId']+"", this.page, this.tabName, screenPages['applicantDetails']).subscribe(auditRes => {
            if(auditRes['ProcessVariables']['status'] == true) {
              this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
              this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
              this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
              this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
            }
          });
          
          // Show Proceed Modal
          this.isApplicantRouteModal = true;
        } else {
          // Throw Invalid Pan Error
        }
      }, (error) => {
        console.log("response : ", error);
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
  
      this.qde.application.applicants[this.applicantIndex].incomeDetails.monthlyIncome = form.value.monthlyIncome;
      this.qde.application.applicants[this.applicantIndex].incomeDetails.assessmentMethodology = this.selectedAssesmentMethodology['value'];
  
      console.log("ID: ", this.qde.application.applicants[this.applicantIndex].incomeDetails);
  
      this.createOrUpdatePersonalDetailsSub22 = this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
        // If successfull
        if(response["ProcessVariables"]["status"]) {
          this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.applicantIndex]['applicantId']+"", this.page, this.tabName, screenPages['applicantDetails']).subscribe(auditRes => {
            if(auditRes['ProcessVariables']['status'] == true) {
              this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
              this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
              this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
              this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
            }
          });
          this.isApplicantRouteModal = true;
          // this.router.navigate(['/applicant', this.qde.application.applicationId, 'co-applicant'], {fragment: 'dashboard'} );
          this.goToNextSlide(swiperInstance);
        } else {
          // Throw Invalid Pan Error
        }
      }, (error) => {
        console.log("response : ", error);
      });
  
    }
  }

  submitMonthlyIncomeNonIndividual(form: NgForm, swiperInstance ?: Swiper) {
    if(this.isTBMLoggedIn) {
      this.router.navigate(['/applicant', this.qde.application.applicants[this.applicantIndex].applicantId, 'co-applicant'], {queryParams: {tabName: 'dashboard', page: 1}})
    } else {
      if (form && !form.valid) {
        return;
      }
  
      this.qde.application.applicants[this.applicantIndex].incomeDetails.monthlyIncome = form.value.monthlyIncome;
      this.qde.application.applicants[this.applicantIndex].incomeDetails.assessmentMethodology = this.selectedAssesmentMethodology['value'];
  
      console.log("ID: ", this.qde.application.applicants[this.applicantIndex].incomeDetails);
  
      this.createOrUpdatePersonalDetailsSub22 = this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
        // If successfull
        if(response["ProcessVariables"]["status"]) {
          this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.applicantIndex]['applicantId']+"", this.page, this.tabName, screenPages['applicantDetails']).subscribe(auditRes => {
            if(auditRes['ProcessVariables']['status'] == true) {
              this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
              this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
              this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
              this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
            }
          });
          this.isApplicantRouteModal = true;
          // alert("Applicant's application successfully submitted");
          // this.router.navigate(['/applicant', this.qde.application.applicationId, 'co-applicant'], {fragment: 'dashboard'} );
          this.goToNextSlide(swiperInstance);
        } else {
          // Throw Invalid Pan Error
        }
      }, (error) => {
        console.log("response : ", error);
      });
  
    }
  }

  selectPuccaHouse(value) {
    this.qde.application.applicants[this.applicantIndex].incomeDetails.puccaHouse = (value == 1) ? true: false;
  }

  selectPension(value) {
    this.qde.application.applicants[this.applicantIndex].occupation.pensioner = (value == 1) ? true: false;
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
      this.goToNextSlide(swiperInstance);
      this.qde.application.applicants[this.applicantIndex].isIndividual = true;
    } else {
      this.qde.application.applicants[this.applicantIndex].isIndividual = false;
      this.router.navigate([], {queryParams: { tabName: this.fragments[10], page: 1}});
    }
  }

  changeResidentialNon(value, swiperInstance ?: Swiper) {
    this.qde.application.applicants[this.applicantIndex].personalDetails.applicantStatus = value;
    
    // Make API Request to save that is submitpersonaldetails

  }


  counter(size): Array<number> {
    return new Array(size);
  }

  incomeConsiderYesNoIndividual(value, swiperInstance ?: Swiper) {
    if(this.isTBMLoggedIn) {
      if(this.qde.application.applicants[this.applicantIndex].incomeDetails.incomeConsider) {
        this.tabSwitch(8);
      } else {
        this.tabSwitch(9);
      }
    } else {
      this.qde.application.applicants[this.applicantIndex].incomeDetails.incomeConsider = (value == 1) ? true : false;
  
      this.createOrUpdatePersonalDetailsSub23 = this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
        // If successfull
        if(response["ProcessVariables"]["status"]) {
          this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.applicantIndex]['applicantId']+"", this.page, this.tabName, screenPages['applicantDetails']).subscribe(auditRes => {
            if(auditRes['ProcessVariables']['status'] == true) {
              this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
              this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
              this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
              this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
            }
          });
          
          if(this.qde.application.applicants[this.applicantIndex].incomeDetails.incomeConsider) {
            this.tabSwitch(8);
          } else {
            this.tabSwitch(9);
          }
        } else {
          // Throw Invalid Pan Error
        }
      }, (error) => {
        console.log("response : ", error);
      });
    }
  }

  incomeConsiderYesNoNonIndividual(value, swiperInstance ?: Swiper) {
    if(this.isTBMLoggedIn) {
      if(value == 1) {
        this.goToNextSlide(swiperInstance);
      } 
      else if(value == 2) {
        this.isApplicantRouteModal = true;
      }
      this.goToNextSlide(swiperInstance);
    } else {
      this.qde.application.applicants[this.applicantIndex].incomeDetails.incomeConsider = (value == 1) ? true : false;

      console.log(">>>", this.qde.application.applicants[this.applicantIndex].incomeDetails);
  
      this.createOrUpdatePersonalDetailsSub23 = this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
        // If successfull
        if(response["ProcessVariables"]["status"]) {
          this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.applicantIndex]['applicantId']+"", this.page, this.tabName, screenPages['applicantDetails']).subscribe(auditRes => {
            if(auditRes['ProcessVariables']['status'] == true) {
              this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
              this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
              this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
              this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
            }
          });
          if(value == 1) {
            this.goToNextSlide(swiperInstance);
          } 
          else if(value == 2) {
            this.isApplicantRouteModal = true;
          }
        } else {
          // Throw Invalid Pan Error
        }
      }, (error) => {
        console.log("response : ", error);
      });
    }
  }

  // doHoldPuccaHouse(value) {
  //   this.qde.application.applicants[this.applicantIndex].incomeDetails = {
  //     puccaHouse : value,
  //   };

  //   console.log(this.qde.application.applicants[this.applicantIndex].incomeDetails);

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

  selectValueChanged(event, to) {
    let whichSelectQde = this.qde.application.applicants[this.applicantIndex];
    let nick = to.getAttribute('nick').split(".");
    to.getAttribute('nick').split(".").forEach((val, i) => {
      if(val == 'day' || val == 'month' || val == 'year') {
        this[(nick[i-1])][val].value = event.value;
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


  inOTP: boolean = false;

  isAlternateStatus:boolean = false;

  submitOTP(form: NgForm, isAlternateNumber) {
    console.log("Towards OTP");
    
    const mobileNumber = form.value.mobileNumber;
    const emailId = form.value.preferEmailId;    
    const isValidMobile = this.RegExp(this.regexPattern.mobileNumber).test(mobileNumber);
    const isValidEmailID = this.RegExp(this.regexPattern.email).test(emailId);

    if(isValidMobile && isValidEmailID) {
      this.qde.application.applicants[this.applicantIndex].contactDetails.mobileNumber = mobileNumber;
      this.qde.application.applicants[this.applicantIndex].contactDetails.preferredEmailId = emailId;
      const applicationId = this.qde.application.applicationId;
      const applicantId = this.qde.application.applicants[this.applicantIndex].applicantId;
      this.sendOTPAPISub = this.qdeHttp.sendOTPAPI(mobileNumber, applicantId, applicationId, isAlternateNumber, emailId).subscribe(res => {
        if(res['ProcessVariables']['status'] == true) {
          this.inOTP = true;
          this.isAlternateStatus = isAlternateNumber;
        }
       });
       this.timeout();
    } else {
      alert("Email id and Mobile number is mandatory for verification");
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
    this.stopInterval();
    const mobileNumber = this.qde.application.applicants[this.applicantIndex].contactDetails.mobileNumber ;
    const applicationId = this.qde.application.applicationId;
    const applicantId = this.qde.application.applicants[this.applicantIndex].applicantId;
    const emailId = this.qde.application.applicants[this.applicantIndex].contactDetails.preferredEmailId;
    this.sendOTPAPISub = this.qdeHttp.sendOTPAPI(mobileNumber, applicantId, applicationId, false, emailId).subscribe(res => {
      if(res['ProcessVariables']['status'] == true) {
        this.inOTP = true;
        this.isAlternateStatus =  false;
      }
     });
     this.timeout();
  }

  onBackOTP() {
    console.log("Back button pressed")
    this.inOTP = false;
    this.stopInterval(); 
  }

  validateOTP(form: NgForm) {
    console.log("Payment gateway");
    const mobileNumber = this.qde.application.applicants[this.applicantIndex].contactDetails.mobileNumber;
    const applicantId = this.qde.application.applicants[this.applicantIndex].applicantId;
    const applicationId = this.qde.application.applicationId;

    const otp = form.value.otp;

    this.validateOTPAPISub = this.qdeHttp.validateOTPAPI(mobileNumber, applicantId, applicationId, otp, this.isAlternateStatus).subscribe(res => {
      // if(res['ProcessVariables']['isPaymentSuccessful'] == true) {
      //   this.showSuccessModal = true;
      //   this.emiAmount = res['ProcessVariables']['emi'];
      //   this.eligibleAmount = res['ProcessVariables']['eligibilityAmount'];
      // }
      // else if(res['ProcessVariables']['isPaymentSuccessful'] == false) {
      //   this.showErrorModal = true;
     // }
      if(res['ProcessVariables']['status'] == true) {
        this.otp = "";
        alert("OTP verified successfully");
        if(this.isAlternateStatus) {
          this.qde.application.applicants[this.applicantIndex].contactDetails.isAlternateOTPverified = true;
        }else {
          this.qde.application.applicants[this.applicantIndex].contactDetails.isMobileOTPverified = true;
        }
        this.onBackOTP();
      }else {
        alert("Enter valid OTP");
      }
     });
  }

  changeApplicantStatus(value, swiperInstance ?: Swiper) {
    if(!this.isTBMLoggedIn) {
      if(value == 1) {
        this.qde.application.applicants[this.applicantIndex].personalDetails.applicantStatus = "1";
      } else {
        this.qde.application.applicants[this.applicantIndex].personalDetails.applicantStatus = "2";
      }
    }
    this.goToNextSlide(swiperInstance);
  }



  initializeVariables() {
    this.residenceNumberStdCode = this.qde.application.applicants[this.applicantIndex].contactDetails.residenceNumber != "" ? this.qde.application.applicants[this.applicantIndex].contactDetails.residenceNumber.split("-")[0] : "";
    this.residenceNumberPhoneNumber = this.qde.application.applicants[this.applicantIndex].contactDetails.residenceNumber != "" ? this.qde.application.applicants[this.applicantIndex].contactDetails.residenceNumber.split("-")[1] : "";

    this.alternateResidenceNumberStdCode = this.qde.application.applicants[this.applicantIndex].contactDetails.alternateResidenceNumber != "" ? this.qde.application.applicants[this.applicantIndex].contactDetails.alternateResidenceNumber.split("-")[0] : "";
    this.alternateResidenceNumberPhoneNumber = this.qde.application.applicants[this.applicantIndex].contactDetails.alternateResidenceNumber != "" ? this.qde.application.applicants[this.applicantIndex].contactDetails.alternateResidenceNumber.split("-")[1] : "";
    this.addressCityState = this.qde.application.applicants[this.applicantIndex].communicationAddress.city + '/'+ this.qde.application.applicants[this.applicantIndex].communicationAddress.state;

    this.otherReligion = this.qde.application.applicants[this.applicantIndex].other.religion == '6' ? this.qde.application.applicants[this.applicantIndex].other.religion : '';

    this.registeredAddressCityState = this.qde.application.applicants[this.applicantIndex].registeredAddress.city +'/'+ this.qde.application.applicants[this.applicantIndex].registeredAddress.state;
    this.corporateAddressCityState = this.qde.application.applicants[this.applicantIndex].corporateAddress.city +'-'+ this.qde.application.applicants[this.applicantIndex].corporateAddress.state;
    this.corporateAddressStdCode = this.qde.application.applicants[this.applicantIndex].corporateAddress.stdNumber != "" ? this.qde.application.applicants[this.applicantIndex].corporateAddress.stdNumber.split("-")[0] : "";
    this.corporateAddressPhoneNumber = this.qde.application.applicants[this.applicantIndex].corporateAddress.stdNumber != "" ? this.qde.application.applicants[this.applicantIndex].corporateAddress.stdNumber.split("-")[1] : "";
    this.officialCorrespondenceStdCode = this.qde.application.applicants[this.applicantIndex].officialCorrespondence.officeNumber != "" ? this.qde.application.applicants[this.applicantIndex].officialCorrespondence.officeNumber.split("-")[0] : "";
    this.officialCorrespondencePhoneNumber = this.qde.application.applicants[this.applicantIndex].officialCorrespondence.officeNumber != "" ? this.qde.application.applicants[this.applicantIndex].officialCorrespondence.officeNumber.split("-")[1] : "";

    this.isAlternateEmailId = this.qde.application.applicants[this.applicantIndex].contactDetails.alternateEmailId != "" ? true : false;
    this.isAlternateMobileNumber = this.qde.application.applicants[this.applicantIndex].contactDetails.alternateMobileNumber != null ? true : false;
    this.isAlternateResidenceNumber = this.qde.application.applicants[this.applicantIndex].contactDetails.alternateResidenceNumber != "" ? true : false;
  
  
  }

  makePermanentAddressSame(event: boolean) {
    this.qde.application.applicants[this.applicantIndex].communicationAddress.permanentAddress = event;

    if(event == true) {
      this.qde.application.applicants[this.applicantIndex].permanentAddress.addressLineOne = this.qde.application.applicants[this.applicantIndex].communicationAddress.addressLineOne;
      this.qde.application.applicants[this.applicantIndex].permanentAddress.addressLineTwo = this.qde.application.applicants[this.applicantIndex].communicationAddress.addressLineTwo;
      this.qde.application.applicants[this.applicantIndex].permanentAddress.zipcode = this.qde.application.applicants[this.applicantIndex].communicationAddress.zipcode;
   
      this.qde.application.applicants[this.applicantIndex].permanentAddress.city = this.qde.application.applicants[this.applicantIndex].communicationAddress.city;
      this.qde.application.applicants[this.applicantIndex].permanentAddress.state = this.qde.application.applicants[this.applicantIndex].communicationAddress.state;
      this.qde.application.applicants[this.applicantIndex].permanentAddress.cityState = this.qde.application.applicants[this.applicantIndex].communicationAddress.cityState;
      this.qde.application.applicants[this.applicantIndex].permanentAddress.zipcodeId = this.qde.application.applicants[this.applicantIndex].communicationAddress.zipcodeId;
      this.qde.application.applicants[this.applicantIndex].permanentAddress.stateId = this.qde.application.applicants[this.applicantIndex].communicationAddress.stateId;
      this.qde.application.applicants[this.applicantIndex].permanentAddress.cityId = this.qde.application.applicants[this.applicantIndex].communicationAddress.cityId;

   
    } else {
      this.qde.application.applicants[this.applicantIndex].permanentAddress.addressLineOne = "";
      this.qde.application.applicants[this.applicantIndex].permanentAddress.addressLineTwo = "";
      this.qde.application.applicants[this.applicantIndex].permanentAddress.zipcode = "";
      this.qde.application.applicants[this.applicantIndex].permanentAddress.cityState = "";
      this.qde.application.applicants[this.applicantIndex].permanentAddress.stateId = "";
      this.qde.application.applicants[this.applicantIndex].permanentAddress.zipcodeId = "";
      this.qde.application.applicants[this.applicantIndex].permanentAddress.city = "";
      this.qde.application.applicants[this.applicantIndex].permanentAddress.cityId = "";
      this.qde.application.applicants[this.applicantIndex].permanentAddress.state = "";
    }
  }

  makeCorporateAddressSame(event: boolean) {
    this.qde.application.applicants[this.applicantIndex].registeredAddress.corporateAddress = event;

    if(event == true) {
      this.qde.application.applicants[this.applicantIndex].corporateAddress.corporateAddress = this.qde.application.applicants[this.applicantIndex].registeredAddress.registeredAddress;
      this.qde.application.applicants[this.applicantIndex].corporateAddress.landMark = this.qde.application.applicants[this.applicantIndex].registeredAddress.landMark;
      this.qde.application.applicants[this.applicantIndex].corporateAddress.zipcode = this.qde.application.applicants[this.applicantIndex].registeredAddress.zipcode;
   
      this.qde.application.applicants[this.applicantIndex].corporateAddress.city = this.qde.application.applicants[this.applicantIndex].registeredAddress.city;
      this.qde.application.applicants[this.applicantIndex].corporateAddress.state = this.qde.application.applicants[this.applicantIndex].registeredAddress.state;
      this.qde.application.applicants[this.applicantIndex].corporateAddress.cityState = this.qde.application.applicants[this.applicantIndex].registeredAddress.cityState;
      this.qde.application.applicants[this.applicantIndex].corporateAddress.zipcodeId = this.qde.application.applicants[this.applicantIndex].registeredAddress.zipcodeId;
      this.qde.application.applicants[this.applicantIndex].corporateAddress.stateId = this.qde.application.applicants[this.applicantIndex].registeredAddress.stateId;
      this.qde.application.applicants[this.applicantIndex].corporateAddress.cityId = this.qde.application.applicants[this.applicantIndex].registeredAddress.cityId;

   
    } else {
      this.qde.application.applicants[this.applicantIndex].corporateAddress.corporateAddress = "";
      this.qde.application.applicants[this.applicantIndex].corporateAddress.zipcode = "";
      this.qde.application.applicants[this.applicantIndex].corporateAddress.cityState = "";
      this.qde.application.applicants[this.applicantIndex].corporateAddress.stateId = "";
      this.qde.application.applicants[this.applicantIndex].corporateAddress.zipcodeId = "";
      this.qde.application.applicants[this.applicantIndex].corporateAddress.city = "";
      this.qde.application.applicants[this.applicantIndex].corporateAddress.cityId = "";
      this.qde.application.applicants[this.applicantIndex].corporateAddress.state = "";
    }
  }

  commZipcodeFocusout($event: any ) {
    //call API
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

  expError =false;
  checkOccupationDetailsYears(event: any) {
    console.log("numberOfYearsInCurrentCompany: ", this.qde.application.applicants[this.applicantIndex].occupation.numberOfYearsInCurrentCompany);
    console.log("totalWorkExperience: ", this.qde.application.applicants[this.applicantIndex].occupation.totalWorkExperience);
    if(this.qde.application.applicants[this.applicantIndex].occupation.numberOfYearsInCurrentCompany <= this.qde.application.applicants[this.applicantIndex].occupation.totalWorkExperience) {
      // Next button should be enabled
      this.expError = false;
    } else {
      this.expError = true;
    }
  }

  ngOnDestroy() {
    if(this.swiperSlidersSub != null) {
      this.swiperSlidersSub.unsubscribe();
    }
    // if(this.panslideSub != null){
    // this.panslideSub.unsubscribe();
    // }
    // if(this.panslideSub2 != null){
    // this.panslide2Sub.unsubscribe();
    // }
    if(this.qdeSourceSub != null){
    this.qdeSourceSub.unsubscribe();
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
      if(this.createOrUpdatePanDetailsSub3 != null){
        this.createOrUpdatePanDetailsSub3.unsubscribe();
        }
        
    if(this.isEligibilityForReviewsSub != null) {
      this.isEligibilityForReviewsSub.unsubscribe();
    }

    if(this.auditTrialApiSub != null) {
      this.auditTrialApiSub.unsubscribe();
    }
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

    let fileName = this.qde.application.applicationId + "-" + this.qde.application.applicants[this.applicantIndex].applicantId + "-" + new Date().getTime()

    this.qdeHttp.uploadFile(fileName, image).then((data) => {
      
      if(data["responseCode"] == 200) {

        var result = JSON.parse(data["response"]);

        var imageId = result.info.id;

        console.log("imageId",imageId);

        this.qde.application.applicants[this.applicantIndex].pan.imageId = imageId;

        this.createOrUpdatePanDetailsSub3 = this.qdeHttp.createOrUpdatePanDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
          // If successful
          if(response["ProcessVariables"]["status"] == true) {
            // alert("Switch to tab 1");
            this.tabSwitch(1);
          }
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

    console.log("imageId", this.qde.application.applicants[this.applicantIndex].pan.imageId);

    if (this.qde.application.applicants[this.applicantIndex].pan.imageId != null) {
      if(isIndividual) {
        this.tabSwitch(1);
      }else {
        this.tabSwitch(11);
      }
      return;
    }else {  /* Need to remove the else block once imageid is saved in back-end */
      if(isIndividual) {
        this.tabSwitch(1);
      }else {
        this.tabSwitch(11);
      }
    }


    let modifiedFile = Object.defineProperty(this.idPanDoc, "name", {
      writable: true,
      value: this.idPanDoc["name"]
    });

    modifiedFile["name"] = this.qde.application.applicationId + "-" + this.qde.application.applicants[this.applicantIndex].applicantId + "-" + new Date().getTime() + "-" + modifiedFile["name"];


    this.qdeHttp.uploadToAppiyoDrive(modifiedFile).subscribe(
      response => {
        if (response["ok"]) {
          //this.progress = Math.round(100 * event.loaded / event.total);
          console.log(response);
          let info = response["info"];
          const documentId = info["id"];
          
          console.log("imageId",documentId);

          this.qde.application.applicants[this.applicantIndex].pan.imageId = documentId;

          this.qdeHttp.createOrUpdatePanDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
            // If successful
            if(response["ProcessVariables"]["status"] == true) {
              if(isIndividual) {
                this.tabSwitch(1);
              }else {
                this.tabSwitch(11);
              }
            }
          });

        } else {
          console.log(response["ErrorMessage"]);
        }
      },
      error => {
        console.log("Error : ", error);
      }
    );

  }


  openDuplicateModal() {
    this.isDuplicateModalShown = true;
  }

  onCrossModal(){
    this.isApplicantRouteModal = false;
    this.isApplicantPinModal = false;
  }

  closeDuplicateModal() {
    this.isDuplicateModalShown = false;
    if(this.qde.application.applicants[this.applicantIndex].isIndividual == true) {
      this.tabSwitch(2);
    } else {
      this.tabSwitch(12);
    }
  }

  submitDuplicateApplicant(form: NgForm) {
    let tempApplicant = this.qde.application.applicants[this.applicantIndex];
    let newApplicantToBeReplaced = this.duplicates.find(e => e.applicantId == form.value.selectDuplicateApplicant);
    this.qde.application.applicants[this.applicantIndex] = this.qdeService.getModifiedObject(tempApplicant, newApplicantToBeReplaced);
    this.qde.application.applicants[this.applicantIndex].applicantId = tempApplicant.applicantId;
    this.qde.application.applicants[this.applicantIndex].isMainApplicant = tempApplicant.isMainApplicant;
    this.qdeService.setQde(this.qde);

    this.createOrUpdatePersonalDetailsSub5=this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
      // If successful
      if(response["ProcessVariables"]["status"]) {
        this.closeDuplicateModal();
      }
    });
  }

  // @ViewChild('commSlider') commSlider: ElementRef;

  commSliderChanged(event) {
    // console.log('COMMSLIDER:', this.commSlider);
    // this.commSlider.nativeElement.querySelector('.ng5-slider-span.ng5-slider-bubble.ng5-slider-model-value').innerHTML = event+'y';
  }

  RegExp(param) {
    return RegExp(param);
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

  goToExactPageAndTab(tabPage: string, pageNumber: number) {
    let index = this.fragments.findIndex(v => v == tabPage) != -1 ? this.fragments.findIndex(v => v == tabPage) : 0;
    this.tabName = tabPage;
    this.page = pageNumber;
    this.tabSwitch(index, true);
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

}
