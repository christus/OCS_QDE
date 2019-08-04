import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QdeHttpService } from 'src/app/services/qde-http.service';
import { CommonDataService } from 'src/app/services/common-data.service';
import { QdeService } from 'src/app/services/qde.service';
import Qde from 'src/app/models/qde.model';

@Component({
  selector: 'app-thank-payment',
  templateUrl: './thank-payment.component.html',
  styleUrls: ['./thank-payment.component.css']
})
export class ThankPaymentComponent implements OnInit {
  // qde: Qde;
  // applicationId: string;
  // applicantId: string;

  uniqueRefNo: string;

  queryParams: string;
  constructor( private route: ActivatedRoute,
              private router: Router,
              private qdeHttp: QdeHttpService,
              private commonDataService: CommonDataService,
              private qdeService: QdeService) {
      
    this.commonDataService.changeMenuBarShown(false);
    this.commonDataService.changeViewFormVisible(false);
    this.commonDataService.changeLogoutVisible(false);
    // this.qdeService.qdeSource.subscribe(val => {

    //   this.qde = val;
    // });
    // this.route.params.subscribe(val => {
    //   this.applicationId = val.applicationId;
    //   //this.applicantId = this.qde.application.applicants.find(v => v.applicantId == val.applicantId).applicantId;
    // });
    this.route.queryParams.subscribe(val => {
      console.log('Query params: ', this.queryParams);
      this.uniqueRefNo = (val["uniqueRefNo"] == "-1") ? "Failure": val["uniqueRefNo"];
      this.queryParams = JSON.stringify(val);
      // this.qdeHttp.executePaymentWF(this.queryParams).subscribe(response => {
      //   if (
      //     response["Error"] === "0" &&
      //     response["ProcessVariables"]["status"] ) {
      //       let applicationId = response["ProcessVariables"]["applicationId"];

      //       this.uniqueRefNo = response["ProcessVariables"]["uniqueRefNo"];
      //       let applicationStatus = "20";
      //       this.setStatus(applicationId, applicationStatus);
      //   } else {
      //     if (response["ErrorMessage"]) {
      //       alert(response["ErrorMessage"]);
      //     }
      //   }
      // });
    });
  }

  setStatus(applicationId, applicationStatus) {
    this.qdeHttp.setStatusApi(applicationId, applicationStatus).subscribe(res => {
       alert("Login fee paid");
    }, err => {});
  }


  ngOnInit() {
  }

  // ngAfterViewInit() {
  //   history.pushState(null, null, '/payments/thankpayment/'+this.applicationId);
  //   let dude = this;
  //   window.addEventListener('popstate', function(event) {
  //   history.pushState(null, null, '/payments/thankpayment/'+dude.applicationId);
  //   });
  // }
}
