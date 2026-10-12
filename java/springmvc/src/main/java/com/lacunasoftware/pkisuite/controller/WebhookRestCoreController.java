package com.lacunasoftware.pkisuite.controller;

import java.io.IOException;
import java.io.InputStream;

import com.lacunasoftware.restpkicore.*;
import org.apache.commons.io.IOUtils;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.lacunasoftware.pkisuite.util.StorageMock;
import com.lacunasoftware.pkisuite.util.Util;


@Controller
public class WebhookRestCoreController {
	/**
	 * Due to the limitations of Spring's serializer, this method has the
	 * responsibility of deserializing the model received in the request.
	 */
	public WebhookEventModel deserializeWebhookEvent(HttpServletRequest request) throws IOException {
		String body = IOUtils.toString(request.getReader());
		ObjectMapper mapper = new ObjectMapper();
		return mapper.readValue(body, WebhookEventModel.class);
	}

	/**
	 * This action receives the REST PKI Core's webhook event notification.
	 */
	@RequestMapping(value = "/webhook-rest-core", method = { RequestMethod.POST })
	public ResponseEntity<Object> post(HttpServletRequest request) {
		try {
			// Get WebhookEventModel instance from body - JSON.
			WebhookEventModel event = deserializeWebhookEvent(request);

			// Verify Webhook Event Type.
			if (event.getType() == WebhookEventTypes.DOCUMENTSIGNATURECOMPLETED) {
				// RestPkiService configuration.
				RestPkiService service = RestPkiServiceFactory.getService(Util.getRestPkiCoreOptions());

				// Get document from ID. It updates the download links. (getDocument() is not used
				// because its DocumentFile class only exposes the deprecated "location" field.)
				DocumentModel document = service.getDocumentModel(event.getDocument().getId());

				// Get the link to download the signedFile: a temporary link that downloads the
				// file without the API key.
				String downloadLink = document.getSignedFile().getUrl();

				// Get the signed file content.
				InputStream signedContent = service.openRead(downloadLink);

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
