import { QdeHttpService } from './../../../services/qde-http.service';
import { Component, OnInit } from '@angular/core';

import { UtilService } from 'src/app/services/util.service';
import { from } from 'rxjs';
import { CommonDataService } from 'src/app/services/common-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-leads-header',
  templateUrl: './leads-header.component.html',
  styleUrls: ['./leads-header.component.css']
})
export class LeadsHeaderComponent implements OnInit {


  isLogoutVisible: boolean;
  navigationString: string;
  isAdmin: boolean;

  constructor(private utilService: UtilService,
              private http: QdeHttpService,
              private cds: CommonDataService,
              private router: Router) {

     this.cds.isLogoutVisible.subscribe((value) => {
      this.isLogoutVisible = value;
    });
    this.cds.adminNagigation$.subscribe(value=>{
      this.navigationString = value;
    })
    this.cds.isAdmin$.subscribe(value=>{
      this.isAdmin = value;
    })
    console.log("###",this.isAdmin);
  }
  isloggedIn() {
    return this.utilService.isLoggedIn();
  }

  clearCredentials() {
    return this.utilService.clearCredentials();
  }
  
  logout() {
    // this.http.logout().subscribe(
    //   res => {
    //   },
    //   error => {
    //   }
    // );
    this.utilService.clearCredentials();
  }

  ngOnInit() {
    // if (this.isAdmin){
    //   this.router.navigate([this.navigationString])
    // }
  }

}
