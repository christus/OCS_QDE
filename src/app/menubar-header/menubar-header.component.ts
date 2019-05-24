import { Component, OnInit, Input } from '@angular/core';
import { CommonDataService } from '../services/common-data.service';

@Component({
  selector: 'app-menubar-header',
  templateUrl: './menubar-header.component.html',
  styleUrls: ['./menubar-header.component.css']
})
export class MenubarHeaderComponent implements OnInit {
  
  isMenuBarShown: boolean;

  constructor(private commonDataService: CommonDataService) {
    this.commonDataService.isMenuBarShown.subscribe((value) => {
      this.isMenuBarShown = value;
    });
  }

  ngOnInit() {
  }

}
