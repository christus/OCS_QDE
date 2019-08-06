export const errors: any = {

  pan: {
    required: "PAN is mandatory",
    length: "PAN must be at least 10 characters",
    invalid: "Invalid PAN, valid PAN format - AAAPL1234C",
    after3Attemps: "Please check and enter your correct PAN"
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
    },
    birthPlace:{
      required:"Birth Place is mandatory",
      invalid:"Special Characters are not allowed / Invalid Birth place"
    }
  },

  contactDetails: {
    preferedEmail: {
      required: "Email Id is mandatory",
      invalid: "Invalid Email ID"
    },
    alternateEmail: {
      invalid: "Invalid Email ID",
      sameEmail: "Email ID's are same, please use different email"
    },
    prefferedMobile: {
      required: "10 digit mobile number is mandatory",
      invalid: "Invalid mobile number/Alphabets and Special Characters not allowed",
      minlength: "Mobile number must be 10 digits",
      wrong: "Please provide valid mobile number"
    },
    alternateMobile: {
      invalid: "Invalid mobile number/Alphabets and Special Characters not allowed",
      minlength: "Mobile number must be 10 digits",
      sameNumber: "Mobile numbers are same, please use different numbers",
      wrong: "Please provide valid mobile number"
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
      invalid: "Invalid Residence number/Alphabets and Special Characters not allowed",
      sameNumber: "Residence numbers are same, please use different numbers"
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