import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class CaptchaResolverService implements Resolve<Observable<any>> {
  captchaData;
  constructor(private http: HttpClient) { }

  resolve(): any {
   this.captchaData = this.getCaptchaData("");
   console.log("Resolver Call", this.captchaData);
    return this.captchaData;
  }
  getCaptchaData(oldRefId) {
    let uri = environment.host + "/account/captcha/generate_catcha?oldRefId=" + oldRefId + environment.captchFormat;
    // let uri = environment.host + '/account/'+environment.apiVersion.login+'login'; 

    // let uri = environment.host + '/account/login_ne';
    // let uri = environment.host + '/account/login';
   return this.http.get(uri);
  }
}
