using Lacuna.Pki;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;

namespace PkiSuiteAspNetMvcSample.Models.Sdk {
	public class ValidationResultsModel {
		public List<ValidationItemModel> PassedChecks { get; set; }
		public List<ValidationItemModel> Errors { get; set; }
		public List<ValidationItemModel> Warnings { get; set; }
		public int ChecksPerformed {
			get {
				return PassedChecks.Count + Errors.Count + Warnings.Count;
			}
		}
		public bool IsValid {
			get {
				return Errors.Count == 0;
			}
		}
		public bool HasErrors {
			get {
				return this.Errors.Count > 0;
			}
		}
		public bool HasWarnings {
			get {
				return this.Warnings.Count > 0;
			}
		}

		public ValidationResultsModel(ValidationResults vr) {
			PassedChecks = vr.PassedChecks.Select(i => new ValidationItemModel(i)).ToList();
			Warnings = vr.Warnings.Select(i => new ValidationItemModel(i)).ToList();
			Errors = vr.Errors.Select(i => new ValidationItemModel(i)).ToList();
		}

		public override string ToString() {
			return ToString(0);
		}

		public string ToString(int identationLevel) {
			var tab = new string('\t', identationLevel);
			var text = new StringBuilder();
			text.Append(getSummary(identationLevel));
			if (Errors.Count > 0) {
				text.AppendLine();
				text.AppendLine(tab + "Errors:");
				text.Append(string.Join(Environment.NewLine, Errors.Select(e => tab + "- " + e.ToString(identationLevel)).ToArray()));
			}
			if (Warnings.Count > 0) {
				text.AppendLine();
				text.AppendLine(tab + "Warnings:");
				text.Append(string.Join(Environment.NewLine, Warnings.Select(w => tab + "- " + w.ToString(identationLevel)).ToArray()));
			}
			if (PassedChecks.Count > 0) {
				text.AppendLine();
				text.AppendLine(tab + "Passed checks:");
				text.Append(string.Join(Environment.NewLine, PassedChecks.Select(e => tab + "- " + e.ToString(identationLevel)).ToArray()));
			}
			return text.ToString();
		}

		public string getSummary(int identationLevel) {
			var tab = new string('\t', identationLevel);
			var text = new StringBuilder();
			text.Append(tab + "Validation results: ");
			if (ChecksPerformed == 0) {
				text.Append("no checks performed");
			} else {
				text.AppendFormat(string.Format("{0} checks performed", ChecksPerformed));
				if (Errors.Count > 0) {
					text.AppendFormat(string.Format(", {0} errors", Errors.Count));
				}
				if (Warnings.Count > 0) {
					text.AppendFormat(string.Format(", {0} warnings", Warnings.Count));
				}
				if (PassedChecks.Count > 0) {
					if (Errors.Count == 0 && Warnings.Count == 0) {
						text.Append(", all passed");
					} else {
						text.AppendFormat(string.Format(", {0} passed", PassedChecks.Count));
					}
				}
			}
			return text.ToString();
		}
	}

	public class ValidationItemModel {
		public ValidationItemTypes Type { get; set; }
		public string Message { get; set; }
		public string Detail { get; set; }
		public ValidationResultsModel InnerValidationResults { get; set; }

		public ValidationItemModel(ValidationItem vi) {
			Type = vi.Type;
			Message = vi.Message;
			Detail = vi.Detail;
			InnerValidationResults = vi.InnerValidationResults != null ? new ValidationResultsModel(vi.InnerValidationResults) : null;
		}

		public override string ToString() {
			return ToString(0);
		}

		public string ToString(int identationLevel) {
			var text = new StringBuilder();
			text.Append(Message);
			if (!String.IsNullOrEmpty(Detail)) {
				text.AppendFormat(" ({0})", Detail);
			}
			if (InnerValidationResults != null) {
				text.AppendLine();
				text.Append(InnerValidationResults.ToString(identationLevel + 1));
			}
			return text.ToString();
		}
	}
}