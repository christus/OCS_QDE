import { QdeHttpService } from './../../../services/qde-http.service';
import { Component, OnInit } from '@angular/core';

import { UtilService } from 'src/app/services/util.service';
import { from } from 'rxjs';
import { CommonDataService } from 'src/app/services/common-data.service';

@Component({
  selector: 'app-leads-header',
  templateUrl: './leads-header.component.html',
  styleUrls: ['./leads-header.component.css']
})
export class LeadsHeaderComponent implements OnInit {


  isLogoutVisible: boolean;

  constructor(private utilService: UtilService,
              private http: QdeHttpService,
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
    this.http.logout().subscribe(
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
