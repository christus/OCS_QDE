import { QdeHttpService } from './../../services/qde-http.service';
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
  isAdmin: boolean;
  userModule: boolean;
  opsModule: boolean;
  masterConfig: boolean;
  navigationString:string;
  showOCS: boolean;
  constructor(private utilService: UtilService, 
              private http: QdeHttpService,
              private cds: CommonDataService) {

     this.cds.isLogoutVisible.subscribe((value) => {
      this.isLogoutVisible = value;
    });

    this.cds.isAdmin$.subscribe((value) => {
      this.isAdmin = value;
    });
    this.cds.userModule$.subscribe((value) => {
      this.userModule = value;
    });
    this.cds.opsMoudule$.subscribe((value) => {
      this.opsModule = value;
    });
    this.cds.masterConfig$.subscribe((value) => {
      this.masterConfig = value;
    });
    this.cds.adminNagigation$.subscribe((value) => {
      this.navigationString = value;
    });
    this.cds.showOCS$.subscribe(value=>{
      this.showOCS = value;
    })
    
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
    console.log("admin panale navigation string ",this.navigationString);
  }
  

}
