import { Component, OnInit } from '@angular/core';
import { QdeService } from 'src/app/services/qde.service';
import Qde from 'src/app/models/qde.model';

@Component({
  selector: 'app-additional-pmay-clss-form',
  templateUrl: './additional-pmay-clss-form.component.html',
  styleUrls: ['./additional-pmay-clss-form.component.css']
})
export class AdditionalPmayClssFormComponent implements OnInit {
qde:Qde
  constructor(private qdeService: QdeService) { 
    // this.qde = this.qdeService.getQde();
    this.qdeService.qdeSource.subscribe(
      val =>
      this.qde = val
    );
  }

  ngOnInit() {
  }

}
