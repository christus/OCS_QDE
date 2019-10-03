import { Component, OnInit } from '@angular/core';
import { QdeHttpService } from '../services/qde-http.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  startDate : Date ;
  endDate : Date;
  errorMsg:string;
  dateError:any={isError:false,errorMessage:''};
  branchList: Array<any>;
  statusList: Array<any>;
  userList: Array<any>;
  branchId: string;
  statusId: string;
  userId: string;
  reportId: string;

  constructor(private qdeHttp: QdeHttpService) { }

  ngOnInit() {
    this.filterValues()
  }
  
  downloadLead() {
    const startDate = this.getFormattedDate(this.startDate);
    const endDate = this.getFormattedDate(this.endDate);
    var data = {
    //  userId: parseInt(localStorage.getItem("userId")),
      "Submit" : "",
      "fromDate" : startDate,
      "toDate" : endDate,
      "applicationStatus": this.statusId,
      "branch" : this.branchId,
      "userId" : this.userId
    }
    this.qdeHttp.downloadLeadDetails(data).subscribe(
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

  downloadLogin() {
    const startDate = this.getFormattedDate(this.startDate);
    const endDate = this.getFormattedDate(this.endDate);
    var data = {
    //  userId: parseInt(localStorage.getItem("userId")),
      "Submit" : "",
      "fromDate" : startDate,
      "toDate" : endDate,
      "applicationStatus": this.statusId,
      "branch" : this.branchId,
      "userId" : this.userId
    }
    this.qdeHttp.downloadLoginDetails(data).subscribe(
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

  downloadReport(){
    if(this.reportId == "1"){
      this.downloadLogin();
      console.log("Download login Report")
    }
    else if(this.reportId == "2"){
      this.downloadLead();
      console.log("Download lead Report")
    }
    else if(this.reportId == "3"){
      console.log("Download dump report. API is not there")
    }
    else{
      console.log("Not a valid report")
      return;
    }
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

  endDateMonthDiff(value){
    const startDate = this.getFormattedDate(this.startDate);
    const endDate = this.getFormattedDate(value);
    console.log("papareddy",endDate)
    console.log("badapapareddy",startDate)
    if(endDate<startDate){
      this.dateError={isError:true,errorMessage:"End Date cannot come before the start date"};
    }
    console.log("sabsebadapapareddy",this.dateError)
  }

  filterValues(){
    var data = {
      userId: parseInt(localStorage.getItem("userId")),
    }
    this.qdeHttp.reportsFilters(data).subscribe(response=>{
      this.branchList = response["ProcessVariables"]["branchList"]
      this.statusList = response["ProcessVariables"]["statusList"]
      this.userList = response["ProcessVariables"]["userList"]
    })

  }

  changeBranch(el){
    this.branchId = el.currentTarget.value;
  }

  changeStatus(el){
    this.statusId = el.currentTarget.value; 
  }

  changeUser(el){
    this.userId = el.currentTarget.value;
  }

  changeReport(el){
    console.log("Rep event", el.currentTarget.value);
    this.reportId  = el.currentTarget.value;
  }
}
