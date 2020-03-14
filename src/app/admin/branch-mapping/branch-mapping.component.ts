import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { QdeHttpService } from 'src/app/services/qde-http.service';

@Component({
  selector: 'app-branch-mapping',
  templateUrl: './branch-mapping.component.html',
  styleUrls: ['./branch-mapping.component.css']
})
export class BranchMappingComponent implements OnInit {
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
  searchKey: string="";
  isErrorModal: boolean = false;
  errorMessage: string;
  uploadFileName : string;

  @ViewChild('uploadCSV') uploadCSV:ElementRef;
  uploadCSVString: string;
  selectedFile: File;
  isFileSelected: boolean = false;
  constructor(private qdeHttp: QdeHttpService) { }

  ngOnInit() {
    let data = {};
    data["currentPage"] = 1;
    data["roleId"] = 1; // initial hardcoded to set filters/ SA is choosen as default
    this.filterData = 1;
    this.getUserMappingList(data);
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


  getUserMappingList(data) {
    this.qdeHttp.getUserBranchMapping(data).subscribe((response) => {
      if(response['ProcessVariables']['status'] && response['ProcessVariables']['userBranchList']!=null){
        this.isErrorModal = false;
        // if(response['ProcessVariables']['userBranchList']!=null){
      this.collection = response['ProcessVariables'].userBranchList;
      this.totalPages = response['ProcessVariables'].totalPages;
      this.from = response['ProcessVariables'].from;
      this.currentPage = response['ProcessVariables'].currentPage;
      this.perPage = response['ProcessVariables'].perPage;
      this.totalItems = parseInt(this.totalPages) * parseInt(this.perPage);
      // this.activityList = response['ProcessVariables'].activityList;
      if(this.currentPage == this.totalPages) {
        this.enableLoadMore = false;
      }
      console.log(this.collection);
     }else if (response['ProcessVariables']['status'] && response['ProcessVariables']['userDetails']==null){
       this.isErrorModal = true;
       this.errorMessage = "No data present further";
     }
   });
  }


  pageChanged(value){
    console.log("bla,bloa",value)
    let data = {};
    data["currentPage"] = value;
    data["roleId"] = this.filterData;
    data["searchKey"] = this.searchKey;
    this.getUserMappingList(data);
  }

  search(){
    if(this.searchKey==""){
      this.pageChanged(1);
    }else{
      let data = {};
      data["roleId"] = this.filterData;
      data["searchKey"]= this.searchKey;
      this.getUserMappingList(data);
    }
  }

  changeRole(value){

    console.log("roleID:",value);

    this.filterData = parseInt(value);

    let data = {};
    data["currentPage"] = 1;
    data["roleId"] = this.filterData;
    this.getUserMappingList(data);

  }

}
