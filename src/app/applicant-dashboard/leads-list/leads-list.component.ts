import { Component, OnInit } from '@angular/core';
import { QdeHttpService } from 'src/app/services/qde-http.service';
import { UtilService } from 'src/app/services/util.service';

export interface UserDetails {
  "amountEligible": number,
  "amountRequired": number,
  "firstName": string,
  "ocsNumber": number
}

@Component({
  selector: 'app-leads-list',
  templateUrl: './leads-list.component.html',
  styleUrls: ['./leads-list.component.css']
})

export class LeadsListComponent implements OnInit {

  userDetails: Array<UserDetails>;

  constructor(private service: QdeHttpService, private utilService: UtilService) {
    service.roleLogin().subscribe(
      res => {
        console.log(res);
        localStorage.setItem("userId", res["ProcessVariables"]["userId"])

        service.getLeads().subscribe(
          res => {
            console.log(res);
    
            if (res['Error'] && res['Error'] == 0) {
              this.userDetails = res['ProcessVariables'].userDetails || [];
            } else if (res['login_required'] && res['login_required'] === true) {
              utilService.clearCredentials();
              alert(res['message']);
            } else {
              alert(res['ErrorMessage']);
            }
          },
          error => {
            console.log(error);
          }
        );

        
      },
      error => {
        console.log(error);
      }
    )
  }

  isloggedIn() {
    return this.utilService.isLoggedIn();
  }

  clearCredentials() {
    return this.utilService.clearCredentials();
  }

  ngOnInit() {}
}
