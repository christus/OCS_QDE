package com.redirect.payment;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Enumeration;
import java.util.logging.Logger;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import com.sun.jersey.api.view.Viewable;

@Path("")
public class PublicRest {
	
	Logger logger = Logger.getLogger(getClass().getName());
	
	@Context
	HttpServletRequest request;
	
	@Context
	HttpServletResponse response;
	
//	@GET
//	@Path("/")
//	@Produces(MediaType.TEXT_HTML)
//	public FileInputStream redirectHome(){
//		
//		try {
//            String base = request.getServletContext().getRealPath("/index.html");
//            File f = new File(base);
//            return new FileInputStream(f);
//        } catch (FileNotFoundException e) {
//            // log the error?
//        	e.printStackTrace();
//        	
//            return null;
//        }
//	}
//	
//	@GET
//	@Path("/{s:.*}")
//	@Produces(MediaType.TEXT_HTML)
//	public FileInputStream redirect() throws ServletException, IOException{
//		
//		try {
//            String base = request.getServletContext().getRealPath("/index.html");
//            File f = new File(base);
//            return new FileInputStream(f);
//        } catch (FileNotFoundException e) {
//            // log the error?
//        	e.printStackTrace();
//        	
//            return null;
//        }
//				
//	}
	
	@GET
	@Path("thankpayment")
	public FileInputStream executePaymentSuccess() {
		try {
            String base = request.getServletContext().getRealPath("/index.html");
            File f = new File(base);
            return new FileInputStream(f);
        } catch (FileNotFoundException e) {
            // log the error?
        	e.printStackTrace();
        	
            return null;
        }
	}
	
	@POST
	@Path("thankpayment")
	public Response executePaymentCallback(
			@FormParam("Response Code") String a1,
			@FormParam("Unique Ref Number") String a2,
			@FormParam("Service Tax Amount")String a3,
			@FormParam("Processing Fee Amount")String a4,
			@FormParam("Total Amount")String a5,
			@FormParam("Transaction Amount")String a6,
			@FormParam("Transaction Date")String a7,
			@FormParam("Interchange Value")String a8,
			@FormParam("TDR")String a9,
			@FormParam("Payment Mode")String a10,
			@FormParam("SubMerchantId")String a11,
			@FormParam("ReferenceNo")String a12,
			@FormParam("ID")String a13,
			@FormParam("RS")String a14,
			@FormParam("TPS")String a15,
			@FormParam("mandatory fields")String a16,
			@FormParam("optional fields")String a17,
			@FormParam("RSV") String a18) {
//		Enumeration<String> params = request.getParameterNames();
//		System.out.println(params);
//		System.out.println(request.getParameterMap());
//		System.out.println(request.getAttributeNames());
//		while(request.getAttributeNames().hasMoreElements()) {
//			System.out.println(request.getAttributeNames().nextElement());
//		}
		JSONObject requestData = new JSONObject();
//		while(params.hasMoreElements()){
//			String key = params.nextElement();
//			requestData.put(key, request.getParameter(key));
//		}
//		
//		JSONArray paramsJson = HelperContextListener.getConfiguration().paymentParams;
//		int noOfParams = paramsJson.size();
//		for(int i = 0; i < noOfParams; i++) {
//			String paramName = (String) paramsJson.get(i);
//			System.out.println(request.getParameter(paramName));
//			requestData.put(paramName, request.getParameter(paramName));
//		}
		
		requestData.put("Response Code", a1);
		requestData.put("Unique Ref Number", a2);
		requestData.put("Service Tax Amount", a3);
		requestData.put("Processing Fee Amount", a4);
		requestData.put("Total Amount", a5);
		requestData.put("Transaction Amount", a6);
		requestData.put("Transaction Date", a7);
		requestData.put("Interchange Value", a8);
		requestData.put("TDR", a9);
		requestData.put("Payment Mode", a10);
		requestData.put("SubMerchantId", a11);
		requestData.put("ReferenceNo", a12);
		requestData.put("ID", a13);
		requestData.put("RS", a14);
		requestData.put("TPS", a15);
		requestData.put("mandatory fields", a16);
		requestData.put("optional fields", a17);
		requestData.put("RSV", a18);

		
		logger.info("payment_callback : Received request " + requestData);
		JSONObject requestJson = new JSONObject();
		requestJson.put("processId", "4a1b6398a22a11e998e90242ac110002");
		JSONObject pv = new JSONObject();
		pv.put("data", requestData.toJSONString());
		requestJson.put("ProcessVariables", pv);
		requestJson.put("workflowId", "49fa2570a22a11e9a2f80242ac110002");
		requestJson.put("projectId", "3209f7ea7ba811e982270242ac110002");
//		JSONObject requestJson = HelperContextListener.getConfiguration().paymentExecuteRequest;
//		String mod = requestJson.toJSONString().replace("#data#", requestData.toJSONString());
//		requestJson = Utility.getJSONObject(mod);
		System.out.println("Excecute WF request " + requestJson);
		String response = Utility.executeWorkflow(requestJson);
		System.out.println("Excecute WF response " + response);
		JSONObject responseJson = Utility.getJSONObject(response);
		JSONObject pvResponse = (JSONObject) responseJson.get("ProcessVariables");
		String uniqueRefNo = (String) pvResponse.get("uniqueRefNo");
		String errMessage = (String) pvResponse.get("errorMessage");
		String ocsReferenceNo = (String) pvResponse.get("ocsReferenceNo");
		String applicantName = (String) pvResponse.get("applicantName");
		System.out.println("uniqueRefNo " + uniqueRefNo);
		return Response
                .status(HttpServletResponse.SC_SEE_OTHER)
                .header("Location", "/ocs/payments/thankpayment"+"?uniqueRefNo="+uniqueRefNo+"&message="+errMessage
                		+"&ocsReferenceNo="+ocsReferenceNo+"&applicantName="+applicantName)
                .build();
	}
	
	@POST
	@Path("thankpayment/{applicatonId}")
	public Response executePaymentCallback(@PathParam("id") String id) {
		Enumeration<String> params = request.getParameterNames();
		JSONObject requestData = new JSONObject();
		while(params.hasMoreElements()){
			String key = params.nextElement();
			requestData.put(key, request.getParameter(key));
		}
		logger.info("payment_callback : Received request " + requestData + " id " + id);
		return Response
                .status(HttpServletResponse.SC_SEE_OTHER)
                .header("Location", HelperContextListener.getConfiguration().redirectURL)
                .build();
	}
	
	@POST
	@Path("appiyo/execute_workflow")
	public String executeWorkflowPublic(String request) {
		logger.info("payment_callback : Received request " + request);
		JSONObject requestJson = Utility.getJSONObject(request);
		String response = Utility.executeWorkflow(requestJson);
		return response;
	}
}
