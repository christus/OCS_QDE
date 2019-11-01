import { Component, OnInit } from '@angular/core';
import { QdeService } from 'src/app/services/qde.service';
import { ActivatedRoute, Router } from '@angular/router';
import Qde from 'src/app/models/qde.model';
import { CommonDataService } from 'src/app/services/common-data.service';
import { QdeHttpService } from 'src/app/services/qde-http.service';
import { statuses } from '../../app.constants';
import { UtilService } from '../../services/util.service';

@Component({
  selector: 'app-proceed-to-review-form',
  templateUrl: './proceed-to-review-form.component.html',
  styleUrls: ['./proceed-to-review-form.component.css']
})
export class ProceedToReviewFormComponent implements OnInit {

  applicationId: string;
  applicantId: string;
  qde: Qde;

  constructor(
              private commonDataService: CommonDataService, 
              private qdehttpService: QdeHttpService,
              private qdeService: QdeService,
              private route: ActivatedRoute,
              private utilService: UtilService) {

    this.qdeService.qdeSource.subscribe(val => {
      this.qde = val;
    });

    console.log("this.route.snapshot.data['qde']", this.route.snapshot.data['qde']);
    this.qdeService.setQde(JSON.parse(this.route.snapshot.data['qde']['ProcessVariables']['response']));

    const status = JSON.parse(this.route.snapshot.data['qde']['ProcessVariables']['response']).application.status;
    this.applicantId = this.route.snapshot.params["applicantId"];
    console.log("applicant ID  ", this.applicantId);
    const applicatonData = this.qde.application.applicants.find(v => v.applicantId == this.applicantId);

    console.log("application qde values ", this.qde.application);
    if(status == statuses['Terms and conditions accepted']) {
      alert("Terms and condition already accepted");
      this.utilService.clearCredentials();
      return;
    } else if (applicatonData["termsAndConditions"]) {
       alert("Terms and condition already accepted");
      this.utilService.clearCredentials();
      return;
    }
    


    this.route.params.subscribe(val => {
      this.applicationId = val.applicationId;
      // this.applicantId = this.qde.application.applicants.find(v => v.applicantId == val.applicantId).applicantId;
      this.applicantId = val.applicantId;
    });
  }

  ngOnInit() {

    this.qdehttpService.duplicateLogin().subscribe(
      res => {
        console.log(res);
        localStorage.setItem("token", res["token"] ? res["token"] : "");
        this.qdehttpService.getQdeData(parseInt(this.applicantId));

        // this.commonDataService.changeMenuBarShown(false);
        // this.commonDataService.changeViewFormVisible(false);
        // this.commonDataService.changeLogoutVisible(false);
      },
      error => {
        console.log(error);
      }
    );
  }

}
