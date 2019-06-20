import { Injectable } from '@angular/core';
import Qde from '../models/qde.model';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import RequestEntity from '../models/request-entity.model';
import { environment } from '../../environments/environment';
import { of } from 'rxjs';

import {CommonDataService} from 'src/app/services/common-data.service';

@Injectable({
  providedIn: 'root'
})
export class QdeHttpService {

  userName:string = "";
  password:string = "";


  constructor(private http: HttpClient,
  private commonDataService: CommonDataService) {

    this.commonDataService.loginData.subscribe(result => {
      console.log("login: ", result);
       this.userName = result.email;
       this.password = result.password;
    });

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

    const body = new HttpParams().set(
      'processVariables',
      JSON.stringify(qdeRequestEntity)
    );
    
   let uri = environment.host + '/appiyo/d/workflows/' + environment.api.save.workflowId + '/execute?projectId=' + environment.projectId;
    return this.http.post(
      uri,
      body.toString()
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

    const body = new HttpParams().set(
      'processVariables',
      JSON.stringify(qdeRequestEntity)
    );

    let uri = environment.host + '/appiyo/d/workflows/' + environment.api.save.workflowId + '/execute?projectId=' + environment.projectId;
    return this.http.post(
      uri,
      body.toString()
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

    const body = new HttpParams().set(
      'processVariables',
      JSON.stringify(qdeRequestEntity)
    );

    let uri = environment.host + '/appiyo/d/workflows/' + environment.api.save.workflowId + '/execute?projectId=' + environment.projectId;
    return this.http.post(
      uri,
      body.toString()
    );
  }

  authenticate(data: any) {

    const body = new HttpParams()
      .set('email', data.email)
      .set('password', data.password);

    let uri = environment.host + '/appiyo/account/login';
    return this.http.post(uri, body);
  }

  getLeads() {
    const processId = environment.api.dashboard.processId;
    const workflowId = environment.api.dashboard.workflowId;
    const projectId = environment.projectId;

    const requestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: {
        userId: localStorage.getItem("userId")
      },
      workflowId: workflowId,
      projectId: projectId
    };

    const body = new HttpParams().set(
      'processVariables',
      JSON.stringify(requestEntity)
    );
  
    let uri = environment.host + '/appiyo/d/workflows/' + workflowId + '/execute?projectId=' + projectId;
    return this.http.put(uri, body);
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

    const body = new HttpParams().set(
      'processVariables',
      JSON.stringify(requestEntity)
    );
  
    let uri = environment.host + '/appiyo/d/workflows/' + workflowId + '/execute?projectId=' + projectId;
    return this.http.put(uri, body.toString());
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

    const body = new HttpParams().set(
      'processVariables',
      JSON.stringify(requestEntity)
    );

    let uri = environment.host + '/appiyo/d/workflows/' + workflowId + '/execute?projectId=' + projectId;
    return this.http.put(uri, body.toString());
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

    const body = new HttpParams().set(
      'processVariables',
      JSON.stringify(requestEntity)
    );

    let uri = environment.host + '/appiyo/d/workflows/' + workflowId + '/execute?projectId=' + projectId;
    return this.http.put(uri, body.toString());
  }

  uploadToAppiyoDrive(fileToUpload: File) {

    let uri = environment.host + environment.appiyoDrive;

    let headers = {
      headers: new HttpHeaders({})
    };

    const formData: FormData = new FormData();
    formData.append('files[]', fileToUpload, fileToUpload.name);

    return this.http.post(uri, formData, headers);
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

    const body = new HttpParams().set(
      "processVariables",
      JSON.stringify(requestEntity)
    );

    let uri = environment.host + '/appiyo/d/workflows/' + workflowId + '/execute?projectId=' + projectId;
    return this.http.put(uri, body.toString());
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

  paymentGateway(transactionAmount) {
    const processId = environment.api.payGate.processId;
    const workflowId = environment.api.payGate.workflowId;
    const projectId = environment.projectId;

    const userName = environment.userName;
    const password = environment.password;


    const requestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: {
        transactionAmount : transactionAmount
      },
      workflowId: workflowId,
      projectId: projectId
    };

    const body = new HttpParams().set(
      'processVariables',
      JSON.stringify(requestEntity)
    );

    let uri = environment.host + '/appiyo/d/workflows/' + workflowId + '/execute?projectId=' + projectId;
    return this.http.put(uri, body.toString());
  }

  cibilDetails(ocsReferenceNumber) {
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

    const body = new HttpParams().set(
      'processVariables',
      JSON.stringify(requestEntity)
    );

    let uri = environment.host + '/appiyo/d/workflows/' + workflowId + '/execute?projectId=' + projectId;
    return this.http.put(uri, body.toString());
  }

  dummyPaymentGatewayAPI() {
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
    //  }
  }
  dummyCIBILAPI() {
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

  sendOTPAPI() {
    const processId = environment.api.sendOTP.processId;
    const workflowId = environment.api.sendOTP.workflowId;
    const projectId = environment.projectId;

    const userName = environment.userName;
    const password = environment.password;


    const requestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: {
      },
      workflowId: workflowId,
      projectId: projectId
    };

    const body = new HttpParams().set(
      'processVariables',
      JSON.stringify(requestEntity)
    );

    let uri = '/appiyo/d/workflows/' + workflowId + '/execute?projectId=' + projectId;
    return this.http.put(uri, body.toString());
  }

  validateOTPAPI() {
    const processId = environment.api.validateOTP.processId;
    const workflowId = environment.api.validateOTP.workflowId;
    const projectId = environment.projectId;

    const userName = environment.userName;
    const password = environment.password;


    const requestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: {
      },
      workflowId: workflowId,
      projectId: projectId
    };

    const body = new HttpParams().set(
      'processVariables',
      JSON.stringify(requestEntity)
    );

    let uri = '/appiyo/d/workflows/' + workflowId + '/execute?projectId=' + projectId;
    return this.http.put(uri, body.toString());
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

    const body = new HttpParams().set(
      'processVariables',
      JSON.stringify(requestEntity)
    );

    let uri = '/appiyo/d/workflows/' + workflowId + '/execute?projectId=' + projectId;
    return this.http.put(uri, body.toString());
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

    const body = new HttpParams().set(
      'processVariables',
      JSON.stringify(requestEntity)
    );

    let uri = environment.host + '/appiyo/d/workflows/' + workflowId + '/execute?projectId=' + projectId;
    return this.http.put(uri, body.toString());
  }
}







