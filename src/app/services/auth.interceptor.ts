import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";
import { UtilService } from './util.service';
import { Inject } from '@angular/core';
import { environment } from 'src/environments/environment';

import { NgxUiLoaderService } from 'ngx-ui-loader'; // Import NgxUiLoaderService


export class AuthInterceptor implements HttpInterceptor {

  constructor(@Inject(UtilService) private utilService,
  private ngxService: NgxUiLoaderService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      // Token will be set from cookie, if not present then dont add this header

      this.ngxService.start(); // start foreground spinner of the master loader with 'default' taskId

      let uri = environment.host + environment.appiyoDrive;
      if (!req.headers.has('Content-Type') && req.url !== uri) {
        req = req.clone({ headers: req.headers.set('Content-Type', 'application/x-www-form-urlencoded') });
      }

      const authReq = req.clone({
        headers: req.headers.append(
          'authentication-token',
          localStorage.getItem('token') ? localStorage.getItem('token') : ''
        )
      });

    return next.handle(authReq).pipe(
      map(
        (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {

            this.ngxService.stop(); // stop foreground spinner of the master loader with 'default' taskId

            console.log("Response: " + event.body);
            const response = event.body;
            if (response && response["login_required"]) {
              this.utilService.clearCredentials();
            }
            return event;
          }
        },
        (err: any) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 401) {
            }
          }
        }
      )
    );
  }
}