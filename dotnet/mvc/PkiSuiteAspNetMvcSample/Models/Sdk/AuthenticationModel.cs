using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PkiSuiteAspNetMvcSample.Models.Sdk {
	public class AuthenticationModel {

		public byte[] Nonce { get; set; }
		public string NonceBase64 {
			get {
				return Nonce != null ? Convert.ToBase64String(Nonce) : "";
			}
			set {
				Nonce = !string.IsNullOrEmpty(value) ? Convert.FromBase64String(value) : null;
			}
		}

		public string DigestAlgorithm { get; set; }

		public byte[] Certificate { get; set; }
		public string CertificateBase64 {
			get {
				return Certificate != null ? Convert.ToBase64String(Certificate) : "";
			}
			set {
				Certificate = !string.IsNullOrEmpty(value) ? Convert.FromBase64String(value) : null;
			}
		}

		public byte[] Signature { get; set; }
		public string SignatureBase64 {
			get {
				return Signature != null ? Convert.ToBase64String(Signature) : "";
			}
			set {
				Signature = !string.IsNullOrEmpty(value) ? Convert.FromBase64String(value) : null;
			}
		}
	}
}