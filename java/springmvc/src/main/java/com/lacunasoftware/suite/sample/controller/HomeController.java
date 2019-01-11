package com.lacunasoftware.suite.sample.controller;

import com.lacunasoftware.pkiexpress.Authentication;
import com.lacunasoftware.pkiexpress.InstallationNotFoundException;
import com.lacunasoftware.suite.sample.config.RestPkiProperties;
import com.lacunasoftware.suite.sample.util.Util;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import java.io.IOException;

@Controller
public class HomeController {

	@Autowired
	private RestPkiProperties restPkiConfig;

	/**
	 * GET /
	 *
	 * Renders the initial page.
	 */
	@GetMapping("/")
	public String index() {
		return "home/index";
	}

	/**
	 * GET /check-express
	 *
	 * Checks the installation of PKI Express using an authentication to cause the
	 * InstallationNotFoundException exception. If not, it renders a informative page to show how to
	 * install. Otherwise, it will continue to the sample identified by "fwd" and "op" parameters.
	 */
	@GetMapping("/check-express")
	public String checkPkiExpress(
		@RequestParam String rc,
		@RequestParam(required = false) String fwd,
		@RequestParam(required = false) String op
	) throws IOException {

		try {
			Authentication auth = new Authentication();
			auth.start();
		} catch (InstallationNotFoundException ex) {
			return "home/express-installation-not-found";
		}

		if (!Util.isNullOrEmpty(fwd)) {
			if (!Util.isNullOrEmpty(op)) {
				return String.format("redirect:/%s?rc=%s-express&op=%s", rc, fwd, op);
			}
			return String.format("redirect:/%s?rc=%s-express", rc, fwd);
		}
		return String.format("redirect:/%s-express", rc);
	}

	/**
	 * GET /check-rest-token
	 *
	 * Checks if the token is set on the application.yml file. If not, it renders a informative page
	 * to show how to fix that. Otherwise, it will continue to the sample identified by "fwd" and
	 * "op" parameters.
	 */
	@GetMapping("/check-rest-token")
	public String checkRestPkiToken(
		@RequestParam String rc,
		@RequestParam(required = false) String fwd,
		@RequestParam(required = false) String op
	) {
		String accessToken = restPkiConfig.getAccessToken();
		if (accessToken == null || accessToken.equals("") || accessToken.contains(" ACCESS TOKEN ")) {
			return "home/rest-token-not-set";
		}

		if (!Util.isNullOrEmpty(fwd)) {
			if (!Util.isNullOrEmpty(op)) {
				return String.format("redirect:/%s?rc=%s-rest&op=%s", rc, fwd, op);
			}
			return String.format("redirect:/%s?rc=%s-rest", rc, fwd);
		}
		return String.format("redirect:/%s-rest", rc);
	}
}


