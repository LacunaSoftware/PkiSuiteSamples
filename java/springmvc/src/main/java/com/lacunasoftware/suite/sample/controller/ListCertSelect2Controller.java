package com.lacunasoftware.suite.sample.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class ListCertSelect2Controller {

	/**
	 * GET /list-cert-select2
	 */
	@RequestMapping(value = "/list-cert-select2", method = {RequestMethod.GET})
	public String get() {
		// Return view according to this method.
		return "list-cert-select2/index";
	}
}