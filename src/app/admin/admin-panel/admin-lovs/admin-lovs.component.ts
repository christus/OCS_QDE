import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'admin-lovs',
  templateUrl: './admin-lovs.component.html',
  styleUrls: ['./admin-lovs.component.css']
})
export class AdminLovsComponent implements OnInit, AfterViewInit {

  adminLovs: Array<any>;
  filteredLovs: Array<any>;
  isErrorModal: boolean = false;
  errorMsg: string;

  @ViewChild('searchInp') searchInp: ElementRef;

  constructor(private route: ActivatedRoute) {
    if(this.route.snapshot.data['adminLovs']) {
      this.adminLovs = this.route.snapshot.data['adminLovs']['ProcessVariables']['mastersList'];
      this.adminLovs.push({description: 'CLSS Checklist', value: 'clss_checklist'});
      this.adminLovs.push({description: 'PMAY list', value: 'pmay_list'});
      this.adminLovs.push({description: 'Branch list', value: 'branch_list'});
      this.adminLovs.push({description: 'Loan Type Purpose Mapping', value: 'loan_type_purpose_map'});
      this.adminLovs.push({description: 'Document Profile', value: 'document_profile'});
      this.adminLovs.push({description: 'Loan Master', value: 'loan_master'});
      this.adminLovs.push({description: 'Login Fee', value: 'login_fee'});
      this.adminLovs.push({description: 'Applicant Relationship Mapping', value: 'applicant_relationship_mapping'});

      this.filteredLovs = this.adminLovs;
    } else {
      this.isErrorModal = true;
      this.errorMsg = "Could not Load Data";
      //alert('Could not Load Data.');
    }
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.searchInp.nativeElement.focus();
  }

  search(event) {
    if(event.target.value != '') {
      this.filteredLovs = this.adminLovs.filter(v => {
        if(v.description.toLowerCase().trim().startsWith(event.target.value.toLowerCase().trim())) {
          return true;
        } else {
          return false;
        }
      });
    } else {
      this.filteredLovs = this.adminLovs;
    }
  }
}
