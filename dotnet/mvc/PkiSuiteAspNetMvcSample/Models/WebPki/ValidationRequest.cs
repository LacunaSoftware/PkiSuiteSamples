using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PkiSuiteAspNetMvcSample.Models.WebPki {
	public class ValidationRequest {
		public string OriginalMessage { get; set; }
		public byte[] SignedMessage { get; set; }
		public byte[] Certificate { get; set; }
	}
}