import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[fieldEdit]'
})
export class AdminFieldEditDirective {

  /*************************************************************
  * To use this maintain this format
  * <button type="button" class="editLovBtn">Lov Name</button>
  * <input type="text" />
  * 
  * Button followed by input field
  *************************************************************/
  constructor(private el: ElementRef, private ren: Renderer2) { }

  @HostListener('focus', ['$event'])
  inputFocus(e) {
    if(e.target.nodeName == 'BUTTON') {
      // this.ren.addClass(e.target, 'displayNun');
      // this.ren.removeClass(e.target.nextSibling, 'displayNun');
      // e.target.nextSibling.focus();
    }
  }

  @HostListener('blur', ['$event'])
  inputBlur(e) {
    if(e.target.nodeName == 'INPUT') {
      // this.ren.addClass(e.target, 'displayNun');
      // this.ren.removeClass(e.target.previousSibling, 'displayNun');
    }
  }
}
