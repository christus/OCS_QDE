import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { QdeHttpService } from 'src/app/services/qde-http.service';
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
import { environment } from '../../../environments/environment';



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

  values = '';

  @ViewChild('mPin') input:ElementRef; 


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
      userName: this.empId,
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


  onKeyUp(event, maxlength) {
    this.values = event.target.value;
    console.log(this.values);

    let element;
    
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

  resendPin(){

    this.uuID = "";

    this.uniqueDeviceID.get()
    .then((uuid: any) =>
      this.uuID = uuid
    ).catch((error: any) => console.log(error));   


    var empId = this.empId;

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
