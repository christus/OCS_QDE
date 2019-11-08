import { environment } from 'src/environments/environment';
import { QdeHttpService } from 'src/app/services/qde-http.service';
import { UtilService } from 'src/app/services/util.service';
import { AuthGuard } from './../guards/auth.guard';
import { Router } from '@angular/router';
import { Injectable, NgZone } from '@angular/core';


const MINUTES_UNITL_AUTO_LOGOUT = environment.logoutTime; // in Minutes
const CHECK_INTERVALL = 1000 // in ms
const STORE_KEY = 'lastAction';

@Injectable()
export class AutoLogoutService {

  constructor(
    private auth: AuthGuard,
    private router: Router,
    private ngZone: NgZone,
    private utilService: UtilService,
    private service: QdeHttpService
  ) {
    this.check();
    this.initListener();
    this.initInterval();
  }

  get lastAction() {
    return parseInt(localStorage.getItem(STORE_KEY));
  }
  set lastAction(value) {
    localStorage.setItem(STORE_KEY, value.toString());
  }

  initListener() {
    this.ngZone.runOutsideAngular(() => {
      document.body.addEventListener('click', () => this.reset());
    });
  }

  initInterval() {
    this.ngZone.runOutsideAngular(() => {
      setInterval(() => {
        this.check();
      }, CHECK_INTERVALL);
    })
  }

  reset() {
    this.lastAction = Date.now();
  }

  check() {
    const now = Date.now();
    const timeleft = this.lastAction + MINUTES_UNITL_AUTO_LOGOUT * 60 * 1000;
    const diff = timeleft - now;
    const isTimeout = diff < 0;

    const isTokenAvailable = localStorage.getItem("token");

    this.ngZone.run(() => {
      if (isTimeout && isTokenAvailable) {
        console.log(`Sie wurden automatisch nach ${MINUTES_UNITL_AUTO_LOGOUT} Minuten Inaktivität ausgeloggt.`);

        this.service.logout().subscribe(
          res => {
          },
          error => {
          }
        );
        this.utilService.clearCredentials();
      }
    });
  }
}
