package com.lacunasoftware.suite.sample.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@ConfigurationProperties("pki-express")
public class PkiExpressProperties {

	private List<String> trustedRoots;
	private boolean offline;
	private boolean trustLacunaTestRoot;

	public List<String> getTrustedRoots() {
		return trustedRoots;
	}

	public void setTrustedRoots(List<String> trustedRoots) {
		this.trustedRoots = trustedRoots;
	}

	public boolean isOffline() {
		return offline;
	}

	public void setOffline(String offlineStr) {
		this.offline = Boolean.parseBoolean(offlineStr);
	}

	public boolean isTrustLacunaTestRoot() {
		return trustLacunaTestRoot;
	}

	public void setTrustLacunaTestRoot(String trustLacunaTestRootStr) {
		this.trustLacunaTestRoot = Boolean.parseBoolean(trustLacunaTestRootStr);
	}
}
