using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PkiSuiteAspNetSpaSample.Models.Sdk {
	public class AuthenticationCompleteRequest {
		public byte[] Nonce { get; set; }
		public byte[] Certificate { get; set; }
		public byte[] Signature { get; set; }
	}
}
