import { ActivatedRoute, Router } from '@angular/router';
import { QdeHttpService } from 'src/app/services/qde-http.service';
import { Component, OnInit, AfterViewInit, Renderer2, QueryList, ViewChildren } from '@angular/core';
import {NgForm} from '@angular/forms';
import { FieldFillDirective } from 'src/app/directives/field-fill.directive';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';

import {ViewChild, ElementRef} from '@angular/core';


@Component({
  selector: 'app-add-admin-user',
  templateUrl: './add-admin-user.component.html',
  styleUrls: ['./add-admin-user.component.css']
})
export class AddAdminUserComponent implements OnInit, AfterViewInit {

  ngAfterViewInit(): void {
    console.log("After view init");
  }

  @ViewChild('reportingTo') reportingRef: ElementRef;


  userRoles: Array<any>;
  branch: Array<any>;
  formdata;
  reportingTo: string;
  // registerUser: FormGroup;
  filteredItems: Array<string>;
  _timeout: any = null;
  userId: number;
  updatebtn:boolean = false;
  errorMsg:string;



  selectedItem: number;
  registerUser = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    userName: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    mailId: new FormControl('', [Validators.required, Validators.email, Validators.pattern("[^ @]*@[^ @]*"), this.emailDomainValidator]),
    mobileNumber: new FormControl('', [Validators.required, Validators.maxLength(10), Validators.pattern('[6-9]\\d{9}')]),
    userRoleId: new FormControl('', [Validators.required]),
    branchId: new FormControl('', [Validators.required]),
    reportingTo: new FormControl('', [Validators.required]),
    reportingToInp: new FormControl(''),
  });

  @ViewChildren("reportingTo") reportingToList: QueryList<ElementRef>;
  constructor(private qdeHttp: QdeHttpService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private renderer: Renderer2
  ) {
    this.filteredItems = this.items;
    this.selectedItem = 0;

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

    this.qdeHttp.adminGetUserLov({}).subscribe((response) => {
      var lov = JSON.parse(response['ProcessVariables'].lovs);
      console.log("Lov", lov);
      this.userRoles = lov.LOVS.user_role;
      this.branch = lov.LOVS.branch;
    });

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
            branchId: response['ProcessVariables']['branchId'] || "",
            userRoleId: parseInt(response['ProcessVariables']['roleId']) || "",
            reportingToInp: response['ProcessVariables']['reportingTo'] || ""
          });
        });
      }
    });

  }

  ngOnInit() {
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


      console.log('data', this.formValue.reportingToInp.value);
      console.log('data', this.formValue.reportingTo.value);

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
        "roleId": parseInt(this.changeUserRole),
        "branchId": parseInt(this.changeBranch),
        "reportingTo": parseInt(this.formValue.reportingToInp.value),
        "userId": parseInt(localStorage.getItem("userId"))
      }
      console.log(data);

      this.qdeHttp.addAdminUsers(data).subscribe((response) => {
        console.log(response);

        if (response["Error"] === "0" &&
          response["ProcessVariables"]["status"]) {
          //alert("Uploaded Successfully!");
          this.registerUser.reset();
          this.router.navigate(['admin/user-module']);
        } else {
          if (response["ErrorMessage"]) {
            console.log("Response: " + response["ErrorMessage"]);
            this.errorMsg = response["ErrorMessage"];
          } else if (response["ProcessVariables"]["errorMessage"]) {
            console.log(
              "Response: " + response["ProcessVariables"]["errorMessage"]
            );
            this.errorMsg = response["ProcessVariables"]["errorMessage"];
          }
        }
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
  get changeUserRole() {
    console.log("change value", this.registerUser.get('userRoleId').value.value);
    return this.registerUser.get('userRoleId').value.value;
  }

  get changeBranch() {
    console.log("change branchId value", this.registerUser.get('branchId').value.value);
    return this.registerUser.get('branchId').value.value;
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

    // this.renderer.removeClass(this.reportingRef.nativeElement, 'active');
    console.log("reportingToList",this.reportingToList);
    this.reportingToList.forEach(v => {
      this.renderer.removeClass(v.nativeElement, "active");
    })
    this.renderer.addClass(this.reportingToList["_results"][index+1].nativeElement, 'active');
  }

  filterLeads(event) {
    this._timeout = null;
    if (this._timeout) { //if there is already a timeout in process cancel it
      window.clearTimeout(this._timeout);
    }
    this._timeout = window.setTimeout(() => {

      console.log(event.target.value.toLowerCase());
      let input = { "userName": event.target.value.toLowerCase() };
      this.qdeHttp.adminReportingTo(input).subscribe((response) => {
        console.log("Reporting", response);
        let usersList = response['ProcessVariables'].userList;
        this.filteredItems = usersList;
      });

    }, 1000);

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
      "branchId":  parseInt(this.formValue.branchId.value),
      "reportingTo": parseInt(this.formValue.reportingToInp.value)

    }
    console.log(data);

    this.qdeHttp.updateAdminUsers(data).subscribe((response) => {
      console.log(response);

        if (response["Error"] === "0" &&
          response["ProcessVariables"]["status"]) {
          //alert("Uploaded Successfully!");
          this.registerUser.reset();
          this.router.navigate(['admin/user-module']);
        } else {
          if (response["ErrorMessage"]) {
            console.log("Response: " + response["ErrorMessage"]);
            this.errorMsg = response["ErrorMessage"];
          } else if (response["ProcessVariables"]["errorMessage"]) {
            console.log(
              "Response: " + response["ProcessVariables"]["errorMessage"]
            );
            this.errorMsg = response["ProcessVariables"]["errorMessage"];
          }
        }
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


}
