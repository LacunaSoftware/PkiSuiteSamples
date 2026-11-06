package com.lacunasoftware.pkisuite.controller;

import com.lacunasoftware.pkiexpress.*;
import com.lacunasoftware.pkisuite.model.express.AuthenticationCloudExpressModel;
import com.lacunasoftware.pkisuite.util.Util;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import java.io.IOException;
import java.util.List;

/**
 * This sample is responsible for performing an OAuth flow to communicate with PSCs to perform an
 * authentication. To run this sample it's necessary to configure PKI Express with the credentials
 * of the services by executing the following command:
 *
 * pkie config --set trustServices:<provider>:<configuration>
 *
 * All standard providers:
 * - BirdId
 * - ViDaaS
 * - NeoId
 * - RemoteId
 * - SafeId
 * It's possible to create a custom provider if necessary.
 *
 * All available configuration keys:
 * - clientId
 * - clientSecret
 * - endpoint
 * - provider
 * - badgeUrl
 * - protocolVariant (error handling, normally it depends on the used provider)
 *
 * This sample will only show the PSCs that are configured.
 * In order to add a TSP (PSC), use the REDIRECT_URL of the following example as redirect URL for your
 * preferred TSP in https://demos.lacunasoftware.com/pt/tsp-app-registration. 
 */
@Controller
public class AuthenticationCloudExpressController {

	// Redirect URL where it's accessed after OAuth flow is finished.
	private final String REDIRECT_URL = "http://localhost:60695/authentication-cloud-express/complete";

	/**
	 * This action will render a page that requests a CPF from the user. This CPF is used to discover
	 * which PSCs have a certificate containing that CPF.
	 */
	@GetMapping("/authentication-cloud-express")
	public ModelAndView get() {
		return new ModelAndView("/authentication-cloud-express/index");
	}

	/**
	 * This action will be called after the user presses the button "Search" on the index page. It
	 * will search for all PSCs that have a certificate with the provided CPF. Thus, it will start the
	 * authentication process and return a URL to redirect the user to perform the authentication.
	 *
	 * After this action the user will be redirected. To store the local data (the nonce) to be used
	 * after the user returns to your application, we use the parameter "customState", the last
	 * parameter of the method discoverByCpfAndStartAuth(). This parameter will be recovered in the
	 * next action.
	 */
	@PostMapping("/authentication-cloud-express/discover")
	public ModelAndView discover(@RequestParam(value = "cpf") String cpf) throws IOException {
		// Get an instance of the Authentication class, responsible for contacting PKI Express to
		// start and complete the authentication operation.
		Authentication auth = new Authentication();

		// Set PKI default options. (see Util.java)
		Util.setPkiDefaults(auth);

		// Start the authentication. Receive as response an AuthStartResult instance containing the
		// following fields:
		// - nonce: The nonce to be signed. This value is also used on "complete" action;
		// - digestAlgorithm: The digest algorithm that will inform the Web PKI component to compute
		// the signature.
		AuthStartResult result = auth.start();

		// Process cpf, removing all formatting.
		String plainCpf = cpf.replaceAll("[.-]", "");

		// Get an instance of the TrustServicesManager class, responsible for communicating with PSCs
		// and handling the OAuth flow.
		TrustServicesManager manager = new TrustServicesManager();

		// Discover PSCs and receive a URL to redirect the user to perform the OAuth authentication
		// page. As mentioned before, we pass the nonce as the last parameter of the following
		// method. The next action will recover this information.
		List<TrustServiceAuthParameters> services = manager.discoverByCpfAndStartAuth(plainCpf, REDIRECT_URL,
				TrustServiceSessionTypes.SIGNATURE_SESSION, result.getNonce());

		// Render the discover page.
		AuthenticationCloudExpressModel model = new AuthenticationCloudExpressModel();
		model.setServices(services);
		model.setCpf(cpf);

		return new ModelAndView("/authentication-cloud-express/discover", "model", model);
	}

	@GetMapping("/authentication-cloud-express/complete")
	public String complete(
			@RequestParam(value = "code", required = false) String authorizationCode,
			@RequestParam(value = "state", required = false) String state,
			Model model) throws IOException {

		TrustServicesManager manager = new TrustServicesManager();

		// Complete the authentication process, recovering the session info to be used on the
		// signature and the custom state (the nonce).
		TrustServiceSessionResult trssResult = manager.completeAuth(authorizationCode, state);
		// get the signature session given by the cloud provider
		String session = trssResult.getSession();
		// retrieve the nonce stored in the custom state
		String nonce = trssResult.getCustomState();

		// Get the certificate using the same session
		CertificateExplorer certificateExplorer = new CertificateExplorer();
		certificateExplorer.setTrustServiceSession(session);
		certificateExplorer.setFillContent(true);
		CertificateExplorerResult certResult = certificateExplorer.open();
		byte[] certContent = certResult.getCertificate().getContent();

		// Perform a signature using PKI Express on the nonce field
		DataSigner dataSigner = new DataSigner();
		dataSigner.setTrustServiceSession(session);
		dataSigner.setToSignData(nonce);
		byte[] signature = dataSigner.sign();

		// Get an instance of the Authentication class, responsible for contacting PKI Express to
		// start and complete the authentication operation.
		Authentication auth = new Authentication();
		auth.setNonce(nonce);
		auth.setCertificate(certContent);
		auth.setSignature(signature);

		// Complete the authentication. Receive as response an AuthCompleteResult instance containing
		// the following fields:
		// - The certificate information;
		// - The validation results;
		AuthCompleteResult result = auth.complete();

		// Check the authentication result.
		ValidationResults vr = result.getValidationResults();
		if (!vr.isValid()) {

			// If the authentication was not successful, we render a page showing what went wrong.

			// The toString() method of the ValidationResults object can be used to obtain
			// the
			// checks performed, but the string contains tabs and new line characters for
			// formatting, which we'll convert to <br>'s and &nbsp;'s.
			String vrHtml = vr.toString()
					.replaceAll("\n", "<br>")
					.replaceAll("\t", "&nbsp;&nbsp;&nbsp;&nbsp;");
			model.addAttribute("vrHtml", vrHtml);

			// Render the authentication failed page
			// (templates/authentication-cloud-express/failed.html)
			return "authentication-cloud-express/failed";
		}

		// At this point, you have assurance that the certificate is valid. Now, you'd
		// typically
		// query your database for a user that matches one of the certificate's fields,
		// such as
		// userCert.getEmailAddress() or userCert.getPkiBrazil().getCpf() (the actual
		// field to be
		// used as key depends on your application's business logic) and set the user as
		// authenticated with whatever web security framework your application uses. For
		// demonstration purposes, we'll just render the user's certificate information.
		model.addAttribute("userCert", result.getCertificate());

		// Render the authentication succeeded page
		// (templates/authentication-cloud-express/success.html)
		return "authentication-cloud-express/success";

	}
}