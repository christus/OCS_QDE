import { QdeHttpService } from 'src/app/services/qde-http.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-module',
  templateUrl: './user-module.component.html',
  styleUrls: ['./user-module.component.css']
})
export class UserModuleComponent implements OnInit {
  collection: any[] = [];  
  p: number = 1;
  userTable:any[] ;
  totalPages:string;
  totalItems:number;
  from: string;
  currentPage: string;
  perPage:string;
  enableLoadMore:boolean;

  // paginationConfig =  { 
  //   itemsPerPage: 2, 
  //   totalItems: total 
  // }


  constructor(private qdeHttp: QdeHttpService) { 

     
  }

  ngOnInit() {
    let data = {};
    data["currentPage"] = 1;

    this.getAdminUsers(data);
  }

  loadMore() {
    console.log("Load more");
    let data = {};
    data["from"] = this.collection.length +1
    this.getAdminUsers(data);

  }

  getAdminUsers(data) {
    let from = data.currentPage;
    this.qdeHttp.getAdminUsers(data).subscribe((response) => {
      this.collection = response['ProcessVariables'].userDetails;
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

  pageChanged(value){
    let data = {};
    data["currentPage"] = value;

    this.getAdminUsers(data);
  }


}
