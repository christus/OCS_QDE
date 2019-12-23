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
  perPage: string;
  currentPage: string;
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
    this.totalItems = parseInt(totalPages) * parseInt(this.perPage);
    if (this.collection != undefined && this.collection != null) {
      for(var i=0; i<this.collection.length; i++){ 
        this.keys[i]=((parseInt(this.perPage)*(parseInt(this.currentPage)-1))+i+ 1);
      }
      for (var x in this.collection) {
        this.collection[x]['columnName'] = this.collection[x]['columnName'].split("_").join(" "); 
        this.collection[x]['isEdit'] = false;
      }
    }
  }
  getData(currentPage?: string) {
    this.qdeHttp.adminGetMinMax(currentPage, this.searchKey).subscribe(res => {
      if (res['Error'] == "0" && res['ProcessVariables']['status'] && res['ProcessVariables']['errorMessage'] == "" && res['ProcessVariables']['minMaxList']!=null) {
        let response = res['ProcessVariables'];
        this.collection = response['minMaxList'];
        this.perPage = response['perPage'];
        this.currentPage = response['currentPage'];
        let totalPages = response['totalPages'];
        this.totalItems = parseInt(totalPages) * parseInt(this.perPage);
        if (this.collection != undefined && this.collection != null) {
          for(var i=0; i<this.collection.length;i++){ 
            this.keys[i]=((parseInt(this.perPage)*(parseInt(this.currentPage)-1))+i+ 1);
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
    this.collection[index]['isEdit']=false;
    this.qdeHttp.adminUpdateMinMax(this.collection[index]).subscribe(res=>{
      if(res['Error'] == "0" && res['ProcessVariables']['status'] && res['ProcessVariables']['errorMessage'] == ""){
        this.isErrorModal = true;
        this.errorMsg = "Updated Successfully";
      }
    })

  }

  pageChanged(value) {
    this.getData(value);
  }
  checkMaxLength(event, index: number) {
    if (event.target.value != "") {
      let fieldType = this.collection[index]['fieldType'];
      let maxValue = this.collection[index]['maxValue'];
      if (fieldType === "Alpha") {
        if (this.collection[index]['maxLength'] != maxValue) {
          this.isErrorModal = true;
          this.errorMsg = "Field accepts only Alphabets. Hence, Maximum Length should be equal to maximum value"
        }
      } else if (fieldType === "Alpha numeric") {
        if (this.collection[index]['maxLength'] != maxValue) {
          this.isErrorModal = true;
          this.errorMsg = "Field is AlphaNumeric. Hence, Maximum Length should be equal to maximum value"
        }
      } else if (fieldType === "Numeric") {
        let maxLength = String(this.collection[index]['maxValue']).length;
        if (this.collection[index]['maxLength'] != maxLength) {
          this.isErrorModal = true;
          this.errorMsg = "Field is Numeric. Hence, Maximum Length should be equal to length of the maximum value"
        }
      }
    }
  }
}