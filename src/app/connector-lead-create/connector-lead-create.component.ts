import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QdeHttpService } from '../services/qde-http.service';
import { CommonDataService } from '../services/common-data.service';
import { QdeService } from '../services/qde.service';

@Component({
  selector: 'app-connector-lead-create',
  templateUrl: './connector-lead-create.component.html',
  styleUrls: ['./connector-lead-create.component.css']
})
export class ConnectorLeadCreateComponent implements OnInit {

  isOptionsMenuDropOpen: boolean = false;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private qdeHttp: QdeHttpService,
    private commonDataService: CommonDataService,
    private qdeService: QdeService,
    private ren: Renderer2) { 
      
    this.commonDataService.changeMenuBarShown(false);
    this.commonDataService.changeViewFormVisible(false);
    this.commonDataService.changeLogoutVisible(true)
  }

  ngOnInit() {
  }

  openOptionsMenuDropdown(a: ElementRef) {
    this.isOptionsMenuDropOpen = true;
    // a.nativeElement.focus();
  }

  closeOptionsMenuDropdown(optionsMenuDropdownContent: ElementRef) {
    // this.isOptionsMenuDropOpen = false;
  }
}
