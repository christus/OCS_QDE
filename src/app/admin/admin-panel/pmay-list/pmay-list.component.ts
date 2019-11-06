import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { QdeHttpService } from 'src/app/services/qde-http.service';



@Component({
  selector: 'app-pmay-list',
  templateUrl: './pmay-list.component.html',
  styleUrls: ['./pmay-list.component.css']
})
export class PmayListComponent implements OnInit {

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
  tableName:string = "pmay_list";
  searchKey: string="";
  isErrorModal:boolean = false;

  // paginationConfig =  { 
  //   itemsPerPage: 2, 
  //   totalItems: total 
  // }


  ngOnInit() {
    let data = {};
    data["currentPage"] = 1;

    this.getPmayList(data);
  }

  loadMore() {
    console.log("Load more");
    let data = {};
    data["from"] = this.collection.length +1
    this.getPmayList(data);

  }

  getPmayList(data) {
    let from = data.currentPage;
    this.qdeHttp.getPmayList(data).subscribe((response) => {
      this.collection = response['ProcessVariables'].pmayList;
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
    this.searchKey = event.target.value;
    var data = {
      "userId": parseInt(localStorage.getItem("userId")),
      "searchKey": event.target.value
    }
    this.qdeHttp.getPmayList(data).subscribe(response => {
      if(response['ProcessVariables'].pmayList==null){
        this.isErrorModal = true;
        this.errorMsg = "No data present further";
        //alert("No data present further");
      }else{
      this.collection = response['ProcessVariables'].pmayList;
      this.totalPages = response['ProcessVariables'].totalPages;
      this.from = response['ProcessVariables'].from;
      this.currentPage = response['ProcessVariables'].currentPage;
      this.perPage = response['ProcessVariables'].perPage;
      this.totalItems = parseInt(this.totalPages) * parseInt(this.perPage);
      if(this.currentPage == this.totalPages) {
        this.enableLoadMore = false;
      }
      console.log(this.collection);
    }
    });
  }

  refresh() {
    this.searchKey="";
    let data = {};
    data["currentPage"] = 1;
    this.getPmayList(data);
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
        delete this.collection[id];
        this.isErrorModal = true;
        this.errorMsg = "Deleted Successfully";
        //alert("Deleted Successfully!");
    } else {
      if (response["ErrorMessage"]) {
        console.log("Response: " + response["ErrorMessage"]);
        this.isErrorModal = true;
        this.errorMsg = response["ErrorMessage"];
        //alert(this.errorMsg);
      } else if (response["ProcessVariables"]["errorMessage"]) {
        console.log(
          "Response: " + response["ProcessVariables"]["errorMessage"]
        );
        this.isErrorModal = true;
        this.errorMsg = response["ProcessVariables"]["errorMessage"];
        //alert(this.errorMsg);
      }
    }
  },
  error => {
    console.log("Error : ", error);
  });
    this.refresh();
  }

  pageChanged(value){
    let data = {};
    data["currentPage"] = value;

    this.getPmayList(data);
  }


}
