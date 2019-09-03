import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { QdeHttpService } from 'src/app/services/qde-http.service';
import { CommonDataService } from 'src/app/services/common-data.service';

@Component({
  selector: 'app-icici-terms',
  templateUrl: './icici-terms.component.html',
  styleUrls: ['./icici-terms.component.css']
})
export class IciciTermsComponent implements OnInit {

  applicationId: string;
  applicantId: string;

  constructor(private route: ActivatedRoute, private router: Router, private qdeHttpService: QdeHttpService, private commonDataService: CommonDataService) {
    const data = {
      email: 'icici@icicibankltd.com',
      password: 'icici@123'
    };

    this.route.params.subscribe(val => {
      if(val['applicationId'] != null) {
        this.applicationId = val['applicationId'];
      }

      if(val['applicantId'] != null) {
        this.applicantId = val['applicantId'];
      }
    });

    if(this.router.url.search('auto-login') != 0) {
      this.qdeHttpService.authenticate(data).subscribe(
        res => {
          console.log("response");
          console.log("login-response: ",res);
          this.commonDataService.setLogindata(data);
          localStorage.setItem("token", res["token"] ? res["token"] : "");
          if(this.applicationId != null && this.applicantId != null) {
            this.router.navigate(['/terms-and-conditions/proceed-to-review', this.applicationId, this.applicantId]);
          }
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  ngOnInit() {
  }

}
