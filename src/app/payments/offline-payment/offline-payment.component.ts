import { Other } from './../../models/qde.model';
import { Component, OnInit,  ViewChild, ElementRef, Renderer2, AfterViewInit } from '@angular/core';

import * as Swiper from "swiper/dist/js/swiper.js";
// import { Select2Component } from 'ng2-select2';
import { ActivatedRoute, Router } from "@angular/router";

import Qde from 'src/app/models/qde.model';
import { Options } from "ng5-slider";
import { NgForm } from "@angular/forms";
import { CommonDataService } from 'src/app/services/common-data.service';
import { QdeService } from 'src/app/services/qde.service';
import { QdeHttpService } from 'src/app/services/qde-http.service';
import { Subscription } from 'rxjs';
import { statuses, screenPages } from '../../app.constants';

@Component({
  selector: 'app-offline-payment',
  templateUrl: './offline-payment.component.html',
  styleUrls: ['./offline-payment.component.css']
})
export class OfflinePaymentComponent implements OnInit {

  
  value: number = 0;

  chequeDrawn: string;
  bankName: number;
  ifscCode: string;
  chequeNumber: number;
  amount: number;

  errors = {  
    payment:{
      offline:{
        chequeDrawn:{
          invalid: "Cheque drawn is not valid"
        },
        ifscCode:{
          invalid : "Invalid IFSC Code. Valid IFSC Code format is ABCD0123456"
        },
        chequeNumber:{
          invalid : "Invalid Cheque Number"
        },
        amount:{
          invalid: "Invalid Amount"
        }
      }
    }
  }

  regexPattern={
    name:"[A-Z|a-z]+$",
    ifsc:"[A-Z|a-z]{4}[0][\\d]{6}$",
    chequeNo: "[\\d]{0,6}",
    amount:"^[\\d]{0,10}([.][0-9]{0,4})?"
  }
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


  lhsConfig = {
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

  rhsConfig = {
    noSwiping: true,
    noSwipingClass: '',
    autoplay: false,
    speed: 900,
    effect: "slide"
  };

  activeTab: number = 0;

  selectedLoanProvider:string;

  @ViewChild("tabContents") tabContents: ElementRef;
  // @ViewChild(Select2Component) select2: Select2Component;

  // All Swiper Sliders
  // @ViewChild("offlinepaymentSlider1") offlinepaymentSlider1: ElementRef;
  // @ViewChild("offlinepaymentSlider2") offlinepaymentSlider2: ElementRef;
  // @ViewChild("addressSlider1") addressSlider1: ElementRef;
  // @ViewChild("addressSlider2") addressSlider2: ElementRef;
  // @ViewChild("incomeSlider1") incomeSlider1: ElementRef;
  // @ViewChild("incomeSlider2") incomeSlider2: ElementRef;
  // @ViewChild("bankingSlider1") bankingSlider1: ElementRef;
  // @ViewChild("bankingSlider2") bankingSlider2: ElementRef;
  // @ViewChild("collateralSlider1") collateralSlider1: ElementRef;
  // @ViewChild("collateralSlider2") collateralSlider2: ElementRef;


  isAlternateEmailId: boolean = false;
  isAlternateMobileNumber: boolean = false;
  isAlternateResidenceNumber: boolean = false;

  applicantIndividual: boolean = true;

  docType: Array<any>;
  ocsNumber: string;
  applicationId: string;
  loanProviderList: Array<any>;
  isChequeProceedModal:boolean = false;
  isOnlineProceedModal:boolean = false;
  isPaymentFailedModal:boolean = false;
  public butMes: string;
  sessionMessage="";


  fragments = ["offlinepayment1", "offlinepayment2"];

  getQdeDataSub: Subscription;
  qde: Qde;

  constructor(
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private router: Router,
    private commonDataService: CommonDataService,
    private qdeService: QdeService,
    private qdeHttp: QdeHttpService,
  ) {
    this.commonDataService.setactiveTab(screenPages['payments']);

    this.commonDataService.changeMenuBarShown(true);
    this.commonDataService.changeViewFormNameVisible(true);
    this.commonDataService.changeViewFormVisible(true);
    this.commonDataService.changeLogoutVisible(true);
    this.commonDataService.changeHomeVisible(true);

    console.log("this.route: ", this.route);
    this.qdeService.setQde(JSON.parse(this.route.snapshot.data['qde']['ProcessVariables']['response']));
    this.qdeService.qdeSource.subscribe(value => {
      this.applicationId = value.application.applicationId;
      this.commonDataService.changeApplicationId(value.application.applicationId);
      this.ocsNumber = value.application.ocsNumber;
      this.qde = value;
    });
    console.log(this.route.snapshot.data);
  }

  ngOnInit() {
    // this.renderer.addClass(this.select2.selector.nativeElement, 'js-select');

    this.route.fragment.subscribe(fragment => {
      let localFragment = fragment;

      if (fragment == null) {
        localFragment = "aadhar";
      }

      // Replace Fragments in url
      if (this.fragments.includes(localFragment)) {
        this.tabSwitch(this.fragments.indexOf(localFragment));
      }
    });

    const lov = JSON.parse(this.route.snapshot.data.listOfValues['ProcessVariables'].lovs);
    this.loanProviderList = lov.LOVS.loan_providers;
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


  
  chequeDetails(form:NgForm){

    
    let data = {
      applicationId: parseInt(this.applicationId),
      chequeDrawn: form.value.checkDrawnTo,
      bankName: parseInt(form.value.loanProvider.value),
      ifscCode: form.value.ifsc,
      chequeNumber: parseInt(form.value.chequeNo),
      amount: parseInt(form.value.amount)
    }

    this.qdeHttp.chequeDetailsSave(data).subscribe(res => {
      if(res['ProcessVariables']['status'] == true) {
        this.isChequeProceedModal = true;
        this.qdeHttp.setStatusApi(this.applicationId, statuses['Cheque Received']).subscribe(res => {}, err => {});
      }
      else{
        this.sessionMessage = res['ProcessVariables']['errorMessage']
      }
    });

  }


  totalFee:number;
  submitPaymentForm() {
  // this.qdeHttp.loginFee(parseInt(this.applicationId)).subscribe(res => {
  //   this.totalFee = res['ProcessVariables']['totalAmount'];
    // this.qdeHttp.paymentGateway(this.applicationId,""+this.totalFee).subscribe(res => {
    this.qdeHttp.paymentGateway(this.applicationId).subscribe(res => {
      console.log("Payment gateway",res);
      this.butMes = res['ProcessVariables']['errorMessage']
      if(res['ProcessVariables']['status'] == true){
        console.log('hi',(res['ProcessVariables']['status']));
        this.isOnlineProceedModal = true;
      }
      else{
        this.isPaymentFailedModal = true;
      }
    });
  // });
 
}

}
