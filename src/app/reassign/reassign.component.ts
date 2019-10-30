import { Component, OnInit } from "@angular/core";
import { QdeService } from "../services/qde.service";
import { QdeHttpService } from "../services/qde-http.service";
import { v } from "@angular/core/src/render3";
import { indexDebugNode } from "@angular/core/src/debug/debug_node";
import { CommonDataService } from "../services/common-data.service";

@Component({
  selector: "app-reassign",
  templateUrl: "./reassign.component.html",
  styleUrls: ["./reassign.component.css"]
})

export class ReassignComponent implements OnInit {

  userDetails: Array<UserDetails> = [];
  allClssAreas: Array<any>;
  fromAssign: string;
  selectedAssign: string;
  toAssign: string;
  isErrorModal: boolean;
  reasonToChangeText: string;
  firstName: string;
  errorMessage: string;
  filteredSource: Array<UserDetails>;
  showRemark: {};
  termsCheck;
  applictionList: Array<string>;
  totalPages: string;
  totalItems: number;
  from: string;
  currentPage: string;
  perPage: string;
  effectFromDate: Date;
  filterData: number;
  enableLoadMore: boolean;
  fromAssignId: number;
  toAssignId: number;
  selectAllStatus: boolean = false;
  selectAllCheck: boolean = false;
  validFromAssignee: boolean = false;
  validToAssignee: boolean = false;
  public applications: Array<string> = [];
  public source: Array<UserDetails> = [];
  // = ["Albania", "Andorra", "Armenia", "Austria", "Azerbaijan"];

  public data: Array<UserDetails>;
  public source1: Array<UserDetails> = [];
  public min: Date = new Date();

  // public max: Date = new Date(2002, 2, 10);
  // public value: Date = new Date(2001, 2, 10);

  constructor(private qdeHttp: QdeHttpService,
              private cds:  CommonDataService) {
    const userId = localStorage.getItem("userId");
    let data = {"userId": userId };
    this.getUserList(data);

    console.log("slice data ", data);
   }

  ngOnInit() {

    this.data = this.source.slice();
    this.filteredSource = this.source1.slice();
    this.fromAssignId = null;
    this.toAssignId = null;
       

  }

  getLeads(leadId: any) {
    console.log("get lead call");
  this.qdeHttp.clssSearch(leadId.target.value).subscribe(res => {
    if (res["ProcessVariables"]["status"]) {
      this.allClssAreas = res["ProcessVariables"]["townNames"] ? res["ProcessVariables"]["townNames"] : [];
      console.log("CLSSArea: ", this.allClssAreas);
    }
  }, error => {
    this.isErrorModal = true;
    this.errorMessage = "Something went wrong, please try again later.";
  });
}

getApplications(userId, from) {
  // const userId = localStorage.getItem("userId");
  let data = {"userId": userId,
          "currentPage": from } ;
  this.qdeHttp.getApplications(data).subscribe(response => {
    this.applictionList = response["ProcessVariables"]["applications"] || [];
    console.log("applicaiton List " , this.applictionList);
    this.totalPages = response["ProcessVariables"].totalPages;
       this.from = response["ProcessVariables"].from;
       this.currentPage = response["ProcessVariables"].currentPage;
       this.perPage = response["ProcessVariables"].perPage;
       this.totalItems = parseInt(this.totalPages) * parseInt(this.perPage);
       if (this.currentPage == this.totalPages) {
         this.enableLoadMore = false;
       }
  });
}

getUserList(data){
  this.qdeHttp.getUserList(data).subscribe(response => {
    console.log(" get user list" , response["ProcessVariables"]["userList"]);
    let userList = response["ProcessVariables"]["userList"];
    console.log(" get user list lengh" ,  userList.length);
    // for (let i = 0; i <  userList.length; i++) {
    //   this.source.push( userList[i]["key"]);
    //   console.log("in for loop ", userList[i]["key"]);
    // }
    this.source = userList;
    console.log("user list" , this.source );
    console.log("user list key" , this.source["key"] );
  });

}

  handleFilter(value) {

    // this.data = this.source.filter(function(s) {
    //   return s["key"].toLowerCase().startsWith(value.toLowerCase());
    // });

     this.data = this.source.filter((s) => s.key.toLowerCase().indexOf(value.toLowerCase()) !== -1);
     console.log(" afete Fileter ", JSON.stringify(this.data));

}
  handleFilter1(value) {
     this.filteredSource = this.source1.filter((s) => s.key.toLowerCase().indexOf(value.toLowerCase()) !== -1);
    }

  dataChanged(event,fromId) {
      const selectedUser = this.source.find(myUser => myUser.key === event);
      if (selectedUser) {
        console.log("selected User ", selectedUser);
            if (event != null || event != undefined) {
              const userID = this.source.find(mysearchValue => mysearchValue.key === event).value;
                      console.log("fassignee change vaglue ", userID);
                      this.selectedAssign =  userID.toString();
                      this.source1 = this.source.filter((item) => { return item.key != event });
                      if (fromId == 1) {
                        this.fromAssignId = Number(this.selectedAssign);
                          this.getApplications(this.selectedAssign,1);
                          this.applications = [];
                          this.validFromAssignee = false;
                      } else if (fromId == 2) {
                        // const userID = this.source.find(mysearchValue => mysearchValue.key === event).value;
                        this.selectedAssign =  userID.toString();
                        this.toAssignId = Number(this.selectedAssign);
                        if (this.fromAssignId == this.toAssignId){
                          this.isErrorModal = true;
                          this.errorMessage = "Both Assignees are Same, It should Not Same";
                          this.validToAssignee = true;
                        } else {
                          this.toAssignId = Number(this.selectedAssign);
                          this.validToAssignee = false;
                        }
                        
                      }
            } else {
              if (fromId == 1) {
              this.applictionList = [];
              }
            }
            console.log("fassignee change value ", event);
           
      } else {
        this.isErrorModal = true;
        if (fromId == 1) {
          this.errorMessage = "Select Any Valid From Assignee";
          this.validFromAssignee = true;
          this.applictionList = [];
          this.totalItems = 0;
        }
        else if ( fromId == 2) {
          this.errorMessage = "Select Any Valid To Assignee";
          this.validToAssignee = true;
        }
      }

  }


  changeCheckbox(index?) {
      console.log("index vlaue ");
      if (!this.selectAllCheck && index > 0) {
        const arrarLength = this.applictionList.length;
        if (index == null || undefined) {
          this.selectAllStatus = this.selectAllCheck;
          this.applications = [];
          console.log("select All Check Value ", this.selectAllCheck);
        } else {
          this.selectAllStatus = this.selectAllCheck;
          this.applications.push(this.applictionList[index]["applicationId"]);
          console.log("aray lengh ", arrarLength , index, this.applictionList[index]["applicationId"] ,this.applications );
        }
      } 
      // else {
      //   this.isErrorModal = true;
      //   this.errorMessage = "Select Any From Assignee and Select Any Application";
      //   this.selectAllCheck = false;
      // }
  }
  pageChanged(value) {
    // data["currentPage"] = value;
    console.log("index value ", value);
    this.getApplications(this.selectedAssign, value);
  }

  changeApllication(resonTochange, effectFromDate) {
    const userID = localStorage.getItem("userId");
    if (this.toAssignId === null || this.toAssignId === undefined || this.reasonToChangeText == null ||
      this.reasonToChangeText == "" || this.reasonToChangeText == undefined) {
      this.isErrorModal = true;
      this.errorMessage = "Mandatory fields are Require";
    } else if ((this.fromAssignId === null || this.fromAssignId === undefined ) && (this.applictionList.length == 0) ){

      this.isErrorModal = true;
      this.errorMessage = "Select Any From Assignee Name";
    } else if (this.selectAllStatus = false) {
      if(this.applications.length == 0  || this.applications.length == undefined ){
        this.isErrorModal = true;
        this.errorMessage = "Select Any Apllication to Assign Other";
    }

    } else if( !this.effectFromDate){
      this.isErrorModal = true;
      this.errorMessage = "Select Any Date For Effect From";
    } else if (this.fromAssignId == this.toAssignId){
      this.isErrorModal = true;
      this.errorMessage = "Both Assignees are Same, It should Not Same";
      this.validToAssignee = true;
    } else {

    console.log("err daate" , this.effectFromDate);

    let applicationCollection = this.applications.filter(function(elem, index, self) {
      return index === self.indexOf(elem);
    });
        const data = {
          "userId":userID.toString(),
          "reassignToId": this.toAssignId,
          "reassignedReason": resonTochange.toString(),
          "fromDate":  this.getFormattedDate(this.effectFromDate).toString(),
          "reassignFromId": this.fromAssignId,
          "applications": applicationCollection,
            "selectAll": this.selectAllStatus
        };
        console.log("form submit call ", data );
        this.qdeHttp.reAssignApplications(data).subscribe(response => {
          if (  response["Error"] === "0" &&
                    response["ProcessVariables"]["status"]) {
                      // alert("Uploaded Successfully!");
                      this.toAssignId = null;
                      this.fromAssignId = null;
                      this.reasonToChangeText = null;
                      this.effectFromDate = null;
                      this.applications = [];
                      this.applictionList = [];
                      this.toAssign = null;
                      this.fromAssign = null;
                      this.selectAllCheck = false;
                      this.totalItems = 0;
                  } else {
                    if (response["ErrorMessage"]) {
                      console.log("Response: " + response["ErrorMessage"]);
                    } else if (response["ProcessVariables"]["errorMessage"]) {
                      console.log(
                        "Response: " + response["ProcessVariables"]["errorMessage"]
                      );
                      this.errorMessage = response["ProcessVariables"]["errorMessage"];
                    }
                  }


    });


  }
  }


  getFormattedDate(date) {
    console.log("in date conversion " + date);

    let dateFormat: Date = date;
    let year = dateFormat.getFullYear();
    let month = dateFormat.getMonth() + 1;
    let month1 = month < 10 ? '0' + month.toString() : '' + month.toString(); // ('' + month) for string result
    let day = date.getDate();
    day = day < 10 ? '0' + day : '' + day; // ('' + month) for string result
    let formattedDate = year + '-' + month1 + '-' + day;
    // console.log("final Value "+ formattedDate);
    return formattedDate;
  }
}

export interface UserDetails {
  "key": string;
  "value": number;
}
