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
  
  private isMenuBarShown: boolean;
  private isViewFormNameVisible: boolean;
  private isViewFormVisible: boolean;
  private isLogoutVisible: boolean;
  private applicationId: string;
  private coApplicantIndex: number; 
  // isMenuBarShown: boolean;
  private isViewFormNameShown: boolean;
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
    
    this.qdeService.qdeSource.subscribe(v =>{
      this.qde = v;
      console.log("this.applicantName", this.qde);
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
