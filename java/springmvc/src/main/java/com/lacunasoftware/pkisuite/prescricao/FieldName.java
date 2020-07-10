package com.lacunasoftware.pkisuite.prescricao;

public enum FieldName {
	CRM("2_16_76_1_4_2_2_1"),
	CRM_UF("2_16_76_1_4_2_2_2"),
	CRM_ESPECIALIDADE("2_16_76_1_4_2_2_3"),
	CRF("2_16_76_1_4_2_3_1"),
	CRF_UF("2_16_76_1_4_2_3_1"),
	CRF_ESPECIALIDADE("2_16_76_1_4_2_3_1");

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
