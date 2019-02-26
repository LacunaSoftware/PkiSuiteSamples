package com.lacunasoftware.pkisuite.controller;


import com.lacunasoftware.amplia.*;
import com.lacunasoftware.pkisuite.config.ApplicationProperties;
import com.lacunasoftware.pkisuite.model.amplia.IssueCertUserModel;
import com.lacunasoftware.pkisuite.model.amplia.IssueCertUserRedirectModel;
import com.lacunasoftware.pkisuite.util.Util;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;


@Controller
@RequestMapping("/issue-cert-user-amplia")
public class IssueCertUserAmpliaController {

	/**
	 * The return URL, used to redirect the user after the certificate is generated. We will redirect
	 * to /complete route.
	 */
	private final String returnUrl = "http://localhost:60695/issue-cert-user-amplia/complete";

	/**
	 * GET /issue-cert-user-amplia
	 *
	 * Renders the page with a form that will be filled in order to get the information needed to
	 * generate a certificate.
	 */
	@GetMapping
	public ModelAndView get() {
		return new ModelAndView("issue-cert-user-amplia/index");
	}

	/**
	 * POST /issue-cert-user-amplia
	 *
	 * Receives the form parameters to be used to created an order to generate a certificate at
	 * Amplia. After that, we get an issue link that we will redirect user to.
	 */
	@PostMapping
	public ModelAndView post(IssueCertUserModel request, Model model) throws RestException {

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
		createOrderRequest.setKind(CertificateKinds .PUBLIC_KEY);
		// Set the certificate parameters class with the desired parameters to your certificate. In
		// this sample, we use the ICP-Brasil model, and informed the following fields:
		// - The subject name of the certificate;
		// - The CPF number;
		// - The phone number, used to confirm the user identity.
		PkiBrazilCertificateParameters parameters = new PkiBrazilCertificateParameters();
		parameters.setName(request.getSubjectName());
		parameters.setCpf(request.getCpf());
		parameters.setPhoneNumber(request.getPhoneNumber());
		createOrderRequest.setParameters(parameters);

		// Call Amplia to create an order.
		Order<PkiBrazilCertificateParameters> order = client.createOrder(createOrderRequest);

		// After the order is create, get a redirect link to a remote page to issue the certificate.
		// We pass a return URL, to redirect the user after the certificate is issued.
		String redirectLink = client.getOrderIssueLink(order.getId(), returnUrl);

		// Render redirect page to show a message to the user, that he will be redirect to Amplia to
		// issue his certificate.
		IssueCertUserRedirectModel response = new IssueCertUserRedirectModel();
		response.setRedirectLink(redirectLink);
		return new ModelAndView("issue-cert-user-amplia/redirect", "model", response);
	}

	/**
	 * GET /issue-cert-user-amplia/complete
	 *
	 * Renders the success page after the certificate is issued. This action will be used by amplia
	 * and the route to it is passed on getOrderIssueLink() method.
	 */
	@GetMapping("/complete")
	public ModelAndView complete() {
		return new ModelAndView("issue-cert-user-amplia/complete");
	}
}
