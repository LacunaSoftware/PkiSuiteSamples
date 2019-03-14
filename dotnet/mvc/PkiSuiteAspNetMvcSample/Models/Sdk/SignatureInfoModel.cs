using Lacuna.Pki;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PkiSuiteAspNetMvcSample.Models.Sdk {
	public class SignatureInfoModel {
		public string File { get; set; }
		public PKCertificate SignerCertificate { get; set; }
	}
}