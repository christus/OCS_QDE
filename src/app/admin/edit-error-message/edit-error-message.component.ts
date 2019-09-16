import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QdeHttpService } from 'src/app/services/qde-http.service';

@Component({
  selector: 'app-edit-error-message',
  templateUrl: './edit-error-message.component.html',
  styleUrls: ['./edit-error-message.component.css']
})
export class EditErrorMessageComponent implements OnInit {

  errList: any[] = [];
  errorGroup;
  
  errorCode: String;
  module: String;
  description:  String;
  updatebtn: boolean;
  selectedError: any;
  errorMsg: any;
  errorMessagesText: any;
  textDisable = true ;
  constructor(private activateRoute: ActivatedRoute,
              private qdeHttp: QdeHttpService,
              private router: Router) { }

  ngOnInit() {
  const errorID = this.activateRoute.snapshot.params;
  // console.log("error id ", errorID);
  const sendErrorDetail =  errorID ;
  this.qdeHttp.getErrorIdHandlingMessage(sendErrorDetail).subscribe((response) => {
    const errorData = response["ProcessVariables"];
    
    this.errorCode = errorData["errorCode"];
    this.module = errorData["module"];
    this.description = errorData["description"];
    this.errorMessagesText = errorData["errorMessage"];
  });
} 

// enable text Area

textEnable() {
  // console.log("disable value " , this.errorMessages.untouched );
    this.textDisable = false;

}
handleErrorMessage(errorMessagesText) {
  // console.log("edited Value" , this.errorMessagesText );
  const data = {
    'userId': parseInt(localStorage.getItem('userId')),
    'errorCode': this.errorCode,
    'message': this.errorMessagesText
  };
  // console.log("ERRORCODE:",JSON.stringify(data));
  this.qdeHttp.updateErrorHandlingMessage(data).subscribe(response => {
    
    if (response["Error"] === "0" &&
    response["ProcessVariables"]["status"]) {
    // alert("Uploaded Successfully!");    
    this.router.navigate(['admin/errorHandle']);
  } else {
    if (response["ErrorMessage"]) {
      // console.log("Response: " + response["ErrorMessage"]);
      this.errorMsg = response["ErrorMessage"];
    } else if (response["ProcessVariables"]["errorMessage"]) {
      // console.log(
      //   "Response: " + response["ProcessVariables"]["errorMessage"]
      // );
      this.errorMsg = response["ProcessVariables"]["errorMessage"];
    }
  }
  });
}


}
