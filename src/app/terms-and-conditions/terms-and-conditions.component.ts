import { Component, OnInit } from '@angular/core';
import { CommonDataService } from '../services/common-data.service';

@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.css']
})
export class TermsAndConditionsComponent implements OnInit {

  constructor(private commonDataService: CommonDataService) {
    this.commonDataService.changeMenuBarShown(false);
    this.commonDataService.changeViewFormVisible(false);
    this.commonDataService.changeLogoutVisible(false);
    this.commonDataService.changeHomeVisible(false);
    this.commonDataService.changeViewFormNameVisible(false);
  }

  ngOnInit() {
  }

}
