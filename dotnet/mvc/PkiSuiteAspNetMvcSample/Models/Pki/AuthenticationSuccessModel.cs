using Lacuna.Pki;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PkiSuiteAspNetMvcSample.Models.Pki {
	public class AuthenticationSuccessModel {
		public PKCertificate UserCert { get; set; }
	}
}