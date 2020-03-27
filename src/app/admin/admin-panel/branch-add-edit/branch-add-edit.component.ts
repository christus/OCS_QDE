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
  hfcBranchCode:string;
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
  citys: Array<any>;
  region: any;
  zone: any;
  state: any;
  city: any;
  zipcode: Array<any>;
  dropdownSettings = {};
  singleDropdownSettings = {};
  isActive: boolean ;

  registerUser = new FormGroup({
    Value: new FormControl('',[Validators.required]),
    description: new FormControl(''),
    address: new FormControl('',[Validators.required]),
    branchCode: new FormControl('',[Validators.required]),
    hfcBranchCode: new FormControl('',[Validators.required]),
    branchType: new FormControl(''),
    newFinnOneCode: new FormControl('',[Validators.required]),
    city: new FormControl({value: ''},[Validators.required]),
    cityInp: new FormControl(''),
    zipCode: new FormControl('',[Validators.required]),
    zipCodeInp: new FormControl(''),
    region: new FormControl('',[Validators.required]),
    zone: new FormControl('',[Validators.required]),
    state: new FormControl('',[Validators.required]),
    branch: new FormControl('')
  });

  regexPattern = {
    number: "^[0-9]*$",
    // name: "^[a-zA-Z ]+(([',. -][a-zA-Z ])?[a-zA-Z ]*)*$", 
    name: "^[a-zA-Z0-9 ]+(([',. -][a-zA-Z ])?[a-zA-Z ]*)*$"
  }
  minMaxValues;
  isLessAmount: boolean;
  requirMinAmout: any;
  isMaxAmount: boolean;
  requirMaxAmout: any;
  isLessBCode: boolean;
  requirMinBCode: any;
  isMaxBCode: boolean;
  requirMaxBCode: any;
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
    let lovs = JSON.parse(this.route.snapshot.data.listOfAdminValues['ProcessVariables'].lovs);
    this.minMaxValues =lovs.LOVS.min_max_values;
    this.states = lovs.LOVS.state;
    this.zones = lovs.LOVS.zone;
    this.regions = lovs.LOVS.regions
    this.citys = lovs.LOVS.city;
    this.isActive = false;
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
            hfcBranchCode: pmayList.hfcBranchCode || "",
            branchType: pmayList.branchType || "",
            newFinnOneCode: pmayList.newFinnOneCode || "",
            city: [{"key":pmayList.cityDescription,"value":pmayList.cityId}] || "",
            cityInp: pmayList.city,
            zipCode: pmayList.zipcodeValue || "",
            zipCodeInp: pmayList.zipcode,
            region: [{"key":pmayList.region,"value":pmayList.regionId}] || "",
            zone: [{"key":pmayList.zone,"value":pmayList.zoneId}] || "",
            state: [{"key":pmayList.state,"value":pmayList.stateId}] || ""
            
          });
          this.isActive = true;
          // this.getCityStateZoneRegionFromZipCode(pmayList.zipcode);
        });
      }
    });
  }

  get formValue() {
    return this.registerUser.controls;
  }

  items: Array<string> = [''];

  ngOnInit() {
    // this.disableFormControl('city');
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

    // this.qdeHttp.adminGetUserLov({}).subscribe((response) => {
    //   const lov = JSON.parse(response['ProcessVariables'].lovs);
    //   this.states = lov.LOVS.state;
    //   this.zones = lov.LOVS.zone;
    //   this.regions = lov.LOVS.regions
    //   this.citys = lov.LOVS.city;
    //   this.minMaxValues =lov.LOVS.min_max_values;
    // });

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
    this.myFormValid = false;
    this.registerUser.patchValue({ zipCode: data.zipcodeValue });
    this.registerUser.patchValue({ zipCodeInp: data.zipcodeId });

    // this.getCityStateZoneRegionFromZipCode(data.zipcodeId);

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
            // this.zone = 
            //   {
            //     value: response.zoneId,
            //     key: response.zoneName
            //   }
            // ;
            this.zone = [response.zoneName];
          }else{
            this.zone ='';
            // this.zones = [];
          }

          if (response.stateId) {
            // this.state = 
            //   {
            //     value: response.stateId,
            //     key: response.stateName
            //   }
            // ;
            this.state = [response.stateName];
            // this.city = response.cityName;
            // this.cityInp = response.cityId;
          }else {
            this.state = '';
            // this.states = [];
          }
          if(response.cityId){
            // this.city = {
            //   value: response.cityId,
            //   key: response.cityName
            // };
            this.city = [response.cityName];
          } else {
            this.city='';
          }

          if (response.regionId) {
            // this.region = 
            //   {
            //     value: response.regionId,
            //     key: response.regionName
            //   }
            // ;

            this.region = [response.regionName];
          } else {
            this.region= '';
            // this.regions=[];
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
      branchCode: Number(this.formValue.branchCode.value),
      hfcBranchCode: this.formValue.hfcBranchCode.value,
      newFinnOneCode: this.formValue.newFinnOneCode.value,
      city: this.city[0].value,
      cityInp:this.city[0].value,
      // city: this.formValue.cityInp.value,
      // cityInp: this.formValue.city.value,
      zipcode: this.formValue.zipCodeInp.value,
      zipCodeInp: this.formValue.zipCode.value,
      userId: parseInt(localStorage.getItem('userId')),
      region: this.region[0].value,
      zone: this.zone[0].value,
      state: this.state[0].value
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
  checkAmountLimit(event,minAmount?,maxAmount?) {
    console.log("event ",event);
    let n = parseInt(this.getNumberWithoutCommaFormat(event.target.value));
    console.log("event ",n);
    if(minAmount != undefined && n < minAmount ){
      console.log("min ",minAmount);
     
      if(event.target.name == "branchCode"){
        this.isLessBCode = true;
        // this.isLessAmount = false;
        this.requirMinBCode = minAmount;
      }else{
        this.isLessAmount = true
        // this.isLessBCode = false;
        this.requirMinBCode ="";
      }
    } else if(n > Number(maxAmount) && maxAmount != undefined){
      if(event.target.name == "branchCode"){
        this.isMaxBCode = true;
        // this.isMaxAmount = false;
        this.requirMaxBCode = maxAmount;
      }else{
      console.log("max ",maxAmount);
      this.isMaxAmount = true;
      // this.isMaxBCode = false;
      this.requirMaxAmout = maxAmount;
      }
    } else {
      this.isLessAmount = false;
      this.requirMinAmout="";
      this.isMaxAmount = false;
      this.requirMaxAmout="";
      this.isMaxBCode = false;
      this.isLessBCode = false;
    }
  }
  getNumberWithoutCommaFormat(x: string) : string {
    return x ? x+"".split(',').join(''): '';
  }

  ngOnDestroy() {
    if (this.zipcodeSubscription) {
      this.zipcodeSubscription.unsubscribe();
    }
  }
  onDeactivateBranch(){
    let formData ={
      userId: parseInt(localStorage.getItem('userId')),
      id: this.userId 
    }
    this.qdeHttp.deactivateBranch(formData).subscribe(
      response => {
      
        if (
          response['Error'] === '0' &&
          response['ProcessVariables']['status']
        ) {
          this.isActive = false;
          this.isErrorModal = true;
          this.errorMsg = 'Branch Deactivated Successfully!';
          //alert("Branch created Successfully!");
          this.registerUser.reset();
          this.router.navigate(['admin/lovs/branch_list']);
        }
       
    },
      error => {
        console.log("Error : ", error);
      });

  }
}
