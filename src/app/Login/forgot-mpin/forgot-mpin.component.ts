import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { QdeHttpService } from 'src/app/services/qde-http.service';

import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';


@Component({
  selector: 'app-forgot-mpin',
  templateUrl: './forgot-mpin.component.html',
  styleUrls: ['./forgot-mpin.component.css']
})
export class ForgotMPINComponent implements OnInit {

  userName = "";
  uuID:string;


  constructor(private router: Router,
    private qdeService: QdeHttpService, private uniqueDeviceID: UniqueDeviceID ) { }

  ngOnInit() {
  }

  setMpin() {

    this.uuID = "";

    this.uniqueDeviceID.get()
    .then((uuid: any) =>
      this.uuID = uuid
    ).catch((error: any) => console.log(error));   


    console.log("UserName", this.userName);

    var empId = this.userName + "@icici.com";

    var data = {
      empId : empId,
      uuid: this.uuID
    };

    this.qdeService.resetMpin(data).subscribe(
      res => {
        console.log("move to confirm pin");
        this.router.navigate(["/ConfirmPin", {"EmpId": empId} ]);
      },
      error => {
        console.log(error);
      }
    );
  }


}
