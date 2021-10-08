package com.lacunasoftware.pkisuite.controller;

import com.lacunasoftware.restpkicore.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;



@Controller
public class ValidateFileRestCoreController {

	/**
	 * This action validates the file uploaded to REST PKI Core.
	 */
	@RequestMapping(value = "/validate-file-rest-core", method = { RequestMethod.POST })
	public ResponseEntity<ValidateFileResponse> post(
		@RequestBody ValidateFileRequest request
	) {
		ValidateFileResponse response = new ValidateFileResponse();
		// List invalid file names.
		List<String> badNames = Arrays.asList("P111111.pdf", "P222222.pdf", "P333333.pdf",
		"P444444.pdf", "P555555.pdf", "P666666.pdf","P777777.pdf", "P888888.pdf", "P999999.pdf");

		// Validate file.
		if (request.getLength() < 5) {

			response.setAccept(false);
			response.setRejectReason("The file is too small.");

		} else if (!request.getContentType().equals("application/pdf")) {

			response.setAccept(false);
			response.setRejectReason("The file is not a PDF.");

		} else if (badNames.contains(request.getName())) {

			response.setAccept(false);
			response.setRejectReason("The file name is invalid.");

		} else {
			response.setAccept(true);
		}

		return new ResponseEntity<ValidateFileResponse>(response, HttpStatus.ACCEPTED);
	}
}
