package com.lacunasoftware.suite.sample.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@Controller
public class BatchPadesSignatureRestController {

	/**
	 * This action renders the batch signature page.
	 *
	 * Notice that the only thing we'll do on the server-side at this point is determine the IDs of
	 * the documents to be signed. The page will handle each document one by one and will call the
	 * server asynchronously to start and complete each signature. See
	 * BatchSignatureRestApiController class to see API action, that will be called by Ajax on
	 * client-side.
	 */
	@GetMapping("/batch-signature-rest")
	public String index(Model model) {

		// It is up to your application's business logic to determine which documents will compose
		// the batch.
		List<Integer> documentIds = new ArrayList<Integer>();
		for (int i = 1; i <= 30; i++) {
			documentIds.add(i);
		}

		// Render the batch signature page (templates/batch-signature-rest/index.html.html).
		model.addAttribute("documentIds", documentIds);
		return "batch-signature-rest/index";
	}
}
