using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;

namespace PkiSuiteAspNetSpaSample.Classes {

	public static class EnumHelper {
		public static string GetValue(this Enum enumValue)
		{
			var type = enumValue.GetType();
			var member = type.GetMember(enumValue.ToString());
			var attributes = member[0].GetCustomAttributes(typeof(ValueAttribute), false);
			if (attributes == null || attributes.Length < 1)
			{
				return null;
			}
			var valueAttr = attributes[0] as ValueAttribute;
			return valueAttr?.Value;
		}
		public static T ToEnum<T>(this string value)
		{
			return (T)Enum.Parse(typeof(T), value, true);
		}
		public static T ToEnum<T>(this int value)
		{
			var name = Enum.GetName(typeof(T), value);
			return name.ToEnum<T>();
		}
	}


	public class ValueAttribute : Attribute {
		public string Value { get; }

		public ValueAttribute(string value)
		{
			Value = value;
		}
	}

}
