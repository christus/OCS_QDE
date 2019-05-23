export default interface Qde {
    application : Application;
}

export interface Application {
    ocsNumber : string;
    loanAmount ?: string;
    tenure ?: string;
    appId ?: string;
    propertyIdentified ?: boolean;
    applicants ?: Array<Applicant>;
    loanDetails ?: LoanDetail;
    references ?: Reference;
}

export interface Applicant {
    applicantId ?: string;
    isMainApplicant : boolean; /* Applicant / Co-Applicant: true/false */
    isIndividual ?: boolean; /* Individual / Non-individual: true/false */
    partnerRelationship ?: string;
    maritalStatus ?: MaritalStatus;
    familyDetails ?: FamilyDetail;
    other ?: Other;
    occupation ?: Occupation;
    pan ?: Pan;
    personalDetails ?: PersonalDetail;
    contactDetails ?: ContactDetail;
    communicationAddress ?: Address;
    permanentAddress ?: Address;
    officialCorrespondence ?: OfficialCorrespondence;
    organizationDetails ?: OrganizationDetail;
    registeredAddress ?: RegisteredAddress;
    corporateAddress ?: CorporateAddress;
    revenueDetails ?: RevenueDetail;
    documents ?: Array<any>;
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
    religion : string;
    category: string;
}

export interface Occupation {
    occupationType : string;
    companyName : string;
    numberOfYearsInCurrentCompany : number;
    totalWorkExperiance : number;
}

export interface Pan {
    panNumber : string;
    panImage ?: string;
}

export interface PersonalDetail {
    title ?: string;
    firstName ?: string;
    middleName ?: string;
    lastName ?: string;
    gender ?: string;
    qualification ?: string;
    dob ?: string;
    birthPlace ?: string;
}

export interface ContactDetail {
    preferredEmailId : string;
    alternateEmailId ?: string;
    mobileNumber : number;
    alternateMobileNumber ?: number;
    residenceNumber : string;
    alternateResidenceNumber ?: string;
}

export interface Address {
    residentialStatus : string;
    addressLineOne : string;
    addressLineTwo : string;
    pincode : string;
    city : string;
    state : string;
    numberOfYearsInCurrentResidence : string;
    permanentAddress ?: boolean;
}

export interface OfficialCorrespondence {
    addressLineOne : string;
    addressLineTwo : string;
    landMark : string;
    pincode : string;
    city : string;
    officeNumber : string;
    officeEmailId : string;
}

export interface OrganizationDetail {
    nameOfOrganization: string;
    dateOfIncorporation: string;
    constitution: string;
}

export interface RegisteredAddress {
    registeredAddress : string;
    landMark : string;
    pincode : number,
    city : string;
    state : string;
}

export interface CorporateAddress {
    coporateAddress : string;
    landMark : string;
    pincode : number,
    city : string;
    state : string;
    stdNumber : string;
    officeEmailId : string;
}

export interface RevenueDetail {
    revenue : number;
    annualNetIncome : number;
    grossTurnOver : number;
}

export interface LoanDetail {
    incomeDetails ?: IncomeDetail;
    loanAmount ?: LoanAmount;
    property ?: Property;
    existingLoans ?: ExistingLoan;
}

export interface IncomeDetail {
    annualFamilyIncome : string;
    familMembersOwnHouse : boolean;
}

export interface LoanAmount {
    amountRequired : number;
    loanPurpose : string;
    loanTenure : number;
}

export interface Property {
    propertyIdentifed : boolean;
    propertyPincde : number;
    addressLineOne : string;
    addressLineTwo : string;
    city : string;
    state : string;
}

export interface ExistingLoan {
    loanProvider : string;
    numberOfYears : number;
    monthlyEmi : number;
}

export interface Reference {
    referenceOne ?: ReferenceDetail;
    referenceTwo ?: ReferenceDetail;
}

export interface ReferenceDetail {
    relationShip? : string;
    title : string;
    fullName : string;
    mobileNumber : string;
    addressLineOne : string;
    addressLineTwo : string;
}
