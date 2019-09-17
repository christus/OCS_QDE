import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QdeHttpService } from '../../services/qde-http.service';
import { CommonDataService } from '../../services/common-data.service';
import { QdeService } from '../../services/qde.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-eligibility-not-cleared',
  templateUrl: './eligibility-not-cleared.component.html',
  styleUrls: ['./eligibility-not-cleared.component.css']
})
export class EligibilityNotClearedComponent implements OnInit {

  ngOnInit() {
 
  }
  
  userName:string;
  ocsNumber:string;
  queryParams:string;
  applicationId:string;


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

  const data = {
    email: environment.userName,
    password: environment.password
  };

  this.qdeHttp.authenticate(data).subscribe(
    res => {
    console.log("response");
    console.log("login-response: ",res);
    this.commonDataService.setLogindata(data);
    localStorage.setItem("token", res["token"] ? res["token"] : "");

    this.qdeHttp.getQdeData(parseInt(this.applicationId)).subscribe(response => {


      var result = JSON.parse(response["ProcessVariables"]["response"]);

        console.log("Response", result);

        this.ocsNumber = result.application.ocsNumber || "";
        let applicantDetail = result.application.applicants[0].personalDetails;
        this.userName = applicantDetail.firstName + applicantDetail.lastName || "";


    });

  },
  error => {
    console.log(error);
  });



}

}
