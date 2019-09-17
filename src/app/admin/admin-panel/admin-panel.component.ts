import { UtilService } from 'src/app/services/util.service';
import { Component, OnInit } from '@angular/core';
import { CommonDataService } from 'src/app/services/common-data.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {

  isLogoutVisible: boolean;

  constructor(private utilService: UtilService, 
              private cds: CommonDataService) {

     this.cds.isLogoutVisible.subscribe((value) => {
      this.isLogoutVisible = value;
    });
  }
  isloggedIn() {
    return this.utilService.isLoggedIn();
  }

  clearCredentials() {
    return this.utilService.clearCredentials();
  }
  logout() {
    this.utilService.logout().subscribe(
      res => {
      },
      error => {
      }
    );
    this.utilService.clearCredentials();
  }
  ngOnInit() {
  }
  

}
