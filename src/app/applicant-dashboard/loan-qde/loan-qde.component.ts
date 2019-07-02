import { Component, OnInit, ViewChild, ElementRef, Renderer2, AfterViewInit  } from '@angular/core';


import * as Swiper from "swiper/dist/js/swiper.js";
// import { Select2Component } from 'ng2-select2';
import { ActivatedRoute, Router } from "@angular/router";

import { Options } from "ng5-slider";
import { NgForm } from "@angular/forms";


import Qde from 'src/app/models/qde.model';
import { QdeHttpService } from 'src/app/services/qde-http.service';
import { QdeService } from 'src/app/services/qde.service';
import { CommonDataService } from 'src/app/services/common-data.service';
interface Item {
  key: string,
  value: number
}


@Component({
  selector: "app-loan-qde",
  templateUrl: "./loan-qde.component.html",
  styleUrls: ["./loan-qde.component.css"]
})
export class LoanQdeComponent implements OnInit {
  value: Array<number> = [0, 0, 0];
  errors = {
     loanDetails: {
       incomeDetails: {
         annualFamilyIncome: {
           required: "Annual Family Income is required",
           invalid: "Annual Family Income is not valid"
         },
         coAppAnnualFamilyIncome: {
           required: "Co-Applicant Annual Family Income is required",
           invalid: "Co-Applicant Annual Family Income is not valid"
         }
       },

       loanAmount: {
         amount: {
           required: "Loan Amount is Madatory",
           invalid: "Invalid Loan Amount / Alphabets and special characters not allowed"
         },
         tenure: {
           required: "Loan Tenure is Mandatory",
           invalid: "Invalid Tenure"
         }
       },

        property: {
          propertyClss:{
            required:"Property Clss is Mandatory",
            invalid:"Property Clss is not valid"
          },
          propertyArea:{
            required:"Property Area is Mandatory",
            invalid:"Property Area is not valid"
          },
          pinCode: {
            required: "Property Pincode is Mandatory",
            invalid: "Property Pincode is not valid"
         },
          addressLineOne: {
            required: "Property Address line 1 is Mandatory",
            invalid: "Property Address line 1 is not valid"
          },
          addressLineTwo: {
            required: "Property Address line 2 is Mandatory",
            invalid: "Property Address line 2 is not valid"
          },
          cityOrState: {
            required: "City / State is Mandatory",
            invalid: "City / State Income is not valid"
          }
        },

       existingLoans: {
           monthlyEmi: {
             required: "Monthly EMI is mandatory",
             invalid: "Monthly EMI is not valid"
           }
       },
     }
  };
  regexPattern = {
    amount: "^[\\d]{0,14}([.][0-9]{0,4})?",
    name: "/^[a-zA-Z ]*$/",
    pinCode: "^[1-9][0-9]{5}$",
    address: "^[0-9A-Za-z, _&'/#]+$",
    tenure: "^[0-9]{1,2}$"
  };
  // regexPattern = {
  //   email: "/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/",
  //   moblieNumber: "/^[0-9]{10}$/",
  //   name: "/^[a-zA-Z ]*$/",
  //   address : "^[0-9A-Za-z, _#\s]+$",
  //   annualFamilyIncome: "^[0-9]{0,18}$",
  //   tenure: "^[0-9]{1,2}$",
  //   pinCode: "^[0-9]{6,6}$",
  //   cityOrState : "^[0-9A-Za-z, _#\s]+$",
  //   monthlyEmi: "^[0-9]{1,10}$"
  // };

  // value: number = 0;

  minValue: number = 1;
  options: Options = {
    floor: 0,
    ceil: 30,
    step: 5,
    showTicksValues: false,
    // showSelectionBar: true,
    showTicks: true,
    getLegend: (sliderVal: number): string => {
      return sliderVal + "<b>y</b>";
    }
  };

  lhsConfig = {
    noSwiping: true,
    noSwipingClass: "",
    onlyExternal: true,
    autoplay: false,
    speed: 900,
    effect: "fade",
    fadeEffect: {
      crossFade: true
    }
  };

  rhsConfig = {
    // noSwiping: true,
    // onlyExternal: true,
    autoplay: false,
    speed: 900,
    effect: "slide",
    noSwipingClass: '',
  };


  liveLoanOption:Options={
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

  activeTab: number = 0;

  @ViewChild("tabContents") tabContents: ElementRef;
  // @ViewChild(Select2Component) select2: Select2Component;

  // All Swiper Sliders
  @ViewChild("incomeDetail1") incomeDetail1: ElementRef;
  @ViewChild("incomeDetail2") incomeDetail2: ElementRef;
  @ViewChild("property1") property1: ElementRef;
  @ViewChild("property2") property2: ElementRef;
  @ViewChild("existingLoan1") existingLoan1: ElementRef;
  @ViewChild("existingLoan2") existingLoan2: ElementRef;

  isAlternateEmailId: boolean = false;
  isAlternateMobileNumber: boolean = false;
  isAlternateResidenceNumber: boolean = false;

  applicantIndividual: boolean = true;

  fragments = ["loan", "property", "existingLoan"];

  qde: Qde;

  religions: Array<any>;
  qualifications: Array<any>;
  occupations: Array<any>;
  residences: Array<any>;
  titles: Array<any>;
  maritals: Array<any>;
  relationships: Array<any>;
  loanpurposes: Array<any>;
  categories: Array<any>;
  genders: Array<any>;
  constitutions: Array<any>;
  loanTypes: Array<any>;
  loanProviders: Array<any>;

  applicantId: string;

  loanType: Array<any>;
  isPropertyIdentified = false;
  selectedLoanPurpose: string;
  selectedLoanType: string;

  propertyTypes: Array<any>;
  selectedPropertyType: string;
  propertyClssValue: string;
  propertyAreaValue: number;

  propertyPincodeValue: number;
  propertyPincodeId: number;
  addressLineOneValue: string;
  addressLineTwoValue: string;
  cityId: number;
  city: string;
  stateId: number;
  state: string;
  cityState: string;

  selectedLoanProvider: string;
  loanProviderList: Array<any>;

  liveLoan = 0;
  monthlyEmiValue: number;

  applicationId: string;
  applicantIndex = 0;


  constructor(
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private router: Router,
    private qdeHttp: QdeHttpService,
    private qdeService: QdeService,
    private cds: CommonDataService) {

    this.cds.changeMenuBarShown(true);
    this.cds.changeViewFormVisible(true);
    this.cds.changeLogoutVisible(true);

    this.route.params.subscribe(params => {
      if (params.applicantId != null && params.applicantId != undefined) {
        console.log("APPLICANTID: ", params.applicantId);
        this.applicantId = params.applicantId;
      }
    });

  }

  ngOnInit() {
    // this.renderer.addClass(this.select2.selector.nativeElement, 'js-select');

    if(this.route.snapshot.data.listOfValues) {
      const lov = JSON.parse(this.route.snapshot.data.listOfValues['ProcessVariables'].lovs);

      this.loanpurposes = lov.LOVS.loan_purpose;
      this.loanType = lov.LOVS.loan_type;
      this.propertyTypes = lov.LOVS.property_type;

      this.loanProviderList = lov.LOVS.loan_providers;
    }
    
    // Check Whether there is qde data to be filled or else Initialize Qde
    this.route.params.subscribe(params => {
      this.applicationId = params.applicationId;
      // Make an http request to get the required qde data and set using setQde
      if (params.applicantId != undefined && params.applicantId != null) {
        // setQde(JSON.parse(response.ProcessVariables.response));
      } else {
        this.qde = this.qdeService.getQde();
      }
    });

    this.route.fragment.subscribe(fragment => {
      let localFragment = fragment;

      if (fragment == null) {
        localFragment = "loan";
      }

      // Replace Fragments in url
      if (this.fragments.includes(localFragment)) {
        this.tabSwitch(this.fragments.indexOf(localFragment));
      }
    });

    this.route.params.subscribe(params => {

      // Make an http request to get the required qde data and set using setQde
      const applicationId = params.applicationId;
      if (applicationId) {
        this.qdeHttp.getQdeData(applicationId).subscribe(response => {
          let result = JSON.parse(response["ProcessVariables"]["response"]);

          // All hardcoded value need to removed
          this.selectedLoanType =
            result.application.loanDetails.loanAmount.loanType ||
            this.loanType[0].value;
          this.selectedLoanPurpose =
            result.application.loanDetails.loanAmount.loanPurpose ||
            this.loanpurposes[0].value;

          if (!result.application.loanDetails.propertyType) {
            result.application.loanDetails.propertyType = {}; //This line need to be removed
          }

          this.selectedPropertyType =
            result.application.loanDetails.propertyType.propertyType ||
            this.propertyTypes[0].value;

          this.isPropertyIdentified =
            result.application.loanDetails.propertyType.propertyIdentified ||
            false;

          this.propertyClssValue =
            result.application.loanDetails.propertyType.propertyClss || "";

          this.propertyAreaValue =
            result.application.loanDetails.propertyType.propertyArea || null;

          if (!result.application.loanDetails.property) {
            result.application.loanDetails.property = {}; //This line need to be removed
          }
          this.propertyPincodeValue =
            result.application.loanDetails.property.zipcode || "";

          this.addressLineOneValue =
            result.application.loanDetails.property.addressLineOne || "";

          this.addressLineTwoValue =
            result.application.loanDetails.property.addressLineTwo || "";

          this.city = result.application.loanDetails.property.city || "";

          if (!result.application.loanDetails.existingLoans) {
            result.application.loanDetails.existingLoans = {}; //This line need to be removed
          }
          this.selectedLoanProvider =
            result.application.loanDetails.existingLoans.loanProvider ||
            this.loanProviderList[0].value;

          this.liveLoan =
            result.application.loanDetails.existingLoans.liveLoan || 0;

          this.monthlyEmiValue =
            result.application.loanDetails.existingLoans.monthlyEmi || "";

          this.qde = result;
          this.qde.application.applicationId = applicationId;

          this.qdeService.setQde(this.qde);
          this.valuechange(this.qde.application.tenure, 0);

          


          this.qde.application.loanDetails.property.zipcodeId = result.application.loanDetails.property.zipcodeId;
          this.qde.application.loanDetails.property.stateId = result.application.loanDetails.property.stateId;
          this.qde.application.loanDetails.property.cityId = result.application.loanDetails.property.cityId;
  
          this.qde.application.loanDetails.property.city = result.application.loanDetails.property.city;
          this.qde.application.loanDetails.property.state = result.application.loanDetails.property.state;
          this.qde.application.loanDetails.property.zipcode = result.application.loanDetails.property.zipcode;

          this.cityState = "";
          if(result.application.loanDetails.property.city) {
            this.cityState = result.application.loanDetails.property.city + " "+ result.application.loanDetails.property.state;
          }
        });
      } else {
        this.qde = this.qdeService.getQde();
      }
    });
  }

  ngAfterViewInit() {}

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

  tabSwitch(tabIndex?: number) {
    // Check for invalid tabIndex
    if (tabIndex < this.fragments.length) {
      this.router.navigate([], { fragment: this.fragments[tabIndex] });

      this.activeTab = tabIndex;

      if (tabIndex == 9) {
        this.applicantIndividual = false;
      } else if (tabIndex == 0) {
        this.applicantIndividual = true;
      }
    }
  }

  onBackButtonClick(swiperInstance?: Swiper) {
    if (this.activeTab > 0) {
      if (swiperInstance != null && swiperInstance.getIndex() > 0) {
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

  valuechange(newValue, valueIndex) {
    console.log(newValue);
    this.value[valueIndex] = newValue;
  }

  submitLoanAmount(form: NgForm) {
    if (form && !form.valid) {
      return;
    }

    this.qde.application.loanDetails.loanAmount = {
      amountRequired: form.value.amountRequired,
      loanPurpose: form.value.loanPurpose,
      loanTenure: form.value.loanTenure,
      loanType: form.value.loanType
    };

    this.qdeHttp
      .createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde))
      .subscribe(
        response => {
          // If successful
          if (response["ProcessVariables"]["status"]) {
            // console.log(this.qde.application.references.referenceOne.relationShip);
            this.tabSwitch(1);
          } else {
            // Throw Invalid Pan Error
          }
        },
        error => {
          console.log("response : ", error);
        }
      );

    // console.log("Submitted Amount"+ this.qde.application.loanDetails.loanAmount);
  }

  // goToNextSlide(swiperInstance?: Swiper) {
  //   this.goToNextSlide(swiperInstance);
  // }

  updatePropertyType(form: NgForm, swiperInstance?: Swiper) {
    if (form && !form.valid) {
      return;
    }

    this.qde.application.loanDetails.propertyType = {
      propertyIdentified: this.isPropertyIdentified,
      propertyType: this.selectedPropertyType,
      propertyClss: this.propertyClssValue,
      propertyArea: this.propertyAreaValue
    };

    this.qdeHttp
      .createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde))
      .subscribe(
        response => {
          // If successful
          if (response["ProcessVariables"]["status"]) {
            console.log(this.qde.application.loanDetails.propertyType);
            this.goToNextSlide(swiperInstance);
          } else {
            // Throw Invalid Pan Error
          }
        },
        error => {
          console.log("response : ", error);
        }
      );
  }

  onPinCodeChange(event) {
    console.log(event.target.value);
    let zipCode = event.target.value;
    this.qdeHttp.getCityAndState(zipCode).subscribe(response => {
      // console.log(JSON.parse(response["ProcessVariables"]["response"]));
      var result = JSON.parse(response["ProcessVariables"]["response"]);

      if (result.city && result.state) {

        this.qde.application.loanDetails.property.zipcodeId = result.zipcodeId;
        this.qde.application.loanDetails.property.stateId = result.stateId;
        this.qde.application.loanDetails.property.cityId = result.cityId;

        this.qde.application.loanDetails.property.city = result.city;
        this.qde.application.loanDetails.property.state = result.state;
        this.qde.application.loanDetails.property.zipcode = zipCode;

        this.city = result.city;
        this.state = result.state;

        if(result.city != null && result.state != null && result.city != "" && result.state != "") {
          this.cityState = result.city + " " + result.state;
        }
      } else {
        alert("Pin code not available / enter proper pincode");
      }
    });
  }

  submitPropertyDetail(form: NgForm, swiperInstance?: Swiper) {
    if (form && !form.valid) {
      return;
    }

    this.qde.application.loanDetails.property = {
      zipcodeId: this.qde.application.loanDetails.property.zipcodeId,
      zipcode: this.propertyPincodeValue,
      addressLineOne: this.addressLineOneValue,
      addressLineTwo: this.addressLineTwoValue,
      cityId: this.qde.application.loanDetails.property.cityId,
      city: this.city,
      stateId: this.qde.application.loanDetails.property.stateId,
      state: this.state
    };

    this.qdeHttp
      .createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde))
      .subscribe(
        response => {
          if (response["ProcessVariables"]["status"]) {
            this.clssProbabilityCheck();
            
          } else {
            // Throw Invalid Pan Error
          }
        },
        error => {
          console.log("response : ", error);
        }
      );
  }

  submitExistingLoanProvider(form: NgForm, swiperInstance?: Swiper) {
    if (form && !form.valid) {
      return;
    }

    this.qde.application.loanDetails.existingLoans = {
      loanProvider: this.selectedLoanProvider
    };

    this.qdeHttp
      .createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde))
      .subscribe(
        response => {
          // If successful
          if (response["ProcessVariables"]["status"]) {
            console.log(this.qde.application.loanDetails.propertyType);
            this.goToNextSlide(swiperInstance);
          } else {
            // Throw Invalid Pan Error
          }
        },
        error => {
          console.log("response : ", error);
        }
      );
  }

  submitLiveLoans(form: NgForm, swiperInstance?: Swiper) {
    if (form && !form.valid) {
      return;
    }

    this.qde.application.loanDetails.existingLoans = {
      liveLoan: this.liveLoan
    };

    this.qdeHttp
      .createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde))
      .subscribe(
        response => {
          // If successful
          if (response["ProcessVariables"]["status"]) {
            console.log(this.qde.application.loanDetails.propertyType);
            this.goToNextSlide(swiperInstance);
          } else {
            // Throw Invalid Pan Error
          }
        },
        error => {
          console.log("response : ", error);
        }
      );
  }

  submitMonthlyEmi(form: NgForm, swiperInstance?: Swiper) {
    if (form && !form.valid) {
      return;
    }

    this.qde.application.loanDetails.existingLoans = {
      monthlyEmi: this.monthlyEmiValue
    };

    this.qdeHttp
      .createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde))
      .subscribe(
        response => {
          // If successful
          if (response["ProcessVariables"]["status"]) {
            console.log(this.qde.application.loanDetails.propertyType);
            this.goToNextSlide(swiperInstance);
          } else {
            // Throw Invalid Pan Error
          }
        },
        error => {
          console.log("response : ", error);
        }
      );
  }

  clssProbabilityCheck() {
    this.qdeHttp.clssProbabilityCheck(this.applicationId).subscribe(
      response => {
        if (response["Error"] === "0" && response["ProcessVariables"]["isClssEligible"]) {
          alert("Application is eligible for CLSS");
        } else {
          alert("Application is not eligible for CLSS");
        }
        this.tabSwitch(2);
      },
      error => {
        console.log("response : ", error);
      }
    );
  }

  selectValueChanged(event, to) {
    let whichSelectQde = this.qde.application.applicants[this.applicantIndex];
    to.getAttribute("nick")
      .split(".")
      .forEach((val, i) => {
        if (i == to.getAttribute("nick").split(".").length - 1) {
          whichSelectQde[val] = event.value;
          return;
        }
        whichSelectQde = whichSelectQde[val];
      });
  }

  temp;
}
