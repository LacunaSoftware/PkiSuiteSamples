using Lacuna.RestPki.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PkiSuiteAspNetMvcSample.Models.RestPki {
	public class CheckModel {
		public PadesSignature Signature { get; set; }
		public string File { get; set; }
	}
}