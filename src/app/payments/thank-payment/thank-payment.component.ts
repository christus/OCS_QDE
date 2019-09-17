import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QdeHttpService } from 'src/app/services/qde-http.service';
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
  message:string
  showError: boolean;
  applicationId:string;
  userName:string;
  referenceNumber:string;

  queryParams: string;
  constructor( private route: ActivatedRoute,
              private router: Router,
              private qdeHttp: QdeHttpService,
              private qdeService: QdeService) {
      
    // this.commonDataService.changeMenuBarShown(false);
    // this.commonDataService.changeViewFormVisible(false);
    // this.commonDataService.changeLogoutVisible(false);
    // this.commonDataService.changeHomeVisible(false);

    // this.commonDataService.changeViewFormNameVisible(true)
    
    // this.qdeService.qdeSource.subscribe(val => {

    //   this.qde = val;
    // });
    // this.route.params.subscribe(val => {
    //   this.applicationId = val.applicationId;
    //   //this.applicantId = this.qde.application.applicants.find(v => v.applicantId == val.applicantId).applicantId;
    // });
    this.route.queryParams.subscribe(val => {
      console.log('Query params: ', this.queryParams);

      this.referenceNumber = val["ocsReferenceNo"] || "";
      this.userName = val["applicantName"] || "";

      // this.commonDataService.changeApplicantName("christusvalerian");



      this.uniqueRefNo = (val["uniqueRefNo"] == "-1") ? "FAILURE": val["uniqueRefNo"];
     
      if(this.uniqueRefNo != "FAILURE") {
        this.message = "Reference no:"+ this.uniqueRefNo
        this.showError = false;
      }else {
        this.message = val["message"];
        this.showError = true;
      }
      this.queryParams = JSON.stringify(val);

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
