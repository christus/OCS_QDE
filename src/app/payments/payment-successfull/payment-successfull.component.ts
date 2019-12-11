import { Component, OnInit } from '@angular/core';
import { CommonDataService } from 'src/app/services/common-data.service';

@Component({
  selector: 'app-payment-successfull',
  templateUrl: './payment-successfull.component.html',
  styleUrls: ['./payment-successfull.component.css']
})
export class PaymentSuccessfullComponent implements OnInit {

  constructor(private commonDataService: CommonDataService) { 
    this.commonDataService.changeViewFormNameVisible(true);
  }

  ngOnInit() {
  }

}
