package com.lacunasoftware.pkisuite.controller;


import com.lacunasoftware.pkisuite.util.StorageMock;
import com.lacunasoftware.pkisuite.util.Util;
import com.lacunasoftware.restpki.*;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.FileNotFoundException;
import java.io.IOException;


@Controller
public class CheckPadesRestController {

	/**
	 * This action submits a PDF file to Rest PKI for inspection of its signatures.
	 */
	@RequestMapping(value = {"/cpr", "/check-pades-rest"}, method = {RequestMethod.GET})
	public String get(
		@RequestParam(value = "c") String code,
		HttpSession session,
		HttpServletResponse servletResponse,
		Model model
	) throws IOException, RestException, InterruptedException {

		// On PrinterFriendlyPadesRestController, we stored the unformatted version of the
		// verification code (without hyphens) but used the formatted version (with hyphens) on the
		// printer-friendly PDF. Now, we remove the hyphens before looking it up.
		String verificationCode = AlphaCode.parse(code);

		// Get the document associated with the verification code.
		String fileId = StorageMock.lookupVerificationCode(session, verificationCode);
		if (fileId == null) {
			// Invalid code given!
			// Small delay to slow down brute-force attacks (if you want to be extra careful you might
			// want to add a CAPTCHA to the process).
			Thread.sleep(2000);
			// Return Not Found
			servletResponse.setStatus(404);
			return null;
		}

		// Get an instance the PadesSignatureExplorer2 class, used to open/validate PDF signatures.
		PadesSignatureExplorer2 sigExplorer = new PadesSignatureExplorer2(Util.getRestPkiClient());

		// Specify that we want to validate the signatures in the file, not only inspect them.
		sigExplorer.setValidate(true);

		// Set the PDF file.
		sigExplorer.setSignatureFile(StorageMock.getDataPath(fileId));

		// Specify the parameters for the signature validation:
		// Accept any PAdES signature as long as the signer has an ICP-Brasil certificate.
		sigExplorer.setDefaultSignaturePolicy(SignaturePolicy.PadesBasic);
		// Specify the security context to be used to determine trust in the certificate chain. We
		// have encapsulated the security context on Util.java.
		sigExplorer.setSecurityContext(Util.getSecurityContextId());

		// Call the open() method, which returns the signature file's information.
		PadesSignature signature = sigExplorer.open();

		// Render the information (see file resources/templates/open-pades-signature.html for more
		// information on the information returned).
		model.addAttribute("signature", signature);
		return "check-pades-rest/index";
	}
}
