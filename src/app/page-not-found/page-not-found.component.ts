import { Component, OnInit } from '@angular/core';

@Component({
  selector: "app-page-not-found",
  template: `
    <div class="container">404 - Page Not Found</div>
  `,
  styles: [
    ` .container {
        text-align: center;
        font-weight: bolder;
        color: #ed691f;
        position: absolute;
        font-size:18px;
        top: 20%;
        width: 100%;
        max-width: 100%;
      }
    `
  ]
})
export class PageNotFoundComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
