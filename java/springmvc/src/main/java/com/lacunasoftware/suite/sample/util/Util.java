package com.lacunasoftware.suite.sample.util;

import com.lacunasoftware.pkiexpress.PkiExpressOperator;
import com.lacunasoftware.pkiexpress.TimestampAuthority;
import com.lacunasoftware.restpki.RestPkiClient;
import com.lacunasoftware.restpki.SecurityContext;
import com.lacunasoftware.suite.sample.config.ApplicationProperties;
import com.lacunasoftware.suite.sample.config.ProxyProperties;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.Authenticator;
import java.net.InetSocketAddress;
import java.net.PasswordAuthentication;
import java.net.Proxy;
import java.util.*;

public class Util {

	private static ApplicationProperties getProperties() {
		return ApplicationProperties.getInstance();
	}

	//region REST PKI

	public static RestPkiClient getRestPkiClient() {

		String accessToken = getProperties().getRestPki().getAccessToken();

		// Throw exception if token is not set (this check is here just for the sake of newcomers,
		// you can remove it).
		if (isNullOrEmpty(accessToken) || accessToken.contains(" ACCESS TOKEN ")) {
			throw new RuntimeException("The API access token was not set! Hint: to run this sample " +
				"you must generate an API access token on the REST PKI website and paste it on the " +
				"file src/main/resources/application.yml");
		}

		Proxy proxy = null;
		// If you need to set a proxy for outgoing connections.
		ProxyProperties proxyProperties = getProperties().getProxy();
		if (!isNullOrEmpty(proxyProperties.getHost()) && proxyProperties.getPort() != null) {
			proxy = new Proxy(Proxy.Type.HTTP, new InetSocketAddress(proxyProperties.getHost(), proxyProperties.getPort()));

			// If your proxy requires authentication.
			if (!isNullOrEmpty(proxyProperties.getUsername()) && !isNullOrEmpty(proxyProperties.getPassword())) {
				Authenticator.setDefault(new Authenticator() {
					@Override
					public PasswordAuthentication getPasswordAuthentication() {
						return new PasswordAuthentication(
							getProperties().getProxy().getUsername(),
							getProperties().getProxy().getPassword().toCharArray()
						);
					}
				});
			}
		}

		String endpoint = getProperties().getRestPki().getEndpoint();
		if (endpoint == null || endpoint.length() == 0) {
			endpoint = "https://pki.rest/";
		}

		return new RestPkiClient(endpoint, accessToken, proxy);
	}

	public static SecurityContext getSecurityContextId() {

		if (getProperties().trustLacunaTestRoot()) {

			// This security context trusts ICP-Brasil certificates as well as certificates on
			// Lacuna Software's test PKI. Use it to accept the test certificates provided by Lacuna
			// Software.

			// THIS SHOULD NEVER BE USED ON PRODUCTION ENVIRONMENT!
			return SecurityContext.lacunaTest;
			// For more information, see https://github.com/LacunaSoftware/RestPkiSamples/blob/master/TestCertificates.md

			// Notice for "on premises" users: this security context might not exist on your
			// installation, if you encounter an error please contact developer support.
		}

		// In production, accept only certificates from ICP-Brasil.
		return SecurityContext.pkiBrazil;
	}

	//endregion

	//region PKI Express

	public static void setPkiDefaults(PkiExpressOperator operator) throws IOException {

		// Set the operator to trust in a custom trusted root, you need to inform the operator class.
		// We will add each trusted root from configuration file. In this sample, we assumed that all
		// trusted roots are in the resources/ folder. You are free to pass any path.
		List<String> trustedRoots = getProperties().getPkiExpress().getTrustedRoots();
		if (trustedRoots != null && trustedRoots.size() > 0) {
			for (String root : trustedRoots) {
				operator.addTrustedRoot(StorageMock.getResourcePath(root));
			}
		}

		// Set operator to "OFFLINE MODE" (default: false):
		operator.setOffline(getProperties().getPkiExpress().isOffline());

		// Set the operator to use a timestamp authority when performing an
		// timestamp operation. In this sample, we will use the REST PKI by
		// default to emit a timestamp. It only be filled if the REST PKI was
		// provided.
		String restPkiAccessToken = getProperties().getRestPki().getAccessToken();
		if (!isNullOrEmpty(restPkiAccessToken) && !restPkiAccessToken.contains(" ACCESS TOKEN ")) {

			// Get an instance of the TimestampAuthority class, responsible to
			// inform the url and authentication logic to be used when contacting
			// and timestamp authority.
			TimestampAuthority authority = new TimestampAuthority("https://pki.rest/tsp/a402df41-8559-47b2-a05c-be555bf66310");

			// Set authentication strategy. In the case of REST PKI, is using a bearer token.
			authority.setOAuthTokenAuthentication(getProperties().getRestPki().getAccessToken());

			// Add authority to be used by the operator.
			operator.setTimestampAuthority(authority);
		}

		// Set the operator to trust Lacuna Test Root (for development purposes only!). Use this to
		// accept the test certificate provide by Lacuna Software.
		operator.setTrustLacunaTestRoot(getProperties().trustLacunaTestRoot());
		// THIS SHOULD NEVER BE USED ON PRODUCTION ENVIRONMENT!
	}

	//endregion

	public static boolean isNullOrEmpty(String string) {
		return string == null || string.length() == 0;
	}

	public static void setNoCacheHeaders(HttpServletResponse response) {
		response.setHeader("Expires", "-1");
		response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
		response.setHeader("Pragma", "no-cache");
	}
}
