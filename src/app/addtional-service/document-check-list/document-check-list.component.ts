import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import Qde from 'src/app/models/qde.model';
import { QdeService } from 'src/app/services/qde.service';

@Component({
  selector: 'app-document-check-list',
  templateUrl: './document-check-list.component.html',
  styleUrls: ['./document-check-list.component.css'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class DocumentCheckListComponent implements OnInit {
  qde: Qde
  constructor(private qdeService: QdeService ) { 
    this.qdeService.qdeSource.subscribe(
      val =>
      this.qde = val
    );

  }

  ngOnInit() {
    console.log("qde value in document checklist " ,this.qde);
  }

}
