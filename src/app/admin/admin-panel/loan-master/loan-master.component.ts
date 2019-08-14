import { Component, OnInit } from '@angular/core';
import { QdeHttpService } from 'src/app/services/qde-http.service';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';

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

  isLoginFee: boolean;
  baseFee: number;
  taxApplicable: number;
  variableFee: number;

  loanTypeData: Array<any>;
  selectedLoanTypeData: any;

  data: Array<any>;
  isAdd: boolean;

  currentPage: number;
  perPage: number;
  totalPages: number;
  totalElements: number;

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
    }, err => {
      alert('Something went wrong');
    });

    if(this.isLoanMaster) {
      this.qdeHttp.adminGetAllLoanMaster().subscribe(res => {
        // if(res['ProcessVariables']['loginFee']) {
        //   this.data = res['ProcessVariables']['loginFee'];
        // }
        this.data = res['ProcessVariables']['loanMaster'];
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

  }

  submitForm(form: NgForm) {
    if(form.invalid) {
      alert('Please enter valid data');
    }

    let dude = form.value;
    
    if(this.isLoanMaster) {
      dude.rateOfInterest = parseInt(form.value.rateOfInterest);
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
          this.refresh();
        } else {
          alert(res["ProcessVariables"]['errorMessage']);
        }
      }, err => {
        alert('Something went wrong');
      });
    } else if(this.isLoginFee) {
      this.qdeHttp.adminUpdateLoginFee(dude).subscribe(res => {
        if(res["ProcessVariables"]['status'] == true) {
          this.refresh();
        } else {
          alert(res["ProcessVariables"]['errorMessage']);
        }
      }, err => {
        alert('Something went wrong');
      });
    }
  }

  refresh() {
    if(this.isLoanMaster) {
      this.qdeHttp.adminGetAllLoanMaster().subscribe(res => {
        // if(res['ProcessVariables']['loginFee']) {
        //   this.data = res['ProcessVariables']['loginFee'];
        // }
        this.data = res['ProcessVariables']['loanMaster'];
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

  update(index) {

    let dude;

    if(this.isLoanMaster) {
      dude = {
        userId: this.userId,
        rateOfInterest: parseInt(this.data[index].rateOfInterest),
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
        } else {
          alert(res["ProcessVariables"]['errorMessage']);
        }
      }, err => {
        alert('Something went wrong');
      });
    } else if(this.isLoginFee) {
      this.qdeHttp.adminUpdateLoginFee(dude).subscribe(res => {
        if(res["ProcessVariables"]['status'] == true) {
          this.refresh();
        } else {
          alert(res["ProcessVariables"]['errorMessage']);
        }
      }, err => {
        alert('Something went wrong');
      });
    }
  }

  delete(index) {
    let dude = this.data[index];
    dude.tableName = this.tableName;
    if(confirm("Are you sure?")) {
      this.qdeHttp.softDeleteLov(dude).subscribe(res => {
        // console.log(res['ProcessVariables']);
        this.refresh();
      });
    } 
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
}