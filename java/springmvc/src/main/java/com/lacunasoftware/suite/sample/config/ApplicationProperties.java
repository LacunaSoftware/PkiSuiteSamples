package com.lacunasoftware.suite.sample.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties()
public class ApplicationProperties {

	private RestPkiProperties restPki;
	private WebPkiProperties webPki;
	private PkiExpressProperties pkiExpress;

	public RestPkiProperties getRestPki() {
		return restPki;
	}

	public void setRestPki(RestPkiProperties restPki) {
		this.restPki = restPki;
	}

	public WebPkiProperties getWebPki() {
		return webPki;
	}

	public void setWebPki(WebPkiProperties webPki) {
		this.webPki = webPki;
	}

	public PkiExpressProperties getPkiExpress() {
		return pkiExpress;
	}

	public void setPkiExpress(PkiExpressProperties pkiExpress) {
		this.pkiExpress = pkiExpress;
	}
}
