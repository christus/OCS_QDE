import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { screenPages } from '../app.constants';

@Injectable({
  providedIn: 'root'
})
export class CommonDataService {
  httpCount: number=0;
  httpTimeOutCount: number;

  constructor() { }

  isMenuBarShown$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  // showCreateLead$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
 

  
  

  isMenuBarShown = this.isMenuBarShown$.asObservable();

  changeMenuBarShown(isMenuBarShown: boolean) {
    this.isMenuBarShown$.next(isMenuBarShown);
  }



  showLogout$: BehaviorSubject<any> = new BehaviorSubject<boolean>(false);
  public showLogout = this.showLogout$.asObservable();

  showError$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public showError = this.showError$.asObservable();

  setErrorData(data: boolean, errorCode: string, errorMessage?:string) {
    let arr = [];
    arr[0] = data;
    arr[1] = errorCode;
    arr[2] = errorMessage;
    this.showError$.next(arr);
   }


  setDialogData(data: boolean) {
   this.showLogout$.next(data)
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
    this.applicationId$.next(val);
  }
  applicantId$: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  public applicantId = this.applicantId$.asObservable();

  changeApplicantId(val: string) {
    this.applicantId$.next(val);
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

  status$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public status = this.status$.asObservable();


  setStatus(data: number) {
   this.status$.next(data);
  }

  enableTabsIfStatus1(status) {
    if(status >= 5) {
      this.setIsMainTabEnabled(false);
    } else {
      this.setIsMainTabEnabled(true);
    }
  }

  applicantName$: BehaviorSubject<string> = new BehaviorSubject<string>("");
  public applicantName = this.applicantName$.asObservable();
  
  changeApplicantName(val: string) {
    this.applicantName$.next(val);
  }

  showCreateLead$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public showCreateLead = this.showCreateLead$.asObservable();

  changeCreateLead(value: boolean) {
    this.showCreateLead$.next(value);
    console.log("change Change create lead ", this.showCreateLead)
  }

  showNewLogin$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public showNewLogin = this.showNewLogin$.asObservable();

  changeNewLogin(value: boolean) {
    this.showNewLogin$.next(value);
  }
  reAssign$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public reAssign = this.reAssign$.asObservable();

  changereAssign(value: boolean) {
    this.reAssign$.next(value);
  }

  reportShow$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public reportShow = this.reportShow$.asObservable();
  
  changereReport(value: boolean) {
    this.reportShow$.next(value);
  }
  documetUploadStatus$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public documetUploadStatus = this.documetUploadStatus$.asObservable();
  
  changedocumetUpload(value: boolean) {
    this.documetUploadStatus$.next(value);
  }

  cdsStatus$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public cdsStatus = this.cdsStatus$.asObservable();
  changeCdsStatus(value: boolean) {
    this.cdsStatus$.next(value);
  }
  userFullName$: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  public userFullName = this.userFullName$.asObservable();
  changeuserFullName(value: string) {
    this.userFullName$.next(value);
  }

  isAdmin$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isAdmin = this.isAdmin$.asObservable();
  changeIsAdmin(value: boolean) {
    this.isAdmin$.next(value);
  }
  userModule$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public userModule = this.userModule$.asObservable();
  changeUserModule(value: boolean) {
    this.userModule$.next(value);
  }
  opsMoudule$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  public opsMoudule = this.opsMoudule$.asObservable();
  changeOpsMoudule(value: boolean) {
    this.opsMoudule$.next(value);
  }
  masterConfig$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  public masterConfig = this.masterConfig$.asObservable();
  changeMasterConfig(value: boolean) {
    this.masterConfig$.next(value);
  }
  adminNagigation$: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  public adminNagigation = this.adminNagigation$.asObservable();
  changeAdminNagigation(value: string) {
    this.adminNagigation$.next(value);
  }
  showOCS$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public showOCS = this.showOCS$.asObservable();
  changeShowOCS(value: boolean) {
    this.showOCS$.next(value);
  }
  lastLoginDateTime$: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  public lastLoginDateTime = this.lastLoginDateTime$.asObservable();
  changelastLoginDateTime(value: string) {
    this.lastLoginDateTime$.next(value);
  }
  eligibilityReview$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public eligibilityReview = this.eligibilityReview$.asObservable();
  changeleligibilityReview(value: boolean) {
    this.eligibilityReview$.next(value);
  }

checkUserMapping(userActivityList,userFullName,lastLoginDateTime?){
  let myServiceStatus= false;
  console.log("user activity in cds",userActivityList,userFullName);
          let createLead = false;
          let createLogin = false;
          let applicatonreAssign = false;
          let documetUpload = false;
          let reportShow = false;
          let userModule =false;
          let opsMoudule = false;
          let masterConfig = false;
          let showOCS = false;
          let eligibilityReview = false;
          userActivityList.forEach(uActivity => {
            if (uActivity == "Lead"){
              createLead = true;
              showOCS = true;
            } else if(uActivity == "New Login"){
              createLogin= true;
              showOCS = true;
            } else if(uActivity == "Reassign"){
              applicatonreAssign= true;
              showOCS = true;
            } else if (uActivity == "Document Upload"){
              documetUpload =true;
              showOCS = true;
            }else if (uActivity == "Report"){
              reportShow =true;
              showOCS = true;
            }else if (uActivity == "User Module"){
              userModule =true;
            }else if (uActivity == "OPS Module"){
              opsMoudule =true;
            }else if (uActivity == "Master Config"){
              masterConfig =true;
            }else if(uActivity=="Eligibility Review"){
              eligibilityReview = true;
            }
            myServiceStatus =true;
          });
          this.changeCreateLead(createLead);
          this.changeNewLogin(createLogin);
          this.changereAssign(applicatonreAssign);
          this.changereReport(reportShow);
          this.changedocumetUpload(documetUpload);
          this.changeCdsStatus(myServiceStatus);
          this.changeuserFullName(userFullName);
          this.changeUserModule(userModule);
          this.changeOpsMoudule(opsMoudule);
          this.changeMasterConfig(masterConfig);
          this.changeShowOCS(showOCS);
          this.changelastLoginDateTime(lastLoginDateTime);
          this.changeleligibilityReview(eligibilityReview);
          this.adminPageNavigation(userModule,opsMoudule,masterConfig);
          
}       

adminPageNavigation(userModule,opsMoudule,masterConfig){

  // this.commonDataService.opsMoudule$.subscribe(val =>this.opsModule=val);
  // this.commonDataService.userModule$.subscribe(val => this.userModule=val);
  // this.commonDataService.masterConfig$.subscribe(val => this.masterModule =val);
  if (opsMoudule && userModule && masterConfig){
    this.changeAdminNagigation("/admin/lovs");
  } else if(opsMoudule && !userModule && !masterConfig){
    this.changeAdminNagigation("/admin/ops-module");
  }else if(!opsMoudule && userModule && !masterConfig){
    this.changeAdminNagigation("/admin/user-module");
  }else if(!opsMoudule && !userModule && masterConfig){
    this.changeAdminNagigation("/admin/lovs");
  }else if(opsMoudule && userModule && !masterConfig){
    this.changeAdminNagigation("/admin/ops-module");
  }else if(opsMoudule && !userModule && masterConfig){
    this.changeAdminNagigation("/admin/lovs");
  }else if(!opsMoudule && userModule && masterConfig){
    this.changeAdminNagigation("/admin/lovs");
  }
  
  console.log("navgation string in cds", this.adminNagigation);

}
}
