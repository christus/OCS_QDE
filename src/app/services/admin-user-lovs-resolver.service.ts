import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { QdeHttpService } from './qde-http.service';
@Injectable()
export class AdminUserLovsResolverService implements Resolve<Observable<any>>{

  constructor(private qdeHttp: QdeHttpService) { }

  resolve():any{
    return this.qdeHttp.adminGetUserLov({});
  }
}
