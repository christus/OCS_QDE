import { Component, OnInit } from '@angular/core';
import { QdeHttpService } from 'src/app/services/qde-http.service';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { MinMax } from 'src/app/models/qde.model';

@Component({
  selector: 'app-loan-master',
  templateUrl: './loan-master.component.html',
  styleUrls: ['./loan-master.component.css']
})
export class LoanMasterComponent implements OnInit {

  userId: number;
  baseAmount: string;
  rateOfInterest: string;
  tableName: string;
  isLoanMaster: boolean;
  isErrorModal: boolean = false;
  errorMsg: string;
  isLoginFee: boolean;
  baseFee: number;
  taxApplicable: number;
  variableFee: number;
  invalidFeedback : boolean = false;
  loanTypeData: Array<any>;
  selectedLoanTypeData: any;
  searchKey:string = "";

  data: Array<any>;
  isAdd: boolean;

  currentPage: number;
  perPage: number;
  totalPages: number;
  totalElements: number;
  invalidFeedback1: boolean;
  delIndex: any;
  isConfirmModal: boolean;
  minMaxValues: Array<MinMax>;
  rateOfInterestDecimal;
  maxLength: number;
  patternArray  = [
                  /^[0-9]?[0-9]?(\.[0-9]{1,1})?$/,
                  /^[0-9]?[0-9]?(\.[0-9]{1,2})?$/, 
                  /^[0-9]?[0-9]?(\.[0-9]{1,3})?$/,
                  /^[0-9]?[0-9]?(\.[0-9]{1,4})?$/,
                  /^[0-9]?[0-9]?(\.[0-9]{1,5})?$/
                  ];
  ROIpattern: RegExp;

  constructor(private qdeHttp: QdeHttpService, private _route: ActivatedRoute) {

    this._route.params.subscribe(params => {
      this.currentPage = params['currentPage'];
      this.perPage = params['perPage'];
    });

    this.userId = parseInt(localStorage.getItem('userId'));
    if(_route.snapshot.url[1]['path'] == 'loan_master') {
      this.tableName = 'loan_master';
      this.isLoanMaster = true;
      this.isLoginFee = false;
    } if(_route.snapshot.url[1]['path'] == 'login_fee') {
      this.tableName = 'login_fee';
      this.isLoanMaster = false;
      this.isLoginFee = true;
    }

    this.qdeHttp.adminLoadMoreLovs('loan_type').subscribe(res => {
      if(res['ProcessVariables']['status'] == true) {
        this.loanTypeData = res['ProcessVariables']['valueDescription'];
        this.selectedLoanTypeData = this.loanTypeData[0];
      }
    }
	/* , err => {
      this.isErrorModal = true;
      this.errorMsg = "Something went wrong";
      //alert('Something went wrong');
    } */
	);

    if(this.isLoanMaster) {
      this.qdeHttp.adminGetAllLoanMaster().subscribe(res => {
        // if(res['ProcessVariables']['loginFee']) {
        //   this.data = res['ProcessVariables']['loginFee'];
        // }
        this.data = res['ProcessVariables']['loanMaster'];
        this.currentPage = parseInt(res['ProcessVariables']['currentPage']);
        this.totalPages = parseInt(res['ProcessVariables']['totalPages']);
        this.perPage = parseInt(res['ProcessVariables']['perPage']);
        this.totalElements = parseInt(res['ProcessVariables']['totalPages']) * this.perPage;
        this.qdeHttp.adminGetMinMax(1,"rate").subscribe(res=>{
          this.minMaxValues = res['ProcessVariables']['minMaxList'];
          this.maxLength = 3+parseInt(res['ProcessVariables']['minMaxList'][0]['maxValue']);
          let decimal = res['ProcessVariables']['minMaxList'][0]['maxValue'];
          let pattern = this.patternArray[decimal-1];
          this.ROIpattern = pattern;
          })
      }, err => {
  
      });
    } else if(this.isLoginFee) {
      this.qdeHttp.adminGetAllLoginFee().subscribe(res => {
        // if(res['ProcessVariables']['loginFee']) {
        //   this.data = res['ProcessVariables']['loginFee'];
        // }
        this.data = res['ProcessVariables']['loginFee'];
        this.currentPage = parseInt(res['ProcessVariables']['currentPage']);
        this.totalPages = parseInt(res['ProcessVariables']['totalPages']);
        this.perPage = parseInt(res['ProcessVariables']['perPage']);
        this.totalElements = parseInt(res['ProcessVariables']['totalPages']) * this.perPage;

      }, err => {
  
      });
    }
  }

  ngOnInit() {
  }

  loanTypeChanged(event) {
    this.selectedLoanTypeData = this.loanTypeData.find(v => v.id == event);
  }

  tableLoanTypeChanged(event, index) {
    let t = this.loanTypeData.find(v => v.id == event);
    this.data[index].loanType = t.id+"";
    this.data[index].loanTypeDescription = t.description;
    this.data[index].loanTypeValue = t.value;
  }

  add() {
    this.isAdd = !this.isAdd;

    this.selectedLoanTypeData = this.loanTypeData[0];
    if(this.isLoginFee){this.baseFee = this.variableFee = this.taxApplicable = null;}
    if(this.isLoanMaster){this.rateOfInterest = this.baseAmount = null;}
    this.refresh();
  }

  submitForm(form: NgForm) {
    if(form.invalid) {
      this.isErrorModal = true;
      this.errorMsg = "Please enter valid data";
      //alert('Please enter valid data');
    }

    let dude = form.value;
    
    if(this.isLoanMaster) {
      dude.rateOfInterest = parseFloat(form.value.rateOfInterest);
      dude.baseAmount = parseInt(form.value.baseAmount);
      dude.tableName = this.tableName;
    } else if(this.isLoginFee) {
      dude.baseFee = parseInt(form.value.baseFee);
      dude.taxApplicable = parseFloat(parseFloat(form.value.taxApplicable+"").toFixed(2));
      dude.variableFee = parseFloat(parseFloat(form.value.variableFee+"").toFixed(2));
      dude.loanType = form.value.loanType+"";
    }
    
    dude.userId = this.userId;
    dude.tableName = this.tableName;
    dude.loanType = form.value.loanType+"";

    console.log(form.value);

    if(this.isLoanMaster) {
      this.qdeHttp.adminUpdateLoanMaster(dude).subscribe(res => {
        if(res["ProcessVariables"]['status'] == true) {
          this.isErrorModal = true;
          this.errorMsg = "Added Successfully";
          this.refresh();
        } 
		/* else {
          this.isErrorModal = true;
          this.errorMsg = res["ProcessVariables"]['errorMessage'];
          //alert(res["ProcessVariables"]['errorMessage']);
        } */
      }
	  /* , err => {
        this.isErrorModal = true;
        this.errorMsg = "Something went wrong";
        //alert('Something went wrong');
      } */
	  );
    } else if(this.isLoginFee) {
      this.qdeHttp.adminUpdateLoginFee(dude).subscribe(res => {
        if(res["ProcessVariables"]['status'] == true) {
          this.refresh();
        }
		/* else {
          this.isErrorModal = true;
          this.errorMsg = res["ProcessVariables"]['errorMessage'];
          //alert(res["ProcessVariables"]['errorMessage']);
        } */
      }
	  /* , err => {
        this.isErrorModal = true;
        this.errorMsg = "Something went wrong";
        //alert('Something went wrong');
      } */
	  );
    }
  }

  search(event){
    if(this.isLoanMaster) {
      this.qdeHttp.adminSearchAllLoanMaster(event.target.value).subscribe(res => {
        if(res["ProcessVariables"]["status"] && res["ProcessVariables"]["loanMaster"]!=null){
        this.data = res['ProcessVariables']['loanMaster'];
        this.currentPage = parseInt(res['ProcessVariables']['currentPage']);
        this.totalPages = parseInt(res['ProcessVariables']['totalPages']);
        this.perPage = parseInt(res['ProcessVariables']['perPage']);
        this.totalElements = parseInt(res['ProcessVariables']['totalPages']) * this.perPage;
      }else if(res["ProcessVariables"]["status"] && res["ProcessVariables"]["loanMaster"]==null) {
        this.isErrorModal = true;
        this.errorMsg = "No data present further";
      }
      }, err => {}
      );
    } 
    else if(this.isLoginFee) {
      this.qdeHttp.adminSearchAllLoginFee(event.target.value).subscribe(res => {
        if(res["ProcessVariables"]["status"] && res["ProcessVariables"]["loginFee"]!=null ){
        this.data = res['ProcessVariables']['loginFee'];
        this.currentPage = parseInt(res['ProcessVariables']['currentPage']);
        this.totalPages = parseInt(res['ProcessVariables']['totalPages']);
        this.perPage = parseInt(res['ProcessVariables']['perPage']);
        this.totalElements = parseInt(res['ProcessVariables']['totalPages']) * this.perPage;
      } else if(res["ProcessVariables"]["status"] && res["ProcessVariables"]["loginFee"]==null){
        this.isErrorModal = true;
        this.errorMsg = "No data present further";
      }
      }, err => {
  
      });
    }
  }

  refresh() {
    if(this.isLoanMaster) {
      this.searchKey="";
      this.qdeHttp.adminGetAllLoanMaster().subscribe(res => {
        // if(res['ProcessVariables']['loginFee']) {
        //   this.data = res['ProcessVariables']['loginFee'];
        // }
        this.data = res['ProcessVariables']['loanMaster'];
        this.currentPage = 1; 
        this.totalPages = parseInt(res['ProcessVariables']['totalPages']);
        this.perPage = parseInt(res['ProcessVariables']['perPage']);
        this.totalElements = parseInt(res['ProcessVariables']['totalPages']) * this.perPage;
      }, err => {
  
      });
    } else if(this.isLoginFee) {
      this.searchKey="";
      this.qdeHttp.adminGetAllLoginFee().subscribe(res => {
        // if(res['ProcessVariables']['loginFee']) {
        //   this.data = res['ProcessVariables']['loginFee'];
        // }
        this.data = res['ProcessVariables']['loginFee'];
        this.currentPage = 1; 
        this.totalPages = parseInt(res['ProcessVariables']['totalPages']);
        this.perPage = parseInt(res['ProcessVariables']['perPage']);
        this.totalElements = parseInt(res['ProcessVariables']['totalPages']) * this.perPage;
      }, err => {
  
      });
    }
  }

  update(index) {

    let dude;

    if(this.isLoanMaster) {
      dude = {
        userId: this.userId,
        rateOfInterest: parseFloat(this.data[index].rateOfInterest),
        baseAmount: parseInt(this.data[index].baseAmount),
        loanType: this.data[index].loanType,
        tableName: this.tableName,
        id: this.data[index]['id']
      }
    } else if(this.isLoginFee) {
      dude = {
        userId: this.userId,
        tableName: this.tableName,
        loanType: this.data[index].loanType,
        baseFee: parseFloat(parseFloat(this.data[index].baseFee).toFixed(2)),
        taxApplicable: parseFloat(parseFloat(this.data[index].taxApplicable).toFixed(2)),
        variableFee: parseFloat(parseFloat(this.data[index].variableFee).toFixed(2)),
        id: this.data[index]['id']
      }
    }

    if(this.isLoanMaster) {
      this.qdeHttp.adminUpdateLoanMaster(dude).subscribe(res => {
        if(res["ProcessVariables"]['status'] == true) {
          this.refresh();
        }
		/* else {
          this.isErrorModal = true;
          this.errorMsg = res["ProcessVariables"]['errorMessage'];
          //alert(res["ProcessVariables"]['errorMessage']);
        } */
      }
	  /* , err => {
        this.isErrorModal = true;
        this.errorMsg = "Something went wrong";
        //alert('Something went wrong');
      } */
	  );
    } else if(this.isLoginFee) {
      this.qdeHttp.adminUpdateLoginFee(dude).subscribe(res => {
        if(res["ProcessVariables"]['status'] == true) {
          this.refresh();
        }
		/* else {
          this.isErrorModal = true;
          this.errorMsg = res["ProcessVariables"]['errorMessage'];
          //alert(res["ProcessVariables"]['errorMessage']);
        } */
      }
	  /* , err => {
        this.isErrorModal = true;
        this.errorMsg = "Something went wrong";
        //alert('Something went wrong');
      } */
	  );
    }
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
        if(res["ProcessVariables"]["status"]){this.isErrorModal = true; this.errorMsg="Deleted Successfully";}
        this.refresh();
      });
  }

  loadMore() {
    this.qdeHttp.adminGetAllLoginFee((this.currentPage+1), this.perPage).subscribe(res => {
      // if(res['ProcessVariables']['loginFee']) {
      //   this.data = res['ProcessVariables']['loginFee'];
      // }
      this.data = this.data.concat(res['ProcessVariables']['loginFee']);
      this.currentPage = parseInt(res['ProcessVariables']['currentPage']);
      this.totalPages = parseInt(res['ProcessVariables']['totalPages']);
      this.perPage = parseInt(res['ProcessVariables']['perPage']);
      this.totalElements = parseInt(res['ProcessVariables']['totalPages']) * this.perPage;

    }, err => {

    });    
  }
  pageChanged(value) {
    if (this.isLoanMaster) {
      this.qdeHttp.adminGetAllLoanMaster(value, this.perPage, this.searchKey).subscribe(res => {
        this.data = res['ProcessVariables']['loanMaster'];
        this.currentPage = value;
        this.totalPages = parseInt(res['ProcessVariables']['totalPages']);
        this.perPage = parseInt(res['ProcessVariables']['perPage']);
        this.totalElements = parseInt(res['ProcessVariables']['totalPages']) * this.perPage;
      }
	  /* , err => {
        this.isErrorModal = true;
        this.errorMsg = "Something went wrong";
      } */
	  );
    } else if (this.isLoginFee) {
      this.qdeHttp.adminGetAllLoginFee(value,this.perPage,this.searchKey).subscribe(res => {
        this.data = res['ProcessVariables']['loginFee'];
        this.currentPage = value;
        this.totalPages = parseInt(res['ProcessVariables']['totalPages']);
        this.perPage = parseInt(res['ProcessVariables']['perPage']);
        this.totalElements = parseInt(res['ProcessVariables']['totalPages']) * this.perPage;

      }
	  /* , err => {
        this.isErrorModal = true;
        this.errorMsg = "Something went wrong";
      } */
	  );
     }
  }

  checkDecimals(event){
  if(event.target.name == "taxApplicable"){
  let num = event.target.value;
  let pattern = /^[0-9]?[0-9]?(\.[0-9]{1,2})?$/;
  if(!pattern.test(num)){
    this.invalidFeedback = true;
  }else{
    this.invalidFeedback = false;
  }
  }else if(event.target.name=="rateOfInterest"){
  let num = event.target.value;
  let pattern = this.ROIpattern;
  if(!pattern.test(num)){
    this.invalidFeedback = true;
  }else{
    this.invalidFeedback = false;
  }
  }
  }
  checkDecimals1(event){
    if(event.target.name == "taxApplicable"){
      let num = event.target.value;
      let pattern = /^[0-9]?[0-9]?(\.[0-9]{1,2})?$/;
      if(!pattern.test(num)){
        this.invalidFeedback1 = true;
      }else{
        this.invalidFeedback1 = false;
      }
      }else if(event.target.name=="rateOfInterest"){
      let num = event.target.value;
      let pattern = this.ROIpattern;
      if(!pattern.test(num)){
        this.invalidFeedback1 = true;
      }else{
        this.invalidFeedback1 = false;
      }
      }
  }
}
