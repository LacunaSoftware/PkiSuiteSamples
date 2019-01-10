package com.lacunasoftware.suite.sample.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class ListCertJQueryController {

	/**
	 * GET /list-cert-jquery
	 */
	@RequestMapping(value = "/list-cert-jquery", method = {RequestMethod.GET})
	public String get() {
		// Return view according to this method.
		return "list-cert-jquery/index";
	}
}