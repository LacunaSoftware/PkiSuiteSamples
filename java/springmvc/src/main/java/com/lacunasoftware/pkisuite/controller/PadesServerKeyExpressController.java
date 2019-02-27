package com.lacunasoftware.pkisuite.controller;


import com.lacunasoftware.pkiexpress.PadesSigner;
import com.lacunasoftware.pkiexpress.Pkcs12GenerationResult;
import com.lacunasoftware.pkiexpress.Pkcs12Generator;
import com.lacunasoftware.pkiexpress.StandardSignaturePolicies;
import com.lacunasoftware.pkisuite.config.ApplicationProperties;
import com.lacunasoftware.pkisuite.model.express.PadesServerKeyCompleteModel;
import com.lacunasoftware.pkisuite.util.StorageMock;
import com.lacunasoftware.pkisuite.util.Util;
import com.lacunasoftware.pkisuite.util.express.PadesVisualElements;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import java.io.FileNotFoundException;
import java.io.IOException;


@Controller
public class PadesServerKeyExpressController {

	@GetMapping("/pades-server-key-express")
	public ModelAndView get(
			@RequestParam(value="fileId") String fileToSign,
			@RequestParam(required = false) String certId
	) throws IOException {

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

		// Set the PKCS #12 certificate path. We have an logic for choosing the generate the PKCS #12
		// from "issue certificate" samples or a sample PKCS #12.
		if (certId != null) {

			// Verify if the files provided by "certId" parameters exists.
			if (!StorageMock.existsKey(certId, ".json") || !StorageMock.existsKey(certId, ".cer")) {
				throw new FileNotFoundException(String.format("The PKI files referred by certId: %s were not found", certId));
			}

			// Use a default password configured on application.yml.
			String defaultPassword = ApplicationProperties
					.getInstance()
					.getPkiExpress()
					.getPkcs12Password();

			// Generate PKCS #12. We have encapsulated this operation on generatePkcs12() method.
			Pkcs12GenerationResult pkcs12GenResult = generatePkcs12(certId, defaultPassword);

			// Set the generated PKCS #12 and its password on PadesSigner instance.
			signer.setPkcs12(pkcs12GenResult.getPfxContent());
			signer.setCertPassword(defaultPassword);

		} else {
			// Set sample PKCS #12 path.
			signer.setPkcs12(StorageMock.getSamplePkcs12Path());
			signer.setCertPassword("1234");
		}

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
		return new ModelAndView("pades-server-key-express/index", "model", model);
	}

	private Pkcs12GenerationResult generatePkcs12(String certId, String password) throws IOException {

		// Get an instance of the Pkcs12Generator class, responsible for generate a PKCS #12 from a
		// generated key and certificate file. This certificate will be used to sign the uploaded
		// PDF.
		String keyJson = StorageMock.readKeyAsText(certId, ".json");
		Pkcs12Generator pkcs12Generator = new Pkcs12Generator();
		pkcs12Generator.setKey(keyJson);

		// Set PKI defaults options (see Util.java).
		Util.setPkiDefaults(pkcs12Generator);

		// Set the certificate file.
		pkcs12Generator.setCertFile(StorageMock.getKeyPath(certId, ".cer"));

		// Generate PKCS #12 file using the default password.
		return pkcs12Generator.generate(password);
	}
}
