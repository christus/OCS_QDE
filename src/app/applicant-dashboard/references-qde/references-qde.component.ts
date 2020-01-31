import { Component, OnInit, ViewChild, ElementRef, Renderer2, AfterViewInit, ViewChildren, QueryList } from '@angular/core';


import * as Swiper from "swiper/dist/js/swiper.js";
// import { Select2Component } from 'ng2-select2';
import { ActivatedRoute, Router } from "@angular/router";

import { Options } from "ng5-slider";
import { NgForm } from "@angular/forms";


import Qde, { MinMax } from 'src/app/models/qde.model';
import { QdeHttpService } from 'src/app/services/qde-http.service';
import { QdeService } from 'src/app/services/qde.service';
import { CommonDataService } from 'src/app/services/common-data.service';
import { Subscription } from 'rxjs';
import { screenPages } from 'src/app/app.constants';
import { environment } from 'src/environments/environment';


interface Item {
  key: string,
  value: number | string
}

@Component({
  selector: "app-references-qde",
  templateUrl: "./references-qde.component.html",
  styleUrls: ["./references-qde.component.css"]
})
export class ReferencesQdeComponent implements OnInit, AfterViewInit {
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
           minlength: "Mobile number must be at least",
           sameNumber: "Mobile number is same as of another reference , please use different numbers",
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
          minlength: "Mobile number must be 10 digits",
          sameNumber: "Mobile number is same as of another reference , please use different numbers",
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
//  name: "^[a-zA-Z ]{0,99}$"  // for only allow alpha
  regexPattern = {
    mobileNumber: "[1-9][0-9]*",
    name: "^[0-9A-Za-z, _&*#'/\\-@]{0,99}$",
    address : "^[0-9A-Za-z, _&'/#\\-]{0,99}$",
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
  relationships: Array<any> = [];
  loanpurposes: Array<any>;
  categories: Array<any>;
  genders: Array<any>;
  constitutions: Array<any>;
  selectedReferenceOneTitle: Item;
  selectedReferenceTwoTitle: Item;
  relationshipMap: Array<any>;
  selectedReferenceOne: Item;
  relationshipChanged1: boolean = false;
  relationshipChanged2: boolean = false;
  selectedTiltle1: Item;
  selectedName1: string;
  selectedMobile1: string;
  selectedAddressLineOne1: string;
  selectedAddressLineTwo1: string;

  selectedReferenceTwo: Item;

  selectedTiltle2: Item;
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

  // Only RHS Sliders
  @ViewChildren('swiperS') swiperS$: QueryList<Swiper>;
  swiperSliders: Array<Swiper> = [];
  swiperSlidersSub: Subscription;

  tabName: string;
  page: number;
  auditTrialApiSub: Subscription;
  fragmentSub: Subscription;
  minMaxValues: Array<MinMax>;
  isErrorModal:boolean;
  errorMessage:string;
  public defaultItem = environment.defaultItem;
  constructor(
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private router: Router,
    private qdeHttp: QdeHttpService,
    private qdeService: QdeService,
    private cds: CommonDataService
  ) {

    this.qde = this.qdeService.defaultValue;

    this.cds.changeMenuBarShown(true);
    this.cds.changeViewFormVisible(true);
    this.cds.changeLogoutVisible(true);
    this.cds.changeHomeVisible(true);
    this.cds.changeViewFormNameVisible(true);

    this.route.params.subscribe(params => {
      if(params['applicationId'] != null) {
        this.applicationId = params['applicationId'];
        this.cds.changeApplicationId(params['applicationId']);
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
    this.minMaxValues = lov['LOVS']['min_max_values'];
    // this.regexPattern['name'] = "^[a-zA-Z ]{0,"+this.minMaxValues['Name']['maxLength']+"}$"
    //this.titles = lov.LOVS.applicant_title;
    //this.relationships = lov.LOVS.relationship;
    //console.log(this.relationships);
    this.qdeHttp.getApplicantRelationships('1', '1', true).subscribe(res => {
      if (res['ProcessVariables']['status'] == true) {
        this.relationshipMap = JSON.parse(res['ProcessVariables']['response']);
        console.log(this.relationshipMap);
        if (this.relationshipMap != undefined || this.relationshipMap != null) {
          for (var x in this.relationshipMap) {
            let temp = { 'key': '', 'value': '' };
            temp.key = this.relationshipMap[x].relationShip;
            temp.value = this.relationshipMap[x].relationShipId;
            this.relationships.push(temp);
          }
        }
      }
    })

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


          this.cds.setStatus(result.application.status);
          this.cds.setactiveTab(screenPages['references']);

          this.qde = result;
          this.applicantIndex = this.qde.application.applicants.findIndex(v => v.isMainApplicant == true);

          if(this.qde.application.auditTrailDetails.screenPage == screenPages['references']) {
            this.goToExactPageAndTab(this.qde.application.auditTrailDetails.tabPage, this.qde.application.auditTrailDetails.pageNumber);
          }

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
          if (result.application.references.referenceOne.relationShip) {
          this.selectedReferenceOne = this.relationships.find(v => v.value == result.application.references.referenceOne.relationShip); 
          } else {
            this.selectedReferenceOne = this.defaultItem;
          }
          // || this.defaultItem;
          if (result.application.references.referenceTwo.relationShip){
          this.selectedReferenceTwo = this.relationships.find(v => v.value == result.application.references.referenceTwo.relationShip)
           } else {
            this.selectedReferenceTwo =this.defaultItem;
           }

	        this.selectedTiltle1 = this.titles.find(v => v.value == result.application.references.referenceOne.title) ||
            this.defaultItem;
          this.selectedName1 =
            result.application.references.referenceOne.fullName || "";
          this.selectedMobile1 =
            result.application.references.referenceOne.mobileNumber || "";
          this.selectedAddressLineOne1 =
            result.application.references.referenceOne.addressLineOne || "";
          this.selectedAddressLineTwo1 =
            result.application.references.referenceOne.addressLineTwo || "";

          this.selectedTiltle2 = this.titles.find(v => v.value == result.application.references.referenceTwo.title) ||
            this.defaultItem;
          this.selectedName2 =
            result.application.references.referenceTwo.fullName || "";
          this.selectedMobile2 =
            result.application.references.referenceTwo.mobileNumber || "";
          this.selectedAddressLineOne2 =
            result.application.references.referenceTwo.addressLineOne || "";
          this.selectedAddressLineTwo2 =
            result.application.references.referenceTwo.addressLineTwo || "";


          this.cds.enableTabsIfStatus1(this.qde.application.status);
          this.qde.application.applicationId = applicationId;

          this.qdeService.setQde(this.qde);
        }
        // , error => {
        //   this.isErrorModal = true;
        //   this.errorMessage = "Something went wrong, please try again later.";
        // }
      );
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
      this.setTitle1(lov);
    this.setTitle2(lov);
    });

    // this.route.fragment.subscribe(fragment => {
    //   let localFragment = fragment;

    //   if (fragment == null) {
    //     localFragment = "reference1";
    //   }

    //   // Replace Fragments in url
    //   if (this.fragments.includes(localFragment)) {
    //     this.tabSwitch(this.fragments.indexOf(localFragment));
    //   }
    // });

    this.fragmentSub = this.route.queryParams.subscribe(val => {

      if(val['tabName'] && val['tabName'] != '') {
        this.tabName = this.fragments.includes(val['tabName']) ? val['tabName'].toString(): this.fragments[0];
        this.activeTab = this.fragments.findIndex(v => v == val['tabName']);

        this.applicantIndividual = (this.activeTab >= 10) ? false: true;
      }

      if(val['page'] && val['page'] != '') {
        this.page = (val && val['page'] != null && parseInt(val['page']) != NaN && parseInt(val['page']) >= 1) ? parseInt(val['page']): 1;
      }

      console.log("Fragment & QueryParams: ", this.tabName, this.page);
      // Here in this condition, fragment and page number will be appropriate
      // if(this.fragment && this.page > -1) {
      //   alert(this.fragment+" "+this.page);
      // }
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
      this.isReadOnly = false;
      this.options.readOnly = false;
    });
  }

  valuechange(newValue) {
    console.log(newValue);
    this.value = newValue;
  }

  /**
   * Use to sync between lhs and rhs sliders
   * @param swiperInstance RHS Swiper Instance
   */
  goToNextSlide(swiperInstance: Swiper, form?: NgForm) {
    swiperInstance.nextSlide();
    this.page++;
    this.router.navigate([], {queryParams: { tabName: this.tabName, page: this.page }});
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
    swiperInstance.prevSlide();
    this.page--;
    this.router.navigate([], {queryParams: { tabName: this.tabName, page: this.page }});
  }

  /**
   * Use to sync between lhs and rhs sliders
   * @param swiperInstance LHS Swiper Instance
   */
  slidePrevTransitionStart(swiperInstance: Swiper) {
    swiperInstance.prevSlide();
  }

  tabSwitch(tabIndex?: number, fromQde ?: boolean) {

    // Check for invalid tabIndex
    if(tabIndex < this.fragments.length) {

      let t = fromQde ? this.page: 1;

      if(this.swiperSliders && this.swiperSliders.length > 0) {
        this.swiperSliders[tabIndex].setIndex(t-1);
      }

      this.router.navigate([], {queryParams: { tabName: this.fragments[tabIndex], page: t }});
    }
  }

  onBackButtonClick(swiperInstance?: Swiper) {
    if (this.activeTab > -1) {
      if (swiperInstance != null && swiperInstance.getIndex() > 0) {
        // Go to Previous Slide
        this.goToPrevSlide(swiperInstance);
      } else {
        // Go To Previous Tab
        if(this.activeTab == 0){
          this.router.navigate(['/loan/'+ this.applicationId]);
        }
        else{
        this.tabSwitch(this.activeTab - 1);
        }
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
      // this.selectedReferenceOne
      this.qde.application.references.referenceOne.relationShip = form.value.relationShip.value ;
      this.setTitle1();
      if(this.relationshipChanged1 && this.qde.application.references.referenceOne != undefined){
      this.selectedTiltle1 = this.defaultItem;
      this.setTitle1();
	    this.selectedName1 = "";
	    this.selectedMobile1 = "";
	    this.selectedAddressLineOne1 = "";
      this.selectedAddressLineTwo1 = "";
      this.qde.application.references.referenceOne.mobileNumber = "";
      this.qde.application.references.referenceOne.addressLineOne = "";
      this.qde.application.references.referenceOne.addressLineTwo = "";
      this.qde.application.references.referenceOne.fullName = "";
      this.qde.application.references.referenceOne.title = "";
    }
      this.qdeHttp
        .createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde))
        .subscribe(
          response => {
            // If successful
            if (response["ProcessVariables"]["status"]) {

              console.log(">>>",response['ProcessVariables']['status']);
              console.log('this.page: ', this.page);
              console.log('this.tabName: ', this.tabName);

              this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.applicantIndex]['applicantId']+"", this.page, this.tabName, screenPages['references']).subscribe(auditRes => {
                if(auditRes['ProcessVariables']['status'] == true) {
                  this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
                  this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
                  this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
                  this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];

                  this.goToNextSlide(swiperInstance);
                }
              }
              // , error => {
              //   this.isErrorModal = true;
              //   this.errorMessage = "Something went wrong, please try again later.";
              // }
            );

              this.referenceId1 = this.qde.application.references.referenceOne.referenceId;
            }
            // else {
            //   alert(response["ErrorMessage"]);
            // }
          }
          // , error => {
          //   this.isErrorModal = true;
          //   this.errorMessage = "Something went wrong, please try again later.";
          // }
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
      // this.selectedTiltle1
      this.qde.application.references.referenceOne = {
        referenceId: this.referenceId1,
        title: form.value.titles.value,
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
              this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.applicantIndex]['applicantId']+"", this.page, this.tabName, screenPages['references']).subscribe(auditRes => {
                if(auditRes['ProcessVariables']['status'] == true) {
                  this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
                  this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
                  this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
                  this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];

                  this.goToNextSlide(swiperInstance);
                }
              }
              // , error => {
              //   this.isErrorModal = true;
              //   this.errorMessage = "Something went wrong, please try again later.";
              // }
            );
              this.tabSwitch(1);
            }
            // else {
            //   alert(response["ErrorMessage"]);
            // }
          }
          // , error => {
          //   this.isErrorModal = true;
          //   this.errorMessage = "Something went wrong, please try again later.";
          // }
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

      this.qde.application.references.referenceTwo.relationShip = form.value.relationShip.value;

      //console.log(this.qde.application.references.referenceOne.relationShip);
      this.setTitle2();
      if(this.relationshipChanged2 && this.qde.application.references.referenceTwo!=undefined){
      this.selectedTiltle2 = this.defaultItem;
      this.setTitle2();
	    this.selectedName2 = "";
	    this.selectedMobile2 = "";
	    this.selectedAddressLineOne2 = "";
      this.selectedAddressLineTwo2 = "";
      this.qde.application.references.referenceTwo.mobileNumber = "";
      this.qde.application.references.referenceTwo.addressLineOne = "";
      this.qde.application.references.referenceTwo.addressLineTwo = "";
      this.qde.application.references.referenceTwo.fullName = "";
      this.qde.application.references.referenceTwo.title = "";
    }

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
              this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.applicantIndex]['applicantId']+"", this.page, this.tabName, screenPages['references']).subscribe(auditRes => {
                if(auditRes['ProcessVariables']['status'] == true) {
                  this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
                  this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
                  this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
                  this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];

                  this.goToNextSlide(swiperInstance);
                }
              }
              // , error => {
              //   this.isErrorModal = true;
              //   this.errorMessage = "Something went wrong, please try again later.";
              // }
            );
            }
            // else {
            //   alert(response["ErrorMessage"]);
            // }
          }
          // , error => {
          //   this.isErrorModal = true;
          //   this.errorMessage = "Something went wrong, please try again later.";
          // }
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
      // this.selectedTiltle2
      this.qde.application.references.referenceTwo = {
        referenceId: this.referenceId2,
        title: form.value.titles.value,
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

              this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.applicantIndex]['applicantId']+"", this.page, this.tabName, screenPages['references']).subscribe(auditRes => {
                if(auditRes['ProcessVariables']['status'] == true) {
                  this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
                  this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
                  this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
                  this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];

                  this.isReferenceRouteModal = true;
                }
              }
              // , error => {
              //   this.isErrorModal = true;
              //   this.errorMessage = "Something went wrong, please try again later.";
              // }
            );
            }
            // else {
            //   alert(response["ErrorMessage"]);
            // }
          }
          // , error => {
          //   this.isErrorModal = true;
          //   this.errorMessage = "Something went wrong, please try again later.";
          // }
        );

      console.log("submitted");
      //this.qdeHttp.setStatusApi(this.applicationId, this.applicationStatus).subscribe(res => {}, err => {});
    }
  }

  ngAfterViewInit() {

    if(this.route.snapshot.params['tabName'] == null) {
      this.tabName = this.fragments[0];
    }

    if(this.route.snapshot.params['page'] == null) {
      this.page = 1;
    }

    this.swiperSlidersSub = this.swiperS$.changes.subscribe(v => {
      this.swiperSliders = v._results;
      if(this.swiperSliders && this.swiperSliders.length > 0) {
        this.swiperSliders[this.activeTab].setIndex(this.page-1);
      }

    });
  }

  goToExactPageAndTab(tabPage: string, pageNumber: number) {
    let index = this.fragments.findIndex(v => v == tabPage) != -1 ? this.fragments.findIndex(v => v == tabPage) : 0;
    this.tabName = tabPage;
    this.page = pageNumber;
    this.tabSwitch(index, true);
  }
  setTitle1(data?: any) {
    var rela = this.qde.application.references.referenceOne.relationShip;
    console.log(rela);
    if (rela != null && rela != "" && this.relationshipMap != []) {
      this.titles = [];
      for (var x in this.relationshipMap) {
        if (this.relationshipMap[x].relationShipId == rela) {
          let tempTitles = this.relationshipMap[x].applicantTitles;
          console.log(tempTitles);
          for (var x in tempTitles) {
            let temp = { 'key': '', 'value': '' };
            temp.key = tempTitles[x].applicantTitle;
            temp.value = tempTitles[x].applicantTitleId;
            this.titles.push(temp);
          }
          if (!this.selectedTiltle1) {
            this.selectedTiltle1 = this.defaultItem;
          }
          break;
        }
      }
    } else if ((rela == undefined || rela == null || rela == "") && this.relationshipMap != []) {
      this.titles = data.LOVS.applicant_title;
          if (!this.selectedTiltle1) {
            this.selectedTiltle1 = this.defaultItem;
          }
      console.log(this.titles);
    }
  }
  setTitle2(data?: any) {
    var rela = this.qde.application.references.referenceTwo.relationShip;
    console.log(rela);
    if (rela != null && rela != "" && this.relationshipMap != []) {
      this.titles = [];
      for (var x in this.relationshipMap) {
        if (this.relationshipMap[x].relationShipId == rela) {
          let tempTitles = this.relationshipMap[x].applicantTitles;
          console.log(tempTitles);
          for (var x in tempTitles) {
            let temp = { 'key': '', 'value': '' };
            temp.key = tempTitles[x].applicantTitle;
            temp.value = tempTitles[x].applicantTitleId;
            this.titles.push(temp);
          }
          if (!this.selectedTiltle2) {
            this.selectedTiltle2 = this.defaultItem;
          }
          break;
        }
      }
    } else if ((rela == undefined || rela == null || rela == "") && this.relationshipMap != []) {
      this.titles = data.LOVS.applicant_title;
          if (!this.selectedTiltle2) {
            this.selectedTiltle2 = this.defaultItem;
          }
      console.log(this.titles);
    }
  }
}
