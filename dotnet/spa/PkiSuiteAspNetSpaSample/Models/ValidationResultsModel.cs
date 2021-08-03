using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PkiSuiteAspNetSpaSample.Models {
	public class ValidationResultsModel {
		public List<ValidationItemModel> PassedChecks { get; set; }
		public List<ValidationItemModel> Errors { get; set; }
		public List<ValidationItemModel> Warnings { get; set; }
		public bool IsValid => !Errors.Any();
	}

	public class ValidationItemModel {
		public string Type { get; set; }
		public string Message { get; set; }
		public string Detail { get; set; }
		public ValidationResultsModel InnerValidationResults { get; set; }
	}
}
