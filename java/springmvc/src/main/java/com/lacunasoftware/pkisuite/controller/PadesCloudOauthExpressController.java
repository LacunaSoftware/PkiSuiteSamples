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

@Controller
public class PadesCloudOauthExpressController {

	// Redirect URL where it's accessed after OAuth flow is finished.
	private final String REDIRECT_URL = "http://localhost:60695/pades-cloud-oauth-express/complete";

	@GetMapping("/pades-cloud-oauth-express")
	public ModelAndView get(
		@RequestParam(value="fileId") String fileToSign
	) {
		return new ModelAndView("/pades-cloud-oauth-express/index");
	}

	@PostMapping("/pades-cloud-oauth-express/discover")
	public ModelAndView discover(
		@RequestParam(value="fileId") String fileToSign,
		@RequestParam(value="cpf") String cpf
	) throws IOException {
		TrustServicesManager manager = new TrustServicesManager();

		// Process cpf
		String plainCpf = cpf.replaceAll("[.-]", "");

		List<TrustServiceAuthParameters> services = manager.discoverByCpfAndStartAuth(plainCpf, REDIRECT_URL, TrustServiceSessionTypes.SIGNATURE_SESSION, fileToSign);

		// Render complete page.
		PadesCloudOauthModel model = new PadesCloudOauthModel();
		model.setServices(services);
		model.setCpf(cpf);
		return new ModelAndView("/pades-cloud-oauth-express/discover", "model", model);
	}

	@GetMapping("/pades-cloud-oauth-express/complete")
	public ModelAndView authorize(
		@RequestParam(value="code", required = false) String authorizationCode,
		@RequestParam(value="state", required = false) String state
	) throws IOException {
		TrustServicesManager manager = new TrustServicesManager();

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
		return new ModelAndView("pades-cloud-oauth-express/signature-info", "model", model);
	}
}
