import { Component, OnInit } from '@angular/core';
import { QdeHttpService } from 'src/app/services/qde-http.service';
import { ActivatedRoute } from '@angular/router';
import { json } from 'sjcl';

@Component({
  selector: 'app-form-print',
  templateUrl: './form-print.component.html',
  styleUrls: ['./form-print.component.css']
})
export class FormPrintComponent implements OnInit {

  constructor(private qdeHttpService: QdeHttpService,
              private activateRoute: ActivatedRoute) { }
    myApplicationData;
    applicants;
    application

  ngOnInit() {
 
      this.myApplicationData = this.activateRoute.snapshot.data['qde']["ProcessVariables"]["response"];
      console.log("my Application Data ",this.myApplicationData);
     this.application = JSON.parse(this.myApplicationData);
     this.applicants =this.application["application"]["applicants"];
     console.log("my Applicats Data",this.applicants );
  }

  printPage() {
    window.print();
  }

  printToCart(printSectionId: string){
    let popupWinindow
    let innerContents = document.getElementById(printSectionId).innerHTML;
    popupWinindow = window.open('', '_blank', 'width=600,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
    popupWinindow.document.open();
    popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + innerContents + '</html>');
    popupWinindow.document.close();
}

}
