import { Component, OnInit } from '@angular/core';
import { QdeHttpService } from 'src/app/services/qde-http.service';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-relationship-mapping',
  templateUrl: './relationship-mapping.component.html',
  styleUrls: ['./relationship-mapping.component.css']
})
export class RelationshipMappingComponent implements OnInit {

  userId: number;
  tableName: string;
  isAdd: boolean;

  // assessments: Array<any>;
  documentCategories: Array<any>;
  docTypes: Array<any>;
  relationships: Array<any>;

  // selectedAssessment: any;
  // selectedDocumentCategory: any;
  // selectedDocType: any;
  selectedRelationship: any;
  selectedApplicantTitle: any;

  // currentPage: number;
  // totalPages: number;
  // perPage: number = 1000;
  // totalElements: number;
  financialApplicant: string;
  applicantType: string;

  data: Array<any> = [];
  applicantTitles: Array<any>;
  mainApplicant: string;
  coApplicant: string;

  constructor(private qdeHttp: QdeHttpService, private route: ActivatedRoute) {
    this.userId = parseInt(localStorage.getItem('userId'));
    this.tableName = 'applicant_relationship_mapping';
    if(this.route.snapshot.data['relationshipMaster']['ProcessVariables']['status'] == true) {
      let res = this.route.snapshot.data['relationshipMaster']['ProcessVariables'];

      // this.currentPage = parseInt(res['currentPage']);
      // this.totalPages = parseInt(res['totalPages']);
      // this.perPage = parseInt(res['perPage']);
      // this.totalElements = res['totalPages'] * this.perPage;

      console.log('relationshipMaster: ', res['mappingList']);
      if(res['status'] == true) {
        this.data = res['mappingList'];
      } else {
        alert('Something went wrong.');
      }
    }
  }

  ngOnInit() {

    this.qdeHttp.adminZipCodeSearch({userId: this.userId, tableName: 'relationship'}).subscribe(res => {
      this.relationships = res['ProcessVariables']['valueDescription'];
      this.selectedRelationship = this.relationships[0];
      console.log("relationships: ",this.relationships);
    }, err => {
    });

    this.qdeHttp.adminZipCodeSearch({userId: this.userId, tableName: 'applicant_title'}).subscribe(res => {
      this.applicantTitles = res['ProcessVariables']['valueDescription'];
      this.selectedApplicantTitle = this.applicantTitles[0];
      console.log("applicantTitles: ",this.applicantTitles);
    }, err => {
    });

  }


  changeRadio(event, index) {
    this.data[index].financialApplicant = event.target.value == '1' ? '1': '0';
    // console.log(this.lovs[index]);
  }

  relationshipChanged(event) {
    this.selectedRelationship = this.relationships.find(v => v.id == event);
  }

  applicantTitleChanged(event) {
    this.selectedApplicantTitle = this.applicantTitles.find(v => v.id == event);
  }

  // docCategoryChanged(event) {
  //   this.selectedDocumentCategory = this.documentCategories.find(v => v.id == event);
  // }

  // docTypeChanged(event) {
  //   this.selectedDocType = this.docTypes.find(v => v.id == event);
  // }

  // profileChanged(event) {
  //   this.selectedProfile = this.profiles.find(v => v.id == event);
  // }

  add() {
    this.isAdd = !this.isAdd;

    // this.selectedAssessment = this.assessments[0];
    // this.selectedDocumentCategory = this.documentCategories[0];
    // this.selectedDocType = this.docTypes[0];
    // this.selectedProfile = this.profiles[0];
    this.selectedRelationship = this.relationships[0];
    this.selectedApplicantTitle = this.applicantTitles[0];
  }

  // tableAssessmentChanged(event, index) {
  //   let t = this.assessments.find(v => v.id == event);
  //   this.data[index].assessment = t.description;
  //   this.data[index].assessmentId = t.id;
  // }

  // tableDocCategoryChanged(event, index) {
  //   let t = this.documentCategories.find(v => v.id == event);
  //   this.data[index].docCategory = t.description;
  //   this.data[index].docCategoryId = t.id;
  // }

  // tableDocTypeChanged(event, index) {
  //   let t = this.docTypes.find(v => v.id == event);
  //   this.data[index].docType = t.description;
  //   this.data[index].docTypeId = t.id;
  // }

  tableRelationshipChanged(event, index) {
    let t = this.relationships.find(v => v.id == event);
    this.data[index].relationship = t.description;
    this.data[index].relationshipId = t.id;
  }

  tableApplicantTitleChanged(event, index) {
    let t = this.applicantTitles.find(v => v.id == event);
    this.data[index].applicantTitle = t.description;
    this.data[index].applicantTitleId = t.id;
  }

  submitForm(form: NgForm) {
    let dude = {};

    dude = {
      userId: this.userId,
      applicantTitle: form.value['applicantTitle']+"",
      coApplicant: form.value['coApplicant']+"",
      mainApplicant: form.value['mainApplicant']+"",
      relationship: form.value['relationship']+""
    };

    console.log("dude: ", dude);

    this.qdeHttp.adminUpdateApplicantRelationship(dude).subscribe(res => {
      if(res["ProcessVariables"]['status'] == true) {
        this.refresh();
        this.isAdd = !this.isAdd;
      } else {
        alert('Something went wrong.');
      }
    }, err => {
      alert('Something went wrong.');
    });
  }

  search(event){
    this.qdeHttp.adminApplicantRelationshipSearch(event.target.value).subscribe(response => {
      console.log("mama",response)
      this.data = response['ProcessVariables']['mappingList'];
    });
  }

  refresh() {
    this.qdeHttp.adminApplicantRelationship().subscribe(res => {
      if(res['ProcessVariables']['status'] == true) {
        let response = res['ProcessVariables'];
  
        // this.currentPage = parseInt(response['currentPage']);
        // this.totalPages = parseInt(response['totalPages']);
        // this.perPage = parseInt(response['perPage']);
        // this.totalElements = response['totalPages'] * this.perPage;
  
        // console.log('response documentMapping: ', response);
        if(response['status'] == true) {
          this.data = response['mappingList'];
        } else {
          alert('Something went wrong.');
        }
      }
    }, err => {

    });    
  }

  // loadMore() {
  //   // this.currentPage++;
  //   this.qdeHttp.adminDocumentProfile((this.currentPage), this.perPage).subscribe(res => {
  //     if(res['ProcessVariables']['status'] == true) {
  //       let response = res['ProcessVariables'];
  
  //       // this.currentPage = parseInt(response['currentPage']);
  //       // this.totalPages = parseInt(response['totalPages']);
  //       // this.perPage = parseInt(response['perPage']);
  //       // this.totalElements = response['totalPages'] * this.perPage;

  //       // console.log("currentPage: ",this.currentPage);
  //       // console.log("totalPages: ",this.totalPages);
  
  //       this.data = this.data.concat(response['documentMapping']);
  //     } else {
  //       alert('Something went wrong.');
  //       // this.currentPage--;
  //     }
  //   }, err => {
  //     alert('Something went wrong.');
  //     // this.currentPage--;
  //   });
  // }

  update(index) {

    let dude = {
      userId: this.userId,
      id: parseInt(this.data[index]['id']),
      mainApplicant: this.data[index]['mainApplicantId']+"",
      coApplicant: this.data[index]['coApplicantId']+"",
      applicantTitle: this.data[index]['applicantTitleId']+"",
      relationship: this.data[index]['relationshipId']+""
    };
    
    console.log(":::", dude);

    this.qdeHttp.adminUpdateApplicantRelationship(dude).subscribe(res => {
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
    // dude.tableName = this.tableName;
    dude.tableName = 'applicant_relation_title_map';

    if(confirm("Are you sure?")) {
      this.qdeHttp.softDeleteLov(dude).subscribe(res => {
        // console.log(res['ProcessVariables']);
        if(res['ProcessVariables']['status'] == true) {
          this.refresh();
        } else {
          alert('Something went wrong.');
        }
      });
    } 
  }


  changeMainApplicant(event, index) {
    this.data[index].mainApplicantId = event.target.value == '1' ? '1': '2';
  }

  changeCoApplicant(event, index) {
    this.data[index].coApplicantId = event.target.value == '1' ? '1': '2';
  }

}
