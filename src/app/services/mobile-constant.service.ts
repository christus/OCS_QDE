
import { Injectable } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';

@Injectable()
export class MobileService{
    isMobile:any;
    constructor(private deviceService: DeviceDetectorService){
       this.isMobile = this.deviceService.isMobile() ;
        //this.isMobile = true ;
        console.log("isMobile-constant", this.isMobile);
    }
}