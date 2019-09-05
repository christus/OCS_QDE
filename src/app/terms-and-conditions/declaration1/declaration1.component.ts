import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QdeHttpService } from 'src/app/services/qde-http.service';
import { QdeService } from 'src/app/services/qde.service';
import Qde from 'src/app/models/qde.model';

@Component({
  selector: 'app-declaration1',
  templateUrl: './declaration1.component.html',
  styleUrls: ['./declaration1.component.css']
})
export class Declaration1Component implements OnInit {

  applicationId: string;
  applicantId: string;
  qde: Qde;

  constructor(private el: ElementRef,
              private ren: Renderer2,
              private route: ActivatedRoute,
              private qdeService: QdeService) {
                this.qdeService.qdeSource.subscribe(val => {
                  this.qde = val;
                });
    this.qdeService.setQde(JSON.parse(this.route.snapshot.data['qde']['ProcessVariables']['response']));

    this.route.params.subscribe(val => {
      this.applicationId = val.applicationId;
      // this.applicantId = this.qde.application.applicants.find(v => v.applicantId == val.applicantId).applicantId;
      this.applicantId = val.applicantId;
    });
  }

  ngOnInit() {
  }

  changeYesNo(event: any, els: Array<HTMLInputElement>) {
    els.forEach( v => {
      if(v == event.target) {
        return;
      }
        
      v.checked = false;
    });
  }
}
