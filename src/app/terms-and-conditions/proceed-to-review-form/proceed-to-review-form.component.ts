import { Component, OnInit } from '@angular/core';
import { QdeService } from 'src/app/services/qde.service';
import { ActivatedRoute, Router } from '@angular/router';
import Qde from 'src/app/models/qde.model';
import { CommonDataService } from 'src/app/services/common-data.service';
import { QdeHttpService } from 'src/app/services/qde-http.service';
import { statuses } from '../../app.constants';
import { UtilService } from '../../services/util.service';
import { t } from '@angular/core/src/render3';

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
              private utilService: UtilService,
              private router: Router) {

    this.qdeService.qdeSource.subscribe(val => {
      this.qde = val;
    });

    console.log("this.route.snapshot.data['qde']", this.route.snapshot.data['qde']);
    this.qdeService.setQde(JSON.parse(this.route.snapshot.data['qde']['ProcessVariables']['response']));

    const status = JSON.parse(this.route.snapshot.data['qde']['ProcessVariables']['response']).application.status;
    this.applicantId = this.route.snapshot.params["applicantId"];
    this.applicationId = this.route.snapshot.params["applicationId"];
    console.log("applicant ID  ", this.applicantId);
    const applicatonData = this.qde.application.applicants.find(v => v.applicantId == this.applicantId);
    this.commonDataService.changeApplicantId(this.applicantId);
    console.log("application qde values ", this.qde.application);
    if(status == statuses['Terms and conditions accepted']) {
      this.router.navigate(['static/terms-and-conditions/thankt&c', this.applicationId, this.applicantId]);
      return;
    } else if (applicatonData["termsAndConditions"]) {
      this.router.navigate(['static/terms-and-conditions/thankt&c', this.applicationId, this.applicantId]);
      return;
    }
    


    this.route.params.subscribe(val => {
      this.applicationId = val.applicationId;
      // this.applicantId = this.qde.application.applicants.find(v => v.applicantId == val.applicantId).applicantId;
      this.applicantId = val.applicantId;
    });
  }

  ngOnInit() {

    this.qdehttpService.createsession(this.applicationId, ()=>{
      this.qdehttpService.getQdeData(parseInt(this.applicantId));
    });
  }

}
