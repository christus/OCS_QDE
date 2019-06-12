import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-declaration1',
  templateUrl: './declaration1.component.html',
  styleUrls: ['./declaration1.component.css']
})
export class Declaration1Component implements OnInit {

  constructor(private el: ElementRef,
              private ren: Renderer2) { }

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
