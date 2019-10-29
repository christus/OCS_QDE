import {Injectable} from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { QdeHttpService } from "./qde-http.service";

@Injectable({
    providedIn: 'root'
})

export default class HttpReq {


    constructor(private qdeHttp: QdeHttpService){
    }

    // callPost(url: string, body: any) {
    //     return this.qdeHttp.callPost(url, body);
    // }
}