/**
 * Single Tab page
 */

import { Component, Input, AfterViewInit, ChangeDetectorRef, AfterContentChecked, AfterViewChecked, OnInit, DoCheck, OnChanges, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'tab',
    templateUrl: './tab.component.html',
    styleUrls: ['./tab.component.css']
})

export class TabComponent implements AfterViewInit {
    @Input('tabTitle') title: string;
    @Input('isFilter') showFilter: boolean;
    @Input() active;
    // @Output() onChange = new EventEmitter();
    // isFilterN: boolean = true;

    constructor(private cdr: ChangeDetectorRef) { }

    // onChange(): void {
    //     this.active = false;
    //     this.cdr.detectChanges();
    //   }
    //   ngDoCheck() {
    //     this.active = false;
    //     this.cdr.detectChanges();
    // }
    // ngOnInit(){
    //     this.active = true;
    // }

    // handleChange(event) {
    //     // if(event !== this.title){
    //     console.log('event`', event)
    //     this.isFilterN = event !== this.title ? false : true;
    //     this.onChange.emit(event)
    //     // }
    //     // this.title === event
    // }

    ngAfterViewInit() {
        this.active = false;
        this.cdr.detectChanges();
    }
}