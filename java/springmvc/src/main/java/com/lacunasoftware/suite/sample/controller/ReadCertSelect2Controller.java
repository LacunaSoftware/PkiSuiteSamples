package com.lacunasoftware.suite.sample.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/read-cert-select2")
public class ReadCertSelect2Controller {

	/**
	 * GET /read-cert-select2
	 *
	 * This method only renders the page, where the front-end sample will be executed.
	 */
	@GetMapping
	public String get() {
		// Return view according to this method.
		return "read-cert-select2/index";
	}
}