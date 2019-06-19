import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonDataService } from '../services/common-data.service';
import { UtilService } from '../services/util.service';
import { QdeService } from '../services/qde.service';

import Qde  from 'src/app/models/qde.model';

@Component({
  selector: 'app-menubar-header',
  templateUrl: './menubar-header.component.html',
  styleUrls: ['./menubar-header.component.css']
})
export class MenubarHeaderComponent implements OnInit {
  
  isMenuBarShown: boolean;
  isViewFormNameVisible: boolean;
  isViewFormVisible: boolean;
  isLogoutVisible: boolean;
  applicationId: string;
  coApplicantIndex: number; 
  // isMenuBarShown: boolean;
  isViewFormNameShown: boolean;
  // isViewFormVisible: boolean;
  // isLogoutVisible: boolean;
  // applicantId: string;

  public applicantName: string;

  qde:Qde;



  constructor(private utilService: UtilService, private commonDataService: CommonDataService,
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

}
