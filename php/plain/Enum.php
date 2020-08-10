<?php

require __DIR__ . '/vendor/autoload.php';

class DocumentType
{
    const PRESCRICAO_MEDICAMENTO = '2_16_76_1_12_1_1';
    const ATESTADO_MEDICO = '2_16_76_1_12_1_2';
    const SOLICITACAO_EXAME = '2_16_76_1_12_1_3';
    const LAUDO_LABORATORIAL = '2_16_76_1_12_1_4';
    const SUMARIO_ALTA = '2_16_76_1_12_1_5';
    const REGISTRO_ATENDIMENTO_CLINICO = '2_16_76_1_12_1_6';
    const DISPENSACAO_MEDICAMENTO = '2_16_76_1_12_1_7';
    const VACINACAO = '2_16_76_1_12_1_8';
    const RELATORIO_MEDICO = '2_16_76_1_12_1_11';
}

class FieldName
{
    const CRM = "2_16_76_1_4_2_2_1";
    const CRM_UF = "2_16_76_1_4_2_2_2";
    const CRM_ESPECIALIDADE = "2_16_76_1_4_2_2_3";
    const CRF = "2_16_76_1_4_2_3_1";
    const CRF_UF = "2_16_76_1_4_2_3_1";
    const CRF_ESPECIALIDADE = "2_16_76_1_4_2_3_1";
}
