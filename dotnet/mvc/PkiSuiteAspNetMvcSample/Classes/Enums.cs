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

		[Value("2_16_76_1_12_1_1")]
		PrescricaoMedicamento = 0,

		[Value("2_16_76_1_12_1_2")]
		AtestadoMedico,

		[Value("2_16_76_1_12_1_3")]
		SolicitacaoExame,

		[Value("2_16_76_1_12_1_4")]
		LaudoLaboratorial,

		[Value("2_16_76_1_12_1_5")]
		SumarioAlta,

		[Value("2_16_76_1_12_1_6")]
		RegistroAtendimentoClinico,

		[Value("2_16_76_1_12_1_7")]
		DispensacaoMedicamento,

		[Value("2_16_76_1_12_1_8")]
		Vacinacao,

		[Value("2_16_76_1_12_1_11")]
		RelatorioMedico,
	}

	public enum FieldName {

		[Value("2_16_76_1_4_2_2_1")]
		Crm = 0,

		[Value("2_16_76_1_4_2_2_2")]
		CrmUF,

		[Value("2_16_76_1_4_2_2_3")]
		CrmEspecialidade,

		[Value("2_16_76_1_4_2_3_1")]
		Crf,

		[Value("2_16_76_1_4_2_3_2")]
		CrfUF,

		[Value("2_16_76_1_4_2_3_3")]
		CrfEspecialidade,
	}
}
