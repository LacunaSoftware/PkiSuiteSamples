package com.lacunasoftware.pkisuite.api.model.signer;

public class SignerBatchCreateRequest {

    // The CPF of the certificate selected by the user on Web PKI. The documents will be created on
    // Signer for a signer with this CPF, so that the public signature does not fail with a
    // "CpfMismatch" when the very same certificate signs them.
    public String cpf;
    // The subject name of the certificate, used as the signer's display name.
    public String name;

    public String getCpf() {
        return cpf;
    }
    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
}
