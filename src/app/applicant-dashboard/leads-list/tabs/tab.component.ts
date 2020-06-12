/**
 * Single Tab page
 */

import { Component, Input, AfterViewInit, ChangeDetectorRef, AfterContentChecked, AfterViewChecked, OnInit, DoCheck, OnChanges } from '@angular/core';

@Component({
    selector: 'tab',
    templateUrl: './tab.component.html',
    styleUrls: ['./tab.component.css']
})

export class TabComponent  implements  AfterViewInit{
    @Input('tabTitle') title: string;
    @Input ('isFilter') showFilter: boolean;
    @Input() active; 

    constructor(private cdr:  ChangeDetectorRef){} 

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


    ngAfterViewInit() {        
        this.active = false;
        this.cdr.detectChanges();
       
    }	
   

    
   
}