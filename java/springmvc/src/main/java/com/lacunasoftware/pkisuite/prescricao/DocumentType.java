package com.lacunasoftware.pkisuite.prescricao;

public enum DocumentType {
	PRESCRICAO_MEDICAMENTO("2_16_76_1_12_1_1"),
	ATESTADO_MEDICO("2_16_76_1_12_1_2"),
	SOLICITACAO_EXAME("2_16_76_1_12_1_3"),
	LAUDO_LABORATORIAL("2_16_76_1_12_1_4"),
	SUMARIO_ALTA("2_16_76_1_12_1_5"),
	REGISTRO_ATENDIMENTO_CLINICO("2_16_76_1_12_1_6"),
	DISPENSACAO_MEDICAMENTO("2_16_76_1_12_1_7"),
	VACINACAO("2_16_76_1_12_1_8"),
	RELATORIO_MEDICO("2_16_76_1_12_1_11");

	private String value;

	DocumentType(String value) {
		this.value = value;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}
}
