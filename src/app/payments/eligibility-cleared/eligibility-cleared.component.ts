import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QdeHttpService } from '../../services/qde-http.service';
import { CommonDataService } from '../../services/common-data.service';
import { QdeService } from '../../services/qde.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-eligibility-cleared',
  templateUrl: './eligibility-cleared.component.html',
  styleUrls: ['./eligibility-cleared.component.css']
})
export class EligibilityClearedComponent implements OnInit {

  uniqueRefNo: string;
  message:string
  showError: boolean;
  applicationId:string;
  userName:string;
  referenceNumber:string;
  queryParams:string;
  eligibleAmount:number;
  emiAmount:number;
  ocsNumber:string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private qdeHttp: QdeHttpService,
    private commonDataService: CommonDataService,
    private qdeService: QdeService
) { 

  this.route.params.subscribe(v => {
    this.applicationId = v.applicationId;
  });

  this.qdeHttp.createsession(this.applicationId, ()=>{
    this.qdeHttp.getQdeData(parseInt(this.applicationId)).subscribe(response => {


      var result = JSON.parse(response["ProcessVariables"]["response"]);
  
        console.log("Response", result);
  
        this.ocsNumber = result.application.ocsNumber || "";
        let applicantDetail = result.application.applicants[0].personalDetails;
        this.userName = applicantDetail.firstName + applicantDetail.lastName || "";
  
  
        this.submitEligibility();
    });
  });



}

  ngOnInit() {
 
  }

  isEligible : boolean = false;
  isNotEligible : boolean = false;
  isUnderReview :boolean = false;

  submitEligibility() {
    this.qdeHttp.cibilDetails(this.ocsNumber).subscribe(res => {
      if(res['ProcessVariables']['checkEligibility'].toLowerCase() == 'yes'){
        console.log("res: ", res['ProcessVariables'].toLowerCase);
        this.emiAmount = parseInt(res['ProcessVariables']['emi']);
        this.eligibleAmount = parseInt(res['ProcessVariables']['eligibilityAmount']);
        this.isEligible = true;
      }
      else if(res['ProcessVariables']['checkEligibility'].toLowerCase() == 'no'){
        this.isNotEligible = true;
      }
      else if(res['ProcessVariables']['checkEligibility'].toLowerCase() == 'review'){
        this.isUnderReview = true;
      }
      // else{
      //   alert("Server is Down!!!");
      // }
    });


  }

  
}
