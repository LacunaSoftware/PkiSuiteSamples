using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PkiSuiteAspNetSpaSample.Models.Sdk {
	public class AuthenticationCompleteResponse {
		public bool IsValid { get; set; }
		public ValidationResultsModel ValidationResults { get; set; }
		public CertificateModel Certificate { get; set; }
	}
}
