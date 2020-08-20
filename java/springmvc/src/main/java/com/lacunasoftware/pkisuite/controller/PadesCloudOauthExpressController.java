package com.lacunasoftware.pkisuite.controller;

import com.lacunasoftware.pkiexpress.*;
import com.lacunasoftware.pkisuite.model.express.PadesCloudOauthModel;
import com.lacunasoftware.pkisuite.model.express.PadesServerKeyCompleteModel;
import com.lacunasoftware.pkisuite.model.express.PadesCloudPwdModel;
import com.lacunasoftware.pkisuite.util.StorageMock;
import com.lacunasoftware.pkisuite.util.Util;
import com.lacunasoftware.pkisuite.util.express.PadesVisualElements;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.List;


/**
 * This sample is responsible to perform a OAuth flow to communicate with PSCs to perform a
 * signature. To perform this sample it's necessary to configure PKI Express with the credentials of
 * the services by executing the following sample:
 *
 *    pkie config --set trustServices:<provider>:<configuration>
 *
 * All standard providers:
 *    - BirdId
 *    - ViDaaS
 *    - NeoId
 *    - RemoteId
 *    - SafeId
 * It's possible to create a custom provider if necessary.
 *
 * All configuration available:
 *    - clientId
 *    - clientSecret
 *    - endpoint
 *    - provider
 *    - badgeUrl
 *    - protocolVariant (error handling, normally it depends on the used provider)
 *
 * This sample will only show the PSCs that are configured.
 */
@Controller
public class PadesCloudOauthExpressController {

	// Redirect URL where it's accessed after OAuth flow is finished.
	private final String REDIRECT_URL = "http://localhost:60695/pades-cloud-oauth-express/complete";

	/**
	 * This action will render a page that request a CPF to the user. This CPF is used to discover
	 * which PSCs have a certificate containing that CPF.
	 */
	@GetMapping("/pades-cloud-oauth-express")
	public ModelAndView get(
		@RequestParam(value="fileId") String fileToSign
	) {
		return new ModelAndView("/pades-cloud-oauth-express/index");
	}

	/**
	 * This action will be called after the user press the button "Search" on index page. It will
	 * search for all PSCs that have a certificate with the provided CPF. Thus, it will start the
	 * authentication process and return a URL to redirect the user to perform the authentication.
	 *
	 * After this action the user will be redirected, and to store the local data (fileId) to be user
	 * after the user returns to your application. We use the parameter "customState", the last
	 * parameter of the method discoverByCpfAndStartAuth(). This parameter will be recovered in the
	 * next action.
	 */
	@PostMapping("/pades-cloud-oauth-express/discover")
	public ModelAndView discover(
		@RequestParam(value="fileId") String fileToSign,
		@RequestParam(value="cpf") String cpf
	) throws IOException {

		// Process cpf, removing all formatting.
		String plainCpf = cpf.replaceAll("[.-]", "");

		// Get an instance of the TrustServiceManager class, responsible for communicating with PSCs
		// and handling the OAuth flow.
		TrustServicesManager manager = new TrustServicesManager();

		// Discover PSCs and receive a URL to redirect the user to perform the OAuth authentication
		// page. As mentioned before, we pass the id of the file to be signed as the last parameter
		// of the following method. The next action will recover this information.
		List<TrustServiceAuthParameters> services = manager.discoverByCpfAndStartAuth(plainCpf, REDIRECT_URL, TrustServiceSessionTypes.SIGNATURE_SESSION, fileToSign);

		// Render complete page.
		PadesCloudOauthModel model = new PadesCloudOauthModel();
		model.setServices(services);
		model.setCpf(cpf);
		return new ModelAndView("/pades-cloud-oauth-express/discover", "model", model);
	}

	/**
	 * This action will complete the authentication process and create a signature using a session
	 * token returned by user. Also, we recover the parameter "customState" containing the id of the
	 * file that will be signed.
	 */
	@GetMapping("/pades-cloud-oauth-express/complete")
	public ModelAndView authorize(
		@RequestParam(value="code", required = false) String authorizationCode,
		@RequestParam(value="state", required = false) String state
	) throws IOException {

		// Get an instance of the TrustServiceManager class, responsible for communicating with PSCs
		// and handling the OAuth flow.
		TrustServicesManager manager = new TrustServicesManager();

		// Complete the authentication process, recovering the session info to be used on the
		// signature and the custom state (fileId).
		TrustServiceSessionResult result = manager.completeAuth(authorizationCode, state);

		// Recover file to be signed on custom state parameter.
		String fileToSign = result.getCustomState();

		// Verify if the provided fileToSign exists.
		if (fileToSign == null || !StorageMock.exists(fileToSign)) {
			throw new FileNotFoundException();
		}

		// Get an instance of the PadesSigner class, responsible for receiving the signature elements
		// and performing the local signature.
		PadesSigner signer = new PadesSigner();

		// Set PKI default options (see Util.java).
		Util.setPkiDefaults(signer);

		// Set signature policy.
		signer.setSignaturePolicy(StandardSignaturePolicies.PadesBasicWithLTV);

		// Set PDF to be signed.
		signer.setPdfToSign(StorageMock.getDataPath(fileToSign));

		// Set trust session acquired on the previous steps of this sample.
		signer.setTrustServiceSession(result.getSession());

		// Set visual representation. We provide a Java class that represents the visual
		// representation.
		signer.setVisualRepresentation(PadesVisualElements.getVisualRepresentation());

		// Generate path for output file and add to signature finisher.
		String outputFile = StorageMock.generateFileId(".pdf");
		signer.setOutputFile(StorageMock.getDataPath(outputFile));

		// Perform the signature.
		signer.sign();

		// If you want to delete the temporary files created by this step, use the method dispose().
		// This method MUST be called after the complete() method, because it deletes some files
		// needed by the method.
		signer.dispose();

		// Render complete page.
		PadesServerKeyCompleteModel model = new PadesServerKeyCompleteModel();
		model.setSignedPdf(outputFile);
		return new ModelAndView("pades-cloud-oauth-express/signature-info", "model", model);
	}
}
