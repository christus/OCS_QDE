import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-retrieve',
  templateUrl: './retrieve.component.html',
  styleUrls: ['./retrieve.component.css']
})
export class RetrieveComponent implements OnInit {

  viewMode:string = 'tab1';
  constructor() { }

  ngOnInit() {
  }

}
