using Lacuna.RestPki.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PkiSuiteAspNetMvcSample.Models.RestPki {
	public class OpenSignatureModel<T> {
		public string File { get; set; }
		public T Signature { get; set; }
	}
}