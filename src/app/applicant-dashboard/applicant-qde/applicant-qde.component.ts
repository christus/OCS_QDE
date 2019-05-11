import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
    
import * as Swiper from 'swiper/dist/js/swiper.js';
import { Select2OptionData } from 'ng2-select2';

import { Options } from 'ng5-slider';


import {NgSelectModule, NgOption} from '@ng-select/ng-select';



@Component({
  selector: 'app-applicant-qde',
  templateUrl: './applicant-qde.component.html',
  styleUrls: ['./applicant-qde.component.css']
})
export class ApplicantQdeComponent implements OnInit {
  
  value: number = 6;

  minValue: number = 1;
  maxValue: number = 8;
  options: Options = {
    floor: 0,
    ceil: 6,
    showTicksValues: false,
    showSelectionBar: true,
    tickValueStep: 1,
    showTicks: true,
    getLegend: (value: number): string => {
      return  value + '<b>y</b>';
    }
  };
  private lhsConfig = {
    noSwiping: true,
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

  public exampleData: Array<any>;

  // options: any = {
  //   multiple: true,
  //   maximumSelectionLength: 1,
  //   minimumResultsForSearch: -1
  // };


  private activeTab: number = 0;

  @ViewChild('tabContents') private tabContents: ElementRef;
  //@ViewChild(Select2Component) private select2: Select2Component;

  constructor(private renderer: Renderer2) { }

  ngOnInit() {
   // this.renderer.addClass(this.select2.selector.nativeElement, 'js-select');

    this.exampleData = [
      {
        id: 'basic1',
        text: 'Basic 1'
      },
      {
        id: 'basic2',
        disabled: true,
        text: 'Basic 2'
      },
      {
        id: 'basic3',
        text: 'Basic 3'
      },
      {
        id: 'basic4',
        text: 'Basic 4'
      }
    ];
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

  tabSwitch(tabIndex: number) {
    this.activeTab = tabIndex;
  }

  private temp;
}
