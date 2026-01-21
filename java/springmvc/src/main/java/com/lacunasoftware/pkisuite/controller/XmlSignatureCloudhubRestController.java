package com.lacunasoftware.pkisuite.controller;

import com.lacunasoftware.pkisuite.util.SampleDocs;
import com.lacunasoftware.pkisuite.util.StorageMock;
import com.lacunasoftware.pkisuite.util.Util;
import com.lacunasoftware.restpki.ClientSideSignatureInstructions;
import com.lacunasoftware.restpki.FullXmlSignatureStarter;
import com.lacunasoftware.restpki.PKCertificate;
import com.lacunasoftware.restpki.RestException;
import com.lacunasoftware.restpki.SignaturePolicy;
import com.lacunasoftware.restpki.XmlSignatureFinisher;

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
import java.io.IOException;
import javax.servlet.http.HttpServletResponse;

@Controller
public class XmlSignatureCloudhubRestController {
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
	@RequestMapping("/xml-signature-cloudhub-rest")
	public ModelAndView get(
			HttpServletResponse response) throws IOException, RestException {

		/**
		 * This action will render a page that request a CPF to the user. This CPF is
		 * used to discover
		 * which PSCs have a certificate containing that CPF.
		 */
		return new ModelAndView("/xml-signature-cloudhub-rest/index");
	}

	/**
	 * This action will be called after the user press the button "Search" on index
	 * page. It will
	 * search for all PSCs that have a certificate with the provided CPF. Thus, it
	 * will start the
	 * authentication process and return a URL to redirect the user to perform the
	 * authentication.
	 *
	 * After this action the user will be redirected, and to store the local data
	 * (fileId) to be user
	 * after the user returns to your application. We use the parameter
	 * "customState", the last
	 * parameter of the method discoverByCpfAndStartAuth(). This parameter will be
	 * recovered in the
	 * next action.
	 * 
	 * @throws ApiException
	 */
	@PostMapping("/xml-signature-cloudhub-rest/discover")
	public ModelAndView discover(
			@RequestParam(value = "cpf") String cpf) throws IOException, ApiException {

		// Process cpf, removing all formatting.
		String plainCpf = cpf.replaceAll("[.-]", "");

		String REDIRECT_URL = "http://localhost:60695/xml-signature-cloudhub-rest/complete";

		SessionCreateRequest sessionCreateRequest = new SessionCreateRequest();
		sessionCreateRequest.setIdentifier(plainCpf);
		sessionCreateRequest.setRedirectUri(REDIRECT_URL);
		sessionCreateRequest.setType(TrustServiceSessionTypes.SINGLE_SIGNATURE);

		// Discover PSCs and receive a URL to redirect the user to perform the OAuth
		// authentication
		// page. As mentioned before, we pass the id of the file to be signed as the
		// last parameter
		// of the following method. The next action will recover this information.

		SessionModel result = sessionsApi.apiSessionsPost(sessionCreateRequest);

		// Render complete page.
		return new ModelAndView("/xml-signature-cloudhub-rest/discover", "model", result);
	}

	/**
	 * This action will complete the authentication process and create a signature
	 * using a session
	 * token returned by user. Also, we recover the parameter "customState"
	 * containing the id of the
	 * file that will be signed.
	 * 
	 * @throws ApiException
	 * @throws RestException
	 */
	@GetMapping("/xml-signature-cloudhub-rest/complete")
	public String complete(
			@RequestParam(value = "session", required = false) String session,
			Model model) throws IOException, ApiException, RestException {

		// Get an instance of the TrustServiceManager class, responsible for
		// communicating with PSCs
		// and handling the OAuth flow.
		byte[] certificate = sessionsApi.apiSessionsCertificateGet(session);

		// Get an instance of the PadesSignatureStarter2 class, responsible for
		// receiving the
		// signature elements and start the signature process.
		FullXmlSignatureStarter signatureStarter = new FullXmlSignatureStarter(Util.getRestPkiClient());

		// Set the unit of measurement used to edit the pdf marks and visual
		// representations.

		

		// Set certificate obtained from the cloud provider
		signatureStarter.setSignerCertificate(new String(certificate).replaceAll("\"", ""));

		// Set the signature policy.
		signatureStarter.setSignaturePolicy(SignaturePolicy.XadesBasic);

		// Set the security context to be used to determine trust in the certificate
		// chain. We have
		// encapsulated the security context choice on Util.java.
		signatureStarter.setSecurityContext(Util.getSecurityContext());

		// Set the PDF to be signed.
		signatureStarter.setXml(StorageMock.getSampleDocPath(SampleDocs.SAMPLE_XML));

		ClientSideSignatureInstructions signStartResult = signatureStarter.start();
		SignHashRequest signHashRequest = new SignHashRequest();
		signHashRequest.setSession(session);
		signHashRequest.setHash(signStartResult.getToSignHashRaw());
		signHashRequest.setDigestAlgorithmOid(signStartResult.getDigestAlgorithmOid());

		byte[] signHashResponse = sessionsApi.apiSessionsSignHashPost(signHashRequest);

		// Get an instance of the PadesSignatureFinisher2 class, responsible for
		// completing the
		// signature process.
		XmlSignatureFinisher signatureFinisher = new XmlSignatureFinisher(Util.getRestPkiClient());

		// Set the token for this signature (rendered in a hidden input field, see file
		// templates/pades-signature.html).
		signatureFinisher.setToken(signStartResult.getToken());

		// Set the signature
		signatureFinisher.setSignature(new String(signHashResponse).replaceAll("\"", ""));

		// Call the finish() method, which finalizes the signature process and returns a
		// SignatureResult object.
		byte[] signedXml = signatureFinisher.finish();

		// The "certificate" field of the SignatureResult object contains information
		// about the
		// certificate used by the user to sign the file.
		PKCertificate signerCert = signatureFinisher.getCertificateInfo();

		String filename = StorageMock.store(signedXml, "xml");

		// At this point, you'd typically store the signed PDF on your database. For
		// demonstration
		// purposes, we'll store the PDF on our StorageMock class.

		// The SignatureResult object has various methods for writing the signature file
		// to a
		// (writeTo()), local file (writeToFile()), open a stream to read the content
		// (openRead())
		// and get its contents (getContent()). For large files, avoid the method
		// getContent() to
		// avoid memory allocation issues.

		// Render the signature page
		// (templates/pades-signature-rest/signature-info.html).
		model.addAttribute("signerCert", signerCert);
		model.addAttribute("signedFile", filename);
		return "xml-signature-cloudhub-rest/signature-info";
	}

}
