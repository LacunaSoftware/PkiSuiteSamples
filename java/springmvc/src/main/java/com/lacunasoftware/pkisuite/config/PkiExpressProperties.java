package com.lacunasoftware.pkisuite.config;

import com.lacunasoftware.pkisuite.util.Util;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@ConfigurationProperties("pki-express")
public class PkiExpressProperties {
	private List<String> trustedRoots;
	private boolean offline;
	private String pkcs12Password;

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

	public String getPkcs12Password() {
		return pkcs12Password;
	}

	public void setPkcs12Password(String pkcs12Password) {
		this.pkcs12Password = pkcs12Password;
	}
}
