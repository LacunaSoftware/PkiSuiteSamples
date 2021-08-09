using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PkiSuiteAspNetSpaSample.Models.Sdk {
	public class CadesSignatureCompleteResponse {
		public bool Success { get; set; }
		public ValidationResultsModel ValidationResults { get; set; }
		public string SignedFileId { get; set; }
	}
}
