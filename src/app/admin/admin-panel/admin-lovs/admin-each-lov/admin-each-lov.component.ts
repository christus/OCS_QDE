import { Component, OnInit, ViewChildren, ElementRef, QueryList, EventEmitter, OnChanges, SimpleChanges, AfterViewInit, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QdeHttpService } from 'src/app/services/qde-http.service';

@Component({
  selector: 'admin-each-lov',
  templateUrl: './admin-each-lov.component.html',
  styleUrls: ['./admin-each-lov.component.css']
})
export class AdminEachLovComponent implements OnInit, AfterViewInit {

  lovs: Array<any>;
  tempLovs: Array<any>;
  // previousLength: number;
  tableName: string;
  isApplicantTitle: boolean;

  @ViewChildren('lovsElements') lovsElements: QueryList<ElementRef>;

  constructor(private route: ActivatedRoute,
              private qdeHttp: QdeHttpService,
              private ren: Renderer2) {

    this.route.params.subscribe(v => {
      this.tableName = v['eachLovName']
      this.isApplicantTitle = this.tableName == 'applicant_title' ? true: false;
    });

    let response = this.route.snapshot.data['eachLovs']['ProcessVariables'];

    if(this.route.snapshot.data['eachLovs']['ProcessVariables']['status'] == true) {
      this.tempLovs = this.lovs = this.route.snapshot.data['eachLovs']['ProcessVariables']['valueDescription'].map((v, i) => {

        return {
          userId: localStorage.getItem('userId'),
          key: (i+1),
          description: v['description'],
          value: v['value'],
          isEdit: true,
          id: v['id'],
          male: v['male'],
          female: v['female'],
          tableName: this.tableName
        }
      });
    }
  }

  ngOnInit() {
  }

  save(index) {

    console.log(this.lovs[index].description);
    if(this.lovs[index].description != '' && this.lovs[index].value != '') {

      this.qdeHttp.insertUpdateEachLovs(this.lovs[index]).subscribe(res => {
        if(res['ProcessVariables']['status'] == true) {
          console.log(this.lovs[index]);
          this.lovs[index].isEdit = true;
        } else {
          alert('LOV could not be saved');
          this.lovs.pop();
        }
      });
    } else {
      console.log(this.lovs[index]);
      alert("Please enter all values");
      this.lovs.pop();
    }
    this.tempLovs = this.lovs;
  }

  addNew() {
    this.lovs.push({key: (this.lovs.length+1), description: '', value: '', isEdit: false, male: false, female: false, tableName: this.tableName, userId: localStorage.getItem('userId')});
  }

  ngAfterViewInit() {
    // this.previousLength = this.tempLovs.length;

    // this.lovsElements.changes.subscribe(e => {
    //   if(this.previousLength < e.length) {
    //     e.last.nativeElement.focus();
    //   }
    //   this.previousLength = e.length;
    // });
  }

  delete(index) {
    let dude = this.lovs[index];
    if(confirm("Are you sure?")) {
      this.qdeHttp.softDeleteLov(dude).subscribe(res => {
        // console.log(res['ProcessVariables']);
        this.lovs.pop();
      });
      this.tempLovs = this.lovs;
    } 
  }

  search(event) {
    if(event.target.value != '') {
      this.lovs = this.tempLovs.filter(v => {
        if(v.description.toLowerCase().trim().search(event.target.value.toLowerCase().trim()) >= 0) {
          return true;
        } else {
          return false;
        }
      });
    } else {
      console.log(this.tempLovs)
      this.lovs = this.tempLovs;
    }
  }

  edit(index) {
    this.lovs[index].isEdit = false;
    console.log(this.lovsElements['_results'][index]);
    this.lovsElements['_results'][index]['nativeElement'].focus();
  }

  changeGender(n: number, index) {
    if(n == 1) {
      this.lovs[index].male = true;
      this.lovs[index].female = false;
    } else if(n == 2) {
      this.lovs[index].male = false;
      this.lovs[index].female = true;
    } else {
      this.lovs[index].male = true;
      this.lovs[index].female = true;
    }
  }
}
