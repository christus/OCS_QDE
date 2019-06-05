import { Other } from './../../models/qde.model';
import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
    
import * as Swiper from 'swiper/dist/js/swiper.js';
// import { Select2Component } from 'ng2-select2';
import { ActivatedRoute, Router } from '@angular/router';

import { Options } from 'ng5-slider';
import { NgForm } from '@angular/forms';

import Qde from 'src/app/models/qde.model';
import { QdeHttpService } from 'src/app/services/qde-http.service';
import { QdeService } from 'src/app/services/qde.service';
import { CommonDataService } from '../../services/common-data.service';

interface Item {
  key: string,
  value: number | string
}

@Component({
  selector: 'app-applicant-qde',
  templateUrl: './applicant-qde.component.html',
  styleUrls: ['./applicant-qde.component.css']
})
export class ApplicantQdeComponent implements OnInit {

  errors = {

    pan: {
      required: "PAN number is required",
      length: "PAN number must be at least 10 characters",
      invalid: "PAN number is not valid"
    },

    personalDetails: {
      firstName: {
        required: "First Name is required",
        invalid: "First Name is not valid"
      },
      middleName: {
        invalid: "Middle Name is not valid"
      },
      lastName: {
        required: "Last Name is required",
        invalid: "Last Name is not valid"
      }
    },

    contactDetails: {
      preferedEmail: {
        required: "Preferred Email Id is required",
        invalid: "Preferred Email Id is not valid"
      },
      alternateEmail: {
        invalid: "Alternate Email Id is not valid"
      },
      prefferedMobile: {
        required: "Preferred Mobile Number is required",
        invalid: "Preferred Mobile Number is not valid"
      },
      alternateMobile: {
        invalid: "Alternate Mobile Number is not valid"
      },
      stdCode: {
        required: "Std Code is required",
        invalid: "Std Code is not valid"
      },
      alternateResidenceNumberStd1:{
        invalid: "Std code is not valid"
      },
      residenceNumber: {
        required: "Residence number is required",
        invalid: "Residence number is not valid"
      },
      alternateResidenceNumber1:{
        invalid:"Residence number is not valid"
      }
    },

    commAddress: {
      address1: {
        required: "Address Line 1 is required",
        invalid: "Address Line 1 is not valid"
      },
      address2: {
        required: "Address Line 2 is required",
        invalid: "Address Line 2 is not valid"
      },
      pinCode: {
        required: "Pincode is required",
        invalid: "Pincode is not valid",
        minlength:"Pincode should be 6 digits"
      },
      stateOrCity: {
        required: "State Name / City Name is required",
        invalid: "State Name / City Name is not valid"
      }
    },

    maritialStatus: {
      spouseName: {
        required: "Spouse Name is required",
        invalid: "Spouse Name is not valid"
      },
      salaryAmount: {
        required: "Salary Amount is required",
        invalid: "Salary Amount is not valid"
      }
    },

    familyDetails: {
      fatherName:{
        required:"Father's Name is required",
        invalid: "Father's Name is not valid"
      },
      motherName:{
        required:"Mother's Name is required",
        invalid: "Mother's Name is not valid"
      },
      motherMaiden:{
        required:"Mother's Maiden Name is required",
        invalid: "Mother's Maiden Name is not valid"
      }
    },

    other: {

    },

    occupationDetails : {
      companyDetails: {
        required: "Company Name is required",
        invalid: "Company Name is not valid"
      },
      currentExp: {
        required: "Current Experience is required",
        invalid: "Current Experience is not valid"
      },
      totalExp: {
        required: "Total Experience is required",
        invalid: "Total Experience is not valid"
      }
    },

    officialCorrespondence: {
      address1: {
        required: "Office address line1 is required",
        invalid: "Office address line1 is not valid"
      },
      address2: {
        required: "Office address line2 is required",
        invalid: "Office address line2 is not valid"
      },
      pinCode: {
        required: "Pincode is required",
        invalid: "Pincode is not valid",
        minlength:"Pincode should be 6 digits"
      },
      landMark: {
        invalid: "Land mark is not valid"
      },
      stateOrCity: {
        required: "State Name / City Name is required",
        invalid: "State Name / City Name is not valid"
      },
      stdCode: {
        required: "Std Code is required"
      },
      phoneNumber: {
        required: "Phone Number is required"
      },
      email: {
        required: "Office Email Id is required",
        invalid: "Office Email Id is not valid"
      }
    },
    
    incomeDetails:{
      familyIncome:{
        required: "Annual family Income is required",
      },
      monthlyExpenditure:{
        required:"Monthly Expenditure is required"
      },
      monthlyIncome:{
        required:"Monthly Income is required"
      }
    },

    organizationDetails: {
      orgName: {
        required: "Organization Name is required",
        invalid: "Organization Name is not valid"
      }
    },
    registeredAddress: {
      address : {
        required: "Registered Address is required",
        invalid: "Registered Address is not valid"
      },
      landMark: {
        invalid: "Land mark is not valid"
      },pinCode: {
        required: "Pincode is required",
        invalid: "Pincode is not valid",
        minlength:"Pincode should be 6 digits"
      },stateOrCity: {
        required: "State Name / City Name is required",
        invalid: "State Name / City Name is not valid"
      }
    },
    corporateAddress: {
      address : {
        required: "Corporate Address is required",
        invalid: "Corporate Address is not valid"
      },
      landMark: {
        invalid: "Land mark is not valid"
      },pinCode: {
        required: "Pincode is required",
        invalid: "Pincode is not valid",
        minlength:"Pincode should be 6 digits"
      },stateOrCity: {
        required: "State Name / City Name is required",
        invalid: "State Name / City Name is not valid"
      },stdNumber:{
        required:"Std is required",
        invalid:"Sted is not valid"
      },phoneNumber:{
        required:"Phone number is required",
        invalid:"Phone number is not valid"
      },

      ofcEmail:{
        required:"Office Email is required",
        invalid:"Office Email is not valid"
      }
    },
    revenueDetails: {
      revenue:{
        required: "revenue is required",
        invalid: "revenue is not valid"
      },
      annualNetincome:{
        required:"Annual Net Income is required",
        invalid:" Annual Net Income is not valid"
      },
      grossTurnover:{
        required: "Gross Turnover is required",
        invalid: "Gross Turnover is not valid"
      }
      
    }
  };

  regexPattern = {
    mobileNumber: "^[0-9]*$",
    name: "^[A-Za-z, ]+$",
    address : "^[0-9A-Za-z, _&'#]+$",
    // cityState:"^[0-9A-Za-z, &'#]$",
    pinCode: "^[1-9][0-9]{5}$",
    pan:"[A-Z]{5}[0-9]{4}[A-Z]{1}",
    amount:"[0-9]{0,17}.[0-9]{1,4}?$",
    revenue:"^[1-9][0-9]{0,17}"
    // revenue:"^[0-9]{0,17}\.[0-9]{1,4}?$"
   
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
    // noSwiping: true,
    // noSwipingClass: '',
    autoplay: false,
    speed: 900,
    effect: "slide"
  };

  private activeTab: number = 0;
  private dob: {day: Item, month: Item, year: Item} = { day: {key: "DD", value: "DD"}, month: {key: "MM", value: "MM"}, year: {key: "YYYY", value: "YYYY"} };
  private residenceNumber: {stdCode: string, phoneNumber: string} = {stdCode: "", phoneNumber: ""};
  private alternateResidenceNumber: {stdCode: string, phoneNumber: string} = {stdCode: "", phoneNumber: ""};
  private addressCityState: string = "";
  private otherReligion: string = "";
  private dateOfIncorporation: {day: string, month: string, year: string} = {day: null, month: null, year: null};
  private registeredAddressCityState: string = "";
  private corporateAddressCityState: string = "";
  private corporateAddressStdNumber: {stdCode: string, phoneNumber: string} = {stdCode: "", phoneNumber: ""};

  private commCityState:string = "";
  zipCityStateID:string = "";

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

  private applicantStatus:boolean = false;



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
  private docType: Array<any>;

  
  constructor(private renderer: Renderer2,
              private route: ActivatedRoute,
              private router: Router,
              private qdeHttp: QdeHttpService,
              private qdeService: QdeService,
              private cds:CommonDataService) {
    this.cds.panslide.subscribe(val => {
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

        this.activeTab = this.fragments.indexOf(localFragment);

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
      this.maritals = lov.LOVS.maritial_status;
      this.relationships = lov.LOVS.relationship;
      this.loanpurposes = lov.LOVS.loan_purpose;
      this.categories = lov.LOVS.category;
      this.genders = lov.LOVS.gender;
      this.constitutions = lov.LOVS.constitution;

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


      this.docType = [{"key": "Aadhar", "value": "1"},{"key": "Driving License", "value": "2"},{"key": "passport", "value": "3"}];

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
    }

    // Create New Entry
    this.applicantIndex = 0;

    // Write code to get data(LOV) and assign applicantIndex if its new or to update.
    console.log("Applicant Code: ", this.applicantIndex);

    // Check Whether there is qde data to be filled or else Initialize Qde
    this.route.params.subscribe((params) => {

      console.log("params ", params);
      // Make an http request to get the required qde data and set using setQde
      if(params.applicantId != undefined && params.applicantId != null) {

        // getQdeData
        this.qdeHttp.dummyGetApi(params.applicantId).subscribe(response => {
          var result = JSON.parse(response["ProcessVariables"]["response"]);
          console.log("Get ", result);

          this.applicantIndex = this.qde.application.applicants.findIndex(val => val.isMainApplicant == true);

          // Will be deprected as soon as API is stable
//--------------------------------------------------------------------
          try {
            if(result.application.applicants[this.applicantIndex].applicantId != null) {
              this.qde.application.applicants[this.applicantIndex].applicantId = result.application.applicants[this.applicantIndex].applicantId;
            }
          } catch(e) {}
          try {
            if(result.application.applicants[this.applicantIndex].pan != null) {
              this.qde.application.applicants[this.applicantIndex].pan = result.application.applicants[this.applicantIndex].pan;
            }
          } catch(e) {}
          try {
            if(result.application.applicants[this.applicantIndex].isMainApplicant != null) {
              this.qde.application.applicants[this.applicantIndex].partnerRelationship = result.application.applicants[this.applicantIndex].isMainApplicant;
            }
          } catch(e) {}
          try {
            if(result.application.applicants[this.applicantIndex].isMainApplicant != null) {
              this.qde.application.applicants[this.applicantIndex].maritalStatus = result.application.applicants[this.applicantIndex].isMainApplicant;
            }
          } catch(e) {}
          try {
            if(result.application.applicants[this.applicantIndex].isIndividual != null) {
              this.qde.application.applicants[this.applicantIndex].isIndividual = result.application.applicants[this.applicantIndex].isIndividual;
            }
          } catch(e) {}
          try {
            if(result.application.applicants[this.applicantIndex].familyDetails != null) {
              this.qde.application.applicants[this.applicantIndex].familyDetails = result.application.applicants[this.applicantIndex].familyDetails;
            }
          } catch(e) {}
          try {
            if(result.application.applicants[this.applicantIndex].other != null) {
              this.qde.application.applicants[this.applicantIndex].other = result.application.applicants[this.applicantIndex].other;
            }
          } catch(e) {}
          try {
            if(result.application.applicants[this.applicantIndex].occupation != null) {
              this.qde.application.applicants[this.applicantIndex].occupation = result.application.applicants[this.applicantIndex].occupation;
            }
          } catch(e) {}
          try {
            if(result.application.applicants[this.applicantIndex].personalDetails != null) {
              this.qde.application.applicants[this.applicantIndex].personalDetails = result.application.applicants[this.applicantIndex].personalDetails;
            }
          } catch(e) {}
          try {
            if(result.application.applicants[this.applicantIndex].contactDetails != null) {
              this.qde.application.applicants[this.applicantIndex].contactDetails = result.application.applicants[this.applicantIndex].contactDetails;
            }
          } catch(e) {}
          try {
            if(result.application.applicants[this.applicantIndex].communicationAddress != null) {
              this.qde.application.applicants[this.applicantIndex].communicationAddress = result.application.applicants[this.applicantIndex].communicationAddress;
            }
          } catch(e) {}
          try {
            if(result.application.applicants[this.applicantIndex].permanentAddress != null) {
              this.qde.application.applicants[this.applicantIndex].permanentAddress = result.application.applicants[this.applicantIndex].permanentAddress;
            }
          } catch(e) {}
          try {
            if(result.application.applicants[this.applicantIndex].residentialAddress != null) {
              this.qde.application.applicants[this.applicantIndex].residentialAddress = result.application.applicants[this.applicantIndex].residentialAddress;
            }
          } catch(e) {}
          try {
            if(result.application.applicants[this.applicantIndex].officialCorrespondence != null) {
              this.qde.application.applicants[this.applicantIndex].officialCorrespondence = result.application.applicants[this.applicantIndex].officialCorrespondence;
            }
          } catch(e) {}
          try {
            if(result.application.applicants[this.applicantIndex].organizationDetails != null) {
              this.qde.application.applicants[this.applicantIndex].organizationDetails = result.application.applicants[this.applicantIndex].organizationDetails;
            }
          } catch(e) {}
          try {
            if(result.application.applicants[this.applicantIndex].registeredAddress != null) {
              this.qde.application.applicants[this.applicantIndex].registeredAddress = result.application.applicants[this.applicantIndex].registeredAddress;
            }
          } catch(e) {}
          
          try {
            if(result.application.applicants[this.applicantIndex].corporateAddress != null) {
              this.qde.application.applicants[this.applicantIndex].corporateAddress = result.application.applicants[this.applicantIndex].corporateAddress;
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

          this.qdeService.setQde(this.qde); // Soon it will be this.qdeService.setQde(result);

          // Personal Details Title
          if( ! isNaN(parseInt(this.qde.application.applicants[this.applicantIndex].personalDetails.title)) ) {
            this.selectedTitle = this.titles[(parseInt(this.qde.application.applicants[this.applicantIndex].personalDetails.title))-1];
          }

          // Personal Details Qualification
          if( ! isNaN(parseInt(this.qde.application.applicants[this.applicantIndex].personalDetails.qualification)) ) {
            this.selectedQualification = this.qualifications[(parseInt(this.qde.application.applicants[this.applicantIndex].personalDetails.qualification))-1];
          }

          // Personal Details Day
          if( ! isNaN(parseInt(this.qde.application.applicants[this.applicantIndex].personalDetails.dob.split('-')[2])) ) {
            this.dob.day = this.days[parseInt(this.qde.application.applicants[this.applicantIndex].personalDetails.dob.split('-')[2])];
          }

          // Personal Details Month
          if( ! isNaN(parseInt(this.qde.application.applicants[this.applicantIndex].personalDetails.dob.split('-')[1])) ) {
            this.dob.month = this.months[parseInt(this.qde.application.applicants[this.applicantIndex].personalDetails.dob.split('-')[1])];
          }

          // Personal Details Year
          if( ! isNaN(parseInt(this.qde.application.applicants[this.applicantIndex].personalDetails.dob.split('-')[0])) ) {
            this.dob.year = this.years.find(val => this.qde.application.applicants[this.applicantIndex].personalDetails.dob.split('-')[0] == val.value);
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

       });
      }


      console.log("QDE" , this.qde);
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

    this.residenceNumber.stdCode = this.qde.application.applicants[this.applicantIndex].contactDetails.residenceNumber != "" ? this.qde.application.applicants[this.applicantIndex].contactDetails.residenceNumber.split("-")[0] : "";
    this.residenceNumber.phoneNumber = this.qde.application.applicants[this.applicantIndex].contactDetails.residenceNumber != "" ? this.qde.application.applicants[this.applicantIndex].contactDetails.residenceNumber.split("-")[1] : "";

    this.alternateResidenceNumber.stdCode = this.qde.application.applicants[this.applicantIndex].contactDetails.alternateResidenceNumber != "" ? this.qde.application.applicants[this.applicantIndex].contactDetails.alternateResidenceNumber.split("-")[0] : "";
    this.alternateResidenceNumber.phoneNumber = this.qde.application.applicants[this.applicantIndex].contactDetails.alternateResidenceNumber != "" ? this.qde.application.applicants[this.applicantIndex].contactDetails.residenceNumber.split("-")[1] : "";
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

    this.qde.application.applicants[this.applicantIndex].pan = {
   
      panNumber: form.value.pan,
      docType: form.value.docType.value,
      docNumber: form.value.docNumber
    };

    console.log("Get Filtered JSON: ", this.qdeService.getFilteredJson(this.qde));
    this.qdeHttp.createOrUpdatePanDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
      // If successful
      if(response["ProcessVariables"]["status"]) {
        let result = this.parseJson(response["ProcessVariables"]["response"]);

        this.qde.application.ocsNumber = result["application"]["ocsNumber"];
        this.qde.application.applicationId = result["application"]["applicationId"];
        this.qde.application.applicants[this.applicantIndex].applicantId =  result["application"]["applicants"][this.applicantIndex]["applicantId"];

        
        //this.goToNextSlide(swiperInstance);

        this.cds.changePanSlide(true);
        this.router.navigate(['/applicant/'+result["application"]["applicationId"]], {fragment: "pan1"});
        
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

    this.qde.application.applicants[this.applicantIndex].pan = {
   
      panNumber: form.value.pan,
      docType: form.value.docType,
      docNumber: form.value.docNumber
    };

    this.qdeHttp.createOrUpdatePanDetails(this.qdeService.getFilteredJson(this.qde)).subscribe((response) => {
      // If successful
      if(response["ProcessVariables"]["status"]) {
        let result = this.parseJson(response["ProcessVariables"]["response"]);
        this.qde.application.ocsNumber = result["application"]["ocsNumber"];
        this.qde.application.applicationId = result["application"]["applicationId"];
        this.qde.application.applicants[this.applicantIndex].applicantId =  result["application"]["applicants"][this.applicantIndex]["applicantId"];
        
        // //this.goToNextSlide(swiperInstance);
        // console.log(":::::", this.qde)

        // this.cds.changePanSlide2(true);
        // this.router.navigate(['/applicant/'+this.qde.application.applicationId], {fragment: "organization"});

        this.cds.changePanSlide2(true);
        this.router.navigate(['/applicant/'+result["application"]["applicationId"]], {fragment: "organization"});
        
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

    this.qde.application.applicants[this.applicantIndex].personalDetails.dob = form.value.year+'-'+form.value.month+'-'+form.value.day;
    this.qde.application.applicants[this.applicantIndex].personalDetails.birthPlace = form.value.birthPlace;

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

    this.qde.application.applicants[this.applicantIndex].contactDetails = {
      preferredEmailId: form.value.preferEmailId,
      alternateEmailId : form.value.alternateEmailId,
      mobileNumber: form.value.mobileNumber,
      alternateMobileNumber: form.value.alternateMobileNumber,
      residenceNumber: form.value.residenceNumber1+'-'+form.value.residenceNumber2,
      alternateResidenceNumber: form.value.alternateResidenceNumber1+'-'+form.value.alternateResidenceNumber2
    };

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
    setTimeout(() => {
      console.log(event.target.value);
       let zipCode= event.target.value
       this.qdeHttp.getCityAndState(zipCode).subscribe((response) => {
          console.log(JSON.parse(response["ProcessVariables"]["response"]));
          var result = JSON.parse(response["ProcessVariables"]["response"]);

          this.commCityState = "";

          if(result.city != null && result.state != null) {
            this.commCityState = result.city +" "+ result.state;
          }

          let zipCityStateID = "0,0,0";

          if(result.zipcodeId !=null && result.cityId !=null && result.stateId != null) {
            zipCityStateID  = result.zipcodeId + "," + result.cityId + "," + result.stateId;
          }


          if(screenName == "communicationAddress") {
            this.qde.application.applicants[this.applicantIndex].communicationAddress.cityState = this.commCityState || "";    
            this.qde.application.applicants[this.applicantIndex].communicationAddress.zipCityStateID = zipCityStateID;
          }


          if(screenName == "permanentAddress") {
            this.qde.application.applicants[this.applicantIndex].permanentAddress.cityState = this.commCityState || "";    
            this.qde.application.applicants[this.applicantIndex].permanentAddress.zipCityStateID = zipCityStateID;
          }


          if(screenName == "officialCorrespondence") {
            this.qde.application.applicants[this.applicantIndex].officialCorrespondence.cityState = this.commCityState || "";    
            this.qde.application.applicants[this.applicantIndex].officialCorrespondence.zipCityStateID = zipCityStateID;
          }

          if(screenName == "registeredAddress") {
            this.qde.application.applicants[this.applicantIndex].registeredAddress.cityState = this.commCityState || "";    
            this.qde.application.applicants[this.applicantIndex].registeredAddress.zipCityStateID = zipCityStateID;
          }

          if(screenName == "corporateAddress") {
            this.qde.application.applicants[this.applicantIndex].corporateAddress.cityState = this.commCityState || "";    
            this.qde.application.applicants[this.applicantIndex].corporateAddress.zipCityStateID = zipCityStateID;
          }
          

       })
    }, 5000);
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

    let zipCityStateID = this.qde.application.applicants[this.applicantIndex].communicationAddress.zipCityStateID

    let zipId = zipCityStateID.split(',')[0];
    let cityId = zipCityStateID.split(',')[1];
    let stateId = zipCityStateID.split(',')[2];

    let pZpCityStateID = this.qde.application.applicants[this.applicantIndex].permanentAddress.zipCityStateID

    let pZipId = zipCityStateID.split(',')[0];
    let pCityId = zipCityStateID.split(',')[1];
    let pStateId = zipCityStateID.split(',')[2];

    this.qde.application.applicants[this.applicantIndex].communicationAddress = {
      residentialStatus : form.value.residentialStatus.value,
      addressLineOne : form.value.addressLineOne,
      addressLineTwo : form.value.addressLineTwo,
      zipcode : zipId,
      city : cityId,
      state : stateId,
      numberOfYearsInCurrentResidence : form.value.numberOfYearsInCurrentResidence,
      permanentAddress : form.value.permanentAddress,
      preferedMailingAddress: form.value.prefredMail
    };


    this.qde.application.applicants[this.applicantIndex].permanentAddress = {
      addressLineOne : form.value.pAddressLineOne,
      addressLineTwo : form.value.pAddressLineTwo,
      zipcode : pZipId,
      city : pCityId,
      state : pStateId,
      numberOfYearsInCurrentResidence : form.value.numberOfYearsInCurrentResidence
    };

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

    this.qde.application.applicants[this.applicantIndex].maritalStatus = {
      status : form.value.maritalStatus.value
    };

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

    this.qde.application.applicants[this.applicantIndex].familyDetails = {
      numberOfDependents : form.value.numberOfDependents
    };

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

    this.qde.application.applicants[this.applicantIndex].other = {
      religion : form.value.religion.value,
      category: form.value.category.value
    };

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

    this.qde.application.applicants[this.applicantIndex].occupation = {
      occupationType: form.value.occupationType.value,
      companyName : form.value.companyName,
      numberOfYearsInCurrentCompany : form.value.numberOfYearsInCurrentCompany,
      totalWorkExperience : form.value.totalExperienceYear
    };

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

    let zipCityStateID = this.qde.application.applicants[this.applicantIndex].officialCorrespondence.zipCityStateID

    let zipId = zipCityStateID.split(',')[0];
    let cityId = zipCityStateID.split(',')[1];
    let stateId = zipCityStateID.split(',')[2];


    this.qde.application.applicants[this.applicantIndex].officialCorrespondence = {
      addressLineOne : form.value.ofcA1,
      addressLineTwo : form.value.ofcA2,
      landMark : form.value.landMark,
      zipcode : zipId,
      city : cityId,
      state: stateId,
      officeStd: form.value.stdCode,
      //officeNumber : form.value.stdCode + '-'+ form.value.offStdNumber,
      officeNumber :  form.value.offStdNumber,
      officeEmailId : form.value.officeEmail
    };

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
  // Organization Correspondence
  //-------------------------------------------------------------
  submitOrganizationDetails(form: NgForm) {
    if (form && !form.valid) {
      return;
    }

    this.qde.application.applicants[this.applicantIndex].organizationDetails = {
      nameOfOrganization: form.value.orgName,
      dateOfIncorporation: form.value.year+'-'+form.value.month+'-'+form.value.day,
      constitution: form.value.constitution
    };

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

    // let zipId = this.zipCityStateID.split(',')[0] || "";
    // let cityId = this.zipCityStateID.split(',')[1] || "";
    // let stateId = this.zipCityStateID.split(',')[2] || "";

    let zipId = "";
    let cityId = "";
    let stateId = "";


    this.qde.application.applicants[this.applicantIndex].registeredAddress = {
      registeredAddress : form.value.regAdd,
      landMark : form.value.landmark,
      zipcode : zipId,
      city : cityId,
      state : stateId,
    };

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

    let zipCityStateID = this.qde.application.applicants[this.applicantIndex].corporateAddress.zipCityStateID

    let zipId = this.zipCityStateID.split(',')[0] || "";
    let cityId = this.zipCityStateID.split(',')[1] || "";
    let stateId = this.zipCityStateID.split(',')[2] || "";


    this.qde.application.applicants[this.applicantIndex].corporateAddress = {
      corporateAddress : form.value.corpAddress,
      landMark : form.value.landmark,
      zipcode : zipId,
      city : cityId,
      state : stateId,
      stdNumber : form.value.stdNumber+form.value.phoneNumber,
      officeEmailId : form.value.officeEmailId
    };

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

    this.qde.application.applicants[this.applicantIndex].revenueDetails = {
      revenue : parseInt(form.value.revenue),
      annualNetIncome : parseInt(form.value.annualNetIncome),
      grossTurnOver : parseInt(form.value.grossTurnOver)
    };

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

    this.qde.application.applicants[this.applicantIndex].incomeDetails = {
      monthlyIncome : form.value.monthlyIncome,
      assessmentMethodology : form.value.assessment
    };

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

  // changeApplicantStatus(value, swiperInstance ?: Swiper) {
  //   if(value) {
  //     this.goToNextSlide(swiperInstance);
  //     this.applicantStatus = true;
  //   } else {
  //     this.goToNextSlide(swiperInstance);
  //     this.applicantStatus = false;
  //   }
  // }
}
