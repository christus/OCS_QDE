import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
import { QdeHttpService } from 'src/app/services/qde-http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-retrieve-file-upload',
  templateUrl: './retrieve-file-upload.component.html',
  styleUrls: ['./retrieve-file-upload.component.css']
})
export class RetrieveFileUploadComponent implements OnInit {

  fileName: string;
  archiveBy: any;
  selectedFile: File;
  uploadCSVString: string;
  reasonToChangeText: string;

  isSuccessModal: boolean;
  successMsg: string;

  @ViewChild("retrieveOcsFile") retrieveOcsFile : ElementRef;

  constructor( private qdeHttp: QdeHttpService, private router: Router ) { }

  ngOnInit() {
    this.fileName = '';
    this.reasonToChangeText = '';
    this.successMsg = 'Applications Retrieved Successfully'
  }

  setOcsNumber(event) {
   this.selectedFile  =  event.target.files[0];

   this.fileName = this.selectedFile.name;

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

  onSubmit() {

    let name = this.selectedFile.name;
    let size = this.selectedFile.size;
    if(size!=0){

    let documentInfo = {
      userId: parseInt(localStorage.getItem("userId")),
      "retrieveReason" : this.reasonToChangeText,
      "attachment": {
        "name": name,
        "operation": "upload",
        "content": this.uploadCSVString,
        "mime": "text/csv",
        "size": size,
      }
    }

    this.qdeHttp.uploadOcsRetrieve(documentInfo).subscribe((response)=> {
      console.log('Response',response)
      this.retrieveOcsFile.nativeElement.value = "";

      if(response['ProcessVariables']['status']) {
        this.isSuccessModal = true;
      }
    })

    console.log(documentInfo)

  }

  }

  success() {
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate(['/admin/retrieve']);
      // this.removeApplicantPage();
    }
    
    );
  }

}
