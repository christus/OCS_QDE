package com.redirect.payment;

import java.util.logging.Logger;

import org.json.simple.JSONObject;

public class Configuration {
	
	private Logger logger = Logger.getLogger(this.getClass().getName());

    public String appiyoUrl = null;

    //Appiyo login url
    public String loginURL = appiyoUrl + "/account/login_ne";

    //Appiyo send message url
    public String logoutURL = appiyoUrl + "account/logout";
    
    public String emailId = null;
    
    public String password = null;
    
    public String authToken = null;
    
    public String longTermToken = null;
    
    public boolean isHTTPS = false;
    
    public String redirectURL = null;
    
    public Configuration(String configPath){
    	
    	JSONObject configJson = Utility.convertJSONFileToObject(configPath);
    	
    	JSONObject callbackConfig = (JSONObject)configJson.get("Callback");
    	
    	logger.info("Read configuration for Callback " + callbackConfig);
    	
    	this.appiyoUrl = (String) callbackConfig.get("appiyoUrl");
    	this.emailId = (String) callbackConfig.get("userName");
    	this.password = (String) callbackConfig.get("password");
		this.authToken = (String) callbackConfig.get("authToken");
		System.out.println("authToken is configured " + authToken.isEmpty());
		this.isHTTPS = (boolean) callbackConfig.get("isHTTPS");
		this.longTermToken = (String) callbackConfig.get("longTermToken");
		this.redirectURL = (String) callbackConfig.get("redirectURL");
		
		loginURL = appiyoUrl + "/account/login_ne";
    	logoutURL = appiyoUrl + "account/logout";
    }
}
