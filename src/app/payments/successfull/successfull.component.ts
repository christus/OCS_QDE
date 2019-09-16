import { Component, OnInit } from '@angular/core';
import { QdeHttpService } from 'src/app/services/qde-http.service';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-successfull',
  templateUrl: './successfull.component.html',
  styleUrls: ['./successfull.component.css']
})
export class SuccessfullComponent implements OnInit {
  statusList;
  successForm;
  reviewCheck;
  termsCheck;
  paymentCheck;
  constructor(private qdeHttp: QdeHttpService,
              private activeRoute:  ActivatedRoute,
              private location: Location ) { }

  ngOnInit() {
    const routeVales = this.activeRoute.snapshot.params;
    // const data = { "applicationId": "15183" };
    const data = { "applicationId": routeVales.applicationId };
    this.qdeHttp.getApplicationStatus(data).subscribe(response => {
      this.statusList = response;
      // console.log("status List in sucessfull " + JSON.stringify(response));
     this.reviewCheck = response["ProcessVariables"]["reviewForm"];
     this.termsCheck = response["ProcessVariables"]["termsAndConditions"];
     this.paymentCheck = response["ProcessVariables"]["loginFeePaid"];

    });

  }
  backScreen(){
    this.location.back();
  }

}
