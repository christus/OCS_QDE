import { Component, OnInit, ViewChildren, ElementRef, QueryList, EventEmitter, OnChanges, SimpleChanges, AfterViewInit, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QdeHttpService } from 'src/app/services/qde-http.service';

interface CLSS {
    aadhaarRequired: boolean;
    clssId: number;
    clssType: string;
    femaleOwnership: boolean;
    houseConstruction: boolean;
    houseExtension: boolean;
    houseImprovement: boolean;
    maximumAge: number;
    maximumIncomeInLakhs: number;
    maximumLoanAmountInLakhs: number;
    maximumTenureInMonths: number;
    minimumAge: number;
    minimumIncomeInLakhs: number;
    minimumLoanAmountInLakhs: number;
    newHouse: boolean;
    nonHousingProduct: boolean;
    plotLoan: boolean;
    propertySizeInSquareMetre: number;
    resaleHouse: boolean;
    schemeBenefitsInYears: number;
    schemeBenefitsUptoInLakhs: number;
    subsidyInterest: number;
    targetSegment: string;
    isEdit: boolean;
}

@Component({
  selector: 'clss-checklist',
  templateUrl: './clss-checklist.component.html',
  styleUrls: ['./clss-checklist.component.css']
})
export class ClssChecklistComponent implements OnInit {

  tempLovs: Array<CLSS>;
  // previousLength: number;

  lovs: Array<CLSS>;

  @ViewChildren('lovsElements') lovsElements: QueryList<ElementRef>;

  constructor(private route: ActivatedRoute,
              private qdeHttp: QdeHttpService,
              private ren: Renderer2) {

    let response = this.route.snapshot.data['clssData']['ProcessVariables'];

    // if(response['status'] == true) {
      this.tempLovs = this.lovs = response['clssDetailsList'].map((v, i) => {

        return {
          aadhaarRequired: v['aadhaarRequired'],
          clssId: v['clssId'],
          clssType: v['clssType'],
          femaleOwnership: v['femaleOwnership'],
          houseConstruction: v['houseConstruction'],
          houseExtension: v['houseExtension'],
          houseImprovement: v['houseImprovement'],
          maximumAge: v['maximumAge'],
          maximumIncomeInLakhs: v['maximumIncomeInLakhs'],
          maximumLoanAmountInLakhs: v['maximumLoanAmountInLakhs'],
          maximumTenureInMonths: v['maximumTenureInMonths'],
          minimumAge: v['minimumAge'],
          minimumIncomeInLakhs: v['minimumIncomeInLakhs'],
          minimumLoanAmountInLakhs: v['minimumLoanAmountInLakhs'],
          newHouse: v['newHouse'],
          nonHousingProduct: v['nonHousingProduct'],
          plotLoan: v['plotLoan'],
          propertySizeInSquareMetre: v['propertySizeInSquareMetre'],
          resaleHouse: v['resaleHouse'],
          schemeBenefitsInYears: v['schemeBenefitsInYears'],
          schemeBenefitsUptoInLakhs: v['schemeBenefitsUptoInLakhs'],
          subsidyInterest: v['subsidyInterest'],
          targetSegment: v['targetSegment']
        };
      });
    // }
  }

  ngOnInit() {
  }

  save(index) {

    // console.log(this.lovs[index].description);
    // if(this.lovs[index].description != '' && this.lovs[index].value != '') {

      // if(this.lovs[index].male == false && this.lovs[index].female == false) {
      //   alert("Please enter all values");
      //   this.refresh();
      // }

      this.qdeHttp.insertUpdateEachLovs(this.lovs[index]).subscribe(res => {
        if(res['ProcessVariables']['status'] == true) {
          console.log(this.lovs[index]);
          this.lovs[index].isEdit = true;
          this.lovs[index].clssId = res['ProcessVariables']['id'];
        } else {
          this.refresh();
          alert('LOV could not be saved');
        }
      });
    // } else {
    //   console.log(this.lovs[index]);
    //   alert("Please enter all values");
    //   this.refresh();
    // }
    this.tempLovs = this.lovs;
  }


  delete(index) {
    let dude = this.lovs[index];
    if(confirm("Are you sure?")) {
      this.qdeHttp.softDeleteLov(dude).subscribe(res => {
        // console.log(res['ProcessVariables']);
        this.refresh();
      });
      this.tempLovs = this.lovs;
    } 
  }

  // search(event) {
  //   if(event.target.value != '') {
  //     this.lovs = this.tempLovs.filter(v => {
  //       if(v.description.toLowerCase().trim().search(event.target.value.toLowerCase().trim()) >= 0) {
  //         return true;
  //       } else {
  //         return false;
  //       }
  //     });
  //   } else {
  //     console.log(this.tempLovs)
  //     this.lovs = this.tempLovs;
  //   }
  // }

  edit(index) {
    this.lovs[index].isEdit = false;
    console.log(this.lovsElements['_results'][index]);
    this.lovsElements['_results'][index]['nativeElement'].focus();
  }

  // changeGender(n: number, index) {
  //   if(n == 1) {
  //     this.lovs[index].male = true;
  //     this.lovs[index].female = false;
  //   } else if(n == 2) {
  //     this.lovs[index].male = false;
  //     this.lovs[index].female = true;
  //   } else {
  //     this.lovs[index].male = true;
  //     this.lovs[index].female = true;
  //   }
  // }

  refresh() {
    // this.qdeHttp.adminLoadMoreLovs().subscribe(res => {
    //   if(res['ProcessVariables']['status'] == true) {
    //     this.tempLovs = this.lovs = res['ProcessVariables']['valueDescription'].map((v, i) => {

    //       return {
    //         userId: localStorage.getItem('userId'),
    //         key: (i+1),
    //         description: v['description'],
    //         value: v['value'],
    //         isEdit: true,
    //         id: v['id'],
    //         male: v['male'],
    //         female: v['female'] 
    //       }
    //     });
    //   }
    // }, err => {

    // });
  }

}
