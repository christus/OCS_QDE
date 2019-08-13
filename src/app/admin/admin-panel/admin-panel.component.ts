import { UtilService } from 'src/app/services/util.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {

  constructor(private utilService: UtilService) { }

  ngOnInit() {
  }
  logout() {
    this.utilService.clearCredentials();
  }

}
