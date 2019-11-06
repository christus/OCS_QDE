import { ActivatedRoute, Router } from '@angular/router';
import { QdeHttpService } from 'src/app/services/qde-http.service';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';


@Component({
  selector: 'app-pmay-add-details',
  templateUrl: './pmay-add-details.component.html',
  styleUrls: ['./pmay-add-details.component.css']
})
export class PmayAddDetailsComponent implements OnInit {

  userId: number;
  errorMsg:string;
  updatebtn:boolean = false;
  isErrorModal:boolean = false;


   
  registerUser = new FormGroup({
    stateCode: new FormControl(''),
    distCode: new FormControl(''),
    stateName: new FormControl(''),
    distName: new FormControl(''),
    townName: new FormControl(''),
    townCode: new FormControl(''),
    subDistCode: new FormControl('')
  });
  stateCode: string;
  distCode: string;
  stateName: string;
  distName: string;
  townName: string;
  townCode: string;
  subDistCode: string;


  constructor(private qdeHttp: QdeHttpService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private renderer: Renderer2) { 


      this.route.params.subscribe(val => {
        if (val['userId'] != null) {
          this.userId = parseInt(val['userId']);
          console.log("userId", this.userId);
          let data = { "id": this.userId };
         

          this.qdeHttp.getPmayRecord(data).subscribe((response) => {
            let pmayList = response['ProcessVariables']['pmayList'][0];
            this.registerUser.setValue({
              stateCode: pmayList['stateCode'] || "",
              distCode: pmayList['distCode'] || "",
              stateName:  pmayList['stateName'] || "",
              distName: pmayList['distName'] || "",
              townName: pmayList['townName'] || "",
              townCode: pmayList['townCode'] || "",
              subDistCode: pmayList['subDistCode'] || "",
            });
          });

        }

      });

      this.registerUser.valueChanges.subscribe(val=>{
        this.stateCode = val['stateCode'];
        this.distCode = val['distCode'];
        this.stateName =  val['stateName'];
        this.distName = val['distName'];
        this.townName = val['townName'];
        this.townCode = val['townCode'];
        this.subDistCode = val['subDistCode'];
      });

    }


    get formValue() {
      return this.registerUser.controls
    }
  
    onSubmit() {

  
        let data = {
          "stateCode": this.formValue.stateCode.value,
          "stateName": this.formValue.stateName.value,
          "distCode": this.formValue.distCode.value,
          "distName": this.formValue.distName.value,
          "townCode": this.formValue.townCode.value,
          "townName": this.formValue.townName.value,
          "subDistCode": this.formValue.subDistCode.value,
          "userId": parseInt(localStorage.getItem("userId"))
        }
        console.log(data);
  
        this.qdeHttp.addPmayList(data).subscribe((response) => {
          console.log(response);
  
          if (response["Error"] === "0" &&
            response["ProcessVariables"]["status"]) {
              this.isErrorModal = true;
              this.errorMsg = "Added succesfully";
            //alert("Uploaded Successfully!");
            this.registerUser.reset();
            this.router.navigate(['admin/lovs/pmay_list']);
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
              this.isErrorModal = true;
              this.errorMsg = "Updated successfully";
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



 


  ngOnInit() {
  }
  

}