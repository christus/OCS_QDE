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

  documentCategory: any;
  collateralType: any;

  fileName: string;
  fileSize: string;
  progress: string;

  idProofDocumnetType: any;
  idProofFileName: string;
  idProofFileSize: string;
  idProofId: string;
  idProofDoc: File;

  addressProofDocumnetType: any;
  addressProofFileName: string;
  addressProofFileSize: string;
  addressProofId: string;
  addressProofDoc: File;

  incomeProofDocumnetType: any;
  incomeProofFileName: string;
  incomeProofFileSize: string;
  incomeProofId:string;
  incomeProofDoc: File;

  bankProofDocumnetType: any;
  bankProofFileName: string;
  bankProofFileSize: string;
  bankProofId:string;
  bankingProofDoc: File;

  collateralProofDocumnetType: any;
  collateralProofFileName: string;
  collateralProofFileSize: string;
  collateralProofId:string;
  collateralProofDoc: File;

  photoProofFileName: string;
  photoProofFileSize: string;
  photoProofId:string;
  photoProofDoc: File;

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
      this.applicationId = parseInt(val);
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
      if (params.applicationId) {
        // setQde(JSON.parse(response.ProcessVariables.response));
      } else {
        this.qde = this.qdeService.getQde();
      }


      if(params['applicationId'] != null) {
        if(this.isEligibilityForReviewsSub != null) {
          this.isEligibilityForReviewsSub.unsubscribe();
        }
        this.isEligibilityForReviewsSub = this.cds.isEligibilityForReviews.subscribe(val => {
          this.isEligibilityForReview = val.find(v => v.applicationId == params['applicationId'])['isEligibilityForReview'];
        });
      }
    });

    this.cds.isTBMLoggedIn.subscribe(val => {
      this.isTBMLoggedIn = val;
    });

    this.route.fragment.subscribe(fragment => {

      this.tabSwitch(0);

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
            this.applicationId = parseInt(this.qde.application.applicationId, 10);
          }
          const applicants = this.qde.application.applicants;
          for (const applicant of applicants) {
            const applicantId = applicant["applicantId"];
            const driveLoc = environment.host + environment.driveLocation;
          
            if (applicantId == this.currentApplicantId) {

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
              this.getApplicableDocuments(data);

              const documents = applicant["documents"];

              for (const document of documents) {
                const docCategory = document["documentCategory"];

                const idProofCategory = this.findDocumentCategory(DocumentCategory.ID_PROOF);
                const addressProofCategory = this.findDocumentCategory(DocumentCategory.ADDRESS_PROOF);
                const incomeProofCategory = this.findDocumentCategory(DocumentCategory.INCOME_PROOF);
                const bankingProofCategory = this.findDocumentCategory(DocumentCategory.BANK_PROOF);
                const collateralProofCategory = this.findDocumentCategory(DocumentCategory.COLLATERAL_PROOF);
                const photoProofCategory = this.findDocumentCategory(DocumentCategory.PHOTO_PROOF);

                if (docCategory == idProofCategory) {
                  this.selectedIdProof = document["documentType"];
                  this.idProofFileName = document["documentName"];
                  this.idProofFileSize = this.getFileSize(
                    document["documentSize"]
                  );
                  this.idProofId = driveLoc+""+document["documentImageId"];
                  console.log("idProofId", this.idProofId);
                } else if (docCategory == addressProofCategory) {
                  this.selectedAddressProof = document["documentType"];
                  this.addressProofFileName = document["documentName"];
                  this.addressProofFileSize = this.getFileSize(
                    document["documentSize"]
                  );
                  this.addressProofId = driveLoc+document["documentImageId"];
                } else if (docCategory == incomeProofCategory) {
                  this.selectedIncomeProof = document["documentType"];
                  this.incomeProofFileName = document["documentName"];
                  this.incomeProofFileSize = this.getFileSize(
                    document["documentSize"]
                  );
                  this.incomeProofId = driveLoc+document["documentImageId"];
                } else if (docCategory == bankingProofCategory) {
                  this.selectedBankProof = document["documentType"];
                  this.bankProofFileName = document["documentName"];
                  this.bankProofFileSize = this.getFileSize(
                    document["documentSize"]
                  );
                  this.bankProofId = driveLoc+document["documentImageId"];
                } else if (docCategory == collateralProofCategory) {
                  this.selectedCollateralProof = document["documentType"];
                  this.collateralProofFileName = document["documentName"];
                  this.collateralProofFileSize = this.getFileSize(
                    document["documentSize"]
                  );
                  this.collateralProofId = driveLoc+document["documentImageId"];
                } else if (docCategory == photoProofCategory) {
                  this.photoProofFileName = document["documentName"];
                  this.photoProofFileSize = this.getFileSize(document["documentSize"]);
		  this.photoProofId = driveLoc + document["documentImageId"];
                }
              }
            }

            if (applicant["isMainApplicant"]) {
              this.mainApplicantId = applicantId;
            } else {

              if (applicants.length - 1 === this.coApplicants.length) {

              } else {
                this.coApplicants.push(applicant);
              }
              
            }
          }

          this.qdeService.setQde(this.qde);
        });
      } else {
        this.qde = this.qdeService.getQde();
      }
    });

    /********************************************************************
    * Check for User and set isReadOnly=true to disable editing of fields
    ********************************************************************/
    // if(some condition) {
    //   this.isReadOnly
    // this.options.readOnly = this.isReadOnly;
    // }
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

  setCustomerPhoto(files: any) {
    if(this.isMobile) {
      this.photoProofDoc = files;
      this.photoProofFileName = (<any>window).Ionic.WebView.convertFileSrc(this.photoProofDoc);
      this.photoProofFileSize = "";
      return;
    }

    this.photoProofDoc = files.item(0);
    this.photoProofFileName = this.photoProofDoc["name"];

    this.photoProofFileSize = this.getFileSize(this.photoProofDoc["size"]);
  }

  handleCustomerPhoto(slider) {

    const tabIndex = 2;
    
    if (!this.photoProofDoc) {
      this.goToNextSlide(slider);
      this.tabSwitch(tabIndex);
      return;
    }

    if(this.isMobile) {
      const documentCategory = this.findDocumentCategory("Photo");

      this.sendImgProof(this.photoProofDoc, tabIndex,slider, documentCategory, "");
      return;
    }

    const applicantId = this.currentApplicantId.toString();

    let modifiedFile = Object.defineProperty(this.photoProofDoc, "name", {
      writable: true,
      value: this.photoProofDoc["name"]
    });
    modifiedFile["name"] = this.applicationId + "-" + applicantId + "-" + new Date().getTime() + "-" + modifiedFile["name"];

    const callback = (info: JSON) => {
      const documentId = info["id"];
      const documentCategory = this.findDocumentCategory(DocumentCategory.PHOTO_PROOF);

      const documentInfo = {
        applicationId: this.applicationIdAsString,
        applicantId: applicantId,
        documentImageId: documentId,
        documentType: "",
        documentCategory: documentCategory
      };

      this.uploadToOmni(documentInfo, 2, slider);
    };

    this.uploadToMongo(modifiedFile, callback);
  
  }
  
  setIdProof(files: any) {

    console.log("setIdProof files", files);

    if(this.isMobile) {
      this.idProofDoc = files;
      this.idProofFileName = (<any>window).Ionic.WebView.convertFileSrc(this.idProofDoc);
      this.idProofFileSize = "";
      return;
    }
    
    this.idProofDoc = files.item(0);
    this.idProofFileName = this.idProofDoc["name"];
    this.idProofFileSize = this.getFileSize(this.idProofDoc["size"]);
    
  }

  handleIdProof(slider) {
    const tabIndex = 3;

    if (!this.idProofDoc) {
      this.goToNextSlide(slider);
      this.tabSwitch(tabIndex);
      return;
    }

    console.log("handleIdProof isMobile", this.isMobile);
    
    if(this.isMobile) {
      const documentCategory = this.findDocumentCategory("ID Proof");

      this.sendImgProof(this.idProofDoc, tabIndex, slider, documentCategory, this.selectedIdProof);
      return;
    }

    
    const applicantId = this.currentApplicantId.toString();
    //this.progress = this.idProofDoc["progress"];

    const modifiedFile = Object.defineProperty(this.idProofDoc, "name", {
      writable: true,
      value: this.idProofDoc["name"]
    });
    modifiedFile["name"] = this.applicationId + "-" + applicantId + "-" + new Date().getTime() + "-" + modifiedFile["name"];

    const callback = (info: JSON) => {
      const documentId = info["id"];
      const documentCategory = this.findDocumentCategory(DocumentCategory.ID_PROOF);

      const documentInfo = {
        applicationId: this.applicationIdAsString,
        applicantId: applicantId,
        documentImageId: documentId,
        documentType: this.selectedIdProof,
        documentCategory: documentCategory
      };

      this.uploadToOmni(documentInfo, tabIndex, slider);
    };

    this.uploadToMongo(modifiedFile, callback);
  }


  sendImgProof(image, tabIndex, slider, documentCategory, docType){

    const applicantId = this.currentApplicantId.toString();

    let fileName = this.qde.application.applicationId + "-" + applicantId + "-" + new Date().getTime()

    this.qdeHttp.uploadFile(fileName, image).then((data) => {
      
      if(data["responseCode"] == 200) {

        var result = JSON.parse(data["response"]);

        var imageId = result.info.id;

        console.log("imageId",imageId);


        const documentId = imageId;
  
        const documentInfo = {
          applicationId: this.applicationIdAsString,
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

  setAddressProof(files: any) {


    if(this.isMobile) {
      this.addressProofDoc = files;
      this.addressProofFileName = (<any>window).Ionic.WebView.convertFileSrc(this.addressProofDoc);
      this.addressProofFileSize = "";
      return;
    }


    this.addressProofDoc = files.item(0);
    this.addressProofFileName = this.addressProofDoc["name"];

    this.addressProofFileSize = this.getFileSize(this.addressProofDoc["size"]);
  }

  handleAddressProof(slider) {
    const tabIndex = 4;
    
    if (!this.addressProofDoc) {
      this.goToNextSlide(slider);
      this.tabSwitch(tabIndex);
      return;
    }

    if(this.isMobile) {
      const documentCategory = this.findDocumentCategory("Address Proof");

      this.sendImgProof(this.addressProofDoc, tabIndex, slider, documentCategory, this.selectedAddressProof);
      return;
    }

    const applicantId = this.currentApplicantId.toString();

    let modifiedFile = Object.defineProperty(this.addressProofDoc, "name", {
      writable: true,
      value: this.addressProofDoc["name"]
    });
    modifiedFile["name"] = this.applicationId + "-" + applicantId + "-" + new Date().getTime() + "-" + modifiedFile["name"];

    const callback = (info: JSON) => {
      const documentId = info["id"];
      const documentCategory = this.findDocumentCategory(DocumentCategory.ADDRESS_PROOF);

      const documentInfo = {
        applicationId: this.applicationIdAsString,
        applicantId: applicantId,
        documentImageId: documentId,
        documentType: this.selectedAddressProof,
        documentCategory: documentCategory
      };

      this.uploadToOmni(documentInfo, tabIndex, slider);
    };

    this.uploadToMongo(modifiedFile, callback);
  }

  setIncomeProof(files: any) {
     if(this.isMobile) {
      this.incomeProofDoc = files;
      this.incomeProofFileName = (<any>window).Ionic.WebView.convertFileSrc(this.incomeProofDoc);
      this.incomeProofFileSize = "";
      return;
    }

    this.incomeProofDoc = files.item(0);
    this.incomeProofFileName = this.incomeProofDoc["name"];

    this.incomeProofFileSize = this.getFileSize(this.incomeProofDoc["size"]);
  }

  handleIncomeProof(slider) {
    const tabIndex = 5;

    if (!this.incomeProofDoc) {
      this.goToNextSlide(slider);
      this.tabSwitch(tabIndex);
      return;
    }

    if(this.isMobile) {
      const documentCategory = this.findDocumentCategory("Income Document");

      this.sendImgProof(this.incomeProofDoc, tabIndex, slider, documentCategory, this.selectedIncomeProof);
      return;
    }


    const applicantId = this.currentApplicantId.toString();

    let modifiedFile = Object.defineProperty(this.incomeProofDoc, "name", {
      writable: true,
      value: this.incomeProofDoc["name"]
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
        applicationId: this.applicationIdAsString,
        applicantId: applicantId,
        documentImageId: documentId,
        documentType: this.selectedIncomeProof,
        documentCategory: documentCategory
      };

      this.uploadToOmni(documentInfo, tabIndex, slider);
    };

    this.uploadToMongo(modifiedFile, callback);
  }

  setBankingProof(files: any) {
     if(this.isMobile) {
      this.bankingProofDoc = files;
      this.bankProofFileName = (<any>window).Ionic.WebView.convertFileSrc(this.bankingProofDoc);
      this.bankProofFileSize = "";
      return;
    }
    this.bankingProofDoc = files.item(0);
    this.bankProofFileName = this.bankingProofDoc["name"];

    this.bankProofFileSize = this.getFileSize(this.bankingProofDoc["size"]);
  }

  handleBankingProof(slider) {
    const tabIndex = 6;

    if (!this.bankingProofDoc) {
      this.goToNextSlide(slider);
      this.tabSwitch(tabIndex);
      return;
    }
    
    if(this.isMobile) {
      const documentCategory = this.findDocumentCategory("Banking");
      this.sendImgProof(this.bankingProofDoc, tabIndex, slider, documentCategory, this.selectedBankProof);
      return;
    }

    const applicantId = this.currentApplicantId.toString();

    let modifiedFile = Object.defineProperty(this.bankingProofDoc, "name", {
      writable: true,
      value: this.bankingProofDoc["name"]
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
        applicationId: this.applicationIdAsString,
        applicantId: applicantId,
        documentImageId: documentId,
        documentType: this.selectedBankProof,
        documentCategory: documentCategory
      };

      this.uploadToOmni(documentInfo, tabIndex, slider);
    };

    this.uploadToMongo(modifiedFile, callback);
  }

  setCollateralProof(files: any) {
    
    if(this.isMobile) {
      this.collateralProofDoc = files;
      this.collateralProofFileName = (<any>window).Ionic.WebView.convertFileSrc(this.collateralProofDoc);
      this.collateralProofFileSize = "";
      return;
    }

    this.collateralProofDoc = files.item(0);
    this.collateralProofFileName = this.collateralProofDoc["name"];

    this.collateralProofFileSize = this.getFileSize(this.collateralProofDoc["size"]);
  }

  handleCollateralProof(slider) {
        
    // this.qdeHttp.apsApi(""+this.applicationId).subscribe(res => {
    //   console.log("res APS: ", res);
    // });
    
    // const tabIndex = 7;

    if (!this.collateralProofDoc) {
      //this.goToNextSlide(slider);
      // this.tabSwitch(tabIndex);
      alert("Documents successfully submitted");
      return;
    }

    if(this.isMobile) {
      const documentCategory = this.findDocumentCategory("Collateral");

      this.sendImgProof(this.collateralProofDoc, 0, slider, documentCategory, this.selectedCollateralProof);
      return;
    }

    const applicantId = this.currentApplicantId.toString();

    let modifiedFile = Object.defineProperty(this.collateralProofDoc, "name", {
      writable: true,
      value: this.collateralProofDoc["name"]
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
        applicationId: this.applicationIdAsString,
        applicantId: applicantId,
        documentImageId: documentId,
        documentType: this.selectedCollateralProof,
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
          console.log(response["ErrorMessage"]);
        }
      },
      error => {
        console.log("Error : ", error);
        alert(error.statusText);
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
            alert("Documents successfully submitted");
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

  getApplicableDocuments(data: any) {

    this.qdeHttp.getApplicableDocuments(data).subscribe(
      response => {
        const processVariables = response["ProcessVariables"];
        if (response["Error"] === "0" && processVariables["status"]) {
          console.log(response);

          const res = JSON.parse(processVariables["response"]);
          this.idProofDocumnetType = res.IdProof || [];
          this.addressProofDocumnetType = res.AddressProof || [];
          this.incomeProofDocumnetType = res.IncomeDocument || [];
          this.bankProofDocumnetType = res.Banking || [];
          this.collateralProofDocumnetType = res.PropertyPapers || [];

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

  onSelectApplicant(tabIndex?: number, isMainApplicant?: boolean) {
    this.isMainApplicant = isMainApplicant;
    this.tabSwitch(tabIndex);
  }

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

  ngOnDestroy(): void {}

  selectApplicant(applicationId, mainApplicantId, index) {
      this.router.navigate(['/document-uploads/'+applicationId+'/applicant/'+mainApplicantId], {fragment: "aadhar1"});
  }

  selectCoApplicant(applicationId, mainApplicantId, index) {
    this.router.navigate(['/document-uploads/'+applicationId+'/co-applicant/'+mainApplicantId], {fragment: "aadhar1"});
  }

  temp;
}
