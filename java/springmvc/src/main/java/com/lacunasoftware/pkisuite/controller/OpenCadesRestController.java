package com.lacunasoftware.pkisuite.controller;


import com.lacunasoftware.pkisuite.util.StorageMock;
import com.lacunasoftware.pkisuite.util.Util;
import com.lacunasoftware.restpki.CadesSignature;
import com.lacunasoftware.restpki.CadesSignatureExplorer2;
import com.lacunasoftware.restpki.CadesSignatureWithEncapsulatedContent;
import com.lacunasoftware.restpki.RestException;
import com.lacunasoftware.restpki.SignaturePolicy;
import com.lacunasoftware.restpki.SignaturePolicyCatalog;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import java.io.FileNotFoundException;
import java.io.IOException;


@Controller
public class OpenCadesRestController {

	/**
	 * This action submits a CAdES signature file (.p7s) to Rest PKI for inspection of its
	 * signatures.
	 */
	@RequestMapping(value = "/open-cades-rest", method = {RequestMethod.GET})
	public String get(
			@RequestParam(value = "fileId") String signatureFile,
			Model model
	) throws IOException, RestException {

		// Verify if the fileId exists and get the absolute path of the fileId with the help of our
		// StorageMock class. This sample can only execute if the provided file exists.
		if (!StorageMock.exists(signatureFile)) {
			throw new FileNotFoundException();
		}

		// Get an instance of the CadesSignatureExplorer2 class, used to open/validate CAdES
		// signatures.
		CadesSignatureExplorer2 sigExplorer = new CadesSignatureExplorer2(Util.getRestPkiClient());

		// Specify that we want to validate the signatures in the file, not only inspect them.
		sigExplorer.setValidate(true);

		// Set the CAdES signature file.
		sigExplorer.setSignatureFile(StorageMock.getDataPath(signatureFile));

		// This sample opens only signatures that encapsulate the signed file ("attached"). To open a
		// detached signature, also set the signed file with sigExplorer.setDataFile(...): Rest PKI
		// needs its digest to validate the signature.

		// Specify the parameters for the signature validation:
		// - A signature with an explicit signature policy must follow one of the ICP-Brasil CAdES
		//   policies (AD-RB, AD-RT, ...), with full compliance.
		sigExplorer.setAcceptableExplicitPolicies(SignaturePolicyCatalog.getPkiBrazilCades());
		// - A signature without an explicit policy is validated as a plain CAdES-BES signature.
		sigExplorer.setDefaultSignaturePolicy(SignaturePolicy.CadesBes);

		// Specify the security context to be used to determine trust in the certificate chain. We
		// have encapsulated the security context choice on Util.java.
		sigExplorer.setSecurityContext(Util.getSecurityContext());

		// Call the openAndExtractContent() method, which returns the signature file's information
		// and its encapsulated content, if any.
		CadesSignatureWithEncapsulatedContent result = sigExplorer.openAndExtractContent();
		CadesSignature signature = result.getSignature();

		// If the signature encapsulates the signed file (an "attached" signature), store it so the
		// user can download it.
		// WARNING: this sample assumes that the encapsulated content is a PDF, so the stored file
		// gets the .pdf extension.
		String outputFile = null;
		if (signature.isHasEncapsulatedContent()) {
			outputFile = StorageMock.generateFileId("pdf");
			result.getEncapsulatedContent().writeToFile(StorageMock.getDataPath(outputFile));
		}

		// Render the information (see file resources/templates/open-cades-rest/index.html for more
		// information on the information returned).
		model.addAttribute("signature", signature);
		model.addAttribute("outputFile", outputFile);
		return "open-cades-rest/index";
	}
}
