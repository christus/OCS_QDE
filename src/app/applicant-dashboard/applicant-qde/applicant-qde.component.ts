import { Other } from './../../models/qde.model';
import { Component, OnInit, ViewChild, ElementRef, Renderer2, OnDestroy } from '@angular/core';
    
import * as Swiper from 'swiper/dist/js/swiper.js';
// import { Select2Component } from 'ng2-select2';
import { ActivatedRoute, Router } from '@angular/router';

import { Options } from 'ng5-slider';
import { NgForm } from '@angular/forms';

import Qde from 'src/app/models/qde.model';
import { QdeHttpService } from 'src/app/services/qde-http.service';
import { QdeService } from 'src/app/services/qde.service';
import { CommonDataService } from '../../services/common-data.service';
import { Subscription } from 'rxjs';

interface Item {
  key: string,
  value: number | string
}

@Component({
  selector: 'app-applicant-qde',
  templateUrl: './applicant-qde.component.html',
  styleUrls: ['./applicant-qde.component.css']
})
export class ApplicantQdeComponent implements OnInit, OnDestroy {

  private errors = {

    pan: {
      required: "PAN number is mandatory",
      length: "PAN number must be at least 10 characters",
      invalid: "Invalid PAN Number"
    },
    panDocumentNo: {
      required: "Document number is mandatory",
      length: "Enter 16 Digits Document number",
      invalid: "Invalid Document Number"
    },

    personalDetails: {
      firstName: {
        required: "First Name is mandatory",
        invalid: "Number and Special Characters not allowed"
      },
      middleName: {
        invalid: "Number and Special Characters not allowed"
      },
      lastName: {
        required: "Last Name is mandatory",
        invalid: "Number and Special Characters not allowed"
      }
    },

    contactDetails: {
      preferedEmail: {
        required: "Email Id is mandatory",
        invalid: "Invalid Email ID"
      },
      alternateEmail: {
        invalid: "Invalid Email ID"
      },
      prefferedMobile: {
        required: "10 digit mobile number is mandatory",
        invalid: "Invalid mobile number/Alphabets and Special Characters not allowed"
      },
      alternateMobile: {
        invalid: "Invalid mobile number/Alphabets and Special Characters not allowed"
      },
      stdCode: {
        required: "Std Code is mandatory",
        invalid: "Invalid STD code"
      },
      alternateResidenceNumberStd1:{
        invalid: "Invalid STD code"
      },
      residenceNumber: {
        required: "Residence number is mandatory",
        invalid: "Invalid Residence number/Alphabets and Special Characters not allowed"
      },
      alternateResidenceNumber1:{
        invalid:"Invalid Residence number/Alphabets and Special Characters not allowed"
      }
    },

    commAddress: {
      address1: {
        required: "Address Line 1 is mandatory",
        invalid: "Incomplete address"
      },
      address2: {
        required: "Address Line 2 is mandatory",
        invalid: "Incomplete address"
      },
      pinCode: {
        required: "Pincode is mandatory",
        invalid: "Invalid/Incomplete Pincode",
       
      },
      stateOrCity: {
        required: "State Name / City Name is mandatory",
        invalid: "State Name / City Name is not valid"
      }
    },

    maritialStatus: {
      spouseName: {
        required: "Spouse Name is mandatory",
        invalid: "Number and Special Characters not allowed"
      },
      salaryAmount: {
        required: "Salary Amount is mandatory",
        invalid: "Alphabets and and Special Characters not allowed"
      }
    },

    familyDetails: {
      fatherName:{
        required: "Father's Name is mandatory",
        invalid: "Number and Special Characters not allowed"
      },
      motherName:{
        required: "Mother's Name is mandatory",
        invalid: "Number and Special Characters not allowed"
      },
      motherMaiden:{
        required: "Mother's Maiden Name is mandatory",
        invalid: "Number and Special Characters not allowed"
      }
    },

    other: {

    },

    occupationDetails : {
      companyDetails: {
        required: "Company Name is mandatory",
        invalid: "Company Name is not valid"
      },
      currentExp: {
        required: "Current Experience is mandatory",
        invalid: "Current Experience is not valid"
      },
      totalExp: {
        required: "Total Experience is mandatory",
        invalid: "Total Experience is not valid"
      }
    },

    officialCorrespondence: {
      address1: {
        required: "Office address line1 is mandatory",
        invalid: "Incomplete address"
      },
      address2: {
        required: "Office address line2 is mandatory",
        invalid: "Incomplete address"
      },
      pinCode: {
        required: "Pincode is mandatory",
        invalid: "Invalid/Incomplete Pincode"
      },
      landMark: {
        invalid: "Land mark is not valid"
      },
      stateOrCity: {
        required: "State Name / City Name is mandatory",
        invalid: "State Name / City Name is not valid"
      },
      stdCode: {
        required: "Std Code is mandatory",
        invalid: "Invalid Std Code"
      },
      phoneNumber: {
        required: "Phone Number is mandatory",
        invalid: "Invalid Phone Number"
      },
      email: {
        required: "Office Email Id is mandatory",
        invalid: "Invalid Email Id"
      }
    },
    
    incomeDetails:{
      familyIncome:{
        required: "Annual family Income is mandatory",
        invalid:"Invalid Family Income / Alphabets and Special characters are not allowed"
      },
      monthlyExpenditure:{
        required:"Monthly Expenditure is mandatory",
        invalid:"Invalid Monthly Expenditure / Alphabets and Special characters are not allowed"
      },
      monthlyIncome:{
        required:"Monthly Income is mandatory",
        invalid:"Invalid Monthly Income / Alphabets and Special characters are not allowed"

      }
    },

    organizationDetails: {
      orgName: {
        required: "Organization Name is mandatory",
        invalid: "Invalid Organization Name"
      }
    },
    registeredAddress: {
      address : {
        required: "Registered Address is mandatory",
        invalid: "Registered Address is not valid"
      },
      landMark: {
        invalid: "Land mark is not valid"
      },
      pinCode: {
        required: "Pincode is mandatory",
        invalid: "Invalid/Incomplete Pincode"
      },
      stateOrCity: {
        required: "State Name / City Name is mandatory",
        invalid: "State Name / City Name is not valid"
      }
    },
    corporateAddress: {
      address: {
        required: "Corporate Address is mandatory",
        invalid: "Invalid address"
      },
      landMark: {
        invalid: "Invalid Landmark"
      },
      pinCode: {
        required: "Pincode is mandatory",
        invalid: "Invalid/Incomplete Pincode"
      },
      stateOrCity: {
        required: "State Name / City Name is mandatory",
        invalid: "State Name / City Name is not valid"
      },
      stdNumber:{
        required:"Std Code is mandatory",
        invalid:"Invalid Std Code"
      },
      phoneNumber:{
        required:"Phone number is mandatory",
        invalid:"Invalid Phone number"
      },

      ofcEmail:{
        required:"Office Email is mandatory",
        invalid:"Invalid Email"
      }
    },
    revenueDetails: {
      revenue:{
        required: "revenue is mandatory",
        invalid: "revenue is not valid"
      },
      annualNetincome:{
        required:"Annual Net Income is mandatory",
        invalid:"Invalid Annual Net Income"
      },
      grossTurnover:{
        required: "Gross Turnover is mandatory",
        invalid: "Invalid Gross Turnover"
      }
     }
  };

  regexPattern = {
    mobileNumber: "^[0-9]*$",
    name: "^[A-Za-z, ]+$",
    address : "^[0-9A-Za-z, _&'/#]+$",
    // cityState:"^[0-9A-Za-z, &'#]$",
    pinCode: "^[1-9][0-9]{5}$",
    pan:"[A-Z]{5}[0-9]{4}[A-Z]{1}",
    // amount:"[0-9]{0,17}\.[0-9]{1,4}?$",
    amount:"^[\\d]{0,14}([.][0-9]{0,4})?",

    revenue:"^[1-9][0-9]{0,17}",
    docNumber: "^[a-zA-Z0-9]{0,16}$"

    // revenue:"^[\\d]{0,14}([.][0-9]{0,4})?"
   
  };

  value: Array<number> = [0,0,0,0];

  minValue: number = 1;
  options: Options = {
    floor: 0,
    ceil: 6,
    step: 1,
    showTicksValues: false,
    // showSelectionBar: true,
    showTicks: true,
    getLegend: (sliderVal: number): string => {
      return  sliderVal + '<b>y</b>';
    }
  };

  imageUrl:string = "appiyo/d/drive/upload/";

  myHeaders: { [header: string]: string | string[] } = {
    'Content-Type': 'multipart/form-data',
  };

  private lhsConfig = {
    noSwiping: true,
    noSwipingClass: '',
    onlyExternal: true,
    autoplay: false,
    speed: 900,
    effect: "fade",
    fadeEffect: {
      crossFade: true
    }
  };

  private rhsConfig = {
    noSwiping: true,
    noSwipingClass: '',
    autoplay: false,
    speed: 900,
    effect: "slide"
  };

  private activeTab: number = 0;
  private dob: {day: Item, month: Item, year: Item} = { day: {key: "DD", value: "DD"}, month: {key: "MM", value: "MM"}, year: {key: "YYYY", value: "YYYY"} };
  private residenceNumberStdCode: string = "";
  private residenceNumberPhoneNumber: string = "";
  private alternateResidenceNumberStdCode: string = ""
  private alternateResidenceNumberPhoneNumber: string = ""
  private officialNumberStdCode: string = ""
  private officialNumberPhoneNumber: string = ""
  private addressCityState: string = "";
  private otherReligion: string = "";
  private dateOfIncorporation: {day: string, month: string, year: string} = {day: null, month: null, year: null};
  private registeredAddressCityState: string = "";
  private corporateAddressCityState: string = "";
  private corporateAddressStdNumber: {stdCode: string, phoneNumber: string} = {stdCode: "", phoneNumber: ""};

  private commCityState:string = "";
  // zipCityStateID:string = "";

  @ViewChild('tabContents') private tabContents: ElementRef;
  // @ViewChild(Select2Component) private select2: Select2Component;

  // All Swiper Sliders
  // Will be deprecated in next commit if not used
  // @ViewChild('panSlider1') private panSlider1: ElementRef;
  @ViewChild('panSlider2') private panSlider2: Swiper;
  @ViewChild('panSlider4') private panSlider4: Swiper;
  // @ViewChild('pdSlider1') private pdSlider1: ElementRef;
  // @ViewChild('pdSlider2') private pdSlider2: ElementRef;
  // @ViewChild('maritalSlider1') private maritalSlider1: ElementRef;
  // @ViewChild('maritalSlider2') private maritalSlider2: ElementRef;
  // @ViewChild('familySlider1') private familySlider1: ElementRef;
  // @ViewChild('familySlider2') private familySlider2: ElementRef;

  private isAlternateEmailId: boolean = false;
  private isAlternateMobileNumber: boolean = false;
  private isAlternateResidenceNumber: boolean = false;
  
  private applicantIndividual: boolean = true;


  private isIndividual:boolean = false;
  private YYYY: number = 1900;

  private applicantStatus:string = "" ;



  private fragments = [ 'pan1',
                        'personal',
                        'contact',
                        'address',
                        'marital',
                        'family',
                        'other',
                        'occupation',
                        'correspondence',
                        'income1',
                        'pan2',
                        'organization',
                        'regAddress',
                        'corpAddr',
                        'revenueAddr',
                        'income2',
                      ];

  applicantIndex: number;

  private qde: Qde;

  private religions: Array<any>;
  private qualifications: Array<any>;
  private occupations: Array<any>;
  private residences: Array<any>;
  private titles: Array<any>;
  private maritals: Array<any>;
  private relationships: Array<any>;
  private loanpurposes: Array<any>;
  private categories: Array<any>;
  private genders: Array<any>;
  private constitutions: Array<any>;
  private days: Array<Item>;
  private months: Array<Item>;
  private years: Array<Item>;
  private assessmentMethodology: Array<any>;
  private selectedTitle: Item;
  private selectedReligions: Item;
  private selectedMaritialStatus: Item;
  private selectedCategory: Item;
  private selectedOccupation: Item;
  private selectedResidence: Item;
  private selectedSpouseTitle: Item;
  private selectedFatherTitle: Item;
  private selectedMotherTitle: Item;
  private selectedQualification: Item;
  private selectedConstitution: Item;

  private selectedDocType: Item;
  private selectedConstitutions: Item;
  private selectedBirthPlace: Item;

  private docType: Array<any>;
  private birthPlace: Array<any>;
  private selectedAssesmentMethodology: Array<any>;

  private panslideSub: Subscription;
  constructor(private renderer: Renderer2,
              private route: ActivatedRoute,
              private router: Router,
              private qdeHttp: QdeHttpService,
              private qdeService: QdeService,
              private cds:CommonDataService) {

    this.panslideSub = this.cds.panslide.subscribe(val => {
      this.panslide = val;
    });

    this.cds.panslide2.subscribe(val => {
      this.panslide2 = val;
    });

    this.qdeService.qdeSource.subscribe(val => {
      this.qde = val;
    });



    this.route.fragment.subscribe((fragment) => {
      let localFragment = fragment;

      if(fragment == null) {
        localFragment = this.fragments[0];
      }

      // Replace Fragments in url
      if( this.fragments.includes(localFragment) &&
          this.panslide == false &&
          this.panslide2 == false) {

        // if(this.qde.application.applicants[this.applicantIndex].isIndividual == true) {
        //   if(localFragment == 'pan1') {
        //     this.tabSwitch(0);
        //     this.panSlider2.setIndex(1);
        //   }
        // } else if(this.qde.application.applicants[this.applicantIndex].isIndividual == false) {
        //   if(localFragment == 'pan2') {
        //     this.tabSwitch(10);
        //   }
        // }

        this.activeTab = this.fragments.indexOf(localFragment);
        this.tabSwitch(this.activeTab);
        this.applicantIndividual = (this.activeTab >= 10) ? false: true;
      }
    });
    
    console.log('__________');
  }
  
  private panslide: boolean;
  private panslide2: boolean;

  ngOnInit() {

    console.log(">>", JSON.parse(this.route.snapshot.data.listOfValues['ProcessVariables'].lovs));
    if(this.route.snapshot.data.listOfValues != null && this.route.snapshot.data.listOfValues != undefined) {

      var lov = JSON.parse(this.route.snapshot.data.listOfValues['ProcessVariables'].lovs);
      this.religions = lov.LOVS.religion;
      this.qualifications = lov.LOVS.qualification;
      this.occupations = lov.LOVS.occupation;
      this.residences = lov.LOVS.residence_type;
      this.titles = lov.LOVS.applicant_title || ["Mr", "Mrs", "Ms", "Dr"]; // Hardcoded test value need to be removed
      this.docType = lov.LOVS.document_type;
      this.maritals = lov.LOVS.maritial_status;
      this.relationships = lov.LOVS.relationship;
      this.loanpurposes = lov.LOVS.loan_purpose;
      this.categories = lov.LOVS.category;
      this.genders = lov.LOVS.gender;
      this.constitutions = lov.LOVS.constitution;
      this.assessmentMethodology = lov.LOVS.assessment_methodology;
      this.birthPlace = lov.LOVS.birthplace;

      // List of Values for Date
      this.days = Array.from(Array(31).keys()).map((val, index) => {
        let v = ((index+1) < 10) ? "0"+(index+1) : (index+1)+"";
        return {key: v, value: v};
      });
      this.days.unshift({key: 'DD', value: 'DD'});

      this.months = Array.from(Array(12).keys()).map((val, index) => {
        let v = ((index+1) < 10) ? "0"+(index+1) : (index+1)+"";
        return {key: v, value: v};
      });
      this.months.unshift({key: 'MM', value: 'MM'});

      this.years = Array.from(Array(100).keys()).map((val, index) => {
        let v = (this.YYYY+index)+"";
        return {key: v, value: v};
      });
      this.years.unshift({key: 'YYYY', value: 'YYYY'});


      this.birthPlace = [{"key": "Chennai", "value": "1"},{"key": "Mumbai", "value": "2"},{"key": "Delhi", "value": "3"}];

      this.selectedTitle = this.titles[0];
      this.selectedReligions = this.religions[0];
      this.selectedMaritialStatus = this.maritals[0];
      this.selectedCategory = this.categories[0];
      this.selectedOccupation = this.occupations[0];
      this.selectedResidence = this.residences[0];
      this.selectedSpouseTitle = this.titles[0];
      this.selectedFatherTitle = this.titles[0];
      this.selectedMotherTitle = this.titles[0];
      this.selectedQualification = this.qualifications[0];
      this.selectedConstitution = this.constitutions[0];
      this.selectedDocType = this.docType[0];
      this.selectedConstitutions = this.constitutions[0];
      this.selectedBirthPlace = this.birthPlace[0];


      this.selectedAssesmentMethodology = this.assessmentMethodology[0];
    }

    // Create New Entry
    this.applicantIndex = 0;

    // Write code to get data(LOV) and assign applicantIndex if its new or to update.
    console.log("Applicant Code: ", this.applicantIndex);

    // Check Whether there is qde data to be filled or else Initialize Qde
    this.route.params.subscribe((params) => {

      this.cds.changeApplicationId(params.applicationId);

      console.log("params ", params);
      // Make an http request to get the required qde data and set using setQde
      if(params.applicationId != undefined && params.applicationId != null) {

        // getQdeData
        this.qdeHttp.getQdeData(params.applicationId).subscribe(response => {
          var result = JSON.parse(response["ProcessVariables"]["response"]);
          console.log("Get ", result);

          this.applicantIndex = this.qde.application.applicants.findIndex(val => val.isMainApplicant == true);

          this.qdeService.setQde(result);

          // Will be deprected as soon as API is stable
//--------------------------------------------------------------------
          // try {
          //   if(result.application.applicants[this.applicantIndex].applicantId != null) {
          //     this.qde.application.applicants[this.applicantIndex].applicantId = result.application.applicants[this.applicantIndex].applicantId;
          //   }
          // } catch(e) {}

          // try {
          //   if(result.application.ocsNumber != null) {
          //     this.qde.application.ocsNumber = result.application.ocsNumber;
          //   }
          // } catch(e) {}
          
          // try {
          //   if(result.application.applicants[this.applicantIndex].pan != null) {
          //     this.qde.application.applicants[this.applicantIndex].pan = result.application.applicants[this.applicantIndex].pan;
          //   }
          // } catch(e) {}
          // // try {
          // //   if(result.application.applicants[this.applicantIndex].isMainApplicant != null) {
          // //     this.qde.application.applicants[this.applicantIndex].partnerRelationship = result.application.applicants[this.applicantIndex].isMainApplicant;
          // //   }
          // // } catch(e) {}

          // try {
          //   if(result.application.applicants[this.applicantIndex].isMainApplicant != null) {
          //     this.qde.application.applicants[this.applicantIndex].maritalStatus = result.application.applicants[this.applicantIndex].maritalStatus;
          //   }
          // } catch(e) {}
          // try {
          //   if(result.application.applicants[this.applicantIndex].isIndividual != null) {
          //     this.qde.application.applicants[this.applicantIndex].isIndividual = result.application.applicants[this.applicantIndex].isIndividual;
          //   }
          // } catch(e) {}
          // console.log('result', result);
          // try {
          //   if(result.application.applicants[this.applicantIndex].familyDetails != null) {
          //     this.qde.application.applicants[this.applicantIndex].familyDetails = result.application.applicants[this.applicantIndex].familyDetails;
          //   }
          // } catch(e) {}
          // try {
          //   if(result.application.applicants[this.applicantIndex].other != null) {
          //     this.qde.application.applicants[this.applicantIndex].other = result.application.applicants[this.applicantIndex].other;
          //   }
          // } catch(e) {}
          // try {
          //   if(result.application.applicants[this.applicantIndex].occupation != null) {
          //     this.qde.application.applicants[this.applicantIndex].occupation = result.application.applicants[this.applicantIndex].occupation;
          //   }
          // } catch(e) {}
          // try {
          //   if(result.application.applicants[this.applicantIndex].personalDetails != null) {
          //     this.qde.application.applicants[this.applicantIndex].personalDetails = result.application.applicants[this.applicantIndex].personalDetails;
          //   }
          // } catch(e) {}
          // try {
          //   if(result.application.applicants[this.applicantIndex].contactDetails != null) {
          //     this.qde.application.applicants[this.applicantIndex].contactDetails = result.application.applicants[this.applicantIndex].contactDetails;          
          //   }
          // } catch(e) {}


          try {
            if(result.application.applicants[this.applicantIndex].communicationAddress != null) {
              
              this.commCityState = result.application.applicants[this.applicantIndex].communicationAddress.city + " "+ result.application.applicants[this.applicantIndex].communicationAddress.state;
              this.qde.application.applicants[this.applicantIndex].communicationAddress.city = result.application.applicants[this.applicantIndex].communicationAddress.city;
              this.qde.application.applicants[this.applicantIndex].communicationAddress.state = result.application.applicants[this.applicantIndex].communicationAddress.state;
              this.qde.application.applicants[this.applicantIndex].communicationAddress.cityState = this.commCityState;
              this.qde.application.applicants[this.applicantIndex].communicationAddress.zipcodeId = result.application.applicants[this.applicantIndex].communicationAddress.zipcodeId;
              this.qde.application.applicants[this.applicantIndex].communicationAddress.stateId = result.application.applicants[this.applicantIndex].communicationAddress.stateId;
              this.qde.application.applicants[this.applicantIndex].communicationAddress.cityId = result.application.applicants[this.applicantIndex].communicationAddress.cityId;
            }
          } catch(e) {}
          try {
            if(result.application.applicants[this.applicantIndex].permanentAddress != null) {

              this.commCityState = result.application.applicants[this.applicantIndex].permanentAddress.city + " "+ result.application.applicants[this.applicantIndex].permanentAddress.state;
              this.qde.application.applicants[this.applicantIndex].permanentAddress.city = result.application.applicants[this.applicantIndex].permanentAddress.city;
              this.qde.application.applicants[this.applicantIndex].permanentAddress.state = result.application.applicants[this.applicantIndex].permanentAddress.state;
              this.qde.application.applicants[this.applicantIndex].permanentAddress.cityState = this.commCityState;
              this.qde.application.applicants[this.applicantIndex].permanentAddress.zipcodeId = result.application.applicants[this.applicantIndex].permanentAddress.zipcodeId;
              this.qde.application.applicants[this.applicantIndex].permanentAddress.stateId = result.application.applicants[this.applicantIndex].permanentAddress.stateId;
              this.qde.application.applicants[this.applicantIndex].permanentAddress.cityId = result.application.applicants[this.applicantIndex].permanentAddress.cityId;

            
            }
          } catch(e) {}
          try {
            if(result.application.applicants[this.applicantIndex].residentialAddress != null) {


              this.commCityState = result.application.applicants[this.applicantIndex].residentialAddress.city + " "+ result.application.applicants[this.applicantIndex].residentialAddress.state;
              this.qde.application.applicants[this.applicantIndex].residentialAddress.city = result.application.applicants[this.applicantIndex].residentialAddress.city;
              this.qde.application.applicants[this.applicantIndex].residentialAddress.state = result.application.applicants[this.applicantIndex].residentialAddress.state;
              this.qde.application.applicants[this.applicantIndex].residentialAddress.cityState = this.commCityState;
              this.qde.application.applicants[this.applicantIndex].residentialAddress.zipcodeId = result.application.applicants[this.applicantIndex].residentialAddress.zipcodeId;
              this.qde.application.applicants[this.applicantIndex].residentialAddress.stateId = result.application.applicants[this.applicantIndex].residentialAddress.stateId;
              this.qde.application.applicants[this.applicantIndex].residentialAddress.cityId = result.application.applicants[this.applicantIndex].residentialAddress.cityId;
  
            }
          } catch(e) {}
          try {
            if(result.application.applicants[this.applicantIndex].officialCorrespondence != null) {

              this.commCityState = result.application.applicants[this.applicantIndex].officialCorrespondence.city + " "+ result.application.applicants[this.applicantIndex].officialCorrespondence.state;
              this.qde.application.applicants[this.applicantIndex].officialCorrespondence.city = result.application.applicants[this.applicantIndex].officialCorrespondence.city;
              this.qde.application.applicants[this.applicantIndex].officialCorrespondence.state = result.application.applicants[this.applicantIndex].officialCorrespondence.state;
              this.qde.application.applicants[this.applicantIndex].officialCorrespondence.cityState = this.commCityState;
              this.qde.application.applicants[this.applicantIndex].officialCorrespondence.zipcodeId = result.application.applicants[this.applicantIndex].officialCorrespondence.zipcodeId;
              this.qde.application.applicants[this.applicantIndex].officialCorrespondence.stateId = result.application.applicants[this.applicantIndex].officialCorrespondence.stateId;
              this.qde.application.applicants[this.applicantIndex].officialCorrespondence.cityId = result.application.applicants[this.applicantIndex].officialCorrespondence.cityId;
            }
          } catch(e) {}
          try {
            if(result.application.applicants[this.applicantIndex].organizationDetails != null) {
              this.qde.application.applicants[this.applicantIndex].organizationDetails = result.application.applicants[this.applicantIndex].organizationDetails;
            }
          } catch(e) {}
          try {
            if(result.application.applicants[this.applicantIndex].registeredAddress != null) {

              this.commCityState = result.application.applicants[this.applicantIndex].registeredAddress.city + " "+ result.application.applicants[this.applicantIndex].registeredAddress.state;
              this.qde.application.applicants[this.applicantIndex].registeredAddress.city = result.application.applicants[this.applicantIndex].registeredAddress.city;
              this.qde.application.applicants[this.applicantIndex].registeredAddress.state = result.application.applicants[this.applicantIndex].registeredAddress.state;
              this.qde.application.applicants[this.applicantIndex].registeredAddress.cityState = this.commCityState;
              this.qde.application.applicants[this.applicantIndex].registeredAddress.zipcodeId = result.application.applicants[this.applicantIndex].registeredAddress.zipcodeId;
              this.qde.application.applicants[this.applicantIndex].registeredAddress.stateId = result.application.applicants[this.applicantIndex].registeredAddress.stateId;
              this.qde.application.applicants[this.applicantIndex].registeredAddress.cityId = result.application.applicants[this.applicantIndex].registeredAddress.cityId;
            }
          } catch(e) {}
          
          try {
            if(result.application.applicants[this.applicantIndex].corporateAddress != null) {

              this.commCityState = result.application.applicants[this.applicantIndex].corporateAddress.city + " "+ result.application.applicants[this.applicantIndex].corporateAddress.state;
              this.qde.application.applicants[this.applicantIndex].corporateAddress.city = result.application.applicants[this.applicantIndex].corporateAddress.city;
              this.qde.application.applicants[this.applicantIndex].corporateAddress.state = result.application.applicants[this.applicantIndex].corporateAddress.state;
              this.qde.application.applicants[this.applicantIndex].corporateAddress.cityState = this.commCityState;
              this.qde.application.applicants[this.applicantIndex].corporateAddress.zipcodeId = result.application.applicants[this.applicantIndex].corporateAddress.zipcodeId;
              this.qde.application.applicants[this.applicantIndex].corporateAddress.stateId = result.application.applicants[this.applicantIndex].corporateAddress.stateId;
              this.qde.application.applicants[this.applicantIndex].corporateAddress.cityId = result.application.applicants[this.applicantIndex].corporateAddress.cityId;
            }
          } catch(e) {}
          try {
            if(result.application.applicants[this.applicantIndex].revenueDetails != null) {
              this.qde.application.applicants[this.applicantIndex].revenueDetails = result.application.applicants[this.applicantIndex].revenueDetails;
            }
          } catch(e) {}
          try {
            if(result.application.applicants[this.applicantIndex].incomeDetails != null) {
              this.qde.application.applicants[this.applicantIndex].incomeDetails = result.application.applicants[this.applicantIndex].incomeDetails;
            }
          } catch(e) {}
          try {
            if(result.application.applicants[this.applicantIndex].documents != null) {
              this.qde.application.applicants[this.applicantIndex].documents = result.application.applicants[this.applicantIndex].documents;
            }
          } catch(e) {}
          try {
            if(result.application.applicants[this.applicantIndex].isMainApplicant != null) {
              this.qde.application.applicants[this.applicantIndex].isMainApplicant = result.application.applicants[this.applicantIndex].isMainApplicant;
            }
          } catch(e) {}
//----------------------------------------------------------

//           this.qdeService.setQde(this.qde); // Soon it will be this.qdeService.setQde(result);
// console.log("QDE", this.qde);
          // Personal Details Title
          if( ! isNaN(parseInt(this.qde.application.applicants[this.applicantIndex].personalDetails.title)) ) {
            this.selectedTitle = this.titles[(parseInt(this.qde.application.applicants[this.applicantIndex].personalDetails.title))-1];
          }

          // Personal Details Qualification


          if( ! isNaN(parseInt(this.qde.application.applicants[this.applicantIndex].personalDetails.qualification)) ) {
            this.selectedQualification = this.qualifications[(parseInt(this.qde.application.applicants[this.applicantIndex].personalDetails.qualification))-1];
          }

          // Personal Details Day
          if( ! isNaN(parseInt(this.qde.application.applicants[this.applicantIndex].personalDetails.dob.split('/')[2])) ) {
            this.dob.day = this.days[parseInt(this.qde.application.applicants[this.applicantIndex].personalDetails.dob.split('/')[2])];
          }

          // Personal Details Month
          if( ! isNaN(parseInt(this.qde.application.applicants[this.applicantIndex].personalDetails.dob.split('/')[1])) ) {
            this.dob.month = this.months[parseInt(this.qde.application.applicants[this.applicantIndex].personalDetails.dob.split('/')[1])];
          }

          // Personal Details Year
          if( ! isNaN(parseInt(this.qde.application.applicants[this.applicantIndex].personalDetails.dob.split('/')[0])) ) {
            this.dob.year = this.years.find(val => this.qde.application.applicants[this.applicantIndex].personalDetails.dob.split('/')[0] == val.value);
          }

          // Date of Incorporation

          if( ! isNaN(parseInt(this.qde.application.applicants[this.applicantIndex].organizationDetails.dateOfIncorporation.split('/')[2])) ) {
            this.dob.day = this.days[parseInt(this.qde.application.applicants[this.applicantIndex].organizationDetails.dateOfIncorporation.split('/')[2])];
          }

          // Incorporation Month
          if( ! isNaN(parseInt(this.qde.application.applicants[this.applicantIndex].organizationDetails.dateOfIncorporation.split('/')[1])) ) {
            this.dob.month = this.months[parseInt(this.qde.application.applicants[this.applicantIndex].organizationDetails.dateOfIncorporation.split('/')[1])];
          }

          // Incorporation Year
          if( ! isNaN(parseInt(this.qde.application.applicants[this.applicantIndex].organizationDetails.dateOfIncorporation.split('/')[0])) ) {
            this.dob.year = this.years.find(val => this.qde.application.applicants[this.applicantIndex].organizationDetails.dateOfIncorporation.split('/')[0] == val.value);
          }

          // Communication address
          if( ! isNaN(parseInt(this.qde.application.applicants[this.applicantIndex].communicationAddress.residentialStatus)) ) {
            this.selectedResidence = this.maritals[(parseInt(this.qde.application.applicants[this.applicantIndex].communicationAddress.residentialStatus))];
          }

          // Date of Incorporation

          if( ! isNaN(parseInt(this.qde.application.applicants[this.applicantIndex].organizationDetails.dateOfIncorporation.split('/')[2])) ) {
            this.dob.day = this.days[parseInt(this.qde.application.applicants[this.applicantIndex].organizationDetails.dateOfIncorporation.split('/')[2])];
          }

          // Incorporation Month
          if( ! isNaN(parseInt(this.qde.application.applicants[this.applicantIndex].organizationDetails.dateOfIncorporation.split('/')[1])) ) {
            this.dob.month = this.months[parseInt(this.qde.application.applicants[this.applicantIndex].organizationDetails.dateOfIncorporation.split('/')[1])];
          }

          // Incorporation Year
          if( ! isNaN(parseInt(this.qde.application.applicants[this.applicantIndex].organizationDetails.dateOfIncorporation.split('/')[0])) ) {
            this.dob.year = this.years.find(val => this.qde.application.applicants[this.applicantIndex].organizationDetails.dateOfIncorporation.split('/')[0] == val.value);
          }

          // Communication address
          if( ! isNaN(parseInt(this.qde.application.applicants[this.applicantIndex].communicationAddress.residentialStatus)) ) {
            this.selectedResidence = this.maritals[(parseInt(this.qde.application.applicants[this.applicantIndex].communicationAddress.residentialStatus))];
          }

          //Marital status

          if( ! isNaN(parseInt(this.qde.application.applicants[this.applicantIndex].maritalStatus.status)) ) {
            this.selectedMaritialStatus = this.maritals[(parseInt(this.qde.application.applicants[this.applicantIndex].maritalStatus.status))-1];
          }

          console.log("this.selectedSpouseTitle", this.qde.application.applicants[this.applicantIndex].maritalStatus.spouseTitle);
          if( ! isNaN(parseInt(this.qde.application.applicants[this.applicantIndex].maritalStatus.spouseTitle)) ) {
              this.selectedSpouseTitle = this.titles[(parseInt(this.qde.application.applicants[this.applicantIndex].maritalStatus.spouseTitle))-1];
          }


        if( ! isNaN(parseInt(this.qde.application.applicants[this.applicantIndex].familyDetails.motherTitle)) ) {
          this.selectedMotherTitle = this.titles[(parseInt(this.qde.application.applicants[this.applicantIndex].familyDetails.motherTitle))-1];
        }


        if( ! isNaN(parseInt(this.qde.application.applicants[this.applicantIndex].familyDetails.fatherTitle)) ) {
          this.selectedFatherTitle  = this.titles[(parseInt(this.qde.application.applicants[this.applicantIndex].familyDetails.fatherTitle))-1];
        }

/////Other//////
        if( ! isNaN(parseInt(this.qde.application.applicants[this.applicantIndex].other.religion)) ) {
          this.selectedReligions = this.religions[(parseInt(this.qde.application.applicants[this.applicantIndex].other.religion))-1];
        }


        if( ! isNaN(parseInt(this.qde.application.applicants[this.applicantIndex].other.category)) ) {
          this.selectedCategory  = this.categories[(parseInt(this.qde.application.applicants[this.applicantIndex].other.category))-1];
        }

/////Occupation details///////
        if( ! isNaN(parseInt(this.qde.application.applicants[this.applicantIndex].occupation.occupationType)) ) {
          this.selectedOccupation = this.religions[(parseInt(this.qde.application.applicants[this.applicantIndex].occupation.occupationType))-1];
        }

///// Assesment methodology /////
      if( ! isNaN(parseInt(this.qde.application.applicants[this.applicantIndex].incomeDetails.assessmentMethodology)) ) {
        this.selectedAssesmentMethodology = this.religions[(parseInt(this.qde.application.applicants[this.applicantIndex].incomeDetails.assessmentMethodology))-1];
      }

///// Communication Address ////



          console.log('this is coming first', this.panslide, this.qde.application.applicants[this.applicantIndex].isIndividual);
          // Incoming from create Individual Pan


///// Communication Address - Residential Status /////
      if( ! isNaN(parseInt(this.qde.application.applicants[this.applicantIndex].communicationAddress.residentialStatus)) ) {
        this.selectedResidence = this.residences[(parseInt(this.qde.application.applicants[this.applicantIndex].communicationAddress.residentialStatus))];
      }

      

      console.log('this is coming first', this.panslide, this.qde.application.applicants[this.applicantIndex].isIndividual);

      // Incoming from create Individual Pan
      if(this.panslide == true && this.qde.application.applicants[this.applicantIndex].isIndividual == true) {
        this.panSlider2.setIndex(2);
        console.log("test", this.panslide2);
      }
      // Incoming from create Non Individual Pan
      else if(this.panslide2 == true && this.qde.application.applicants[this.applicantIndex].isIndividual == false) {
        this.tabSwitch(11);
      }
      else if(this.panslide == false && this.qde.application.applicants[this.applicantIndex].isIndividual == true) {
        this.tabSwitch(0);
        this.panSlider2.setIndex(1);
      }
      else if(this.panslide2 == false && this.qde.application.applicants[this.applicantIndex].isIndividual == false) {
        this.tabSwitch(10);
      }

        this.cds.changePanSlide(false);
        this.cds.changePanSlide2(false);

        this.initializeVariables();
      });
    } else {
      this.initializeVariables();
    }
    console.log("last on init", this.qde);
    });


    // Some Initialization for HTML
    this.qde.application.applicants[this.applicantIndex].isMainApplicant = true;

    // if( this.qde.application.applicants[this.applicantIndex].personalDetails.dob.split("-")[0] == "" ||
    //     this.qde.application.applicants[this.applicantIndex].personalDetails.dob.split("-")[0] == undefined) {
    //   this.dob.day = this.qde.application.applicants[this.applicantIndex].personalDetails.dob.split("-")[0];
    // }

    // if( this.qde.application.applicants[this.applicantIndex].personalDetails.dob.split("-")[1] == "" ||
    //     this.qde.application.applicants[this.applicantIndex].personalDetails.dob.split("-")[1] == undefined) {
    //   this.dob.month = this.qde.application.applicants[this.applicantIndex].personalDetails.dob.split("-")[1];
    // }

    // if( this.qde.application.applicants[this.applicantIndex].personalDetails.dob.split("-")[2] == "" ||
    //     this.qde.application.applicants[this.applicantIndex].personalDetails.dob.split("-")[2] == undefined) {
    //   this.dob.year = this.qde.application.applicants[this.applicantIndex].personalDetails.dob.split("-")[2];
    // }
  }

  valuechange(newValue, valueIndex) {
    console.log(newValue);
    this.value[valueIndex] = newValue;
  }

  /**
   * Use to sync between lhs and rhs sliders
   * @param swiperInstance RHS Swiper Instance
   */
  goToNextSlide(swiperInstance: Swiper) {

    // if (form && !form.valid) {
    //   return;
    // }

    // Create ngModel of radio button in future
    swiperInstance.nextSlide();
  }

  /**
   * Use to sync between lhs and rhs sliders
   * @param swiperInstance LHS Swiper Instance
   */
  slideNextTransitionStart(swiperInstance: Swiper) {
    console.log(swiperInstance.getIndex());
    swiperInstance.nextSlide();
  }

  
  /**
   * Use to sync between lhs and rhs sliders
   * @param swiperInstance RHS Swiper Instance
   */
  goToPrevSlide(swiperInstance: Swiper) {

    // Create ngModel of radio button in future
    swiperInstance.prevSlide();
  }

  /**
   * Use to sync between lhs and rhs sliders
   * @param swiperInstance LHS Swiper Instance
   */
  slidePrevTransitionStart(swiperInstance: Swiper) {
    swiperInstance.prevSlide();
  }

  tabSwitch(tabIndex ?: number) {

    // Check for invalid tabIndex
    if(tabIndex < this.fragments.length) {

      this.router.navigate([], { fragment: this.fragments[tabIndex]});

    }
  }

  onBackButtonClick(swiperInstance ?: Swiper) {

    if(this.activeTab > 0) {
      if(swiperInstance != null && swiperInstance.getIndex() > 0) {
        // Go to Previous Slide
        this.goToPrevSlide(swiperInstance);
      } else {
        // Go To Previous Tab
        this.tabSwitch(this.activeTab - 1);
      }
    }
  }

  addRemoveEmailField() {
    this.isAlternateEmailId = !this.isAlternateEmailId;
  }

  addRemoveMobileNumberField() {
    this.isAlternateMobileNumber = !this.isAlternateMobileNumber;
  }

  addRemoveResidenceNumberField() {
    this.isAlternateResidenceNumber = !this.isAlternateResidenceNumber;
  }

  //-------------------------------------------------------------
  // PAN
  //-------------------------------------------------------------
  submitPanNumber(form: NgForm, swiperInstance ?: Swiper) {

    event.preventDefault();

    if (form && !form.valid) {
      return;
    }

    this.qde.application.applicants[this.applicantIndex].pan.panNumber = form.value.pan;
    this.qde.application.applicants[this.applicantIndex].pan.docType = form.value.docType.value;
    this.qde.application.applicants[this.applicantIndex].pan.docNumber = form.value.docNumber;

    console.log("Get Filtered JSON: ", this.qdeService.getFilteredJson(this.qde));
    this.qdeHttp.createOrUpdatePanDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
      // If successful
      if(response["ProcessVariables"]["status"]) {
        let result = this.parseJson(response["ProcessVariables"]["response"]);

        this.qde.application.ocsNumber = result["application"]["ocsNumber"];
        this.qde.application.applicationId = result["application"]["applicationId"];
       
        let applicants = result["application"]["applicants"];

        let isApplicantPresent:boolean = false;

        if(applicants.length > 0) {
          // isApplicantPresent = applicants[this.applicantIndex].hasOwnProperty('applicantId');
          this.qde.application.applicants[this.applicantIndex].applicantId =  applicants[this.applicantIndex]["applicantId"];
        }else {
          this.tabSwitch(1);
            return;
        }          

        
        //this.goToNextSlide(swiperInstance);

        this.cds.changePanSlide(true);
        this.router.navigate(['/applicant/'+this.qde.application.applicationId], {fragment: "pan1"});
        
      } else {
        // Throw Invalid Pan Error
      }
    }, (error) => {
      console.log('error ', error);
      alert("error"+error);
      // Throw Request Failure Error
    });
  }


  //-------------------------------------------------------------
  // PAN
  //-------------------------------------------------------------

  submitOrgPanNumber(form: NgForm, swiperInstance ?: Swiper) {
// alert(1111);
    event.preventDefault();

    if (form && !form.valid) {
      return;
    }

    this.qde.application.applicants[this.applicantIndex].pan.panNumber = form.value.pan;
    // this.qde.application.applicants[this.applicantIndex].pan.docType = form.value.docType.value;
    // this.qde.application.applicants[this.applicantIndex].pan.docNumber = form.value.docNumber;

    this.qdeHttp.createOrUpdatePanDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
      // If successful
      if(response["ProcessVariables"]["status"]) {
        let result = this.parseJson(response["ProcessVariables"]["response"]);
       


        this.qde.application.ocsNumber = result["application"]["ocsNumber"];
        this.qde.application.applicationId = result["application"]["applicationId"];
        
        let applicants = result["application"]["applicants"];

        let isApplicantPresent:boolean = false;

        if(applicants.length > 0) {
          // isApplicantPresent = applicants[this.applicantIndex].hasOwnProperty('applicantId');
          this.qde.application.applicants[this.applicantIndex].applicantId =  applicants[this.applicantIndex]["applicantId"];
        }else {
          this.tabSwitch(11);
            return;
        }          

        // this.cds.changePanSlide2(true);
        // this.router.navigate(['/applicant/'+this.qde.application.applicationId], {fragment: "organization"});

        this.cds.changePanSlide2(true);
        this.router.navigate(['/applicant/'+this.qde.application.applicationId], {fragment: "pan2"});
        
      } else {
        // Throw Invalid Pan Error
      }
    }, (error) => {
      console.log('error ', error);
      alert("error"+error);
      // Throw Request Failure Error
    });   
  }

  
  //-------------------------------------------------------------
  

  //-------------------------------------------------------------
  // Personal Details
  //-------------------------------------------------------------
  submitNameDetails(form: NgForm, swiperInstance ?: Swiper) {

    event.preventDefault();

    if (form && !form.valid) {
      return;
    }

    this.qde.application.applicants[this.applicantIndex].personalDetails.applicantStatus = this.applicantStatus;
    this.qde.application.applicants[this.applicantIndex].personalDetails.title = form.value.title.value;
    this.qde.application.applicants[this.applicantIndex].personalDetails.firstName = form.value.firstName;
    this.qde.application.applicants[this.applicantIndex].personalDetails.middleName = form.value.middleName;
    this.qde.application.applicants[this.applicantIndex].personalDetails.lastName = form.value.lastName;

    this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
      // If successful
      if(response["ProcessVariables"]["status"]) {
        this.goToNextSlide(swiperInstance);
      } else {
        // Throw Invalid Pan Error
      }
    }, (error) => {
      console.log("response : ", error);
    });
    
  }

  //-------------------------------------------------------------
  submitResidentialNon(value, swiperInstance ?: Swiper) {

    this.qde.application.applicants[this.applicantIndex].personalDetails.applicantStatus = value;


    this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
      // If successful
      if(response["ProcessVariables"]["status"]) {
        this.goToNextSlide(swiperInstance);
      } else {
        // Throw Invalid Pan Error
      }
    }, (error) => {
      console.log("response : ", error);
    });
    
  }

  submitGenderDetails(form: NgForm, swiperInstance ?: Swiper) {
    event.preventDefault();

    if (form && !form.valid) {
      return;
    }

    this.qde.application.applicants[this.applicantIndex].personalDetails.gender = form.value.gender;

    console.log(this.qde.application.applicants[this.applicantIndex]);

    this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
      // If successful
      if(response["ProcessVariables"]["status"]) {
        this.goToNextSlide(swiperInstance);
      } else {
        // Throw Invalid Pan Error
      }
    }, (error) => {
      console.log("response : ", error);
    });
    
  }

  //-------------------------------------------------------------

  submitQualificationDetails(form: NgForm, swiperInstance ?: Swiper) {
    event.preventDefault();

    if (form && !form.valid) {
      return;
    }

    this.qde.application.applicants[this.applicantIndex].personalDetails.qualification = form.value.qualification.value;

    console.log(this.qde.application.applicants[this.applicantIndex]);

    this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
      // If successful
      if(response["ProcessVariables"]["status"]) {
        this.goToNextSlide(swiperInstance);
      } else {
        // Throw Invalid Pan Error
      }
    }, (error) => {
      console.log("response : ", error);
    });
    
  }

  submitDobDetails(form: NgForm, swiperInstance ?: Swiper) {
    event.preventDefault();

    if (form && !form.valid) {
      return;
    }

    this.qde.application.applicants[this.applicantIndex].personalDetails.dob = form.value.year.value+'-'+form.value.month.value+'-'+form.value.day.value;
    this.qde.application.applicants[this.applicantIndex].personalDetails.birthPlace = form.value.birthPlace.value;

    console.log(this.qde.application.applicants[this.applicantIndex]);

    this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
      // If successful
      if(response["ProcessVariables"]["status"]) {
        this.tabSwitch(2);
      } else {
        // Throw Invalid Pan Error
      }
    }, (error) => {
      console.log("response : ", error);
    });
  }
  //-------------------------------------------------------------


  //-------------------------------------------------------------
  // Contact Details
  //-------------------------------------------------------------
  submitContactDetails(form: NgForm) {

    event.preventDefault();

    if (form && !form.valid) {
      return;
    }

    this.qde.application.applicants[this.applicantIndex].contactDetails.preferredEmailId = form.value.preferEmailId;
    this.qde.application.applicants[this.applicantIndex].contactDetails.alternateEmailId = form.value.alternateEmailId;
    this.qde.application.applicants[this.applicantIndex].contactDetails.mobileNumber = form.value.mobileNumber;
    this.qde.application.applicants[this.applicantIndex].contactDetails.alternateMobileNumber = form.value.alternateMobileNumber;
    this.qde.application.applicants[this.applicantIndex].contactDetails.residenceNumber = form.value.residenceNumber1+'-'+form.value.residenceNumber2;
    this.qde.application.applicants[this.applicantIndex].contactDetails.alternateResidenceNumber = form.value.alternateResidenceNumberStd1+'-'+form.value.alternateResidenceNumber2;



    console.log(this.qde.application.applicants[this.applicantIndex]);
    this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
      // If successful
      if(response["ProcessVariables"]["status"]) {
        this.tabSwitch(3);
      } else {
        // Throw Invalid Pan Error
      }
    }, (error) => {
      console.log("response : ", error);
    });

  }

  onPinCodeChange(event, screenName) {
      console.log(event.target.value);
       let zipCode= event.target.value
       this.qdeHttp.getCityAndState(zipCode).subscribe((response) => {
          console.log(JSON.parse(response["ProcessVariables"]["response"]));
          var result = JSON.parse(response["ProcessVariables"]["response"]);

          this.commCityState = "";

          if(result.city != null && result.state != null && result.city != "" && result.state != "") {
            this.commCityState = result.city +" "+ result.state;
          }else {
            alert("Pin code not available / enter proper pincode")
          }
     

          if(screenName == "communicationAddress") {

            this.qde.application.applicants[this.applicantIndex].communicationAddress.zipcodeId = result.zipcodeId;
            this.qde.application.applicants[this.applicantIndex].communicationAddress.stateId = result.stateId;
            this.qde.application.applicants[this.applicantIndex].communicationAddress.cityId = result.cityId;

            this.qde.application.applicants[this.applicantIndex].communicationAddress.city = result.city;
            this.qde.application.applicants[this.applicantIndex].communicationAddress.state = result.state;
            this.qde.application.applicants[this.applicantIndex].communicationAddress.cityState = this.commCityState;
  
  
          }


          if(screenName == "permanentAddress") {

            this.qde.application.applicants[this.applicantIndex].permanentAddress.zipcodeId = result.zipcodeId;
            this.qde.application.applicants[this.applicantIndex].permanentAddress.stateId = result.stateId;
            this.qde.application.applicants[this.applicantIndex].permanentAddress.cityId = result.cityId;

            this.qde.application.applicants[this.applicantIndex].permanentAddress.city = result.city;
            this.qde.application.applicants[this.applicantIndex].permanentAddress.state = result.state;
            this.qde.application.applicants[this.applicantIndex].permanentAddress.cityState = this.commCityState;
  

          }


          if(screenName == "officialCorrespondence") {

            this.qde.application.applicants[this.applicantIndex].officialCorrespondence.zipcodeId = result.zipcodeId;
            this.qde.application.applicants[this.applicantIndex].officialCorrespondence.stateId = result.stateId;
            this.qde.application.applicants[this.applicantIndex].officialCorrespondence.cityId = result.cityId;

            this.qde.application.applicants[this.applicantIndex].officialCorrespondence.city = result.city;
            this.qde.application.applicants[this.applicantIndex].officialCorrespondence.state = result.state;
            this.qde.application.applicants[this.applicantIndex].officialCorrespondence.cityState = this.commCityState;

          }

          if(screenName == "registeredAddress") {

            this.qde.application.applicants[this.applicantIndex].registeredAddress.zipcodeId = result.zipcodeId;
            this.qde.application.applicants[this.applicantIndex].registeredAddress.stateId = result.stateId;
            this.qde.application.applicants[this.applicantIndex].registeredAddress.cityId = result.cityId;

            this.qde.application.applicants[this.applicantIndex].registeredAddress.city = result.city;
            this.qde.application.applicants[this.applicantIndex].registeredAddress.state = result.state;
            this.qde.application.applicants[this.applicantIndex].registeredAddress.cityState = this.commCityState;


          }

          if(screenName == "corporateAddress") {

            this.qde.application.applicants[this.applicantIndex].corporateAddress.zipcodeId = result.zipcodeId;
            this.qde.application.applicants[this.applicantIndex].corporateAddress.stateId = result.stateId;
            this.qde.application.applicants[this.applicantIndex].corporateAddress.cityId = result.cityId;


            this.qde.application.applicants[this.applicantIndex].corporateAddress.city = result.city;
            this.qde.application.applicants[this.applicantIndex].corporateAddress.state = result.state;
            this.qde.application.applicants[this.applicantIndex].corporateAddress.cityState = this.commCityState;


          }
          

       })
  }
  //-------------------------------------------------------------

  //-------------------------------------------------------------
  // Communication Details
  //-------------------------------------------------------------
  submitCommunicationAddressDetails(form: NgForm) {

  //  event.preventDefault();

    if (form && !form.valid) {
      return;
    }



    console.log("Comm Addr ", this.qde.application.applicants[this.applicantIndex].communicationAddress);


    this.qde.application.applicants[this.applicantIndex].communicationAddress.residentialStatus = form.value.residentialStatus.value;
    this.qde.application.applicants[this.applicantIndex].communicationAddress.addressLineOne = form.value.addressLineOne;
    this.qde.application.applicants[this.applicantIndex].communicationAddress.addressLineTwo = form.value.addressLineTwo;
    this.qde.application.applicants[this.applicantIndex].communicationAddress.zipcodeId = this.qde.application.applicants[this.applicantIndex].communicationAddress.zipcodeId;
    this.qde.application.applicants[this.applicantIndex].communicationAddress.cityId = this.qde.application.applicants[this.applicantIndex].communicationAddress.cityId;
    this.qde.application.applicants[this.applicantIndex].communicationAddress.stateId = this.qde.application.applicants[this.applicantIndex].communicationAddress.stateId;
    this.qde.application.applicants[this.applicantIndex].communicationAddress.numberOfYearsInCurrentResidence = form.value.numberOfYearsInCurrentResidence;
    this.qde.application.applicants[this.applicantIndex].communicationAddress.permanentAddress = form.value.permanentAddress;
    this.qde.application.applicants[this.applicantIndex].communicationAddress.preferredMailingAddress = form.value.prefredMail;


    this.qde.application.applicants[this.applicantIndex].permanentAddress.addressLineOne = form.value.pAddressLineOne;
    this.qde.application.applicants[this.applicantIndex].permanentAddress.addressLineTwo = form.value.pAddressLineTwo;
    this.qde.application.applicants[this.applicantIndex].permanentAddress.zipcodeId = this.qde.application.applicants[this.applicantIndex].permanentAddress.zipcodeId;
    this.qde.application.applicants[this.applicantIndex].permanentAddress.cityId = this.qde.application.applicants[this.applicantIndex].permanentAddress.cityId;
    this.qde.application.applicants[this.applicantIndex].permanentAddress.stateId = this.qde.application.applicants[this.applicantIndex].permanentAddress.stateId;
    this.qde.application.applicants[this.applicantIndex].permanentAddress.numberOfYearsInCurrentResidence = form.value.numberOfYearsInCurrentResidence;
    

    console.log(this.qde.application.applicants[this.applicantIndex].communicationAddress);

    this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
      // If successful
      if(response["ProcessVariables"]["status"]) {
        this.tabSwitch(4);
      } else {
        // Throw Invalid Pan Error
      }
    }, (error) => {
      console.log("response : ", error);
    });

  }
  //-------------------------------------------------------------


  //-------------------------------------------------------------
  // Marital Status
  //-------------------------------------------------------------
  submitMaritalStatus(form: NgForm, swiperInstance ?: Swiper) {

    if (form && !form.valid) {
      return;
    }

    this.qde.application.applicants[this.applicantIndex].maritalStatus.status = form.value.maritalStatus.value;


    console.log(this.qde.application.applicants[this.applicantIndex].maritalStatus);
    this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
      // If successful
      if(response["ProcessVariables"]["status"]) {
        if(form.value.maritalStatus.value == "2") {
          this.goToNextSlide(swiperInstance);
        } else {
          this.tabSwitch(5);
        }
        this.goToNextSlide(swiperInstance);
      } else {
        // Throw Invalid Pan Error
      }
    }, (error) => {
      console.log("response : ", error);
      //this.goToNextSlide(swiperInstance);
    });

  }

  submitSpouseName(form: NgForm, swiperInstance ?: Swiper) {

    if (form && !form.valid) {
      return;
    }

    this.qde.application.applicants[this.applicantIndex].maritalStatus.spouseTitle = form.value.spouseTitle.value;
    this.qde.application.applicants[this.applicantIndex].maritalStatus.firstName = form.value.firstName;

    console.log(this.qde.application.applicants[this.applicantIndex].maritalStatus);
    this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
      // If successful
      if(response["ProcessVariables"]["status"]) {
        this.goToNextSlide(swiperInstance);
      } else {
        // Throw Invalid Pan Error
      }
    }, (error) => {
      console.log("response : ", error);
     // alert("error"+error.);
    });

  }


  submitSpouseEarning(form: NgForm, swiperInstance ?: Swiper) {

    if (form && !form.valid) {
      return;
    }

    this.qde.application.applicants[this.applicantIndex].maritalStatus.earning = form.value.earning;

    console.log(this.qde.application.applicants[this.applicantIndex].maritalStatus);
    this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
      // If successful
      if(response["ProcessVariables"]["status"]) {
        this.goToNextSlide(swiperInstance);
      } else {
        // Throw Invalid Pan Error
      }
    }, (error) => {
      console.log("response : ", error);
      alert("error"+error);
    });

  }

  submitSpouseEarningAmt(form: NgForm, swiperInstance ?: Swiper) {

    if (form && !form.valid) {
      return;
    }

    // Amount should be number
    if(isNaN(parseInt(form.value.amount))) {
      return;
    }

    this.qde.application.applicants[this.applicantIndex].maritalStatus.amount = form.value.amount;

    console.log(this.qde.application.applicants[this.applicantIndex].maritalStatus);

    this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
      // If successful
      if(response["ProcessVariables"]["status"]) {
        this.tabSwitch(5);
      } else {
        // Throw Invalid Pan Error
      }
    }, (error) => {
      console.log("response : ", error);
      this.tabSwitch(5);
    });

  }

  //-------------------------------------------------------------


  //-------------------------------------------------------------
  // Family Details
  //-------------------------------------------------------------
  submitFamilyForm1(form: NgForm, swiperInstance ?: Swiper) {

    if (form && !form.valid) {
      return;
    }

    this.qde.application.applicants[this.applicantIndex].familyDetails.numberOfDependents = form.value.numberOfDependents;

    console.log(this.qde.application.applicants[this.applicantIndex].familyDetails);

    this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
      // If successful
      if(response["ProcessVariables"]["status"]) {
        this.goToNextSlide(swiperInstance);
      } else {
        // Throw Invalid Pan Error
      }
    }, (error) => {
      console.log("response : ", error);
    });

  }

  submitFamilyForm2(form: NgForm, swiperInstance ?: Swiper) {

    if (form && !form.valid) {
      return;
    }

    this.qde.application.applicants[this.applicantIndex].familyDetails.fatherTitle = form.value.fatherTitle.value;
    this.qde.application.applicants[this.applicantIndex].familyDetails.fatherName = form.value.fatherName;
    this.qde.application.applicants[this.applicantIndex].familyDetails.motherTitle = form.value.motherTitle.value;
    this.qde.application.applicants[this.applicantIndex].familyDetails.motherName = form.value.motherName;
    this.qde.application.applicants[this.applicantIndex].familyDetails.motherMaidenName = form.value.motherMaidenName;

    console.log(this.qde.application.applicants[this.applicantIndex].familyDetails);

    this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
      // If successful
      if(response["ProcessVariables"]["status"]) {
        this.tabSwitch(6);
      } else {
        // Throw Invalid Pan Error
      }
    }, (error) => {
      console.log("response : ", error);
    });

  }
  //-------------------------------------------------------------


  //-------------------------------------------------------------
  // Other Details
  //-------------------------------------------------------------
  submitOtherForm(form: NgForm) {

    if (form && !form.valid) {
      return;
    }



    this.qde.application.applicants[this.applicantIndex].other.religion = form.value.religion.value;
    this.qde.application.applicants[this.applicantIndex].other.category = form.value.category.value;

    // this.qde.application.applicants[this.applicantIndex].familyDetails.fatherTitle = form.value.fatherTitle;

    // console.log(this.qde.application.applicants[this.applicantIndex].familyDetails);

    this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
      // If successful
      if(response["ProcessVariables"]["status"]) {
        this.tabSwitch(7);
      } else {
        // Throw Invalid Pan Error
      }
    }, (error) => {
      console.log("response : ", error);
      alert("error"+error);
    });

  }
  //-------------------------------------------------------------


  //-------------------------------------------------------------
  // Occupation Details
  //-------------------------------------------------------------
  submitOccupationDetails(form: NgForm) {
    if (form && !form.valid) {
      return;
    }

  
    this.qde.application.applicants[this.applicantIndex].occupation.occupationType = form.value.occupationType.value;
    this.qde.application.applicants[this.applicantIndex].occupation.companyName = form.value.companyName;
    this.qde.application.applicants[this.applicantIndex].occupation.numberOfYearsInCurrentCompany = form.value.numberOfYearsInCurrentCompany;
    this.qde.application.applicants[this.applicantIndex].occupation.totalWorkExperience = form.value.totalExperienceYear;

    console.log(this.qde.application.applicants[this.applicantIndex].occupation);

    this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
      // If successful
      if(response["ProcessVariables"]["status"]) {
        this.tabSwitch(8);
      } else {
        // Throw Invalid Pan Error
      }
    }, (error) => {
      console.log("response : ", error);
    });

  }
  //-------------------------------------------------------------


  //-------------------------------------------------------------
  // Official Correspondence
  //-------------------------------------------------------------
  submitOfficialCorrespondence(form: NgForm) {
    if (form && !form.valid) {
      return;
    }

    // let zipCityStateID = this.qde.application.applicants[this.applicantIndex].officialCorrespondence.zipCityStateID

    // let zipId = zipCityStateID.split(',')[0];
    // let cityId = zipCityStateID.split(',')[1];
    // let stateId = zipCityStateID.split(',')[2];

    this.qde.application.applicants[this.applicantIndex].officialCorrespondence.addressLineOne = form.value.ofcA1;
    this.qde.application.applicants[this.applicantIndex].officialCorrespondence.addressLineTwo= form.value.ofcA2
    this.qde.application.applicants[this.applicantIndex].officialCorrespondence.landMark = form.value.landMark;
    this.qde.application.applicants[this.applicantIndex].officialCorrespondence.zipcodeId = this.qde.application.applicants[this.applicantIndex].officialCorrespondence.zipcodeId;
    this.qde.application.applicants[this.applicantIndex].officialCorrespondence.cityId = this.qde.application.applicants[this.applicantIndex].officialCorrespondence.cityId;
    this.qde.application.applicants[this.applicantIndex].officialCorrespondence.stateId = this.qde.application.applicants[this.applicantIndex].officialCorrespondence.stateId;
    this.qde.application.applicants[this.applicantIndex].officialCorrespondence.officeNumber = form.value.stdCode + '-'+ form.value.offStdNumber;
    this.qde.application.applicants[this.applicantIndex].officialCorrespondence.officeEmailId = form.value.officeEmail;


    console.log(this.qde.application.applicants[this.applicantIndex].officialCorrespondence);

    this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
      // If successful
      if(response["ProcessVariables"]["status"]) {
        this.tabSwitch(9);
      } else {
        // Throw Invalid Pan Error
      }
    }, (error) => {
      console.log("response : ", error);
    });
  }
  //-------------------------------------------------------------


  //-------------------------------------------------------------
  // Organization Details
  //-------------------------------------------------------------
  submitOrganizationDetails(form: NgForm) {
    if (form && !form.valid) {
      return;
    }

    this.qde.application.applicants[this.applicantIndex].organizationDetails.nameOfOrganization = form.value.orgName;
    this.qde.application.applicants[this.applicantIndex].organizationDetails.dateOfIncorporation = form.value.year.value+'-'+form.value.month.value+'-'+form.value.day.value;
    this.qde.application.applicants[this.applicantIndex].organizationDetails.constitution = form.value.constitution.value;

    console.log(this.qde.application.applicants[this.applicantIndex].organizationDetails);

    this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
      // If successful
      if(response["ProcessVariables"]["status"]) {
        let result = this.parseJson(response["ProcessVariables"]["response"]);
        // this.qde.application.ocsNumber = result["application"]["ocsNumber"];
        // this.qde.application.applicants[this.applicantIndex].applicantId = result["application"]["applicationId"];
        this.tabSwitch(12);
      } else {
        // Throw Invalid Pan Error
      }
    }, (error) => {
      console.log("response : ", error);
    });
  }


  //-------------------------------------------------------------
  // Registered Address
  //-------------------------------------------------------------
  submitRegisteredAddress(form: NgForm) {
    if (form && !form.valid) {
      return;
    }

    // let zipCityStateID = this.qde.application.applicants[this.applicantIndex].registeredAddress.zipCityStateID

    // let zipId = zipCityStateID.split(',')[0] || "";
    // let cityId = zipCityStateID.split(',')[1] || "";
    // let stateId = zipCityStateID.split(',')[2] || "";

    this.qde.application.applicants[this.applicantIndex].registeredAddress.registeredAddress = form.value.regAdd;
    this.qde.application.applicants[this.applicantIndex].registeredAddress.landMark = form.value.landmark;
    this.qde.application.applicants[this.applicantIndex].registeredAddress.zipcodeId = this.qde.application.applicants[this.applicantIndex].registeredAddress.zipcodeId;
    this.qde.application.applicants[this.applicantIndex].registeredAddress.cityId = this.qde.application.applicants[this.applicantIndex].registeredAddress.cityId;
    this.qde.application.applicants[this.applicantIndex].registeredAddress.stateId = this.qde.application.applicants[this.applicantIndex].registeredAddress.stateId;

    console.log(this.qde.application.applicants[this.applicantIndex].registeredAddress);

    this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
      // If successfull
      if(response["ProcessVariables"]["status"]) {
        this.tabSwitch(13);
      } else {
        // Throw Invalid Pan Error
      }
    }, (error) => {
      console.log("response : ", error);
    });
  }

  //-------------------------------------------------------------
  // Corporate Address
  //-------------------------------------------------------------
  submitCorporateAddress(form: NgForm) {
    if (form && !form.valid) {
      return;
    }

    // let zipCityStateID = this.qde.application.applicants[this.applicantIndex].corporateAddress.zipCityStateID

    // let zipId = zipCityStateID.split(',')[0] || "";
    // let cityId = zipCityStateID.split(',')[1] || "";
    // let stateId = zipCityStateID.split(',')[2] || "";

    this.qde.application.applicants[this.applicantIndex].corporateAddress.corporateAddress = form.value.corpAddress;
    this.qde.application.applicants[this.applicantIndex].corporateAddress.landMark = form.value.landmark;
    this.qde.application.applicants[this.applicantIndex].corporateAddress.zipcodeId = this.qde.application.applicants[this.applicantIndex].corporateAddress.zipcodeId;
    this.qde.application.applicants[this.applicantIndex].corporateAddress.cityId = this.qde.application.applicants[this.applicantIndex].corporateAddress.cityId;
    this.qde.application.applicants[this.applicantIndex].corporateAddress.stateId = this.qde.application.applicants[this.applicantIndex].corporateAddress.stateId;
    this.qde.application.applicants[this.applicantIndex].corporateAddress.stdNumber = form.value.stdNumber+"-"+form.value.phoneNumber;
    this.qde.application.applicants[this.applicantIndex].corporateAddress.officeEmailId = form.value.officeEmailId;

    console.log(this.qde.application.applicants[this.applicantIndex].corporateAddress);

    this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
      // If successfull
      if(response["ProcessVariables"]["status"]) {
        this.tabSwitch(14);
      } else {
        // Throw Invalid Pan Error
      }
    }, (error) => {
      console.log("response : ", error);
    });
  }


  //-------------------------------------------------------------
  // Revenue Details
  //-------------------------------------------------------------
  submitRevenueDetails(form: NgForm) {
    if (form && !form.valid) {
      return;
    }


    this.qde.application.applicants[this.applicantIndex].revenueDetails.revenue = parseInt(form.value.revenue);
    this.qde.application.applicants[this.applicantIndex].revenueDetails.annualNetIncome = parseInt(form.value.annualNetIncome);
    this.qde.application.applicants[this.applicantIndex].revenueDetails.grossTurnOver = parseInt(form.value.grossTurnOver);


    console.log(this.qde.application.applicants[this.applicantIndex].revenueDetails);

    this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
      // If successfull
      if(response["ProcessVariables"]["status"]) {
        this.tabSwitch(15);
      } else {
        // Throw Invalid Pan Error
      }
    }, (error) => {
      console.log("response : ", error);
    });
  }

  //-----------------------------------------------------------------------
  // Income Details
  //-----------------------------------------------------------------------

  submitIncomeDetails1(form: NgForm, swiperInstance ?: Swiper) {
    if (form && !form.valid) {
      return;
    }

    this.qde.application.applicants[this.applicantIndex].incomeDetails.annualFamilyIncome = form.value.annualFamilyIncome ? form.value.annualFamilyIncome: "";
    this.qde.application.applicants[this.applicantIndex].incomeDetails.monthlyExpenditure = form.value.monthlyExpenditure ? form.value.monthlyExpenditure: "";

    console.log(this.qde.application.applicants[this.applicantIndex].incomeDetails);

    this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
      // If successfull
      if(response["ProcessVariables"]["status"]) {
        this.goToNextSlide(swiperInstance);
      } else {
        // Throw Invalid Pan Error
      }
    }, (error) => {
      console.log("response : ", error);
    });

  }


  submitIncomeDetails2(form: NgForm, swiperInstance ?: Swiper) {
    if (form && !form.valid) {
      return;
    }

    this.qde.application.applicants[this.applicantIndex].incomeDetails.monthlyIncome = form.value.monthlyIncome;
    this.qde.application.applicants[this.applicantIndex].incomeDetails.assessmentMethodology = form.value.assessment.value;

    console.log(this.qde.application.applicants[this.applicantIndex].incomeDetails);

    this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
      // If successfull
      if(response["ProcessVariables"]["status"]) {
        this.goToNextSlide(swiperInstance);
      } else {
        // Throw Invalid Pan Error
      }
    }, (error) => {
      console.log("response : ", error);
    });

  }


  parseJson(response):JSON {
    let result = JSON.parse(response);
    return result;
  }

  changeIsIndividual(value, swiperInstance ?: Swiper) {
    if(value) {
      this.goToNextSlide(swiperInstance);
      this.qde.application.applicants[this.applicantIndex].isIndividual = true;
    } else {
      this.tabSwitch(10);
      this.qde.application.applicants[this.applicantIndex].isIndividual = false;
    }
  }

  changeResidentialNon(value, swiperInstance ?: Swiper) {
    this.qde.application.applicants[this.applicantIndex].personalDetails.applicantStatus = value;
    
    // Make API Request to save that is submitpersonaldetails

  }


  counter(size): Array<number> {
    return new Array(size);
  }

  incomeDetailsYesNo(value, swiperInstance ?: Swiper) {

      this.qde.application.applicants[this.applicantIndex].incomeDetails.incomeConsider = value;
  
      console.log(this.qde.application.applicants[this.applicantIndex].incomeDetails);
  
      this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
        // If successfull
        if(response["ProcessVariables"]["status"]) {
          if(value == true) {
            this.goToNextSlide(swiperInstance);
          } else {
            swiperInstance.setIndex(3);
          }
          
        } else {
          // Throw Invalid Pan Error
        }
      }, (error) => {
        console.log("response : ", error);
      });
  }

  doHoldPuccaHouse(value) {
    this.qde.application.applicants[this.applicantIndex].incomeDetails = {
      puccaHouse : value,
    };

    console.log(this.qde.application.applicants[this.applicantIndex].incomeDetails);

    this.qdeHttp.createOrUpdatePersonalDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
      // If successfull
      if(response["ProcessVariables"]["status"]) {
        console.log(response);
      } else {
        // Throw Invalid Pan Error
      }
    }, (error) => {
      console.log("response : ", error);
    });
  }


  selectValueChanged(event, to) {
    let whichSelectQde = this.qde.application.applicants[this.applicantIndex];
    to.getAttribute('nick').split(".").forEach((val, i) => {
      if(val == 'day' || val == 'month' || val == 'year') {
        this.dob[val] = event.value;
        return;
      } else {
        if(i == (to.getAttribute('nick').split(".").length-1)) {
          whichSelectQde[val] = event.value;
          return;
        }
        whichSelectQde = whichSelectQde[val]
      }
    });
  }

  changeApplicantStatus(value, swiperInstance ?: Swiper) {
    if(value == 1) {
      this.goToNextSlide(swiperInstance);
      this.applicantStatus = "1";
    } else {
      this.goToNextSlide(swiperInstance);
      this.applicantStatus = "2";
    }
  }

  initializeVariables() {

    this.residenceNumberStdCode = this.qde.application.applicants[this.applicantIndex].contactDetails.residenceNumber != "" ? this.qde.application.applicants[this.applicantIndex].contactDetails.residenceNumber.split("-")[0] : "";
    this.residenceNumberPhoneNumber = this.qde.application.applicants[this.applicantIndex].contactDetails.residenceNumber != "" ? this.qde.application.applicants[this.applicantIndex].contactDetails.residenceNumber.split("-")[1] : "";

    this.alternateResidenceNumberStdCode = this.qde.application.applicants[this.applicantIndex].contactDetails.alternateResidenceNumber != "" ? this.qde.application.applicants[this.applicantIndex].contactDetails.alternateResidenceNumber.split("-")[0] : "";
    this.alternateResidenceNumberPhoneNumber = this.qde.application.applicants[this.applicantIndex].contactDetails.alternateResidenceNumber != "" ? this.qde.application.applicants[this.applicantIndex].contactDetails.residenceNumber.split("-")[1] : "";
    
    this.officialNumberStdCode = this.qde.application.applicants[this.applicantIndex].officialCorrespondence.officeNumber != "" ? this.qde.application.applicants[this.applicantIndex].officialCorrespondence.officeNumber.split("-")[0] : "";
    this.officialNumberPhoneNumber = this.qde.application.applicants[this.applicantIndex].officialCorrespondence.officeNumber != "" ? this.qde.application.applicants[this.applicantIndex].officialCorrespondence.officeNumber.split("-")[1] : "";

    
    this.addressCityState = this.qde.application.applicants[this.applicantIndex].communicationAddress.city + '/'+ this.qde.application.applicants[this.applicantIndex].communicationAddress.state;

    this.otherReligion = this.qde.application.applicants[this.applicantIndex].other.religion == '6' ? this.qde.application.applicants[this.applicantIndex].other.religion : '';

    if( this.qde.application.applicants[this.applicantIndex].organizationDetails.dateOfIncorporation.split("-")[0] == "" ||
        this.qde.application.applicants[this.applicantIndex].organizationDetails.dateOfIncorporation.split("-")[0] == undefined) {
      this.dateOfIncorporation.day = this.qde.application.applicants[this.applicantIndex].organizationDetails.dateOfIncorporation.split("-")[0];
    }

    if( this.qde.application.applicants[this.applicantIndex].organizationDetails.dateOfIncorporation.split("-")[1] == "" ||
        this.qde.application.applicants[this.applicantIndex].organizationDetails.dateOfIncorporation.split("-")[1] == undefined) {
      this.dateOfIncorporation.month = this.qde.application.applicants[this.applicantIndex].organizationDetails.dateOfIncorporation.split("-")[1];
    }

    if( this.qde.application.applicants[this.applicantIndex].organizationDetails.dateOfIncorporation.split("-")[2] == "" ||
        this.qde.application.applicants[this.applicantIndex].organizationDetails.dateOfIncorporation.split("-")[2] == undefined) {
      this.dateOfIncorporation.year = this.qde.application.applicants[this.applicantIndex].organizationDetails.dateOfIncorporation.split("-")[2];
    }

    this.registeredAddressCityState = this.qde.application.applicants[this.applicantIndex].registeredAddress.city +'/'+ this.qde.application.applicants[this.applicantIndex].registeredAddress.state;
    this.corporateAddressCityState = this.qde.application.applicants[this.applicantIndex].corporateAddress.city +'-'+ this.qde.application.applicants[this.applicantIndex].corporateAddress.state;
    this.corporateAddressStdNumber.stdCode = this.qde.application.applicants[this.applicantIndex].corporateAddress.stdNumber != "" ? this.qde.application.applicants[this.applicantIndex].corporateAddress.stdNumber.split("-")[0] : "";
    this.corporateAddressStdNumber.phoneNumber = this.qde.application.applicants[this.applicantIndex].corporateAddress.stdNumber != "" ? this.qde.application.applicants[this.applicantIndex].corporateAddress.stdNumber.split("-")[1] : "";

  }

  makePermanentAddressSame(event: boolean) {
    this.qde.application.applicants[this.applicantIndex].communicationAddress.permanentAddress = event;

    if(event == true) {
      this.qde.application.applicants[this.applicantIndex].permanentAddress.addressLineOne = this.qde.application.applicants[this.applicantIndex].communicationAddress.addressLineOne;
      this.qde.application.applicants[this.applicantIndex].permanentAddress.addressLineTwo = this.qde.application.applicants[this.applicantIndex].communicationAddress.addressLineTwo;
      this.qde.application.applicants[this.applicantIndex].permanentAddress.zipcode = this.qde.application.applicants[this.applicantIndex].communicationAddress.zipcode;
      this.qde.application.applicants[this.applicantIndex].permanentAddress.cityState = this.qde.application.applicants[this.applicantIndex].communicationAddress.cityState;
    } else {
      this.qde.application.applicants[this.applicantIndex].permanentAddress.addressLineOne = "";
      this.qde.application.applicants[this.applicantIndex].permanentAddress.addressLineTwo = "";
      this.qde.application.applicants[this.applicantIndex].permanentAddress.zipcode = "";
      this.qde.application.applicants[this.applicantIndex].permanentAddress.cityState = "";
    }
  }

  commZipcodeFocusout($event: any ) {
    //call API
  }
  ngOnDestroy() {
    this.panslideSub.unsubscribe();
  }


}
