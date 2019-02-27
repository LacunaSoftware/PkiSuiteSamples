package com.lacunasoftware.pkisuite.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class ApplicationProperties {
	private RestPkiProperties restPki;
	private WebPkiProperties webPki;
	private PkiExpressProperties pkiExpress;
	private AmpliaProperties amplia;
	private ProxyProperties proxy;

	@Value("${trustLacunaTestRoot}")
	private boolean trustLacunaTestRoot;

	private static ApplicationProperties instance;

	private ApplicationProperties() {
	}

	public static ApplicationProperties getInstance() {
		return instance;
	}

	@Autowired
	public void setInstance(ApplicationProperties properties) {
		instance = properties;
	}

	public RestPkiProperties getRestPki() {
		return restPki;
	}

	@Autowired
	public void setRestPki(RestPkiProperties restPki) {
		this.restPki = restPki;
	}

	public WebPkiProperties getWebPki() {
		return webPki;
	}

	@Autowired
	public void setWebPki(WebPkiProperties webPki) {
		this.webPki = webPki;
	}

	public PkiExpressProperties getPkiExpress() {
		return pkiExpress;
	}

	@Autowired
	public void setPkiExpress(PkiExpressProperties pkiExpress) {
		this.pkiExpress = pkiExpress;
	}

	public AmpliaProperties getAmplia() {
		return amplia;
	}

	@Autowired
	public void setAmplia(AmpliaProperties amplia) {
		this.amplia = amplia;
	}

	public ProxyProperties getProxy() {
		return proxy;
	}

	@Autowired
	public void setProxy(ProxyProperties proxy) {
		this.proxy = proxy;
	}

	public boolean trustLacunaTestRoot() {
		return trustLacunaTestRoot;
	}

	public void setTrustLacunaTestRoot(boolean trustLacunaTestRoot) {
		this.trustLacunaTestRoot = trustLacunaTestRoot;
	}
}
