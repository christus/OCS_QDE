import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.css']
})
export class RegistrationFormComponent implements OnInit {

  Loan_amount = {
    minValue: "50000",
    maxValue: "888888888888",
    maxLength: "12"
  };

  preferredEmail = [
    {
      "key": "Gmail.co",
      "value": "1"
    },
    {
      "key": "gmail.com",
      "value": "2"
    },
    {
      "key": "yahoo.com",
      "value": "3"
    },
    {
      "key": "inswit.com",
      "value": "4"
    },
    {
      "key": "appiyo.com",
      "value": "5"
    },
    {
      "key": "yahoo.co.in",
      "value": "6"
    },
    {
      "key": "zmail.com",
      "value": "8"
    }
  ];
  registration = {

    name: '',
    mobileNo: '',
    address: '',
    pincode: '',
    email: '',
    amount: '',
    newPassword: '',
    confirmPassword: ''
  }
  regexPattern={
    name: "[A-Za-z ]+$",
    mobileNumber:"[1-9][0-9]+",
    address:"^[0-9A-Za-z, _&'/#]+$",
    pincode:"^[1-9][0-9]{5}$",
    email:"^\\w+([\.-]?\\w+)*@\\w+([\.-]?\\w+)*(\\.\\w{2,10})+$",
    amount: "^[\\d]{0,14}([.][0-9]{0,4})?",
    sameDigit: '0{10}|1{10}|2{10}|3{10}|4{10}|5{10}|6{10}|7{10}|8{10}|9{10}',
    otp: "^[0-9]+$",
  };

  errors = {
    createRegister :{
      name:{
        required: "Name is mandatory",
        invalid: "Number and Special Characters not allowed",
        length: "Please provide valid name"
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
      },
      otp:{
        invalid:"Invalid OTP"
      },
      password: {
        required: "Password is mandatory",
        length: "Please provide minimum 6 digit"
      }
    }
  };

  isLessAmount: boolean ;
  requirMinAmout ;
  isMaxAmount: boolean;
  requirMaxAmout;

  registerOTP: boolean;
  otp = '';
  isDisabled: boolean;
  interval;
  timeLeft: number = 30;
  isOTPEmpty: boolean;
  isOTPExpired: boolean;


  constructor() { }

  ngOnInit() {
  }

  checkAmountLimit(event,minAmount?,maxAmount?) {
    console.log("event ",event);
    let n = parseInt(this.getNumberWithoutCommaFormat(event.target.value));
    console.log("event ",n);
    if(minAmount != undefined && n < minAmount ){
      console.log("min ",minAmount);
      this.isLessAmount = true;
      this.requirMinAmout = minAmount;
    } else if(maxAmount!= undefined && n >= maxAmount){
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

  getNumberWithoutCommaFormat(x: string) : string {
    return x ? x+"".split(',').join(''): '';
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
  registrationSave(regForm: NgForm) {

    console.log('Registration Form Details',regForm)
  }

  sendOTP() {
    this.registerOTP = true;
    this.timeout();
  }

  timeout() {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.isDisabled = false;
        this.timeLeft--;
      } else {
        this.isDisabled = true;
      }
    }, 1000)
  }
  stopInterval() {
    clearInterval(this.interval);
    this.timeLeft = 180;
  }

  checkOTPEmpty() {
    if (this.otp == "" || this.otp.length < 4) {
      this.isOTPEmpty = true;
    } else {
      this.isOTPEmpty = false;
    }
  }

  resendOTP() {
    this.isOTPExpired = false;
    this.isOTPEmpty = true;
    this.otp = "";
    this.stopInterval();
    this.registerOTP = true;
    this.timeout();
  }

  validateOTP(form: NgForm) {

    console.log('valid otp',form)
  }

  onBackOTP() {
    console.log("Back button pressed")
    this.otp = "";
    this.registerOTP = false;
    this.isOTPExpired = false;
    this.isOTPEmpty = true;
    this.stopInterval();
  }
}
 


