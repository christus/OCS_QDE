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

  constructor(private route: ActivatedRoute,
    private qdeHttp: QdeHttpService) { }

  ngOnInit() {
    let response = this.route.snapshot.data['maxMinLimits']['ProcessVariables'];
    this.collection = response['minMaxList'];
    if (this.collection != undefined && this.collection != null) {
      for (var x in this.collection) {
        this.collection[x]['columnName'] = this.collection[x]['columnName'].split("_").join(" "); 
        this.collection[x]['isEdit'] = false;
      }
    }
    this.perPage = response['perPage'];
    this.currentPage = response['currentPage'];
    let totalPages = response['totalPages'];
    this.totalItems = parseInt(totalPages) * parseInt(this.perPage);
  }
  getData(currentPage?: string) {
    this.qdeHttp.adminGetMinMax(currentPage, this.searchKey).subscribe(res => {
      if (res['Error'] == "0" && res['ProcessVariables']['status'] && res['ProcessVariables']['errorMessage'] == "" && res['ProcessVariables']['minMaxList']!=null) {
        let response = res['ProcessVariables'];
        this.collection = response['minMaxList'];
        if (this.collection != undefined && this.collection != null) {
          for (var x in this.collection) {
            this.collection[x]['columnName'] = this.collection[x]['columnName'].split("_").join(" "); 
            this.collection[x]['isEdit'] = false; 
          }
        }
        this.perPage = response['perPage'];
        this.currentPage = response['currentPage'];
        let totalPages = response['totalPages'];
        this.totalItems = parseInt(totalPages) * parseInt(this.perPage);
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
}
