import { Component, OnInit } from '@angular/core';
import { QdeHttpService } from '../../services/qde-http.service';

@Component({
  selector: 'app-ops-module',
  templateUrl: './ops-module.component.html',
  styleUrls: ['./ops-module.component.css']
})
export class OpsModuleComponent implements OnInit {
  uploadDoc:File;
  viewMode:string = 'tab1';
  constructor(private qdeHttp: QdeHttpService) { }

  ngOnInit() {}

  setUploadDoc(files:any) {
    console.log(files.item(0));
    this.uploadDoc = files.item(0);
    alert("upload page");
  }

  startUploadDoc() {
    const callback = (info: JSON) => {
      console.log("Info", info);
      const attachmentInfo ={
        "id": "",
        "name": ""
      }
      const documentInfo = {
        "attachment": attachmentInfo,
      };

      console.log(documentInfo);

      this.uploadToOps(documentInfo);
    }
    this.uploadToMongo(this.uploadDoc, callback);
  }

  showPaymentDownload() {
    alert("upload download");
  }


  uploadToMongo(file: File, callback: any) {
    this.qdeHttp.uploadToAppiyoDrive(file).subscribe(
      response => {
        if (response["ok"]) {
          //this.progress = Math.round(100 * event.loaded / event.total);
          //console.log(response);
          callback(response["info"]);
        } else {
          console.log(response["ErrorMessage"]);
        }
      },
      error => {
        console.log("Error : ", error);
        alert(error.statusText);
      }
    );
  }

  uploadToOps(documentInfo: any) {
    this.qdeHttp.uploadToOps(documentInfo).subscribe(
      response => {
        if (
          response["Error"] === "0" &&
          response["ProcessVariables"]["status"]
        ) {
          //alert("Uploaded Successfully!");

          

        } else {
          if (response["ErrorMessage"]) {
            console.log("Response: " + response["ErrorMessage"]);
          } else if (response["ProcessVariables"]["errorMessage"]) {
            console.log(
              "Response: " + response["ProcessVariables"]["errorMessage"]
            );
          }
        }
      },
      error => {
        console.log("Error : ", error);
      }
    );
  }
}
