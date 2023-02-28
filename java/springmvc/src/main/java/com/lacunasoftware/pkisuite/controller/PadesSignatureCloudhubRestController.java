package com.lacunasoftware.pkisuite.controller;
import com.lacunasoftware.pkisuite.util.StorageMock;
import com.lacunasoftware.pkisuite.util.Util;
import com.lacunasoftware.pkisuite.util.restpki.PadesVisualElements;
import com.lacunasoftware.restpki.PKCertificate;
import com.lacunasoftware.restpki.PadesMeasurementUnits;
import com.lacunasoftware.restpki.PadesSignatureFinisher2;
import com.lacunasoftware.restpki.PadesSignatureStarter2;
import com.lacunasoftware.restpki.RestException;
import com.lacunasoftware.restpki.SignaturePolicy;
import com.lacunasoftware.restpki.SignatureResult;
import com.lacunasoftware.restpki.SignatureStartResult;

import cloudhub.SessionsApi;
import cloudhub.client.*;
import cloudhub.client.model.SessionCreateRequest;
import cloudhub.client.model.SessionModel;
import cloudhub.client.model.SignHashRequest;
import cloudhub.client.model.TrustServiceSessionTypes;

import org.springframework.stereotype.Controller;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.Base64;

@Controller
public class PadesSignatureCloudhubRestController {
	// Redirect URL where it's accessed after OAuth flow is finished.
	private SessionsApi sessionsApi = new SessionsApi(Util.getCloudhubClient());




	// Configure API key authorization: ApiKey

    /**
	 * GET /pades-signature-cloudhub-rest
	 *
	 * This action initiates a PAdES signature using Cloudhub API service
	 * to retrieve the PSCs, which, in turn, will return a certificate.
	 */
	@GetMapping
	@RequestMapping("/pades-signature-cloudhub-rest")
	public ModelAndView get(
		@RequestParam(value = "fileId") String fileToSign
	) throws IOException, RestException {


		// Verify if the fileId exists and get the absolute path of the fileId with the help of our
		// StorageMock class. This sample can only execute if the provided file exists.
		if (!StorageMock.exists(fileToSign)) {
			throw new FileNotFoundException();
		}
		/**
	 	* This action will render a page that request a CPF to the user. This CPF is used to discover
	 	* which PSCs have a certificate containing that CPF.
	 	*/
		return new ModelAndView("/pades-signature-cloudhub-rest/index");
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
	 * @throws ApiException
	 */
	@PostMapping("/pades-signature-cloudhub-rest/discover")
	public ModelAndView discover(
		@RequestParam(value="fileId") String fileToSign,
		@RequestParam(value="cpf") String cpf
	) throws IOException, ApiException {

		// Process cpf, removing all formatting.
		String plainCpf = cpf.replaceAll("[.-]", "");

		String REDIRECT_URL = "http://localhost:60695/pades-signature-cloudhub-rest/complete?fileId=" + fileToSign ;

	    SessionCreateRequest sessionCreateRequest = new SessionCreateRequest();
		sessionCreateRequest.setIdentifier(plainCpf);
    	sessionCreateRequest.setRedirectUri(REDIRECT_URL);
    	sessionCreateRequest.setType(TrustServiceSessionTypes.NUMBER_1);

		// Discover PSCs and receive a URL to redirect the user to perform the OAuth authentication
		// page. As mentioned before, we pass the id of the file to be signed as the last parameter
		// of the following method. The next action will recover this information.

		SessionModel result = sessionsApi.apiSessionsPost(sessionCreateRequest);

		// Render complete page.
		return new ModelAndView("/pades-signature-cloudhub-rest/discover", "model", result);
	}

	/**
	 * This action will complete the authentication process and create a signature using a session
	 * token returned by user. Also, we recover the parameter "customState" containing the id of the
	 * file that will be signed.
	 * @throws ApiException
	 * @throws RestException
	 */
	@GetMapping("/pades-signature-cloudhub-rest/complete")
	public ModelAndView complete(
		@RequestParam(value="fileId") String fileToSign,
		@RequestParam(value="session", required = false) String session,
		Model model
	) throws IOException, ApiException, RestException {

		// Get an instance of the TrustServiceManager class, responsible for communicating with PSCs
		// and handling the OAuth flow.
		byte[] certificate =  sessionsApi.apiSessionsCertificateGet(session);

		// Verify if the provided fileToSign exists.
		if (fileToSign == null || !StorageMock.exists(fileToSign)) {
			throw new FileNotFoundException();
		}

		// Get an instance of the PadesSignatureStarter2 class, responsible for receiving the
		// signature elements and start the signature process.
		PadesSignatureStarter2 signatureStarter = new PadesSignatureStarter2(Util.getRestPkiClient());

		// Set the unit of measurement used to edit the pdf marks and visual representations.
		signatureStarter.setMeasurementUnits(PadesMeasurementUnits.Centimeters);

		String cert = Base64.getEncoder().encodeToString(certificate);

		signatureStarter.setSignerCertificateBase64(cert);

		// Set the signature policy.
		signatureStarter.setSignaturePolicy(SignaturePolicy.PadesBasic);

		// Set the security context to be used to determine trust in the certificate chain. We have
		// encapsulated the security context choice on Util.java.
		signatureStarter.setSecurityContext(Util.getSecurityContext());

		// Create a visual representation for the signature.
		signatureStarter.setVisualRepresentation(PadesVisualElements.getVisualRepresentation());

		// Set the PDF to be signed.
		signatureStarter.setPdfToSign(StorageMock.getDataPath(fileToSign));


		SignatureStartResult signStartResult = signatureStarter.start();
		SignHashRequest signHashRequest = new SignHashRequest();
		signHashRequest.setSession(session);
		signHashRequest.setHash(signStartResult.getToSignHashRaw());
		signHashRequest.setDigestAlgorithmOid(signStartResult.getDigestAlgorithmOid());

		byte[] signHashResponse = sessionsApi.apiSessionsSignHashPost(signHashRequest);

		// Get an instance of the PadesSignatureFinisher2 class, responsible for completing the
		// signature process.
		PadesSignatureFinisher2 signatureFinisher = new PadesSignatureFinisher2(Util.getRestPkiClient());

		// Set the token for this signature (rendered in a hidden input field, see file
		// templates/pades-signature.html).
		signatureFinisher.setToken(signStartResult.getToken());

		// Set the signature
		signatureFinisher.setSignature(signHashResponse);

		// Call the finish() method, which finalizes the signature process and returns a
		// SignatureResult object.
		SignatureResult signatureResult = signatureFinisher.finish();

		// The "certificate" field of the SignatureResult object contains information about the
		// certificate used by the user to sign the file.
		PKCertificate signerCert = signatureResult.getCertificate();

		// At this point, you'd typically store the signed PDF on your database. For demonstration
		// purposes, we'll store the PDF on our StorageMock class.

		// The SignatureResult object has various methods for writing the signature file to a
		// (writeTo()), local file (writeToFile()), open a stream to read the content (openRead())
		// and get its contents (getContent()). For large files, avoid the method getContent() to
		// avoid memory allocation issues.
		String signedPdf;
		try (InputStream resultStream = signatureResult.openRead()) {
			signedPdf = StorageMock.store(resultStream, "pdf");
		}

		// Render the signature page (templates/pades-signature-rest/signature-info.html).
		model.addAttribute("signerCert", signerCert);
		model.addAttribute("signedPdf", signedPdf);
		return new ModelAndView("pades-signature-cloudhub-rest/signature-info");
	}

}
