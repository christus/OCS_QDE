import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-admin-user',
  templateUrl: './edit-admin-user.component.html',
  styleUrls: ['./edit-admin-user.component.css']
})
export class EditAdminUserComponent implements OnInit {

  userId:string;

  constructor(private route: ActivatedRoute) {

    this.route.params.subscribe(val => {
      if(val['userId'] != null) {
        this.userId = val['userId'];
      }
    });
   }

  ngOnInit() {
  }

}
