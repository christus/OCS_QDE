import { Directive, ElementRef, Renderer2, HostListener, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[fieldFill]'
})
export class FieldFillDirective implements OnChanges {

  constructor(private el: ElementRef, private ren: Renderer2) { }

  @Input() ngModel;
 
  ngOnInit() {
    // if(this.el.nativeElement.value != '') {
    //   this.ren.addClass
    // } else {
    //   this.ren.
    // }
    // console.log("NGMODEL ", this.ngModel);
  }

  ngOnChanges(change: SimpleChanges) {
    if( change.ngModel.currentValue != '' &&
        change.ngModel.currentValue != null &&
        change.ngModel.currentValue != undefined) {
      this.ren.addClass(this.el.nativeElement.parentElement, 'filled');
    } else {
      this.ren.removeClass(this.el.nativeElement.parentElement, 'filled');
    }
  }

  @HostListener('focus', ['$event.target'])
  inputFocus(e) {
    this.ren.addClass(e.parentElement, 'filled');
  }

  @HostListener('blur', ['$event.target'])
  inputBlur(e) {
    if( e.value == '' ||
        e.value == null ||
        e.value == undefined) {
      this.ren.removeClass(e.parentElement, 'filled');
    }
  }

  @HostListener('paste', ['$event']) blockPaste(e: KeyboardEvent) {
    e.preventDefault();
  }

  @HostListener('copy', ['$event']) blockCopy(e: KeyboardEvent) {
    e.preventDefault();
  }

  @HostListener('cut', ['$event']) blockCut(e: KeyboardEvent) {
    e.preventDefault();
  }
}