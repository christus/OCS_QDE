import { Component, OnInit } from '@angular/core';
import { QdeHttpService } from 'src/app/services/qde-http.service';
import { ActivatedRoute, Router } from '@angular/router';

import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
import { UtilService } from '../../services/util.service';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-set-mpin',
  templateUrl: './set-mpin.component.html',
  styleUrls: ['./set-mpin.component.css']
})
export class SetMpinComponent implements OnInit {

  userName = "";
  uuID:string;
  errorMsg:string;
  loginError:boolean;

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
      var empId = this.userName.trim() + environment.mobileExtenstion;

      var data = {
        empId : empId,
        uuid: this.uuID
      };
      this.qdeService.resetMpin(data).subscribe(
        res => {
          if (res["ProcessVariables"]["status"]) {
            console.log("move to confirm pin");
            this.router.navigate(["/ConfirmPin", {"EmpId": empId} ]);
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

}
