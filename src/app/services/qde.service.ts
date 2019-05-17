import { Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import Qde from '../models/qde.model';

@Injectable({
  providedIn: 'root'
})
export class QdeService {

  private dataSource = new Subject<Qde>();

  // Observable Stream
  data$ = this.dataSource.asObservable();

  constructor() { }

  changeData(data: Qde) {
    this.dataSource.next(data);
  }

  // private data: Qde;
  // private data$: EventEmitter<Qde> = new EventEmitter<Qde>();

  // getQde() {
  //   return this.data;
  // }

  // changeQde(data: Qde) {
  //   this.data = data;
  //   this.data$.emit(data);
  // }

  
}
