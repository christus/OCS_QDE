import { Other } from './../../models/qde.model';
import { Component, OnInit, ViewChild, ElementRef, Renderer2, AfterViewInit } from '@angular/core';
    
import * as Swiper from 'swiper/dist/js/swiper.js';
// import { Select2Component } from 'ng2-select2';
import { ActivatedRoute, Router } from '@angular/router';

import { Options } from 'ng5-slider';
import { NgForm } from '@angular/forms';

import Qde from 'src/app/models/qde.model';
import { QdeHttpService } from 'src/app/services/qde-http.service';
import { QdeService } from 'src/app/services/qde.service';

@Component({
  selector: 'app-applicant-qde',
  templateUrl: './applicant-qde.component.html',
  styleUrls: ['./applicant-qde.component.css']
})
export class ApplicantQdeComponent implements OnInit, AfterViewInit {

  errors = {

    pan: {
      required: "PAN number is required",
      length: "PAN number must be at least 10 characters",
      invalid: "PAN number is not valid"
    },

    personalDetails: {
      firstName: {
        required: "First Name is required",
        invalid: "First Name is not valid"
      },
      middleName: {
        invalid: "Middle Name is not valid"
      },
      lastName: {
        required: "Last Name is required",
        invalid: "Last Name is not valid"
      }
    },

    contactDetails: {
      preferedEmail: {
        required: "Preferred Email Id is required",
        invalid: "Preferred Email Id is not valid"
      },
      alternateEmail: {
        invalid: "Alternate Email Id is not valid"
      },
      prefferedMobile: {
        required: "Preferred Mobile Number is required",
        invalid: "Preferred Mobile Number is not valid"
      },
      alternateMobile: {
        invalid: "Alternate Mobile Number is not valid"
      },
      stdCode: {
        required: "Std Code is required",
        invalid: "Std Code is not valid"
      },
      residenceNumber: {
        required: "Residence number is required",
        invalid: "Residence number is not valid"
      }
    },

    commAddress: {
      address1: {
        required: "Address Line 1 is required",
        invalid: "Address Line 1 is not valid"
      },
      address2: {
        required: "Address Line 2 is required",
        invalid: "Address Line 2 is not valid"
      },
      pinCode: {
        required: "Pincode is required",
        invalid: "Pincode is not valid"
      },
      stateOrCity: {
        required: "State Name / City Name is required",
        invalid: "State Name / City Name is not valid"
      }
    },

    maritialStatus: {
      spouseName: {
        required: "Spouse Name is required",
        invalid: "Spouse Name is not valid"
      },
      salaryAmount: {
        required: "Salary Amount is required",
        invalid: "Salary Amount is not valid"
      }
    },

    familyDetails: {
      fatherName:{
        required:"Father's Name is required",
        invalid: "Father's Name is not valid"
      },
      motherName:{
        required:"Mother's Name is required",
        invalid: "Mother's Name is not valid"
      },
      motherMaiden:{
        required:"Mother's Maiden Name is required",
        invalid: "Mother's Maiden Name is not valid"
      }
    },

    other: {

    },

    occupationDetails : {
      companyDetails: {
        required: "Company Name is required",
        invalid: "Company Name is not valid"
      },
      currentExp: {
        required: "Current Experience is required",
        invalid: "Current Experience is not valid"
      },
      totalExp: {
        required: "Total Experience is required",
        invalid: "Total Experience is not valid"
      }
    },

    officialCorrespondence: {
      address1: {
        required: "Office address line1 is required",
        invalid: "Office address line1 is not valid"
      },
      address2: {
        required: "Office address line2 is required",
        invalid: "Office address line2 is not valid"
      },
      pinCode: {
        required: "Pincode is required",
        invalid: "Pincode is not valid"
      },
      landMark: {
        invalid: "Land mark is not valid"
      },
      stateOrCity: {
        required: "State Name / City Name is required",
        invalid: "State Name / City Name is not valid"
      },
      stdCode: {
        required: "Std Code is required"
      },
      phoneNumber: {
        required: "Phone Number is required"
      },
      email: {
        required: "Office Email Id is required",
        invalid: "Office Email Id is not valid"
      }
    },
    organizationDetails: {
      orgName: {
        required: "Organization Name is required",
        invalid: "Organization Name is not valid"
      }
    },
    registeredAddress: {
      address : {
        required: "Registered Address is required",
        invalid: "Registered Address is not valid"
      },
      landMark: {
        invalid: "Land mark is not valid"
      },pinCode: {
        required: "Pincode is required",
        invalid: "Pincode is not valid"
      },stateOrCity: {
        required: "State Name / City Name is required",
        invalid: "State Name / City Name is not valid"
      }
    },
    corporateAddress: {
      address : {
        required: "Corporate Address is required",
        invalid: "Corporate Address is not valid"
      },
      landMark: {
        invalid: "Land mark is not valid"
      },pinCode: {
        required: "Pincode is required",
        invalid: "Pincode is not valid"
      },stateOrCity: {
        required: "State Name / City Name is required",
        invalid: "State Name / City Name is not valid"
      },

      ofcEmail:{
        required:"Office Email is required",
        invalid:"Office Email is not valid"
      }
    },
    revenueDetails: {
      revenue:{
        required: "revenue is required",
        invalid: "revenue is not valid"
      },
      annualNetincome:{
        required:"Annual Net Income is required",
        invalid:" Annual Net Income is not valid"
      },
      grossTurnover:{
        required: "Gross Turnover is required",
        invalid: "Gross Turnover is not valid"
      }
    }
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
    // noSwiping: true,
    // noSwipingClass: '',
    autoplay: false,
    speed: 900,
    effect: "slide"
  };

  private activeTab: number = 0;
  private dob: {day: string, month: string, year: string} = { day: null, month: null, year: null };
  private residenceNumber: {stdCode: string, phoneNumber: string} = {stdCode: "", phoneNumber: ""};
  private alternateResidenceNumber: {stdCode: string, phoneNumber: string} = {stdCode: "", phoneNumber: ""};
  private addressCityState: string = "";
  private otherReligion: string = "";
  private dateOfIncorporation: {day: string, month: string, year: string} = {day: null, month: null, year: null};
  private registeredAddressCityState: string = "";
  private corporateAddressCityState: string = "";
  private corporateAddressStdNumber: {stdCode: string, phoneNumber: string} = {stdCode: "", phoneNumber: ""};

  @ViewChild('tabContents') private tabContents: ElementRef;
  // @ViewChild(Select2Component) private select2: Select2Component;

  // All Swiper Sliders
  // Will be deprecated in next commit if not used
  // @ViewChild('panSlider1') private panSlider1: ElementRef;
  // @ViewChild('panSlider2') private panSlider2: ElementRef;
  // @ViewChild('pdSlider1') private pdSlider1: ElementRef;
  // @ViewChild('pdSlider2') private pdSlider2: ElementRef;
  // @ViewChild('maritalSlider1') private maritalSlider1: ElementRef;
  // @ViewChild('maritalSlider2') private maritalSlider2: ElementRef;
  // @ViewChild('familySlider1') private familySlider1: ElementRef;
  // @ViewChild('familySlider2') private familySlider2: ElementRef;



  private isAlternateEmailId: boolean = false;
  private isAlternateMobileNumber: boolean = false;
  private isAlternateResidenceNumber: boolean = false;
  
  private applicantIndividual: boolean = true;

  private fragments = [ 'pan1',
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

  applicantIndex: number;

  private qde: Qde;

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
  private selectedOption: string;
  
  constructor(private renderer: Renderer2,
              private route: ActivatedRoute,
              private router: Router,
              private qdeHttp: QdeHttpService,
              private qdeService: QdeService) {
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
      this.selectedOption = this.titles[0];
      this.maritals = lov.LOVS.maritial_status;
      this.relationships = lov.LOVS.relationship;
      this.loanpurposes = lov.LOVS.loan_purpose;
      this.categories = lov.LOVS.category;
      this.genders = lov.LOVS.gender;
      this.constitutions = lov.LOVS.constitution;
    }

    if(this.route.snapshot.data.listOfValues != null && this.route.snapshot.data.listOfValues != undefined) {
      // Initialize all UI Values here
    }
    
    console.log("params: ", this.route.snapshot.params);

    // Create New Entry
    this.applicantIndex = 0;

    // Write code to get data(LOV) and assign applicantIndex if its new or to update.
    console.log("Applicant Code: ", this.applicantIndex);

    // Check Whether there is qde data to be filled or else Initialize Qde
    this.route.params.subscribe((params) => {
      
      // Make an http request to get the required qde data and set using setQde
      if(params.applicantId != undefined && params.applicantId != null) {
        // this.qdeHttp.getQdeData(params.applicantId).subscribe(response => { this.qdeService.setQde(repsonse.processvariables.response.qde).catch(e => {console.log(e); }) });
      }

      this.qde = this.qdeService.getQde();
    });

    this.route.fragment.subscribe((fragment) => {
      let localFragment = fragment;
      
      if(fragment == null) {
        localFragment = this.fragments[0];
      }

      // Replace Fragments in url
      if(this.fragments.includes(localFragment)) {
        this.tabSwitch(this.fragments.indexOf(localFragment));
      }
    });


    // Some Initialization for HTML
    this.qde.application.applicants[this.applicantIndex].isMainApplicant = true;
    if( this.qde.application.applicants[this.applicantIndex].personalDetails.dob.split("-")[0] == "" ||
        this.qde.application.applicants[this.applicantIndex].personalDetails.dob.split("-")[0] == undefined) {
      this.dob.day = this.qde.application.applicants[this.applicantIndex].personalDetails.dob.split("-")[0];
    }

    if( this.qde.application.applicants[this.applicantIndex].personalDetails.dob.split("-")[1] == "" ||
        this.qde.application.applicants[this.applicantIndex].personalDetails.dob.split("-")[1] == undefined) {
      this.dob.month = this.qde.application.applicants[this.applicantIndex].personalDetails.dob.split("-")[1];
    }

    if( this.qde.application.applicants[this.applicantIndex].personalDetails.dob.split("-")[2] == "" ||
        this.qde.application.applicants[this.applicantIndex].personalDetails.dob.split("-")[2] == undefined) {
      this.dob.year = this.qde.application.applicants[this.applicantIndex].personalDetails.dob.split("-")[2];
    }

    this.residenceNumber.stdCode = this.qde.application.applicants[this.applicantIndex].contactDetails.residenceNumber != "" ? this.qde.application.applicants[this.applicantIndex].contactDetails.residenceNumber.split("-")[0] : "";
    this.residenceNumber.phoneNumber = this.qde.application.applicants[this.applicantIndex].contactDetails.residenceNumber != "" ? this.qde.application.applicants[this.applicantIndex].contactDetails.residenceNumber.split("-")[1] : "";

    this.alternateResidenceNumber.stdCode = this.qde.application.applicants[this.applicantIndex].contactDetails.alternateResidenceNumber != "" ? this.qde.application.applicants[this.applicantIndex].contactDetails.alternateResidenceNumber.split("-")[0] : "";
    this.alternateResidenceNumber.phoneNumber = this.qde.application.applicants[this.applicantIndex].contactDetails.alternateResidenceNumber != "" ? this.qde.application.applicants[this.applicantIndex].contactDetails.residenceNumber.split("-")[1] : "";
    this.addressCityState = this.qde.application.applicants[this.applicantIndex].communicationAddress.city + '/'+ this.qde.application.applicants[this.applicantIndex].communicationAddress.state;

    this.otherReligion = this.qde.application.applicants[this.applicantIndex].other.religion == '6' ? this.qde.application.applicants[this.applicantIndex].other.religion : '';

    if( this.qde.application.applicants[this.applicantIndex].organizationDetails.dateOfIncorporation.split("-")[0] == "" ||
        this.qde.application.applicants[this.applicantIndex].organizationDetails.dateOfIncorporation.split("-")[0] == undefined) {
      this.dateOfIncorporation.day = this.qde.application.applicants[this.applicantIndex].organizationDetails.dateOfIncorporation.split("-")[0];
    }

    if( this.qde.application.applicants[this.applicantIndex].organizationDetails.dateOfIncorporation.split("-")[1] == "" ||
        this.qde.application.applicants[this.applicantIndex].organizationDetails.dateOfIncorporation.split("-")[1] == undefined) {
      this.dateOfIncorporation.month = this.qde.application.applicants[this.applicantIndex].organizationDetails.dateOfIncorporation.split("-")[1];
    }

    if( this.qde.application.applicants[this.applicantIndex].organizationDetails.dateOfIncorporation.split("-")[2] == "" ||
        this.qde.application.applicants[this.applicantIndex].organizationDetails.dateOfIncorporation.split("-")[2] == undefined) {
      this.dateOfIncorporation.year = this.qde.application.applicants[this.applicantIndex].organizationDetails.dateOfIncorporation.split("-")[2];
    }

    this.registeredAddressCityState = this.qde.application.applicants[this.applicantIndex].registeredAddress.city +'-'+ this.qde.application.applicants[this.applicantIndex].registeredAddress.state;
    this.corporateAddressCityState = this.qde.application.applicants[this.applicantIndex].corporateAddress.city +'-'+ this.qde.application.applicants[this.applicantIndex].corporateAddress.state;
    this.corporateAddressStdNumber.stdCode = this.qde.application.applicants[this.applicantIndex].corporateAddress.stdNumber != "" ? this.qde.application.applicants[this.applicantIndex].corporateAddress.stdNumber.split("-")[0] : "";
    this.corporateAddressStdNumber.phoneNumber = this.qde.application.applicants[this.applicantIndex].corporateAddress.stdNumber != "" ? this.qde.application.applicants[this.applicantIndex].corporateAddress.stdNumber.split("-")[1] : "";
  }

  ngAfterViewInit() {

  }

  valuechange(newValue, valueIndex) {
    console.log(newValue);
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

    // Check for invalid tabIndex
    if(tabIndex < this.fragments.length) {

      this.router.navigate([], { fragment: this.fragments[tabIndex]});
  
      this.activeTab = tabIndex;

      if(tabIndex >= 10) {
        this.applicantIndividual = false;
      }else if(tabIndex == 0) {
        this.applicantIndividual = true;
      }
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

    this.qde.application.applicants[this.applicantIndex].pan = {
      panNumber: form.value.pan
    };

    this.qdeHttp.createOrUpdatePanDetails(this.qde).subscribe((response) => {
      // If successful
      if(response["ProcessVariables"]["status"]) {
        let result = this.parseJson(response["ProcessVariables"]["response"]);
        this.qde.application.ocsNumber = result["application"]["ocsNumber"];
        this.qde.application.applicants[this.applicantIndex].applicantId =  result["application"]["applicants"][0]["applicantId"];
        
        this.goToNextSlide(swiperInstance);
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

    this.qde.application.applicants[this.applicantIndex].personalDetails = {
      title : form.value.title,
      firstName : form.value.firstName,
      middleName : form.value.middleName,
      lastName : form.value.lastName
    };

    console.log(this.qde.application.applicants[this.applicantIndex]);
    this.qdeHttp.createOrUpdatePersonalDetails(this.qde).subscribe((response) => {
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

  submitGenderDetails(form: NgForm, swiperInstance ?: Swiper) {
    event.preventDefault();

    if (form && !form.valid) {
      return;
    }

    this.qde.application.applicants[this.applicantIndex].personalDetails.gender = form.value.gender;

    console.log(this.qde.application.applicants[this.applicantIndex]);

    this.qdeHttp.createOrUpdatePersonalDetails(this.qde).subscribe((response) => {
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

  submitQualificationDetails(form: NgForm, swiperInstance ?: Swiper) {
    event.preventDefault();

    if (form && !form.valid) {
      return;
    }

    this.qde.application.applicants[this.applicantIndex].personalDetails.qualification = form.value.qualification;

    console.log(this.qde.application.applicants[this.applicantIndex]);

    this.qdeHttp.createOrUpdatePersonalDetails(this.qde).subscribe((response) => {
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

    this.qde.application.applicants[this.applicantIndex].personalDetails.dob = form.value.day+'-'+form.value.month+'-'+form.value.year;
    this.qde.application.applicants[this.applicantIndex].personalDetails.birthPlace = form.value.birthPlace;

    console.log(this.qde.application.applicants[this.applicantIndex]);

    this.qdeHttp.createOrUpdatePersonalDetails(this.qde).subscribe((response) => {
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

    this.qde.application.applicants[this.applicantIndex].contactDetails = {
      preferredEmailId: form.value.preferEmailId,
      alternateEmailId : form.value.alternateEmailId,
      mobileNumber: form.value.mobileNumber,
      alternateMobileNumber: form.value.alternateMobileNumber,
      residenceNumber: form.value.residenceNumber1+'-'+form.value.residenceNumber2,
      alternateResidenceNumber: form.value.alternateResidenceNumber1+'-'+form.value.alternateResidenceNumber2
    };

    console.log(this.qde.application.applicants[this.applicantIndex]);
    this.qdeHttp.createOrUpdatePersonalDetails(this.qde).subscribe((response) => {
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
  // Communication Details
  //-------------------------------------------------------------
  submitCommunicationAddressDetails(form: NgForm) {

  //  event.preventDefault();

    if (form && !form.valid) {
      return;
    }

    this.qde.application.applicants[this.applicantIndex].communicationAddress = {
      residentialStatus : form.value.residentialStatus,
      addressLineOne : form.value.addressLineOne,
      addressLineTwo : form.value.addressLineTwo,
      zipcode : form.value.pinCode,
      city : form.value.cityState.split('/')[0],
      state : form.value.cityState.split('/')[1],
      numberOfYearsInCurrentResidence : form.value.numberOfYearsInCurrentResidence,
      permanentAddress : form.value.permanentAddress
    };

    console.log(this.qde.application.applicants[this.applicantIndex].communicationAddress);

    this.qdeHttp.createOrUpdatePersonalDetails(this.qde).subscribe((response) => {
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

    this.qde.application.applicants[this.applicantIndex].maritalStatus = {
      status : form.value.maritalStatus
    };

    console.log(this.qde.application.applicants[this.applicantIndex].maritalStatus);
    this.qdeHttp.createOrUpdatePersonalDetails(this.qde).subscribe((response) => {
      // If successful
      if(response["ProcessVariables"]["status"]) {
        this.goToNextSlide(swiperInstance);
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

    this.qde.application.applicants[this.applicantIndex].maritalStatus.spouseTitle = form.value.spouseTitle;
    this.qde.application.applicants[this.applicantIndex].maritalStatus.firstName = form.value.firstName;

    console.log(this.qde.application.applicants[this.applicantIndex].maritalStatus);
    this.qdeHttp.createOrUpdatePersonalDetails(this.qde).subscribe((response) => {
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

    this.qde.application.applicants[this.applicantIndex].maritalStatus.earning = form.value.earning;

    console.log(this.qde.application.applicants[this.applicantIndex].maritalStatus);
    this.qdeHttp.createOrUpdatePersonalDetails(this.qde).subscribe((response) => {
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

    this.qde.application.applicants[this.applicantIndex].maritalStatus.amount = form.value.amount;

    console.log(this.qde.application.applicants[this.applicantIndex].maritalStatus);

    this.qdeHttp.createOrUpdatePersonalDetails(this.qde).subscribe((response) => {
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

    this.qde.application.applicants[this.applicantIndex].familyDetails = {
      numberOfDependents : form.value.numberOfDependents
    };

    console.log(this.qde.application.applicants[this.applicantIndex].familyDetails);

    this.qdeHttp.createOrUpdatePersonalDetails(this.qde).subscribe((response) => {
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

    this.qde.application.applicants[this.applicantIndex].familyDetails.fatherTitle = form.value.fatherTitle;
    this.qde.application.applicants[this.applicantIndex].familyDetails.fatherName = form.value.fatherName;
    this.qde.application.applicants[this.applicantIndex].familyDetails.motherTitle = form.value.motherTitle;
    this.qde.application.applicants[this.applicantIndex].familyDetails.motherName = form.value.motherName;
    this.qde.application.applicants[this.applicantIndex].familyDetails.motherMaidenName = form.value.motherMaidenName;

    console.log(this.qde.application.applicants[this.applicantIndex].familyDetails);

    this.qdeHttp.createOrUpdatePersonalDetails(this.qde).subscribe((response) => {
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

    this.qde.application.applicants[this.applicantIndex].other = {
      religion : form.value.religion,
      category: form.value.category
    };

    // this.qde.application.applicants[this.applicantIndex].familyDetails.fatherTitle = form.value.fatherTitle;

    // console.log(this.qde.application.applicants[this.applicantIndex].familyDetails);

    this.qdeHttp.createOrUpdatePersonalDetails(this.qde).subscribe((response) => {
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

    this.qde.application.applicants[this.applicantIndex].occupation = {
      occupationType: form.value.occupationType,
      companyName : form.value.companyName,
      numberOfYearsInCurrentCompany : form.value.numberOfYearsInCurrentCompany,
      totalWorkExperience : form.value.totalExperienceYear
    };

    console.log(this.qde.application.applicants[this.applicantIndex].occupation);

    this.qdeHttp.createOrUpdatePersonalDetails(this.qde).subscribe((response) => {
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

    this.qde.application.applicants[this.applicantIndex].officialCorrespondence = {
      addressLineOne : form.value.ofcA1,
      addressLineTwo : form.value.ofcA2,
      landMark : form.value.landMark,
      zipcode : form.value.pinCode,
      city : form.value.cityState,
      officeNumber : form.value.stdCode + '-'+ form.value.offStdNumber,
      officeEmailId : form.value.officeEmail
    };

    console.log(this.qde.application.applicants[this.applicantIndex].officialCorrespondence);

    this.qdeHttp.createOrUpdatePersonalDetails(this.qde).subscribe((response) => {
      // If successful
      if(response["ProcessVariables"]["status"]) {
        //this.tabSwitch(6);
      } else {
        // Throw Invalid Pan Error
      }
    }, (error) => {
      console.log("response : ", error);
    });
  }
  //-------------------------------------------------------------


  //-------------------------------------------------------------
  // Organization Correspondence
  //-------------------------------------------------------------
  submitOrganizationDetails(form: NgForm) {
    if (form && !form.valid) {
      return;
    }

    this.qde.application.applicants[this.applicantIndex].organizationDetails = {
      nameOfOrganization: form.value.orgName,
      dateOfIncorporation: form.value.day+'-'+form.value.month+'-'+form.value.year,
      constitution: form.value.constitution
    };

    console.log(this.qde.application.applicants[this.applicantIndex].organizationDetails);

    this.qdeHttp.createOrUpdatePersonalDetails(this.qde).subscribe((response) => {
      // If successful
      if(response["ProcessVariables"]["status"]) {
        let result = this.parseJson(response["ProcessVariables"]["response"]);
        this.qde.application.ocsNumber = result["application"]["ocsNumber"];
        this.qde.application.applicants[this.applicantIndex].applicantId = result["application"]["applicationId"];
        this.tabSwitch(10);
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

    this.qde.application.applicants[this.applicantIndex].registeredAddress = {
      registeredAddress : form.value.regAdd,
      landMark : form.value.landmark,
      zipcode : form.value.pincode,
      city : form.value.cityState.split('/')[0],
      state : form.value.cityState.split('/')[1],
    };

    console.log(this.qde.application.applicants[this.applicantIndex].registeredAddress);

    this.qdeHttp.createOrUpdatePersonalDetails(this.qde).subscribe((response) => {
      // If successfull
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
  // Corporate Address
  //-------------------------------------------------------------
  submitCorporateAddress(form: NgForm) {
    if (form && !form.valid) {
      return;
    }

    this.qde.application.applicants[this.applicantIndex].corporateAddress = {
      corporateAddress : form.value.corpAddress,
      landMark : form.value.landmark,
      zipcode : form.value.pincode,
      city : form.value.corpCityState.split("/")[0],
      state : form.value.corpCityState.split("/")[1],
      stdNumber : form.value.stdNumber+"-"+form.value.phoneNumber,
      officeEmailId : form.value.officeEmailId
    };

    console.log(this.qde.application.applicants[this.applicantIndex].corporateAddress);

    this.qdeHttp.createOrUpdatePersonalDetails(this.qde).subscribe((response) => {
      // If successfull
      if(response["ProcessVariables"]["status"]) {
        this.tabSwitch(12);
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

    this.qde.application.applicants[this.applicantIndex].revenueDetails = {
      revenue : parseInt(form.value.revenue),
      annualNetIncome : parseInt(form.value.annualNetIncome),
      grossTurnOver : parseInt(form.value.grossTurnOver)
    };

    console.log(this.qde.application.applicants[this.applicantIndex].revenueDetails);

    this.qdeHttp.createOrUpdatePersonalDetails(this.qde).subscribe((response) => {
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


  parseJson(response):JSON {
    let result = JSON.parse(response);
    return result;
  }

  changeIsIndividual(value, swiperInstance ?: Swiper) {
    if(value) {
      this.goToNextSlide(swiperInstance);
    } else {
      this.tabSwitch(9);
    }
  }

  counter(size): Array<number> {
    return new Array(size);
  }

  incomeDetailsYesNo(value, swiperInstance ?: Swiper) {
    if(value == false) {
      swiperInstance.setIndex(3);
    } else {
      this.goToNextSlide(swiperInstance);
    }
  }
}
