import { Component, OnInit,  ViewChild, ElementRef, Renderer2, AfterViewInit } from '@angular/core';

import * as Swiper from "swiper/dist/js/swiper.js";
// import { Select2Component } from 'ng2-select2';
import { ActivatedRoute, Router } from "@angular/router";

import { Options } from "ng5-slider";
import { NgForm } from "@angular/forms";
import { QdeHttpService } from 'src/app/services/qde-http.service';



@Component({
  selector: 'app-document-upload',
  templateUrl: './document-upload.component.html',
  styleUrls: ['./document-upload.component.css']
})
export class DocumentUploadComponent implements OnInit {

  showSuccessModal: boolean = false;

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
  @ViewChild("aadharSlider1") aadharSlider1: ElementRef;
  @ViewChild("aadharSlider2") aadharSlider2: ElementRef;
  @ViewChild("addressSlider1") addressSlider1: ElementRef;
  @ViewChild("addressSlider2") addressSlider2: ElementRef;
  @ViewChild("incomeSlider1") incomeSlider1: ElementRef;
  @ViewChild("incomeSlider2") incomeSlider2: ElementRef;
  @ViewChild("bankingSlider1") bankingSlider1: ElementRef;
  @ViewChild("bankingSlider2") bankingSlider2: ElementRef;
  @ViewChild("collateralSlider1") collateralSlider1: ElementRef;
  @ViewChild("collateralSlider2") collateralSlider2: ElementRef;


  isAlternateEmailId: boolean = false;
  isAlternateMobileNumber: boolean = false;
  isAlternateResidenceNumber: boolean = false;

  applicantIndividual: boolean = true;

  fragments = ["aadhar1", "aadhar2", "address", "income", "banking", "collateral", "photo"];

  constructor(
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private router: Router,
    private qdeHttp: QdeHttpService,
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

  fileToUpload: File = null;

  handleIdProof(files: FileList) {
    // if (form && !form.valid) {
    //   return;
    // }

    this.fileToUpload = files.item(0);
    console.log("FILE UPLOAD: " + this.fileToUpload);

    this.update(this.fileToUpload);
  }

  handleAddressProof(files: FileList) {
    this.fileToUpload = files.item(0);
  }

  handleIncomeProof(files: FileList) {
    this.fileToUpload = files.item(0);
  }

  handleBankingProof(files: FileList) {
    this.fileToUpload = files.item(0);
  }

  handleCollateralProof(files: FileList) {
    this.fileToUpload = files.item(0);
  }

  handleCustomerPhoto(files: FileList) {
    this.fileToUpload = files.item(0);
  }

  update(file: File) {

    this.qdeHttp.uploadToAppiyoDrive(this.fileToUpload).subscribe(
      response => {
        if (response["Error"] === "0" && response["ProcessVariables"]["status"]) {
          console.log(response);
          //this.tabSwitch(1);
        } else {
          //alert("Response: " + response["ErrorMessage"]);
        }
      },
      error => {
        //alert(error["ErrorMessage"]);
        console.log("Error : ", error);
      }
    );
  }

  //  isEligible: boolean = false;
  // isNotEligible: boolean = false;
  // emiAmount: number;
  // eligibleAmount: number;

  // submitDocumentUploadForm(form: NgForm) {

  //   this.qdeHttp.dummyCIBILAPI().subscribe(res => {
  //     console.log("res: ", res['ProcessVariables']['checkEligibility'].toLowerCase);
  //     if(res['ProcessVariables']['checkEligibility'].toLowerCase() == 'yes') {
  //       this.isEligible = true;

  //       this.emiAmount = parseInt(res['ProcessVariables']['emi']);
  //       this.eligibleAmount = parseInt(res['ProcessVariables']['eligibilityAmount']);
  //     }
  //     else if(res['ProcessVariables']['checkEligibility'].toLowerCase() == 'no') {
  //       this.isNotEligible = true;
  //     }
  //   });
  // }

}
