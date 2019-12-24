import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import Qde from '../models/qde.model';
import { QdeHttpService } from '../services/qde-http.service';

@Component({
  selector: 'app-view-form-applicant',
  templateUrl: './view-form-applicant.component.html',
  styleUrls: ['./view-form-applicant.component.css']
})
export class ViewFormApplicantComponent implements OnInit, OnChanges {

  @Input() qde: Qde;
  @Input() applicantIndex: any;
  @Input()  set dob(dob: any) {
    if(!dob) {
      this._dob = ''
      return
    }
    const day = dob.day.key ;
    const month = dob.month.key ;
    const year = dob.year.key ;
    this._dob  = day ? `${day}/${month}/${year}` : '';
    console.log("_dob", this._dob)
  }
  @Input() residenceNumberStdCode: any;
  @Input() residenceNumberPhoneNumber: any;
  @Input() alternateResidenceNumberStdCode: any;
  @Input() alternateResidenceNumberPhoneNumber: any;
  @Input() addressCityState: any;
  @Input() permAddressCityState: any;
  @Input() otherReligion: any;
  @Input() set organizationDetails(organizationDetails: any) {
    if(!organizationDetails){
      this.orgDetails=''
      return;
    }
    const day = organizationDetails.day.key;
    const month = organizationDetails.month.key;
    const year = organizationDetails.year.key;
    this.orgDetails = day ? `${day}/${month}/${year}` : '';
  }
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
  occupationRequired: boolean;
  orgDetails: any;
  _dob: any;

  constructor(private qdeHttp: QdeHttpService, ) { }

  ngOnInit() {
    // console.log("this.slegthjdfbgvkbvkjdsfnkvndf",this.selectedOccupation["value"])
    // this.selectValueChangedOccupation();

  }
  // selectValueChangedOccupation() {
  //   this.qdeHttp.occupationLovCompanyDetails(this.selectedOccupation.value).subscribe(response => {
  //     this.occupationRequired = response["ProcessVariables"]["status"]
  //     console.log("khgjfshdkgjvdfhbngfkjjgfd,b", this.occupationRequired)
  //   });
  // }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if('selectedTitle' in simpleChanges){
      this.selectedTitle = this.selectedTitle ? this.selectedTitle.key : '';
    }
    if('selectedGender' in simpleChanges){
      this.selectedGender = this.selectedGender ? this.selectedGender.key : '';
    }
    if('selectedQualification' in simpleChanges){
      this.selectedQualification = this.selectedQualification ? this.selectedQualification.key : '';
    }
    if('selectedResidence' in simpleChanges){
      this.selectedResidence = this.selectedResidence ? this.selectedResidence.key : '';
    }
    if('selectedMaritialStatus' in simpleChanges){
      this.selectedMaritialStatus = (this.selectedMaritialStatus) ? this.selectedMaritialStatus.key : '';
    }
    if('selectedSpouseTitle' in simpleChanges){
      this.selectedSpouseTitle = (this.selectedSpouseTitle) ? this.selectedSpouseTitle.key : '';
    }
    if('selectedFatherTitle' in simpleChanges){
      this.selectedFatherTitle = (this.selectedFatherTitle) ? this.selectedFatherTitle.key : '';
    }
    if ('selectedMotherTitle' in simpleChanges) {
      this.selectedMotherTitle = (this.selectedMotherTitle)? this.selectedMotherTitle.key : '';
    }
    if('selectedReligion'in simpleChanges){
      this.selectedReligion = this.selectedReligion ? this.selectedReligion.key : '';
    }
    if('selectedCategory' in simpleChanges){
      this.selectedCategory = this.selectedCategory ? this.selectedCategory.key : '';
    }
    if('selectedOccupation' in simpleChanges){
      this.selectedOccupation = this.selectedOccupation ? this.selectedOccupation.key : '';
    }
    if('selectedConstitution' in simpleChanges){
      console.log('selectedConstitution:',this.selectedConstitution);
      this.selectedConstitution = this.selectedConstitution ? this.selectedConstitution.key : '';
    }
    if('selectedAssesmentMethodology' in simpleChanges){
      this.selectedAssesmentMethodology = this.selectedAssesmentMethodology ? this.selectedAssesmentMethodology.key : '';
    }
  }

}
