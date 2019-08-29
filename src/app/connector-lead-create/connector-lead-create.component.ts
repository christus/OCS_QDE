import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QdeHttpService } from '../services/qde-http.service';
import { CommonDataService } from '../services/common-data.service';
import { QdeService } from '../services/qde.service';
import { NgForm } from '@angular/forms';
import Qde from '../models/qde.model';
import { UtilService } from '../services/util.service';
import { environment } from 'src/environments/environment';

interface Item {
  key: string,
  value: string
}
@Component({
  selector: 'app-connector-lead-create',
  templateUrl: './connector-lead-create.component.html',
  styleUrls: ['./connector-lead-create.component.css']
})
export class ConnectorLeadCreateComponent implements OnInit {

  isOptionsMenuDropOpen: boolean = false;
  loanType: Array<Item>;
  selectedLoanType: Item;
  qde: Qde;
  version: string;
  buildDate: string;
  isSuccessfulRouteModal: boolean;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private qdeHttp: QdeHttpService,
    private commonDataService: CommonDataService,
    private qdeService: QdeService,
    private ren: Renderer2,
    private utilService: UtilService) { 
      
    this.qde = this.qdeService.defaultValue;
    this.commonDataService.changeMenuBarShown(false);
    this.commonDataService.changeViewFormVisible(false);
    this.commonDataService.changeLogoutVisible(true);
  }

  ngOnInit() {
    if(this.route.snapshot.data.listOfValues) {
      const lov = JSON.parse(this.route.snapshot.data.listOfValues['ProcessVariables'].lovs);
      this.loanType = lov.LOVS.loan_type;
      this.selectedLoanType = this.loanType[0];
      console.log(this.selectedLoanType);
    }

    this.version = environment.version;
    this.buildDate = environment.buildDate;
  }

  openOptionsMenuDropdown(a: ElementRef) {
    this.isOptionsMenuDropOpen = true;
    // a.nativeElement.focus();
  }

  closeOptionsMenuDropdown(optionsMenuDropdownContent: ElementRef) {
    // this.isOptionsMenuDropOpen = false;
  }

  leadSaveConnector(form: NgForm){
    console.log(this.qde.application.leadCreate);
    this.qde.application.leadCreate.loanAmount = parseInt(this.qde.application.leadCreate.loanAmount+"");
    this.qde.application.leadCreate.mobileNumber = parseInt(this.qde.application.leadCreate.mobileNumber+"");
    this.qde.application.leadCreate.zipcode = parseInt(this.qde.application.leadCreate.zipcode+"");

    let data = Object.assign({}, this.qde.application.leadCreate);
    data['loanType'] = parseInt(this.selectedLoanType.value+"");
    data['userId'] = parseInt(localStorage.getItem('userId'));

    this.qdeHttp.connectorLeadCreateSave(data).subscribe(res => {
      if(res['ProcessVariables']['status'] == true) {
        this.isSuccessfulRouteModal = true;
      }
    });
  }

  logout() {
    this.utilService.clearCredentials();

    // this.utilService.logout().subscribe(
    //   res => {
    //     this.utilService.clearCredentials();
    //   },
    //   error => {
    //     this.utilService.clearCredentials();
    //   }
    // );
  }

  onCrossModal() {
    this.isSuccessfulRouteModal = false;
  }
}