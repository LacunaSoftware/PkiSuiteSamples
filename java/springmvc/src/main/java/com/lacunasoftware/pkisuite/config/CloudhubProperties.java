package com.lacunasoftware.pkisuite.config;

import com.lacunasoftware.pkisuite.util.Util;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties("cloudhub")
public class CloudhubProperties {

	private String apiKey;
	private String endpoint;

	public String getApiKey() {
		return apiKey;
	}

	public void setApiKey(String apiKey) {
		if (!Util.isNullOrEmpty(apiKey)) {
			this.apiKey = apiKey;
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
