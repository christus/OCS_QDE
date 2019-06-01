import { Component, OnInit, Input } from '@angular/core';
import { InCompleteFields } from 'src/app/models/qde.model';

@Component({
  selector: 'app-view-form-co-applicant',
  templateUrl: './view-form-co-applicant.component.html',
  styleUrls: ['./view-form-co-applicant.component.css']
})
export class ViewFormCoApplicantComponent implements OnInit {

  @Input('isIncomplete') isIncomplete: InCompleteFields;

  constructor() { }

  ngOnInit() {
  }

}
