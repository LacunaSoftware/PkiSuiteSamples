using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PkiSuiteAspNetSpaSample.Models.Sdk {
	public class SignatureCompleteRequest {
		public string TransferDataFileId { get; set; }
		public byte[] Signature { get; set; }
	}
}
