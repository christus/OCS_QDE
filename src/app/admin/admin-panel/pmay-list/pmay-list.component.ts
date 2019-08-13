import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { QdeHttpService } from 'src/app/services/qde-http.service';



@Component({
  selector: 'app-pmay-list',
  templateUrl: './pmay-list.component.html',
  styleUrls: ['./pmay-list.component.css']
})
export class PmayListComponent implements OnInit {

  constructor(private route:ActivatedRoute, private qdeHttp: QdeHttpService) { }

  // registerUser = new FormGroup({
  //   stateCode: new FormControl(''),
  //   distCode: new FormControl(''),
  //   stateName: new FormControl(''),
  //   distName: new FormControl(''),
  //   townName: new FormControl(''),
  //   townCode: new FormControl(''),
  //   SubDistCode: new FormControl('')
  // });

  // ngOnInit() {
  //   console.log("each lovs", this.route.snapshot.data["eachLovs"]);
    
  // }

  collection: any[] = [];  
  p: number = 1;
  userTable:any[] ;
  totalPages:string;
  totalItems:number;
  from: string;
  currentPage: string;
  perPage:string;
  enableLoadMore:boolean;

  // paginationConfig =  { 
  //   itemsPerPage: 2, 
  //   totalItems: total 
  // }


  ngOnInit() {
    let data = {};
    data["currentPage"] = 1;

    this.getPmayList(data);
  }

  loadMore() {
    console.log("Load more");
    let data = {};
    data["from"] = this.collection.length +1
    this.getPmayList(data);

  }

  getPmayList(data) {
    let from = data.currentPage;
    this.qdeHttp.getPmayList(data).subscribe((response) => {
      this.collection = response['ProcessVariables'].pmayList;
      this.totalPages = response['ProcessVariables'].totalPages;
      this.from = response['ProcessVariables'].from;
      this.currentPage = response['ProcessVariables'].currentPage;
      this.perPage = response['ProcessVariables'].perPage;
      this.totalItems = parseInt(this.totalPages) * parseInt(this.perPage);
      if(this.currentPage == this.totalPages) {
        this.enableLoadMore = false;
      }
      console.log(this.collection);
    });
  }

  pageChanged(value){
    let data = {};
    data["currentPage"] = value;

    this.getPmayList(data);
  }


}
