import { Component, OnInit } from '@angular/core';
import { CommonDataService } from 'src/app/services/common-data.service';
import { QdeHttpService } from 'src/app/services/qde-http.service';
import { NgForm } from '@angular/forms';
import Qde from 'src/app/models/qde.model';
import { ActivatedRoute, Router } from '@angular/router';
import { QdeService } from 'src/app/services/qde.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-online-summary',
  templateUrl: './online-summary.component.html',
  styleUrls: ['./online-summary.component.css']
})
export class OnlineSummaryComponent implements OnInit {

  qde: Qde;
  applicationId: string;
  applicationStatus: string = "8";
  showSuccessModal:boolean;
  showErrorModal:boolean;
  constructor(
              private route: ActivatedRoute,
              private router: Router,
              private qdeHttp: QdeHttpService,
              private commonDataService: CommonDataService,
              private qdeService: QdeService
  ) { 
    this.commonDataService.changeMenuBarShown(false);
    this.commonDataService.changeViewFormVisible(false);
    this.commonDataService.changeLogoutVisible(false);
    this.commonDataService.changeHomeVisible(false);

    this.route.params.subscribe(v => {
      this.applicationId = v.applicationId;
    });
    
    this.qdeHttp.createsession(this.applicationId, ()=>{
      this.qdeHttp.getQdeData(parseInt(this.applicationId)).subscribe(response => {
          
        this.qdeService.qdeSource.subscribe(val => {
          this.qde = val;
        });

        var result = JSON.parse(response["ProcessVariables"]["response"]);

        this.qdeService.setQde(result);

        this.submitEligibility();
      });
    })
   
  }

  ngOnInit() {
  }

firstName:string;
lastName:string;
applicationNumber:string;
panNumber:string;
loginFee:number;
taxFee:number;
taxPercent:number;
totalFee:number;
paymentGatewayUrl:string;


submitEligibility() {

  this.qdeHttp.loginFee(parseInt(this.applicationId)).subscribe(res => {
    console.log("res: ", res['ProcessVariables']);
    // console.log(this.firstname)
     this.firstName = res['ProcessVariables']['firstName'];
     this.lastName = res['ProcessVariables']['lastName'];
     this.applicationNumber = res['ProcessVariables']['ocsNumber'];
     this.panNumber = res['ProcessVariables']['panNumber'];
     this.loginFee = res['ProcessVariables']['loginFee'];
     this.taxFee = res['ProcessVariables']['taxAmount'];
     this.taxPercent = res['ProcessVariables']['taxPercentage']
     this.totalFee = res['ProcessVariables']['totalAmount'];

     this.paymentGatewayUrl = res['ProcessVariables']['paymentGatewayURL'];
  });
}

proceedToPayment() {
  window.open(this.paymentGatewayUrl, '_blank');

}
// submitPaymentForm(form: NgForm) {
//   console.log("Payment gateway")
//   this.qdeHttp.dummyPaymentGatewayAPI().subscribe(res => {
//     if(res['ProcessVariables']['isPaymentSuccessful'] == true) {
//       this.showSuccessModal = true;
//       this.emiAmount = res['ProcessVariables']['emi'];
//       this.eligibleAmount = res['ProcessVariables']['eligibilityAmount'];
//     }
//     else if(res['ProcessVariables']['isPaymentSuccessful'] == false) {
//       this.showErrorModal = true;
//     }
//    });
// }

}
