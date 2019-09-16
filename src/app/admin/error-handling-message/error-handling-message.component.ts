import { Component, OnInit } from '@angular/core';
import { QdeHttpService } from 'src/app/services/qde-http.service';

@Component({
  selector: 'app-error-handling-message',
  templateUrl: './error-handling-message.component.html',
  styleUrls: ['./error-handling-message.component.css']
})
export class ErrorHandlingMessageComponent implements OnInit {

  collection: any[] = [];
  totalPages: string;
  totalItems: number;
  from: string;
  currentPage: string;
  perPage: string;
  filterData: number;
  enableLoadMore: boolean;
  constructor( private qdeHttp: QdeHttpService ) { }

  ngOnInit() {
    let data = {};
    data["currentPage"] = 1;
    this.filterData = 1;
    this.getErrorHandlingMessage(data);
  }
  getErrorHandlingMessage(data) {
        this.qdeHttp.getErrorHandlingMessage(data).subscribe((response) =>{
     console.log("errormsg:",response);
 
     this.collection = response['ProcessVariables'].errorDetails;
     this.totalPages = response['ProcessVariables'].totalPages;
       this.from = response['ProcessVariables'].from;
       this.currentPage = response['ProcessVariables'].currentPage;
       this.perPage = response['ProcessVariables'].perPage;
       this.totalItems = parseInt(this.totalPages) * parseInt(this.perPage);
       if (this.currentPage == this.totalPages) {
         this.enableLoadMore = false;
       }
   });
 }
 pageChanged(value) {
  let data = {};
  data["currentPage"] = value;
  this.getErrorHandlingMessage(data);
}

}
