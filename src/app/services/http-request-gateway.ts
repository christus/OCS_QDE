import {Injectable} from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { QdeHttpService } from "./qde-http.service";

@Injectable({
    providedIn: 'root'
})

export default class HttpReq {

    http:HttpClient;

    constructor(public httpClient: HttpClient,
        private qdeHttp: QdeHttpService){
        this.http = httpClient;
    }

    callPost(url: string, body: any) {
        return this.qdeHttp.callPost(url, body);
    }
}