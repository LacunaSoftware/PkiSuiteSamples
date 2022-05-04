package com.lacunasoftware.pkisuite.controller;


import com.lacunasoftware.pkisuite.util.StorageMock;
import com.lacunasoftware.pkisuite.util.Util;
import com.lacunasoftware.restpki.PadesSignature;
import com.lacunasoftware.restpki.PadesSignatureExplorer2;
import com.lacunasoftware.restpki.RestException;
import com.lacunasoftware.restpki.SignaturePolicy;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import java.io.FileNotFoundException;
import java.io.IOException;


@Controller
public class OpenPadesRestController {

	/**
	 * This action submits a PDF file to Rest PKI for inspection of its signatures.
	 */
	@RequestMapping(value = "/open-pades-rest", method = {RequestMethod.GET})
	public String get(
			@RequestParam(value = "fileId") String signatureFile,
			Model model
	) throws IOException, RestException {

		// Verify if the fileId exists and get the absolute path of the fileId with the help of our
		// StorageMock class. This sample can only execute if the provided file exists.
		if (!StorageMock.exists(signatureFile)) {
			throw new FileNotFoundException();
		}

		// Get an instance the PadesSignatureExplorer2 class, used to open/validate PDF signatures.
		PadesSignatureExplorer2 sigExplorer = new PadesSignatureExplorer2(Util.getRestPkiClient());

		// Specify that we want to validate the signatures in the file, not only inspect them.
		sigExplorer.setValidate(true);

		// Set the PDF file.
		sigExplorer.setSignatureFile(StorageMock.getDataPath(signatureFile));

		// Specify the parameters for the signature validation:
		// Accept any PAdES signature as long as the signer has an ICP-Brasil certificate.
		sigExplorer.setDefaultSignaturePolicy(SignaturePolicy.PadesBasic);

		// Specify the security context to be used to determine trust in the certificate chain. We
		// have encapsulated the security context on Util.java.
		sigExplorer.setSecurityContext(Util.getSecurityContext());

		// Call the open() method, which returns the signature file's information.
		PadesSignature signature = sigExplorer.open();

		// Render the information (see file resources/templates/open-pades-signature.html for more
		// information on the information returned).
		model.addAttribute("signature", signature);
		return "open-pades-rest/index";
	}
}
