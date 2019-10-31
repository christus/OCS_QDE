import { Component, OnInit, ViewChildren, ElementRef, QueryList, EventEmitter, OnChanges, SimpleChanges, AfterViewInit, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QdeHttpService } from 'src/app/services/qde-http.service';
import { NgForm } from '@angular/forms';

interface CLSS {
  userId: number;
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

  searchKey:string;
  tempLovs: Array<CLSS>;
  // previousLength: number;

  lovs: Array<CLSS>;

  @ViewChildren('lovsElements') lovsElements: QueryList<ElementRef>;
  @ViewChildren('myForm') myForm: QueryList<NgForm>;

  constructor(private route: ActivatedRoute,
              private qdeHttp: QdeHttpService,
              private ren: Renderer2) {

    let response = this.route.snapshot.data['clssData']['ProcessVariables'];

    // if(response['status'] == true) {
      this.tempLovs = this.lovs = response['clssDetailsList'].map((v, i) => {

        console.log(v['aadhaarRequired']);

        return {
          userId: localStorage.getItem('userId'), // Ashwin told
          aadhaarRequired: v['aadhaarRequired'],
          clssId: parseInt(v['clssId']),
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
          targetSegment: v['targetSegment'],
          isEdit: true
        };
      });
    // }
  }

  ngOnInit() {
  }

  save(index) {

    this.lovs[index].maximumAge = parseInt(this.lovs[index].maximumAge.toString());
    this.lovs[index].maximumIncomeInLakhs = parseInt(this.lovs[index].maximumIncomeInLakhs.toString());
    this.lovs[index].maximumLoanAmountInLakhs = parseInt(this.lovs[index].maximumLoanAmountInLakhs.toString());
    this.lovs[index].maximumTenureInMonths = parseInt(this.lovs[index].maximumTenureInMonths.toString());
    this.lovs[index].minimumAge = parseInt(this.lovs[index].minimumAge.toString());
    this.lovs[index].minimumIncomeInLakhs = parseInt(this.lovs[index].minimumIncomeInLakhs.toString());
    this.lovs[index].minimumLoanAmountInLakhs = parseInt(this.lovs[index].minimumLoanAmountInLakhs.toString());
    this.lovs[index].propertySizeInSquareMetre = parseInt(this.lovs[index].propertySizeInSquareMetre.toString());
    this.lovs[index].schemeBenefitsInYears = parseInt(this.lovs[index].schemeBenefitsInYears.toString());
    this.lovs[index].schemeBenefitsUptoInLakhs = parseInt(this.lovs[index].schemeBenefitsUptoInLakhs.toString());
    this.lovs[index].subsidyInterest = parseFloat((this.lovs[index].subsidyInterest).toFixed(1));

    this.lovs.forEach((v, i) => {
      delete this.lovs[i].isEdit;
    });

    if(this.lovs[index].minimumIncomeInLakhs > 0 && this.myForm['_results'][index].valid) {
      this.qdeHttp.adminCLSSUpdate(this.lovs[index]).subscribe(response => {
        if(response['ProcessVariables']['status'] == true) {
          this.lovs.forEach((v, i) => {
            this.lovs[i].isEdit = true;
          });
        } else {
          alert("Please enter valid data. Server does'nt Accept Invalid entries");
        }
      });
    } else {
      alert("Please enter valid data.");
    }

    console.log(this.lovs[index]);

    
    // console.log(this.lovs[index].description);
    // if(this.lovs[index].description != '' && this.lovs[index].value != '') {

      // if(this.lovs[index].male == false && this.lovs[index].female == false) {
      //   alert("Please enter all values");
      //   this.refresh();
      // }

    //   this.qdeHttp.insertUpdateEachLovs(this.lovs[index]).subscribe(res => {
    //     if(res['ProcessVariables']['status'] == true) {
    //       console.log(this.lovs[index]);
    //       this.lovs[index].isEdit = true;
    //       this.lovs[index].clssId = res['ProcessVariables']['id'];
    //     } else {
    //       this.refresh();
    //       alert('LOV could not be saved');
    //     }
    //   });
    // // } else {
    // //   console.log(this.lovs[index]);
    // //   alert("Please enter all values");
    // //   this.refresh();
    // // }
    // this.tempLovs = this.lovs;
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
    this.searchKey=""
    this.qdeHttp.adminLoadMoreClss().subscribe(res => {
      this.lovs = res['ProcessVariables']['clssDetailsList']
      for(var x in this.lovs){
        this.lovs[x].isEdit=true;
      }
      //   console.log(v['aadhaarRequired']);

      //   return {
      //     userId: localStorage.getItem('userId'), // Ashwin told
      //     aadhaarRequired: v['aadhaarRequired'],
      //     clssId: parseInt(v['clssId']),
      //     clssType: v['clssType'],
      //     femaleOwnership: v['femaleOwnership'],
      //     houseConstruction: v['houseConstruction'],
      //     houseExtension: v['houseExtension'],
      //     houseImprovement: v['houseImprovement'],
      //     maximumAge: v['maximumAge'],
      //     maximumIncomeInLakhs: v['maximumIncomeInLakhs'],
      //     maximumLoanAmountInLakhs: v['maximumLoanAmountInLakhs'],
      //     maximumTenureInMonths: v['maximumTenureInMonths'],
      //     minimumAge: v['minimumAge'],
      //     minimumIncomeInLakhs: v['minimumIncomeInLakhs'],
      //     minimumLoanAmountInLakhs: v['minimumLoanAmountInLakhs'],
      //     newHouse: v['newHouse'],
      //     nonHousingProduct: v['nonHousingProduct'],
      //     plotLoan: v['plotLoan'],
      //     propertySizeInSquareMetre: v['propertySizeInSquareMetre'],
      //     resaleHouse: v['resaleHouse'],
      //     schemeBenefitsInYears: v['schemeBenefitsInYears'],
      //     schemeBenefitsUptoInLakhs: v['schemeBenefitsUptoInLakhs'],
      //     subsidyInterest: v['subsidyInterest'],
      //     targetSegment: v['targetSegment'],
      //     isEdit: true
      //   };
      // });
      // if(res['ProcessVariables']['status'] == true) {
      //   this.tempLovs = this.lovs = res['ProcessVariables']['valueDescription'].map((v, i) => {

      //     return {
      //       userId: localStorage.getItem('userId'),
      //       key: (i+1),
      //       description: v['description'],
      //       value: v['value'],
      //       isEdit: true,
      //       id: v['id'],
      //       male: v['male'],
      //       female: v['female'] 
      //     }
      //   });
      // }
    }, err => {

    });
  }

  search(event) {
    this.qdeHttp.adminClssSearch(event.target.value).subscribe(response => {
      console.log("mamam",response)
      this.lovs = response["ProcessVariables"]["clssDetailsList"]
      for(var x in this.lovs){
        this.lovs[x].isEdit=true;
      }
    });
  }

  changeRadio(event, keyName, index) {
    this.lovs[index][keyName] = event.target.value == 'true' ? true: false;
    console.log(this.lovs[index]);
  }
}
