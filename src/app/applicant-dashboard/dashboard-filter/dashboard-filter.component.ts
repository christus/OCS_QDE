import { Component, OnInit, Input, DoCheck, Output, EventEmitter } from '@angular/core';
import { multiSelectStatus } from "../../app.constants";
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';

import { UtilService } from "src/app/services/util.service";


import { QdeHttpService } from "src/app/services/qde-http.service";


@Component({
  selector: 'app-dashboard-filter',
  templateUrl: './dashboard-filter.component.html',
  styleUrls: ['./dashboard-filter.component.css']
})

export class DashboardFilterComponent implements OnInit, DoCheck {

  public branches: Array<any>;
  userStatus: Array<any>;
  dropdownSettings = {};
  startDate: Date = null;
  endDate: Date = null;
  dateError: any = { isError: false, errorMessage: '' };
  filterZone: Array<any> = [];
  filterBranch: Array<any> = [];
  filterRegion: Array<any> = [];
  filterState: Array<any> = [];
  filterEmployee: Array<any> = [];
  filterStatus: Array<any> = [];
  userZone: Array<any> = [];
  userRegion: Array<any> = [];
  userState: Array<any> = [];
  userEmployee: Array<any> = [];
  minDate: Date = new Date();
  isActiveFilter: boolean = true;
  isFilterSubmit: boolean = false;
  tempBranch: number = 0;
  userBranch: Array<any>;
  @Input() filterPrefill: any;
  @Output() filterData = new EventEmitter<any>();
  @Output() clearDatas = new EventEmitter<any>();
  requestData: any;
  constructor(
    private qdeHttp: QdeHttpService,
    private utilService: UtilService,
    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit() {
    this.userStatus = multiSelectStatus;
    this.dropdownSettings = {
      singleSelection: false,
      idField: "value",
      textField: "key",
      itemsShowLimit: 2,
      enableCheckAll: true,
      allowSearchFilter: true,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
    };

    console.log('this.filterPrefill', this.filterPrefill)
    if (this.filterPrefill !== null) {
      console.log('this.filterPrefill', this.filterPrefill)

      this.filterPrefillData(this.filterPrefill);
    }

    this.getFilterUserEmpDetails();
  }


  getFilterUserEmpDetails() {
    try {
      this.ngxService.start();
      if (localStorage.getItem("token") && localStorage.getItem("userId")) {
        const startDate = new Date();
        console.log("FilteredLeads Api Call: Start Date & Time ", startDate, startDate.getMilliseconds());
        this.requestData = {
            "userId": localStorage.getItem('userId')
        }
      //   "processId": environment.api.userEmployee.processId,
      //   "ProcessVariables": {
      // },
      // "projectId": environment.api.userEmployee.projectId
        this.qdeHttp.getUserEmpDetails(this.requestData).subscribe((res: any) => {
          const endDate = new Date();
          console.log("FilteredLeads Api Call: End Date & Time ", endDate, endDate.getMilliseconds());

          if (res["Error"] && res["Error"] == 0) {
            // console.log("res['ProcessVariables'] dataNew", res.ProcessVariables);
            const result = res.ProcessVariables.outputUsers;
            console.log("res['ProcessVariables'] dataNew", result);
            this.getFilterUserBranchDetails(result);
            this.userEmployee = Array.from(result.split(","));
          } else if (res["login_required"] && res["login_required"] === true) {
            this.utilService.clearCredentials();
          } else {

            if (res["ErrorMessage"]) {
              alert(res["ErrorMessage"]);
            } else {
              console.log("error ", res);
              this.utilService.clearCredentials();
            }
            return;
          }
        },
          error => {
            console.log(error);
          }
        );
      }
    } catch (ex) {
      alert(ex.message);
    } finally {
      this.ngxService.stop();
    }
  }



  getFilterUserBranchDetails(outputUsers: string) {
    try {
      this.ngxService.start();
      if (localStorage.getItem("token") && localStorage.getItem("userId")) {
        const startDate = new Date();
        console.log("FilteredLeads Api Call: Start Date & Time ", startDate, startDate.getMilliseconds());
        this.requestData = {
          "userId": localStorage.getItem('userId'),
          "outputUsers": outputUsers
        }
        this.qdeHttp.getBranchDetails(this.requestData).subscribe((res: any) => {
          const endDate = new Date();
          console.log("FilteredLeads Api Call: End Date & Time ", endDate, endDate.getMilliseconds());

          if (res["Error"] && res["Error"] == 0) {
            // console.log("res['ProcessVariables'] dataNew", res.ProcessVariables);
            this.userBranch = res.ProcessVariables.branchList;
            // console.log('this.userBranch', res.ProcessVariables);
            this.userState = res.ProcessVariables.stateList;
            this.userZone = res.ProcessVariables.zoneList;
            this.userRegion = res.ProcessVariables.regionList;
            this.tempBranch = this.filterEmployee.length;

            if (this.filterEmployee.length !== this.tempBranch) {
              this.filterState = this.filterState.length ? this.userState.filter(val => !this.filterState.includes(val.value)) : [];
              this.filterZone = this.filterZone.length ? this.userZone.filter(val => !this.filterZone.includes(val.value)) : [];
              this.filterRegion = this.filterRegion.length ? this.userRegion.filter(val => !this.filterRegion.includes(val.value)) : [];
            }

          } else if (res["login_required"] && res["login_required"] === true) {
            this.utilService.clearCredentials();
          } else {

            if (res["ErrorMessage"]) {
              alert(res["ErrorMessage"]);
            } else {
              console.log("error ", res);
              this.utilService.clearCredentials();
            }
            return;
          }
        },
          error => {
            console.log(error);
          }
        );
      }
    } catch (ex) {
      alert(ex.message);
    } finally {
      this.ngxService.stop();
    }
  }

  filterPrefillData(data: any) {
    this.startDate = data.startDate !== undefined ? data.startDate : null;
    this.endDate = data.endDate !== undefined ? data.endDate : null;
    this.filterZone = data.filterZone !== undefined ? data.filterZone : [];
    this.filterRegion = data.filterRegion !== undefined ? data.filterRegion : [];
    this.filterState = data.filterState !== undefined ? data.filterState : [];
    this.filterEmployee = data.filterEmployee !== undefined ? data.filterEmployee : [];
    this.filterStatus = data.filterStatus !== undefined ? data.filterStatus : [];
    this.filterBranch = data.filterBranch !== undefined ? data.filterBranch : [];
  }

  ngDoCheck() {
    this.isFilterSubmit =
      this.startDate === null &&
        this.endDate === null &&
        this.filterZone.length === 0 &&
        this.filterRegion.length === 0 &&
        this.filterState.length === 0 &&
        this.filterEmployee.length === 0 &&
        this.filterStatus.length === 0 &&
        this.filterBranch.length === 0 ? true : false;

    if (this.startDate !== null && (this.endDate === null || this.dateError.isError === true)) {
      this.isFilterSubmit = true;
    } else if (this.isFilterSubmit) {
      const data = {
        submitted: false
      }
      this.filterData.emit(data);
    }
  }

  onDropDownClose() {
    this.requestData = [];
    console.log(' this.filterEmployee.length', this.filterEmployee.length, 'this.tempBranch', this.tempBranch);
    if (this.filterEmployee.length !== this.tempBranch) {
      const data = {
        value: this.filterEmployee.toString()
      }
      console.log('this.filterEmployee.map', data)
      // this.filterEmployee.map((item) => this.requestData.push(item.key));
      // this.getFilterBranchDetails(this.requestData);
      this.getFilterUserBranchDetails(this.filterEmployee.toString());
    }
  }


  endDateMonthDiff(value) {
    var startDate = this.getFormattedDate(this.startDate);
    if (this.endDate != null) {
      var endDate = this.getFormattedDate(this.endDate);
    }
    else {
      return
    }
    var tempStartDate = new Date(startDate);
    var tempEndDate = new Date(endDate);
    var Difference_In_Time = tempEndDate.getTime() - tempStartDate.getTime();
    var Difference_In_Days = Difference_In_Time / (1000 * 60 * 60 * 24);

    if (this.endDate < this.startDate) {
      this.dateError = { isError: true, errorMessage: "End Date cannot come before the start date" };
    }
    else {
      if (Difference_In_Days < 30 && Difference_In_Days > 0) {
        // The selected time is less than 30 days from now
        this.dateError = { isError: false, errorMessage: "" };
      }
      else if (Difference_In_Days > 30) {
        // The selected time is more than 30 days from now
        this.dateError = { isError: true, errorMessage: "Difference between Start date and End date should be less than or equal to 30 Days" };
        this.isFilterSubmit = true;
      }
      else {
        // -Exact- same timestamps.
        this.dateError = { isError: false, errorMessage: "" };
      }
    }
  }


  getFormattedDate(date) {
    console.log("in date conversion " + date);
    let dateFormat = date;
    let year = dateFormat.getFullYear();
    let month = dateFormat.getMonth() + 1;
    let month1 = month < 10 ? '0' + month.toString() : '' + month.toString();
    let day = date.getDate();
    day = day < 10 ? '0' + day : '' + day;
    let formattedDate = year + '-' + month1 + '-' + day;
    console.log("final Value " + formattedDate);
    return formattedDate;
  }

  clearData(filterForm: any) {
    console.log('this.isFilterSubmit', this.isFilterSubmit);
    this.startDate = null;
    this.endDate = null;
    this.filterZone = [];
    this.filterRegion = [];
    this.filterState = [];
    this.filterEmployee = [];
    this.filterStatus = [];
    this.filterBranch = [];
    let data={submitted:true,filterForm:filterForm}
    this.clearDatas.emit(data);
  }

  submitFilter(filterForm: any) {

    this.isActiveFilter = true;
    // filterForm.form.value.filterBranch.map((item: any) => this.requestData.push(item.value));
    // filterForm.form.value.filterBranch = this.requestData.toString();
    // console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@', filterForm, '```````````````````', this.requestData);

    // this.filterBranch.map((item) => this.requestData.push((item.value).toString()));
    // const dataNew = this.requestData.toString()
    // filterForm.form.value.startDate = this.getFormattedDate(this.startDate);
    // filterForm.form.value.endDate = this.getFormattedDate(this.endDate);
    // console.log("endDate", this.endDate)
    // const filterDetais = {
    //   filterZone: this.filterZone,
    //   filterBranch: this.filterBranch,
    //   filterState: this.filterState,
    //   filterRegion: this.filterRegion,
    //   filterAppStatus: this.filterStatus,
    //   filterEmp: this.filterEmployee,
    //   from: this.startDate,
    //   to: this.endDate,
    //   submitted: filterForm.submitted
    // }
    // const finalData = filterForm
    this.filterData.emit(filterForm);
    // console.log('filterForm', filterForm);
  }

}
