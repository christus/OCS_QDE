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
  createOrUpdatePanDetails(qde: Qde) {
    const qdeRequestEntity: RequestEntity = {
      processId: '0e5efe06762811e982270242ac110003',
      ProcessVariables: {
        request: JSON.stringify(qde)
      },
      workflowId: '0e40a79e762811e982270242ac110003',
      projectId: 'ff8e364e6fce11e98754782bcb8f3845'
    };

    const body = new HttpParams().set(
      'processVariables',
      JSON.stringify(qdeRequestEntity)
    );

    return this.http.post(
      '/appiyo/d/workflows/0e40a79e762811e982270242ac110003/execute',
      body.toString(),
      {
        headers: new HttpHeaders().set(
          'Content-Type',
          'application/x-www-form-urlencoded'
        ),
        params: new HttpParams().set(
          'projectId',
          'ff8e364e6fce11e98754782bcb8f3845'
        )
      }
    );
  }

  createOrUpdatePersonalDetails(qde: Qde) {
    const qdeRequestEntity: RequestEntity = {
      processId: '0e5efe06762811e982270242ac110003',
      ProcessVariables: {
        request: JSON.stringify(qde)
      },
      workflowId: '0e40a79e762811e982270242ac110003',
      projectId: 'ff8e364e6fce11e98754782bcb8f3845'
    };

    const body = new HttpParams().set(
      'processVariables',
      JSON.stringify(qdeRequestEntity)
    );

    return this.http.post(
      '/appiyo/d/workflows/0e40a79e762811e982270242ac110003/execute',
      body.toString(),
      {
        headers: new HttpHeaders().set(
          'Content-Type',
          'application/x-www-form-urlencoded'
        ),
        params: new HttpParams().set(
          'projectId',
          'ff8e364e6fce11e98754782bcb8f3845'
        )
      }
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
      ProcessVariables: {},
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

  dummyGetApi() {
    return of({
      "Error": "0",
      "ErrorCode": "",
      "ErrorMessage": "",
      "ProcessId": "aefbaf62764611e982270242ac110003",
      "ProcessInstanceId": "770a840682a411e982270242ac110002",
      "ProcessName": "Get Application",
      "ProcessVariables": {
        "applicantId": [
          494
        ],
        "query": " SELECT application.id,t2.id as applicant_id ,application_number,ocs_number,amount_required,amount_eligible,t2.existing_loan_provider, t2.total_monthly_emi,tenure,property_identified,t2.address_id,app_id,lead_id,t2.annual_net_income,t3.property_zipcode, t3.property_address_line_one,t3.property_address_line_two,t3.property_city,t3.property_state FROM application left join applicants t2 on application.id=t2.application_id left join address t3 on t2.address_id=t3.id WHERE application.id =724",
        "response": "{\"application\":{\"ocsNumber\":\"ocs00000000000000000729\",\"loanAmount\":null,\"tenure\":null,\"appId\":null,\"propertyIdentified\":null,\"applicants\":[\"{\\\"familyDetails\\\":{\\\"numberOfDependendants\\\":null,\\\"fatherTitle\\\":null,\\\"fatherName\\\":null,\\\"motherName\\\":null,\\\"motherTitle\\\":null,\\\"motherMaidenName\\\":null},\\\"other\\\":{\\\"religion\\\":null,\\\"category\\\":\\\"\\\"},\\\"occupation\\\":{\\\"occupationType\\\":null,\\\"companyName\\\":null,\\\"numberOfYearsInCurrentComany\\\":null,\\\"totalWorkExperiance\\\":null},\\\"pan\\\":{\\\"panNumber\\\":\\\"ASCPC9155R\\\"},\\\"personalDetails\\\":{\\\"title\\\":null,\\\"firstName\\\":null,\\\"middleName\\\":null,\\\"lastName\\\":null,\\\"gender\\\":null,\\\"qualification\\\":null,\\\"dob\\\":null,\\\"birthPlace\\\":null},\\\"contactDetails\\\":{\\\"preferredEmailId\\\":\\\"true\\\",\\\"mobileNumber\\\":null,\\\"residenceNumber\\\":null},\\\"communicationAddress\\\":{\\\"residentialStatus\\\":null,\\\"addressLineOne\\\":\\\"\\\",\\\"addressLineTwo\\\":\\\"\\\",\\\"pincode\\\":\\\"\\\",\\\"city\\\":\\\"\\\",\\\"state\\\":\\\"\\\"},\\\"permanentAddress\\\":{\\\"residentialStatus\\\":null,\\\"addressLineOne\\\":\\\"\\\",\\\"addressLineTwo\\\":\\\"\\\",\\\"pincode\\\":\\\"\\\",\\\"city\\\":\\\"\\\",\\\"state\\\":\\\"\\\"},\\\"officialCorrespondence\\\":{\\\"addressLineOne\\\":\\\"\\\",\\\"addressLineTwo\\\":\\\"\\\",\\\"landmark\\\":\\\"\\\",\\\"pincode\\\":\\\"\\\",\\\"city\\\":\\\"\\\"},\\\"organizationDetails\\\":{\\\"nameOfOrganization\\\":null,\\\"dateOfIncorporation\\\":null,\\\"constitution\\\":null},\\\"corporateAddress\\\":{\\\"corporateAddress\\\":\\\"\\\",\\\"landMark\\\":\\\"\\\",\\\"pincode\\\":\\\"\\\",\\\"city\\\":\\\"\\\",\\\"state\\\":\\\"\\\",\\\"stdNumber\\\":\\\"\\\",\\\"officeEmailId\\\":null},\\\"revenueDetails\\\":{\\\"revenue\\\":null,\\\"annualNetIncome\\\":null,\\\"grossTurnover\\\":null}}\"],\"loanDetails\":{\"incomeDetails\":{\"annualFamilyIncome\":null},\"loanAmount\":{\"amountRequired\":null,\"loanTenure\":null},\"property\":{\"propertyPincode\":null,\"addressLineOne\":null,\"addressLineTwo\":null,\"city\":null,\"state\":null},\"existingLoans\":{\"loanProvider\":null,\"monthlyEmi\":null}}}}",
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
