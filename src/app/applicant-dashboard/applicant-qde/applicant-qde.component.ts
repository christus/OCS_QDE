import { Other, Applicant, Occupation } from './../../models/qde.model';
import { Component, OnInit, ViewChild, ElementRef, Renderer2, OnDestroy, AfterViewInit, ViewChildren, QueryList } from '@angular/core';

import * as Swiper from 'swiper/dist/js/swiper.js';
// import { Select2Component } from 'ng2-select2';
import { ActivatedRoute, Router } from '@angular/router';

import { Options } from 'ng5-slider';
import { NgForm, FormArray } from '@angular/forms';

import Qde from 'src/app/models/qde.model';
import { QdeHttpService } from 'src/app/services/qde-http.service';
import { QdeService } from 'src/app/services/qde.service';
import { CommonDataService } from '../../services/common-data.service';
import { Subscription, merge } from 'rxjs';
import { errors } from '../../services/errors';
import { MenubarHeaderComponent } from '../../menubar-header/menubar-header.component';
import { environment } from 'src/environments/environment';

import { File } from '@ionic-native/file/ngx';

import { screenPages } from '../../app.constants';
import { UtilService } from '../../services/util.service';
import { MobileService } from '../../services/mobile-constant.service';
import { DatePipe } from '@angular/common';
import { NgxUiLoaderService } from 'ngx-ui-loader';

interface Item {
  key: string,
  value: number | string
}
interface MinMax {
  minValue: string,
  maxValue: string,
  maxLength: string
}
@Component({
  selector: 'app-applicant-qde',
  templateUrl: './applicant-qde.component.html',
  styleUrls: ['./applicant-qde.component.css']
})
export class ApplicantQdeComponent implements OnInit, OnDestroy, AfterViewInit {

  isMobile: any;
  isOtpVerified
  capacitor = {
    DEBUG: false
  };

  readonly errors = errors;

  // regexPatternForDocType: Array<string> = ['[A-Z]{1}[0-9]{7}','^[A-Z]{2}[0-9]{13}$','^[A-Z]{3}[0-9]{7}$','[2-9]{1}[0-9]{11}','[0-9]{18}','[0-9]{14}','[0-9]{16}'];

  regexPatternForDocType: Array<any> = [{ pattern: '^$', hint: "Should not be empty" },
                                        { pattern: '[A-Z]{1}[0-9]{7}', hint: "V1234567" },
                                        { pattern: '^[A-Z]{2}[0-9]{13}$', hint: "AN0120100051926" },
                                        { pattern: '^[A-Z]{3}[0-9]{7}$', hint: "LWN5672084" },
                                        { pattern: '[2-9]{1}[0-9]{11}', hint: "12 digit number, with first digit should not 0 or 1" },
                                        { pattern: '[0-9]{18}', hint: "	18 digit number" },
                                        { pattern: '[0-9]{14}', hint: "	14 digit number" },
                                        { pattern: '[0-9]{16}', hint: "	16 digit number" }];

  maxlength: Array<string> = ['2','8', '15', '10', '12', '18', '14', '16'];

  panImage: String;

  imageURI: String;
  isPermanentAddressSame: boolean = false;

  isTabDisabled: boolean;
  docName: boolean;
// name: "^[0-9A-Za-z ]{0,99}$"  // for only allow alpha
  regexPattern = {
    appRefNo: "^[A-Za-z0-9]+$",
    stdCode: "^[0][0-9]*$",
    mobileNumber: "^[1-9][0-9]*$",
    name: "^[0-9A-Za-z, _&*#'/\\-@]{0,99}$",
    organizationName: "^[0-9A-Za-z, _&*#'/\\-@]{0,99}$",
    birthPlace: "^[A-Za-z ]{0,99}$",
    address: "^[0-9A-Za-z, _&*#'/\\-]{0,99}$",
    landmark: "^[0-9A-Za-z, _&*#'/\\-]{0,99}$",
    // cityState:"^[0-9A-Za-z, &'#]$",
    pinCode: "^[1-9][0-9]{5}$",
    otp: "^[0-9]+$",
    panInd: "[A-Z]{3}(P)[A-Z]{1}[0-9]{4}[A-Z]{1}",
    panNonInd: "[A-Z]{5}[0-9]{4}[A-Z]{1}",
    // amount:"[0-9]{0,17}\.[0-9]{1,4}?$",
    sliderValue: "[0-9]{0,2}",
    amount: "^[1-9][\\d]{0,15}([.][0-9]{0,4})?",
    email: "^\\w+([\.-]?\\w+)*@\\w+([\.-]?\\w+)*(\\.\\w{2,10})+$",
    revenue: "^[1-9][\\d]{0,18}([.][0-9]{0,4})?",
    sameDigit: '^0{6,10}|1{6,10}|2{6,10}|3{6,10}|4{6,10}|5{6,10}|6{6,10}|7{6,10}|8{6,10}|9{6,10}$',
    sameDigitStd:'^0{2,10}|1{4,10}|2{4,10}|3{4,10}|4{4,10}|5{4,10}|6{4,10}|7{4,10}|8{4,10}|9{4,10}$',
    // revenue:"^[\\d]{0,14}([.][0-9]{0,4})?"

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
      return sliderVal + '<b>y</b>';
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
      return sliderVal + '<b>y</b>';
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
      return sliderVal + '<b>y</b>';
    }
  };
  familyOptions: Options = {
    floor: 0,
    ceil: 20,
    // step: 1,
    // showTicksValues: false,
    // // showSelectionBar: true,
    // showTicks: true,
    getLegend: (sliderVal: number): string => {
      return sliderVal + '<b></b>';
    }
  };

  imageUrl: string = "appiyo/d/drive/upload/";

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
  dob: { day: Item, month: Item, year: Item } = { day: { key: "DD", value: "DD" }, month: { key: "MM", value: "MM" }, year: { key: "YYYY", value: "YYYY" } };
  residenceNumberStdCode: string = "";
  residenceNumberPhoneNumber: string = "";
  alternateResidenceNumberStdCode: string = ""
  alternateResidenceNumberPhoneNumber: string = ""
  addressCityState: string = "";
  otherReligion: string = "";
  organizationDetails: { day: Item, month: Item, year: Item } = { day: { key: "DD", value: "DD" }, month: { key: "MM", value: "MM" }, year: { key: "YYYY", value: "YYYY" } };
  officialNumberStdCode: string = "";
  officialNumberPhoneNumber: string = "";
  dateOfIncorporation: { day: Item, month: Item, year: Item } = { day: { key: "DD", value: "DD" }, month: { key: "MM", value: "MM" }, year: { key: "YYYY", value: "YYYY" } };
  registeredAddressCityState: string = "";
  corporateAddressCityState: string = "";
  corporateAddressStdCode = "";
  corporateAddressPhoneNumber = "";
  officialCorrespondenceStdCode: string = "";
  officialCorrespondencePhoneNumber: string = "";

  preferedMailingAddress: boolean = true;

  commCityState: string = "";
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

  isIndividual: boolean = false;
  YYYY: number = new Date().getFullYear();

  dateofBirthKendo:Date;
  focusedDate: Date;

  applicantStatus: string = "";

  fragments = ['pan1',
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
  femaleTitles: Array<Item>;
  mariedFemaleTitle: Array<Item>;
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
  preferredEmail: Array<Item>;


  selectedDocType: Item;
  selectedConstitutions: Item;

  docType: Array<any>;
  // selectedAssesmentMethodology: Array<any>;
  selectedAssesmentMethodology: Item;

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

  otp: string;
  spouseTitles: Array<any>;

  idPanDocumnetType: any;
  idPanFileName: string;
  idPanFileSize: string;
  idPanId: string;
  idPanDoc: File;

  isDisabled: boolean = false;
  interval;
  timeLeft: number = 180;
  isOTPExpired: boolean = false;
  isOTPEmpty: boolean = true;

  isReadOnly: boolean = false;
  isEligibilityForReview: boolean = false;
  isEligibilityForReviewsSub: Subscription;
  isTBMLoggedIn: boolean;
  isApplicantRouteModal: boolean = false;

  isApplicantPinModal: boolean = false;
  isWrongPinButtonDisabled: boolean = true;

  isDuplicateModalShown: boolean = false;
  duplicates: Array<Applicant> = [];
  dobYears: Array<Item>;
  YYYY17YearsAgo = (new Date().getFullYear() - 18);
  isValidPan: boolean;
  tempOldPanNumber: string;
  monthsInChar: Array<string> = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

  // RHS Sliders
  @ViewChildren('swiperS') swiperS$: QueryList<Swiper>;

  // LHS Sliders
  @ViewChildren('lhsSwiperS') lhsSwiperS$: QueryList<Swiper>;

  tabName: string;
  page: number;
  auditTrialApiSub: Subscription;
  swiperSliders: Array<Swiper> = [];
  swiperSlidersSub: Subscription;

  isErrorModal: boolean;
  errorMessage: string;
  isOfficialCorrs: boolean;

  applicantType: string;
  occupationRequired: boolean = true;


  ageError:boolean = false;
  ageMaxError: boolean = false;

  min: Date; // minimum date to date of birth
  maxDate : Date = new Date();

  public defaultItem = environment.defaultItem;
  lhsSwiperSliders: Array<Swiper> = [];
  swiperSlidersSub2: Subscription;

  isLessAmount: boolean ;
  requirMinAmout ;
  isMaxAmount: boolean;
  requirMaxAmout;

  isNumberLessThan1k: boolean;
  isNumberMoreThan100cr: boolean;
  minMaxValues: Array<MinMax>;
  tabHide: boolean;
  branchID: string = null;  
    
  constructor(private renderer: Renderer2,
    private route: ActivatedRoute,
    private router: Router,
    private qdeHttp: QdeHttpService,
    private qdeService: QdeService,
    private cds: CommonDataService,
    private utilService: UtilService,
    private file: File,
    public datepipe: DatePipe,
    private mobileService: MobileService,
    private ngxService: NgxUiLoaderService) {

    this.qde = this.qdeService.defaultValue;

    this.qdeService.resetQde();
    this.tabName = this.fragments[0];
    this.page = 1;

   

    this.dobYears = Array.from(Array(100).keys()).map((val, index) => {
      let v = (this.YYYY17YearsAgo - index) + "";
      return { key: v, value: v };
    });
    this.dobYears.unshift({ key: 'YYYY', value: 'YYYY' });

    this.isMobile = this.mobileService.isMobile;
    this.cds.changeMenuBarShown(true);
    this.cds.changeViewFormVisible(true);
    this.cds.changeLogoutVisible(true);
    this.cds.changeHomeVisible(true);
    this.cds.changeViewFormNameVisible(true);
    this.contactExtraFieldRemoval();

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
    //     //     this.goToExactPageAndTab(0, 1);
    //     //     this.panSlider2.setIndex(1);
    //     //   }
    //     // } else if(this.qde.application.applicants[this.applicantIndex].isIndividual == false) {
    //     //   if(localFragment == 'pan2') {
    //     //     this.goToExactPageAndTab(1, 1);
    //     //   }
    //     // }

    //     this.activeTab = this.fragments.indexOf(localFragment);
    //     this.goToExactPageAndTab(this.a1tiveTab, 0);
    //     this.applicantIndividual = (this.activeTab >= 10) ? false: true;
    //   }
    // });


    this.qdeSourceSub = this.qdeService.qdeSource.subscribe(val => {
      console.log("VALVE: ", val);
      this.qde = val;
      this.applicantIndex = val.application.applicants.findIndex(v => v.isMainApplicant == true);
      // this.isValidPan = val.application.applicants[this.applicantIndex].pan.panVerified;
      this.cds.enableTabsIfStatus1(this.qde.application.status);
      //  console.log("validation qde ",this.qdeService.getValidateApplication(this.qde));
    });

    this.fragmentSub = this.route.queryParams.subscribe(val => {

      if (val['tabName']) {
        this.tabName = this.fragments.includes(val['tabName']) ? val['tabName'].toString() : this.fragments[0];
        this.activeTab = this.fragments.findIndex(v => v == val['tabName']);
        this.applicantIndividual = (this.activeTab >= 10) ? false : true;
      }

      if (val['page']) {
        this.page = (val && val['page'] != null && parseInt(val['page']) != NaN && parseInt(val['page']) >= 1) ? parseInt(val['page']) : 1;
      }

      if (this.tabName == this.fragments[9] || this.tabName == this.fragments[15]) {
        this.setAssessmentMethodology();
      }

      if(this.tabName && this.page && this.swiperSliders && this.swiperSliders.length > 0 && this.lhsSwiperSliders && this.lhsSwiperSliders.length > 0) {
        this.swiperSliders[this.activeTab].setIndex(this.page-1);
        this.lhsSwiperSliders[this.activeTab].setIndex(this.page-1);
      }
    });

    this.cds.isTBMLoggedIn.subscribe(val => {
      this.isTBMLoggedIn = val;
    });   
  }

  // panslide: boolean;
  // panslide2: boolean;

  ngOnInit() {
      console.log("selected Branch Id",this.branchID);

    console.log(">>", JSON.parse(this.route.snapshot.data.listOfValues['ProcessVariables'].lovs));
    if (this.route.snapshot.data.listOfValues != null && this.route.snapshot.data.listOfValues != undefined) {

      var lov = JSON.parse(this.route.snapshot.data.listOfValues['ProcessVariables'].lovs);
      this.religions = lov.LOVS.religion;
      this.qualifications = lov.LOVS.qualification;
      this.occupations = lov.LOVS.occupation;
      this.residences = lov.LOVS.residence_type;
      this.titles = lov.LOVS.applicant_title;
      this.maleTitles = lov.LOVS.male_applicant_title;
      this.femaleTitles = lov.LOVS.female_applicant_title;
      this.mariedFemaleTitle =this.femaleTitles.filter(v => v.value != "2");
      // this.docType = lov.LOVS.pan_document_type;
      // Hardcoded values as per requirement
      this.docType = [{ key: "Passport", value: "1" }, { key: "Driving License", value: "2" }, { key: "Voter's Identity Card", value: "3" }, { key: "Aadhaar Card", value: "4" }, { key: "NREGA Job Card", value: "5" }]
      this.maritals = lov.LOVS.maritial_status;
      this.relationships = lov.LOVS.relationship;
      this.loanpurposes = lov.LOVS.loan_purpose;
      this.categories = lov.LOVS.category;
      this.genders = lov.LOVS.gender;
      this.constitutions = lov.LOVS.constitution;
      this.assessmentMethodology = lov.LOVS.assessment_methodology;
      this.unOfficialEmails = lov.LOVS.un_official_emails;
      this.preferredEmail = lov.LOVS.preferred_mails;
      this.minMaxValues = lov.LOVS.min_max_values;
      this.options['floor'] = this.minMaxValues['Years_in_residence']['minValue'];
      this.options['ceil'] = this.minMaxValues['Years_in_residence']['maxValue'];
      this.familyOptions['floor'] = this.minMaxValues['No_Of_Dependents']['minValue'];
      this.familyOptions['ceil'] = this.minMaxValues['No_Of_Dependents']['maxValue'];
      this.employementOptions['floor']= this.minMaxValues['Years_in_employment']['minValue'];
      this.employementOptions['ceil']= this.minMaxValues['Years_in_employment']['maxValue'];
      this.experienceOptions['floor']= this.minMaxValues['Years_in_employment']['minValue'];
      this.experienceOptions['ceil']= this.minMaxValues['Years_in_employment']['maxValue'];
      // console.log("data slice error: ", lov.LOVS.religion);




      //hardcoded
      //this.birthPlace = [{"key": "Chennai", "value": "1"},{"key": "Mumbai", "value": "2"},{"key": "Delhi", "value": "3"}];
      // List of Values for Date
      this.days = Array.from(Array(31).keys()).map((val, index) => {
        let v = ((index + 1) < 10) ? "0" + (index + 1) : (index + 1) + "";
        return { key: v, value: v };
      });
      this.days.unshift({ key: 'DD', value: 'DD' });

      this.months = Array.from(Array(12).keys()).map((val, index) => {
        let v = ((index + 1) < 10) ? "0" + (index + 1) : (index + 1) + "";
        return { key: this.monthsInChar[index], value: v };
      });
      this.months.unshift({ key: 'MON', value: 'MM' });

      this.years = Array.from(Array(100).keys()).map((val, index) => {
        let v = (this.YYYY - index) + "";
        return { key: v, value: v };
      });
      this.years.unshift({ key: 'YYYY', value: 'YYYY' });

      // this.docType = [{"key": "Aadhar", "value": "1"},{"key": "Driving License", "value": "2"},{"key": "passport", "value": "3"}];

      // this.selectedTitle = this.titles[0];
      // this.selectedReligion = this.religions[0];
      // console.log("selected religion data slice error: ", this.selectedReligion);
      // this.selectedMaritialStatus = this.maritals[0];
      // this.selectedCategory = this.categories[0];
      // this.selectedResidence = this.residences[0];
      // this.selectedSpouseTitle = this.titles[0];
      // this.selectedFatherTitle = this.maleTitles[0];
      // this.selectedOccupation = this.occupations[0];
      // this.selectedMotherTitle = this.femaleTitles[0]
      // this.selectedQualification = this.qualifications[0];
      // this.selectedConstitution = this.constitutions[0];
      // this.selectedDocType = this.docType[0];
      // this.selectedAssesmentMethodology = this.assessmentMethodology[0];
    }

    console.log("params: ", this.route.snapshot.params);

    this.cds.applicationId.subscribe(val => {
      if (JSON.parse(localStorage.getItem('roles')).includes('TBM')) {
        this.cds.setReadOnlyForm(true);
      } else {
        this.cds.setReadOnlyForm(false);
      }
    });




    this.paramsSub = this.route.params.subscribe((params) => {

      console.log('PARAMS................................')

      if (params['applicationId'] != null) {
        this.cds.changeApplicationId(params['applicationId']);
      }

      console.log("params ", params);

      this.resetQdeForm();

      // Make an http request to get the required qde data and set using setQde
      if (params.applicationId != null) {

        // If not coming from leads dashboard
        // if(this.qdeService.getQde().application.applicationId == "" || this.qdeService.getQde().application.applicationId == null) {
        this.getQdeDataSub = this.qdeHttp.getQdeData(params.applicationId).subscribe(response => {
          
          console.log("RESPONSE ", response);
          var result = JSON.parse(response["ProcessVariables"]["response"]);
          console.log("Get ", result);
          this.qde = result;
          this.qdeService.setQde(result);
          this.getSetQdeData(result);

          /******************************************************************************
          * Sacred Route Start (WARNING: TOUCH THIS ONLY IF YOU KNOW WHAT YOU ARE DOING)
          ******************************************************************************/
          // Incoming from create in Individual Pan
          // if(this.panslide == true && this.qde.application.applicants[this.applicantIndex].isIndividual == true) {
          //   this.swiperSliders.forEach((v, i, a) => {
          //     v.setIndex(0);
          //   });
          //   this.goToExactPageAndTab(1, 1);
          //   //  this.panSlider2.setIndex(2);
          // }
          // // Incoming from create in Non Individual Pan
          // else if(this.panslide2 == true && this.qde.application.applicants[this.applicantIndex].isIndividual == false) {
          //   this.swiperSliders.forEach((v, i, a) => {
          //     v.setIndex(0);
          //   });
          //   this.goToExactPageAndTab(1, 11);
          //   this.panSlider4.setIndex(1);
          // }
          // // Incoming for edit Individual
          // else if(this.panslide == false && this.qde.application.applicants[this.applicantIndex].isIndividual == true) {
          //   this.swiperSliders.forEach((v, i, a) => {
          //     v.setIndex(0);
          //   });
          //   this.goToExactPageAndTab(0, 1);
          //   this.panSlider2.setIndex(1);
          // }
          // // Incoming for edit Non-Individual
          // else if(this.panslide2 == false && this.qde.application.applicants[this.applicantIndex].isIndividual == false) {
          //   this.swiperSliders.forEach((v, i, a) => {
          //     v.setIndex(0);
          //   });
          //   // Enable it when upload file is enabled
          //   this.goToExactPageAndTab(1, 10);
          //   // this.panSlider4.setIndex(1);

          //   // this.goToExactPageAndTab(1, 10);
          // }

          // So that route is now in edit mode only
          // this.cds.changePanSlide(false);
          // this.cds.changePanSlide2(false);
          /*******************************************
          * Sacred Route End
          *******************************************/
         
          
        }
        // , error => {
        //   this.isErrorModal = true;
        //   this.errorMessage = "Something went wrong, please try again later.";
        // }
        );
        // }
      }

      if (params['applicationId'] != null) {
        if (this.isEligibilityForReviewsSub != null) {
          this.isEligibilityForReviewsSub.unsubscribe();
        }
        this.isEligibilityForReviewsSub = this.cds.isEligibilityForReviews.subscribe(val => {
          try {
            this.isEligibilityForReview = val.find(v => v.applicationId == params['applicationId'])['isEligibilityForReview'];
          } catch (ex) {
            //   this.router.navigate(['/leads']);
          }
        });
      }
      if (params.applicationId == undefined) {
        this.tabHide = true;

      } else {
        this.tabHide = false;
      }
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

  // get and set qde data 

    getSetQdeData(result){

      
      this.cds.setStatus(result.application.status);
      this.cds.setactiveTab(screenPages['applicantDetails']);
      this.applicantIndex = result.application.applicants.findIndex(v => v.isMainApplicant == true);
      this.cds.enableTabsIfStatus1(this.qde.application.status);
      this.tempOldPanNumber = result.application.applicants[this.applicantIndex].pan.panNumber;
      
      // get applicant name to set cds 
      this.cds.changeApplicantId(result.application.applicants[this.applicantIndex].applicantId);
      
      this.loadOccupationTypeLovs(this.qde.application.applicants[this.applicantIndex].occupation.occupationType);
      if (this.qde.application.auditTrailDetails.screenPage == screenPages['applicantDetails']) {
        this.goToExactPageAndTab(this.fragments.findIndex(v => v == this.qde.application.auditTrailDetails.tabPage), this.qde.application.auditTrailDetails.pageNumber);
      }
      // else if(this.qde.application.auditTrailDetails.screenPage == screenPages['loanDetails']){
      //   this.router.navigate(['/loanDetails/'+this.qde.application.applicationId]);
      // }
      // else{
      //   if(this.qde.application.applicants[this.applicantIndex].isIndividual == true) {
      //     this.goToExactPageAndTab(0, 1);
      //   } else if(this.qde.application[this.applicantIndex].isIndividual == false) {
      //     this.goToExactPageAndTab(1, 1);
      //   } else {
      //     this.goToExactPageAndTab(0, 1);
      //   }
      // }

      try {
        // this.qde.application.applicationFormNumber = "ijijijjjjj"
        if (result.application.applicants[this.applicantIndex].communicationAddress != null) {
          this.commCityState = "";
          if (result.application.applicants[this.applicantIndex].communicationAddress.city) {
            this.commCityState = result.application.applicants[this.applicantIndex].communicationAddress.city + " " + result.application.applicants[this.applicantIndex].communicationAddress.state;
          }
          this.qde.application.applicants[this.applicantIndex].communicationAddress.city = result.application.applicants[this.applicantIndex].communicationAddress.city;
          this.qde.application.applicants[this.applicantIndex].communicationAddress.state = result.application.applicants[this.applicantIndex].communicationAddress.state;
          this.qde.application.applicants[this.applicantIndex].communicationAddress.cityState = this.commCityState;
          this.qde.application.applicants[this.applicantIndex].communicationAddress.zipcodeId = result.application.applicants[this.applicantIndex].communicationAddress.zipcodeId;
          this.qde.application.applicants[this.applicantIndex].communicationAddress.stateId = result.application.applicants[this.applicantIndex].communicationAddress.stateId;
          this.qde.application.applicants[this.applicantIndex].communicationAddress.cityId = result.application.applicants[this.applicantIndex].communicationAddress.cityId;
        }
      } catch (e) { }
      try {
        if (result.application.applicants[this.applicantIndex].permanentAddress != null) {
          this.commCityState = "";
          if (result.application.applicants[this.applicantIndex].permanentAddress.city) {
            this.commCityState = result.application.applicants[this.applicantIndex].permanentAddress.city + " " + result.application.applicants[this.applicantIndex].permanentAddress.state;
          }

          this.qde.application.applicants[this.applicantIndex].permanentAddress.city = result.application.applicants[this.applicantIndex].permanentAddress.city;
          this.qde.application.applicants[this.applicantIndex].permanentAddress.state = result.application.applicants[this.applicantIndex].permanentAddress.state;
          this.qde.application.applicants[this.applicantIndex].permanentAddress.cityState = this.commCityState;
          this.qde.application.applicants[this.applicantIndex].permanentAddress.zipcodeId = result.application.applicants[this.applicantIndex].permanentAddress.zipcodeId;
          this.qde.application.applicants[this.applicantIndex].permanentAddress.stateId = result.application.applicants[this.applicantIndex].permanentAddress.stateId;
          this.qde.application.applicants[this.applicantIndex].permanentAddress.cityId = result.application.applicants[this.applicantIndex].permanentAddress.cityId;


        }
      } catch (e) { }
      try {
        if (result.application.applicants[this.applicantIndex].residentialAddress != null) {
          this.commCityState = "";
          if (result.application.applicants[this.applicantIndex].residentialAddress.city) {
            this.commCityState = result.application.applicants[this.applicantIndex].residentialAddress.city + " " + result.application.applicants[this.applicantIndex].residentialAddress.state;
          }

          this.qde.application.applicants[this.applicantIndex].residentialAddress.city = result.application.applicants[this.applicantIndex].residentialAddress.city;
          this.qde.application.applicants[this.applicantIndex].residentialAddress.state = result.application.applicants[this.applicantIndex].residentialAddress.state;
          this.qde.application.applicants[this.applicantIndex].residentialAddress.cityState = this.commCityState;
          this.qde.application.applicants[this.applicantIndex].residentialAddress.zipcodeId = result.application.applicants[this.applicantIndex].residentialAddress.zipcodeId;
          this.qde.application.applicants[this.applicantIndex].residentialAddress.stateId = result.application.applicants[this.applicantIndex].residentialAddress.stateId;
          this.qde.application.applicants[this.applicantIndex].residentialAddress.cityId = result.application.applicants[this.applicantIndex].residentialAddress.cityId;

        }
      } catch (e) { }
      try {
        if (result.application.applicants[this.applicantIndex].officialCorrespondence != null) {
          this.commCityState = "";
          if (result.application.applicants[this.applicantIndex].officialCorrespondence.city) {
            this.commCityState = result.application.applicants[this.applicantIndex].officialCorrespondence.city + " " + result.application.applicants[this.applicantIndex].officialCorrespondence.state;
          }
          this.qde.application.applicants[this.applicantIndex].officialCorrespondence.city = result.application.applicants[this.applicantIndex].officialCorrespondence.city;
          this.qde.application.applicants[this.applicantIndex].officialCorrespondence.state = result.application.applicants[this.applicantIndex].officialCorrespondence.state;
          this.qde.application.applicants[this.applicantIndex].officialCorrespondence.cityState = this.commCityState;
          this.qde.application.applicants[this.applicantIndex].officialCorrespondence.zipcodeId = result.application.applicants[this.applicantIndex].officialCorrespondence.zipcodeId;
          this.qde.application.applicants[this.applicantIndex].officialCorrespondence.stateId = result.application.applicants[this.applicantIndex].officialCorrespondence.stateId;
          this.qde.application.applicants[this.applicantIndex].officialCorrespondence.cityId = result.application.applicants[this.applicantIndex].officialCorrespondence.cityId;
        }
      } catch (e) { }
      try {
        if (result.application.applicants[this.applicantIndex].organizationDetails != null) {
          this.qde.application.applicants[this.applicantIndex].organizationDetails = result.application.applicants[this.applicantIndex].organizationDetails;
        }
      } catch (e) { }
      try {
        if (result.application.applicants[this.applicantIndex].registeredAddress != null) {
          this.commCityState = "";
          if (result.application.applicants[this.applicantIndex].registeredAddress.city) {
            this.commCityState = result.application.applicants[this.applicantIndex].registeredAddress.city + " " + result.application.applicants[this.applicantIndex].registeredAddress.state;
          }

          this.qde.application.applicants[this.applicantIndex].registeredAddress.city = result.application.applicants[this.applicantIndex].registeredAddress.city;
          this.qde.application.applicants[this.applicantIndex].registeredAddress.state = result.application.applicants[this.applicantIndex].registeredAddress.state;
          this.qde.application.applicants[this.applicantIndex].registeredAddress.cityState = this.commCityState;
          this.qde.application.applicants[this.applicantIndex].registeredAddress.zipcodeId = result.application.applicants[this.applicantIndex].registeredAddress.zipcodeId;
          this.qde.application.applicants[this.applicantIndex].registeredAddress.stateId = result.application.applicants[this.applicantIndex].registeredAddress.stateId;
          this.qde.application.applicants[this.applicantIndex].registeredAddress.cityId = result.application.applicants[this.applicantIndex].registeredAddress.cityId;
        }
      } catch (e) { }

      try {
        if (result.application.applicants[this.applicantIndex].corporateAddress != null) {
          this.commCityState = "";
          if (result.application.applicants[this.applicantIndex].corporateAddress.city) {
            this.commCityState = result.application.applicants[this.applicantIndex].corporateAddress.city + " " + result.application.applicants[this.applicantIndex].corporateAddress.state;
          }

          this.qde.application.applicants[this.applicantIndex].corporateAddress.city = result.application.applicants[this.applicantIndex].corporateAddress.city;
          this.qde.application.applicants[this.applicantIndex].corporateAddress.state = result.application.applicants[this.applicantIndex].corporateAddress.state;
          this.qde.application.applicants[this.applicantIndex].corporateAddress.cityState = this.commCityState;
          this.qde.application.applicants[this.applicantIndex].corporateAddress.zipcodeId = result.application.applicants[this.applicantIndex].corporateAddress.zipcodeId;
          this.qde.application.applicants[this.applicantIndex].corporateAddress.stateId = result.application.applicants[this.applicantIndex].corporateAddress.stateId;
          this.qde.application.applicants[this.applicantIndex].corporateAddress.cityId = result.application.applicants[this.applicantIndex].corporateAddress.cityId;
        }
      } catch (e) { }
      try {
        if (result.application.applicants[this.applicantIndex].revenueDetails != null) {
          this.qde.application.applicants[this.applicantIndex].revenueDetails = result.application.applicants[this.applicantIndex].revenueDetails;
        }
      } catch (e) { }
      try {
        if (result.application.applicants[this.applicantIndex].incomeDetails != null) {
          this.qde.application.applicants[this.applicantIndex].incomeDetails = result.application.applicants[this.applicantIndex].incomeDetails;
        }
      } catch (e) { }
      try {
        if (result.application.applicants[this.applicantIndex].documents != null) {
          this.qde.application.applicants[this.applicantIndex].documents = result.application.applicants[this.applicantIndex].documents;
        }
      } catch (e) { }
      try {
        if (result.application.applicants[this.applicantIndex].isMainApplicant != null) {
          this.qde.application.applicants[this.applicantIndex].isMainApplicant = result.application.applicants[this.applicantIndex].isMainApplicant;
        }
      } catch (e) { }

      try {
        if (result.application.applicants[this.applicantIndex].pan.fileName != null) {
          this.idPanFileName = result.application.applicants[this.applicantIndex].pan.fileName;
        }
      } catch (e) { }

      try {
        if (result.application.applicants[this.applicantIndex].pan.fileSize != null) {
          this.idPanFileSize = result.application.applicants[this.applicantIndex].pan.fileSize;
        }
      } catch (e) { }

      try {
        if (result.application.applicants[this.applicantIndex].contactDetails.isMobileOTPverified != null) {
          this.qde.application.applicants[this.applicantIndex].contactDetails.isMobileOTPverified = result.application.applicants[this.applicantIndex].contactDetails.isMobileOTPverified;
        }
      } catch (e) { }

      try {
        if (result.application.applicants[this.applicantIndex].contactDetails.isAlternateOTPverified != null) {
          this.qde.application.applicants[this.applicantIndex].contactDetails.isAlternateOTPverified = result.application.applicants[this.applicantIndex].contactDetails.isAlternateOTPverified;
        }
      } catch (e) { }

      let set = this.setSpouseTitles();
      console.log("Setted "+ set);
      // Document Type
      if (!isNaN(parseInt(this.qde.application.applicants[this.applicantIndex].pan.docType))) {
        // this.selectedDocType = this.docType[(parseInt(this.qde.application.applicants[this.applicantIndex].pan.docType))-1];
        this.selectedDocType = this.getSelectedValue(this.qde.application.applicants[this.applicantIndex].pan.docType, this.docType);

      }

      // Personal Details Title
      if (!isNaN(parseInt(this.qde.application.applicants[this.applicantIndex].personalDetails.title))) {
        this.selectedTitle = this.getApplicantTitle(this.qde.application.applicants[this.applicantIndex].personalDetails.title);
      }

      // Personal Details Qualification (different because qualification isnt sending sequential value like 1,2,3)
      if (!isNaN(parseInt(this.qde.application.applicants[this.applicantIndex].personalDetails.qualification))) {
        // console.log('this.qde.application.applicants[this.applicantIndex].personalDetails.qualification: ', this.qde.application.applicants[this.applicantIndex].personalDetails.qualification);
        // this.selectedQualification = this.qualifications[(parseInt(this.qde.application.applicants[this.applicantIndex].personalDetails.qualification))-1];
        this.selectedQualification = this.qualifications.find(e => e.value == this.qde.application.applicants[this.applicantIndex].personalDetails.qualification);
        console.log('selectedQualification: ', this.selectedQualification);
      }

      // Personal Details Day
      if (!isNaN(parseInt(this.qde.application.applicants[this.applicantIndex].personalDetails.dob.split('/')[2]))) {
        this.dob.day = this.days[parseInt(this.qde.application.applicants[this.applicantIndex].personalDetails.dob.split('/')[2])];
      }

      // Personal Details Month
      if (!isNaN(parseInt(this.qde.application.applicants[this.applicantIndex].personalDetails.dob.split('/')[1]))) {
        this.dob.month = this.months[parseInt(this.qde.application.applicants[this.applicantIndex].personalDetails.dob.split('/')[1])];
      }

      // Personal Details Year
      if (!isNaN(parseInt(this.qde.application.applicants[this.applicantIndex].personalDetails.dob.split('/')[0]))) {
        this.dob.year = this.years.find(val => this.qde.application.applicants[this.applicantIndex].personalDetails.dob.split('/')[0] == val.value);
      }

      if(this.dob.year.value == "YYYY") {
        this.focusedDate = new Date();
      }else {
        this.focusedDate = new Date(parseInt(this.dob.year.value.toString()), parseInt(this.dob.month.value.toString())-1, parseInt(this.dob.day.value.toString()));
      }


      console.log("focusedDate **", this.focusedDate);
      
      // Date of Incorporation Day
      if (!isNaN(parseInt(this.qde.application.applicants[this.applicantIndex].organizationDetails.dateOfIncorporation.split('/')[2]))) {
        this.organizationDetails.day = this.days[parseInt(this.qde.application.applicants[this.applicantIndex].organizationDetails.dateOfIncorporation.split('/')[2])];
      }

      // Date of Incorporation Month
      if (!isNaN(parseInt(this.qde.application.applicants[this.applicantIndex].organizationDetails.dateOfIncorporation.split('/')[1]))) {
        this.organizationDetails.month = this.months[parseInt(this.qde.application.applicants[this.applicantIndex].organizationDetails.dateOfIncorporation.split('/')[1])];
      }

      // Date of Incorporation Year
      if (!isNaN(parseInt(this.qde.application.applicants[this.applicantIndex].organizationDetails.dateOfIncorporation.split('/')[0]))) {
        this.organizationDetails.year = this.years.find(val => this.qde.application.applicants[this.applicantIndex].organizationDetails.dateOfIncorporation.split('/')[0] == val.value);
      }

      // Constitution
      if (!isNaN(parseInt(this.qde.application.applicants[this.applicantIndex].organizationDetails.constitution))) {
        console.log('c', this.qde.application.applicants[this.applicantIndex].organizationDetails.constitution);
        // this.selectedConstitution = this.constitutions[(parseInt(this.qde.application.applicants[this.applicantIndex].organizationDetails.constitution))-1];
        this.selectedConstitution = this.getSelectedValue(this.qde.application.applicants[this.applicantIndex].organizationDetails.constitution, this.constitutions);

        console.log(this.selectedConstitution);
      }

      // Communication address
      if (!isNaN(parseInt(this.qde.application.applicants[this.applicantIndex].communicationAddress.residentialStatus))) {
        //this.selectedResidence = this.residences[(parseInt(this.qde.application.applicants[this.applicantIndex].communicationAddress.residentialStatus)) - 1];
        this.selectedResidence = this.getSelectedValue(this.qde.application.applicants[this.applicantIndex].communicationAddress.residentialStatus, this.residences);
      }

      if (!isNaN(parseInt(this.qde.application.applicants[this.applicantIndex].maritalStatus.status))) {
        // this.selectedMaritialStatus = this.maritals[(parseInt(this.qde.application.applicants[this.applicantIndex].maritalStatus.status))-1];
        this.selectedMaritialStatus = this.getSelectedValue(this.qde.application.applicants[this.applicantIndex].maritalStatus.status, this.maritals);
      }

      if (!isNaN(parseInt(this.qde.application.applicants[this.applicantIndex].maritalStatus.spouseTitle))) {
        if(this.spouseTitles){
        // this.selectedSpouseTitle = this.titles[(parseInt(this.qde.application.applicants[this.applicantIndex].maritalStatus.spouseTitle))-1];
        this.selectedSpouseTitle = this.getSelectedValue(this.qde.application.applicants[this.applicantIndex].maritalStatus.spouseTitle, this.spouseTitles);
       }
      }

      if (!isNaN(parseInt(this.qde.application.applicants[this.applicantIndex].familyDetails.fatherTitle))) {
        // this.selectedFatherTitle  = this.maleTitles[(parseInt(this.qde.application.applicants[this.applicantIndex].familyDetails.fatherTitle))-1];
        this.selectedFatherTitle = this.getSelectedValue(this.qde.application.applicants[this.applicantIndex].familyDetails.fatherTitle, this.maleTitles);
      }

      if (!isNaN(parseInt(this.qde.application.applicants[this.applicantIndex].familyDetails.motherTitle))) {
        // this.selectedMotherTitle = this.femaleTitles[(parseInt(this.qde.application.applicants[this.applicantIndex].familyDetails.motherTitle))-1];
        this.selectedMotherTitle = this.getSelectedValue(this.qde.application.applicants[this.applicantIndex].familyDetails.motherTitle, this.femaleTitles);
      }

      // Other
      if (!isNaN(parseInt(this.qde.application.applicants[this.applicantIndex].other.religion))) {
        // this.selectedReligion = this.religions[(parseInt(this.qde.application.applicants[this.applicantIndex].other.religion))-1];
        this.selectedReligion = this.getSelectedValue(this.qde.application.applicants[this.applicantIndex].other.religion, this.religions);
      }

      // Category
      if (!isNaN(parseInt(this.qde.application.applicants[this.applicantIndex].other.category))) {
        // this.selectedCategory  = this.categories[(parseInt(this.qde.application.applicants[this.applicantIndex].other.category))-1];
        this.selectedCategory = this.getSelectedValue(this.qde.application.applicants[this.applicantIndex].other.category, this.categories);
      }

      // Occupation details
      // if( ! isNaN(parseInt(this.qde.application.applicants[this.applicantIndex].occupation.occupationType)) ) {
      // this.selectedOccupation = this.occupations.find(e => e.value == this.qde.application.applicants[this.applicantIndex].occupation.occupationType);
      //   this.selectedTitle = this.getSelectedValue(this.qde.application.applicants[this.applicantIndex].occupation.occupationType,this.occupations);
      // }

      // Assesment methodology
      console.log("AM: ", this.assessmentMethodology);
      if (!isNaN(parseInt(this.qde.application.applicants[this.applicantIndex].incomeDetails.assessmentMethodology))) {
        this.selectedAssesmentMethodology = this.assessmentMethodology.find(v => v.value == this.qde.application.applicants[this.applicantIndex].incomeDetails.assessmentMethodology);
      }

      this.initializeVariables();

      this.setAssessmentMethodology();
    }

  /**
   * Use to sync between lhs and rhs sliders
   * @param swiperInstance RHS Swiper Instance
   */
  goToNextSlide(swiperInstance1: Swiper, swiperInstance2: Swiper) {

    // if (form && !form.valid) {
    //   return;
    // }

    // Create ngModel of radio button in future
    swiperInstance1.nextSlide();

    if(swiperInstance2)
      swiperInstance2.nextSlide();

    this.page++;
    this.router.navigate([], { queryParams: { tabName: this.tabName, page: this.page } });
  }

  /**
   * Use to sync between lhs and rhs sliders
   * @param swiperInstance LHS Swiper Instance
   */
  slideNextTransitionStart(swiperInstance: Swiper) {
    // alert('next');
    swiperInstance.nextSlide();
  }


  /**
   * Use to sync between lhs and rhs sliders
   * @param swiperInstance RHS Swiper Instance
   */
  goToPrevSlide(swiperInstance1: Swiper, swiperInstance2?: Swiper) {

    // Create ngModel of radio button in future
    // swiperInstance.prevSlide();
    swiperInstance1.prevSlide();

    if(swiperInstance2)
      swiperInstance2.prevSlide();

    this.page--;
    this.router.navigate([], { queryParams: { tabName: this.tabName, page: this.page } });
  }

  /**
   * Use to sync between lhs and rhs sliders
   * @param swiperInstance LHS Swiper Instance
   */
  slidePrevTransitionStart(swiperInstance: Swiper) {
    // alert('prev');
    swiperInstance.prevSlide();
  }

  // goToExactPageAndTab(t, 1abIndex?: number, fromQde?: boolean) {

  //   // Check for invalid tabIndex
  //   if (tabIndex < this.fragments.length && tabIndex != -1) {

  //     let t = fromQde ? this.page : 1;

  //     if (this.swiperSliders && this.swiperSliders.length > 0) {
  //       if (t == 1 && !fromQde ) {
  //         this.swiperSliders[tabIndex].setIndex(0);
  //       } else {
  //         this.swiperSliders[tabIndex].setIndex(this.page - 1);
  //       }
  //     }

  //     // It should not allow to go to any other tabs if applicationId is not present
  //     if (this.applicantIndex != null && this.qde.application.applicationId != null && this.qde.application.applicationId != '') {

  //       this.router.navigate([], { queryParams: { tabName: this.fragments[tabIndex], page: t } });
  //     }

  //     // this.router.navigate([], { fragment: this.fragments[tabIndex]});
  //   }
  // }

  onBackButtonClick(goToSlideNumber: number = 1) {

    // if (this.activeTab > -1) {
    //   if (swiperInstance1 != null && swiperInstance1.getIndex() > 0) {
    //     // Go to Previous Slide
    //     this.goToPrevSlide(swiperInstance1, swiperInstance2);
    //   } else {

    //     // When income consider is true, official correspondence will be hidden
    //     if (this.activeTab == 9 && this.qde.application.applicants[this.applicantIndex].incomeDetails.incomeConsider == false) {
    //       this.goToExactPageAndTab(this.activeTab - 2, 0);
    //     } else if (this.activeTab == 10 || this.activeTab == 0) {
    //       // this.goToPrevSlide(swiperInstance1, swiperInstance2);
    //       this.goToExactPageAndTab(this.activeTab, 1);
    //       return;
    //     } else {
    //       this.goToExactPageAndTab(this.activeTab - 1, 0);
    //     }
    //   }
    // }

    // alert(this.tabName == 9 && this.qde.application.applicants[this.applicantIndex].incomeDetails.incomeConsider == false);
    if(this.tabName == this.fragments[9] && this.qde.application.applicants[this.applicantIndex].incomeDetails.incomeConsider == false) {
      this.router.navigate([], {queryParams: {tabName: this.fragments[7], page: goToSlideNumber}});
    }
    else if(this.tabName == this.fragments[3] || this.tabName == this.fragments[2]){
      //for tab switch from address to phone
      this.contactExtraFieldRemoval();
      this.router.navigate([], {queryParams: {tabName: this.fragments[this.activeTab-1], page: goToSlideNumber}});
    } 
    else if(this.page <= 1) {
      // Switch Tabs
      this.router.navigate([], {queryParams: {tabName: this.fragments[this.activeTab-1], page: goToSlideNumber}});
    }
    else {
        // go to previous slide
      this.router.navigate([], {queryParams: {tabName: this.tabName, page: this.page-1}});
    }
  }

  addRemoveEmailField() {
    this.isAlternateEmailId = !this.isAlternateEmailId;
    this.qde.application.applicants[this.applicantIndex].contactDetails.alternateEmailId = ""
  }

  addRemoveMobileNumberField() {
    this.isAlternateMobileNumber = !this.isAlternateMobileNumber;
    this.qde.application.applicants[this.applicantIndex].contactDetails.alternateMobileNumber = null;
  }

  addRemoveResidenceNumberField() {
    this.isAlternateResidenceNumber = !this.isAlternateResidenceNumber;
	  this.alternateResidenceNumberStdCode = ""
    this.alternateResidenceNumberPhoneNumber = ""
  }

  //-------------------------------------------------------------
  // PAN
  //-------------------------------------------------------------

  getApplicantTitle(salutation: string) {
    let titles = JSON.parse(JSON.stringify(this.titles));
    let selectedSalutationObj = {};
    for (let key in titles) {
      let salutationObj = titles[key];
      if (salutationObj["value"] == salutation) {
        return salutationObj;
      }
    }
    return titles[0];
  }


  getSelectedValue(selectVal, array) {

    let arr = JSON.parse(JSON.stringify(array));
    let selectedSalutationObj = {};
    for (let key in arr) {
      let salutationObj = arr[key];
      if (salutationObj["value"] == selectVal) {
        return salutationObj;
      }
    }
    return arr[0];

  }
  // getOccupationValue(occupation:string) {

  //   let occupations = JSON.parse(JSON.stringify(this.occupations));
  //   let selectedOccupationObj = {};
  //   for(let id in occupations) {
  //     let occupationObj = occupations[id];
  //     if(occupationObj["value"] == occupation ) {
  //       return occupationObj;
  //     }
  //   }
  //   return occupations[0];

  // }
  
  submitPanNumber(form: NgForm, swiperInstance1: Swiper, swiperInstance2 : Swiper) {
    
    try {
      this.ngxService.start();
    if (this.isTBMLoggedIn) {
      this.goToNextSlide(swiperInstance1, swiperInstance2);
    } else {

      event.preventDefault();

      if (form && !form.valid) {
        return;
      }

      // this.qde.application.applicationFormNumber = form.value.applicationFormNo;
      this.qde.application.applicants[this.applicantIndex].pan.panNumber = form.value.pan;
      this.qde.application.applicants[this.applicantIndex].pan.docType = form.value.docTypeindividual.value;
      this.qde.application.applicants[this.applicantIndex].pan.docNumber = form.value.docNumber;
      this.qde.application.branch = this.getBranchId();
      // if(this.qde.application.applicants[this.applicantIndex].pan.panNumber) {
      //   this.panSlider2.setIndex(2);
      //   return;
      // }

      if (this.isValidPan == false || this.isValidPan == null) {

        this.checkPanValidSub = this.qdeHttp.checkPanValid(this.qdeService.getFilteredJson({ actualPanNumber: form.value.pan })).subscribe((response) => {

          if (response["ProcessVariables"]["status"] == true && response['ProcessVariables']['isValidPan'] == true) { // Boolean to check from nsdl website whether pan is valid or not


            this.qde.application.applicants[this.applicantIndex].pan.panVerified = this.isValidPan = response['ProcessVariables']['isValidPan'];

            let processVariables = response["ProcessVariables"];
            if (processVariables["firstName"] != "" && processVariables["lastName"] != "") {
              this.qde.application.applicants[this.applicantIndex].personalDetails.firstName = processVariables["firstName"];
              this.qde.application.applicants[this.applicantIndex].personalDetails.lastName = processVariables["lastName"];
            }

            // set deupe is require
            this.qde.application.applicants[this.applicantIndex].dedupeDone = false;

            if (processVariables["applicantTitleId"] > 0) {
              this.qde.application.applicants[this.applicantIndex].personalDetails.title = processVariables["applicantTitleId"] || this.qde.application.applicants[this.applicantIndex].personalDetails.title;
            }
            this.selectedTitle = this.getApplicantTitle((processVariables["applicantTitleId"] == 0) ? this.qde.application.applicants[this.applicantIndex].personalDetails.title: processVariables["applicantTitleId"] );

            this.createOrUpdatePanDetailsSub = this.qdeHttp.createOrUpdatePanDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {

              // If successful
              if (response["ProcessVariables"]["status"] == true) {
                let result = this.parseJson(response["ProcessVariables"]["response"]);
                // this.qde.application.ocsNumber = result["application"]["ocsNumber"];
                // this.qde.application.applicationId = result["application"]["applicationId"];

                this.qde.application.applicationId = result['application']['applicationId'];
                // this.qde.application.applicationFormNumber = result['application']['applicationFormNumber'];

                // let isApplicantPresent:boolean = false;
                // if (this.qde.application.applicationFormNumber){
                // this.isErrorModal = true;
                // this.errorMessage = "Application Form No is "+this.qde.application.applicationFormNumber;
                // }

                this.tempOldPanNumber = this.qde.application.applicants[this.applicantIndex].pan.panNumber;

                if ((result["application"]["applicants"]).length > 0) {
                  this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(result['application']['applicationId'], result['application']['applicants'][0]['applicantId'] + "", 1, this.fragments[this.activeTab + 1], screenPages['applicantDetails']).subscribe(auditRes => {
                    if (auditRes['ProcessVariables']['status'] == true) {
                      this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
                      this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
                      this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
                      this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
                    }
                  });
                  // isApplicantPresent = applicants[this.applicantIndex].hasOwnProperty('applicantId');
                  // this.qde.application.applicants[this.coApplicantIndex].applicantId =  applicants[this.coApplicantIndex]["applicantId"];
                  let applicationId = result['application']['applicationId'];
                  const getQdeStatus = this.qde.application.status;

                  let evnQDE = environment['status']['QDECREATED'];
                  if(getQdeStatus == 2) {
                    evnQDE = environment['status']['QDELEADASSIGNED'];
                  }
                  if(getQdeStatus == 3) {
                    evnQDE = environment['status']['QDELEADASSIGNEDL2RM'];
                  }
                  this.setStatusApiSub = this.qdeHttp.setStatusApi(applicationId, evnQDE).subscribe((response) => {
                    if (response["ProcessVariables"]["status"] == true) {
                      // this.cds.changePanSlide(true);
                      this.router.navigate(['/applicant/' + this.qde.application.applicationId]);
                    }
                  });

                } else {
                  //  this.cds.changePanSlide(true);
                  //  this.panSlider2.setIndex(2);
                  this.goToExactPageAndTab(1, 1);
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
        }
        // , error => {
        //   this.isErrorModal = true;
        //   this.errorMessage = "Something went wrong, please try again later.";
        // }
      );
      }
      // Only create HFC API when PAN is already valid and not touched
      else {
        
        // set deupe is require
        this.qde.application.applicants[this.applicantIndex].dedupeDone = true;

        this.createOrUpdatePanDetailsSub = this.qdeHttp.createOrUpdatePanDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
          // If successful

          if (response["ProcessVariables"]["status"] == true) {
            let result = this.parseJson(response["ProcessVariables"]["response"]);
            // this.qde.application.ocsNumber = result["application"]["ocsNumber"];
            // this.qde.application.applicationId = result["application"]["applicationId"];

            this.qde.application.applicationId = result['application']['applicationId'];
            this.qde.application.applicationFormNumber = result['application']['applicationFormNumber'];

            // // let isApplicantPresent:boolean = false;
            // this.isErrorModal = true;
            // this.errorMessage = "Applicaiton Form No is "+this.qde.application.applicationFormNumber;
           

            if ((result["application"]["applicants"]).length > 0) {
              // isApplicantPresent = applicants[this.applicantIndex].hasOwnProperty('applicantId');
              // this.qde.application.applicants[this.coApplicantIndex].applicantId =  applicants[this.coApplicantIndex]["applicantId"];

              this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(result['application']['applicationId'], result['application']['applicants'][0]['applicantId'] + "", 1, this.fragments[this.activeTab + 1], screenPages['applicantDetails']).subscribe(auditRes => {
                if (auditRes['ProcessVariables']['status'] == true) {
                  this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
                  this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
                  this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
                  this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
                }
                // else {
                //   this.isErrorModal = true;
                //   this.errorMessage = "Something went wrong, please try again later.";
                // }
              }
              // , error => {
              //   this.isErrorModal = true;
              //   this.errorMessage = "Something went wrong, please try again later.";
              // }
            );

              let applicationId = result['application']['applicationId'];
              const getQdeStatus = this.qde.application.status;

                  let evnQDE = environment['status']['QDECREATED'];
                  if(getQdeStatus == 2) {
                    evnQDE = environment['status']['QDELEADASSIGNED'];
                  }
                  if(getQdeStatus == 3) {
                    evnQDE = environment['status']['QDELEADASSIGNEDL2RM'];
                  }
              this.setStatusApiSub = this.qdeHttp.setStatusApi(applicationId, evnQDE).subscribe((response) => {
                if (response["ProcessVariables"]["status"] == true) {
                  // this.cds.changePanSlide(true);
                  this.router.navigate(['/applicant/' + this.qde.application.applicationId]);
                }
                // else {
                //   this.isErrorModal = true;
                //   this.errorMessage = "Something went wrong, please try again later.";
                // }
              }
              // , error => {
              //   this.isErrorModal = true;
              //   this.errorMessage = "Something went wrong, please try again later.";
              // }
            );

            } else {
              //  this.cds.changePanSlide(true);
              //  this.panSlider2.setIndex(2);
              this.goToExactPageAndTab(1, 1);
              // return;
              //  this.panSlider2.setIndex(2);
              //   return;
            }


          } else {
            this.panErrorCount++;
            // this.isErrorModal = true;
            // this.errorMessage = "Something went wrong, please try again later.";
          }
        }
        // , (error) => {
        //   this.isErrorModal = true;
        //   this.errorMessage = "Something went wrong, please try again later.";
        // }
      );
      }

    }


  } catch (ex) {
        this.isErrorModal = true;
        this.errorMessage = ex.message;

        } finally {
          this.ngxService.stop();
        }
  }


  //-------------------------------------------------------------
  // PAN
  //-------------------------------------------------------------

  submitOrgPanNumber(form: NgForm, swiperInstance1: Swiper, swiperInstance2: Swiper) {
    try {
      this.ngxService.start();
    if (this.isTBMLoggedIn) {
      // this.goToNextSlide(swiperInstance);
      this.goToExactPageAndTab(this.activeTab + 1, 0);
    } else {
      event.preventDefault();

      if (form && !form.valid) {
        return;
      }

      // this.qde.application.applicationFormNumber = form.value.applicationFormNo;
      this.qde.application.applicants[this.applicantIndex].pan.panNumber = form.value.pan;
      // this.qde.application.applicants[this.applicantIndex].pan.docType = form.value.panDocType.value;
      // this.qde.application.applicants[this.applicantIndex].pan.docNumber = form.value.docNumber;
      this.qde.application.branch = this.getBranchId();

      if (this.isValidPan == false || this.isValidPan == null) {
        this.checkPanValidSub2 = this.qdeHttp.checkPanValid(this.qdeService.getFilteredJson({ actualPanNumber: form.value.pan })).subscribe((response) => {

          // response["ProcessVariables"]["status"] = true; // Comment while deploying if service is enabled false

          if (response["ProcessVariables"]["status"] == true && response['ProcessVariables']['isValidPan'] == true) { // Boolean to check from nsdl website whether pan is valid or not

            this.qde.application.applicants[this.applicantIndex].pan.panVerified = this.isValidPan = true;

            let processVariables = response["ProcessVariables"];//need to check its needed for non individual
            this.qde.application.applicants[this.applicantIndex].personalDetails.firstName = processVariables["firstName"];
            this.qde.application.applicants[this.applicantIndex].personalDetails.lastName = processVariables["lastName"];
            if (processVariables["applicantTitleId"] > 0) {
              this.qde.application.applicants[this.applicantIndex].personalDetails.title = processVariables["applicantTitleId"];
            }
            this.selectedTitle = this.getApplicantTitle(processVariables["applicantTitleId"]);
            // set deupe is require
            this.qde.application.applicants[this.applicantIndex].dedupeDone = false;
            this.createOrUpdatePanDetailsSub2 = this.qdeHttp.createOrUpdatePanDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
              // If successfull
              if (response["ProcessVariables"]["status"] == true) {

                let result = this.parseJson(response["ProcessVariables"]["response"]);

                this.qde.application.applicationId = result['application']['applicationId'];

                // let isApplicantPresent:boolean = false;

                if ((result["application"]["applicants"]).length > 0) {

                  this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(result['application']['applicationId'], result['application']['applicants'][0]['applicantId'] + "", 1, this.fragments[this.activeTab + 1], screenPages['applicantDetails']).subscribe(auditRes => {
                    if (auditRes['ProcessVariables']['status'] == true) {
                      this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
                      this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
                      this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
                      this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
                    }
                  });
                  // isApplicantPresent = applicants[this.applicantIndex].hasOwnProperty('applicantId');
                  // this.qde.application.applicants[this.coApplicantIndex].applicantId =  applicants[this.coApplicantIndex]["applicantId"];
                  let applicationId = result['application']['applicationId'];
                  const getQdeStatus = this.qde.application.status;

                  let evnQDE = environment['status']['QDECREATED'];
                  if(getQdeStatus == 2) {
                    evnQDE = environment['status']['QDELEADASSIGNED'];
                  }
                  if(getQdeStatus == 3) {
                    evnQDE = environment['status']['QDELEADASSIGNEDL2RM'];
                  }
                  this.setStatusApiSub2 = this.qdeHttp.setStatusApi(applicationId, evnQDE).subscribe((response) => {
                    if (response["ProcessVariables"]["status"] == true) {
                      // this.cds.changePanSlide2(true);
                      this.router.navigate(['/applicant/' + this.qde.application.applicationId], { queryParams: { tabName: this.fragments[this.activeTab + 1], page: 1 } });
                    }
                  });

                } else {
                  this.goToExactPageAndTab(11, 1);
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
        }
        // , error => {
        //   this.isErrorModal = true;
        //   this.errorMessage = "Something went wrong, please try again later.";
        // }
      );
      } else {
        // set deupe is require
        this.qde.application.applicants[this.applicantIndex].dedupeDone = true;
        this.createOrUpdatePanDetailsSub2 = this.qdeHttp.createOrUpdatePanDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
          // If successfull
          if (response["ProcessVariables"]["status"] == true) {

            let result = this.parseJson(response["ProcessVariables"]["response"]);

            this.qde.application.applicationId = result['application']['applicationId'];

            // let isApplicantPresent:boolean = false;

            if ((result["application"]["applicants"]).length > 0) {

              this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(result['application']['applicationId'], result['application']['applicants'][0]['applicantId'] + "", 1, this.fragments[this.activeTab + 1], screenPages['applicantDetails']).subscribe(auditRes => {
                if (auditRes['ProcessVariables']['status'] == true) {
                  this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
                  this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
                  this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
                  this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
                }
              });

              // isApplicantPresent = applicants[this.applicantIndex].hasOwnProperty('applicantId');
              // this.qde.application.applicants[this.coApplicantIndex].applicantId =  applicants[this.coApplicantIndex]["applicantId"];
              let applicationId = result['application']['applicationId'];
              const getQdeStatus = this.qde.application.status;

                  let evnQDE = environment['status']['QDECREATED'];
                  if(getQdeStatus == 2) {
                    evnQDE = environment['status']['QDELEADASSIGNED'];
                  }
                  if(getQdeStatus == 3) {
                    evnQDE = environment['status']['QDELEADASSIGNEDL2RM'];
                  }
              this.setStatusApiSub2 = this.qdeHttp.setStatusApi(applicationId, evnQDE).subscribe((response) => {
                if (response["ProcessVariables"]["status"] == true) {
                  // this.cds.changePanSlide2(true);
                  this.router.navigate(['/applicant/' + this.qde.application.applicationId], { queryParams: { tabName: this.fragments[this.activeTab + 1], page: 1 } });
                }
              });

            } else {
              this.goToExactPageAndTab(11, 1);
              // this.goToNextSlide(swiperInstance);
              return;
            }
          } else {
            this.panErrorCount++;
            // this.isErrorModal = true;
            // this.errorMessage = "Something went wrong, please try again later.";
          }
        }
        // , (error) => {
        //   this.isErrorModal = true;
        //   this.errorMessage = "Something went wrong, please try again later.";
        // }
      );
      }

    }

  } catch (ex) {
        this.isErrorModal = true;
        this.errorMessage = ex.message;

        } finally {
          this.ngxService.stop();
        }
  }


  //-------------------------------------------------------------


  //-------------------------------------------------------------
  // Personal Details
  //-------------------------------------------------------------
  submitNameDetails(form: NgForm, swiperInstance1: Swiper, swiperInstance2: Swiper) {
    try {
      this.ngxService.start();
    if (this.isTBMLoggedIn) {
      this.goToNextSlide(swiperInstance1, swiperInstance2);
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

      this.createOrUpdatePersonalDetailsSub = this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
        // If successful
        if (response["ProcessVariables"]["status"]) {

          this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.applicantIndex]['applicantId'] + "", this.page, this.tabName, screenPages['applicantDetails']).subscribe(auditRes => {
            if (auditRes['ProcessVariables']['status'] == true) {
              this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
              this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
              this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
              this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
            }
          });

          let maleTitles = [];
          for (let i = 0; i < this.maleTitles.length; i++) {
            maleTitles.push(this.maleTitles[i].value);
            console.log("maleTiteles:" + maleTitles);
          }
          let femaleTitles = [];
          for (let i = 0; i < this.femaleTitles.length; i++) {
            femaleTitles.push(this.femaleTitles[i].value);
          }
          console.log("this.selectedTitle: ", this.selectedTitle);
          console.log("this.maleTitles: ", maleTitles.find(v => v == this.selectedTitle.value));
          console.log("this.femaleTiles: ", femaleTitles.find(v => v == this.selectedTitle.value));
          if (maleTitles.find(v => v == this.selectedTitle.value) != null) {
            this.qde.application.applicants[this.applicantIndex].personalDetails.gender = '1';
          }
          else if (femaleTitles.find(v => v == this.selectedTitle.value) != null) {
            this.qde.application.applicants[this.applicantIndex].personalDetails.gender = '2';
          }
          this.goToNextSlide(swiperInstance1, swiperInstance2);
        }
        // else {
        //   this.isErrorModal = true;
        //   this.errorMessage = "Something went wrong, please try again later."
        //     ;
        // }
      }
      // , (error) => {
      //   this.isErrorModal = true;
      //   this.errorMessage = "Something went wrong, please try again later."
      //     ;
      // }
    );
    }

  } catch (ex) {
        this.isErrorModal = true;
        this.errorMessage = ex.message;

        } finally {
          this.ngxService.stop();
        }

  }

  //-------------------------------------------------------------
  submitResidentialNon(value, swiperInstance1: Swiper, swiperInstance2: Swiper) {
    try {
      this.ngxService.start();
    if (this.isTBMLoggedIn) {
      if (value == 1) {
        this.qde.application.applicants[this.applicantIndex].personalDetails.applicantStatus = "1";
      } else {
        this.qde.application.applicants[this.applicantIndex].personalDetails.applicantStatus = "2";
      }
      this.goToNextSlide(swiperInstance1, swiperInstance2);
    } else {


      this.qde.application.applicants[this.applicantIndex].personalDetails.applicantStatus = value;

      this.createOrUpdatePersonalDetailsSub2 = this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
        // If successful
        if (response["ProcessVariables"]["status"]) {
          this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.applicantIndex]['applicantId'] + "", this.page, this.tabName, screenPages['applicantDetails']).subscribe(auditRes => {
            if (auditRes['ProcessVariables']['status'] == true) {
              this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
              this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
              this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
              this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
              this.goToNextSlide(swiperInstance1, swiperInstance2);
            }
          });
        }
        // else {
        //   this.isErrorModal = true;
        //   this.errorMessage = "Something went wrong, please again later.";
        // }
      }
      // , (error) => {
      //   this.isErrorModal = true;
      //   this.errorMessage = "Something went wrong, please again later.";
      // }
    );
    }

  } catch (ex) {
        this.isErrorModal = true;
        this.errorMessage = ex.message;

        } finally {
          this.ngxService.stop();
        }
  }

  submitGenderDetails(value, swiperInstance1: Swiper, swiperInstance2: Swiper) {
    try {
      this.ngxService.start();
    if (this.isTBMLoggedIn) {
      this.goToNextSlide(swiperInstance1,swiperInstance2);
    } else {
      this.qde.application.applicants[this.applicantIndex].personalDetails.gender = value;
      let result = this.setSpouseTitles();
      console.log("Spouse title"+result);
      let occType = this.qde.application.applicants[this.applicantIndex].occupation.occupationType;
      this.loadOccupationTypeLovs(occType);
      console.log("FILT: ", this.qdeService.getFilteredJson(this.qde));

      this.createOrUpdatePersonalDetailsSub3 = this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
        // If successful
        if (response["ProcessVariables"]["status"]) {
          this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.applicantIndex]['applicantId'] + "", this.page, this.tabName, screenPages['applicantDetails']).subscribe(auditRes => {
            if (auditRes['ProcessVariables']['status'] == true) {
              this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
              this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
              this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
              this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
            }
          });
          this.goToNextSlide(swiperInstance1, swiperInstance2);
          console.log(response['ProcessVariables']['response']);
        }
        // else {
        //   this.isErrorModal = true;
        //   this.errorMessage = "Something went wrong, please try again later.";
        // }
      }
      // , (error) => {
      //   this.isErrorModal = true;
      //   this.errorMessage = "Something went wrong, please try again later."
      //     ;
      // }
    );
    }

  } catch (ex) {
        this.isErrorModal = true;
        this.errorMessage = ex.message;

        } finally {
          this.ngxService.stop();
        }

  }

  //-------------------------------------------------------------

  submitQualificationDetails(form: NgForm, swiperInstance1: Swiper, swiperInstance2: Swiper) {
    try {
      this.ngxService.start();
    if (this.isTBMLoggedIn) {
      this.goToNextSlide(swiperInstance1,swiperInstance2);
    } else {
      event.preventDefault();

      if (form && !form.valid) {
        return;
      }

      this.qde.application.applicants[this.applicantIndex].personalDetails.qualification = form.value.qualification.value;

      console.log(this.qde.application.applicants[this.applicantIndex]);

      this.createOrUpdatePersonalDetailsSub4 = this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
        // If successful
        if (response["ProcessVariables"]["status"]) {
          this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.applicantIndex]['applicantId'] + "", this.page, this.tabName, screenPages['applicantDetails']).subscribe(auditRes => {
            if (auditRes['ProcessVariables']['status'] == true) {
              this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
              this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
              this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
              this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
            }
          });
          this.goToNextSlide(swiperInstance1,swiperInstance2);
        }
        // else {
        //   this.isErrorModal = true;
        //   this.errorMessage = "Something went wrong, please try again later.";
        // }
      }
      // , (error) => {
      //   this.isErrorModal = true;
      //   this.errorMessage = "Something went wrong, please try again later.";
      // }
    );
    }

} catch (ex) {
      this.isErrorModal = true;
      this.errorMessage = ex.message;

      } finally {
        this.ngxService.stop();
      }
  }

  onBirthDateChange(value: Date){

    this.ageError = false;

    let latest_date = this.datepipe.transform(value, 'dd-MMM-yyyy');

    let splitArr = latest_date.split('-');

    let day = splitArr[0];

    let month = splitArr[1].toUpperCase();

    let year = splitArr[2]

    this.dob =  { day: { key: day , value: day },
      month: { key: month, value: month },
      year: { key: year, value: year }
    }

    //  const dateofbirth = this.dateofBirthKendo;
      const dateofbirth = this.getFormattedDate(value);
      console.log("dateofbirth", dateofbirth);
      const d1: any = new Date(dateofbirth);
      const d2: any = new Date();
      var diff = d2 - d1;
      var age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
      if (age < Number(this.minMaxValues["Age_limit"].minValue)) {
        this.ageError = true;
        this.ageMaxError = false;
        return;
      }else if (age >  Number(this.minMaxValues["Age_limit"].maxValue)){
        
        this.isErrorModal = true;
        this.errorMessage = `Maximum age limit is ${this.minMaxValues["Age_limit"].maxValue}`;
        this.ageMaxError = true;
        this.ageError = false;
        return;
      } else {
        this.ageError = false;
        this.ageMaxError = false;
      }


  }


  submitDobDetails(form: NgForm, swiperInstance?: Swiper) {
    try {
      this.ngxService.start();
    console.log("isTBMLoggedIn: ", this.isTBMLoggedIn);
    if (this.isTBMLoggedIn) {
      this.goToExactPageAndTab(2, 1);
    } else {
      event.preventDefault();

      if (form && !form.valid) {
        return;
      }

      //const dateofbirth = form.value.year.value + '-' + form.value.month.value + '-' + form.value.day.value;

      const dateofbirth = this.dateofBirthKendo;

      console.log("dateofbirth", dateofbirth);
      const d1: any = new Date(dateofbirth);
      const d2: any = new Date();
      var diff = d2 - d1;
      var age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
      if (age < Number(this.minMaxValues["Age_limit"].minValue)) {
        this.ageError = true;
        return;
      }else if (age >  Number(this.minMaxValues["Age_limit"].maxValue)){
        this.isErrorModal = true;
        this.errorMessage = `Maximum age limit is ${this.minMaxValues["Age_limit"].maxValue}`;
        return;
      } else {
        this.ageError = false;
      }

      this.qde.application.applicants[this.applicantIndex].personalDetails.dob = form.value.year.value + '-' + form.value.month.value + '-' + form.value.day.value;
      this.qde.application.applicants[this.applicantIndex].personalDetails.birthPlace = form.value.birthPlace;

      console.log(this.qde.application.applicants[this.applicantIndex]);

      this.createOrUpdatePersonalDetailsSub5 = this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
        // If successful
        if (response["ProcessVariables"]["status"]) {
          this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.applicantIndex]['applicantId'] + "", this.page, this.tabName, screenPages['applicantDetails']).subscribe(auditRes => {
            if (auditRes['ProcessVariables']['status'] == true) {
              this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
              this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
              this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
              this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
            }
          }, error => {
            this.isErrorModal = true;
            this.errorMessage = "Something went wrong, please try again later.";
          });
          //  check if pan is null or empty and dedupe is false
          if (this.qde.application.applicants[this.applicantIndex].pan.panNumber !="" 
            && this.qde.application.applicants[this.applicantIndex].pan.panNumber !=null 
            && this.qde.application.applicants[this.applicantIndex].dedupeDone == false) {

              this.qdeHttp.duplicateApplicantCheck(this.qde.application.applicants[this.applicantIndex].applicantId).subscribe(res => {

                if (res['ProcessVariables']['status'] == true) {
                  if (res['ProcessVariables']['response'] == '' || res['ProcessVariables']['response'] == null) {
                    this.closeDuplicateModal();
                  } else {
                    this.duplicates = JSON.parse(res['ProcessVariables']['response'])['duplicates'];
                    if (this.duplicates.length > 0) {
                      this.openDuplicateModal();
                    }
                  }
                } 
                // else {
                //   this.isErrorModal = true;
                //   this.errorMessage = "Something went wrong, please try again later.";
                // }
              }
              // , error => {
              //   this.isErrorModal = true;
              //   this.errorMessage = "Something went wrong, please try again later.";
              // }
              );
          } else {
            this.closeDuplicateModal();
            }
          } 
        //   else {
        //     this.isErrorModal = true;
        //     this.errorMessage = "Something went wrong, please try again later.";
        // }
        // else {
        //   this.isErrorModal = true;
        //   this.errorMessage = "Something went wrong, please try again later.";
        // }
      }
      // , (error) => {
      //   this.isErrorModal = true;
      //   this.errorMessage = "Something went wrong, please try again later.";
      // }
    );
    }

  } catch (ex) {
        this.isErrorModal = true;
        this.errorMessage = ex.message;

        } finally {
          this.ngxService.stop();
        }
  }
  //-------------------------------------------------------------


  //-------------------------------------------------------------
  // Contact Details
  //-------------------------------------------------------------
  submitContactDetails(form: NgForm) {
    try {
      this.ngxService.start();
    if (this.isTBMLoggedIn) {
      this.contactExtraFieldRemoval();
      this.goToExactPageAndTab(3, 1);
    } else {

      event.preventDefault();

      if (form && !form.valid) {
        return;
      }

      this.qde.application.applicants[this.applicantIndex].contactDetails.preferredEmailId = form.value.preferEmailId;
      this.qde.application.applicants[this.applicantIndex].contactDetails.alternateEmailId = form.value.alternateEmailId;
      this.qde.application.applicants[this.applicantIndex].contactDetails.mobileNumber = form.value.mobileNumber;
      this.qde.application.applicants[this.applicantIndex].contactDetails.alternateMobileNumber = form.value.alternateMobileNumber;
      this.qde.application.applicants[this.applicantIndex].contactDetails.residenceNumber = form.value.residenceNumber1 + '-' + form.value.residenceNumber2;
      this.qde.application.applicants[this.applicantIndex].contactDetails.alternateResidenceNumber = form.value.alternateResidenceNumberStd1 + '-' + form.value.alternateResidenceNumber2;



      console.log("CONTACT DETAILS", this.qde.application.applicants[this.applicantIndex]);
      this.createOrUpdatePersonalDetailsSub6 = this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
        // If successful
        if (response["ProcessVariables"]["status"]) {
          this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.applicantIndex]['applicantId'] + "", this.page, this.tabName, screenPages['applicantDetails']).subscribe(auditRes => {
            if (auditRes['ProcessVariables']['status'] == true) {
              this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
              this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
              this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
              this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
            }
          });
          this.contactExtraFieldRemoval();
          this.goToExactPageAndTab(3, 1);
        }
        // else {
        //   this.isErrorModal = true;
        //   this.errorMessage = "Something went wrong, please try again later.";
        // }
      }
      // , (error) => {
      //   this.isErrorModal = true;
      //   this.errorMessage = "Something went wrong, please try again later.";
      // }
    );

    }

  } catch (ex) {
        this.isErrorModal = true;
        this.errorMessage = ex.message;

        } finally {
          this.ngxService.stop();
        }


  }

  onPinCodeChange(event, screenName) {
    if(event.target.value.length < 6 || event.target.validity.valid == false) {
      return;
    }
    console.log(event.target.value);
    let zipCode = event.target.value

    if (zipCode.length != 0) {
      this.getCityAndStateSub = this.qdeHttp.getCityAndState(zipCode).subscribe((response) => {

        if (response['Error'] == '0') {
          var result = JSON.parse(response["ProcessVariables"]["response"]);

          this.commCityState = "";

          if (result.city != null && result.state != null && result.city != "" && result.state != "") {
            this.commCityState = result.city + " " + result.state;
          } else {
            this.isApplicantPinModal = true;
            // this.isWrongPinButtonDisabled = false;
            // alert("Pin code not available / enter proper pincode");
          }

          this.qde.application.applicants[this.applicantIndex][screenName].zipcodeId = result.zipcodeId;
          this.qde.application.applicants[this.applicantIndex][screenName].stateId = result.stateId;
          this.qde.application.applicants[this.applicantIndex][screenName].cityId = result.cityId;


          this.qde.application.applicants[this.applicantIndex][screenName].city = result.city;
          this.qde.application.applicants[this.applicantIndex][screenName].state = result.state;
          this.qde.application.applicants[this.applicantIndex][screenName].cityState = this.commCityState || "";
        }
        // else if (response['Error'] == '1') {
        //   this.isErrorModal = true;
        //   this.errorMessage = "Something went wrong, please try again later.";
        // } else {
        //   this.isErrorModal = true;
        //   this.errorMessage = "Something went wrong, please try again later.";
        // }

      }
      // , error => {
      //   this.isErrorModal = true;
      //   this.errorMessage = "Something went wrong, please try again later.";
      // }
    );
    } else {
      this.qde.application.applicants[this.applicantIndex][screenName].zipcodeId = "";
      this.qde.application.applicants[this.applicantIndex][screenName].stateId = "";
      this.qde.application.applicants[this.applicantIndex][screenName].cityId = "";


      this.qde.application.applicants[this.applicantIndex][screenName].city = "";
      this.qde.application.applicants[this.applicantIndex][screenName].state = "";
      this.qde.application.applicants[this.applicantIndex][screenName].cityState = "";
	  }
  }
  //-------------------------------------------------------------

  //-------------------------------------------------------------
  // Communication Details
  //-------------------------------------------------------------
  submitCommunicationAddressDetails(form: NgForm) {
    try {
      this.ngxService.start();
    if (this.isTBMLoggedIn) {
      this.goToExactPageAndTab(4, 1);
    } else {
      //  event.preventDefault();

      console.log("form && !form.valid: ", form && !form.valid);
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
      this.qde.application.applicants[this.applicantIndex].communicationAddress.numberOfYearsInCurrentResidence = form.value.numberOfYearsInCurrentResidence;
      this.qde.application.applicants[this.applicantIndex].communicationAddress.permanentAddress = form.value.permanentAddress;
      if (this.preferedMailingAddress == undefined || this.preferedMailingAddress == null) {
        this.preferedMailingAddress = true;
        this.qde.application.applicants[this.applicantIndex].communicationAddress.preferedMailingAddress = this.preferedMailingAddress;
        this.qde.application.applicants[this.applicantIndex].permanentAddress.preferedMailingAddress = this.preferedMailingAddress != true;
      }
      else {
        this.qde.application.applicants[this.applicantIndex].communicationAddress.preferedMailingAddress = this.preferedMailingAddress;        
        this.qde.application.applicants[this.applicantIndex].permanentAddress.preferedMailingAddress = this.preferedMailingAddress != true;
      }

      this.qde.application.applicants[this.applicantIndex].permanentAddress.addressLineOne = form.value.pAddressLineOne;
      this.qde.application.applicants[this.applicantIndex].permanentAddress.addressLineTwo = form.value.pAddressLineTwo;
      this.qde.application.applicants[this.applicantIndex].permanentAddress.zipcodeId = this.qde.application.applicants[this.applicantIndex].permanentAddress.zipcodeId;
      this.qde.application.applicants[this.applicantIndex].permanentAddress.cityId = this.qde.application.applicants[this.applicantIndex].permanentAddress.cityId;
      this.qde.application.applicants[this.applicantIndex].permanentAddress.stateId = this.qde.application.applicants[this.applicantIndex].permanentAddress.stateId;
      this.qde.application.applicants[this.applicantIndex].permanentAddress.numberOfYearsInCurrentResidence = form.value.numberOfYearsInCurrentResidence;


      console.log(this.qde.application.applicants[this.applicantIndex].communicationAddress);
      console.log(this.qde.application.applicants[this.applicantIndex].permanentAddress);

      this.createOrUpdatePersonalDetailsSub7 = this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
        // If successful
        if (response["ProcessVariables"]["status"]) {
          this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.applicantIndex]['applicantId'] + "", this.page, this.tabName, screenPages['applicantDetails']).subscribe(auditRes => {
            if (auditRes['ProcessVariables']['status'] == true) {
              this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
              this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
              this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
              this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
            }
          });
          this.goToExactPageAndTab(4, 1);
        }
        // else {
        //   this.isErrorModal = true;
        //   this.errorMessage = "Something went wrong, please try again later.";
        // }
      }
      // , (error) => {
      //   this.isErrorModal = true;
      //   this.errorMessage = "Something went wrong, please try again later.";
      // }
    );
    }

  } catch (ex) {
        this.isErrorModal = true;
        this.errorMessage = ex.message;

        } finally {
          this.ngxService.stop();
        }

  }

  submitPreferedMail(flag) {
    this.preferedMailingAddress = flag;
    if ( flag){   
    this.qde.application.applicants[this.applicantIndex].communicationAddress.preferedMailingAddress = true;
    this.qde.application.applicants[this.applicantIndex].permanentAddress.preferedMailingAddress = false
    } else{      
      this.qde.application.applicants[this.applicantIndex].permanentAddress.preferedMailingAddress = true;
      this.qde.application.applicants[this.applicantIndex].communicationAddress.preferedMailingAddress = false;
    }
   
  }


  //-------------------------------------------------------------
  // Marital Status
  //-------------------------------------------------------------
  submitMaritalStatus(form: NgForm, swiperInstance1: Swiper, swiperInstance2: Swiper) {
    try {
      this.ngxService.start();
    if (this.isTBMLoggedIn) {
      if (form.value.maritalStatus.value == "2") {
        this.goToNextSlide(swiperInstance1, swiperInstance2);
      } else {
        this.qde.application.applicants[this.applicantIndex].maritalStatus.spouseTitle = null;
        this.qde.application.applicants[this.applicantIndex].maritalStatus.firstName = "";
        this.qde.application.applicants[this.applicantIndex].maritalStatus.amount = null
        this.goToExactPageAndTab(5, 1);
      }
    } else {

      if (form && !form.valid) {
        return;
      }

      this.qde.application.applicants[this.applicantIndex].maritalStatus.status = form.value.maritalStatus.value;


      this.createOrUpdatePersonalDetailsSub8 = this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
        // If successful
        if (response["ProcessVariables"]["status"]) {
          // Dont show spouse details for Single
          this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.applicantIndex]['applicantId'] + "", this.page, this.tabName, screenPages['applicantDetails']).subscribe(auditRes => {
            if (auditRes['ProcessVariables']['status'] == true) {
              this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
              this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
              this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
              this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
            }
          });
          console.log("Marital Status: ", form.value.maritalStatus.value);
          if (form.value.maritalStatus.value == "2") {
            this.goToNextSlide(swiperInstance1, swiperInstance2);
          } else {
            this.qde.application.applicants[this.applicantIndex].maritalStatus.spouseTitle = null;
            this.qde.application.applicants[this.applicantIndex].maritalStatus.firstName = "";
            this.qde.application.applicants[this.applicantIndex].maritalStatus.amount = null
            this.goToExactPageAndTab(5, 1);
          }
        }
        // else {
        //   this.isErrorModal = true;
        //   this.errorMessage = "Something went wrong, please try again later.";
        // }
      }
      // , (error) => {
      //   this.isErrorModal = true;
      //   this.errorMessage = "Something went wrong, please try again later.";
      // }
    );
    }

  } catch (ex) {
        this.isErrorModal = true;
        this.errorMessage = ex.message;

        } finally {
          this.ngxService.stop();
        }

  }

  submitSpouseName(form: NgForm, swiperInstance1: Swiper, swiperInstance2: Swiper) {
    try {
      this.ngxService.start();
    if (this.isTBMLoggedIn) {
      this.goToNextSlide(swiperInstance1, swiperInstance2);
    } else {
      if (form && !form.valid) {
        return;
      }

      this.qde.application.applicants[this.applicantIndex].maritalStatus.spouseTitle = form.value.spouseTitle.value;
      this.qde.application.applicants[this.applicantIndex].maritalStatus.firstName = form.value.firstName;

      console.log(this.qde.application.applicants[this.applicantIndex].maritalStatus);
      this.createOrUpdatePersonalDetailsSub9 = this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
        // If successful
        if (response["ProcessVariables"]["status"]) {
          this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.applicantIndex]['applicantId'] + "", this.page, this.tabName, screenPages['applicantDetails']).subscribe(auditRes => {
            if (auditRes['ProcessVariables']['status'] == true) {
              this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
              this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
              this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
              this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
            }
          });
          this.goToNextSlide(swiperInstance1, swiperInstance2);
        }
        // else {
        //   this.isErrorModal = true;
        //   this.errorMessage = "Something went wrong, please try again later.";
        // }
      }
      // , (error) => {
      //   this.isErrorModal = true;
      //   this.errorMessage = "Something went wrong, please try again later.";
      // }
    );

    }

  } catch (ex) {
        this.isErrorModal = true;
        this.errorMessage = ex.message;

        } finally {
          this.ngxService.stop();
        }
  }



  submitSpouseEarning(value, swiperInstance1: Swiper, swiperInstance2: Swiper) {
    try {
      this.ngxService.start();
    if (this.isTBMLoggedIn) {
      if (value == 1) {
        this.goToNextSlide(swiperInstance1, swiperInstance2);
      } else {
        this.qde.application.applicants[this.applicantIndex].maritalStatus.amount = null;
        this.goToExactPageAndTab(5, 1);
      }
    } else {
      this.qde.application.applicants[this.applicantIndex].maritalStatus.earning = (value == 1) ? true : false;

      console.log(this.qde.application.applicants[this.applicantIndex].maritalStatus);
      this.createOrUpdatePersonalDetailsSub10 = this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
        // If successful
        if (response["ProcessVariables"]["status"]) {
          this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.applicantIndex]['applicantId'] + "", this.page, this.tabName, screenPages['applicantDetails']).subscribe(auditRes => {
            if (auditRes['ProcessVariables']['status'] == true) {
              this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
              this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
              this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
              this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
            }
          });
          if (value == 1) {
            this.goToNextSlide(swiperInstance1,swiperInstance2);
          } else {
            this.qde.application.applicants[this.applicantIndex].maritalStatus.amount = null;
            this.goToExactPageAndTab(5, 1);
          }
        }
        // else {
        //   this.isErrorModal = true;
        //   this.errorMessage = "Something went wrong, please try again later.";
        // }
      }
      // , (error) => {
      //   this.isErrorModal = true;
      //   this.errorMessage = "Something went wrong, please try again later.";
      // }
    );

    }

  } catch (ex) {
        this.isErrorModal = true;
        this.errorMessage = ex.message;

        } finally {
          this.ngxService.stop();
        }

  }

  submitSpouseEarningAmt(form: NgForm, swiperInstance1: Swiper, swiperInstance2: Swiper) {
    try {
      this.ngxService.start();
    if (this.isTBMLoggedIn) {
      this.goToExactPageAndTab(5, 1);
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

      this.createOrUpdatePersonalDetailsSub11 = this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
        // If successful
        if (response["ProcessVariables"]["status"]) {
          this.goToExactPageAndTab(5, 1);
        }
        // else {
        //   this.isErrorModal = true;
        //   this.errorMessage = "Something went wrong, please try again later.";
        // }
      }
      // , (error) => {
      //   this.isErrorModal = true;
      //   this.errorMessage = "Something went wrong, please try again later.";
      // }
    );
    }

  } catch (ex) {
        this.isErrorModal = true;
        this.errorMessage = ex.message;

        } finally {
          this.ngxService.stop();
        }

  }

  //-------------------------------------------------------------


  //-------------------------------------------------------------
  // Family Details
  //-------------------------------------------------------------
  submitFamilyForm1(form: NgForm, swiperInstance1: Swiper, swiperInstance2: Swiper) {
    try {
      this.ngxService.start();
    if (this.isTBMLoggedIn) {
      this.goToNextSlide(swiperInstance1, swiperInstance2);
    } else {
      if (form && !form.valid) {
        return;
      }

      this.qde.application.applicants[this.applicantIndex].familyDetails.numberOfDependents = form.value.numberOfDependents;

      console.log(this.qde.application.applicants[this.applicantIndex].familyDetails);

      this.createOrUpdatePersonalDetailsSub12 = this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
        // If successful
        if (response["ProcessVariables"]["status"]) {
          this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.applicantIndex]['applicantId'] + "", this.page, this.tabName, screenPages['applicantDetails']).subscribe(auditRes => {
            if (auditRes['ProcessVariables']['status'] == true) {
              this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
              this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
              this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
              this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
            }
          });
          this.goToNextSlide(swiperInstance1,swiperInstance2);
        }
        // else {
        //   this.isErrorModal = true;
        //   this.errorMessage = "Something went wrong, please try again later.";
        // }
      }
      // , (error) => {
      //   this.isErrorModal = true;
      //   this.errorMessage = "Something went wrong, please try again later.";
      // }
    );

    }

  } catch (ex) {
        this.isErrorModal = true;
        this.errorMessage = ex.message;

        } finally {
          this.ngxService.stop();
        }

  }

  submitFamilyForm2(form: NgForm, swiperInstance1: Swiper, swiperInstance2: Swiper) {
    try {
      this.ngxService.start();
    if (this.isTBMLoggedIn) {
      this.goToExactPageAndTab(6, 1);
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

      this.createOrUpdatePersonalDetailsSub13 = this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
        // If successful
        if (response["ProcessVariables"]["status"]) {
          this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.applicantIndex]['applicantId'] + "", this.page, this.tabName, screenPages['applicantDetails']).subscribe(auditRes => {
            if (auditRes['ProcessVariables']['status'] == true) {
              this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
              this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
              this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
              this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
            }
          });
          this.goToExactPageAndTab(6, 1);
        }
        // else {
        //   this.isErrorModal = true;
        //   this.errorMessage = "Something went wrong, please try again later.";
        // }
      }
      // , (error) => {
      //   this.isErrorModal = true;
      //   this.errorMessage = "Something went wrong, please try again later.";
      // }
    );
    }

  } catch (ex) {
        this.isErrorModal = true;
        this.errorMessage = ex.message;

        } finally {
          this.ngxService.stop();
        }

  }
  //-------------------------------------------------------------



  //-------------------------------------------------------------
  // Other Details
  //-------------------------------------------------------------
  submitOtherForm(form: NgForm) {
    try {
      this.ngxService.start();
    if (this.isTBMLoggedIn) {
      this.goToExactPageAndTab(7, 1);
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

      this.createOrUpdatePersonalDetailsSub14 = this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
        // If successful
        if (response["ProcessVariables"]["status"]) {
          this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.applicantIndex]['applicantId'] + "", this.page, this.tabName, screenPages['applicantDetails']).subscribe(auditRes => {
            if (auditRes['ProcessVariables']['status'] == true) {
              this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
              this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
              this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
              this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
            }
          });
          this.goToExactPageAndTab(7, 1);
        }
        // else {
        //   this.isErrorModal = true;
        //   this.errorMessage = "Something went wrong, please try again later.";
        // }
      }
      // , (error) => {
      //   this.isErrorModal = true;
      //   this.errorMessage = "Something went wrong, please try again later.";
      // }
    );
    }

  } catch (ex) {
        this.isErrorModal = true;
        this.errorMessage = ex.message;

        } finally {
          this.ngxService.stop();
        }

  }
  //-------------------------------------------------------------


  //-------------------------------------------------------------
  // Occupation Details
  //-------------------------------------------------------------


  submitOccupationDetails(form: NgForm, swiperInstance1: Swiper, swiperInstance2:Swiper) {
    try {
      this.ngxService.start();
    if (this.isTBMLoggedIn) {


      /*********************************************************************************************************
      * If Salaried, Self Employed Professional, Self Employed Business then only show income consider
      *********************************************************************************************************/
      let data = {
        // this.selectedOccupation.value.toString()
        profileId: form.value.occupationType.value
      }
      this.qdeHttp.checkOccupationType(data).subscribe((response) => {

        if (response["ProcessVariables"]["status"]) {
          this.isOfficialCorrs = response["ProcessVariables"]["incomeConsider"];
        }

        if (this.isOfficialCorrs) {
          // this.isApplicantRouteModal = true
          this.goToNextSlide(swiperInstance1, swiperInstance2);
        } else {
          this.goToExactPageAndTab(9, 1);
        }


      }, (error) => {
        // this.isErrorModal = true;
        // this.errorMessage = "Something went wrong, please again later.";
      });




    } else {

      if (form && !form.valid) {
        return;
      }



      let data = {
        // profileId: this.selectedOccupation.value.toString()
        profileId: form.value.occupationType.value
      };

      this.qdeHttp.checkOccupationType(data).subscribe((response) => {
        // console.log("mainhudonfdnbhkdbsfkhgjkfhdjkghfrjkghfksdghkdfsyufk",response)

        if (response["ProcessVariables"]["status"]) {
          this.isOfficialCorrs = response["ProcessVariables"]["incomeConsider"];
        }

        this.qde.application.applicants[this.applicantIndex].occupation.occupationType = form.value.occupationType.value;

        if (this.isOfficialCorrs) {
          this.qde.application.applicants[this.applicantIndex].occupation.companyName = form.value.companyName;
        }

        if (form.value.numberOfYearsInCurrentCompany != null) {
          this.qde.application.applicants[this.applicantIndex].occupation.numberOfYearsInCurrentCompany = form.value.numberOfYearsInCurrentCompany;
        } else {
          this.qde.application.applicants[this.applicantIndex].occupation.numberOfYearsInCurrentCompany = 0;
        }

        if (form.value.totalExperienceYear != null) {
          this.qde.application.applicants[this.applicantIndex].occupation.totalWorkExperience = form.value.totalExperienceYear;
        } else {
          this.qde.application.applicants[this.applicantIndex].occupation.totalWorkExperience = 0;
        }

        // Housewife and non-working
        if (!this.isOfficialCorrs) {
          this.qde.application.applicants[this.applicantIndex].incomeDetails.incomeConsider = false;
        }

        this.createOrUpdatePersonalDetailsSub15 = this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
          // If successful
          if (response["ProcessVariables"]["status"]) {
            this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.applicantIndex]['applicantId'] + "", this.page, this.tabName, screenPages['applicantDetails']).subscribe(auditRes => {
              if (auditRes['ProcessVariables']['status'] == true) {
                this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
                this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
                this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
                this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
              }
            });

            /*********************************************************************************************************
            * If Salaried, Self Employed Professional, Self Employed Business, Retired then only show income consider
            *********************************************************************************************************/
            if (this.isOfficialCorrs) {
              // this.isApplicantRouteModal = true
              this.goToNextSlide(swiperInstance1, swiperInstance2);
            } else {
              this.goToExactPageAndTab(9, 1);
            }

          }
          // else {
          //   this.isErrorModal = true;
          //   this.errorMessage = "Something went wrong, please again later.";
          // }
        }
        // , (error) => {
        //   this.isErrorModal = true;
        //   this.errorMessage = "Something went wrong, please try again later.";
        // }
      );


      }
      // , (error) => {
      //   this.isErrorModal = true;
      //   this.errorMessage = "Something went wrong, please try again later.";
      // }
    );

    }

  } catch (ex) {
        this.isErrorModal = true;
        this.errorMessage = ex.message;

        } finally {
          this.ngxService.stop();
        }
  }
  //-------------------------------------------------------------


  //-------------------------------------------------------------
  // Official Correspondence
  //-------------------------------------------------------------
  submitOfficialCorrespondence(form: NgForm) {
    try {
      this.ngxService.start();
    if (this.isTBMLoggedIn) {
      this.goToExactPageAndTab(9, 1);
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
      this.qde.application.applicants[this.applicantIndex].officialCorrespondence.officeNumber = form.value.stdCode + '-' + form.value.offStdNumber;
      this.qde.application.applicants[this.applicantIndex].officialCorrespondence.officeEmailId = form.value.officeEmail;

      console.log("submitOfficialCorrespondence: ", this.qde.application.applicants[this.applicantIndex].officialCorrespondence);

      this.createOrUpdatePersonalDetailsSub16 = this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
        // If successful
        if (response["ProcessVariables"]["status"]) {
          this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.applicantIndex]['applicantId'] + "", this.page, this.tabName, screenPages['applicantDetails']).subscribe(auditRes => {
            if (auditRes['ProcessVariables']['status'] == true) {
              this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
              this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
              this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
              this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
            }
          });
          this.router.navigate([], { queryParams: { tabName: 'income1', page: 1 } });
          // this.goToExactPageAndTab(9, 1,true);
        }
        // else {
        //   this.isErrorModal = true;
        //   this.errorMessage = "Something went wrong, please try again later.";
        // }
      }
      // , (error) => {
      //   this.isErrorModal = true;
      //   this.errorMessage = "Something went wrong, please try again later.";
      // }
    );
    }

  } catch (ex) {
        this.isErrorModal = true;
        this.errorMessage = ex.message;

        } finally {
          this.ngxService.stop();
        }

  }
  //-------------------------------------------------------------


  //-------------------------------------------------------------
  // Organization Details
  //-------------------------------------------------------------
  submitOrganizationDetails(form: NgForm) {
    try {
      this.ngxService.start();
    if (this.isTBMLoggedIn) {
      this.goToExactPageAndTab(12, 1);
    } else {
      if (form && !form.valid) {
        return;
      }

      console.log(form);
      this.qde.application.applicants[this.applicantIndex].organizationDetails.nameOfOrganization = form.value.orgName;
      this.qde.application.applicants[this.applicantIndex].organizationDetails.dateOfIncorporation = form.value.year.value + '-' + form.value.month.value + '-' + form.value.day.value;
      this.qde.application.applicants[this.applicantIndex].organizationDetails.constitution = form.value.constitution.value;

      console.log(this.qde.application.applicants[this.applicantIndex].organizationDetails);

      this.createOrUpdatePersonalDetailsSub17 = this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
        // If successful
        if (response["ProcessVariables"]["status"]) {
          this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.applicantIndex]['applicantId'] + "", this.page, this.tabName, screenPages['applicantDetails']).subscribe(auditRes => {
            if (auditRes['ProcessVariables']['status'] == true) {
              this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
              this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
              this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
              this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
            }
          });
          let result = this.parseJson(response["ProcessVariables"]["response"]);
          //  check if pan is null or empty
          if (this.qde.application.applicants[this.applicantIndex].pan.panNumber !="" 
            && this.qde.application.applicants[this.applicantIndex].pan.panNumber !=null) {
          this.qdeHttp.duplicateApplicantCheck(this.qde.application.applicants[this.applicantIndex].applicantId).subscribe(res => {

            if (res['ProcessVariables']['status'] == true) {
              if (res['ProcessVariables']['response'] == '' || res['ProcessVariables']['response'] == null) {
                this.closeDuplicateModal();
              } else {
                this.duplicates = JSON.parse(res['ProcessVariables']['response'])['duplicates'];
                if (this.duplicates.length > 0) {
                  this.openDuplicateModal();
                }
              }
            }
          });
          // this.goToExactPageAndTab(12, 1);
        } else {
          this.closeDuplicateModal();
        }
        } else {
          this.isErrorModal = true;
          this.errorMessage = "Something went wrong, please try again later.";
        }
        // else {
        //   this.isErrorModal = true;
        //   this.errorMessage = "Something went wrong, please try again later.";
        // }
      }
      // , (error) => {
      //   this.isErrorModal = true;
      //   this.errorMessage = "Something went wrong, please try again later.";
      // }
    );
    }

  } catch (ex) {
        this.isErrorModal = true;
        this.errorMessage = ex.message;

        } finally {
          this.ngxService.stop();
        }

  }


  //-------------------------------------------------------------
  // Registered Address
  //-------------------------------------------------------------
  submitRegisteredAddress(form: NgForm) {
    try {
      this.ngxService.start();
    if (this.isTBMLoggedIn) {
      this.goToExactPageAndTab(13, 1);
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
        if (response["ProcessVariables"]["status"]) {
          this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.applicantIndex]['applicantId'] + "", this.page, this.tabName, screenPages['applicantDetails']).subscribe(auditRes => {
            if (auditRes['ProcessVariables']['status'] == true) {
              this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
              this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
              this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
              this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
            }
          });
          this.goToExactPageAndTab(13, 1);
        }
        // else {
        //   this.isErrorModal = true;
        //   this.errorMessage = "Something went wrong, please try again later.";
        // }
      }
      // , (error) => {
      //   this.isErrorModal = true;
      //   this.errorMessage = "Something went wrong, please try again later.";
      // }
    );
    }

  } catch (ex) {
        this.isErrorModal = true;
        this.errorMessage = ex.message;

        } finally {
          this.ngxService.stop();
        }

  }


  //-------------------------------------------------------------
  // Corporate Address
  //-------------------------------------------------------------
  submitCorporateAddress(form: NgForm) {
    try {
      this.ngxService.start();
    if (this.isTBMLoggedIn) {
      this.goToExactPageAndTab(14, 1);
    } else {
      if (form && !form.valid) {
        return;
      }

      // let zipCityStateID = this.qde.application.applicants[this.coApplicantIndex].corporateAddress.zipCityStateID

      // let zipId = zipCityStateID.split(',')[0] || "";
      // let cityId = zipCityStateID.split(',')[1] || "";
      // let stateId = zipCityStateID.split(',')[2] || "";


      this.qde.application.applicants[this.applicantIndex].corporateAddress.corporateAddress = form.value.corpAddress;
      this.qde.application.applicants[this.applicantIndex].corporateAddress.landMark = form.value.landmark;
      this.qde.application.applicants[this.applicantIndex].corporateAddress.zipcodeId = this.qde.application.applicants[this.applicantIndex].corporateAddress.zipcodeId;
      this.qde.application.applicants[this.applicantIndex].corporateAddress.cityId = this.qde.application.applicants[this.applicantIndex].corporateAddress.cityId;
      this.qde.application.applicants[this.applicantIndex].corporateAddress.stateId = this.qde.application.applicants[this.applicantIndex].corporateAddress.stateId;

      this.qde.application.applicants[this.applicantIndex].corporateAddress.stdNumber = form.value.stdNumber + "-" + form.value.phoneNumber;
      this.qde.application.applicants[this.applicantIndex].corporateAddress.officeEmailId = form.value.officeEmailId;


      console.log(this.qde.application.applicants[this.applicantIndex].corporateAddress);

      this.createOrUpdatePersonalDetailsSub19 = this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
        // If successfull
        if (response["ProcessVariables"]["status"]) {
          this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.applicantIndex]['applicantId'] + "", this.page, this.tabName, screenPages['applicantDetails']).subscribe(auditRes => {
            if (auditRes['ProcessVariables']['status'] == true) {
              this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
              this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
              this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
              this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
            }
          });
          this.goToExactPageAndTab(14, 1);
        }
        // else {
        //   this.isErrorModal = true;
        //   this.errorMessage = "Something went wrong, please try again later.";
        // }
      }
      // , (error) => {
      //   this.isErrorModal = true;
      //   this.errorMessage = "Something went wrong, please try again later.";
      // }
    );
    }

  } catch (ex) {
        this.isErrorModal = true;
        this.errorMessage = ex.message;

        } finally {
          this.ngxService.stop();
        }

  }


  //-------------------------------------------------------------
  // Revenue Details
  //-------------------------------------------------------------
  submitRevenueDetails(form: NgForm) {
    try {
      this.ngxService.start();
    if (this.isTBMLoggedIn) {
      this.goToExactPageAndTab(15, 1);
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
        if (response["ProcessVariables"]["status"]) {
          this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.applicantIndex]['applicantId'] + "", this.page, this.tabName, screenPages['applicantDetails']).subscribe(auditRes => {
            if (auditRes['ProcessVariables']['status'] == true) {
              this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
              this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
              this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
              this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
            }
          });
          this.goToExactPageAndTab(15, 1);
        }
        // else {
        //   this.isErrorModal = true;
        //   this.errorMessage = "Something went wrong, please try again later.";
        // }
      }
      // , (error) => {
      //   this.isErrorModal = true;
      //   this.errorMessage = "Something went wrong, please try again later.";
      // }
    );
    }

  } catch (ex) {
        this.isErrorModal = true;
        this.errorMessage = ex.message;

        } finally {
          this.ngxService.stop();
        }
  }

  //-----------------------------------------------------------------------
  // Income Details
  //-----------------------------------------------------------------------

  submitAnnualFamilyIncome(form: NgForm, swiperInstance1: Swiper, swiperInstance2: Swiper) {
    try {
      this.ngxService.start();
    if (this.isTBMLoggedIn) {
      this.router.navigate(['/applicant', this.qde.application.applicants[this.applicantIndex].applicantId, 'co-applicant']);
    }else if (!this.qde.application.applicants[this.applicantIndex].contactDetails.isMobileOTPverified &&
      this.qde.application.applicants[this.applicantIndex].isIndividual ) {
      this.isErrorModal = true;
        this.errorMessage = "Contact Number/ Mobile Number not Verified.. Please Verify..."
    } else {
      if (form && !form.valid) {
        return;
      }

      this.qde.application.applicants[this.applicantIndex].incomeDetails.annualFamilyIncome = form.value.annualFamilyIncome ? form.value.annualFamilyIncome : "";
      this.qde.application.applicants[this.applicantIndex].incomeDetails.monthlyExpenditure = form.value.monthlyExpenditure ? form.value.monthlyExpenditure : "";

      // this.qde.application.applicants[this.applicantIndex].incomeDetails.incomeConsider = form.value.incomeConsider;
      // this.qde.application.applicants[this.applicantIndex].incomeDetails.monthlyIncome = form.value.monthlyIncome;
      // this.qde.application.applicants[this.applicantIndex].incomeDetails.assessmentMethodology = form.value.assessmentMethodology;

      console.log("INCOME DETAILS: ", this.qde.application.applicants[this.applicantIndex].incomeDetails);

      this.createOrUpdatePersonalDetailsSub21 = this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
        // If successfull
        if (response["ProcessVariables"]["status"]) {
          this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.applicantIndex]['applicantId'] + "", this.page, this.tabName, screenPages['applicantDetails']).subscribe(auditRes => {
            if (auditRes['ProcessVariables']['status'] == true) {
              this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
              this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
              this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
              this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
            }
          });

          // Show Proceed Modal
            this.isApplicantRouteModal = true;
        }
        // else {
        //   this.isErrorModal = true;
        //   this.errorMessage = "Something went wrong, please try again later.";
        // }
      }
      // , (error) => {
      //   this.isErrorModal = true;
      //   this.errorMessage = "Something went wrong, please try again later.";
      // }
    );

    }

  } catch (ex) {
        this.isErrorModal = true;
        this.errorMessage = ex.message;

        } finally {
          this.ngxService.stop();
        }
  }


  submitMonthlyIncomeIndividual(form: NgForm, swiperInstance1: Swiper, swiperInstance2: Swiper) {
    try {
      this.ngxService.start();
    if (this.isTBMLoggedIn) {
      this.goToNextSlide(swiperInstance1, swiperInstance2);
    } else {
      event.preventDefault();

      if (form && !form.valid) {
        return;
      }

      this.qde.application.applicants[this.applicantIndex].incomeDetails.monthlyIncome = form.value.monthlyIncome;
      this.qde.application.applicants[this.applicantIndex].incomeDetails.assessmentMethodology = form.value.assessmentMethodology.value;
      
      // this.selectedAssesmentMethodology.value.toString()? this.selectedAssesmentMethodology['value'].toString() : null;

      console.log("ID: ", this.qde.application.applicants[this.applicantIndex].incomeDetails);

      this.createOrUpdatePersonalDetailsSub22 = this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
        // If successfull
        if (response["ProcessVariables"]["status"]) {
          this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.applicantIndex]['applicantId'] + "", this.page, this.tabName, screenPages['applicantDetails']).subscribe(auditRes => {
            if (auditRes['ProcessVariables']['status'] == true) {
              this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
              this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
              this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
              this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
            }
          });
          // this.isApplicantRouteModal = true;
          // this.router.navigate(['/applicant', this.qde.application.applicationId, 'co-applicant'], {fragment: 'dashboard'} );
          this.goToNextSlide(swiperInstance1, swiperInstance2);

        }
        // else {
        //   this.isErrorModal = true;
        //   this.errorMessage = "Something went wrong, please try again later.";
        // }
      }
      // , (error) => {
      //   this.isErrorModal = true;
      //   this.errorMessage = "Something went wrong, please try again later.";
      // }
    );

    }

  } catch (ex) {
        this.isErrorModal = true;
        this.errorMessage = ex.message;

        } finally {
          this.ngxService.stop();
        }
  }

  submitMonthlyIncomeNonIndividual(form: NgForm, swiperInstance?: Swiper) {
    try {
      this.ngxService.start();
    if (this.isTBMLoggedIn) {
      this.router.navigate(['/applicant', this.qde.application.applicants[this.applicantIndex].applicantId, 'co-applicant'], { queryParams: { tabName: 'dashboard', page: 1 } })
    } else {
      if (form && !form.valid) {
        return;
      }

      this.qde.application.applicants[this.applicantIndex].incomeDetails.monthlyIncome = form.value.monthlyIncome;
      this.qde.application.applicants[this.applicantIndex].incomeDetails.assessmentMethodology = form.value.assessmentMethodology.value;
      
      // this.selectedAssesmentMethodology.value.toString() ? this.selectedAssesmentMethodology['value'].toString() : null;

      console.log("ID: ", this.qde.application.applicants[this.applicantIndex].incomeDetails);

      this.createOrUpdatePersonalDetailsSub22 = this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
        // If successfull
        if (response["ProcessVariables"]["status"]) {
          this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.applicantIndex]['applicantId'] + "", this.page, this.tabName, screenPages['applicantDetails']).subscribe(auditRes => {
            if (auditRes['ProcessVariables']['status'] == true) {
              this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
              this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
              this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
              this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
            }
          });
          this.isApplicantRouteModal = true;
          // alert("Applicant's application successfully submitted");
          // this.router.navigate(['/applicant', this.qde.application.applicationId, 'co-applicant'], {fragment: 'dashboard'} );
          //this.goToNextSlide(swiperInstance);
        }
        // else {
        //   this.isErrorModal = true;
        //   this.errorMessage = "Something went wrong, please try again later.";
        // }
      }
      // , (error) => {
      //   this.isErrorModal = true;
      //   this.errorMessage = "Something went wrong, please try again later.";
      // }
    );

    }

  } catch (ex) {
        this.isErrorModal = true;
        this.errorMessage = ex.message;

        } finally {
          this.ngxService.stop();
        }
  }

  selectPuccaHouse(value) {
    this.qde.application.applicants[this.applicantIndex].incomeDetails.puccaHouse = (value == 1) ? true : false;
  }

  selectPension(value) {
    this.qde.application.applicants[this.applicantIndex].occupation.pensioner = (value == 1) ? true : false;
  }

  parseJson(response): JSON {
    let result = JSON.parse(response);
    return result;
  }

  parseInteger(value: any): number {
    return parseInt(value);
  }

  changeIsIndividualStatus: boolean = false;
  beferoStatus: boolean = false;

  changeIsIndividual(value, swiperInstance1: Swiper, swiperInstance2: Swiper) {
    this.beferoStatus = this.qde.application.applicants[this.applicantIndex].isIndividual;
    if (value == 1) {
      console.log("current status before", this.qde.application.applicants[this.applicantIndex].isIndividual);
      if (this.beferoStatus == false) {
        this.qde.application.applicants[this.applicantIndex].isIndividual = true;
        this.changeIsIndividualStatus = true;
        console.log("current status before", this.changeIsIndividualStatus);
      }
      else {
        this.goToNextSlide(swiperInstance1,swiperInstance2);
        this.qde.application.applicants[this.applicantIndex].isIndividual = true;
      }

    } else {
      console.log("current status before", this.qde.application.applicants[this.applicantIndex].isIndividual)
      if (this.beferoStatus == true) {
        this.qde.application.applicants[this.applicantIndex].isIndividual = false;
        this.changeIsIndividualStatus = true;
      }
      else {
        this.qde.application.applicants[this.applicantIndex].isIndividual = false;
        this.router.navigate([], { queryParams: { tabName: this.fragments[10], page: 1 } });
      }

      // this.router.navigate([], {queryParams: { tabName: this.fragments[10], page: 1}});
    }

    let occType = this.qde.application.applicants[this.applicantIndex].occupation.occupationType;

    this.loadOccupationTypeLovs(occType);
    return this.beferoStatus;
  }

  resetIndividualData(btnValue, swiperInstance1: Swiper, swiperInstance2: Swiper) {

    this.changeIsIndividualStatus = false
    let currentPanValue = this.beferoStatus;


    let applicationId = this.route.snapshot.params["applicationId"];

    let applicantId = this.qde.application.applicants[this.applicantIndex].applicantId;

    if (btnValue == "yes" && currentPanValue == true) {
      console.log("inside yes click and ", btnValue);

      let data = {
        "userId": parseInt(localStorage.getItem("userId")),
        "applicantId": applicantId,
        "docType": 1,
        "applicationId": Number(applicationId)
      };

      //flash exiting dataresetIn
      this.qdeHttp.flashExitingData(data).subscribe(
        data => {
          // console.log(JSON.parse(data["ProcessVariables"]["response"])["application"])
          this.qde.application = JSON.parse(data["ProcessVariables"]["response"])["application"];
          this.qdeService.setQde(this.qde);
          this.auditTrial(applicationId, applicantId, 1, "pan1", "ApplicantDetails");
          this.qde.application.applicants[this.applicantIndex].isIndividual = false;
          this.router.navigate([], { queryParams: { tabName: this.fragments[10], page: 1 } });
        }
      );


    } else if (btnValue == "yes" && currentPanValue == false) {
      console.log("inside no click and ", btnValue);

      let data = {
        "userId": parseInt(localStorage.getItem("userId")),
        "applicantId": applicantId,
        "docType": 1,
        "applicationId": Number(applicationId)
      };

      //flash exiting dataresetIn
      this.qdeHttp.flashExitingData(data).subscribe(
        data => {

          this.qde.application = JSON.parse(data["ProcessVariables"]["response"])["application"];
          this.qdeService.setQde(this.qde);
          this.auditTrial(applicationId, applicantId, 2, "pan1", "ApplicantDetails");
          this.qde.application.applicants[this.applicantIndex].isIndividual = true;
          this.goToNextSlide(swiperInstance1, swiperInstance2);
        }
      );

    } else if (btnValue == "no" && currentPanValue == false) {
      this.qde.application.applicants[this.applicantIndex].isIndividual = false;
      this.qde.application.applicants[this.applicantIndex].incomeDetails.incomeConsider = null;
      this.auditTrial(applicationId, applicantId, 1, "pan1", "ApplicantDetails");
      this.router.navigate([], { queryParams: { tabName: this.fragments[10], page: 1 } });
    }
    else if (btnValue == "no" && currentPanValue == true) {
      this.qde.application.applicants[this.applicantIndex].isIndividual = true;
      this.auditTrial(applicationId, applicantId, 2, "pan1", "ApplicantDetails");
      this.goToNextSlide(swiperInstance1, swiperInstance2);
    }

  }


  auditTrial(applicationId: string, applicantId: string, pageNumber: number, tabPage: string, screenPage: string) {
    this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(applicationId, applicantId, pageNumber, tabPage, screenPage).subscribe(auditRes => {
      if (auditRes['ProcessVariables']['status'] == true) {
        this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
        this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
        this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
        this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
      }
    });
  }

  changeResidentialNon(value, swiperInstance?: Swiper) {
    this.qde.application.applicants[this.applicantIndex].personalDetails.applicantStatus = value;

    // Make API Request to save that is submitpersonaldetails

  }


  counter(size): Array<number> {
    return new Array(size);
  }

  incomeConsiderYesNoIndividual(value, swiperInstance1: Swiper, swiperInstance2: Swiper) {
    console.log("click Yes in occupation Details");
    if (this.isTBMLoggedIn) {
      if (this.qde.application.applicants[this.applicantIndex].incomeDetails.incomeConsider) {
        this.goToExactPageAndTab(8, 1);
      } else {
        this.goToExactPageAndTab(9, 1);
        // this.router.navigate([], { queryParams: { tabName: 'income1', page: 0 } });
      }
    }
    else {

      const incomeIsConsider = this.qde.application.applicants[this.applicantIndex].incomeDetails.incomeConsider;

      if ((incomeIsConsider == true ? 1 : 2) != value) {
        if (!incomeIsConsider) {

          this.qde.application.applicants[this.applicantIndex].incomeDetails = {
            annualFamilyIncome: "",
            monthlyExpenditure: "",
            incomeConsider: null,
            puccaHouse: null
          };

          this.qde.application.applicants[this.applicantIndex].officialCorrespondence = {
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

        } else {
          this.qde.application.applicants[this.applicantIndex].incomeDetails = {
            monthlyIncome: "",
            assessmentMethodology: "",
          };
        }
      }

      this.qde.application.applicants[this.applicantIndex].incomeDetails.incomeConsider = (value == 1) ? true : false;
      console.log("click Yes in occupation Details in else part");
      this.createOrUpdatePersonalDetailsSub23 = this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).
        subscribe((response) => {
          // If successfull
          if (response["ProcessVariables"]["status"]) {
            this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.applicantIndex]['applicantId'] + "", this.page, this.tabName, screenPages['applicantDetails']).subscribe(auditRes => {
              if (auditRes['ProcessVariables']['status'] == true) {
                this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
                this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
                this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
                this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
              }
            });



            if (this.qde.application.applicants[this.applicantIndex].incomeDetails.incomeConsider) {
              this.goToExactPageAndTab(8, 1);
            } else {
              this.goToExactPageAndTab(9, 1);
              // this.router.navigate([], { queryParams: { tabName: 'income1', page: 0 } });
            }
          }
          // else {
          //   this.isErrorModal = true;
          //   this.errorMessage = "Something went wrong, please try again later.";
          // }
        }
        // , (error) => {
        //   this.isErrorModal = true;
        //   this.errorMessage = "Something went wrong, please try again later.";
        // }
      );
    }
  }

  incomeConsiderYesNoNonIndividual(value, swiperInstance1: Swiper, swiperInstance2: Swiper) {
    if (this.isTBMLoggedIn) {
      if (value == 1) {
        this.goToNextSlide(swiperInstance1, swiperInstance2);
      }
      else if (value == 2) {
        this.isApplicantRouteModal = true;
      }
      this.goToNextSlide(swiperInstance1,swiperInstance2);
    } else {

      const incomeIsConsider = this.qde.application.applicants[this.applicantIndex].incomeDetails.incomeConsider;

      if ((incomeIsConsider == true ? 1 : 2) != value) {
        if (!incomeIsConsider) {

          this.qde.application.applicants[this.applicantIndex].incomeDetails = {
            annualFamilyIncome: "",
            monthlyExpenditure: "",
            incomeConsider: null,
            puccaHouse: null
          };

          this.qde.application.applicants[this.applicantIndex].officialCorrespondence = {
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

        } else {
          this.qde.application.applicants[this.applicantIndex].incomeDetails = {
            incomeConsider: null,
            assessmentMethodology: "",
          };
        }
      }



      this.qde.application.applicants[this.applicantIndex].incomeDetails.incomeConsider = (value == 1) ? true : false;

      console.log(">>>", this.qde.application.applicants[this.applicantIndex].incomeDetails);

      this.createOrUpdatePersonalDetailsSub23 = this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
        // If successfull
        if (response["ProcessVariables"]["status"]) {
          this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.applicantIndex]['applicantId'] + "", this.page, this.tabName, screenPages['applicantDetails']).subscribe(auditRes => {
            if (auditRes['ProcessVariables']['status'] == true) {
              this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
              this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
              this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
              this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
            }
          });
          if (value == 1) {
            this.goToNextSlide(swiperInstance1, swiperInstance2);
          }
          else if (value == 2) {
            this.isApplicantRouteModal = true;
          }
        }
        // else {
        //   this.isErrorModal = true;
        //   this.errorMessage = "Something went wrong, please try again later.";
        // }
      }
      // , (error) => {
      //   this.isErrorModal = true;
      //   this.errorMessage = "Something went wrong, please try again later.";
      // }
    );
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

  checkAgeOfIncorporation(event: Date ){
    let dateofbirth = this.getFormattedDate(event);
    const d1: any = new Date(dateofbirth);
    const d2: any = new Date();
    var diff = d2 - d1;
    var age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    if (age < Number(this.minMaxValues["Age_Of_Incorporation"].minValue)) {
      this.ageError = true;
      return;
    }else if (age >  Number(this.minMaxValues["Age_Of_Incorporation"].maxValue)){
      this.isErrorModal = true;
      this.errorMessage = `Maximum age limit is ${this.minMaxValues["Age_Of_Incorporation"].maxValue}`;
      return;
    } else {
      this.ageError = false;
    }
  }

  selectValueChanged(event, to, key?) {
    let whichSelectQde = this.qde.application.applicants[this.applicantIndex];
    let nick = to.getAttribute('nick').split(".");

    to.getAttribute('nick').split(".").forEach((val, i) => {
      if (val == 'day' || val == 'month' || val == 'year') {

        // this[key][val].value = event.value;
        return;
      } else {
        if (i == (to.getAttribute('nick').split(".").length - 1)) {
          whichSelectQde[val] = event.value;
          return;
        }
        whichSelectQde = whichSelectQde[val]
      }
    });
  }

  selectValueChangedOccupation(event) {
    if (event.value != 0) {
    this.qdeHttp.occupationLovCompanyDetails(event.value).subscribe(response => {
      this.occupationRequired = response["ProcessVariables"]["profileStatus"]
    });
  }
}

  editMobileNO() {
    this.qde.application.applicants[this.applicantIndex].contactDetails.isMobileOTPverified = false;

  }

  inOTP: boolean = false;

  isAlternateStatus: boolean = false;

  submitOTP(form: NgForm, isAlternateNumber) {
    try {
      this.ngxService.start();
    console.log("Towards OTP");

    const mobileNumber = form.value.mobileNumber;
    const emailId = form.value.preferEmailId;
    const isValidMobile = this.RegExp(this.regexPattern.mobileNumber).test(mobileNumber);
    const isValidEmailID = this.RegExp(this.regexPattern.email).test(emailId);
    if( form.controls.preferEmailId.invalid) {
      this.isErrorModal = true;
      this.errorMessage = "Please Enter valid Email id  for verification";
    } else if (isValidMobile && isValidEmailID ) {
      this.qde.application.applicants[this.applicantIndex].contactDetails.mobileNumber = mobileNumber;
      this.qde.application.applicants[this.applicantIndex].contactDetails.preferredEmailId = emailId;
      const applicationId = this.qde.application.applicationId;
      const applicantId = this.qde.application.applicants[this.applicantIndex].applicantId;
      this.sendOTPAPISub = this.qdeHttp.sendOTPAPI(mobileNumber, applicantId, applicationId, isAlternateNumber, emailId).subscribe(res => {
        if (res['ProcessVariables']['status'] == true) {
          this.inOTP = true;
          this.isAlternateStatus = isAlternateNumber;
        }
      });
      this.timeout();

    } else {
      this.isErrorModal = true;
      this.errorMessage = "Email id and Mobile number is mandatory for verification";
    }

  } catch (ex) {
        this.isErrorModal = true;
        this.errorMessage = ex.message;

        } finally {
          this.ngxService.stop();
        }

  }
  timeout() {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.isDisabled = false;
        this.timeLeft--;
      } else {
        this.isDisabled = true;
      }
    }, 1000)
  }
  stopInterval() {
    clearInterval(this.interval);
    this.timeLeft = 180;
  }

  resendOTP() {
    this.isOTPExpired = false;
    this.isOTPEmpty = true;
    this.otp = "";
    this.stopInterval();
    const mobileNumber = this.qde.application.applicants[this.applicantIndex].contactDetails.mobileNumber;
    const applicationId = this.qde.application.applicationId;
    const applicantId = this.qde.application.applicants[this.applicantIndex].applicantId;
    const emailId = this.qde.application.applicants[this.applicantIndex].contactDetails.preferredEmailId;
    this.sendOTPAPISub = this.qdeHttp.sendOTPAPI(mobileNumber, applicantId, applicationId, false, emailId).subscribe(res => {
      if (res['ProcessVariables']['status'] == true) {
        this.inOTP = true;
        this.isAlternateStatus = false;
      }
      //  else {
      //   this.isErrorModal = true;
      //   this.errorMessage = "Something went wrong, please try again later.";
      // }
    }
    // , error => {
    //   this.isErrorModal = true;
    //   this.errorMessage = "Something went wrong, please try again later.";
    // }
  );
    this.timeout();
  }

  onBackOTP() {
    console.log("Back button pressed")
    this.otp = "";
    this.inOTP = false;
    this.isOTPExpired = false;
    this.isOTPEmpty = true;
    this.stopInterval();
  }

  checkOTPEmpty() {
    if (this.otp == "" || this.otp.length < 4) {
      this.isOTPEmpty = true;
    } else {
      this.isOTPEmpty = false;
    }
  }

  validateOTP(form: NgForm) {
    console.log("Payment gateway");
    const mobileNumber = this.qde.application.applicants[this.applicantIndex].contactDetails.mobileNumber;
    const applicantId = this.qde.application.applicants[this.applicantIndex].applicantId;
    const applicationId = this.qde.application.applicationId;
    const emailId = this.qde.application.applicants[this.applicantIndex].contactDetails.preferredEmailId;
    const otp = form.value.otp;
    if (this.timeLeft == 0) {
      this.isOTPExpired = true;
      this.otp = "";
      this.isOTPEmpty = true;
    } else {
      this.validateOTPAPISub = this.qdeHttp.validateOTPAPI(mobileNumber, applicantId, applicationId, otp, this.isAlternateStatus, emailId).subscribe(res => {
        // if(res['ProcessVariables']['isPaymentSuccessful'] == true) {
        //   this.showSuccessModal = true;
        //   this.emiAmount = res['ProcessVariables']['emi'];
        //   this.eligibleAmount = res['ProcessVariables']['eligibilityAmount'];
        // }
        // else if(res['ProcessVariables']['isPaymentSuccessful'] == false) {
        //   this.showErrorModal = true;
        // }
        if (res['ProcessVariables']['status'] == true) {
          this.otp = "";
          // alert("OTP verified successfully");
          if (this.isAlternateStatus) {
            this.qde.application.applicants[this.applicantIndex].contactDetails.isAlternateOTPverified = true;
          } else {
            this.qde.application.applicants[this.applicantIndex].contactDetails.isMobileOTPverified = true;
          }
          this.onBackOTP();
        }
        // else {
        //   this.isErrorModal = true;
        //   this.errorMessage = "Enter valid OTP";
        // }
      }
      // , error => {
      //   this.isErrorModal = true;
      //   this.errorMessage = "Something went wrong, please try again later.";
      // }
    );
    }
  }
  editMobileNo() {

    this.qde.application.applicants[this.applicantIndex].contactDetails.isMobileOTPverified = false;
  }

  // changeApplicantStatus(value, swiperInstance ?: Swiper) {

  // }



  initializeVariables() {
    this.residenceNumberStdCode = this.qde.application.applicants[this.applicantIndex].contactDetails.residenceNumber != "" ? this.qde.application.applicants[this.applicantIndex].contactDetails.residenceNumber.split("-")[0] : "";
    this.residenceNumberPhoneNumber = this.qde.application.applicants[this.applicantIndex].contactDetails.residenceNumber != "" ? this.qde.application.applicants[this.applicantIndex].contactDetails.residenceNumber.split("-")[1] : "";

    this.alternateResidenceNumberStdCode = this.qde.application.applicants[this.applicantIndex].contactDetails.alternateResidenceNumber != "" ? this.qde.application.applicants[this.applicantIndex].contactDetails.alternateResidenceNumber.split("-")[0] : "";
    this.alternateResidenceNumberPhoneNumber = this.qde.application.applicants[this.applicantIndex].contactDetails.alternateResidenceNumber != "" ? this.qde.application.applicants[this.applicantIndex].contactDetails.alternateResidenceNumber.split("-")[1] : "";
    this.addressCityState = this.qde.application.applicants[this.applicantIndex].communicationAddress.city + '/' + this.qde.application.applicants[this.applicantIndex].communicationAddress.state;

    this.otherReligion = this.qde.application.applicants[this.applicantIndex].other.religion == '6' ? this.qde.application.applicants[this.applicantIndex].other.religion : '';

    this.registeredAddressCityState = this.qde.application.applicants[this.applicantIndex].registeredAddress.city + '/' + this.qde.application.applicants[this.applicantIndex].registeredAddress.state;
    this.corporateAddressCityState = this.qde.application.applicants[this.applicantIndex].corporateAddress.city + '-' + this.qde.application.applicants[this.applicantIndex].corporateAddress.state;
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

    if (event == true) {
      this.qde.application.applicants[this.applicantIndex].permanentAddress.addressLineOne = this.qde.application.applicants[this.applicantIndex].communicationAddress.addressLineOne;
      this.qde.application.applicants[this.applicantIndex].permanentAddress.addressLineTwo = this.qde.application.applicants[this.applicantIndex].communicationAddress.addressLineTwo;
      this.qde.application.applicants[this.applicantIndex].permanentAddress.zipcode = this.qde.application.applicants[this.applicantIndex].communicationAddress.zipcode;

      this.qde.application.applicants[this.applicantIndex].permanentAddress.city = this.qde.application.applicants[this.applicantIndex].communicationAddress.city;
      this.qde.application.applicants[this.applicantIndex].permanentAddress.state = this.qde.application.applicants[this.applicantIndex].communicationAddress.state;
      this.qde.application.applicants[this.applicantIndex].permanentAddress.cityState = this.qde.application.applicants[this.applicantIndex].communicationAddress.cityState;
      this.qde.application.applicants[this.applicantIndex].permanentAddress.zipcodeId = this.qde.application.applicants[this.applicantIndex].communicationAddress.zipcodeId;
      this.qde.application.applicants[this.applicantIndex].permanentAddress.stateId = this.qde.application.applicants[this.applicantIndex].communicationAddress.stateId;
      this.qde.application.applicants[this.applicantIndex].permanentAddress.cityId = this.qde.application.applicants[this.applicantIndex].communicationAddress.cityId;
      this.isPermanentAddressSame=true;

    } else {
      this.isPermanentAddressSame = false;
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

    if (event == true) {
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

  commZipcodeFocusout($event: any) {
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
    this.dob = { day: { key: "DD", value: "DD" }, month: { key: "MM", value: "MM" }, year: { key: "YYYY", value: "YYYY" } };
    this.organizationDetails = { day: { key: "DD", value: "DD" }, month: { key: "MM", value: "MM" }, year: { key: "YYYY", value: "YYYY" } };
    this.commCityState = "";

    this.selectedTitle = this.defaultItem;
    this.selectedReligion = this.defaultItem;
    this.selectedMaritialStatus = this.defaultItem;
    this.selectedCategory = this.defaultItem;
    // this.selectedOccupation = this.selectedOccupation[0];
    this.selectedOccupation = this.defaultItem;
    this.selectedResidence = this.defaultItem;
    this.selectedSpouseTitle = this.defaultItem;
    this.selectedFatherTitle = this.defaultItem;
    this.selectedMotherTitle = this.defaultItem;
    this.selectedQualification = this.defaultItem;
    this.selectedConstitution = this.defaultItem;
    this.selectedDocType = this.defaultItem;
    // this.selectedAssesmentMethodology = this.assessmentMethodology[0];
    this.selectedAssesmentMethodology = this.defaultItem;
  }

  expError = false;

  checkOccupationDetailsYears(event: any) {
    console.log("numberOfYearsInCurrentCompany: ", this.qde.application.applicants[this.applicantIndex].occupation.numberOfYearsInCurrentCompany);
    console.log("totalWorkExperience: ", this.qde.application.applicants[this.applicantIndex].occupation.totalWorkExperience);
    if (this.qde.application.applicants[this.applicantIndex].occupation.numberOfYearsInCurrentCompany <= this.qde.application.applicants[this.applicantIndex].occupation.totalWorkExperience) {
      // Next button should be enabled
      this.expError = false;
    } else {
      this.expError = true;
    }
  }

  ngOnDestroy() {
    if (this.swiperSlidersSub != null) {
      this.swiperSlidersSub.unsubscribe();
    }
    // if(this.panslideSub != null){
    // this.panslideSub.unsubscribe();
    // }
    // if(this.panslideSub2 != null){
    // this.panslide2Sub.unsubscribe();
    // }
    if (this.qdeSourceSub != null) {
      this.qdeSourceSub.unsubscribe();
    }
    if (this.fragmentSub != null) {
      this.fragmentSub.unsubscribe();
    }
    if (this.paramsSub != null) {
      this.paramsSub.unsubscribe();
    }
    if (this.getQdeDataSub != null) {
      this.getQdeDataSub.unsubscribe();
    }
    if (this.checkPanValidSub != null) {
      this.checkPanValidSub.unsubscribe();
    }
    if (this.createOrUpdatePanDetailsSub != null) {
      this.createOrUpdatePanDetailsSub.unsubscribe();
    }
    if (this.setStatusApiSub != null) {
      this.setStatusApiSub.unsubscribe();
    }
    if (this.checkPanValidSub2 != null) {
      this.checkPanValidSub2.unsubscribe();
    }
    if (this.createOrUpdatePanDetailsSub2 != null) {
      this.createOrUpdatePanDetailsSub2.unsubscribe();
    }
    if (this.setStatusApiSub2 != null) {
      this.setStatusApiSub2.unsubscribe();
    }
    if (this.createOrUpdatePersonalDetailsSub != null) {
      this.createOrUpdatePersonalDetailsSub.unsubscribe();
    }
    if (this.createOrUpdatePersonalDetailsSub2 != null) {
      this.createOrUpdatePersonalDetailsSub2.unsubscribe();
    }
    if (this.createOrUpdatePersonalDetailsSub3 != null) {
      this.createOrUpdatePersonalDetailsSub3.unsubscribe();
    }
    if (this.createOrUpdatePersonalDetailsSub4 != null) {
      this.createOrUpdatePersonalDetailsSub4.unsubscribe();
    }
    if (this.createOrUpdatePersonalDetailsSub5 != null) {
      this.createOrUpdatePersonalDetailsSub5.unsubscribe();
    }
    if (this.createOrUpdatePersonalDetailsSub6 != null) {
      this.createOrUpdatePersonalDetailsSub6.unsubscribe();
    }
    if (this.getCityAndStateSub != null) {
      this.getCityAndStateSub.unsubscribe();
    }
    if (this.createOrUpdatePersonalDetailsSub7 != null) {
      this.createOrUpdatePersonalDetailsSub7.unsubscribe();
    }
    if (this.createOrUpdatePersonalDetailsSub8 != null) {
      this.createOrUpdatePersonalDetailsSub8.unsubscribe();
    }
    if (this.createOrUpdatePersonalDetailsSub9 != null) {
      this.createOrUpdatePersonalDetailsSub9.unsubscribe();
    }
    if (this.createOrUpdatePersonalDetailsSub10 != null) {
      this.createOrUpdatePersonalDetailsSub10.unsubscribe();
    }
    if (this.createOrUpdatePersonalDetailsSub11 != null) {
      this.createOrUpdatePersonalDetailsSub11.unsubscribe();
    }
    if (this.createOrUpdatePersonalDetailsSub12 != null) {
      this.createOrUpdatePersonalDetailsSub12.unsubscribe();
    }
    if (this.createOrUpdatePersonalDetailsSub13 != null) {
      this.createOrUpdatePersonalDetailsSub13.unsubscribe();
    }
    if (this.createOrUpdatePersonalDetailsSub14 != null) {
      this.createOrUpdatePersonalDetailsSub14.unsubscribe();
    }
    if (this.createOrUpdatePersonalDetailsSub15 != null) {
      this.createOrUpdatePersonalDetailsSub15.unsubscribe();
    }
    if (this.createOrUpdatePersonalDetailsSub16 != null) {
      this.createOrUpdatePersonalDetailsSub16.unsubscribe();
    }
    if (this.createOrUpdatePersonalDetailsSub17 != null) {
      this.createOrUpdatePersonalDetailsSub17.unsubscribe();
    }
    if (this.createOrUpdatePersonalDetailsSub18 != null) {
      this.createOrUpdatePersonalDetailsSub18.unsubscribe();
    }
    if (this.createOrUpdatePersonalDetailsSub19 != null) {
      this.createOrUpdatePersonalDetailsSub19.unsubscribe();
    }
    if (this.createOrUpdatePersonalDetailsSub20 != null) {
      this.createOrUpdatePersonalDetailsSub20.unsubscribe();
    }
    if (this.createOrUpdatePersonalDetailsSub21 != null) {
      this.createOrUpdatePersonalDetailsSub21.unsubscribe();
    }
    if (this.createOrUpdatePersonalDetailsSub22 != null) {
      this.createOrUpdatePersonalDetailsSub22.unsubscribe();
    }
    if (this.createOrUpdatePersonalDetailsSub23 != null) {
      this.createOrUpdatePersonalDetailsSub23.unsubscribe();
    }
    if (this.sendOTPAPISub != null) {
      this.sendOTPAPISub.unsubscribe();
    }
    if (this.validateOTPAPISub != null) {
      this.validateOTPAPISub.unsubscribe();
    }
    if (this.createOrUpdatePanDetailsSub3 != null) {
      this.createOrUpdatePanDetailsSub3.unsubscribe();
    }

    if (this.isEligibilityForReviewsSub != null) {
      this.isEligibilityForReviewsSub.unsubscribe();
    }

    if (this.auditTrialApiSub != null) {
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



  sendPanImage(image) {

    let fileName = this.qde.application.applicationId + "-" + this.qde.application.applicants[this.applicantIndex].applicantId + "-" + new Date().getTime()

    this.qdeHttp.uploadFile(fileName, image).then((data) => {

      if (data["responseCode"] == 200) {

        var result = JSON.parse(data["response"]);

        var imageId = result.info.id;

        console.log("imageId", imageId);

        this.qde.application.applicants[this.applicantIndex].pan.imageId = imageId;

        this.createOrUpdatePanDetailsSub3 = this.qdeHttp.createOrUpdatePanDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
          // If successful
          if (response["ProcessVariables"]["status"] == true) {
            // alert("Switch to tab 1");
            this.goToExactPageAndTab(1, 1);
          }
          // else {
          //   this.isErrorModal = true;
          //   this.errorMessage = "Something went wrong, please try again later.";
          // }
        });
      } else {
        // Throw Invalid Pan Error
        alert(JSON.parse(data["response"]));
      }
    });
  }


  setPanProof(files: any) {

    console.log("setIdProof files", files);

    if (this.isMobile) {
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
      if (isIndividual) {
        this.goToExactPageAndTab(1, 1);
      } else {
        this.goToExactPageAndTab(11, 1);
      }
      return;
    } else {  /* Need to remove the else block once imageid is saved in back-end */
      if (isIndividual) {
        this.goToExactPageAndTab(1, 1);
      } else {
        this.goToExactPageAndTab(11, 1);
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

          console.log("imageId", documentId);

          this.qde.application.applicants[this.applicantIndex].pan.imageId = documentId;

          this.qdeHttp.createOrUpdatePanDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
            // If successful
            if (response["ProcessVariables"]["status"] == true) {
              if (isIndividual) {
                this.goToExactPageAndTab(1, 1);
              } else {
                this.goToExactPageAndTab(11, 1);
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

  onCrossModal() {
    this.isApplicantRouteModal = false;
    this.isApplicantPinModal = false;
    this.isErrorModal = false;
  }

  closeDuplicateModal() {
    this.isDuplicateModalShown = false;
    if (this.qde.application.applicants[this.applicantIndex].isIndividual == true) {
      this.contactExtraFieldRemoval();
      this.goToExactPageAndTab(2, 1);
      // }
    } else {
      this.goToExactPageAndTab(12, 1);
    }
  }

  submitDuplicateApplicant(form: NgForm) {
    try {
      if (!form.value.selectDuplicateApplicant && form.value.selectDuplicateApplicant=="") {
        this.isErrorModal = true;
        this.errorMessage="Select Any Applicant to Use"

      } else{
        this.ngxService.start();
        let tempApplicant = this.qde.application.applicants[this.applicantIndex];
        let selectedApplication = this.duplicates.find(e => e.applicantId == form.value.selectDuplicateApplicant);
        let applicationId = Number(selectedApplication["applicationId"]);
        this.getQdeDataSub = this.qdeHttp.getQdeData(applicationId).subscribe(data => {           
        // console.log("Applicationin get " ,JSON.parse(data["ProcessVariables"]["response"])["application"]["applicants"] ); 
        let response =   JSON.parse(data["ProcessVariables"]["response"]);
        if(response) {
          let duplicates: any = JSON.parse(data["ProcessVariables"]["response"])["application"]["applicants"];
          let newApplicantToBeReplaced = duplicates.find(e => e.applicantId == form.value.selectDuplicateApplicant);
          this.qde.application.applicants[this.applicantIndex] = this.qdeService.getModifiedObject(tempApplicant, newApplicantToBeReplaced);
          this.qde.application.applicants[this.applicantIndex].applicantId = tempApplicant.applicantId;
          this.qde.application.applicants[this.applicantIndex].isMainApplicant = tempApplicant.isMainApplicant;
          this.qde.application.applicants[this.applicantIndex].contactDetails.isMobileOTPverified = false;
	        this.qde.application.applicants[this.applicantIndex].existingLoans.liveLoan = null;
	        this.qde.application.applicants[this.applicantIndex].existingLoans.loanProvider = "";
	        this.qde.application.applicants[this.applicantIndex].existingLoans.monthlyEmi = null;
	        this.qde.application.applicants[this.applicantIndex].existingLoans.numberOfYears = "";
          // dedupe set done (disable dedupe) 
          this.qde.application.applicants[this.applicantIndex].dedupeDone = true;
          this.qdeService.setQde(this.qde);
        
          console.log("this qde ",this.qde);

          this.getSetQdeData(this.qde)
          

          this.createOrUpdatePersonalDetailsSub5 = this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).
            subscribe((response) => {
              // If successful
              if (response["ProcessVariables"]["status"]) {
                this.closeDuplicateModal();
              } else {
                this.isErrorModal = true;
                this.errorMessage = "Something went wrong, please try again later.";
              }
            }
            // , error => {
            //   this.isErrorModal = true;
            //   this.errorMessage = "Something went wrong, please try again later.";
            // }
            );
        }
        
      });
    }
  } catch (ex) {
        this.isErrorModal = true;
        this.errorMessage = ex.message;

        } finally {
          this.ngxService.stop();
        }

  }

  // @ViewChild('commSlider') commSlider: ElementRef;

  commSliderChanged(event) {
    // console.log('COMMSLIDER:', this.commSlider);
    // this.commSlider.nativeElement.querySelector('.ng5-slider-span.ng5-slider-bubble.ng5-slider-model-value').innerHTML = event+'y';
  }

  RegExp(param) {
    return RegExp(param);
  }
  isExistPan: boolean;
  keyUpPanNumber(event: Event) {
    console.log("TEMPLD", this.tempOldPanNumber);
    if (event['target']['value'].trim() != '' && event['target']['value'] == this.tempOldPanNumber) {
      this.isValidPan = true;
    } else {
      this.isValidPan = null;
    }
    for(let i=0;i< this.qde.application.applicants.length;i++){
      console.log("pan ",i,this.qde.application.applicants[i].pan.panNumber,
      event['target']['value'],this.applicantIndex);
      if (this.qde.application.applicants[i].pan.panNumber === event['target']['value'] &&
      this.applicantIndex != i && this.qde.application.applicants[i].pan.panNumber !="")
      {       
          this.isExistPan = true;
          return;
          }else{
            this.isExistPan = false;
          }
      }    
    console.log("pan status",this.isExistPan);
  }

  ngAfterViewInit() {
    // this.swiperSliders.forEach((v, i, a) => {
    //   v.setIndex(0);
    // });
    this.swiperSlidersSub = this.swiperS$.changes.subscribe(v => {

      console.log("Swipers: ", this.activeTab, this.swiperSliders);
      this.swiperSliders = v._results;
      // if (this.swiperSliders && this.swiperSliders.length > 0) {
      //   this.swiperSliders[this.activeTab].setIndex(this.page - 1);
      // }
    });

    this.swiperSlidersSub2 = this.lhsSwiperS$.changes.subscribe(v => {

      console.log("Swipers: ", this.activeTab, this.swiperSliders);
      this.lhsSwiperSliders = v._results;
      // if (this.swiperSliders && this.swiperSliders.length > 0) {
      //   this.swiperSliders[this.activeTab].setIndex(this.page - 1);
      // }
    });
  }

  goToExactPageAndTab(index: number, pageNumber: number) {
    // let index = this.fragments.some(v => v == tabPage) ? this.fragments.findIndex(v => v == tabPage) : 0;
    // this.tabName = tabPage;
    // this.page = pageNumber;
    // this.goToExactPageAndTab(i, 1ndex, true);
    this.router.navigate([], {queryParams: {tabName: this.fragments[index] , page: pageNumber}});
  }

  isCategoryModal: boolean = false;
  checkForCondition() {
    if (this.selectedCategory.value != "1" && this.selectedCategory.value != "0") {
      this.isCategoryModal = true;
    }
    else {
      this.isCategoryModal = false
    }
  }

  onCrossCatgModal() {
    this.isCategoryModal = false
  }


  onOfficialCorsEmailChange(value, officeEmail) {
    const emailId = value;
    const domain = emailId.split("@")[1];
    this.unOfficialEmails.forEach(function (value) {
      console.log("unOfficialEmails", value["key"]);
      if (value["key"] == domain) {
        console.log("Invalid email");
        officeEmail.control.setErrors({ 'invalidDomain': true });
        return;
      }
    });
  }

  onPreferredEmailChange(value, emailCtrl) {
    const emailId = value;
    const domain = emailId.split("@")[1];
    for(let i = 0; i < this.preferredEmail.length; i++) {
      if (this.preferredEmail[i]["key"] == domain) {
        console.log("Valid email");
        emailCtrl.control.setErrors({ 'invalidDomain': null });
        emailCtrl.control.updateValueAndValidity();
        break;
      }else {
        console.log("Invalid email");
        emailCtrl.control.setErrors({ 'invalidDomain': true });
      }
    }
  }

  setAssessmentMethodology() {
    if (this.qde.application.applicationId != null) {
      this.qdeHttp.assessmentListForProfileApplicantType(this.qde.application.applicants[this.applicantIndex].isIndividual ? '1' : '2', this.qde.application.applicants[this.applicantIndex].occupation.occupationType).subscribe(res => {
        if (res['ProcessVariables']['AssessementList']) {
          this.assessmentMethodology = res['ProcessVariables']['AssessementList'].map(e => ({ key: e.id, value: e.value }));
          if (this.qde && this.qde.application.applicants[this.applicantIndex].incomeDetails.assessmentMethodology) {
            this.assessmentMethodology.find(e => e.value == this.qde.application.applicants[this.applicantIndex].incomeDetails.assessmentMethodology);
          } else {
            // this.selectedAssesmentMethodology = this.assessmentMethodology[0];
            this.selectedAssesmentMethodology = this.defaultItem;
          }
        } else {
          this.assessmentMethodology = [];
          // this.selectedAssesmentMethodology = null;
          this.selectedAssesmentMethodology = this.defaultItem;

        }
      }
      // , err => {
      //   this.isErrorModal = true;
      //   this.errorMessage = 'Something went wrong.';
      // }
    );
    }
  }

  loadOccupationTypeLovs(occupationType?: string) {
    let occupationData = {
      userId: parseInt(localStorage.getItem("userId")),
      applicantType: this.qde.application.applicants[this.applicantIndex].isIndividual == true ? 1 : 2,
      isMainApplicant : this.qde.application.applicants[this.applicantIndex].isMainApplicant,
      isMale : this.qde.application.applicants[this.applicantIndex].personalDetails.gender == '1' ? true : false
    };

    this.qdeHttp.getOccupationLov(occupationData).subscribe(response => {
      this.occupations = JSON.parse(response["ProcessVariables"]["response"])['occupation'];
      console.log("Occupation Type", this.occupations);

      if (occupationType != null && occupationType !="") {
        this.selectedOccupation = this.occupations.some(v => v.value == occupationType) ? this.occupations.find(v => v.value == occupationType) : this.occupations[0];
      } else {
        this.selectedOccupation = this.defaultItem;
      }
      // this.selectedOccupation = this.occupations["occupation"]
      console.log("Select Occupation Type", this.selectedOccupation)
      this.selectValueChangedOccupation(this.selectedOccupation)
    }
    // , err => {
    //   this.isErrorModal = true;
    //   this.errorMessage = 'Something went wrong.';
    // }
  );
  }


  doNothing(event) {
    event.preventDefault();
  }
  setSpouseTitles(): boolean{
    var that = this;
    if(that.qde.application.applicants[that.applicantIndex].personalDetails.gender == "1"){
        that.spouseTitles = that.femaleTitles.filter( v => v.value != "2");
        if(that.isEmpty(that.selectedSpouseTitle)){
          that.selectedSpouseTitle = that.defaultItem;
        }
        console.log("spouse is female"+JSON.stringify(that.spouseTitles));
        return true;
      }else if(that.qde.application.applicants[that.applicantIndex].personalDetails.gender == "2"){
        that.spouseTitles = that.maleTitles;
        if(that.isEmpty(that.selectedSpouseTitle)){
          that.selectedSpouseTitle = that.defaultItem;
        }
        console.log("spouse is male"+JSON.stringify(that.spouseTitles));
        return true;
      }else if(that.qde.application.applicants[that.applicantIndex].personalDetails.gender == "1010"){
        let tempTitles=[];
        tempTitles.push(that.maleTitles.find(v=> v.key=="Mr."));
        that.spouseTitles = tempTitles;
        if(that.isEmpty(that.selectedSpouseTitle)){
          that.selectedSpouseTitle = that.defaultItem;
        }
        console.log("spouse can be Either"+JSON.stringify(that.spouseTitles));
        return true;
      }else{
        console.log("Invalid Gender");
        return false;
      }
  }
  resetSpouseTitles(){
      this.selectedSpouseTitle = this.defaultItem
      if(!this.isEmpty(this.selectedSpouseTitle)){
        let result = this.setSpouseTitles();
        console.log("reset "+result);
      }
    }
      isEmpty(obj: object){
        for(var key in obj){
        if(obj.hasOwnProperty(key)){
          return false;
        }
        }
        return true;
  }
  familyIncomevalid: boolean = false;
  checkAmountLimit(event,minAmount?,maxAmount?) {
    console.log("event ",event);
    let n = parseInt(this.getNumberWithoutCommaFormat(event.target.value));
    console.log("event ",n);
    if(minAmount != undefined && n < minAmount ){
      console.log("min ",minAmount);
      this.isLessAmount = true;
      this.requirMinAmout = minAmount;
    } else if(n >= maxAmount && !maxAmount){
      console.log("max ",maxAmount);
      this.isMaxAmount = true;
      this.requirMaxAmout = maxAmount;
    } else {
      this.isLessAmount = false;
      this.requirMinAmout="";
      this.isMaxAmount = false;
      this.requirMaxAmout="";
    }
    if(event.name ="annualFamilyIncome" &&
    Number(this.qde.application.applicants[this.applicantIndex].incomeDetails.monthlyIncome) > n){
      this.familyIncomevalid = true;
    }else{
      this.familyIncomevalid = false;
    }
  }
  requirMaxAmout1;
  requirMinAmout1;
  expenditureValid: boolean = false;
  checkAmountLimitMonthlyIncome(event,minAmount?,maxAmount?) {
    let n = parseInt(this.getNumberWithoutCommaFormat(event.target.value));
    if(n < minAmount && minAmount != undefined ) {
      this.isNumberLessThan1k = true;
      this.requirMinAmout1 = minAmount;
    } else if(n > maxAmount && maxAmount != undefined){
      this.isNumberMoreThan100cr = true;
      this.requirMaxAmout1 = maxAmount;
    }
    else {
      this.isNumberLessThan1k = false;
      this.isNumberMoreThan100cr = false;
      this.requirMaxAmout1 = "";
      this.requirMinAmout1= "";
    }
    if(event.target.name =="monthlyExpenditure" && Number(this.qde.application.applicants[this.applicantIndex].incomeDetails.annualFamilyIncome) < n){
      this.expenditureValid = true;
    } else {
      this.expenditureValid = false;
    }

  }

  getNumberWithoutCommaFormat(x: string) : string {
    return x ? x+"".split(',').join(''): '';
  }

  contactExtraFieldRemoval(){
    if(this.qde.application.applicants[this.applicantIndex].contactDetails.alternateEmailId == "" && this.isAlternateEmailId == true){
      this.addRemoveEmailField();
    }
    if(this.qde.application.applicants[this.applicantIndex].contactDetails.alternateMobileNumber == null && this.isAlternateMobileNumber == true){
      this.addRemoveMobileNumberField();
    }
    if(this.qde.application.applicants[this.applicantIndex].contactDetails.alternateResidenceNumber == "-" && this.isAlternateResidenceNumber == true){
      this.addRemoveResidenceNumberField();
    }
  }
  getFormattedDate(date) {
    console.log("in date conversion " + date);

    let dateFormat: Date = date;
    let year = dateFormat.getFullYear();
    let month = dateFormat.getMonth() + 1;
    let month1 = month < 10 ? '0' + month.toString() : '' + month.toString(); // ('' + month) for string result
    let day = date.getDate();
    day = day < 10 ? '0' + day : '' + day; // ('' + month) for string result
    let formattedDate = year + '-' + month1 + '-' + day;
    // console.log("final Value "+ formattedDate);
    return formattedDate;
  }
getBranchId(){
  let branchID
  this.cds.branchId$.subscribe( value =>
   branchID = value
    );
    return branchID;
}

}
