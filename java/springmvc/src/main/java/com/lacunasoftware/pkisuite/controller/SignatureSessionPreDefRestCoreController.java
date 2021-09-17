package com.lacunasoftware.pkisuite.controller;

import com.lacunasoftware.pkisuite.util.StorageMock;
import com.lacunasoftware.pkisuite.util.Util;
import com.lacunasoftware.restpki.*;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;
import java.util.List;
import java.util.ArrayList;

import javax.servlet.http.HttpServletResponse;

@Controller
public class SignatureSessionPreDefRestCoreController {

	private final String RETURN_URL = "http://localhost:60695/signature-session-predef-rest-core/complete";

	/**
	 * GET /signature-session-predef-rest-core
	 *
	 * This action initiates a signature session with REST PKI Core.
	 */
	@GetMapping("/signature-session-predef-rest-core")
	public String get(Model model, HttpServletResponse response) throws Exception {

		RestPkiService service = RestPkiServiceFactory.getService(Util.getRestPkiCoreOptions());

		CreateSignatureSessionRequest request = new CreateSignatureSessionRequest();
		request.setReturnUrl(RETURN_URL);
		request.disableDownloads(true);

		List<SignatureSessionDocumentToSign> docs = new ArrayList<>();

		for (int i = 0; i < 10; i++) {
			SignatureSessionDocumentToSign doc = new SignatureSessionDocumentToSign();
			doc.setFile(FileReference.FromFile(StorageMock.getBatchDocPath(i), String.format("%02d.pdf", i), "application/pdf"));
			doc.setSignatureType(SignatureTypes.PDF);
			docs.add(doc);
		}

		CreateSignatureSessionResponse sessionResponse = service.createSignatureSession(request, null, null, docs);

		// Render the signature-session-rest-core page (templates/signature-session-rest-core/index.html).
		model.addAttribute("redirectUrl", sessionResponse.getRedirectUrl());
		return "signature-session-predef-rest-core/index";
	}

	/**
	 * GET /signature-session-rest-core/webhook
	 *
	 * This action initiates a signature session with REST PKI Core using webhook.
	 */
	@GetMapping("/signature-session-predef-rest-core/webhook")
	public String usingWebhook(Model model, HttpServletResponse response) throws Exception {

		RestPkiService service = RestPkiServiceFactory.getService(Util.getRestPkiCoreOptions());

		CreateSignatureSessionRequest request = new CreateSignatureSessionRequest();
		request.setEnableBackgroundProcessing(true);
		request.disableDownloads(true);

		List<SignatureSessionDocumentToSign> docs = new ArrayList<>();

		for (int i = 0; i < 10; i++) {
			SignatureSessionDocumentToSign doc = new SignatureSessionDocumentToSign();
			doc.setFile(FileReference.FromFile(StorageMock.getBatchDocPath(i), String.format("%02d.pdf", i), "application/pdf"));
			doc.setSignatureType(SignatureTypes.PDF);
			docs.add(doc);
		}

		CreateSignatureSessionResponse sessionResponse = service.createSignatureSession(request, null, null, docs);

		// Render the signature-session-rest-core page (templates/signature-session-rest-core/index.html).
		model.addAttribute("redirectUrl", sessionResponse.getRedirectUrl());
		return "signature-session-predef-rest-core/index";
	}

	/**
	 * GET /ignature-session-rest-core/complete
	 *
	 * This action receives the form submission from the view. We'll call REST PKI to validate the
	 * authentication.
	 */
	@GetMapping("/signature-session-predef-rest-core/complete")
	public String complete(
		Model model,
		@RequestParam(value="signatureSessionId") String sessionId
	) throws Exception {
		// Get service
		RestPkiService service = RestPkiServiceFactory.getService(Util.getRestPkiCoreOptions());
		// Get session information
		SignatureSession session = service.getSignatureSession(UUID.fromString(sessionId));

		model.addAttribute("sessionStatus", session.getStatus());

		if (session.getStatus() == SignatureSessionStatus.COMPLETED){
			// If signature completed, get documents information
			List<SignatureSessionDocument> docs = session.getDocuments();
			model.addAttribute("documents", docs);
		}
		// Render the signature-session-rest-core page (templates/signature-session-rest-core/complete.html).
		return "signature-session-predef-rest-core/complete";
	}
}