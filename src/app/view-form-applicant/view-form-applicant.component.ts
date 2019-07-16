import { Component, Input, OnInit } from '@angular/core';
import Qde from '../models/qde.model';

@Component({
  selector: 'app-view-form-applicant',
  templateUrl: './view-form-applicant.component.html',
  styleUrls: ['./view-form-applicant.component.css']
})
export class ViewFormApplicantComponent implements OnInit {

  @Input() qde: Qde;
  @Input() applicantIndex: any;
  @Input() dob: any;
  @Input() residenceNumberStdCode: any;
  @Input() residenceNumberPhoneNumber: any;
  @Input() alternateResidenceNumberStdCode: any;
  @Input() alternateResidenceNumberPhoneNumber: any;
  @Input() addressCityState: any;
  @Input() permAddressCityState: any;
  @Input() otherReligion: any;
  @Input() organizationDetails: any;
  @Input() registeredAddressCityState: any; //
  @Input() corporateAddressCityState: any; //
  @Input() corporateAddressStdCode: any;
  @Input() corporateAddressPhoneNumber: any;
  @Input() coApplicantsForDashboard: any;
  @Input() officialCorrespondenceStdCode: any;
  @Input() officialCorrespondencePhoneNumber: any;
  @Input() officialCorrespondenceCityState: any; //
  @Input() religions: any;
  @Input() qualifications: any;
  @Input() occupations: any;
  @Input() residences: any;
  @Input() titles: any;
  @Input() maleTitles: any;
  @Input() femaleTitles: any;
  @Input() maritals: any;
  @Input() relationships: any;
  @Input() loanpurposes: any;
  @Input() categories: any;
  @Input() genders: any;
  @Input() constitutions: any;
  @Input() days: any;
  @Input() months: any;
  @Input() years: any;
  @Input() assessmentMethodology: any;
  @Input() selectedTitle: any;
  @Input() selectedReligion: any;
  @Input() selectedMaritialStatus: any;
  @Input() selectedCategory: any;
  @Input() selectedOccupation: any;
  @Input() selectedResidence: any;
  @Input() permSelectedResidence: any;
  @Input() selectedSpouseTitle: any;
  @Input() selectedFatherTitle: any;
  @Input() selectedMotherTitle: any;
  @Input() selectedQualification: any;
  @Input() selectedGender: any;
  @Input() selectedConstitution: any;
  @Input() selectedDocType: any;
  @Input() docType: any;
  @Input() selectedAssesmentMethodology: any;
  @Input() birthPlace: any;
  @Input() selectedBirthPlace: any;
  @Input() isIncomplete: any;
  @Input() isCoApplicant: boolean;
  @Input() applicationId: any;
  @Input() showEdit: boolean;

  constructor() { }

  ngOnInit() {
    // console.log("view-form: ", this.qde);
  }

}
