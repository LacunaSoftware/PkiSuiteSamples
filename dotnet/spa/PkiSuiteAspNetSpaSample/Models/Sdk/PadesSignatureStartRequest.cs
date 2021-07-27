using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PkiSuiteAspNetSpaSample.Models.Sdk {
	public class PadesSignatureStartRequest {

		public string UserFile { get; set; }

		public byte[] CertContent { get; set; }

	}
}
