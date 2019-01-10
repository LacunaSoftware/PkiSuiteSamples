package com.lacunasoftware.suite.sample.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class ReadCertJQueryController {

	/**
	 * GET /read-cert-jquery
	 */
	@RequestMapping(value = "/read-cert-jquery", method = {RequestMethod.GET})
	public String get() {
		// Return view according to this method.
		return "read-cert-jquery/index";
	}
}