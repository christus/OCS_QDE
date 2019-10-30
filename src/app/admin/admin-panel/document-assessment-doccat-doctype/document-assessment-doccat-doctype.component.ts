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
  key: Array<number> = [];
  currentPage: number;
  totalPages: number;
  perPage: number;
  totalElements: number;
  searchKey:string;
  serialNo:number=1;
  financialApplicant: string;
  applicantType: string;

  data: Array<any> = [];

  constructor(private qdeHttp: QdeHttpService, private route: ActivatedRoute) {
    this.userId = parseInt(localStorage.getItem('userId'));
    this.tableName = 'profile_assessment_docCategory_docType_map';
    /* if(this.route.snapshot.data['eachLovs']['ProcessVariables']['status'] == true) {
      let res = this.route.snapshot.data['eachLovs']['ProcessVariables'];

      this.currentPage = parseInt(res['currentPage']);
      this.totalPages = parseInt(res['totalPages']);
      this.perPage = parseInt(res['perPage']);
      this.totalElements = res['totalPages'] * this.perPage;

      console.log('documentmapping: ', res['documentMapping']);
      this.data = res['documentMapping'];
    } */
    this.qdeHttp.adminDocumentProfile().subscribe(res => {
      if(res['ProcessVariables']['status'] == true) {
        let response = res['ProcessVariables'];
  
        this.currentPage = parseInt(response['currentPage']);
        this.totalPages = parseInt(response['totalPages']);
        this.perPage = parseInt(response['perPage']);
        this.totalElements = response['totalPages'] * this.perPage;
  
        console.log('response documentMapping: ', response['documentMapping']);      
        this.data = response['documentMapping'];
        for(var i=0; i<this.data.length;i++){
          this.key[i]=((this.perPage*(this.currentPage-1))+i+ 1);
        }
        
      }
    }, err => {

    });
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


  changeRadio(event, index) {
    this.data[index].financialApplicant = event.target.value == '1' ? '1': '0';
    // console.log(this.lovs[index]);
  }

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

    console.log(form.value);

    dude = {
      userId: this.userId,
      assessmentId: dude.assessmentId,
      docCategoryId: dude.docCategoryId,
      docTypeId: dude.docTypeId,
      profileId: dude.profileId,
      financialApplicant: dude.financialApplicant,
      tableName: this.tableName,
      applicantType: parseInt(dude.applicantType)
    };

    this.qdeHttp.adminUpdateDocumentProfile(dude).subscribe(res => {
      if(res["ProcessVariables"]['status'] == true) {
        this.refresh();
      } else {
        alert('Something went wrong.');
      }
    }, err => {
      alert('Something went wrong.');
    });
  }

  refresh() {
    this.searchKey="";
    this.qdeHttp.adminDocumentProfile().subscribe(res => {
      if(res['ProcessVariables']['status'] == true) {
        let response = res['ProcessVariables'];
  
        this.currentPage = parseInt(response['currentPage']);
        this.totalPages = parseInt(response['totalPages']);
        this.perPage = parseInt(response['perPage']);
        this.totalElements = response['totalPages'] * this.perPage;
  
        console.log('response documentMapping: ', response['documentMapping']);      
        this.data = response['documentMapping'];
        for(var i=0; i<this.data.length;i++){
          this.key[i]=((this.perPage*(this.currentPage-1))+i+ 1);
        }
      }
    }, err => {

    });    
  }

  loadMore() {
    this.currentPage++;
    this.qdeHttp.adminDocumentProfile((this.currentPage), this.perPage).subscribe(res => {
      if(res['ProcessVariables']['status'] == true) {
        let response = res['ProcessVariables'];
  
        this.currentPage = parseInt(response['currentPage']);
        this.totalPages = parseInt(response['totalPages']);
        this.perPage = parseInt(response['perPage']);
        this.totalElements = response['totalPages'] * this.perPage;

        console.log("currentPage: ",this.currentPage);
        console.log("totalPages: ",this.totalPages);
  
        this.data = this.data.concat(response['documentMapping']);
      } else {
        alert('Something went wrong.');
        this.currentPage--;
      }
    }, err => {
      alert('Something went wrong.');
      this.currentPage--;
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
      tableName: this.tableName,
      financialApplicant: this.data[index].financialApplicant,
      applicantType: parseInt(this.data[index].applicantTypeId)
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

  changeIsIndividual(event, index) {
    this.data[index].applicantTypeId = event.target.value == '1' ? '1': '2';
  }
  search(event){
    this.qdeHttp.adminDocumentProfile(this.currentPage,this.perPage,event.target.value).subscribe(res => {
      if(res['ProcessVariables']['status'] == true) {
        let response = res['ProcessVariables'];
  
        this.currentPage = parseInt(response['currentPage']); ;
        this.totalPages = parseInt(response['totalPages']);
        this.perPage = parseInt(response['perPage']);
        this.totalElements = this.totalPages * this.perPage;

        console.log("currentPage: ",this.currentPage);
        console.log("totalPages: ",this.totalPages);
        if(response['documentMapping']){
          this.data = response['documentMapping'];
          for(var i=0; i<this.data.length;i++){
            this.key[i]=((this.perPage*(this.currentPage-1))+i+ 1);
          }
        }else{
          alert("No Data present further");
        }
        
      } else {
        alert('Something went wrong.');
        this.currentPage--;
      }
    }, err => {
      alert('Something went wrong.');
      this.currentPage--;
    });
  }
  
  pageChanged(value){
    this.qdeHttp.adminDocumentProfile(value,this.perPage,this.searchKey).subscribe(res => {
      if(res['ProcessVariables']['status'] == true) {
        let response = res['ProcessVariables'];
  
        this.currentPage = value;
        this.totalPages = parseInt(response['totalPages']);
        this.perPage = parseInt(response['perPage']);
        this.totalElements = response['totalPages'] * this.perPage;
        console.log(response['documentMapping']);
          this.data = response['documentMapping'];
          for(var i=0; i<this.data.length;i++){
            this.key[i]=((this.perPage*(this.currentPage-1))+i+ 1);
          }
      } else {
        alert('Something went wrong.');
        this.currentPage--;
      }
    }, err => {
      alert('Something went wrong.');
      this.currentPage--;
    });
  }
}
