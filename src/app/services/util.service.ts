import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({providedIn: "root"})
export class UtilService {

  constructor(private router: Router, private http: HttpClient) { }

  isLoggedIn() {
    let loggedIn = false;
    if (localStorage.getItem('token')) {
      loggedIn = true;
    }

    return loggedIn;
  }

  logout() {
    const headers = new HttpHeaders({
      Accept: 'text/html,application/xhtml+xml,application/xml',
      "Access-Control-Allow-Origin": "*"
    });

    const options = { headers: headers };
    let uri = environment.host + "/appiyo/account/logout";
    return this.http.get(uri, options);
  }

  clearCredentials() {
    localStorage.removeItem('token');
    this.navigateToLogin();
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
