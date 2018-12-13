package com.lacunasoftware.suite.sample.controller;

import com.lacunasoftware.pkiexpress.Authentication;
import com.lacunasoftware.pkiexpress.InstallationNotFoundException;
import com.lacunasoftware.suite.sample.config.RestPkiProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import java.io.IOException;

@Controller
public class HomeController {

	@Autowired
	private RestPkiProperties restPkiConfig;

	@RequestMapping("/")
	public String index() {
		return "home/index";
	}

	@RequestMapping(value = "/check-pki-express", method = {RequestMethod.GET})
	public String checkPkiExpress(@RequestParam String rc,  @RequestParam(required = false) String uploadCtrl) throws IOException {

		try {
			Authentication auth = new Authentication();
			auth.start();
		} catch (InstallationNotFoundException ex) {
			return "home/express-installation-not-found";
		}

		if (uploadCtrl != null && uploadCtrl.length() > 0) {
			return String.format("redirect:/%s-express?rc=%s", rc, uploadCtrl);
		}
		return String.format("redirect:/%s-express", rc);
	}

	@RequestMapping(value = "/check-restpki-token", method = {RequestMethod.GET})
	public String checkRestPkiToken(@RequestParam String rc, @RequestParam(required = false) String uploadCtrl) {
		String accessToken = restPkiConfig.getAccessToken();
		if (accessToken == null || accessToken.equals("") || accessToken.contains(" ACCESS TOKEN ")) {
			return "home/restpki-token-not-set";
		}

		if (uploadCtrl != null && uploadCtrl.length() > 0) {
			return String.format("redirect:/%s-restpki?rc=%s", rc, uploadCtrl);
		}
		return String.format("redirect:/%s-restpki", rc);
	}
}


