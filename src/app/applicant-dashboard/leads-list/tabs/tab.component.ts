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
    @Input() active;

    constructor(private cdr: ChangeDetectorRef) { }

    // onChange(): void {
    //     this.active = false;
    //     this.cdr.detectChanges();
    //   }
    ngAfterViewInit() {
        this.active = false;
        this.cdr.detectChanges();
    }
    // ngAfterContentChecked() {
    //     this.active = false;
    //     this.cdr.detectChanges();
    // }
}