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

  regexPattern = {
    mobileNumber: "^[0-9]*$",
    name: "^[A-Za-z, ]+$",
    address : "^[0-9A-Za-z, _&'/#]+$",
    // cityState:"^[0-9A-Za-z, &'#]$",
    pinCode: "^[1-9][0-9]{5}$",
    pan:"[A-Z]{5}[0-9]{4}[A-Z]{1}",
    amount:"^[\\d]{0,14}([.][0-9]{0,4})?",
    revenue:"^[1-9][0-9]{0,17}",
    docNumber: "^[a-zA-Z0-9]{0,16}$"

    // revenue:"^[0-9]{0,17}\.[0-9]{1,4}?$"
   
  };

  value: Array<number> = [0,0,0,0];

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
  YYYY: number = 1900;

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
                        'income2',
                      ];

  coApplicantIndex: number = 0;

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
  birthPlace: Array<any>;
  selectedBirthPlace: Item;

  // Used when to whether its coming from create or edit
  panslide: boolean;
  panslide2: boolean;
  applicationId: string;

  panslideSub: Subscription;
  panslide2Sub: Subscription;
  qdeSourceSub: Subscription;
  fragmentSub: Subscription;
  paramsSub: Subscription;

  constructor(private renderer: Renderer2,
              private route: ActivatedRoute,
              private router: Router,
              private qdeHttp: QdeHttpService,
              private qdeService: QdeService,
              private cds: CommonDataService) {

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
      let i = this.qde.application.applicants.length <= 1 ? 0 : this.qde.application.applicants.length - 1;
      if(this.qde.application.applicants.length > i && this.qde.application.applicants[i]['applicantId'] == "") {
        this.coApplicantIndex = i;
      }
      this.coApplicantsForDashboard = val.application.applicants.filter(v => v.isMainApplicant == false);
      console.log('coApplicantsForDashboard: ', this.coApplicantsForDashboard);
    });

    this.cds.applicationId.subscribe(val => {
      this.applicationId = val;
    });

    this.route.fragment.subscribe((fragment) => {
      let localFragment = fragment;

      if(fragment == null) {
        localFragment = this.fragments[0];
      }
      console.log('FRAGMENTS................................')
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
      this.docType = lov.LOVS.document_type;
      this.maritals = lov.LOVS.maritial_status;
      this.relationships = lov.LOVS.relationship;
      this.loanpurposes = lov.LOVS.loan_purpose;
      this.categories = lov.LOVS.category;
      this.genders = lov.LOVS.gender;
      this.constitutions = lov.LOVS.constitution;
      this.assessmentMethodology = lov.LOVS.assessment_methodology;
      this.birthPlace = lov.LOVS.birthplace;
      //hardcoded
      this.birthPlace = [{"key": "Chennai", "value": "1"},{"key": "Mumbai", "value": "2"},{"key": "Delhi", "value": "3"}];
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
        let v = (this.YYYY+index)+"";
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
      this.selectedBirthPlace = this.birthPlace[0];
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
            this.prefillData(params);
          });
        // }
      }
    });
  }

  valuechange(newValue, valueIndex) {
    this.value[valueIndex] = newValue;
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

    if(tabIndex == 0) {
      // Remove not saved coapplicants
      this.qde.application.applicants = this.qde.application.applicants.filter(v => v.applicantId != "");
      this.qdeService.setQde(this.qde);
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
    this.qde.application.applicants[this.coApplicantIndex].pan.docType = form.value.docType.value;
    this.qde.application.applicants[this.coApplicantIndex].pan.docNumber = form.value.docNumber;

    this.qdeHttp.createOrUpdatePanDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
      // If successful
      if(response["ProcessVariables"]["status"]) {
        let result = this.parseJson(response["ProcessVariables"]["response"]);

        console.log("GET141414", result);
        // this.qde.application.ocsNumber = result["application"]["ocsNumber"];
        // this.qde.application.applicationId = result["application"]["applicationId"];
       
        let applicants = result["application"]["applicants"];

        // let isApplicantPresent:boolean = false;

        if(applicants.length > 0) {
          // isApplicantPresent = applicants[this.applicantIndex].hasOwnProperty('applicantId');
          // this.qde.application.applicants[this.coApplicantIndex].applicantId =  applicants[this.coApplicantIndex]["applicantId"];
          this.cds.changePanSlide(true);
          this.router.navigate(['/applicant/'+this.qde.application.applicationId+'/co-applicant/'+this.coApplicantIndex], {fragment: "pan1"});
        }else {
          this.tabSwitch(1);
          return;
        }   

        
        // Static value for now, replace it in future
        

      } else {
        // Throw Invalid Pan Error
      }
    }, (error) => {
      console.log('error ', error);
      alert("error"+error);
      // Throw Request Failure Error
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

    this.qdeHttp.createOrUpdatePanDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
      // If successfull
      if(response["ProcessVariables"]["status"]) {
        let result = this.parseJson(response["ProcessVariables"]["response"]);

        // console.log("GET141414", result);
        // this.qde.application.ocsNumber = result["application"]["ocsNumber"];
        // this.qde.application.applicationId = result["application"]["applicationId"];
       
        // let applicants = result["application"]["applicants"];

        // let isApplicantPresent:boolean = false;

        // if(applicants.length > 0) {
        //   // isApplicantPresent = applicants[this.applicantIndex].hasOwnProperty('applicantId');
        //   this.qde.application.applicants[this.coApplicantIndex].applicantId =  applicants[this.coApplicantIndex]["applicantId"];
        // }else {
        //   this.tabSwitch(1);
        //   return;
        // }   

        this.cds.changePanSlide2(true);
        this.router.navigate(['/applicant/'+this.qde.application.applicationId+'/co-applicant/'+this.coApplicantIndex], {fragment: "pan2"});
      } else {
        // Throw Invalid Pan Error
      }
    }, (error) => {
      console.log('error ', error);
      alert("error"+error);
      // Throw Request Failure Error
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

  submitGenderDetails(event: Event, form: NgForm, swiperInstance ?: Swiper) {
    console.log(event);
    event.preventDefault();

    if (form && !form.valid) {
      return;
    }

    this.qde.application.applicants[this.coApplicantIndex].personalDetails.gender = form.value.gender;

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

  submitDobDetails(form: NgForm, swiperInstance ?: Swiper) {
    event.preventDefault();

    if (form && !form.valid) {
      return;
    }

    this.qde.application.applicants[this.coApplicantIndex].personalDetails.dob = form.value.year.value+'-'+form.value.month.value+'-'+form.value.day.value;
    this.qde.application.applicants[this.coApplicantIndex].personalDetails.birthPlace = form.value.birthPlace.value;

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
            alert("Pin code not available / enter proper pincode");
          }

          this.qde.application.applicants[this.coApplicantIndex][screenName].zipcodeId = result.zipcodeId;
          this.qde.application.applicants[this.coApplicantIndex][screenName].stateId = result.stateId;
          this.qde.application.applicants[this.coApplicantIndex][screenName].cityId = result.cityId;
  
  
          this.qde.application.applicants[this.coApplicantIndex][screenName].city = result.city;
          this.qde.application.applicants[this.coApplicantIndex][screenName].state = result.state;
          this.qde.application.applicants[this.coApplicantIndex][screenName].cityState = this.commCityState || "XXXX YYYY";  
        }
        else if(response['Error'] == '1') {
          alert("Invalid Pin");
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


    this.qde.application.applicants[this.coApplicantIndex].communicationAddress = {
      residentialStatus : form.value.residentialStatus,
      addressLineOne : form.value.addressLineOne,
      addressLineTwo : form.value.addressLineTwo,
      zipcodeId : this.qde.application.applicants[this.coApplicantIndex].communicationAddress.zipcodeId,
      cityId : this.qde.application.applicants[this.coApplicantIndex].communicationAddress.cityId,
      stateId : this.qde.application.applicants[this.coApplicantIndex].communicationAddress.stateId,
      numberOfYearsInCurrentResidence : form.value.numberOfYearsInCurrentResidence,
      permanentAddress : form.value.permanentAddress,
      preferredMailingAddress: (form.value.prefredMail == 1) ? true: false
    };


    this.qde.application.applicants[this.coApplicantIndex].permanentAddress = {
      addressLineOne : form.value.pAddressLineOne,
      addressLineTwo : form.value.pAddressLineTwo,
      zipcodeId : this.qde.application.applicants[this.coApplicantIndex].permanentAddress.zipcodeId,
      cityId : this.qde.application.applicants[this.coApplicantIndex].permanentAddress.cityId,
      stateId : this.qde.application.applicants[this.coApplicantIndex].permanentAddress.stateId,
      numberOfYearsInCurrentResidence : form.value.numberOfYearsInCurrentResidence
    };

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

  submitSpouseEarning(form: NgForm, swiperInstance ?: Swiper) {

    if (form && !form.valid) {
      return;
    }

    this.qde.application.applicants[this.coApplicantIndex].maritalStatus.earning = (form.value.earning == 1) ? true: false;

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
      alert("error"+error);
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
        this.tabSwitch(7);
      } else {
        // Throw Invalid Pan Error
      }
    }, (error) => {
      console.log("response : ", error);
      this.tabSwitch(7);
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

    this.qde.application.applicants[this.coApplicantIndex].familyDetails.fatherTitle = form.value.fatherTitle;
    this.qde.application.applicants[this.coApplicantIndex].familyDetails.fatherName = form.value.fatherName;
    this.qde.application.applicants[this.coApplicantIndex].familyDetails.motherTitle = form.value.motherTitle;
    this.qde.application.applicants[this.coApplicantIndex].familyDetails.motherName = form.value.motherName;
    this.qde.application.applicants[this.coApplicantIndex].familyDetails.motherMaidenName = form.value.motherMaidenName;

    console.log(">>>", this.qde.application.applicants[this.coApplicantIndex].familyDetails);

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
  // Other Details
  //-------------------------------------------------------------
  submitOtherForm(form: NgForm) {

    if (form && !form.valid) {
      return;
    }

    this.qde.application.applicants[this.coApplicantIndex].other.religion = form.value.religion;
    if(form.value.religion == '6') {
      // this.otherReligion = 
    }

    this.qde.application.applicants[this.coApplicantIndex].other.category = form.value.category;

    // this.qde.application.applicants[this.coApplicantIndex].familyDetails.fatherTitle = form.value.fatherTitle;

    console.log("Other: ", this.qde.application.applicants[this.coApplicantIndex].other);

    this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
      // If successful
      if(response["ProcessVariables"]["status"]) {
        this.tabSwitch(9);
      } else {
        // Throw Invalid Pan Error
      }
    }, (error) => {
      console.log("response : ", error);
      alert("error"+error);
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

    this.qde.application.applicants[this.coApplicantIndex].occupation.occupationType = form.value.occupationType.value;
    this.qde.application.applicants[this.coApplicantIndex].occupation.companyName = form.value.companyName;
    this.qde.application.applicants[this.coApplicantIndex].occupation.numberOfYearsInCurrentCompany = form.value.numberOfYearsInCurrentCompany;
    this.qde.application.applicants[this.coApplicantIndex].occupation.totalWorkExperience = form.value.totalExperienceYear;

    console.log(this.qde.application.applicants[this.coApplicantIndex].occupation);

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
        this.tabSwitch(11);
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



    this.qde.application.applicants[this.coApplicantIndex].registeredAddress = {
      registeredAddress : form.value.regAdd,
      landMark : form.value.landmark,
      zipcodeId : this.qde.application.applicants[this.coApplicantIndex].registeredAddress.zipcodeId,
      cityId : this.qde.application.applicants[this.coApplicantIndex].registeredAddress.cityId,
      stateId : this.qde.application.applicants[this.coApplicantIndex].registeredAddress.stateId,
    };

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


    this.qde.application.applicants[this.coApplicantIndex].corporateAddress = {
      corporateAddress : form.value.corpAddress,
      landMark : form.value.landmark,
      zipcodeId : this.qde.application.applicants[this.coApplicantIndex].corporateAddress.zipcodeId,
      cityId : this.qde.application.applicants[this.coApplicantIndex].corporateAddress.cityId,
      stateId : this.qde.application.applicants[this.coApplicantIndex].corporateAddress.stateId,
      stdNumber : form.value.stdNumber+"-"+form.value.phoneNumber,
      officeEmailId : form.value.officeEmailId
    };

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
    this.qde.application.applicants[this.coApplicantIndex].incomeDetails.assessmentMethodology = form.value.assessment.value;

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

  changeIsIndividual(value, swiperInstance ?: Swiper) {
    alert(value);
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
        } else {
          swiperInstance.setIndex(3);
        }
      } else {
        // Throw Invalid Pan Error
      }
    }, (error) => {
      console.log("response : ", error);
    });
  }

  doHoldPuccaHouse(value) {
    this.qde.application.applicants[this.coApplicantIndex].incomeDetails = {
      puccaHouse : value,
    };

    console.log(this.qde.application.applicants[this.coApplicantIndex].incomeDetails);

    this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
      // If successfull
      if(response["ProcessVariables"]["status"]) {
        console.log(response);
      } else {
        // Throw Invalid Pan Error
      }
    }, (error) => {
      console.log("response : ", error);
    });
  }

  selectValueChanged(event, to) {
    let whichSelectQde = this.qde.application.applicants[this.coApplicantIndex];
    let nick = to.getAttribute('nick').split(".");
    to.getAttribute('nick').split(".").forEach((val, i) => {
      if(val == 'day' || val == 'month' || val == 'year') {
        this[(nick[i-1])][val] = event.value;
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
    // Static Value, replace in future
    console.log(applicationId, index);
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
    this.alternateResidenceNumberPhoneNumber = this.qde.application.applicants[this.coApplicantIndex].contactDetails.alternateResidenceNumber != "" ? this.qde.application.applicants[this.coApplicantIndex].contactDetails.residenceNumber.split("-")[1] : "";
    this.addressCityState = this.qde.application.applicants[this.coApplicantIndex].communicationAddress.city + '/'+ this.qde.application.applicants[this.coApplicantIndex].communicationAddress.state;

    this.otherReligion = this.qde.application.applicants[this.coApplicantIndex].other.religion == '6' ? this.qde.application.applicants[this.coApplicantIndex].other.religion : '';

    this.registeredAddressCityState = this.qde.application.applicants[this.coApplicantIndex].registeredAddress.city +'/'+ this.qde.application.applicants[this.coApplicantIndex].registeredAddress.state;
    this.corporateAddressCityState = this.qde.application.applicants[this.coApplicantIndex].corporateAddress.city +'-'+ this.qde.application.applicants[this.coApplicantIndex].corporateAddress.state;
    this.corporateAddressStdCode = this.qde.application.applicants[this.coApplicantIndex].corporateAddress.stdNumber != "" ? this.qde.application.applicants[this.coApplicantIndex].corporateAddress.stdNumber.split("-")[0] : "";
    this.corporateAddressPhoneNumber = this.qde.application.applicants[this.coApplicantIndex].corporateAddress.stdNumber != "" ? this.qde.application.applicants[this.coApplicantIndex].corporateAddress.stdNumber.split("-")[1] : "";
    this.officialCorrespondenceStdCode = this.qde.application.applicants[this.coApplicantIndex].officialCorrespondence.officeNumber != "" ? this.qde.application.applicants[this.coApplicantIndex].officialCorrespondence.officeNumber.split("-")[0] : "";
    this.officialCorrespondencePhoneNumber = this.qde.application.applicants[this.coApplicantIndex].officialCorrespondence.officeNumber != "" ? this.qde.application.applicants[this.coApplicantIndex].officialCorrespondence.officeNumber.split("-")[1] : "";
  }

  makePermanentAddressSame(event: boolean) {
    this.qde.application.applicants[this.coApplicantIndex].communicationAddress.permanentAddress = event;

    if(event == true) {
      this.qde.application.applicants[this.coApplicantIndex].permanentAddress.addressLineOne = this.qde.application.applicants[this.coApplicantIndex].communicationAddress.addressLineOne;
      this.qde.application.applicants[this.coApplicantIndex].permanentAddress.addressLineTwo = this.qde.application.applicants[this.coApplicantIndex].communicationAddress.addressLineTwo;
      this.qde.application.applicants[this.coApplicantIndex].permanentAddress.zipcode = this.qde.application.applicants[this.coApplicantIndex].communicationAddress.zipcode;
      this.qde.application.applicants[this.coApplicantIndex].permanentAddress.cityState = this.qde.application.applicants[this.coApplicantIndex].communicationAddress.cityState;
    } else {
      this.qde.application.applicants[this.coApplicantIndex].permanentAddress.addressLineOne = "";
      this.qde.application.applicants[this.coApplicantIndex].permanentAddress.addressLineTwo = "";
      this.qde.application.applicants[this.coApplicantIndex].permanentAddress.zipcode = "";
      this.qde.application.applicants[this.coApplicantIndex].permanentAddress.cityState = "";
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
      //------------------------------------------------------
      //    Prefilling values
      //------------------------------------------------------
      // Set CoApplicant for Prefilling the fields
      // this.coApplicantIndex = this.qde.application.applicants.indexOf(params.coApplicantIndex);

      // if ( ! isNaN(parseInt(this.qde.application.applicants[this.coApplicantIndex].pan.docType)) ) {
      //   this.selectedDocType = this.docType[parseInt(this.qde.application.applicants[this.coApplicantIndex].pan.docType)];
      // }

      // Personal Details Title
      if( ! isNaN(parseInt(this.qde.application.applicants[this.coApplicantIndex].personalDetails.title)) ) {
        this.selectedTitle = this.titles[(parseInt(this.qde.application.applicants[this.coApplicantIndex].personalDetails.title))-1];
      }

      // Personal Details Qualification
      if( ! isNaN(parseInt(this.qde.application.applicants[this.coApplicantIndex].personalDetails.qualification)) ) {
        this.selectedQualification = this.qualifications[(parseInt(this.qde.application.applicants[this.coApplicantIndex].personalDetails.qualification))-1];
      }

      // Personal Details Day
      if( ! isNaN(parseInt(this.qde.application.applicants[this.coApplicantIndex].personalDetails.dob.split('/')[2])) ) {
        this.dob.day = this.days[parseInt(this.qde.application.applicants[this.coApplicantIndex].personalDetails.dob.split('/')[2])];
      }

      // Personal Details Month
      if( ! isNaN(parseInt(this.qde.application.applicants[this.coApplicantIndex].personalDetails.dob.split('/')[1])) ) {
        this.dob.month = this.months[parseInt(this.qde.application.applicants[this.coApplicantIndex].personalDetails.dob.split('/')[1])];
      }

      // Personal Details Birthplace
      if( ! isNaN(parseInt(this.qde.application.applicants[this.coApplicantIndex].personalDetails.birthPlace)) ) {
        this.selectedBirthPlace = this.birthPlace[parseInt(this.qde.application.applicants[this.coApplicantIndex].personalDetails.birthPlace) - 1];
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
        this.selectedResidence = this.maritals[(parseInt(this.qde.application.applicants[this.coApplicantIndex].communicationAddress.residentialStatus)) - 1];
      }

      if( ! isNaN(parseInt(this.qde.application.applicants[this.coApplicantIndex].maritalStatus.status)) ) {
        this.selectedMaritialStatus = this.maritals[(parseInt(this.qde.application.applicants[this.coApplicantIndex].maritalStatus.status))-1];
      }

      if( ! isNaN(parseInt(this.qde.application.applicants[this.coApplicantIndex].maritalStatus.spouseTitle)) ) {
          this.selectedSpouseTitle = this.titles[(parseInt(this.qde.application.applicants[this.coApplicantIndex].maritalStatus.spouseTitle))-1];
      }

      if( ! isNaN(parseInt(this.qde.application.applicants[this.coApplicantIndex].familyDetails.motherTitle)) ) {
        this.selectedMotherTitle = this.titles[(parseInt(this.qde.application.applicants[this.coApplicantIndex].familyDetails.motherTitle))-1];
      }


      if( ! isNaN(parseInt(this.qde.application.applicants[this.coApplicantIndex].familyDetails.fatherTitle)) ) {
        this.selectedFatherTitle  = this.titles[(parseInt(this.qde.application.applicants[this.coApplicantIndex].familyDetails.fatherTitle))-1];
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
        this.selectedOccupation = this.religions[(parseInt(this.qde.application.applicants[this.coApplicantIndex].occupation.occupationType))-1];
      }

      // Assesment methodology
      console.log("AM: ", this.assessmentMethodology);
      if( ! isNaN(parseInt(this.qde.application.applicants[this.coApplicantIndex].incomeDetails.assessmentMethodology)) ) {
        this.selectedAssesmentMethodology = this.assessmentMethodology[(parseInt(this.qde.application.applicants[this.coApplicantIndex].incomeDetails.assessmentMethodology))-1];
      }

      // Incoming from create in Individual Pan
      if(this.panslide == true && this.qde.application.applicants[this.coApplicantIndex].isIndividual == true) {
        alert(this.panslide);
        // this.panSlider2.setIndex(2);
        this.tabSwitch(2);
      }
      // Incoming from create in Non Individual Pan
      else if(this.panslide2 == true && this.qde.application.applicants[this.coApplicantIndex].isIndividual == false) {
        this.tabSwitch(11);
        this.panSlider4.setIndex(1);
      } else if(this.panslide == false && this.qde.application.applicants[this.coApplicantIndex].isIndividual == true) {
        this.tabSwitch(1);
        this.panSlider2.setIndex(2);
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

  ngOnDestroy() {
    this.panslideSub.unsubscribe();
  }
}
