import { Component, OnInit } from '@angular/core';
import { QdeHttpService } from "src/app/services/qde-http.service";
import { UtilService } from "src/app/services/util.service";
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonDataService } from 'src/app/services/common-data.service';

export interface UserDetails {
  "amountEligible": number;
  "amountRequired": number;
  "firstName": string;
  "ocsNumber": number;
  "url": string;
}

interface Item {
  key: string,
  value: string
}

@Component({
  selector: 'app-application-print',
  templateUrl: './application-print.component.html',
  styleUrls: ['./application-print.component.css']
})
export class ApplicationPrintComponent implements OnInit {

  searchTxt: string;

  days: Array<Item>;
  months: Array<Item>;
  years: Array<Item>;
  YYYY: number = new Date().getFullYear();

  fromDay: Item;
  fromMonth: Item;
  fromYear: Item;
  toDay: Item;
  toMonth: Item;
  toYear: Item;

  perPagePP: number;
  currentPagePP: number;
  totalPagesPP: string;
  totalItemsPP: number;

  newPendingPaymentDetails: Array<any>;

  constructor(
    private service: QdeHttpService,
    private utilService: UtilService,
    // private router: Router,
    // private ngxService: NgxUiLoaderService
    private cds: CommonDataService
  ) {
    
   
    this.fromDay = { key: "DD", value: "DD" };
    this.fromMonth = { key: "MM", value: "MM" };
    this.fromYear = { key: "YYYY", value: "YYYY" };
    this.toDay = { key: "DD", value: "DD" };
    this.toMonth = { key: "MM", value: "MM" };
    this.toYear = { key: "YYYY", value: "YYYY" };
    this.cds.changeshowPrint(false);
   }

  ngOnInit() {
  
    this.getApplicationPrint();
  }

  getApplicationPrint(currentPage?: string) {
    if (localStorage.getItem("token") && localStorage.getItem("userId")) {
      const startDate = new Date();
      console.log("PendingPayment Api Call: Start Date & Time ", startDate, startDate.getMilliseconds());
      this.service.getLeads(this.searchTxt, this.fromDay.value, this.fromMonth.value, this.fromYear.value,
        this.toDay.value, this.toMonth.value, this.toYear.value, "", 'applicationPrint', currentPage).subscribe(
          res => {
            const endDate = new Date();
            console.log("PendingPayment Api Call: End Date & Time ", endDate, endDate.getMilliseconds());
            // console.log(res);
            if (res["Error"] && res["Error"] == 0) {
              this.perPagePP = res['ProcessVariables']['perPage'];
              this.currentPagePP = res['ProcessVariables']['currentPage'];
              let totalPages = res['ProcessVariables']['totalPages'];
              this.totalItemsPP = parseInt(totalPages) * this.perPagePP;
              this.newPendingPaymentDetails = res["ProcessVariables"].userDetails || [];
              // this.cds.setIsEligibilityForReviews(this.isEligibilityForReviews);
              // this.cds.setIsTBMLoggedIn(this.isTBMLoggedIn);
            } else if (res["login_required"] && res["login_required"] === true) {
              this.utilService.clearCredentials();
            } else {
              if (res["ErrorMessage"]) {
                alert(res["ErrorMessage"]);
              }
              return;
            }
          },
          error => {
            console.log(error);
          }
        );
    }
  }

  
  pageChangedPP(value) {
    let data = value;
    this.getApplicationPrint(data);
  }

}
