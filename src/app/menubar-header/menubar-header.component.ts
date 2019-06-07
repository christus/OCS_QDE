import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonDataService } from '../services/common-data.service';
import { UtilService } from '../services/util.service';

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

  constructor(private utilService: UtilService, private commonDataService: CommonDataService) {
    this.commonDataService.isMenuBarShown.subscribe((value) => {
      this.isMenuBarShown = value;
    });

    this.commonDataService.isViewFormNameVisible.subscribe((value) => {
      this.isViewFormNameVisible = value;
    });

    this.commonDataService.isViewFormVisible.subscribe((value) => {
      this.isViewFormVisible = value;
    });

    this.commonDataService.isLogoutVisible.subscribe((value) => {
      this.isLogoutVisible = value;
    });
    
    this.commonDataService.applicationId.subscribe(val => {
      this.applicationId = val;
    });

    this.commonDataService.coApplicantIndex.subscribe(val => {
      this.coApplicantIndex = val;
    });
  }

  ngOnInit() {
    
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
