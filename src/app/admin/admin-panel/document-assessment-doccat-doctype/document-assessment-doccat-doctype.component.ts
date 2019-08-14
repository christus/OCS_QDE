import { Component, OnInit } from '@angular/core';
import { QdeHttpService } from 'src/app/services/qde-http.service';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'document-assessment-doccat-doctype',
  templateUrl: './document-assessment-doccat-doctype.component.html',
  styleUrls: ['./document-assessment-doccat-doctype.component.css']
})
export class DocumentAssessmentDoccatDoctypeComponent implements OnInit {

  userId: number;
  tableName: string;
  isAdd: boolean;

  assessments: Array<any>;
  documentCategories: Array<any>;
  docTypes: Array<any>;
  profiles: Array<any>;

  selectedAssessment: any;
  selectedDocumentCategory: any;
  selectedDocType: any;
  selectedProfile: any;

  currentPage: number;
  totalPages: number;
  perPage: number = 1000;
  totalElements: number;
  financialApplicant: string;

  data: Array<any> = [];

  constructor(private qdeHttp: QdeHttpService, private route: ActivatedRoute) {
    this.userId = parseInt(localStorage.getItem('userId'));
    this.tableName = 'profile_assessment_docCategory_docType_map';
    if(this.route.snapshot.data['eachLovs']['ProcessVariables']['status'] == true) {
      let res = this.route.snapshot.data['eachLovs']['ProcessVariables'];

      this.currentPage = parseInt(res['currentPage']);
      this.totalPages = parseInt(res['totalPages']);
      this.perPage = parseInt(res['perPage']);
      this.totalElements = res['totalPages'] * this.perPage;

      this.data = this.data.concat(res['documentMapping']);
    }
  }

  ngOnInit() {
    this.qdeHttp.adminZipCodeSearch({userId: this.userId, tableName: 'assessment_methodology'}).subscribe(res => {
      this.assessments = res['ProcessVariables']['valueDescription'];
      this.selectedAssessment = this.assessments[0];
    }, err => {
    });

    this.qdeHttp.adminZipCodeSearch({userId: this.userId, tableName: 'document_category'}).subscribe(res => {
      this.documentCategories = res['ProcessVariables']['valueDescription'];
      this.selectedDocumentCategory = this.documentCategories[0];
    }, err => {
    });

    this.qdeHttp.adminZipCodeSearch({userId: this.userId, tableName: 'document_type'}).subscribe(res => {
      this.docTypes = res['ProcessVariables']['valueDescription'];
      this.selectedDocType = this.docTypes[0];
    }, err => {
    });

    this.qdeHttp.adminZipCodeSearch({userId: this.userId, tableName: 'profile'}).subscribe(res => {
      this.profiles = res['ProcessVariables']['valueDescription'];
      this.selectedProfile = this.profiles[0];
    }, err => {
    });
  }


  // changeRadio(event, index) {
  //   this.financialApplicant = event.target.value == '1' ? '1': '0';
  //   // console.log(this.lovs[index]);
  // }

  assessmentChanged(event) {
    console.log(">>>>", event);
    this.selectedAssessment = this.assessments.find(v => v.id == event);
  }

  docCategoryChanged(event) {
    this.selectedDocumentCategory = this.documentCategories.find(v => v.id == event);
  }

  docTypeChanged(event) {
    this.selectedDocType = this.docTypes.find(v => v.id == event);
  }

  profileChanged(event) {
    this.selectedProfile = this.profiles.find(v => v.id == event);
  }

  add() {
    this.isAdd = !this.isAdd;

    this.selectedAssessment = this.assessments[0];
    this.selectedDocumentCategory = this.documentCategories[0];
    this.selectedDocType = this.docTypes[0];
    this.selectedProfile = this.profiles[0];
  }

  tableAssessmentChanged(event, index) {
    let t = this.assessments.find(v => v.id == event);
    this.data[index].assessment = t.description;
    this.data[index].assessmentId = t.id;
  }

  tableDocCategoryChanged(event, index) {
    let t = this.documentCategories.find(v => v.id == event);
    this.data[index].docCategory = t.description;
    this.data[index].docCategoryId = t.id;
  }

  tableDocTypeChanged(event, index) {
    let t = this.docTypes.find(v => v.id == event);
    this.data[index].docType = t.description;
    this.data[index].docTypeId = t.id;
  }

  tableProfileChanged(event, index) {
    let t = this.profiles.find(v => v.id == event);
    this.data[index].profile = t.description;
    this.data[index].profileId = t.id;
  }

  submitForm(form: NgForm) {
    let dude = form.value;

    dude = {
      userId: this.userId,
      assessmentId: dude.assessmentId,
      docCategoryId: dude.docCategoryId,
      docTypeId: dude.docTypeId,
      profileId: dude.profileId,
      tableName: this.tableName
    };

    this.qdeHttp.adminUpdateDocumentProfile(dude).subscribe(res => {
      if(res["ProcessVariables"]['status'] == true) {
        this.refresh();
      } else {
        alert('Something went wrong');
      }
    }, err => {
      alert('Something went wrong');
    });
  }

  refresh() {
    this.qdeHttp.adminDocumentProfile().subscribe(res => {
      if(res['ProcessVariables']['status'] == true) {
        let response = res['ProcessVariables'];
  
        this.currentPage = parseInt(response['currentPage']);
        this.totalPages = parseInt(response['totalPages']);
        this.perPage = parseInt(response['perPage']);
        this.totalElements = response['totalPages'] * this.perPage;
  
        this.data = this.data.concat(response['documentMapping']);
      }
    }, err => {

    });    
  }

  loadMore() {
    this.qdeHttp.adminDocumentProfile((this.currentPage+1), this.perPage).subscribe(res => {
      if(res['ProcessVariables']['status'] == true) {
        let response = res['ProcessVariables'];
  
        this.currentPage = parseInt(response['currentPage']);
        this.totalPages = parseInt(response['totalPages']);
        this.perPage = parseInt(response['perPage']);
        this.totalElements = response['totalPages'] * this.perPage;
  
        this.data = this.data.concat(response['documentMapping']);
      }
    }, err => {

    });
  }

  update(index) {

    console.log(this.data[index]);

    let dude = {
      userId: this.userId,
      assessmentId: this.data[index].assessmentId+"",
      docCategoryId: this.data[index].docCategoryId+"",
      docTypeId: this.data[index].docTypeId+"",
      profileId: this.data[index].profileId+"",
      id: this.data[index]['id'],
      tableName: this.tableName
    };

    this.qdeHttp.adminUpdateDocumentProfile(dude).subscribe(res => {
      if(res["ProcessVariables"]['status'] == true) {
        this.refresh();
      } else {
        alert('Something went wrong');
      }
    }, err => {
      alert('Something went wrong');
    });
  }

  delete(index) {
    let dude = this.data[index];
    dude.tableName = this.tableName;

    if(confirm("Are you sure?")) {
      this.qdeHttp.softDeleteLov(dude).subscribe(res => {
        // console.log(res['ProcessVariables']);
        this.refresh();
      });
    } 
  }
}
