package com.lacunasoftware.pkisuite.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.itextpdf.text.pdf.PdfStructTreeController.returnType;
import com.lacunasoftware.amplia.AmpliaClient;
import com.lacunasoftware.pkiexpress.PkiExpressOperator;
import com.lacunasoftware.pkiexpress.TimestampAuthority;
import com.lacunasoftware.restpki.RestPkiClient;
import com.lacunasoftware.restpki.SecurityContext;
import com.lacunasoftware.pkisuite.config.ApplicationProperties;
import com.lacunasoftware.pkisuite.config.ProxyProperties;
import com.lacunasoftware.restpkicore.RestPkiOptions;

import cloudhub.SessionsApi;
import cloudhub.client.CloudhubClient;
import cloudhub.client.Configuration;

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

	public static RestPkiOptions getRestPkiCoreOptions() {

		String apiKey = getProperties().getRestPkiCore().getApiKey();

		// Throw exception if token is not set (this check is here just for the sake of newcomers,
		// you can remove it).
		if (isNullOrEmpty(apiKey) || apiKey.contains(" API KEY ")) {
			throw new RuntimeException("The API key was not set! Hint: to run this sample " +
				"you must generate an API key on the REST PKI website and paste it on the " +
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

		String endpoint = getProperties().getRestPkiCore().getEndpoint();
		if (endpoint == null || endpoint.length() == 0) {
			endpoint = "https://core.pki.rest/";
		}

		RestPkiOptions options = new RestPkiOptions();
		options.setEndpoint(endpoint);
		options.setProxy(proxy);
		options.setApiKey(apiKey);

		return options;
	}

	public static SecurityContext getSecurityContext() {

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
	
	public static com.lacunasoftware.restpkicore.SecurityContext getSecurityContextCore() {

		if (getProperties().trustLacunaTestRoot()) {

			// This security context trusts ICP-Brasil certificates as well as certificates on
			// Lacuna Software's test PKI. Use it to accept the test certificates provided by Lacuna
			// Software.

			// THIS SHOULD NEVER BE USED ON PRODUCTION ENVIRONMENT!
			return com.lacunasoftware.restpkicore.SecurityContext.lacunaTest;
			// For more information, see https://github.com/LacunaSoftware/RestPkiSamples/blob/master/TestCertificates.md

			// Notice for "on premises" users: this security context might not exist on your
			// installation, if you encounter an error please contact developer support.
		}

		// In production, accept only certificates from ICP-Brasil.
		return com.lacunasoftware.restpkicore.SecurityContext.pkiBrazil;
	}

	//endregion

	//region Amplia

	public static AmpliaClient getAmpliaClient() {
		String apiKey = getProperties().getAmplia().getApiKey();

		// Throw exception if api key is not set (this check is here just for the sake of newcomers,
		// you can remove it).
		if (isNullOrEmpty(apiKey) || apiKey.contains(" API KEY ")) {
			throw new RuntimeException("The API key was not set! Hint: to run this sample " +
					"you must generate an API key on the Amplia website and paste it on the " +
					"file src/main/resources/application.yml");
		}

		String endpoint = getProperties().getAmplia().getEndpoint();
		if (endpoint == null || endpoint.length() == 0) {
			endpoint = "https://amplia.lacunasoftware.com/";
		}

		// Return an instance of AmpliaClient class, passing the endpoint and the API key.
		return new AmpliaClient(endpoint, apiKey);
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

	//region Cloubhub

	public static CloudhubClient getCloudhubClient() {
		String apiKey = getProperties().getCloudhub().getApiKey();

		// Throw exception if api key is not set (this check is here just for the sake of newcomers,
		// you can remove it).
		if (isNullOrEmpty(apiKey) || apiKey.contains(" API KEY ")) {
			throw new RuntimeException("The API key was not set! Hint: to run this sample " +
					"you must generate an API key by contacting this e-mail (suporte@lacunasoftware.com) and paste it on the " +
					"file src/main/resources/application.yml");
		}

		String endpoint = getProperties().getAmplia().getEndpoint();
		if (endpoint == null || endpoint.length() == 0) {
			endpoint = "https://cloudhub.lacunasoftware.com/";
		}

		CloudhubClient CloudhubClient = new CloudhubClient(endpoint, apiKey);

		// Return an instance of AmpliaClient class, passing the endpoint and the API key.
		return CloudhubClient;
	}

	//endregion

	public static boolean isNullOrEmpty(String string) {
		return string == null || string.isEmpty();
	}

	public static void setNoCacheHeaders(HttpServletResponse response) {
		response.setHeader("Expires", "-1");
		response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
		response.setHeader("Pragma", "no-cache");
	}

	public static Date getDateYearsFromNow(int years) {
		Calendar c = Calendar.getInstance();
		c.setTime(new Date());
		c.add(Calendar.YEAR, years);
		return c.getTime();
	}

	public static String joinStringsPt(List<String> strings) {
		StringBuilder text = new StringBuilder();
		int size = strings.size();
		int index = 0;
		for (String s : strings) {
			if (index > 0) {
				if (index < size - 1) {
					text.append(", ");
				} else {
					text.append(" e ");
				}
			}
			text.append(s);
			++index;
		}
		return text.toString();
	}
}
