package com.lacunasoftware.pkisuite.controller;

import com.lacunasoftware.pkisuite.util.Util;
import com.lacunasoftware.restpkicore.*;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

import javax.servlet.http.HttpServletResponse;

@Controller
public class SignatureSessionRestCoreController {

	private final String RETURN_URL = "http://localhost:60695/signature-session-rest-core/complete";

	/**
	 * GET /signature-session-rest-core
	 *
	 * This action initiates a signature session with REST PKI Core.
	 */
	@GetMapping("/signature-session-rest-core")
	public String get(Model model, HttpServletResponse response) throws Exception {

		RestPkiService service = RestPkiServiceFactory.getService(Util.getRestPkiCoreOptions());

		CreateSignatureSessionRequest request = new CreateSignatureSessionRequest();
		request.setReturnUrl(RETURN_URL);

		CreateSignatureSessionResponse sessionResponse = service.createSignatureSession(request);

		// Render the signature-session-rest-core page (templates/signature-session-rest-core/index.html).
		model.addAttribute("redirectUrl", sessionResponse.getRedirectUrl());
		return "signature-session-rest-core/index";
	}

	/**
	 * GET /signature-session-rest-core/webhook
	 *
	 * This action initiates a signature session with REST PKI Core using webhook.
	 */
	@GetMapping("/signature-session-rest-core/webhook")
	public String usingWebhook(Model model, HttpServletResponse response) throws Exception {

		RestPkiService service = RestPkiServiceFactory.getService(Util.getRestPkiCoreOptions());

		CreateSignatureSessionRequest request = new CreateSignatureSessionRequest();
		request.setEnableBackgroundProcessing(true);

		CreateSignatureSessionResponse sessionResponse = service.createSignatureSession(request);

		// Render the signature-session-rest-core page (templates/signature-session-rest-core/index.html).
		model.addAttribute("redirectUrl", sessionResponse.getRedirectUrl());
		return "signature-session-rest-core/index";
	}

	/**
	 * GET /ignature-session-rest-core/complete
	 *
	 * This action receives the form submission from the view. We'll call REST PKI to validate the
	 * authentication.
	 */
	@GetMapping("/signature-session-rest-core/complete")
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
			// If signature completed, get document information
			UUID docId = session.getDocuments().get(0).getId();
			Document doc = service.getDocument(docId);

			model.addAttribute("originalFile", doc.getOriginalFile());
			model.addAttribute("signedFile", doc.getSignedFile());
		}
		// Render the signature-session-rest-core page (templates/signature-session-rest-core/complete.html).
		return "signature-session-rest-core/complete";
	}
}