import { Component, OnInit } from '@angular/core';
import { QdeHttpService } from 'src/app/services/qde-http.service';
import { } from 'ng-multiselect-dropdown';
import { FormGroup, FormControl } from '@angular/forms'
import { Router } from '@angular/router';

@Component({
  selector: 'app-archive-ocs-number',
  templateUrl: './archive-ocs-number.component.html',
  styleUrls: ['./archive-ocs-number.component.css']
})
export class ArchiveOcsNumberComponent implements OnInit {


  ocsdata: Array<UserDetails>;
  source: Array<UserDetails>;
  effectFromDate: Date;
  effectToDate: Date;
  archiveReason: any;
  archiveBy: any;
  dropdownSettings = {};
  myForm: FormGroup;
  fileName: string;

  currentPage: string;
  perPage: string;
  totalPages: string;
  totalItems: number;

  ocsList: any;
  fromDate: any;
  toDate: any;
  applicationId: any;

  applicationIdList: any;

  isSuccessModal: boolean;
  successMsg: string;
  isBtnDisable: boolean = true;
  reasonToChangeText: string;
  isErrorMsg: boolean;
  noRecordsFound: boolean;

  isErrorModal: boolean;
  errorMessage: string;
  textErrMsg: string;

  itemSelect: boolean;
  maxDate: Date = new Date();

  constructor(private qdeHttp: QdeHttpService,private router: Router) { }

  ngOnInit() {
    this.ocsList = [];
    this.applicationIdList = [];
    this.fileName = '';
    this.successMsg = '';
    this.reasonToChangeText = '';
    this.errorMessage = '';
    this.textErrMsg = ''

    this.myForm = new FormGroup({
      ocsNumber: new FormControl('')
    })
    // this.dropdownSettings = {
    //   singleSelection: true,
    //   idField: 'value',
    //   textField: 'key',
    //   itemsShowLimit: 4,
    //   enableCheckAll: false,
    //   allowSearchFilter: true
    // };

    this.dropdownSettings = {
      singleSelection: true,
      idField: 'value',
      textField: 'key',    
      itemsShowLimit: 3,
      allowSearchFilter: true,
      closeDropDownOnSelection: true
    };

    this.ocsdata = []

    this.qdeHttp.getOcsNumberAutoFill('oc').subscribe((response) => {

      console.log(response)
      this.ocsdata = response['ProcessVariables']['ocsNumbers']
      this.source = response['ProcessVariables']['ocsNumbers']
    })
  }

  filterChange(value: any): void {
    this.ocsdata = this.source.filter((s) => s.key.toLowerCase().indexOf(value.toLowerCase()) !== -1);
  }

  onItemSelect(ocsNo: any) {
    this.itemSelect = true;
    this.effectFromDate = null;
    this.effectToDate = null;
    this.isErrorMsg = false;
  }

  onItemDeSelect(ocsNo: any) {
    this.itemSelect = false;
    this.isErrorMsg = false
  }


  onFilterChange(event) {

    console.log('Data', event);
    const ocsNumber = event;

    if(ocsNumber.length > 3) {
      if(!ocsNumber.startsWith('ocs')) {
        return;
      }
      setTimeout(()=> {
        this.qdeHttp.getOcsNumberAutoFill(ocsNumber).subscribe((response) => {

          console.log(response)
          if(response['ProcessVariables']['ocsNumbers']) {
             this.ocsdata = response['ProcessVariables']['ocsNumbers']
             this.source = response['ProcessVariables']['ocsNumbers']
          }
          
        })

      },2500)
      
    }


  }

  getFormattedDate(date) {
    console.log("in date conversion " + date);

    let dateFormat: Date = date;
    let year = dateFormat.getFullYear();
    let month = dateFormat.getMonth() + 1;
    let month1 = month < 10 ? '0' + month.toString() : '' + month.toString(); // ('' + month) for string result
    let day = date.getDate();
    day = day < 10 ? '0' + day : '' + day; // ('' + month) for string result
    let formattedDate = year + '-' + month1 + '-' + day;
    // console.log("final Value "+ formattedDate);
    return formattedDate;
  }

  onSubmit() {

    const ocsNumber = (this.myForm.value.ocsNumber) ? (this.myForm.value.ocsNumber) : []
    const applicationIds = (this.applicationIdList)?this.applicationIdList.join(','):'';
    const archivedByData = localStorage.getItem('userId');
    const archivedBy = (archivedByData)?(parseInt(archivedByData)):''
    const ocsReqObject = {
      "applicationId": applicationIds,
      "archiveBy": archivedBy,
      "archiveReason": this.reasonToChangeText,
      "fromDate": this.fromDate,
      "toDate": this.toDate
    }

    console.log(ocsReqObject)

      this.qdeHttp.archiveDataFromMainTable(ocsReqObject).subscribe((response)=> {

        console.log('Response', response)

        if(response['ProcessVariables']['status']) {
            this.isSuccessModal = true;
            this.successMsg = 'Applications Archived Successfully'
        }else if (response["ProcessVariables"]["errorMessage"]) {
            console.log(
              "Response: " + response["ProcessVariables"]["errorMessage"]
            );
            this.errorMessage = response["ProcessVariables"]["errorMessage"];
            this.isErrorModal = true;
        }
      })
  }

  setOcsNumber(files) {
    const filesData = files.item(0);
    if (filesData['name']) {
      this.fileName = filesData['name']

    }
  }

  onSearch() {
    this.textErrMsg = 'Please select the fields'

    if(!this.effectFromDate && !this.effectToDate  &&  this.myForm.value.ocsNumber.length == 0 ) {
      this.isErrorMsg = true;
      return;
    } else {
      this.isErrorMsg = false;
    }
    if(!this.effectFromDate || !this.effectToDate) {
      if(this.myForm.value.ocsNumber.length == 0) {
        this.isErrorMsg = true;
        return;
      } else {
        this.isErrorMsg = false;
      }
    }else {
      this.isErrorMsg = false;
    }
    
    
     this.fromDate = (this.effectFromDate) ? this.getFormattedDate(this.effectFromDate).toString() : '';
     this.toDate = (this.effectToDate) ? this.getFormattedDate(this.effectToDate).toString() : '';

    
     if(this.fromDate && this.toDate) {
      const fromTimestamp = new Date(this.fromDate).getTime() / 1000
      const toTimestamp = new Date(this.toDate).getTime() / 1000
 
      console.log(fromTimestamp,toTimestamp)
 
      if(toTimestamp < fromTimestamp) {
        this.isErrorMsg = true;
        this.textErrMsg = 'Invalid date, fromdate is greater than todate'
        return;
      }else {
        this.isErrorMsg = false;
      }

     }
     
     this.applicationId = (this.myForm.value.ocsNumber.length != 0) ? this.myForm.value.ocsNumber[0].key : "";
    const reqObject = {
      "ocsNumber": this.applicationId,
      "type": "archive",
      "fromDate": this.fromDate,
      "toDate": this.toDate
    }
    this.applicationIdList = []
    this.getApplicationData(reqObject)



  }


  getApplicationData(reqObject) {
    this.qdeHttp.getApplicationListForArchive(reqObject).subscribe((response) => {
      console.log('Response', response)
      if (response['ProcessVariables']['status']) {
        this.noRecordsFound = false;
        this.ocsList = response['ProcessVariables']['getApplication'] || [];
        if(this.ocsList.length == 0) {
          this.noRecordsFound = true;
        }
        this.totalPages = response["ProcessVariables"].totalPages;
        this.perPage = response['ProcessVariables']['perPage'];
        this.currentPage = response['ProcessVariables']['currentPage'];
        this.totalItems = parseInt(this.totalPages) * parseInt(this.perPage);

        if(reqObject.currentPage) {
              this.ocsList.map((val)=> {
                if(this.applicationIdList.includes(val.applicationId)) {
                     val.checked = true;
                     return val;
                }
              })
        }
      } else {
        this.noRecordsFound = true;
        if(response["ProcessVariables"]["errorMessage"]) {
          console.log(
            "Response: " + response["ProcessVariables"]["errorMessage"]
          );
          this.errorMessage = response["ProcessVariables"]["errorMessage"];
          this.isErrorModal = true;
        }
      }
    })
  }

  pageChanged(pageNo) {

    const reqObject = {
      applicationId: this.applicationId,
      type: 'archive',
      fromDate: this.fromDate,
      toDate: this.toDate,
      currentPage: pageNo
    }

    this.getApplicationData(reqObject)
  }

  changeCheckbox(event,i,detail) {

    console.log(event,i,detail)
    const applicationId = detail.applicationId;

    if(event.target.checked) {
      this.applicationIdList.push(applicationId)
    } else {

      const array = this.applicationIdList;

      console.log(array);
      
      const index = array.indexOf(applicationId);
      if (index > -1) {
        array.splice(index, 1);
      }

      console.log(array)
      
    }
  }

  success() {
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate(['/admin/archive']);
      // this.removeApplicantPage();
    }
    
    );
  }



}

export interface UserDetails {
  "key": string;
  "value": number;
}



