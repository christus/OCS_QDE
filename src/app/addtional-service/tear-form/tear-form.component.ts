import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { QdeService } from 'src/app/services/qde.service';
import Qde from 'src/app/models/qde.model';

@Component({
  selector: 'app-tear-form',
  templateUrl: './tear-form.component.html',
  styleUrls: ['./tear-form.component.css'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class TearFormComponent implements OnInit {
  qde: Qde
  constructor(private qdeService:QdeService) {
    // this.qde =  this.qdeService.getQde();
    this.qdeService.qdeSource.subscribe(
      val =>
      this.qde = val
    )
   }

  ngOnInit() {
  }

}
