import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { QdeHttpService } from 'src/app/services/qde-http.service';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { CommonDataService } from 'src/app/services/common-data.service';
import { QdeService } from 'src/app/services/qde.service';
import Qde from 'src/app/models/qde.model';
import { statuses } from 'src/app/app.constants';


interface ApplicantTermsandCondition{
  applicantId:number,
  applicantName:string,
  isMainApplicant:boolean,
  termsAndConditions:boolean
}

@Component({
  selector: 'app-successfull',
  templateUrl: './successfull.component.html',
  styleUrls: ['./successfull.component.css']
 
})
export class SuccessfullComponent implements OnInit {
  ApplicantsTAndCStatus:Array<ApplicantTermsandCondition>;
  statusList;
  successForm;
  reviewCheck;
  termsCheck;
  paymentCheck;
  data;
  appqde: Qde;
  showBackButton: boolean;
  applicationId: any;
  constructor(private qdeHttp: QdeHttpService,
              private qde : QdeService,
              private _router: Router,
              private activeRoute:  ActivatedRoute,
              private location: Location,
              private commonDataService: CommonDataService, ) {
                this.commonDataService.changeViewFormNameVisible(true);
                let routeVal = this.activeRoute.snapshot.params;
                this.appqde = this.qde.getQde();
                this.applicationId = routeVal.applicationId;
                this.backScreen();
               }

  ngOnInit() {
    const routeVales = this.activeRoute.snapshot.params;
    // const data = { "applicationId": "15183" };
    this.data = { "applicationId": routeVales.applicationId };
    this.qdeHttp.getApplicationStatus(this.data).subscribe(response => {
      this.statusList = response;
      // console.log("status List in sucessfull " + JSON.stringify(response));
     this.reviewCheck = response["ProcessVariables"]["reviewForm"];
     this.termsCheck = response["ProcessVariables"]["termsAndConditions"];
     this.paymentCheck = response["ProcessVariables"]["loginFeePaid"];
    this.ApplicantsTAndCStatus = response["ProcessVariables"]["applicantTandCStatus"];
    console.log(this.ApplicantsTAndCStatus);
    

    });

  }
  backScreen() {
    let status = this.appqde.application.status;
    if(status  ==  parseInt(statuses['QDE Started']) ) {
    // this.location.back();
    // this._router.navigate(["/applicant/", this.data.applicationId]);
    this.showBackButton = true;
    }else{
    this.showBackButton = false;
    }
  }

}
