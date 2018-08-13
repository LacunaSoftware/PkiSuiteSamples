using Lacuna.Pki;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PkiSuiteAspNetMvcSample.Models.Pki {
	public class SignatureInfoModel {
		public string Filename { get; set; }
		public PKCertificate UserCert { get; set; }
	}
}