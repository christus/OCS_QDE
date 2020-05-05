import { Component, OnInit } from '@angular/core';
import { QdeHttpService } from 'src/app/services/qde-http.service';
import { } from 'ng-multiselect-dropdown';
import { FormGroup, FormControl} from '@angular/forms'

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.css']
})
export class ArchiveComponent implements OnInit {

  viewMode:string = 'tab1';

  constructor() { }

  ngOnInit() {

  }

}
