import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-ckyc-form',
  templateUrl: './ckyc-form.component.html',
  styleUrls: ['./ckyc-form.component.css'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class CkycFormComponent implements OnInit {

  constructor() {
    // this.qdeService.qdeSource.subscribe(
    //   val =>
    //   this.qde = val
    // );
   }

  ngOnInit() {
  }

}
