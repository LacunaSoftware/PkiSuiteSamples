using Lacuna.Pki.BrazilTrustServices;
using System.Collections.Generic;

namespace PkiSuiteAspNetMvcSample.Models.Sdk {
	public class PadesCloudHubModel {
		public List<TrustServiceAuthParameters> Services { get; set; }
		public string Cpf { get; set; }
	}
}