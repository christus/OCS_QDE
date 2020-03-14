import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { QdeHttpService } from "src/app/services/qde-http.service";
import { ActivatedRoute } from "@angular/router";
import { json } from "sjcl";
import { DomSanitizer } from "@angular/platform-browser";
import Qde from "src/app/models/qde.model";
import { QdeService } from "src/app/services/qde.service";
import { CommonDataService } from "src/app/services/common-data.service";

@Component({
  selector: "app-form-print",
  templateUrl: "./form-print.component.html",
  styleUrls: ["./form-print.component.css"],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class FormPrintComponent implements OnInit {
  constructor(
    private qdeHttpService: QdeHttpService,
    private activateRoute: ActivatedRoute,
    private domSanitizer: DomSanitizer,
    private qdeService: QdeService,
    private cds: CommonDataService
  ) {
    this.qde = this.qdeService.defaultValue;
  }

  myApplicationData;
  qde: Qde;
  applicants;
  application;
  applicantImage = [];
  applicationNo;
  printData;
  leadId;
  brokerId = "";
  rmId = "";
  bankEmployeeId = "";
  ngOnInit() {
    this.printData = this.activateRoute.snapshot.data["qde"][
      "ProcessVariables"
    ];
    if (this.printData["status"]) {
      this.cds.changeshowPrint(true);
      // this.myApplicationData = this.activateRoute.snapshot.data['qde']["ProcessVariables"]["response"];
      this.myApplicationData = this.printData["response"];
      console.log("my Application Data ", this.myApplicationData);
      this.application = JSON.parse(this.myApplicationData);

      this.qdeService.setQde(this.application);

      this.applicants = this.application["application"]["applicants"];
      console.log("my Applicats Data", this.applicants);
      //  this.applicantImage = "data:image/png;base64,"+ this.applicants["documents"][0]["documentData"];documentName
      if (this.application.application.roleName == "DMA") {
        this.brokerId = this.application.application.userId;
        this.rmId = this.application.application.reportingToId;
        this.bankEmployeeId = "";
      } else {
        this.brokerId = "";
        this.bankEmployeeId = this.application.application.userId;
        this.rmId = this.application.application.rmId;
      }

      this.applicants.forEach(element => {
        if (element["documents"].length > 0) {
          this.applicantImage.push(
            this.domSanitizer.bypassSecurityTrustUrl(
              "data:image/png;base64," + element["documents"][0]["documentData"]
            )
          );
        }
      });
      // this.applicantImage =  "data:image/png;base64,"+  this.applicants[0]["documents"][0]["documentData"];
      // this.applicantImage =this.domSanitizer.bypassSecurityTrustUrl(this.applicantImage);
      console.log("my Applicats photo", this.applicantImage);
    }
  }

  printPage() {
    window.print();
  }

  // printToCart(printSectionId: string) {
  //   let popupWinindow
  //   let innerContents = document.getElementById(printSectionId).innerHTML;
  //   popupWinindow = window.open('', '_blank', 'width=600,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
  //   popupWinindow.document.open();
  //   popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + innerContents + '</html>');
  //   popupWinindow.document.close();
  // }
  getFormattedDate(date) {
    console.log("in date conversion " + date);

    let dateFormat: Date = date;
    let year = dateFormat.getFullYear();
    let month = dateFormat.getMonth() + 1;
    let month1 = month < 10 ? "0" + month.toString() : "" + month.toString(); // ('' + month) for string result
    let day = date.getDate();
    day = day < 10 ? "0" + day : "" + day; // ('' + month) for string result
    let formattedDate = year + "-" + month1 + "-" + day;
    // console.log("final Value "+ formattedDate);
    return formattedDate;
  }
}
