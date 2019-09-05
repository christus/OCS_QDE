import { Component, OnInit, AfterViewInit } from '@angular/core';
import Qde from 'src/app/models/qde.model';
import { ActivatedRoute, Router } from '@angular/router';
import { QdeHttpService } from 'src/app/services/qde-http.service';
import { CommonDataService } from 'src/app/services/common-data.service';
import { QdeService } from 'src/app/services/qde.service';

@Component({
  selector: 'app-thanks-t-and-c',
  templateUrl: './thanks-t-and-c.component.html',
  styleUrls: ['./thanks-t-and-c.component.css']
})
export class ThanksTAndCComponent implements OnInit, AfterViewInit {
  qde: Qde;
  applicationId: string;
  applicantId: string;
  applicationStatus: string = "15";
  constructor(
              private route: ActivatedRoute,
              private router: Router,
              private qdeHttp: QdeHttpService,
              private commonDataService: CommonDataService,
              private qdeService: QdeService
  ) { 
    this.commonDataService.changeMenuBarShown(false);
    this.qdeService.qdeSource.subscribe(val => {
      this.qde = val;
    });
    this.route.params.subscribe(val => {
      this.applicationId = val.applicationId;
      // this.applicantId = this.qde.application.applicants.find(v => v.applicantId == val.applicantId).applicantId;
      this.applicantId = val.applicantId;
    });
  }

  ngOnInit() {
  }

  // tandcStatus(){
  //   this.route.params.subscribe((params) => {
  //     this.qdeHttp.getStatusApi(params.applicationId,status).subscribe((response)=>{
  //       let sms = response["ProcessVariables"];
  //       this.qde.application.applicationId = sms["applicationId"];
  //         console.log("Response", response)
  //     })
  //   });
  // }

  ngAfterViewInit() {
    history.pushState(null, null, '/static/terms-and-conditions/thankt&c/'+this.applicationId+'/'+this.applicantId);
    let dude = this;
    window.addEventListener('popstate', function(event) {
    history.pushState(null, null, '/static/terms-and-conditions/thankt&c/'+dude.applicationId+'/'+dude.applicantId);
    });
  }


}
