import { Component, OnInit } from '@angular/core';
import { QdeService } from 'src/app/services/qde.service';
import { ActivatedRoute } from '@angular/router';
import Qde from 'src/app/models/qde.model';

@Component({
  selector: 'app-proceed-to-review-form',
  templateUrl: './proceed-to-review-form.component.html',
  styleUrls: ['./proceed-to-review-form.component.css']
})
export class ProceedToReviewFormComponent implements OnInit {

  applicationId: string;
  applicantId: string;
  qde: Qde;

  constructor(private qdeService: QdeService,
              private route: ActivatedRoute) {

    this.qdeService.qdeSource.subscribe(val => {
      this.qde = val;
    });

    console.log("this.route.snapshot.data['qde']", this.route.snapshot.data['qde']);
    this.qdeService.setQde(JSON.parse(this.route.snapshot.data['qde']['ProcessVariables']['response']));

    this.route.params.subscribe(val => {
      this.applicationId = val.applicationId;
      this.applicantId = this.qde.application.applicants.find(v => v.applicantId == val.applicantId).applicantId;
    });
  }

  ngOnInit() {
  }

}
