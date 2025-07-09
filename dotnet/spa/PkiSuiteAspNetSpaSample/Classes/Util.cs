using Lacuna.Pki;
using Lacuna.Pki.BrazilTrustServices;
using Lacuna.Pki.Stores;
using Lacuna.RestPki.Api;
using Lacuna.RestPki.Client;
using Microsoft.Extensions.Options;
using PkiSuiteAspNetSpaSample.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Reflection;

namespace PkiSuiteAspNetSpaSample.Classes {
	public class Util {
		private readonly IOptions<RestPkiConfig> _restPkiConfig;
		private readonly IOptions<RestPkiCoreConfig> _restPkiCoreConfig;
		private readonly StorageMock _storageMock;

		public Util(IOptions<RestPkiConfig> restPkiConfig, IOptions<RestPkiCoreConfig> restPkiCoreConfig, StorageMock storageMock)
		{
			_restPkiConfig = restPkiConfig;
			_restPkiCoreConfig = restPkiCoreConfig;
			_storageMock = storageMock;
		}

		#region REST PKI

		public RestPkiClient GetRestPkiClient()
		{
			var accessToken = _restPkiConfig.Value.AccessToken;
			if (string.IsNullOrEmpty(accessToken) || accessToken.Contains(" API "))
			{
				throw new Exception("The API access token was not set! Hint: to run this sample you must generate an API access token on the REST PKI website and paste it on the web.config file");
			}
			var endpoint = _restPkiConfig.Value.Endpoint;
			if (string.IsNullOrEmpty(endpoint))
			{
				endpoint = "https://pki.rest/";
			}
			return new RestPkiClient(endpoint, accessToken);
		}

		/*
		* This method is called by all pages to determine the security context to be used.
		* 
		* Security contexts dictate which root certification authorities are trusted during
		* certificate validation. In your API calls, you can use one of the standard security
		* contexts or reference one of your custom contexts.
		*/
		public static Guid GetSecurityContextId()
		{
#if DEBUG
			/*
				* Lacuna Test PKI (for development purposes only!)
				* 
				* This security context trusts ICP-Brasil certificates as well as certificates on
				* Lacuna Software's test PKI. Use it to accept the test certificates provided by
				* Lacuna Software.
				* 
				* THIS SHOULD NEVER BE USED ON A PRODUCTION ENVIRONMENT!
				*/
			return StandardSecurityContexts.LacunaTest;
			// Notice for On Premises users: this security context might not exist on your installation,
			// if you encounter an error please contact developer support.
#else
		// In production, accepting only certificates from ICP-Brasil
		return Lacuna.RestPki.Api.StandardSecurityContexts.PkiBrazil;
#endif
		}

		#endregion

		#region PKI SDK

		public static string PkiLicensePath {
			get {
				var assemblyPath = Assembly.GetExecutingAssembly().CodeBase;
				if (assemblyPath.StartsWith("file://", StringComparison.OrdinalIgnoreCase))
				{
					assemblyPath = assemblyPath.Substring(8);
				}
				return Path.Combine(Path.GetDirectoryName(assemblyPath), "LacunaPkiLicense.config");
			}
		}

		internal INonceStore GetNonceStore()
		{
			/*
				For simplification purposes, we're using the FileSystemNonceStore, which stores nonces as
				0-byte files on a local filesystem folder. In a real application, the nonces would typically
				be stored on the database. If you application uses Entity Framework, you can easily change this
				code to store nonces on your database with the EntityFrameworkStore class (from the optional
				Nuget package "Lacuna PKI Entity Framework Connector").
			 */
			return new FileSystemNonceStore(_storageMock.AppDataPath);
		}


		/*
			This method returns the "trust arbitrator" to be used on signatures and authentications. A trust
			arbitrator determines which root certificates shall be trusted during certificate and signature
			validation.
			*/
		public static ITrustArbitrator GetTrustArbitrator()
		{
			// We start by trusting the ICP-Brasil roots and the roots registered as trusted on the host
			// Windows Server.
			var trustArbitrator = new LinkedTrustArbitrator(TrustArbitrators.PkiBrazil, TrustArbitrators.Windows);
#if DEBUG
			// For development purposes, we also trust in Lacuna Software's test certificates.
			var lacunaRoot = Lacuna.Pki.PKCertificate.Decode(Convert.FromBase64String("MIIFnjCCA4agAwIBAgIBATANBgkqhkiG9w0BAQ0FADBfMQswCQYDVQQGEwJCUjETMBEGA1UEChMKSUNQLUJyYXNpbDEdMBsGA1UECxMUTGFjdW5hIFNvZnR3YXJlIC0gTFMxHDAaBgNVBAMTE0xhY3VuYSBSb290IFRlc3QgdjMwIBcNMjQxMjE2MjA0MjEwWhgPMjA3NDEyMTYwMzAwMDBaMF8xCzAJBgNVBAYTAkJSMRMwEQYDVQQKEwpJQ1AtQnJhc2lsMR0wGwYDVQQLExRMYWN1bmEgU29mdHdhcmUgLSBMUzEcMBoGA1UEAxMTTGFjdW5hIFJvb3QgVGVzdCB2MzCCAiIwDQYJKoZIhvcNAQEBBQADggIPADCCAgoCggIBAN2j+WJCzBe0/PCCXClKQy89kfdFmSyH3wYDsMyUSIBFroeRhv5DEUWMIJcq0fx8bwXIfHv7FQEjPO91GyS3ke2f9uvT0qnAvB2hlwCqF5/eU+LuJYtgxc7vW3QCiUNsYkiHysnIvOB46YwmwOMcpi01eQjrkgsYBzBa4TYZymhD28oGT9VEXepVpzcxF/H1zAnBHrpQRTPz5AjsJ7x3IKOLWFScTCtTnpp4HZslBvnUIwiTQNu4HgsUOekRfDbVwdftcwFHFmW5Z3w6zJvJ/b1x7iv7+g2lskWBNzEV769KoOT6+uwr1zk6Zwv/Oeze22GXuWrKKqLVanvgSCMPSFFlwGYOyjfpXC6Ccwe7Ptnb3cfhvX4V3BtXxkcBvfT34jhT6eoqT6RPqCtA18YTF9qLXHxnQ/AmqJdgsu0+JBWGIQWj95/qv7Y2Q47/7Q6866Bp6SbWDWLd161l4IYe/R9DE8gsujGey9gydiNrtzxNW3BrtssmjnYs9no3X/tRvXLCA7A0jebjqQBg91CamveU0Ou5Cz7uzR5OUsGNuyIFLZSXc2v+WGhjGAEyNSO9Mqwl+Lm8huyzmiwtoyIfMWsKTHbp4iQwqAWkQYcmMTXip/+lJOVi3yQSNOs5o7GyWsPtKZRglUs2cVnhe6dk0Ke/y8j+1MevmBnvZ1SQQoOpAgMBAAGjYzBhMA8GA1UdEwEB/wQFMAMBAf8wHQYDVR0OBBYEFHKswdeMDNW5PgtBsXnjJLEdoEotMB8GA1UdIwQYMBaAFHKswdeMDNW5PgtBsXnjJLEdoEotMA4GA1UdDwEB/wQEAwIBBjANBgkqhkiG9w0BAQ0FAAOCAgEAhjObhPicGpi1iXbixX4yNIQj39XWnbY4f1j/SsSkQFBqnFF6vfleyaf4YridawGJcrXv1iX/KOeFLs02+f/rTH+wDmWs8a0mImyqOVW/Vn4gs/oSHu2ynTr/l9exvV0CLAqS7GPSj1CZ+j5gaFsq/NQxGImAHr/zr5E/XIgkwyF9PwGBAnO7QRj6n5au3swm0S+KqNSdaRtQkq61yZKdHxGS6K2bQAx88gWqWmiQ+P6XqKBn87+zTe5PsAqwvyM1sd9/oa0IF58o6g48dnxnpdMLs9KbB3/Rzh3n33JoQkjg2ZXyXk8fhefdAr18YKrmL9aX9q2GK1bnSGUPJkzbMbLIKpkAyboXG/zdbPDg3B7keZGdCgXrrBl1zoP3klieqclQJ0gWMVx5IbJfo/MmtgxbVNtd/CezXAESaCaApBQVC0U9GUVvekN6OrBYhkwA+HVbmF1fRznL05gV091Uc2iYOV+hiNrAJHvXuPxPVgqd2Mrx+9xc8VGOT6jGWkGAOEHbW1uVeZNcWTsHg9eQbRwiSUouR7zrMy+be/xMDloYJLE/94VuoGS8/Z2FS95HZ183J82Ihf2F2zsK485cmY4Unipq98yiHWtRWbaihQe1Dzfp1Av1U9gAMbOL0ounKC0dxstpNqfzC+z9nBwQpAviqUzghQIom9Q6aDk4gZ8="));
			trustArbitrator.Add(new TrustedRoots(lacunaRoot));
			// For development purposes, we also trust in SOLUTI's test certificates.
			var solutiTestRoot = Lacuna.Pki.PKCertificate.Decode(Convert.FromBase64String("MIIFqjCCA5KgAwIBAgIIS9uixHDoFa8wDQYJKoZIhvcNAQENBQAwPTELMAkGA1UEBhMCQlIxEzARBgNVBAoTCklDUC1CcmFzaWwxGTAXBgNVBAMTEEFDIFJBSVogdGVzdGUgdjIwHhcNMTQwMjA0MTkwMDU3WhcNMjQwMjA0MTkwMDU3WjA9MQswCQYDVQQGEwJCUjETMBEGA1UEChMKSUNQLUJyYXNpbDEZMBcGA1UEAxMQQUMgUkFJWiB0ZXN0ZSB2MjCCAiIwDQYJKoZIhvcNAQEBBQADggIPADCCAgoCggIBAKq/E45POudJct3XbsGSfeidHQmP3SAgKVt7URE3erLncOoIwEdgm2++cnSzuTqNSHo9F27eMtvvpsoizLUwEcZEwtkocijiN7FSLigdaJ/Ulb8ZNUcsvOHL82p+allTUCP9cJjmrkN6HwwtxfQGirvmP2Kq19mNJlJumTmD3w4Ar7pX1mi4kK7Fokud/000wrXydUfVcN3VWH2Nv0pioY+olsHi/AUXAfdlO4V7jtrWh3ZIlZJQIsZ0WNOS9NLxr4q7urubl2K23NAEVl5CCvVC3RJLCZdgH307y9fa7ajvKvrCls05T74aPTm0CoCVSQxP+L6UUIpz9U3aDTOILSfk8kx+aCN7K7XLZ5fG7ncIEy0JPgIv/UNftyXRrp4s+srG6oXR4fBf0komQ8UAk5tvdS3KNlfN/V4oLTnyQdK/hhH42hpCzHNlGTwomJKQnszFlozy1XuUYi0NuYZya+pqmG/GUkIDBoq6++W7rBHvZtjR1kjW9JkUTF12AvwwYXPWkUMJGWBUaWoyiSOf8fGoMp6aedhGBtGRFDTBFpNCBEj0lRVc2N0k+irOdTwsvrwhKQkeQhehULtNInsXfpUFmKKtfbQCym2ejmtXU4pCKI+3D2dc182Max+KIq3kAbK1FsjtSAtYUm5qlnWAYPufjWh60S1PS7ydu8WS+uyfAgMBAAGjga0wgaowHQYDVR0OBBYEFEc20cVEy8tlLaDGBYBZWVp2exxtMA8GA1UdEwEB/wQFMAMBAf8wHwYDVR0jBBgwFoAURzbRxUTLy2UtoMYFgFlZWnZ7HG0wRwYDVR0fBEAwPjA8oDqgOIY2aHR0cDovL2NjZC5hY3NvbHV0aS5jb20uYnIvdGVzdGVzL2FjLXJhaXotdGVzdGUtdjIuY3JsMA4GA1UdDwEB/wQEAwIBBjANBgkqhkiG9w0BAQ0FAAOCAgEAmhkzT4DC+5jRYkUuerr+jU6F4DNS+dxdLPFvIDVadLX1VmZ4SfNLiLKDyUZiP8DG0UAoa0lOjb6H8jLJV13bhKmQLYLOgjzAFOjXuTp4PjlbJ686J1f4dJV25ocNDjkX/z+I8OdaHjeuuv6lE5TjqztK18Y1wULFEGDgU7W81FyMOJB7+Ft1M88H+WVdkhY4nP4lHjCo4+vlq33WPwH9ov3GBGp74nTZko8AoygN2XB8csTC99LRlkmzQAZVsuBHM2GA0RGewv5YcLTc7cXb/JoIcZdWM2DepM3jAyBe3FLvaFgL/tPwOFNoppt0t0ctt0RMqOLRSncuHze75a1spjyNvAAfhy7uyn1+2+Vre7hVQnE8os6fmM0N/r5QCiQxOb7s08FwM2cUIHQ93Chxgjdil0RS9drUI2TQgHxkaGxQm1ufI4sUFj+R8e++P40sLWVjSMPU9jH3F8Stp/a+OCNao5wcr3OusmMUzmK6lEn7WUP0tJlWisoHlkpyWRiJO2LItwcOx4bggDGzSb0OmxP2SQEAx8yGbZ5HSMy655vp7oNyvj7336+1oxNPpC4a6rNwcLwPD+NwqO3U5VfqdzaxzIco8IRbuaoe2u/UXxuUwOUuwWvEOkbvdER9hdvhTcaN32mmA0Kect6WnDtU8JBxb7O8UQHjah7b6at9KWg="));
			trustArbitrator.Add(new TrustedRoots(solutiTestRoot));
#endif
			return trustArbitrator;
		}

		public static TrustServicesOptions GetTrustServicesOptions()
		{
			var options = new TrustServicesOptions();

			// Config BirdId credentials.
			if (!string.IsNullOrEmpty(ConfigurationManager.AppSettings["TrustServices:BirdId:ClientId"]) &&
				!string.IsNullOrEmpty(ConfigurationManager.AppSettings["TrustServices:BirdId:ClientSecret"]))
			{
				options.Services.Add(new TrustServiceConfig()
				{
					Service = TrustServiceName.BirdID,
					ClientId = ConfigurationManager.AppSettings["TrustServices:BirdId:ClientId"],
					ClientSecret = ConfigurationManager.AppSettings["TrustServices:BirdId:ClientSecret"],
				});
			}

			// Config ViDaaS credentials.
			if (!string.IsNullOrEmpty(ConfigurationManager.AppSettings["TrustServices:ViDaaS:ClientId"]) &&
				!string.IsNullOrEmpty(ConfigurationManager.AppSettings["TrustServices:ViDaaS:ClientSecret"]))
			{
				options.Services.Add(new TrustServiceConfig()
				{
					Service = TrustServiceName.VIDaaS,
					ClientId = ConfigurationManager.AppSettings["TrustServices:ViDaaS:ClientId"],
					ClientSecret = ConfigurationManager.AppSettings["TrustServices:ViDaaS:ClientSecret"],
				});
			}

			// Config NeoId credentials.
			if (!string.IsNullOrEmpty(ConfigurationManager.AppSettings["TrustServices:NeoId:ClientId"]) &&
				!string.IsNullOrEmpty(ConfigurationManager.AppSettings["TrustServices:NeoId:ClientSecret"]))
			{
				options.Services.Add(new TrustServiceConfig()
				{
					Service = TrustServiceName.NeoID,
					ClientId = ConfigurationManager.AppSettings["TrustServices:NeoId:ClientId"],
					ClientSecret = ConfigurationManager.AppSettings["TrustServices:NeoId:ClientSecret"],
				});
			}

			// Config RemoteId credentials.
			if (!string.IsNullOrEmpty(ConfigurationManager.AppSettings["TrustServices:RemoteId:ClientId"]) &&
				!string.IsNullOrEmpty(ConfigurationManager.AppSettings["TrustServices:RemoteId:ClientSecret"]))
			{
				options.Services.Add(new TrustServiceConfig()
				{
					Service = TrustServiceName.RemoteID,
					ClientId = ConfigurationManager.AppSettings["TrustServices:RemoteId:ClientId"],
					ClientSecret = ConfigurationManager.AppSettings["TrustServices:RemoteId:ClientSecret"],
				});
			}

			// Config SafeId credentials.
			if (!string.IsNullOrEmpty(ConfigurationManager.AppSettings["TrustServices:SafeId:ClientId"]) &&
				!string.IsNullOrEmpty(ConfigurationManager.AppSettings["TrustServices:SafeId:ClientSecret"]))
			{
				options.Services.Add(new TrustServiceConfig()
				{
					Service = TrustServiceName.SafeID,
					ClientId = ConfigurationManager.AppSettings["TrustServices:SafeId:ClientId"],
					ClientSecret = ConfigurationManager.AppSettings["TrustServices:SafeId:ClientSecret"],
				});
			}

			// BirdId HML credentials
			options.Services.Add(new TrustServiceConfig()
			{
				Service = "BirdID (Homologação)",
				Provider = "SOLUTI",
				BadgeUrl = "https://cdn.lacunasoftware.com/img/psc/birdid-hml.png",
				Endpoint = "https://apihom.birdid.com.br/",
				ClientId = "ae02a53062db1c845df4a57b8e47dbbf047378b4",
				ClientSecret = "f36c483e0966c4eaecd4d2d167f742e3c2c12fd0",
				ProtocolVariant = "BirdID",
			});

			return options;
		}

		#endregion

		#region REST PKI Core

		public IRestPkiService GetRestPkiService()
		{
			return RestPkiServiceFactory.GetService(GetRestPkiOptions());
		}

		public RestPkiOptions GetRestPkiOptions()
		{
			var apiKey = _restPkiCoreConfig.Value.ApiKey;
			if (string.IsNullOrEmpty(apiKey) || apiKey.Contains(" API KEY "))
			{
				throw new Exception("The API key was not set! Hint: to run this sample you must generate an API key on the REST PKI Core website and paste it on the web.config file");
			}
			var endpoint = _restPkiCoreConfig.Value.Endpoint;
			if (string.IsNullOrEmpty(endpoint))
			{
				endpoint = "https://core.pki.rest/";
			}

			var options = new RestPkiOptions
			{
				Endpoint = endpoint,
				ApiKey = apiKey
			};
			return options;
		}

		#endregion

		public static string JoinStringsPt(IEnumerable<string> strings)
		{
			var text = new System.Text.StringBuilder();
			var count = strings.Count();
			var index = 0;
			foreach (var s in strings)
			{
				if (index > 0)
				{
					if (index < count - 1)
					{
						text.Append(", ");
					}
					else
					{
						text.Append(" e ");
					}
				}
				text.Append(s);
				++index;
			}
			return text.ToString();
		}
	}
}