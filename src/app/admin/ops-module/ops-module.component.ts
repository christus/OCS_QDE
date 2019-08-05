import { Component, OnInit } from '@angular/core';
import { QdeHttpService } from '../../services/qde-http.service';

@Component({
  selector: 'app-ops-module',
  templateUrl: './ops-module.component.html',
  styleUrls: ['./ops-module.component.css']
})
export class OpsModuleComponent implements OnInit {
  uploadDoc:File;

  uploadCSVFile:string;

  viewMode:string = 'tab1';

  constructor(private qdeHttp: QdeHttpService) { }

  ngOnInit() {}

  setUploadDoc(inputValue:any) {
    this.uploadDoc = inputValue.files[0];
    this.getBase64(this.uploadDoc);
  }

  startUploadDoc() {
    const callback = (info: JSON) => {
      console.log("Info", info);
      const attachmentInfo ={
        "id": info["id"],
        "name": info["name"],
        "operation": "upload"
      }
      const documentInfo = {
        "attachment": attachmentInfo,
      };

      console.log(documentInfo);

      this.uploadToOps(documentInfo);
    }
    this.uploadOnlinePaymentRecon(callback);
  }

  downloadCSV() {
    var data = {
      userId: localStorage.getItem("userId"),
      "Submit" : ""
    }
    this.qdeHttp.documentsPaymentReconCSV(data).subscribe(
      response => {
        if (
          response["Error"] === "0" &&
          response["ProcessVariables"]["status"]) {
            // alert("Uploaded Successfully!");
            this.readBase64Content(response)
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

  uploadOnlinePaymentRecon(callback) {
    let documentInfo = {
      userId: localStorage.getItem("userId"),
      "attachment": {
        "content": this.uploadCSVFile,
        "mime": "text/csv",
        "name": this.uploadDoc["name"],
        "size": this.uploadDoc["size"],
        "operation": "upload"
      }
    }
    this.qdeHttp.uploadOnlinePaymentRecon(documentInfo).subscribe(
      response => {
        if (
          response["Error"] === "0" &&
          response["ProcessVariables"]["status"]) {
            alert("Uploaded Successfully!");
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

  readBase64Content(response) {
    // Base64 url of image trimmed one without data:image/png;base64

    const attachment =  response["ProcessVariables"]["attachment"];
    const base64 = attachment["content"];
    const mime = attachment["mime"];
    const fileName = attachment["name"];
    let that = this;


      var saveData = (function () {
        const a: HTMLElement = document.createElement("a");

        document.body.appendChild(a);
        a.style.display = 'none';
        return function (data, fileName) {

            const imageBlob = that.dataURItoBlob(base64, mime);

           const url = window.URL.createObjectURL(imageBlob);
            a["href"] = url;
            a["download"] = fileName;
            a.click();
            window.URL.revokeObjectURL(url);

        };
    }());
    
    
    saveData(base64, fileName);
  }

  uploadToMongo(file: File, callback: any) {
    this.qdeHttp.uploadToAppiyoDrive(file).subscribe(
      response => {
        if (response["ok"]) {
          //this.progress = Math.round(100 * event.loaded / event.total);
          //console.log(response);
          callback(response["info"]);
        } else {
          alert(["message"]);
        }
      },
      error => {
        console.log("Error : ", error);
        alert(error.error.message);
      }
    );
  }

  uploadToOps(documentInfo: any) {
    this.qdeHttp.uploadToOps(documentInfo).subscribe(
      response => {
        if (
          response["Error"] === "0" &&
          response["ProcessVariables"]["status"]) {
            alert("Uploaded Successfully!");
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

  dataURItoBlob(dataURI, mimeType) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: mimeType });    
    return blob;
  }

  getBase64(inputValue: any) {
    var file:File = inputValue
    var myReader:FileReader = new FileReader();
  
    myReader.onloadend = (e) => {
      this.uploadCSVFile = myReader.result.substr(myReader.result.indexOf(',') + 1);;
      console.log("result base64", this.uploadCSVFile);
    }
    myReader.readAsDataURL(file);
  }



}
