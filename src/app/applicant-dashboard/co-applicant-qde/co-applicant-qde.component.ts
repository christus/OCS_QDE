import { Component, OnInit, ViewChild, ElementRef, Renderer2, AfterViewInit } from '@angular/core';
    
import * as Swiper from 'swiper/dist/js/swiper.js';
import { ActivatedRoute, Router } from '@angular/router';

import { Options } from 'ng5-slider';

@Component({
  selector: 'app-co-applicant-qde',
  templateUrl: './co-applicant-qde.component.html',
  styleUrls: ['./co-applicant-qde.component.css']
})
export class CoApplicantQdeComponent implements OnInit, AfterViewInit {


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

  @ViewChild('tabContents') private tabContents: ElementRef;
  // @ViewChild(Select2Component) private select2: Select2Component;

  // All Swiper Sliders
  @ViewChild('coApplicant1') private coApplicant1: ElementRef;
  @ViewChild('coApplicant2') private coApplicant2: ElementRef;

  @ViewChild('panSlider1') private panSlider1: ElementRef;
  @ViewChild('panSlider2') private panSlider2: ElementRef;
  @ViewChild('pdSlider1') private pdSlider1: ElementRef;
  @ViewChild('pdSlider2') private pdSlider2: ElementRef;
  @ViewChild('maritalSlider1') private maritalSlider1: ElementRef;
  @ViewChild('maritalSlider2') private maritalSlider2: ElementRef;
  @ViewChild('familySlider1') private familySlider1: ElementRef;
  @ViewChild('familySlider2') private familySlider2: ElementRef;

  private isAlternateEmailId: boolean = false;
  private isAlternateMobileNumber: boolean = false;
  private isAlternateResidenceNumber: boolean = false;
  
  private applicantIndividual:boolean = true;
  

  private fragments = [ 
                        'pan',
                        'personal',
                        'contact',
                        'address',
                        'marital',
                        'family',
                        'other',
                        'occupation',
                        'correspondence',
                        'organization',
                        'regAddress',
                        'corpAddr',
                        'revenueAddr',
                        'coApplicant'
  ];

  constructor(private renderer: Renderer2,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    // this.renderer.addClass(this.select2.selector.nativeElement, 'js-select');

    this.route.fragment.subscribe((fragment) => {
      let localFragment = fragment;
      
      if(fragment == null) {
        localFragment = 'pan';
      }

      // Replace Fragments in url
      if(this.fragments.includes(localFragment)) {
        this.tabSwitch(this.fragments.indexOf(localFragment));
      }
      
    });

    
  }

  ngAfterViewInit() {

  }


  valuechange(newValue) {
    console.log(newValue);
    this.value  = newValue;
  }

  /**
   * Use to sync between lhs and rhs sliders
   * @param swiperInstance RHS Swiper Instance
   */
  goToNextSlide(swiperInstance: Swiper) {

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

  onBackButtonClick(swiperInstance ?: Swiper) {

    if(this.activeTab > 0) {
      if(swiperInstance != null && swiperInstance.getIndex() > 0) {
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
