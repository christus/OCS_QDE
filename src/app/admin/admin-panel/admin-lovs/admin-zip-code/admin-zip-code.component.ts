import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';

interface Item {
  key: string;
  value: string;
}

@Component({
  selector: 'admin-zip-code',
  templateUrl: './admin-zip-code.component.html',
  styleUrls: ['./admin-zip-code.component.css']
})
export class AdminZipCodeComponent implements OnInit {

  tableName: string = 'zipcode';
  userId: number;
  pagination: Array<any> = new Array(5);

  states: Array<Item> = [{key: 'Maharashtra', value: '1'}, {key: 'Tamil Nadu', value: '2'}];
  zones: Array<Item> = [{key: 'Mumbai 1', value: '1'}, {key: 'Mumbai 2', value: '2'}];
  cities: Array<Item> = [{key: 'Mumbai', value: '1'}, {key: 'Navi Mumbai', value: '2'}];


  data: Array<any> = [
    {
      userId: 54,
      tableName: 'zipcode',
      state: 'Maharashtra',
      zone: 'Mumbai-Surburb',
      city: 'Mumbai',
      description: 'Chakala',
      value: '400093'
    }
  ];

  isAdd: boolean = false;

  constructor(private route: ActivatedRoute) {
    this.userId = parseInt(localStorage.getItem('userId'));

    this.pagination
  }

  ngOnInit() {
  }

  add() {
    this.isAdd = !this.isAdd;
  }

  submitForm(form: NgForm) {
    console.log(form);
  }
}
