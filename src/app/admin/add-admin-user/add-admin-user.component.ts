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

  reportingToInp: any;
  defaultSelectBranch:string ="null";
  defaultSelectRole:string="null";
  ngAfterViewInit(): void {
    console.log("After view init");
  }

  @ViewChild('reportingTo') reportingRef: ElementRef;

  @ViewChild('selectBox') selectBoxRef: ElementRef;

  @ViewChild('uploadCSV') uploadCSV:ElementRef;
  userRoles: Array<any>;
  branches: Array<any>;
  formdata;
  reportingTo: string;
  reportingToStr: string;

  // registerUser: FormGroup;
  filteredItems: Array<string>;
  _timeout: any = null;
  userId: number;
  updatebtn:boolean = false;
  errorMsg:string;
  uploadCSVString: string;
  selectedFile: File;
  isFileSelected: boolean = false;
  isErrorModal:boolean = false;
  CSVerrorMessage: string;
  regexPattern = {
    mobileNumber: "^[1-9][0-9]*$",
    name: "^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$",
  }




  selectedItem: number;
  registerUser = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    userName: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    mailId: new FormControl('', [Validators.required, Validators.email, Validators.pattern("[^ @]*@[^ @]*"), this.emailDomainValidator]),
    mobileNumber: new FormControl('', [Validators.required, Validators.maxLength(10), Validators.pattern('[6-9]\\d{9}')]),
    userRoleId: new FormControl('', [Validators.required]),
    userBranchId: new FormControl('', [Validators.required]),
    reportingTo: new FormControl('', [Validators.required]),
    reportingToInp: new FormControl(''),
  });

  firstName:string;
  lastName:string;
  userName:string;
  password:string;
  mailId:string;
  mobileNumber:string;OnInit
  userRoleId:string;
  branchId:string;

  @ViewChildren("reportingTo") reportingToList: QueryList<ElementRef>;
  constructor(private qdeHttp: QdeHttpService,
    private formBuilder: FormBuilder,
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

    this.qdeHttp.adminGetUserLov({}).subscribe((response) => {
      var lov = JSON.parse(response['ProcessVariables'].lovs);
      this.userRoles = lov.LOVS.user_role;
      this.branches = lov.LOVS.branch;
      // this.selectedRoleType = this.userRoles[0].key;

      console.log("this.userRoles", this.userRoles);
      console.log("this.branch", this.branches);
      // console.log("Selected role",this.selectedRoleType)
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
            userBranchId: response['ProcessVariables']['branchId'] || "",
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
        "roleId": parseInt(this.changeUserRole()),
        "branchId": parseInt(this.changeBranch()),
        "reportingTo": parseInt(this.formValue.reportingToInp.value),
        "userId": parseInt(localStorage.getItem("userId"))
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
      "branchId":  parseInt(this.formValue.userBranchId.value),
      "reportingTo": parseInt(this.formValue.reportingToInp.value)

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
  startUpload(event){
    this.selectedFile = event.target.files[0];
    if(this.selectedFile.size!=0){
      this.isFileSelected = true;
    }else{
      alert("No File selected");
      this.isFileSelected=false;
    }
    this.getBase64(this.selectedFile);
  }
  getBase64(inputValue: any) {
    var file:File = inputValue
    var myReader:FileReader = new FileReader();
    myReader.onloadend = (e) => {
      this.uploadCSVString = myReader.result.substr(myReader.result.indexOf(',') + 1);;
      console.log("result base64", this.uploadCSVString);
    }
    myReader.readAsDataURL(file);
  }
  uploadCSVFile(){
    let name = this.selectedFile.name;
    let size = this.selectedFile.size;
    if(size!=0){
      let documentInfo = {
        userId: localStorage.getItem("userId"),
        "attachment": {
          "name": name,
          "operation": "upload",
          "content": this.uploadCSVString,
          "mime": "text/csv",
          "size": size
        }
      }
      this.qdeHttp.uploadCSV(documentInfo).subscribe(res=>{
        if(res['ProcessVariables']['status'] && res['ProcessVariables']['errorMessage']==''){
          this.isErrorModal = true;
          this.errorMsg = "File Uploaded successfully";
          this.isFileSelected = false;
          let el = this.uploadCSV.nativeElement;
          el.value = "";
        }else{
          this.isErrorModal = true;
          this.errorMsg = res['ProcessVariables']['errorMessage'];
          this.isFileSelected = false;
          let el = this.uploadCSV.nativeElement;
          el.value = "";
        }
      })
    }
  }
  callFile(){
    let el = this.uploadCSV.nativeElement;
    el.click();  
  }
}
