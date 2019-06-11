import { Other, Applicant } from './../../models/qde.model';
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
import { ItemsList } from '@ng-select/ng-select/ng-select/items-list';
import { findLocaleData } from '@angular/common/src/i18n/locale_data_api';
import { Subscription } from 'rxjs';

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

  private isTabDisabled: boolean = true;

  private errors = {

    pan: {
      required: "PAN number is mandatory",
      length: "PAN number must be at least 10 characters",
      invalid: "Invalid PAN Number"
    },
    panDocumentNo: {
      required: "Document number is mandatory",
      length: "Enter 16 Digits Document number",
      invalid: "Invalid Document Number"
    },

    personalDetails: {
      firstName: {
        required: "First Name is mandatory",
        invalid: "Number and Special Characters not allowed"
      },
      middleName: {
        invalid: "Number and Special Characters not allowed"
      },
      lastName: {
        required: "Last Name is mandatory",
        invalid: "Number and Special Characters not allowed"
      }
    },

    contactDetails: {
      preferedEmail: {
        required: "Email Id is mandatory",
        invalid: "Invalid Email ID"
      },
      alternateEmail: {
        invalid: "Invalid Email ID"
      },
      prefferedMobile: {
        required: "10 digit mobile number is mandatory",
        invalid: "Invalid mobile number/Alphabets and Special Characters not allowed"
      },
      alternateMobile: {
        invalid: "Invalid mobile number/Alphabets and Special Characters not allowed"
      },
      stdCode: {
        required: "Std Code is mandatory",
        invalid: "Invalid STD code"
      },
      alternateResidenceNumberStd1:{
        invalid: "Invalid STD code"
      },
      residenceNumber: {
        required: "Residence number is mandatory",
        invalid: "Invalid Residence number/Alphabets and Special Characters not allowed"
      },
      alternateResidenceNumber1:{
        invalid:"Invalid Residence number/Alphabets and Special Characters not allowed"
      }
    },

    commAddress: {
      address1: {
        required: "Address Line 1 is mandatory",
        invalid: "Incomplete address"
      },
      address2: {
        required: "Address Line 2 is mandatory",
        invalid: "Incomplete address"
      },
      pinCode: {
        required: "Pincode is mandatory",
        invalid: "Invalid/Incomplete Pincode",
       
      },
      stateOrCity: {
        required: "State Name / City Name is mandatory",
        invalid: "State Name / City Name is not valid"
      }
    },

    maritialStatus: {
      spouseName: {
        required: "Spouse Name is mandatory",
        invalid: "Number and Special Characters not allowed"
      },
      salaryAmount: {
        required: "Salary Amount is mandatory",
        invalid: "Alphabets and and Special Characters not allowed"
      }
    },

    familyDetails: {
      fatherName:{
        required: "Father's Name is mandatory",
        invalid: "Number and Special Characters not allowed"
      },
      motherName:{
        required: "Mother's Name is mandatory",
        invalid: "Number and Special Characters not allowed"
      },
      motherMaiden:{
        required: "Mother's Maiden Name is mandatory",
        invalid: "Number and Special Characters not allowed"
      }
    },

    other: {

    },

    occupationDetails : {
      companyDetails: {
        required: "Company Name is mandatory",
        invalid: "Company Name is not valid"
      },
      currentExp: {
        required: "Current Experience is mandatory",
        invalid: "Current Experience is not valid"
      },
      totalExp: {
        required: "Total Experience is mandatory",
        invalid: "Total Experience is not valid"
      }
    },

    officialCorrespondence: {
      address1: {
        required: "Office address line1 is mandatory",
        invalid: "Incomplete address"
      },
      address2: {
        required: "Office address line2 is mandatory",
        invalid: "Incomplete address"
      },
      pinCode: {
        required: "Pincode is mandatory",
        invalid: "Invalid/Incomplete Pincode"
      },
      landMark: {
        invalid: "Land mark is not valid"
      },
      stateOrCity: {
        required: "State Name / City Name is mandatory",
        invalid: "State Name / City Name is not valid"
      },
      stdCode: {
        required: "Std Code is mandatory",
        invalid: "Invalid Std Code"
      },
      phoneNumber: {
        required: "Phone Number is mandatory",
        invalid: "Invalid Phone Number"
      },
      email: {
        required: "Office Email Id is mandatory",
        invalid: "Invalid Email Id"
      }
    },
    
    incomeDetails:{
      familyIncome:{
        required: "Annual family Income is mandatory",
        invalid:"Invalid Family Income / Alphabets and Special characters are not allowed"
      },
      monthlyExpenditure:{
        required:"Monthly Expenditure is mandatory",
        invalid:"Invalid Monthly Expenditure / Alphabets and Special characters are not allowed"
      },
      monthlyIncome:{
        required:"Monthly Income is mandatory",
        invalid:"Invalid Monthly Income / Alphabets and Special characters are not allowed"
      }
    },

    organizationDetails: {
      orgName: {
        required: "Organization Name is mandatory",
        invalid: "Invalid Organization Name"
      }
    },
    registeredAddress: {
      address : {
        required: "Registered Address is mandatory",
        invalid: "Registered Address is not valid"
      },
      landMark: {
        invalid: "Land mark is not valid"
      },
      pinCode: {
        required: "Pincode is mandatory",
        invalid: "Invalid/Incomplete Pincode"
      },
      stateOrCity: {
        required: "State Name / City Name is mandatory",
        invalid: "State Name / City Name is not valid"
      }
    },
    corporateAddress: {
      address: {
        required: "Corporate Address is mandatory",
        invalid: "Invalid address"
      },
      landMark: {
        invalid: "Invalid Landmark"
      },
      pinCode: {
        required: "Pincode is mandatory",
        invalid: "Invalid/Incomplete Pincode"
      },
      stateOrCity: {
        required: "State Name / City Name is mandatory",
        invalid: "State Name / City Name is not valid"
      },
      stdNumber:{
        required:"Std Code is mandatory",
        invalid:"Invalid Std Code"
      },
      phoneNumber:{
        required:"Phone number is mandatory",
        invalid:"Invalid Phone number"
      },

      ofcEmail:{
        required:"Office Email is mandatory",
        invalid:"Invalid Email"
      }
    },
    revenueDetails: {
      revenue:{
        required: "revenue is mandatory",
        invalid: "revenue is not valid"
      },
      annualNetincome:{
        required:"Annual Net Income is mandatory",
        invalid:"Invalid Annual Net Income"
      },
      grossTurnover:{
        required: "Gross Turnover is mandatory",
        invalid: "Invalid Gross Turnover"
      }
      
    }
  };

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

  private lhsConfig = {
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

  private rhsConfig = {
    noSwiping: true,
    noSwipingClass: '',
    autoplay: false,
    speed: 900,
    effect: "slide"
  };

  private activeTab: number = 0;
  private dob: {day: Item, month: Item, year: Item} = { day: {key: "DD", value: "DD"}, month: {key: "MM", value: "MM"}, year: {key: "YYYY", value: "YYYY"} };
  private residenceNumberStdCode: string = "";
  private residenceNumberPhoneNumber: string = "";
  private alternateResidenceNumberStdCode: string = ""
  private alternateResidenceNumberPhoneNumber: string = ""
  private addressCityState: string = "";
  private otherReligion: string = "";
  private dateOfIncorporation: {day: Item, month: Item, year: Item} = { day: {key: "DD", value: "DD"}, month: {key: "MM", value: "MM"}, year: {key: "YYYY", value: "YYYY"} };
  private registeredAddressCityState: string = "";
  private corporateAddressCityState: string = "";
  private corporateAddressStdCode = "";
  private corporateAddressPhoneNumber = "";
  private coApplicantsForDashboard: Array<Applicant> = [];
  private officialCorrespondenceStdCode: string = "";
  private officialCorrespondencePhoneNumber: string = "";

  private commCityState:string = "";
  // zipCityStateID:string = "";

  // Pan Swiper Sliders
  @ViewChild('panSlider2') private panSlider2: Swiper;
  @ViewChild('panSlider4') private panSlider4: Swiper;

  private isAlternateEmailId: boolean = false;
  private isAlternateMobileNumber: boolean = false;
  private isAlternateResidenceNumber: boolean = false;
  
  private applicantIndividual: boolean = true;
  private YYYY: number = 1900;

  // For Hide/Show tabs between Indi and Non indi
  private applicantStatus:string = "" ;

  private fragments = [ 'dashboard',
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
                        'revenueAddr',
                        'income2',
                      ];

  private coApplicantIndex: number = 1;

  // Local Copy of Qde
  private qde: Qde;

  //-------------------------------------------------
  //          Lov Variables
  //-------------------------------------------------
  private religions: Array<any>;
  private qualifications: Array<any>;
  private occupations: Array<any>;
  private residences: Array<any>;
  private titles: Array<any>;
  private maritals: Array<any>;
  private relationships: Array<any>;
  private loanpurposes: Array<any>;
  private categories: Array<any>;
  private genders: Array<any>;
  private constitutions: Array<any>;
  private days: Array<Item>;
  private months: Array<Item>;
  private years: Array<Item>;
  private assessmentMethodology: Array<any>;
  private selectedTitle: Item;
  private selectedReligion: Item;
  private selectedMaritialStatus: Item;
  private selectedCategory: Item;
  private selectedOccupation: Item;
  private selectedResidence: Item;
  private selectedSpouseTitle: Item;
  private selectedFatherTitle: Item;
  private selectedMotherTitle: Item;
  private selectedQualification: Item;
  private selectedConstitution: Item;
  private selectedDocType: Item;
  private selectedConstitutions: Item;
  private docType: Array<any>;
  private selectedAssesmentMethodology: Array<any>;
  private birthPlace: Array<any>;
  private selectedBirthPlace: Item;

  // Used when to whether its coming from create or edit
  private panslide: boolean;
  private panslide2: boolean;
  private applicationId: string;

  private panslideSub: Subscription;
  private panslide2Sub: Subscription;
  private qdeSourceSub: Subscription;
  private fragmentSub: Subscription;
  private paramsSub: Subscription;

  constructor(private renderer: Renderer2,
              private route: ActivatedRoute,
              private router: Router,
              private qdeHttp: QdeHttpService,
              private qdeService: QdeService,
              private cds:CommonDataService) {

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
      // this.coApplicantIndex = this.qde.application.applicants.length <= 1 ? 1 : val.application.applicants.length - 1;
      if(this.qde.application.applicants.length >= 2) {
        this.isTabDisabled = false;
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
      this.titles = lov.LOVS.applicant_title || ["Mr", "Mrs", "Ms", "Dr"]; // Hardcoded test value need to be removed
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
      this.selectedFatherTitle = this.titles[0];
      this.selectedMotherTitle = this.titles[0];
      this.selectedQualification = this.qualifications[0];
      this.selectedConstitution = this.constitutions[0];
      this.selectedDocType = this.docType[0];
      this.selectedConstitutions = this.constitutions[0];
      this.selectedAssesmentMethodology = this.assessmentMethodology[0];
      this.selectedBirthPlace = this.birthPlace[0];
    }

    console.log("params: ", this.route.snapshot.params);

    this.route.params.subscribe((params) => {

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

    if(tabIndex == 0)
      this.isTabDisabled = true;

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
        this.qde.application.ocsNumber = result["application"]["ocsNumber"];
        this.qde.application.applicationId = result["application"]["applicationId"];
       
        // let applicants = result["application"]["applicants"];

        // let isApplicantPresent:boolean = false;

        // if(applicants.length > 0) {
        //   // isApplicantPresent = applicants[this.applicantIndex].hasOwnProperty('applicantId');
        //   this.qde.application.applicants[this.coApplicantIndex].applicantId =  applicants[this.coApplicantIndex]["applicantId"];
        // }else {
        //   this.tabSwitch(1);
        //   return;
        // }   

        this.cds.changePanSlide(true);
        // Static value for now, replace it in future
        this.router.navigate(['/applicant/'+this.qde.application.applicationId+'/co-applicant/'+this.coApplicantIndex], {fragment: "pan1"});
        
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
      // If successful
      if(response["ProcessVariables"]["status"]) {
        let result = this.parseJson(response["ProcessVariables"]["response"]);
        this.qde.application.ocsNumber = result["application"]["ocsNumber"];
        this.qde.application.applicationId = result["application"]["applicationId"];
        this.qde.application.applicants[this.coApplicantIndex].applicantId =  result["application"]["applicants"][this.coApplicantIndex]["applicantId"];
        
        // //this.goToNextSlide(swiperInstance);
        console.log(":::::", this.qde)

        // this.cds.changePanSlide2(true);
        // this.router.navigate(['/applicant/'+this.qde.application.applicationId], {fragment: "organization"});

        this.cds.changePanSlide2(true);
        this.router.navigate(['/applicant/'+result["application"]["applicationId"]], {fragment: "pan2"});
        
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
        console.log(JSON.parse(response["ProcessVariables"]["response"]));
        var result = JSON.parse(response["ProcessVariables"]["response"]);

        this.commCityState = "";

        if(result.city != null && result.state != null && result.city != "" && result.state != "") {
          this.commCityState = result.city +" "+ result.state;
        }else {
          alert("Pin code not available / enter proper pincode")
        }
   

        if(screenName == "communicationAddress") {

          this.qde.application.applicants[this.coApplicantIndex].communicationAddress.zipcodeId = result.zipcodeId;
          this.qde.application.applicants[this.coApplicantIndex].communicationAddress.stateId = result.stateId;
          this.qde.application.applicants[this.coApplicantIndex].communicationAddress.cityId = result.cityId;

          this.qde.application.applicants[this.coApplicantIndex].communicationAddress.city = result.city;
          this.qde.application.applicants[this.coApplicantIndex].communicationAddress.state = result.state;
          this.qde.application.applicants[this.coApplicantIndex].communicationAddress.cityState = this.commCityState;


        }


        if(screenName == "permanentAddress") {

          this.qde.application.applicants[this.coApplicantIndex].permanentAddress.zipcodeId = result.zipcodeId;
          this.qde.application.applicants[this.coApplicantIndex].permanentAddress.stateId = result.stateId;
          this.qde.application.applicants[this.coApplicantIndex].permanentAddress.cityId = result.cityId;

          this.qde.application.applicants[this.coApplicantIndex].permanentAddress.city = result.city;
          this.qde.application.applicants[this.coApplicantIndex].permanentAddress.state = result.state;
          this.qde.application.applicants[this.coApplicantIndex].permanentAddress.cityState = this.commCityState;


        }


        if(screenName == "officialCorrespondence") {

          this.qde.application.applicants[this.coApplicantIndex].officialCorrespondence.zipcodeId = result.zipcodeId;
          this.qde.application.applicants[this.coApplicantIndex].officialCorrespondence.stateId = result.stateId;
          this.qde.application.applicants[this.coApplicantIndex].officialCorrespondence.cityId = result.cityId;

          this.qde.application.applicants[this.coApplicantIndex].officialCorrespondence.city = result.city;
          this.qde.application.applicants[this.coApplicantIndex].officialCorrespondence.state = result.state;
          this.qde.application.applicants[this.coApplicantIndex].officialCorrespondence.cityState = this.commCityState;

        }

        if(screenName == "registeredAddress") {

          this.qde.application.applicants[this.coApplicantIndex].registeredAddress.zipcodeId = result.zipcodeId;
          this.qde.application.applicants[this.coApplicantIndex].registeredAddress.stateId = result.stateId;
          this.qde.application.applicants[this.coApplicantIndex].registeredAddress.cityId = result.cityId;

          this.qde.application.applicants[this.coApplicantIndex].registeredAddress.city = result.city;
          this.qde.application.applicants[this.coApplicantIndex].registeredAddress.state = result.state;
          this.qde.application.applicants[this.coApplicantIndex].registeredAddress.cityState = this.commCityState;


        }

        if(screenName == "corporateAddress") {

          this.qde.application.applicants[this.coApplicantIndex].corporateAddress.zipcodeId = result.zipcodeId;
          this.qde.application.applicants[this.coApplicantIndex].corporateAddress.stateId = result.stateId;
          this.qde.application.applicants[this.coApplicantIndex].corporateAddress.cityId = result.cityId;


          this.qde.application.applicants[this.coApplicantIndex].corporateAddress.city = result.city;
          this.qde.application.applicants[this.coApplicantIndex].corporateAddress.state = result.state;
          this.qde.application.applicants[this.coApplicantIndex].corporateAddress.cityState = this.commCityState;


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
        this.tabSwitch(4);
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
        this.tabSwitch(7);
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

    this.qde.application.applicants[this.coApplicantIndex].incomeDetails.annualFamilyIncome = form.value.annualFamilyIncome ? form.value.annualFamilyIncome: "";
    this.qde.application.applicants[this.coApplicantIndex].incomeDetails.monthlyExpenditure = form.value.monthlyExpenditure ? form.value.monthlyExpenditure: "";

    console.log(this.qde.application.applicants[this.coApplicantIndex].incomeDetails);

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

    console.log(this.qde.application.applicants[this.coApplicantIndex].incomeDetails);

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
    if(value == 1) {
      this.goToNextSlide(swiperInstance);
      this.qde.application.applicants[this.coApplicantIndex].isIndividual = true;
    } else {
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

    this.qde.application.applicants[this.coApplicantIndex].incomeDetails.incomeConsider = value;

    console.log(this.qde.application.applicants[this.coApplicantIndex].incomeDetails);

    this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
      // If successfull
      if(response["ProcessVariables"]["status"]) {
        if(value == true) {
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
    to.getAttribute('nick').split(".").forEach((val, i) => {
      if(val == 'day' || val == 'month' || val == 'year') {
        this.dob[val] = event.value;
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
    if( params.coApplicantIndex != null && (!isNaN(parseInt(params.coApplicantIndex))) ) {

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

      // Date of Incorporation
      if( ! isNaN(parseInt(this.qde.application.applicants[this.coApplicantIndex].organizationDetails.dateOfIncorporation.split('/')[2])) ) {
        this.dateOfIncorporation.day = this.days[parseInt(this.qde.application.applicants[this.coApplicantIndex].organizationDetails.dateOfIncorporation.split('/')[2])];
      }

      // Incorporation Month
      if( ! isNaN(parseInt(this.qde.application.applicants[this.coApplicantIndex].organizationDetails.dateOfIncorporation.split('/')[1])) ) {
        this.dateOfIncorporation.month = this.months[parseInt(this.qde.application.applicants[this.coApplicantIndex].organizationDetails.dateOfIncorporation.split('/')[1])];
      }

      // Incorporation Year
      if( ! isNaN(parseInt(this.qde.application.applicants[this.coApplicantIndex].organizationDetails.dateOfIncorporation.split('/')[0])) ) {
        this.dateOfIncorporation.year = this.years.find(val => this.qde.application.applicants[this.coApplicantIndex].organizationDetails.dateOfIncorporation.split('/')[0] == val.value);
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
      if( ! isNaN(parseInt(this.qde.application.applicants[this.coApplicantIndex].incomeDetails.assessmentMethodology)) ) {
        this.selectedAssesmentMethodology = this.religions[(parseInt(this.qde.application.applicants[this.coApplicantIndex].incomeDetails.assessmentMethodology))-1];
      }

      // Incoming from create in Individual Pan
      if(this.panslide == true && this.qde.application.applicants[this.coApplicantIndex].isIndividual == true) {
        this.panSlider2.setIndex(2);
      }
      // Incoming from create in Non Individual Pan
      else if(this.panslide2 == true && this.qde.application.applicants[this.coApplicantIndex].isIndividual == false) {
        this.tabSwitch(11);
      } else if(this.panslide == false && this.qde.application.applicants[this.coApplicantIndex].isIndividual == true) {
        this.tabSwitch(1);
        this.panSlider2.setIndex(1);
      }
      else if(this.panslide2 == false && this.qde.application.applicants[this.coApplicantIndex].isIndividual == false) {
        this.tabSwitch(10);
      }

      // So that route is now in edit mode only
      this.cds.changePanSlide(false);
      this.cds.changePanSlide2(false);

      this.initializeVariables();
    }
    // This is Co-Applicant Create
  }

  // New CoApplicant Index for New CoApplicant
  createCoApplicant() {
    // this.resetQdeForm();
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
    this.dateOfIncorporation = { day: {key: "DD", value: "DD"}, month: {key: "MM", value: "MM"}, year: {key: "YYYY", value: "YYYY"} };
    this.registeredAddressCityState = "";
    this.corporateAddressCityState = "";
    this.corporateAddressStdCode = "";
    this.corporateAddressPhoneNumber = "";
    this.commCityState = "";

    this.selectedTitle = this.titles[0];
    this.selectedReligion = this.religions[0];
    this.selectedMaritialStatus = this.maritals[0];
    this.selectedCategory = this.categories[0];
    this.selectedOccupation = this.occupations[0];
    this.selectedResidence = this.residences[0];
    this.selectedSpouseTitle = this.titles[0];
    this.selectedFatherTitle = this.titles[0];
    this.selectedMotherTitle = this.titles[0];
    this.selectedQualification = this.qualifications[0];
    this.selectedConstitution = this.constitutions[0];
    this.selectedDocType = this.docType[0];
    this.selectedConstitutions = this.constitutions[0];
    this.selectedAssesmentMethodology = this.assessmentMethodology[0];
  }

  commZipcodeFocusout($event: any ) {
    //call API
  }

  ngOnDestroy() {
    this.panslideSub.unsubscribe();
  }
}
