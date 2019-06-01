import { Directive, ElementRef, Renderer2, HostListener } from '@angular/core';

@Directive({
  selector: '[fieldFill]'
})
export class FieldFillDirective {

  constructor(private el: ElementRef, private ren: Renderer2) { }

  @HostListener('focus', ['$event.target'])
  inputFocus(e) {
    this.ren.addClass(e.parentElement, 'filled');
  }

  @HostListener('blur', ['$event.target'])
  inputBlur(e) {
    this.ren.removeClass(e.parentElement, 'filled');
  }
}
