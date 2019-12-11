import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QdeHttpService } from 'src/app/services/qde-http.service';
import { CommonDataService } from 'src/app/services/common-data.service';
import { QdeService } from 'src/app/services/qde.service';
import Qde from 'src/app/models/qde.model';


@Component({
  selector: 'app-thank-payment-eligibilty',
  templateUrl: './thank-payment-eligibilty.component.html',
  styleUrls: ['./thank-payment-eligibilty.component.css']
})
export class ThankPaymentEligibiltyComponent  {

  qde: Qde;
  applicationId: string;
  applicantId: string;

  queryParams: string;
  constructor( private route: ActivatedRoute,
              private router: Router,
              private qdeHttp: QdeHttpService,
              private commonDataService: CommonDataService,
              private qdeService: QdeService) {
      
    this.commonDataService.changeMenuBarShown(false);
    this.commonDataService.changeViewFormVisible(false);
    this.commonDataService.changeLogoutVisible(false);
    this.commonDataService.changeHomeVisible(false);
    this.commonDataService.changeViewFormNameVisible(false);

    this.qdeService.qdeSource.subscribe(val => {

      this.qde = val;
    });
    this.route.params.subscribe(val => {
      this.applicationId = val.applicationId;
      //this.applicantId = this.qde.application.applicants.find(v => v.applicantId == val.applicantId).applicantId;
    });
    this.route.queryParams.subscribe(val => {
      this.queryParams = JSON.stringify(val);
      console.log('Query params: ', this.queryParams);
    });

  }
}

