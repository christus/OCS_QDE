import { environment } from 'src/environments/environment';
import { Component, OnInit,  ViewChild, ElementRef, Renderer2, AfterViewInit, HostListener } from '@angular/core';

import * as Swiper from "swiper/dist/js/swiper.js";
// import { Select2Component } from 'ng2-select2';
import { ActivatedRoute, Router } from "@angular/router";

import { Options } from "ng5-slider";
import { NgForm } from "@angular/forms";
import { QdeHttpService } from 'src/app/services/qde-http.service';
import { callbackify } from 'util';
import { QdeService } from 'src/app/services/qde.service';
import Qde from 'src/app/models/qde.model';

import { DeviceDetectorService } from 'ngx-device-detector';
import { CommonDataService } from 'src/app/services/common-data.service';
import { Subscription } from 'rxjs';

interface Item {
  key: string;
  value: string | number;
}

enum DocumentCategory {
  ID_PROOF = "ID Proof",
  ADDRESS_PROOF = "Address Proof",
  INCOME_PROOF = "Income Document",
  BANK_PROOF = "Banking",
  COLLATERAL_PROOF = "Collateral",
  PHOTO_PROOF = "Photo"
}

@Component({
  selector: "app-document-upload",
  templateUrl: "./document-upload.component.html",
  styleUrls: ["./document-upload.component.css"]
})
export class DocumentUploadComponent implements OnInit {

  isMobile:boolean;
  
  cameraImage: string;

  imageURI: string;

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
    noSwiping: true,
    noSwipingClass: '',
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

  isAlternateEmailId = false;
  isAlternateMobileNumber = false;
  isAlternateResidenceNumber = false;

  applicantIndividual = true;

  applicationId: string;
  applicationIdAsString: string;
  mainApplicantId: string;
  // currentApplicantId: string;
  isMainApplicant: boolean;
  coApplicants: Array<any> = [];

  selectedIdProof: Array<Item> = [];
  selectedAddressProof: Array<Item> = [];
  selectedIncomeProof: Array<Item> = [];
  selectedBankProof: Array<Item> = [];
  selectedCollateralProof: Array<Item> = [];

  documentCategory: any;
  // collateralType: any;

  // fileName: string;
  // fileSize: string;
  progress: string;

  
  photoProofFileName: Array<string> = [];
  photoProofFileSize: Array<string> = [];
  photoProofId: Array<string> = [];
  photoProofDoc: Array<File> = [];

  idProofDocumnetType: Array<Item> = [];
  idProofFileName: Array<string> = [];
  idProofFileSize: Array<string> = [];
  idProofId: Array<string> = [];
  idProofDoc: Array<File> = [];

  addressProofDocumnetType: Array<Item> = [];
  addressProofFileName: Array<string> = [];
  addressProofFileSize: Array<string> = [];
  addressProofId: Array<string> = [];
  addressProofDoc: Array<File> = [];

  incomeProofDocumnetType: Array<Item> = [];
  incomeProofFileName: Array<string> = [];
  incomeProofFileSize: Array<string> = [];
  incomeProofId: Array<string> = [];
  incomeProofDoc: Array<File> = [];

  bankProofDocumnetType: Array<Item> = [];
  bankProofFileName: Array<string> = [];
  bankProofFileSize: Array<string> = [];
  bankProofId: Array<string> = [];
  bankingProofDoc: Array<File> = [];

  collateralProofDocumnetType: Array<Item> = [];
  collateralProofFileName: Array<string> = [];
  collateralProofFileSize: Array<string> = [];
  collateralProofId: Array<string> = [];
  collateralProofDoc: Array<File> = [];

  qde: Qde;

  fragments = [
    "dashboard",
    "aadhar1",
    "photo",
    "aadhar2",
    "address",
    "income",
    "banking",
    "collateral"
  ];

  isReadOnly: boolean = false;
  isEligibilityForReview: boolean = false;
  isEligibilityForReviewsSub: Subscription;
  isTBMLoggedIn: boolean;
  isTabDisabled: boolean = true;
  driveLoc: any;
  getQdeDataSub: Subscription;
  applicantIndex: number;
  applicantId: string;

  constructor(
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private router: Router,
    private qdeHttp: QdeHttpService,
    private deviceService: DeviceDetectorService,
    private qdeService: QdeService,
    private cds: CommonDataService) {

      this.cds.changeMenuBarShown(true);
      this.cds.changeViewFormVisible(true);
      this.cds.changeLogoutVisible(true);
    // this.isMainApplicant = false;
    // if (this.route.url["value"][1].path === "applicant") {
    //   this.isMainApplicant = true;
    // }
    //this.tabSwitch(1);
    this.cds.applicationId.subscribe(val => {
      // this.applicationId = parseInt(val);
      if(JSON.parse(localStorage.getItem('roles')).includes('TBM')) {
        this.cds.setReadOnlyForm(true);
      } else {
        this.cds.setReadOnlyForm(false);
      }
    });

    /********************************************************************
    * Check for User and set isReadOnly=true to disable editing of fields
    ********************************************************************/
    this.cds.isReadOnlyForm.subscribe(val => {
      this.isReadOnly = val;
      this.options.readOnly = val;
    });
  }

  ngOnInit() {

    this.isMobile = this.deviceService.isMobile() ;

    console.log("isMovile onInit", this.isMobile);

    // this.renderer.addClass(this.select2.selector.nativeElement, 'js-select');

    if (this.route.snapshot.data.listOfValues) {
      const lov = JSON.parse(this.route.snapshot.data.listOfValues["ProcessVariables"].lovs);

      this.documentCategory = lov.LOVS.document_category;
    }

    // Check Whether there is qde data to be filled or else Initialize Qde
    this.route.params.subscribe(params => {
      // Make an http request to get the required qde data and set using setQde
      if (params.applicationId != null) {
        if(params.applicantId != null) {
          this.applicantId = params['applicantId'];
        }

        this.getQdeDataSub = this.qdeHttp.getQdeData(params.applicationId).subscribe(response => {
          var result = JSON.parse(response["ProcessVariables"]["response"]);
          this.qdeService.setQde(result);
          var butRes = result.application.status;
          console.log("RESPONSEhgjfgjkfk ", butRes);

          // if(butRes >= 5) {
          //   this.cds.setIsMainTabEnabled(false);
          // }
          // else{
          //   this.cds.setIsMainTabEnabled(true);
          // }
            this.applicationId = this.qde.application.applicationId;
            this.cds.changeApplicationId(this.qde.application.applicationId);
            this.cds.enableTabsIfStatus1(this.qde.application.status);

        });
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

    this.qdeService.qdeSource.subscribe(val => {
      this.qde = val;

      if(val != null) {
        this.applicantIndex = val.application.applicants.findIndex(v => v.applicantId == this.applicantId);
      }

      const applicants = this.qde.application.applicants;
      applicants.forEach((applicant, index) => {
        const applicantId = applicant["applicantId"];
        this.driveLoc = environment.host + environment.driveLocation;


        const incomeDetails = applicant.incomeDetails;
        let profileId = 1;
        if (applicant.occupation.occupationType != "2") {
          profileId = 2;
        }
        const data = {
          isFinanceApplicant: incomeDetails.incomeConsider,
          assessmentId: parseInt(incomeDetails.assessmentMethodology, 10),
          profileId: profileId
        };

        this.getApplicableDocuments(data, (applicant['documents'] != null) ? applicant['documents'] : [], index);

        // Ends here

        if (applicant["isMainApplicant"]) {
          this.mainApplicantId = applicantId;
        } else {

          if (applicants.length - 1 === this.coApplicants.length) {

          } else {
            this.coApplicants.push(applicant);
          }
          
        }
      });
    });

    this.cds.isTBMLoggedIn.subscribe(val => {
      this.isTBMLoggedIn = val;
    });

    this.route.fragment.subscribe(fragment => {

      let localFragment = fragment;

      if (fragment == null || (!this.fragments.includes(fragment))) {
        localFragment = "aadhar";
      }

      // Replace Fragments in url
      if (this.fragments.includes(localFragment)) {
        this.tabSwitch(this.fragments.indexOf(localFragment));
      }
    });


    /********************************************************************
    * Check for User and set isReadOnly=true to disable editing of fields
    ********************************************************************/
    // if(some condition) {
    //   this.isReadOnly
    // this.options.readOnly = this.isReadOnly;
    // }

    // this.qdeHttp.getQdeData(parseInt(this.applicationId)).subscribe(res => {
    //   // var button = JSON.parse(res['ProcessVariables']['response'])
    //   // var butRes = button.application.status;
    // console.log("fhhhhhhhh",res)
    // })

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

    if(tabIndex == 0) {
      this.isTabDisabled = true;
    } else {
      this.isTabDisabled = false;
    }
    // Check for invalid tabIndex
    if (tabIndex < this.fragments.length) {

      console.log(tabIndex);
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

  /************************
  * Customer Photo Chooser
  ************************/
  setCustomerPhoto(files: any) {
    if(this.isMobile) {
      this.photoProofDoc[this.applicantIndex] = files;
      this.photoProofFileName[this.applicantIndex] = (<any>window).Ionic.WebView.convertFileSrc(this.photoProofDoc[this.applicantIndex]);
      this.photoProofFileSize[this.applicantIndex] = "";
      return;
    }

    this.photoProofDoc[this.applicantIndex] = files.item(0);
    this.photoProofFileName[this.applicantIndex] = this.photoProofDoc[this.applicantIndex]["name"];

    this.photoProofFileSize[this.applicantIndex] = this.getFileSize(this.photoProofDoc[this.applicantIndex]["size"]);
  }

  /************************
  * Customer Photo Next(Submit)
  ************************/
  handleCustomerPhoto(slider) {

    let tabIndex = 2;
    if (!this.photoProofDoc[this.applicantIndex]) {
      this.goToNextSlide(slider);
      this.tabSwitch(tabIndex);
      return;
    }

    if(this.isMobile) {
      const documentCategory = this.findDocumentCategory("Photo");

      this.sendImgProof(this.photoProofDoc[this.applicantIndex], tabIndex,slider, documentCategory, "");
      return;
    }

    // alert("applicantId: "+ this.qde.application.applicants[this.applicantIndex]['applicantId']);
    const applicantId = this.qde.application.applicants[this.applicantIndex].applicantId.toString();

    let modifiedFile = Object.defineProperty(this.photoProofDoc[this.applicantIndex], "name", {
      writable: true,
      value: this.photoProofDoc[this.applicantIndex]["name"]
    });
    
    modifiedFile["name"] = this.applicationId + "-" + applicantId + "-" + new Date().getTime() + "-" + modifiedFile["name"];

    const callback = (info: JSON) => {
      const documentId = info["id"];
      const documentCategory = this.findDocumentCategory(DocumentCategory.PHOTO_PROOF);

      const documentInfo = {
        applicationId: this.applicationId,
        applicantId: applicantId,
        documentImageId: documentId,
        documentType: "",
        documentCategory: documentCategory
      };

      this.uploadToOmni(documentInfo, 2, slider);
    };

    this.uploadToMongo(modifiedFile, callback);
  
  }
  
  /************************
  * Id Proof Chooser
  ************************/
  setIdProof(files: any) {

    console.log("setIdProof files", files);

    if(this.isMobile) {
      this.idProofDoc[this.applicantIndex] = files;
      this.idProofFileName[this.applicantIndex] = (<any>window).Ionic.WebView.convertFileSrc(this.idProofDoc[this.applicantIndex]);
      this.idProofFileSize[this.applicantIndex] = "";
      return;
    }
    
    console.log("files: ", files.item(0));
    this.idProofDoc[this.applicantIndex] = files.item(0);
    this.idProofFileName[this.applicantIndex] = this.idProofDoc[this.applicantIndex]["name"];
    this.idProofFileSize[this.applicantIndex] = this.getFileSize(this.idProofDoc[this.applicantIndex]["size"]);
  }

  /************************
  * Id Proof Next(Submit)
  ************************/
  handleIdProof(slider) {
    const tabIndex = 3;

    if (!this.idProofDoc[this.applicantIndex]) {
      // this.goToNextSlide(slider);
      this.tabSwitch(tabIndex);
      return;
    }

    console.log("handleIdProof isMobile", this.isMobile);
    
    if(this.isMobile) {
      const documentCategory = this.findDocumentCategory("ID Proof");

      this.sendImgProof(this.idProofDoc[this.applicantIndex], tabIndex, slider, documentCategory, this.selectedIdProof[this.applicantIndex].value);
      return;
    }

    
    const applicantId = this.qde.application.applicants[this.applicantIndex].applicantId.toString();
    //this.progress = this.idProofDoc["progress"];

    const modifiedFile = Object.defineProperty(this.idProofDoc[this.applicantIndex], "name", {
      writable: true,
      value: this.idProofDoc[this.applicantIndex]["name"]
    });
    modifiedFile["name"] = this.applicationId + "-" + applicantId + "-" + new Date().getTime() + "-" + modifiedFile["name"];

    const callback = (info: JSON) => {
      const documentId = info["id"];
      const documentCategory = this.findDocumentCategory(DocumentCategory.ID_PROOF);

      const documentInfo = {
        applicationId: this.applicationId,
        applicantId: applicantId,
        documentImageId: documentId,
        documentType: this.selectedIdProof[this.applicantIndex]['value'],
        documentCategory: documentCategory
      };

      this.uploadToOmni(documentInfo, tabIndex, slider);
    };

    this.uploadToMongo(modifiedFile, callback);
  }


  sendImgProof(image, tabIndex, slider, documentCategory, docType){

    const applicantId = this.qde.application.applicants[this.applicantIndex].applicantId.toString();

    let fileName = this.qde.application.applicationId + "-" + applicantId + "-" + new Date().getTime()

    this.qdeHttp.uploadFile(fileName, image).then((data) => {
      
      if(data["responseCode"] == 200) {

        var result = JSON.parse(data["response"]);

        var imageId = result.info.id;

        console.log("imageId",imageId);


        const documentId = imageId;
  
        const documentInfo = {
          applicationId: this.applicationId,
          applicantId: applicantId,
          documentImageId: documentId,
          documentType: docType,
          documentCategory: documentCategory
        };

        this.uploadToOmni(documentInfo, tabIndex, slider);

      } else {
        // Throw Invalid Pan Error
        alert(JSON.parse(data["response"]));
      }
    });
  }

  /************************
  * Address Proof Chooser
  ************************/
  setAddressProof(files: any) {


    if(this.isMobile) {
      this.addressProofDoc[this.applicantIndex] = files;
      this.addressProofFileName[this.applicantIndex] = (<any>window).Ionic.WebView.convertFileSrc(this.addressProofDoc);
      this.addressProofFileSize[this.applicantIndex] = "";
      return;
    }


    this.addressProofDoc[this.applicantIndex] = files.item(0);
    this.addressProofFileName[this.applicantIndex] = this.addressProofDoc[this.applicantIndex]["name"];

    this.addressProofFileSize[this.applicantIndex] = this.getFileSize(this.addressProofDoc[this.applicantIndex]["size"]);
  }

  /************************
  * Address Proof Upload
  ************************/
  handleAddressProof(slider) {
    const tabIndex = 4;
    
    if (!this.addressProofDoc[this.applicantIndex]) {
      this.goToNextSlide(slider);
      this.tabSwitch(tabIndex);
      return;
    }

    if(this.isMobile) {
      const documentCategory = this.findDocumentCategory("Address Proof");

      this.sendImgProof(this.addressProofDoc[this.applicantIndex], tabIndex, slider, documentCategory, this.selectedAddressProof[this.applicantIndex].value);
      return;
    }

    const applicantId = this.qde.application.applicants[this.applicantIndex].applicantId.toString();

    let modifiedFile = Object.defineProperty(this.addressProofDoc[this.applicantIndex], "name", {
      writable: true,
      value: this.addressProofDoc[this.applicantIndex]["name"]
    });
    modifiedFile["name"] = this.applicationId + "-" + applicantId + "-" + new Date().getTime() + "-" + modifiedFile["name"];

    const callback = (info: JSON) => {
      const documentId = info["id"];
      const documentCategory = this.findDocumentCategory(DocumentCategory.ADDRESS_PROOF);

      const documentInfo = {
        applicationId: this.applicationId,
        applicantId: applicantId,
        documentImageId: documentId,
        documentType: this.selectedAddressProof[this.applicantIndex]['value'],
        documentCategory: documentCategory
      };

      this.uploadToOmni(documentInfo, tabIndex, slider);
    };

    this.uploadToMongo(modifiedFile, callback);
  }

  /**********************
  * Income Proof Chooser
  **********************/
  setIncomeProof(files: any) {
     if(this.isMobile) {
      this.incomeProofDoc[this.applicantIndex] = files;
      this.incomeProofFileName[this.applicantIndex] = (<any>window).Ionic.WebView.convertFileSrc(this.incomeProofDoc);
      this.incomeProofFileSize[this.applicantIndex] = "";
      return;
    }

    this.incomeProofDoc[this.applicantIndex] = files.item(0);
    this.incomeProofFileName[this.applicantIndex] = this.incomeProofDoc[this.applicantIndex]["name"];

    this.incomeProofFileSize[this.applicantIndex] = this.getFileSize(this.incomeProofDoc[this.applicantIndex]["size"]);
  }

  /***************************
  * Income Proof Next(Submit)
  ***************************/
  handleIncomeProof(slider) {
    const tabIndex = 5;

    if (!this.incomeProofDoc[this.applicantIndex]) {
      this.goToNextSlide(slider);
      this.tabSwitch(tabIndex);
      return;
    }

    if(this.isMobile) {
      const documentCategory = this.findDocumentCategory("Income Document");

      this.sendImgProof(this.incomeProofDoc[this.applicantIndex], tabIndex, slider, documentCategory, this.selectedIncomeProof[this.applicantIndex].value);
      return;
    }


    const applicantId = this.qde.application.applicants[this.applicantIndex].applicantId.toString();

    let modifiedFile = Object.defineProperty(this.incomeProofDoc[this.applicantIndex], "name", {
      writable: true,
      value: this.incomeProofDoc[this.applicantIndex]["name"]
    });
    modifiedFile["name"] =
      this.applicationId +
      "-" +
      applicantId +
      "-" +
      new Date().getTime() +
      "-" +
      modifiedFile["name"];

    const callback = (info: JSON) => {
      const documentId = info["id"];
      const documentCategory = this.findDocumentCategory(DocumentCategory.INCOME_PROOF);

      const documentInfo = {
        applicationId: this.applicationId,
        applicantId: applicantId,
        documentImageId: documentId,
        documentType: this.selectedIncomeProof[this.applicantIndex]['value'],
        documentCategory: documentCategory
      };

      this.uploadToOmni(documentInfo, tabIndex, slider);
    };

    this.uploadToMongo(modifiedFile, callback);
  }

  /***************************
  * Banking Proof Chooser
  ***************************/
  setBankingProof(files: any) {
     if(this.isMobile) {
      this.bankingProofDoc[this.applicantIndex] = files;
      this.bankProofFileName[this.applicantIndex] = (<any>window).Ionic.WebView.convertFileSrc(this.bankingProofDoc);
      this.bankProofFileSize[this.applicantIndex] = "";
      return;
    }
    this.bankingProofDoc[this.applicantIndex] = files.item(0);
    this.bankProofFileName[this.applicantIndex] = this.bankingProofDoc[this.applicantIndex]["name"];

    this.bankProofFileSize[this.applicantIndex] = this.getFileSize(this.bankingProofDoc[this.applicantIndex]["size"]);
  }

  /****************************
  * Banking Proof Next(Submit)
  ****************************/
  handleBankingProof(slider) {
    const tabIndex = 6;

    if (!this.bankingProofDoc[this.applicantIndex]) {
      this.goToNextSlide(slider);
      this.tabSwitch(tabIndex);
      return;
    }
    
    if(this.isMobile) {
      const documentCategory = this.findDocumentCategory("Banking");
      this.sendImgProof(this.bankingProofDoc[this.applicantIndex], tabIndex, slider, documentCategory, this.selectedBankProof[this.applicantIndex].value);
      return;
    }

    const applicantId = this.qde.application.applicants[this.applicantIndex].applicantId.toString();

    let modifiedFile = Object.defineProperty(this.bankingProofDoc[this.applicantIndex], "name", {
      writable: true,
      value: this.bankingProofDoc[this.applicantIndex]["name"]
    });
    modifiedFile["name"] =
      this.applicationId +
      "-" +
      applicantId +
      "-" +
      new Date().getTime() +
      "-" +
      modifiedFile["name"];

    const callback = (info: JSON) => {
      const documentId = info["id"];
      const documentCategory = this.findDocumentCategory(DocumentCategory.BANK_PROOF);

      const documentInfo = {
        applicationId: this.applicationId,
        applicantId: applicantId,
        documentImageId: documentId,
        documentType: this.selectedBankProof[this.applicantIndex]['value'],
        documentCategory: documentCategory
      };

      this.uploadToOmni(documentInfo, tabIndex, slider);
    };

    this.uploadToMongo(modifiedFile, callback);
  }

  /***************************
  * Collateral Proof Chooser
  ***************************/
  setCollateralProof(files: any) {

    if(this.isMobile) {
      this.collateralProofDoc[this.applicantIndex] = files;
      this.collateralProofFileName[this.applicantIndex] = (<any>window).Ionic.WebView.convertFileSrc(this.collateralProofDoc);
      this.collateralProofFileSize[this.applicantIndex] = "";
      return;
    }

    this.collateralProofDoc[this.applicantIndex] = files.item(0);
    this.collateralProofFileName[this.applicantIndex] = this.collateralProofDoc[this.applicantIndex]["name"];

    this.collateralProofFileSize[this.applicantIndex] = this.getFileSize(this.collateralProofDoc[this.applicantIndex]["size"]);
  }

  /*******************************
  * Collateral Proof Next(Submit)
  *******************************/
  handleCollateralProof(slider) {
        
    // this.qdeHttp.apsApi(""+this.applicationId).subscribe(res => {
    //   console.log("res APS: ", res);
    // });
    
    // const tabIndex = 7;

    if (!this.collateralProofDoc[this.applicantIndex]) {
      // this.goToNextSlide(slider);
      // this.tabSwitch(tabIndex);
      return;
    }

    if(this.isMobile) {
      const documentCategory = this.findDocumentCategory("Collateral");

      this.sendImgProof(this.collateralProofDoc[this.applicantIndex], 0, slider, documentCategory, this.selectedCollateralProof[this.applicantIndex].value);
      return;
    }

    const applicantId = this.qde.application.applicants[this.applicantIndex].applicantId.toString();

    let modifiedFile = Object.defineProperty(this.collateralProofDoc[this.applicantIndex], "name", {
      writable: true,
      value: this.collateralProofDoc[this.applicantIndex]["name"]
    });
    modifiedFile["name"] =
      this.applicationId +
      "-" +
      applicantId +
      "-" +
      new Date().getTime() +
      "-" +
      modifiedFile["name"];

    const callback = (info: JSON) => {
      const documentId = info["id"];
      const documentCategory = this.findDocumentCategory(DocumentCategory.COLLATERAL_PROOF);

      const documentInfo = {
        applicationId: this.applicationId,
        applicantId: applicantId,
        documentImageId: documentId,
        documentType: this.selectedCollateralProof[this.applicantIndex]['value'],
        documentCategory: documentCategory
      };

      this.uploadToOmni(documentInfo, 7, "collateral");
    };

    this.uploadToMongo(modifiedFile, callback);
  }

  uploadToMongo(file: File, callback: any) {
    this.qdeHttp.uploadToAppiyoDrive(file).subscribe(
      response => {
        if (response["ok"]) {
          //this.progress = Math.round(100 * event.loaded / event.total);
          //console.log(response);
          callback(response["info"]);
        } else {
          console.log(alert["message"]);
        }
      },
      error => {
        console.log("Error : ", error);
        alert(error.error.message);
      }
    );
  }

  uploadToOmni(documentInfo: any, tabIndex: number, slider) {
    this.qdeHttp.uploadToOmni(documentInfo).subscribe(
      response => {
        if (
          response["Error"] === "0" &&
          response["ProcessVariables"]["status"]
        ) {
          //alert("Uploaded Successfully!");
          this.cameraImage = "";

          if(slider == "collateral") {
            alert("Document submitted successfully");
            return;
          }
          if (slider) {
            this.goToNextSlide(slider);
          }

          this.tabSwitch(tabIndex); // Need to be enabled for tab switch
        } else {
          if (response["ErrorMessage"]) {
            console.log("Response: " + response["ErrorMessage"]);
          } else if (response["ProcessVariables"]["errorMessage"]) {
            console.log(
              "Response: " + response["ProcessVariables"]["errorMessage"]
            );
          }
        }
      },
      error => {
        console.log("Error : ", error);
      }
    );
  }

  getApplicableDocuments(data: any, documents: Array<any>, index: number) {

    this.qdeHttp.getApplicableDocuments(data).subscribe(
      response => {
        const processVariables = response["ProcessVariables"];
        if (response["Error"] === "0" && processVariables["status"]) {
          console.log(response);

          const res = JSON.parse(processVariables["response"]);

          /******************************
          * Default Values for dropdowns
          ******************************/
          this.idProofDocumnetType = res.IdProof || [];
          this.selectedIdProof.push(this.idProofDocumnetType[0]);

          this.addressProofDocumnetType = res.AddressProof || [];
          this.selectedAddressProof.push(this.addressProofDocumnetType[0]);

          this.incomeProofDocumnetType = res.IncomeDocument || [];
          this.selectedIncomeProof.push(this.incomeProofDocumnetType[0]);

          this.bankProofDocumnetType = res.Banking || [];
          this.selectedBankProof.push(this.bankProofDocumnetType[0]);

          this.collateralProofDocumnetType = res.PropertyPapers || [];
          this.selectedCollateralProof.push(this.collateralProofDocumnetType[0]);

          /******************************************
          * It will load Documents of all Applicants
          ******************************************/
          this.loadDocuments(documents, index);
        } else {

          if (response["ErrorMessage"]) {
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

  // onSelectApplicant(tabIndex?: number, isMainApplicant?: boolean) {
  //   this.isMainApplicant = isMainApplicant;
  //   this.tabSwitch(tabIndex);
  // }

  getFileSize(size: any) {
    size = size / 1024;

    let isMegaByte = false;
    if (size >= 1024) {
      size = size / 1024;
      isMegaByte = true;
    }

    let fileSize: string;
    if (isMegaByte) {
      fileSize = size.toFixed(2) + " MB";
    } else {
      fileSize = size.toFixed(2) + " KB";
    }

    return fileSize;
  }

  openCamera(screen) {

    let screenName = screen;
    console.log("screenName", screenName);
    this.qdeHttp.takePicture().then((imageURI) => {
      console.log("imageData", imageURI + screenName);
      this[screenName](imageURI);
      this.cameraImage = (<any>window).Ionic.WebView.convertFileSrc(imageURI);
     }, (err) => {
      // Handle error
     });
  }

  ngOnDestroy() {
    if(this.getQdeDataSub != null) {
      this.getQdeDataSub.unsubscribe();
    }
  }

  selectAnApplicant(applicationId, mainApplicantId, index) {
    this.applicantIndex = index;
    this.isTabDisabled = false;
    console.log("idProofDocumnetType: ", this.idProofDocumnetType);
    this.router.navigate(['/document-uploads/'+applicationId+'/applicant/'+mainApplicantId], {fragment: "aadhar1"});
  }

  // selectAnApplicant(applicationId, mainApplicantId, index) {
    
  //   this.router.navigate(['/document-uploads/'+applicationId+'/co-applicant/'+mainApplicantId], {fragment: "aadhar1"});
  // }

  temp;

  loadDocuments(documents: Array<any>, index: number) {

    for (const document of documents) {
      const docCategory = document["documentCategory"];

      const idProofCategory = this.findDocumentCategory(DocumentCategory.ID_PROOF);
      const addressProofCategory = this.findDocumentCategory(DocumentCategory.ADDRESS_PROOF);
      const incomeProofCategory = this.findDocumentCategory(DocumentCategory.INCOME_PROOF);
      const bankingProofCategory = this.findDocumentCategory(DocumentCategory.BANK_PROOF);
      const collateralProofCategory = this.findDocumentCategory(DocumentCategory.COLLATERAL_PROOF);
      const photoProofCategory = this.findDocumentCategory(DocumentCategory.PHOTO_PROOF);

      if (docCategory == idProofCategory) {
        this.selectedIdProof[index] = this.idProofDocumnetType.find(v => v.value == document["documentType"]);
        this.idProofFileName[index] = document["documentName"];
        this.idProofFileSize[index] = this.getFileSize(document["documentSize"]);
        this.idProofId[index] = this.driveLoc+""+document["documentImageId"];
      } else if (docCategory == addressProofCategory) {
        this.selectedAddressProof[index] = this.addressProofDocumnetType.find(v => v.value == document["documentType"]);
        this.addressProofFileName[index] = document["documentName"];
        this.addressProofFileSize[index] = this.getFileSize(document["documentSize"]);
        this.addressProofId[index] = this.driveLoc+document["documentImageId"];
      } else if (docCategory == incomeProofCategory) {
        this.selectedIncomeProof[index] = this.incomeProofDocumnetType.find(v => v.value == document["documentType"]);
        this.incomeProofFileName[index] = document["documentName"];
        this.incomeProofFileSize[index] = this.getFileSize(document["documentSize"]);
        this.incomeProofId[index] = this.driveLoc+document["documentImageId"];
      } else if (docCategory == bankingProofCategory) {
        this.selectedBankProof[index] = this.bankProofDocumnetType.find(v => v.value == document["documentType"]);
        this.bankProofFileName[index] = document["documentName"];
        this.bankProofFileSize[index] = this.getFileSize(document["documentSize"]);
        this.bankProofId[index] = this.driveLoc+document["documentImageId"];
      } else if (docCategory == collateralProofCategory) {
        this.selectedCollateralProof[index] = this.collateralProofDocumnetType.find(v => v.value == document["documentType"]);
        this.collateralProofFileName[index] = document["documentName"];
        this.collateralProofFileSize[index] = this.getFileSize(document["documentSize"]);
        this.collateralProofId[index] = this.driveLoc+document["documentImageId"];
      } else if (docCategory == photoProofCategory) {
        this.photoProofFileName[index] = document["documentName"];
        this.photoProofFileSize[index] = this.getFileSize(document["documentSize"]);
        this.photoProofId[index] = this.driveLoc + document["documentImageId"];
      }
    }
  }

  openLink(url) {
    window.open(url, '_blank');
  }
}