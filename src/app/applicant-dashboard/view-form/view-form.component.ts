import { Component, OnInit, ViewChild, ElementRef, Renderer2  } from '@angular/core';

import * as Swiper from 'swiper/dist/js/swiper.js';
// import { Select2Component } from 'ng2-select2';
import { ActivatedRoute, Router } from '@angular/router';

import { Options } from 'ng5-slider';
import { NgForm } from '@angular/forms';

import Qde, { InCompleteFields } from 'src/app/models/qde.model';
import { QdeHttpService } from 'src/app/services/qde-http.service';
import { CommonDataService } from 'src/app/services/common-data.service';
import { QdeService } from 'src/app/services/qde.service';
import {tap} from 'rxjs/operators';

@Component({
  selector: 'app-view-form',
  templateUrl: './view-form.component.html',
  styleUrls: ['./view-form.component.css']
})
export class ViewFormComponent implements OnInit {

  private errors: any = {

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

  value: number = 0;

  private isAlternateEmailId: boolean = false;
  private isAlternateMobileNumber: boolean = false;
  private isAlternateResidenceNumber: boolean = false;

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

  private applicantIndividual:boolean = true;
  

  private fragments = [ 'applicant',
                        'co-applicant',
                        'loan-details',
                        'references',
                        'document-uploads'
  ];

  private applicantIndex: number;
  private coApplicantIndexes: Array<number>;

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

  private isIncomplete: Array<InCompleteFields> = [];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private qdeHttp: QdeHttpService,
              private commonDataService: CommonDataService,
              private qdeService: QdeService) {
    this.commonDataService.changeMenuBarShown(false);

    this.qdeService.qdeSource.subscribe(val => {
      this.qde = val;

      this.applicantIndex = val.application.applicants.findIndex(val => val.isMainApplicant == true);

      val.application.applicants.forEach((el, index) => {

        if(el.isMainApplicant == false) {
          this.coApplicantIndexes.push(index);
        }

        this.isIncomplete.push(this.checkIncompleteFields(el.applicantId));
      })
    });

    console.log('Applicant Index: ', this.applicantIndex);
    console.log('Co-Applicant Indexes: ', this.coApplicantIndexes);
    console.log('IsIncomplete: ', this.isIncomplete);
  }
  
  ngOnInit() {
      // this.renderer.addClass(this.select2.selector.nativeElement, 'js-select');
      
    console.log(">>", JSON.parse(this.route.snapshot.data.listOfValues['ProcessVariables'].lovs));
    var lov = JSON.parse(this.route.snapshot.data.listOfValues['ProcessVariables'].lovs);
    this.religions = lov.LOVS.religion;
    this.qualifications = lov.LOVS.qualification;
    this.occupations = lov.LOVS.occupation;
    this.residences = lov.LOVS.residence_type;
    this.titles = lov.LOVS.applicant_title;
    this.maritals = lov.LOVS.maritial_status;
    this.relationships = lov.LOVS.relationship;
    this.loanpurposes = lov.LOVS.loan_purpose;
    this.categories = lov.LOVS.category;
    this.genders = lov.LOVS.gender;
    this.constitutions = lov.LOVS.constitution;

    this.route.params.subscribe((params) => {
      
      // Make an http request to get the required qde data and set using setQde
      if(params.applicantId != undefined && params.applicantId != null) {
        this.qdeHttp
            .dummyGetApi(this.qdeService.getFilteredJson(this.qde))
            .subscribe(res => {
              console.log("RRR ", res['ProcessVariables']);
              if(res['ProcessVariables']['status']) {
                let response = JSON.parse(res['ProcessVariables']['response']);
                [response.applicant.applicants] = JSON.parse(response);
                this.qdeService.setQde(response);
                console.log('QDE: ', this.qdeService.getQde());
              }
            }, err => {
              console.log("Error : ", err);
            });
      }

      this.qde = this.qdeService.getQde();
      console.log("QDE:::: ",this.qde);
    });

    // Create New Entry
    this.applicantIndex = this.qde.application.applicants.find(val => val.isMainApplicant==true) != undefined ? this.qde.application.applicants.findIndex(val => val.isMainApplicant == true): 0;
    // Write code to get data(LOV) and assign applicantIndex if its new or to update.

    console.log("Applicant Code: ", this.applicantIndex);

    // Assign true as it is Applicant (In future if qde variable is not in parent component then remove below line)
    this.qde.application.applicants[this.applicantIndex].isMainApplicant = true;

    this.route.fragment.subscribe((fragment) => {
      let localFragment = fragment; 
      if( fragment == null || (!this.fragments.includes(fragment)) ) {
        localFragment = this.fragments[0];
      } else {
        // Replace Fragments in url
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

  // onBackButtonClick(swiperInstance ?: Swiper) {

  //   if(this.activeTab > 0) {
  //     if(swiperInstance != null && swiperInstance.getIndex() > 0) {
  //       // Go to Previous Slide
  //       this.goToPrevSlide(swiperInstance);
  //     } else {
  //       // Go To Previous Tab
  //       this.tabSwitch(this.activeTab - 1);
  //     }
  //   }
  // }

  addRemoveEmailField() {
    this.isAlternateEmailId = !this.isAlternateEmailId;
  }

  addRemoveMobileNumberField() {
    this.isAlternateMobileNumber = !this.isAlternateMobileNumber;
  }

  addRemoveResidenceNumberField() {
    this.isAlternateResidenceNumber = !this.isAlternateResidenceNumber;
  }
  
  private temp;

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
}
