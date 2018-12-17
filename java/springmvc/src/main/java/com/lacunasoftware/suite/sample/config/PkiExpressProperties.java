package com.lacunasoftware.suite.sample.config;

import com.lacunasoftware.suite.sample.util.Util;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@ConfigurationProperties("pki-express")
public class PkiExpressProperties {

	private List<String> trustedRoots;
	private boolean offline;

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
		if (!Util.isNullOrEmpty(offlineStr)) {
			this.offline = Boolean.parseBoolean(offlineStr);
		} else {
			this.offline = false;
		}
	}
}
