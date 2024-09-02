package com.lacunasoftware.pkisuite.api.model;

import java.util.List;

public class SignatureTokenRequest {
    private List<SignatureTokenPair> signatureTokenPairs;

    // Constructor
    public SignatureTokenRequest(List<SignatureTokenPair> signatureTokenPairs) {
        this.signatureTokenPairs = signatureTokenPairs;
    }

    // Getters and Setters
    public List<SignatureTokenPair> getSignatureTokenPairs() {
        return signatureTokenPairs;
    }

    public void setSignatureTokenPairs(List<SignatureTokenPair> signatureTokenPairs) {
        this.signatureTokenPairs = signatureTokenPairs;
    }
}