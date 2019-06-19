import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QdeHttpService } from 'src/app/services/qde-http.service';
import { CommonDataService } from 'src/app/services/common-data.service';
import { QdeService } from 'src/app/services/qde.service';
import Qde from 'src/app/models/qde.model';

@Component({
  selector: 'app-declaration2',
  templateUrl: './declaration2.component.html',
  styleUrls: ['./declaration2.component.css']
})
export class Declaration2Component implements OnInit {

  qde: Qde;
  applicationId: string;
  applicationStatus: string = "8";
  constructor(
              private route: ActivatedRoute,
              private router: Router,
              private qdeHttp: QdeHttpService,
              private commonDataService: CommonDataService,
              private qdeService: QdeService
  ) { 
    this.commonDataService.changeMenuBarShown(false);

    this.route.params.subscribe(v => {
      this.applicationId = v.applicationId;
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

  acceptBtn() {
    this.qdeHttp.setStatusApi(this.applicationId, this.applicationStatus).subscribe(res => {}, err => {});
  }
}
