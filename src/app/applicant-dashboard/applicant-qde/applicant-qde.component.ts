import { Other } from './../../models/qde.model';
import { Component, OnInit, ViewChild, ElementRef, Renderer2, OnDestroy } from '@angular/core';
    
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
import { MenubarHeaderComponent } from '../../menubar-header/menubar-header.component';
import { environment } from 'src/environments/environment';

import { File } from '@ionic-native/file/ngx';
import { DeviceDetectorService } from 'ngx-device-detector';






interface Item {
  key: string,
  value: number | string
}

@Component({
  selector: 'app-applicant-qde',
  templateUrl: './applicant-qde.component.html',
  styleUrls: ['./applicant-qde.component.css']
})
export class ApplicantQdeComponent implements OnInit, OnDestroy {

  isMobile:any;

  capacitor= {
    DEBUG: false
  };

  readonly errors = errors;

  // regexPatternForDocType: Array<string> = ['[A-Z]{1}[0-9]{7}','^[A-Z]{2}[0-9]{13}$','^[A-Z]{3}[0-9]{7}$','[2-9]{1}[0-9]{11}','[0-9]{18}','[0-9]{14}','[0-9]{16}'];
  
  regexPatternForDocType:Array<any>=[{pattern:'[A-Z]{1}[0-9]{7}',hint:"V1234567"},{pattern:'^[A-Z]{2}[0-9]{13}$',hint:"AN01/2010/0051926"},{pattern:'^[A-Z]{3}[0-9]{7}$',hint:"LWN5672084"},{pattern:'[2-9]{1}[0-9]{11}',hint:"12 digit number, with first digit not 0 or 1"},{pattern:'[0-9]{18}',hint:"	18 digit number"},{pattern:'[0-9]{14}',hint:"	14 digit number"},{pattern:'[0-9]{16}',hint:"	16 digit number"}]
  
  maxlength:Array<string> = ['8','15','10','12','18','14','16'];

  panImage:String;

  imageURI:String;

  isTabDisabled:boolean;
  docName:boolean;

  regexPattern = {
    mobileNumber: "^[0-9]*$",
    name: "^[A-Za-z, ]+$",
    address : "^[0-9A-Za-z, _&'/#]+$",
    // cityState:"^[0-9A-Za-z, &'#]$",
    pinCode: "^[1-9][0-9]{5}$",
    pan:"[A-Z]{5}[0-9]{4}[A-Z]{1}",
    // amount:"[0-9]{0,17}\.[0-9]{1,4}?$",
    amount:"^[\\d]{0,10}([.][0-9]{0,4})?",
    email:"^\\w+([\.-]?\\w+)*@\\w+([\.-]?\\w+)*(\\.\\w{2,10})+$",
    revenue:"^[\\d]{0,10}([.][0-9]{0,4})?",
    

    // revenue:"^[\\d]{0,14}([.][0-9]{0,4})?"
   
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
  familyOptions:Options={
    floor:0,
    ceil:6,
    step: 1,
    showTicksValues: false,
    // showSelectionBar: true,
    showTicks: true,
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

  panslideSub: Subscription;

  panErrorCount: number = 0;

  constructor(private renderer: Renderer2,
              private route: ActivatedRoute,
              private router: Router,
              private qdeHttp: QdeHttpService,
              private qdeService: QdeService,
              private cds:CommonDataService,
              private file: File,
              private deviceService: DeviceDetectorService
              ) {

    this.isMobile = this.deviceService.isMobile() ;


    this.cds.changeMenuBarShown(true);
    this.cds.changeViewFormVisible(true);
    this.cds.changeLogoutVisible(true);

    const isMobile = this.deviceService.isMobile();
            
    this.panslideSub = this.cds.panslide.subscribe(val => {
      this.panslide = val;
    });

    this.cds.panslide2.subscribe(val => {
      this.panslide2 = val;
    });

    this.qdeService.qdeSource.subscribe(val => {
      console.log("VALVE: ", val);
      this.qde = val;
      this.applicantIndex = val.application.applicants.findIndex(v => v.isMainApplicant == true);
    });



    this.route.fragment.subscribe((fragment) => {
      let localFragment = fragment;

      if(fragment == null) {
        localFragment = this.fragments[0];
      }

      // Replace Fragments in url
      if( this.fragments.includes(localFragment) &&
          this.panslide == false &&
          this.panslide2 == false) {

        // if(this.qde.application.applicants[this.applicantIndex].isIndividual == true) {
        //   if(localFragment == 'pan1') {
        //     this.tabSwitch(0);
        //     this.panSlider2.setIndex(1);
        //   }
        // } else if(this.qde.application.applicants[this.applicantIndex].isIndividual == false) {
        //   if(localFragment == 'pan2') {
        //     this.tabSwitch(10);
        //   }
        // }

        this.activeTab = this.fragments.indexOf(localFragment);
        this.tabSwitch(this.activeTab);
        this.applicantIndividual = (this.activeTab >= 10) ? false: true;
      }
    });
    
  }
  
  panslide: boolean;
  panslide2: boolean;

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

      this.resetQdeForm();

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


      // Document Type
      if( ! isNaN(parseInt(this.qde.application.applicants[this.applicantIndex].pan.docType)) ) {
        this.selectedDocType = this.docType[(parseInt(this.qde.application.applicants[this.applicantIndex].pan.docType))-1];
      } 

      // Personal Details Title
      if( ! isNaN(parseInt(this.qde.application.applicants[this.applicantIndex].personalDetails.title)) ) {
        this.selectedTitle = this.titles[(parseInt(this.qde.application.applicants[this.applicantIndex].personalDetails.title))-1];
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
        this.selectedAssesmentMethodology = this.assessmentMethodology[(parseInt(this.qde.application.applicants[this.applicantIndex].incomeDetails.assessmentMethodology))-1];
      }

      // Incoming from create in Individual Pan
      if(this.panslide == true && this.qde.application.applicants[this.applicantIndex].isIndividual == true) {
         this.panSlider2.setIndex(2);
        //this.tabSwitch(2);
      }
      // Incoming from create in Non Individual Pan
      else if(this.panslide2 == true && this.qde.application.applicants[this.applicantIndex].isIndividual == false) {
        this.tabSwitch(11);
        //this.panSlider4.setIndex(1);
      } else if(this.panslide == false && this.qde.application.applicants[this.applicantIndex].isIndividual == true) {
        this.tabSwitch(0);
        // this.panSlider2.setIndex(2);
      }
      else if(this.panslide2 == false && this.qde.application.applicants[this.applicantIndex].isIndividual == false) {
        this.tabSwitch(10);
        // Enable it when upload file is enabled
        // this.panSlider4.setIndex(1);
      }

      // So that route is now in edit mode only
      this.cds.changePanSlide(false);
      this.cds.changePanSlide2(false);

      this.initializeVariables();
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

    }
  }

  onBackButtonClick(swiperInstance ?: Swiper) {

    if(this.activeTab > 0) {
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


    this.qde.application.applicants[this.applicantIndex].pan.panNumber = form.value.pan;
    this.qde.application.applicants[this.applicantIndex].pan.docType = form.value.docTypeindividual.value;
    this.qde.application.applicants[this.applicantIndex].pan.docNumber = form.value.docNumber;

    /*this.qdeHttp.checkPanValid(this.qdeService.getFilteredJson({actualPanNumber: form.value.pan})).subscribe((response) => {

      response["ProcessVariables"]["status"] = true;

      if(response["ProcessVariables"]["status"]) { // Boolean to check from nsdl website whether pan is valid or not 
        
        this.qde.application.applicants[this.applicantIndex].pan.isValid = true;
        this.qde.application.applicants[this.applicantIndex].pan.errorMessage = "Error in pan Details";

        let processVariables = response["ProcessVariables"];
        this.qde.application.applicants[this.applicantIndex].personalDetails.firstName = processVariables["firstName"];
        this.qde.application.applicants[this.applicantIndex].personalDetails.lastName = processVariables["lastName"];*/

        this.qdeHttp.createOrUpdatePanDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
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
              let applicationId = result['application']['applicationId'];
              this.qdeHttp.setStatusApi( applicationId, environment.status.QDECREATED).subscribe((response) => {
                if(response["ProcessVariables"]["status"] == true) { 
                  this.cds.changePanSlide(true);
                  this.router.navigate(['/applicant/'+this.qde.application.applicationId]);
                }
              });

            }else {
            //  this.cds.changePanSlide(true);
             this.panSlider2.setIndex(2);
             // this.tabSwitch(1);
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

      /*} else {
        this.qde.application.applicants[this.applicantIndex].pan.isValid = false;
        this.qde.application.applicants[this.applicantIndex].pan.errorMessage = "Error in pan Details";
      }
    });*/


  }


  //-------------------------------------------------------------
  // PAN
  //-------------------------------------------------------------

  submitOrgPanNumber(form: NgForm, swiperInstance ?: Swiper) {
    event.preventDefault();

    if (form && !form.valid) {
      return;
    }

    this.qde.application.applicants[this.applicantIndex].pan.panNumber = form.value.pan;
    this.qde.application.applicants[this.applicantIndex].pan.docType = form.value.panDocType.value;
    this.qde.application.applicants[this.applicantIndex].pan.docNumber = form.value.docNumber;

    /*this.qdeHttp.checkPanValid(this.qdeService.getFilteredJson({actualPanNumber: form.value.pan})).subscribe((response) => {

    response["ProcessVariables"]["status"] = true;

    if(response["ProcessVariables"]["status"]) { // Boolean to check from nsdl website whether pan is valid or not 

      this.qde.application.applicants[this.applicantIndex].pan.isValid = true;
      this.qde.application.applicants[this.applicantIndex].pan.errorMessage = "";

      let processVariables = response["ProcessVariables"];//need to check its needed for non individual
      this.qde.application.applicants[this.applicantIndex].personalDetails.firstName = processVariables["firstName"];
      this.qde.application.applicants[this.applicantIndex].personalDetails.lastName = processVariables["lastName"];*/

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
                this.router.navigate(['/applicant/'+this.qde.application.applicationId]);
              }
            });

          }else {
            this.tabSwitch(11);
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
    /*} else {
        this.qde.application.applicants[this.applicantIndex].pan.isValid = false;
        this.qde.application.applicants[this.applicantIndex].pan.errorMessage = "Error in pan Details";
      }
    });*/  
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

    this.qde.application.applicants[this.applicantIndex].personalDetails.title = form.value.title.value;
    this.qde.application.applicants[this.applicantIndex].personalDetails.firstName = form.value.firstName;
    this.qde.application.applicants[this.applicantIndex].personalDetails.middleName = form.value.middleName;
    this.qde.application.applicants[this.applicantIndex].personalDetails.lastName = form.value.lastName;

    console.log("*", this.qde);
    console.log("**", this.qdeService.getFilteredJson(this.qde));

    this.qdeService.setQde(this.qde);

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

    this.qde.application.applicants[this.applicantIndex].personalDetails.applicantStatus = value;


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

    this.qde.application.applicants[this.applicantIndex].personalDetails.gender = value;

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

    this.qde.application.applicants[this.applicantIndex].personalDetails.qualification = form.value.qualification.value;

    console.log(this.qde.application.applicants[this.applicantIndex]);

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


  ageError=false;

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

    this.qde.application.applicants[this.applicantIndex].personalDetails.dob = form.value.year.value+'-'+form.value.month.value+'-'+form.value.day.value;
    this.qde.application.applicants[this.applicantIndex].personalDetails.birthPlace = form.value.birthPlace;

    console.log(this.qde.application.applicants[this.applicantIndex]);

    this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
      // If successful
      if(response["ProcessVariables"]["status"]) {
        this.tabSwitch(2);
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

    this.qde.application.applicants[this.applicantIndex].contactDetails.preferredEmailId = form.value.preferEmailId;
    this.qde.application.applicants[this.applicantIndex].contactDetails.alternateEmailId = form.value.alternateEmailId;
    this.qde.application.applicants[this.applicantIndex].contactDetails.mobileNumber = form.value.mobileNumber;
    this.qde.application.applicants[this.applicantIndex].contactDetails.alternateMobileNumber = form.value.alternateMobileNumber;
    this.qde.application.applicants[this.applicantIndex].contactDetails.residenceNumber = form.value.residenceNumber1+'-'+form.value.residenceNumber2;
    this.qde.application.applicants[this.applicantIndex].contactDetails.alternateResidenceNumber = form.value.alternateResidenceNumberStd1+'-'+form.value.alternateResidenceNumber2;


    
    console.log("CONTACT DETAILS", this.qde.application.applicants[this.applicantIndex]);
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

          this.qde.application.applicants[this.applicantIndex][screenName].zipcodeId = result.zipcodeId;
          this.qde.application.applicants[this.applicantIndex][screenName].stateId = result.stateId;
          this.qde.application.applicants[this.applicantIndex][screenName].cityId = result.cityId;
  
  
          this.qde.application.applicants[this.applicantIndex][screenName].city = result.city;
          this.qde.application.applicants[this.applicantIndex][screenName].state = result.state;
          this.qde.application.applicants[this.applicantIndex][screenName].cityState = this.commCityState || "XXXX YYYY";  
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


  //-------------------------------------------------------------
  // Marital Status
  //-------------------------------------------------------------
  submitMaritalStatus(form: NgForm, swiperInstance ?: Swiper) {

    if (form && !form.valid) {
      return;
    }

    this.qde.application.applicants[this.applicantIndex].maritalStatus.status = form.value.maritalStatus.value;


    console.log(this.qde.application.applicants[this.applicantIndex].maritalStatus);
    this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
      // If successful
      if(response["ProcessVariables"]["status"]) {
        // Dont show spouse details for Single

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

  submitSpouseName(form: NgForm, swiperInstance ?: Swiper) {

    if (form && !form.valid) {
      return;
    }

    this.qde.application.applicants[this.applicantIndex].maritalStatus.spouseTitle = form.value.spouseTitle.value;
    this.qde.application.applicants[this.applicantIndex].maritalStatus.firstName = form.value.firstName;

    console.log(this.qde.application.applicants[this.applicantIndex].maritalStatus);
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

    this.qde.application.applicants[this.applicantIndex].maritalStatus.earning = (value == 1) ? true: false;

    console.log(this.qde.application.applicants[this.applicantIndex].maritalStatus);
    this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
      // If successful
      if(response["ProcessVariables"]["status"]) {
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

  submitSpouseEarningAmt(form: NgForm, swiperInstance ?: Swiper) {

    if (form && !form.valid) {
      return;
    }

    // Amount should be number
    if(isNaN(parseInt(form.value.amount))) {
      return;
    }

    this.qde.application.applicants[this.applicantIndex].maritalStatus.amount = form.value.amount;

    console.log(this.qde.application.applicants[this.applicantIndex].maritalStatus);

    this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
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

  //-------------------------------------------------------------


  //-------------------------------------------------------------
  // Family Details
  //-------------------------------------------------------------
  submitFamilyForm1(form: NgForm, swiperInstance ?: Swiper) {

    if (form && !form.valid) {
      return;
    }

    this.qde.application.applicants[this.applicantIndex].familyDetails.numberOfDependents = form.value.numberOfDependents;

    console.log(this.qde.application.applicants[this.applicantIndex].familyDetails);

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

    this.qde.application.applicants[this.applicantIndex].familyDetails.fatherTitle = form.value.fatherTitle.value;
    this.qde.application.applicants[this.applicantIndex].familyDetails.fatherName = form.value.fatherName;
    this.qde.application.applicants[this.applicantIndex].familyDetails.motherTitle = form.value.motherTitle.value;
    this.qde.application.applicants[this.applicantIndex].familyDetails.motherName = form.value.motherName;
    this.qde.application.applicants[this.applicantIndex].familyDetails.motherMaidenName = form.value.motherMaidenName;

    console.log(">>>", this.qde.application.applicants[this.applicantIndex].familyDetails);

    this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
      // If successful
      if(response["ProcessVariables"]["status"]) {
        this.tabSwitch(6);
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

    this.qde.application.applicants[this.applicantIndex].other.religion = form.value.religion.value;
    // if(form.value.religion.value == '6') {
    //   // this.otherReligion = 
    // }

    this.qde.application.applicants[this.applicantIndex].other.category = form.value.category.value;

    // this.qde.application.applicants[this.applicantIndex].familyDetails.fatherTitle = form.value.fatherTitle;

    console.log("Other: ", this.qde.application.applicants[this.applicantIndex].other);

    this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
      // If successful
      if(response["ProcessVariables"]["status"]) {
        this.tabSwitch(7);
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




    this.qde.application.applicants[this.applicantIndex].occupation.occupationType = this.selectedOccupation.value.toString();
    if(this.selectedOccupation.value.toString() != '9' && this.selectedOccupation.value.toString() != '10') {
      this.qde.application.applicants[this.applicantIndex].occupation.companyName = form.value.companyName;
    }

    if(this.selectedOccupation.value.toString() != '9' && this.selectedOccupation.value.toString() != '10') {
      this.qde.application.applicants[this.applicantIndex].occupation.numberOfYearsInCurrentCompany = (this.selectedOccupation.value.toString() != '9' && this.selectedOccupation.value.toString() != '10') ? form.value.numberOfYearsInCurrentCompany : 0;
    }

    if(this.selectedOccupation.value.toString() != '9' && this.selectedOccupation.value.toString() != '10') {
      this.qde.application.applicants[this.applicantIndex].occupation.totalWorkExperience = (this.selectedOccupation.value.toString() != '9' && this.selectedOccupation.value.toString() != '10') ? form.value.totalExperienceYear : 0;
    }

    console.log(this.qde.application.applicants[this.applicantIndex].occupation);

    this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
      // If successful
      if(response["ProcessVariables"]["status"]) {
        this.tabSwitch(8);
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
  // Organization Details
  //-------------------------------------------------------------
  submitOrganizationDetails(form: NgForm) {
    if (form && !form.valid) {
      return;
    }

    console.log(form);
    this.qde.application.applicants[this.applicantIndex].organizationDetails.nameOfOrganization = form.value.orgName;
    this.qde.application.applicants[this.applicantIndex].organizationDetails.dateOfIncorporation = form.value.year.value+'-'+form.value.month.value+'-'+form.value.day.value;
    this.qde.application.applicants[this.applicantIndex].organizationDetails.constitution = form.value.constitution.value;

    console.log(this.qde.application.applicants[this.applicantIndex].organizationDetails);

    this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
      // If successful
      if(response["ProcessVariables"]["status"]) {
        let result = this.parseJson(response["ProcessVariables"]["response"]);
        // this.qde.application.ocsNumber = result["application"]["ocsNumber"];
        // this.qde.application.applicants[this.applicantIndex].applicantId = result["application"]["applicationId"];
        this.tabSwitch(12);
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

    // let zipCityStateID = this.qde.application.applicants[this.applicantIndex].registeredAddress.zipCityStateID

    // let zipId = zipCityStateID.split(',')[0] || "";
    // let cityId = zipCityStateID.split(',')[1] || "";
    // let stateId = zipCityStateID.split(',')[2] || "";



    this.qde.application.applicants[this.applicantIndex].registeredAddress = {
      registeredAddress : form.value.regAdd,
      landMark : form.value.landmark,
      zipcodeId : this.qde.application.applicants[this.applicantIndex].registeredAddress.zipcodeId,
      cityId : this.qde.application.applicants[this.applicantIndex].registeredAddress.cityId,
      stateId : this.qde.application.applicants[this.applicantIndex].registeredAddress.stateId,
    };

    console.log(this.qde.application.applicants[this.applicantIndex].registeredAddress);

    this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
      // If successfull
      if(response["ProcessVariables"]["status"]) {
        this.tabSwitch(13);
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


    this.qde.application.applicants[this.applicantIndex].corporateAddress.corporateAddress =  form.value.corpAddress;
    this.qde.application.applicants[this.applicantIndex].corporateAddress.landMark = form.value.landmark;
    this.qde.application.applicants[this.applicantIndex].corporateAddress.zipcodeId = this.qde.application.applicants[this.applicantIndex].corporateAddress.zipcodeId;
    this.qde.application.applicants[this.applicantIndex].corporateAddress.cityId =  this.qde.application.applicants[this.applicantIndex].corporateAddress.cityId;
    this.qde.application.applicants[this.applicantIndex].corporateAddress.stateId = this.qde.application.applicants[this.applicantIndex].corporateAddress.stateId;

    this.qde.application.applicants[this.applicantIndex].corporateAddress.stdNumber = form.value.stdNumber+"-"+form.value.phoneNumber;
    this.qde.application.applicants[this.applicantIndex].corporateAddress.officeEmailId = form.value.officeEmailId;


    console.log(this.qde.application.applicants[this.applicantIndex].corporateAddress);

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
  // Revenue Details
  //-------------------------------------------------------------
  submitRevenueDetails(form: NgForm) {
    if (form && !form.valid) {
      return;
    }


    this.qde.application.applicants[this.applicantIndex].revenueDetails.revenue = parseInt(form.value.revenue);
    this.qde.application.applicants[this.applicantIndex].revenueDetails.annualNetIncome = parseInt(form.value.annualNetIncome);
    this.qde.application.applicants[this.applicantIndex].revenueDetails.grossTurnOver = parseInt(form.value.grossTurnOver);

    console.log(this.qde.application.applicants[this.applicantIndex].revenueDetails);

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

  //-----------------------------------------------------------------------
  // Income Details
  //-----------------------------------------------------------------------

  submitIncomeDetails1(form: NgForm, swiperInstance ?: Swiper) {
    if (form && !form.valid) {
      return;
    }

    this.qde.application.applicants[this.applicantIndex].incomeDetails.annualFamilyIncome = form.value.annualFamilyIncome ? form.value.annualFamilyIncome: "";
    this.qde.application.applicants[this.applicantIndex].incomeDetails.monthlyExpenditure = form.value.monthlyExpenditure ? form.value.monthlyExpenditure: "";

    // this.qde.application.applicants[this.applicantIndex].incomeDetails.incomeConsider = form.value.incomeConsider;
    // this.qde.application.applicants[this.applicantIndex].incomeDetails.monthlyIncome = form.value.monthlyIncome;
    // this.qde.application.applicants[this.applicantIndex].incomeDetails.assessmentMethodology = form.value.assessmentMethodology;

    console.log("INCOME DETAILS: ", this.qde.application.applicants[this.applicantIndex].incomeDetails);

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

    this.qde.application.applicants[this.applicantIndex].incomeDetails.monthlyIncome = form.value.monthlyIncome;
    this.qde.application.applicants[this.applicantIndex].incomeDetails.assessmentMethodology = this.selectedAssesmentMethodology['value'];

    console.log("ID: ", this.qde.application.applicants[this.applicantIndex].incomeDetails);

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

  selectPuccaHouse(value) {
    this.qde.application.applicants[this.applicantIndex].incomeDetails.puccaHouse = (value == 1) ? true: false;
  }

  parseJson(response):JSON {
    let result = JSON.parse(response);
    return result;
  }

  parseInteger(value:any):number {
    return parseInt(value);
  }


  changeIsIndividual(value, swiperInstance ?: Swiper) {
    console.log("IS INDIVIDUAL CHANGE: ", value);
    if(value == 1) {
      this.goToNextSlide(swiperInstance);
      this.qde.application.applicants[this.applicantIndex].isIndividual = true;
    } else {
      this.tabSwitch(10);
      this.qde.application.applicants[this.applicantIndex].isIndividual = false;
    }
  }

  changeResidentialNon(value, swiperInstance ?: Swiper) {
    this.qde.application.applicants[this.applicantIndex].personalDetails.applicantStatus = value;
    
    // Make API Request to save that is submitpersonaldetails

  }


  counter(size): Array<number> {
    return new Array(size);
  }

  incomeDetailsYesNo(value, swiperInstance ?: Swiper) {
    this.qde.application.applicants[this.applicantIndex].incomeDetails.incomeConsider = (value == 1) ? true : false;

    console.log(">>>", this.qde.application.applicants[this.applicantIndex].incomeDetails);

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

  submitOTP() {
    console.log("Towards OTP");
    this.qdeHttp.sendOTPAPI().subscribe(res => {
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
    console.log("Payment gateway")
    this.qdeHttp.validateOTPAPI().subscribe(res => {
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

  changeApplicantStatus(value, swiperInstance ?: Swiper) {
    if(value == 1) {
      this.qde.application.applicants[this.applicantIndex].personalDetails.applicantStatus = "1";
    } else {
      this.qde.application.applicants[this.applicantIndex].personalDetails.applicantStatus = "2";
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

    if(this.qde.application.applicants[this.applicantIndex].occupation.numberOfYearsInCurrentCompany <= this.qde.application.applicants[this.applicantIndex].occupation.totalWorkExperience) {
      // Next button should be enabled
      this.expError = false;
    } else {
      this.expError = true;
    }
  }

  ngOnDestroy() {
    this.panslideSub.unsubscribe();
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

        this.qdeHttp.createOrUpdatePanDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
          // If successful
          if(response["ProcessVariables"]["status"] == true) {
            alert("Switch to tab 1");
            this.tabSwitch(1);
          }
        });
      } else {
        // Throw Invalid Pan Error
        alert(JSON.parse(data["response"]));
      }
    });
  }
}
