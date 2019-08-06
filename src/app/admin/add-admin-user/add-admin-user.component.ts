import { QdeHttpService } from 'src/app/services/qde-http.service';
import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';


@Component({
  selector: 'app-add-admin-user',
  templateUrl: './add-admin-user.component.html',
  styleUrls: ['./add-admin-user.component.css']
})
export class AddAdminUserComponent implements OnInit {

  userRoles: Array<any>;
  branch: Array<any>;
  formdata;

  constructor(private qdeHttp: QdeHttpService) {
    // this.qdeHttp.adminGetUserLov({}).subscribe((response) => {
    //   var lov = JSON.parse(response['ProcessVariables'].lovs);
    //   this.userRole = lov.LOVS.religion;
    //   this.branch = lov.LOVS.qualification;
    // });


    this.userRoles = [
      {
        "key": "Hindu",
        "value": "1"
      },
      {
        "key": "Muslim",
        "value": "2"
      },
      {
        "key": "Christian",
        "value": "3"
      },
      {
        "key": "Sikh",
        "value": "4"
      },
      {
        "key": "Buddhist",
        "value": "5"
      },
      {
        "key": "Others",
        "value": "6"
      }
    ];

    this.branch = [
      {
        "key": "Professional",
        "value": "1"
      },
      {
        "key": "Post Graduate",
        "value": "2"
      },
      {
        "key": "Graduate",
        "value": "3"
      },
      {
        "key": "Diploma",
        "value": "4"
      },
      {
        "key": "Under Graduate",
        "value": "5"
      },
      {
        "key": "HSC",
        "value": "6"
      },
      {
        "key": "SSC",
        "value": "7"
      },
      {
        "key": "Below Matric",
        "value": "8"
      }
    ];


  }

  ngOnInit() {
  }

  onSubmit(data) {
    console.log('data',data.value);

    // this.qdeHttp.addAdminUsers(data).subscribe((response) => {
    //   console.log(response);
    // });

  }

}
