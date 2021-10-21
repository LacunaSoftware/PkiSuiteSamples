using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PkiSuiteAspNetSpaSample.Models.Sdk {
	public class XmlNFeSignatureCompleteRequest {
		public string TransferDataId { get; set; }
		public byte[] Signature { get; set; }
	}
}
