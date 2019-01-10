package com.lacunasoftware.suite.sample.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class RSAWebController {

	/**
	 * GET /rsa-web
	 */
	@RequestMapping(value = "/rsa-web", method = {RequestMethod.GET})
	public String get() {
		// Return view according to this method.
		return "rsa-web/index";
	}

	/**
	 * POST /rsa-web
	 */
	@RequestMapping(value = "/rsa-web", method = {RequestMethod.POST})
	public String post() {

		// Return view according to this method.
		return "rsa-web/action";
	}
}