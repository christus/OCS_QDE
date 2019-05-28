import { Component, OnInit } from '@angular/core';
import { QdeHttpService } from 'src/app/services/qde-http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilService } from 'src/app/services/util.service';

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
    private utilService: UtilService
  ) {
    
  }

  ngOnInit() {}

  login() {
    const data = {
      email: this.userName,
      password: this.password
    };
    this.qdeService.authenticate(data).subscribe(
      res => {
        console.log(res);
        localStorage.setItem("token", res["token"] ? res["token"] : "");
        this.router.navigate(["/leads"]);
      },
      error => {
        console.log(error);
      }
    );
  }
}
