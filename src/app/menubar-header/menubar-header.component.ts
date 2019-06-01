import { Component, OnInit, Input } from '@angular/core';
import { CommonDataService } from '../services/common-data.service';
import { UtilService } from '../services/util.service';

@Component({
  selector: 'app-menubar-header',
  templateUrl: './menubar-header.component.html',
  styleUrls: ['./menubar-header.component.css']
})
export class MenubarHeaderComponent implements OnInit {
  
  isMenuBarShown: boolean;
  isViewFormVisible: boolean;
  isLogoutVisible: boolean;

  constructor(private utilService: UtilService, private commonDataService: CommonDataService) {
    this.commonDataService.isMenuBarShown.subscribe((value) => {
      this.isMenuBarShown = value;
    });

    this.commonDataService.isViewFormVisible.subscribe((value) => {
      this.isViewFormVisible = value;
    });

    this.commonDataService.isLogoutVisible.subscribe((value) => {
      this.isLogoutVisible = value;
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
