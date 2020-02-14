import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-print-application',
  templateUrl: './print-application.component.html',
  styleUrls: ['./print-application.component.css']
})
export class PrintApplicationComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  printPage() {
    window.print();
  }

}
