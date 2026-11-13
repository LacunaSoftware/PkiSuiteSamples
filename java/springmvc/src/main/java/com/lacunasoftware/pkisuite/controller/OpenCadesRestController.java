package com.lacunasoftware.pkisuite.controller;


import com.lacunasoftware.pkisuite.util.StorageMock;
import com.lacunasoftware.pkisuite.util.Util;
import com.lacunasoftware.restpki.CadesSignature;
import com.lacunasoftware.restpki.CadesSignatureExplorer2;
import com.lacunasoftware.restpki.CadesSignatureWithEncapsulatedContent;
import com.lacunasoftware.restpki.ErrorCodes;
import com.lacunasoftware.restpki.RestException;
import com.lacunasoftware.restpki.RestPkiException;
import com.lacunasoftware.restpki.SignaturePolicy;
import com.lacunasoftware.restpki.SignaturePolicyCatalog;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.io.IOException;


@Controller
public class OpenCadesRestController {

	/**
	 * GET /open-cades-rest?fileId={fileId}[&dataFile={dataFile}]
	 *
	 * This action submits a CAdES signature file (.p7s) to Rest PKI for inspection of its
	 * signatures. If the signature is detached (it does not encapsulate the signed file), Rest PKI
	 * also needs the signed file: in that case, this action renders a page that asks the user for
	 * it, and the post() action below sends the user back here with the "dataFile" argument.
	 */
	@RequestMapping(value = "/open-cades-rest", method = {RequestMethod.GET})
	public String get(
			@RequestParam(value = "fileId") String signatureFile,
			@RequestParam(value = "dataFile", required = false) String dataFile,
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

		// If the user has uploaded the signed file of a detached signature, set it as the data file.
		// The client computes the file's digests locally and sends only them to Rest PKI, which
		// checks them against the signature.
		if (!Util.isNullOrEmpty(dataFile)) {
			if (!StorageMock.exists(dataFile)) {
				throw new FileNotFoundException();
			}
			sigExplorer.setDataFile(StorageMock.getDataPath(dataFile));
		}

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
		CadesSignatureWithEncapsulatedContent result;
		try {
			result = sigExplorer.openAndExtractContent();
		} catch (RestPkiException ex) {
			// Rest PKI answers with the MissingDataHash error code when the signature is detached
			// and no data file was given. Render a page that asks the user for the signed file (see
			// file resources/templates/open-cades-rest/data-file.html).
			if (ex.getErrorCode() == ErrorCodes.MissingDataHash) {
				model.addAttribute("fileId", signatureFile);
				return "open-cades-rest/data-file";
			}
			throw ex;
		}
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
		model.addAttribute("dataFile", dataFile);
		return "open-cades-rest/index";
	}

	/**
	 * POST /open-cades-rest
	 *
	 * Receives the signed file of a detached signature, uploaded on the page rendered by the get()
	 * action above. We store it on our temporary folder using StorageMock class and send the user
	 * back to the get() action, passing it on the "dataFile" URL argument.
	 */
	@RequestMapping(value = "/open-cades-rest", method = {RequestMethod.POST})
	public String post(
			@RequestParam(value = "fileId") String signatureFile,
			@RequestParam MultipartFile userfile
	) throws IOException {

		// Verify if the fileId of the signature exists.
		if (!StorageMock.exists(signatureFile)) {
			throw new FileNotFoundException();
		}

		// Store the signed file.
		String dataFile = StorageMock.store(userfile.getInputStream(), null, userfile.getOriginalFilename());

		return String.format("redirect:/open-cades-rest?fileId=%s&dataFile=%s", signatureFile, dataFile);
	}
}
