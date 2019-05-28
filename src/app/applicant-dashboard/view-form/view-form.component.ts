import { Component, OnInit, ViewChild, ElementRef, Renderer2  } from '@angular/core';

import * as Swiper from 'swiper/dist/js/swiper.js';
// import { Select2Component } from 'ng2-select2';
import { ActivatedRoute, Router } from '@angular/router';

import { Options } from 'ng5-slider';
import { NgForm } from '@angular/forms';

import Qde from 'src/app/models/qde.model';
import { QdeHttpService } from 'src/app/services/qde-http.service';
import { CommonDataService } from 'src/app/services/common-data.service';

@Component({
  selector: 'app-view-form',
  templateUrl: './view-form.component.html',
  styleUrls: ['./view-form.component.css']
})
export class ViewFormComponent implements OnInit {

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
  

  private fragments = [ 'pan',
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
                        'revenueAddr'
  ];

  applicantIndex: number;

  private qde: Qde = {
    application: {
      ocsNumber: "",
      applicants: [
        {
          isMainApplicant: true
        }
      ]
    }
  };

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

  constructor(private route: ActivatedRoute,
              private router: Router,
              private qdeHttp: QdeHttpService,
              private commonDataService: CommonDataService) {
    
    this.commonDataService.changeMenuBarShown(false);
  }
  
  ngOnInit() {
      // this.renderer.addClass(this.select2.selector.nativeElement, 'js-select');
      
    console.log(">>", JSON.parse(this.route.snapshot.data.listOfValues['ProcessVariables'].lovs).LOVS);
    this.religions = JSON.parse(this.route.snapshot.data.listOfValues['ProcessVariables'].lovs).LOVS[0].religion;
    this.qualifications = JSON.parse(this.route.snapshot.data.listOfValues['ProcessVariables'].lovs).LOVS[1].qualification;
    this.occupations = JSON.parse(this.route.snapshot.data.listOfValues['ProcessVariables'].lovs).LOVS[2].occupation;
    this.residences = JSON.parse(this.route.snapshot.data.listOfValues['ProcessVariables'].lovs).LOVS[3].residence_type;
    this.titles = JSON.parse(this.route.snapshot.data.listOfValues['ProcessVariables'].lovs).LOVS[4].applicant_title;
    this.maritals = JSON.parse(this.route.snapshot.data.listOfValues['ProcessVariables'].lovs).LOVS[5].maritial_status;
    this.relationships = JSON.parse(this.route.snapshot.data.listOfValues['ProcessVariables'].lovs).LOVS[6].relationship;
    this.loanpurposes = JSON.parse(this.route.snapshot.data.listOfValues['ProcessVariables'].lovs).LOVS[7].loan_purpose;
    this.categories = JSON.parse(this.route.snapshot.data.listOfValues['ProcessVariables'].lovs).LOVS[8].category;
    this.genders = JSON.parse(this.route.snapshot.data.listOfValues['ProcessVariables'].lovs).LOVS[9].gender;
    this.constitutions = JSON.parse(this.route.snapshot.data.listOfValues['ProcessVariables'].lovs).LOVS[10].constitution;

    // Create New Entry
    this.applicantIndex = 0;
    // Write code to get data(LOV) and assign applicantIndex if its new or to update.
    console.log("Applicant Code: ", this.applicantIndex);

    // Assign true as it is Applicant (In future if qde variable is not in parent component then remove below line)
    this.qde.application.applicants[this.applicantIndex].isMainApplicant = true;


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

  valuechange(newValue) {
    console.log(newValue);
    this.value  = newValue;
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
    console.log(swiperInstance.getIndex());
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
