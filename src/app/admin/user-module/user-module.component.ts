import { QdeHttpService } from 'src/app/services/qde-http.service';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

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
  searchKey: string="";
  isErrorModal: boolean = false;
  errorMessage: string;

  @ViewChild('uploadCSV') uploadCSV:ElementRef;
  uploadCSVString: string;
  selectedFile: File;
  isFileSelected: boolean = false;

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
      if(response['ProcessVariables']['status'] && response['ProcessVariables']['userDetails']!=null){
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
     }else if (response['ProcessVariables']['status'] && response['ProcessVariables']['userDetails']==null){
       this.isErrorModal = true;
       this.errorMessage = "No data present further";
     }
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
  search(){
    if(this.searchKey==""){
      this.pageChanged(1);
    }else{
      let data = {};
      data["roleId"] = this.filterData;
      data["searchKey"]= this.searchKey;
      this.getAdminUsers(data);
    }
  }

  startUpload(event){
    this.selectedFile = event.target.files[0];
    if(this.selectedFile.size!=0){
      this.isFileSelected = true;
    }else{
      this.isErrorModal = true;
      this.errorMessage = "No File selected";
      this.isFileSelected=false;
    }
    this.getBase64(this.selectedFile);
  }
  getBase64(inputValue: any) {
    var file:File = inputValue
    var myReader:FileReader = new FileReader();
    myReader.onloadend = (e) => {
      this.uploadCSVString = myReader.result.substr(myReader.result.indexOf(',') + 1);;
      console.log("result base64", this.uploadCSVString);
    }
    myReader.readAsDataURL(file);
  }
  uploadCSVFile(){
    let name = this.selectedFile.name;
    let size = this.selectedFile.size;
    if(size!=0){
      let documentInfo = {
        userId: localStorage.getItem("userId"),
        "attachment": {
          "name": name,
          "operation": "upload",
          "content": this.uploadCSVString,
          "mime": "text/csv",
          "size": size
        }
      }
      this.qdeHttp.uploadCSV(documentInfo).subscribe(res=>{
        if(res['ProcessVariables']['status'] && res['ProcessVariables']['errorMessage']==''){
          this.isErrorModal = true;
          this.errorMessage = "File Uploaded successfully";
          this.isFileSelected = false;
          let el = this.uploadCSV.nativeElement;
          el.value = "";
        }else{
          //this.isErrorModal = true;
          //this.errorMessage = res['ProcessVariables']['errorMessage'];
          this.isFileSelected = false;
          let el = this.uploadCSV.nativeElement;
          el.value = "";
        }
      })
    }
  }
  callFile(){
    let el = this.uploadCSV.nativeElement;
    el.click();  
  }

}
