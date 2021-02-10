package com.lacunasoftware.pkisuite.controller;

import java.io.InputStream;

import javax.servlet.http.HttpServletRequest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lacunasoftware.pkisuite.util.StorageMock;
import com.lacunasoftware.pkisuite.util.Util;
import com.lacunasoftware.restpki.*;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class WebhookRestCoreController {

	/**
	 * This action receives the REST PKI Core's webhook event notification.
	 * 
	 */
	@RequestMapping(value = "/webhook-rest-core", method = { RequestMethod.POST })
	public ResponseEntity<Object> post( HttpServletRequest request ) {
		try {
			ObjectMapper mapper = new ObjectMapper();
			WebhookEventModel event = mapper.readValue(request.getInputStream(), WebhookEventModel.class);

			System.out.println(event);
			// Verify Webhook Event Type.
			if(event.getType() == WebhookEventTypes.DOCUMENTSIGNATURECOMPLETED) {
				// RestPkiService configuration.
				RestPkiService service = RestPkiServiceFactory.GetService(Util.getRestPkiCoreOptions());
				
				// Get the link to download the signedFile.
				String downloadLink = event.getDocument().getSignedFile().getLocation();
		
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
