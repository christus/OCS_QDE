import { Component, OnInit,  ViewChild, ElementRef, Renderer2, AfterViewInit } from '@angular/core';

import * as Swiper from "swiper/dist/js/swiper.js";
// import { Select2Component } from 'ng2-select2';
import { ActivatedRoute, Router } from "@angular/router";

import { Options } from "ng5-slider";
import { NgForm } from "@angular/forms";
import { CommonDataService } from 'src/app/services/common-data.service';
import { QdeService } from 'src/app/services/qde.service';
import { QdeHttpService } from 'src/app/services/qde-http.service';

@Component({
  selector: 'app-offline-payment',
  templateUrl: './offline-payment.component.html',
  styleUrls: ['./offline-payment.component.css']
})
export class OfflinePaymentComponent implements OnInit {

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
    effect: "slide"
  };

  activeTab: number = 0;

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


  fragments = ["offlinepayment1", "offlinepayment2"];

  constructor(
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private router: Router,
    private commonDataService: CommonDataService,
    private qdeService: QdeService,
    private qdeHttp: QdeHttpService,
  ) {
    this.commonDataService.changeMenuBarShown(true);
    this.commonDataService.changeViewFormNameVisible(true);
    this.commonDataService.changeViewFormVisible(true);
    this.commonDataService.changeLogoutVisible(true);

    console.log("this.route: ", this.route);
    this.qdeService.setQde(JSON.parse(this.route.snapshot.data['qde']['ProcessVariables']['response']));
    this.qdeService.qdeSource.subscribe(value => {
      this.applicationId = value.application.applicationId;
      this.ocsNumber = value.application.ocsNumber;
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

  applicationStatusCheque: string = "16";
  offline(){
    this.qdeHttp.setStatusApi(this.applicationId, this.applicationStatusCheque).subscribe(res => {}, err => {});
  }

  totalFee:number;
  submitPaymentForm() {
  this.qdeHttp.loginFee(parseInt(this.applicationId)).subscribe(res => {
    this.totalFee = res['ProcessVariables']['totalAmount'];
    this.qdeHttp.paymentGateway(""+this.totalFee).subscribe(res => {
    });
  });
  console.log("Payment gateway")
 
}

}
