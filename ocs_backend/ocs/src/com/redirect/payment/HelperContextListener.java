package com.redirect.payment;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

public class HelperContextListener implements ServletContextListener {
	
	private static Configuration configuration;

	@Override
	public void contextInitialized(ServletContextEvent event) {
		
		ServletContext context = event.getServletContext();
		
		String configPath = 
				context.getInitParameter("configFileLocation");
		
		configPath = context.getRealPath(configPath);
		
		System.out.println("OCS configPath " + configPath);
		
		configuration = new Configuration(configPath);
	}
	
	@Override
	public void contextDestroyed(ServletContextEvent arg0) {
	}
	
	public static Configuration getConfiguration() {
		return configuration;
	}
}
