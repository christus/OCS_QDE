import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

export default class AuthInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Token will be set from cookie, if not present then dont add this header
        let authReq = req.clone({
          // headers: req.headers.set('Authorization', token)
          headers: req.headers.append(
            "authentication-token",
            "o0wLszAr/3Hm0jDjFqxBnZb/pVgGAYimKowJk5/B3WMfXZJCEMLuKFgxM9RtZPcl"
          )
        });

        return next.handle(authReq);
    }
}