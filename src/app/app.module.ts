import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component } from '@angular/core';

import { AppComponent } from './app.component';
import { ContactDetailsComponent } from './ApplicantDetails/contact-details/contact-details.component';
import { EnterMPINComponent } from './Login/enter-mpin/enter-mpin.component';
import { ForgotMPINComponent } from './Login/forgot-mpin/forgot-mpin.component';
import { LoginComponent } from './Login/login/login.component';
import { LoginWithMPINComponent } from './Login/login-with-mpin/login-with-mpin.component';
import { MenubarHeaderComponent } from './HeaderModule/menubar-header/menubar-header.component';
import { PanComponent } from './ApplicantDetails/pan/pan.component';
import { TabPageHeaderComponent } from './HeaderModule/tab-page-header/tab-page-header.component';
import { UserLoginComponent } from './Login/user-login/user-login.component';
import { PersonalDetailsComponent } from './ApplicantDetails/personal-details/personal-details.component';
import { CommunicationAddressComponent } from './ApplicantDetails/communication-address/communication-address.component';
import { MaritalStatusComponent } from './ApplicantDetails/marital-status/marital-status.component';
import { FamilyDetailsComponent } from './ApplicantDetails/family-details/family-details.component';
import { OtherComponent } from './ApplicantDetails/other/other.component';
import { OccupationDetailsComponent } from './ApplicantDetails/occupation-details/occupation-details.component';
import { OfficialCorrespondenceComponent } from './ApplicantDetails/official-correspondence/official-correspondence.component';
import { CoAppOrgDetailsComponent } from './Co-ApplicantDetails/co-app-org-details/co-app-org-details.component';
import { CoAppCorpAddrComponent } from './Co-ApplicantDetails/co-app-corp-addr/co-app-corp-addr.component';
import { CoAppRevenueDetailsComponent } from './Co-ApplicantDetails/co-app-revenue-details/co-app-revenue-details.component';
import { CoAppDashboardComponent } from './Co-ApplicantDetails/co-app-dashboard/co-app-dashboard.component';
import { CoAppInitialPageComponent } from './Co-ApplicantDetails/co-app-initial-page/co-app-initial-page.component';
import { CoAppRegAddrComponent } from './Co-ApplicantDetails/co-app-reg-addr/co-app-reg-addr.component';
import { IncomeDetailsComponent } from './LoanDetails/income-details/income-details.component';
import { LoanAmountComponent } from './LoanDetails/loan-amount/loan-amount.component';
import { PropertyDetailsComponent } from './LoanDetails/property-details/property-details.component';
import { ExistingLoansComponent } from './LoanDetails/existing-loans/existing-loans.component';
import { Reference1Component } from './References/reference1/reference1.component';
import { Reference2Component } from './References/reference2/reference2.component';
import { MainDashboardComponent } from './main-dashboard/main-dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    ContactDetailsComponent,
    EnterMPINComponent,
    ForgotMPINComponent,
    LoginComponent,
    LoginWithMPINComponent,
    MenubarHeaderComponent,
    PanComponent,
    TabPageHeaderComponent,
    UserLoginComponent,
    PersonalDetailsComponent,
    CommunicationAddressComponent,
    MaritalStatusComponent,
    FamilyDetailsComponent,
    OtherComponent,
    OccupationDetailsComponent,
    OfficialCorrespondenceComponent,
    CoAppOrgDetailsComponent,
    CoAppCorpAddrComponent,
    CoAppRevenueDetailsComponent,
    CoAppDashboardComponent,
    CoAppInitialPageComponent,
    CoAppRegAddrComponent,
    IncomeDetailsComponent,
    LoanAmountComponent,
    PropertyDetailsComponent,
    ExistingLoansComponent,
    Reference1Component,
    Reference2Component,
    MainDashboardComponent,
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
