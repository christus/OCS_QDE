import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonDataService } from 'src/app/services/common-data.service';

@Component({
  selector: 'app-leads-sidebar',
  templateUrl: './leads-sidebar.component.html',
  styleUrls: ['./leads-sidebar.component.css']
})
export class LeadsSidebarComponent implements OnInit {

  viewMode: string = '' ;
  userRole: any = [];
  isTBMLoggedIn: boolean ;
  constructor(private router: Router,
              private cds: CommonDataService) {
                this.isTBMLoggedIn = this.getRoles().includes('TBM') || this.getRoles().includes('ZBM') || this.getRoles().includes('TMA');
                }

  ngOnInit() {
    console.log("page init call");
    
     this.userRole = localStorage.getItem("roles");

    
     console.log("userRole ", this.userRole);
    // this.viewMode = "tab2";
  }
  pageNavigation(pageValue) {
    console.log("page click call", pageValue);
    if (pageValue == "tab2")  {     
    this.router.navigate(["/leads"]);
    this.viewMode = pageValue;
    console.log("page click call", this.viewMode);
    } else  if (pageValue == "tab1") {
      this.router.navigate(["/reports"]);
      this.viewMode = pageValue;
      console.log("page click call", this.viewMode);
    }
  }
  getRoles(): Array<string> {
    return JSON.parse(localStorage.getItem("roles"));
  }
}
