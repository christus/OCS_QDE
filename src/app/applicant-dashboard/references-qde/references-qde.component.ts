import { Component, OnInit, ViewChild, ElementRef, Renderer2, AfterViewInit } from '@angular/core';


import * as Swiper from "swiper/dist/js/swiper.js";
// import { Select2Component } from 'ng2-select2';
import { ActivatedRoute, Router } from "@angular/router";

import { Options } from "ng5-slider";
import { NgForm } from "@angular/forms";


import Qde from 'src/app/models/qde.model';
import { QdeHttpService } from 'src/app/services/qde-http.service';
import { QdeService } from 'src/app/services/qde.service';
import { CommonDataService } from 'src/app/services/common-data.service';
import { Subscription } from 'rxjs';


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
            required: "First and Last Name is required",
            invalid: "Name field is incomplete"
          },
          mobileNumber: {
            wrong: "please enter valid mobile number",
           required: "10 digit mobile number is mandatory",
           invalid: "Invalid Mobile Number",
           minlength: "Mobile number must be 10 digits"
          },
          addressLineOne: {
           required: "Address line One is Mandatory",
           invalid: "Incomplete address"
          },
          addressLineTwo: {
            required: "Address line Two is mandatory",
            invalid: "Incomplete address"
          }
        },

       referenceTwo: {
         fullName: {
           required: "First and Last Name is mandatory",
           invalid: "Name field is incomplete"
         },
         mobileNumber: {
           wrong: "please enter valid mobile number",
          required: "10 digit mobile number is mandatory",
          invalid: "Invalid Mobile Number",
          minlength: "Mobile number must be 10 digits"
         },
         addressLineOne: {
          required: "Address line One is Mandatory",
          invalid: "Incomplete address"
         },
         addressLineTwo: {
           required: "Address line Two is mandatory",
           invalid: "Incomplete address"
         }
       }

        
     }
  };

  regexPattern = {
    mobileNumber: "[1-9][0-9]*",
    name: "[a-zA-Z ]*",
    address : "^[0-9A-Za-z, _&'/#]+$",
    sameDigit: '0{10}|1{10}|2{10}|3{10}|4{10}|5{10}|6{10}|7{10}|8{10}|9{10}'
  };

  RegExp(param) {
    return RegExp(param);
  }

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
    noSwipingClass: "",
  };

  activeTab: number = 0;

  @ViewChild("tabContents") tabContents: ElementRef;
  // @ViewChild(Select2Component) select2: Select2Component;

  // All Swiper Sliders
  @ViewChild("reference1") reference1: ElementRef;
  @ViewChild("reference2") reference2: ElementRef;

  isAlternateEmailId: boolean = false;
  isAlternateMobileNumber: boolean = false;
  isAlternateResidenceNumber: boolean = false;

  applicantIndividual: boolean = true;

  fragments = ["reference1", "reference2"];

  qde: Qde;

  applicantIndex: number;

  selectedOption: Item;

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
  selectedReferenceOneTitle: Item;
  selectedReferenceTwoTitle: Item;

  selectedReferenceOne: any;

  selectedTiltle1: string;
  selectedName1: string;
  selectedMobile1: string;
  selectedAddressLineOne1: string;
  selectedAddressLineTwo1: string;

  selectedReferenceTwo: any;

  selectedTiltle2: string;
  selectedName2: string;
  selectedMobile2: string;
  selectedAddressLineOne2: string;
  selectedAddressLineTwo2: string;

  referenceId1: number;
  referenceId2: number;

  isReadOnly: boolean = false;
  isEligibilityForReview: boolean = false;
  isEligibilityForReviewsSub: Subscription;
  isTBMLoggedIn: boolean;

  constructor(
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private router: Router,
    private qdeHttp: QdeHttpService,
    private qdeService: QdeService,
    private cds: CommonDataService
  ) {
    this.cds.changeMenuBarShown(true);
    this.cds.changeViewFormVisible(true);
    this.cds.changeLogoutVisible(true);
    this.cds.changeHomeVisible(true);


    this.route.params.subscribe(params => {
      if(params['applicationId'] != null) {
        this.applicationId = params['applicationId'];
        if(JSON.parse(localStorage.getItem('roles')).includes('TBM')) {
          this.cds.setReadOnlyForm(true);
        } else {
          this.cds.setReadOnlyForm(false);
        }
      }
    });
  }

  ngOnInit() {
    // this.renderer.addClass(this.select2.selector.nativeElement, 'js-select');

    console.log(">>", JSON.parse(this.route.snapshot.data.listOfValues['ProcessVariables'].lovs));
    var lov = JSON.parse(this.route.snapshot.data.listOfValues['ProcessVariables'].lovs);
    this.titles = lov.LOVS.applicant_title;
    this.relationships = lov.LOVS.relationship;

    if (
      this.route.snapshot.data.listOfValues != null &&
      this.route.snapshot.data.listOfValues != undefined
    ) {
      // Initialize all UI Values here
    }

    // Check Whether there is qde data to be filled or else Initialize Qde
    this.route.params.subscribe(params => {
      // Make an http request to get the required qde data and set using setQde

      const applicationId = params.applicationId;
      if (applicationId) {
        this.qdeHttp.getQdeData(applicationId).subscribe(response => {
          let result = JSON.parse(response["ProcessVariables"]["response"]);

          if (!result.application.references  || Object.keys(result.application.references).length === 0) {
            result.application.references = {
              referenceOne: {},
              referenceTwo: {}
            };
          }

          if (!result.application.references.referenceOne || Object.keys(result.application.references.referenceOne).length === 0) {
            result.application.references.referenceOne = {};
          }

          if (!result.application.references.referenceTwo || Object.keys(result.application.references.referenceTwo).length === 0) {
            result.application.references.referenceTwo = {};
          }

          this.selectedReferenceOne =
            result.application.references.referenceOne.relationShip ||
            this.relationships[0].value;
          this.selectedReferenceTwo =
            result.application.references.referenceTwo.relationShip ||
            this.relationships[0].value;

          this.selectedTiltle1 =
            result.application.references.referenceOne.title ||
            this.titles[0].value;
          this.selectedName1 =
            result.application.references.referenceOne.fullName || "";
          this.selectedMobile1 =
            result.application.references.referenceOne.mobileNumber || "";
          this.selectedAddressLineOne1 =
            result.application.references.referenceOne.addressLineOne || "";
          this.selectedAddressLineTwo1 =
            result.application.references.referenceOne.addressLineTwo || "";

          this.selectedTiltle2 =
            result.application.references.referenceTwo.title ||
            this.titles[0].value;
          this.selectedName2 =
            result.application.references.referenceTwo.fullName || "";
          this.selectedMobile2 =
            result.application.references.referenceTwo.mobileNumber || "";
          this.selectedAddressLineOne2 =
            result.application.references.referenceTwo.addressLineOne || "";
          this.selectedAddressLineTwo2 =
            result.application.references.referenceTwo.addressLineTwo || "";

          this.qde = result;
          this.cds.enableTabsIfStatus1(this.qde.application.status);
          this.qde.application.applicationId = applicationId;

          this.qdeService.setQde(this.qde);
        });
      } else {
        this.qde = this.qdeService.getQde();
        this.cds.enableTabsIfStatus1(this.qde.application.status);
      }

      if(params['applicationId'] != null) {
        if(this.isEligibilityForReviewsSub != null) {
          this.isEligibilityForReviewsSub.unsubscribe();
        }
        this.isEligibilityForReviewsSub = this.cds.isEligibilityForReviews.subscribe(val => {
          try {
            this.isEligibilityForReview = val.find(v => v.applicationId == params['applicationId'])['isEligibilityForReview'];
          } catch(ex) {
            // this.router.navigate(['/leads']);
          }
        });
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


    // this.cds.applicationId.subscribe(val => {
    //   this.applicationId = val;
    //   if(JSON.parse(localStorage.getItem('roles')).includes('TBM')) {
    //     this.cds.setReadOnlyForm(true);
    //   } else {
    //     this.cds.setReadOnlyForm(false);
    //   }
    // });

 
    this.cds.isTBMLoggedIn.subscribe(val => {
      this.isTBMLoggedIn = val;
    });
    /********************************************************************
    * Check for User and set isReadOnly=true to disable editing of fields
    ********************************************************************/
    this.cds.isReadOnlyForm.subscribe(val => {
      this.isReadOnly = val;
      this.options.readOnly = val;
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

  submitRelationWithApplicant1(form: NgForm, swiperInstance?: Swiper) {

    if(this.isTBMLoggedIn) {
      this.goToNextSlide(swiperInstance);
    } else {
      if (form && !form.valid) {
        return;
      }
  
      this.qde.application.references.referenceOne.relationShip = this.selectedReferenceOne;
  
      this.qdeHttp
        .createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde))
        .subscribe(
          response => {
            // If successful
            if (
              response["Error"] === "0" &&
              response["ProcessVariables"]["status"]
            ) {
              this.referenceId1 = this.qde.application.references.referenceOne.referenceId;
              console.log(
                this.qde.application.references.referenceOne.relationShip
              );
              this.goToNextSlide(swiperInstance);
            } else {
              alert(response["ErrorMessage"]);
            }
          },
          error => {
            console.log("response : ", error);
            alert(error["ErrorMessage"]);
          }
        );
  
      console.log("submitted");
    }
  }

  submitReference1Detail(form: NgForm, swiperInstance?: Swiper) {
    if(this.isTBMLoggedIn) {
      this.tabSwitch(1);
    } else {
      if (form && !form.valid) {
        return;
      }
  
      this.qde.application.references.referenceOne = {
        referenceId: this.referenceId1,
        title: this.selectedTiltle1,
        fullName: this.selectedName1,
        mobileNumber: this.selectedMobile1,
        addressLineOne: this.selectedAddressLineOne1,
        addressLineTwo: this.selectedAddressLineTwo1
      };
  
      console.log(this.qde.application.references.referenceOne.relationShip);
  
      this.qdeHttp
        .createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde))
        .subscribe(
          response => {
            // If successful
            if (
              response["Error"] === "0" &&
              response["ProcessVariables"]["status"]
            ) {
              console.log(
                this.qde.application.references.referenceOne.relationShip
              );
              this.tabSwitch(1);
            } else {
              alert(response["ErrorMessage"]);
            }
          },
          error => {
            alert(error["ErrorMessage"]);
            console.log("response : ", error);
          }
        );
  
      console.log("submitted");
    }
  }

  submitRelationWithApplicant2(form: NgForm, swiperInstance?: Swiper) {

    if(this.isTBMLoggedIn) {
      this.goToNextSlide(swiperInstance);
    } else {
      if (form && !form.valid) {
        return;
      }
  
      this.qde.application.references.referenceTwo.relationShip = this.selectedReferenceTwo;
  
      //console.log(this.qde.application.references.referenceOne.relationShip);
  
      this.qdeHttp
        .createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde))
        .subscribe(
          response => {
            // If successful
            if (
              response["Error"] === "0" &&
              response["ProcessVariables"]["status"]
            ) {
              this.referenceId2 = this.qde.application.references.referenceTwo.referenceId;
              // console.log(this.qde.application.references.referenceOne.relationShip);
              this.goToNextSlide(swiperInstance);
            } else {
              alert(response["ErrorMessage"]);
            }
          },
          error => {
            alert(error["ErrorMessage"]);
            console.log("response : ", error);
          }
        );
  
      console.log("submitted");
    }
  }

  applicationId: string;
  applicationStatus: string = "10";
  isReferenceRouteModal:boolean = false

  onCrossModal(){
    this.isReferenceRouteModal = false;
  }

  submitReference2Detail(form: NgForm, swiperInstance?: Swiper) {

    if(this.isTBMLoggedIn) {
      this.tabSwitch(1);
    } else {
      if (form && !form.valid) {
        return;
      }
  
      this.qde.application.references.referenceTwo = {
        referenceId: this.referenceId2,
        title: this.selectedTiltle2,
        fullName: this.selectedName2,
        mobileNumber: this.selectedMobile2,
        addressLineOne: this.selectedAddressLineOne2,
        addressLineTwo: this.selectedAddressLineTwo2
      };
  
      console.log(this.qde.application.references.referenceOne.relationShip);
  
      this.qdeHttp
        .createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde))
        .subscribe(
          response => {
            // If successful
            if (
              response["Error"] === "0" &&
              response["ProcessVariables"]["status"]
            ) {
              console.log(
                this.qde.application.references.referenceOne.relationShip
              );
              this.isReferenceRouteModal = true;
            } else {
              alert(response["ErrorMessage"]);
            }
          },
          error => {
            alert(error["ErrorMessage"]);
            console.log("response : ", error);
          }
        );
  
      console.log("submitted");
      //this.qdeHttp.setStatusApi(this.applicationId, this.applicationStatus).subscribe(res => {}, err => {});
    }
  }

  temp;
}
