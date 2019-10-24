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
  activityList: any;
  rolesList: any[]= [];
  filterData: number;

  // paginationConfig =  { 
  //   itemsPerPage: 2, 
  //   totalItems: total 
  // }


  constructor(private qdeHttp: QdeHttpService) { 

     
  }

  ngOnInit() {
    let data = {};
    data["currentPage"] = 1;
    data["roleId"] = 1; // initial hardcoded to set filters/ SA is choosen as default
    this.filterData = 1;
    this.getAdminUsers(data);

    this.getRoleName();
  }

  getRoleName() {
    let data = {
      roleName: ""
    };
    this.qdeHttp.getRoleNameList(data).subscribe((response) => {
      this.rolesList = response['ProcessVariables'].roleList;
      
    });
  }


  loadMore() {
    console.log("Load more");
    let data = {};
    data["from"] = this.collection.length +1
    this.getAdminUsers(data);

  }

  getAdminUsers(data) {
    this.qdeHttp.getAdminUsers(data).subscribe((response) => {
      this.collection = response['ProcessVariables'].userDetails;
      this.totalPages = response['ProcessVariables'].totalPages;
      this.from = response['ProcessVariables'].from;
      this.currentPage = response['ProcessVariables'].currentPage;
      this.perPage = response['ProcessVariables'].perPage;
      this.totalItems = parseInt(this.totalPages) * parseInt(this.perPage);
      this.activityList = response['ProcessVariables'].activityList;
      if(this.currentPage == this.totalPages) {
        this.enableLoadMore = false;
      }
      console.log(this.collection);
    });
  }

  // changeRole() {
  //   console.log(PARAMETERS)
  // }
  changeRole(value){

    console.log("roleID:",value);

    this.filterData = parseInt(value);

    let data = {};
    data["currentPage"] = 1;
    data["roleId"] = this.filterData;
    this.getAdminUsers(data);

  }

  pageChanged(value){
    console.log("bla,bloa",value)
    let data = {};
    data["currentPage"] = value;
    data["roleId"] = this.filterData;
    this.getAdminUsers(data);
  }


}
