using Lacuna.Pki.BrazilTrustServices;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PkiSuiteAspNetMvcSample.Models.Sdk {
	public class PadesCloudPwdModel {
		public List<TrustServiceInfo> Services { get; set; }
		public string Cpf { get; set; }
	}
}