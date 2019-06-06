import { Component, OnInit } from '@angular/core';
import { CommonDataService } from '../services/common-data.service';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit {

 
  constructor(private commonDataService: CommonDataService) {
    this.commonDataService.changeMenuBarShown(true);
    this.commonDataService.changeViewFormNameVisible(true);
    this.commonDataService.changeViewFormVisible(true);
    this.commonDataService.changeLogoutVisible(true);
  }
  
  ngOnInit() {
  }

}
