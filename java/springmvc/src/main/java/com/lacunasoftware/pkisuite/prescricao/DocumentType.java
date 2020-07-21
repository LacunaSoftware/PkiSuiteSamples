package com.lacunasoftware.pkisuite.prescricao;

public enum DocumentType {
	PRESCRICAO_MEDICAMENTO("2.16.76.1.12.1.1"),
	ATESTADO_MEDICO("2.16.76.1.12.1.2"),
	SOLICITACAO_EXAME("2.16.76.1.12.1.3"),
	LAUDO_LABORATORIAL("2.16.76.1.12.1.4"),
	SUMARIO_ALTA("2.16.76.1.12.1.5"),
	REGISTRO_ATENDIMENTO_CLINICO("2.16.76.1.12.1.6"),
	DISPENSACAO_MEDICAMENTO("2.16.76.1.12.1.7"),
	VACINACAO("2.16.76.1.12.1.8"),
	RELATORIO_MEDICO("2.16.76.1.12.1.11");

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
