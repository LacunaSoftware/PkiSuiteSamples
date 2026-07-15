package com.lacunasoftware.pkisuite.api.model.signer;

public class SignerBatchStartResponse {

    // The Base64-encoded hash that must be signed with the user's private key (via Web PKI).
    public String toSignHash;
    // The digest algorithm that Web PKI must use to compute the signature.
    public String digestAlgorithm;
    // A token that identifies this signature process. It must be sent back on the "complete" step.
    public String token;

    public String getToSignHash() {
        return toSignHash;
    }
    public void setToSignHash(String toSignHash) {
        this.toSignHash = toSignHash;
    }

    public String getDigestAlgorithm() {
        return digestAlgorithm;
    }
    public void setDigestAlgorithm(String digestAlgorithm) {
        this.digestAlgorithm = digestAlgorithm;
    }

    public String getToken() {
        return token;
    }
    public void setToken(String token) {
        this.token = token;
    }
}
