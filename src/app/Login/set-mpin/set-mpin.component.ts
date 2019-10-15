import { Component, OnInit } from '@angular/core';
import { QdeHttpService } from 'src/app/services/qde-http.service';
import { ActivatedRoute, Router } from '@angular/router';

import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
import { UtilService } from '../../services/util.service';


@Component({
  selector: 'app-set-mpin',
  templateUrl: './set-mpin.component.html',
  styleUrls: ['./set-mpin.component.css']
})
export class SetMpinComponent implements OnInit {

  userName = "";
  uuID:string;

  constructor(private router: Router, private qdeService: QdeHttpService, private uniqueDeviceID: UniqueDeviceID,
    private utilService: UtilService ) { 
      this.utilService.clearCredentials();
  }

  ngOnInit() {
  }

  setMpin() {

    this.uuID = "";

    this.uniqueDeviceID.get()
    .then((uuid: any) =>
      this.uuID = uuid
    ).catch((error: any) => console.log(error));   
    
    
   // this.router.navigate(["/ConfirmPin", {"EmpId": this.userName}]);


    console.log("UserName", this.userName);

    if(this.userName) {
      var empId = this.userName.trim() + "@icicibankltd.com";

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

}
