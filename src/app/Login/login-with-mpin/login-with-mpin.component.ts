import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { QdeHttpService } from 'src/app/services/qde-http.service';


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

  @ViewChild('mPin') input:ElementRef; 


  constructor(private router: Router,
    private qdeService: QdeHttpService) { }

  ngOnInit() {
  }

  forgotPin() {
    this.router.navigate(["/forgotPin"]);
  }


  onKeyUp(event, maxlength) {
    this.values = event.target.value;
    console.log(this.values);

    let element = event.srcElement.nextElementSibling; // get the sibling element


    if (this.values.length <= maxlength) {
      if (this.input)
        element.focus();
      else
        element.blur();
    }
  }

  login() {
    this.mPin = this.mPin1+this.mPin2+this.mPin3+this.mPin4
    console.log("UserName", this.userName +" "+ "Password", this.mPin );

    var data = {
      userName: this.userName + "@icici.com",
      mPin: this.mPin
    }

    this.qdeService.loginMpin(data).subscribe(
      res => {
        console.log("ROLE LOGIN: ", res['ProcessVariables']['roleName']);
        localStorage.setItem("userId", res["ProcessVariables"]["userId"]);
        localStorage.setItem('roles', JSON.stringify(res["ProcessVariables"]["roleName"]));
        // this.roleLogin();
        localStorage.setItem("firstTime", "true");
        
        this.router.navigate(["/leads"]);
      },
      error => {
        console.log(error);
      }
    );

  }


  roleLogin() {
    this.qdeService.roleLogin().subscribe(
      res => {
        console.log("ROLE LOGIN: ", res['ProcessVariables']['roleName']);
        localStorage.setItem("userId", res["ProcessVariables"]["userId"]);
        localStorage.setItem('roles', JSON.stringify(res["ProcessVariables"]["roleName"]));
        this.router.navigate(["/leads"]);
      },
      error => {
        console.log(error);
      }
    );
  }


}
