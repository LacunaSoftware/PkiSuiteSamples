using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PkiSuiteAspNetSpaSample.Models.Rest {
	public class SignatureStartResponse {

		public string Token { get; set; }

		public string UserFile { get; set; }

		public bool Success { get; set; }

		public ValidationResultsModel ValidationResults { get; set; }

	}
}
