import { Injectable } from '@angular/core';
import Qde from '../models/qde.model';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import RequestEntity from '../models/request-entity.model';
import { environment } from '../../environments/environment';
import { of } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class QdeHttpService {

  constructor(private http: HttpClient) {}

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

    return this.http.post(
      '/appiyo/d/workflows/'+environment.api.save.workflowId+ '/execute?projectId=' + environment.projectId,
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

    return this.http.post(
      '/appiyo/d/workflows/'+environment.api.save.workflowId+ '/execute?projectId=' + environment.projectId,
      body.toString()
    );
  }


  authenticate(data: any) {

    const body = new HttpParams()
      .set('email', data.email)
      .set('password', data.password);

    return this.http.post('/appiyo/account/login', body);
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
  
    let uri = '/appiyo/d/workflows/' + workflowId + '/execute?projectId=' + projectId;
    return this.http.put(uri, body);
  }

 

  getQdeData(applicantId:number) {
    const processId = environment.api.get.processId;
    const workflowId = environment.api.get.workflowId;
    const projectId = environment.projectId;

    const requestEntity: RequestEntity = {
      processId: processId,
      ProcessVariables: {
        applicationId: applicantId
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

  roleLogin() {

    const processId = environment.api.roleLogin.processId;
    const workflowId = environment.api.roleLogin.workflowId;
    const projectId = environment.projectId;

    const userName = environment.userName;
    const password = environment.password;


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
  
    let uri = '/appiyo/d/workflows/' + workflowId + '/execute?projectId=' + projectId;
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
  


    let uri = '/appiyo/d/workflows/' + workflowId + '/execute?projectId=' + projectId;
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
        "response": 
   "{\"application\":{\"ocsNumber\":\"ocs00000000000000001061\",\"loanAmount\":null,\"tenure\":null,\"appId\":null,\"propertyIdentified\":null,\"applicants\":[{\"applicantId\":947,\"familyDetails\":{\"numberOfDependents\":null,\"fatherTitle\":null,\"fatherName\":null,\"motherName\":null,\"motherTitle\":null,\"motherMaidenName\":null},\"other\":{\"religion\":null,\"category\":\"\"},\"occupation\":{\"occupationType\":null,\"companyName\":null,\"numberOfYearsInCurrentComany\":null,\"totalWorkExperiance\":null},\"pan\":{\"panNumber\":\"ASCPC9155E\"},\"personalDetails\":{\"title\":null,\"firstName\":null,\"middleName\":null,\"lastName\":null,\"gender\":null,\"qualification\":null,\"dob\":null,\"birthPlace\":null},\"contactDetails\":{\"preferredEmailId\":true,\"mobileNumber\":null,\"residenceNumber\":null},\"communicationAddress\":{\"residentialStatus\":null,\"addressLineOne\":\"\",\"addressLineTwo\":\"\",\"pincode\":\"\",\"city\":\"\",\"state\":\"\",\"numberOfYearsInCurrentResidence\":\"\"},\"permanentAddress\":{\"residentialStatus\":null,\"addressLineOne\":\"\",\"addressLineTwo\":\"\",\"pincode\":\"\",\"city\":\"\",\"state\":\"\"},\"officialCorrespondence\":{\"addressLineOne\":\"\",\"addressLineTwo\":\"\",\"landmark\":\"\",\"pincode\":\"\",\"city\":\"\",\"officeEmailId\":null,\"officeNumber\":null},\"organizationDetails\":{\"nameOfOrganization\":null,\"dateOfIncorporation\":null,\"constitution\":null},\"corporateAddress\":{\"corporateAddress\":\"\",\"landMark\":\"\",\"pincode\":\"\",\"city\":\"\",\"state\":\"\",\"stdNumber\":\"\",\"officeEmailId\":null},\"revenueDetails\":{\"revenue\":null,\"annualNetIncome\":null,\"grossTurnover\":null},\"isMainApplicant\":true,\"isIndividual\":false},{\"applicantId\":947,\"familyDetails\":{\"numberOfDependents\":null,\"fatherTitle\":null,\"fatherName\":null,\"motherName\":null,\"motherTitle\":null,\"motherMaidenName\":null},\"other\":{\"religion\":null,\"category\":\"\"},\"occupation\":{\"occupationType\":null,\"companyName\":null,\"numberOfYearsInCurrentComany\":null,\"totalWorkExperiance\":null},\"pan\":{\"panNumber\":\"ASCPC9155E\"},\"personalDetails\":{\"title\":null,\"firstName\":null,\"middleName\":null,\"lastName\":null,\"gender\":null,\"qualification\":null,\"dob\":null,\"birthPlace\":null},\"contactDetails\":{\"preferredEmailId\":true,\"mobileNumber\":null,\"residenceNumber\":null},\"communicationAddress\":{\"residentialStatus\":null,\"addressLineOne\":\"\",\"addressLineTwo\":\"\",\"pincode\":\"\",\"city\":\"\",\"state\":\"\",\"numberOfYearsInCurrentResidence\":\"\"},\"permanentAddress\":{\"residentialStatus\":null,\"addressLineOne\":\"\",\"addressLineTwo\":\"\",\"pincode\":\"\",\"city\":\"\",\"state\":\"\"},\"officialCorrespondence\":{\"addressLineOne\":\"\",\"addressLineTwo\":\"\",\"landmark\":\"\",\"pincode\":\"\",\"city\":\"\",\"officeEmailId\":null,\"officeNumber\":null},\"organizationDetails\":{\"nameOfOrganization\":null,\"dateOfIncorporation\":null,\"constitution\":null},\"corporateAddress\":{\"corporateAddress\":\"\",\"landMark\":\"\",\"pincode\":\"\",\"city\":\"\",\"state\":\"\",\"stdNumber\":\"\",\"officeEmailId\":null},\"revenueDetails\":{\"revenue\":null,\"annualNetIncome\":null,\"grossTurnover\":null},\"isMainApplicant\":false,\"isIndividual\":false},{\"applicantId\":947,\"familyDetails\":{\"numberOfDependents\":null,\"fatherTitle\":null,\"fatherName\":null,\"motherName\":null,\"motherTitle\":null,\"motherMaidenName\":null},\"other\":{\"religion\":null,\"category\":\"\"},\"occupation\":{\"occupationType\":null,\"companyName\":null,\"numberOfYearsInCurrentComany\":null,\"totalWorkExperiance\":null},\"pan\":{\"panNumber\":\"ASCPC9155E\"},\"personalDetails\":{\"title\":null,\"firstName\":null,\"middleName\":null,\"lastName\":null,\"gender\":null,\"qualification\":null,\"dob\":null,\"birthPlace\":null},\"contactDetails\":{\"preferredEmailId\":true,\"mobileNumber\":null,\"residenceNumber\":null},\"communicationAddress\":{\"residentialStatus\":null,\"addressLineOne\":\"\",\"addressLineTwo\":\"\",\"pincode\":\"\",\"city\":\"\",\"state\":\"\",\"numberOfYearsInCurrentResidence\":\"\"},\"permanentAddress\":{\"residentialStatus\":null,\"addressLineOne\":\"\",\"addressLineTwo\":\"\",\"pincode\":\"\",\"city\":\"\",\"state\":\"\"},\"officialCorrespondence\":{\"addressLineOne\":\"\",\"addressLineTwo\":\"\",\"landmark\":\"\",\"pincode\":\"\",\"city\":\"\",\"officeEmailId\":null,\"officeNumber\":null},\"organizationDetails\":{\"nameOfOrganization\":null,\"dateOfIncorporation\":null,\"constitution\":null},\"corporateAddress\":{\"corporateAddress\":\"\",\"landMark\":\"\",\"pincode\":\"\",\"city\":\"\",\"state\":\"\",\"stdNumber\":\"\",\"officeEmailId\":null},\"revenueDetails\":{\"revenue\":null,\"annualNetIncome\":null,\"grossTurnover\":null},\"isMainApplicant\":false,\"isIndividual\":false}],\"loanDetails\":{\"incomeDetails\":{\"annualFamilyIncome\":null},\"loanAmount\":{\"amountRequired\":null,\"loanTenure\":null},\"property\":{\"propertyPincode\":null,\"addressLineOne\":null,\"addressLineTwo\":null,\"city\":null,\"state\":null},\"existingLoans\":{\"loanProvider\":null,\"monthlyEmi\":null}}}}",
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

}
