import { Component, OnInit } from '@angular/core';
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

  mPin = "";
  mPin1 = "";
  mPin2 = "";
  mPin3 = "";
  mPin4 = "";



  constructor(private router: Router,
    private qdeService: QdeHttpService) { }

  ngOnInit() {
  }

  forgotPin() {
    this.router.navigate(["/forgotPin"]);
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
