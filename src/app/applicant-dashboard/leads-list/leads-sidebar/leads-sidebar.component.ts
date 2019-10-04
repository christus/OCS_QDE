import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-leads-sidebar',
  templateUrl: './leads-sidebar.component.html',
  styleUrls: ['./leads-sidebar.component.css']
})
export class LeadsSidebarComponent implements OnInit {

  viewMode: string = '' ;

  constructor(private router: Router) { }

  ngOnInit() {
    console.log("page init call");
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
}
