import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MobileService } from './../../services/mobile-constant.service';
import { environment } from 'src/environments/environment';
import { Component, OnInit,  ViewChild, ElementRef, Renderer2, AfterViewInit, HostListener, ViewChildren, QueryList } from '@angular/core';

import * as Swiper from "swiper/dist/js/swiper.js";
// import { Select2Component } from 'ng2-select2';
import { ActivatedRoute, Router } from "@angular/router";

import { Options } from "ng5-slider";
import { NgForm } from "@angular/forms";
import { QdeHttpService } from 'src/app/services/qde-http.service';
import { QdeService } from 'src/app/services/qde.service';
import Qde from 'src/app/models/qde.model';

import { CommonDataService } from 'src/app/services/common-data.service';
import { Subscription } from 'rxjs';
import { screenPages } from '../../app.constants';
import { UtilService } from '../../services/util.service';

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
export class DocumentUploadComponent implements OnInit, AfterViewInit {

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

  idProofDocumnetType: Array<Array<Item>> = [];
  idProofFileName: Array<string> = [];
  idProofFileSize: Array<string> = [];
  idProofId: Array<string> = [];
  idProofDoc: Array<File> = [];

  addressProofDocumnetType: Array<Array<Item>> = [];
  addressProofFileName: Array<string> = [];
  addressProofFileSize: Array<string> = [];
  addressProofId: Array<string> = [];
  addressProofDoc: Array<File> = [];

  incomeProofDocumnetType: Array<Array<Item>> = [];
  incomeProofFileName: Array<string> = [];
  incomeProofFileSize: Array<string> = [];
  incomeProofId: Array<string> = [];
  incomeProofDoc: Array<File> = [];

  bankProofDocumnetType: Array<Array<Item>> = [];
  bankProofFileName: Array<string> = [];
  bankProofFileSize: Array<string> = [];
  bankProofId: Array<string> = [];
  bankingProofDoc: Array<File> = [];

  collateralProofDocumnetType: Array<Array<Item>> = [];
  collateralProofFileName: Array<string> = [];
  collateralProofFileSize: Array<string> = [];
  collateralProofId: Array<string> = [];
  collateralProofDoc: Array<File> = [];
  isDocUploadRouteModal: boolean = false;

  qde: Qde;

  fragments = [
    "dashboard",
    "customerproof",
    "idproof",
    "addressproof",
    "incomeproof",
    "bankingproof",
    "collateralproof"
  ];

  isReadOnly: boolean = false;
  isEligibilityForReview: boolean = false;
  isEligibilityForReviewsSub: Subscription;
  isTBMLoggedIn: boolean;
  isTabDisabled: boolean = true;
  driveLoc: any;
  getQdeDataSub: Subscription;
  applicantIndex: number = 0;
  applicantId: string;

    // Only RHS Sliders
  @ViewChildren('swiperS') swiperS$: QueryList<Swiper>;
  swiperSliders: Array<Swiper> = [];
  swiperSlidersSub: Subscription;

  tabName: string;
  page: number;
  auditTrialApiSub: Subscription;
  fragmentSub: Subscription;

  isErrorModal:boolean;
  errorMessage:string;

  isSubmitDisabled: boolean = true;
  
  previousUrl: string;

  lovs: Array<string>;

  public defaultItem = environment.defaultItem;

  constructor(
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private router: Router,
    private qdeHttp: QdeHttpService,
    private qdeService: QdeService,
    private utilService: UtilService,
    private cds: CommonDataService,
    private mobileService: MobileService,
    private ngxService: NgxUiLoaderService) {

    this.qde = this.qdeService.defaultValue;

      this.cds.changeMenuBarShown(true);
      this.cds.changeViewFormVisible(true);
      this.cds.changeLogoutVisible(true);
      this.cds.changeHomeVisible(true);

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
      this.isReadOnly = false;
      this.options.readOnly = false;
    });
  }

  ngOnInit() {

    this.isMobile = this.mobileService.isMobile;

    console.log("isMovile onInit", this.isMobile);

    // this.renderer.addClass(this.select2.selector.nativeElement, 'js-select');

    if (this.route.snapshot.data.listOfValues) {
      const lov = JSON.parse(this.route.snapshot.data.listOfValues["ProcessVariables"].lovs);

      console.log("LOVS: ", lov);
      this.lovs = lov;
      this.documentCategory = lov.LOVS.document_category;
    }

    // Check Whether there is qde data to be filled or else Initialize Qde
    this.route.params.subscribe(params => {
      // Make an http request to get the required qde data and set using setQde
      if (params.applicationId != null) {

        this.applicantId = params['applicantId'];
        

          this.getQdeDataSub = this.qdeHttp.getQdeData(params.applicationId).subscribe(response => {
            var result = JSON.parse(response["ProcessVariables"]["response"]);
            this.cds.setStatus(result.application.status);
            this.cds.setactiveTab(screenPages['documentUploads']);
            this.qde = result;

            // Step 1
            this.selectedIdProof = new Array(this.qde.application.applicants.length);
            this.idProofDocumnetType = new Array(this.qde.application.applicants.length);
            this.addressProofDocumnetType = new Array(this.qde.application.applicants.length);
            this.incomeProofDocumnetType = new Array(this.qde.application.applicants.length);
            this.collateralProofDocumnetType = new Array(this.qde.application.applicants.length);

            this.qdeService.setQde(result);
            var butRes = result.application.status;
            this.applicationId = this.qde.application.applicationId;
  
            // if(butRes >= 5) {
            //   this.cds.setIsMainTabEnabled(false);
            // }
            // else{
            //   this.cds.setIsMainTabEnabled(true);
            // }
  
            /***********************************************
            * Check if route is appropriate with Applicants
            * If not then redirect to Dashboard
            ***********************************************/

            if(params.applicantId && this.qde.application.auditTrailDetails.screenPage == screenPages['documentUploads']) {
              if(this.qde.application.auditTrailDetails.applicantId != null) {
                this.goToExactPageAndTab(result.application.auditTrailDetails.tabPage, result.application.auditTrailDetails.pageNumber, true);
              } else {
                this.goToExactPageAndTab(this.tabName, this.page, true);
              }
            } else {
              this.tabSwitch(0);
            }

            // else {
            //   this.tabSwitch(0);
            // }
  
            if(result != null) {
              this.applicantIndex = result.application.applicants.findIndex(v => v.applicantId == this.applicantId);
            }
  
            const applicants = this.qde.application.applicants;
  
            this.recurvLovCalls(applicants);

            this.cds.changeApplicationId(this.qde.application.applicationId);
            this.cds.enableTabsIfStatus1(this.qde.application.status);
  
          }, error => {
            this.isErrorModal = true;
            this.errorMessage = "Something went wrong, please try again later.";
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
      if(val) {
        this.qde = val;
      }
    });

    this.cds.isTBMLoggedIn.subscribe(val => {
      this.isTBMLoggedIn = val;
    });

    // this.route.fragment.subscribe(fragment => {

    //   let localFragment = fragment;

    //   if (fragment == null || (!this.fragments.includes(fragment))) {
    //     localFragment = "aadhar";
    //   }

    //   // Replace Fragments in url
    //   if (this.fragments.includes(localFragment)) {
    //     this.tabSwitch(this.fragments.indexOf(localFragment));
    //   }
    // });


    this.fragmentSub = this.route.queryParams.subscribe(val => {

      if(val['tabName'] && val['tabName'] != '') {
        this.tabName = this.fragments.includes(val['tabName']) ? val['tabName'].toString(): this.fragments[0];
        this.activeTab = this.fragments.findIndex(v => v == val['tabName']);

        this.applicantIndividual = (this.activeTab >= 10) ? false: true;
      }

      if(val['page'] && val['page'] != '') {
        this.page = (val && val['page'] != null && parseInt(val['page']) != NaN && parseInt(val['page']) >= 1) ? parseInt(val['page']): 1;
      }

      console.log("Fragment & QueryParams: ", this.tabName, this.page);

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

  valuechange(newValue) {
    console.log(newValue);
    this.value = newValue;
  }

  /**
   * Use to sync between lhs and rhs sliders
   * @param swiperInstance RHS Swiper Instance
   */
  goToNextSlide(swiperInstance: Swiper, form?: NgForm) {
    swiperInstance.nextSlide();
    this.page++;
    this.router.navigate([], {queryParams: { tabName: this.tabName, page: this.page }});
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
    swiperInstance.prevSlide();
    this.page--;
    this.router.navigate([], {queryParams: { tabName: this.tabName, page: this.page }});
  }

  /**
   * Use to sync between lhs and rhs sliders
   * @param swiperInstance LHS Swiper Instance
   */
  slidePrevTransitionStart(swiperInstance: Swiper) {
    swiperInstance.prevSlide();
  }

  tabSwitch(tabIndex?: number, fromQde ?: boolean) {

    let modifiedTabIndex = tabIndex;

    if(modifiedTabIndex == 0) {
      this.isTabDisabled = true;
    } else {
      this.isTabDisabled = false;
    }

    // Check for invalid tabIndex
    // if (tabIndex < this.fragments.length) {

    //   console.log(tabIndex);
    //   this.router.navigate([], { fragment: this.fragments[tabIndex] });

    //   this.activeTab = tabIndex;

    //   if (tabIndex === 9) {
    //     this.applicantIndividual = false;
    //   } else if (tabIndex === 0) {
    //     this.applicantIndividual = true;
    //   }
    // }

    let t = fromQde ? this.page: 1;

    // Any applicant should not land on banking if income consider is No
    if(modifiedTabIndex == 5) {
      if(this.qde.application.applicants[this.applicantIndex].incomeDetails.incomeConsider == false) {
        modifiedTabIndex++;
      }
    }

    if(modifiedTabIndex == 6) {
      this.qdeHttp.mandatoryDocsApi(parseInt(this.applicationId)).subscribe(res => {
        if(res['ProcessVariables']['status']) {
          this.isSubmitDisabled = false;
        } else {
          this.isSubmitDisabled = true;
          this.isErrorModal = true;
          this.errorMessage = res['ProcessVariables']['description'];
        }
      },
      err => {
        this.isSubmitDisabled=true;
        this.isErrorModal=true;
        this.errorMessage = 'Something went wrong.';
      });
    }

    if(this.swiperSliders && this.swiperSliders.length > 0) {
      this.swiperSliders[modifiedTabIndex].setIndex(t-1);
    }

    // Check for invalid tabIndex
    if(modifiedTabIndex < this.fragments.length) {
      if(modifiedTabIndex == 0) {
        this.router.navigate(['/document-uploads/'+this.applicationId], {queryParams: {tabName: this.fragments[0], page: 1}});
      } else {
        // if(fromQde) {
        //   // this.router.navigate(['/document-uploads/'+this.applicationId+'/applicant/'+this.qde.application.applicants[this.applicantIndex].applicantId], {queryParams: { tabName: this.fragments[this.tabName], page: t }});
        // } else {
          this.router.navigate([], {queryParams: {tabName: this.fragments[modifiedTabIndex], page: t}});
        // }
      }
    }
  }

  onBackButtonClick(swiperInstance?: Swiper) {
    if (this.activeTab > 0) {
      if (swiperInstance != null && swiperInstance.getIndex() > 0) {
        // Go to Previous Slide
        this.goToPrevSlide(swiperInstance);
      } else {
        // Go To Previous Tab. If income consider is No then to Address Proof instead of Banking
        if(this.qde.application.applicants[this.applicantIndex].incomeDetails.incomeConsider == false && this.activeTab == 6) {
          this.tabSwitch(this.activeTab - 2);
        } else {
          this.tabSwitch(this.activeTab - 1);
        }
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

    let size = this.getFileSize(this.photoProofDoc[this.applicantIndex]["size"]);

    if(size) {
      this.photoProofFileSize[this.applicantIndex] = size;
      this.photoProofFileName[this.applicantIndex] = this.photoProofDoc[this.applicantIndex]["name"];
    }

    this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.applicantIndex]['applicantId']+"", this.page, this.tabName, screenPages['documentUploads']).subscribe(auditRes => {
      if(auditRes['ProcessVariables']['status'] == true) {
                this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
                this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
                this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
                this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
      }
    } , error => {
      this.isErrorModal = true;
      this.errorMessage = "Something went wrong, please try again later.";
    });

  }

  /************************
  * Customer Photo Next(Submit)
  ************************/
  handleCustomerPhoto(slider ?: Swiper) {

    let tabIndex = 2;
    if (!this.photoProofDoc[this.applicantIndex]) {
      // this.goToNextSlide(slider);
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
    let size = this.getFileSize(this.idProofDoc[this.applicantIndex]["size"]);

    if(size) {
      this.idProofFileSize[this.applicantIndex] = size;
      this.idProofFileName[this.applicantIndex] = this.idProofDoc[this.applicantIndex]["name"];
    }

    this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.applicantIndex]['applicantId']+"", this.page, this.tabName, screenPages['documentUploads']).subscribe(auditRes => {
      if(auditRes['ProcessVariables']['status'] == true) {
                this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
                this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
                this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
                this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
      }
    } , error => {
      this.isErrorModal = true;
      this.errorMessage = "Something went wrong, please try again later.";
    });
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

    let fileName = this.qde.application.applicationId + "-" + applicantId + "-" + new Date().getTime();

    this.ngxService.start();

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

        this.ngxService.stop();

      } else {
        // Throw Invalid Pan Error
        // alert(JSON.parse(data["response"]));
        this.ngxService.stop();
      }
    });
  }

  /************************
  * Address Proof Chooser
  ************************/
  setAddressProof(files: any) {


    if(this.isMobile) {
      this.addressProofDoc[this.applicantIndex] = files;
      this.addressProofFileName[this.applicantIndex] = (<any>window).Ionic.WebView.convertFileSrc(this.addressProofDoc[this.applicantIndex]);
      this.addressProofFileSize[this.applicantIndex] = "";
      return;
    }


    this.addressProofDoc[this.applicantIndex] = files.item(0);

    let size = this.getFileSize(this.addressProofDoc[this.applicantIndex]["size"]);

    if(size) {
      this.addressProofFileSize[this.applicantIndex] = size;
      this.addressProofFileName[this.applicantIndex] = this.addressProofDoc[this.applicantIndex]["name"];
    }

    this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.applicantIndex]['applicantId']+"", this.page, this.tabName, screenPages['documentUploads']).subscribe(auditRes => {
      if(auditRes['ProcessVariables']['status'] == true) {
                this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
                this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
                this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
                this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
      }
    } , error => {
      this.isErrorModal = true;
      this.errorMessage = "Something went wrong, please try again later.";
    });
  }

  /************************
  * Address Proof Upload
  ************************/
  handleAddressProof(slider) {
    const tabIndex = 4;
    
    if (!this.addressProofDoc[this.applicantIndex]) {
      // this.goToNextSlide(slider);
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
      this.incomeProofFileName[this.applicantIndex] = (<any>window).Ionic.WebView.convertFileSrc(this.incomeProofDoc[this.applicantIndex]);
      this.incomeProofFileSize[this.applicantIndex] = "";
      return;
    }

    this.incomeProofDoc[this.applicantIndex] = files.item(0);

    let size = this.getFileSize(this.incomeProofDoc[this.applicantIndex]["size"]);

    if(size){
      this.incomeProofFileSize[this.applicantIndex] = size;
      this.incomeProofFileName[this.applicantIndex] = this.incomeProofDoc[this.applicantIndex]["name"];
    }

    this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.applicantIndex]['applicantId']+"", this.page, this.tabName, screenPages['documentUploads']).subscribe(auditRes => {
      if(auditRes['ProcessVariables']['status'] == true) {
                this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
                this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
                this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
                this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
      }
    } , error => {
      this.isErrorModal = true;
      this.errorMessage = "Something went wrong, please try again later.";
    });
  }

  /***************************
  * Income Proof Next(Submit)
  ***************************/
  handleIncomeProof(slider) {
    let tabIndex = 6;
    if(this.qde.application.applicants[this.applicantIndex].incomeDetails.incomeConsider) {
      tabIndex = 5;
    }

    if (!this.incomeProofDoc[this.applicantIndex]) {
      // this.goToNextSlide(slider);
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
      this.bankProofFileName[this.applicantIndex] = (<any>window).Ionic.WebView.convertFileSrc(this.bankingProofDoc[this.applicantIndex]);
      this.bankProofFileSize[this.applicantIndex] = "";
      return;
    }
    this.bankingProofDoc[this.applicantIndex] = files.item(0);

    let size= this.getFileSize(this.bankingProofDoc[this.applicantIndex]["size"]);

    if(size) {
      this.bankProofFileSize[this.applicantIndex] = size;
      this.bankProofFileName[this.applicantIndex] = this.bankingProofDoc[this.applicantIndex]["name"];
    }

    this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.applicantIndex]['applicantId']+"", this.page, this.tabName, screenPages['documentUploads']).subscribe(auditRes => {
      if(auditRes['ProcessVariables']['status'] == true) {
                this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
                this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
                this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
                this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
      }
    } , error => {
      this.isErrorModal = true;
      this.errorMessage = "Something went wrong, please try again later.";
    });

  }

  /****************************
  * Banking Proof Next(Submit)
  ****************************/
  handleBankingProof(slider) {
    const tabIndex = 6;

    if (!this.bankingProofDoc[this.applicantIndex]) {
      // this.goToNextSlide(slider);
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
      this.collateralProofFileName[this.applicantIndex] = (<any>window).Ionic.WebView.convertFileSrc(this.collateralProofDoc[this.applicantIndex]);
      this.collateralProofFileSize[this.applicantIndex] = "";
      return;
    }

    this.collateralProofDoc[this.applicantIndex] = files.item(0);

    let size = this.getFileSize(this.collateralProofDoc[this.applicantIndex]["size"]);

    if(size) {
      this.collateralProofFileSize[this.applicantIndex] = size;
      this.collateralProofFileName[this.applicantIndex] = this.collateralProofDoc[this.applicantIndex]["name"];
    }

    this.auditTrialApiSub = this.qdeHttp.auditTrailUpdateAPI(this.qde['application']['applicationId'], this.qde['application']['applicants'][this.applicantIndex]['applicantId']+"", this.page, this.tabName, screenPages['documentUploads']).subscribe(auditRes => {
      if(auditRes['ProcessVariables']['status'] == true) {
                this.qde.application.auditTrailDetails.applicantId = auditRes['ProcessVariables']['applicantId'];
                this.qde.application.auditTrailDetails.screenPage = auditRes['ProcessVariables']['screenPage'];
                this.qde.application.auditTrailDetails.tabPage = auditRes['ProcessVariables']['tabPage'];
                this.qde.application.auditTrailDetails.pageNumber = auditRes['ProcessVariables']['pageNumber'];
      }
    } , error => {
      this.isErrorModal = true;
      this.errorMessage = "Something went wrong, please try again later.";
    });
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
      this.isDocUploadRouteModal = true;
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
      }, error => {
        if(error.error.message) {
          this.isErrorModal = true;
          this.errorMessage = error.error.message;
        }
      }
    );
  }

  uploadToOmni(documentInfo: any, tabIndex: number, slider?: Swiper) {
    this.qdeHttp.uploadToOmni(documentInfo).subscribe(
      response => {
        if (
          response["Error"] === "0" &&
          response["ProcessVariables"]["status"]
        ) {
          //alert("Uploaded Successfully!");
          this.cameraImage = "";

          if(slider == "collateral") {
            console.log("hios")
            this.isDocUploadRouteModal = true;
            return;
          }
          // if (slider) {
          //   this.goToNextSlide(slider);
          // } else {
          this.tabSwitch(tabIndex);
          // }

        } else {
          if (response["ErrorMessage"]) {
            console.log("Response: " + response["ErrorMessage"]);
          } else if (response["ProcessVariables"]["errorMessage"]) {
            console.log(
              "Response: " + response["ProcessVariables"]["errorMessage"]
            );
          }
        }
      }, error => {
        this.isErrorModal = true;
        this.errorMessage = error.message;
      }
    );
  }

  getApplicableDocuments(data: any, documents: Array<any>, index: number, callback) {

    this.qdeHttp.getApplicableDocuments(data).subscribe(
      response => {
        const processVariables = response["ProcessVariables"];
        if (response["Error"] === "0" && processVariables["status"]) {
          
          const res = JSON.parse(processVariables["response"]);

          console.log("getApplicableDocuments: ", response);

          /******************************
          * Default Values for dropdowns
          ******************************/
         console.log(this.selectedIdProof)
          this.idProofDocumnetType[index] = res.IdProof || [];
          console.warn("idProofDocumnetType", this.idProofDocumnetType);
          // this.selectedIdProof[index] = this.idProofDocumnetType[index][0];

          console.log("AddressProof: ", res.AddressProof);
          this.addressProofDocumnetType[index] = res.AddressProof || [];
          // this.selectedAddressProof[index] = this.addressProofDocumnetType[index][0];
          this.selectedAddressProof[index] =  this.defaultItem;

          this.incomeProofDocumnetType[index] = res.IncomeDocument || [];
          // this.selectedIncomeProof[index] = this.incomeProofDocumnetType[index][0];
          this.selectedIncomeProof[index] =  this.defaultItem;

          this.bankProofDocumnetType[index] = res.Banking || [];
          // this.selectedBankProof[index] = this.bankProofDocumnetType[index][0];
          this.selectedBankProof[index] =  this.defaultItem;

          this.collateralProofDocumnetType[index] = res.collateral || [];
          // this.selectedCollateralProof[index] = this.collateralProofDocumnetType[index][0];
          this.selectedCollateralProof[index] =  this.defaultItem;
          /******************************************
          * It will load Documents of all Applicants
          ******************************************/
          
          this.loadDocuments(documents, index, callback);
        } else {

          if (response["ErrorMessage"]) {
            console.log("Response: " + response["ErrorMessage"]);
          } else if (response["ProcessVariables"]["errorMessage"]) {
            console.log("Response: " + response["ProcessVariables"]["errorMessage"]);
          }
        }
      }, error => {
        this.isErrorModal = true;
        this.errorMessage = "Something went wrong, please try again later.";
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

    let FileSize = size / 1024 / 1024; // in MB
    if (FileSize > 2) {
        this.isErrorModal = true;
        this.errorMessage = "File size exceeds 2 MB";

       // $(file).val(''); //for clearing with Jquery
       return null;
    } else {
     
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
    // this.isTabDisabled = false;
    // this.router.navigate(['/document-uploads/'+applicationId+'/applicant/'+mainApplicantId], {queryParams: {tabName: this.fragments[1], page: 1}});
    this.tabSwitch(1);
  }

  loadDocuments(documents: Array<any>, index: number, callback) {

    for (const document of documents) {
      const docCategory = document["documentCategory"];

      const idProofCategory = this.findDocumentCategory(DocumentCategory.ID_PROOF);
      const addressProofCategory = this.findDocumentCategory(DocumentCategory.ADDRESS_PROOF);
      const incomeProofCategory = this.findDocumentCategory(DocumentCategory.INCOME_PROOF);
      const bankingProofCategory = this.findDocumentCategory(DocumentCategory.BANK_PROOF);
      const collateralProofCategory = this.findDocumentCategory(DocumentCategory.COLLATERAL_PROOF);
      const photoProofCategory = this.findDocumentCategory(DocumentCategory.PHOTO_PROOF);

      if (docCategory == idProofCategory) {
        this.selectedIdProof[index] = this.idProofDocumnetType[index].find(v => v.value == document["documentType"]);
        this.idProofFileName[index] = document["documentName"];
        this.idProofFileSize[index] = this.getFileSize(document["documentSize"]);
        this.idProofId[index] = this.driveLoc+""+document["documentImageId"];
      } else if (docCategory == addressProofCategory) {
        this.selectedAddressProof[index] = this.addressProofDocumnetType[index].find(v => v.value == document["documentType"]);
        this.addressProofFileName[index] = document["documentName"];
        this.addressProofFileSize[index] = this.getFileSize(document["documentSize"]);
        this.addressProofId[index] = this.driveLoc+document["documentImageId"];
      } else if (docCategory == incomeProofCategory) {
        this.selectedIncomeProof[index] = this.incomeProofDocumnetType[index].find(v => v.value == document["documentType"]);
        this.incomeProofFileName[index] = document["documentName"];
        this.incomeProofFileSize[index] = this.getFileSize(document["documentSize"]);
        this.incomeProofId[index] = this.driveLoc+document["documentImageId"];
      } else if (docCategory == bankingProofCategory) {
        this.selectedBankProof[index] = this.bankProofDocumnetType[index].find(v => v.value == document["documentType"]);
        this.bankProofFileName[index] = document["documentName"];
        this.bankProofFileSize[index] = this.getFileSize(document["documentSize"]);
        this.bankProofId[index] = this.driveLoc+document["documentImageId"];
      } else if (docCategory == collateralProofCategory) {
        this.selectedCollateralProof[index] = this.collateralProofDocumnetType[index].find(v => v.value == document["documentType"]);
        this.collateralProofFileName[index] = document["documentName"];
        this.collateralProofFileSize[index] = this.getFileSize(document["documentSize"]);
        this.collateralProofId[index] = this.driveLoc+document["documentImageId"];
      } else if (docCategory == photoProofCategory) {
        this.photoProofFileName[index] = document["documentName"];
        this.photoProofFileSize[index] = this.getFileSize(document["documentSize"]);
        this.photoProofId[index] = this.driveLoc + document["documentImageId"];
      }
    }

    callback();
  }

  openLink(url) {
    window.open(url, '_blank');
  }

  recurvLovCalls(applicants, index=0) {

    let that = this;

    const applicantId = applicants[index]["applicantId"];
    this.driveLoc = environment.host + environment.driveLocation;

    const incomeDetails = applicants[index].incomeDetails;

    let profileId;
    if(applicants[index].isIndividual) {
      if(applicants[index].occupation) {
        if(applicants[index].occupation.occupationType) {
          profileId = applicants[index].occupation.occupationType
        } else {
          profileId = this.lovs['LOVS']['occupation'][0]['value'];
        }
      } else {
        profileId = this.lovs['LOVS']['occupation'][0]['value'];
      }
    } else {
      profileId = null;
    }

    const data = {
      isFinanceApplicant: incomeDetails.incomeConsider,
      assessmentId: parseInt(incomeDetails.assessmentMethodology, 10),
      profileId: profileId ? parseInt(profileId): null,
      applicantType: applicants[index].isIndividual == true ? 1: 2
    };

    console.log("isFinanceApplicant: ", data);

    this.getApplicableDocuments(data, (applicants[index]['documents'] != null) ? applicants[index]['documents'] : [], index, function() {
        // Ends here

      if (applicants[index]["isMainApplicant"]) {
        that.mainApplicantId = applicantId;
      } else {
        if (length - 1 === that.coApplicants.length) {

        } else {
          that.coApplicants.push(applicants);
        }
        
      }

      if(applicants[index+1] != null) {
        that.recurvLovCalls(applicants, index+1);
      }

    }.bind(this));

  }
  onCrossModal(){
    this.isDocUploadRouteModal = false;
  }
  moreDocUpload(){
    this.router.navigate(['/document-uploads', this.qde.application.applicationId], {queryParams: {tabName: this.fragments[0], page: 1}})
    this.isDocUploadRouteModal = false
  }

  ngAfterViewInit() {
    this.swiperSlidersSub = this.swiperS$.changes.subscribe(v => {
      this.swiperSliders = v._results;
      if(this.swiperSliders && this.swiperSliders.length > 0) {
        this.swiperSliders[this.activeTab].setIndex(this.page-1);
      }
    });
  }

  goToExactPageAndTab(tabPage: string, pageNumber: number, fromQde: boolean) {
    let index = this.fragments.findIndex(v => v == tabPage) != -1 ? this.fragments.findIndex(v => v == tabPage) : 0;
    this.tabName = tabPage;
    this.page = pageNumber;
    this.tabSwitch(index, fromQde);
  }
}