import { ActivatedRoute } from '@angular/router';
import { QdeHttpService } from 'src/app/services/qde-http.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';




@Component({
  selector: 'app-add-admin-user',
  templateUrl: './add-admin-user.component.html',
  styleUrls: ['./add-admin-user.component.css']
})
export class AddAdminUserComponent implements OnInit, AfterViewInit {

  ngAfterViewInit(): void {
    console.log("After view init");
  }

  userRoles: Array<any>;
  branch: Array<any>;
  formdata;
  reportingTo: string;
  // registerUser: FormGroup;
  filteredItems: Array<string>;
  _timeout: any = null;
  userId: number;
  updatebtn:boolean = false;



  selectedItem: number;
  registerUser = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    userName: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    mailId: new FormControl('', [Validators.required, Validators.email]),
    mobileNumber: new FormControl('', [Validators.required, Validators.maxLength(10), Validators.pattern('[6-9]\\d{9}')]),
    userRoleId: new FormControl('', [Validators.required]),
    branchName: new FormControl('', [Validators.required]),
    reportingTo: new FormControl('', [Validators.required]),
    reportingToInp: new FormControl('', [Validators.required]),
  });

  constructor(private qdeHttp: QdeHttpService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute) {
    this.filteredItems = this.items;
    this.selectedItem = 0;

    this.qdeHttp.adminGetUserLov({}).subscribe((response) => {
      var lov = JSON.parse(response['ProcessVariables'].lovs);
      console.log("Lov", lov);
      this.userRoles = lov.LOVS.users;
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

          this.registerUser = this.formBuilder.group({
            firstName: response['ProcessVariables']['firstName'],
            lastName: response['ProcessVariables']['lastName'],
            userName: [{ value:response['ProcessVariables']['userName'], disabled: true }],
            password: [{ value: response['ProcessVariables']['password'], disabled: true }],
            mailId: response['ProcessVariables']['emailId'],
            mobileNumber: response['ProcessVariables']['mobileNumber'],
            reportingTo: response['ProcessVariables']['reportingToUser'],
            // branchName: [{"key":"Ajmer","value":"94"}],
            branchName: response['ProcessVariables']['branchId'],
            userRoleId: response['ProcessVariables']['roleId'],
            reportingToInp: response['ProcessVariables']['reportingTo']
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
      "userName": this.formValue.userName.value + "@iciciltd.com",
      "firstName": this.formValue.firstName.value,
      "lastName": this.formValue.lastName.value,
      "password": this.formValue.password.value,
      "mobileNumber": this.formValue.mobileNumber.value,
      "mailId": this.formValue.mailId.value,
      "roleId": parseInt(this.formValue.userRoleId.value["value"]),
      "branchId": parseInt(this.formValue.branchName.value["value"]),
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
      } else {
        if (response["ErrorMessage"]) {
          console.log("Response: " + response["ErrorMessage"]);
        } else if (response["ProcessVariables"]["errorMessage"]) {
          console.log(
            "Response: " + response["ProcessVariables"]["errorMessage"]
          );
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

  selectedReportedTo(el, data) {
    console.log("clicked", data.userName);
    this.registerUser.patchValue({ reportingTo: data.userName });
    this.registerUser.patchValue({ reportingToInp: data.userId });

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
      "roleId": parseInt(this.formValue.userRoleId.value) || parseInt(this.formValue.userRoleId.value["value"]),
      "branchId":  parseInt(this.formValue.branchName.value) || parseInt(this.formValue.branchName.value["value"]),
      "reportingTo": parseInt(this.formValue.reportingToInp.value)

    }
    console.log(data);

    this.qdeHttp.updateAdminUsers(data).subscribe((response) => {
      console.log(response);
      //this.registerUser.reset();
      if (response["Error"] == "1") {
        alert(response["ErrorMessage"]);
      }
    });
  }

}
