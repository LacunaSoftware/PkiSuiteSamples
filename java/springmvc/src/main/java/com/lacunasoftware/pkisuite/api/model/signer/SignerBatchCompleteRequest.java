package com.lacunasoftware.pkisuite.api.model.signer;

public class SignerBatchCompleteRequest {

    // The document key of the public signature (the same used on the "start" step).
    public String id;
    // The Base64-encoded signature computed by Web PKI.
    public String signature;
    // The token returned by the "start" step.
    public String token;

    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }

    public String getSignature() {
        return signature;
    }
    public void setSignature(String signature) {
        this.signature = signature;
    }

    public String getToken() {
        return token;
    }
    public void setToken(String token) {
        this.token = token;
    }
}
