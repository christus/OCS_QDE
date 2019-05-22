import { Component, OnInit } from '@angular/core';
import { QdeHttpService } from 'src/app/services/qde-http.service';

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

  constructor(private service: QdeHttpService) {
    service.getLeads().subscribe(
      res => {
        console.log(res);

        if (res['ErrorCode'] == 0) {
          this.userDetails = res['ProcessVariables'].userDetails || [];
        } else {
          alert(res['ErrorMessage']);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  ngOnInit() {}
}
