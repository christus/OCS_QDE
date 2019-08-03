import { Component, OnInit } from '@angular/core';
import { QdeHttpService } from 'src/app/services/qde-http.service';
import { UtilService } from 'src/app/services/util.service';
import { from } from 'rxjs';
import { CommonDataService } from 'src/app/services/common-data.service';
import { statuses } from '../../app.constants';

export interface UserDetails {
  "amountEligible": number;
  "amountRequired": number;
  "firstName": string;
  "ocsNumber": number;
  "url": string;
}

interface Item {
  key: string,
  value: string
}

@Component({
  selector: 'app-leads-list',
  templateUrl: './leads-list.component.html',
  styleUrls: ['./leads-list.component.css']
})
export class LeadsListComponent implements OnInit {

  days: Array<Item>;
  months: Array<Item>;
  years: Array<Item>;
  assignedToList: Array<Item> = [{key: 'SA', value: 'SA'}, {key: 'SA', value: 'SM'}];

  YYYY: number = new Date().getFullYear();

  fromDay: Item;
  fromMonth: Item;
  fromYear: Item;
  toDay: Item;
  toMonth: Item;
  toYear: Item;
  assignedTo: Item;
  searchTxt: string;
  show: boolean = false;

  // Lead ID === Application ID
  userDetails: Array<UserDetails>;
  isEligibilityForReviews: Array<{applicationId: string, isEligibilityForReview: boolean}> = [];
  isTBMLoggedIn: boolean;

  constructor(private service: QdeHttpService, private utilService: UtilService, private cds: CommonDataService) {

    this.days = Array.from(Array(31).keys()).map((val, index) => {
      let v = ((index+1) < 10) ? "0"+(index+1) : (index+1)+"";
      return {key: v, value: v};
    });
    this.days.unshift({key: 'DD', value: 'DD'});

    this.months = Array.from(Array(12).keys()).map((val, index) => {
      let v = ((index+1) < 10) ? "0"+(index+1) : (index+1)+"";
      return {key: v, value: v};
    });
    this.months.unshift({key: 'MM', value: 'MM'});

    this.years = Array.from(Array(100).keys()).map((val, index) => {
      let v = (this.YYYY - index)+"";
      return {key: v, value: v};
    });
    this.years.unshift({key: 'YYYY', value: 'YYYY'});

    this.fromDay = {key: 'DD', value: 'DD'};
    this.fromMonth = {key: 'MM', value: 'MM'};
    this.fromYear = {key: 'YYYY', value: 'YYYY'};
    this.toDay = {key: 'DD', value: 'DD'};
    this.toMonth = {key: 'MM', value: 'MM'};
    this.toYear = {key: 'YYYY', value: 'YYYY'};

    this.assignedTo = this.assignedToList[0];

    this.getFilteredLeads();
  }

  isloggedIn() {
    return this.utilService.isLoggedIn();
  }

  clearCredentials() {
    return this.utilService.clearCredentials();
  }
  logout() {
    this.utilService.logout().subscribe(
      res => {
        this.utilService.clearCredentials();
      },
      error => {
        this.utilService.clearCredentials();
      }
    );
  }


  ngOnInit() {}

  filterLeads(event: any) {
    this.getFilteredLeads();
  }

  getFilteredLeads() {
    this.service.getLeads(this.searchTxt, this.fromDay.value, this.fromMonth.value, this.fromYear.value, this.toDay.value, this.toMonth.value, this.toYear.value).subscribe(
      res => {
        console.log(res);

        if (res['Error'] && res['Error'] == 0) {
          this.userDetails = res['ProcessVariables'].userDetails || [];

          this.userDetails.forEach(el => {
            el.url = this.getUrl(el['status'], el['leadId'], el['applicantId'], this.getRoles());
          });

          this.cds.setIsEligibilityForReviews(this.isEligibilityForReviews);
          this.isTBMLoggedIn = this.getRoles().includes('TBM') || this.getRoles().includes('TMA');
          this.cds.setIsTBMLoggedIn(this.isTBMLoggedIn);
        } else if (res['login_required'] && res['login_required'] === true) {
          this.utilService.clearCredentials();
          alert(res['message']);
        } else {
          alert(res['ErrorMessage']);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  getUrl(status: string, applicationId?: string, applicantId?: string, roles?: Array<string>) {
    if(roles.includes('TBM') || roles.includes('TMA')) {
      this.cds.setReadOnlyForm(true);
    } else {
      this.cds.setReadOnlyForm(false);
    }

    console.log("status", status);


    if(statuses[status] == "1") {
      this.isEligibilityForReviews.push({applicationId: applicationId, isEligibilityForReview: false});
      
      return "/applicant/"+applicationId;
    } 
    else if(statuses[status] == "5") {
      this.isEligibilityForReviews.push({applicationId: applicationId, isEligibilityForReview: false});
          
      return "/document-uploads/"+applicationId;
    } 
    else if(statuses[status] == "10") {
      this.isEligibilityForReviews.push({applicationId: applicationId, isEligibilityForReview: false});
          
      return "/document-uploads/"+applicationId;
    } 
    else if(statuses[status] == "15") {
      this.isEligibilityForReviews.push({applicationId: applicationId, isEligibilityForReview: false});
      
      return "/payments/online-summary/"+applicationId;
    } 
    else if(statuses[status] == "16") {
      this.isEligibilityForReviews.push({applicationId: applicationId, isEligibilityForReview: false});
      
      return "/document-uploads/"+applicationId;
    } 
    else if(statuses[status] == "17") {
      this.isEligibilityForReviews.push({applicationId: applicationId, isEligibilityForReview: false});
          
      return "/document-uploads/"+applicationId;
    } 
    else if(statuses[status] == "20") {
      this.isEligibilityForReviews.push({applicationId: applicationId, isEligibilityForReview: false});
      
      return "/payments/eligibility-check/"+applicationId;
    } 
    else if(statuses[status] == "25") {
      this.isEligibilityForReviews.push({applicationId: applicationId, isEligibilityForReview: false});
      
      return "/document-uploads/"+applicationId;
    } 
    else if(statuses[status] == "26") {

      if(roles.includes('TBM') || roles.includes('TMA')) {

        this.isEligibilityForReviews.push({applicationId: applicationId, isEligibilityForReview: true});
      } else {
        this.isEligibilityForReviews.push({applicationId: applicationId, isEligibilityForReview: false});
      }
      
      return "/document-uploads/"+applicationId;
    }
    else if(statuses[status] == "27") {
      this.isEligibilityForReviews.push({applicationId: applicationId, isEligibilityForReview: false});
      
      return "/view-form/"+applicationId;
    }
    else if(statuses[status] == "28") {
      this.isEligibilityForReviews.push({applicationId: applicationId, isEligibilityForReview: false});
      
      return "/document-uploads/"+applicationId;
    } 
    else if(statuses[status] == "30") {
      this.isEligibilityForReviews.push({applicationId: applicationId, isEligibilityForReview: false});
      
      return "/document-uploads/"+applicationId;
    }
    else if(statuses[status] == "29") {
      this.isEligibilityForReviews.push({applicationId: applicationId, isEligibilityForReview: false});
      
      return "/applicant/"+applicationId;
    }
    else if(statuses[status] == "31") {
      this.isEligibilityForReviews.push({applicationId: applicationId, isEligibilityForReview: false});
      
      return "/applicant/"+applicationId;
    } 
    else if(statuses[status] == "35") {
      this.isEligibilityForReviews.push({applicationId: applicationId, isEligibilityForReview: false});
      
      return "/document-uploads/"+applicationId;
    } 
    else if(statuses[status] == "40") {
      this.isEligibilityForReviews.push({applicationId: applicationId, isEligibilityForReview: false});
      
      return "/document-uploads/"+applicationId;
    } 
    else {
      this.isEligibilityForReviews.push({applicationId: applicationId, isEligibilityForReview: false});
      
      return "/applicant/";
    }
  }

  toggleFilters() {
    this.show = !this.show;
  }

  getRoles(): Array<string> {
    return JSON.parse(localStorage.getItem('roles'));
  }
}
