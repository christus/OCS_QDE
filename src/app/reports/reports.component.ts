import { Component, OnInit, ViewChild } from '@angular/core';
import { QdeHttpService } from '../services/qde-http.service';
import { Item } from '../models/qde.model';
import { environment } from 'src/environments/environment.prod';
import { CommonDataService } from '../services/common-data.service';

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
  statusId: string = "0";
  userId: string;
  reportId: string;
  selectedUser: string;
  selectedStatus: string;
  selectedBranch: string;
  offset: number = 0;
  base64:string = "";
  leadShow:boolean;
  loginShow:boolean;

  
  constructor(private qdeHttp: QdeHttpService,
              private cds: CommonDataService) { }

  ngOnInit() {
    this.cds.showCreateLead$.subscribe(myValue => 
                                        this.leadShow = myValue)

    this.cds.showNewLogin$.subscribe(value => 
                                this.loginShow = value);
    this.filterValues()
  }
  

  downloadLead() {
    const startDate = this.getFormattedDate(this.startDate);
    const endDate = this.getFormattedDate(this.endDate);
    // var data = {
    //   // userId: parseInt(localStorage.getItem("userId")),
    //   "fromDate" : startDate,
    //   "toDate" : endDate,
    //   "applicationStatus": this.statusId,
    //   "branch" : this.branchId,
    //   "userId" : this.userId
    // }
    // this.qdeHttp.downloadLeadDetails(data).subscribe(
    //   response => {
    //     if (
    //       response["Error"] === "0" &&
    //       response["ProcessVariables"]["status"]) {
    //         // alert("Uploaded Successfully!");
    //         // const moreReports = response["ProcessVariables"]["more"]
    //         // for (;moreReports == true;) {
    //         //   this.readBase64Content(response)
    //         // }
    //           this.readBase64Content(response)
    //     } else {
    //       if (response["ErrorMessage"]) {
    //         console.log("Response: " + response["ErrorMessage"]);
    //       } else if (response["ProcessVariables"]["errorMessage"]) {
    //         console.log(
    //           "Response: " + response["ProcessVariables"]["errorMessage"]
    //         );
    //         this.errorMsg = response["ProcessVariables"]["errorMessage"];
    //       }
    //     }
    //   },
    //   error => {
    //     console.log("Error : ", error);
    //     this.errorMsg = error;
    //   }
    // );

    let url = environment.host +
              environment.csvLocation + 
              '&content_var=attachmentContent&filename=leads.csv&more_flag_var=more&processVariables={"processId":"'
              + environment.api.downloadLeads.processId + '"'
              + ',"ProcessVariables":{"fromDate":"' + "" + startDate + '","toDate":"' + "" + endDate + '","userId":"' + "" + this.userId + '","outputUsers":"'+ localStorage.getItem("outputUsers")+'"}'
              + ',"workflowId":"' + environment.api.downloadLeads.workflowId + '"'
              + ',"projectId":"' + environment.api.downloadLeads.projectId + '"}';
    window.open(url,'_blank');
    // this.qdeHttp.callGet(url).subscribe(response => {
    //   console.log("Leads Url",response)
    // });

  }

  downloadLogin() {
    const startDate = this.getFormattedDate(this.startDate);
    const endDate = this.getFormattedDate(this.endDate);
   
      let url = environment.host +
            environment.csvLocation + 
            '&content_var=attachmentContent&filename=login.csv&more_flag_var=more&processVariables={"processId":"'
            + environment.api.downloadLogin.processId + '"'
            + ',"ProcessVariables":{"fromDate":"' + "" + startDate + '","toDate":"' + "" + endDate + '","userId":"' + "" + this.userId + '","outputUsers":"'+ localStorage.getItem("outputUsers")+'"}'
            + ',"workflowId":"' + environment.api.downloadLogin.workflowId + '"'
            + ',"projectId":"' + environment.api.downloadLogin.projectId + '"}';
      window.open(url,'_blank');

      console.log("Login Url",url)
  }

  downloadDump() {
    const startDate = this.getFormattedDate(this.startDate);
    const endDate = this.getFormattedDate(this.endDate);

    let url = environment.host +
            environment.csvLocation + 
            '&content_var=attachmentContent&filename=applicationDump.csv&more_flag_var=more&processVariables={"processId":"'
            + environment.api.downloadDump.processId + '"'
            + ',"ProcessVariables":{"fromDate":"' + "" + startDate + '","toDate":"' + "" + endDate + '","applicationStatus":' + "" + Number(this.statusId) + ',"userId":"' + "" + this.userId + '","outputUsers":"'+ localStorage.getItem("outputUsers")+'"}'
            + ',"workflowId":"' + environment.api.downloadDump.workflowId + '"'
            + ',"projectId":"' + environment.api.downloadDump.projectId + '"}';
      window.open(url,'_blank');

      console.log("Dump Url",url)
  }

  downloadReport(){
    if(this.reportId == "1"){
      // this.base64 = null;
      this.downloadLogin();
      console.log("Download login Report")
    }
    else if(this.reportId == "2"){
      this.downloadLead();
      console.log("Download lead Report")
    }
    else if(this.reportId == "3"){
      // this.base64 = null;
      this.downloadDump();
      console.log("Download dump report")
    }
    else{
      console.log("Not a valid report")
      return;
    }
  }

  getFormattedDate(date) {
    console.log("in date conversion " + date);
    let dateFormat = date;
    // let dateFormat = date.toString();
    // let replace = /\-/gi;
    // let formattedDate =dateFormat.replace(replace,"/")
    let year = dateFormat.getFullYear();
    let month = dateFormat.getMonth() + 1;
    let month1 = month < 10 ? '0' + month.toString() : '' + month.toString(); // ('' + month) for string result
    let day = date.getDate();
    day = day < 10 ? '0' + day : '' + day; // ('' + month) for string result
    let formattedDate = year + '-' + month1 + '-' + day;
    console.log("final Value " + formattedDate);
    return formattedDate;
  }

  readBase64Content(response, moreStatus) {
    // Base64 url of image trimmed one without data:image/png;base64

    const attachment =  response["ProcessVariables"]["attachment"];
    let base64 = attachment["content"];
    if (moreStatus == true){
      base64 = attachment["content"];
    }
    else{
      base64 =   base64.concat(attachment["content"]);
    }
    // const base64 = attachment["content"];
    console.log("content type ",typeof(attachment["content"]));

    
    const mime = attachment["mime"];
    const fileName = attachment["name"];
    let that = this;
    console.log("connent values ", base64 );

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
    var startDate = this.getFormattedDate(this.startDate);
    if(this.endDate != null){
      var endDate = this.getFormattedDate(this.endDate);
    }
    else{
      return
    }
    var tempStartDate = new Date(startDate);
    var tempEndDate = new Date(endDate);
    var Difference_In_Time = tempEndDate.getTime() - tempStartDate.getTime();
    var Difference_In_Days = Difference_In_Time / (1000 * 60 * 60 * 24);

    if(this.endDate < this.startDate){
      this.dateError = {isError:true, errorMessage:"End Date cannot come before the start date"};
    }
    else{
      if (Difference_In_Days < 30 && Difference_In_Days > 0) {
        // The selected time is less than 30 days from now
        this.dateError = {isError:false, errorMessage:""};
      }
      else if (Difference_In_Days > 30) {
        // The selected time is more than 30 days from now
        this.dateError = {isError:true, errorMessage:"Difference between Start date and End date should be less than or equal to 30 Days"};
      }
      else{
         // -Exact- same timestamps.
        this.dateError = {isError:false, errorMessage:""};
      }
    }
  }

  filterValues(){
    var data = {
      userId: parseInt(localStorage.getItem("userId")),
    }
    this.qdeHttp.reportsFilters(data).subscribe(response=>{
      this.branchList = response["ProcessVariables"]["branchList"];
      this.statusList = response["ProcessVariables"]["statusList"];
      this.userList = response["ProcessVariables"]["userList"];
      this.changeUser(localStorage.getItem("userId"));
      this.selectedUser = this.userList[0];
      console.log("Selected user",this.selectedUser)
    })

  }

  changeBranch(el){
    console.log("Branch",el)
    this.branchId = el.currentTarget.value;
  }

  changeStatus(el){
    console.log("Status",el)
    this.statusId = el; 
  }

  changeUser(el){
    
    // if(el.currentTarget.value != "0"){
    //   this.userId = el.currentTarget.value;
    // }
    // else{
    //   this.userId = localStorage.getItem("userId")
    // }
    
  //  this.userId = this.selectedUser ? localStorage.getItem('userId') ? localStorage.getItem('userId'): null: this.selectedUser;
    this.userId = el;
    console.log("UserId", this.userId)
  }

  changeReport(el){
    console.log("Rep event", el.currentTarget.value);
    this.reportId  = el.currentTarget.value;
  }
}
