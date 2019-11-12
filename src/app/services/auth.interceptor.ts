import { CommonDataService } from 'src/app/services/common-data.service';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { map, tap, first, catchError } from "rxjs/operators";
import { UtilService } from "./util.service";
import { Inject } from "@angular/core";
import { environment } from "src/environments/environment";

import { NgxUiLoaderService } from "ngx-ui-loader"; // Import NgxUiLoaderService
import { ActivatedRoute, Router } from "@angular/router";
import { EncryptService } from "./encrypt.service";
import { json } from "sjcl";


export class AuthInterceptor implements HttpInterceptor {
  // tslint:disable-next-line: max-line-length
  sharedKsy = "MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAJ+GJdSSEeaNFBLqyfM3DIOgQgWCwJ0INfeZZV7ITsLeuA7Yd02rrkYGIix1IWvoebWVmzhncUepYxHwK1ARCdUCAwEAAQ==";
  constructor(@Inject(UtilService) private utilService,
  private route: ActivatedRoute,
  private router: Router,
  private ngxService: NgxUiLoaderService,
  private encrytionService: EncryptService,
  private cds: CommonDataService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    localStorage.setItem("login_required", "false");

    this.ngxService.start(); // start foreground spinner of the master loader with 'default' taskId
    let httpMethod = req.method;
    console.log("*************************************************");
    console.log("before Encryption: ", req.body);
    console.log("*************************************************");
    let uri = environment.host + environment.appiyoDrive;
    if (!req.headers.has('Content-Type') && req.url !== uri) {
      // req = req.clone({ headers: req.headers.set('Content-Type', 'application/x-www-form-urlencoded') });
      if (httpMethod == "POST") {
        if (environment.encryptionType == true) {

        // console.log("req.body", req.body);
        const encryption = this.encrytionService.encrypt(req.body, environment.aesPublicKey);
        req = req.clone(
          { setHeaders: encryption.headers,
            body : encryption.rawPayload,
            responseType: "text"
            }
          );

          console.log("req post", req);
        } else {
          req = req.clone({ headers: req.headers.set('Content-Type', 'application/x-www-form-urlencoded') });
        }
      } else if (httpMethod == "GET") {
        req = req.clone({ headers: req.headers.set('Content-Type', 'application/json') });
      } else  {
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
                
        if (event instanceof HttpResponse) {
          this.ngxService.stop(); // stop foreground spinner of the master loader with 'default' taskId
          let responseValue = event.body;
          let typeOfbody = typeof(responseValue);
          console.log("respose header in auth int ", event.headers.get("content-type"));
          console.log("type of response: ", typeOfbody);
          
          // console.log("Response Value: " + event.body);text/plain          
          if (event.headers.get("content-type") == "text/plain") {
            event = event.clone({ body: JSON.parse(this.encrytionService.decryptResponse(event)) });
            // console.log("after Encryption: ", event.body);
          }
          console.log("*************************************************");
          console.log("after Decryption: " , event.body);
          console.log("*************************************************");
          
          let response = event.body;
          if (event.headers.get("content-type") != "text/plain" && typeof(event.body) != "object") {
            response = JSON.parse(event.body);
          }

          if (response && response["login_required"]) {
            if(this.router.url.search('auto-login') == -1) {

              this.cds.setDialogData(true);
              
              this.utilService.clearCredentials();
              // alert(response['message']);
            }
            this.utilService.clearCredentials();
          }
          this.ngxService.stop();
          return event;
        }
        this.ngxService.stop();
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
        this.ngxService.stop();
      }
      
    )    
  );
}
}
