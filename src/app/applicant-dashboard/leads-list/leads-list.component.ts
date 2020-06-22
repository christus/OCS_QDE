import { Router } from '@angular/router';
import { MobileService } from './../../services/mobile-constant.service';
import { Component, OnInit } from "@angular/core";
import { QdeHttpService } from "src/app/services/qde-http.service";
import { UtilService } from "src/app/services/util.service";
import { from } from "rxjs";
import { CommonDataService } from "src/app/services/common-data.service";
import { statuses, screenPages } from "../../app.constants";
import { TabsComponent } from "./tabs/tabs.component";
import { EncryptService } from "src/app/services/encrypt.service";
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { THROW_IF_NOT_FOUND } from '@angular/core/src/di/injector';
import { } from 'ng-multiselect-dropdown';
import { ValueTemplateDirective } from '@progress/kendo-angular-dropdowns';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FormPrintComponent } from 'src/app/addtional-service/form-print/form-print.component';

export interface UserDetails {
  "amountEligible": number;
  "amountRequired": number;
  "firstName": string;
  "ocsNumber": number;
  "url": string;
}
interface leadData {
  name: string,
  loanType: string,
  leadId: string,
  assignedTo: string,
  loanAmount: string,
  createdBy: string,
  createdOn: string,
  emailId: string,
  mobileNumber: string,
  zipcode: string,
  url: string,
  queryParams: string,
}
interface Item {
  key: string,
  value: string
}

@Component({
  selector: "app-leads-list",
  templateUrl: "./leads-list.component.html",
  styleUrls: ["./leads-list.component.css"]
})
export class LeadsListComponent implements OnInit {

  days: Array<Item>;
  months: Array<Item>;
  years: Array<Item>;
  assignedToList: Array<Item> = [{ key: "SA", value: "SA" }, { key: "SA", value: "SM" }];
  leadDetail: leadData;
  YYYY: number = new Date().getFullYear();

  fromDay: Item;
  fromMonth: Item;
  fromYear: Item;
  toDay: Item;
  toMonth: Item;
  toYear: Item;
  assignedTo: Item;
  searchTxt: string;
  show: boolean = false;
  isLogoutVisible: boolean;
  // Lead ID === Application ID
  userDetails: Array<UserDetails>;
  userFilterDetails: Array<UserDetails>;
  newLeadsDetails: Array<any>;
  newPendingApplicationDetails: Array<any>;
  newPendingPaymentDetails: Array<any>;

  isEligibilityForReviews: Array<{ applicationId: string, isEligibilityForReview: boolean }> = [];
  isTBMLoggedIn: boolean;
  allStatus: string = "";
  newLeadsStatus: string = "5";
  pendingAppStatus: string = "pendingApplication";
  pendingPaymentStatus: string = "pendingPayment";
  isMobile: boolean;
  perPage: number;
  currentPage: number;
  totalPages: string;
  totalItems: number;
  perPageFL: number;
  currentPageFL: number;
  totalPagesFL: string;
  totalItemsFL: number;
  perPageNL: number;
  currentPageNL: number;
  totalPagesNL: string;
  totalItemsNL: number;
  perPagePA: number;
  currentPagePA: number;
  totalPagesPA: string;
  totalItemsPA: number;
  perPagePP: number;
  currentPagePP: number;
  totalPagesPP: string;
  totalItemsPP: number;
  newLogin: boolean = false;
  createLead: boolean = false;
  documentUpload: boolean = false;
  eligibilityReview: boolean = false;
  isMultipleBranch: boolean = true;
  isMultipleBranchModal: boolean;
  // multipleBranchesData: Array<Item>;
  defaultItem: Item = { key: 'Select...', value: null };

  multipleBranchesData: Array<Item> = [];
  selectedItems = [];
  // dropdownSettings = {};
  isShowFilter: boolean = false;
  isFilterApply: boolean = false;
  filterData: any = null;
  dropdownSettings = {
    singleSelection: true,
    idField: 'value',
    textField: 'key',
    itemsShowLimit: 3,
    allowSearchFilter: true,
    closeDropDownOnSelection: true
  };
  requestData: any;
  isDataNotFound: boolean = false;

  constructor(private service: QdeHttpService, private utilService: UtilService,
    private cds: CommonDataService,
    private mobileService: MobileService,
    private router: Router,
    private ngxService: NgxUiLoaderService) {
    this.isMobile = this.mobileService.isMobile;
    // if(this.isMobile) {
    //   let isFirstTime = localStorage.getItem("firstTime");
    //   console.log("on reload of application -leads", isFirstTime);

    //   if(isFirstTime == null) {
    //     this.router.navigate(['/setPin']);
    //     return;
    //   }  
    // }
    let roleName = localStorage.getItem("roles");
    // if(roleName.includes("Admin")) {
    //   this.router.navigate(["/admin/lovs"]);
    //   //this.router.navigate(["/user-module"]);
    //   return;
    // }
    this.cds.setactiveTab(screenPages["applicantDetails"]);
    this.cds.changeApplicationId(null);

    this.days = Array.from(Array(31).keys()).map((val, index) => {
      let v = ((index + 1) < 10) ? "0" + (index + 1) : (index + 1) + "";
      return { key: v, value: v };
    });
    this.days.unshift({ key: "DD", value: "DD" });

    this.months = Array.from(Array(12).keys()).map((val, index) => {
      let v = ((index + 1) < 10) ? "0" + (index + 1) : (index + 1) + "";
      return { key: v, value: v };
    });
    this.months.unshift({ key: "MM", value: "MM" });

    this.years = Array.from(Array(100).keys()).map((val, index) => {
      let v = (this.YYYY - index) + "";
      return { key: v, value: v };
    });
    this.years.unshift({ key: "YYYY", value: "YYYY" });

    this.fromDay = { key: "DD", value: "DD" };
    this.fromMonth = { key: "MM", value: "MM" };
    this.fromYear = { key: "YYYY", value: "YYYY" };
    this.toDay = { key: "DD", value: "DD" };
    this.toMonth = { key: "MM", value: "MM" };
    this.toYear = { key: "YYYY", value: "YYYY" };

    this.assignedTo = this.assignedToList[0];
    if (localStorage.getItem("token") && localStorage.getItem("userId")) {
      this.getFilteredLeads();
      // this.getNewLeads();
      // this.getPendingApplication();
      // this.getPendingPayment();
    } else {

      this.utilService.clearCredentials();
      return;
    }


  }

  isloggedIn() {
    return this.utilService.isLoggedIn();
  }

  clearCredentials() {
    return this.utilService.clearCredentials();
  }

  logout() {

    // this.service.logout().subscribe(
    //   res => {
    //   },
    //   error => {
    //   }
    // );
    this.utilService.clearCredentials();
  }

  branchList: Array<Item> = [];

  ngOnInit() {
    this.cds.showCreateLead$.subscribe(myValue =>
      this.createLead = myValue)

    this.cds.showNewLogin$.subscribe(value =>
      this.newLogin = value)
    this.cds.documetUploadStatus$.subscribe(value =>
      this.documentUpload = value)
    this.cds.eligibilityReview$.subscribe(value =>
      this.eligibilityReview = value);
    this.cds.isMuultipleBranch$.subscribe(value =>
      this.isMultipleBranch = value
    )
    this.cds.branchList$.subscribe(value =>
      this.branchList = value);
    // if (this.createLead ) {
    // this.getFilteredLeads();
    this.getNewLeads();
    // } else if (this.newLogin || this.documentUpload){
    this.getPendingApplication();
    this.getPendingPayment();
    // }



    //  else {
    //   this.utilService.clearCredentials();
    //   return;
    // }
    this.branchListForm();

  }

  filterLeads(event: any) {
    this.getFilteredLeads();
  }

  getPendingApplication(currentPage?: string) {

    if (localStorage.getItem("token") && localStorage.getItem("userId")) {
      const startDate = new Date();
      console.log("PendingApplication Api Call: Start Date & Time ", startDate, startDate.getMilliseconds());
      this.service.getLeads(this.searchTxt, this.fromDay.value, this.fromMonth.value, this.fromYear.value, this.toDay.value, this.toMonth.value, this.toYear.value, "", this.pendingAppStatus, currentPage).subscribe(
        res => {
          const endDate = new Date();
          console.log("PendingApplication Api Call: End Date & Time ", endDate, endDate.getMilliseconds());
          console.log(res);

          if (res["Error"] && res["Error"] == 0) {
            this.perPagePA = res['ProcessVariables']['perPage'];
            this.currentPagePA = res['ProcessVariables']['currentPage'];
            let totalPages = res['ProcessVariables']['totalPages'];
            this.totalItemsPA = parseInt(totalPages) * this.perPagePA;
            this.newPendingApplicationDetails = res["ProcessVariables"].userDetails || [];

            this.newPendingApplicationDetails.forEach(el => {
              el.url = this.getUrl(el["status"], el["leadId"], el["applicantId"], this.getRoles(), el);
              if (el["auditTrialTabPage"] != null && el["auditTrialPageNumber"] != null) {
                el["queryParams"] = {
                  tabName: el["auditTrialTabPage"],
                  page: el["auditTrialPageNumber"],
                }
              } else {
                el["queryParams"] = null;
              }
            });

            this.cds.setIsEligibilityForReviews(this.isEligibilityForReviews);
            // this.isTBMLoggedIn = this.getRoles().includes("TBM") || this.getRoles().includes("TMA");
            this.cds.setIsTBMLoggedIn(this.isTBMLoggedIn);
          } else if (res["login_required"] && res["login_required"] === true) {
            this.utilService.clearCredentials();
            // alert(res['message']);
          } else {
            if (res["ErrorMessage"]) {
              alert(res["ErrorMessage"]);
            }
          }
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  getPendingPayment(currentPage?: string) {
    if (localStorage.getItem("token") && localStorage.getItem("userId")) {
      const startDate = new Date();
      console.log("PendingPayment Api Call: Start Date & Time ", startDate, startDate.getMilliseconds());
      this.service.getLeads(this.searchTxt, this.fromDay.value, this.fromMonth.value, this.fromYear.value,
        this.toDay.value, this.toMonth.value, this.toYear.value, "", this.pendingPaymentStatus, currentPage).subscribe(
          res => {
            const endDate = new Date();
            console.log("PendingPayment Api Call: End Date & Time ", endDate, endDate.getMilliseconds());
            // console.log(res);
            if (res["Error"] && res["Error"] == 0) {
              this.perPagePP = res['ProcessVariables']['perPage'];
              this.currentPagePP = res['ProcessVariables']['currentPage'];
              let totalPages = res['ProcessVariables']['totalPages'];
              this.totalItemsPP = parseInt(totalPages) * this.perPagePP;
              this.newPendingPaymentDetails = res["ProcessVariables"].userDetails || [];

              this.newPendingPaymentDetails.forEach(el => {
                el.url = this.getUrl(el["status"], el["leadId"], el["applicantId"], this.getRoles(), el);
                if (el["auditTrialTabPage"] != null && el["auditTrialPageNumber"] != null) {
                  el["queryParams"] = {
                    tabName: el["auditTrialTabPage"],
                    page: el["auditTrialPageNumber"],
                  }
                } else {
                  el["queryParams"] = null;
                }
              });

              this.cds.setIsEligibilityForReviews(this.isEligibilityForReviews);
              // this.isTBMLoggedIn = this.getRoles().includes("TBM") || this.getRoles().includes("TMA");
              this.cds.setIsTBMLoggedIn(this.isTBMLoggedIn);
            } else if (res["login_required"] && res["login_required"] === true) {
              this.utilService.clearCredentials();
              // alert(res['message']);
            } else {
              if (res["ErrorMessage"]) {
                alert(res["ErrorMessage"]);
              }
              return;
            }
          },
          error => {
            console.log(error);
          }
        );
    }
  }
  getNewLeads(currentPage?: string) {
    if (localStorage.getItem("token") && localStorage.getItem("userId")) {
      const startDate = new Date();
      console.log("New Leads Api Call: Start Date & Time ", startDate, startDate.getMilliseconds());
      this.service.getNewLeads(this.searchTxt, this.fromDay.value, this.fromMonth.value, this.fromYear.value,
        this.toDay.value, this.toMonth.value, this.toYear.value, "", "", currentPage).subscribe(
          res => {
            const endDate = new Date();
            console.log("New Leads Api Call: End Date & Time ", endDate, endDate.getMilliseconds());
            // console.log(res);

            if (res["Error"] && res["Error"] == 0) {
              this.perPageNL = res['ProcessVariables']['perPage'];
              this.currentPageNL = res['ProcessVariables']['currentPage'];
              let totalPages = res['ProcessVariables']['totalPages'];
              this.totalItemsNL = parseInt(totalPages) * this.perPageNL;
              this.newLeadsDetails = res["ProcessVariables"].userDetails || [];

              this.newLeadsDetails.forEach(el => {
                el.url = this.getUrl(el["status"], el["leadId"], el["applicantId"], this.getRoles(), el);
                if (el["auditTrialTabPage"] != null && el["auditTrialPageNumber"] != null) {
                  el["queryParams"] = {
                    tabName: el["auditTrialTabPage"],
                    page: el["auditTrialPageNumber"],
                  }
                } else {
                  el["queryParams"] = null;
                }
              });

              this.cds.setIsEligibilityForReviews(this.isEligibilityForReviews);
              // this.isTBMLoggedIn = this.getRoles().includes("TBM") || this.getRoles().includes("TMA");
              this.cds.setIsTBMLoggedIn(this.isTBMLoggedIn);
            } else if (res["login_required"] && res["login_required"] === true) {
              this.utilService.clearCredentials();
              // alert(res['message']);
            } else {
              if (res["ErrorMessage"]) {
                alert(res["ErrorMessage"]);
              }
            }
          },
          error => {
            console.log(error);
          }
        );
    }

  }

  getFilteredLeads(currentPage?: string) {
    try {
      this.ngxService.start();
      if (localStorage.getItem("token") && localStorage.getItem("userId")) {
        const startDate = new Date();
        console.log("FilteredLeads Api Call: Start Date & Time ", startDate, startDate.getMilliseconds());
        this.service.getLeads(this.searchTxt, this.fromDay.value, this.fromMonth.value, this.fromYear.value,
          this.toDay.value, this.toMonth.value, this.toYear.value, "", this.allStatus, currentPage).subscribe(
            res => {
              const endDate = new Date();
              console.log("FilteredLeads Api Call: End Date & Time ", endDate, endDate.getMilliseconds());
              // let decpty = this.encryptService.decryptResponse(res);
              // console.log("dectypt ",decpty);
              console.log("dectypt ", res);

              if (res["Error"] && res["Error"] == 0) {
                this.perPage = res['ProcessVariables']['perPage'];
                this.currentPage = res['ProcessVariables']['currentPage'];
                let totalPages = res['ProcessVariables']['totalPages'];
                this.totalItems = parseInt(totalPages) * this.perPage;
                console.log("???" + this.perPage + "this.currentPage" + this.currentPage + "this.totalItems" + this.totalItems);
                this.userDetails = res["ProcessVariables"].userDetails || [];

                this.userDetails.forEach(el => {
                  el.url = this.getUrl(el["status"], el["leadId"], el["applicantId"], this.getRoles(), el);
                  if (el["auditTrialTabPage"] != null && el["auditTrialPageNumber"] != null) {
                    el["queryParams"] = {
                      tabName: el["auditTrialTabPage"],
                      page: el["auditTrialPageNumber"],
                    }
                  }
                  else {
                    el["queryParams"] = null;
                  }
                });

                this.cds.setIsEligibilityForReviews(this.isEligibilityForReviews);
                // this.isTBMLoggedIn = this.getRoles().includes("TBM") || this.getRoles().includes("TMA");
                this.cds.setIsTBMLoggedIn(this.isTBMLoggedIn);
              } else if (res["login_required"] && res["login_required"] === true) {
                this.utilService.clearCredentials();
                // alert(res['message']);
              } else {

                if (res["ErrorMessage"]) {
                  alert(res["ErrorMessage"]);
                } else {
                  console.log("error ", res);
                  // alert("Session expired. Please login");
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

  getUrl(status: string, applicationId?: string, applicantId?: string, roles?: Array<string>, el?: any) {
    if (roles.includes("TBM") || roles.includes("TMA")) {
      this.cds.setReadOnlyForm(true);
    } else {
      this.cds.setReadOnlyForm(false);
    }

    // console.log("status", status);


    if (statuses[status] == "1") {
      this.isEligibilityForReviews.push({ applicationId: applicationId, isEligibilityForReview: false });

      if (screenPages["applicantDetails"] == el["auditTrialScreenPage"]) {
        return "/applicant/" + applicationId;
      } else if (screenPages["coApplicantDetails"] == el["auditTrialScreenPage"]) {
        el["queryParams"] = { tabName: "dashboard", page: 1 };
        return "/applicant/" + applicationId + "/co-applicant";
      } else if (screenPages["loanDetails"] == el["auditTrialScreenPage"]) {
        return "/loan/" + applicationId;
      } else if (screenPages["references"] == el["auditTrialScreenPage"]) {
        return "/references/" + applicationId;
      } else if (screenPages["documentUploads"] == el["auditTrialScreenPage"]) {
        el["queryParams"] = { tabName: "dashboard", page: 1 };
        return "/document-uploads/" + applicationId;
      } else {
        // if adit trail not aviialble
        return "/applicant/"+applicationId

      }     
    } else if(statuses[status] == "2") {
      return "/applicant/"+applicationId;
    }
    else if(statuses[status] == "5") {
      this.isEligibilityForReviews.push({applicationId: applicationId, isEligibilityForReview: false});
          
      return "/document-uploads/"+applicationId;
    } 
    else if(statuses[status] == "10") {
      this.isEligibilityForReviews.push({applicationId: applicationId, isEligibilityForReview: false});
          
      return "/document-uploads/"+applicationId;
    } 
    else if(statuses[status] == "15") {
      this.isEligibilityForReviews.push({applicationId: applicationId, isEligibilityForReview: false});
      
      // return "/payments/online-summary/"+applicationId;
      return "/payments/offline-payments/" + applicationId;
    }
    else if (statuses[status] == "16") {
      this.isEligibilityForReviews.push({ applicationId: applicationId, isEligibilityForReview: false });

      return "/document-uploads/" + applicationId;
    }
    else if (statuses[status] == "17") {
      this.isEligibilityForReviews.push({ applicationId: applicationId, isEligibilityForReview: false });

      // return "/document-uploads/"+applicationId;
      return "/payments/offline-payments/" + applicationId;
    }
    else if (statuses[status] == "20") {
      this.isEligibilityForReviews.push({ applicationId: applicationId, isEligibilityForReview: false });

      return "/payments/eligibility-check/" + applicationId;
    }
    else if (statuses[status] == "25") {
      this.isEligibilityForReviews.push({ applicationId: applicationId, isEligibilityForReview: false });

      // return "/document-uploads/"+applicationId;
      return "/payments/eligibility-check/" + applicationId;
    }
    else if (statuses[status] == "26") {

      // if(roles.includes("TBM") || roles.includes("TMA")) {
      if (this.eligibilityReview) {

        this.isEligibilityForReviews.push({ applicationId: applicationId, isEligibilityForReview: true });
        return "/review-eligibility/" + applicationId;
      } else {
        this.isEligibilityForReviews.push({ applicationId: applicationId, isEligibilityForReview: false });

      }
      return "/document-uploads/" + applicationId;

    }
    else if (statuses[status] == "27") {
      this.isEligibilityForReviews.push({ applicationId: applicationId, isEligibilityForReview: false });

      return "/view-form/" + applicationId;
    }
    else if (statuses[status] == "28") {
      this.isEligibilityForReviews.push({ applicationId: applicationId, isEligibilityForReview: false });

      return "/document-uploads/" + applicationId;
    }
    else if (statuses[status] == "30") {
      this.isEligibilityForReviews.push({ applicationId: applicationId, isEligibilityForReview: false });
      return "/payments/eligibility-check/" + applicationId;
      // return "/document-uploads/"+applicationId;
    }
    else if (statuses[status] == "29") {

      this.isEligibilityForReviews.push({ applicationId: applicationId, isEligibilityForReview: false });

      // return "/applicant/"+applicationId;
      return "/view-form/" + applicationId;
    }
    else if (statuses[status] == "31") {
      this.isEligibilityForReviews.push({ applicationId: applicationId, isEligibilityForReview: false });

      return "/applicant/" + applicationId;
    }
    else if (statuses[status] == "35") {
      this.isEligibilityForReviews.push({ applicationId: applicationId, isEligibilityForReview: false });

      return "/document-uploads/" + applicationId;
    }
    else if (statuses[status] == "40") {
      this.isEligibilityForReviews.push({ applicationId: applicationId, isEligibilityForReview: false });

      return "/document-uploads/" + applicationId;
    }
    else {
      this.isEligibilityForReviews.push({ applicationId: applicationId, isEligibilityForReview: false });

      return "/applicant/";
    }
  }

  toggleFilters() {
    this.show = !this.show;
  }

  getRoles(): Array<string> {
    return JSON.parse(localStorage.getItem("roles"));
  }

  pageChanged(value) {
    let data = value;
    this.getFilteredLeads(data);
  }

  pageChangedFL(value) {
    let data = value;
    this.getFilterDetails(data)
  }

  pageChangedNL(value) {
    let data = value;
    this.getNewLeads(data);
  }
  pageChangedPA(value) {
    let data = value;
    this.getPendingApplication(data);
  }
  pageChangedPP(value) {
    let data = value;
    this.getPendingPayment(data);
  }
  btnType: string;
  onMultipleBranch(btnName) {
    this.btnType = btnName;
    if (this.isMultipleBranch) {

      this.isMultipleBranchModal = true;
      this.multipleBranchesData = this.branchList;
    }
    else {
      this.cds.changebranchId(this.branchList[0].value);
      if (this.btnType == 'login') {
        this.router.navigate(['/applicant']);
      } else if (this.btnType == 'lead') {
        this.router.navigate(["/connector/lead-create"]);
      }
    }

  }
  myBranchForm: FormGroup;
  branchListForm(): FormGroup {
    this.myBranchForm = new FormGroup({
      branchId: new FormControl(null, Validators.required)
    })

    return this.myBranchForm;
  }

  submitBranch(form) {
    console.log("branch form value ", form, form.value.branchId[0].value);
    this.cds.changebranchId(form.value.branchId[0].value);
    this.isMultipleBranchModal = false
    if (this.btnType == 'login') {
      this.router.navigate(['/applicant']);
    } else if (this.btnType == 'lead') {
      this.router.navigate(["/connector/lead-create"]);
    }
  }

  isLeadDetail: Boolean = false;
  getLeadDetails(detail) {
    let leadId = detail.leadId;
    let uniqueId = detail.uniqueId;
    let mobileNumber = detail.mobileNumber;
    let name = detail.name

    this.isLeadDetail = true;
    let leadValue;
    if(leadId) {
        leadValue = this.newLeadsDetails.filter(v => v.leadId == leadId)[0];
    }else if(uniqueId) {
        leadValue = this.newLeadsDetails.filter(v => v.uniqueId == uniqueId)[0];
    }else {
      leadValue = this.newLeadsDetails.filter(v => v.mobileNumber == mobileNumber && v.name == name)[0];
    }

    this.leadDetail = {
      name: leadValue['name'],
      loanType: leadValue['loanType'],
      leadId: leadValue['leadId'],
      assignedTo: leadValue['assignedTo'],
      loanAmount: leadValue['loanAmount'],
      createdBy: leadValue['createdBy'],
      createdOn: leadValue['createdOn'],
      emailId: leadValue['emailId'],
      mobileNumber: leadValue['mobileNumber'],
      zipcode: leadValue['zipcode'],
      url: leadValue['url'],
      queryParams: leadValue['queryParams'],
    }


  }


  filterDatas(data: any) {

    if (data.submitted === true) {
      // console.log('data555555555555555555555555555555', data.form.value)
      this.filterData = data.form.value;
      this.requestData = {
        filterBranch: '',
        filterStatus: '',
        filterRegion: '',
        filterZone: '',
        filterState: '',
        filterEmployee: '',
        startDate: null,
        endDate: null
      }
      // console.log('data555555555555555555555555555555', this.requestData)

      let tempValue = [];

      this.filterData.filterBranch.map((item) => {
        if (item !== null) {
          tempValue.push(item.value)
        }
      });

      this.requestData.filterBranch = tempValue.toString();

      tempValue = [];

      this.filterData.filterStatus.map((item) => {
        if (item !== null) {
          tempValue.push(item.value)
        }
      });
      this.requestData.filterStatus = tempValue.toString();
      tempValue = [];

      this.filterData.filterRegion.map((item) => {
        if (item !== null) {
          tempValue.push(item.value)
        }
      });
      this.requestData.filterRegion = tempValue.toString();
      tempValue = [];

      this.filterData.filterZone.map((item) => {
        if (item !== null) {
          tempValue.push(item.value)
        }
      });
      this.requestData.filterZone = tempValue.toString();
      tempValue = [];

      this.filterData.filterState.map((item) => {
        if (item !== null) {
          tempValue.push(item.value)
        }
      });
      this.requestData.filterState = tempValue.toString();
      tempValue = [];

      // this.filterData.filterEmployee.map((item) => {
      //   if (item !== null) {
      //     tempValue.push(item.value)
      //   }
      // });
      this.requestData.filterEmployee = this.filterData.filterEmployee.toString();
      this.requestData.startDate = this.filterData.startDate !== null ? this.getFormattedDate(this.filterData.startDate) : null;
      this.requestData.endDate = this.filterData.endDate !== null && this.filterData.endDate !== undefined ? this.getFormattedDate(this.filterData.endDate) : null;
    
      // console.log('tempValuetempValuetempValuetempValue', this.requestData, 'this.filterData', this.filterData)
      this.isShowFilter = !this.isShowFilter;
      this.isFilterApply = true;

      this.getFilterDetails();
      // console.log('data555555555555555555555555555555', data)
    } else {
      this.isFilterApply = false;
      this.filterData = null;
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

  getFilterDetails(currentPage?: string) {
    try {
      this.ngxService.start();
      if (localStorage.getItem("token") && localStorage.getItem("userId")) {
        const startDate = new Date();
        console.log("FilteredLeads Api Call: Start Date & Time ", startDate, startDate.getMilliseconds());
        console.log('tempValuetempValuetempValuetempValue', this.requestData)
        // this.requestData
        this.service.getFilteredLeads(
          this.searchTxt,
          this.fromDay.value,
          this.fromMonth.value,
          this.fromYear.value,
          this.toDay.value,
          this.toMonth.value,
          this.toYear.value,
          "",
          this.allStatus,
          currentPage,
          this.requestData.filterBranch,
          this.requestData.filterZone,
          this.requestData.filterRegion,
          this.requestData.filterState,
          this.requestData.filterEmployee,
          this.requestData.filterStatus,
          this.requestData.startDate,
          this.requestData.endDate
        ).subscribe(res => {
          console.log("dectypt ", res);

          if (res["Error"] && res["Error"] == 0) {
            this.perPageFL = res['ProcessVariables']['perPage'];
            this.currentPageFL = res['ProcessVariables']['currentPage'];
            let totalPages = res['ProcessVariables']['totalPages'];
            this.totalItemsFL = parseInt(totalPages) * this.perPage;
            console.log("???" + "this.perPage" + this.perPageFL + "this.currentPage" + this.currentPageFL + "this.totalItems" + this.totalItemsFL);
            this.userFilterDetails = res["ProcessVariables"].userDetails || [];
            // debugger;
            if(this.userFilterDetails.length === 0){
              this.isDataNotFound = true
            }
            this.userFilterDetails.forEach(el => {
              el.url = this.getUrl(el["status"], el["leadId"], el["applicantId"], this.getRoles(), el);
              if (el["auditTrialTabPage"] != null && el["auditTrialPageNumber"] != null) {
                el["queryParams"] = {
                  tabName: el["auditTrialTabPage"],
                  page: el["auditTrialPageNumber"],
                }
              }
              else {
                el["queryParams"] = null;
              }
            });

            this.cds.setIsEligibilityForReviews(this.isEligibilityForReviews);
            this.cds.setIsTBMLoggedIn(this.isTBMLoggedIn);
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
}
