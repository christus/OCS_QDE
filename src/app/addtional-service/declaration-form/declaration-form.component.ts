import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { QdeService } from 'src/app/services/qde.service';
import Qde from 'src/app/models/qde.model';

@Component({
  selector: 'app-declaration-form',
  templateUrl: './declaration-form.component.html',
  styleUrls: ['./declaration-form.component.css'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class DeclarationFormComponent implements OnInit {
qde: Qde
  constructor(private qdeService: QdeService) { 
    // this.qde = this.qdeService.getQde();
    this.qdeService.qdeSource.subscribe(
      val =>
      this.qde = val
    );
    
  }

  ngOnInit() {
    console.log("qde vlue in declaration", this.qde);
  }

}
