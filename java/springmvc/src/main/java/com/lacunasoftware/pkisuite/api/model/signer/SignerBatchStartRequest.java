package com.lacunasoftware.pkisuite.api.model.signer;

public class SignerBatchStartRequest {

    // The document key of the public signature (extracted from the Signer action URL).
    public String id;
    // The Base64-encoded content of the certificate selected by the user on Web PKI.
    public String certContent;

    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }

    public String getCertContent() {
        return certContent;
    }
    public void setCertContent(String certContent) {
        this.certContent = certContent;
    }
}
