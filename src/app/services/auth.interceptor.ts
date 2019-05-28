import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";
import { UtilService } from './util.service';
import { Inject } from '@angular/core';

export default class AuthInterceptor implements HttpInterceptor {

  constructor(@Inject(UtilService) private utilService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      // Token will be set from cookie, if not present then dont add this header
      const authReq = req.clone({
        headers: req.headers.append(
          'authentication-token',
          localStorage.getItem('token') ? localStorage.getItem('token') : ''
        ).append(
          'Content-Type',
          'application/x-www-form-urlencoded'
        )
      });

    return next.handle(authReq).pipe(
      map(
        (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {

            console.log("Response: " + event.body);
            const response = event.body;
            if (response && response["login_required"]) {
              alert("Session Expired!");
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