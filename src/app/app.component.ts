import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { Plugins, AppState } from '@capacitor/core';

import { DeviceDetectorService } from 'ngx-device-detector';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  isMobile:any;

  title = 'OCS-QDE';

  constructor(private deviceService: DeviceDetectorService,
    private renderer: Renderer2){
    this.isMobile = this.deviceService.isMobile() ;
    if(this.isMobile){
      this.renderer.addClass(document.body, 'mobile');
    }
  }

  ngOnInit() {
    document.addEventListener('backbutton', () => {
      navigator["app"].exitApp();
   });
  }
}
