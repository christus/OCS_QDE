import { Component, OnInit } from '@angular/core';
import { QdeService } from 'src/app/services/qde.service';
import { QdeHttpService } from 'src/app/services/qde-http.service';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';

interface Item {
  key: string,
  value: string
}

@Component({
  selector: 'loan-type-purpose-map',
  templateUrl: './loan-type-purpose-map.component.html',
  styleUrls: ['./loan-type-purpose-map.component.css']
})
export class LoanTypePurposeMapComponent implements OnInit {

  loanTypeData: Array<any> = [];
  loanPurposeData: Array<any> = [];

  data: Array<any>;
  tempData: Array<any>;

  selectedLoanTypeData: Item;
  selectedLoanPurposeData: Item;
  userId: number;
  tableName: string;
  isAdd: boolean;
  currentPage:number;
  perPage:number;
  totalElements:number;
  totalPages:number;
  key:Array<number> = [];
  searchKey:string;
  isErrorModal: boolean = false;
  errorMsg: string;
  delIndex: any;
  isConfirmModal: boolean;


  constructor(private qdeHttp: QdeHttpService, private route: ActivatedRoute) {

    this.userId = parseInt(localStorage.getItem('userId'));
    this.tableName = 'loan_type_purpose_map';

    // if(this.route.snapshot.data['eachLovs']['ProcessVariables']['status'] == true) {
    if(this.route.snapshot.data['eachLovs']['ProcessVariables']['loanTypePurposeList']) {

      this.data = this.route.snapshot.data['eachLovs']['ProcessVariables']['loanTypePurposeList'].map(v => {

        console.log("v::", v);

        return {
          userId: this.userId,
          tableName: this.tableName,
          id: v['id'],
          loanPurpose: v['loanPurpose'],
          loanPurposeDescription: v['loanPurposeDescription'],
          loanPurposeValue: v['loanPurposeValue'],
          loanType: v['loanType'],
          loanTypeDescription: v['loanTypeDescription'],
          loanTypeValue: v['loanTypeValue']
        }
      });

      this.currentPage = parseInt(this.route.snapshot.data['eachLovs']['ProcessVariables']['currentPage']);
      this.totalPages = parseInt(this.route.snapshot.data['eachLovs']['ProcessVariables']['totalPages']);
      this.perPage = parseInt(this.route.snapshot.data['eachLovs']['ProcessVariables']['perPage']);
      this.totalElements = this.totalPages* this.perPage;
      // this.perPageCount = Math.ceil(this.totalElements/this.perPage);
      for(var i=0; i<this.data.length;i++){
        this.key[i]=((this.perPage*(this.currentPage-1))+i+ 1);
      }
    }
	/* else {
      this.isErrorModal = true;
      this.errorMsg = "No Data present";
      //alert('No Data Present');
    } */
    // } else {
    //   alert('No Data Present');
    // }
  }

  ngOnInit() {
    this.qdeHttp.adminGetLov().subscribe(res => {
      if(res['ProcessVariables']['status'] == true) {
        var lov= JSON.parse(res['ProcessVariables']['lovs']);
        this.loanTypeData = lov.LOVS.loan_type;
        this.selectedLoanTypeData = this.loanTypeData[0];
		    this.loanPurposeData = lov.LOVS.loan_purpose;
        this.selectedLoanPurposeData = this.loanPurposeData[0];
        console.log("loanTypeData: ", this.loanTypeData);
      }
    }
	/* , err => {
      this.isErrorModal = true;
      this.errorMsg = "Something went wrong";
      //alert('Something went wrong');
    } */
	);

    /* this.qdeHttp.adminGetLov().subscribe(res => {
      if(res['ProcessVariables']['status'] == true) {
        var lov= JSON.parse(res['ProcessVariables']['lovs']);
        
        console.log("loanPurposeData: ", this.loanPurposeData);

      }
    }, err => {
      this.isErrorModal = true;
      this.errorMsg = "Something went wrong";
      //alert('Something went wrong');
    }); */
  }

  add() {
    this.isAdd = !this.isAdd;

    this.selectedLoanTypeData = this.loanTypeData[0];
    this.selectedLoanPurposeData = this.loanPurposeData[0];

  }

  loanTypeChanged(event) {
    this.selectedLoanTypeData = this.loanTypeData.find(v => v.value == event);
    console.log(this.selectedLoanTypeData);
  }

  loanPurposeChanged(event) {
    this.selectedLoanPurposeData = this.loanPurposeData.find(v => v.value == event);
    console.log(this.selectedLoanPurposeData);
  }

  update(index) {
    let dude = {
      userId: this.userId,
      loanType: this.data[index].loanType,
      loanPurpose: this.data[index].loanPurpose,
      tableName: this.tableName,
      id: this.data[index]['id']
    }

    this.qdeHttp.adminInsertUpdateLoanTypePurposeMap(dude).subscribe(res => {
      if(res["ProcessVariables"]['status'] == true) {
        this.isErrorModal = true;
        this.errorMsg = "Updated successfully";
        this.refresh();
      } 
	  /* else {
        this.isErrorModal = true;
        this.errorMsg = "Something went wrong";
        //alert('Something went wrong');
      } */
    }
	/* , err => {
      this.isErrorModal = true;
      this.errorMsg = "Something went wrong";
      //alert('Something went wrong');
    } */
	);
  }

  search(event) {
    this.qdeHttp.adminLoanTypeSearch(event.target.value).subscribe(response => {
      // console.log("mamam",v)
      if(response['ProcessVariables']['status'] && response['ProcessVariables']['loanTypePurposeList']!=null){
        this.isErrorModal = false;
        this.data = response['ProcessVariables']['loanTypePurposeList'].map(v => {
          return {
            userId: this.userId,
            tableName: this.tableName,
            id: v['id'],
            loanPurpose: v['loanPurpose'],
            loanPurposeDescription: v['loanPurposeDescription'],
            loanPurposeValue: v['loanPurposeValue'],
            loanType: v['loanType'],
            loanTypeDescription: v['loanTypeDescription'],
            loanTypeValue: v['loanTypeValue']
          }
        });
          this.currentPage = response['ProcessVariables']['currentPage'];
          this.totalPages = response['ProcessVariables']['totalPages'];
          this.perPage = response ['ProcessVariables']['perPage'];
          this.totalElements = this.totalPages * this.perPage;
          for(var i=0; i<this.data.length;i++){
            this.key[i]=((this.perPage*(this.currentPage-1))+i+ 1);
          }
      }else if(response['ProcessVariables']['status'] && response['ProcessVariables']['loanTypePurposeList']==null) {
        this.isErrorModal = true;
        this.errorMsg = "No data present further";
        //alert("No data present further");
      }
    });
  }

  refresh() {
    this.searchKey="";
    this.selectedLoanTypeData = this.loanTypeData[0];
    this.selectedLoanPurposeData = this.loanPurposeData[0];
    this.qdeHttp.adminLoanTypePurposeMap().subscribe(res => {
      if(res['ProcessVariables']['loanTypePurposeList']) {

        this.data = res['ProcessVariables']['loanTypePurposeList'].map(v => {

          return {
            userId: this.userId,
            tableName: this.tableName,
            id: v['id'],
            loanPurpose: v['loanPurpose'],
            loanPurposeDescription: v['loanPurposeDescription'],
            loanPurposeValue: v['loanPurposeValue'],
            loanType: v['loanType'],
            loanTypeDescription: v['loanTypeDescription'],
            loanTypeValue: v['loanTypeValue']
          }
        });

        this.currentPage = parseInt(res['ProcessVariables']['currentPage']);
        this.totalPages = parseInt(res['ProcessVariables']['totalPages']);
        this.perPage = parseInt(res['ProcessVariables']['perPage']);
        this.totalElements = res['ProcessVariables']['totalPages'] * this.perPage;
        // this.perPageCount = Math.ceil(this.totalElements/this.perPage);
      } 
    }
	/* , err => {
      this.isErrorModal = true;
      this.errorMsg = "Something went wrong while reloading data.";
      //alert('Something went wrong while reloading data.');
    } */
	);
  }

  submitForm(form: NgForm) {
    let dude = form.value;

    dude = {
      userId: this.userId,
      loanType: this.loanTypeData.find(v => v.value == form.value.loan_type)['id'],
      loanPurpose: this.loanPurposeData.find(v => v.value == form.value.loan_purpose)['id'],
      tableName: this.tableName,
      // id: this.data[index]['id']
    };

    this.qdeHttp.adminInsertUpdateLoanTypePurposeMap(dude).subscribe(res => {
      if(res["ProcessVariables"]['status'] == true) {
        this.refresh();
      } 
	  /* else if(res['ProcessVariables']['errorMessage']){
        this.isErrorModal = true;
        this.errorMsg = res['ProcessVariables']['errorMessage'];
        //alert('Something went wrong');
      } */
    }
	/* , err => {
        this.isErrorModal = true;
        this.errorMsg = "Something went wrong";
        //alert('Something went wrong');
    } */
	);
  }


  tableLoanTypeChanged(event, index) {
    let t = this.loanTypeData.find(v => v.value == event);
    this.data[index].loanType = t.id+"";
    this.data[index].loanTypeDescription = t.description;
    this.data[index].loanTypeValue = t.value;
  }

  tableLoanPurposeChanged(event, index) {
    let t = this.loanPurposeData.find(v => v.value == event);
    this.data[index].loanPurpose = t.id+"";
    this.data[index].loanPurposeDescription = t.description;
    this.data[index].loanPurposeValue = t.value;
  }

  delete(index) {
    this.delIndex = this.data[index];
    this.delIndex.tableName = this.tableName;
    this.isConfirmModal = true;
  }
  confirmDelete(){
    this.isConfirmModal = false;
      this.qdeHttp.softDeleteLov(this.delIndex).subscribe(res => {
        // console.log(res['ProcessVariables']);
        if(res["ProcessVariables"]["status"]){this.isErrorModal = true; this.errorMsg = "Deleted successfully"};
        this.refresh();
      }); 
  }
  pageChanged(value){
    this.qdeHttp.adminLoanTypePurposeMap(value,this.perPage,this.searchKey).subscribe(res => {
      if(res['ProcessVariables']['loanTypePurposeList']) {
        this.data = res['ProcessVariables']['loanTypePurposeList'].map(v => {
          return {
            userId: this.userId,
            tableName: this.tableName,
            id: v['id'],
            loanPurpose: v['loanPurpose'],
            loanPurposeDescription: v['loanPurposeDescription'],
            loanPurposeValue: v['loanPurposeValue'],
            loanType: v['loanType'],
            loanTypeDescription: v['loanTypeDescription'],
            loanTypeValue: v['loanTypeValue']
          }
        });
        this.currentPage = value;
        this.totalPages = parseInt(res['ProcessVariables']['totalPages']);
        this.perPage = parseInt(res['ProcessVariables']['perPage']);
        this.totalElements = this.totalPages * this.perPage;
        for(var i=0; i<this.data.length;i++){
          this.key[i]=((this.perPage*(this.currentPage-1))+i+ 1);
        }
      } 
	  /* else {
        this.isErrorModal = true;
        this.errorMsg = "Something went wrong";
        //alert('Something went wrong');
        this.currentPage--;
      } */
    }
	/* , err => {
        this.isErrorModal = true;
        this.errorMsg = "Something went wrong";
        //alert('Something went wrong');
      this.currentPage--;
    } */
	);
  }
}
