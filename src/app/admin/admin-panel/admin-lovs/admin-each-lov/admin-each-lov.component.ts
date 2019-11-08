import { Component, OnInit, ViewChildren, ElementRef, QueryList, EventEmitter, OnChanges, SimpleChanges, AfterViewInit, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QdeHttpService } from 'src/app/services/qde-http.service';

@Component({
  selector: 'admin-each-lov',
  templateUrl: './admin-each-lov.component.html',
  styleUrls: ['./admin-each-lov.component.css']
})
export class AdminEachLovComponent implements OnInit, AfterViewInit {

  lovs: Array<any> = [];
  tempLovs: Array<any> = [];
  // previousLength: number;
  tableName: string;
  isApplicantTitle: boolean;
  isDocumentCategory: boolean;
  totalPages:string;
  totalItems:number;
  currentPage: string;
  perPage:string;
  searchKey:string="";
  key:Array<number>=[];
  lastKey: number;
  isErrorModal: boolean = false;
  errorMsg: string;

  @ViewChildren('lovsElements') lovsElements: QueryList<ElementRef>;

  constructor(private route: ActivatedRoute,
              private qdeHttp: QdeHttpService,
              private ren: Renderer2) {

    this.route.params.subscribe(v => {
      this.tableName = v['eachLovName']
      this.isApplicantTitle = this.tableName == 'applicant_title' ? true: false;
      this.isDocumentCategory = this.tableName == 'document_category' ? true: false;
    });

    let response = this.route.snapshot.data['eachLovs']['ProcessVariables'];

    if(this.route.snapshot.data['eachLovs']['ProcessVariables']['status'] == true) {
      if(this.route.snapshot.data['eachLovs']['ProcessVariables']['valueDescription'] && this.route.snapshot.data['eachLovs']['ProcessVariables']['valueDescription'].length > 0 ) {
        console.log(this.route.snapshot.data['eachLovs']['ProcessVariables']);
        console.log(this.route.snapshot.data['eachLovs']['ProcessVariables']['perPage']);
        console.log(this.route.snapshot.data['eachLovs']['ProcessVariables']['totalPages']);
        this.perPage = this.route.snapshot.data['eachLovs']['ProcessVariables']['perPage'];
        this.currentPage = this.route.snapshot.data['eachLovs']['ProcessVariables']['currentPage'];
        this.totalPages = this.route.snapshot.data['eachLovs']['ProcessVariables']['totalPages'];
        this.totalItems = parseInt(this.perPage)*parseInt(this.totalPages);
        this.tempLovs = this.lovs = this.route.snapshot.data['eachLovs']['ProcessVariables']['valueDescription'].map((v, i) => {

          return {
            userId: localStorage.getItem('userId'),
            description: v['description'],
            value: v['value'],
            isEdit: true,
            id: v['id'],
            male: v['male'],
            female: v['female'],
            tableName: this.tableName,
            isRequired: v['isRequired']
          }
        });
        for(var i=0; i<this.lovs.length;i++){
          this.key[i]=((parseInt(this.perPage)*(parseInt(this.currentPage)-1))+i+ 1);
        }
      } else {
        this.isErrorModal = true;
        this.errorMsg='No Data Found';
      }
    }
  }

  ngOnInit() {
  }

  save(index) {

    console.log(this.lovs[index].description);
    if(this.lovs[index].description != '' && this.lovs[index].value != '') {

      if(this.lovs[index].tableName == 'applicant_title' && (this.lovs[index].male == false && this.lovs[index].female == false)) {
        this.isErrorModal = true;
        this.errorMsg='Please enter all values';
        //alert("Please enter all values");
        this.refresh();
      }

      this.qdeHttp.insertUpdateEachLovs(this.lovs[index]).subscribe(res => {
        if(res['ProcessVariables']['status'] == true) {
          console.log(this.lovs[index]);
          this.lovs[index].isEdit = true;
          this.lovs[index].id = res['ProcessVariables']['id'];
        } else if(res['ProcessVariables']['errorMessage'] != "") {
          this.refresh();
          this.isErrorModal = true;
          this.errorMsg=res['ProcessVariables']['errorMessage'];
          //alert(res['ProcessVariables']['errorMessage']);
        }
      });
    } else {
      console.log(this.lovs[index]);
      this.isErrorModal = true;
      this.errorMsg="Please enter all values";
      //alert("Please enter all values");
      this.refresh();
    }
    this.tempLovs = this.lovs;
  }

  addNew() {
    this.lovs.push({tableName: this.tableName, userId: localStorage.getItem('userId'), description: '', value: '', isEdit: false, male: false, female: false});
    this.qdeHttp.adminLoadMoreLovs(this.tableName, parseInt(this.totalPages), parseInt(this.perPage),this.searchKey).subscribe(res => {
      if (res['ProcessVariables']['status'] == true) {
        if (res['ProcessVariables']['valueDescription'] && res['ProcessVariables']['valueDescription'].length > 0) {
          this.tempLovs = res['ProcessVariables']['valueDescription'].map((v, i) => {
            return {
              userId: localStorage.getItem('userId'),
              description: v['description'],
              value: v['value'],
              isEdit: true,
              id: v['id'],
              male: v['male'],
              female: v['female'],
              tableName: this.tableName,
              isRequired: v['isRequired']
            }
          });
          this.lastKey = (parseInt(this.perPage)*(parseInt(this.totalPages)-1))+this.tempLovs.length+1;
          console.log(this.lastKey);
          this.key.push(this.lastKey);
        }
      }
    })
  }

  ngAfterViewInit() {
    // this.previousLength = this.tempLovs.length;

    // this.lovsElements.changes.subscribe(e => {
    //   if(this.previousLength < e.length) {
    //     e.last.nativeElement.focus();
    //   }
    //   this.previousLength = e.length;
    // });
  }

  delete(index) {
    let dude = this.lovs[index];
    if(confirm("Are you sure?")) {
      this.qdeHttp.softDeleteLov(dude).subscribe(res => {
        // console.log(res['ProcessVariables']);
        this.refresh();
      });
      this.tempLovs = this.lovs;
    } 
  }


  search(event) {
    let dude = {
      tableName: this.tableName,
      searchKey: event.target.value,
      userId: parseInt(localStorage.getItem('userId')),
    };

    this.qdeHttp.adminZipCodeSearch(dude).subscribe(res => {
      if(res['ProcessVariables']['status'] == true) {
        if(res['ProcessVariables']['valueDescription']) {
          console.log(res['ProcessVariables']['perPage']);
          console.log(res['ProcessVariables']['currentPage']);
          console.log(res['ProcessVariables']['totalPages']);
          this.perPage = res['ProcessVariables']['perPage'];
          this.currentPage = res['ProcessVariables']['currentPage'];
          this.totalPages = res['ProcessVariables']['totalPages'];
          this.totalItems = parseInt(this.perPage) * parseInt(this.totalPages);
          this.lovs = res['ProcessVariables']['valueDescription'].map((v, i) => {
            return {
              userId: parseInt(localStorage.getItem('userId')),
              tableName: this.tableName,
              cityId: v['cityId'],
              cityName: v['cityName'],
              value: v['value'],
              isEdit: true,
              description: v['description'],
              id: v['id'] ? v['id'] : null,
              stateId: v['stateId'],
              stateName: v['stateName'],
              zone: v['zone'],
              zoneName: v['zoneName']
            }
          });
          for(var i=0; i<this.lovs.length;i++){
            this.key[i]=((parseInt(this.perPage)*(parseInt(this.currentPage)-1))+i+ 1);
          }
        } else {
        this.isErrorModal = true;
        this.errorMsg='No Data Present Further';
          //alert('No Data Present Further');
        }
      } else {
        this.isErrorModal = true;
        this.errorMsg='No Data Present Further';
          //alert('No Data Present Further');
      }
    });
  
  }

  edit(index) {
    this.lovs[index].isEdit = false;
    console.log(this.lovsElements['_results'][index]);
    this.lovsElements['_results'][index]['nativeElement'].focus();
  }

  changeGender(n: number, index) {
    if(n == 1) {
      this.lovs[index].male = true;
      this.lovs[index].female = false;
    } else if(n == 2) {
      this.lovs[index].male = false;
      this.lovs[index].female = true;
    } else {
      this.lovs[index].male = true;
      this.lovs[index].female = true;
    }
  }

  changeIsRequired(n: string, index) {
    this.lovs[index].isRequired = (n=='1') ? '1': '0';
  }

  refresh() {
    this.searchKey="";
    this.qdeHttp.adminLoadMoreLovs(this.tableName).subscribe(res => {
      if(res['ProcessVariables']['status'] == true) {
        if(res['ProcessVariables']['valueDescription'] && res['ProcessVariables']['valueDescription'].length > 0) {
          console.log(res['ProcessVariables']['perPage']);
          console.log(res['ProcessVariables']['currentPage']);
          console.log(res['ProcessVariables']['totalPages']);
          this.perPage = res['ProcessVariables']['perPage'];
          this.currentPage = res['ProcessVariables']['currentPage'];
          this.totalPages = res['ProcessVariables']['totalPages'];
          this.totalItems = parseInt(this.perPage) * parseInt(this.totalPages);
          this.tempLovs = this.lovs = res['ProcessVariables']['valueDescription'].map((v, i) => {

            return {
              userId: localStorage.getItem('userId'),
              description: v['description'],
              value: v['value'],
              isEdit: true,
              id: v['id'],
              male: v['male'],
              female: v['female'],
              tableName: this.tableName,
              isRequired: v['isRequired']
            }
          });
          for(var i=0; i<this.lovs.length;i++){
            this.key[i]=((parseInt(this.perPage)*(parseInt(this.currentPage)-1))+i+ 1);
          }
        } else {
          this.isErrorModal = true;
          this.errorMsg='No Data Found';
          //alert("No Data Found");
        }
      }
    }, err => {

    });
  }
  getData(data) {
    this.qdeHttp.adminLoadMoreLovs(this.tableName, data, parseInt(this.perPage),this.searchKey).subscribe(res => {
      if (res['ProcessVariables']['status'] == true) {
        if (res['ProcessVariables']['valueDescription'] && res['ProcessVariables']['valueDescription'].length > 0) {
          console.log(res['ProcessVariables']['perPage']);
          console.log(res['ProcessVariables']['currentPage']);
          console.log(res['ProcessVariables']['totalPages']);
          this.perPage = res['ProcessVariables']['perPage'];
          this.currentPage = data;
          this.totalPages = res['ProcessVariables']['totalPages'];
          this.totalItems = parseInt(this.perPage) * parseInt(this.totalPages);
          this.tempLovs = this.lovs = res['ProcessVariables']['valueDescription'].map((v, i) => {
            return {
              userId: localStorage.getItem('userId'),
              description: v['description'],
              value: v['value'],
              isEdit: true,
              id: v['id'],
              male: v['male'],
              female: v['female'],
              tableName: this.tableName,
              isRequired: v['isRequired']
            }
          });
          for(var i=0; i<this.lovs.length;i++){
            this.key[i]=((parseInt(this.perPage)*(data-1))+i+ 1);
          }
        }
      }
    })
  }
  pageChanged(value) {
    let data =value;
    this.getData(data);
}
}
