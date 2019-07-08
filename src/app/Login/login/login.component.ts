import { Component, OnInit } from '@angular/core';
import { QdeHttpService } from 'src/app/services/qde-http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilService } from 'src/app/services/util.service';

import {CommonDataService} from 'src/app/services/common-data.service'

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  userName = "";
  password = "";

  constructor(
    private router: Router,
    private qdeService: QdeHttpService,
    private utilService: UtilService,
    private commonDataService: CommonDataService
  ) {
    
  }

  ngOnInit() {}

  login() {
    const data = {
      email: this.userName.trim() + "@icici.com",
      password: this.password.trim()
    };
    this.qdeService.authenticate(data).subscribe(
      res => {
        console.log(res);
        this.commonDataService.setLogindata(data);
        localStorage.setItem("token", res["token"] ? res["token"] : "");
        this.roleLogin();
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
