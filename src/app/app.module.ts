import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Plugins
import { SwiperModule } from 'ngx-swiper-wrapper';
import { SWIPER_CONFIG } from 'ngx-swiper-wrapper';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
// import { Select2Module } from 'ng2-select2';

import { AppComponent } from './app.component';

// Applicant Details
import { ApplicantDashboardComponent } from './applicant-dashboard/applicant-dashboard.component';
import { EnterMPINComponent } from './Login/enter-mpin/enter-mpin.component';
import { ForgotMPINComponent } from './Login/forgot-mpin/forgot-mpin.component';
import { LoginComponent } from './Login/login/login.component';
import { LoginWithMPINComponent } from './Login/login-with-mpin/login-with-mpin.component';
import { MenubarHeaderComponent } from './menubar-header/menubar-header.component';

import { UserLoginComponent } from './Login/user-login/user-login.component';

// Co-Applicant Details
// import { CoAppOrgDetailsComponent } from './Co-ApplicantDetails/co-app-org-details/co-app-org-details.component';
// import { CoAppCorpAddrComponent } from './Co-ApplicantDetails/co-app-corp-addr/co-app-corp-addr.component';
// import { CoAppRevenueDetailsComponent } from './Co-ApplicantDetails/co-app-revenue-details/co-app-revenue-details.component';
// import { CoAppDashboardComponent } from './Co-ApplicantDetails/co-app-dashboard/co-app-dashboard.component';
// import { CoAppInitialPageComponent } from './Co-ApplicantDetails/co-app-initial-page/co-app-initial-page.component';
// import { CoAppRegAddrComponent } from './Co-ApplicantDetails/co-app-reg-addr/co-app-reg-addr.component';

import { IncomeDetailsComponent } from './LoanDetails/income-details/income-details.component';
import { LoanAmountComponent } from './LoanDetails/loan-amount/loan-amount.component';
import { PropertyDetailsComponent } from './LoanDetails/property-details/property-details.component';
import { ExistingLoansComponent } from './LoanDetails/existing-loans/existing-loans.component';
import { Reference1Component } from './References/reference1/reference1.component';
import { Reference2Component } from './References/reference2/reference2.component';
import { LeadsListComponent } from './applicant-dashboard/leads-list/leads-list.component';
import { ApplicantQdeComponent } from './applicant-dashboard/applicant-qde/applicant-qde.component';


import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';

import { Ng5SliderModule } from 'ng5-slider';
import { CoApplicantQdeComponent } from './applicant-dashboard/co-applicant-qde/co-applicant-qde.component';
import { LoanQdeComponent } from './applicant-dashboard/loan-qde/loan-qde.component';
import { ReferencesQdeComponent } from './applicant-dashboard/references-qde/references-qde.component';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import AuthInterceptor from './services/auth.interceptor';
import { QdeResolver } from './services/qde-resolver.service';
import { ListOfValuesResolverService } from './services/list-of-values-resolver.service';

// Routes are temporarily in app.module.ts
const appRoutes: Routes = [
  { path: '', component: ApplicantDashboardComponent, children: [
    { path: '', redirectTo: 'applicant', pathMatch: 'full' }, // This line will be replaced with signin page

    { path: 'applicant',
      component: ApplicantQdeComponent,
      resolve: {
        listOfValues : ListOfValuesResolverService
      }
    },
    { path: 'applicant/:applicantId',
      component: ApplicantQdeComponent,
      resolve: {
        listOfValues: QdeResolver
      }
    },
    { path: 'leads', component: LeadsListComponent },
    { path: 'co-applicant', component: CoApplicantQdeComponent },
    { path: 'loan', component: LoanQdeComponent },
    { path: 'references', component: ReferencesQdeComponent }
  ] }
];
 
const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
  direction: 'horizontal',
  slidesPerView: 'auto'
};

@NgModule({
  declarations: [
    AppComponent,
    EnterMPINComponent,
    ForgotMPINComponent,
    LoginComponent,
    LoginWithMPINComponent,
    MenubarHeaderComponent,
    UserLoginComponent,
    // CoAppOrgDetailsComponent,
    // CoAppCorpAddrComponent,
    // CoAppRevenueDetailsComponent,
    // CoAppDashboardComponent,
    // CoAppInitialPageComponent,
    // CoAppRegAddrComponent,
    IncomeDetailsComponent,
    LoanAmountComponent,
    PropertyDetailsComponent,
    ExistingLoansComponent,
    Reference1Component,
    Reference2Component,
    ApplicantDashboardComponent,
    LeadsListComponent,
    ApplicantQdeComponent,
    CoApplicantQdeComponent,
    LoanQdeComponent,
    ReferencesQdeComponent,

  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    SwiperModule,
    FormsModule,
    NgSelectModule,
    Ng5SliderModule,
    HttpClientModule
  ],
  providers: [
    QdeResolver,
    ListOfValuesResolverService,
    {
      provide: SWIPER_CONFIG,
      useValue: DEFAULT_SWIPER_CONFIG
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
