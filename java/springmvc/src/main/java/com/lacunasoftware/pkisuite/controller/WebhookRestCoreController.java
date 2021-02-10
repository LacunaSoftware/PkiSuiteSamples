package com.lacunasoftware.pkisuite.controller;

import java.io.InputStream;
import org.apache.commons.io.IOUtils;
import javax.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.lacunasoftware.pkisuite.util.StorageMock;
import com.lacunasoftware.pkisuite.util.Util;
import com.lacunasoftware.restpki.*;

@Controller
public class WebhookRestCoreController {

	/**
	 * This action receives the REST PKI Core's webhook event notification.
	 * 
	 */
	@RequestMapping(value = "/webhook-rest-core", method = { RequestMethod.POST })
	public ResponseEntity<Object> post(HttpServletRequest request) {
		try {
			// Get WebhookEventModel instance from body - JSON.
			String body = IOUtils.toString(request.getReader());
			ObjectMapper mapper = new ObjectMapper();
			WebhookEventModel event = mapper.readValue(body, WebhookEventModel.class);

			// Verify Webhook Event Type.
			if (event.getType() == WebhookEventTypes.DocumentSignatureCompleted) {
				// RestPkiService configuration.
				RestPkiService service = RestPkiServiceFactory.GetService(Util.getRestPkiCoreOptions());

				// Get document from ID. It updates the download locations.
				Document document = service.GetDocument(event.getDocument().getId());

				// Get the link to download the signedFile.
				String downloadLink = document.getSignedFile().getLocation();

				// Get the signed file content.
				InputStream signedContent = service.OpenRead(downloadLink);

				// Store file content.
				String outputFile = StorageMock.store(signedContent, ".pdf");
				System.out.println("Webhook: Signed file stored - " + outputFile);
			}
			return ResponseEntity.ok().build();

		} catch (Exception e) {
			return ResponseEntity.accepted().build();
		}
	}
}
