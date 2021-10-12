using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PkiSuiteAspNetSpaSample.Models.Sdk {
	public class SignatureStartResponse {
		public byte[] ToSignHash { get; set; }

		public string TransferDataId { get; set; }

		public string DigestAlgorithm { get; set; }

		public bool Success { get; set; }

		public ValidationResultsModel ValidationResults { get; set; }

	}
}
