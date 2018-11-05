using Lacuna.RestPki.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PkiSuiteAspNetMvcSample.Models.RestPki {
	public class OpenPadesSignatureBStampModel {
		public string File { get; set; }
		public PadesSignature Signature { get; set; }
		public string BStampIndexFile { get; set; }
		public string AuditPackageFile { get; set; }
	}
}