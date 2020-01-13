import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
  isErrorModal:boolean = false;
  errorMsg: string;
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
  delIndex: any;
  isConfirmModal: boolean;
  uploadFileName: string;

  @ViewChild('uploadCSV') uploadCSV:ElementRef;
  uploadCSVString: string;
  selectedFile: File;
  isFileSelected: boolean = false;

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
    /*this.qdeHttp.adminZipCodeSearch({userId: this.userId, tableName: 'assessment_methodology'}).subscribe(res => {
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
    });*/
    this.qdeHttp.adminGetLov().subscribe(res=>{
      this.assessments = JSON.parse(res['ProcessVariables']['lovs']).LOVS.assessment_methodology;
      this.selectedAssessment = this.assessments[0];
      this.documentCategories = JSON.parse(res['ProcessVariables']['lovs']).LOVS.document_category;
      this.selectedDocumentCategory = this.documentCategories[0];
      this.docTypes = JSON.parse(res['ProcessVariables']['lovs']).LOVS.document_type;
      this.selectedDocType = this.docTypes[0];
      this.profiles = JSON.parse(res['ProcessVariables']['lovs']).LOVS.occupation;
      this.selectedProfile = this.profiles[0];
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
    this.applicantType = "";
    this.financialApplicant = "";
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
        this.isErrorModal = true;
        this.errorMsg = "Added successfully";
        this.refresh();
      } 
	  /* else {
        this.isErrorModal = true;
        this.errorMsg = res["ProcessVariables"]["errorMessage"];
        //alert('Something went wrong.');
      } */
    }
	/* , err => {
        this.isErrorModal = true;
        this.errorMsg = "Something went wrong";
        //alert('Something went wrong.');
    } */
	);
    this.refresh();
  }

  refresh() {
    this.searchKey="";
    this.selectedAssessment = this.assessments[0];
    this.selectedDocumentCategory = this.documentCategories[0];
    this.selectedDocType = this.docTypes[0];
    this.selectedProfile = this.profiles[0];
    this.financialApplicant = "";
    this.applicantType = "";
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
      }
	  /* else {
        this.isErrorModal = true;
        this.errorMsg = "Something went wrong";
        //alert('Something went wrong.');
        this.currentPage--;
      } */
    }
	/* , err => {
        this.isErrorModal = true;
        this.errorMsg = "Something went wrong";
        //alert('Something went wrong.');
      this.currentPage--;
    } */
	);
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
        this.isErrorModal = true;
        this.errorMsg = "Updated Successfully";
        this.refresh();
      }
	  /* else {
        this.isErrorModal = true;
        this.errorMsg = res["ProcessVariables"]["errorMessage"];
        //alert('Something went wrong.');
      } */
    }
	/* , err => {
        this.isErrorModal = true;
        this.errorMsg = "Something went wrong";
        //alert('Something went wrong.');
    } */
	);
  }

  delete(index) {
    this.delIndex = this.data[index];
    this.delIndex.tableName = this.tableName;
    this.isConfirmModal = true;
  }
    confirmDelete(){
      this.isConfirmModal = false;
      this.qdeHttp.softDeleteLov(this.delIndex).subscribe(res => {
        // console.log(res['ProcessVariables']);
        if(res["ProcessVariables"]["status"]){this.isErrorModal = true; this.errorMsg = "Deleted Successfully";}
        this.refresh();
      });
  }

  changeIsIndividual(event, index) {
    this.data[index].applicantTypeId = event.target.value == '1' ? '1': '2';
  }
  search(event){
    this.qdeHttp.adminDocumentProfile(this.currentPage,this.perPage,event.target.value).subscribe(res => {
      if(res['ProcessVariables']['status'] == true && res['ProcessVariables']['documentMapping']!=null) {
        let response = res['ProcessVariables'];

        this.currentPage = parseInt(response['currentPage']);
        ;
        this.totalPages = parseInt(response['totalPages']);
        this.perPage = parseInt(response['perPage']);
        this.totalElements = this.totalPages * this.perPage;

        console.log("currentPage: ", this.currentPage);
        console.log("totalPages: ", this.totalPages);
        if (response['documentMapping']) {
          this.data = response['documentMapping'];
          for (var i = 0; i < this.data.length; i++) {
            this.key[i] = ((this.perPage * (this.currentPage - 1)) + i + 1);
          }
        }
      }else if (res['ProcessVariables']['status'] == true && res['ProcessVariables']['documentMapping']==null){
          this.isErrorModal = true;
          this.errorMsg = "No Data present further";
          //alert("No Data present further");
        }
        
      } 
	  /* else {
        this.isErrorModal = true;
        this.errorMsg = "Something went wrong";
        //alert('Something went wrong.');
        this.currentPage--;
      } */
	/* , err => {
        this.isErrorModal = true;
        this.errorMsg = "Something went wrong";
        //alert('Something went wrong.');
      this.currentPage--;
    } */
	);
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
      }
	  /* else {
        this.isErrorModal = true;
        this.errorMsg = "Something went wrong";
        //alert('Something went wrong.');
        this.currentPage--;
      } */
    }
	/* , err => {
        this.isErrorModal = true;
        this.errorMsg = "Something went wrong";
        //alert('Something went wrong.');
      this.currentPage--;
    } */
	);
  }
  startUpload(event){
    this.selectedFile = event.target.files[0];
    this.uploadFileName = this.selectedFile.name;
    if(this.selectedFile.size!=0){
      this.isFileSelected = true;
    }else{
      this.isErrorModal = true;
      this.errorMsg = "No File selected";
      this.isFileSelected=false;
    }
    this.getBase64(this.selectedFile);
  }
  getBase64(inputValue: any) {
    var file:File = inputValue
    var myReader:FileReader = new FileReader();
    myReader.onloadend = (e) => {
      this.uploadCSVString = myReader.result.substr(myReader.result.indexOf(',') + 1);;
      console.log("result base64", this.uploadCSVString);
    }
    myReader.readAsDataURL(file);
  }
  uploadCSVFile(){
    let name = this.selectedFile.name;
    let size = this.selectedFile.size;
    if(size!=0){
      let documentInfo = {
        userId: localStorage.getItem("userId"),
        "attachment": {
          "name": name,
          "operation": "upload",
          "content": this.uploadCSVString,
          "mime": "text/csv",
          "size": size
        }
      }
      this.qdeHttp.documentProfileUploadCSV(documentInfo).subscribe(res=>{
        if(res['ProcessVariables']['status'] && res['ProcessVariables']['errorMessage']==''){
          this.isErrorModal = true;
          this.errorMsg = "File Uploaded successfully";
          this.isFileSelected = false;
          let el = this.uploadCSV.nativeElement;
          el.value = "";
          this.uploadFileName = "";
        }else{
          //this.isErrorModal = true;
          //this.errorMessage = res['ProcessVariables']['errorMessage'];
          this.isFileSelected = false;
          let el = this.uploadCSV.nativeElement;
          el.value = "";
          this.uploadFileName = "";
        }
      })
    }
  }
  callFile(){
    let el = this.uploadCSV.nativeElement;
    el.click();  
  }
}
