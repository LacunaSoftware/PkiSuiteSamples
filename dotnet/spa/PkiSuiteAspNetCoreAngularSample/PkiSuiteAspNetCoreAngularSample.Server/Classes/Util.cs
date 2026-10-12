using System.Net.Http.Headers;
using Lacuna.Pki;
using Lacuna.Pki.Stores;
using Lacuna.RestPki.Api;
using Lacuna.RestPki.Client;
using Microsoft.Extensions.Options;
using PkiSuiteAspNetCoreAngularSample.Configuration;

namespace PkiSuiteAspNetCoreAngularSample.Classes;

/// <summary>
/// Settings and client factories shared by every sample: the Rest PKI Core client, the PKI SDK
/// trust arbitrator and nonce store, and the choice of which certificates to trust.
/// </summary>
public class Util(
	IOptions<RestPkiCoreOptions> restPkiCoreOptions,
	IOptions<PkiSuiteOptions> pkiSuiteOptions,
	IHttpClientFactory httpClientFactory,
	StorageMock storageMock
) {

	#region Rest PKI Core

	/// <summary>
	/// Whether a Rest PKI Core API key is set in appsettings.json.
	/// </summary>
	public bool IsRestPkiCoreConfigured => !string.IsNullOrWhiteSpace(restPkiCoreOptions.Value.ApiKey);

	/// <summary>
	/// Returns a Rest PKI Core client (Lacuna.RestPkiCore.Client), authenticated with the API key
	/// set in appsettings.json.
	/// </summary>
	public IRestPkiService GetRestPkiService() {
		return RestPkiServiceFactory.GetService(GetRestPkiOptions());
	}

	public RestPkiOptions GetRestPkiOptions() {
		var options = restPkiCoreOptions.Value;
		if (string.IsNullOrWhiteSpace(options.ApiKey)) {
			throw new InvalidOperationException("The Rest PKI Core API key was not set! Hint: to run this sample you must generate an API key on the Rest PKI Core website and paste it on appsettings.json (RestPkiCore:ApiKey)");
		}
		return new RestPkiOptions() {
			Endpoint = options.Endpoint,
			ApiKey = options.ApiKey,
		};
	}

	/// <summary>
	/// Returns an HttpClient for calling Rest PKI Core endpoints that Lacuna.RestPkiCore.Client
	/// has no method for. Its base address is the Rest PKI Core endpoint and it sends the API key
	/// on the X-Api-Key header, which authenticates every Rest PKI Core API call.
	/// </summary>
	public HttpClient GetRestPkiCoreHttpClient() {
		var options = GetRestPkiOptions();
		var client = httpClientFactory.CreateClient();
		client.BaseAddress = new Uri(options.Endpoint);
		client.DefaultRequestHeaders.Add("X-Api-Key", options.ApiKey);
		client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
		return client;
	}

	/// <summary>
	/// Returns the Rest PKI Core security context to be used by the samples.
	/// </summary>
	/// <remarks>
	/// Security contexts dictate which root certification authorities are trusted during
	/// certificate validation. In your API calls, you can use one of the standard security contexts
	/// or reference one of your custom contexts.
	/// </remarks>
	public Guid GetSecurityContextId() {
		if (pkiSuiteOptions.Value.TrustLacunaTestRoot) {
			// Lacuna Test PKI (for development purposes only!)
			//
			// This security context trusts ICP-Brasil certificates as well as certificates on
			// Lacuna Software's test PKI. Use it to accept the test certificates provided by Lacuna
			// Software (see https://docs.lacunasoftware.com/articles/pki-guide/test-certs).
			//
			// THIS SHOULD NEVER BE USED ON A PRODUCTION ENVIRONMENT!
			return StandardSecurityContexts.LacunaTest;
			// Notice for on-premises users: this security context might not exist on your
			// installation. If you encounter an error, please contact developer support.
		}

		// In production, accept only certificates from ICP-Brasil.
		return StandardSecurityContexts.PkiBrazil;
	}

	#endregion

	#region PKI SDK

	/// <summary>
	/// Returns the "trust arbitrator" to be used by the PKI SDK samples on signatures and
	/// authentications. A trust arbitrator determines which root certificates shall be trusted
	/// during certificate and signature validation.
	/// </summary>
	public ITrustArbitrator GetTrustArbitrator() {
		// We start by trusting the ICP-Brasil roots.
		var trustArbitrator = new LinkedTrustArbitrator(TrustArbitrators.PkiBrazil);

		if (pkiSuiteOptions.Value.TrustLacunaTestRoot) {
			// For development purposes only, we also trust Lacuna Software's test PKI (see
			// https://docs.lacunasoftware.com/articles/pki-guide/test-certs).
			//
			// THIS SHOULD NEVER BE DONE ON A PRODUCTION ENVIRONMENT!
			var lacunaTestRoot = Lacuna.Pki.PKCertificate.Decode(Convert.FromBase64String(LacunaRootTestV3));
			trustArbitrator.Add(new TrustedRoots(lacunaTestRoot));
		}

		return trustArbitrator;
	}

	/// <summary>
	/// Returns the nonce store used by the PKI SDK authentication sample, which remembers the
	/// nonces it issued so that each one is accepted only once.
	/// </summary>
	public INonceStore GetNonceStore() {
		// For simplification purposes, we're using the FileSystemNonceStore, which stores nonces as
		// 0-byte files on a local folder. In a real application, the nonces would typically be
		// stored on the database.
		var path = Path.Combine(storageMock.AppDataPath, "nonces");
		Directory.CreateDirectory(path);
		return new FileSystemNonceStore(path);
	}

	// "Lacuna Root Test v3", the root of Lacuna Software's test PKI.
	private const string LacunaRootTestV3 = "MIIFnjCCA4agAwIBAgIBATANBgkqhkiG9w0BAQ0FADBfMQswCQYDVQQGEwJCUjETMBEGA1UEChMKSUNQLUJyYXNpbDEdMBsGA1UECxMUTGFjdW5hIFNvZnR3YXJlIC0gTFMxHDAaBgNVBAMTE0xhY3VuYSBSb290IFRlc3QgdjMwIBcNMjQxMjE2MjA0MjEwWhgPMjA3NDEyMTYwMzAwMDBaMF8xCzAJBgNVBAYTAkJSMRMwEQYDVQQKEwpJQ1AtQnJhc2lsMR0wGwYDVQQLExRMYWN1bmEgU29mdHdhcmUgLSBMUzEcMBoGA1UEAxMTTGFjdW5hIFJvb3QgVGVzdCB2MzCCAiIwDQYJKoZIhvcNAQEBBQADggIPADCCAgoCggIBAN2j+WJCzBe0/PCCXClKQy89kfdFmSyH3wYDsMyUSIBFroeRhv5DEUWMIJcq0fx8bwXIfHv7FQEjPO91GyS3ke2f9uvT0qnAvB2hlwCqF5/eU+LuJYtgxc7vW3QCiUNsYkiHysnIvOB46YwmwOMcpi01eQjrkgsYBzBa4TYZymhD28oGT9VEXepVpzcxF/H1zAnBHrpQRTPz5AjsJ7x3IKOLWFScTCtTnpp4HZslBvnUIwiTQNu4HgsUOekRfDbVwdftcwFHFmW5Z3w6zJvJ/b1x7iv7+g2lskWBNzEV769KoOT6+uwr1zk6Zwv/Oeze22GXuWrKKqLVanvgSCMPSFFlwGYOyjfpXC6Ccwe7Ptnb3cfhvX4V3BtXxkcBvfT34jhT6eoqT6RPqCtA18YTF9qLXHxnQ/AmqJdgsu0+JBWGIQWj95/qv7Y2Q47/7Q6866Bp6SbWDWLd161l4IYe/R9DE8gsujGey9gydiNrtzxNW3BrtssmjnYs9no3X/tRvXLCA7A0jebjqQBg91CamveU0Ou5Cz7uzR5OUsGNuyIFLZSXc2v+WGhjGAEyNSO9Mqwl+Lm8huyzmiwtoyIfMWsKTHbp4iQwqAWkQYcmMTXip/+lJOVi3yQSNOs5o7GyWsPtKZRglUs2cVnhe6dk0Ke/y8j+1MevmBnvZ1SQQoOpAgMBAAGjYzBhMA8GA1UdEwEB/wQFMAMBAf8wHQYDVR0OBBYEFHKswdeMDNW5PgtBsXnjJLEdoEotMB8GA1UdIwQYMBaAFHKswdeMDNW5PgtBsXnjJLEdoEotMA4GA1UdDwEB/wQEAwIBBjANBgkqhkiG9w0BAQ0FAAOCAgEAhjObhPicGpi1iXbixX4yNIQj39XWnbY4f1j/SsSkQFBqnFF6vfleyaf4YridawGJcrXv1iX/KOeFLs02+f/rTH+wDmWs8a0mImyqOVW/Vn4gs/oSHu2ynTr/l9exvV0CLAqS7GPSj1CZ+j5gaFsq/NQxGImAHr/zr5E/XIgkwyF9PwGBAnO7QRj6n5au3swm0S+KqNSdaRtQkq61yZKdHxGS6K2bQAx88gWqWmiQ+P6XqKBn87+zTe5PsAqwvyM1sd9/oa0IF58o6g48dnxnpdMLs9KbB3/Rzh3n33JoQkjg2ZXyXk8fhefdAr18YKrmL9aX9q2GK1bnSGUPJkzbMbLIKpkAyboXG/zdbPDg3B7keZGdCgXrrBl1zoP3klieqclQJ0gWMVx5IbJfo/MmtgxbVNtd/CezXAESaCaApBQVC0U9GUVvekN6OrBYhkwA+HVbmF1fRznL05gV091Uc2iYOV+hiNrAJHvXuPxPVgqd2Mrx+9xc8VGOT6jGWkGAOEHbW1uVeZNcWTsHg9eQbRwiSUouR7zrMy+be/xMDloYJLE/94VuoGS8/Z2FS95HZ183J82Ihf2F2zsK485cmY4Unipq98yiHWtRWbaihQe1Dzfp1Av1U9gAMbOL0ounKC0dxstpNqfzC+z9nBwQpAviqUzghQIom9Q6aDk4gZ8=";

	#endregion
}
