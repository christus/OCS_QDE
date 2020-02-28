import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonDataService } from 'src/app/services/common-data.service';

@Component({
  selector: 'app-addtional-service-dashboard',
  templateUrl: './addtional-service-dashboard.component.html',
  styleUrls: ['./addtional-service-dashboard.component.css']
})
export class AddtionalServiceDashboardComponent implements OnInit {
  applicationId;
  constructor(private activatedRoute: ActivatedRoute,
              private cds: CommonDataService) { 
    // this.applicationId = this.activatedRoute.params["applicationId"];
    if (this.activatedRoute.params["applicationId"]){
      this.cds.changeshowPrint(true);
    }
      else{
        this.cds.changeshowPrint(false);
      }
    

  }

  ngOnInit() {
  }

}
