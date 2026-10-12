package com.lacunasoftware.pkisuite.controller;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.lacunasoftware.pkisuite.util.StorageMock;
import com.lacunasoftware.pkisuite.util.Util;
import com.lacunasoftware.pkisuite.util.restpkicore.PadesVisualElements;
import com.lacunasoftware.restpkicore.CertificateReferenceModel;
import com.lacunasoftware.restpkicore.CompleteSignatureRequestV2;
import com.lacunasoftware.restpkicore.DocumentModel;
import com.lacunasoftware.restpkicore.FileReferenceModel;
import com.lacunasoftware.restpkicore.PdfSignatureOptions;
import com.lacunasoftware.restpkicore.PrepareSignatureRequest;
import com.lacunasoftware.restpkicore.PrepareSignatureResponse;
import com.lacunasoftware.restpkicore.RestPkiService;
import com.lacunasoftware.restpkicore.RestPkiServiceFactory;
import com.lacunasoftware.restpkicore.SignatureTypes;
import com.lacunasoftware.restpkicore.ValidationItemModel;


@Controller
@RequestMapping("/pades-signature-core")
public class PadesSignatureCoreController {
	/**
	 * GET /pades-signature-core?fileId={fileToSign}
	 *
	 * This action simply renders the page.
	 */
	@GetMapping
	public String get(@RequestParam(value = "fileId") String fileToSign) throws IOException {

		// Verify if the fileToSign exists.
		if (fileToSign == null || !StorageMock.exists(fileToSign)) {
			throw new FileNotFoundException();
		}

		// Render the signature page (templates/pades-signature-core/index.html)
		return "pades-signature-core/index";
	}

	/**
	 * POST /pades-signature-core/start?fileId={fileToSign}
	 *
	 * This action receives the form submission from the signature page. It will perform a PAdES
	 * signature in three steps using Rest PKI Core and Web PKI.
	 * @throws Exception 
	 */
	@PostMapping("/start")
	public String postStart(
		@RequestParam(value = "fileId") String fileToSign,
		@RequestParam String certThumb,
		@RequestParam String certContent,
		Model model
	) throws Exception {

		// Verify if the fileId exists and get the absolute path of the fileId with the help of our
		// StorageMock class. This sample can only execute if the provided file exists.
		if (!StorageMock.exists(fileToSign)) {
			throw new FileNotFoundException();
		}

		// Get an instance of the RestPkiService class, responsible for communicating with REST PKI Core.
		RestPkiService service = RestPkiServiceFactory.getService(Util.getRestPkiCoreOptions());

		// Create a signature request.
		PrepareSignatureRequest request = new PrepareSignatureRequest();
		
		// Set the security context to be used to determine trust in the certificate chain. We have
		// encapsulated the security context choice on Util.java.
		request.setSecurityContextId(Util.getSecurityContextCore().getUUID());

		// Set the PDF to be signed.
        FileReferenceModel fileRefModel = new FileReferenceModel();
        // first we open the file and read the bytes
        byte[] fileBytes = Files.readAllBytes(StorageMock.getDataPath(fileToSign));
        fileRefModel.setContent(fileBytes);
        fileRefModel.setContentType("application/pdf");
        fileRefModel.setName("Sample PDF.pdf");
        request.setFile(fileRefModel);

        // set the certificate
        CertificateReferenceModel certificateRefModel = new CertificateReferenceModel();
        certificateRefModel.setContent(Base64.getDecoder().decode(certContent));
        request.setCertificate(certificateRefModel);

		// Set the signature type and the visual representation of the signature. We have
		// encapsulated the visual representation code on util/restpkicore/PadesVisualElements.java.
		request.setSignatureType(SignatureTypes.PDF);
		PdfSignatureOptions pdfSignatureOptions = new PdfSignatureOptions();
		pdfSignatureOptions.setVisualRepresentation(PadesVisualElements.getVisualRepresentation());
		request.setPdfSignatureOptions(pdfSignatureOptions);

		// Call the startSignature() method, which initiates the signature. This yields a
		// PrepareSignatureResponse object containing the signer certificate and other information
		// needed to complete the signature process.
		PrepareSignatureResponse result = service.startSignature(request);

		// REST PKI Core validates the signer's certificate before preparing the signature. If the
		// certificate is not valid or not trusted, "success" is false and "validationResults" says
		// why.
		if (!Boolean.TRUE.equals(result.isSuccess())) {
			String details = "";
			List<ValidationItemModel> errors = result.getValidationResults() != null
				? result.getValidationResults().getErrors()
				: null;
			if (errors != null && !errors.isEmpty()) {
				details = ": " + errors.stream()
					.map(ValidationItemModel::getMessage)
					.collect(Collectors.joining("; "));
			}
			throw new Exception(String.format("The signature could not be prepared (%s)%s",
				result.getFailure(), details));
		}

		// The token acquired above can only be used for a single signature attempt. In order to
		// retry the signature it is necessary to get a new token. This can be a problem if the user
		// uses the back button of the browser, since the browser might show a cached page that we
		// rendered previously, with a now stale token. To prevent this from happening, we call the
		// method Util.setNoCacheHeaders(), which sets HTTP headers to prevent caching of the page.
		// Util.setNoCacheHeaders(response);

		// Render the signature page (templates/pades-signature-core/index.html).
		model.addAttribute("certThumb", certThumb);
		model.addAttribute("certContent", certContent);
		model.addAttribute("state", result.getState());
		model.addAttribute("toSignHash", Base64.getEncoder().encodeToString(result.getToSign().getHash()));
		model.addAttribute("digestAlgorithm", result.getToSign().getSignatureAlgorithm().getDigestAlgorithmOid());
		model.addAttribute("fileId", fileToSign);
		return "pades-signature-core/start";
	}

	/**
	 * POST /pades-signature-core/complete
	 *
	 * This action receives the form submission from the signature page. We'll call REST PKI Core to
	 * complete the signature.
	 */
	@PostMapping("/complete")
	public String complete(
		@RequestParam String signature,
		@RequestParam String state,
		@RequestParam(value = "fileId") String fileId,
		Model model
	) throws Exception {

		// Get an instance of the RestPkiService class.
		RestPkiService service = RestPkiServiceFactory.getService(Util.getRestPkiCoreOptions());

		// Create the complete signature request.
		CompleteSignatureRequestV2 request = new CompleteSignatureRequestV2();
		request.setState(state);
		request.setSignature(Base64.getDecoder().decode(signature));

		// Call the completeSignature() method, which finalizes the signature process and returns a
		// DocumentModel object.
		DocumentModel signatureResult = service.completeSignature(request);
		// System.out.println(signatureResult);

		// At this point, you'd typically store the signed PDF on your database. The "signedFile"
		// field holds a temporary link to it. For demonstration purposes, we'll download the signed
		// PDF and store it with our StorageMock class.
		String signedPdf;
		try (InputStream signedContent = service.openRead(signatureResult.getSignedFile().getUrl())) {
			signedPdf = StorageMock.store(signedContent, "pdf");
		}

		// Render the signature info page (templates/pades-signature-core/signature-info.html).
		model.addAttribute("signedPdf", signedPdf);
		return "pades-signature-core/signature-info";
	}
}
