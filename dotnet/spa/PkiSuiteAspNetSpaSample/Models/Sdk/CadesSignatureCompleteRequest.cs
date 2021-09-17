using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PkiSuiteAspNetSpaSample.Models.Sdk {
	public class CadesSignatureCompleteRequest {
		public bool IsCosign { get; set; }
		public string UserFile { get; set; }
		public byte[] Signature { get; set; }
		public byte[] ToSignBytes { get; set; }
		public byte[] CertContent { get; set; }
	}
}
