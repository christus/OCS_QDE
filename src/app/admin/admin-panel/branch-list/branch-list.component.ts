import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { QdeHttpService } from 'src/app/services/qde-http.service';
import { Subscription, fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';


@Component({
  selector: 'app-branch-list',
  templateUrl: './branch-list.component.html',
  styleUrls: ['./branch-list.component.css']
})
export class BranchListComponent implements OnInit {
  // mycollection: any[]=[];
  searchSubcription: Subscription;
  @ViewChild('searchInp') searchInpRef: ElementRef;
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
  searchKey:string="";
  isErrorModal:boolean = false;
  uploadCSVString: string;
  selectedFile: File;
  isFileSelected: boolean = false;  
  @ViewChild('uploadCSV') uploadCSV: ElementRef
  uploadFileName : string;

  ngOnInit() {
    let data = {};
    data["currentPage"] = 1;

    this.getBranchList(data);

    this.searchSubcription =  fromEvent(this.searchInpRef.nativeElement, 'keyup')
    .pipe(
      debounceTime(500)
    ).subscribe((event: any) => {
      console.log('event', event.target.value)
      this. search(event);
    })
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
      // this.collection = this.mycollection
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
      if(response['ProcessVariables']['status'] && response['ProcessVariables']['branchDetails']!=null){
        this.isErrorModal = false;
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
    }else if(response['ProcessVariables']['status'] && response['ProcessVariables']['branchDetails']==null){
      this.isErrorModal = true;
      this.errorMsg = "No data present further";
    }
    });
  }

  refresh(){
    this.searchKey="";
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
      this.isErrorModal = true;
      this.errorMsg="Deleted successfully";
    } 
/* 	else {
      if (response["ErrorMessage"]) {
        console.log("Response: " + response["ErrorMessage"]);
        this.isErrorModal = true;
        this.errorMsg = response["ErrorMessage"];
      } else if (response["ProcessVariables"]["errorMessage"]) {
        console.log(
          "Response: " + response["ProcessVariables"]["errorMessage"]
        );
        this.isErrorModal = true;
        this.errorMsg = response["ProcessVariables"]["errorMessage"];
      }
    } */
  },
  error => {
    console.log("Error : ", error);
  });
    
  }

  pageChanged(value){
    let data = {};
    data["currentPage"] = value;
    data["searchKey"]= this.searchKey;
    this.getBranchList(data);
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
      this.qdeHttp.uploadBranchCSV(documentInfo).subscribe(res=>{
        if(res['ProcessVariables']['status'] && res['ProcessVariables']['errorMessage']==''){
          this.isErrorModal = true;
          this.errorMsg = "File Uploaded successfully";
          this.isFileSelected = false;
          let el = this.uploadCSV.nativeElement;
          el.value = "";
          this.uploadFileName = "";
        }else{
          //this.isErrorModal = true;
          //this.errorMessage = res['ProcessVariables']['errorMessage'];
          this.isFileSelected = false;
          let el = this.uploadCSV.nativeElement;
          el.value = "";
          this.uploadFileName = "";
        }
      })
    }
  }
  callFile(){
    let el = this.uploadCSV.nativeElement;
    el.click();  
  }

  startUpload(event){
    this.selectedFile = event.target.files[0];
    if(this.selectedFile.size!=0){
      this.isFileSelected = true;
      this.uploadFileName = this.selectedFile.name;
    }else{
      this.isErrorModal = true;
      this.errorMsg = "No File selected";
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
//   mycollection = [{"branchCode": "c01", "branchId": 3, "branchName": "Chennai Main", "branchType": null, "region": "Southern",
//   "zone": "AP & Telangana",
//   "state": "ANDHRA PRADESH",
//   "city": "TIRUPATHI"},
// {"branchCode": "C02", "branchId": 4, "branchName": "Chennai South", "branchType": null, "cityName": null,"region": "Southern",
//   "zone": "Tamil Nadu",
//   "state": "TAMIL NADU",
//   "city": "chennai"},
// {"branchCode": null, "branchId": 94, "branchName": "Ajmer", "branchType": "Single branch", "cityName": "AJMER",
// "region": "Southern",
//   "zone": "AP & Telangana",
//   "state": "ANDHRA PRADESH",
//   "city": "TIRUPATHI"
// },
// {"branchCode": null, "branchId": 95, "branchName": "Akola", "branchType": "Single branch", "cityName": "Akola",  "region": "Southern",
//   "zone": "Tamil Nadu",
//   "state": "TAMIL NADU",
//   "city": "chennai"},
// {"branchCode": null, "branchId": 96, "branchName": "Allahabad", "branchType": "Single branch", "cityName": "ALLAHABAD","region": "Southern",
//   "zone": "AP & Telangana",
//   "state": "ANDHRA PRADESH",
//   "city": "TIRUPATHI"},
// {"branchCode": null, "branchId": 97, "branchName": "Ambala", "branchType": "Single branch", "cityName": "AMBALA", "region": "Southern",
//   "zone": "AP & Telangana",
//   "state": "ANDHRA PRADESH",
//   "city": "TIRUPATHI"},
// {"branchCode": null, "branchId": 98, "branchName": "Amravati", "branchType": "Single branch", "cityName": "AMRAVATI", "region": "Southern",
//   "zone": "Karnataka",
//   "state": "KARNATAKA",
//   "city": "BANGALORE"},
// {"branchCode": null, "branchId": 99, "branchName": "Amritsar", "branchType": "Single branch", "cityName": "AMRITSAR","region": "Southern",
//   "zone": "AP & Telangana",
//   "state": "ANDHRA PRADESH",
//   "city": "TIRUPATHI"},
// {"branchCode": null, "branchId": 100, "branchName": "Chennai - Annanagar", "branchType": "Multi Branch", "cityName": "CHENNAI", "region": "Southern",
//   "zone": "AP & Telangana",
//   "state": "ANDHRA PRADESH",
//   "city": "TIRUPATHI"},
// {"branchCode": null, "branchId": 101, "branchName": "Anand", "branchType": "Single branch", "cityName": "ANAND", "region": "Southern",
//   "zone": "AP & Telangana",
//   "state": "ANDHRA PRADESH",
//   "city": "TIRUPATHI"},
// {"branchCode": null, "branchId": 102, "branchName": "Mumbai - Andheri", "branchType": "Multi Branch", "cityName": "MUMBAI","region": "Southern",
//   "zone": "Karnataka",
//   "state": "KARNATAKA",
//   "city": "BANGALORE"},
// {"branchCode": null, "branchId": 103, "branchName": "Alwar", "branchType": "Single branch", "cityName": "ALWAR", "region": "Southern",
//   "zone": "Karnataka",
//   "state": "KARNATAKA",
//   "city": "BANGALORE"},
// {"branchCode": null, "branchId": 104, "branchName": "Badlapur", "branchType": "Single branch", "cityName": "BADLAPUR", "region": "Southern",
//   "zone": "Karnataka",
//   "state": "KARNATAKA",
// }];
}
