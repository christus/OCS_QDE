import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
    
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
export class ApplicantQdeComponent implements OnInit {

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
      }
    },
    revenueDetails: {

    }
 
  };

  
  value: Array<number> = [0,0,0];

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
    // onlyExternal: true,
    autoplay: false,
    speed: 900,
    effect: "slide",
    noSwipingClass: '',
  };

  private activeTab: number = 0;

  @ViewChild('tabContents') private tabContents: ElementRef;
  // @ViewChild(Select2Component) private select2: Select2Component;

  // All Swiper Sliders
  @ViewChild('panSlider1') private panSlider1: ElementRef;
  @ViewChild('panSlider2') private panSlider2: ElementRef;
  @ViewChild('pdSlider1') private pdSlider1: ElementRef;
  @ViewChild('pdSlider2') private pdSlider2: ElementRef;
  @ViewChild('maritalSlider1') private maritalSlider1: ElementRef;
  @ViewChild('maritalSlider2') private maritalSlider2: ElementRef;
  @ViewChild('familySlider1') private familySlider1: ElementRef;
  @ViewChild('familySlider2') private familySlider2: ElementRef;

  private isAlternateEmailId: boolean = false;
  private isAlternateMobileNumber: boolean = false;
  private isAlternateResidenceNumber: boolean = false;
  
  private applicantIndividual:boolean = true;
  

  private fragments = [ 'pan',
                        'personal',
                        'contact',
                        'address',
                        'marital',
                        'family',
                        'other',
                        'occupation',
                        'correspondence',
                        'organization',
                        'regAddress',
                        'corpAddr',
                        'revenueAddr'
  ];

  applicantIndex: number;

  private qde: Qde;

  constructor(private renderer: Renderer2,
              private route: ActivatedRoute,
              private router: Router,
              private qdeHttp: QdeHttpService,
              private qdeService: QdeService) {
  }
  
  ngOnInit() {

    if(this.route.snapshot.data.listOfValues != null && this.route.snapshot.data.listOfValues != undefined) {
      // Initialize all UI Values here
    }
    
    // Check Whether there is qde data to be filled or else Initialize Qde
    this.route.params.subscribe((params) => {
      
      // Make an http request to get the required qde data and set using setQde
      if(params.applicantId != undefined && params.applicantId != null) {
        // setQde(JSON.parse(response.ProcessVariables.response));
      } else {
        this.qde = this.qdeService.getQde();
      }
    });
    // Create New Entry
    this.applicantIndex = 0;
    // Write code to get data(LOV) and assign applicantIndex if its new or to update.
    console.log("Applicant Code: ", this.applicantIndex);

    // Assign true as it is Applicant (In future if qde variable is not in parent component then remove below line)
    this.qde.application.applicants[this.applicantIndex].isMainApplicant = true;

    this.route.fragment.subscribe((fragment) => {
      let localFragment = fragment;
      
      if(fragment == null) {
        localFragment = 'pan';
      }

      // Replace Fragments in url
      if(this.fragments.includes(localFragment)) {
        this.tabSwitch(this.fragments.indexOf(localFragment));
      } 
    });
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

      if(tabIndex == 9) {
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
        this.goToNextSlide(swiperInstance);
      } else {
        // Throw Invalid Pan Error
      }
    }, (error) => {
      console.log('error ', error);
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
      preferredEmailId: form.value.preferredEmailId,
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

    event.preventDefault();

    if (form && !form.valid) {
      return;
    }

    this.qde.application.applicants[this.applicantIndex].contactDetails = {
      preferredEmailId: form.value.preferredEmailId,
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

    // this.qde.application.applicants[this.applicantIndex].familyDetails.fatherTitle = form.value.fatherTitle;

    // console.log(this.qde.application.applicants[this.applicantIndex].familyDetails);

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
  // Occupation Details
  //-------------------------------------------------------------
  submitOccupationDetails(form: NgForm) {
    if (form && !form.valid) {
      return;
    }

    // this.qde.application.applicants[this.applicantIndex].familyDetails.fatherTitle = form.value.fatherTitle;

    // console.log(this.qde.application.applicants[this.applicantIndex].familyDetails);

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
}
