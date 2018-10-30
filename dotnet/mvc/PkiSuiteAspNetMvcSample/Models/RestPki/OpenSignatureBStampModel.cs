using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PkiSuiteAspNetMvcSample.Models.RestPki {
	public class OpenSignatureBStampModel<T> : OpenSignatureModel<T> {
		public string BStampIndexFile { get; set; }
		public string AuditPackageFile { get; set; }
	}
}