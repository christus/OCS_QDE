export default interface Qde {
    application ?: Application;
}

export interface Application {
    ocsNumber : string;
    applicationId: string;
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
    residentialAddress ? : Address;
    officialCorrespondence ?: OfficialCorrespondence;
    organizationDetails ?: OrganizationDetail;
    registeredAddress ?: RegisteredAddress;
    corporateAddress ?: CorporateAddress;
    revenueDetails ?: RevenueDetail;
    incomeDetails ?: IncomeDetail; // New fields added
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
    religion ?: string;
    otherReligion ?: string;
    category ?: string;
}

export interface Occupation {
    occupationType ?: string;
    companyName ?: string;
    numberOfYearsInCurrentCompany ?: number;
    totalWorkExperience ?: number;
}

export interface Pan {
    panNumber ?: string;
    panImage ?: string;
    docType ?: string; // As of new design
    docNumber ?: string; // As of new design
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
    applicantStatus ?: string; // As of new design *Resident/non-resident
}

export interface ContactDetail {
    preferredEmailId ?: string;
    alternateEmailId ?: string;
    mobileNumber ?: number;
    alternateMobileNumber ?: number;
    residenceNumber : string;
    alternateResidenceNumber ?: string;
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
    cityState? : string;
    preferredMailingAddress?: boolean; // As of new design
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
    propertyIdentifed ?: boolean;
    propertyPincde ?: number;
    addressLineOne ?: string;
    addressLineTwo ?: string;
    city ?: string;
    state ?: string;
}

export interface PropertyType {
    propertyIdentifed ?: boolean;
    propertyType ?: number;
    propertyClss ?: string;
    propertyArea ?: string;
}

export interface ExistingLoan {
    loanProvider ?: string;
    numberOfYears ?: string;
    liveLoan ?: number;
    monthlyEmi? : number;
}

export interface Reference {
    referenceOne ?: ReferenceDetail;
    referenceTwo ?: ReferenceDetail;
}

export interface ReferenceDetail {
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
