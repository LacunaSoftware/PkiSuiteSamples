using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PkiSuiteAspNetMvcSample.Api.Models.Sdk {
	public class BatchCadesSignatureStartResponse {

		public byte[] ToSignBytes { get; set; }
		public string ToSignBytesBase64 {
			get {
				return ToSignBytes != null ? Convert.ToBase64String(ToSignBytes) : "";
			}
			set {
				ToSignBytes = !string.IsNullOrEmpty(value) ? Convert.FromBase64String(value) : null;
			}
		}

		public byte[] ToSignHash { get; set; }
		public string ToSignHashBase64 {
			get {
				return ToSignHash != null ? Convert.ToBase64String(ToSignHash) : "";
			}
			set {
				ToSignHash = !string.IsNullOrEmpty(value) ? Convert.FromBase64String(value) : null;
			}
		}

		public string DigestAlgorithmOid { get; set; }
	}
}