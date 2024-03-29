import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { QdeHttpService } from 'src/app/services/qde-http.service';
import { QdeService } from 'src/app/services/qde.service';
import { Subscription } from 'rxjs';
import { ViewportScroller } from '@angular/common'

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
  regions: Array<Item> = [];
  states: Array<Item> = [];
  zones: Array<Item> = [];
  cities: Array<Item> = [];
  selectedRegion: Item;
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
  // totalElements: number;
  totalItems:number;
  // perPageCount: number = 5;
  isRegionHidden:boolean;
  isStateHidden: boolean;
  isZoneHidden: boolean;
  isCityHidden: boolean;
  isSaveDisable: boolean;
  isDescriptionHidden: boolean;
  isValueHidden: boolean;
  addEditFlag: boolean;
  zipcodeErrMsg: string;
  allStates: Array<Item>

  @ViewChild('searchInp') searchInp: ElementRef;

  subs: Array<Subscription> = [];
  delIndex: {};
  regexPattern = {
    mobileNumber: "^[1-9][0-9]*$",
    // name: "^[a-zA-Z ]+(([',. -][a-zA-Z ])?[a-zA-Z ]*)*$", 
    name: "^[a-zA-Z0-9 ]+(([',. -][a-zA-Z ])?[a-zA-Z ]*)*$"
  }
  constructor(private route: ActivatedRoute, 
              private qdeHttp: QdeHttpService, 
              private qdeService: QdeService, 
              private router: Router,
              private viewportScroller: ViewportScroller) {

    this.route.queryParams.subscribe(val => {
      this.currentPage = val['currentPage'] ? val ['currentPage']: 1;
      this.perPage = val['perPage'] ? val['perPage']: 10;

      this.refresh();
    });

    this.userId = parseInt(localStorage.getItem('userId'));
    this.tableName = 'zipcode';

    this.selectedRegion = {
      key: 'Select',
      value:'0'
    }
    this.zipcodeErrMsg  = 'Please enter the value';

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
            zoneName: v['zoneName'],
            regionId: v['regionId'],
            regionName: v['regionName']
          }
        });

        this.tempData = this.data;

        this.currentPage = parseInt(this.route.snapshot.data['eachLovs']['ProcessVariables']['currentPage']);
        this.totalPages = parseInt(this.route.snapshot.data['eachLovs']['ProcessVariables']['totalPages']);
        this.perPage = parseInt(this.route.snapshot.data['eachLovs']['ProcessVariables']['perPage']);
        // this.totalElements = this.route.snapshot.data['eachLovs']['ProcessVariables']['totalPages'] * this.perPage;
        this.totalItems = this.route.snapshot.data['eachLovs']['ProcessVariables']['totalPages'] * this.perPage;
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

    //Regions

    // this.regions = [
    //   {key:'Northern',value:'1'},
    //   {key:'Southern',value:'2'},
    //   {key:'Eastern',value:'3'},
    //   {key:'Western',value:'4'}
    // ]
    // States
    if(this.route.snapshot.data['generalLovs']['ProcessVariables']['status'] == true) {
      this.states = JSON.parse(this.route.snapshot.data['generalLovs']['ProcessVariables']['lovs'])['LOVS']['state'];
      this.allStates = JSON.parse(this.route.snapshot.data['generalLovs']['ProcessVariables']['lovs'])['LOVS']['state'];
      // this.regions = JSON.parse(this.route.snapshot.data['generalLovs']['ProcessVariables']['aTableLov'])['regions'];
      this.regions = JSON.parse(this.route.snapshot.data['generalLovs']['ProcessVariables']['lovs'])['LOVS']['regions'];

      this.selectedState = {key:'Select',value:'0'};
      // this.states = [];
      this.zones = [];
      this.selectedZone = {key:'Select',value:'0'}
      this.cities = [];
      this.selectedCity = {key:'Select',value:'0'}
      // this.stateChanged(this.selectedState.value);
      
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
    // if(this.tableName == 'zipcode') {
    //   this.selectedState = this.states[0];
    //   this.stateChanged(this.selectedState.value);
    // }

    this.selectedRegion = {key:'Select',value:'0'};
    this.selectedState = {key:'Select',value:'0'};
    this.selectedZone = {key:'Select',value:'0'};
    this.selectedCity = {key:'Select',value:'0'};

    // this.states = [];
    this.zones = [];
    this.cities = [];

    this.description = '';
    this.value = '';
  }

  submitForm(form: NgForm) {
    if(this.value === '' || this.zipcodeErrMsg == 'Please enter a valid zipcode') {
      this.isValueHidden = true;
    }else if(this.description === '') {
      this.isDescriptionHidden = true;
    }else if(this.selectedState.value === '0') {
      this.isStateHidden = true;
    }else if(this.selectedZone.value === '-1'  || this.selectedZone.value === '0') {
      this.isZoneHidden = true;
    }else if(this.selectedCity.value === '-1'  || this.selectedCity.value === '0') {
      this.isCityHidden = true;
    }else {
      this.isRegionHidden = false;
      this.isZoneHidden = false;
      this.isDescriptionHidden = false;
      this.isValueHidden = false;
      this.isStateHidden = false;
      this.isCityHidden = false;

      
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

    if(this.selectedRegion.value === '0') {
      dude.regionId = ''
    }

    this.subs.push(this.qdeHttp.insertUpdateEachLovs(dude).subscribe(res => {
      if(res['ProcessVariables']['status'] == true) {
        this.isErrorModal = true;
        this.errorMsg = "ZipCode Saved Successfully!";
        //alert("ZipCode Saved Successfully!");
        this.isAdd = false;
        this.refresh();
      } 
	  /* else {
        this.isErrorModal = true;
        this.errorMsg = res['ProcessVariables']['errorMessage'];
        //alert(res['ProcessVariables']['errorMessage']);
      } */
    }, err => {

    }));
    
    
  }
  }

  counter(n: number) {
    return new Array(n);
  }

  loadMore(event) {
    this.qdeHttp.adminLoadMoreLovs(this.tableName, event, this.perPage,this.searchKey).subscribe(res => {
      // (this.currentPage+1)
      if(res['ProcessVariables']['status'] == true) {
        if(res['ProcessVariables']['valueDescription']) {
          // this.data = this.data.concat(res['ProcessVariables']['valueDescription'].map(v => {
            this.data = res['ProcessVariables']['valueDescription'].map(v =>{
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
              zoneName: v['zoneName'],
              regionId: v['regionId'],
              regionName: v['regionName']
            }
          // }));
            });
  
          this.tempData = this.data;
  
          this.currentPage = parseInt(res['ProcessVariables']['currentPage']);
          this.totalPages = parseInt(res['ProcessVariables']['totalPages']);
          this.perPage = parseInt(res['ProcessVariables']['perPage']);
          // this.totalElements = res['ProcessVariables']['totalPages'] * this.perPage;
          this.totalItems = res['ProcessVariables']['totalPages'] * this.perPage;
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

    if(event) {
      this.addEditFlag =false;
    }else {
      this.addEditFlag = true;
    }

    if(this.selectedState.value !== '0') {
      this.isStateHidden = false;
    }
    var result: Item = {'key':'','value':''};
      for(var x in this.states){
        if(this.states[x].value==event){
          result.value = this.states[x].value;
          result.key=this.states[x].key;
        }
      }
      // this.selectedState = result;
    this.qdeHttp.adminGetZoneFromState(this.selectedState.value).subscribe(res => {
      if(res['ProcessVariables']['status'] == true) {
        this.zones = res['ProcessVariables']['zoneList'];

        if(this.zones == null) {
          this.zones = [{key:'No Zones Available', value: '-1'}];
          this.selectedZone = this.zones[0];
        } else {
          if(!this.addEditFlag) {
            this.selectedZone = {key:'Select',value:'0'};
            this.selectedCity = {key:'Select',value:'0'};
            this.cities = [];
          }else {
            if(this.selectedRegion.value === '0') {
              this.states = this.allStates;

            }
          }
        }
        // this.zoneChanged(this.selectedZone.value);
      } 
	  /* else {
          this.isErrorModal = true;
          this.errorMsg = "Something went wrong";
        //alert('Something went wrong');
      } */
    });
  }

  zoneChanged(event) {

    if(event) {
      this.addEditFlag =false;
    }else {
      this.addEditFlag = true;
    }

    if(this.selectedZone.value !== '-1') {
      this.isZoneHidden = false;
    }
  
      this.qdeHttp.adminGetCityFromZone(this.selectedZone.value,this.selectedState.value).subscribe(res => {
        if(res['ProcessVariables']['status'] == true) {
          this.cities = res['ProcessVariables']['cityList'];
          console.log("cities: ", this.cities);
          if(this.cities == null) {
            this.cities = [{key:'No Cities Available', value: '-1'}];
            this.selectedCity = this.cities[0];
          } else {
            if(!this.addEditFlag) {
              this.selectedCity = {key:'Select',value:'0'}

            }
          }
          console.log("selectedCity: ", this.selectedCity);
         
        } 
	
      });
   // }
  
  }

  cityChanged(event) {

    if(this.selectedCity.value != '-1') {
      this.isCityHidden =false;
    }
    if(this.selectedCity.value != '0') {
      this.isCityHidden =false;
    }
    // if(this.selectedZone.value != "-1") {
    //   var result: Item = {'key':'','value':''};
    //   for(var x in this.cities){
    //     if(this.cities[x].value==event){
    //       result.value = this.cities[x].value;
    //       result.key=this.cities[x].key;
    //     }
    //   }
    //   //this.selectedCity = this.cities.find(v => v.value == event);
    //   if(!this.addEditFlag) {
    //     this.selectedCity = {key:'Select',value:'0'};

    //   }
    //   console.log(result);
    // }
  }

  regionChanged(event) {

    if(event) {
      this.addEditFlag =false;
    }else {
      this.addEditFlag = true;
    }

    if(this.selectedRegion.value !== '0') {
      this.isRegionHidden = false;
    }
    const region = {
      regionId: this.selectedRegion.value
    }

    this.qdeHttp.getStateListFromRegion(region).subscribe(res => {
      if(res['ProcessVariables']['status'] == true) {
          const state = res['ProcessVariables']['stateList'];

          if(!state) {
            // this.states = [{key: 'No States Available',value: '0'}];
            // this.selectedState = {key: 'No States Available', value: '0'}
            this.states = this.allStates;
            this.selectedState = {key: 'Select',value: '0'};
            this.selectedZone = {key:'Select',value: '0'};
            this.zones= []
            this.selectedCity = {key:'Select',value: '0'};
            this.cities = []
          }else {
            this.states = state.map((s)=>  {
              return {key: s.stateDescription,value:String(s.stateId)}
            })

            if(!this.addEditFlag) {
              this.selectedState = {key: 'Select',value: '0'};
              this.selectedZone = {key:'Select',value: '0'};
              this.zones= []
              this.selectedCity = {key:'Select',value: '0'};
              this.cities = []
            }

          }

          
      }

    })




  }

  edit(index) {
    this.selectedRegion = {key:'Select',value:'0'};
    this.selectedState={key:'Select',value:'0'};
    this.selectedZone = {key:'Select',value:'0'};

    this.isRegionHidden = false;
    this.isStateHidden = false;
    this.isZoneHidden = false;
    this.isCityHidden = false;
    this.isValueHidden = false;
    this.isDescriptionHidden = false;
    
    this.isAdd = true;
    this.selectedIndex = index;
    this.addEditFlag = true;


    // this.viewportScroller.scrollToPosition([0,0]);

    // window.scroll({
    //   top: 0,
    //   left: 0,
    //   behavior: 'smooth'
    // })

    this.description = this.data[index].description;
    this.value = this.data[index].value;

    if(this.data[index].regionId) {
      this.selectedRegion = {
        key: this.data[index].regionName,
        value: String(this.data[index].regionId)
      }
  
    }else {
      this.selectedRegion = {
        key: 'Select',
        value: '0'
      }
    }

    if(this.tableName == 'zipcode') {
      this.selectedState = {
        key:this.data[index].stateName,
        value:String(this.data[index].stateId)
      }
      this.selectedZone = {
        key: this.data[index].zoneName,
        value:String(this.data[index].zone)
      }
      this.selectedCity = {
        key: this.data[index].cityName,
        value: String(this.data[index].cityId)
      }
      if(this.data[index].regionId) {
      this.regionChanged('')
      }
      
      this.stateChanged('')

      this.zoneChanged('')
     
      
      // this.stateChanged(this.data[index].stateId);
      // this.zoneChanged(String(this.data[index].zone));
    }
    
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
              zoneName: v['zoneName'],
              regionId: v['regionId'],
              regionName: v['regionName']
            }
          });

          this.currentPage = parseInt(res['ProcessVariables']['currentPage']);
          this.totalPages = parseInt(res['ProcessVariables']['totalPages']);
          this.perPage = parseInt(res['ProcessVariables']['perPage']);
          // this.totalElements = res['ProcessVariables']['totalPages'] * this.perPage;
          this.totalItems = res['ProcessVariables']['totalPages'] * this.perPage;
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
                zoneName: v['zoneName'],
                regionId: v['regionId'],
                regionName: v['regionName']
              }
            });

            this.currentPage = parseInt(res['ProcessVariables']['currentPage']);
            this.totalPages = parseInt(res['ProcessVariables']['totalPages']);
            this.perPage = parseInt(res['ProcessVariables']['perPage']);
            // this.totalElements = res['ProcessVariables']['totalPages'] * this.perPage;
            this.totalItems = res['ProcessVariables']['totalPages'] * this.perPage;
            this.isErrorModal = false;
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

  descriptionChange(event) {

    if(this.description) {
      this.isDescriptionHidden = false;
    }
  }

  valueChange(event) {

    console.log(typeof event)

    if(!Number(event) || String(event).length < 6) {
      this.zipcodeErrMsg  = 'Please enter a valid zipcode';
      this.isValueHidden = true;
    }else if(this.value && Number(event)) {
      this.isValueHidden = false;
      this.zipcodeErrMsg = 'Please enter the value'
    }
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView();
    setTimeout(()=> {
      this.viewportScroller.scrollToPosition([0,0]);

    },250)
  }

  ngOnDestroy() {
    this.subs.forEach(e => {if(e) e.unsubscribe()});
  }
}
