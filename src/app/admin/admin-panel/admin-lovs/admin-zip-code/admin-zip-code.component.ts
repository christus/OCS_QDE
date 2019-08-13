import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { QdeHttpService } from 'src/app/services/qde-http.service';
import { QdeService } from 'src/app/services/qde.service';

interface Item {
  key: string;
  value: string;
}

@Component({
  selector: 'admin-zip-code',
  templateUrl: './admin-zip-code.component.html',
  styleUrls: ['./admin-zip-code.component.css']
})
export class AdminZipCodeComponent implements OnInit {

  tableName: string;
  userId: number;

  states: Array<Item> = [];
  zones: Array<Item> = [];
  cities: Array<Item> = [];
  selectedState: Item;
  selectedZone: Item;
  selectedCity: Item;
  description: string;
  value: string;

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

  currentPage: number;
  perPage: number;
  totalPages: number;
  totalElements: number;
  // perPageCount: number = 5;

  constructor(private route: ActivatedRoute, private qdeHttp: QdeHttpService, private qdeService: QdeService) {
    this.userId = parseInt(localStorage.getItem('userId'));
    this.tableName = 'zipcode';

    if(this.route.snapshot.data['eachLovs']['ProcessVariables']['status'] == true) {
      if(this.route.snapshot.data['eachLovs']['ProcessVariables']['valueDescription']) {

        this.data = this.route.snapshot.data['eachLovs']['ProcessVariables']['valueDescription'].map(v => {
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

        this.currentPage = parseInt(this.route.snapshot.data['eachLovs']['ProcessVariables']['currentPage']);
        this.totalPages = parseInt(this.route.snapshot.data['eachLovs']['ProcessVariables']['totalPages']);
        this.perPage = parseInt(this.route.snapshot.data['eachLovs']['ProcessVariables']['perPage']);
        this.totalElements = this.route.snapshot.data['eachLovs']['ProcessVariables']['totalPages'] * this.perPage;
        // this.perPageCount = Math.ceil(this.totalElements/this.perPage);
      } else {
        alert('No Data Present');
      }
    } else {
      alert('No Data Present');
    }

    // States
    if(this.route.snapshot.data['generalLovs']['ProcessVariables']['status'] == true) {
      this.states = JSON.parse(this.route.snapshot.data['generalLovs']['ProcessVariables']['lovs'])['LOVS']['state'];

      this.selectedState = this.states[0];

      this.stateChanged(this.selectedState.value);
      console.log(this.selectedState)
    } else {
      alert('No Data Present');
    }
  }

  ngOnInit() {
  }

  add() {
    this.isAdd = !this.isAdd;
    this.selectedIndex = -1;
    if(this.tableName == 'zipcode') {
      this.selectedState = this.states[0];
    }

    this.description = '';
    this.value = '';
  }

  submitForm(form: NgForm) {
    let dude;
    if(form.value.id == -1 || form.value.id == null || form.value.id == '') {
      dude = form.value;
      dude.userId = localStorage.getItem('userId');
      dude.tableName = this.tableName;
    } else {
      dude = this.qdeService.getFilteredJson(this.data[this.selectedIndex]);
    }

    this.qdeHttp.insertUpdateEachLovs(dude).subscribe(res => {
      console.log(res);
    }, err => {

    });
  }

  counter(n: number) {
    return new Array(n);
  }

  loadMore() {
    this.qdeHttp.adminLoadMoreLovs(this.tableName, (this.currentPage+1), this.perPage).subscribe(res => {
      if(res['ProcessVariables']['status'] == true) {
        if(res['ProcessVariables']['valueDescription']) {
          this.data = this.data.concat(res['ProcessVariables']['valueDescription']);
          this.currentPage = res['ProcessVariables']['currentPage'];
          this.totalPages = res['ProcessVariables']['totalPages'];
          this.perPage = res['ProcessVariables']['perPage'];
          this.totalElements = res['ProcessVariables']['totalPages'] * this.perPage;
          // this.perPageCount = Math.ceil(this.totalElements/this.perPage);
        } else {
          alert('No Data Present Further');
        }
      } else {
        alert('No Data Present Further');
      }
    });
  }

  stateChanged(event) {
    this.selectedState = this.states.find(v => v.value == event);

    this.qdeHttp.adminGetZoneFromState(this.selectedState.value).subscribe(res => {
      if(res['ProcessVariables']['status'] == true) {
        this.zones = res['ProcessVariables']['zoneList'];
        if(this.zones == null) {
          this.zones = [{key:'No Data Available', value: '-1'}];
          this.selectedZone = this.zones[0];
        } else {
          this.selectedZone = this.zones[0];
        }
        this.zoneChanged(this.selectedZone.value);
      } else {
        alert('Something went wrong');
      }
    });
  }

  zoneChanged(event) {
  
    this.selectedZone = this.zones.find(v => v.value == event);

    if(this.selectedZone.value == "-1") {
      this.cities = [{key:'No Data Available', value: '-1'}];
      this.selectedCity = this.cities[0];
    } else {
      this.qdeHttp.adminGetCityFromZone(this.selectedZone.value).subscribe(res => {
        if(res['ProcessVariables']['status'] == true) {
          this.cities = res['ProcessVariables']['cityList'];
          console.log("cities: ", this.cities);
          if(this.cities == null) {
            this.cities = [{key:'No Data Available', value: '-1'}];
            this.selectedCity = this.cities[0];
          } else {
            this.selectedCity = this.cities[0];
          }
          console.log("selectedCity: ", this.selectedCity);
          this.cityChanged(this.selectedCity.value);
        } else {
          alert('Something went wrong');
        }
      });
    }
  
  }

  cityChanged(event) {
    if(this.selectedZone.value != "-1") {
      this.selectedCity = this.cities.find(v => v.value == event);
    }
  }

  edit(index) {
    this.isAdd = true;
    this.selectedIndex = index;
    if(this.tableName == 'zipcode') {
      this.selectedState = this.states.find(v => v.value == this.data[index].stateId);
    }

    this.description = this.data[index].description;
    this.value = this.data[index].value;
  }

  delete(index) {
    this.isAdd = false;
    this.selectedIndex = -1;
    let dude = this.qdeService.getFilteredJson(this.data[index]);
    console.log(dude);
    if(confirm("Are you sure?")) {
      this.qdeHttp.softDeleteLov(dude).subscribe(res => {
        // console.log(res['ProcessVariables']);
        this.refresh();
      });
    } 
  }

  refresh() {

  }
}
