import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

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
  eligibleAmount:string;
  emiAmount:string;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe(val => {
      console.log('Query params: ', this.queryParams);
  
  
      this.referenceNumber = val["ocsReferenceNo"] || "";
      this.userName = val["applicantName"] || "";
      this.eligibleAmount = val["eligibleAmount"] || "";
      this.emiAmount = val["emiAmount"] || "";
  
  
  
      this.uniqueRefNo = (val["uniqueRefNo"] == "-1") ? "FAILURE": val["uniqueRefNo"];
     
      if(this.uniqueRefNo != "FAILURE") {
        this.message = "Reference no:"+ this.uniqueRefNo
        this.showError = false;
      }else {
        this.message = val["message"];
        this.showError = true;
      }
      this.queryParams = JSON.stringify(val);

  
    });
  
  }

  
}
