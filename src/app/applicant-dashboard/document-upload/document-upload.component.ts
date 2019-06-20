import { Component, OnInit,  ViewChild, ElementRef, Renderer2, AfterViewInit } from '@angular/core';

import * as Swiper from "swiper/dist/js/swiper.js";
// import { Select2Component } from 'ng2-select2';
import { ActivatedRoute, Router } from "@angular/router";

import { Options } from "ng5-slider";
import { NgForm } from "@angular/forms";
import { QdeHttpService } from 'src/app/services/qde-http.service';
import { callbackify } from 'util';
import { QdeService } from 'src/app/services/qde.service';
import Qde from 'src/app/models/qde.model';



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

  applicationId: number;
  applicationIdAsString: string;
  mainApplicantId: string;
  currentApplicantId: string;
  isMainApplicant: boolean;
  coApplicants: Array<any> = [];

  selectedIdProof: string;
  selectedAddressProof: string;
  selectedIncomeProof: string;
  selectedBankProof: string;
  selectedCollateralProof: string;

  documentType: any;
  documentCategory: any;
  collateralType: any;

  qde: Qde;

  fragments = [
    "aadhar1",
    "aadhar2",
    "address",
    "income",
    "banking",
    "collateral",
    "photo"
  ];

  constructor(
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private router: Router,
    private qdeHttp: QdeHttpService,
    private qdeService: QdeService
  ) {

      this.isMainApplicant = false;
      if (this.route.url["value"][1].path === "applicant") {
        this.isMainApplicant = true;
      }
      this.tabSwitch(1);
  }

  ngOnInit() {
    // this.renderer.addClass(this.select2.selector.nativeElement, 'js-select');

    if (this.route.snapshot.data.listOfValues) {
      const lov = JSON.parse(
        this.route.snapshot.data.listOfValues["ProcessVariables"].lovs
      );
      
      this.documentType = lov.LOVS.document_type;
      this.documentCategory = lov.LOVS.document_category;
      this.collateralType = lov.LOVS.collateral_type || [
        {
          key: "Property Papers",
          value: "1"
        },
        {
          key: "Gold Assets",
          value: "2"
        }
      ];
    }

    // Check Whether there is qde data to be filled or else Initialize Qde
    this.route.params.subscribe(params => {
      // Make an http request to get the required qde data and set using setQde
      if (params.applicationId) {
        // setQde(JSON.parse(response.ProcessVariables.response));
      } else {
        this.qde = this.qdeService.getQde();
      }
    });

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

    this.route.params.subscribe(params => {
      // Make an http request to get the required qde data and set using setQde
      this.applicationId = params.applicationId;
      this.currentApplicantId = params.applicantId || null;
      if (this.applicationId) {
        this.qdeHttp.getQdeData(this.applicationId).subscribe(response => {
          this.qde = JSON.parse(response["ProcessVariables"]["response"]);
          this.applicationIdAsString = this.applicationId.toString();
          if (this.applicationId) {
            this.applicationId = parseInt(this.qde.application.applicationId);
          }
          const applicants = this.qde.application.applicants;
          for (const applicant of applicants) {
            if (applicant["isMainApplicant"]) {
              this.mainApplicantId = applicant["applicantId"];
            } else {
              this.coApplicants.push(applicant);
            }
          }

          this.qdeService.setQde(this.qde);
        });
      } else {
        this.qde = this.qdeService.getQde();
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

      if (tabIndex === 9) {
        this.applicantIndividual = false;
      } else if (tabIndex === 0) {
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


  handleIdProof(files: FileList) {
    // if (form && !form.valid) {
    //   return;
    // }

    const applicantId = this.currentApplicantId.toString();
    
    let file = files.item(0);
    let modifiedFile = Object.defineProperty(file, "name", {
      writable: true,
      value: file["name"]
    });
    modifiedFile["name"] = this.applicationId + "-" + applicantId + "-" + new Date().getTime() + "-" + modifiedFile["name"];

    const callback = (info: JSON) => {
      const documentId = info["id"];
      const documentCategory = this.findDocumentCategory("ID Proof");

      const documentInfo = {
        applicationId: this.applicationIdAsString,
        applicantId: applicantId,
        documentImageId: documentId,
        documentType: this.selectedIdProof,
        documentCategory: documentCategory
      };

      this.uploadToOmni(documentInfo, 2);
    };

    this.uploadToMongo(modifiedFile, callback);
  }

  handleAddressProof(files: FileList) {
    const applicantId = this.currentApplicantId.toString();

    let file = files.item(0);

    let modifiedFile = Object.defineProperty(file, "name", {
      writable: true,
      value: file["name"]
    });
    modifiedFile["name"] = this.applicationId + "-" + applicantId + "-" + new Date().getTime() + "-" + modifiedFile["name"];

    const callback = (info: JSON) => {
      const documentId = info["id"];
      const documentCategory = this.findDocumentCategory("Address Proof");

      const documentInfo = {
        applicationId: this.applicationIdAsString,
        applicantId: applicantId,
        documentImageId: documentId,
        documentType: this.selectedAddressProof,
        documentCategory: documentCategory
      };

      this.uploadToOmni(documentInfo, 3);
    };

    this.uploadToMongo(modifiedFile, callback);
  }

  handleIncomeProof(files: FileList) {

    const applicantId = this.currentApplicantId.toString();

    let file = files.item(0);

    let modifiedFile = Object.defineProperty(file, "name", {
      writable: true,
      value: file["name"]
    });
    modifiedFile["name"] = this.applicationId + "-" + applicantId + "-" + new Date().getTime() + "-" + modifiedFile["name"];

    const callback = (info: JSON) => {
      const documentId = info["id"];
      const documentCategory = this.findDocumentCategory("Income Document");

      const documentInfo = {
        applicationId: this.applicationIdAsString,
        applicantId: applicantId,
        documentImageId: documentId,
        documentType: this.selectedIncomeProof,
        documentCategory: documentCategory
      };

      this.uploadToOmni(documentInfo, 4);
    };

    this.uploadToMongo(modifiedFile, callback);
  }

  handleBankingProof(files: FileList) {

    const applicantId = this.currentApplicantId.toString();

    let file = files.item(0);

    let modifiedFile = Object.defineProperty(file, "name", {
      writable: true,
      value: file["name"]
    });
    modifiedFile["name"] = this.applicationId + "-" + applicantId + "-" + new Date().getTime() + "-" + modifiedFile["name"];

    const callback = (info: JSON) => {
      const documentId = info["id"];
      const documentCategory = this.findDocumentCategory("Banking");

      const documentInfo = {
        applicationId: this.applicationIdAsString,
        applicantId: applicantId,
        documentImageId: documentId,
        documentType: this.selectedBankProof,
        documentCategory: documentCategory
      };

      this.uploadToOmni(documentInfo, 5);
    };

    this.uploadToMongo(modifiedFile, callback);
  }

  handleCollateralProof(files: FileList) {

    const applicantId = this.currentApplicantId.toString();

    let file = files.item(0);

    let modifiedFile = Object.defineProperty(file, "name", {
      writable: true,
      value: file["name"]
    });
    modifiedFile["name"] = this.applicationId + "-" + applicantId + "-" + new Date().getTime() + "-" + modifiedFile["name"];

    const callback = (info: JSON) => {
      const documentId = info["id"];
      const documentCategory = this.findDocumentCategory("Collateral");

      const documentInfo = {
        applicationId: this.applicationIdAsString,
        applicantId: applicantId,
        documentImageId: documentId,
        documentType: this.selectedCollateralProof,
        documentCategory: documentCategory
      };

      this.uploadToOmni(documentInfo, 6);
    };

    this.uploadToMongo(modifiedFile, callback);
  }

  handleCustomerPhoto(files: FileList) {

    const applicantId = this.currentApplicantId.toString();

    let file = files.item(0);

    let modifiedFile = Object.defineProperty(file, "name", {
      writable: true,
      value: file["name"]
    });
    modifiedFile["name"] = this.applicationId + "-" + applicantId + "-" + new Date().getTime() + "-" + modifiedFile["name"];

    const callback = (info: JSON) => {
      const documentId = info["id"];
      const documentCategory = this.findDocumentCategory("Photo");

      const documentInfo = {
        applicationId: this.applicationIdAsString,
        applicantId: applicantId,
        documentImageId: documentId,
        documentType: "",
        documentCategory: documentCategory
      };

      this.uploadToOmni(documentInfo, 7);
    };

    this.uploadToMongo(modifiedFile, callback);
  }

  uploadToMongo(file: File, callback: any) {
    this.qdeHttp.uploadToAppiyoDrive(file).subscribe(
      response => {
        if (response["ok"]) {
          console.log(response);
          callback(response["info"]);
        } else {
          console.log(response["ErrorMessage"]);
        }
      },
      error => {
        console.log("Error : ", error);
      }
    );
  }

  uploadToOmni(documentInfo: any, tabIndex: number) {
    this.qdeHttp.uploadToOmni(documentInfo).subscribe(
      response => {
        if (response["Error"] === "0" && response["ProcessVariables"]["status"]) {
          this.tabSwitch(tabIndex); // Need to be enabled for tab switch
        } else {
          if (response["ErrorMessage"]){
            console.log("Response: " + response["ErrorMessage"]);
          } else if (response["ProcessVariables"]["errorMessage"]) {
            console.log("Response: " + response["ProcessVariables"]["errorMessage"]);
          }
        }
      },
      error => {
        console.log("Error : ", error);
      }
    );
  }

  findDocumentCategory(type: string) {
    let documentCategory: string;
    for (const category of this.documentCategory) {
      if (category.key === type) {
        documentCategory = category.value;
        break;
      }
    }

    return documentCategory;
  }

  onSelectApplicant(tabIndex?: number, isMainApplicant?: boolean) {
    this.isMainApplicant = isMainApplicant;
    this.tabSwitch(tabIndex);
  }

  ngOnDestroy(): void {
    
  }

  temp;
}
