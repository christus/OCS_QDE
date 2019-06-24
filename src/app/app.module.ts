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

import { LeadsListComponent } from './applicant-dashboard/leads-list/leads-list.component';
import { ApplicantQdeComponent } from './applicant-dashboard/applicant-qde/applicant-qde.component';


import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';

import { Ng5SliderModule } from 'ng5-slider';
import { CoApplicantQdeComponent } from './applicant-dashboard/co-applicant-qde/co-applicant-qde.component';
import { LoanQdeComponent } from './applicant-dashboard/loan-qde/loan-qde.component';
import { ReferencesQdeComponent } from './applicant-dashboard/references-qde/references-qde.component';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './services/auth.interceptor';
import { ListOfValuesResolverService } from './services/list-of-values-resolver.service';
import { ViewFormComponent } from './applicant-dashboard/view-form/view-form.component';
import { DocumentUploadComponent } from './applicant-dashboard/document-upload/document-upload.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AuthGuard } from './guards/auth.guard';
import { ConfirmDeactivateGuard } from './guards/candeactivate.guard';
import { UtilService } from './services/util.service';
import { FieldFillDirective } from './directives/field-fill.directive';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { ProceedToReviewFormComponent } from './terms-and-conditions/proceed-to-review-form/proceed-to-review-form.component';
import { ReviewApplicationFormComponent } from './terms-and-conditions/review-application-form/review-application-form.component';
import { Declaration1Component } from './terms-and-conditions/declaration1/declaration1.component';
import { Declaration2Component } from './terms-and-conditions/declaration2/declaration2.component';



import { ImageUploadModule } from "angular2-image-upload";
import { PaymentsComponent } from './payments/payments.component';
import { OfflinePaymentComponent } from './payments/offline-payment/offline-payment.component';
import { OnlineSummaryComponent } from './payments/online-summary/online-summary.component';
import { GetQdeDataResolverService } from './get-qde-data-resolver.service';
import { GetCoApplicantsResolverService } from './get-co-applicants-resolver.service';
import { EligibilityCheckComponent } from './payments/eligibility-check/eligibility-check.component';
import { BirthPlaceResolverService } from './services/birth-place-resolver.service';

import { Camera } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';

import { NgxUiLoaderModule } from  'ngx-ui-loader';
import { ViewFormApplicantComponent } from './view-form-applicant/view-form-applicant.component';




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
          listOfValues: ListOfValuesResolverService,
          birthPlaceValues: BirthPlaceResolverService
        }
      },
      {
        path: ":applicationId",
        component: ApplicantQdeComponent,
        resolve: {
          listOfValues: ListOfValuesResolverService,
          birthPlaceValues: BirthPlaceResolverService
        }
      },
      {
        path: ":applicationId/co-applicant",
        component: CoApplicantQdeComponent,
        resolve: {
          listOfValues: ListOfValuesResolverService,
          birthPlaceValues: BirthPlaceResolverService,
          // qde: GetQdeDataResolverService
        }
      },
      {
        path: ":applicationId/co-applicant/:coApplicantIndex",
        component: CoApplicantQdeComponent,
        resolve: {
          listOfValues: ListOfValuesResolverService,
          // qde: GetQdeDataResolverService,
          birthPlaceValues: BirthPlaceResolverService
        }
      }
    ]
  },
  // {
  //   path: "applicant/:applicationId/co-applicant",
  //   component: ApplicantDashboardComponent,
  //   canActivate: [AuthGuard],
  //   children: [
  //     {
  //       path: "",
  //       component: CoApplicantQdeComponent,
  //       resolve: {
  //         listOfValues: ListOfValuesResolverService
  //       }
  //     },
  //     {
  //       path: ":coApplicantIndex",
  //       component: CoApplicantQdeComponent,
  //       resolve: {
  //         listOfValues: ListOfValuesResolverService
  //       }
  //     }
  //   ],
  //   // pathMatch: 'full'
  // },
  {
    path: "loan/:applicationId",
    component: LoanQdeComponent,
    resolve: {
      listOfValues: ListOfValuesResolverService
    }
  },
  {
    path: "references/:applicationId",
    component: ReferencesQdeComponent,
    resolve: {
      listOfValues: ListOfValuesResolverService
    }
  },
  {
    path: "document-uploads",
    children: [
      {
        path: ":applicationId/applicant/:applicantId",
        component: DocumentUploadComponent,
        resolve: {
          listOfValues: ListOfValuesResolverService
        }
      },
      {
        path: ":applicationId/co-applicant/:applicantId",
        component: DocumentUploadComponent,
        resolve: {
          listOfValues: ListOfValuesResolverService
        }
      }
    ]
  },
  {
    path: "view-form/:applicationId",
    component: ViewFormComponent,
    resolve: {
      listOfValues: ListOfValuesResolverService,
      qde: GetQdeDataResolverService,
      birthPlaceValues: BirthPlaceResolverService
    }
  },
  {
    path: "terms-and-conditions",
    component: TermsAndConditionsComponent,
    children: [
      { path: '', redirectTo: "proceed-to-review", pathMatch: "full" },
      {
        path: 'proceed-to-review/:applicationId/:applicantId',
        component: ProceedToReviewFormComponent,
        resolve: {
          listOfValues: ListOfValuesResolverService,
          birthPlaceValues: BirthPlaceResolverService,
          qde: GetQdeDataResolverService
        }
      },
      {
        path: 'review-application/:applicationId/:applicantId',
        component: ReviewApplicationFormComponent,
        resolve: {
          listOfValues: ListOfValuesResolverService,
          birthPlaceValues: BirthPlaceResolverService,
          qde: GetQdeDataResolverService
        }
      },
      {
        path: 'declaration1/:applicationId/:applicantId',
        component: Declaration1Component,
        resolve: {
          listOfValues: ListOfValuesResolverService,
          birthPlaceValues: BirthPlaceResolverService,
          qde: GetQdeDataResolverService
        }
      },
      {
        path: 'declaration2/:applicationId/:applicantId',
        component: Declaration2Component,
        resolve: {
          listOfValues: ListOfValuesResolverService,
          birthPlaceValues: BirthPlaceResolverService,
          qde: GetQdeDataResolverService
        }
      }
    ]
  },
  {
    path: "payments",
    component: PaymentsComponent,
    children: [
      { path: '', redirectTo: "offline-payments", pathMatch: "full" },
      {
        path: 'offline-payments/:applicationId',
        component: OfflinePaymentComponent,
        resolve: {
          listOfValues: ListOfValuesResolverService,
          qde: GetQdeDataResolverService
        }
      },
      {
        path: 'online-summary/:applicationId',
        component: OnlineSummaryComponent,
        resolve: {
          listOfValues: ListOfValuesResolverService,
          qde: GetQdeDataResolverService
        }
      },
      {
        path: 'eligibility-check/:applicationId',
        component: EligibilityCheckComponent,
        resolve: {
          listOfValues: ListOfValuesResolverService,
          qde: GetQdeDataResolverService
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
    ApplicantDashboardComponent,
    LeadsListComponent,
    ApplicantQdeComponent,
    CoApplicantQdeComponent,
    LoanQdeComponent,
    ReferencesQdeComponent,
    ViewFormComponent,
    DocumentUploadComponent,
    PageNotFoundComponent,
    FieldFillDirective,
    TermsAndConditionsComponent,
    ProceedToReviewFormComponent,
    ReviewApplicationFormComponent,
    Declaration1Component,
    Declaration2Component,
    PaymentsComponent,
    OfflinePaymentComponent,
    OnlineSummaryComponent,
    EligibilityCheckComponent,
    ViewFormApplicantComponent
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
    DropDownsModule,
    ImageUploadModule.forRoot(),
    DeviceDetectorModule.forRoot()
  ],
  providers: [
    ListOfValuesResolverService,
    BirthPlaceResolverService,
    GetQdeDataResolverService,
    {
      provide: SWIPER_CONFIG,
      useValue: DEFAULT_SWIPER_CONFIG
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    Camera,
    File,
    FileTransfer,
    FileTransferObject
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
