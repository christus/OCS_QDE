import { CommonDataService } from 'src/app/services/common-data.service';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from "@angular/common/http";
import { Observable, of } from "rxjs";
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
  private isNgxRunning: boolean = false;
  private totalRequests = 0;
  private currentHref;

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    localStorage.setItem("login_required", "false");

    this.currentHref = window.location.href;
    if(this.currentHref.includes("admin")){
      this.ngxService.start();
    }

    this.isSpinnerRequired(req);


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
      headers: req.headers.set('authentication-token', localStorage.getItem('token') ? localStorage.getItem('token'): '')
      .set('X-AUTH-SESSIONID', localStorage.getItem('X-AUTH-SESSIONID') ? localStorage.getItem('X-AUTH-SESSIONID').trim() : '')
  });

  return next.handle(authReq).pipe(
    // catchError((errcatchError((err: HttpErrorResponse) : Observable<any> =>{
    //     this.handleError(err);
    //     return of ();
    //   })
    map(
      (event: HttpEvent<any>) => {

        if (event instanceof HttpResponse) {          
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
            if(response['Error']=="0"
              && response['Error']!=undefined
              && response['ProcessVariables']!=""
              && response['ProcessVariables']!= undefined
              && response['ProcessVariables']['status']==true
              && response['ProcessVariables']['status']!=undefined
              && response['ProcessVariables']['errorCode']==""
              && response['ProcessVariables']['errorCode']!=undefined){
              // console.log("There are no Errors");
            }else if(response['Error']=="0"
          && response['Error']!=undefined
          && response['ProcessVariables']!=""
          && response['ProcessVariables']!= undefined
          && response['ProcessVariables']['status']==false
          && response['ProcessVariables']['status']!=undefined
          && response['ProcessVariables']['errorCode']!=""
          && response['ProcessVariables']['errorCode']!=undefined){
            let data = response['ProcessVariables']['errorCode'];
	    let msg = response['ProcessVariables']['errorMessage'];
	  if(response['ProcessVariables']['errorMessage']!=undefined && response['ProcessVariables']['errroMessage']!=""){
            this.cds.setErrorData(true, data, msg);
	  }else{
	    this.cds.setErrorData(true,data);
	  }
          }else if(response['Error']=="0"
          && response['Error']!=undefined
          && response['ProcessVariables']!=""
          && response['ProcessVariables']!= undefined
          && response['ProcessVariables']['status']==false
          && response['ProcessVariables']['status']!=undefined){
            if(response['ProcessName']!="Required documents"){
            let data = "DEF";
            this.cds.setErrorData(true, data);
          }
          }else if((response['Error']=="1"
          && response['Error']!=undefined) || (response['status']===false && response['status']!=undefined)){
            let data = "APP001";
            this.cds.setErrorData(true, data);
          }
        

            if (response && response["login_required"]) {
              if(this.router.url.search('auto-login') == -1) {

                this.cds.setDialogData(true);

                this.utilService.clearCredentials();
                // alert(response['message']);
                this.ngxService.stop();
                this.isNgxRunning= false;
              }
              this.utilService.clearCredentials();
              this.ngxService.stop();
              this.isNgxRunning= false;
            }

            this.decreaseRequests(response['ProcessId']);

            this.currentHref = window.location.href;
            if(this.currentHref.includes("admin")){
              this.ngxService.stop();
            }

            return event;
          }
          //this.ngxService.stop();
        },
        (err: any) => {
          if (err instanceof HttpErrorResponse) {
            this.ngxService.stop();
            this.isNgxRunning= false;
            if (err.status === 401) {
            }
          } else {
            this.ngxService.stop();
            this.isNgxRunning= false;
            alert("Error Message: " + err.message);
          }      
          this.ngxService.stop();
          this.isNgxRunning= false;
        }

      )
    );
  }

  isSpinnerRequired(req){
    if(req.body != null) {
      let typeofBody = typeof(req.body)
      let reqBody  = req.body;
     if (typeofBody != "object"){
      reqBody = JSON.parse(req.body);
     }
      let needSpinner;
      if (reqBody.processId) {
      let processId = JSON.parse(req.body).processId;
         needSpinner = this.checkProcessNeedSpinner(processId);
      }
      if(needSpinner) {
        this.totalRequests++;
        if(!this.isNgxRunning){
          this.ngxService.start();
          this.isNgxRunning = true;
        }
      }
    }
  }


  checkProcessNeedSpinner(processId) {
    if(processId == environment.api.get.processId ||
        processId == environment.api.lov.processId ||
        processId == environment.api.sendOTP.processId ||
        processId == environment.api.cityState.processId ||
        processId == environment.api.checkCompanyDetails.processId || 
        processId == environment.api.assessmentListForProfileApplicantType.processId ||
        processId == environment.api.ops.processId ||
        // processId == environment.api.getOccupationLov.processId ||
        processId == environment.api.getLoanPurposeFromLoanType.processId ||
        processId == environment.api.clssSearch.processId ||
        processId == environment.api.clss.processId ||
        processId == environment.api.getApplicantRelationships.processId ||
        processId == environment.api.applicableDocuments.processId ||
        processId == environment.api.mandatoryDocs.processId ||
        processId == environment.api.getApplicationStatus.processId ||
        processId == environment.api.save.processId ||
        processId == environment.api.aps.processId || 
        processId == environment.api.payGate.processId ||
        processId == environment.api.saveTermsAndCondition.processId ||
        processId == environment.api.status.processId ||
        processId == environment.api.upload.processId ||
        processId == environment.api.offlinePaymentUpload.processId) {
        return true;
    }
  }
  

  private decreaseRequests(processId) {
    let needSpinner = this.checkProcessNeedSpinner(processId);
    if(needSpinner) {
      this.totalRequests--;
    }
    if (this.totalRequests === 0) {
      this.ngxService.stop();
      this.isNgxRunning= false;
    }
  }

  private handleError(err: HttpErrorResponse){
      if (err instanceof HttpErrorResponse) {
        this.ngxService.stop();
        this.isNgxRunning= false;
        if (err.status === 408) {
          let data = "HTTPTimeOut";
          this.cds.setErrorData(true, data);
          this.ngxService.stop();
          this.isNgxRunning= false;
        }else if(err.status === 0){
          let data = "HTTP";
          this.cds.setErrorData(true, data);
          this.ngxService.stop();
          this.isNgxRunning= false;
        }
      } 
      // else {
      //   this.ngxService.stop();
      //   this.isNgxRunning= false;
      //   alert("Error Message: " + err['statusText']);
      // }      
  }

}
