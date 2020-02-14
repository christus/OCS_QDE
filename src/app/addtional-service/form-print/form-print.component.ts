import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-form-print',
  templateUrl: './form-print.component.html',
  styleUrls: ['./form-print.component.css']
})
export class FormPrintComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  printPage() {
    window.print();
  }

}
