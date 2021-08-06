using Pki = Lacuna.Pki;
using RestPki = Lacuna.RestPki.Client;
using PkiSuiteAspNetSpaSample.Models;

namespace PkiSuiteAspNetSpaSample.Classes {
	public static class ModelConversions {
		public static ValidationItemModel ToModel(this Pki.ValidationItem vi)
		{
			var model = new ValidationItemModel()
			{
				Type = vi.Type.ToString(),
				Message = vi.Message,
				Detail = vi.Detail,
			};

			if (vi.InnerValidationResults != null)
			{
				model.InnerValidationResults = vi.InnerValidationResults.ToModel();
			}

			return model;
		}
		
		public static ValidationItemModel ToModel(this RestPki.ValidationItem vi)
		{
			var model = new ValidationItemModel()
			{
				Type = vi.Type.ToString(),
				Message = vi.Message,
				Detail = vi.Detail,
			};

			if (vi.InnerValidationResults != null)
			{
				model.InnerValidationResults = vi.InnerValidationResults.ToModel();
			}

			return model;
		}

		public static ValidationResultsModel ToModel(this Pki.ValidationResults vr)
		{
			return new ValidationResultsModel()
			{
				PassedChecks = vr.PassedChecks.ConvertAll(i => i.ToModel()),
				Warnings = vr.Warnings.ConvertAll(i => i.ToModel()),
				Errors = vr.Errors.ConvertAll(i => i.ToModel()),
			};
		}

		public static ValidationResultsModel ToModel(this RestPki.ValidationResults vr)
		{
			return new ValidationResultsModel()
			{
				PassedChecks = vr.PassedChecks.ConvertAll(i => i.ToModel()),
				Warnings = vr.Warnings.ConvertAll(i => i.ToModel()),
				Errors = vr.Errors.ConvertAll(i => i.ToModel()),
			};
		}
	}
}
