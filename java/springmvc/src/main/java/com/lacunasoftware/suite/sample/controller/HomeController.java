package com.lacunasoftware.suite.sample.controller;

import com.lacunasoftware.suite.sample.config.ApplicationProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class HomeController {

	@Autowired
	private ApplicationProperties properties;

	@RequestMapping("/")
	public String index() {
		return "index";
	}
}
