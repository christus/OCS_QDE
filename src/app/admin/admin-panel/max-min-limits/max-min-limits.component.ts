import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QdeHttpService } from 'src/app/services/qde-http.service';

@Component({
  selector: 'app-max-min-limits',
  templateUrl: './max-min-limits.component.html',
  styleUrls: ['./max-min-limits.component.css']
})
export class MaxMinLimitsComponent implements OnInit {
  collection: Array<object> = [];
  perPage: number;
  currentPage: number;
  totalItems: number;
  searchKey: string;
  isErrorModal: boolean;
  errorMsg: string;
  keys: Array<number>=[];

  constructor(private route: ActivatedRoute,
    private qdeHttp: QdeHttpService) { }

  ngOnInit() {
    let response = this.route.snapshot.data['maxMinLimits']['ProcessVariables'];
    this.collection = response['minMaxList'];
    this.perPage = response['perPage'];
    this.currentPage = response['currentPage'];
    let totalPages = response['totalPages'];
    this.totalItems = parseInt(totalPages) * this.perPage;
    if (this.collection != undefined && this.collection != null) {
      for(var i=0; i<this.collection.length; i++){ 
        this.keys[i]=((this.perPage*(this.currentPage-1))+i+ 1);
      }
      for (var x in this.collection) {
        this.collection[x]['columnName'] = this.collection[x]['columnName'].split("_").join(" "); 
        this.collection[x]['isEdit'] = false;
      }
    }
  }
  getData(currentPage?: number) {
    this.qdeHttp.adminGetMinMax(currentPage, this.searchKey).subscribe(res => {
      if (res['Error'] == "0" && res['ProcessVariables']['status'] && res['ProcessVariables']['errorMessage'] == "" && res['ProcessVariables']['minMaxList']!=null) {
        let response = res['ProcessVariables'];
        this.collection = response['minMaxList'];
        this.perPage = response['perPage'];
        this.currentPage = response['currentPage'];
        let totalPages = response['totalPages'];
        this.totalItems = parseInt(totalPages) * this.perPage;
        if (this.collection != undefined && this.collection != null) {
          for(var i=0; i<this.collection.length;i++){ 
            this.keys[i]=((this.perPage*(this.currentPage-1))+i+ 1);
          }
          for (var x in this.collection) {
            this.collection[x]['columnName'] = this.collection[x]['columnName'].split("_").join(" "); 
            this.collection[x]['isEdit'] = false; 
          }
        }
      }else if(res['Error'] == "0" && res['ProcessVariables']['status'] && res['ProcessVariables']['errorMessage'] == "" && res['ProcessVariables']['minMaxList']==null){
        this.isErrorModal = true;
        this.errorMsg = "No Data present further";
      }
    })
  }
  edit(index){
    this.collection[index]['isEdit']=true;
  }
  save(index){
    let res = this.checkMaxLength(index);
    if(res==true){
    this.collection[index]['isEdit']=false;
    this.qdeHttp.adminUpdateMinMax(this.collection[index]).subscribe(res=>{
      if(res['Error'] == "0" && res['ProcessVariables']['status'] && res['ProcessVariables']['errorMessage'] == ""){
        this.isErrorModal = true;
        this.errorMsg = "Updated Successfully";
      }
    })
  }
  }

  pageChanged(value) {
    this.getData(value);
  }
  checkMaxLength(index: number) : boolean {
    let fieldType = this.collection[index]['fieldType'];
    let maxValue = this.collection[index]['maxValue'];
    if(parseInt(maxValue) > 99 && (fieldType!="Numeric")){
      this.isErrorModal = true;
      this.errorMsg = "Maximum value for character field cannot be greater than 99";
      return false;
    } else{
    if (fieldType === "Alpha") {
      if (this.collection[index]['maxLength'] != maxValue) {
        this.isErrorModal = true;
        this.errorMsg = "Field accepts only Alphabets. Maximum Length should be equal to maximum value";
        return false;
      } else { return true; }
    } else if (fieldType === "Alpha numeric" || fieldType==="Alpha numeric & special characters") {
      let columnName = this.collection[index]['columnName'];
      if(columnName=="PAN"){
        if(parseInt(this.collection[index]['minValue'])!=10){
          this.isErrorModal = true;
          this.errorMsg = "PAN requires 10 digits. Minimum value cannot be modified";
          return false;  
        }
      }
      if (this.collection[index]['maxLength'] != maxValue) {
        this.isErrorModal = true;
        this.errorMsg = "Field is AlphaNumeric. Maximum Length should be equal to maximum value";
        return false;
      } else { return true; }
    } else if (fieldType === "Numeric") {
      let maxLength = String(this.collection[index]['maxValue']).length;
      let columnName = this.collection[index]['columnName'];
      if(columnName=="Rate Of Interest Decimal"){
        if(parseInt(this.collection[index]['maxValue'])>5){
          this.isErrorModal = true;
          this.errorMsg = "Number of digits beyond decimal point in Rate Of Interest cannot be greater than 5";
          return false;  
        }
      }
      if(columnName=="Mobile Number"){
        if(parseInt(this.collection[index]['minValue'])!=10){
          this.isErrorModal = true;
          this.errorMsg = "Mobile Number requires 10 digits. Minimum value cannot be modified";
          return false;  
        }
      }
      if (this.collection[index]['maxLength'] != maxLength) {
        this.isErrorModal = true;
        this.errorMsg = "Field is Numeric. Maximum Length should be equal to length / total count of the maximum value";
        return false;
      } else { return true; }
    } else if (fieldType === "Phone number") {
      if (this.collection[index]['maxLength'] != maxValue) {
        this.isErrorModal = true;
        this.errorMsg = "Field accepts only Phone number. Maximum Length should be equal to maximum value";
        return false;
      } else { return true; }
    } else if (fieldType === "Pincode") {
      if (this.collection[index]['maxLength'] != maxValue) {
        this.isErrorModal = true;
        this.errorMsg = "Field accepts only Pincode. Maximum Length should be equal to maximum value";
        return false;
      } else if(this.collection[index]['minValue']!="6"){
        this.isErrorModal = true;
        this.errorMsg = "Pincode must be at least 6 digits";
        return false;
      } else { return true; }
    }
  }
}
}