import { Component, OnInit, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { CommonDataService } from '../services/common-data.service';
import { UtilService } from '../services/util.service';
import { QdeService } from '../services/qde.service';

import Qde  from 'src/app/models/qde.model';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { QdeHttpService } from '../services/qde-http.service';

import { screenPages, statuses } from '../app.constants';



@Component({
  selector: 'app-menubar-header',
  templateUrl: './menubar-header.component.html',
  styleUrls: ['./menubar-header.component.css']
})
export class MenubarHeaderComponent implements OnInit, OnDestroy {
  
  readonly screenPages = screenPages;
  activeTab: string;

  isMenuBarShown: boolean;
  isViewFormNameVisible: boolean;
  isViewFormVisible: boolean;
  isLogoutVisible: boolean;
  applicationId: string;
  coApplicantIndex: number;
  applicantId: string;
  // isMenuBarShown: boolean;
  isViewFormNameShown: boolean;
  isHomeVisible: boolean;
  paymentActive: boolean;
  applicantBtnStatus: boolean;
  // isViewFormVisible: boolean;
  // isLogoutVisible: boolean;
  // applicantId: string;

  public applicantName: string;
  

  referenceNumber: string;
  qde:Qde;

  isMainTabEnabled: boolean;
  isEligibilityForReview: boolean = false;
  isEligibilityForReviewsSub: Subscription;
  isTBMLoggedIn: boolean = false;
  isFinalSubmitEnabled: boolean = false;
  isPaymentsDisabled: boolean = true;

  firstName: string;
  lastName: string;
  nameOfOrganization:string;
  ocsNumber:string;
  valueSMSA: any;
  allSMSAData: any = [];
  isSourceModal: boolean;
  sourceId: string;
  tempSMSAData: any;

  isSelectsaSmId: boolean;
  saSmId: string;
  createOrUpdatePersonalDetailsBrokerId: Subscription;
  enableSourceId: boolean;
  enableSourcedBy: boolean;
  showSourceBy: boolean;
  

  constructor(private utilService: UtilService,
              private commonDataService: CommonDataService,
              private _router: Router,
              private qdeService: QdeService,
              private route: ActivatedRoute,
              private qdehttp: QdeHttpService) {

                this.sourceId = '';
                this.tempSMSAData = [];

        // let data = {
        //   userId: localStorage.getItem('userId'),
        // }
        // this.qdehttp.getSASMID(data).subscribe(res => {
        //   console.log('Response',res)
        //   // if(res['ProcessVariables']['status'] == true) {
        //   // }
        //   this.tempSMSAData = res['ProcessVariables']['sa_sm_id'];
        //   })


    this.route.params.subscribe(val => {
      this.applicationId = val.applicationId;
      // this.applicantId = this.qde.application.applicants.find(v => v.applicantId == val.applicantId).applicantId;
      this.applicantId = val.applicantId;
    });

    this.commonDataService.isViewFormNameShown.subscribe((value) => {
      this.isViewFormNameShown = value;
    });

    this.commonDataService.isMenuBarShown.subscribe((value) => {
      this.isMenuBarShown = value;
    });

    this.commonDataService.isViewFormVisible.subscribe((value) => {
      this.isViewFormVisible = value;
    });

    this.commonDataService.isLogoutVisible.subscribe((value) => {
      this.isLogoutVisible = value;
    });

    this.commonDataService.isHomeVisible.subscribe((value) => {
      this.isHomeVisible = value;
    });
    
    // this.commonDataService.paymentActive.subscribe((value) => {
    //   this.paymentActive = value; 
    // }); 
 
    this.commonDataService.applicationId.subscribe(val => { 
      this.applicationId = val; 
      console.log("applicationId: ", this.applicationId); 
    }); 
 
    this.commonDataService.coApplicantIndex.subscribe(val => { 
      this.coApplicantIndex = val; 
    }); 
 
    this.commonDataService.applicantName.subscribe(val => { 
      this.applicantName = val; 
      console.log("applicantName: ", this.applicantName); 
    }); 
    
    this.commonDataService.applicantId$.subscribe(val =>
                 this.applicantId = val);

    // this.qde = qdeService.getQde();

    // this.applicantName = this.qde.application.applicants[0].personalDetails.firstName;
    // console.log("this.applicantName", this.applicantName);
 
    this.qdeService.qdeSource.subscribe(v => {
      this.qde = v;

      if(this.qde.application.status) {
        if(this.qde.application.status !== 1) {
          this.enableSourcedBy = true;
        }else {
          this.enableSourcedBy = false;
        }
      }else {
        this.enableSourcedBy = false;
      }

      if(this.qde.application.applicationId === "") {
        this.enableSourcedBy = true;
      }
     

      // console.log("Apllication status", this.qde);

      
        // this.enableSourceId = true;
        this.tempSMSAData.push({key: this.qde.application.brokerName,value: this.qde.application.brokerId})
        const saSMId = this.qde.application.brokerId;

        const filterData = this.tempSMSAData.filter((sasmId)=> {

          if(sasmId.value === saSMId) {
            return sasmId;
          }
        })


        this.sourceId = (filterData.length>0)?(filterData[0].key):''
      // } else {
      //   this.enableSourceId = false;
      // }

      

      this.applicantBtnStatus = (this.qde.application.status == parseInt(statuses['Login Fee Paid']) ? true: false) ;

      // Find an applicant
      // if (this.applicantId == null || this.applicantId == undefined || this.applicantId == ""){
        console.log("current url ",this._router.url);

        let currentUrl: string = this._router.url;

        if (!currentUrl.startsWith('/static')){

        const applicants = this.qde.application.applicants;
        for (const applicant of applicants) {
          if (applicant["isMainApplicant"]) {
            this.applicantId = applicant["applicantId"];
            break;
          }
          
        }
      }
    
      

      // console.log("this.applicantName", this.qde.application.applicants[0].personalDetails.firstName);
      
      // let index = v.application.applicants.findIndex(val => val.isMainApplicant == true);
      let index = v.application.applicants.findIndex(val => val.applicantId == this.applicantId);

      if(index == -1) {
        this.applicantName = "";
      } else {
        if(this.qde.application.applicants[index].personalDetails.firstName != "" ) {
          this.applicantName = "Application for "+ this.qde.application.applicants[index].personalDetails.firstName + " "
          +" " + this.qde.application.applicants[index].personalDetails.middleName + " "
           + this.qde.application.applicants[index].personalDetails.lastName;
        } else {
          this.applicantName = "Application for "+ this.qde.application.applicants[index].organizationDetails.nameOfOrganization
          || this.nameOfOrganization;
         
        }

        this.referenceNumber = this.qde.application.ocsNumber;
        return;
      }


      // if(this.applicantName.length != 0) {
      //   this.applicantName = "Application for "+this.applicantName;
      //   this.referenceNumber = this.qde.application.ocsNumber || this.applicationId;
      //   return;
      // }
     

    });

    this.commonDataService.isMainTabEnabled.subscribe(val => {
      this.isMainTabEnabled = val;
    });
    
    this.commonDataService.applicationId.subscribe(value => {

      if(value != null) {
        if(this.isEligibilityForReviewsSub != null) {
          this.isEligibilityForReviewsSub.unsubscribe();
        }
        this.isEligibilityForReviewsSub = this.commonDataService.isEligibilityForReviews.subscribe(val => {
          console.log("MENUHEADER,", value);
          try{
            this.isEligibilityForReview = val.find(v => v.applicationId == value)['isEligibilityForReview'];
          } catch(ex) {
            // this._router.navigate(['/leads']);
          }
        });
      }
    });

    this.commonDataService.isTBMLoggedIn.subscribe(val => {
      this.isTBMLoggedIn = val;
    });

    this.commonDataService.activeTab.subscribe(val => {
      this.activeTab = val;
    });
    this.commonDataService.status.subscribe(val => {
      if(val == 15) {
        this.isFinalSubmitEnabled = true;
      }
      else if(val >= 20) {
        this.isFinalSubmitEnabled = false;
      }
      else{
        this.isFinalSubmitEnabled = false;
      }

      this.isPaymentsDisabled = val == 15 ? false: true;
      console.log("Dude: ", val);
      console.log("isPaymentsDisabled: ",this.isPaymentsDisabled);
    });
    const appId = this.route.snapshot.params;
    console.log("qutery Perams in constor ", appId);
  }

  ngOnInit() {
    console.log("on init in menu header");
    const appId = this.route.snapshot.params;
    console.log("qutery Perams ", appId);
    // this.setApplicantName();
  }

  setApplicantName(qde) {
    this.applicantName = this.qde.application.applicants[0].personalDetails.firstName;
    console.log("this.applicantName", this.applicantName);
  }


  

  setApplicationName(firstName, lastName, nameOfOrganization, ocsNumber){

    this.firstName = firstName;
    this.lastName = lastName;
    this.nameOfOrganization = nameOfOrganization;
    this.ocsNumber = ocsNumber;

    // if(firstName && lastName) {
    //   this.applicantName = "Application for "+ firstName +" "+ lastName;
    // } else {
    //   this.applicantName = "Application for "+ nameOfOrganization;
    // }
    // this.referenceNumber = referenceNumber;
  }

  logout() {
    // this.qdehttp.logout().subscribe(
    //   res => {
    //   },
    //   error => {
    //   }
    // );
    this.utilService.clearCredentials();
   

    // this.utilService.logout().subscribe(
    //   res => {
    //     this.utilService.clearCredentials();
    //   },
    //   error => {
    //     this.utilService.clearCredentials();
    //   }
    // );
  }

  sourceOverlay() {
    this.isSourceModal= true;
  }

  searchSMSAId(event) {

    const enterValue = event.target.value;
    if(enterValue.length == 0) {
      this.allSMSAData = [];
      return;
    }

    const qdeBrokerArr = [{
      key: `${this.qde.application.brokerName}-${this.qde.application.brokerId}`,
      value: this.qde.application.brokerId
    }]
    this.allSMSAData  = []

    this.isSelectsaSmId = false;

    let data = {
      userName: enterValue
    }
  
    this.qdehttp.getConnectorRP(data).subscribe(res => {

      console.log('Response',res)
     
      const resultData = res['ProcessVariables']['brokerList'];
      this.allSMSAData = resultData;
     
      })
 
   }


   
   selectSMSA(val) {
 
     this.valueSMSA = val.key;
     this.isSelectsaSmId = true;
     this.saSmId = val.value;
     this.allSMSAData = []
   }

   onSourceSubmit() {
     this.isSourceModal = false;
     this.sourceId = this.valueSMSA;
     this.qde.application.brokerName = this.valueSMSA;
     this.qde.application.brokerId = this.saSmId;

     if(this.qde.application.applicants.length > 0) {
       const isIndividual = this.qde.application.applicants[0].isIndividual;

       if(isIndividual === null) {
        this.qde.application.applicants[0].isIndividual = true;
       }
     }

    // const filterData = this.qdeService.getFilteredJson(this.qde);
    const filterData = this.qde;
     this.createOrUpdatePersonalDetailsBrokerId = this.qdehttp.createOrUpdatePersonalDetails(filterData).subscribe((response) => {
      console.log("SourceId Response",response)

     })

   }


  ngOnDestroy() {
    if(this.isEligibilityForReviewsSub != null) {
      this.isEligibilityForReviewsSub.unsubscribe();
    }
    if(this.createOrUpdatePersonalDetailsBrokerId != null) {
      this.createOrUpdatePersonalDetailsBrokerId.unsubscribe()
    }
  }

  statusViewPage(appId) {


    let status = this.qde.application.status;

    if(status  ==  parseInt(statuses['Login Fee Paid']) ) {
      //this._router.navigate(["/paymentsucessfull"]);
    }else {
      this._router.navigate(["/applicant/sucessfull/", this.applicationId]);
    }
  }

}
