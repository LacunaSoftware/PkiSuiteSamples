using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PkiSuiteAspNetSpaSample.Models.Sdk {
	public class XmlNFeSignatureStartResponse {
		public bool Success { get; set; }
		public ValidationResultsModel ValidationResults { get; set; }
		public byte[] ToSignHash { get; set; }
		public string TransferDataId { get; internal set; }
		public string DigestAlgorithm { get; internal set; }
	}
}
