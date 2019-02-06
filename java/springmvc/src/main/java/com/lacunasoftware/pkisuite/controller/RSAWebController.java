package com.lacunasoftware.pkisuite.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/rsa-web")
public class RSAWebController {

	/**
	 * GET /rsa-web
	 *
	 * This method only renders the page, where the front-end sample will be executed.
	 */
	@GetMapping
	public String get() {
		// Return view according to this method.
		return "rsa-web/index";
	}
}