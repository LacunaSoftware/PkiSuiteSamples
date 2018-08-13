using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PkiSuiteAspNetMvcSample.Models.RestPki {
	public class CadesSignatureModel {
		public string Token { get; set; }
		public string UserFile { get; set; }
		public string CmsFile { get; set; }
	}
}