import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonDataService } from '../services/common-data.service';

@Component({
  selector: 'app-addtional-service',
  templateUrl: './addtional-service.component.html',
  styleUrls: ['./addtional-service.component.css']
})
export class AddtionalServiceComponent implements OnInit {
  isHide: boolean;
  showPrint: boolean;
  // applicationId;
  constructor(private activatedRoute: ActivatedRoute,
              private cds: CommonDataService) { 
    // this.applicationId = this.activatedRoute.params["applicationId"];
    this.cds.showPrint$.subscribe(value => this.showPrint = value);
  }

  ngOnInit() {
  }

//   printToCart(printSectionId: string){
//     let popupWinindow
//     let innerContents = document.getElementById(printSectionId).innerHTML;
//     popupWinindow = window.open('', '_blank', 'width=600,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
//     popupWinindow.document.open();
//     popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + innerContents + '</html>');
//     popupWinindow.document.close();
// }

printPage() {
  window.print();
  return false;
}

}
