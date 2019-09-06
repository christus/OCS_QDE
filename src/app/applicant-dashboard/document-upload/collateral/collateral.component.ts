import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray, NgForm } from '@angular/forms'

import { Renderer, ViewChild } from '@angular/core';
import { QdeHttpService } from '../../../services/qde-http.service';
import { QdeService } from '../../../services/qde.service';
import Qde from '../../../models/qde.model';

@Component({
  selector: 'app-collateral',
  templateUrl: './collateral.component.html',
  styleUrls: ['./collateral.component.css']
})
export class CollateralComponent  {
    fieldArray: Array<any> = [];
    newAttribute: any = {};
    applicantIndex: number = 0;
    applicantId: number;
    applicationId:string;
    qde: Qde;


  constructor(private renderer: Renderer,
    private formBuilder: FormBuilder,
    private qdeHttp: QdeHttpService,
    private qdeService: QdeService,
    // private multifilesService: MultifilesService
  ) { }

  public documentGrp: FormGroup;
  public totalfiles: Array<File> =[];
  public totalFileName = [];
  public lengthCheckToaddMore =0;


  ngOnInit() {

    this.documentGrp = this.formBuilder.group({
      doc_name: '',
      doc_description: '',
      documentFile:new FormControl(File),

      items: this.formBuilder.array([this.createUploadDocuments()])
    });

    this.applicantId = 15157;
    this.qdeHttp.getQdeData(this.applicantId).subscribe(response => {
      var result = JSON.parse(response["ProcessVariables"]["response"]);
      this.qdeService.setQde(result);

      // if(butRes >= 5) {
      //   this.cds.setIsMainTabEnabled(false);
      // }
      // else{
      //   this.cds.setIsMainTabEnabled(true);
      // }

      this.qde = result;
      this.qdeService.setQde(this.qde);

      if(result != null) {
        this.applicantIndex = result.application.applicants.findIndex(v => v.applicantId == this.applicantId);
      }

      const applicants = this.qde.application.applicants;


      this.applicationId = this.qde.application.applicationId;
    });

  }
  createUploadDocuments(): FormGroup {
    return this.formBuilder.group({
      doc_name: '',
      doc_description: '',
      documentFile : File
    });
  }

  get items(): FormArray {
    return this.documentGrp.get('items') as FormArray;
  };

  addItem(formValue: any): void {

    // const applicantId = this.qde.application.applicants[this.applicantIndex].applicantId.toString();

   

    this.applicationId = this.qde.application.applicationId;

  //console.log("length is ",this.totalfiles.length);
  //console.log("lengthCheckToaddMore ", this.lengthCheckToaddMore);

    let AllFilesObj = []

    formValue.items.forEach((element, index) => { 
    
      console.log("index is ",index);
      console.log("element is ", element);
      
      let eachObj = {
        'doc_name' : element.doc_name,
        'doc_description' : element.doc_description,
        'file_name' : this.totalFileName[index],
        "file": this.totalfiles[0]
        
      }
      AllFilesObj.push(eachObj);


      let modifiedFile = Object.defineProperty(this.totalfiles[0], "name", {
        writable: true,
        value: this.totalFileName[index]
      });
      modifiedFile["name"] =
        this.applicationId +
        "-" +
        this.applicantId +
        "-" +
        new Date().getTime() +
        "-" +
        modifiedFile["name"];
  
      console.log("the single item data is ==>",AllFilesObj);

      let that = this;

      this.uploadToMongo(modifiedFile, function(response) {
        console.log("Response", response);

        if(that.totalfiles.length!=0){
          if( that.items.value[0].doc_name != "" && that.items.value[0].doc_description != "" && ((that.lengthCheckToaddMore) === (that.totalfiles.length)) ){
              
            that.items.insert(0, that.createUploadDocuments())
            that.lengthCheckToaddMore = that.lengthCheckToaddMore + 1;
          }
        }

      });

    });
      
  }

  uploadToMongo(file: File, callback: any) {
    this.qdeHttp.uploadToAppiyoDrive(file).subscribe(
      response => {
        if (response["ok"]) {
          //this.progress = Math.round(100 * event.loaded / event.total);
          //console.log(response);
          callback(response["info"]);
        } else {
          console.log(alert["message"]);
        }
      },
      error => {
        console.log("Error : ", error);
        alert(error.error.message);
      }
    );
  }

  removeItem(index: number) {
  
    this.totalfiles.splice(index);
    this.totalFileName.splice(index);
    this.items.removeAt(index);
    this.lengthCheckToaddMore = this.lengthCheckToaddMore-1;
   // console.log("name are ",this.totalFileName);
    
  }

  public fileSelectionEvent(fileInput: any,oldIndex) {

    console.log("newIndex is ", oldIndex);
    
    if (fileInput.target.files && fileInput.target.files[0]) {

      var reader = new FileReader();
      reader.onload = (event: any) => {
      }

      if(oldIndex==0) {
        this.totalfiles.unshift((fileInput.target.files[0]))
        this.totalFileName.unshift(fileInput.target.files[0].name)
      }else {
        this.totalfiles[oldIndex]=(fileInput.target.files[0]);
        this.totalFileName[oldIndex]=fileInput.target.files[0].name
      }
   
      reader.readAsDataURL(fileInput.target.files[0]);
    }
  
    if(this.totalfiles.length == 1)  {
      this.lengthCheckToaddMore=1;
    }

  }




  public OnSubmit(formValue: any) {

  
    let main_form: FormData = new FormData();

    for(let j=0;j<this.totalfiles.length; j++) {
      console.log("the values is ",<File>this.totalfiles[j]);
      console.log("the name is ",this.totalFileName[j]);
      
      main_form.append(this.totalFileName[j],<File>this.totalfiles[j])
    }
    console.log(formValue.items)
   
    

    //reverseFileNames=this.totalFileName.reverse();
   
    let AllFilesObj= []

    formValue.items.forEach((element, index) => { 
     
      console.log("index is ",index);
      console.log("element is ", element);
      
      let eachObj = {
        'doc_name' : element.doc_name,
        'doc_description' : element.doc_description,
        'file_name' : this.totalFileName[index]
      }
      AllFilesObj.push(eachObj); 
    });

    console.log("the Array data is ",AllFilesObj);
    main_form.append("fileInfo",JSON.stringify(AllFilesObj))
  
    // this.multifilesService.saveFiles(main_form).subscribe(data => {
    //   //console.log("result is ", data)
    // })
  }


}
