import { ActivatedRoute, Router } from '@angular/router';
import { QdeHttpService } from 'src/app/services/qde-http.service';
import { Component, OnInit, Renderer2, QueryList, ViewChildren, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-branch-add-edit',
  templateUrl: './branch-add-edit.component.html',
  styleUrls: ['./branch-add-edit.component.css']
})
export class BranchAddEditComponent implements OnInit {

  ngOnInit(): void {
  }

  _timeout: any = null;

  userId: number;
  errorMsg:string;
  updatebtn:boolean = false;
  city:Array<any>;
  zipcode:Array<any>;
  filteredItems: Array<string>;
  filteredZipCodeItems: Array<string>;
  branchType:string;
  selectedItem: number;
  defaultBranchType: number =null;
  isErrorModal:boolean = false;
  regEx = {value: '^[0-9]*$'};


  Value:string;
  description:string;
  address:string;
  branchCode:string;
  newFinnOneCode:string;
  cityInp:string;
  zipCodeInp:string;
  zipCode:string;

  @ViewChildren("city") cityList: QueryList<ElementRef>;
  @ViewChildren("zipCode") zipCodeList: QueryList<ElementRef>;

  @ViewChild('selectBox') selectBoxRef: ElementRef;
  @ViewChild('selectBox2') selectBoxRef2: ElementRef;
  @ViewChild('cityDropDown') cityDropDown: ElementRef;
  @ViewChild('zipDropDown') zipDropDown: ElementRef;



   
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
    zipCodeInp: new FormControl('')
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
          console.log("userId", this.userId);
          let data = { "id": this.userId };
         

          this.qdeHttp.getBranchRecord(data).subscribe((response) => {
            let pmayList = response['ProcessVariables']['abranchDetails'];
            this.registerUser.setValue({
              Value: pmayList.branchValue,
              description: pmayList.description || "",
              address: pmayList.address || "",
              branchCode: pmayList.branchCode || "",
              branchType: pmayList.branchType || "",
              newFinnOneCode: pmayList.newFinnOneCode || "",
              city: pmayList.cityDescription,
              cityInp: pmayList.city,
              zipCode: pmayList.zipcodeValue,
              zipCodeInp: pmayList.zipcode
            });
          });

        }

      });

    }



    get formValue() {
      return this.registerUser.controls
    }


  items: Array<string> = [''];


  search(event) {
    if (event.target.value != '') {
      this.filteredItems = this.items.filter(v => {
        if (v.toLowerCase().trim().search(event.target.value.toLowerCase().trim()) >= 0) {
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
    console.log("cityList",this.cityList);
    this.cityList.forEach(v => {
      this.renderer.removeClass(v.nativeElement, "select");
    })
    this.renderer.addClass(this.cityList["_results"][index].nativeElement, 'select');
    this.selectBoxRef.nativeElement.querySelector('.reporting_to').classList.add('hide');
  }

  filterLeads(event) {
    this._timeout = null;

    this.selectBoxRef.nativeElement.querySelector('.reporting_to').classList.remove('hide');


    if (this._timeout) { //if there is already a timeout in process cancel it
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
    let input = { "cityName": event.target.value.toLowerCase() };
       if(event.target.value!=""){
       this.qdeHttp.adminGetCityLov(input).subscribe((response) => {
         console.log("cityName", response);
         if(response['ProcessVariables']['status'] && response['ProcessVariables']['cityList']!=null){
         let cityList = response['ProcessVariables'].cityList;
         this.filteredItems = cityList;
         }else if(response['ProcessVariables']['cityList']==null){
            this.selectBoxRef.nativeElement.querySelector('.reporting_to').classList.add('hide');
            this.isErrorModal = true;
            this.errorMsg = "No data present";
         }
       })
     }else{
         this.selectBoxRef.nativeElement.querySelector('.reporting_to').classList.add('hide');
       }

  }

  filteredZipItems(event) {
    this._timeout = null;

    this.selectBoxRef2.nativeElement.querySelector('.reporting_to').classList.remove('hide');

    if (this._timeout) { //if there is already a timeout in process cancel it
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
    let input = { "zipcode": event.target.value.toLowerCase() };
    if(event.target.value!=""){
      this.qdeHttp.adminGetZipLov(input).subscribe((response) => {
        this.selectBoxRef2.nativeElement.querySelector('.reporting_to').classList.remove('hide');
        if(response['ProcessVariables']['status'] && response['ProcessVariables']['zipcodeList']!=null){
        let zipcodeList = response['ProcessVariables'].zipcodeList;
        this.filteredZipCodeItems = zipcodeList;
      }else if(response['ProcessVariables']['zipcodeList']==null){
        this.selectBoxRef2.nativeElement.querySelector('.reporting_to').classList.add('hide');
        this.isErrorModal = true;
        this.errorMsg = "No data present";
      }
    })
  }else{
        this.selectBoxRef2.nativeElement.querySelector('.reporting_to').classList.add('hide');
      }
  }

  selectedzipCode(index, data) {
    this.registerUser.patchValue({ zipCode: data.zipcodeValue});
    this.registerUser.patchValue({ zipCodeInp: data.zipcodeId });

    // this.renderer.removeClass(this.reportingRef.nativeElement, 'active');
    console.log("cityList",this.zipCodeList);
    this.zipCodeList.forEach(v => {
      this.renderer.removeClass(v.nativeElement, "select");
    })
    this.renderer.addClass(this.zipCodeList["_results"][index].nativeElement, 'select');
    this.selectBoxRef2.nativeElement.querySelector('.reporting_to').classList.add('hide');
  }

  
    onSubmit() {

  
        let data = {
          "id": this.userId || 0,
          "value": this.formValue.Value.value,
          "description": this.formValue.description.value,
          "address": this.formValue.address.value,
          "branchType": this.formValue.branchType.value,
          "branchCode": this.formValue.branchCode.value,
          "newFinnOneCode": this.formValue.newFinnOneCode.value,
          "city": this.formValue.cityInp.value,
          "cityInp": this.formValue.city.value,
          "zipcode": this.formValue.zipCodeInp.value,
          "zipCodeInp": this.formValue.zipCode.value,
          "userId": parseInt(localStorage.getItem("userId"))
        }
        console.log(data);
  
        this.qdeHttp.addBranchRecord(data).subscribe((response) => {
          console.log(response);
  
          if (response["Error"] === "0" &&
            response["ProcessVariables"]["status"]) {
            this.isErrorModal = true;
            this.errorMsg ="Branch created Successfully!"; 
              //alert("Branch created Successfully!");
            this.registerUser.reset();
            this.router.navigate(['admin/lovs/branch_list']);
          } else {
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
          }
        },
        error => {
          console.log("Error : ", error);
        });
  
  
    }


}
