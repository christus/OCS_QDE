package com.redirect.st;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.util.Enumeration;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;

import org.json.simple.JSONObject;

import com.redirect.payment.HelperContextListener;
import com.redirect.payment.Utility;

@Path("")
public class StaticRedirect {
	
	Logger logger = Logger.getLogger(getClass().getName());
	
	@Context
	HttpServletRequest request;
	
	@Context
	HttpServletResponse response;
	
	@GET
	@Path("icici-terms/auto-login/{applicationId}/{applicantId}")

	public FileInputStream executePaymentSuccess(
			@PathParam("applicationId") String applicationId,
			@PathParam("applicantId") String applicantId) {
		try {
			logger.log(Level.INFO, "Redirecting : icici-terms/auto-login/" 
					+ applicationId + " " + applicantId);
            String base = request.getServletContext().getRealPath("/index.html");
            File f = new File(base);
            return new FileInputStream(f);
        } catch (FileNotFoundException e) {
            // log the error?
        	e.printStackTrace();
        	
            return null;
        }
	}
	
	@GET
	@Path("payments/online-summary/{applicationId}")

	public FileInputStream executePaymentSuccess1(
			@PathParam("applicantId") String applicationId) {
		try {
			logger.log(Level.INFO, "Redirecting : payments/online-summary/" 
					+ " " + applicationId);
            String base = request.getServletContext().getRealPath("/index.html");
            File f = new File(base);
            return new FileInputStream(f);
        } catch (FileNotFoundException e) {
            // log the error?
        	e.printStackTrace();
        	
            return null;
        }
	}
	
	@GET
	@Path("payments/cleared-eligibility/{applicationId}")

	public FileInputStream executePaymentSuccess2(
			@PathParam("applicantId") String applicationId) {
		try {
			logger.log(Level.INFO, "Redirecting : payments/cleared-eligibility/" 
					+ " " + applicationId);
            String base = request.getServletContext().getRealPath("/index.html");
            File f = new File(base);
            return new FileInputStream(f);
        } catch (FileNotFoundException e) {
            // log the error?
        	e.printStackTrace();
        	
            return null;
        }
	}
	
	
	@GET
	@Path("payments/not-cleared-eligibility/{applicationId}")

	public FileInputStream executePaymentSuccess3(
			@PathParam("applicantId") String applicationId) {
		try {
			logger.log(Level.INFO, "Redirecting : payments/not-cleared-eligibility/" 
					+ " " + applicationId);
            String base = request.getServletContext().getRealPath("/index.html");
            File f = new File(base);
            return new FileInputStream(f);
        } catch (FileNotFoundException e) {
            // log the error?
        	e.printStackTrace();
        	
            return null;
        }
	}
	
}
