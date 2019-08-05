import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-module',
  templateUrl: './user-module.component.html',
  styleUrls: ['./user-module.component.css']
})
export class UserModuleComponent implements OnInit {
  collection = [];

  constructor() { 
    for (let i = 1; i <= 100; i++) {
      this.collection.push(`${i}`);
    }
  }

  ngOnInit() {
  }

}
