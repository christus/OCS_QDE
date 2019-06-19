import { Component, OnInit } from '@angular/core';
import { CommonDataService } from 'src/app/services/common-data.service';
import { QdeHttpService } from 'src/app/services/qde-http.service';
import { NgForm } from '@angular/forms';
import Qde from 'src/app/models/qde.model';
import { ActivatedRoute, Router } from '@angular/router';
import { QdeService } from 'src/app/services/qde.service';

@Component({
  selector: 'app-online-summary',
  templateUrl: './online-summary.component.html',
  styleUrls: ['./online-summary.component.css']
})
export class OnlineSummaryComponent implements OnInit {

  qde: Qde;
  applicationId: string;
  applicationStatus: string = "8";
  constructor(
              private route: ActivatedRoute,
              private router: Router,
              private qdeHttp: QdeHttpService,
              private commonDataService: CommonDataService,
              private qdeService: QdeService
  ) { 
    this.commonDataService.changeMenuBarShown(false);

    this.route.params.subscribe(v => {
      this.applicationId = v.applicationId;
    });
  }

  ngOnInit() {
  }

showSuccessModal: boolean = false;
showErrorModal: boolean = false;
emiAmount: number;
eligibleAmount: number;

submitPaymentForm(form: NgForm) {
  console.log("Payment gateway")
  this.qdeHttp.dummyPaymentGatewayAPI().subscribe(res => {
    if(res['ProcessVariables']['isPaymentSuccessful'] == true) {
      this.showSuccessModal = true;
      this.emiAmount = res['ProcessVariables']['emi'];
      this.eligibleAmount = res['ProcessVariables']['eligibilityAmount'];
    }
    else if(res['ProcessVariables']['isPaymentSuccessful'] == false) {
      this.showErrorModal = true;
    }
   });
}

}
