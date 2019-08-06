import { QdeHttpService } from 'src/app/services/qde-http.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-module',
  templateUrl: './user-module.component.html',
  styleUrls: ['./user-module.component.css']
})
export class UserModuleComponent implements OnInit {
  collection: any[] = [];  
  p: number = 1;
  userTable:any[] ;


  constructor(private qdeHttp: QdeHttpService) { 

     
  }

  ngOnInit() {
    this.qdeHttp.getAdminUsers({}).subscribe((response) => {
        this.collection = response['ProcessVariables'].userTable;
        console.log(this.collection);
    });
  }

}
