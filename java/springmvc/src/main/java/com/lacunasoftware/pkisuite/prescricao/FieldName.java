package com.lacunasoftware.pkisuite.prescricao;

public enum FieldName {
	CRM("2.16.76.1.4.2.2.1"),
	CRM_UF("2.16.76.1.4.2.2.2"),
	CRM_ESPECIALIDADE("2.16.76.1.4.2.2.3"),
	CRF("2.16.76.1.4.2.3.1"),
	CRF_UF("2.16.76.1.4.2.3.1"),
	CRF_ESPECIALIDADE("2.16.76.1.4.2.3.1");

	private String value;

	FieldName(String value) {
		this.value = value;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}
}
