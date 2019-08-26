import { Directive, Input, HostListener, ElementRef, SimpleChanges } from '@angular/core';
import { NgModel, FormControl } from '@angular/forms';

@Directive({
  selector: '[numberFormatComma]'
})
export class NumberFormatDirective {

  // @Input('ngModel') ngModel: FormControl;

  constructor(private el: ElementRef<HTMLInputElement>) { }

  // @HostListener('keypress', ['$event'])
  // input(e) {
  //   if ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105)) {
  //     // let k = this.getNumberWithCommaFormat(e.target.value+e.key);
  //     // e.target.value = k;
  //   } else {
  //     e.target.value = e.target.value.toString();
  //   }
  // }

  @HostListener('input', ['$event.target'])
  input(e) {
    console.log(this.getNumberWithCommaFormat(e.value));
    e.value = this.getNumberWithCommaFormat(e.value);
  }

  ngOnChanges(change: SimpleChanges) {
    // this.el.setAttribute('attr-invalid', true);
  }

  /*********************************************************
  * Pass 12345678 as argument and will return "1,23,45,678"
  *********************************************************/
  getNumberWithCommaFormat(x: string) : string {
    x=x.toString();
    x = this.getNumberWithoutCommaFormat(x);
    var lastThree = x.substring(x.length-3);
    var otherNumbers = x.substring(0,x.length-3);
    if(otherNumbers != '')
        lastThree = ',' + lastThree;
    var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
    
    return res;
  }
  
  /*******************************************
  * Pass "1,23,45,678" and will return number
  *******************************************/
  getNumberWithoutCommaFormat(x: string) : string {
    return x.split(',').join('');
  }
}
