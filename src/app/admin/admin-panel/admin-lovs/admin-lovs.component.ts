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

  @ViewChild('searchInp') searchInp: ElementRef;

  constructor(private route: ActivatedRoute) {
    if(this.route.snapshot.data['adminLovs']) {
      this.adminLovs = this.route.snapshot.data['adminLovs']['ProcessVariables']['mastersList'];
      this.adminLovs.push({description: 'CLSS Checklist', value: 'clss_checklist'});
      this.filteredLovs = this.adminLovs;
    } else {
      alert('Could not Load Data.');
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
        if(v.description.toLowerCase().trim().search(event.target.value.toLowerCase().trim()) >= 0) {
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
