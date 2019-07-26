import { Component, OnInit, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { CommonDataService } from '../services/common-data.service';
import { UtilService } from '../services/util.service';
import { QdeService } from '../services/qde.service';

import Qde  from 'src/app/models/qde.model';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menubar-header',
  templateUrl: './menubar-header.component.html',
  styleUrls: ['./menubar-header.component.css']
})
export class MenubarHeaderComponent implements OnInit, OnDestroy {
  
  isMenuBarShown: boolean;
  isViewFormNameVisible: boolean;
  isViewFormVisible: boolean;
  isLogoutVisible: boolean;
  applicationId: string;
  coApplicantIndex: number;
  applicantId: string;
  // isMenuBarShown: boolean;
  isViewFormNameShown: boolean;
  paymentActive: boolean;
  // isViewFormVisible: boolean;
  // isLogoutVisible: boolean;
  // applicantId: string;

  public applicantName: string;
  qde:Qde;

  isMainTabEnabled: boolean;
  isEligibilityForReview: boolean = false;
  isEligibilityForReviewsSub: Subscription;
  isTBMLoggedIn: boolean = false;

  constructor(private utilService: UtilService,
              private commonDataService: CommonDataService,
              private _router: Router,
              private qdeService:QdeService) {
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

    // this.qde = qdeService.getQde();

    // this.applicantName = this.qde.application.applicants[0].personalDetails.firstName;
    // console.log("this.applicantName", this.applicantName);
 
    this.qdeService.qdeSource.subscribe(v => {
      this.qde = v;

      // Find an applicant
      const applicants = this.qde.application.applicants;
      for (const applicant of applicants) {
        if (applicant["isMainApplicant"]) {
          this.applicantId = applicant["applicantId"];
          break;
        }
      }

      // console.log("this.applicantName", this.qde.application.applicants[0].personalDetails.firstName);
      
      let index = v.application.applicants.findIndex(val => val.isMainApplicant == true);
      
      if(index == -1) {
        this.applicantName = "";
      } else {
        if(this.qde.application.applicants[0].personalDetails.firstName != "") {
          this.applicantName = "Application for "+this.qde.application.applicants[index].personalDetails.firstName +" "+ this.qde.application.applicants[index].personalDetails.lastName;
        }
      }
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
          //   this._router.navigate(['/leads']);
          }
        });
      }
    });

    this.commonDataService.isTBMLoggedIn.subscribe(val => {
      this.isTBMLoggedIn = val;
    });
  }

  ngOnInit() {
    
  }

  setApplicantName(qde) {
    this.applicantName = this.qde.application.applicants[0].personalDetails.firstName;
    console.log("this.applicantName", this.applicantName);
  }

  logout() {
    this.utilService.logout().subscribe(
      res => {
        this.utilService.clearCredentials();
      },
      error => {
        this.utilService.clearCredentials();
      }
    );
  }

  ngOnDestroy() {
    if(this.isEligibilityForReviewsSub != null) {
      this.isEligibilityForReviewsSub.unsubscribe();
    }
  }
}
