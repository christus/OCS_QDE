import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { map, tap, first, catchError } from "rxjs/operators";
import { UtilService } from "./util.service";
import { Inject } from "@angular/core";
import { environment } from "src/environments/environment";

import { NgxUiLoaderService } from "ngx-ui-loader"; // Import NgxUiLoaderService
import { ActivatedRoute, Router } from "@angular/router";
import { EncryptService } from "./encrypt.service";


export class AuthInterceptor implements HttpInterceptor {
  // tslint:disable-next-line: max-line-length
  sharedKsy = "MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAJ+GJdSSEeaNFBLqyfM3DIOgQgWCwJ0INfeZZV7ITsLeuA7Yd02rrkYGIix1IWvoebWVmzhncUepYxHwK1ARCdUCAwEAAQ==";
  constructor(@Inject(UtilService) private utilService,
  private route: ActivatedRoute,
  private router: Router,
  private ngxService: NgxUiLoaderService,
  private encrytionService: EncryptService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    this.ngxService.start(); // start foreground spinner of the master loader with 'default' taskId
    let httpMethod = req.method;

    let uri = environment.host + environment.appiyoDrive;
    if (!req.headers.has('Content-Type') && req.url !== uri) {
      // req = req.clone({ headers: req.headers.set('Content-Type', 'application/x-www-form-urlencoded') });
      if (httpMethod == "POST") {
        const encryption = this.encrytionService.encrypt(req.body, environment.aesPublicKey);
        req = req.clone(
          { setHeaders: encryption.headers,
            body : encryption.rawPayload,
            responseType: "text"
            }
          );
      } else if (httpMethod == "GET") {
        req = req.clone({ headers: req.headers.set('Content-Type', 'application/json') });
      }
      else  {
        req = req.clone({ headers: req.headers.set('Content-Type', 'application/x-www-form-urlencoded') });
      }
    }

    // console.log("token: ", this.route.snapshot)
    // if(this.route.snapshot.queryParams['token'] != null) {
    //   localStorage.setItem('token', this.route.snapshot.queryParams['token']);
    // }

    const authReq = req.clone({
      headers: req.headers.append(
        'authentication-token',
        localStorage.getItem('token') ? localStorage.getItem('token') : ''
      )
    });

  return next.handle(authReq).pipe(
    map(
      (event: HttpEvent<any>) => {
        this.ngxService.stop();
        if (event instanceof HttpResponse) {

          this.ngxService.stop(); // stop foreground spinner of the master loader with 'default' taskId

          console.log("Response: " + event.body);

          let responseValue = event.body;
          let typeOfbody = typeof(responseValue);
          console.log("type of response: ", typeOfbody);
          // if (!responseValue["ok"])
          if (typeof(event.body)!= "object") {
            event = event.clone({ body: JSON.parse(this.encrytionService.decryptResponse(event)) });
            console.log("response OK Vlue: ", responseValue["ok"], responseValue );
          }

          console.log("Response: " + event.body);
          const response = event.body;
          if (response && response["login_required"]) {
            if(this.router.url.search('auto-login') == -1) {
              this.utilService.clearCredentials();
              alert(response['message']);
            }
          }
          return event;
        }
      },
      (err: any) => {
        if (err instanceof HttpErrorResponse) {
          this.ngxService.stop();
          if (err.status === 401) {
          }
        } else {
          this.ngxService.stop();
          alert("Error Message: " + err.message);
        }
      }
    )
  );
}
}
