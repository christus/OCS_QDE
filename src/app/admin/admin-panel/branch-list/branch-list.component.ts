import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { QdeHttpService } from 'src/app/services/qde-http.service';


@Component({
  selector: 'app-branch-list',
  templateUrl: './branch-list.component.html',
  styleUrls: ['./branch-list.component.css']
})
export class BranchListComponent implements OnInit {

  constructor(private route:ActivatedRoute, private qdeHttp: QdeHttpService) { }



  collection: any[] = [];  
  p: number = 1;
  userTable:any[] ;
  totalPages:string;
  totalItems:number;
  from: string;
  currentPage: string;
  perPage:string;
  errorMsg:string;
  enableLoadMore:boolean;


  ngOnInit() {
    let data = {};
    data["currentPage"] = 1;

    this.getBranchList(data);
  }

  loadMore() {
    console.log("Load more");
    let data = {};
    data["from"] = this.collection.length +1
    this.getBranchList(data);

  }

  getBranchList(data) {
    let from = data.currentPage;
    this.qdeHttp.getBranchList(data).subscribe((response) => {
      this.collection = response['ProcessVariables'].branchDetails;
      this.totalPages = response['ProcessVariables'].totalPages;
      this.from = response['ProcessVariables'].from;
      this.currentPage = response['ProcessVariables'].currentPage;
      this.perPage = response['ProcessVariables'].perPage;
      this.totalItems = parseInt(this.totalPages) * parseInt(this.perPage);
      if(this.currentPage == this.totalPages) {
        this.enableLoadMore = false;
      }
      console.log(this.collection);
    });
  }

  search(event) {
    var data = {
      "userId": parseInt(localStorage.getItem("userId")),
      "searchKey": event.target.value
    }
    this.qdeHttp.getBranchList(data).subscribe(response => {
      this.collection = response['ProcessVariables'].branchDetails;
      this.totalPages = response['ProcessVariables'].totalPages;
      this.from = response['ProcessVariables'].from;
      this.currentPage = response['ProcessVariables'].currentPage;
      this.perPage = response['ProcessVariables'].perPage;
      this.totalItems = parseInt(this.totalPages) * parseInt(this.perPage);
      if(this.currentPage == this.totalPages) {
        this.enableLoadMore = false;
      }
      console.log(this.collection);
    });
  }

  refresh(){
     let data = {};
    data["currentPage"] = 1;

    this.getBranchList(data);
  }

  delete(id){
    console.log("Pmay id", id);

    var data = {
      "id":id,
      "isDelete":true,
      "tableName":"pmay_list",
      "userId": parseInt(localStorage.getItem("userId")),
    }
    this.qdeHttp.deletePmayList(data).subscribe((response) => {
      if (response["Error"] === "0" &&
      response["ProcessVariables"]["status"]) {
      //alert("Uploaded Successfully!");
      delete this.collection[id];
    } else {
      if (response["ErrorMessage"]) {
        console.log("Response: " + response["ErrorMessage"]);
        this.errorMsg = response["ErrorMessage"];
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
  });
    
  }

  pageChanged(value){
    let data = {};
    data["currentPage"] = value;

    this.getBranchList(data);
  }


}
