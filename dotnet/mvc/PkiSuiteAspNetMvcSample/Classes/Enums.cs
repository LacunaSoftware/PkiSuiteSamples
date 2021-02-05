using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;

namespace PkiSuiteAspNetMvcSample.Classes {

	public static class EnumHelper {
		public static string GetValue(this Enum enumValue) {
			var type = enumValue.GetType();
			var member = type.GetMember(enumValue.ToString());
			var attributes = member[0].GetCustomAttributes(typeof(ValueAttribute), false);
			if (attributes == null || attributes.Length < 1) {
				return null;
			}
			var valueAttr = attributes[0] as ValueAttribute;
			return valueAttr?.Value;
		}
	}


	public class ValueAttribute : Attribute {
		public string Value { get; }

		public ValueAttribute(string value) {
			Value = value;
		}
	}

	enum DocumentType {

		[Value("2.16.76.1.12.1.1")]
		PrescricaoMedicamento = 0,

		[Value("2.16.76.1.12.1.2")]
		AtestadoMedico,

		[Value("2.16.76.1.12.1.3")]
		SolicitacaoExame,

		[Value("2.16.76.1.12.1.4")]
		LaudoLaboratorial,

		[Value("2.16.76.1.12.1.5")]
		SumarioAlta,

		[Value("2.16.76.1.12.1.6")]
		RegistroAtendimentoClinico,

		[Value("2.16.76.1.12.1.7")]
		DispensacaoMedicamento,

		[Value("2.16.76.1.12.1.8")]
		Vacinacao,

		[Value("2.16.76.1.12.1.11")]
		RelatorioMedico,
	}

	public enum FieldName {

		[Value("2.16.76.1.4.2.2.1")]
		Crm = 0,

		[Value("2.16.76.1.4.2.2.2")]
		CrmUF,

		[Value("2.16.76.1.4.2.2.3")]
		CrmEspecialidade,

		[Value("2.16.76.1.4.2.3.1")]
		Crf,

		[Value("2.16.76.1.4.2.3.2")]
		CrfUF,

		[Value("2.16.76.1.4.2.3.3")]
		CrfEspecialidade,
	}
}
