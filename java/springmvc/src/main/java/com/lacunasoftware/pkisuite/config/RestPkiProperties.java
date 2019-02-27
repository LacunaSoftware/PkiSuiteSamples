package com.lacunasoftware.pkisuite.config;

import com.lacunasoftware.pkisuite.util.Util;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties("rest-pki")
public class RestPkiProperties {

	private String accessToken;
	private String endpoint;

	public String getAccessToken() {
		return accessToken;
	}

	public void setAccessToken(String accessToken) {
		if (!Util.isNullOrEmpty(accessToken)) {
			this.accessToken = accessToken;
		}
	}

	public String getEndpoint() {
		return endpoint;
	}

	public void setEndpoint(String endpoint) {
		if (!Util.isNullOrEmpty(endpoint)) {
			this.endpoint = endpoint;
		}
	}
}
