import { Component, OnInit, ViewChild, ElementRef, Renderer2, AfterViewInit  } from '@angular/core';


import * as Swiper from "swiper/dist/js/swiper.js";
// import { Select2Component } from 'ng2-select2';
import { ActivatedRoute, Router } from "@angular/router";

import { Options } from "ng5-slider";
import { NgForm } from "@angular/forms";


import Qde from 'src/app/models/qde.model';
import { QdeHttpService } from 'src/app/services/qde-http.service';
import { QdeService } from 'src/app/services/qde.service';
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
  value: Array<number> = [0,0,0];

  isPropertyIdentified:boolean = false;
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
           required: "Loan Amount is required",
           invalid: "Loan Amount is not valid"
         },
         tenure: {
           required: "Loan Tenure is required",
           invalid: "Loan Tenure is not valid"
         }
       },

        property: {
          pinCode: {
            required: "Property Pincode is required",
            invalid: "Property Pincode is not valid"
         },
          addressLineOne: {
            required: "Property Address line 1 is required",
            invalid: "Property Address line 1 is not valid"
          },
          addressLineTwo: {
            required: "Property Address line 2 is required",
            invalid: "Annual Family Income is not valid"
          },
          cityOrState: {
            required: "Annual Family Income is required",
            invalid: "Annual Family Income is not valid"
          }
        },

       existingLoans: {
           monthlyEmi: {
             required: "Monthly EMI is required",
             invalid: "Monthly EMI is not valid"
           }
       },
     }
  };

  regexPattern = {
    email: "/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/",
    moblieNumber: "/^\d{10}$/",
    name: "/^[a-zA-Z ]*$/",
    address : "^[0-9A-Za-z, _#\s]+$",
    annualFamilyIncome: "^[0-9]{1,18}$",
    tenure: "^[0-9]{1,2}$",
    pinCode: "^[0-9]{6,6}$",
    cityOrState : "^[0-9A-Za-z, _#\s]+$",
    monthlyEmi: "^[0-9]{1,10}$"
  };

  // value: number = 0;

  minValue: number = 1;
  options: Options = {
    floor: 0,
    ceil: 6,
    step: 1,
    showTicksValues: false,
    // showSelectionBar: true,
    showTicks: true,
    getLegend: (sliderVal: number): string => {
      return  sliderVal + '';
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

  @ViewChild("tabContents") private tabContents: ElementRef;
  // @ViewChild(Select2Component) private select2: Select2Component;

  // All Swiper Sliders
  @ViewChild("incomeDetail1") private incomeDetail1: ElementRef;
  @ViewChild("incomeDetail2") private incomeDetail2: ElementRef;
  @ViewChild("property1") private property1: ElementRef;
  @ViewChild("property2") private property2: ElementRef;
  @ViewChild("existingLoan1") private existingLoan1: ElementRef;
  @ViewChild("existingLoan2") private existingLoan2: ElementRef;

  private isAlternateEmailId: boolean = false;
  private isAlternateMobileNumber: boolean = false;
  private isAlternateResidenceNumber: boolean = false;

  private applicantIndividual: boolean = true;

  private fragments = ["loan", "property", "existingLoan"];

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
  private loanTypes: Array<any>;
  private selectedFatherTitle : Item;
  private selectedLoanPurpose: Item;
  private selectedLoanType: Item;
  
  constructor(
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private router: Router,
    private qdeHttp: QdeHttpService,
    private qdeService: QdeService
  ) {}

  ngOnInit() {
    // this.renderer.addClass(this.select2.selector.nativeElement, 'js-select');

    console.log(">>", JSON.parse(this.route.snapshot.data.listOfValues['ProcessVariables'].lovs));
    var lov = JSON.parse(this.route.snapshot.data.listOfValues['ProcessVariables'].lovs);
    this.loanpurposes = lov.LOVS.loan_purpose;

    //Hardcoded
    this.loanTypes = [{
      key: "Home",
      value: 1,
    },{
      key: "Home2",
      value: 2,
    }];

    this.loanpurposes = [{
      key: "Purchase of land",
      value: 1,
    },{
      key: "Option 2",
      value: 2,
    }];

    this.selectedLoanType = this.loanTypes[0];
    this.selectedLoanPurpose = this.loanpurposes[0];
    console.log(this.loanpurposes)
    
    if(this.route.snapshot.data.listOfValues != null && this.route.snapshot.data.listOfValues != undefined) {
      // Initialize all UI Values heres
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
      loanPurpose: form.value.loanPurpose.value,
      loanTenure: form.value.loanTenure,
      loanType: form.value.loanType.value
    }

    this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
      // If successful
      if(response["ProcessVariables"]["status"]) {
        console.log(this.qde.application.references.referenceOne.relationShip);
        this.tabSwitch(1);
      } else {
        // Throw Invalid Pan Error
      }
    }, (error) => {
      console.log("response : ", error);
    });

    console.log("Submitted Amount"+ this.qde.application.loanDetails.loanAmount);
  }

  setPropertyIdentified(evt, swiperInstance ?: Swiper) {
    console.log(evt.currentTarget.value);
    this.isPropertyIdentified = (evt.currentTarget.value == "true"? true:false);

    this.goToNextSlide(swiperInstance);
  }


  updatePropertyType(form: NgForm, swiperInstance ?: Swiper) {
    if (form && !form.valid) {
      return;
    }

    this.qde.application.loanDetails.propertyType = {

      propertyIdentifed : this.isPropertyIdentified,
      propertyType: form.value.propertyType,
      propertyClss: form.value.propertyClss,
      propertyArea: form.value.propertyArea,
    }


    this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
      // If successful
      if(response["ProcessVariables"]["status"]) {
        console.log(this.qde.application.loanDetails.propertyType);
        this.goToNextSlide(swiperInstance);
      } else {
        // Throw Invalid Pan Error
      }
    }, (error) => {
      console.log("response : ", error);
    });

  }

  submitPropertyDetail(form: NgForm, swiperInstance ?: Swiper) {
    if (form && !form.valid) {
      return;
    }

    this.qde.application.loanDetails.property = {

      propertyIdentifed : this.isPropertyIdentified,
      propertyPincde: form.value.propertyPincode,
      addressLineOne: form.value.addressLineOne,
      addressLineTwo: form.value.addressLineTwo,
      city: form.value.cityOrState,
      state: form.value.cityOrState
    }

    this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
      // If successful
      if(response["ProcessVariables"]["status"]) {
        console.log(this.qde.application.loanDetails.propertyDetails);
        this.tabSwitch(2);
      } else {
        // Throw Invalid Pan Error
      }
    }, (error) => {
      console.log("response : ", error);
    });

  }


  submitExistingLoanProvider(form: NgForm, swiperInstance ?: Swiper) {

    if (form && !form.valid) {
      return;
    }

    this.qde.application.loanDetails.existingLoans = {
      loanProvider: form.value.loanProvider,
      // liveLoan: form.value.numberOfYears,
      // monthlyEmi: form.value.monthlyEmi
    }

    this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
      // If successful
      if(response["ProcessVariables"]["status"]) {
        console.log(this.qde.application.loanDetails.propertyType);
        this.goToNextSlide(swiperInstance);
      } else {
        // Throw Invalid Pan Error
      }
    }, (error) => {
      console.log("response : ", error);
    });
  }


  submitLiveLoans (form: NgForm, swiperInstance ?: Swiper) {
    if (form && !form.valid) {
      return;
    }

    this.qde.application.loanDetails.existingLoans = {
      liveLoan: form.value.liveLoans,
      // numberOfYears: form.value.numberOfYears,
      // monthlyEmi: form.value.monthlyEmi
    }

    this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
      // If successful
      if(response["ProcessVariables"]["status"]) {
        console.log(this.qde.application.loanDetails.propertyType);
        this.goToNextSlide(swiperInstance);
      } else {
        // Throw Invalid Pan Error
      }
    }, (error) => {
      console.log("response : ", error);
    });

  }


  submitMonthlyEmi(form: NgForm, swiperInstance ?: Swiper) {
    if (form && !form.valid) {
      return;
    }

    this.qde.application.loanDetails.existingLoans = {
      monthlyEmi: form.value.monthlyEmi
    }

    this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
      // If successful
      if(response["ProcessVariables"]["status"]) {
        console.log(this.qde.application.loanDetails.propertyType);
        // this.goToNextSlide(swiperInstance);
      } else {
        // Throw Invalid Pan Error
      }
    }, (error) => {
      console.log("response : ", error);
    });
  }


  private temp;
}