import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { screenPages } from '../app.constants';

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

  // paymentActive$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  // paymentActive = this.paymentActive$.asObservable();

  // changePayment(paymentActive: boolean) {
  //   this.paymentActive$.next(paymentActive);
  // }

  //private isViewFormNameVisible$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  private isViewFormNameShown$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  isViewFormNameShown = this.isViewFormNameShown$.asObservable();

  changeViewFormNameVisible(isViewFormNameShown: boolean) {
    this.isViewFormNameShown$.next(isViewFormNameShown);
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


  isHomeVisible$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  isHomeVisible = this.isHomeVisible$.asObservable();

  changeHomeVisible(isHomeVisible: boolean) {
    this.isHomeVisible$.next(isHomeVisible);
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


  loginData$: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public loginData = this.loginData$.asObservable();


  setLogindata(data: object) {
   this.loginData$.next(data)
  }


  isEligibilityForReviews$: BehaviorSubject<Array<{applicationId: string, isEligibilityForReview: boolean}>> = new BehaviorSubject<Array<{applicationId: string, isEligibilityForReview: boolean}>>([]);
  public isEligibilityForReviews = this.isEligibilityForReviews$.asObservable();


  setIsEligibilityForReviews(data: Array<{applicationId: string, isEligibilityForReview: boolean}>) {
    console.log(data.length);
   this.isEligibilityForReviews$.next(data)
  }


  isReadOnlyForm$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isReadOnlyForm = this.isReadOnlyForm$.asObservable();


  setReadOnlyForm(data: boolean) {
   this.isReadOnlyForm$.next(data)
  }

  isMainTabEnabled$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public isMainTabEnabled = this.isMainTabEnabled$.asObservable();


  setIsMainTabEnabled(data: boolean) {
   this.isMainTabEnabled$.next(data);
  }


  isTBMLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isTBMLoggedIn = this.isTBMLoggedIn$.asObservable();


  setIsTBMLoggedIn(data: boolean) {
   this.isTBMLoggedIn$.next(data);
  }


  activeTab$: BehaviorSubject<string> = new BehaviorSubject<string>(screenPages['applicantDetails']);
  public activeTab = this.activeTab$.asObservable();


  setactiveTab(data: string) {
   this.activeTab$.next(data);
  }

  enableTabsIfStatus1(status) {
    if(status >= 5) {
      this.setIsMainTabEnabled(false);
    } else {
      this.setIsMainTabEnabled(true);
    }
  }

}
