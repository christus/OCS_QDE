import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonDataService {

  constructor() { }

  isMenuBarShown$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  isMenuBarShown = this.isMenuBarShown$.asObservable();

  changeMenuBarShown(isMenuBarShown: boolean) {
    this.isMenuBarShown$.next(isMenuBarShown);
  }

  isViewFormNameVisible$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  isViewFormNameVisible = this.isMenuBarShown$.asObservable();

  changeViewFormNameVisible(isViewFormNameVisible: boolean) {
    this.isMenuBarShown$.next(isViewFormNameVisible);
  }

  isViewFormVisible$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  isViewFormVisible = this.isViewFormVisible$.asObservable();

  changeViewFormVisible(isViewFormVisible: boolean) {
    this.isViewFormVisible$.next(isViewFormVisible);
  }

  isLogoutVisible$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  isLogoutVisible = this.isLogoutVisible$.asObservable();

  changeLogoutVisible(isLogoutVisible: boolean) {
    this.isLogoutVisible$.next(isLogoutVisible);
  }

  panslide$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  panslide = this.panslide$.asObservable();
  
  changePanSlide(panslide: boolean) {
    this.panslide$.next(panslide);
  }

  panslide2$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public panslide2 = this.panslide2$.asObservable();
  
  changePanSlide2(val: boolean) {
    this.panslide2$.next(val);
  }


  applicationId$: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  public applicationId = this.applicationId$.asObservable();

  changeApplicationId(val: string) {
    console.log("val ", val);
    this.applicationId$.next(val);
  }

  coApplicantIndex$: BehaviorSubject<number> = new BehaviorSubject<number>(null);
  public coApplicantIndex = this.coApplicantIndex$.asObservable();
  
  changeCoApplicantIndex(val: number) {
    this.coApplicantIndex$.next(val);
  }

  applicantIndex$: BehaviorSubject<number> = new BehaviorSubject<number>(null);
  public applicantIndex = this.applicantIndex$.asObservable();
  
  changeApplicantIndex(val: number) {
    this.applicantIndex$.next(val);
  }
}
