import { ActivatedRoute, Router } from '@angular/router';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { QdeHttpService } from 'src/app/services/qde-http.service';
import {
  Component,
  OnInit,
  Renderer2,
  QueryList,
  ViewChildren,
  ElementRef,
  ViewChild,
  OnDestroy
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators
} from '@angular/forms';
import { } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-branch-add-edit',
  templateUrl: './branch-add-edit.component.html',
  styleUrls: ['./branch-add-edit.component.css']
})
export class BranchAddEditComponent implements OnInit, OnDestroy {
  _timeout: any = null;
  zipcodeSubscription: Subscription;
  userId: number;
  errorMsg: string;
  updatebtn: boolean = false;
  city: Array<any>;
  zipcode: Array<any>;
  filteredItems: Array<string>;
  filteredZipCodeItems: Array<string>;
  branchType: string;
  selectedItem: number;
  defaultBranchType: number = null;
  isErrorModal: boolean = false;
  // regEx = { value: '^[0-9]*$' };
  regEx = { value: "^[0-9A-Za-z, _&*#'/\\-@]{0,99}$"}
myFormValid: boolean = false;

  Value: string;
  description: string;
  address: string;
  branchCode: string;
  newFinnOneCode: string;
  cityInp: string;
  zipCodeInp: string;
  zipCode: string;

  @ViewChildren('city') cityList: QueryList<ElementRef>;
  @ViewChildren('zipCode') zipCodeList: QueryList<ElementRef>;

  @ViewChild('selectBox') selectBoxRef: ElementRef;
  @ViewChild('selectBox2') selectBoxRef2: ElementRef;
  @ViewChild('cityDropDown') cityDropDown: ElementRef;
  @ViewChild('zipDropDown') zipDropDown: ElementRef;
  @ViewChild('zipCodeInput') zipCodeInputRef: ElementRef;

  regions: Array<any>;
  states: Array<any>;
  zones: Array<any>;
  region: any;
  zone: any;
  state: any;
  dropdownSettings = {};
  singleDropdownSettings = {};

  registerUser = new FormGroup({
    Value: new FormControl(''),
    description: new FormControl(''),
    address: new FormControl(''),
    branchCode: new FormControl(''),
    branchType: new FormControl(''),
    newFinnOneCode: new FormControl(''),
    city: new FormControl(''),
    cityInp: new FormControl(''),
    zipCode: new FormControl(''),
    zipCodeInp: new FormControl(''),
    region: new FormControl({value: '', disabled: true}),
    zone: new FormControl({value: '', disabled: true}),
    state: new FormControl({value: '', disabled: true}),
    branch: new FormControl('')
  });

  constructor(private qdeHttp: QdeHttpService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private renderer: Renderer2) {

    this.filteredItems = this.city;
    this.selectedItem = 0;

    // this.qdeHttp.adminGetCityLov({}).subscribe((response) => {
    //   this.city = response['ProcessVariables'].cityList;
    //   console.log("Lov", this.city);
    // });

    this.route.params.subscribe(val => {
      if (val['userId'] != null) {
        this.userId = parseInt(val['userId']);
        console.log('userId', this.userId);
        let data = { id: this.userId };

        this.qdeHttp.getBranchRecord(data).subscribe((response) => {
          let pmayList = response['ProcessVariables']['abranchDetails'];
          this.registerUser.patchValue({
            Value: pmayList.branchName,
            description: pmayList.description || "",
            address: pmayList.address || "",
            branchCode: pmayList.branchCode || "",
            branchType: pmayList.branchType || "",
            newFinnOneCode: pmayList.newFinnOneCode || "",
            city: pmayList.cityDescription,
            cityInp: pmayList.city,
            zipCode: pmayList.zipcodeValue,
            zipCodeInp: pmayList.zipcode,

          });
          this.getCityStateZoneRegionFromZipCode(pmayList.zipcode);
        });
      }
    });
  }

  get formValue() {
    return this.registerUser.controls;
  }

  items: Array<string> = [''];

  ngOnInit() {
    this.disableFormControl('city');
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'value',
      textField: 'key',
      itemsShowLimit: 4,
      enableCheckAll: false
    };

    this.singleDropdownSettings = {
      singleSelection: true,
      allowSearchFilter: true,
      enableCheckAll: false,
      idField: 'value',
      textField: 'key',
      closeDropDownOnSelection: true
    }

    this.qdeHttp.adminGetUserLov({}).subscribe((response) => {
      const lov = JSON.parse(response['ProcessVariables'].lovs);
      this.states = lov.LOVS.state;
      this.zones = lov.LOVS.zone;
    });

    this.zipcodeSubscription = fromEvent(
      this.zipCodeInputRef.nativeElement,
      'keyup'
    )
      .pipe(debounceTime(500))
      .subscribe((event: any) => {
        console.log('event', event.target.value);
        this.filteredZipItems(event);
      });


  }

  disableFormControl(controlName: string) {
    this.registerUser.get(controlName).disable();
  }

  search(event) {
    if (event.target.value != '') {
      this.filteredItems = this.items.filter(v => {
        if (
          v
            .toLowerCase()
            .trim()
            .search(event.target.value.toLowerCase().trim()) >= 0
        ) {
          return true;
        } else {
          return false;
        }
      });
      event.target.click();
    } else {
      this.filteredItems = this.items;
    }
  }

  selectedCity(index, data) {
    this.registerUser.patchValue({ city: data.cityDescription });
    this.registerUser.patchValue({ cityInp: data.cityId });

    // this.renderer.removeClass(this.reportingRef.nativeElement, 'active');
    console.log("cityList", this.cityList);
    this.cityList.forEach(v => {
      this.renderer.removeClass(v.nativeElement, 'select');
    });
    this.renderer.addClass(
      this.cityList['_results'][index].nativeElement,
      'select'
    );
    this.selectBoxRef.nativeElement
      .querySelector('.reporting_to')
      .classList.add('hide');
  }

  filterLeads(event) {
    this._timeout = null;

    this.selectBoxRef.nativeElement
      .querySelector('.reporting_to')
      .classList.remove('hide');

    if (this._timeout) {
      //if there is already a timeout in process cancel it
      window.clearTimeout(this._timeout);
    }
    // this._timeout = window.setTimeout(() => {

    //   console.log(event.target.value.toLowerCase());
    //   let input = { "cityName": event.target.value.toLowerCase() };
    //   if(event.target.value!=""){
    //   this.qdeHttp.adminGetCityLov(input).subscribe((response) => {
    //     console.log("cityName", response);
    //     if(response['ProcessVariables']['status']){
    //     let cityList = response['ProcessVariables'].cityList;
    //     this.filteredItems = cityList;
    //     }
    //   })
    // }else{
    //     this.selectBoxRef.nativeElement.querySelector('.reporting_to').classList.add('hide');
    //   }

    // }, 1000);
    let input = { cityName: event.target.value.toLowerCase() };
    if (event.target.value != '') {
      this.qdeHttp.adminGetCityLov(input).subscribe(response => {
        console.log('cityName', response);
        if (
          response['ProcessVariables']['status'] &&
          response['ProcessVariables']['cityList'] != null
        ) {
          let cityList = response['ProcessVariables'].cityList;
          this.filteredItems = cityList;
        } else if (response['ProcessVariables']['cityList'] == null) {
          this.selectBoxRef.nativeElement
            .querySelector('.reporting_to')
            .classList.add('hide');
          this.isErrorModal = true;
          this.errorMsg = 'No data present';
          this.city = [];
        }
      });
    } else {
      this.selectBoxRef.nativeElement
        .querySelector('.reporting_to')
        .classList.add('hide');
    }
  }

  filteredZipItems(event) {
    this.myFormValid = true;
    this._timeout = null;

    this.selectBoxRef2.nativeElement
      .querySelector('.reporting_to')
      .classList.remove('hide');

    if (this._timeout) {
      //if there is already a timeout in process cancel it
      window.clearTimeout(this._timeout);
    }
    // this._timeout = window.setTimeout(() => {

    //   console.log(event.target.value.toLowerCase());
    //   let input = { "zipcode": event.target.value.toLowerCase() };
    //   this.qdeHttp.adminGetZipLov(input).subscribe((response) => {
    //     console.log("cityName", response);
    //     this.selectBoxRef2.nativeElement.querySelector('.reporting_to').classList.remove('hide');
    //     if(response['ProcessVariables']['status']){
    //     let zipcodeList = response['ProcessVariables'].zipcodeList;
    //     this.filteredZipCodeItems = zipcodeList;
    //   }else{
    //     this.selectBoxRef2.nativeElement.querySelector('.reporting_to').classList.addClass('hide');
    //   }
    //   });

    // }, 1000);
    let input = { zipcode: event.target.value.toLowerCase() };
    if (event.target.value != '') {
      this.qdeHttp
        .adminGetZipLov(input)
        .pipe(debounceTime(1000))
        .subscribe(response => {
          this.selectBoxRef2.nativeElement
            .querySelector('.reporting_to')
            .classList.remove('hide');
          if (
            response['ProcessVariables']['status'] &&
            response['ProcessVariables']['zipcodeList'] != null
          ) {
            let zipcodeList = response['ProcessVariables'].zipcodeList;
            this.filteredZipCodeItems = zipcodeList;
          } else if (response['ProcessVariables']['zipcodeList'] == null) {
            this.selectBoxRef2.nativeElement
              .querySelector('.reporting_to')
              .classList.add('hide');
            this.isErrorModal = true;
            this.errorMsg = 'No data present';
            this.zipCode = '';
          }
        });
    } else {
      this.selectBoxRef2.nativeElement
        .querySelector('.reporting_to')
        .classList.add('hide');
    }
  }

  selectedzipCode(index, data) {
    this.myFormValid = false
    this.registerUser.patchValue({ zipCode: data.zipcodeValue });
    this.registerUser.patchValue({ zipCodeInp: data.zipcodeId });

    this.getCityStateZoneRegionFromZipCode(data.zipcodeId);

    // this.renderer.removeClass(this.reportingRef.nativeElement, 'active');
    console.log("cityList", this.zipCodeList);
    this.zipCodeList.forEach(v => {
      this.renderer.removeClass(v.nativeElement, 'select');
    });
    this.renderer.addClass(
      this.zipCodeList['_results'][index].nativeElement,
      'select'
    );
    this.selectBoxRef2.nativeElement
      .querySelector('.reporting_to')
      .classList.add('hide');
  }

  getCityStateZoneRegionFromZipCode(zipcodeId: number) {
    if(!zipcodeId) {
      return;
    }
    if(typeof zipcodeId === 'string') {
      zipcodeId = Number(zipcodeId);
    }
    this.qdeHttp
      .getCityStateZoneRegionFromZipCode({ zipcodeId })
      .subscribe((res: any) => {
        console.log('zipcode res', res);
        const response = res.ProcessVariables;
        if (response.status) {
          if (response.zoneName) {
            this.zones = [
              {
                value: response.zoneId,
                key: response.zoneName
              }
            ];
            this.zone = [response.zoneName];
          }

          if (response.stateId) {
            this.states = [
              {
                value: response.stateId,
                key: response.stateName
              }
            ];
            this.state = [response.stateName];
            this.city = response.cityName;
          }

          if (response.regionId) {
            this.regions = [
              {
                value: response.regionId,
                key: response.regionName
              }
            ];

            this.region = [response.regionName];
          }
        }
      });
  }

  onSubmit() {
    let data = {
      id: this.userId || 0,
      value: this.formValue.Value.value,
      // description: this.formValue.description.value,
      branchName: this.formValue.Value.value,
      address: this.formValue.address.value,
      branchType: this.formValue.branchType.value,
      branchCode: this.formValue.branchCode.value,
      newFinnOneCode: this.formValue.newFinnOneCode.value,
      city: this.formValue.cityInp.value,
      cityInp: this.formValue.city.value,
      zipcode: this.formValue.zipCodeInp.value,
      zipCodeInp: this.formValue.zipCode.value,
      userId: parseInt(localStorage.getItem('userId'))
    };
    console.log(data);

    this.qdeHttp.addBranchRecord(data).subscribe(
      response => {
        console.log(response);

        if (
          response['Error'] === '0' &&
          response['ProcessVariables']['status']
        ) {
          this.isErrorModal = true;
          this.errorMsg = 'Branch created Successfully!';
          //alert("Branch created Successfully!");
          this.registerUser.reset();
          this.router.navigate(['admin/lovs/branch_list']);
        }
        /* else {
            if (response["ErrorMessage"]) {
              console.log("Response: " + response["ErrorMessage"]);
              this.isErrorModal = true;
              this.errorMsg = response["ErrorMessage"];
            } else if (response["ProcessVariables"]["errorMessage"]) {
              console.log(
                "Response: " + response["ProcessVariables"]["errorMessage"]
              );
              this.isErrorModal = true;
              this.errorMsg = response["ProcessVariables"]["errorMessage"];
            }
          } */
    },
      error => {
        console.log("Error : ", error);
      });


  }
  hideList(){
    this.selectBoxRef2.nativeElement            
            .querySelector('.reporting_to')            
            .classList.add('hide');
            
  }

  ngOnDestroy() {
    if (this.zipcodeSubscription) {
      this.zipcodeSubscription.unsubscribe();
    }
  }
}
