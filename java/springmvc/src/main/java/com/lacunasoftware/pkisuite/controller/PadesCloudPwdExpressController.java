package com.lacunasoftware.pkisuite.controller;

import com.lacunasoftware.pkiexpress.*;
import com.lacunasoftware.pkisuite.model.express.PadesServerKeyCompleteModel;
import com.lacunasoftware.pkisuite.model.express.PadesCloudPwdModel;
import com.lacunasoftware.pkisuite.util.StorageMock;
import com.lacunasoftware.pkisuite.util.Util;
import com.lacunasoftware.pkisuite.util.express.PadesVisualElements;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.List;


/**
 * This sample is responsible to perform a flow using password to communicate with PSCs to perform a
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
 *    - protocolVariant (error handling purposes, it depends on the chosen provider)
 *
 * This sample will only show the PSCs that are configured.
 */
@Controller
public class PadesCloudPwdExpressController {

	/**
	 * This action will render a page that request a CPF to the user. This CPF is used to discover
	 * which PSCs have a certificate containing that CPF.
	 */
	@GetMapping("/pades-cloud-pwd-express")
	public ModelAndView get(
		@RequestParam(value="fileId") String fileToSign
	) {
		return new ModelAndView("/pades-cloud-pwd-express/index");
	}

	/**
	 * This action will be called after the user press the button "Search" on index page. It will
	 * search for all PSCs that have a certificate with the provided CPF. In this page, there will be
	 * a form field asking for user current password. In BirdId provider, this password is called
	 * OTP.
	 */
	@PostMapping("/pades-cloud-pwd-express/discover")
	public ModelAndView discover(
		@RequestParam(value="fileId") String fileToSign,
		@RequestParam(value="cpf") String cpf
	) throws IOException {

		// Process cpf, removing all formatting.
		String plainCpf = cpf.replaceAll("[.-]", "");

		// Get an instance of the TrustServiceManager class, responsible for communicating with PSCs
		// and handling the password flow.
		TrustServicesManager manager = new TrustServicesManager();

		// Discover available PSCs.
		List<TrustServiceInfo> services = manager.discoverByCpf(plainCpf);

		// Render complete page.
		PadesCloudPwdModel model = new PadesCloudPwdModel();
		model.setServices(services);
		model.setCpf(cpf);
		return new ModelAndView("/pades-cloud-pwd-express/discover", "model", model);
	}

	/**
	 * This action is called after the form after the user press the button "Sign". This action will
	 * receive the user's CPF and current password.
	 */
	@PostMapping("/pades-cloud-pwd-express/authorize")
	public ModelAndView authorize(
		@RequestParam(value="fileId") String fileToSign,
		@RequestParam(value="cpf") String cpf,
		@RequestParam(value="service") String service,
		@RequestParam(value="password") String password
	) throws IOException {

		// Process cpf, removing all formatting.
		String plainCpf = cpf.replaceAll("[.-]", "");

		// Get an instance of the TrustServiceManager class, responsible for communicating with PSCs
		// and handling the password flow.
		TrustServicesManager manager = new TrustServicesManager();

		// Complete authentication using CPF and current password. The following method has three
		// sessionTypes:
		// - SINGLE_SIGNATURE: The returned token can only be used for one single signature request.
		// - MULTI_SIGNATURE: The returned token can only be used for one multi signature request.
		// - SIGNATURE_SESSION: The return token can only be used for one or more signature requests.
		TrustServiceSessionResult result = manager.passwordAuthorize(service, plainCpf, password, TrustServiceSessionTypes.SIGNATURE_SESSION);

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

		// Set trust session acquired on the following steps of this sample.
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
		return new ModelAndView("pades-cloud-pwd-express/signature-info", "model", model);
	}
}
