package com.lacunasoftware.pkisuite.controller;

import com.lacunasoftware.amplia.*;
import com.lacunasoftware.pkisuite.model.amplia.IssueAttributeCertServerModel;
import com.lacunasoftware.pkisuite.util.StorageMock;
import com.lacunasoftware.pkisuite.util.Util;

import java.io.IOException;
import java.util.Date;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;
import org.threeten.bp.Instant;


@Controller
@RequestMapping("/issue-cert-attribute-amplia")
public class IssueCertAttributeAmpliaController{
	@GetMapping
	public ModelAndView get() {
		return new ModelAndView("issue-cert-attribute-amplia/index");
	}
	
	@PostMapping
	public ModelAndView post(IssueAttributeCertServerModel request) throws RestException, IOException {


		AmpliaClient client = Util.getAmpliaClient();

		// Create an instance of the CreateOrderRequest class, which is a generic class, which is
		// typed with a class that inherits the CertificateParameters class. In this sample, we used
		// a PkiBrazilCertificateParameters class.
		CreateOrderRequest<CieCertificateParameters> createOrderRequest = new CreateOrderRequest<>();
		// Set the certificate authority's id. This authority will generate your certificate. You can
		// have a default CAId per application, in that case, there is no need to set this parameter.
 
        
		createOrderRequest.setCAId("d41bfd0b-2326-4917-992e-01879a24e719");
		// Set the certificate validity. We've encapsulated to set 2 years from the now.
		createOrderRequest.setValidityEnd(Util.getDateYearsFromNow(2));
		// Set the kind of certificate.
		createOrderRequest.setKind(CertificateKinds .ATTRIBUTE);
		// Set the certificate parameters class with the desired parameters to your certificate. In
		// this sample, we use the ICP-Brasil model, and informed the following fields:
		// - The subject name of the certificate;
		// - The CPF number;
		// - The phone number, used to confirm the user identity.
		CieCertificateParameters parameters = new CieCertificateParameters();
		parameters.setName(request.getName());
		parameters.setCpf("949494838383");
		parameters.setEEA("kkkk to maluco");
		parameters.setDegree(request.getDegree());
		parameters.setRegistrationNumber(request.getRegistrationNumber());
		parameters.setCourse(request.getCourse());
		CieInstitutionModel institutionModel = new CieInstitutionModel();
		institutionModel.setName("AAA");
		institutionModel.setCity("Brasilia");
		institutionModel.setState("DF");
		parameters.setInstitution(new CieInstitution(institutionModel));
		
		createOrderRequest.setParameters(parameters);

		Order<CieCertificateParameters> order = client.createOrder(createOrderRequest);

		Certificate cert = client.issueCertificate(order.getId(), null);
		
        byte[] result = cert.getContent();

		
	    String certResult = StorageMock.store(result, "ca");
		return new ModelAndView("issue-cert-attribute-amplia/complete", "model", cert);
	}
}
