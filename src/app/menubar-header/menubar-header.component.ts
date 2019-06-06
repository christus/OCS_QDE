import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonDataService } from '../services/common-data.service';
import { UtilService } from '../services/util.service';

@Component({
  selector: 'app-menubar-header',
  templateUrl: './menubar-header.component.html',
  styleUrls: ['./menubar-header.component.css']
})
export class MenubarHeaderComponent implements OnInit, OnChanges {
  
  isMenuBarShown: boolean;
  isViewFormNameVisible: boolean;
  isViewFormVisible: boolean;
  isLogoutVisible: boolean;
  applicantId: string;

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
    
    this.commonDataService.applicantId.subscribe(val => {
      this.applicantId = val;
    });
  }

  ngOnInit() {
    
  }

  ngOnChanges(simple: SimpleChanges) {
    alert(simple.applicantId.currentValue);
    console.log("777", simple.applicantId.currentValue);
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
