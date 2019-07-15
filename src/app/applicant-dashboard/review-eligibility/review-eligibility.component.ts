import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonDataService } from 'src/app/services/common-data.service';
import { Subscription } from 'rxjs';
import { QdeHttpService } from 'src/app/services/qde-http.service';
import { statuses } from '../../app.constants';

@Component({
  selector: 'app-review-eligibility',
  templateUrl: './review-eligibility.component.html',
  styleUrls: ['./review-eligibility.component.css']
})
export class ReviewEligibilityComponent implements OnInit {

  isEligibilityForReviewsSub: Subscription;
  elibilityReviewAPISub: Subscription;
  isEligibilityForReview: boolean
  applicationId: string;
  eligibilityAssignedTo: string;
  eligibilityDate: string;
  listOfApplicantsNameAndCutOff: Array<{name: string, aboveCutOff: string}>;
  maxEMI: number;
  eligibilityAmount: number;
  revisedEligibilityAmount: number;
  revisedMaxEMI: number;
  loanType: string;

  constructor(private route: ActivatedRoute,
              private commonDataService: CommonDataService,
              private qdeHttp: QdeHttpService,
              private _router: Router) {

    console.log("review Eligibility Data: ", this.route.snapshot.params['reviewEligibilityData']);
    

    this.route.params.subscribe(value => {
      if(value['applicationId'] != null) {

        this.applicationId = value['applicationId'];

        if(this.isEligibilityForReviewsSub != null) {
          this.isEligibilityForReviewsSub.unsubscribe();
        }
        // To Show Button Accept/Reject Form if TBM (Check leads.component.html)
        this.isEligibilityForReviewsSub = this.commonDataService.isEligibilityForReviews.subscribe(eli => {
          try {
            this.isEligibilityForReview = eli.find(v => v.applicationId == this.applicationId)['isEligibilityForReview'];
          } catch(ex) {
            this._router.navigate(['/leads']);
          }
          if(this.isEligibilityForReview == true) {

          

            /************************************
            * Uncomment below for UAT/Production
            ************************************/
            if(this.elibilityReviewAPISub != null) {
              this.elibilityReviewAPISub.unsubscribe();
            }
  
            this.elibilityReviewAPISub = this.qdeHttp.getElibilityReview(this.applicationId).subscribe(res => {
              let response = res['ProcessVariables'];
              this.eligibilityAssignedTo = response['assignedTo'];
              this.eligibilityDate = response['dateCreated'].split('-')[2]+"-"+response['dateCreated'].split('-')[1]+"-"+response['dateCreated'].split('-')[0];
              this.listOfApplicantsNameAndCutOff = response['listOfApplicantsNameAndCutOff'].map(v => {
                return {
                  name: v['firstName']+" "+v['lastName'],
                  aboveCutOff: v['aboveCutOff'] == '1' ? 'Yes': 'No'
                }
              });
              this.maxEMI = response['maxEMI'];
              this.eligibilityAmount = response['eligibilityAmount'];
              this.revisedEligibilityAmount = response['revisedEligibilityAmount'];
              this.revisedMaxEMI = response['revisedMaxEMI'];
              this.loanType = response['loanType'];

            });
          } else {
            this._router.navigate(['/leads']);
          }
        });

      }
    });
  }

  ngOnInit() {
  }

  applicationAccepted() {
    this.qdeHttp.setStatusApi(this.applicationId, statuses['Eligibility Accepted']).subscribe(res => {this._router.navigate(['/leads'])}, err => {});
  }

  applicationRejected() {
    this.qdeHttp.setStatusApi(this.applicationId, statuses['Eligibility Rejected']).subscribe(res => {this._router.navigate(['/leads'])}, err => {});
  }

  ngOnDestroy() {
    if(this.elibilityReviewAPISub != null) {
      this.elibilityReviewAPISub.unsubscribe();
    }
    if(this.isEligibilityForReviewsSub != null) {
      this.isEligibilityForReviewsSub.unsubscribe();
    }
  }
}
