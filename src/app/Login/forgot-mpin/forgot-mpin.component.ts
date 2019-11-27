import { environment } from 'src/environments/environment';
import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { QdeHttpService } from 'src/app/services/qde-http.service';

import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';


@Component({
  selector: 'app-forgot-mpin',
  templateUrl: './forgot-mpin.component.html',
  styleUrls: ['./forgot-mpin.component.css']
})
export class ForgotMPINComponent implements OnInit {

  userName = "";
  uuID:string;

  logError = false;

  errorMsg = "";



  constructor(private router: Router,
    private qdeService: QdeHttpService, private uniqueDeviceID: UniqueDeviceID ) { }

  ngOnInit() {
  }

  setMpin() {
  }


}
