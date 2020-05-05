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

  constructor(private qdeHttp: QdeHttpService,private router: Router) { }

  ngOnInit() {
    this.ocsList = [];
    this.applicationIdList = [];
    this.fileName = '';
    this.successMsg = '';
    this.reasonToChangeText = ''

    this.myForm = new FormGroup({
      ocsNumber: new FormControl('')
    })
    this.dropdownSettings = {
      singleSelection: true,
      idField: 'value',
      textField: 'key',
      itemsShowLimit: 4,
      enableCheckAll: false,
      allowSearchFilter: true
    };

    this.ocsdata = []

    this.qdeHttp.getOcsNumberAutoFill().subscribe((response) => {

      console.log(response)
      this.ocsdata = response['ProcessVariables']['ocsNumbers']
      this.source = response['ProcessVariables']['ocsNumbers']
    })
  }

  filterChange(value: any): void {
    this.ocsdata = this.source.filter((s) => s.key.toLowerCase().indexOf(value.toLowerCase()) !== -1);
  }

  onItemSelect(ocsNo: any) {

    console.log(ocsNo)
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
      "arcBy": archivedBy,
      "arcReason": this.reasonToChangeText,
      "fromDate": this.fromDate,
      "toDate": this.toDate
    }

    console.log(ocsReqObject)

      this.qdeHttp.archiveDataFromMainTable(ocsReqObject).subscribe((response)=> {

        console.log('Response', response)

        if(response['ProcessVariables']['status']) {
            this.isSuccessModal = true;
            this.successMsg = 'Applications Archived Successfully'
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
        this.ocsList = response['ProcessVariables']['getApplication'] || [];
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



