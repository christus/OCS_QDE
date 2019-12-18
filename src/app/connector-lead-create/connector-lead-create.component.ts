import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QdeHttpService } from '../services/qde-http.service';
import { CommonDataService } from '../services/common-data.service';
import { QdeService } from '../services/qde.service';
import { NgForm } from '@angular/forms';
import Qde from '../models/qde.model';
import { UtilService } from '../services/util.service';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';

interface Item {
  key: string,
  value: string | number
}
interface MinMax {
  minValue: string,
  maxValue: string,
  maxLength: string
}
@Component({
  selector: 'app-connector-lead-create',
  templateUrl: './connector-lead-create.component.html',
  styleUrls: ['./connector-lead-create.component.css']
})
export class ConnectorLeadCreateComponent implements OnInit {

  preferredEmail: Array<Item>;
  isOptionsMenuDropOpen: boolean = false;
  loanType: Array<Item>;
  selectedLoanType: Item;
  qde: Qde;
  version: string;
  buildDate: string;
  isSuccessfulRouteModal: boolean;
  isNumberLessThan50k: boolean;
  isNumberMoreThan100cr: boolean;
  sessionMessage="";
  firstName: string;
  qdeSourceSub: Subscription;
  applicantIndex: number = 0;
  minMaxValues: Array<MinMax>;
  isLessAmount: boolean ;
  requirMinAmout ;
  isMaxAmount: boolean;
  requirMaxAmout;


  regexPattern={
    firstName: "[A-Za-z ]+$",
    mobileNumber:"[1-9][0-9]+",
    address:"^[0-9A-Za-z, _&'/#]+$",
    pincode:"^[1-9][0-9]{5}$",
    email:"^\\w+([\.-]?\\w+)*@\\w+([\.-]?\\w+)*(\\.\\w{2,10})+$",
    amount: "^[\\d]{0,14}([.][0-9]{0,4})?",
    sameDigit: '0{10}|1{10}|2{10}|3{10}|4{10}|5{10}|6{10}|7{10}|8{10}|9{10}'
  };
  errors = {
    leadCreate :{
      firstName:{
        required: "First Name is mandatory",
        invalid: "Number and Special Characters not allowed",
        length: "Please provide valid First name"
        },
      mobileNo:{
        required: "10 digit mobile number is mandatory",
        minlength: "Mobile number must be 10 digits",
        wrong: "Please provide valid mobile number",
        invalid: "Invalid mobile number/Alphabets and Special Characters not allowed",
        },
      address:{
        required: "Address is mandatory",
        invalid: "Incomplete address",
        length: "Please provide valid address"
        },
      pincode:{
        required: "Pincode is mandatory",
        invalid: "Invalid/Incomplete Pincode",
        },
      email:{
        required: "Email Id is mandatory",
        invalid: "Invalid Email ID",
        invalidDomain: "Invalid Domain"
      },
      amount: {
        required: "Loan Amount is Mandatory",
        invalid: "Invalid Loan Amount / Alphabets and special characters not allowed",
        minamount: "Amount should be greater than or equal to Rs.",
        maxamount: "Amount should be less than or equal to Rs.",
      }
    }
  };

  public defaultItem = environment.defaultItem
  
  constructor(private route: ActivatedRoute,
    private router: Router,
    private qdeHttp: QdeHttpService,
    private commonDataService: CommonDataService,
    private qdeService: QdeService,
    private ren: Renderer2,
    private utilService: UtilService) { 
      
    this.qde = this.qdeService.defaultValue;
    this.qdeService.resetQde();
    this.commonDataService.changeMenuBarShown(false);
    this.commonDataService.changeViewFormVisible(false);
    this.commonDataService.changeLogoutVisible(true);
    this.commonDataService.changeHomeVisible(true);
    this.commonDataService.changeViewFormNameVisible(true);
    
    this.qdeSourceSub=this.qdeService.qdeSource.subscribe(val => {
      console.log("VALVE: ", val);
      this.qde = val;
    });
  }

  ngOnInit() {
    if(this.route.snapshot.data.listOfValues) {
      const lov = JSON.parse(this.route.snapshot.data.listOfValues['ProcessVariables'].lovs);
      this.loanType = lov.LOVS.loan_type;
      this.preferredEmail = lov.LOVS.preferred_mails;
      // this.loanType[0]
      this.selectedLoanType = this.defaultItem ;
      this.minMaxValues = lov.LOVS.min_max_values;
    }

    this.version = environment.version;
    this.buildDate = environment.buildDate;
    this.loginName()
  }

  openOptionsMenuDropdown(a: ElementRef) {
    this.isOptionsMenuDropOpen = true;
    // a.nativeElement.focus();
  }

  closeOptionsMenuDropdown(optionsMenuDropdownContent: ElementRef) {
    // this.isOptionsMenuDropOpen = false;
  }

  leadSaveConnector(form: NgForm){
    console.log(this.qde.application.leadCreate);
    this.qde.application.leadCreate.loanAmount = parseInt(this.qde.application.leadCreate.loanAmount+"");
    this.qde.application.leadCreate.mobileNumber = parseInt(this.qde.application.leadCreate.mobileNumber+"");
    this.qde.application.leadCreate.zipcode = parseInt(this.qde.application.leadCreate.zipcode+"");

    let data = Object.assign({}, this.qde.application.leadCreate);
    data['loanType'] = parseInt(this.selectedLoanType.value+"");
    data['userId'] = parseInt(localStorage.getItem('userId'));

    this.qdeHttp.connectorLeadCreateSave(data).subscribe(res => {
      if(res['ProcessVariables']['status'] == true) {
        this.sessionMessage = res['ProcessVariables']['errorMessage']
        this.isSuccessfulRouteModal = true;
      }
      else{
        this.sessionMessage = res['ProcessVariables']['errorMessage']
      }
    });
  }

  logout() {
    // this.qdeHttp.logout().subscribe(
    //   res => {},
    //   error => {
    //     // window.alert("Error Message: " + error.message );
    //   }
      
    // );
    this.utilService.clearCredentials();

    // this.utilService.logout().subscribe(
    //   res => {
    //     this.utilService.clearCredentials();
    //   },
    //   error => {
    //     this.utilService.clearCredentials();
    //   }
    // );
  }

  onCrossModal() {
    this.isSuccessfulRouteModal = false;
  }

  getNumberWithoutCommaFormat(x: string) : string {
    return x ? x+"".split(',').join(''): '';
  }
  
  /****************************************
  * Is a valid Number after removing Comma
  ****************************************/
  isValidNumber(x) {
    return RegExp('^[0-9]*$').test(this.getNumberWithoutCommaFormat(x));
  }

  RegExp(param) {
    return RegExp(param);
  }

  
  checkAmountLimit(event,minAmount?,maxAmount?) {
    console.log("event ",event);
    let n = parseInt(this.getNumberWithoutCommaFormat(event.target.value));
    console.log("event ",n);
    if(minAmount != undefined && n < minAmount ){
      console.log("min ",minAmount);
      this.isLessAmount = true;
      this.requirMinAmout = minAmount;
    } else if(n >= maxAmount && !maxAmount){
      console.log("max ",maxAmount);
      this.isMaxAmount = true;
      this.requirMaxAmout = maxAmount;
    } else {
      this.isLessAmount = false;
      this.requirMinAmout="";
      this.isMaxAmount = false;
      this.requirMaxAmout="";
    }
  }

  loginName(){
    this.qdeHttp.roleLogin().subscribe(res => {
      this.firstName =  res['ProcessVariables']['firstName'];
      console.log("ROLE Name: ", this.firstName);
    })
  }

  onPreferredEmailChange(value, emailCtrl) {
    const emailId = value;
    const domain = emailId.split("@")[1];
    for(let i = 0; i < this.preferredEmail.length; i++) {
      if (this.preferredEmail[i]["key"] == domain) {
        console.log("Valid email");
        emailCtrl.control.setErrors({ 'invalidDomain': null });
        emailCtrl.control.updateValueAndValidity();
        break;
      }else {
        console.log("Invalid email");
        emailCtrl.control.setErrors({ 'invalidDomain': true });
      }
    }
  }

}