import { Injectable } from '@angular/core';
import RequestEntity from '../models/request-entity.model';
import { HttpParams, HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ListOfValuesResolverService {
 
  constructor(private http : HttpClient) { }

  // Get Data from API
  resolve(): any {

    // Set True for Production and testing it with Appiyo APIs
    // And False for Development 
    if(false) {
      const processId = environment.api.lov.processId;
      const workflowId = environment.api.lov.workflowId;
      const projectId = environment.projectId;


      let qdeRequestEntity: RequestEntity = {
        processId: processId,
        ProcessVariables: {
        },
        workflowId: workflowId,
        projectId: projectId
      };

      const body = new HttpParams().set(
        "processVariables",
        JSON.stringify(qdeRequestEntity)
      );

      return this.http.post(
        "/appiyo/d/workflows/" + workflowId + "/execute?projectId=" + projectId,
        body.toString()
      );
    } else {
      return {
        "ProcessId" : "6569b6d6762911e982270242ac110003",
        "ProcessInstanceId" : "c02cb244821311e982270242ac110002",
        "ProcessName" : "Get List Of LOVs",
        "ProcessVariables" : {
           "allTableLovs" : [
              "{\"religion\":[{\"key\":\"Hinduism\",\"value\":\"1\"},{\"key\":\"Buddhist\",\"value\":\"2\"},{\"key\":\"Christian\",\"value\":\"3\"},{\"key\":\"Muslim\",\"value\":\"4\"},{\"key\":\"Sikh\",\"value\":\"5\"}]}",
              "{\"qualification\":[{\"key\":\"Graduate\",\"value\":\"1\"},{\"key\":\"Post Graduate\",\"value\":\"2\"},{\"key\":\"Others\",\"value\":\"3\"},{\"key\":\"Doctorate\",\"value\":\"4\"},{\"key\":\"Dummy3rao\",\"value\":\"5\"},{\"key\":\"Architect\",\"value\":\"6\"},{\"key\":\"Ca\",\"value\":\"7\"},{\"key\":\"Doctor\",\"value\":\"8\"},{\"key\":\"DOCTORATE1\",\"value\":\"9\"},{\"key\":\"Dummy Degree In Dummy College\",\"value\":\"10\"},{\"key\":\"Engineer\",\"value\":\"11\"},{\"key\":\"GRADUATE1\",\"value\":\"12\"},{\"key\":\"Graduate\",\"value\":\"13\"},{\"key\":\"Journalist\",\"value\":\"14\"},{\"key\":\"Lawyer\",\"value\":\"15\"},{\"key\":\"Matric\",\"value\":\"16\"},{\"key\":\"Mba\",\"value\":\"17\"},{\"key\":\"Nothing\",\"value\":\"18\"},{\"key\":\"OTHERS1\",\"value\":\"19\"},{\"key\":\"Post Graduate\",\"value\":\"20\"},{\"key\":\"Post Graduate\",\"value\":\"21\"},{\"key\":\"PHDDOCTORATE\",\"value\":\"22\"},{\"key\":\"Professional\",\"value\":\"23\"},{\"key\":\"Under Graduate\",\"value\":\"24\"},{\"key\":\"Under Graduate\",\"value\":\"25\"},{\"key\":\"Illiterate\",\"value\":\"26\"},{\"key\":\"DOCTOR BAMS/ BHMS\",\"value\":\"27\"},{\"key\":\"DOCTOR MD/MBBS/BDS\",\"value\":\"28\"},{\"key\":\"HSC\",\"value\":\"29\"},{\"key\":\"BELOW MATRIC\",\"value\":\"30\"},{\"key\":\"ITI/ TECH DEPLOMA\",\"value\":\"31\"},{\"key\":\"DIPLOMA\",\"value\":\"32\"},{\"key\":\"DOCTOR\",\"value\":\"33\"},{\"key\":\"7TH PASS\",\"value\":\"34\"},{\"key\":\"Passed 5th class\",\"value\":\"35\"},{\"key\":\"Passed 8th class\",\"value\":\"36\"},{\"key\":\"Above 10th\",\"value\":\"37\"}]}",
              "{\"occupation\":[{\"key\":\"GENERAL\",\"value\":\"1\"},{\"key\":\"Housewife\",\"value\":\"2\"},{\"key\":\"Huf\",\"value\":\"3\"},{\"key\":\"Minor\",\"value\":\"4\"},{\"key\":\"Non Working\",\"value\":\"5\"},{\"key\":\"Part Time\",\"value\":\"6\"},{\"key\":\"Pensioner\",\"value\":\"7\"},{\"key\":\"Retired\",\"value\":\"8\"},{\"key\":\"SELF EMPLOYED\",\"value\":\"9\"},{\"key\":\"Salaried\",\"value\":\"10\"},{\"key\":\"Self Employed Professional\",\"value\":\"11\"},{\"key\":\"Student\",\"value\":\"12\"},{\"key\":\"Surrogate\",\"value\":\"13\"}]}",
              "{\"residence_type\":[{\"key\":\"COMPANY PROVIDED\",\"value\":\"1\"},{\"key\":\"EMPLOYER LEASED\",\"value\":\"2\"},{\"key\":\"OWNED\",\"value\":\"3\"},{\"key\":\"OWNED\",\"value\":\"4\"},{\"key\":\"Paying Guest\",\"value\":\"5\"},{\"key\":\"Rental Home\",\"value\":\"6\"},{\"key\":\"Rented\",\"value\":\"7\"},{\"key\":\"With Friends\",\"value\":\"8\"},{\"key\":\"With Parents\",\"value\":\"9\"},{\"key\":\"With Relatives\",\"value\":\"10\"}]}",
              "{\"applicant_title\":[{\"key\":\"Mr\",\"value\":\"1\"},{\"key\":\"Ms\",\"value\":\"2\"},{\"key\":\"Mrs\",\"value\":\"3\"},{\"key\":\"Dr\",\"value\":\"4\"}]}",
              "{\"maritial_status\":[{\"key\":\"Single\",\"value\":\"1\"},{\"key\":\"Married\",\"value\":\"2\"},{\"key\":\"Divorced\",\"value\":\"3\"},{\"key\":\"Widowed\",\"value\":\"4\"}]}",
              "{\"relationship\":[{\"key\":\"APPOINTEE NAME\",\"value\":\"1\"},{\"key\":\"Brother In Law\",\"value\":\"2\"},{\"key\":\"Brother\",\"value\":\"3\"},{\"key\":\"CHAIRMAN\",\"value\":\"4\"},{\"key\":\"CO-APPLICANT/GUARANTOR\",\"value\":\"5\"},{\"key\":\"Daughter\",\"value\":\"6\"},{\"key\":\"Daughter In Law\",\"value\":\"7\"},{\"key\":\"DIRECTOR\",\"value\":\"8\"},{\"key\":\"Father In Law\",\"value\":\"9\"},{\"key\":\"FRIEND\",\"value\":\"10\"},{\"key\":\"Father\",\"value\":\"11\"},{\"key\":\"GRAND FATHER\",\"value\":\"12\"},{\"key\":\"GRANDMOTHER\",\"value\":\"13\"},{\"key\":\"GRAND DAUGHTER\",\"value\":\"14\"},{\"key\":\"GRAND SON\",\"value\":\"15\"},{\"key\":\"Mother In Law\",\"value\":\"16\"},{\"key\":\"Mother\",\"value\":\"17\"},{\"key\":\"NEIGHBOUR\",\"value\":\"18\"},{\"key\":\"INSURANCE NOMINEE\",\"value\":\"19\"},{\"key\":\"PARTNER\",\"value\":\"20\"},{\"key\":\"PROPRIETOR\",\"value\":\"21\"},{\"key\":\"Sister In Law\",\"value\":\"22\"},{\"key\":\"Sister\",\"value\":\"23\"},{\"key\":\"Self\",\"value\":\"24\"},{\"key\":\"Son In Law\",\"value\":\"25\"},{\"key\":\"Son\",\"value\":\"26\"},{\"key\":\"Spouse\",\"value\":\"27\"}]}",
              "{\"loan_purpose\":[{\"key\":\"Purchase of land\",\"value\":\"1\"}]}",
              "{\"category\":[{\"key\":\"General\",\"value\":\"1\"},{\"key\":\"SC\",\"value\":\"2\"},{\"key\":\"CS\",\"value\":\"3\"},{\"key\":\"OBC\",\"value\":\"4\"},{\"key\":\"MBC\",\"value\":\"5\"}]}",
              "{\"gender\":[{\"key\":\"Female\",\"value\":\"1\"},{\"key\":\"Male\",\"value\":\"2\"}]}",
              "{\"constitution\":[{\"key\":\"Partnership\",\"value\":\"1\"},{\"key\":\"Proprietership\",\"value\":\"2\"}]}",
              "{\"property_type\":[{\"key\":\"Builder\",\"value\":\"1\"},{\"key\":\"Self Construction\",\"value\":\"2\"}]}"
           ],
           "errorMessage" : "",
           "lovs" : "{\"LOVS\":{\"religion\":[{\"key\":\"Hinduism\",\"value\":\"1\"},{\"key\":\"Buddhist\",\"value\":\"2\"},{\"key\":\"Christian\",\"value\":\"3\"},{\"key\":\"Muslim\",\"value\":\"4\"},{\"key\":\"Sikh\",\"value\":\"5\"}],\"qualification\":[{\"key\":\"Graduate\",\"value\":\"1\"},{\"key\":\"Post Graduate\",\"value\":\"2\"},{\"key\":\"Others\",\"value\":\"3\"},{\"key\":\"Doctorate\",\"value\":\"4\"},{\"key\":\"Dummy3rao\",\"value\":\"5\"},{\"key\":\"Architect\",\"value\":\"6\"},{\"key\":\"Ca\",\"value\":\"7\"},{\"key\":\"Doctor\",\"value\":\"8\"},{\"key\":\"DOCTORATE1\",\"value\":\"9\"},{\"key\":\"Dummy Degree In Dummy College\",\"value\":\"10\"},{\"key\":\"Engineer\",\"value\":\"11\"},{\"key\":\"GRADUATE1\",\"value\":\"12\"},{\"key\":\"Graduate\",\"value\":\"13\"},{\"key\":\"Journalist\",\"value\":\"14\"},{\"key\":\"Lawyer\",\"value\":\"15\"},{\"key\":\"Matric\",\"value\":\"16\"},{\"key\":\"Mba\",\"value\":\"17\"},{\"key\":\"Nothing\",\"value\":\"18\"},{\"key\":\"OTHERS1\",\"value\":\"19\"},{\"key\":\"Post Graduate\",\"value\":\"20\"},{\"key\":\"Post Graduate\",\"value\":\"21\"},{\"key\":\"PHDDOCTORATE\",\"value\":\"22\"},{\"key\":\"Professional\",\"value\":\"23\"},{\"key\":\"Under Graduate\",\"value\":\"24\"},{\"key\":\"Under Graduate\",\"value\":\"25\"},{\"key\":\"Illiterate\",\"value\":\"26\"},{\"key\":\"DOCTOR BAMS/ BHMS\",\"value\":\"27\"},{\"key\":\"DOCTOR MD/MBBS/BDS\",\"value\":\"28\"},{\"key\":\"HSC\",\"value\":\"29\"},{\"key\":\"BELOW MATRIC\",\"value\":\"30\"},{\"key\":\"ITI/ TECH DEPLOMA\",\"value\":\"31\"},{\"key\":\"DIPLOMA\",\"value\":\"32\"},{\"key\":\"DOCTOR\",\"value\":\"33\"},{\"key\":\"7TH PASS\",\"value\":\"34\"},{\"key\":\"Passed 5th class\",\"value\":\"35\"},{\"key\":\"Passed 8th class\",\"value\":\"36\"},{\"key\":\"Above 10th\",\"value\":\"37\"}],\"occupation\":[{\"key\":\"GENERAL\",\"value\":\"1\"},{\"key\":\"Housewife\",\"value\":\"2\"},{\"key\":\"Huf\",\"value\":\"3\"},{\"key\":\"Minor\",\"value\":\"4\"},{\"key\":\"Non Working\",\"value\":\"5\"},{\"key\":\"Part Time\",\"value\":\"6\"},{\"key\":\"Pensioner\",\"value\":\"7\"},{\"key\":\"Retired\",\"value\":\"8\"},{\"key\":\"SELF EMPLOYED\",\"value\":\"9\"},{\"key\":\"Salaried\",\"value\":\"10\"},{\"key\":\"Self Employed Professional\",\"value\":\"11\"},{\"key\":\"Student\",\"value\":\"12\"},{\"key\":\"Surrogate\",\"value\":\"13\"}],\"residence_type\":[{\"key\":\"COMPANY PROVIDED\",\"value\":\"1\"},{\"key\":\"EMPLOYER LEASED\",\"value\":\"2\"},{\"key\":\"OWNED\",\"value\":\"3\"},{\"key\":\"OWNED\",\"value\":\"4\"},{\"key\":\"Paying Guest\",\"value\":\"5\"},{\"key\":\"Rental Home\",\"value\":\"6\"},{\"key\":\"Rented\",\"value\":\"7\"},{\"key\":\"With Friends\",\"value\":\"8\"},{\"key\":\"With Parents\",\"value\":\"9\"},{\"key\":\"With Relatives\",\"value\":\"10\"}],\"applicant_title\":[{\"key\":\"Mr\",\"value\":\"1\"},{\"key\":\"Ms\",\"value\":\"2\"},{\"key\":\"Mrs\",\"value\":\"3\"},{\"key\":\"Dr\",\"value\":\"4\"}],\"maritial_status\":[{\"key\":\"Single\",\"value\":\"1\"},{\"key\":\"Married\",\"value\":\"2\"},{\"key\":\"Divorced\",\"value\":\"3\"},{\"key\":\"Widowed\",\"value\":\"4\"}],\"relationship\":[{\"key\":\"APPOINTEE NAME\",\"value\":\"1\"},{\"key\":\"Brother In Law\",\"value\":\"2\"},{\"key\":\"Brother\",\"value\":\"3\"},{\"key\":\"CHAIRMAN\",\"value\":\"4\"},{\"key\":\"CO-APPLICANT/GUARANTOR\",\"value\":\"5\"},{\"key\":\"Daughter\",\"value\":\"6\"},{\"key\":\"Daughter In Law\",\"value\":\"7\"},{\"key\":\"DIRECTOR\",\"value\":\"8\"},{\"key\":\"Father In Law\",\"value\":\"9\"},{\"key\":\"FRIEND\",\"value\":\"10\"},{\"key\":\"Father\",\"value\":\"11\"},{\"key\":\"GRAND FATHER\",\"value\":\"12\"},{\"key\":\"GRANDMOTHER\",\"value\":\"13\"},{\"key\":\"GRAND DAUGHTER\",\"value\":\"14\"},{\"key\":\"GRAND SON\",\"value\":\"15\"},{\"key\":\"Mother In Law\",\"value\":\"16\"},{\"key\":\"Mother\",\"value\":\"17\"},{\"key\":\"NEIGHBOUR\",\"value\":\"18\"},{\"key\":\"INSURANCE NOMINEE\",\"value\":\"19\"},{\"key\":\"PARTNER\",\"value\":\"20\"},{\"key\":\"PROPRIETOR\",\"value\":\"21\"},{\"key\":\"Sister In Law\",\"value\":\"22\"},{\"key\":\"Sister\",\"value\":\"23\"},{\"key\":\"Self\",\"value\":\"24\"},{\"key\":\"Son In Law\",\"value\":\"25\"},{\"key\":\"Son\",\"value\":\"26\"},{\"key\":\"Spouse\",\"value\":\"27\"}],\"loan_purpose\":[{\"key\":\"Purchase of land\",\"value\":\"1\"}],\"category\":[{\"key\":\"General\",\"value\":\"1\"},{\"key\":\"SC\",\"value\":\"2\"},{\"key\":\"CS\",\"value\":\"3\"},{\"key\":\"OBC\",\"value\":\"4\"},{\"key\":\"MBC\",\"value\":\"5\"}],\"gender\":[{\"key\":\"Female\",\"value\":\"1\"},{\"key\":\"Male\",\"value\":\"2\"}],\"constitution\":[{\"key\":\"Partnership\",\"value\":\"1\"},{\"key\":\"Proprietership\",\"value\":\"2\"}],\"property_type\":[{\"key\":\"Builder\",\"value\":\"1\"},{\"key\":\"Self Construction\",\"value\":\"2\"}]}}",
           "status" : true,
           "tableNames" : [
              "religion",
              "qualification",
              "occupation",
              "residence_type",
              "applicant_title",
              "maritial_status",
              "relationship",
              "loan_purpose",
              "category",
              "gender",
              "constitution",
              "property_type"
           ],
           "tempArray" : [
              "{\"property_type\":[{\"key\":\"Builder\",\"value\":\"1\"},{\"key\":\"Self Construction\",\"value\":\"2\"}]}",
              "[{\"key\":\"Builder\",\"value\":\"1\"},{\"key\":\"Self Construction\",\"value\":\"2\"}]"
           ]
        },
        "Status" : "Execution Completed",
        "WorkflowId" : "1d28844c72f011e982270242ac110003"
    
     };
    }
 
  }
}
