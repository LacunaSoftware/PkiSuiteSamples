package com.lacunasoftware.pkisuite.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/list-cert-jquery")
public class ListCertJQueryController {

	/**
	 * GET /list-cert-jquery
	 *
	 * This method only renders the page, where the front-end sample will be executed.
	 */
	@GetMapping
	public String get() {
		// Return view according to this method.
		return "list-cert-jquery/index";
	}
}