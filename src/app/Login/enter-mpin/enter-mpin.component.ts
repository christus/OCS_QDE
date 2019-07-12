import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { QdeHttpService } from 'src/app/services/qde-http.service';
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';



@Component({
  selector: 'app-enter-mpin',
  templateUrl: './enter-mpin.component.html',
  styleUrls: ['./enter-mpin.component.css']
})
export class EnterMPINComponent implements OnInit {

  uuID:string;

  mPin = "";
  mPin1 = "";
  mPin2 = "";
  mPin3 = "";
  mPin4 = "";

  empId:string;

  constructor(private router: Router, private route: ActivatedRoute,
    private qdeService: QdeHttpService,  private uniqueDeviceID: UniqueDeviceID ) { 

    this.empId = this.route.snapshot.paramMap.get('EmpId');
  }

  ngOnInit() {
  }

  confirmPin() {

    this.mPin = this.mPin1+this.mPin2+this.mPin3+this.mPin4
    console.log( "Password", this.mPin );

    var mPIN = this.mPin;

    var data = {
      userName: this.empId + "@icici.com",
      mPin: this.mPin
    }

    this.qdeService.loginMpin(data).subscribe(
      res => {
        console.log("move to confirm pin");
        this.router.navigate(["/loginWithPin"]);
      },
      error => {
        console.log(error);
      }
    );

  }


  resendPin(){

    this.uuID = "";

    this.uniqueDeviceID.get()
    .then((uuid: any) =>
      this.uuID = uuid
    ).catch((error: any) => console.log(error));   


    var empId = this.empId + "@icici.com";

    var data = {
      empId : empId,
      uuid: this.uuID
    };

    this.qdeService.resetMpin(data).subscribe(
      res => {
        alert("mPIN successfully resent");
      },
      error => {
        console.log(error);
      }
    );

  }

}
