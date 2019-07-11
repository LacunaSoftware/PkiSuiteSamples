using Lacuna.Pki;
using Lacuna.Pki.Stores;
using Lacuna.RestPki.Api;
using Lacuna.RestPki.Client;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Security.Cryptography;
using System.Text.RegularExpressions;
using System.Web;

namespace PkiSuiteAspNetMvcSample.Classes {
	public class Util {

		#region REST PKI

		public static RestPkiClient GetRestPkiClient() {
			var accessToken = ConfigurationManager.AppSettings["RestPkiAccessToken"];
			if (string.IsNullOrEmpty(accessToken) || accessToken.Contains(" API ")) {
				throw new Exception("The API access token was not set! Hint: to run this sample you must generate an API access token on the REST PKI website and paste it on the web.config file");
			}
			var endpoint = ConfigurationManager.AppSettings["RestPkiEndpoint"];
			if (string.IsNullOrEmpty(endpoint)) {
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
		public static Guid GetSecurityContextId() {
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
				if (assemblyPath.StartsWith("file://", StringComparison.OrdinalIgnoreCase)) {
					assemblyPath = assemblyPath.Substring(8);
				}
				return Path.Combine(Path.GetDirectoryName(assemblyPath), "LacunaPkiLicense.config");
			}
		}

		public static INonceStore GetNonceStore() {
			/*
				For simplification purposes, we're using the FileSystemNonceStore, which stores nonces as
				0-byte files on a local filesystem folder. In a real application, the nonces would typically
				be stored on the database. If you application uses Entity Framework, you can easily change this
				code to store nonces on your database with the EntityFrameworkStore class (from the optional
				Nuget package "Lacuna PKI Entity Framework Connector").
			 */
			return new FileSystemNonceStore(HttpContext.Current.Server.MapPath("~/App_Data"));
		}

		/*
			This method returns the "trust arbitrator" to be used on signatures and authentications. A trust
			arbitrator determines which root certificates shall be trusted during certificate and signature
			validation.
		 */
		public static ITrustArbitrator GetTrustArbitrator() {
			// We start by trusting the ICP-Brasil roots and the roots registered as trusted on the host
			// Windows Server.
			var trustArbitrator = new LinkedTrustArbitrator(TrustArbitrators.PkiBrazil, TrustArbitrators.Windows);
#if DEBUG
			// For development purposes, we also trust in Lacuna Software's test certificates.
			var lacunaRoot = Lacuna.Pki.PKCertificate.Decode(Convert.FromBase64String("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"));
			trustArbitrator.Add(new TrustedRoots(lacunaRoot));
#endif
			return trustArbitrator;
		}

		#endregion

		public static string JoinStringsPt(IEnumerable<string> strings) {
			var text = new System.Text.StringBuilder();
			var count = strings.Count();
			var index = 0;
			foreach (var s in strings) {
				if (index > 0) {
					if (index < count - 1) {
						text.Append(", ");
					}
					else {
						text.Append(" e ");
					}
				}
				text.Append(s);
				++index;
			}
			return text.ToString();
		}

		/*
		 * ------------------------------------
		 * Configuration of the code generation
		 * 
		 * - CodeSize   : size of the code in characters;
		 * - CodeGroups : number of groups to separate the code (must be a proper divisor of the code
		 *                size).
		 * 
		 * Examples
		 * --------
		 * 
		 * - CodeSize = 12, CodeGroups = 3 : XXXX-XXXX-XXXX
		 * - CodeSize = 12, CodeGroups = 4 : XXX-XXX-XXX-XXX
		 * - CodeSize = 16, CodeGroups = 4 : XXXX-XXXX-XXXX-XXXX
		 * - CodeSize = 20, CodeGroups = 4 : XXXXX-XXXXX-XXXXX-XXXXX
		 * - CodeSize = 20, CodeGroups = 5 : XXXX-XXXX-XXXX-XXXX-XXXX
		 * - CodeSize = 25, CodeGroups = 5 : XXXXX-XXXXX-XXXXX-XXXXX-XXXXX
		 * 
		 * Entropy
		 * -------
		 * 
		 * The resulting entropy of the code in bits is the size of the code times 5. Here are some
		 * suggestions:
		 * 
		 * - 12 characters = 60 bits
		 * - 16 characters = 80 bits
		 * - 20 characters = 100 bits
		 * - 25 characters = 125 bits
		 */
		private const int VerificationCodeSize = 16;
		private const int VerificationCodeGroups = 4;

		// This method generates a verification code, without dashes
		public static string GenerateVerificationCode() {
			// String with exactly 32 letters and numbers to be used on the codes. We recommend leaving
			// this value as is.
			const string Alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
			// Allocate a byte array large enough to receive the necessary entropy.
			var bytes = new byte[(int)Math.Ceiling(VerificationCodeSize * 5 / 8.0)];
			// Generate the entropy with a cryptographic number generator.
			using (var rng = RandomNumberGenerator.Create()) {
				rng.GetBytes(bytes);
			}
			// Convert random bytes into bits.
			var bits = new BitArray(bytes);
			// Iterate bits 5-by-5 converting into characters in our alphabet.
			var sb = new System.Text.StringBuilder();
			for (int i = 0; i < VerificationCodeSize; i++) {
				int n = (bits[i * 5] ? 1 : 0) << 4
					| (bits[i * 5 + 1] ? 1 : 0) << 3
					| (bits[i * 5 + 2] ? 1 : 0) << 2
					| (bits[i * 5 + 3] ? 1 : 0) << 1
					| (bits[i * 5 + 4] ? 1 : 0);
				sb.Append(Alphabet[n]);
			}
			return sb.ToString();
		}

		public static string FormatVerificationCode(string code) {
			// Return the code separated in groups.
			var charsPerGroup = VerificationCodeSize / VerificationCodeGroups;
			return string.Join("-", Enumerable.Range(0, VerificationCodeGroups).Select(g => code.Substring(g * charsPerGroup, charsPerGroup)));
		}

		public static string ParseVerificationCode(string formattedCode) {
			if (string.IsNullOrEmpty(formattedCode)) {
				return formattedCode;
			}
			return Regex.Replace(formattedCode, "[^A-Za-z0-9]", "");
		}
	}
}