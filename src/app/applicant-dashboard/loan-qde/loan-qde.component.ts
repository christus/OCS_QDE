import { Component, OnInit, ViewChild, ElementRef, Renderer2, AfterViewInit, ViewChildren, QueryList, OnDestroy  } from '@angular/core';


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

import { screenPages } from '../../app.constants';
import { environment } from 'src/environments/environment.prod';

interface Item {
  key: string ,
  value: number | string
}


@Component({
  selector: "app-loan-qde",
  templateUrl: "./loan-qde.component.html",
  styleUrls: ["./loan-qde.component.css"]
})
export class LoanQdeComponent implements OnInit, AfterViewInit, OnDestroy {
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
           required: "Loan Amount is Mandatory",
           invalid: "Invalid Loan Amount / Alphabets and special characters not allowed",
           minamount: "Amount should be greater than or equal to Rs.",
           maxamount: "Amount should be less than or equal to Rs.",
         },
         tenure: {
           required: "Loan Tenure is Mandatory",
           invalid: "One or more than one year"
         }
       },

        property: {
          propertyClss:{
            required:"Property Clss is Mandatory",
            invalid:"Property Clss is not valid"
          },
          propertyArea:{
            required:"Property Area is Mandatory",
            invalid:"Property Area is not valid",
            maxArea:"Property Area should not be more than 10,000 Sq foot"
          },
          pinCode: {
            required: "Property Pincode is Mandatory",
            invalid: "Property Pincode is not valid",
            wrong: "Please provide valid pincode"
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
             invalid: "Monthly EMI is not valid",
             minamount: "Amount should be greater than or equal to Rs.",
             maxamount: "Amount should be less than or equal to Rs."
           }
       },
     }
  };
  regexPattern = {
    mobileNumber: "^[1-9][0-9]*$",
    amount: "^[\\d]{0,14}([.][0-9]{0,4})?",
    minAmount: "[5-9][0-9]{4}|[1-9]\d{5,}",
    name: "/^[a-zA-Z ]{0,49}$/",
    pinCode: "^[1-9][0-9]{5}$",
    address: "^[0-9A-Za-z, _&'/#\\-]{0,119}$",
    tenure: "^[1-9][0-9]{1,2}$",
    sameDigit: '^0{6,10}|1{6,10}|2{6,10}|3{6,10}|4{6,10}|5{6,10}|6{6,10}|7{6,10}|8{6,10}|9{6,10}$',
    cityState: "^$"

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

  // propertyNoSwitchTab = 2; // tabswitch

  minValue: number = 1;
  options: Options = {
    floor: 1,
    ceil: 30,
    // step: 5,
    // showTicksValues: false,
    // // showSelectionBar: true,
    // showTicks: true,
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
    // step: 1,
    // showTicksValues: false,
    // // showSelectionBar: true,
    // showTicks: true,
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
  tenureYears: boolean = false;

  // applicantIndividual: boolean = true;

  fragments = ["loan", "property", "existingLoan"];

  qde: Qde;
  religions: Array<any>;
  qualifications: Array<any>;
  occupations: Array<any>;
  residences: Array<any>;
  titles: Array<any>;
  maritals: Array<any>;
  relationships: Array<any>;
  loanpurposes: Array<Item>;
  categories: Array<any>;
  genders: Array<any>;
  constitutions: Array<any>;
  loanTypes: Array<any>;
  loanProviders: Array<any>;

  applicantId: string;

  loanType: Array<any>;
  isPropertyIdentified = false;
  selectedLoanPurpose:  any;
  selectedLoanType: any;

  propertyTypes: Array<Item>;
  selectedPropertyType: Item;
  propertyClssLabel: string;
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

  selectedLoanProvider: Item;
  loanProviderList: Array<Item>;

  liveLoan = 0;
  monthlyEmiValue: string;

  applicationId: string;
  applicantIndex = 0;

  isReadOnly: boolean = false;
  isEligibilityForReview: boolean = false;
  isEligibilityForReviewsSub: Subscription;
  isTBMLoggedIn: boolean;
  isLoanRouteModal: boolean = false;
  isClssEligibleModal:boolean = false;
  isClssNotEligibleModal:boolean = false;
  disableNo: number = null;
  fullloanpurposes: Array<any>=[];

  loanPinCodeModal:boolean = false;

  allApplicantsItem: Array<Item>;
  // selectedApplicant: Item = {key: '', value: ''};
  selectedApplicant: Item;
  selectedApplicantName: string;
  selectedApplicantIndex: number = 0;

  isLoanProductPage: boolean;

  allClssAreas: Array<any> = [];
  isNumberLessThan50k: boolean;
  isNumberMoreThan100cr: boolean;
  isAreaLessThan100k: boolean;
  isNumberMoreThan10lk: boolean;
  isNumberLessThan1k: boolean;

  isMinAmount: boolean;
  requirMinAmout="";
  isMaxAmount: boolean;
  requirMaxAmout="";

  fragmentSub: Subscription;
  tabName: string;
  page: number;

  // RHS Sliders
  @ViewChildren('swiperS') swiperS$: QueryList<Swiper>;

   // LHS Sliders
   @ViewChildren('lhsSwiperS') lhsSwiperS$: QueryList<Swiper>;

  swiperSliders: Array<any>;
  swiperSlidersSub: Subscription;
  auditTrialApiSub: Subscription;

  lhsSwiperSliders: Array<Swiper> = [];
  swiperSlidersSub2: Subscription;


  isErrorModal:boolean;
  errorMessage:string;
  tempClssArea: string;

  public defaultItem = environment.defaultItem;

  constructor(
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private router: Router,
    private qdeHttp: QdeHttpService,
    private qdeService: QdeService,
    private cds: CommonDataService) {

    this.qde = this.qdeService.defaultValue;

    this.cds.changeMenuBarShown(false);
    this.cds.changeViewFormVisible(true);
    this.cds.changeLogoutVisible(true);
    this.cds.changeHomeVisible(true);

    this.route.params.subscribe(params => {
      if (params.applicantId != null && params.applicantId != undefined) {
        this.applicantId = params.applicantId;
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



    this.cds.applicationId.subscribe(val => {
      this.applicationId = val;
      if(JSON.parse(localStorage.getItem('roles')).includes('TBM')) {
        this.cds.setReadOnlyForm(true);
      } else {
        this.cds.setReadOnlyForm(false);
      }
    });


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

    // this.renderer.addClass(this.select2.selector.nativeElement, 'js-select');

    if(this.route.snapshot.data.listOfValues) {
      const lov = JSON.parse(this.route.snapshot.data.listOfValues['ProcessVariables'].lovs);
      console.log('LOVS: ', lov);
      this.titles = lov.LOVS.applicant_title;

      this.loanpurposes = lov.LOVS.loan_purpose;
      this.loanType = lov.LOVS.loan_type;
      this.propertyTypes = lov.LOVS.property_type;

      this.loanProviderList = lov.LOVS.loan_providers;
    }



    // this.route.fragment.subscribe(fragment => {
    //   let localFragment = fragment;

    //   if (fragment == null) {
    //     localFragment = "loan";
    //   }

    //   // Replace Fragments in url
    //   if (this.fragments.includes(localFragment)) {
    //     this.tabSwitch(this.fragments.indexOf(localFragment));
    //   }
    // });

    this.fragmentSub = this.route.queryParams.subscribe(val => {

      if(val['tabName']) {
        this.tabName = this.fragments.includes(val['tabName']) ? val['tabName'].toString() : this.fragments[0];
        this.activeTab = this.fragments.findIndex(v => v == val['tabName']);
      }

      if(val['page']) {
        this.page = (val && val['page'] != null && parseInt(val['page']) != NaN && parseInt(val['page']) >= 1) ? parseInt(val['page']): 1;
      }


      if(this.tabName && this.page && this.swiperSliders && this.swiperSliders.length > 0 && this.lhsSwiperSliders && this.lhsSwiperSliders.length > 0) {
        this.swiperSliders[this.activeTab].setIndex(this.page-1);
        this.lhsSwiperSliders[this.activeTab].setIndex(this.page-1);
      }
    });

    this.route.params.subscribe(params => {

      // Make an http request to get the required qde data and set using setQde
      const applicationId = params.applicationId;
      if (applicationId) {
        // this.qdeService.resetQde();
        // this.qde = this.qdeService.getQde();

        this.qdeHttp.getQdeData(applicationId).subscribe(response => {
          let result = JSON.parse(response["ProcessVariables"]["response"]);

          this.cds.enableTabsIfStatus1(result.application.status);

          console.log("loanType: ", this.loanType);

          this.qde = result;
          this.cds.setStatus(result.application.status);
          this.qdeService.setQde(result);
          this.cds.setactiveTab(screenPages['loanDetails']);
          this.cds.changeApplicationId(this.qde.application.applicationId);

          /****************************************************************************
          * If Loan Amount is present show qde screen (false) else show product screen
          ****************************************************************************/
         if(result.application.loanDetails &&
          result.application.loanDetails.loanAmount &&
          result.application.loanDetails.loanAmount.loanType) {

            this.isLoanProductPage = false;
            this.cds.changeMenuBarShown(true);
          } else {
            this.isLoanProductPage = true;
            this.cds.changeMenuBarShown(false);
          }

          if(this.qde.application.auditTrailDetails.screenPage == screenPages['loanDetails']) {
            this.goToExactPageAndTab(this.fragments.findIndex(v => v == this.qde.application.auditTrailDetails.tabPage), this.qde.application.auditTrailDetails.pageNumber);
          } else {
            this.goToExactPageAndTab(parseInt(this.fragments[0]), 1);
          }

          // All hardcoded value need to removed
          this.loanType = this.loanType.slice(0, 3);
          console.log("result.application.loanDetails.loanAmount.loanType: ", result.application.loanDetails.loanAmount.loanType);
          this.selectedLoanType = this.loanType.find(v => v.value == this.qde.application.loanDetails.loanAmount.loanType) || this.loanType[0];

          // this.selectedLoanPurpose =
          //   result.application.loanDetails.loanAmount.loanPurpose ||
          //   this.loanpurposes[0].value;
          if(result.application.loanDetails.loanAmount.loanType) {
            this.selectedLoanPurpose =
            result.application.loanDetails.loanAmount.loanPurpose;
            // ||
            // this.defaultItem.value.toString();
            // this.loanpurposes[0].value;
            this.setLoanPurposes(result.application.loanDetails.loanAmount.loanType+"", result.application.loanDetails.loanAmount.loanPurpose);
          } else {
            // this.loanpurposes = [{key: '', value: ''}];
            this.selectedLoanPurpose = this.defaultItem;
            // this.loanpurposes[0]
          }


          if (!result.application.loanDetails.propertyType) {
            result.application.loanDetails.propertyType = {}; //This line need to be removed
          }

          this.selectedPropertyType = this.propertyTypes.find(v => v.value ==
                                      result.application.loanDetails.propertyType.propertyType)||
                                      this.defaultItem;

          this.isPropertyIdentified =
            result.application.loanDetails.propertyType.propertyIdentified ||
            false;

          this.propertyClssValue =
            result.application.loanDetails.propertyType.propertyClss || "";

          this.tempClssArea = this.propertyClssValue;


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

          this.selectedLoanProvider = result.application.applicants[0].existingLoans.loanProvider != '' ? this.loanProviderList.find(v => v.value == result.application.applicants[0].existingLoans.loanProvider) : this.defaultItem;
          // this.loanProviderList[0]
          this.liveLoan = result.application.applicants[0].existingLoans ? result.application.applicants[0].existingLoans.liveLoan ? result.application.applicants[0].existingLoans.liveLoan :0 :0;

          this.monthlyEmiValue = result.application.applicants[0].existingLoans ? result.application.applicants[0].existingLoans.monthlyEmi ? result.application.applicants[0].existingLoans.monthlyEmi+'' :'' :'';

          this.qde = result;
          this.cds.enableTabsIfStatus1(this.qde.application.status);
          this.qde.application.applicationId = applicationId;

          // this.qdeService.setQde(this.qde);
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


          this.allApplicantsItem = this.qde.application.applicants.map(val => {
            if(val.isIndividual == true) {
              return {
                key: this.getApplicantTitle(val.personalDetails.title).key + " " + val.personalDetails.firstName+" "+val.personalDetails.lastName,
                value: val.applicantId
              };
            } else {
              return {key: val.organizationDetails.nameOfOrganization+" "+val.personalDetails.lastName, value: val.applicantId};
            }
          });
          // this.allApplicantsItem[0];
          this.selectedApplicant = this.defaultItem;
          if (this.selectedApplicant.value !=0){
          this.selectedApplicantIndex = this.qde.application.applicants.findIndex(v => v.applicantId == this.selectedApplicant.value);
          this.selectedApplicantName = this.qde.application.applicants[this.selectedApplicantIndex].personalDetails ? `${this.qde.application.applicants[this.selectedApplicantIndex].personalDetails['firstName']} ${this.qde.application.applicants[this.selectedApplicantIndex].personalDetails['lastName']}`: '';
          }
        }
        // , error => {
        //   this.isErrorModal = true;
        //   this.errorMessage = "Something went wrong, please try again later.";
        // }
      );
      } else {
        this.qde = this.qdeService.defaultValue;
      }
    });

    /********************************************************************
    * Check for User and set isReadOnly=true to disable editing of fields
    ********************************************************************/
    this.cds.isReadOnlyForm.subscribe(val => {
      this.isReadOnly = false;
      this.options.readOnly = false;
    });

    // this.qdeService.qdeSource.subscribe(val => {
    //   console.log("Latest Qde: ", val);
    //   this.qde = val;
    // });
  }

  ngOnInit() {

  }

  getApplicantTitle (salutation:string) {
    let titles = JSON.parse(JSON.stringify(this.titles));
    let selectedSalutationObj = {};
    for(let key in titles) {
      let salutationObj = titles[key];
      if(salutationObj["value"] == salutation ) {
        return salutationObj;
      }
    }
    return titles[0];
  }

  changePropertyIdentified(swiperInstance1: Swiper, swiperInstance2: Swiper, value: boolean) {

    const currentPropertyStatus = this.qde.application.loanDetails.propertyType.propertyIdentified;
    if(value) {

      // If user changed to "NO"
      if(!currentPropertyStatus) {


        this.qde.application.loanDetails.propertyType.propertyIdentified = false;
        this.qde.application.loanDetails.propertyType.propertyType = "";
        this.qde.application.loanDetails.propertyType.propertyClss = "";
        this.qde.application.loanDetails.propertyType.propertyArea = null;


        this.qde.application.loanDetails.property.zipcodeId = null;
        this.qde.application.loanDetails.property.zipcode = null;
        this.qde.application.loanDetails.property.addressLineOne = "";
        this.qde.application.loanDetails.property.addressLineTwo = "";
        this.qde.application.loanDetails.property.cityId = null;
        this.qde.application.loanDetails.property.city = "";
        this.qde.application.loanDetails.property.stateId = null;
        this.qde.application.loanDetails.property.state = "";


        this.selectedPropertyType = this.defaultItem;
        this.propertyClssValue = "";
        this.propertyAreaValue = null;

        this.propertyPincodeValue = null;
        this.propertyPincodeId = null;
        this.addressLineOneValue =  "";
        this.addressLineTwoValue =  "";
        this.cityId = null;
        this.city = "";
        this.stateId = null;
        this.state =  "";
        this.cityState =  "";

        this.qdeService.setQde(this.qde);

        this.qdeHttp
        .createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde))
        .subscribe(
          response => {
            // If successful
            if (response["ProcessVariables"]["status"]) {
              let result = response['ProcessVariables']['response'];
              // console.log(this.qde.application.references.referenceOne.relationShip);
              this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.applicantIndex]['applicantId']+"", this.page, this.tabName, screenPages['loanDetails']).subscribe(auditRes => {
                if(auditRes['ProcessVariables']['status'] == true) {
                  this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
                  this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
                  this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
                  this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];

                  //this.goToNextSlide(swiperInstance);
                }
              }
              // , error => {
              //   this.isErrorModal = true;
              //   this.errorMessage = "Something went wrong, please again later.";
              // }
            );

              this.goToNextSlide(swiperInstance1, swiperInstance2);
            } else {
              // Throw Invalid Pan Error
            }
          }
          // , error => {
          //   this.isErrorModal = true;
          //   this.errorMessage = "Something went wrong, please again later.";
          // }
        );

      }else {
        this.goToNextSlide(swiperInstance1, swiperInstance2);
      }

    } else {
      //switching to existing loan
       this.qde.application.loanDetails.propertyType.propertyIdentified = value;

       this.qdeHttp
       .createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde))
       .subscribe(
         response => {
           // If successful
           if (response["ProcessVariables"]["status"]) {
             let result = response['ProcessVariables']['response'];
             // console.log(this.qde.application.references.referenceOne.relationShip);
             this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.applicantIndex]['applicantId']+"", this.page, this.tabName, screenPages['loanDetails']).subscribe(auditRes => {
               if(auditRes['ProcessVariables']['status'] == true) {
                 this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
                 this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
                 this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
                 this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];


               }
             }
             // , error => {
             //   this.isErrorModal = true;
             //   this.errorMessage = "Something went wrong, please again later.";
             // }
           );
             this.goToExactPageAndTab(2, 1);
            //  this.tabSwitch(this.propertyNoSwitchTab);
           } else {
             // Throw Invalid Pan Error
           }
         }
         // , error => {
         //   this.isErrorModal = true;
         //   this.errorMessage = "Something went wrong, please again later.";
         // }
       );


      // If user changed to "YES"
      if(currentPropertyStatus) {
        // this.qde.application.loanDetails.propertyType
        console.log("applicant", false);
      }
       //  if(this.selectedLoanPurpose.value != "17") {
      //   this.router.navigate(['/references', this.qde.application.applicationId])
      // } else {
      //   this.tabSwitch(this.propertyNoSwitchTab);

      // }
    }
  }

  /**
   * Use to sync between lhs and rhs sliders
   * @param swiperInstance RHS Swiper Instance
   */
  goToNextSlide(swiperInstance1: Swiper, swiperInstance2: Swiper) {
    // if (form && !form.valid) {
    //   return;
    // }
    // Create ngModel of radio button in future
    swiperInstance1.nextSlide();

    if(swiperInstance2)
      swiperInstance2.nextSlide();

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
  goToPrevSlide(swiperInstance1: Swiper, swiperInstance2: Swiper) {
    // Create ngModel of radio button in future
    swiperInstance1.prevSlide();

    if(swiperInstance2)
      swiperInstance2.prevSlide();
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

  // tabSwitch(tabIndex?: number) {
  //   // Check for invalid tabIndex
  //   if (tabIndex < this.fragments.length) {
  //     this.router.navigate([], { fragment: this.fragments[tabIndex] });

  //     this.activeTab = tabIndex;

  //     // if (tabIndex == 9) {
  //     //   this.applicantIndividual = false;
  //     // } else if (tabIndex == 0) {
  //     //   this.applicantIndividual = true;
  //     // }
  //   }
  // }

  // tabSwitch(tabIndex ?: number, fromQde ?: boolean) {

  //   let modifiedTabIndex = tabIndex;
  //   // Check for invalid tabIndex
  //   if(modifiedTabIndex < this.fragments.length) {

  //     let t = (fromQde) ? (modifiedTabIndex == 2) ? 1 : this.page: 1;

  //     if(this.swiperSliders && this.swiperSliders.length > 0) {
  //       this.swiperSliders[modifiedTabIndex].setIndex(t-1);
  //     }

  //     // It should not allow to go to any other tabs if applicationId is not present
  //     // if(this.applicantIndex != null && this.qde.application.applicationId != null && this.qde.application.applicationId != '') {
  //     this.router.navigate([], {queryParams: { tabName: this.fragments[modifiedTabIndex], page: t }});
  //     // }

  //     // this.router.navigate([], { fragment: this.fragments[tabIndex]});
  //   }
  // }

  onBackButtonClick(goToSlideNumber: number = 1) {
    // if (this.activeTab > 0) {
    //   if (swiperInstance != null && swiperInstance.getIndex() > 0) {
    //     // Go to Previous Slide
    //     this.goToPrevSlide(swiperInstance);
    //   } else {
    //     // Go To Previous Tab
    //     this.tabSwitch(this.activeTab - 1);
    //   }
    // }
    if(this.page <= 1) {
      // Switch Tabs
      this.router.navigate([], {queryParams: {tabName: this.fragments[this.activeTab-1], page: goToSlideNumber}});
    }
    else {
      // go to previous slide
      if(this.tabName == this.fragments[2] && this.page == 4 && (this.selectedLoanPurpose != "16" || this.selectedLoanPurpose != "17")){
        this.router.navigate([], {queryParams: {tabName: this.tabName, page: this.page-2}});
      }
      else{
        this.router.navigate([], {queryParams: {tabName: this.tabName, page: this.page-1}});
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
    this.value[valueIndex] = newValue;
  }

  submitLoanAmount(form: NgForm) {
    if(this.isTBMLoggedIn) {
        this.goToExactPageAndTab(1,1);
    } else {
      if (form && !form.valid) {
        return;
      }


      console.log("selectedLoanPurpose: ", this.selectedLoanPurpose);
        if(this.selectedLoanPurpose!=""){
          this.setLoanPurposes(this.selectedLoanType.value,this.selectedLoanPurpose);
        }

      this.qde.application.loanDetails.loanAmount = {
        amountRequired: parseInt(this.getNumberWithoutCommaFormat(form.value.amountRequired)),
        loanPurpose: this.selectedLoanPurpose,
        loanTenure: form.value.loanTenure,
        loanType: parseInt(this.selectedLoanType.value+"")
      };

      if(this.qde.application.loanDetails.loanAmount.loanTenure == 0){
        this.tenureYears = true;
        return;
      }else{
        this.tenureYears = false;
      }

      this.qdeHttp
        .createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde))
        .subscribe(
          response => {
            // If successful
            if (response["ProcessVariables"]["status"]) {
              let result = response['ProcessVariables']['response'];
              // console.log(this.qde.application.references.referenceOne.relationShip);
              if(!this.tabName){
                this.tabName = "loan";
              }
              this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.applicantIndex]['applicantId']+"", this.page, this.tabName, screenPages['loanDetails']).subscribe(auditRes => {
                if(auditRes['ProcessVariables']['status'] == true) {
                  this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
                  this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
                  this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
                  this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
                }
              }
              // , error => {
              //   this.isErrorModal = true;
              //   this.errorMessage = "Something went wrong, please try again later.";
              // }
            );
                this.goToExactPageAndTab(1,1);
            } else {
              // Throw Invalid Pan Error
            }
          }
          // , error => {
          //   this.isErrorModal = true;
          //   this.errorMessage = "Something went wrong, please try again later.";
          // }
        );

      // console.log("Submitted Amount"+ this.qde.application.loanDetails.loanAmount);


    }
  }

  // goToNextSlide(swiperInstance?: Swiper) {
  //   this.goToNextSlide(swiperInstance);
  // }

  updatePropertyType(form: NgForm, swiperInstance1: Swiper, swiperInstance2: Swiper) {
    if(this.isTBMLoggedIn) {
      this.goToNextSlide(swiperInstance1, swiperInstance2)
    } else {
      if (form && !form.valid) {
        return;
      }

      let prepertyType = this.selectedPropertyType.value;

      // this.qde.application.loanDetails.propertyType = {
      //   propertyIdentified: this.isPropertyIdentified,
      //   propertyType: prepertyType,
      //   propertyClss: this.propertyClssValue,
      //   propertyArea: this.propertyAreaValue
      // };
      this.qde.application.loanDetails.propertyType.propertyIdentified = this.isPropertyIdentified;
      this.qde.application.loanDetails.propertyType.propertyType = prepertyType.toString();
      this.qde.application.loanDetails.propertyType.propertyClss = this.propertyClssValue;
      this.qde.application.loanDetails.propertyType.propertyArea = this.propertyAreaValue;

      this.qdeHttp
        .createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde))
        .subscribe(
          response => {
            let result = response['ProcessVariables']['response'];

            // If successful
            if (response["ProcessVariables"]["status"]) {
              this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.applicantIndex]['applicantId']+"", this.page, this.tabName, screenPages['loanDetails']).subscribe(auditRes => {
                if(auditRes['ProcessVariables']['status'] == true) {
                  this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
                  this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
                  this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
                  this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
                }
              }
              // , error => {
              //   this.isErrorModal = true;
              //   this.errorMessage = "Something went wrong, please try again later.";
              // }
            );
              this.goToNextSlide(swiperInstance1, swiperInstance2);
            } else {
              // Throw Invalid Pan Error
            }
          }
          // , error => {
          //   this.isErrorModal = true;
          //   this.errorMessage = "Something went wrong, please try again later.";
          // }
        );
    }
  }

  onPinCodeChange(event) {
    if(event.target.value.length < 6) {
      return;
    }
    console.log(event.target.value);
    let zipCode = event.target.value;

    if(zipCode.length !=0) {
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
          //alert("Pin code not available / enter proper pincode");
          this.loanPinCodeModal = true;

          this.cityState = "";

          this.qde.application.loanDetails.property.state = "";

          this.qde.application.loanDetails.property.city = "";

          this.qde.application.loanDetails.property.cityId = null;

          this.qde.application.loanDetails.property.stateId = null;
        }
      }
      // , error => {
      //   this.isErrorModal = true;
      //   this.errorMessage = "Something went wrong, please try again later.";
      // }
    );
    }else {
      this.cityState = "";

      this.qde.application.loanDetails.property.state = "";

      this.qde.application.loanDetails.property.city = "";

      this.qde.application.loanDetails.property.cityId = null;

      this.qde.application.loanDetails.property.stateId = null;
    }
  }

  submitPropertyDetail(form: NgForm, swiperInstance?: Swiper) {
    if(this.isTBMLoggedIn) {
        // this.goToExactPageAndTab(2,1);
        this.clssProbabilityCheck();
    } else {
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
            let result = response['ProcessVariables']['response'];

            if (response["ProcessVariables"]["status"]) {
              this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.applicantIndex]['applicantId']+"", this.page, this.tabName, screenPages['loanDetails']).subscribe(auditRes => {
                if(auditRes['ProcessVariables']['status'] == true) {
                  this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
                  this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
                  this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
                  this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
                }
              }
              // , error => {
              //   this.isErrorModal = true;
              //   this.errorMessage = "Something went wrong, please try again later.";
              // }
            );
              this.clssProbabilityCheck();
            } else {
              // Throw Invalid Pan Error
            }
          }
          // , error => {
          //   this.isErrorModal = true;
          //   this.errorMessage = "Something went wrong, please try again later.";
          // }
        );
    }
  }

  submitExistingLoanProvider(form: NgForm, swiperInstance1: Swiper, swiperInstance2: Swiper) {

    if(this.isTBMLoggedIn) {
      this.goToNextSlide(swiperInstance1, swiperInstance2)
    } else {
      if (form && !form.valid) {
        return;
      }

      // this.qde.application.loanDetails.existingLoans = {
      //   loanProvider: this.selectedLoanProvider
      // };

      this.qde.application.applicants[this.selectedApplicantIndex].existingLoans.loanProvider = this.selectedLoanProvider.value? this.selectedLoanProvider.value+"": this.selectedLoanProvider+"";

      this.qde.application.applicants[this.selectedApplicantIndex].existingLoans.monthlyEmi = parseInt(this.monthlyEmiValue+''.split(',').join(''));


      this.qdeHttp
        .createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde))
        .subscribe(
          response => {
            // If successful
            let result = response['ProcessVariables']['response'];

            if (response["ProcessVariables"]["status"]) {
              // this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.applicantIndex]['applicantId']+"", this.page, this.tabName, screenPages['loanDetails']).subscribe(auditRes => {
              //   if(auditRes['ProcessVariables']['status'] == true) {
              //     this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
              //     this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
              //     this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
              //     this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
              //   }
              // }, error => {
      //   this.isErrorModal = true;
      //   this.errorMessage = "Something went wrong, please try again later.";
      // });
              this.isLoanRouteModal = true
            } else {
              // Throw Invalid Pan Error
            }
          }
          // , error => {
          //   this.isErrorModal = true;
          //   this.errorMessage = "Something went wrong, please try again later.";
          // }
        );
    }
  }

  submitAnApplicantForExistingLoan(form: NgForm, swiperInstance1: Swiper, swiperInstance2: Swiper) {
    this.selectedApplicantIndex = this.qde.application.applicants.findIndex(v => v.applicantId == this.selectedApplicant.value);
    let s = this.qde.application.applicants.find(v => v.applicantId == this.selectedApplicant.value);
    this.selectedApplicantName = s.personalDetails ? `${s.personalDetails['firstName']} ${s.personalDetails['lastName']}`: '';

    this.liveLoan =  this.qde.application.applicants[this.selectedApplicantIndex].existingLoans? this.qde.application.applicants[this.selectedApplicantIndex].existingLoans.liveLoan: 0 ;


    this.selectedLoanProvider = this.qde.application.applicants[this.selectedApplicantIndex].existingLoans.loanProvider != '' ?  this.loanProviderList.find(v => v.value == this.qde.application.applicants[this.selectedApplicantIndex].existingLoans.loanProvider)    : this.defaultItem; //this.loanProviderList[0]

    console.log("slected loan provider", this.qde.application.applicants[this.selectedApplicantIndex].existingLoans.loanProvider);
    this.monthlyEmiValue = this.qde.application.applicants[this.selectedApplicantIndex].existingLoans ? this.qde.application.applicants[this.selectedApplicantIndex].existingLoans.monthlyEmi ? this.qde.application.applicants[this.selectedApplicantIndex].existingLoans.monthlyEmi+'' :'' :'';

    this.goToNextSlide(swiperInstance1, swiperInstance2);
  }

  RegExp(param) {
    return RegExp(param);
  }

  submitLiveLoans(form: NgForm, swiperInstance1: Swiper, swiperInstance2: Swiper ) {

    if(this.isTBMLoggedIn) {
      this.goToNextSlide(swiperInstance1, swiperInstance2);
    } else {
      if (form && !form.valid) {
        return;
      }

      // this.qde.application.applicants.loanDetails.existingLoans = {
      //   liveLoan: this.liveLoan
      // };

      // this.qde.application.applicants.find(v => v.applicantId == this.selectedApplicant.value).existingLoans = {
      //   liveLoan: form.value.liveLoansNumber
      // };

      this.qde.application.applicants.find(v => v.applicantId == this.selectedApplicant.value).existingLoans.liveLoan = form.value.liveLoansNumber;


      this.qdeHttp
        .createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde))
        .subscribe(
          response => {
            // If successful

            let result = response['ProcessVariables']['response'];

            if (response["ProcessVariables"]["status"]) {
              if(this.qde.application.applicants[this.selectedApplicantIndex].existingLoans.liveLoan > 0 ) {
                this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.applicantIndex]['applicantId']+"", this.page, this.tabName, screenPages['loanDetails']).subscribe(auditRes => {
                  if(auditRes['ProcessVariables']['status'] == true) {
                    this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
                    this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
                    this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
                    this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
                  }
                }
                // , error => {
                //   this.isErrorModal = true;
                //   this.errorMessage = "Something went wrong, please try again later.";
                // }
              );
                if(this.selectedLoanPurpose && ['16', '17'].includes(this.selectedLoanPurpose)){
                  this.goToNextSlide(swiperInstance1, swiperInstance2);
                }
                else{
                  this.goToNextSlide(swiperInstance1, swiperInstance2);
                  this.goToNextSlide(swiperInstance1, swiperInstance2);
                }
              }else{
                this.isLoanRouteModal = true;
              }

            } else {
              // Throw Invalid Pan Error
            }
          }
          // , error => {
          //   this.isErrorModal = true;
          //   this.errorMessage = "Something went wrong, please try again later.";
          // }
        );
    }
  }

  submitMonthlyEmi(form: NgForm, swiperInstance1: Swiper, swiperInstance2: Swiper) {
    if(this.isTBMLoggedIn) {
      this.goToNextSlide(swiperInstance1, swiperInstance2);
    } else {
      if (form && !form.valid) {
        return;
      }

      // this.qde.application.loanDetails.existingLoans = {
      //   monthlyEmi: this.monthlyEmiValue
      // };

      this.qde.application.applicants.find(v => v.applicantId == this.selectedApplicant.value).existingLoans.monthlyEmi = parseInt(this.monthlyEmiValue+''.split(',').join(''));

      this.qdeHttp
        .createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde))
        .subscribe(
          response => {
            let result = response['ProcessVariables']['response'];

            // If successful
            if (response["ProcessVariables"]["status"]) {
              this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.applicantIndex]['applicantId']+"", this.page, this.tabName, screenPages['loanDetails']).subscribe(auditRes => {
                if(auditRes['ProcessVariables']['status'] == true) {
                  this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
                  this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
                  this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
                  this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
                }
              }
              // , error => {
              //   this.isErrorModal = true;
              //   this.errorMessage = "Something went wrong, please try again later.";
              // }
            );
              this.isLoanRouteModal = true
            } else {
              // Throw Invalid Pan Error
            }
          }
          // , error => {
          //   this.isErrorModal = true;
          //   this.errorMessage = "Something went wrong, please try again later.";
          // }
        );
    }
  }

  clssProbabilityCheck() {
    this.qdeHttp.clssProbabilityCheck(this.applicationId).subscribe(
      response => {
        if (response["Error"] === "0" && response["ProcessVariables"]["isClssEligible"]) {
          this.isClssEligibleModal = true;
        } else {
          this.isClssNotEligibleModal = true;
        }
      }
      // , error => {
      //   this.isErrorModal = true;
      //   this.errorMessage = "Something went wrong, please try again later.";
      // }
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

  proceedToExistingLoanEligible() {
    this.isClssEligibleModal = false;
    // this.tabSwitch(this.propertyNoSwitchTab);
    this.router.navigate([], {queryParams: { tabName: this.fragments[2], page: 1 }});
      //  if(this.selectedLoanPurpose.value != "17") {
      //   this.router.navigate(['/references', this.qde.application.applicationId])
      // } else {
      //   // this.tabSwitch(this.propertyNoSwitchTab);
      //   this.router.navigate([], {queryParams: { tabName: this.fragments[2], page: 0 }});

      // }
  }
  proceedToExistingLoanNotEligible() {
    this.isClssNotEligibleModal = false;
    this.router.navigate([], {queryParams: { tabName: this.fragments[2], page: 1 }});
  //   if(this.selectedLoanPurpose.value != "17") {
  //    this.router.navigate(['/references', this.qde.application.applicationId])
  //  } else {
    //  this.tabSwitch(this.propertyNoSwitchTab);

  //    this.router.navigate([], {queryParams: { tabName: this.fragments[2], page: 1 }});


  //  }
  }

  onCrossModal(){
    this.isLoanRouteModal = false;
    this.loanPinCodeModal = false;
  }

  /*******************************************
   * Pass "1,23,45,678" and will return number
   *******************************************/
  getNumberWithoutCommaFormat(x: string) : string {
    return x ? x+"".split(',').join(''): '';
  }

  /****************************************
  * Is a valid Number after removing Comma
  ****************************************/
  isValidNumber(x) {
    return RegExp('^[0-9]*$').test(this.getNumberWithoutCommaFormat(x));
  }

  selectLoanType(lt) {
    this.isLoanProductPage = false;
    this.selectedLoanType = lt;
    this.cds.changeMenuBarShown(true);
    this.setLoanPurposes(lt.value);
  }

  setLoanPurposes(loanType: string, data ?: string) {
        this.qdeHttp.getLoanPurposeFromLoanType({"loanType": loanType}).subscribe(res => {
          if(res['ProcessVariables']['status']){
            this.loanpurposes = res['ProcessVariables']['loanPurposeLov'];
            if(data) {
              for(var x in this.loanpurposes){
                if(this.loanpurposes[x].value==data){
                  this.selectedLoanPurpose = this.loanpurposes[x].value;
                  break; 
                }
              }
            } else {
              this.selectedLoanPurpose = this.defaultItem.value;
            }
          }
        });
          if(this.selectedLoanPurpose!="" && typeof(this.selectedLoanPurpose)!="object"){
            this.qdeHttp.getPropIdentified(this.selectedLoanPurpose).subscribe(res=>{
              if(res['ProcessVariables']['status']){
                if(res['ProcessVariables']['propIdentified']){
                 this.disableNo = 1; 
                }else{
                this.disableNo = null;
              }
            }
            });
          }
      }

  clssSearchArea(event: any){
    //console.log("gfegffdgewhj",event.target.value)
    this.qdeHttp.clssSearch(event.target.value).subscribe(res => {
      if(res['ProcessVariables']['status']) {
        this.allClssAreas = res['ProcessVariables']['townNames'] ? res['ProcessVariables']['townNames']: []
        console.log("CLSSArea: ", this.allClssAreas);
      }
    }
    // , error => {
    //   this.isErrorModal = true;
    //   this.errorMessage = "Something went wrong, please try again later.";
    // }
  );
  }

  // moreLoanObligation(){
  //   this.goToExactPageAndTab(this.fragments[2], 1);
  //   this.isLoanRouteModal = false;
  // }

  selectClssArea(c) {
    this.propertyClssLabel = c.label;
    this.propertyClssValue = c.value;
    this.tempClssArea = this.propertyClssValue;
    this.allClssAreas = [];
  }

  // checkAmountLimit(event,minAmount,maxAmount) {
  //   console.log("checkAmountLimit call ",event,minAmount,maxAmount);
  //   let n = parseInt(this.getNumberWithoutCommaFormat(event.target.value));
  //   if(n < 50000 && minAmount == 50000){
  //     this.isNumberLessThan50k = true;
  //   }
  //   else if(n >= 1000000001 && maxAmount == 1000000000){
  //     this.isNumberMoreThan100cr = true;
  //   }
  //   else if(n >= 1000001 && maxAmount == 1000000){
  //     this.isNumberMoreThan10lk = true;
  //   } else if(n < 1000 && minAmount == 1000){
  //     this.isNumberLessThan1k = true;
  //   }
  //   else {
  //     this.isNumberLessThan50k = false;
  //     this.isNumberMoreThan100cr = false;
  //     this.isNumberMoreThan10lk = false;
  //     this.isNumberLessThan1k =false;
  //   }
  // }

  checkAmountLimit(event,minAmount?,maxAmount?) {
    console.log("checkAmountLimit call ",event,minAmount,maxAmount);
    let n = parseInt(this.getNumberWithoutCommaFormat(event.target.value));
    if(minAmount != undefined && n < minAmount ){
      console.log("min ",event,minAmount,maxAmount);
      this.isMinAmount = true;
      this.requirMinAmout = minAmount;
    } else if(n >= maxAmount && !maxAmount){
      console.log("max ",event,minAmount,maxAmount);
      this.isMaxAmount = true;
      this.requirMaxAmout = maxAmount;
    } else {
      this.isMinAmount = false;
      this.requirMinAmout="";
      this.isMaxAmount = false;
      this.requirMaxAmout="";
    }
  }

  checkAreaLimit(event) {
    let n = parseInt(this.getNumberWithoutCommaFormat(event.target.value));
    if(n >= 10001){
      this.isAreaLessThan100k = true;
    }
    else {
      this.isAreaLessThan100k = false;
    }
  }

  ngAfterViewInit() {
    this.swiperSlidersSub = this.swiperS$.changes.subscribe(v => {

      console.log("Swipers: ", this.activeTab, this.swiperSliders);
      this.swiperSliders = v._results;
      // if (this.swiperSliders && this.swiperSliders.length > 0) {
      //   this.swiperSliders[this.activeTab].setIndex(this.page - 1);
      // }
    });

    this.swiperSlidersSub2 = this.lhsSwiperS$.changes.subscribe(v => {

      console.log("Swipers: ", this.activeTab, this.swiperSliders);
      this.lhsSwiperSliders = v._results;
      // if (this.swiperSliders && this.swiperSliders.length > 0) {
      //   this.swiperSliders[this.activeTab].setIndex(this.page - 1);
      // }
    });
  }

  // goToExactPageAndTab(tabPage: string, pageNumber: number) {
  //   let index = this.fragments.findIndex(v => v == tabPage) != -1 ? this.fragments.findIndex(v => v == tabPage) : 0;
  //   this.tabName = tabPage;
  //   this.page = pageNumber;
  //   this.tabSwitch(index, true);
  // }

  goToExactPageAndTab(index: number, pageNumber: number) {
    // let index = this.fragments.some(v => v == tabPage) ? this.fragments.findIndex(v => v == tabPage) : 0;
    // this.tabName = tabPage;
    // this.page = pageNumber;
    // this.goToExactPageAndTab(i, 1ndex, true);
    this.router.navigate([], {queryParams: {tabName: this.fragments[index] , page: pageNumber}});
  }

  ngOnDestroy() {
    if(this.swiperSlidersSub != null) {
      this.swiperSlidersSub.unsubscribe();
    }
  }

  moreLoanObligation(n: boolean) {
    this.isLoanRouteModal = false;
    if(n) {
      this.goToExactPageAndTab(2, 1);
    } else {
      this.router.navigate(['/references', this.qde.application.applicationId]);
    }

  }
}
