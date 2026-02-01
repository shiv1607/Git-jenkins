package com.FestOrg.FestOrg;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class FestOrgApplication {

	public static void main(String[] args) {
		System.out.println("Starting FestOrgApplication...");
		SpringApplication.run(FestOrgApplication.class, args);
		System.out.println("FestOrgApplication started successfully.");
		
	}

}
