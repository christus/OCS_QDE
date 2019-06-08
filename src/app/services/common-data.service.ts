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

  private isViewFormNameVisible$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  isViewFormNameVisible = this.isMenuBarShown$.asObservable();

  changeViewFormNameVisible(isViewFormNameVisible: boolean) {
    this.isMenuBarShown$.next(isViewFormNameVisible);
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

  private panslide$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  panslide = this.panslide$.asObservable();
  
  changePanSlide(panslide: boolean) {
    this.panslide$.next(panslide);
  }

  private panslide2$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public panslide2 = this.panslide2$.asObservable();
  
  changePanSlide2(val: boolean) {
    this.panslide2$.next(val);
  }


  private applicationId$: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  public applicationId = this.applicationId$.asObservable();
  
  changeApplicationId(val: string) {
    console.log("val ", val);
    this.applicationId$.next(val);
  }

  private coApplicantIndex$: BehaviorSubject<number> = new BehaviorSubject<number>(null);
  public coApplicantIndex = this.coApplicantIndex$.asObservable();
  
  changeCoApplicantIndex(val: number) {
    this.coApplicantIndex$.next(val);
  }

  private applicantIndex$: BehaviorSubject<number> = new BehaviorSubject<number>(null);
  public applicantIndex = this.applicantIndex$.asObservable();
  
  changeApplicantIndex(val: number) {
    this.applicantIndex$.next(val);
  }
}
