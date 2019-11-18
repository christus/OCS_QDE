package com.redirect.payment;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.Reader;
import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.UnrecoverableKeyException;
import java.security.cert.X509Certificate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Base64;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringUtils;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpPut;
import org.apache.http.client.methods.HttpUriRequest;
import org.apache.http.conn.ClientConnectionManager;
import org.apache.http.conn.scheme.Scheme;
import org.apache.http.conn.scheme.SchemeRegistry;
import org.apache.http.conn.ssl.SSLSocketFactory;
import org.apache.http.conn.ssl.TrustStrategy;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.impl.conn.tsccm.ThreadSafeClientConnManager;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.json.XML;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

public class Utility {
	
	private static Logger logger = Logger.getLogger("Utility");
	
	public static JSONObject getJSONObject(String jsonString) {

        JSONParser parser = new JSONParser();
        JSONObject object = null;
        try {
            object = (JSONObject) parser.parse(jsonString);
        } catch (ParseException e) {
            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
        }
        return object;
    }
	
	public static JSONObject convertJSONFileToObject(String configPath){

        JSONObject json = null;
        try {
            FileReader fileReader = new FileReader(configPath);
            json = (JSONObject) getJSONObject(fileReader);
        } catch (FileNotFoundException e) {
            System.out.println("Error while reading file:: " + configPath);
            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
        }
        return json;
    }
	
	public static Object getJSONObject(Reader inputReader) {

        JSONParser parser = new JSONParser();
        Object object = null;
        try {
            object = parser.parse(inputReader);
        } catch (IOException e) {
            System.out.println("Error while reading file");
            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
        } catch (ParseException e){
            System.out.println("Error while parsing json string");
            e.printStackTrace();
        }

        return object;
    }
	
	public static String base64Decode(String data) {
		
		byte[] decodedPayload = Base64.getDecoder().decode(
				data.getBytes(StandardCharsets.UTF_8));
		
		String decodedData = Arrays.toString(decodedPayload);
		
		return decodedData;
	}
	
	public static String base64Encode(byte[] data) {
		
		return Base64.getEncoder().encodeToString(data);
		
	}
	
	public static String callRest(String url, String method, String requestData, HttpServletRequest httpRequest, boolean isHttps) {
		
		logger.info("Request data : " + requestData);
		
		HttpClient client = getClient(isHttps);
        HttpPost postMethod = new HttpPost(url);
        
        if(httpRequest != null) {
	        Enumeration<String> headerNames = httpRequest.getHeaderNames();
			while(headerNames.hasMoreElements()) {
				
				String nextHeaderName = (String) headerNames.nextElement();
			    String headerValue = httpRequest.getHeader(nextHeaderName);
			    
			    if(!nextHeaderName.equalsIgnoreCase("content-length")) {
			    
				    logger.info("Setting header : " + nextHeaderName);
					logger.info("Header value : " + headerValue);
				    
					postMethod.addHeader(nextHeaderName, headerValue);
			    }
			}
        }

        String responseData = "";
        
        try {
        	postMethod.setEntity(new StringEntity(requestData));
            HttpResponse response = client.execute(postMethod);
            HttpEntity entity = response.getEntity();
            if(entity != null){
                responseData = EntityUtils.toString(entity);
            }
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        } catch (ClientProtocolException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
		
		logger.info("Response Data : " + responseData);
				    
		return responseData;
	}
	
	public static HttpClient getClient(boolean isHTTPS){
		
		HttpClient client = null;
		
		if(isHTTPS){
    	
	    	TrustStrategy acceptingTrustStrategy = new TrustStrategy() {
		        @Override
		        public boolean isTrusted(X509Certificate[] certificate, String authType) {
		            return true;
		        }
		    };
		    
		    ClientConnectionManager ccm = null;
		    
			try {
				SSLSocketFactory sf = new SSLSocketFactory(acceptingTrustStrategy, 
			    SSLSocketFactory.ALLOW_ALL_HOSTNAME_VERIFIER);
				
				SchemeRegistry registry = new SchemeRegistry();
			    registry.register(new Scheme("https", 443, sf));
			    ccm = new ThreadSafeClientConnManager(registry);
			    
			} catch (KeyManagementException | UnrecoverableKeyException | NoSuchAlgorithmException | KeyStoreException e1) {
				e1.printStackTrace();
			}
			client = new DefaultHttpClient(ccm);
		}else{
			client = new DefaultHttpClient();
		}
        
        return client;
    }
	

    public static String executeWorkflow(JSONObject processVariables) {


//        System.out.println(processVariables.toJSONString());

        if(HelperContextListener.getConfiguration().authToken == null || HelperContextListener.getConfiguration().authToken.isEmpty()){
            login();
        }

        String executeWorkflowUrl = HelperContextListener.getConfiguration().appiyoUrl + "/d/workflows/" + processVariables.get("workflowId")
                + "/execute" + "?projectId=" + processVariables.get("projectId");


        HttpClient client = getClient();
        HttpPut httpPut = new HttpPut(executeWorkflowUrl);

        httpPut.addHeader("Cookie", HelperContextListener.getConfiguration().authToken);

        List<NameValuePair> params = new ArrayList<NameValuePair>();

        params.add(new BasicNameValuePair("processVariables", processVariables.toJSONString()));

        String responseData = "";

        logger.log(Level.INFO, "Request: " + processVariables);

        try {
            httpPut.setEntity(new UrlEncodedFormEntity(params, "UTF-8"));
            HttpResponse response = client.execute(httpPut);
            HttpEntity entity = response.getEntity();
            if(entity != null){
                responseData = EntityUtils.toString(entity);
            }
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        } catch (ClientProtocolException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }

        logger.log(Level.INFO, "Response: " + responseData);


//        JSONObject responseObj = (JSONObject) HelperContextListener.getConfiguration().getJSONObject(responseData);
//        if(responseObj == null){
//            throw new ProcessStoreException(1, "Internal server error. No response from Gateway");
//        }else if (responseObj.get("Error").equals("1")){
//            throw new ProcessStoreException(2, "Internal server error. Uncatched workflow exception");
//        }else{
//
//            JSONObject responsePV = (JSONObject) responseObj.get("ProcessVariables");
//            if(responsePV.containsKey("error")){
//                JSONObject error = (JSONObject) responsePV.get("error");
//                int code = stringToInt(error.get("code"));
////                 if(!error.get("code").equals("0")){
//                if(code != 0){
//
//                    String errMsg = (String) error.get("message");
//                    errMsg = errMsg != null ? errMsg : "Internal server error. Catched workflow exception";
//                    throw new ProcessStoreException(code, errMsg);
//                }
//            }
//        }

        return responseData;
    }
    
    private static boolean login(){

        boolean isLoggedIn = false;

        HttpClient client = getClient();
//        HttpClient client = new DefaultHttpClient();
        HttpPost httpPost = new HttpPost(HelperContextListener.getConfiguration().loginURL);

        List<NameValuePair> params = new ArrayList<NameValuePair>();
        params.add(new BasicNameValuePair("email", HelperContextListener.getConfiguration().emailId));
        params.add(new BasicNameValuePair("password", HelperContextListener.getConfiguration().password));
        params.add(new BasicNameValuePair("longTermToken", HelperContextListener.getConfiguration().longTermToken));

        logger.log(Level.INFO, "Logging into Appiyo " + HelperContextListener.getConfiguration().loginURL + " with user name " + HelperContextListener.getConfiguration().emailId);

        String responseData = "";
        JSONObject dataJson = null;

        try {
            httpPost.setEntity(new UrlEncodedFormEntity(params, "UTF-8"));
            HttpResponse response = client.execute(httpPost);
            HttpEntity entity = response.getEntity();
            if(entity != null){
                responseData = EntityUtils.toString(entity);
            }

            JSONParser parser = new JSONParser();
            dataJson = (JSONObject) parser.parse(responseData);

        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        } catch (ClientProtocolException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }catch (org.json.simple.parser.ParseException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

        logger.log(Level.ALL, "Login response " + dataJson);

        if(dataJson != null){
            String token = (String) dataJson.get("token");
            HelperContextListener.getConfiguration().authToken = "authentication-token=" + token;
            isLoggedIn = true;
            logger.log(Level.INFO, "Appiyo logged in and saving auth token");
        }else{
            logger.log(Level.SEVERE, "Appiyo login failed.");
        }

        return isLoggedIn;
    }

    public static HttpClient getClient(){

        HttpClient client = null;

        if(HelperContextListener.getConfiguration().isHTTPS){

            TrustStrategy acceptingTrustStrategy = new TrustStrategy() {
                @Override
                public boolean isTrusted(X509Certificate[] certificate, String authType) {
                    return true;
                }
            };

            ClientConnectionManager ccm = null;

            try {
                SSLSocketFactory sf = new SSLSocketFactory(acceptingTrustStrategy,
                        SSLSocketFactory.ALLOW_ALL_HOSTNAME_VERIFIER);

                SchemeRegistry registry = new SchemeRegistry();
                registry.register(new Scheme("https", 443, sf));
                ccm = new ThreadSafeClientConnManager(registry);

            } catch (KeyManagementException | UnrecoverableKeyException | NoSuchAlgorithmException | KeyStoreException e1) {
                e1.printStackTrace();
            }
            client = new DefaultHttpClient(ccm);
        }else{
            client = new DefaultHttpClient();
        }

        return client;
    }
}
