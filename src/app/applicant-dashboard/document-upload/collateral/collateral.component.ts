import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray, NgForm } from '@angular/forms'


@Component({
  selector: 'app-collateral',
  templateUrl: './collateral.component.html',
  styleUrls: ['./collateral.component.css']
})
export class CollateralComponent  {
    fieldArray: Array<any> = [];
    newAttribute: any = {};


  addFieldValue() {
    this.fieldArray.push(this.newAttribute)
    console.log(this.fieldArray)
    this.newAttribute = {};
  }

  deleteFieldValue(index) {
      this.fieldArray.splice(index, 1);
  }


}
