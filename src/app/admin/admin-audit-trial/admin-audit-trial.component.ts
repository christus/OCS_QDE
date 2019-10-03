import { Component, OnInit, QueryList, Renderer2, ViewChildren } from '@angular/core';
import { QdeHttpService } from '../../services/qde-http.service';

import {ViewChild, ElementRef} from '@angular/core';
import { errors } from '../../services/errors';


@Component({
  selector: 'app-admin-audit-trial',
  templateUrl: './admin-audit-trial.component.html',
  styleUrls: ['./admin-audit-trial.component.css']
})
export class AdminAuditTrialComponent implements OnInit {

  @ViewChild('reportingTo') reportingRef: ElementRef;

  @ViewChildren("reportingTo") reportingToList: QueryList<ElementRef>;

  @ViewChild('selectBox') selectBoxRef: ElementRef;


  ocsNumberStr:string;

  uploadDoc:File;

  uploadCSVFile:string;

  errorMsg:string;

  uploadFileName: string;

  startDate : Date ;

  endDate : Date;

  reportingTo: string;
  reportingToStr: string;

  filteredItems: Array<string>;
  _timeout: any = null;

  userId:string;



  constructor(private qdeHttp: QdeHttpService,
    private renderer: Renderer2) { }

  ngOnInit() {
    // this.startDate = new Date();
    // this.startDate.setDate(this.startDate.getDate()- 7);
    // this.endDate = new Date();
    this.startDate = undefined;
    this.endDate = undefined;
  }

  setUploadDoc(inputValue:any) {
    this.uploadDoc = inputValue.files[0];
    this.uploadFileName = "";
    this.uploadFileName = this.uploadDoc.name;
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

    console.log("ocs"+this.ocsNumberStr);
    console.log("ouserIdcs"+this.userId);
    console.log("startDate"+this.startDate);
    console.log("endadtae"+this.endDate);

    if(this.ocsNumberStr || this.userId ) {

      const isValid = this.validateFromToDate(this.startDate, this.endDate);

     

      
      if(this.userId && !this.startDate && !this.endDate) {
        this.errorMsg = errors.adminAuditTrail.dataRequired;
        // this.resetForm();
        return;
      }

      if(isValid) {
        const startDate = (!this.startDate? "": this.getFormattedDate(this.startDate));
        const endDate = (!this.endDate? "": this.getFormattedDate(this.startDate)); 
      }else {
        this.errorMsg = errors.adminAuditTrail.dateRangeError;
        return;
      }

      const ocs = this.ocsNumberStr || "";
      const auditUserId = this.userId;
      var data = {
        userId: auditUserId,
        "Submit" : "",
        "fromDate" : this.startDate,
        "toDate" : this.endDate,
        "ocsNumber": ocs
      }
      this.qdeHttp.downloadAuditTrail(data).subscribe(
        response => {
          if (
            response["Error"] === "0" &&
            response["ProcessVariables"]["status"]) {
              // alert("Uploaded Successfully!");
              this.resetForm();
              this.readBase64Content(response)
          } else {
            if (response["ErrorMessage"]) {
              console.log("Response: " + response["ErrorMessage"]);
            } else if (response["ProcessVariables"]["errorMessage"]) {
              console.log(
                "Response: " + response["ProcessVariables"]["errorMessage"]
              );
              this.errorMsg = response["ProcessVariables"]["errorMessage"];
            }
          }
        },
        error => {
          console.log("Error : ", error);
          this.errorMsg = error;
          this.resetForm();
        }
      );
    }else{
      this.errorMsg = errors.adminAuditTrail.allFieldrequired;
    }
  }

  resetForm() {
    this.userId = "";
    this.ocsNumberStr = "";
    this.startDate = undefined;
    this.endDate = undefined;
    this.reportingToStr = "";
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
            alert("Uploaded Successfully!");
        } else {
          if (response["ErrorMessage"]) {
            console.log("Response: " + response["ErrorMessage"]);
          } else if (response["ProcessVariables"]["errorMessage"]) {
            console.log(
              "Response: " + response["ProcessVariables"]["errorMessage"]
            );
            this.errorMsg = response["ProcessVariables"]["errorMessage"];

          }
        }
      },
      error => {
        console.log("Error : ", error);
        this.errorMsg = error;
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
            this.errorMsg = response["ProcessVariables"]["errorMessage"];
          }
        }
      },
      error => {
        console.log("Error : ", error);
        this.errorMsg = error;
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


  // getUsers() {
  //   let data = {
  //     userName: ""
  //   };
  //   this.qdeHttp.usersLovList(data).subscribe((response) => {
  //     this.rolesList = response['ProcessVariables'].roleList;
      
  //   });
  // }
  items: Array<string> = [''];

  search(event) {
    
    if (event.target.value != '') {
      this.filteredItems = this.items.filter(v => {
        if (v.toLowerCase().trim().search(event.target.value.toLowerCase().trim()) >= 0) {
          return true;
        } else {
          return false;
        }
      });
      event.target.click();
    } else {
      this.filteredItems = this.items;
    }
  }


  selectedReportedTo(index, data) {
    console.log("clicked", data.userName);

    this.selectBoxRef.nativeElement.querySelector('.reporting_to').classList.add('hide');
    // this.renderer.removeClass(this.reportingRef.nativeElement, 'active');
    console.log("reportingToList",this.reportingToList);

    this.userId = data.userId;

    this.reportingToStr = data.userName;
    this.reportingToList.forEach(v => {
      this.renderer.removeClass(v.nativeElement, "active");
    })
    this.renderer.addClass(this.reportingToList["_results"][index+1].nativeElement, 'active');
  }

  filterLeads(event) {
    this._timeout = null;
    
    this.selectBoxRef.nativeElement.querySelector('.reporting_to').classList.remove('hide');

    if (this._timeout) { //if there is already a timeout in process cancel it
      window.clearTimeout(this._timeout);
    }
    this._timeout = window.setTimeout(() => {

      console.log(event.target.value.toLowerCase());
      let input = { "userName": event.target.value.toLowerCase() };
      this.qdeHttp.usersLovList(input).subscribe((response) => {
        console.log("Reporting", response);
        let usersList = response['ProcessVariables'].userList;
        if(usersList) {
          this.filteredItems = usersList;
        }else {
          this.selectBoxRef.nativeElement.querySelector('.reporting_to').classList.add('hide');
        }
      });

    }, 1000);

  }

  validateFromToDate(fromDate, toDate){
    if ((Date.parse(fromDate) <= Date.parse(toDate))) {
      return true;
    }
  }

}

