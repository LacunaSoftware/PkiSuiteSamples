using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PkiSuiteAspNetMvcSample.Models.WebPki {
	public class SignatureStartModel {
		public byte[] CertThumb { get; set; }
		public string CertThumbBase64 {
			get {
				return CertThumb != null ? Convert.ToBase64String(CertThumb) : "";
			}
			set {
				CertThumb = !string.IsNullOrEmpty(value) ? Convert.FromBase64String(value) : null;
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
	}
}