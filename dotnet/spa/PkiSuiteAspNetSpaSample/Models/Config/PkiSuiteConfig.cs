using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PkiSuiteAspNetSpaSample.Models {
	public class PkiSuiteConfig {
		public string SdkLicense { get; set; }
		public string WebPkiLicense { get; set; }
		public RestPkiConfig RestPki { get; set; }
		public RestPkiCoreConfig RestPkiCore { get; set; }
	}
}
