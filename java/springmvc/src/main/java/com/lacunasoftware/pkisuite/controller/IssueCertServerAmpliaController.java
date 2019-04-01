package com.lacunasoftware.pkisuite.controller;


import com.lacunasoftware.amplia.*;
import com.lacunasoftware.pkiexpress.*;
import com.lacunasoftware.pkisuite.config.ApplicationProperties;
import com.lacunasoftware.pkisuite.model.amplia.IssueCertServerModel;
import com.lacunasoftware.pkisuite.model.amplia.IssueCertServerCompleteModel;
import com.lacunasoftware.pkisuite.util.StorageMock;
import com.lacunasoftware.pkisuite.util.Util;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import java.io.IOException;


@Controller
@RequestMapping("/issue-cert-server-amplia")
public class IssueCertServerAmpliaController {

	/**
	 * GET /issue-cert-server-amplia
	 *
	 * Renders the page with a form that will be filled in order to get the information needed to
	 * generate a certificate.
	 */
	@GetMapping
	public ModelAndView get() {
		return new ModelAndView("issue-cert-server-amplia/index");
	}

	/**
	 * POST /issue-cert-server-amplia
	 *
	 * Receives the form parameters to be used to created an order to generate a certificate at
	 * Amplia. After that, we render a success page showing options to use the certificate.
	 */
	@PostMapping
	public ModelAndView complete(IssueCertServerModel request) throws RestException, IOException {

		// Get an instance of the AmpliaClient, responsible to connect with Amplia and perform the
		// requests.
		AmpliaClient client = Util.getAmpliaClient();

		// Create an instance of the CreateOrderRequest class, which is a generic class, which is
		// typed with a class that inherits the CertificateParameters class. In this sample, we used
		// a PkiBrazilCertificateParameters class.
		CreateOrderRequest<PkiBrazilCertificateParameters> createOrderRequest = new CreateOrderRequest<>();
		// Set the certificate authority's id. This authority will generate your certificate. You can
		// have a default CAId per application, in that case, there is no need to set this parameter.
		createOrderRequest.setCAId(ApplicationProperties.getInstance().getAmplia().getCaId());
		// Set the certificate validity. We've encapsulated to set 2 years from the now.
		createOrderRequest.setValidityEnd(Util.getDateYearsFromNow(2));
		// Set the kind of certificate.
		createOrderRequest.setKind(CertificateKinds.PUBLIC_KEY);
		// Set the certificate parameters class with the desired parameters to your certificate. In
		// this sample, we use the ICP-Brasil model, and informed the following fields:
		// - The subject name of the certificate;
		// - The CPF number.
		PkiBrazilCertificateParameters parameters = new PkiBrazilCertificateParameters();
		parameters.setName(request.getSubjectName());
		parameters.setCpf(request.getCpf());
		createOrderRequest.setParameters(parameters);

		// Call Amplia to create an order.
		Order order = client.createOrder(createOrderRequest);

		// Get an instance of the KeyGenerator class, responsible for generating a private key and the
		// corresponding CSR.
		KeyGenerator keyGenerator = new KeyGenerator();

		// Set key size as 2048 (Available size: 1024, 2048, and 4096).
		keyGenerator.setKeySize(2048);
		keyGenerator.setKeyFormat(KeyFormats.JSON);
		// Set the option to generate the CSR value.
		keyGenerator.setGenCsr(true);

		// Generate private key and CSR.
		KeyGenerationResult genKey = keyGenerator.generate();

		// Call Amplia in order to issue the certificate referred by the created order's id and
		// passing the generated CSR.
		Certificate cert = client.issueCertificate(order.getId(), genKey.getCsr());

		// Store the key encrypted using a local key.
		// WARNING: It is highly RECOMMENDED to ENCRYPT the key before storing in your database.
		StorageMock.storeKey(genKey.getKey().getBytes(), ".json", cert.getId());

		// Store certificate.
		StorageMock.storeKey(cert.getContent(), ".cer", cert.getId());

		// Render complete page. We pass the certificate's id responsible for locate the key and
		// certificate files.
		IssueCertServerCompleteModel response = new IssueCertServerCompleteModel();
		response.setCertificate(cert);
		return new ModelAndView("issue-cert-server-amplia/complete", "model", response);
	}
}
