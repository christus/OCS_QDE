import { Component, OnInit } from '@angular/core';
import { CommonDataService } from 'src/app/services/common-data.service';
import { QdeHttpService } from 'src/app/services/qde-http.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-online-summary',
  templateUrl: './online-summary.component.html',
  styleUrls: ['./online-summary.component.css']
})
export class OnlineSummaryComponent implements OnInit {

  constructor(private commonDataService: CommonDataService, private qdeHttp: QdeHttpService) {
    this.commonDataService.changeMenuBarShown(false);
    this.commonDataService.changeViewFormNameVisible(true);
    this.commonDataService.changeViewFormVisible(false);
    this.commonDataService.changeLogoutVisible(false);
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
