import { environment } from 'src/environments/environment';
import { MobileService } from './mobile-constant.service';
import { Injectable } from '@angular/core';
import Qde from '../models/qde.model';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import RequestEntity from '../models/request-entity.model';
import { of, Observable } from 'rxjs';

import {CommonDataService} from 'src/app/services/common-data.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { QdeService } from '../services/qde.service';

import { HTTP } from '@ionic-native/http/ngx';
import { DeviceDetectorService } from 'ngx-device-detector';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { EncryptService } from './encrypt.service';

export declare class myOptions {
  method: any;
  data?: any;
  params?: {
      [index: string]: string | number;
  };
  serializer?: 'json' | 'urlencoded' | 'utf8';
  timeout?: number;
  headers?: any;
  filePath?: string | string[];
  name?: string | string[];
  responseType?: any;
}


@Injectable({
  providedIn: 'root'
})
export class QdeHttpService {

  userName:string = "";
  password:string = "";
  isMobile:any;
  ionicOption: myOptions;
  sharedKsy = "MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAJ+GJdSSEeaNFBLqyfM3DIOgQgWCwJ0INfeZZV7ITsLeuA7Yd02rrkYGIix1IWvoebWVmzhncUepYxHwK1ARCdUCAwEAAQ==";

  constructor(private http: HttpClient,
  private commonDataService: CommonDataService,
  private camera: Camera,
  private transfer: FileTransfer,
  private qdeService: QdeService,
  private httpIonic: HTTP,
  private mobileService: MobileService,
  private ngxService: NgxUiLoaderService,
  private encrytionService: EncryptService) {

    this.commonDataService.loginData.subscribe(result => {
      console.log("login: ", result);
       this.userName = result.email;
       this.password = result.password;
    });

    this.isMobile = this.mobileService.isMobile;

    // if(this.isMobile) {
    //   environment.apiVersion = {
    //     login: "",
    //     api: ""
    //   }
    // }

  }

  /**
   * Create or update PAN Details
   */
 createOrUpdatePanDetails(qde) {
    const qdeRequestEntity: RequestEntity = {
      processId: environment.api.save.processId,
      ProcessVariables: {
        request: JSON.stringify(qde),
        userId: localStorage.getItem("userId")
      },
      workflowId: environment.api.save.workflowId,
      projectId: environment.projectId
    };

    const body = {
      'processVariables':
      JSON.stringify(qdeRequestEntity)
    }

   let uri = environment.host + '/d/workflows/' + environment.api.save.workflowId + '/'+environment.apiVersion.api+'execute?projectId=' + environment.projectId;
    return this.callPost(
      environment.api.save.workflowId, environment.projectId,
      body
    );
  }

createOrUpdatePersonalDetails(qde) {
    const qdeRequestEntity: RequestEntity = {
      processId: environment.api.save.processId,
      ProcessVariables: {
        request: JSON.stringify(qde),
        userId: localStorage.getItem("userId")
      },
      workflowId: environment.api.save.workflowId,
      projectId: environment.projectId
    };

    const body = {
      'processVariables':
      JSON.stringify(qdeRequestEntity)
    }

    let uri = environment.host + '/d/workflows/' + environment.api.save.workflowId + '/'+environment.apiVersion.api+'execute?projectId=' + environment.projectId;
    return this.callPost(
      environment.api.save.workflowId, environment.projectId,
      body
    );
  }

  checkPanValid(pan) {
    const qdeRequestEntity: RequestEntity = {
      processId: environment.api.checkPan.processId,
      ProcessVariables: {
        actualPanNumber: JSON.stringify(pan.actualPanNumber),
        userId: localStorage.getItem("userId")
      },
      workflowId: environment.api.checkPan.workflowId,
      projectId: environment.projectId
    };

    const body = {
      'processVariables':
      JSON.stringify(qdeRequestEntity)
    }

    let uri = environment.host + '/d/workflows/' + environment.api.save.workflowId + '/'+environment.apiVersion.api+'execute?projectId=' + environment.projectId;
    return this.callPost(
      environment.api.save.workflowId, environment.projectId,
      body
    );
  }

  authenticate(data: any) {

    // const body = new HttpParams()
    //   .set('email', data.email)
    //   .set('password', data.password)

    const body = {
      'email': data.email,
      'password': data.password
    };

    let uri = environment.host + '/account/'+environment.apiVersion.login+'login';
    return this.callPost(null, null, body, null, "login");
  }

  checkActiveSession(data: any) {
    // const body = new HttpParams()
    //   .set('email', data.email)
    //   .set('password', data.password)
    //   .set('removeExistingSession', data.removeExistingSession)
    //   .set('appId', data.appId)

      const body = {
        'email': data.email,
        'password': data.password,
        'removeExistingSession': data.removeExistingSession,
        'appId': data.appId,
        "refId": data.refId,
      "captcha": data.captcha
      };


    let uri = environment.host + '/account/'+environment.apiVersion.login+'login';    
    // let uri = environment.host + '/account/login_ne';
    // let uri = environment.host + '/account/login';
    return this.callPost(null, null, body, null, "login");
  }


  longLiveAuthenticate(data: any) {

    const body = {
      'email': data.email,
      'password': data.password,
      'longTimeToken': true,
    };

    let uri = environment.host + '/account/'+environment.apiVersion.login+'login';
    return this.callPost(null, null, body, data, "login");
  }

  duplicateLogin() {

      const body = {
        'email': environment.userName,
        'password': environment.password,
      };

    let uri = environment.host + '/account/'+environment.apiVersion.login+'login';
    return this.callPost(null, null, body, null, "login");
  }

  getLeads(search?: string, fromDay?: string, fromMonth?: string, fromYear?: string, toDay?: string, toMonth?: string, toYear?: string, assignedTo?: string, status?: string) {
    const processId = environment.api.dashboard.processId;
    const workflowId = environment.api.dashboard.workflowId;
    const projectId = environment.projectId;

    let processVariables = {
      userId: localStorage.getItem("userId"),
      firstName: (search != null) ? search : "",
      fromDate: (fromDay != 'DD' || fromMonth != 'MM' || fromYear != 'YYYY') ? new Date(fromYear+""+"-"+fromMonth+"-"+fromDay).toJSON(): "",
      toDate: (toDay != 'DD' || toMonth != 'MM' || toYear != 'YYYY') ? new Date(toYear+""+"-"+toMonth+"-"+toDay).toJSON(): "",
      applicationStatus: status
    };

    const requestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: processVariables,
      workflowId: workflowId,
      projectId: projectId
    };

    const body = {
      'processVariables':
      JSON.stringify(requestEntity)
    }

    let uri = environment.host + '/d/workflows/' + workflowId + '/'+environment.apiVersion.api+'execute?projectId=' + projectId;
    return this.callPost(workflowId, projectId, body);
  }

  getNewLeads(search?: string, fromDay?: string, fromMonth?: string, fromYear?: string, toDay?: string, toMonth?: string, toYear?: string, assignedTo?: string, status?: string) {
    const processId = environment.api.newLeads.processId;
    const workflowId = environment.api.newLeads.workflowId;
    const projectId = environment.projectId;

    let processVariables = {
      userId: parseInt(localStorage.getItem("userId")),
      firstName: (search != null) ? search : "",
      fromDate: (fromDay != 'DD' || fromMonth != 'MM' || fromYear != 'YYYY') ? new Date(fromYear+""+"-"+fromMonth+"-"+fromDay).toJSON(): "",
      toDate: (toDay != 'DD' || toMonth != 'MM' || toYear != 'YYYY') ? new Date(toYear+""+"-"+toMonth+"-"+toDay).toJSON(): ""
    };

    const requestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: processVariables,
      workflowId: workflowId,
      projectId: projectId
    };

    const body = {
      'processVariables':
      JSON.stringify(requestEntity)
    };

    let uri = environment.host + '/d/workflows/' + workflowId + '/'+environment.apiVersion.api+'execute?projectId=' + projectId;
    return this.callPost(workflowId, projectId, body);
  }

  getQdeData(applicationId:number) {

    const processId = environment.api.get.processId;
    const workflowId = environment.api.get.workflowId;
    const projectId = environment.projectId;

    const requestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: {
        applicationId: applicationId
      },
      workflowId: workflowId,
      projectId: projectId
    };

    console.log("GETQDEDATA", requestEntity);

    const body = {
      'processVariables':
      JSON.stringify(requestEntity)
    };

    let uri = environment.host + '/d/workflows/' + workflowId + '/'+environment.apiVersion.api+'execute?projectId=' + projectId;
    return this.callPost(workflowId, projectId, body);
  }

  roleLogin() {
    const processId = environment.api.roleLogin.processId;
    const workflowId = environment.api.roleLogin.workflowId;
    const projectId = environment.projectId;

    const userName = this.userName;
    const password = this.password;

    this.commonDataService.loginData.subscribe(result => {
      console.log("login: ", result);
       this.userName = result.email;
       this.password = result.password;
    });

    const requestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: {
        userName: userName,
        password: password
      },
      workflowId: workflowId,
      projectId: projectId
    };

    const body = {
      'processVariables':
      JSON.stringify(requestEntity)
    };

    let uri = environment.host + '/d/workflows/' + workflowId + '/'+environment.apiVersion.api+'execute?projectId=' + projectId;
    return this.callPost(workflowId, projectId, body);
  }

  getCityAndState(zipcode) {
    const processId = environment.api.cityState.processId;
    const workflowId = environment.api.cityState.workflowId;
    const projectId = environment.projectId;

    const userName = environment.userName;
    const password = environment.password;


    const requestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: {
        zipcode: zipcode,
        userId: localStorage.getItem("userId")
      },
      workflowId: workflowId,
      projectId: projectId
    };

    const body = {
      'processVariables':
      JSON.stringify(requestEntity)
    };

    let uri = environment.host + '/d/workflows/' + workflowId + '/'+environment.apiVersion.api+'execute?projectId=' + projectId;
    return this.callPost(workflowId, projectId, body);
  }

  uploadToAppiyoDrive(fileToUpload: File) {

    let uri = environment.host + environment.appiyoDrive;

    let headers = {
      headers: new HttpHeaders({})
    };

    const formData: FormData = new FormData();
    formData.append('files[]', fileToUpload, fileToUpload.name);

    if(this.isMobile) {
      return this.callPost(null, null, formData, headers, "uploadAppiyoDrive");
    }else {
      return this.http.post(uri, formData, headers);
    }


  }

  uploadToOmni(documentInfo: any) {
    const processId = environment.api.upload.processId;
    const workflowId = environment.api.upload.workflowId;
    const projectId = environment.projectId;

    const requestEntity: RequestEntity = {
      ProcessVariables: documentInfo,
      processId: processId,
      workflowId: workflowId,
      projectId: projectId
    };

    const body = {
      "processVariables":
      JSON.stringify(requestEntity)
    };

    let uri = environment.host + '/d/workflows/' + workflowId + '/'+environment.apiVersion.api+'execute?projectId=' + projectId;
    return this.callPost(workflowId, projectId, body);
  }


  uploadToOps(documentInfo: any) {
    const processId = environment.api.upload.processId;
    const workflowId = environment.api.upload.workflowId;
    const projectId = environment.projectId;

    const requestEntity: RequestEntity = {
      ProcessVariables: documentInfo,
      processId: processId,
      workflowId: workflowId,
      projectId: projectId
    };

    const body = {
      "processVariables":
      JSON.stringify(requestEntity)
    };

    let uri = environment.host + '/d/workflows/' + workflowId + '/'+environment.apiVersion.api+'execute?projectId=' + projectId;
    return this.callPost(workflowId, projectId, body);
  }

  getApplicableDocuments(data: any) {
    const processId = environment.api.applicableDocuments.processId;
    const workflowId = environment.api.applicableDocuments.workflowId;
    const projectId = environment.projectId;

    const requestEntity: RequestEntity = {
      ProcessVariables: data,
      processId: processId,
      workflowId: workflowId,
      projectId: projectId
    };

    const body = {
      "processVariables":
      JSON.stringify(requestEntity)
    };

    let uri = environment.host + '/d/workflows/' + workflowId + '/'+environment.apiVersion.api+'execute?projectId=' + projectId;
    return this.callPost(workflowId, projectId, body);
  }

  documentsPaymentReconCSV(data: any) {
    const processId = environment.api.paymentReconDownload.processId;
    const workflowId = environment.api.paymentReconDownload.workflowId;
    const projectId = environment.projectId;

    const requestEntity: RequestEntity = {
      ProcessVariables: data,
      processId: processId,
      workflowId: workflowId,
      projectId: projectId,
    };

    const body = {
      "processVariables":
      JSON.stringify(requestEntity)
    };

    let uri = environment.host + '/d/workflows/' + workflowId + '/'+environment.apiVersion.api+'execute?projectId=' + projectId;
    return this.callPost(workflowId, projectId, body);
  }

  documentsPaymentNonReconCSV(data: any) {
    const processId = environment.api.paymentNonReconDownload.processId;
    const workflowId = environment.api.paymentNonReconDownload.workflowId;
    const projectId = environment.projectId;

    const requestEntity: RequestEntity = {
      ProcessVariables: data,
      processId: processId,
      workflowId: workflowId,
      projectId: projectId,
    };

    const body = {
      "processVariables":
      JSON.stringify(requestEntity)
    };

    let uri = environment.host + '/d/workflows/' + workflowId + '/'+environment.apiVersion.api+'execute?projectId=' + projectId;
    return this.callPost(workflowId, projectId, body);
  }

  downloadOfflinePayment(data: any) {
    const processId = environment.api.paymentOfflineDownload.processId;
    const workflowId = environment.api.paymentOfflineDownload.workflowId;
    const projectId = environment.projectId;

    const requestEntity: RequestEntity = {
      ProcessVariables: data,
      processId: processId,
      workflowId: workflowId,
      projectId: projectId,
    };

    const body = {
      "processVariables":
      JSON.stringify(requestEntity)
    };

    let uri = environment.host + '/d/workflows/' + workflowId + '/'+environment.apiVersion.api+'execute?projectId=' + projectId;
    return this.callPost(workflowId, projectId, body);
  }



  uploadOfflinePayment(data: any) {
    const processId = environment.api.offlinePaymentUpload.processId;
    const workflowId = environment.api.offlinePaymentUpload.workflowId;
    const projectId = environment.projectId;

    const requestEntity: RequestEntity = {
      ProcessVariables: data,
      processId: processId,
      workflowId: workflowId,
      projectId: projectId,
    };

    const body = {
      "processVariables":
      JSON.stringify(requestEntity)
    };

    let uri = environment.host + '/d/workflows/' + workflowId + '/'+environment.apiVersion.api+'execute?projectId=' + projectId;
    return this.callPost(workflowId, projectId, body);
  }

  uploadOnlinePaymentRecon(data: any) {
    const processId = environment.api.paymentReconUpload.processId;
    const workflowId = environment.api.paymentReconUpload.workflowId;
    const projectId = environment.projectId;

    const requestEntity: RequestEntity = {
      ProcessVariables: data,
      processId: processId,
      workflowId: workflowId,
      projectId: projectId,
    };

    const body = {
      "processVariables":
      JSON.stringify(requestEntity)
    };

    let uri = environment.host + '/d/workflows/' + workflowId + '/'+environment.apiVersion.api+'execute?projectId=' + projectId;
    return this.callPost(workflowId, projectId, body);
  }

  dummyGetApi(qde) {
    return of({
      "Error": "0",
      "ErrorCode": "",
      "ErrorMessage": "",
      "ProcessId": "aefbaf62764611e982270242ac110003",
      "ProcessInstanceId": "64bf85b685e811e982270242ac110002",
      "ProcessName": "Get Application",
      "ProcessVariables": {
        "applicantId": [
          947
        ],
        "query": " SELECT application.id,t2.id as applicant_id ,application_number,ocs_number,amount_required,amount_eligible,t2.existing_loan_provider,    t2.total_monthly_emi,tenure,property_identified,t2.address_id,app_id,lead_id,t2.annual_net_income,t3.property_zipcode,    t3.property_address_line_one,t3.property_address_line_two,t3.property_city,t3.property_state    FROM application left join applicants t2 on    application.id=t2.application_id left join address t3 on t2.address_id=t3.id WHERE application.id =1056",
        "response": "{\"application\":{\"ocsNumber\":\" \",\"loanAmount\":\"\",\"tenure\":\"\",\"applicationId\":\"\",\"propertyIdentified\":null,\"applicants\":[{\"applicantId\":\"\",\"isMainApplicant\":true,\"isIndividual\":true,\"partnerRelationship\":\"\",\"maritalStatus\":{\"status\":\"\",\"spouseTitle\":\"\",\"firstName\":\"\",\"earning\":null,\"amount\":null},\"familyDetails\":{\"numberOfDependents\":3,\"fatherTitle\":\"\",\"fatherName\":\"\",\"motherTitle\":\"\",\"motherName\":\"\",\"motherMaidenName\":\"\"},\"other\":{\"religion\":\"\",\"category\":\"\"},\"occupation\":{\"occupationType\":\"\",\"companyName\":\"\",\"numberOfYearsInCurrentCompany\":null,\"totalWorkExperience\":null},\"pan\":{\"panNumber\":\"BJOPD6128Y\",\"panImage\":\"\",\"docType\":null,\"docNumber\":\"\"},\"personalDetails\":{\"title\":\"2\",\"firstName\":\"Deepen\",\"middleName\":\"Naresh\",\"lastName\":\"Dhamecha\",\"gender\":\"3\",\"qualification\":\"4\",\"dob\":\"1954-04-04\",\"birthPlace\":\"\",\"applicantStatus\":\"2\"},\"contactDetails\":{\"preferredEmailId\":\"\",\"alternateEmailId\":\"\",\"mobileNumber\":null,\"alternateMobileNumber\":null,\"residenceNumber\":\"91-9867341191\",\"alternateResidenceNumber\":\"\"},\"communicationAddress\":{\"residentialStatus\":\"\",\"addressLineOne\":\"\",\"addressLineTwo\":\"\",\"zipcode\":\"\",\"city\":\"\",\"state\":\"\",\"cityState\":\"\",\"numberOfYearsInCurrentResidence\":\"\",\"permanentAddress\":null,\"preferedMailingAddress\":\"2\"},\"permanentAddress\":{\"residentialStatus\":\"\",\"addressLineOne\":\"\",\"addressLineTwo\":\"\",\"zipcode\":\"\",\"city\":\"\",\"state\":\"\",\"cityState\":\"\",\"numberOfYearsInCurrentResidence\":\"\",\"permanentAddress\":null,\"preferedMailingAddress\":\"\"},\"residentialAddress\":{\"residentialStatus\":\"\",\"addressLineOne\":\"\",\"addressLineTwo\":\"\",\"zipcode\":\"\",\"city\":\"\",\"state\":\"\",\"cityState\":\"\",\"numberOfYearsInCurrentResidence\":\"\",\"permanentAddress\":null},\"officialCorrespondence\":{\"addressLineOne\":\"\",\"addressLineTwo\":\"\",\"landMark\":\"\",\"zipcode\":\"\",\"city\":\"\",\"state\":\"\",\"officeNumber\":\"\",\"officeEmailId\":\"\",\"cityState\":\"\",\"zipCityStateID\":\"\"},\"organizationDetails\":{\"nameOfOrganization\":\"\",\"dateOfIncorporation\":\"\",\"constitution\":\"\"},\"registeredAddress\":{\"registeredAddress\":\"\",\"landMark\":\"\",\"zipcode\":\"\",\"city\":\"\",\"state\":\"\"},\"corporateAddress\":{\"corporateAddress\":\"\",\"landMark\":\"\",\"zipcode\":\"\",\"city\":\"\",\"state\":\"\",\"stdNumber\":\"\",\"officeEmailId\":\"\"},\"revenueDetails\":{\"revenue\":null,\"annualNetIncome\":null,\"grossTurnOver\":null},\"incomeDetails\":{\"annualFamilyIncome\":\"\",\"monthlyExpenditure\":\"\",\"incomeConsider\":null,\"monthlyIncome\":\"\",\"assessmentMethodology\":\"\",\"puccaHouse\":null},\"documents\":[{\"documentType\":\"\",\"documentValue\":\"\"},{\"documentType\":\"\",\"documentValue\":\"\"},{\"documentType\":\"\",\"documentValue\":\"\"}]},{\"applicantId\":\"\",\"isMainApplicant\":false,\"isIndividual\":false,\"partnerRelationship\":\"\",\"maritalStatus\":{\"status\":\"\",\"spouseTitle\":\"\",\"firstName\":\"\",\"earning\":null,\"amount\":null},\"familyDetails\":{\"numberOfDependents\":null,\"fatherTitle\":\"\",\"fatherName\":\"\",\"motherTitle\":\"\",\"motherName\":\"\",\"motherMaidenName\":\"\"},\"other\":{\"religion\":\"\",\"category\":\"\"},\"occupation\":{\"occupationType\":\"\",\"companyName\":\"\",\"numberOfYearsInCurrentCompany\":null,\"totalWorkExperience\":null},\"pan\":{\"panNumber\":\"\",\"panImage\":\"\",\"docType\":null,\"docNumber\":\"\"},\"personalDetails\":{\"title\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"gender\":\"\",\"qualification\":\"\",\"dob\":\"\",\"birthPlace\":\"\",\"applicantStatus\":\"\"},\"contactDetails\":{\"preferredEmailId\":\"\",\"alternateEmailId\":\"\",\"mobileNumber\":null,\"alternateMobileNumber\":null,\"residenceNumber\":\"\",\"alternateResidenceNumber\":\"\"},\"communicationAddress\":{\"residentialStatus\":\"\",\"addressLineOne\":\"\",\"addressLineTwo\":\"\",\"zipcode\":\"\",\"city\":\"\",\"state\":\"\",\"cityState\":\"\",\"numberOfYearsInCurrentResidence\":\"\",\"permanentAddress\":null,\"preferedMailingAddress\":\"\"},\"permanentAddress\":{\"residentialStatus\":\"\",\"addressLineOne\":\"\",\"addressLineTwo\":\"\",\"zipcode\":\"\",\"city\":\"\",\"state\":\"\",\"cityState\":\"\",\"numberOfYearsInCurrentResidence\":\"\",\"permanentAddress\":null,\"preferedMailingAddress\":\"\"},\"residentialAddress\":{\"residentialStatus\":\"\",\"addressLineOne\":\"\",\"addressLineTwo\":\"\",\"zipcode\":\"\",\"city\":\"\",\"state\":\"\",\"cityState\":\"\",\"numberOfYearsInCurrentResidence\":\"\",\"permanentAddress\":null},\"officialCorrespondence\":{\"addressLineOne\":\"\",\"addressLineTwo\":\"\",\"landMark\":\"\",\"zipcode\":\"\",\"city\":\"\",\"state\":\"\",\"officeNumber\":\"\",\"officeEmailId\":\"\",\"cityState\":\"\",\"zipCityStateID\":\"\"},\"organizationDetails\":{\"nameOfOrganization\":\"\",\"dateOfIncorporation\":\"\",\"constitution\":\"\"},\"registeredAddress\":{\"registeredAddress\":\"\",\"landMark\":\"\",\"zipcode\":\"\",\"city\":\"\",\"state\":\"\"},\"corporateAddress\":{\"corporateAddress\":\"\",\"landMark\":\"\",\"zipcode\":\"\",\"city\":\"\",\"state\":\"\",\"stdNumber\":\"\",\"officeEmailId\":\"\"},\"revenueDetails\":{\"revenue\":null,\"annualNetIncome\":null,\"grossTurnOver\":null},\"incomeDetails\":{\"annualFamilyIncome\":\"\",\"monthlyExpenditure\":\"\",\"incomeConsider\":null,\"monthlyIncome\":\"\",\"assessmentMethodology\":\"\",\"puccaHouse\":null},\"documents\":[{\"documentType\":\"\",\"documentValue\":\"\"},{\"documentType\":\"\",\"documentValue\":\"\"},{\"documentType\":\"\",\"documentValue\":\"\"}]},{\"applicantId\":\"\",\"isMainApplicant\":false,\"isIndividual\":true,\"partnerRelationship\":\"\",\"maritalStatus\":{\"status\":\"\",\"spouseTitle\":\"\",\"firstName\":\"\",\"earning\":null,\"amount\":null},\"familyDetails\":{\"numberOfDependents\":null,\"fatherTitle\":\"\",\"fatherName\":\"\",\"motherTitle\":\"\",\"motherName\":\"\",\"motherMaidenName\":\"\"},\"other\":{\"religion\":\"\",\"category\":\"\"},\"occupation\":{\"occupationType\":\"\",\"companyName\":\"\",\"numberOfYearsInCurrentCompany\":null,\"totalWorkExperience\":null},\"pan\":{\"panNumber\":\"\",\"panImage\":\"\",\"docType\":null,\"docNumber\":\"\"},\"personalDetails\":{\"title\":\"\",\"firstName\":\"\",\"middleName\":\"\",\"lastName\":\"\",\"gender\":\"\",\"qualification\":\"\",\"dob\":\"\",\"birthPlace\":\"\",\"applicantStatus\":\"\"},\"contactDetails\":{\"preferredEmailId\":\"\",\"alternateEmailId\":\"\",\"mobileNumber\":null,\"alternateMobileNumber\":null,\"residenceNumber\":\"\",\"alternateResidenceNumber\":\"\"},\"communicationAddress\":{\"residentialStatus\":\"\",\"addressLineOne\":\"\",\"addressLineTwo\":\"\",\"zipcode\":\"\",\"city\":\"\",\"state\":\"\",\"cityState\":\"\",\"numberOfYearsInCurrentResidence\":\"\",\"permanentAddress\":null,\"preferedMailingAddress\":\"\"},\"permanentAddress\":{\"residentialStatus\":\"\",\"addressLineOne\":\"\",\"addressLineTwo\":\"\",\"zipcode\":\"\",\"city\":\"\",\"state\":\"\",\"cityState\":\"\",\"numberOfYearsInCurrentResidence\":\"\",\"permanentAddress\":null,\"preferedMailingAddress\":\"\"},\"residentialAddress\":{\"residentialStatus\":\"\",\"addressLineOne\":\"\",\"addressLineTwo\":\"\",\"zipcode\":\"\",\"city\":\"\",\"state\":\"\",\"cityState\":\"\",\"numberOfYearsInCurrentResidence\":\"\",\"permanentAddress\":null},\"officialCorrespondence\":{\"addressLineOne\":\"\",\"addressLineTwo\":\"\",\"landMark\":\"\",\"zipcode\":\"\",\"city\":\"\",\"state\":\"\",\"officeNumber\":\"\",\"officeEmailId\":\"\",\"cityState\":\"\",\"zipCityStateID\":\"\"},\"organizationDetails\":{\"nameOfOrganization\":\"\",\"dateOfIncorporation\":\"\",\"constitution\":\"\"},\"registeredAddress\":{\"registeredAddress\":\"\",\"landMark\":\"\",\"zipcode\":\"\",\"city\":\"\",\"state\":\"\"},\"corporateAddress\":{\"corporateAddress\":\"\",\"landMark\":\"\",\"zipcode\":\"\",\"city\":\"\",\"state\":\"\",\"stdNumber\":\"\",\"officeEmailId\":\"\"},\"revenueDetails\":{\"revenue\":null,\"annualNetIncome\":null,\"grossTurnOver\":null},\"incomeDetails\":{\"annualFamilyIncome\":\"\",\"monthlyExpenditure\":\"\",\"incomeConsider\":null,\"monthlyIncome\":\"\",\"assessmentMethodology\":\"\",\"puccaHouse\":null},\"documents\":[{\"documentType\":\"\",\"documentValue\":\"\"},{\"documentType\":\"\",\"documentValue\":\"\"},{\"documentType\":\"\",\"documentValue\":\"\"}]}],\"loanDetails\":{\"incomeDetails\":{\"annualFamilyIncome\":\"\",\"monthlyExpenditure\":\"\",\"incomeConsider\":null,\"monthlyIncome\":\"\",\"assessmentMethodology\":\"\",\"puccaHouse\":null},\"loanAmount\":{\"amountRequired\":null,\"loanPurpose\":\"\",\"loanTenure\":null},\"property\":{\"propertyIdentifed\":null,\"propertyPincde\":null,\"addressLineOne\":\"\",\"addressLineTwo\":\"\",\"city\":\"\",\"state\":\"\"},\"existingLoans\":{\"loanProvider\":\"\",\"numberOfYears\":null,\"monthlyEmi\":null}},\"references\":{\"referenceOne\":{\"relationShip\":\"\",\"title\":\"\",\"fullName\":\"\",\"mobileNumber\":\"\",\"addressLineOne\":\"\",\"addressLineTwo\":\"\"},\"referenceTwo\":{\"relationShip\":\"\",\"title\":\"\",\"fullName\":\"\",\"mobileNumber\":\"\",\"addressLineOne\":\"\",\"addressLineTwo\":\"\"}}}}",
        "tempArray": [
          "0",
          "1",
          "2",
          "3",
          "4",
          "5",
          "6"
        ]
      },
      "Status": "Execution Completed",
      "WorkflowId": "aee31fb0764611e982270242ac110003"
   });
  }

  // paymentGateway(applicationId,transactionAmount) {
  paymentGateway(applicationId) {
   if(true){
    const processId = environment.api.payGate.processId;
    const workflowId = environment.api.payGate.workflowId;
    const projectId = environment.projectId;

    const userName = environment.userName;
    const password = environment.password;


    const requestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: {
        applicationId : applicationId,
        // transactionAmount : transactionAmount
      },
      workflowId: workflowId,
      projectId: projectId
    };

    const body = {
      'processVariables':
      JSON.stringify(requestEntity)
    };

    let uri = environment.host + '/d/workflows/' + workflowId + '/'+environment.apiVersion.api+'execute?projectId=' + projectId;
    return this.callPost(workflowId, projectId, body);
  }
  else{
    return of(
      {
        "Error" : "0",
        "ErrorCode" : "",
        "ErrorMessage" : "",
        "ProcessId" : "7b35abc6837d11e982270242ac110002",
        "ProcessInstanceId" : "e90b60788b7f11e982270242ac110002",
        "ProcessName" : "Payment Gateway",
        "ProcessVariables" : {
           "AESKey" : "1100072416405002",
           "Content_Type" : "",
           "amount" : "",
           "amount1" : "20",
           "amount2" : "20",
           "amount3" : "20",
           "amount4" : "20",
           "apiType" : "PaymentGateway",
           "dbErrorCode" : "",
           "dbErrorMessage" : "",
           "dbResponse" : "",
           "errorCode" : "",
           "errorMessage" : "",
           "ezPayTransactionId" : "",
           "gatewayRequest" : "",
           "insertQuery" : "insert into api_logs (api_url,api_response,api_type,api_hit_date) values('https://eazypay.icicibank.com/EazyPG?merchantid=100011&mandatory fields=8001|1234|80| 9000000001&optional fields=20|20|20|20&returnurl= http://abc.com/cbc/action.aspx&Reference No=8001&submerchantid=1234&transaction amount=80&paymode=9','' , 'PaymentGateway', '2019-06-10')",
           "insertQueryJavaAPI" : "",
           //"isPaymentSuccessful" : false,
           "isPaymentSuccessful" : true,
           "javaAPIResponse" : "",
           "javaAPIURL" : "",
           "mobileNumber" : "9000000001",
           "paymentGatewayResponse" : "\r\n\r\n\r\n\r\n<!DOCTYPE html PUBLIC \"-//W3C//DTD HTML 4.01 Transitional//EN\" \r\n    \"http://www.w3.org/TR/html4/loose.dtd\">\r\n<html>\r\n<head>\r\n<meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">\r\n<title>Error page</title>\r\n\r\n</head>\r\n<body>\r\n    <center>\r\n        <!-- <h1>Sorry, unexpected exception occurred</h1> -->\r\n        <!--<h2>Exception name: </h2>-->\r\n        <h1>We regret the inconvenience caused. The page you have requested is not available at this time. Please try after some time..</h1>\r\n        <br/>\r\n        <span>ICICI Bank offers you three options to search for the biller on the eazypay portal. Search by Mobile Number, Search by biller, Advanced Search.</span>\r\n        <br/>\r\n\t\t\r\n<!-- <span>Please visit: <a href=\"http://eazypay.co\">http://eazypay.co</a> or <a href=\"https://eazypay.icicibank.com\">https://eazypay.icicibank.com</a>.</span> -->\r\n<span>Please visit: http://eazypay.co or https://eazypay.icicibank.com</span>\r\n<br><br>\r\n<span>\r\nFor security reasons, we have disabled double clicks and Back, Forward and Refresh tabs of the browser. Also, the session will expire automatically, if the browser window is idle for a long time. <br>\r\nSession will be expired incase of parallel transactions in a single browser. \r\n</span>\r\n\r\n    </center>\r\n</body>\r\n</html>\r\n",
           "paymentGatewayURL" : "https://eazypay.icicibank.com/EazyPG?merchantid=100011&mandatory fields=8001|1234|80| 9000000001&optional fields=20|20|20|20&returnurl= http://abc.com/cbc/action.aspx&Reference No=8001&submerchantid=1234&transaction amount=80&paymode=9",
           "requestId" : "45",
           "requestIdJavaAPI" : "",
           "responsePacketErrorCode" : "E007",
           "transactionDate" : "",
           "updateQuery" : "update api_logs set api_response = '\r\n\r\n\r\n\r\n<!DOCTYPE html PUBLIC \"-//W3C//DTD HTML 4.01 Transitional//EN\" \r\n    \"http://www.w3.org/TR/html4/loose.dtd\">\r\n<html>\r\n<head>\r\n<meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">\r\n<title>Error page</title>\r\n\r\n</head>\r\n<body>\r\n    <center>\r\n        <!-- <h1>Sorry, unexpected exception occurred</h1> -->\r\n        <!--<h2>Exception name: </h2>-->\r\n        <h1>We regret the inconvenience caused. The page you have requested is not available at this time. Please try after some time..</h1>\r\n        <br/>\r\n        <span>ICICI Bank offers you three options to search for the biller on the eazypay portal. Search by Mobile Number, Search by biller, Advanced Search.</span>\r\n        <br/>\r\n\t\t\r\n<!-- <span>Please visit: <a href=\"http://eazypay.co\">http://eazypay.co</a> or <a href=\"https://eazypay.icicibank.com\">https://eazypay.icicibank.com</a>.</span> -->\r\n<span>Please visit: http://eazypay.co or https://eazypay.icicibank.com</span>\r\n<br><br>\r\n<span>\r\nFor security reasons, we have disabled double clicks and Back, Forward and Refresh tabs of the browser. Also, the session will expire automatically, if the browser window is idle for a long time. <br>\r\nSession will be expired incase of parallel transactions in a single browser. \r\n</span>\r\n\r\n    </center>\r\n</body>\r\n</html>\r\n',error_code = '', error_message = '' where id=45",
           "updateQueryJavaAPI" : ""
        },
        "Status" : "Execution Completed",
        "WorkflowId" : "7b222bb4837d11e982270242ac110002"
      });
  }
}

  cibilDetails(ocsReferenceNumber){
  //To take the response change false to true
    if(true)    {
    const processId = environment.api.cibil.processId;
    const workflowId = environment.api.cibil.workflowId;
    const projectId = environment.projectId;

    const userName = environment.userName;
    const password = environment.password;


    const requestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: {
        ocsReferenceNumber : ocsReferenceNumber
      },
      workflowId: workflowId,
      projectId: projectId
    };

    const body = {
      'processVariables':
      JSON.stringify(requestEntity)
    };

    let uri = environment.host + '/d/workflows/' + workflowId + '/'+environment.apiVersion.api+'execute?projectId=' + projectId;
    return this.callPost(workflowId, projectId, body);
  }

  else{
    return of({

        "Error" : "0",
        "ErrorCode" : "",
        "ErrorMessage" : "",
        "ProcessId" : "7b2ecfd6837d11e982270242ac110002",
      //  "ProcessInstanceId" : "57ec6dd688f411e982270242ac110002",
        "ProcessName" : "Payment Gateway",
        "ProcessVariables": {
        "requestBodyPayload": "<soapenv:Envelope \\ \txmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" \\ \txmlns:tem=\"http://tempuri.org/\" \\ \txmlns:net=\"http://schemas.datacontract.org/2004/07/Nettpositive.BureauOne.BusinessObjects\" \\ \txmlns:arr=\"http://schemas.microsoft.com/2003/10/Serialization/Arrays\"> \\ \t<soapenv:Header/> \\ \t<soapenv:Body> \\ \t\t<tem:ProcessRequest> \\ \t\t\t<!--Optional:--> \\ \t\t\t<tem:request> \\ \t\t\t\t<net:AddrLine1>ICICI BANK LTDCHANDIVALI</net:AddrLine1> \\ \t\t\t\t<net:DOB>1999-01-02</net:DOB> \\ \t\t\t\t<net:First_Name>SHITAL</net:First_Name> \\ \t\t\t\t<net:Future_Field10>1014</net:Future_Field10> \\ \t\t\t\t<net:Last_Name>CHANDRAKANTBHAI DESAI</net:Last_Name> \\ \t\t\t\t<net:LosIndicator>LOS</net:LosIndicator> \\ \t\t\t\t<net:OverrideCoolingPeriod>false</net:OverrideCoolingPeriod> \\ \t\t\t\t<net:ProcessId></net:ProcessId> \\ \t\t\t\t<!--Optional:--> \\ \t\t\t\t<net:Product_Code></net:Product_Code> \\ \t\t\t</tem:request> \\ \t\t</tem:ProcessRequest> \\ \t</soapenv:Body> \\ </soapenv:Envelope>",
        "Content_Type": "",
        "cibilURL": "http://172.16.63.50:97/BureauOneService.svc?wsdl",
        "cibilResponse": "",
        "addressLine1": "",
        "firstName": "",
        "lastName": "",
        "dateOfBirth": "",
        "futureField10": "",
        "overrideCoolingPeriod": "",
        "procCode": "",
        "LOSIndicator": "",
        "productId": "",
        "productCode": "",
        "apiType": "CIBIL",
        "bureauCategoryId": "",
        "LOSApplicationNumber": "",
        "bureauProductList": "",
        "field10": "",
        "inquiryPurpose": "",
        "errorCode": "",
        "errorMessage": "",
        "requestId": "0",
        "insertQuery": "",
        "dbErrorCode": "",
        "dbErrorMessage": "",
        "dbResponse": "",
        "updateQuery": "",
        "transactionAmount": "",
        "durationOfAgreement": "",
        "middleName": "",
        "gender": "",
        "maritalStatus": "",
        "street": "",
        "locality1": "",
        "locality2": "",
        "city": "",
        "state": "",
        "postal": "",
        "addressType": "",
        "panId": "",
        "passportId": "",
        "voterId": "",
        "driversLicense": "",
        "rationCard": "",
        "nationalIdCard": "",
        "homePhone": "",
        "mobilePhone": "",
        "field9": "",
        "accountNumber": "",
        "field6": "",
        "field7": "",
        "field8": "",
        "createdOn": "",
        "updatedOn": "",
        "callType": "",
        "batchNumber": "",
        "status": "",
        "serialNumber": "",
        "isOverrideRule": "",
        "processControlId": "",
        "isBureauIterator": "",
        "createdBy": "",
        "updatedBy": "",
        "branchId": "",
        "kendraCentreId": "",
        "consumerName4": "",
        "consumerName5": "",
        "additionalName1": "",
        "additionalName2": "",
        "additionalNameType1": "",
        "additionalNameType2": "",
        "additionalId": "",
        "additionalId2": "",
        "field1": "",
        "field2": "",
        "field3": "",
        "field4": "",
        "field5": "",
        "addressLine2": "",
        "street2": "",
        "locality21": "",
        "locality22": "",
        "city2": "",
        "state2": "",
        "postal2": "",
        "addressType2": "",
        "addressLine3": "",
        "street3": "",
        "locality31": "",
        "locality32": "",
        "city3": "",
        "state3": "",
        "postal3": "",
        "addressType3": "",
        "bureauCategoryAlias": "",
        "bureauId": "",
        "commSearchCriteria": "",
        "dbSave": "",
        "isBureauPinging": "",
        "isEnquiryCreated": "",
        "isOverrideCoolingPeriodChk": "",
        "maxBureauCap": "",
        "priority": "",
        "rangeForExistingRequest": "",
        "referenceNumber": "",
        "requestType": "",
        "ocsReferenceNumber": "ocs00000000000000000037",
        "checkEligibility": "yes",
        //"checkEligibility": "no",
        "eligibilityAmount": "50000",
        "emi": "15000",
        "cibilScore": "",
        "cibilFlagCheck": "",
        "errorResponse": ""
      },
      "workflowId": "7b222bb4837d11e982270242ac110002",
      "projectId": "ff8e364e6fce11e98754782bcb8f3845"
    });
    }
  }


  sendOTPAPI(mobileNumber, applicantId, applicationId, isAlternateNumber, emailId) {
    const processId = environment.api.sendOTP.processId;
    const workflowId = environment.api.sendOTP.workflowId;
    const projectId = environment.projectId;

    const userName = environment.userName;
    const password = environment.password;


    const requestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: {
        "applicantId": applicantId,
        "phoneNumber": mobileNumber,
        "applicationId": applicationId,
        "isAlternateNumber":  isAlternateNumber,
        "emailId": emailId
      },
      workflowId: workflowId,
      projectId: projectId
    };

    const body = {
      'processVariables':
      JSON.stringify(requestEntity)
    };

    let uri = environment.host+ '/d/workflows/' + workflowId + '/'+environment.apiVersion.api+'execute?projectId=' + projectId;
    return this.callPost(workflowId, projectId, body);
  }

  validateOTPAPI(mobileNumber, applicantId, applicationId, otp, isAlternateNumber, emailId) {
    const processId = environment.api.validateOTP.processId;
    const workflowId = environment.api.validateOTP.workflowId;
    const projectId = environment.projectId;

    const userName = environment.userName;
    const password = environment.password;


    const requestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: {
        "applicantId": applicantId,
        "phoneNumber": mobileNumber,
        "applicationId": applicationId,
        "otp": otp,
        "isAlternateNumber":  isAlternateNumber,
        "emailId" : emailId
      },
      workflowId: workflowId,
      projectId: projectId
    };

    const body = {
      'processVariables':
      JSON.stringify(requestEntity)
    };

    let uri = environment.host+ '/d/workflows/' + workflowId + '/'+environment.apiVersion.api+'execute?projectId=' + projectId;
    return this.callPost(workflowId, projectId, body);
  }

  clssProbabilityCheck(applicationId: string) {
    if(true){
      const processId = environment.api.clss.processId;
      const workflowId = environment.api.clss.workflowId;
      const projectId = environment.projectId;

      const requestEntity: RequestEntity = {
        processId: processId,
        ProcessVariables: {
          applicationId: applicationId
        },
        workflowId: workflowId,
        projectId: projectId
      };

      const body = {
        'processVariables':
        JSON.stringify(requestEntity)
      };

      let uri = environment.host + '/d/workflows/' + workflowId + '/'+environment.apiVersion.api+'execute?projectId=' + projectId;

      return this.callPost(workflowId, projectId, body);
    }
    else{
      return of(
        {
          "Error" : "0",
          "ErrorCode" : "",
          "ErrorMessage" : "",
          "ProcessId" : "8de0689285df11e982270242ac110002",
          "ProcessInstanceId" : "2f51e1a09c9311e981640242ac110003",
          "ProcessName" : "PMAY Eligibility Check",
          "ProcessVariables" : {
             "amountEligible" : false,
             "applicationId" : "3900",
             "applicationResponse" : "",
             "area" : "",
             "city" : "",
             "clssDetails" : null,
             "eType" : "",
             "error" : {
                "code" : 1002,
                "message" : "Clss Not Applicable"
             },
             "interestEligiblePercentage" : 0,
             "interestEligibleYears" : 0,
             "isClssEligible" : true,
             "loanTypeEligible" : false,
             "location" : null,
             "maxAgeEligible" : false,
             "minAgeEligible" : false,
             "pinCode" : "",
             "propertySizeEligible" : false,
             "tenureEligible" : false
          },
          "Status" : "Execution Completed",
          "WorkflowId" : "8dc189f485df11e982270242ac110002"
       });
    }
  }

  viewFormSmsApi(applicationId: string) {
    const processId = environment.api.veiwFormSms.processId;
    const workflowId = environment.api.veiwFormSms.workflowId;
    const projectId = environment.projectId;

    const userName = environment.userName;
    const password = environment.password;


    const requestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: {
        applicationId: applicationId
      },
      workflowId: workflowId,
      projectId: projectId
    };

    const body = {
      'processVariables':
      JSON.stringify(requestEntity)
    };

    let uri = environment.host+'/d/workflows/' + workflowId + '/'+environment.apiVersion.api+'execute?projectId=' + projectId;
    return this.callPost(workflowId, projectId, body);
  }

  setStatusApi(applicationId: string, status: string) {
    const processId = environment.api.status.processId;
    const workflowId = environment.api.status.workflowId;
    const projectId = environment.projectId;

    const userName = environment.userName;
    const password = environment.password;


    const requestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: {
        applicationStatus: status,
        applicationId: "" + applicationId
      },
      workflowId: workflowId,
      projectId: projectId
    };

    const body = {
      'processVariables':
      JSON.stringify(requestEntity)
    };

    let uri = environment.host + '/d/workflows/' + workflowId + '/'+environment.apiVersion.api+'execute?projectId=' + projectId;
    return this.callPost(workflowId, projectId, body);
  }

  updateTermsAndCondition(data) {
    const processId = environment.api.saveTermsAndCondition.processId;
    const workflowId = environment.api.saveTermsAndCondition.workflowId;
    const projectId = environment.projectId;

    const requestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: data,
      workflowId: workflowId,
      projectId: projectId
    };

    const body = {
      'processVariables':
      JSON.stringify(requestEntity)
    };

    let uri = environment.host + '/d/workflows/' + workflowId + '/'+environment.apiVersion.api+'execute?projectId=' + projectId;
    return this.callPost(workflowId, projectId, body);
  }

  async takePicture() {

    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: this.camera.EncodingType.PNG,
      targetWidth: 100,
      targetHeight: 100,
      saveToPhotoAlbum: false
    }

    return this.camera.getPicture(options);
  }

  uploadFile(fileName, imageURI) {

    let trustAllHosts = true;

    const fileTransfer: FileTransferObject = this.transfer.create();

    console.log("fileTransfer", fileTransfer);

    let options: FileUploadOptions = {
      fileKey: 'file',
      fileName: fileName,
      chunkedMode: false,
      headers: {
        "X-Requested-With":"XMLHttpRequest",
        'authentication-token':
        localStorage.getItem('token') ? localStorage.getItem('token') : ''
      }
    }


    console.log("FileUploadOptions", fileTransfer);

    return fileTransfer.upload(imageURI, encodeURI(environment.host + environment.appiyoDrive) , options, true)

  }

  loginFee(applicationId:number){

    const processId = environment.api.loginfee.processId;
    const workflowId = environment.api.loginfee.workflowId;
    const projectId = environment.projectId;

    const requestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: {
        applicationId: applicationId
      },
      workflowId: workflowId,
      projectId: projectId
    };

    console.log("GET Login Fee", requestEntity);

    const body = {
      'processVariables':
      JSON.stringify(requestEntity)
    };

    let uri = environment.host + '/d/workflows/' + workflowId + '/'+environment.apiVersion.api+'execute?projectId=' + projectId;
    return this.callPost(workflowId, projectId, body);
  }

  apsApi(applicationId:string){

    const processId = environment.api.aps.processId;
    const workflowId = environment.api.aps.workflowId;
    const projectId = environment.projectId;

    const requestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: {
        applicationId: applicationId
      },
      workflowId: workflowId,
      projectId: projectId
    };

    console.log("GET APS", requestEntity);

    const body = {
      'processVariables':
      JSON.stringify(requestEntity)
    };

    let uri = environment.host + '/d/workflows/' + workflowId + '/'+environment.apiVersion.api+'execute?projectId=' + projectId;
    return this.callPost(workflowId, projectId, body);
  }


  /**
  * OCS TBM Review Of Eligiblity
  */
  getElibilityReview(applicationId: string) {

    const processId = environment.api.reviewEligibility.processId;
    const workflowId = environment.api.reviewEligibility.workflowId;
    const projectId = environment.projectId;

    const requestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: {
        applicationId: applicationId
      },
      workflowId: workflowId,
      projectId: projectId
    };

    console.log("GET APS", requestEntity);

    const body = {
      'processVariables':
      JSON.stringify(requestEntity)
    };

    let uri = environment.host + '/d/workflows/' + workflowId + '/'+environment.apiVersion.api+'execute?projectId=' + projectId;
    return this.callPost(workflowId, projectId, body);
  }

  resetMpin(data: any) {

    const processId = environment.api.resetMPIN.processId;
    const workflowId = environment.api.resetMPIN.workflowId;
    const projectId = environment.projectId;

    const requestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: {
        emailId: data.empId
      },
      workflowId: workflowId,
      projectId: projectId
    };

    const body = {
      'processVariables':
      JSON.stringify(requestEntity)
    };

    let uri = environment.host + '/d/workflows/' + workflowId + '/'+environment.apiVersion.api+'execute?projectId=' + projectId;
    return this.callPost(workflowId, projectId, body);
  }

  loginMpin(data){

    const processId = environment.api.mPINLogin.processId;
    const workflowId = environment.api.mPINLogin.workflowId;
    const projectId = environment.projectId;

    const requestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: {
        userName: data.userName,
        mpin:data.mPin
      },
      workflowId: workflowId,
      projectId: projectId
    };

    const body = {
      'processVariables':
      JSON.stringify(requestEntity)
    };

    let uri = environment.host + '/d/workflows/' + workflowId + '/'+environment.apiVersion.api+'execute?projectId=' + projectId;
    return this.callPost(workflowId, projectId, body);
  }

  dummyGetEligibilityAPI(applicationId) {
    return of({
      "Error" : "0",
      "ErrorCode" : "",
      "ErrorMessage" : "",
      "ProcessId" : "ec2f4f089f1b11e9b0c20242ac110003",
      "ProcessInstanceId" : "fbd1c4d09f3a11e9bfc20242ac110003",
      "ProcessName" : "OCS TBM Review Of Eligibility",
      "ProcessVariables" : {
         "applicationId" : "3090",
         "assignedTo" : "Aisha",
         "dateCreated" : "2019-06-11",
         "eligibilityAmount" : 7,
         "listOfApplicantsCreditScoreAboveCutOff" : [
            {
               "annualIncome" : "120000",
               "emi" : "8000"
            },
            {
               "annualIncome" : "120000",
               "emi" : "8000"
            },
            {
               "annualIncome" : "120000",
               "emi" : "8000"
            }
         ],
         "listOfApplicantsIncomeAndEMI" : [
            {
               "annualIncome" : "120000",
               "emi" : "8000"
            },
            {
               "annualIncome" : "120000",
               "emi" : "8000"
            },
            {
               "annualIncome" : "120000",
               "emi" : "8000"
            },
            {
               "annualIncome" : "120000",
               "emi" : "8000"
            }
         ],
         "listOfApplicantsNameAndCutOff" : [
            {
               "aboveCutOff" : "1",
               "firstName" : "Hardeep",
               "lastName" : "Trilochana"
            },
            {
               "aboveCutOff" : "1",
               "firstName" : "Deepen",
               "lastName" : "Dhamecha"
            },
            {
               "aboveCutOff" : "1",
               "firstName" : "Arun",
               "lastName" : "Kumar"
            },
            {
               "aboveCutOff" : "0",
               "firstName" : "Krishnan",
               "lastName" : ""
            }
         ],
         "loanType" : "Housing Loan",
         "maxEMI" : 16000,
         "revisedEligibilityAmount" : 1,
         "revisedMaxEMI" : 4000,
         "status" : true
      },
      "Status" : "Execution Completed",
      "WorkflowId" : "ec16befc9f1b11e9a0040242ac110003"
   });
  }

  duplicateApplicantCheck(applicantId) {

    const processId = environment.api.duplicateApplicantCheck.processId;
    const workflowId = environment.api.duplicateApplicantCheck.workflowId;
    const projectId = environment.projectId;

    const requestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: {
        applicantId: applicantId
      },
      workflowId: workflowId,
      projectId: projectId
    };

    const body = {
      'processVariables':
      JSON.stringify(requestEntity)
    };

    let uri = environment.host + '/d/workflows/' + workflowId + '/'+environment.apiVersion.api+'execute?projectId=' + projectId;
    return this.callPost(workflowId, projectId, body);
  }

  executePaymentWF(data) {
    const processId = environment.api.executePayment.processId;
    const workflowId = environment.api.executePayment.workflowId;
    const projectId = environment.projectId;

    const requestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: {
        data: data
      },
      workflowId: workflowId,
      projectId: projectId
    };

    const body = {
      'processVariables':
      JSON.stringify(requestEntity)
    };

    let uri = environment.host + '/d/workflows/' + workflowId + '/'+environment.apiVersion.api+'execute?projectId=' + projectId;
    return this.callPost(workflowId, projectId, body);
  }

  /**Get list of users created */

  getAdminUsers(data){
    const processId = environment.api.adminGetUsers.processId;
    const workflowId = environment.api.adminGetUsers.workflowId;
    const projectId = environment.projectId;

    const requestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: data,
      workflowId: workflowId,
      projectId: projectId
    };

    const body = {
      'processVariables':
      JSON.stringify(requestEntity)
    };

    let uri = environment.host + '/d/workflows/' + workflowId + '/'+environment.apiVersion.api+'execute?projectId=' + projectId;
    return this.callPost(workflowId, projectId, body);
  }

  /**
   * get rolename list
   */

  getRoleNameList(data) {
    const processId = environment.api.roleName.processId;
    const workflowId = environment.api.roleName.workflowId;
    const projectId = environment.projectId;

    const requestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: data,
      workflowId: workflowId,
      projectId: projectId
    };

    const body = {'processVariables': JSON.stringify(requestEntity)};

    let uri = environment.host + '/d/workflows/' + workflowId + '/'+environment.apiVersion.api+'execute?projectId=' + projectId;

    return this.callPost(workflowId, projectId, body);


  }

  /** Pmay list */

  getPmayList(data){
    const processId = environment.api.adminPmayList.processId;
    const workflowId = environment.api.adminPmayList.workflowId;
    const projectId = environment.projectId;

    const requestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: data,
      workflowId: workflowId,
      projectId: projectId
    };

    const body = {
      'processVariables':
      JSON.stringify(requestEntity)
    };

    let uri = environment.host + '/d/workflows/' + workflowId + '/'+environment.apiVersion.api+'execute?projectId=' + projectId;
    return this.callPost(workflowId, projectId, body);
  }

  /** Pmay delete */

  deletePmayList(data){
    const processId = environment.api.deleteRecord.processId;
    const workflowId = environment.api.deleteRecord.workflowId;
    const projectId = environment.projectId;

    const requestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: data,
      workflowId: workflowId,
      projectId: projectId
    };

    const body = {
      'processVariables':
      JSON.stringify(requestEntity)
    };

    let uri = environment.host + '/d/workflows/' + workflowId + '/'+environment.apiVersion.api+'execute?projectId=' + projectId;
    return this.callPost(workflowId, projectId, body);
  }

  /**Pmay individual list */

  getPmayRecord(data){
    const processId = environment.api.adminPmayRecord.processId;
    const workflowId = environment.api.adminPmayRecord.workflowId;
    const projectId = environment.projectId;

    const requestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: data,
      workflowId: workflowId,
      projectId: projectId
    };

    const body = {
      'processVariables':
      JSON.stringify(requestEntity)
    };

    let uri = environment.host + '/d/workflows/' + workflowId + '/'+environment.apiVersion.api+'execute?projectId=' + projectId;
    return this.callPost(workflowId, projectId, body);
  }

  /**Add pMay list */

  addPmayList(data) {
    const processId = environment.api.adminAddPmayList.processId;
    const workflowId = environment.api.adminAddPmayList.workflowId;
    const projectId = environment.projectId;

    const requestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: data,
      workflowId: workflowId,
      projectId: projectId
    };

    const body = {
      'processVariables':
      JSON.stringify(requestEntity)
    };

    let uri = environment.host + '/d/workflows/' + workflowId + '/'+environment.apiVersion.api+'execute?projectId=' + projectId;
    return this.callPost(workflowId, projectId, body);
  }


  /**getBranchList */

  getBranchList(data) {
    const processId = environment.api.adminGetBranchList.processId;
    const workflowId = environment.api.adminGetBranchList.workflowId;
    const projectId = environment.projectId;

    const requestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: data,
      workflowId: workflowId,
      projectId: projectId
    };

    const body = {
      'processVariables':
      JSON.stringify(requestEntity)
    };

    let uri = environment.host + '/d/workflows/' + workflowId + '/'+environment.apiVersion.api+'execute?projectId=' + projectId;
    return this.callPost(workflowId, projectId, body);
  }

  /**Get branch record */

  getBranchRecord(data) {
    const processId = environment.api.adminGetBranchRecord.processId;
    const workflowId = environment.api.adminGetBranchRecord.workflowId;
    const projectId = environment.projectId;

    const requestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: data,
      workflowId: workflowId,
      projectId: projectId
    };

    const body = {
      'processVariables':
      JSON.stringify(requestEntity)
    };

    let uri = environment.host + '/d/workflows/' + workflowId + '/'+environment.apiVersion.api+'execute?projectId=' + projectId;
    return this.callPost(workflowId, projectId, body);
  }

  /**Add branch record */

  addBranchRecord(data) {
    const processId = environment.api.adminAddBranchRecord.processId;
    const workflowId = environment.api.adminAddBranchRecord.workflowId;
    const projectId = environment.projectId;

    const requestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: data,
      workflowId: workflowId,
      projectId: projectId
    };

    const body = {
      'processVariables':
      JSON.stringify(requestEntity)
    };

    let uri = environment.host + '/d/workflows/' + workflowId + '/'+environment.apiVersion.api+'execute?projectId=' + projectId;
    return this.callPost(workflowId, projectId, body);
  }

  getAdminUser(data){
    const processId = environment.api.adminGetUser.processId;
    const workflowId = environment.api.adminGetUser.workflowId;
    const projectId = environment.projectId;

    const requestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: data,
      workflowId: workflowId,
      projectId: projectId
    };

    const body = {
      'processVariables':
      JSON.stringify(requestEntity)
    };

    let uri = environment.host + '/d/workflows/' + workflowId + '/'+environment.apiVersion.api+'execute?projectId=' + projectId;
    return this.callPost(workflowId, projectId, body);
  }

  /** Save Admin user */

  addAdminUsers(data) {
    const processId = environment.api.adminAddUser.processId;
    const workflowId = environment.api.adminAddUser.workflowId;
    const projectId = environment.projectId;

    const requestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: data,
      workflowId: workflowId,
      projectId: projectId
    };

    const body = {
      'processVariables':
      JSON.stringify(requestEntity)
    };

    let uri = environment.host + '/d/workflows/' + workflowId + '/'+environment.apiVersion.api+'execute?projectId=' + projectId;
    return this.callPost(workflowId, projectId, body);
  }


  updateAdminUsers(data) {
    const processId = environment.api.adminUpdateUser.processId;
    const workflowId = environment.api.adminUpdateUser.workflowId;
    const projectId = environment.projectId;

    const requestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: data,
      workflowId: workflowId,
      projectId: projectId
    };

    const body = {
      'processVariables':
      JSON.stringify(requestEntity)
    };

    let uri = environment.host + '/d/workflows/' + workflowId + '/'+environment.apiVersion.api+'execute?projectId=' + projectId;
    return this.callPost(workflowId, projectId, body);
  }


  /**Branch, User Lovs API */

  adminGetUserLov(data){
    const processId = environment.api.adminUserLOV.processId;
    const workflowId = environment.api.adminUserLOV.workflowId;
    const projectId = environment.projectId;

    const requestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: {
        data: data
      },
      workflowId: workflowId,
      projectId: projectId
    };

    const body = {
      'processVariables':
      JSON.stringify(requestEntity)
    };

    let uri = environment.host + '/d/workflows/' + workflowId + '/'+environment.apiVersion.api+'execute?projectId=' + projectId;
    return this.callPost(workflowId, projectId, body);
  }


  /** Get city lov */

  adminGetCityLov(data){
    const processId = environment.api.getCityLov.processId;
    const workflowId = environment.api.getCityLov.workflowId;
    const projectId = environment.projectId;

    const requestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables:  data,
      workflowId: workflowId,
      projectId: projectId
    };

    const body = {
      'processVariables':
      JSON.stringify(requestEntity)
    };

    let uri = environment.host + '/d/workflows/' + workflowId + '/'+environment.apiVersion.api+'execute?projectId=' + projectId;
    return this.callPost(workflowId, projectId, body);
  }

  /** Get zip lov */
  adminGetZipLov(data){
    const processId = environment.api.getZipLov.processId;
    const workflowId = environment.api.getZipLov.workflowId;
    const projectId = environment.projectId;

    const requestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables:  data,
      workflowId: workflowId,
      projectId: projectId
    };

    const body = {
      'processVariables':
      JSON.stringify(requestEntity)
    };

    let uri = environment.host + '/d/workflows/' + workflowId + '/'+environment.apiVersion.api+'execute?projectId=' + projectId;
    return this.callPost(workflowId, projectId, body);
  }

  /** Repoting to - search by key */

  adminReportingTo(data){
    const processId = environment.api.adminReportingTo.processId;
    const workflowId = environment.api.adminReportingTo.workflowId;
    const projectId = environment.projectId;

    const requestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: data,
      workflowId: workflowId,
      projectId: projectId
    };

    const body = {
      'processVariables':
      JSON.stringify(requestEntity)
    };

    let uri = environment.host + '/d/workflows/' + workflowId + '/'+environment.apiVersion.api+'execute?projectId=' + projectId;
    return this.callPost(workflowId, projectId, body);
  }

  insertUpdateEachLovs(lovs: any) {
    const processId = environment.api.adminInsertUpdateEachLov.processId;
    const workflowId = environment.api.adminInsertUpdateEachLov.workflowId;
    const projectId = environment.projectId;

    console.log(lovs);
    let obj = this.qdeService.getFilteredJson({
      userId: parseInt(lovs.userId),
      tableName: lovs.tableName,
      description: lovs.description,
      value: lovs.value,
      id: lovs.id!=null ? parseInt(lovs.id) : null,
      male: lovs.male!=null ? lovs.male: null,
      female: lovs.female!=null ? lovs.female: null,
      stateId : lovs.stateId!=null ? lovs.stateId: null,
      zone : lovs.zone != null ? lovs.zone: null,
      cityId : lovs.cityId!=null ? lovs.cityId: null,
      isRequired : lovs.isRequired!=null ? lovs.isRequired: null
    });
    console.log(obj);

    let requestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: obj,
      workflowId: workflowId,
      projectId: projectId
    };

    const body = {
      'processVariables':
      JSON.stringify(requestEntity)
    };

    let uri = environment.host + '/d/workflows/' + workflowId + '/'+environment.apiVersion.api+'execute?projectId=' + projectId;
    return this.callPost(workflowId, projectId, body);
  }

  softDeleteLov(lovs: any) {
    const processId = environment.api.adminSoftDeleteLov.processId;
    const workflowId = environment.api.adminSoftDeleteLov.workflowId;
    const projectId = environment.projectId;

    const requestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: {
        userId: parseInt(localStorage.getItem('userId')),
        tableName: lovs.tableName,
        id: parseInt(lovs.id),
        isDelete: true
      },
      workflowId: workflowId,
      projectId: projectId
    };


    const body = {
      'processVariables':
      JSON.stringify(requestEntity)
    };

    let uri = environment.host + '/d/workflows/' + workflowId + '/'+environment.apiVersion.api+'execute?projectId=' + projectId;
    return this.callPost(workflowId, projectId, body);
  }


  adminLoadMoreLovs(tableName: string, currentPage?: number, perPage?: number, searchKey?:string) {
    const processId = environment.api.adminGetEachLov.processId;
    const workflowId = environment.api.adminGetEachLov.workflowId;
    const projectId = environment.projectId;

    let qdeRequestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: {
        tableName: tableName,
        userId: parseInt(localStorage.getItem('userId')),
        currentPage: currentPage ? currentPage: null,
        perPage: perPage ? perPage: null,
        searchKey: searchKey ? searchKey: ""
      },
      workflowId: workflowId,
      projectId: projectId
    };

    if(qdeRequestEntity['ProcessVariables']['currentPage'] == null) {
      delete qdeRequestEntity['ProcessVariables']['currentPage'];
    }

    if(qdeRequestEntity['ProcessVariables']['perPage'] == null) {
      delete qdeRequestEntity['ProcessVariables']['perPage'];
    }

    const body = {
      "processVariables":
      JSON.stringify(qdeRequestEntity)
    };

    return this.callPost(
      workflowId, projectId,
      body
    );
  }

  adminLoadMoreClss() {
    const processId = environment.api.adminCLSSGet.processId;
    const workflowId = environment.api.adminCLSSGet.workflowId;
    const projectId = environment.projectId;

    let qdeRequestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: {
        userId: parseInt(localStorage.getItem('userId')),
      },
      workflowId: workflowId,
      projectId: projectId
    };

    if(qdeRequestEntity['ProcessVariables']['currentPage'] == null) {
      delete qdeRequestEntity['ProcessVariables']['currentPage'];
    }

    if(qdeRequestEntity['ProcessVariables']['perPage'] == null) {
      delete qdeRequestEntity['ProcessVariables']['perPage'];
    }

    const body = {
      "processVariables":
      JSON.stringify(qdeRequestEntity)
    };

    let uri = environment.host + "/d/workflows/" + workflowId + "/v2/execute?projectId=" + projectId;
    return this.callPost(
      workflowId, projectId,
      body
    );
  }

  adminGetZoneFromState(stateId: string) {
    const processId = environment.api.adminGetZoneFromState.processId;
    const workflowId = environment.api.adminGetZoneFromState.workflowId;
    const projectId = environment.projectId;

    let qdeRequestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: {
        userId: parseInt(localStorage.getItem('userId')),
        stateId: parseInt(stateId)
      },
      workflowId: workflowId,
      projectId: projectId
    };

    const body = {
      "processVariables":
      JSON.stringify(qdeRequestEntity)
    };

    return this.callPost(
      workflowId, projectId,
      body
    );
  }

  adminGetCityFromZone(zoneId: string) {
    const processId = environment.api.adminGetCityFromZone.processId;
    const workflowId = environment.api.adminGetCityFromZone.workflowId;
    const projectId = environment.projectId;

    let qdeRequestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: {
        userId: parseInt(localStorage.getItem('userId')),
        zoneId: parseInt(zoneId)
      },
      workflowId: workflowId,
      projectId: projectId
    };

    const body = {
      "processVariables":
      JSON.stringify(qdeRequestEntity)
    };

    return this.callPost(
      workflowId, projectId,
      body
    );
  }

  adminCLSSUpdate(data) {
    const processId = environment.api.adminCLSSUpdate.processId;
    const workflowId = environment.api.adminCLSSUpdate.workflowId;
    const projectId = environment.projectId;

    let qdeRequestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: data,
      workflowId: workflowId,
      projectId: projectId
    };

    const body = {
      "processVariables":
      JSON.stringify(qdeRequestEntity)
    };

    return this.callPost(
      workflowId, projectId,
      body
    );
  }

  adminZipCodeSearch(data) {
    const processId = environment.api.adminGetEachLov.processId;
    const workflowId = environment.api.adminGetEachLov.workflowId;
    const projectId = environment.projectId;

    let qdeRequestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: data,
      workflowId: workflowId,
      projectId: projectId
    };

    const body = {
      "processVariables":
      JSON.stringify(qdeRequestEntity)
    };

    return this.callPost(
      workflowId, projectId,
      body
    );
  }


  adminInsertUpdateLoanTypePurposeMap(data) {
    const processId = environment.api.adminInsertUpdateLoanTypePurposeMap.processId;
    const workflowId = environment.api.adminInsertUpdateLoanTypePurposeMap.workflowId;
    const projectId = environment.projectId;

    let qdeRequestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: data,
      workflowId: workflowId,
      projectId: projectId
    };

    const body = {
      "processVariables":
      JSON.stringify(qdeRequestEntity)
    };

    return this.callPost(
      workflowId, projectId,
      body
    );
  }

  adminLoanTypePurposeMap(currentPage ?: number, perPage ?: number,searchKey?:string) {
    const processId   = environment.api.adminLoanTypePurposeMap.processId;
    const workflowId  = environment.api.adminLoanTypePurposeMap.workflowId;
    const projectId   = environment.projectId;

    let qdeRequestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: {
        userId: localStorage.getItem('userId'),
        currentPage: currentPage ? currentPage: null,
        perPage: perPage ? perPage: null,
        searchKey: searchKey ? searchKey : ""
      },
      workflowId: workflowId,
      projectId: projectId
    };

    const body = {
      "processVariables":
      JSON.stringify(qdeRequestEntity)
    };

    return this.callPost(
      workflowId, projectId,
      body
    );
  }

  adminLoanTypeSearch(data: any) {
    const processId   = environment.api.adminLoanTypePurposeMap.processId;
    const workflowId  = environment.api.adminLoanTypePurposeMap.workflowId;
    const projectId   = environment.projectId;

    let qdeRequestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: {
        userId: parseInt(localStorage.getItem('userId')),
        searchKey: data
      },
      workflowId: workflowId,
      projectId: projectId
    };

    const body = {
      'processVariables':
      JSON.stringify(qdeRequestEntity)
    };

    return this.callPost(
      workflowId, projectId,
      body
    );
  }


  adminUpdateDocumentProfile(data) {
    const processId   = environment.api.adminUpdateDocumentProfile.processId;
    const workflowId  = environment.api.adminUpdateDocumentProfile.workflowId;
    const projectId   = environment.projectId;

    let qdeRequestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: data,
      workflowId: workflowId,
      projectId: projectId
    };

    const body = {
      "processVariables":
      JSON.stringify(qdeRequestEntity)
    };

    return this.callPost(
      workflowId, projectId,
      body
    );
  }

  adminDocumentProfile(currentPage ?: number, perPage ?: number,searchKey?:string) {
    const processId   = environment.api.adminDocumentProfile.processId;
    const workflowId  = environment.api.adminDocumentProfile.workflowId;
    const projectId   = environment.projectId;

    let dude = {
      userId: localStorage.getItem('userId'),
      currentPage: currentPage ? currentPage: null,
      perPage: perPage ? perPage: null,
      searchKey: searchKey ? searchKey : ""
    };


    let qdeRequestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: dude,
      workflowId: workflowId,
      projectId: projectId
    };

    const body = {
      "processVariables":
      JSON.stringify(qdeRequestEntity)
    };

    return this.callPost(
      workflowId, projectId,
      body
    );
  }

  adminGetAllLoginFee(currentPage ?: number, perPage ?: number, searchKey?: string) {
    const processId   = environment.api.adminGetAllLoginFee.processId;
    const workflowId  = environment.api.adminGetAllLoginFee.workflowId;
    const projectId   = environment.projectId;

    let dude = this.qdeService.getFilteredJson({
      userId: localStorage.getItem('userId')
    });

    let qdeRequestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: {
        userId: parseInt(localStorage.getItem('userId')),
        currentPage: currentPage ? currentPage: 1,
        perPage: perPage ? perPage: 10,
        searchKey: searchKey ? searchKey : ""
      },
      workflowId: workflowId,
      projectId: projectId
    };

    const body = {
      "processVariables":
      JSON.stringify(qdeRequestEntity)
    };

    return this.callPost(
      workflowId, projectId,
      body
    );
  }

  adminSearchAllLoginFee(data: any) {
    const processId   = environment.api.adminGetAllLoginFee.processId;
    const workflowId  = environment.api.adminGetAllLoginFee.workflowId;
    const projectId   = environment.projectId;

    let dude = this.qdeService.getFilteredJson({
      userId: localStorage.getItem('userId')
    });

    let qdeRequestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: {
        userId: parseInt(localStorage.getItem('userId')),
        searchKey: data
      },
      workflowId: workflowId,
      projectId: projectId
    };

    const body = {
      "processVariables":
      JSON.stringify(qdeRequestEntity)
    };

    return this.callPost(
      workflowId, projectId,
      body
    );
  }

  adminUpdateLoginFee(data) {
    const processId   = environment.api.adminUpdateLoginFee.processId;
    const workflowId  = environment.api.adminUpdateLoginFee.workflowId;
    const projectId   = environment.projectId;

    let dude = this.qdeService.getFilteredJson({
      userId: localStorage.getItem('userId')
    });

    let qdeRequestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: data,
      workflowId: workflowId,
      projectId: projectId
    };

    const body = {
      "processVariables":
      JSON.stringify(qdeRequestEntity)
    };

    return this.callPost(
      workflowId, projectId,
      body
    );
  }

  adminGetAllLoanMaster(currentPage ?: number, perPage ?: number, searchKey?:string) {
    const processId   = environment.api.adminGetAllLoanMaster.processId;
    const workflowId  = environment.api.adminGetAllLoanMaster.workflowId;
    const projectId   = environment.projectId;

    let dude = this.qdeService.getFilteredJson({
      userId: localStorage.getItem('userId')
    });

    let qdeRequestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: {
        userId: localStorage.getItem('userId'),
        currentPage: currentPage ? currentPage: null,
        perPage: perPage ? perPage: null,
        searchKey: searchKey ? searchKey : ""
      },
      workflowId: workflowId,
      projectId: projectId
    };

    const body = {
      "processVariables":
      JSON.stringify(qdeRequestEntity)
    };

    return this.callPost(
      workflowId, projectId,
      body
    );
  }

  adminSearchAllLoanMaster(data: any) {
    const processId   = environment.api.adminGetAllLoanMaster.processId;
    const workflowId  = environment.api.adminGetAllLoanMaster.workflowId;
    const projectId   = environment.projectId;

    let dude = this.qdeService.getFilteredJson({
      userId: localStorage.getItem('userId')
    });

    let qdeRequestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: {
        userId: localStorage.getItem('userId'),
        searchKey: data
      },
      workflowId: workflowId,
      projectId: projectId
    };

    const body = {
      "processVariables":
      JSON.stringify(qdeRequestEntity)
    };

    return this.callPost(
      workflowId, projectId,
      body
    );
  }

  adminUpdateLoanMaster(data) {
    const processId   = environment.api.adminUpdateLoanMaster.processId;
    const workflowId  = environment.api.adminUpdateLoanMaster.workflowId;
    const projectId   = environment.projectId;

    let dude = this.qdeService.getFilteredJson({
      userId: localStorage.getItem('userId')
    });

    let qdeRequestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: data,
      workflowId: workflowId,
      projectId: projectId
    };

    const body = {
      "processVariables":
      JSON.stringify(qdeRequestEntity)
    };

    return this.callPost(
      workflowId, projectId,
      body
    );
  }

  auditTrailUpdateAPI(applicationId: string, applicantId: string, pageNumber: number, tabPage: string, screenPage: string) {
    const processId   = environment.api.auditTrailUpdateAPI.processId;
    const workflowId  = environment.api.auditTrailUpdateAPI.workflowId;
    const projectId   = environment.projectId;

    let data = {
      userId: parseInt(localStorage.getItem('userId')),
      applicationId: parseInt(applicationId),
      applicantId: parseInt(applicantId),
      pageNumber: pageNumber,
      tabPage: tabPage,
      screenPage: screenPage
    }

    let qdeRequestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: data,
      workflowId: workflowId,
      projectId: projectId
    };

    const body = {
      "processVariables":
      JSON.stringify(qdeRequestEntity)
    };

    return this.callPost(
      workflowId, projectId,
      body
    );
  }

  getLoanPurposeFromLoanType(data) {
    const processId   = environment.api.getLoanPurposeFromLoanType.processId;
    const workflowId  = environment.api.getLoanPurposeFromLoanType.workflowId;
    const projectId   = environment.projectId;


    let qdeRequestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: data,
      workflowId: workflowId,
      projectId: projectId
    };

    const body = {
      "processVariables":
      JSON.stringify(qdeRequestEntity)
    };

    return this.callPost(
      workflowId, projectId,
      body
    );
  }
  clssSearch(townName?:string){
    const processId = environment.api.clssSearch.processId;
    const workflowId = environment.api.clssSearch.workflowId;
    const projectId = environment.projectId;

    let processVariables = {
      townName: (townName != null) ? townName : "",
     };

    const requestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: processVariables,
      workflowId: workflowId,
      projectId: projectId
    };

    const body = {
      'processVariables':
      JSON.stringify(requestEntity)
    };

    let uri = environment.host + '/d/workflows/' + workflowId + '/'+environment.apiVersion.api+'execute?projectId=' + projectId;
    return this.callPost(workflowId, projectId, body);
  }

  connectorLeadCreateSave(data){
    const processId = environment.api.leadSave.processId;
    const workflowId = environment.api.leadSave.workflowId;
    const projectId = environment.projectId;


    const requestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: data,
      workflowId: workflowId,
      projectId: projectId
    };

    const body = {
      'processVariables':
      JSON.stringify(requestEntity)
    };

    let uri = environment.host + '/d/workflows/' + workflowId + '/'+environment.apiVersion.api+'execute?projectId=' + projectId;
    return this.callPost(workflowId, projectId, body);
  }

  publicWrkFlowExecute(data){

      const processId = data.get.processId;
      const workflowId = data.get.workflowId;
      const projectId = environment.projectId;

      const requestEntity: RequestEntity = {
        processId: processId,
        ProcessVariables: data.processVariables,
        workflowId: workflowId,
        projectId: projectId
      };


      const body = {
        'processVariables':
        JSON.stringify(requestEntity)
      };

      let uri = environment.ocsHost + '/payments/appiyo/execute_workflow';
      return this.callPost(workflowId, projectId, requestEntity);
  }

  mandatoryDocsApi(applicationId: number) {
    const processId = environment.api.mandatoryDocs.processId;
    const workflowId = environment.api.mandatoryDocs.workflowId;
    const projectId = environment.projectId;

    const userName = environment.userName;
    const password = environment.password;


    const requestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: {
        applicationId: applicationId
      },
      workflowId: workflowId,
      projectId: projectId
    };

    const body = {
      'processVariables':
      JSON.stringify(requestEntity)
    };

    let uri = environment.host+'/d/workflows/' + workflowId + '/'+environment.apiVersion.api+'execute?projectId=' + projectId;
    return this.callPost(workflowId, projectId, body);
  }

  omniDocsApi(applicationId: string) {
    const processId = environment.api.omniDocs.processId;
    const workflowId = environment.api.omniDocs.workflowId;
    const projectId = environment.projectId;

    const userName = environment.userName;
    const password = environment.password;


    const requestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: {
        applicationId: applicationId
      },
      workflowId: workflowId,
      projectId: projectId
    };

    const body = {
      'processVariables':
      JSON.stringify(requestEntity)
    };

    let uri = environment.host+'/d/workflows/' + workflowId + '/'+environment.apiVersion.api+'execute?projectId=' + projectId;
    return this.callPost(workflowId, projectId, body);
  }
  getApplicationStatus(data) {
    // console.log("get Error Id Handal Service Call",data);
      const processId = environment.api.getApplicationStatus.processId;
    const workflowId = environment.api.getApplicationStatus.workflowId;
    const projectId = environment.projectId;

    const requestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: data,
      workflowId: workflowId,
      projectId: projectId
    };

    const body = {
      'processVariables':
      JSON.stringify(requestEntity)
    };

    let uri = environment.host + '/d/workflows/' + workflowId + '/'+environment.apiVersion.api+'execute?projectId=' + projectId;
    return this.callPost(workflowId, projectId, body);

  }
  getApplications(data) {
    // console.log("get Error Id Handal Service Call",data);
      const processId = environment.api.getApplications.processId;
    const workflowId = environment.api.getApplications.workflowId;
    const projectId = environment.projectId;

    const requestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: data,
      workflowId: workflowId,
      projectId: projectId
    };

    const body = {
      'processVariables':
      JSON.stringify(requestEntity)
    };

    let uri = environment.host + '/d/workflows/' + workflowId + '/'+environment.apiVersion.api+'execute?projectId=' + projectId;
    return this.callPost(workflowId, projectId, body);

  }

  reAssignApplications(data) {
    // console.log("get Error Id Handal Service Call",data);
      const processId = environment.api.reAssignApplications.processId;
    const workflowId = environment.api.reAssignApplications.workflowId;
    const projectId = environment.projectId;

    const requestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: data,
      workflowId: workflowId,
      projectId: projectId
    };

    const body = {
      'processVariables':
      JSON.stringify(requestEntity)
    };

    let uri = environment.host + '/d/workflows/' + workflowId + '/'+environment.apiVersion.api+'execute?projectId=' + projectId;
    return this.callPost(workflowId, projectId, body);

  }
  getUserList(data) {
    // console.log("get Error Id Handal Service Call",data);
      const processId = environment.api.getUsers.processId;
    const workflowId = environment.api.getUsers.workflowId;
    const projectId = environment.projectId;

    const requestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: data,
      workflowId: workflowId,
      projectId: projectId
    };

    const body = {
      'processVariables':
      JSON.stringify(requestEntity)
    };

    let uri = environment.host + '/d/workflows/' + workflowId + '/'+environment.apiVersion.api+'execute?projectId=' + projectId;
    return this.callPost(workflowId, projectId, body);

  }
  getErrorHandlingMessage(data) {
    const processId = environment.api.getErrorMessage.processId;
    const workflowId = environment.api.getErrorMessage.workflowId;
    const projectId = environment.projectId;

    const requestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: data,
      workflowId: workflowId,
      projectId: projectId
    };

    const body = {
      'processVariables':
      JSON.stringify(requestEntity)
    };

    let uri = environment.host + '/d/workflows/' + workflowId + '/'+environment.apiVersion.api+'execute?projectId=' + projectId;
    return this.callPost(workflowId, projectId, body);

  }
  searchErrorHandlingMessage(data) {
    const processId = environment.api.getErrorMessage.processId;
    const workflowId = environment.api.getErrorMessage.workflowId;
    const projectId = environment.projectId;

    const requestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: data,
      workflowId: workflowId,
      projectId: projectId
    };

    const body = {
      'processVariables':
      JSON.stringify(requestEntity)
    };

    let uri = environment.host + '/d/workflows/' + workflowId + '/execute?projectId=' + projectId;
    return this.callPost(workflowId, projectId, body);

  }
  getErrorIdHandlingMessage(data) {
    const processId = environment.api.getErrorIdMessage.processId;
    const workflowId = environment.api.getErrorIdMessage.workflowId;
    const projectId = environment.projectId;

    const requestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: data,
      workflowId: workflowId,
      projectId: projectId
    };

    const body = {
      'processVariables':
      JSON.stringify(requestEntity)
    };

    let uri = environment.host + '/d/workflows/' + workflowId + '/'+environment.apiVersion.api+'execute?projectId=' + projectId;
    return this.callPost(workflowId, projectId, body);
  }
  updateErrorHandlingMessage(errorData){
    const processId = environment.api.updateErrorMessage.processId;
    const workflowId = environment.api.updateErrorMessage.workflowId;
    const projectId = environment.projectId;

    let requestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: errorData,
      workflowId: workflowId,
      projectId: projectId
    };

    const body = {
      'processVariables':
      JSON.stringify(requestEntity)
    };

    let uri = environment.host + '/d/workflows/' + workflowId + '/'+environment.apiVersion.api+'execute?projectId=' + projectId;
    return this.callPost(workflowId, projectId, body);
  }

  chequeDetailsSave(data){
    const processId = environment.api.chequeDetails.processId;
    const workflowId = environment.api.chequeDetails.workflowId;
    const projectId = environment.projectId;


    const requestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: data,
      workflowId: workflowId,
      projectId: projectId
    };

    const body = {
      'processVariables':
      JSON.stringify(requestEntity)
    };

    let uri = environment.host + '/d/workflows/' + workflowId + '/'+environment.apiVersion.api+'execute?projectId=' + projectId;
    return this.callPost(workflowId, projectId, body);
  }


  flashExitingData(data){
    const processId = environment.api.flashExitingData.processId;
    const workflowId = environment.api.flashExitingData.workflowId;
    const projectId = environment.projectId;


    const requestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: data,
      workflowId: workflowId,
      projectId: projectId
    };

    const body = {
      'processVariables':
      JSON.stringify(requestEntity)
    };

    let uri = environment.host + '/d/workflows/' + workflowId + '/'+environment.apiVersion.api+'execute?projectId=' + projectId;
    return this.callPost(workflowId, projectId, body);
  }


  checkOccupationType(data){
    const processId = environment.api.checkOccupationType.processId;
    const workflowId = environment.api.checkOccupationType.workflowId;
    const projectId = environment.projectId;


    const requestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: data,
      workflowId: workflowId,
      projectId: projectId
    };

    const body = {
      'processVariables':
      JSON.stringify(requestEntity)
    };

    let uri = environment.host + '/d/workflows/' + workflowId + '/'+environment.apiVersion.api+'execute?projectId=' + projectId;
    return this.callPost(workflowId, projectId, body);

  }


  adminApplicantRelationship(currentPage?:number,perPage?:number,searchKey?:string) {
    const processId   = environment.api.adminApplicantRelationship.processId;
    const workflowId  = environment.api.adminApplicantRelationship.workflowId;
    const projectId   = environment.projectId;

    // let tableName = _route.params['eachLovName'];

    let qdeRequestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: {
        // tableName: tableName,
        userId: parseInt(localStorage.getItem('userId')),
        currentPage: currentPage ? currentPage: 1,
        perPage: perPage ? perPage : 8,
        searchKey: searchKey ? searchKey: ""
      },
      workflowId: workflowId,
      projectId: projectId
    };



    const body = {
      'processVariables':
      JSON.stringify(qdeRequestEntity)
    };

    return this.callPost(
      workflowId, projectId,
      body
    );
  }

  adminApplicantRelationshipSearch(data:any) {
    const processId   = environment.api.adminApplicantRelationship.processId;
    const workflowId  = environment.api.adminApplicantRelationship.workflowId;
    const projectId   = environment.projectId;

    // let tableName = _route.params['eachLovName'];

    let qdeRequestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: {
        // tableName: tableName,
        userId: parseInt(localStorage.getItem('userId')),
        searchKey: data
        // currentPage: _route.queryParams['currentPage'] ? parseInt(_route.queryParams['currentPage']): 1,
        // perPage: _route.queryParams['perPage'] ? parseInt(_route.queryParams['perPage']): 10,
      },
      workflowId: workflowId,
      projectId: projectId
    };



    const body = {
      'processVariables':
      JSON.stringify(qdeRequestEntity)
    };

    return this.callPost(
      workflowId, projectId,
      body
    );
  }


  /**
   *
   * @param mainApplicant
   * @param coApplicant If coApplicant is an empty string, then its for reference relationship
   */
  getApplicantRelationships(mainApplicant: string, coApplicant: string) {
    const processId   = environment.api.getApplicantRelationships.processId;
    const workflowId  = environment.api.getApplicantRelationships.workflowId;
    const projectId   = environment.projectId;

    // let tableName = _route.params['eachLovName'];

    let qdeRequestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: {
        userId: parseInt(localStorage.getItem('userId')),
        mainApplicant: mainApplicant,
        coApplicant: coApplicant
      },
      workflowId: workflowId,
      projectId: projectId
    };

    const body = {
      'processVariables':
      JSON.stringify(qdeRequestEntity)
    };

    return this.callPost(
      workflowId, projectId,
      body
    );
  }


  assessmentListForProfileApplicantType(applicantType : string, profileId: string) {
    const processId   = environment.api.assessmentListForProfileApplicantType.processId;
    const workflowId  = environment.api.assessmentListForProfileApplicantType.workflowId;
    const projectId   = environment.projectId;

    let dude = {
      userId: parseInt(localStorage.getItem('userId')),
      applicantType: applicantType
    };

    if(profileId) {
      dude['profileId'] = profileId;
    }
    let qdeRequestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: dude,
      workflowId: workflowId,
      projectId: projectId
    };


    const body = {
      'processVariables':
      JSON.stringify(qdeRequestEntity)
    };

    return this.callPost(
      workflowId, projectId,
      body
    );
  }

  adminUpdateApplicantRelationship(data) {
    const processId = environment.api.adminUpdateApplicantRelationship.processId;
    const workflowId = environment.api.adminUpdateApplicantRelationship.workflowId;
    const projectId = environment.projectId;

    const requestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: data,
      workflowId: workflowId,
      projectId: projectId
    };


    const body = {
      'processVariables':
      JSON.stringify(requestEntity)
    };

    let uri = environment.host + '/d/workflows/' + workflowId + '/'+environment.apiVersion.api+'execute?projectId=' + projectId;
    return this.callPost(workflowId, projectId, body);
  }


  logout() {
    let uri = environment.host + "/account/logout";
    return this.callGet(uri);
  }

  downloadAuditTrail(data: any){
    const processId = environment.api.downloadAuditTrail.processId;
    const workflowId = environment.api.downloadAuditTrail.workflowId;

    const projectId = environment.projectId;

    const requestEntity: RequestEntity = {
      ProcessVariables: data,
      processId: processId,
      workflowId: workflowId,
      projectId: projectId,
    };

    const body = {
      "processVariables":
      JSON.stringify(requestEntity)
    };

    let uri = environment.host + '/d/workflows/' + workflowId + '/'+environment.apiVersion.api+'execute?projectId=' + projectId;
    return this.callPost(workflowId, projectId, body);
  }

  usersLovList(data: any) {
    const processId = environment.api.usersLov.processId;
    const workflowId = environment.api.usersLov.workflowId;
    const projectId = environment.projectId;

    const requestEntity: RequestEntity = {
      ProcessVariables: data,
      processId: processId,
      workflowId: workflowId,
      projectId: projectId,
    };

    const body = {
      "processVariables":
      JSON.stringify(requestEntity)
    };

    let uri = environment.host + '/d/workflows/' + workflowId + '/'+environment.apiVersion.api+'execute?projectId=' + projectId;
    return this.callPost(workflowId, projectId, body);
  }

  callGet(url) {
    if(this.isMobile) {

      const obs = new Observable((observer) => {
        const headers = {
          // 'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Type': 'application/json',
          'authentication-token':  localStorage.getItem('token') ? localStorage.getItem('token') : '',
        };
        this.httpIonic.get(url, {}, headers).then(result => {
          const data = JSON.parse(result.data);
          observer.next(data);
          observer.complete();
        }).catch(error => {
          observer.error(error);
          observer.complete();
        });

      });

      return obs;
    }else {
      return this.http.get(url);
    }
  }

  

  callPost(workflowId: string, projectId:string, requestEntity: any, options?:any, serviceType?:any ) {
    var that = this;

    let setUrl;

    let reqEntity;

    if(workflowId && projectId) {
      setUrl = environment.host + "/d/workflows/" + workflowId + "/" +environment.apiVersion.api+ "execute?projectId=" + projectId;
      reqEntity = requestEntity["processVariables"];
    }else if(serviceType == "login") {
      setUrl = environment.host + '/account/' +environment.apiVersion.login+ 'login';
      reqEntity = JSON.stringify(requestEntity);
    }else if(serviceType == "uploadAppiyoDrive") {
      setUrl = environment.host + environment.appiyoDrive;
    } else if(serviceType == "captcha") {
      setUrl = environment.host + '/account/captcha/generate_catcha'
    }

    this.isMobile = this.mobileService.isMobile;

    const currentHref = window.location.href;

    const arrUrl = ["/static/", "/payments/thankpayment"];

    arrUrl.forEach(function(url) {
      if(currentHref.includes(url)){
        that.isMobile = false;
        if(workflowId && projectId) {
          setUrl = environment.host + "/d/workflows/" + workflowId + "/v2/execute?projectId=" + projectId;
        } else if(serviceType == "login") {
          setUrl = environment.host + '/account/v3/login'
        } else if(serviceType == "uploadAppiyoDrive") {
          setUrl = environment.host + environment.appiyoDrive;
        }
        console.log("From mobile request....");
        return;
      }
    });

    if(this.isMobile) {
      
      this.ngxService.start();

      const obs = new Observable((observer) => {

        this.httpIonic.setSSLCertMode("nocheck");

        console.log("post requestEntity********", reqEntity);

        let encryption = this.encrytionService.encrypt(reqEntity, environment.aesPublicKey);
    
        this.ionicOption = {
          method:'post',
          data: encryption.rawPayload,
          headers: encryption.headers,
          serializer: 'utf8',
          responseType: "text"
        };

        console.log("req post", this.ionicOption);

        console.log("post url********", setUrl);

        this.httpIonic.sendRequest(setUrl, this.ionicOption).then(result => {

          console.log("result", result);
          let decritedData = that.encrytionService.decryptMobileResponse(result);
          console.log("decritedData", decritedData);
          
          const data = JSON.parse(decritedData);
          console.log("~~~***Response***~~~", data);

          observer.next(data);
          observer.complete();
          this.ngxService.stop();
        }).catch(error => {
          observer.error(error);
          observer.complete();
          this.ngxService.stop();
          console.log("~~~***Response error***~~~", error);
        });

      });

      return obs;
    } else {
      let addParameter: string = null;
      const uniqueId = Math.random().toString(36).substr(2, 9);
      console.log("uniqueId ", uniqueId);
      // const body = new HttpParams({ "fromObject": requestEntity});
      let body = requestEntity
      // let encryptBody = this.encrytionService.encrypt(JSON.stringify(requestEntity),environment.aesPublicKey);
      // const body = encryptBody;
       const beforUrl = setUrl;
    if (beforUrl.includes("?")) {
       addParameter = setUrl+"&id="+uniqueId;
       console.log("url have parametter", addParameter);
    } else {
      console.log("url not parametter");
      addParameter = setUrl+"?id="+uniqueId;
    }
    if(addParameter.includes("execute?")) {
      body = requestEntity["processVariables"];
    } else if (addParameter.includes("login?")) {
      body =JSON.stringify(requestEntity);
    }
    // let httpData = this.http.post(addParameter, body);
    // let decritedData = this.encrytionService.decryptResponse(httpData);
      return this.http.post(addParameter, body);
      // return httpData;
    }

  }

  downloadLeadDetails(data: any) {
    const processId = environment.api.downloadLeads.processId;
    const workflowId = environment.api.downloadLeads.workflowId;
    const projectId = environment.projectId;

    const requestEntity: RequestEntity = {
      ProcessVariables: data,
      processId: processId,
      workflowId: workflowId,
      projectId: projectId,
    };

    const body = {
      "processVariables":
      JSON.stringify(requestEntity)
    };

    let uri = environment.host + '/d/workflows/' + workflowId + '/'+environment.apiVersion.api+'execute?projectId=' + projectId;
    return this.callPost(workflowId, projectId, body);
  }

  downloadLoginDetails(data: any) {
    const processId = environment.api.downloadLogin.processId;
    const workflowId = environment.api.downloadLogin.workflowId;
    const projectId = environment.projectId;

    const requestEntity: RequestEntity = {
      ProcessVariables: data,
      processId: processId,
      workflowId: workflowId,
      projectId: projectId,
    };

    const body = {
      "processVariables":
      JSON.stringify(requestEntity)
    };

    let uri = environment.host + '/d/workflows/' + workflowId + '/'+environment.apiVersion.api+'execute?projectId=' + projectId;
    return this.callPost(workflowId, projectId, body);
  }

  downloadDumpDetails(data: any) {
    const processId = environment.api.downloadDump.processId;
    const workflowId = environment.api.downloadDump.workflowId;
    const projectId = environment.projectId;

    const requestEntity: RequestEntity = {
      ProcessVariables: data,
      processId: processId,
      workflowId: workflowId,
      projectId: projectId,
    };

    const body = {
      "processVariables":
      JSON.stringify(requestEntity)
    };

    let uri = environment.host + '/d/workflows/' + workflowId + '/'+environment.apiVersion.api+'execute?projectId=' + projectId;
    return this.callPost(workflowId, projectId, body);
  }

  reportsFilters(data: any) {
    const processId = environment.api.filtersForDownload.processId;
    const workflowId = environment.api.filtersForDownload.workflowId;
    const projectId = environment.projectId;

    const requestEntity: RequestEntity = {
      ProcessVariables: data,
      processId: processId,
      workflowId: workflowId,
      projectId: projectId,
    };

    const body = {
      "processVariables":
      JSON.stringify(requestEntity)
    };

    let uri = environment.host + '/d/workflows/' + workflowId + '/'+environment.apiVersion.api+'execute?projectId=' + projectId;
    return this.callPost(workflowId, projectId, body);
  }

  getOccupationLov(data: any) {
    const processId = environment.api.getOccupationLov.processId;
    const workflowId = environment.api.getOccupationLov.workflowId;
    const projectId = environment.projectId;

    const requestEntity: RequestEntity = {
      ProcessVariables: data,
      processId: processId,
      workflowId: workflowId,
      projectId: projectId,
    };

    const body = {
      "processVariables":
      JSON.stringify(requestEntity)
    };

    let uri = environment.host + '/d/workflows/' + workflowId + '/'+environment.apiVersion.api+'execute?projectId=' + projectId;
    return this.callPost(workflowId, projectId, body);
  }

  adminClssSearch(data: any) {
    const processId = environment.api.adminCLSSGet.processId;
    const workflowId = environment.api.adminCLSSGet.workflowId;
    const projectId = environment.projectId;

    let qdeRequestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: {
        userId: parseInt(localStorage.getItem('userId')),
        searchKey: data
      },
      workflowId: workflowId,
      projectId: projectId
    };

    const body = {
      'processVariables':
      JSON.stringify(qdeRequestEntity)
    };

    return this.callPost(
      workflowId, projectId,
      body
    );
  }

  adminGetLov(){
    const processId = environment.api.adminGetLov.processId;
    const workflowId = environment.api.adminGetLov.workflowId;
    const projectId = environment.projectId;

    const requestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: {
    
      },
      workflowId: workflowId,
      projectId: projectId
    };

    const body = {
      'processVariables':
      JSON.stringify(requestEntity)
    };

    let uri = environment.host + '/d/workflows/' + workflowId + '/'+environment.apiVersion.api+'execute?projectId=' + projectId;
    return this.callPost(workflowId, projectId, body);
  }

  occupationLovCompanyDetails(data:any){
    const processId = environment.api.checkCompanyDetails.processId;
    const workflowId = environment.api.checkCompanyDetails.workflowId;
    const projectId = environment.projectId;

    const requestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: {
        profileId: data
      },
      workflowId: workflowId,
      projectId: projectId
    };

    const body = {
      'processVariables':
      JSON.stringify(requestEntity)
    };

    let uri = environment.host + '/d/workflows/' + workflowId + '/'+environment.apiVersion.api+'execute?projectId=' + projectId;
    return this.callPost(workflowId, projectId, body);
  }

  generateCatchaImage(oldRefId) {
    let uri = environment.host + "/account/captcha/generate_catcha?oldRefId=" + oldRefId + environment.captchFormat;;
    // let uri = environment.host + '/account/'+environment.apiVersion.login+'login'; 

    // let uri = environment.host + '/account/login_ne';
    // let uri = environment.host + '/account/login';
    return this.http.get(uri);
  }

}
