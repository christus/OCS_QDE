import { AutoLogoutService } from './../../services/AutoLogoutService';
import { QdeService } from './../../services/qde.service';
import { environment } from 'src/environments/environment';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { QdeHttpService } from 'src/app/services/qde-http.service';
import { CommonDataService } from 'src/app/services/common-data.service';
import { statuses } from '../../app.constants';


@Component({
  selector: 'app-icici-terms',
  templateUrl: './icici-terms.component.html',
  styleUrls: ['./icici-terms.component.css']
})
export class IciciTermsComponent implements OnInit {

  applicationId: string;
  applicantId: string;

  constructor(private route: ActivatedRoute, private router: Router,  private qdeService: QdeService, private qdeHttpService: QdeHttpService, 
    private commonDataService: CommonDataService,
  private als: AutoLogoutService ) {
    var that = this;

    als.stopInterval();

    this.route.params.subscribe(val => {
      if(val['applicationId'] != null) {
        this.applicationId = val['applicationId'];
      }

      if(val['applicantId'] != null) {
        this.applicantId = val['applicantId'];
      }
    });

    if(this.router.url.search('auto-login') != 0) {
      this.qdeHttpService.createsession(this.applicationId, () =>{
        if(this.applicationId != null && this.applicantId != null) {
          this.getQde(this.applicationId, function (){
            that.router.navigate(['/static/terms-and-conditions/proceed-to-review', that.applicationId, that.applicantId]);
          });
        }
      });
    }
    
  }


  

  ngOnInit() {
  }


  async getQde(applicationId, callback) {

    let appData = await this.qdeHttpService.getQdeData(applicationId).toPromise();

    let response = JSON.parse(appData['ProcessVariables']['response']);

    this.qdeService.setQde(response);

    const status = response.application.status;

    this.applicantId = this.route.snapshot.params["applicantId"];
    this.applicationId = this.route.snapshot.params["applicationId"];
    console.log("applicant ID  ", this.applicantId);

    const applicatonData = response.application.applicants.find(v => v.applicantId == this.applicantId);
    
    this.commonDataService.changeApplicantId(this.applicantId);

    console.log("async result:", appData);

    if(status == statuses['Terms and conditions accepted']) {
      this.router.navigate(['static/terms-and-conditions/thankt&c', this.applicationId, this.applicantId]);
      return;
    } else if (applicatonData["termsAndConditions"]) {
      this.router.navigate(['static/terms-and-conditions/thankt&c', this.applicationId, this.applicantId]);
      return;
    }else {
      callback();
    }

    
    // this.qdeHttpService.setQde(JSON.parse(this.route.snapshot.data['qde']['ProcessVariables']['response']));

    // const status = JSON.parse(this.route.snapshot.data['qde']['ProcessVariables']['response']).application.status;

  }

}
