import { environment } from './../../../environments/environment.prod';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { QdeHttpService } from 'src/app/services/qde-http.service';
import { CommonDataService } from '../../services/common-data.service';
import { errors } from '../../services/errors';


@Component({
  selector: 'app-login-with-mpin',
  templateUrl: './login-with-mpin.component.html',
  styleUrls: ['./login-with-mpin.component.css']
})
export class LoginWithMPINComponent implements OnInit {

  userName = "";
  password = "";

  values = '';

  mPin = "";
  mPin1 = "";
  mPin2 = "";
  mPin3 = "";
  mPin4 = "";

  loginError = false;

  errorMsg = "";
  

  @ViewChild('mPin') input:ElementRef; 


  constructor(private router: Router,
    private qdeService: QdeHttpService,
    private commonDataService: CommonDataService) {

      console.log("loginwithmpin");
  }
     

  ngOnInit() {
  }

  forgotPin() {
    this.router.navigate(["/forgotPin"]);
  }


  onKeyUp(event, maxlength) {
    this.values = event.target.value;
    console.log(this.values);

    let element;

    console.log(event.keyCode);
    
    if(event.code == "Backspace" || event.keyCode == 8){
      element = event.srcElement.previousElementSibling; // get the sibling element
    }else {
      element = event.srcElement.nextElementSibling; // get the sibling element
    }

    if (this.values.length <= maxlength) {
      if (this.input)
        element.focus();
      else
        element.blur();
    }
  }

  login() {
  }


  roleLogin() {
    this.qdeService.roleLogin().subscribe(
      res => {
        if (res["ProcessVariables"]["status"]) {
          console.log("ROLE Name: ", res);

          
          let roleName = JSON.stringify(res["ProcessVariables"]["roleName"]);
          // localStorage.setItem("userId", res["ProcessVariables"]["userId"]);
          // localStorage.setItem('roles', roleName);

          if(roleName.includes("Admin")) {
            this.router.navigate(["/admin/lovs"]);
            //this.router.navigate(["/user-module"]);
            return;
          }

          //this.router.navigate(["/leads"]);
        }else if(res['ProcessVariables']['errorMessage']){
          this.errorMsg = (res['ProcessVariables']['errorMessage']);
          this.loginError = true;
        }
      },
      error => {
        console.log(error);
      }
    );
  }


}
