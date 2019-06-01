import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonDataService {

  constructor() { }

  private isMenuBarShown$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  isMenuBarShown = this.isMenuBarShown$.asObservable();

  changeMenuBarShown(isMenuBarShown: boolean) {
    this.isMenuBarShown$.next(isMenuBarShown);
  }


  private isViewFormVisible$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  isViewFormVisible = this.isViewFormVisible$.asObservable();

  changeViewFormVisible(isViewFormVisible: boolean) {
    this.isViewFormVisible$.next(isViewFormVisible);
  }

  private isLogoutVisible$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  isLogoutVisible = this.isLogoutVisible$.asObservable();

  changeLogoutVisible(isLogoutVisible: boolean) {
    this.isLogoutVisible$.next(isLogoutVisible);
  }

}
