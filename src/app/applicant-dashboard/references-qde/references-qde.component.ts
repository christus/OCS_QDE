import { Component, OnInit, ViewChild, ElementRef, Renderer2, AfterViewInit } from '@angular/core';


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
  selector: "app-references-qde",
  templateUrl: "./references-qde.component.html",
  styleUrls: ["./references-qde.component.css"]
})
export class ReferencesQdeComponent implements OnInit {
  value: number = 0;

  minValue: number = 1;
  options: Options = {
    floor: 0,
    ceil: 6,
    step: 1,
    showTicksValues: false,
    // showSelectionBar: true,
    showTicks: true,
    getLegend: (sliderVal: number): string => {
      return sliderVal + "<b>y</b>";
    }
  };

  errors = {
      references: {
        referenceOne: {
          fullName: {
            required: "Full Name is required",
            invalid: "Full Name is not valid"
          },
          mobileNumber: {
           required: "Mobile number is required",
           invalid: "Mobile number is not valid"
          },
          addressLineOne: {
           required: "Address line One is required",
           invalid: "Address line One is not valid"
          },
          addressLineTwo: {
            required: "Address line Two is required",
            invalid: "Address line Two is not valid"
          }
        },

       referenceTwo: {
         fullName: {
           required: "Full Name is required",
           invalid: "Full Name is not valid"
         },
         mobileNumber: {
          required: "Mobile number is required",
          invalid: "Mobile number is not valid"
         },
         addressLineOne: {
          required: "Address line One is required",
          invalid: "Address line One is not valid"
         },
         addressLineTwo: {
           required: "Address line Two is required",
           invalid: "Address line Two is not valid"
         }
       }

        
     }
  };

  regexPattern = {
    mobileNumber: "^[0-9]*$",
    name: "[a-zA-Z ]*",
    address : "^[0-9A-Za-z, _#\s]+$"
  };

  private lhsConfig = {
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

  private rhsConfig = {
    // noSwiping: true,
    // onlyExternal: true,
    autoplay: false,
    speed: 900,
    effect: "slide",
    noSwipingClass: "",
  };

  private activeTab: number = 0;

  @ViewChild("tabContents") private tabContents: ElementRef;
  // @ViewChild(Select2Component) private select2: Select2Component;

  // All Swiper Sliders
  @ViewChild("reference1") private reference1: ElementRef;
  @ViewChild("reference2") private reference2: ElementRef;

  private isAlternateEmailId: boolean = false;
  private isAlternateMobileNumber: boolean = false;
  private isAlternateResidenceNumber: boolean = false;

  private applicantIndividual: boolean = true;

  private fragments = ["reference1", "reference2"];

  private qde: Qde;

  applicantIndex: number;

  private selectedOption: Item;

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
  private selectedReferenceOne: Item;
  private selectedReferenceTwo: Item;

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
    this.titles = lov.LOVS.applicant_title;
    this.relationships = lov.LOVS.relationship;
    this.selectedReferenceOne = this.relationships[0];
    this.selectedReferenceTwo = this.relationships[0];
    
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

    this.route.fragment.subscribe(fragment => {
      let localFragment = fragment;

      if (fragment == null) {
        localFragment = "reference1";
      }

      // Replace Fragments in url
      if (this.fragments.includes(localFragment)) {
        this.tabSwitch(this.fragments.indexOf(localFragment));
      }
    });
  }

  ngAfterViewInit() {}

  valuechange(newValue) {
    console.log(newValue);
    this.value = newValue;
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

  submitRelationWithApplicant1(form: NgForm, swiperInstance ?: Swiper) {
    if (form && !form.valid) {
      return;
    }

    this.qde.application.references.referenceOne.relationShip = form.value.relationShip.value;

    console.log(this.qde.application.references.referenceOne.relationShip);


    this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
      // If successful
      if(response["ProcessVariables"]["status"]) {
        console.log(this.qde.application.references.referenceOne.relationShip);
        this.goToNextSlide(swiperInstance);
      } else {
        // Throw Invalid Pan Error
      }
    }, (error) => {
      console.log("response : ", error);
    });

    
    console.log("submitted");
  }


  submitReference1Detail(form: NgForm, swiperInstance ?: Swiper) {

    if (form && !form.valid) {
      return;
    }

    this.qde.application.references.referenceOne = {
      title : form.value.title,
      fullName : form.value.fullName,
      mobileNumber : form.value.mobileNumber,
      addressLineOne : form.value.addressLineOne,
      addressLineTwo: form.value.addressLineTwo
    };

    console.log(this.qde.application.references.referenceOne.relationShip);


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

    
    console.log("submitted");

  }

  submitRelationWithApplicant2(form: NgForm, swiperInstance ?: Swiper) {
    if (form && !form.valid) {
      return;
    }

    this.qde.application.references.referenceTwo.relationShip = form.value.relationShip.value;

    console.log(this.qde.application.references.referenceOne.relationShip);


    this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
      // If successful
      if(response["ProcessVariables"]["status"]) {
        console.log(this.qde.application.references.referenceOne.relationShip);
        this.goToNextSlide(swiperInstance);
      } else {
        // Throw Invalid Pan Error
      }
    }, (error) => {
      console.log("response : ", error);
    });

    
    console.log("submitted");
  }


  submitReference2Detail(form: NgForm, swiperInstance ?: Swiper) {

    if (form && !form.valid) {
      return;
    }

    this.qde.application.references.referenceTwo = {
      title : form.value.title,
      fullName : form.value.fullName,
      mobileNumber : form.value.mobileNumber,
      addressLineOne : form.value.addressLineOne,
      addressLineTwo: form.value.addressLineTwo
    };

    console.log(this.qde.application.references.referenceOne.relationShip);


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

    
    console.log("submitted");

  }

  private temp;
}
