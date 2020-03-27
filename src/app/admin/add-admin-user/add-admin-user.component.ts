import { ActivatedRoute, Router } from '@angular/router';
import { QdeHttpService } from 'src/app/services/qde-http.service';
import { Component, OnInit, AfterViewInit, Renderer2, QueryList, ViewChildren } from '@angular/core';
import {NgForm} from '@angular/forms';
import { FieldFillDirective } from 'src/app/directives/field-fill.directive';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';

import {ViewChild, ElementRef} from '@angular/core';
import { } from 'ng-multiselect-dropdown';
import { QdeService } from 'src/app/services/qde.service';
import { e } from '@angular/core/src/render3';
import { StaticInjector } from '@angular/core/src/di/injector';


@Component({
  selector: 'app-add-admin-user',
  templateUrl: './add-admin-user.component.html',
  styleUrls: ['./add-admin-user.component.css']
})
export class AddAdminUserComponent implements OnInit, AfterViewInit {

  reportingToInp: any;
  selectedBranches = [];
  defaultSelectBranch:string ="null";
  // defaultSelectRole:string="null";
  defaultSelectRole = "0";
  isLessAmount: boolean;
  requirMinAmout: any;
  isMaxAmount: boolean;
  requirMaxAmout: any;
  ngAfterViewInit(): void {
    console.log("After view init");
  }

  @ViewChild('reportingTo') reportingRef: ElementRef;

  @ViewChild('selectBox') selectBoxRef: ElementRef;

  
  userRoles: Array<any>;
  branches: Array<any>;
  states: Array<any>;
  zones: Array<any>;
  formdata;
  reportingTo: string;
  reportingToStr: string;

  // registerUser: FormGroup;
  filteredItems: Array<string>;
  _timeout: any = null;
  userId: number;
  updatebtn:boolean = false;
  errorMsg:string;
  isErrorModal:boolean = false;
  CSVerrorMessage: string;
  regexPattern = {
    mobileNumber: "^[1-9][0-9]*$",
    // name: "^[a-zA-Z ]+(([',. -][a-zA-Z ])?[a-zA-Z ]*)*$", 
    name: "^[a-zA-Z0-9 ]+(([',. -][a-zA-Z ])?[a-zA-Z ]*)*$",
    rmId: "^[0-9]*$",
  }




  selectedItem: number;
  registerUser= new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    userName: new FormControl('', [Validators.required, Validators.minLength(6)]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    mailId: new FormControl('', [Validators.required, Validators.email, Validators.pattern("[^ @]*@[^ @]*")]),
    mobileNumber: new FormControl('', [Validators.required, Validators.maxLength(10), Validators.pattern('[6-9]\\d{9}')]),
    userRoleId: new FormControl('', [Validators.required]),
    userBranchId: new FormControl('', [Validators.required]),
    reportingTo: new FormControl('', [Validators.required]),
    reportingToInp: new FormControl(''),
    rmId:new FormControl('')
  });
   

  firstName:string;
  lastName:string;
  userName:string;
  password:string;
  mailId:string;
  mobileNumber:string;
  // OnInit
  userRoleId:string;
  branchId:string;
  region;
  zone: string;
  state: string;
  city: string;
  rmId: string;
  dropdownSettings = {};
  singleDropdownSettings = {};
  lov;
  isActive: boolean;
  minMaxValues;
  @ViewChildren("reportingTo") reportingToList: QueryList<ElementRef>;
  constructor(private qdeHttp: QdeHttpService,
    private formBuilder: FormBuilder,
    private qdeService: QdeService,
    private route: ActivatedRoute,
    private router: Router,
    private renderer: Renderer2
  ) {
    this.filteredItems = this.items;
    this.selectedItem = 0;

    this.registerUser.valueChanges.subscribe(val => {
      this.firstName = val['firstName'];
      this.lastName = val['lastName'];
      this.userName = val['userName'];
      this.password = val['password'];
      this.mailId = val['mailId'];
      this.mobileNumber = val['mobileNumber'];
      this.userRoleId = val['userRoleId']; 
      this.userBranchId = val['userBranchId']; 
      this.reportingToInp = val['reportingToInp']; 
      this.reportingTo = val['reportingTo']; 
      this.rmId = val['rmId'];
    })

    // if(this.route.snapshot.data['userBranchLovs']) {
    //   // this.adminLovs = this.route.snapshot.data['adminLovs']['ProcessVariables']['mastersList'];
    //   // this.filteredLovs = this.adminLovs;
    //   var lov = JSON.parse(this.route.snapshot.data.userBranchLovs['ProcessVariables'].lovs);


    //   // var lov = JSON.parse(response['ProcessVariables'].lovs);
    //   console.log("Lov", lov);
    //   this.userRoles = lov.LOVS.user_role;
    //   this.branch = lov.LOVS.branch;

    // } else {
    //   alert('Could not Load Data.');
    // }

    // this.qdeHttp.adminGetUserLov({}).subscribe((response) => {
    //   var lov = JSON.parse(response['ProcessVariables'].lovs);
    //   this.userRoles = lov.LOVS.user_role;
    //   this.branches = lov.LOVS.branch;
    //   this.states = lov.LOVS.state;
    //   this.zones = lov.LOVS.zone;
    //   // this.selectedRoleType = this.userRoles[0].key;

    //   console.log("this.userRoles", this.userRoles);
    //   console.log("this.branch", this.branches);
    //   // console.log("Selected role",this.selectedRoleType)
    // });
    
    this.lov = JSON.parse(this.route.snapshot.data['userBranchLovs']['ProcessVariables'].lovs);
    console.log("LOVS", this.lov);
    this.userRoles = this.lov.LOVS.user_role;
      this.branches = this.lov.LOVS.branch;
      this.states = this.lov.LOVS.state;
      this.zones = this.lov.LOVS.zone;
      this.minMaxValues = this.lov.LOVS.min_max_values;
      this.isActive = false;
    this.route.params.subscribe(val => {
      if (val['userId'] != null) {
        this.userId = parseInt(val['userId']);
        console.log("userId", this.userId);
        let data = { "userId": this.userId };
        if(this.userId) {
          this.updatebtn = true;
        }
        this.qdeHttp.getAdminUser(data).subscribe((response) => {

          this.registerUser.setValue({
            firstName: response['ProcessVariables']['firstName'] || "",
            lastName: response['ProcessVariables']['lastName'] || "",
            userName:  response['ProcessVariables']['userName'] || "",
            password: response['ProcessVariables']['password'] || "",
            mailId: response['ProcessVariables']['emailId'] || "",
            mobileNumber: response['ProcessVariables']['mobileNumber'] || "",
            reportingTo: response['ProcessVariables']['reportingToUser'] || "",
            userBranchId: response['ProcessVariables']['branchId'] || "",
            userRoleId: parseInt(response['ProcessVariables']['roleId']) || "",
            reportingToInp: response['ProcessVariables']['reportingTo'] || "",
            rmId: response['ProcessVariables']['rmId'] || ""
          });
        });
        this.isActive = true;
      }
    });

  }

  ngOnInit() {

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'value',
      textField: 'key',
      itemsShowLimit: 4,
      enableCheckAll: false,
      allowSearchFilter: true
    };

    this.singleDropdownSettings = {
      singleSelection: true,
      allowSearchFilter: true,
      enableCheckAll: false,
      idField: 'value',
      textField: 'key',
      closeDropDownOnSelection: true
    }
    // this.registerUser = this.formBuilder.group({
    //   firstName: [''],
    //   lastName: [''],
    //   userName: [''],
    //   password: [''],
    //   mailId: [''],
    //   mobileNumber: [''],
    //   reportingTo: ['']
    // });
  }

  get formValue() {
    return this.registerUser.controls
  }

  onSubmit() {


      console.log('data', this.formValue.userBranchId);
      console.log('branch Id', this.qdeService.getOnlyKeyValues(this.formValue.userBranchId.value));


    

      if(this.updatebtn) {
        this.updateUserDetails();
        return;
      }

      let data = {
        "userName": this.formValue.userName.value + "@icicibankltd.com",
        "firstName": this.formValue.firstName.value,
        "lastName": this.formValue.lastName.value,
        "password": this.formValue.password.value,
        "mobileNumber": this.formValue.mobileNumber.value,
        "mailId": this.formValue.mailId.value,
        "roleId": parseInt(this.changeUserRole()),
        // "branchId": parseInt(this.changeBranch()),
        "branchId": this.qdeService.getOnlyKeyValues(this.formValue.userBranchId.value),
        "reportingTo": parseInt(this.formValue.reportingToInp.value),
        "userId": parseInt(localStorage.getItem("userId")),
        "rmId":this.formValue.rmId.value
        
      }
      console.log(data);

      this.qdeHttp.addAdminUsers(data).subscribe((response) => {
        console.log(response);

        if (response["Error"] === "0" &&
          response["ProcessVariables"]["status"]) {
            this.isErrorModal = true;
            this.errorMsg = "Added Successfully";
          //alert("Uploaded Successfully!");
          this.registerUser.reset();
          this.router.navigate(['admin/user-module']);
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

  _keyPress(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();

    }
  }


  // Getter method to access formcontrols
  changeUserRole() {
    console.log("change value", this.registerUser.get('userRoleId').value);
    return this.registerUser.get('userRoleId').value;
  }

  changeBranch() {
    console.log("change branchId value", this.registerUser.get('userBranchId').value);
    return this.registerUser.get('userBranchId').value;
  }

  set userBranchId(val) {
    // console.log("br: " + val.key + "-" + val.value);
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

  selectedReportedTo(index, data) {
    console.log("clicked", data.userName);
    this.registerUser.patchValue({ reportingTo: data.userName });
    this.registerUser.patchValue({ reportingToInp: data.userId });

    this.selectBoxRef.nativeElement.querySelector('.reporting_to').classList.add('hide');


    // this.renderer.removeClass(this.reportingRef.nativeElement, 'active');
    console.log("reportingToList",this.reportingToList);
    this.reportingToList.forEach(v => {
      this.renderer.removeClass(v.nativeElement, "active");
    })
    this.renderer.addClass(this.reportingToList["_results"][index+1].nativeElement, 'active');
  }

  filterLeads(event) {
    this._timeout = null;
    
    this.selectBoxRef.nativeElement.querySelector('.reporting_to').classList.remove('hide');

    if (this._timeout) { //if there is already a timeout in process cancel it
      window.clearTimeout(this._timeout);
    }
    //this._timeout = window.setTimeout(() => {

      //console.log(event.target.value.toLowerCase());
      //if(event.target.value!=""){
      //let input = { "userName": event.target.value.toLowerCase() };
      //this.qdeHttp.adminReportingTo(input).subscribe((response) => {
        //console.log("Reporting", response);
        //let usersList = response['ProcessVariables'].userList;
        //this.filteredItems = usersList;
      //});
	//}
    //}, 1000);
    if(event.target.value!=""){
		let input = { "userName": event.target.value.toLowerCase() };
       this.qdeHttp.adminReportingTo(input).subscribe((response) => {
         console.log("Reporting", response);
         if(response['ProcessVariables']['status'] && response['ProcessVariables']['userList']!=null){
          this.isErrorModal = false;
         let usersList = response['ProcessVariables']['userList'];
         this.filteredItems = usersList;
         }else if(response['ProcessVariables']['status'] && response['ProcessVariables']['userList']==null){
            this.selectBoxRef.nativeElement.querySelector('.reporting_to').classList.add('hide');
            this.isErrorModal = true;
            this.errorMsg = "No data present Further";
         }
       })
     }else{
         this.selectBoxRef.nativeElement.querySelector('.reporting_to').classList.add('hide');
       }
  }

  searchReportinToAPI(text) {

  }

  updateUserDetails() {
    console.log('data', this.formValue.reportingToInp.value);
    console.log('data', this.formValue.reportingTo.value);

    let data = {
      "id": this.userId,
      "firstName": this.formValue.firstName.value,
      "lastName": this.formValue.lastName.value,
      "userId": parseInt(localStorage.getItem("userId")),
      "mobile": this.formValue.mobileNumber.value,
      "mailId": this.formValue.mailId.value,
      "roleId": parseInt(this.formValue.userRoleId.value),
      // "branchId":  parseInt(this.formValue.userBranchId.value),
      "branchId": this.qdeService.getOnlyKeyValues(this.formValue.userBranchId.value),
      "reportingTo": parseInt(this.formValue.reportingToInp.value),
      "rmId": this.formValue.rmId.value
    }
    console.log(data);

    this.qdeHttp.updateAdminUsers(data).subscribe((response) => {
      console.log(response);

        if (response["Error"] === "0" &&
          response["ProcessVariables"]["status"]) {
            this.isErrorModal = true;
            this.errorMsg = "Updated Successfully";
          //alert("Uploaded Successfully!");
          this.registerUser.reset();
          this.router.navigate(['admin/user-module']);
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


  emailDomainValidator(control: FormControl) { 
    let email = control.value;
    if (email && email.indexOf("@") != -1) {
      let [_, domain] = email.split("@");
      if (domain !== "icicihfc.com") {
        return {
          emailDomain: {
            parsedDomain: domain
          }
        }
      }
    }
    return null;
  }

  getBranchObject(aList){
    let getStringList: string = aList
    let selectActivity: Array<any> = getStringList.split(",");
    let myList=[];
    console.log("arry list length ",this.branches.length);
    if (selectActivity.length>0 &&  this.branches.length >0 ){
        selectActivity.forEach((d) => {
          this.branches.forEach( (obj)=> {
              if (d== obj.value){
                  console.log("ddd",obj)
                  myList.push(obj);
                  }}
              )});
            }
          

    console.log('conveted Object',myList) ;
          return myList;

  }
buildForm(registorUserData?): FormGroup{
  this.registerUser= new FormGroup({
    firstName: new FormControl(registorUserData.firstName, Validators.required),
    lastName: new FormControl('', Validators.required),
    userName: new FormControl('', [Validators.required, Validators.minLength(6)]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    mailId: new FormControl('', [Validators.required, Validators.email, Validators.pattern("[^ @]*@[^ @]*")]),
    mobileNumber: new FormControl('', [Validators.required, Validators.maxLength(10), Validators.pattern('[6-9]\\d{9}')]),
    userRoleId: new FormControl('', [Validators.required]),
    userBranchId: new FormControl('', [Validators.required]),
    reportingTo: new FormControl('', [Validators.required]),
    reportingToInp: new FormControl(''),
    rmId:new FormControl('')
  });
  return this.registerUser;
}

checkAmountLimit(event,minAmount?,maxAmount?) {
  // console.log("checkAmountLimit call ",event,minAmount,maxAmount);
  let n = parseInt(this.getNumberWithoutCommaFormat(event.target.value));
  if(minAmount != undefined && n < minAmount ){
    console.log("min ",event,minAmount,maxAmount);
    this.isLessAmount = true;
    this.requirMinAmout = minAmount;   
  } else if(maxAmount != undefined && n >= maxAmount){
    console.log("max ",event,minAmount,maxAmount);
    this.isMaxAmount = true;
    this.requirMaxAmout = maxAmount;
  } else {
    this.isLessAmount = false;
    this.requirMinAmout="";
    this.isMaxAmount = false;
    this.requirMaxAmout="";
  }
}
getNumberWithoutCommaFormat(x: string) : string {
  return x ? x+"".split(',').join(''): '';
}
onDeactivateUser(){
  let formData = {
    "id": this.userId,   
    "userId": parseInt(localStorage.getItem("userId"))
  }
  this.qdeHttp.deactivateUser(formData).subscribe(
    response => {
    
      if (
        response['Error'] === '0' &&
        response['ProcessVariables']['status']
      ) {
        this.isActive = false;
       this.isErrorModal = true;
        this.errorMsg = "User Deactivated Successfully";
      //alert("Uploaded Successfully!");
        this.registerUser.reset();
        this.router.navigate(['admin/user-module']);
      }     
  },
    error => {
      console.log("Error : ", error);
    });

}

}
export class registorUserData{
  firstName: string;
  lastName: string;
  userName: string;
  password: string;
  mailId: string;
  mobileNumber:string;
  userRoleId:string;
  userBranchId:string;
  reportingTo: string;
  reportingToInp:string;
  rmId:string;
}
