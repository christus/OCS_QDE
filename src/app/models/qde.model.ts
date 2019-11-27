export default interface Qde {
    application ?: Application;
}

export interface Application {
    applicationFormNumber ?: string;
    ocsNumber : string;
    applicationId: string;
    loanAmount ?: string;
    tenure ?: string;
    appId ?: string;
    propertyIdentified ?: boolean;
    applicants ?: Array<Applicant>;
    loanDetails ?: LoanDetail;
    references ?: Reference;
    status ?: number;
    auditTrailDetails?: AuditTrailDetails;
    leadCreate?: LeadCreate;
    offlinePayments?: ChequeDetails;
}

export interface Document {
  documentType: string;
  documentImageId: string;
  documentCategory: string;
  documentName: string;
  documentSize: number;

}

export interface Applicant {
    applicantId ?: string;
    isMainApplicant : boolean; /* Applicant / Co-Applicant: true/false */
    isIndividual ?: boolean; /* Individual / Non-individual: true/false */
    dedupeDone?: boolean;
    partnerRelationship ?: string;
    termsAndConditions ?: boolean;
    maritalStatus ?: MaritalStatus;
    familyDetails ?: FamilyDetail;
    other ?: Other;
    occupation ?: Occupation;
    pan ?: Pan;
    personalDetails ?: PersonalDetail;
    contactDetails ?: ContactDetail;
    communicationAddress ?: Address;
    permanentAddress ?: Address;
    residentialAddress ? : Address;
    officialCorrespondence ?: OfficialCorrespondence;
    organizationDetails ?: OrganizationDetail;
    registeredAddress ?: RegisteredAddress;
    corporateAddress ?: CorporateAddress;
    revenueDetails ?: RevenueDetail;
    incomeDetails ?: IncomeDetail; // New fields added
    documents ?: Array<any>;
    existingLoans ?: ExistingLoan;
    applicantRelationships ?: Array<any>; // For Application Purpose, Backend aint using this
}

export interface MaritalStatus {
    status ?: string;
    spouseTitle ?: string;
    firstName ?: string;
    earning ?: boolean;
    amount ?: number;
}

export interface FamilyDetail {
    numberOfDependents ?: number;
    fatherTitle ?: string;
    fatherName ?: string;
    motherTitle ?: string;
    motherName ?: string;
    motherMaidenName ?: string;
}

export interface Other {
    religion ?: string;
    otherReligion ?: string;
    category ?: string;
    certificateId ?: string;
}

export interface Occupation {
    occupationType ?: string;
    companyName ?: string;
    numberOfYearsInCurrentCompany ?: number;
    totalWorkExperience ?: number;
    pensioner?: boolean;
    pensionAmount?: number;
    // occupationRequired?: boolean;
}

export interface Pan {
    
    panNumber ?: string;
    panImage ?: string;
    docType ?: string; // As of new design
    docNumber ?: string; // As of new design
    panVerified : boolean;
    // errorMessage ?: string;
    imageId? : string;
    // fileName? : string;
    // fileSize? : string;
}

export interface PersonalDetail {
    relationShip ?: string;
    title ?: string;
    firstName ?: string;
    middleName ?: string;
    lastName ?: string;
    gender ?: string;
    qualification ?: string;
    dob ?: string;
    birthPlace ?: string;
    applicantStatus ?: string; // As of new design *Resident/non-resident
}

export interface ContactDetail {
    preferredEmailId ?: string;
    alternateEmailId ?: string;
    mobileNumber ?: number;
    alternateMobileNumber ?: number;
    residenceNumber : string;
    alternateResidenceNumber ?: string;
    isMobileOTPverified ?: boolean;
    isAlternateOTPverified ?:boolean;
}

export interface Address {
    residentialStatus? : string;
    addressLineOne? : string;
    addressLineTwo? : string;
    zipcode? : string;
    zipcodeId?: string;
    city? : string;
    cityId?: string;
    state? : string;
    stateId?: string;
    numberOfYearsInCurrentResidence? : string;
    permanentAddress ?: boolean;
    currentAddFromApp?: boolean;
    permanentAddFromApp?: boolean;
    cityState? : string;
    preferedMailingAddress?: boolean; // As of new design
}

export interface OfficialCorrespondence {
    addressLineOne? : string;
    addressLineTwo? : string;
    landMark? : string;
    zipcode? : string;
    zipcodeId?: string;
    city? : string;
    cityId?: string;
    state? : string;
    stateId?: string;
    officeNumber? : string;
    officeEmailId? : string;
    cityState? : string;
    zipCityStateID?: string;
    officeStd? : string;
}

export interface OrganizationDetail {
    nameOfOrganization ?: string;
    dateOfIncorporation ?: string;
    constitution ?: string;
    relationShip ?: string;
}

export interface RegisteredAddress {
    registeredAddress? : string;
    landMark? : string;
    zipcode? : string;
    zipcodeId?: string;
    city? : string;
    cityId?: string;
    state? : string;
    stateId?: string;
    cityState? : string;
    zipCityStateID?: string;
    corporateAddress?: boolean;
}

export interface CorporateAddress {
    corporateAddress? : string;
    landMark? : string;
    zipcode? : string;
    zipcodeId?: string;
    city? : string;
    cityId?: string;
    state? : string;
    stateId?: string;
    stdNumber? : string;
    officeEmailId? : string;
    cityState? : string;
    zipCityStateID?: string;
    officeNumber? : string;
}

export interface RevenueDetail {
    revenue ?: number;
    annualNetIncome ?: number;
    grossTurnOver ?: number;
}

export interface LoanDetail {
    incomeDetails ?: IncomeDetail;
    loanAmount ?: LoanAmount;
    propertyType ?: PropertyType;
    property ?: Property;
    existingLoans ?: ExistingLoan;
}

export interface IncomeDetail {
    annualFamilyIncome ?: string;
    monthlyExpenditure ?: string;
    incomeConsider ?: boolean;
    monthlyIncome ?: string;
    assessmentMethodology ?: string;
    puccaHouse ?: boolean; 
}

export interface LoanAmount {
    amountRequired ?: number;
    loanPurpose ?: string;
    loanTenure ?: number;
    loanType ?: number;
}

export interface Property {
    zipcodeId: number;
    zipcode?: number;
    addressLineOne: string;
    addressLineTwo: string;
    cityId: number;
    city?: string;
    stateId: number;
    state?: string;
}

export interface PropertyType {
    propertyIdentified?: boolean;
    propertyType: string;
    propertyClss: string;
    propertyArea: number;
}

export interface ExistingLoan {
  loanProvider?: string;
  numberOfYears?: string;
  liveLoan?: number;
  monthlyEmi?: string | number;
}

export interface Reference {
    referenceOne ?: ReferenceDetail;
    referenceTwo ?: ReferenceDetail;
}

export interface ReferenceDetail {
    referenceId?: number;
    relationShip ?: string;
    title ?: string;
    fullName ?: string;
    mobileNumber ?: string;
    addressLineOne ?: string;
    addressLineTwo ?: string;
}

export interface InCompleteFields {
    pan: boolean;
    personalDetails: boolean;
    contactDetails: boolean;
    communicationAddress: boolean;
    maritalStatus: boolean;
    familyDetails: boolean;
    other: boolean;
    occupation: boolean;
    officialCorrespondence: boolean;
    incomeDetails: boolean;
}

export interface AuditTrailDetails {
    applicantId: number;
    pageNumber: number;
    screenPage: string;
    tabPage: string;
}

export interface LeadCreate {
    name ?: string;
    mobileNumber ?: number;
    address ?: string;
    zipcode ?: number;
    emailId ?: string;
    loanAmount ?: number;
    loanType ?: number;
}

export interface ChequeDetails {
    chequeDrawn ?: string;
    bankName ?: number;
    ifscCode ?: string;
    chequeNumber ?: number;
    amount ?: number;
}

export interface Item {
    key: string;
    value: string;
}