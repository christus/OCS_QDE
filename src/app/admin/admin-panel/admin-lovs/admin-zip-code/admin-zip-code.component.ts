import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { QdeHttpService } from 'src/app/services/qde-http.service';
import { QdeService } from 'src/app/services/qde.service';
import { Subscription } from 'rxjs';

interface Item {
  key: string;
  value: string;
}

@Component({
  selector: 'admin-zip-code',
  templateUrl: './admin-zip-code.component.html',
  styleUrls: ['./admin-zip-code.component.css']
})
export class AdminZipCodeComponent implements OnInit, OnDestroy {

  tableName: string;
  userId: number;
  isConfirmModal : boolean = false;
  states: Array<Item> = [];
  zones: Array<Item> = [];
  cities: Array<Item> = [];
  selectedState: Item;
  selectedZone: Item;
  selectedCity: Item;
  description: string;
  value: string;
  isErrorModal:boolean = false;
  errorMsg: string;

  tempData: Array<any>;

  // data: Array<any> = [
  //   {
  //     userId: 54,
  //     tableName: 'zipcode',
  //     stateId: '1',
  //     state: 'Maharashtra',
  //     zoneId: '1'
  //     zone: 'Mumbai-Surburb',
  //     cityId: '1',
  //     city: 'Mumbai',
  //     description: 'Chakala',
  //     value: '400093'
  //   }
  // ];

  data: Array<any> = [];
  selectedIndex: number;
  isAdd: boolean = false;
  searchKey:string="";
  currentPage: number;
  perPage: number;
  totalPages: number;
  totalElements: number;
  // perPageCount: number = 5;

  @ViewChild('searchInp') searchInp: ElementRef;

  subs: Array<Subscription> = [];
  delIndex: {};

  constructor(private route: ActivatedRoute, private qdeHttp: QdeHttpService, private qdeService: QdeService, private router: Router) {

    this.route.queryParams.subscribe(val => {
      this.currentPage = val['currentPage'] ? val ['currentPage']: 1;
      this.perPage = val['perPage'] ? val['perPage']: 10;

      this.refresh();
    });

    this.userId = parseInt(localStorage.getItem('userId'));
    this.tableName = 'zipcode';

    if(this.route.snapshot.data['eachLovs']['ProcessVariables']['status'] == true) {
      if(this.route.snapshot.data['eachLovs']['ProcessVariables']['valueDescription']) {

        this.data = this.route.snapshot.data['eachLovs']['ProcessVariables']['valueDescription'].map((v, i) => {
          console.log("....", v);
          return {
            srno: i+1,
            userId: parseInt(localStorage.getItem('userId')),
            tableName: this.tableName,
            cityId: v['cityId'],
            cityName: v['cityName'],
            value: v['value'],
            description: v['description'],
            id: v['id'] ? v['id'] : null,
            stateId: v['stateId'],
            stateName: v['stateName'],
            zone: v['zone'],
            zoneName: v['zoneName']
          }
        });

        this.tempData = this.data;

        this.currentPage = parseInt(this.route.snapshot.data['eachLovs']['ProcessVariables']['currentPage']);
        this.totalPages = parseInt(this.route.snapshot.data['eachLovs']['ProcessVariables']['totalPages']);
        this.perPage = parseInt(this.route.snapshot.data['eachLovs']['ProcessVariables']['perPage']);
        this.totalElements = this.route.snapshot.data['eachLovs']['ProcessVariables']['totalPages'] * this.perPage;
        // this.perPageCount = Math.ceil(this.totalElements/this.perPage);
      } else {
        this.isErrorModal = true;
        this.errorMsg = "No Data Present";
        //alert('No Data Present');
      }
    } 
	/* else {
        this.isErrorModal = true;
        this.errorMsg = "No Data Present";
        //alert('No Data Present');
    } */

    // States
    if(this.route.snapshot.data['generalLovs']['ProcessVariables']['status'] == true) {
      this.states = JSON.parse(this.route.snapshot.data['generalLovs']['ProcessVariables']['lovs'])['LOVS']['state'];

      this.selectedState = this.states[0];

      this.stateChanged(this.selectedState.value);
      console.log(this.selectedState)
    } 
	/* else {
        this.isErrorModal = true;
        this.errorMsg = "No Data Present";
        //alert('No Data Present');
    } */
  }

  ngOnInit() {
  }

  add() {
    this.isAdd = !this.isAdd;
    this.selectedIndex = -1;
    if(this.tableName == 'zipcode') {
      this.selectedState = this.states[0];
      this.stateChanged(this.selectedState.value);
    }

    this.description = '';
    this.value = '';
  }

  submitForm(form: NgForm) {
    let dude;

    console.log("selectedIndex: " ,this.selectedIndex);
    if(this.selectedIndex != -1) {
      dude = form.value;
      dude.userId = localStorage.getItem('userId');
      dude.id = this.data[this.selectedIndex].id;
      dude.tableName = this.tableName;
    } else {
      dude = form.value;
      dude.userId = parseInt(localStorage.getItem('userId'));
      dude.tableName = this.tableName;
      dude = this.qdeService.getFilteredJson(dude);
    }

    this.subs.push(this.qdeHttp.insertUpdateEachLovs(dude).subscribe(res => {
      if(res['ProcessVariables']['status'] == true) {
        this.isErrorModal = true;
        this.errorMsg = "ZipCode Saved Successfully!";
        //alert("ZipCode Saved Successfully!");
        this.isAdd = false;
      } 
	  /* else {
        this.isErrorModal = true;
        this.errorMsg = res['ProcessVariables']['errorMessage'];
        //alert(res['ProcessVariables']['errorMessage']);
      } */
    }, err => {

    }));
  }

  counter(n: number) {
    return new Array(n);
  }

  loadMore() {
    this.qdeHttp.adminLoadMoreLovs(this.tableName, (this.currentPage+1), this.perPage,this.searchKey).subscribe(res => {
      if(res['ProcessVariables']['status'] == true) {
        if(res['ProcessVariables']['valueDescription']) {
          this.data = this.data.concat(res['ProcessVariables']['valueDescription'].map(v => {
            return {
              userId: parseInt(localStorage.getItem('userId')),
              tableName: this.tableName,
              cityId: v['cityId'],
              cityName: v['cityName'],
              value: v['value'],
              description: v['description'],
              id: v['id'] ? v['id'] : null,
              stateId: v['stateId'],
              stateName: v['stateName'],
              zone: v['zone'],
              zoneName: v['zoneName']
            }
          }));
  
          this.tempData = this.data;
  
          this.currentPage = parseInt(res['ProcessVariables']['currentPage']);
          this.totalPages = parseInt(res['ProcessVariables']['totalPages']);
          this.perPage = parseInt(res['ProcessVariables']['perPage']);
          this.totalElements = res['ProcessVariables']['totalPages'] * this.perPage;
        } else {
          this.isErrorModal = true;
          this.errorMsg = "No Data Present Further";
          //alert('No Data Present Further');
        }
      } 
	  /* else {
          this.isErrorModal = true;
          this.errorMsg = "No Data Present Further";
          //alert('No Data Present Further');
      } */
    });
  }

  stateChanged(event) {
    //this.selectedState = this.states.find(v => v.value == event);
    var result: Item = {'key':'','value':''};
      for(var x in this.states){
        if(this.states[x].value==event){
          result.value = this.states[x].value;
          result.key=this.states[x].key;
        }
      }
      this.selectedState = result;
    this.qdeHttp.adminGetZoneFromState(this.selectedState.value).subscribe(res => {
      if(res['ProcessVariables']['status'] == true) {
        this.zones = res['ProcessVariables']['zoneList'];

        if(this.zones == null) {
          this.zones = [{key:'No Zones Available', value: '-1'}];
          this.selectedZone = this.zones[0];
        } else {
          this.selectedZone = this.zones[0];
        }
        this.zoneChanged(this.selectedZone.value);
      } 
	  /* else {
          this.isErrorModal = true;
          this.errorMsg = "Something went wrong";
        //alert('Something went wrong');
      } */
    });
  }

  zoneChanged(event) {
  
    this.selectedZone = this.zones.find(v => v.value == event);

    // if(this.selectedZone.value == "-1") {
    //   this.cities = [{key:'No Cities Available', value: '-1'}];
    //   this.selectedCity = this.cities[0];
    // } else {
      this.qdeHttp.adminGetCityFromZone(this.selectedZone.value,this.selectedState.value).subscribe(res => {
        if(res['ProcessVariables']['status'] == true) {
          this.cities = res['ProcessVariables']['cityList'];
          console.log("cities: ", this.cities);
          if(this.cities == null) {
            this.cities = [{key:'No Cities Available', value: '-1'}];
            this.selectedCity = this.cities[0];
          } else {
            this.selectedCity = this.cities[0];
          }
          console.log("selectedCity: ", this.selectedCity);
          this.cityChanged(this.selectedCity.value);
        } 
		/* else {
          this.isErrorModal = true;
          this.errorMsg = "Something went wrong";
        //alert('Something went wrong');
        } */
      });
   // }
  
  }

  cityChanged(event) {
    if(this.selectedZone.value != "-1") {
      var result: Item = {'key':'','value':''};
      for(var x in this.cities){
        if(this.cities[x].value==event){
          result.value = this.cities[x].value;
          result.key=this.cities[x].key;
        }
      }
      //this.selectedCity = this.cities.find(v => v.value == event);
      this.selectedCity = result;
      console.log(result);
    }
  }

  edit(index) {
    this.isAdd = true;
    this.selectedIndex = index;
    if(this.tableName == 'zipcode') {
      this.stateChanged(this.data[index].stateId);
    }

    this.description = this.data[index].description;
    this.value = this.data[index].value;
  }

  delete(index) {
    this.isAdd = false;
    this.selectedIndex = -1;
    this.delIndex = this.qdeService.getFilteredJson(this.data[index]);
    this.isConfirmModal = true; 
  }
  confirmDelete(){
    this.isConfirmModal = false;
      this.qdeHttp.softDeleteLov(this.delIndex).subscribe(res => {
        // console.log(res['ProcessVariables']);
        if(res['ProcessVariables']['status'] == true) {
          this.isErrorModal = true;
          this.errorMsg = "Deleted Successfully!";
          //alert('Deleted Successfully!');
          this.refresh();
        } 
		/* else {
          this.isErrorModal = true;
          this.errorMsg = "Something went wrong";
          //alert('Something went wrong');
        } */
      });
  }

  refresh() {
    let dude = {
      userId : localStorage.getItem('userId'),
      tableName: 'zipcode',
      perPage: this.perPage
    };
    this.searchKey="";
    console.log(this.searchInp);
    /*if(this.searchKey != '') {
      dude['searchKey'] = this.searchInp.nativeElement.value;
    }*/

    this.qdeHttp.adminZipCodeSearch(dude).subscribe(res => {
      if(res['ProcessVariables']['status'] == true) {
        if(res['ProcessVariables']['valueDescription']) {
  
          this.data = res['ProcessVariables']['valueDescription'].map(v => {
            return {
              userId: parseInt(localStorage.getItem('userId')),
              tableName: this.tableName,
              cityId: v['cityId'],
              cityName: v['cityName'],
              value: v['value'],
              description: v['description'],
              id: v['id'] ? v['id'] : null,
              stateId: v['stateId'],
              stateName: v['stateName'],
              zone: v['zone'],
              zoneName: v['zoneName']
            }
          });

          this.currentPage = parseInt(res['ProcessVariables']['currentPage']);
          this.totalPages = parseInt(res['ProcessVariables']['totalPages']);
          this.perPage = parseInt(res['ProcessVariables']['perPage']);
          this.totalElements = res['ProcessVariables']['totalPages'] * this.perPage;
          // this.perPageCount = Math.ceil(this.totalElements/this.perPage);
        } else {
          this.isErrorModal = true;
          this.errorMsg = "No Data Present";
          //alert('No Data Present');
        }
      } 
	  /* else {
          this.isErrorModal = true;
          this.errorMsg = "No Data Present";
          //alert('No Data Present');
      } */
    });

    this.data = this.tempData;
  }

  search(event) {
    if(event.target.value != '') {
      let dude = {
        tableName: 'zipcode',
        stateId: '',
        cityId: '',
        zone: '',
        searchKey: event.target.value,
        userId: parseInt(localStorage.getItem('userId')),
        perPage: 10
      };

      this.qdeHttp.adminZipCodeSearch(dude).subscribe(res => {
        if(res['ProcessVariables']['status'] == true) {
          if(res['ProcessVariables']['valueDescription']) {

            this.data = res['ProcessVariables']['valueDescription'].map((v, i) => {
              return {
                srno: i+1,
                userId: parseInt(localStorage.getItem('userId')),
                tableName: this.tableName,
                cityId: v['cityId'],
                cityName: v['cityName'],
                value: v['value'],
                description: v['description'],
                id: v['id'] ? v['id'] : null,
                stateId: v['stateId'],
                stateName: v['stateName'],
                zone: v['zone'],
                zoneName: v['zoneName']
              }
            });

            this.currentPage = parseInt(res['ProcessVariables']['currentPage']);
            this.totalPages = parseInt(res['ProcessVariables']['totalPages']);
            this.perPage = parseInt(res['ProcessVariables']['perPage']);
            this.totalElements = res['ProcessVariables']['totalPages'] * this.perPage;
          } else {
            this.isErrorModal = true;
            this.errorMsg = "No Data Present Further";
            //alert('No Data Present Further');
          }
        } 
		/* else {
            this.isErrorModal = true;
            this.errorMsg = "No Data Present Further";
            //alert('No Data Present Further');
        } */
      });
    } else {
      this.data = this.tempData;
    }
  }

  ngOnDestroy() {
    this.subs.forEach(e => {if(e) e.unsubscribe()});
  }
}
