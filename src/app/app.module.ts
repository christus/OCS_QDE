import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DropDownsModule } from "@progress/kendo-angular-dropdowns";

// Plugins
import { SwiperModule } from 'ngx-swiper-wrapper';
import { SWIPER_CONFIG } from 'ngx-swiper-wrapper';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';

import { AppComponent } from './app.component';

// Applicant Details
import { ApplicantDashboardComponent } from './applicant-dashboard/applicant-dashboard.component';
import { EnterMPINComponent } from './Login/enter-mpin/enter-mpin.component';
import { ForgotMPINComponent } from './Login/forgot-mpin/forgot-mpin.component';
import { LoginComponent } from './Login/login/login.component';
import { LoginWithMPINComponent } from './Login/login-with-mpin/login-with-mpin.component';
import { MenubarHeaderComponent } from './menubar-header/menubar-header.component';

import { UserLoginComponent } from './Login/user-login/user-login.component';

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
import { ListOfValuesResolverService } from './services/list-of-values-resolver.service';
import { ViewFormComponent } from './applicant-dashboard/view-form/view-form.component';
import { DocumentUploadComponent } from './applicant-dashboard/document-upload/document-upload.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AuthGuard } from './guards/auth.guard';
import { ConfirmDeactivateGuard } from './guards/candeactivate.guard';
import { UtilService } from './services/util.service';
import { ViewFormCoApplicantComponent } from './applicant-dashboard/view-form/view-form-co-applicant/view-form-co-applicant.component';
import { FieldFillDirective } from './directives/field-fill.directive';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { ProceedToReviewFormComponent } from './terms-and-conditions/proceed-to-review-form/proceed-to-review-form.component';
import { ReviewApplicationFormComponent } from './terms-and-conditions/review-application-form/review-application-form.component';
import { Declaration1Component } from './terms-and-conditions/declaration1/declaration1.component';
import { Declaration2Component } from './terms-and-conditions/declaration2/declaration2.component';


const appRoutes: Routes = [
  { path: "", redirectTo: "leads", pathMatch: "full" },
  { path: "login", component: LoginComponent },
  {
    path: "leads",
    component: LeadsListComponent,
    canActivate: [AuthGuard],
    canDeactivate: [ConfirmDeactivateGuard]
  },
  {
    path: "applicant",
    component: ApplicantDashboardComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "",
        component: ApplicantQdeComponent,
        resolve: {
          listOfValues: ListOfValuesResolverService
        }
      },
      {
        path: ":applicantId",
        component: ApplicantQdeComponent,
        resolve: {
          listOfValues: ListOfValuesResolverService
        }
      }
    ]
  },
  {
    path: "co-applicant",
    component: ApplicantDashboardComponent,
    children: [
      {
        path: "",
        component: CoApplicantQdeComponent,
        resolve: {
          listOfValues: ListOfValuesResolverService
        }
      },
      {
        path: ":applicantId",
        component: CoApplicantQdeComponent,
        resolve: {
          listOfValues: ListOfValuesResolverService
        }
      }
    ]
  },
  {
    path: "loan",
    component: LoanQdeComponent,
    resolve: {
      listOfValues: ListOfValuesResolverService
    }
  },
  {
    path: 'references',
    component: ReferencesQdeComponent,
    resolve: {
      listOfValues: ListOfValuesResolverService
    }
  },
  {
    path: "document-upload",
    component: DocumentUploadComponent,
    resolve: {
      listOfValues: ListOfValuesResolverService
    }
  },
  {
    path: "view-form/:applicantId",
    component: ViewFormComponent,
    resolve: {
      listOfValues: ListOfValuesResolverService
    }
  },
  {
    path: "terms-and-conditions",
    component: TermsAndConditionsComponent,
    children: [
      { path: '', redirectTo: "proceed-to-review", pathMatch: "full" },
      {
        path: 'proceed-to-review',
        component: ProceedToReviewFormComponent,
        resolve: {
          listOfValues: ListOfValuesResolverService
        }
      },
      {
        path: 'review-application',
        component: ReviewApplicationFormComponent,
        resolve: {
          listOfValues: ListOfValuesResolverService
        }
      },
      {
        path: 'declaration1',
        component: Declaration1Component,
        resolve: {
          listOfValues: ListOfValuesResolverService
        }
      },
      {
        path: 'declaration2',
        component: Declaration2Component,
        resolve: {
          listOfValues: ListOfValuesResolverService
        }
      }
    ]
  },
  { path: "**", component: PageNotFoundComponent }
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
    ViewFormComponent,
    DocumentUploadComponent,
    PageNotFoundComponent,
    ViewFormCoApplicantComponent,
    FieldFillDirective,
    TermsAndConditionsComponent,
    ProceedToReviewFormComponent,
    ReviewApplicationFormComponent,
    Declaration1Component,
    Declaration2Component,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes),
    SwiperModule,
    FormsModule,
    NgSelectModule,
    Ng5SliderModule,
    HttpClientModule,
    DropDownsModule
  ],
  providers: [
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
export class AppModule {}
