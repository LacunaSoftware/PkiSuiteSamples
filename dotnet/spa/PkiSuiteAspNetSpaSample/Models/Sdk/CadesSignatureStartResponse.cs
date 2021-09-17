using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PkiSuiteAspNetSpaSample.Models.Sdk {
	public class CadesSignatureStartResponse {
		public bool Success { get; set; }
		public ValidationResultsModel ValidationResults { get; set; }
		public bool IsCosign { get; set; }
		public string UserFile { get; set; }
		public string CertThumb { get; set; }
		public byte[] CertContent { get; set; }
		public byte[] ToSignHash { get; set; }
		public byte[] ToSignBytes { get; set; }
		public string DigestAlgorithm { get; set; }
	}
}
