package com.lacunasoftware.pkisuite.config;

import com.lacunasoftware.pkisuite.util.Util;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties("proxy")
public class ProxyProperties {

	private String host;
	private Integer port;
	private String username;
	private String password;

	public String getHost() {
		return host;
	}

	public void setHost(String host) {
		if (!Util.isNullOrEmpty(host)) {
			this.host = host;
		}
	}

	public Integer getPort() {
		return port;
	}

	public void setPort(String port) {
		if (!Util.isNullOrEmpty(port)) {
			this.port = Integer.parseInt(port);
		}
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		if (!Util.isNullOrEmpty(username)) {
			this.username = username;
		}
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		if (!Util.isNullOrEmpty(password)) {
			this.password = password;
		}
	}
}
