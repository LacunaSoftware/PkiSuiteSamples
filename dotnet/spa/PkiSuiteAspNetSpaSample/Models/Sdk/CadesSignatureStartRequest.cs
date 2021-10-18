using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PkiSuiteAspNetSpaSample.Models.Sdk {
	public class CadesSignatureStartRequest {

		public bool IsCosign { get; set; }
		public string UserFile { get; set; }
		public byte[] CertContent { get; set; }
		public string CertThumb { get; set; }
	}
}
