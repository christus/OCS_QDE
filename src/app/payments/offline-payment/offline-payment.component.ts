import { Component, OnInit,  ViewChild, ElementRef, Renderer2, AfterViewInit } from '@angular/core';

import * as Swiper from "swiper/dist/js/swiper.js";
// import { Select2Component } from 'ng2-select2';
import { ActivatedRoute, Router } from "@angular/router";

import { Options } from "ng5-slider";
import { NgForm } from "@angular/forms";

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
    effect: "slide"
  };

  private activeTab: number = 0;

  @ViewChild("tabContents") private tabContents: ElementRef;
  // @ViewChild(Select2Component) private select2: Select2Component;

  // All Swiper Sliders
  // @ViewChild("offlinepaymentSlider1") private offlinepaymentSlider1: ElementRef;
  // @ViewChild("offlinepaymentSlider2") private offlinepaymentSlider2: ElementRef;
  // @ViewChild("addressSlider1") private addressSlider1: ElementRef;
  // @ViewChild("addressSlider2") private addressSlider2: ElementRef;
  // @ViewChild("incomeSlider1") private incomeSlider1: ElementRef;
  // @ViewChild("incomeSlider2") private incomeSlider2: ElementRef;
  // @ViewChild("bankingSlider1") private bankingSlider1: ElementRef;
  // @ViewChild("bankingSlider2") private bankingSlider2: ElementRef;
  // @ViewChild("collateralSlider1") private collateralSlider1: ElementRef;
  // @ViewChild("collateralSlider2") private collateralSlider2: ElementRef;


  private isAlternateEmailId: boolean = false;
  private isAlternateMobileNumber: boolean = false;
  private isAlternateResidenceNumber: boolean = false;

  private applicantIndividual: boolean = true;

  private fragments = ["offlinepayment1", "offlinepayment2"];

  constructor(
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private router: Router
  ) {}

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

  private temp;

}
