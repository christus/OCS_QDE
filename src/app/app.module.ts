import { AutoLogoutService } from './services/AutoLogoutService';
import { CollateralComponent } from './applicant-dashboard/document-upload/collateral/collateral.component';
import { BranchListComponent } from './admin/admin-panel/branch-list/branch-list.component';
import { PmayListComponent } from './admin/admin-panel/pmay-list/pmay-list.component';
import { AdminAddUserLovResolverService } from './services/admin-add-user-lov-resolver.service';
import { AdminRoleLovsResolverService } from './services/admin-role-lov-resolver.service';
import { AdminPanelComponent } from './admin/admin-panel/admin-panel.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DropDownsModule } from "@progress/kendo-angular-dropdowns";
import { DateInputsModule } from "@progress/kendo-angular-dateinputs";
import { AdminUserLovsResolverService } from './services/admin-user-lovs-resolver.service';
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


import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { NativeKeyboard } from '@ionic-native/native-keyboard/ngx';



import { NgxUiLoaderModule, NgxUiLoaderRouterModule } from  'ngx-ui-loader';
import { ViewFormApplicantComponent } from './view-form-applicant/view-form-applicant.component';

import {SecuredImageComponent} from  './applicant-dashboard/document-upload/secured-image.component';
import { ThanksTAndCComponent } from './terms-and-conditions/thanks-t-and-c/thanks-t-and-c.component';
import { IciciTermsComponent } from './applicant-dashboard/icici-terms/icici-terms.component';
import { ThankPaymentComponent } from './payments/thank-payment/thank-payment.component';
import { SetMpinComponent } from './Login/set-mpin/set-mpin.component';
import { ReviewEligibilityComponent } from './applicant-dashboard/review-eligibility/review-eligibility.component';
import { ThankPaymentEligibiltyComponent } from './payments/thank-payment-eligibilty/thank-payment-eligibilty.component';
import { OpsModuleComponent } from './admin/ops-module/ops-module.component';

import { OnlinePaymentComponent } from './admin/online-payment/online-payment.component';
import { CheckPaymentComponent } from './admin/check-payment/check-payment.component';

import { NumberFormatDirective } from './directives/number-format.directive';

import { UserModuleComponent } from './admin/user-module/user-module.component';

import { NgxPaginationModule } from 'ngx-pagination';
import { AdminLovsComponent } from './admin/admin-panel/admin-lovs/admin-lovs.component';

import { AddAdminUserComponent } from './admin/add-admin-user/add-admin-user.component';
import { EditAdminUserComponent } from './admin/edit-admin-user/edit-admin-user.component';
import { AdminLovsResolverService } from './services/admin-lovs-resolver.service';
import { AdminGetEachLovResolverService } from './services/admin-get-each-lov-resolver.service';

import { AdminEachLovComponent } from './admin/admin-panel/admin-lovs/admin-each-lov/admin-each-lov.component';
import { AdminFieldEditDirective } from './directives/admin-field-edit.directive';
import { AdminZipCodeComponent } from './admin/admin-panel/admin-lovs/admin-zip-code/admin-zip-code.component';
import { MasterLovResolverService } from './services/master-lov-resolver.service';
import { GeneralLovsService } from './services/general-lovs-resolver.service';
import { ClssChecklistComponent } from './admin/admin-panel/clss-checklist/clss-checklist.component';
import { ClssChecklistResolverService } from './services/clss-checklist-resolver.service';
import { PmayAddDetailsComponent } from './admin/admin-panel/pmay-add-details/pmay-add-details.component';

import { BranchAddEditComponent } from './admin/admin-panel/branch-add-edit/branch-add-edit.component';

import { LoanTypePurposeMapComponent } from './admin/admin-panel/loan-type-purpose-map/loan-type-purpose-map.component';
import { LoanTypePurposeMapResolverService } from '../app/services/loan-type-purpose-map-resolver.service';
import { DocumentAssessmentDoccatDoctypeComponent } from './admin/admin-panel/document-assessment-doccat-doctype/document-assessment-doccat-doctype.component';

import { DocAssessDoccatProfileMapResolverService } from './services/doc-assess-doccat-profile-map-resolver.service';
import { LoanMasterComponent } from './admin/admin-panel/loan-master/loan-master.component';
import { ConnectorLeadCreateComponent } from './connector-lead-create/connector-lead-create.component';
import { TabComponent } from './applicant-dashboard/leads-list/tabs/tab.component';
import { TabsComponent } from './applicant-dashboard/leads-list/tabs/tabs.component';
import { LeadsHeaderComponent } from './applicant-dashboard/leads-list/leads-header/leads-header.component';
import { LeadsSidebarComponent } from './applicant-dashboard/leads-list/leads-sidebar/leads-sidebar.component';
import { EligibilityClearedComponent } from './payments/eligibility-cleared/eligibility-cleared.component';
import { EligibilityNotClearedComponent } from './payments/eligibility-not-cleared/eligibility-not-cleared.component';
import { PaymentSuccessfullComponent } from './payments/payment-successfull/payment-successfull.component';
import { SuccessfullComponent } from './payments/successfull/successfull.component';
import { EditErrorMessageComponent } from './admin/edit-error-message/edit-error-message.component';
import { ErrorHandlingMessageComponent } from './admin/error-handling-message/error-handling-message.component';
import { from } from 'rxjs';
import { RelationshipMappingComponent } from './admin/admin-panel/relationship-mapping/relationship-mapping.component';
import { ApplicationRelationshipResolverService } from './services/application-relationship-resolver.service';
import { ReportsComponent } from './reports/reports.component';
import { AddtionalServiceComponent } from './addtional-service/addtional-service.component';
import { ApplicationPrintComponent } from './addtional-service/application-print/application-print.component'

import { HTTP } from '@ionic-native/http/ngx';
import { QdeHttpService } from './services/qde-http.service';
import { MobileService } from './services/mobile-constant.service';
import { AdminAuditTrialComponent } from './admin/admin-audit-trial/admin-audit-trial.component';
import { ReassignComponent } from './reassign/reassign.component';
import { CaptchaResolverService } from './services/captcha-resolver.service';
import { DatePipe } from '@angular/common';
import { MaxMinLimitsComponent } from './admin/admin-panel/max-min-limits/max-min-limits.component';
import { MinMaxLimitsResolverService } from './services/min-max-limits-resolver.service';
import { PrintApplicationComponent } from './applicant-dashboard/print-application/print-application.component';
import { FormPrintComponent } from './addtional-service/form-print/form-print.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { BranchMappingComponent } from './admin/branch-mapping/branch-mapping.component';
import { AddtionalServiceDashboardComponent } from './addtional-service/addtional-service-dashboard/addtional-service-dashboard.component';
import { GetApplicationPrintResolverService } from './services/get-application-print-resolver.service';
import { CkycFormComponent } from './addtional-service/ckyc-form/ckyc-form.component';
import { DocumentCheckListComponent } from './addtional-service/document-check-list/document-check-list.component';
import { AdditionalPmayClssFormComponent } from './addtional-service/additional-pmay-clss-form/additional-pmay-clss-form.component';
import { DeclarationFormComponent } from './addtional-service/declaration-form/declaration-form.component';
import { TearFormComponent } from './addtional-service/tear-form/tear-form.component';
import { RegistrationFormComponent } from './registration-form/registration-form.component';
import { ArchiveRetrieveComponent } from './admin/archive-retrieve/archive-retrieve.component';
import { ArchiveComponent } from './admin/archive-retrieve/archive/archive.component';
import { RetrieveComponent } from './admin/archive-retrieve/retrieve/retrieve.component';
import { ArchiveOcsNumberComponent } from './admin/archive-retrieve/archive/archive-ocs-number/archive-ocs-number.component';
import { ArchiveFileUploadComponent } from './admin/archive-retrieve/archive/archive-file-upload/archive-file-upload.component';
import { RetrieveOcsNumberComponent } from './admin/archive-retrieve/retrieve/retrieve-ocs-number/retrieve-ocs-number.component';
import { RetrieveFileUploadComponent } from './admin/archive-retrieve/retrieve/retrieve-file-upload/retrieve-file-upload.component';
import { DashboardFilterComponent } from './applicant-dashboard/dashboard-filter/dashboard-filter.component';




const appRoutes: Routes = [
  { path: "", redirectTo: "leads", pathMatch: "full" },
  { path: "login",
  component: LoginComponent,
    resolve: {
      catchaImage: CaptchaResolverService
    }
  },
  { path: "loginWithPin",  component: LoginWithMPINComponent},
  { path: "ConfirmPin", component: EnterMPINComponent },
  { path: "forgotPin", component: ForgotMPINComponent },
  { path: "setPin", component: SetMpinComponent },
  {
    path: "leads",
    component: LeadsListComponent,
    canActivate: [AuthGuard],
    canDeactivate: [ConfirmDeactivateGuard]
  },
  {
    path: "reports",
    component: ReportsComponent,
    canActivate: [AuthGuard],
    canDeactivate: [ConfirmDeactivateGuard]
  },
  {
    path: "re-assign",
    component: ReassignComponent,
    canActivate: [AuthGuard],
    canDeactivate: [ConfirmDeactivateGuard]
  },
  {
    path: "addtional-service",
    component: AddtionalServiceComponent,
    canActivate: [AuthGuard],
    canDeactivate: [ConfirmDeactivateGuard],
    children: [
      {
        path: "",
        component: AddtionalServiceDashboardComponent
      },
     {
      path: 'application-print',
      component: ApplicationPrintComponent
      // resolve: {
      //   listOfValues: ListOfValuesResolverService
      // }
    },
     {
        path: 'form-print/:applicationId',
        component: FormPrintComponent,
        resolve: {
          qde: GetApplicationPrintResolverService
        }

      }
    ]
  },
 
  {
    path: "connector/lead-create",
    component: ConnectorLeadCreateComponent,
    canActivate: [AuthGuard],
    canDeactivate: [ConfirmDeactivateGuard],
    resolve: {
      listOfValues: ListOfValuesResolverService
    }
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
        path: ":applicationId",
        component: ApplicantQdeComponent,
        resolve: {
          listOfValues: ListOfValuesResolverService
        }
      },
      {
        path: ":applicationId/co-applicant",
        component: CoApplicantQdeComponent,
        resolve: {
          listOfValues: ListOfValuesResolverService
          // qde: GetQdeDataResolverService
        }
      },
      {
        path: ":applicationId/co-applicant/:coApplicantIndex",
        component: CoApplicantQdeComponent,
        resolve: {
          listOfValues: ListOfValuesResolverService
          // qde: GetQdeDataResolverService,
        }
      },
      {
        path: "sucessfull/:applicationId",
        component: SuccessfullComponent
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
        path: ":applicationId",
        component: DocumentUploadComponent,
        resolve: {
          listOfValues: ListOfValuesResolverService
        }
      },
      {
        path: ":applicationId/applicant/:applicantId",
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
      // qde: GetQdeDataResolverService,
    }
  },
  {
    path: "static/terms-and-conditions",
    component: TermsAndConditionsComponent,
    children: [
      { path: '', redirectTo: "proceed-to-review", pathMatch: "full" },
      {
        path: 'proceed-to-review/:applicationId/:applicantId',
        component: ProceedToReviewFormComponent,
        resolve: {
          listOfValues: ListOfValuesResolverService,
          qde: GetQdeDataResolverService
        }
      },
      {
        path: 'review-application/:applicationId/:applicantId',
        component: ReviewApplicationFormComponent,
        resolve: {
          listOfValues: ListOfValuesResolverService,
          qde: GetQdeDataResolverService
        }
      },
      {
        path: 'declaration1/:applicationId/:applicantId',
        component: Declaration1Component,
        resolve: {
          listOfValues: ListOfValuesResolverService,
          qde: GetQdeDataResolverService
        }
      },
      {
        path: 'declaration2/:applicationId/:applicantId',
        component: Declaration2Component,
        resolve: {
          listOfValues: ListOfValuesResolverService,
          qde: GetQdeDataResolverService
        }
      },
      {
        path: 'thankt&c/:applicationId/:applicantId',
        component: ThanksTAndCComponent,
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
    ]
  },
  {
    path: "payments",
    component: PaymentsComponent,
    children: [
      { path: '', redirectTo: "offline-payments/:applicationId", pathMatch: "full" },
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
      },
      {
        path: 'thankpayment-eligibility/:applicationId',
        component: ThankPaymentEligibiltyComponent
      },
      {
        path: 'thankpayment',
        component: ThankPaymentComponent
      },
      {
        path: 'cleared-eligibility/:applicationId',
        component: EligibilityClearedComponent
      },
      {
        path: 'not-cleared-eligibility/:applicationId',
        component: EligibilityNotClearedComponent
      }
      
    ]
  },

  {
    path: "static/payments/cleared-eligibility/:applicationId",
    component: EligibilityClearedComponent
  },
  {
    path: "static/payments/not-cleared-eligibility/:applicationId",
    component: EligibilityNotClearedComponent
  },

  {
    path: "static/icici-terms/auto-login/:applicationId/:applicantId",
    component: IciciTermsComponent
  },
  {
    path: "static/payments/online-summary/:applicationId",
    component: OnlineSummaryComponent,
  },
  // {
  //   path: "static/payments/offline-payments/:applicationId",
  //   component: OfflinePaymentComponent
  // },
  {
    path: 'review-eligibility/:applicationId',
    component: ReviewEligibilityComponent
  },  
  {
    path: "paymentsucessfull",
    component: PaymentSuccessfullComponent
  },
  {
    path: '',
    component: CollateralComponent
  },
  {
    path:"admin", component: AdminPanelComponent,
    canActivate: [AuthGuard],
    children:[
      {
        path: 'ops-module',
        component: OpsModuleComponent
      },
      {
        path: 'user-module',
        component: UserModuleComponent
      },
      {
        path: 'lovs',
        component: AdminLovsComponent,
        resolve: {
          adminLovs: AdminLovsResolverService
        }
      },
      {
        path: 'add-user',
        component: AddAdminUserComponent,
        resolve: {
          userBranchLovs: AdminAddUserLovResolverService
        }
      },
      {
        path: 'add-user/:userId',
        component: AddAdminUserComponent,
        resolve: {
          userBranchLovs: AdminAddUserLovResolverService
        }
      },
      {
        path: 'edit-user/:userId',
        component: EditAdminUserComponent,
        resolve: {
          userBranchLovs: AdminAddUserLovResolverService
        }
      },
      {
        path: 'lovs/clss_checklist',
        component: ClssChecklistComponent,
        resolve: {
          clssData: ClssChecklistResolverService
        }
      },
      {
        path: 'lovs/pmay_list',
        component: PmayListComponent,
        //resolve: {
          //eachLovs: MasterLovResolverService
        //}
      },
      {
        path: 'lovs/pmay_list/add',
        component: PmayAddDetailsComponent,
        // resolve: {
        //   eachLovs: MasterLovResolverService
        // }
      },
      {
        path: 'lovs/pmay_list/:userId',
        component: PmayAddDetailsComponent,
        // resolve: {
        //   eachLovs: MasterLovResolverService
        // }
      },
      {
        path: 'lovs/branch_list',
        component: BranchListComponent,
        //resolve: {
          //eachLovs: MasterLovResolverService
        //}
      },
      {
        path: 'lovs/branch_list/add',
        component: BranchAddEditComponent,
        resolve: {
          // eachLovs: MasterLovResolverService,
          // listOfValues: ListOfValuesResolverService
          listOfAdminValues: AdminUserLovsResolverService
        }
      },
      {
        path: 'lovs/branch_add/:userId',
        component: BranchAddEditComponent,
        resolve: {
          // eachLovs: MasterLovResolverService,
          // listOfValues: ListOfValuesResolverService
          listOfAdminValues: AdminUserLovsResolverService
        }
      },
      {
        path: 'lovs/login_fee',
        component: LoanMasterComponent
      },
      {
        path: 'lovs/loan_master',
        component: LoanMasterComponent
      },
      {
        path: 'lovs/document_profile',
        component: DocumentAssessmentDoccatDoctypeComponent,
        resolve: {
          eachLovs: DocAssessDoccatProfileMapResolverService
        }
      },
      {
        path: 'lovs/loan_type_purpose_map',
        component: LoanTypePurposeMapComponent,
        resolve: {
          eachLovs: LoanTypePurposeMapResolverService
        }
      },
      {
        path: 'lovs/zipcode',
        component: AdminZipCodeComponent,
        resolve: {
          eachLovs: MasterLovResolverService,
          generalLovs: GeneralLovsService
        }
      },
      {
        path: 'lovs/applicant_relationship_mapping',
        component: RelationshipMappingComponent,
        resolve: {
          relationshipMaster: ApplicationRelationshipResolverService
        }
      },
      {
        path: 'lovs/:eachLovName',
        component: AdminEachLovComponent,
        resolve: {
          eachLovs: AdminGetEachLovResolverService
          // roleLovs: AdminRoleLovsResolverService
        }
      },
      {
        path: 'errorHandle',
        component: ErrorHandlingMessageComponent
      },
      {
        path: 'erroredit/:errorCode',
        component: EditErrorMessageComponent
      },
      {
        path: 'auditTrail',
        component: AdminAuditTrialComponent
      },
      {
        path: 'configMinMax',
        component: MaxMinLimitsComponent,
        resolve: {
          maxMinLimits: MinMaxLimitsResolverService
        }
      },
      {
        path:'branchMapping',
        component: BranchMappingComponent
      },
      {
        path:'archive',
        component:  ArchiveRetrieveComponent
      },
      {
        path:'retrieve',
        component:  ArchiveRetrieveComponent
      }
    ]
  },
  {
    path: 'registration',
    component: RegistrationFormComponent,
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
    ViewFormApplicantComponent,
    SecuredImageComponent,
    ThanksTAndCComponent,
    IciciTermsComponent,
    ThankPaymentComponent,
    ThankPaymentEligibiltyComponent,
    SetMpinComponent,
    ReviewEligibilityComponent,
    OpsModuleComponent,
    OnlinePaymentComponent,
    CheckPaymentComponent,
    UserModuleComponent,
    AdminPanelComponent,
    NumberFormatDirective,
    AdminLovsComponent,
    AddAdminUserComponent,
    EditAdminUserComponent,
    AdminEachLovComponent,
    AdminFieldEditDirective,
    AdminZipCodeComponent,
    ClssChecklistComponent,
    PmayListComponent,
    PmayAddDetailsComponent,
    BranchListComponent,
    BranchAddEditComponent,
    LoanTypePurposeMapComponent,
    DocumentAssessmentDoccatDoctypeComponent,
    LoanMasterComponent,
    CollateralComponent,
    ConnectorLeadCreateComponent,
    TabComponent,
    TabsComponent,
    LeadsHeaderComponent,
    LeadsSidebarComponent,
    EligibilityClearedComponent,
    EligibilityNotClearedComponent,
    PaymentSuccessfullComponent,
    SuccessfullComponent,
    EditErrorMessageComponent,
    ErrorHandlingMessageComponent,
    EligibilityClearedComponent,
    RelationshipMappingComponent,
    AdminAuditTrialComponent,
    ReportsComponent,
    ReassignComponent,
    MaxMinLimitsComponent,
    PrintApplicationComponent,
    FormPrintComponent,    
    BranchMappingComponent,
    AddtionalServiceComponent,
    ApplicationPrintComponent,
    AddtionalServiceDashboardComponent,
    CkycFormComponent,
    DocumentCheckListComponent,    
    AdditionalPmayClssFormComponent, DeclarationFormComponent, TearFormComponent, RegistrationFormComponent, ArchiveRetrieveComponent, ArchiveComponent, RetrieveComponent, ArchiveOcsNumberComponent, ArchiveFileUploadComponent, RetrieveOcsNumberComponent, RetrieveFileUploadComponent, DashboardFilterComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes),
    SwiperModule,
    FormsModule,
    ReactiveFormsModule,
    Ng5SliderModule,
    HttpClientModule,
    DropDownsModule,
    DateInputsModule,
    ImageUploadModule.forRoot(),
    DeviceDetectorModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    NgxUiLoaderModule,
    // NgxUiLoaderRouterModule,
    // NgxUiLoaderRouterModule.forRoot({showForeground:true}),
    NgxPaginationModule,
    
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'})
  
  ],
  providers: [
    ListOfValuesResolverService,
    // AdminGetRoleLovResolverService
    GetApplicationPrintResolverService,
    // BirthPlaceResolverService,
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
    FileTransferObject,
    UniqueDeviceID,
    Keyboard,
    NativeKeyboard,
    AdminLovsResolverService,
    AdminGetEachLovResolverService,
    AdminAddUserLovResolverService,
    AdminRoleLovsResolverService,
    MasterLovResolverService,
    GeneralLovsService,
    ClssChecklistResolverService,
    LoanTypePurposeMapResolverService,
    HTTP,
    DocAssessDoccatProfileMapResolverService,
    MobileService,
    DocAssessDoccatProfileMapResolverService,
    ApplicationRelationshipResolverService,
    CaptchaResolverService,
    DatePipe,
    AutoLogoutService,
    MinMaxLimitsResolverService,
    AdminUserLovsResolverService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
