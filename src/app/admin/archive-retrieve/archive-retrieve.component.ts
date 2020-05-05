import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-archive-retrieve',
  templateUrl: './archive-retrieve.component.html',
  styleUrls: ['./archive-retrieve.component.css']
})
export class ArchiveRetrieveComponent implements OnInit {

  type: string;
  archiveFlag: boolean;
  retrieveFlag: boolean;
  typeHeader: string;

  constructor(private route: ActivatedRoute) { 

    console.log(this.route.snapshot.url[0]['path'])
    this.type = this.route.snapshot.url[0]['path'];

  }

  ngOnInit() {
    if(this.type === 'archive') {
      this.archiveFlag = true;
      this.typeHeader = 'Archive'
    }else {
      this.retrieveFlag = true;
      this.typeHeader = 'Retrieve'
    }
  }

}
