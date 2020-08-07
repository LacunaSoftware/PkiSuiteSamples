using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PkiSuiteAspNetMvcSample.Api.Models.Sdk {
	public class BatchCadesSignatureCompleteRequest {
		public int Id { get; set; }

		public byte[] Signature { get; set; }
		public string SignatureBase64 {
			get {
				return Signature != null ? Convert.ToBase64String(Signature) : "";
			}
			set {
				Signature = !string.IsNullOrEmpty(value) ? Convert.FromBase64String(value) : null;
			}
		}

		public byte[] CertContent { get; set; }
		public string CertContentBase64 {
			get {
				return CertContent != null ? Convert.ToBase64String(CertContent) : "";
			}
			set {
				CertContent = !string.IsNullOrEmpty(value) ? Convert.FromBase64String(value) : null;
			}
		}

		public byte[] ToSignBytes { get; set; }
		public string ToSignBytesBase64 {
			get {
				return ToSignBytes != null ? Convert.ToBase64String(ToSignBytes) : "";
			}
			set {
				ToSignBytes = !string.IsNullOrEmpty(value) ? Convert.FromBase64String(value) : null;
			}
		}

	}
}