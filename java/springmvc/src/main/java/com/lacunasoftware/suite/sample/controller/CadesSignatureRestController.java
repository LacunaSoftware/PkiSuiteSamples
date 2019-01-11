package com.lacunasoftware.suite.sample.controller;

import com.lacunasoftware.restpki.*;
import com.lacunasoftware.suite.sample.util.StorageMock;
import com.lacunasoftware.suite.sample.util.Util;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Path;

@Controller
@RequestMapping("/cades-signature-rest")
public class CadesSignatureRestController {

	/**
	 * GET /cades-signature-rest?fileId={fileToSign}
	 * GET /cades-signature-rest?cosign={cmsToCoSign}
	 *
	 * This action initiates a CAdES signature using REST PKI and renders the signature page.
	 */
	@GetMapping
	public String get(
		@RequestParam(value="fileId", required=false) String fileToSign,
		@RequestParam(value="cosign", required=false) String cmsToCoSign,
		Model model,
		HttpServletResponse response
	) throws IOException, RestException {

		// Get an instance of the CadesSignatureStarter2 class, responsible for receiving the
		// signature elements and start the signature process.
		CadesSignatureStarter2 signatureStarter = new CadesSignatureStarter2(Util.getRestPkiClient());

		// Set the signature policy.
		signatureStarter.setSignaturePolicy(SignaturePolicy.PkiBrazilAdrBasica);

		// Set the security context to be used to determine trust in the certificate chain. We have
		// encapsulated the security context choice on Util.java.
		signatureStarter.setSecurityContext(Util.getSecurityContextId());

		// Optionally, set whether the content should be encapsulated in the resulting CMS. If this
		// parameter is omitted or set to null, the following rules apply:
		// - If no CmsToCoSign is given, the resulting CMS will include the content;
		// - If a CmsToCoSign is given, the resulting CMS will include the content if and only if
		//   the CmsToCoSign also includes the content.
		signatureStarter.setEncapsulateContent(true);

		if (!Util.isNullOrEmpty(cmsToCoSign)) {

			// Verify if the CMS file exists and get its absolute path of the CMS file.
			if (!StorageMock.exists(cmsToCoSign)) {
				throw new FileNotFoundException("The provided file was not found. Please verify if the \"cosign\" parameter is correct!");
			}
			Path cmsPath = StorageMock.getDataPath(cmsToCoSign);

			// If the URL argument "cmsfile" is filled, the user has asked to co-sign a previously
			// signed CMS. We'll set the path to the CMS to be co-signed, which was previously
			// saved in our temporary folder by the post() method on this controller. Note two
			// important things:
			//
			//   1. The CMS to be co-signed must be set using the method "setCmsToCoSign", not the
			//      method "setContentToSign" nor "setFileToSign";
			//
			//   2. Since we're creating CMSs with encapsulated content (see call to
			//      setEncapsulateContent() below), we don't need to set the content to be signed,
			//      REST PKI will get the content from the CMS being co-signed.
			signatureStarter.setCmsToCoSign(cmsPath);

		} else {

			// Verify if the fileId exists and get the absolute path of the fileId.
			if (!StorageMock.exists(fileToSign)) {
				throw new FileNotFoundException("The provided file was not found. Please verify if the \"fileId\" parameter is correct!");
			}
			Path filePath = StorageMock.getDataPath(fileToSign);

			// If the URL argument "userfile" is filled, it means the user was redirected here by
			// UploadController (signature with file uploaded by user). We'll set the path of the file
			// to be signed, which was saved in the temporary folder by UploadController (such a file
			// would normally come from your application's database).
			signatureStarter.setFileToSign(filePath);
		}

		// Call the startWithWebPki() method, which initiates the signature. This yields a
		// SignatureStartWithWebPkiResult object containing the signer certificate and the token,
		// a 43-character case-sensitive URL-safe string, which identifies this signature process.
		// We'll use this value to call the signWithRestPki() method on the Web PKI component
		// (see file signature-form.js) and also to complete the signature after the form is
		// submitted (see method complete() below). This should not be mistaken with the API access
		// token.
		SignatureStartWithWebPkiResult result = signatureStarter.startWithWebPki();

		// The token acquired above can only be used for a single signature attempt. In order to
		// retry the signature it is necessary to get a new token. This can be a problem if the user
		// uses the back button of the browser, since the browser might show a cached page that we
		// rendered previously, with a now stale token. To prevent this from happening, we call the
		// method Util.setNoCacheHeaders(), which sets HTTP headers to prevent caching of the page.
		Util.setNoCacheHeaders(response);

		// Render the signature page (templates/cades-signature-rest/index.html.html).
		model.addAttribute("token", result.getToken());
		return "cades-signature-rest/index";
	}

	/**
	 * POST /cades-signature-rest
	 *
	 * This action receives the form submission from the signature page. We'll call REST PKI to
	 * complete the signature.
	 */
	@PostMapping
	public String post(@RequestParam String token, Model model) throws IOException, RestException {

		// Get an instance the CadesSignatureFinisher2 class, responsible for completing the
		// signature process.
		CadesSignatureFinisher2 signatureFinisher = new CadesSignatureFinisher2(Util.getRestPkiClient());

		// Set the token for this signature (rendered in a hidden input field, see file
		// templates/cades-signature.html).
		signatureFinisher.setToken(token);

		// Call the finish() method, which finalizes the signature process and returns a
		// SignatureResult object.
		SignatureResult signatureResult = signatureFinisher.finish();

		// The "certificate" field of the SignatureResult object contains information about the
		// certificate used by the user to sign the file.
		PKCertificate signerCert = signatureResult.getCertificate();

		// At this point, you'd typically store the CMS on your database. For demonstration purposes,
		// we'll store the CMS on our StorageMock class.

		// The SignatureResult object has various methods for writing the signature file to a stream
		// (writeTo()), local file (writeToFile()), open a stream to read the content (openRead())
		// and get its contents (getContent()). For large files, avoid the method GetContent() to
		// avoid memory allocation issues.
		String cmsFile;
		try (InputStream resultStream = signatureResult.openRead()) {
			cmsFile = StorageMock.store(resultStream, "p7s");
		}

		// Render the signature page (templates/cades-signature-rest/signature-info.html).
		model.addAttribute("signerCert", signerCert);
		model.addAttribute("cmsFile", cmsFile);
		return "cades-signature-rest/signature-info";
	}
}
