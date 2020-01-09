import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { QdeHttpService } from '../../services/qde-http.service';

@Component({
  selector: 'app-check-payment',
  templateUrl: './check-payment.component.html',
  styleUrls: ['./check-payment.component.css']
})
export class CheckPaymentComponent implements OnInit {

  uploadDoc:File;

  uploadCSVFile:string;

  viewMode:string = 'offtab1';

  errorMsg:string;

  uploadFileName: string;

  startDate : Date | string;

  endDate : Date | string;
  isErrorModal: boolean;
  errorMsgModal: string;
  isFileSelected : boolean = false;
  @ViewChild("paymentUploadPic") paymentUploadPic : ElementRef;

  constructor(private qdeHttp: QdeHttpService) {
    let fromDate = new Date();
    this.startDate = fromDate.toISOString().substr(0, 10);
    let toDate = new Date();
    this.endDate = toDate.toISOString().substr(0, 10);
   }

  ngOnInit() {
    // let fromDate = new Date();
    // // this.startDate = new Date();
    // // fromDate.setDate(fromDate.getDate()- 7);
    // let month = fromDate.getUTCMonth()+1;
    // let date = fromDate.getDate();
    // let year = fromDate.getFullYear();
    // this.startDate = year+"/"+month+"/"+date;
    // // this.endDate = new Date();
    // let toDate = new Date();
    // month = toDate.getUTCMonth()+1;
    // date = toDate.getDate();
    // year = toDate.getFullYear();
    // this.endDate = year+"/"+month+"/"+date;
  }

  setUploadDoc(inputValue:any) {
    this.uploadDoc = inputValue.files[0];
    if(this.uploadDoc["size"]!=0){
      this.isFileSelected = true;
      this.uploadFileName = this.uploadDoc.name;
    }
    // this.uploadFileName = "";
    this.getBase64(this.uploadDoc);
    this.errorMsg = "";
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
    this.uploadOfflinePayment(callback);

    this.errorMsg = "";
  }



  getFormattedDate(date) {
    console.log("in date conversion " + date);

    let dateFormat = date.toString();
    let replace = /\-/gi;
    let formattedDate =dateFormat.replace(replace,"/")
    // let year = dateFormat.getFullYear();
    // let month = dateFormat.getMonth() + 1;
    // let month1 = month < 10 ? '0' + month.toString() : '' + month.toString(); // ('' + month) for string result
    // let day = date.getDate();
    // day = day < 10 ? '0' + day : '' + day; // ('' + month) for string result
    // let formattedDate = year + '/' + month1 + '/' + day;
    console.log("final Value "+ formattedDate);
    return formattedDate;
  }

  downloadCSV() {
    const startDate = this.getFormattedDate(this.startDate);
    const endDate = this.getFormattedDate(this.endDate);
    var data = {
      userId: parseInt(localStorage.getItem("userId")),
      "Submit" : "",
      "fromDate" : startDate,
      "toDate" : endDate
    }
    this.qdeHttp.downloadOfflinePayment(data).subscribe(
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
            // this.errorMsg = response["ProcessVariables"]["errorMessage"];
          }
        }
      },
      error => {
        console.log("Error : ", error);
        // this.errorMsg = error;
      }
    );
  }

  uploadOfflinePayment(callback) {
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
    this.qdeHttp.uploadOfflinePayment(documentInfo).subscribe(
      response => {
        if (
          response["Error"] === "0" &&
          response["ProcessVariables"]["status"]) {
            // alert("Uploaded Successfully!");
            this.isErrorModal = true;
            this.errorMsgModal = "Uploaded Successfully!";
            this.clearFile();
        } else {
          if (response["ErrorMessage"]) {
            console.log("Response: " + response["ErrorMessage"]);
            this.clearFile();
          } else if (response["ProcessVariables"]["errorMessage"]) {
            console.log(
              "Response: " + response["ProcessVariables"]["errorMessage"]
            );
            this.clearFile();
            // this.errorMsg = response["ProcessVariables"]["errorMessage"];

          }
        }
      },
      error => {
        console.log("Error : ", error);
        // this.errorMsg = error;
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
          // alert(["message"]);
          this.isErrorModal = true;
          this.errorMsgModal = response["message"];
        }
      },
      error => {
        console.log("Error : ", error);
        // alert(error.error.message);
      }
    );
  }

  uploadToOps(documentInfo: any) {
    this.qdeHttp.uploadToOps(documentInfo).subscribe(
      response => {
        if (
          response["Error"] === "0" &&
          response["ProcessVariables"]["status"]) {
            // alert("Uploaded Successfully!");
            this.isErrorModal = true;
            this.errorMsgModal = "Uploaded Successfully";
            this.clearFile();
        } else {
          if (response["ErrorMessage"]) {
            console.log("Response: " + response["ErrorMessage"]);
            this.clearFile();
          } else if (response["ProcessVariables"]["errorMessage"]) {
            console.log(
              "Response: " + response["ProcessVariables"]["errorMessage"]
            );
            this.clearFile();
            // this.errorMsg = response["ProcessVariables"]["errorMessage"];
          }
        }
      },
      error => {
        console.log("Error : ", error);
        // this.errorMsg = error;
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
  clearFile(){
    this.uploadFileName = "";
    this.isFileSelected = false;
    this.paymentUploadPic.nativeElement.value = "";
  }

}
